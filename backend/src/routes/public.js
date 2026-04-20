const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const ParamedicalProduct = require("../models/ParamedicalProduct");
const MedicalEstablishment = require("../models/MedicalEstablishment");
const PublicLabCenter = require("../models/PublicLabCenter");
const ParamedicalOrder = require("../models/ParamedicalOrder");
const Product = require("../models/Product");
const User = require("../models/User");

// GET /api/public/paramedical-products
router.get("/paramedical-products", async (req, res) => {
    let filter = {};
    if (req.query.search) {
        const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { name: { $regex: escaped, $options: "i" } },
            { brand: { $regex: escaped, $options: "i" } },
            { shortDesc: { $regex: escaped, $options: "i" } },
        ];
    }
    if (req.query.category && req.query.category !== "Tous") {
        filter.category = { $regex: String(req.query.category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
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
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

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
        return res.json({ data: [], total: 0, page, limit, pages: 0 });
    }
    if (req.query.search) {
        const regex = { $regex: escapeRegex(req.query.search), $options: "i" };
        filter.$or = [{ name: regex }, { dci: regex }, { brand: regex }];
    }
    if (req.query.category) {
        filter.category = { $regex: escapeRegex(req.query.category), $options: "i" };
    }

    const [products, total] = await Promise.all([
        Product.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
        Product.countDocuments(filter),
    ]);

    res.json({
        data: products.map((p) => {
            const ph = p.pharmacyId ? pharmacyMap[p.pharmacyId] : null;
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
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    });
});

// POST /api/public/paramedical-orders — create a paramedical order (requires auth)
// For each ordered item, finds ALL paramedicals that stock the same catalog item (in stock),
// picks the closest one (same delegation > same governorate > random tie-break),
// then groups by chosen provider and creates one order per provider.
const authMiddleware = require("../middleware/auth");

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
    }

    if (createdOrders.length === 1) {
        return res.status(201).json(createdOrders[0]);
    }
    res.status(201).json({ orders: createdOrders, count: createdOrders.length });
});

module.exports = router;
