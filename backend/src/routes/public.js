const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const path = require("path");
const multer = require("multer");
const ParamedicalProduct = require("../models/ParamedicalProduct");
const MedicalEstablishment = require("../models/MedicalEstablishment");
const PublicLabCenter = require("../models/PublicLabCenter");
const ParamedicalOrder = require("../models/ParamedicalOrder");
const ParamedicalServiceProvider = require("../models/ParamedicalServiceProvider");
const Product = require("../models/Product");
const User = require("../models/User");
const Newsletter = require("../models/Newsletter");
const Testimonial = require("../models/Testimonial");
const FacilityAvailability = require("../models/FacilityAvailability");
const FacilityAppointment = require("../models/FacilityAppointment");
const authMiddleware = require("../middleware/auth");

// Multer for patient document uploads (lab appointments — images only)
const ALLOWED_IMAGE_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

const prescriptionStorage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/prescriptions"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `doc-${randomUUID()}${ext}`);
    },
});
const prescriptionUpload = multer({
    storage: prescriptionStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!ALLOWED_IMAGE_MIMES.has(file.mimetype) || !ALLOWED_IMAGE_EXTS.has(ext)) {
            return cb(new Error("Seules les images JPG, PNG et WebP sont acceptées (max 5 Mo)"));
        }
        cb(null, true);
    },
});

// ── Shared slot-generation helper ──────────────────────────────────────────
/**
 * Generates all time slots from start to end with given duration (minutes).
 * Returns array of "HH:MM" strings.
 */
function generateTimeSlots(start, end, durationMins) {
    const slots = [];
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    let cur = sh * 60 + sm;
    const endMins = eh * 60 + em;
    while (cur + durationMins <= endMins) {
        const hh = String(Math.floor(cur / 60)).padStart(2, "0");
        const mm = String(cur % 60).padStart(2, "0");
        slots.push(`${hh}:${mm}`);
        cur += durationMins;
    }
    return slots;
}

/**
 * Returns available (not booked, not blocked) slots for a facility on `date`.
 * @param {string} ownerId  - userId of the facility owner
 * @param {string} date     - "YYYY-MM-DD"
 */

// Default schedule used when no FacilityAvailability is configured for a facility.
const DEFAULT_WORKING_HOURS = {
    1: { start: "08:00", end: "18:00" }, // Monday
    2: { start: "08:00", end: "18:00" }, // Tuesday
    3: { start: "08:00", end: "18:00" }, // Wednesday
    4: { start: "08:00", end: "18:00" }, // Thursday
    5: { start: "08:00", end: "18:00" }, // Friday
    6: { start: "08:00", end: "13:00" }, // Saturday
    // Sunday (0) is closed by default
};

/**
 * Returns { available, booked } slot arrays for a facility on `date`.
 * Falls back to DEFAULT_WORKING_HOURS when no FacilityAvailability is configured.
 */
async function getAllSlotInfo(ownerId, date) {
    const av = await FacilityAvailability.findOne({ ownerId }).lean();
    const dayOfWeek = new Date(date + "T12:00:00").getDay(); // 0=Sun

    let dayConfig = null;
    let slotDuration = 30;

    // Entire-day block takes priority (admin blocked the whole day)
    if (av?.blockedDays?.includes(date)) return { available: [], booked: [], blocked: [] };

    // Try to get day config from stored working hours
    if (av && Array.isArray(av.workingDays) && av.workingDays.length > 0) {
        dayConfig = av.workingDays.find((d) => d.day === dayOfWeek) ?? null;
        slotDuration = av.slotDuration || 30;
    }

    // Fallback to DEFAULT_WORKING_HOURS whenever dayConfig is still missing.
    // This covers: no FacilityAvailability document (new/unconfigured facility),
    // empty workingDays array (doc exists but schedule not set up yet),
    // or a partial config that simply doesn't list this particular day.
    if (!dayConfig) {
        dayConfig = DEFAULT_WORKING_HOURS[dayOfWeek] ?? null;
    }

    if (!dayConfig) return { available: [], booked: [], blocked: [] };

    // Generate all raw slots for the day
    let allSlots = generateTimeSlots(dayConfig.start, dayConfig.end, slotDuration);

    // Remove individually blocked slots (only when custom config exists)
    // Track them separately so they can be shown as "blocked" (grey) in the patient UI.
    let adminBlockedSlots = [];
    if (av) {
        const blockedTimesForDay = (av.blockedSlots || [])
            .filter((s) => s.date === date)
            .map((s) => s.time);
        const blockedSet = new Set(blockedTimesForDay);
        adminBlockedSlots = allSlots.filter((s) => blockedSet.has(s));
        allSlots = allSlots.filter((s) => !blockedSet.has(s));
    }

    // Separate already-booked slots (active statuses only)
    const bookedAppts = await FacilityAppointment.find({
        ownerId,
        date,
        status: { $in: ["pending", "confirmed"] },
    })
        .select("time")
        .lean();
    const bookedSet = new Set(bookedAppts.map((a) => a.time));

    const available = allSlots.filter((s) => !bookedSet.has(s));
    const booked = allSlots.filter((s) => bookedSet.has(s));
    const blocked = adminBlockedSlots;

    return { available, booked, blocked };
}

/**
 * Returns available (not booked, not blocked) slots for a facility on `date`.
 */
async function getAvailableSlots(ownerId, date) {
    const { available } = await getAllSlotInfo(ownerId, date);
    return available;
}


// POST /api/public/newsletter — subscribe
router.post("/newsletter", async (req, res) => {
    const email = (req.body.email || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: "Adresse email invalide" });
    }
    const existing = await Newsletter.findOne({ email });
    if (existing) {
        return res.status(409).json({ message: "Cette adresse est d\u00e9j\u00e0 inscrite" });
    }
    await Newsletter.create({ email });
    res.status(201).json({ message: "Inscription r\u00e9ussie" });
});

// GET /api/public/parapharmacy-products
router.get("/parapharmacy-products", async (req, res) => {
    const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let filter = { inStock: true };
    if (req.query.search) {
        const esc = escapeRegex(req.query.search);
        filter.$or = [
            { name: { $regex: esc, $options: "i" } },
            { brand: { $regex: esc, $options: "i" } },
            { shortDesc: { $regex: esc, $options: "i" } },
        ];
    }
    if (req.query.category && req.query.category !== "Tous") {
        filter.category = { $regex: escapeRegex(req.query.category), $options: "i" };
    }
    const products = await ParamedicalProduct.find(filter).lean();
    res.json(products.map((p) => ({ ...p, id: p._id })));
});

// GET /api/public/paramedical-products (legacy alias)
router.get("/paramedical-products", async (req, res) => {
    const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    let filter = { inStock: true };
    if (req.query.search) {
        const esc = escapeRegex(req.query.search);
        filter.$or = [
            { name: { $regex: esc, $options: "i" } },
            { brand: { $regex: esc, $options: "i" } },
            { shortDesc: { $regex: esc, $options: "i" } },
        ];
    }
    if (req.query.category && req.query.category !== "Tous") {
        filter.category = { $regex: escapeRegex(req.query.category), $options: "i" };
    }
    const products = await ParamedicalProduct.find(filter).lean();
    res.json(products.map((p) => ({ ...p, id: p._id })));
});

// GET /api/public/establishments
router.get("/establishments", async (req, res) => {
    let filter = {};
    if (req.query.search) {
        const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { name: { $regex: escaped, $options: "i" } },
            { city: { $regex: escaped, $options: "i" } },
        ];
    }
    if (req.query.governorate) {
        filter.governorate = { $regex: String(req.query.governorate).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }
    if (req.query.type) {
        filter.type = req.query.type;
    }
    const items = await MedicalEstablishment.find(filter).lean();
    res.json(items.map((e) => ({ ...e, id: e._id })));
});

// GET /api/public/labs
router.get("/labs", async (req, res) => {
    let filter = {};
    if (req.query.search) {
        const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { name: { $regex: escaped, $options: "i" } },
            { city: { $regex: escaped, $options: "i" } },
        ];
    }
    if (req.query.governorate) {
        filter.governorate = { $regex: String(req.query.governorate).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }
    if (req.query.type) {
        filter.type = req.query.type;
    }
    const items = await PublicLabCenter.find(filter).lean();
    res.json(items.map((l) => ({ ...l, id: l._id })));
});

// GET /api/public/labs/:id
router.get("/labs/:id", async (req, res) => {
    const item = await PublicLabCenter.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Laboratoire non trouvé" });
    res.json({ ...item, id: item._id });
});

// GET /api/public/establishments/:id
router.get("/establishments/:id", async (req, res) => {
    const item = await MedicalEstablishment.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Établissement non trouvé" });
    res.json({ ...item, id: item._id });
});

// GET /api/public/paramedical-products/:id
router.get("/paramedical-products/:id", async (req, res) => {
    const item = await ParamedicalProduct.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ ...item, id: item._id });
});

// GET /api/public/pharmacy-products  — public listing with governorate filter
router.get("/pharmacy-products", async (req, res) => {
    const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Find pharmacy IDs matching the governorate
    let pharmacyFilter = { role: "pharmacy", status: "approved" };
    if (req.query.governorate) {
        pharmacyFilter.governorate = { $regex: escapeRegex(req.query.governorate), $options: "i" };
    }
    if (req.query.delegation) {
        pharmacyFilter.delegation = { $regex: escapeRegex(req.query.delegation), $options: "i" };
    }
    const pharmacies = await User.find(pharmacyFilter).select("_id companyName address governorate delegation phone openingHours isOnDuty coordinates").lean();
    const pharmacyIds = pharmacies.map((p) => String(p._id));
    const pharmacyMap = Object.fromEntries(pharmacies.map((p) => [String(p._id), p]));

    // Build product filter scoped to those pharmacies
    let filter = {};
    if (pharmacyIds.length > 0) {
        filter.pharmacyId = { $in: pharmacyIds };
    } else if (req.query.governorate) {
        // No pharmacies in that governorate → return empty
        return res.json({ data: [] });
    }
    if (req.query.search) {
        const regex = { $regex: escapeRegex(req.query.search), $options: "i" };
        filter.$or = [{ name: regex }, { dci: regex }, { brand: regex }];
    }
    if (req.query.category) {
        filter.category = { $regex: escapeRegex(req.query.category), $options: "i" };
    }

    // Return one product per unique medicine (lowest price), enriched with pharmacy info
    const products = await Product.aggregate([
        { $match: filter },
        { $sort: { name: 1, price: 1 } },
        { $group: { _id: "$medicineId", doc: { $first: "$$ROOT" } } },
        { $replaceRoot: { newRoot: "$doc" } },
        { $sort: { name: 1 } },
    ]);

    res.json({
        data: products.map((p) => {
            const ph = p.pharmacyId ? pharmacyMap[String(p.pharmacyId)] : null;
            return {
                ...p,
                id: p._id,
                pharmacy: ph ? ph.companyName : (p.pharmacy || ""),
                pharmacyAddress: ph ? ph.address : "",
                pharmacyPhone: ph ? ph.phone : "",
                pharmacyGovernorate: ph ? ph.governorate : "",
                pharmacyDelegation: ph ? ph.delegation : "",
                pharmacyOpeningHours: ph ? ph.openingHours : "",
                pharmacyIsOnDuty: ph ? ph.isOnDuty : false,
            };
        }),
    });
});

// POST /api/public/paramedical-orders — create a paramedical order (requires auth)
// For each ordered item, finds ALL paramedicals that stock the same catalog item (in stock),
// picks the closest one (same delegation > same governorate > random tie-break),
// then groups by chosen provider and creates one order per provider.

// GET /api/public/paramedical-providers — list paramedical providers (with optional governorate/delegation filter)
router.get("/paramedical-providers", async (req, res) => {
    const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = { role: "paramedical", status: "approved" };
    if (req.query.governorate) filter.governorate = { $regex: escapeRegex(req.query.governorate), $options: "i" };
    if (req.query.delegation) filter.delegation = { $regex: escapeRegex(req.query.delegation), $options: "i" };
    const providers = await User.find(filter).select("-password").sort({ companyName: 1 }).lean();
    res.json(providers.map((p) => ({
        id: p._id,
        name: p.companyName || `${p.firstName} ${p.lastName}`,
        address: p.address || "",
        governorate: p.governorate || "",
        delegation: p.delegation || "",
        phone: p.phone || "",
        openingHours: p.openingHours || "",
    })));
});

// GET /api/public/paramedical-services — list paramedical service providers for the public directory
router.get("/paramedical-services", async (req, res) => {
    const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = {};
    if (req.query.governorate) filter.governorate = { $regex: escapeRegex(req.query.governorate), $options: "i" };
    if (req.query.delegation) filter.delegation = { $regex: escapeRegex(req.query.delegation), $options: "i" };
    if (req.query.specialization && req.query.specialization !== "Tous") filter.specialization = { $regex: escapeRegex(req.query.specialization), $options: "i" };
    if (req.query.search) {
        const s = escapeRegex(req.query.search);
        filter.$or = [
            { name: { $regex: s, $options: "i" } },
            { specialization: { $regex: s, $options: "i" } },
        ];
    }
    const providers = await ParamedicalServiceProvider.find(filter).sort({ name: 1 }).lean();
    res.json(providers.map((p) => ({
        id: p._id,
        name: p.name,
        specialization: p.specialization || "",
        avatar: p.avatar || "",
        governorate: p.governorate || "",
        delegation: p.delegation || "",
        address: p.address || "",
        phone: p.phone || "",
        email: p.email || "",
        openingHours: p.openingHours || "",
        description: p.description || "",
    })));
});

router.post("/paramedical-orders", authMiddleware, async (req, res) => {
    const { items, deliveryMethod, deliveryAddress, deliveryGovernorate, deliveryDelegation, deliveryPhone, pickupProviderId } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "Au moins un article requis" });
    }
    if (!["pickup", "delivery"].includes(deliveryMethod)) {
        return res.status(400).json({ message: "Méthode de livraison invalide" });
    }
    if (deliveryMethod === "delivery" && !deliveryAddress) {
        return res.status(400).json({ message: "Adresse de livraison requise" });
    }

    // Look up requested products
    const productIds = items.map((i) => i.productId);
    const requestedProducts = await ParamedicalProduct.find({ _id: { $in: productIds } }).lean();
    const requestedMap = Object.fromEntries(requestedProducts.map((p) => [String(p._id), p]));

    // Gather the catalog item IDs from the requested products
    const catalogIds = [...new Set(requestedProducts.map((p) => p.catalogItemId).filter(Boolean))];

    // Find ALL in-stock products sharing those catalog items (from any provider)
    const allCandidates = catalogIds.length > 0
        ? await ParamedicalProduct.find({ catalogItemId: { $in: catalogIds }, inStock: true }).lean()
        : requestedProducts;

    // Group candidates by catalogItemId
    const byCatalog = {};
    for (const p of allCandidates) {
        const cid = p.catalogItemId || String(p._id);
        if (!byCatalog[cid]) byCatalog[cid] = [];
        byCatalog[cid].push(p);
    }

    // Get patient location
    const patient = await User.findById(req.user.id).select("governorate delegation").lean();
    const patientGov = (patient?.governorate || deliveryGovernorate || "").toLowerCase();
    const patientDel = (patient?.delegation || deliveryDelegation || "").toLowerCase();

    // Get all paramedical users' locations
    const allOwnerIds = [...new Set(allCandidates.map((p) => p.userId).filter(Boolean))];
    const paramedUsers = await User.find({ _id: { $in: allOwnerIds } })
        .select("_id governorate delegation").lean();
    const paramedLocMap = Object.fromEntries(paramedUsers.map((u) => [String(u._id), u]));

    // Helper: proximity score (2 = same delegation, 1 = same governorate, 0 = other)
    function score(paramedId) {
        const u = paramedLocMap[paramedId];
        if (!u) return 0;
        const gov = (u.governorate || "").toLowerCase();
        const del = (u.delegation || "").toLowerCase();
        if (patientGov && gov === patientGov) {
            return (patientDel && del === patientDel) ? 2 : 1;
        }
        return 0;
    }

    // For each ordered item, find the best provider
    const resolvedItems = []; // { paramedicalId, productId, name, price, quantity }

    // If user chose a specific provider for pickup, force-assign all items
    if (pickupProviderId && deliveryMethod === "pickup") {
        for (const item of items) {
            const reqProd = requestedMap[item.productId];
            if (!reqProd) continue;
            resolvedItems.push({
                paramedicalId: pickupProviderId,
                productId: String(reqProd._id),
                name: reqProd.name,
                price: reqProd.price,
                quantity: Math.max(1, parseInt(item.quantity) || 1),
            });
        }
    } else {
        for (const item of items) {
            const reqProd = requestedMap[item.productId];
            if (!reqProd) continue;
            const cid = reqProd.catalogItemId || String(reqProd._id);
            const candidates = byCatalog[cid] || [reqProd];

            // Score each candidate product's owner
            const scored = candidates.map((c) => ({
                product: c,
                owner: c.userId,
                score: score(c.userId),
            }));

            // Sort: highest score first, random tie-break
            scored.sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return Math.random() - 0.5;
            });

            const best = scored[0];
            const qty = Math.max(1, parseInt(item.quantity) || 1);
            resolvedItems.push({
                paramedicalId: best.owner,
                productId: String(best.product._id),
                name: best.product.name,
                price: best.product.price,
                quantity: qty,
            });
        }
    } // end else (no pickupProviderId)

    if (resolvedItems.length === 0) {
        return res.status(400).json({ message: "Aucun fournisseur disponible pour ces produits" });
    }

    // Group resolved items by paramedical provider
    const byProvider = {};
    for (const ri of resolvedItems) {
        if (!byProvider[ri.paramedicalId]) byProvider[ri.paramedicalId] = [];
        byProvider[ri.paramedicalId].push({
            productId: ri.productId,
            name: ri.name,
            price: ri.price,
            quantity: ri.quantity,
        });
    }

    const sharedFields = {
        deliveryMethod,
        deliveryAddress: deliveryMethod === "delivery" ? String(deliveryAddress || "") : "",
        deliveryGovernorate: deliveryMethod === "delivery" ? String(deliveryGovernorate || "") : "",
        deliveryDelegation: deliveryMethod === "delivery" ? String(deliveryDelegation || "") : "",
        deliveryPhone: String(deliveryPhone || ""),
    };

    // Validate stock availability before creating any order
    const stockCheckErrors = [];
    for (const ri of resolvedItems) {
        const prod = await ParamedicalProduct.findById(ri.productId).select("stockQty inStock name").lean();
        if (!prod || !prod.inStock || (prod.stockQty ?? 0) < ri.quantity) {
            stockCheckErrors.push(`"${ri.name}" n'est plus disponible en quantité suffisante`);
        }
    }
    if (stockCheckErrors.length > 0) {
        return res.status(409).json({ message: stockCheckErrors[0] });
    }

    const createdOrders = [];
    for (const [paramedId, orderItems] of Object.entries(byProvider)) {
        const total = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
        const order = await ParamedicalOrder.create({
            _id: randomUUID(),
            userId: req.user.id,
            paramedicalId: paramedId,
            items: orderItems,
            total: Math.round(total * 100) / 100,
            ...sharedFields,
        });
        createdOrders.push({ ...order.toObject(), id: order._id });

        // Reserve stock: decrement stockQty for each item in this order
        for (const item of orderItems) {
            await ParamedicalProduct.findByIdAndUpdate(item.productId, [
                {
                    $set: {
                        stockQty: { $max: [{ $subtract: ["$stockQty", item.quantity] }, 0] },
                        inStock: { $gt: [{ $max: [{ $subtract: ["$stockQty", item.quantity] }, 0] }, 0] },
                    },
                },
            ]);
        }
    }

    if (createdOrders.length === 1) {
        return res.status(201).json(createdOrders[0]);
    }
    res.status(201).json({ orders: createdOrders, count: createdOrders.length });
});

// GET /api/public/my-paramedical-orders — patient's own parapharmacy orders
router.get("/my-paramedical-orders", authMiddleware, async (req, res) => {
    const orders = await ParamedicalOrder.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .lean();

    // Enrich with provider name
    const providerIds = [...new Set(orders.map((o) => o.paramedicalId).filter(Boolean))];
    const providers = await User.find({ _id: { $in: providerIds } })
        .select("_id companyName firstName lastName")
        .lean();
    const providerMap = Object.fromEntries(
        providers.map((p) => [String(p._id), p.companyName || `${p.firstName} ${p.lastName}`])
    );

    res.json(
        orders.map((o) => ({
            ...o,
            id: o._id,
            providerName: providerMap[o.paramedicalId] || "Parapharmacie",
        }))
    );
});

// GET /api/public/testimonials — list visible testimonials for the homepage
router.get("/testimonials", async (req, res) => {
    const testimonials = await Testimonial.find({ visible: true })
        .sort({ order: 1, createdAt: -1 })
        .limit(20)
        .lean();
    res.json(testimonials.map((t) => ({ ...t, id: t._id })));
});

// ── Establishment slots & booking ──────────────────────────────────────────

// GET /api/public/establishments/:id/slots?date=YYYY-MM-DD
router.get("/establishments/:id/slots", async (req, res) => {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
        return res.status(400).json({ message: "date requis (YYYY-MM-DD)" });

    const estab = await MedicalEstablishment.findById(req.params.id).lean();
    if (!estab) return res.status(404).json({ message: "Établissement introuvable" });

    // Find owner
    const owner = await User.findOne({ establishmentId: req.params.id }).lean();
    if (!owner) return res.json({ available: [], booked: [], blocked: [], slots: [] });

    const { available, booked, blocked } = await getAllSlotInfo(owner._id.toString(), date);
    // Include legacy `slots` field for backward compatibility
    res.json({ available, booked, blocked, slots: available });
});

// POST /api/public/establishments/:id/book  (auth required)
router.post("/establishments/:id/book", authMiddleware, async (req, res) => {
    const { service, date, time, notes } = req.body;
    if (!date || !time) return res.status(400).json({ message: "date et time requis" });

    const estab = await MedicalEstablishment.findById(req.params.id).lean();
    if (!estab) return res.status(404).json({ message: "Établissement introuvable" });

    const owner = await User.findOne({ establishmentId: req.params.id }).lean();
    if (!owner) return res.status(400).json({ message: "Établissement sans gestionnaire" });

    const ownerId = owner._id.toString();

    // Validate slot is still available (not booked and not admin-blocked)
    const { available } = await getAllSlotInfo(ownerId, date);
    if (!available.includes(time))
        return res.status(409).json({ message: "Ce créneau n'est plus disponible" });

    const patient = await User.findById(req.user.id).lean();
    const appt = await FacilityAppointment.create({
        ownerId,
        facilityId: req.params.id,
        facilityType: "med_service",
        patientId: req.user.id,
        patientName: patient
            ? [patient.firstName, patient.lastName].filter(Boolean).join(" ") || patient.name || ""
            : "",
        patientPhone: patient?.phone || "",
        patientEmail: patient?.email || "",
        service: service || "",
        date,
        time,
        status: "pending",
        notes: notes || "",
    });
    res.status(201).json({ ...appt.toObject(), id: appt._id });
});

// ── Lab slots & booking ────────────────────────────────────────────────────

// GET /api/public/labs/:id/slots?date=YYYY-MM-DD
router.get("/labs/:id/slots", async (req, res) => {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date))
        return res.status(400).json({ message: "date requis (YYYY-MM-DD)" });

    const lab = await PublicLabCenter.findById(req.params.id).lean();
    if (!lab) return res.status(404).json({ message: "Laboratoire introuvable" });

    const owner = await User.findOne({ labCenterId: req.params.id }).lean();
    if (!owner) return res.json({ available: [], booked: [], blocked: [], slots: [] });

    const { available, booked, blocked } = await getAllSlotInfo(owner._id.toString(), date);
    res.json({ available, booked, blocked, slots: available });
});

// POST /api/public/labs/:id/book  (auth required, optional prescription file)
router.post(
    "/labs/:id/book",
    authMiddleware,
    (req, res, next) => {
        prescriptionUpload.single("document")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === "LIMIT_FILE_SIZE")
                    return res.status(400).json({ message: "Le fichier est trop volumineux (max 5 Mo)" });
                return res.status(400).json({ message: err.message });
            }
            if (err) return res.status(400).json({ message: err.message });
            next();
        });
    },
    async (req, res) => {
        const { examType, date, time, notes } = req.body;
        if (!date || !time)
            return res.status(400).json({ message: "date et time requis" });

        const lab = await PublicLabCenter.findById(req.params.id).lean();
        if (!lab) return res.status(404).json({ message: "Laboratoire introuvable" });

        const owner = await User.findOne({ labCenterId: req.params.id }).lean();
        if (!owner) return res.status(400).json({ message: "Laboratoire sans gestionnaire" });

        const ownerId = owner._id.toString();

        const { available } = await getAllSlotInfo(ownerId, date);
        if (!available.includes(time))
            return res.status(409).json({ message: "Ce créneau n'est plus disponible" });

        const patient = await User.findById(req.user.id).lean();
        let prescriptionUrl = "";
        let prescriptionMime = "";
        if (req.file) {
            prescriptionUrl = `/uploads/prescriptions/${req.file.filename}`;
            prescriptionMime = req.file.mimetype;
        }

        const appt = await FacilityAppointment.create({
            ownerId,
            facilityId: req.params.id,
            facilityType: "lab",
            patientId: req.user.id,
            patientName: patient
                ? [patient.firstName, patient.lastName].filter(Boolean).join(" ") || patient.name || ""
                : "",
            patientPhone: patient?.phone || "",
            patientEmail: patient?.email || "",
            service: examType || "",
            date,
            time,
            status: "pending",
            notes: notes || "",
            prescriptionUrl,
            prescriptionMime,
        });
        res.status(201).json({ ...appt.toObject(), id: appt._id });
    }
);

module.exports = router;
