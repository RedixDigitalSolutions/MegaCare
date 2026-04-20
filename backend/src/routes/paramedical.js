const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");

const ParamedPatient = require("../models/ParamedPatient");
const ParamedAppointment = require("../models/ParamedAppointment");
const ParamedSupply = require("../models/ParamedSupply");
const ParamedCareSession = require("../models/ParamedCareSession");
const ParamedicalProduct = require("../models/ParamedicalProduct");
const ParamedicalOrder = require("../models/ParamedicalOrder");
const Vital = require("../models/Vital");
const User = require("../models/User");

function paraGuard(req, res, next) {
    if (!req.user || req.user.role !== "paramedical")
        return res.status(403).json({ message: "Accès refusé" });
    next();
}

const auth = [authMiddleware, paraGuard];

// ── KPIs ──────────────────────────────────────────────────────
router.get("/kpis", auth, async (req, res) => {
    const uid = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const [patients, appointments, sessions, products] = await Promise.all([
        ParamedPatient.find({ userId: uid }).lean(),
        ParamedAppointment.find({ userId: uid }).lean(),
        ParamedCareSession.find({ userId: uid }).lean(),
        ParamedicalProduct.find({ userId: uid }).lean(),
    ]);
    const todayApts = appointments.filter((a) => a.date === today && a.status !== "Annulé");
    const totalHours = sessions.length * 1.5;

    const MIN_STOCK = 10;
    const lowStockProducts = products
        .filter((p) => p.stockQty <= MIN_STOCK)
        .sort((a, b) => a.stockQty - b.stockQty)
        .slice(0, 6)
        .map((p) => ({ name: p.name, current: p.stockQty, minimum: MIN_STOCK }));

    // Best-selling: sort by reviews (proxy) then price
    const topSelling = products
        .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
        .slice(0, 5)
        .map((p, i) => ({ rank: i + 1, name: p.name, sold: p.reviews || 0, revenue: Math.round((p.reviews || 0) * p.price) }));

    // Recent appointments as pending orders
    const pendingApts = appointments
        .filter((a) => a.status === "En attente")
        .sort((a, b) => (b.date > a.date ? 1 : -1))
        .slice(0, 4)
        .map((a) => ({
            id: a._id,
            customer: a.patient,
            type: a.type,
            date: a.date,
            time: a.time,
            location: a.location,
            status: a.status,
        }));

    res.json({
        totalPatients: patients.filter((p) => p.status !== "Clôturé").length,
        consultationsToday: todayApts.length,
        weeklyHours: Math.round(totalHours),
        totalStock: products.reduce((s, p) => s + (p.stockQty || 0), 0),
        totalProducts: products.length,
        lowStockCount: products.filter((p) => p.stockQty <= MIN_STOCK).length,
        lowStockProducts,
        topSelling,
        pendingAppointments: pendingApts,
        pendingAppointmentsCount: appointments.filter((a) => a.status === "En attente").length,
        recentActivities: appointments
            .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
            .slice(0, 5)
            .map((a) => ({ text: `${a.type} — ${a.patient}`, time: a.date, status: a.status })),
    });
});

// ── Patients ──────────────────────────────────────────────────
router.get("/patients", auth, async (req, res) => {
    const items = await ParamedPatient.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/patients", auth, async (req, res) => {
    const { name, age, condition, status, nextAppointment, careType, phone } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Nom requis" });
    const doc = await ParamedPatient.create({
        _id: randomUUID(), userId: req.user.id,
        name, age: age || 0, condition: condition || "",
        status: status || "Actif",
        nextAppointment: nextAppointment || null,
        careType: careType || "", phone: phone || "",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.put("/patients/:id", auth, async (req, res) => {
    const doc = await ParamedPatient.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

// ── Appointments ──────────────────────────────────────────────
router.get("/appointments", auth, async (req, res) => {
    const items = await ParamedAppointment.find({ userId: req.user.id }).sort({ date: 1, time: 1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/appointments", auth, async (req, res) => {
    const { patient, type, date, time, location, status, notes } = req.body;
    if (!patient?.trim()) return res.status(400).json({ message: "Patient requis" });
    const doc = await ParamedAppointment.create({
        _id: randomUUID(), userId: req.user.id,
        patient, type: type || "Soins infirmiers",
        date: date || "", time: time || "09:00",
        location: location || "Domicile",
        status: status || "En attente", notes: notes || "",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.put("/appointments/:id", auth, async (req, res) => {
    const doc = await ParamedAppointment.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

// ── Supplies ──────────────────────────────────────────────────
router.get("/supplies", auth, async (req, res) => {
    const items = await ParamedSupply.find({ userId: req.user.id }).sort({ level: 1, name: 1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.put("/supplies/:id", auth, async (req, res) => {
    // Recompute level on update
    const update = { ...req.body };
    if (update.current !== undefined && update.max !== undefined) {
        const ratio = update.current / update.max;
        update.level = ratio <= 0.1 ? "critical" : ratio <= 0.3 ? "low" : "ok";
    } else if (update.current !== undefined) {
        const supply = await ParamedSupply.findOne({ _id: req.params.id, userId: req.user.id });
        if (supply) {
            const ratio = update.current / supply.max;
            update.level = ratio <= 0.1 ? "critical" : ratio <= 0.3 ? "low" : "ok";
        }
    }
    const doc = await ParamedSupply.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: update }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

router.post("/supplies/:id/order", auth, async (req, res) => {
    const doc = await ParamedSupply.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: { ordered: true } }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

// ── Vitals ──────────────────────────────────────────────────────
router.get("/vitals/:patientId", auth, async (req, res) => {
    const records = await Vital.find({
        userId: req.user.id,
        patientId: req.params.patientId,
        role: "paramedical",
    }).sort({ createdAt: -1 }).lean();
    res.json(records.map((r) => ({ ...r, id: r._id })));
});

router.post("/vitals", auth, async (req, res) => {
    const { patientId, patientName, sbp, dbp, hr, temp, spo2, glucose } = req.body;
    if (!patientId) return res.status(400).json({ message: "Patient requis" });
    const now = new Date();
    const doc = await Vital.create({
        _id: randomUUID(), userId: req.user.id,
        patientId, patientName: patientName || "",
        role: "paramedical",
        sbp: sbp ? Number(sbp) : null,
        dbp: dbp ? Number(dbp) : null,
        hr: hr ? Number(hr) : null,
        temp: temp ? Number(temp) : null,
        spo2: spo2 ? Number(spo2) : null,
        glucose: glucose ? Number(glucose) : null,
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

// ── Care Sessions ──────────────────────────────────────────────
router.get("/care-sessions", auth, async (req, res) => {
    const items = await ParamedCareSession.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/care-sessions", auth, async (req, res) => {
    const { patient, careType, notes, photos, signed } = req.body;
    if (!patient?.trim() || !careType?.trim())
        return res.status(400).json({ message: "Patient et type de soin requis" });
    const now = new Date();
    const doc = await ParamedCareSession.create({
        _id: randomUUID(), userId: req.user.id,
        patient, careType, notes: notes || "",
        photos: photos || 0, signed: signed || false,
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

// ── Notifications (derived from appointments) ──────────────────
router.get("/notifications", auth, async (req, res) => {
    const uid = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const appointments = await ParamedAppointment.find({ userId: uid }).sort({ date: 1 }).lean();

    const notifs = [];
    let idCounter = 1;

    appointments.forEach((a) => {
        if (a.status === "En attente" && (a.date === today || a.date === tomorrow)) {
            notifs.push({
                id: String(idCounter++),
                type: "schedule",
                title: a.date === today ? `Rendez-vous aujourd'hui — ${a.patient}` : `Rendez-vous demain — ${a.patient}`,
                body: `${a.type} à ${a.time} (${a.location})`,
                time: `${a.date} ${a.time}`,
                read: false,
            });
        }
        if (a.status === "Confirmé" && a.date === today) {
            notifs.push({
                id: String(idCounter++),
                type: "doctor",
                title: `Rendez-vous confirmé — ${a.patient}`,
                body: `${a.type} confirmé à ${a.time}`,
                time: `${a.date} ${a.time}`,
                read: false,
            });
        }
    });

    // Add urgent notification if any appointment has no notes and is today
    const urgentToday = appointments.filter((a) => a.date === today && a.status !== "Annulé" && !a.notes);
    if (urgentToday.length > 0) {
        notifs.unshift({
            id: String(idCounter++),
            type: "urgent",
            title: `${urgentToday.length} soins urgents aujourd'hui`,
            body: urgentToday.map((a) => a.patient).join(", "),
            time: today,
            read: false,
        });
    }

    res.json(notifs.slice(0, 10));
});

// ── Reports (derived from appointments + sessions) ─────────────
router.get("/reports", auth, async (req, res) => {
    const uid = req.user.id;
    const [appointments, sessions] = await Promise.all([
        ParamedAppointment.find({ userId: uid }).sort({ date: -1 }).lean(),
        ParamedCareSession.find({ userId: uid }).sort({ createdAt: -1 }).lean(),
    ]);

    // Group appointments by date for daily reports
    const dateMap = {};
    appointments.forEach((a) => {
        const d = a.date;
        if (!d) return;
        if (!dateMap[d]) dateMap[d] = [];
        dateMap[d].push(a);
    });

    const reports = Object.entries(dateMap)
        .sort((a, b) => b[0].localeCompare(a[0]))
        .slice(0, 6)
        .map(([date, apts], i) => ({
            id: String(i + 1),
            date,
            type: "daily",
            visits: apts.filter((a) => a.status !== "Annulé").length,
            hours: `${(apts.filter((a) => a.status !== "Annulé").length * 1.5).toFixed(1)}h`,
            patientsNote: apts.map((a) => a.patient).join(", "),
        }));

    const history = sessions.slice(0, 10).map((s, i) => ({
        id: String(i + 1),
        date: s.date,
        patient: s.patient,
        care: s.careType,
        duration: "1h00",
        practitioner: "Moi",
    }));

    res.json({ reports, history });
});

// ── Map visits (today's appointments with simulated positions) ──
router.get("/map-visits", auth, async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const apts = await ParamedAppointment.find({
        userId: req.user.id, date: today, location: "Domicile",
    }).sort({ time: 1 }).lean();

    // Assign simulated order & distance
    const visits = apts.map((a, i) => ({
        id: a._id,
        order: i + 1,
        name: a.patient,
        address: "Tunis, Tunisie",
        careType: a.type,
        time: a.time,
        distFromPrev: i === 0 ? 0 : 2 + Math.round(Math.random() * 3),
        status: a.status === "Confirmé" ? "current" : i < (apts.findIndex((x) => x.status === "Confirmé")) ? "done" : "pending",
    }));
    res.json(visits);
});

// ── Planning (appointments grouped by day) ────────────────────
router.get("/planning", auth, async (req, res) => {
    const apts = await ParamedAppointment.find({ userId: req.user.id }).sort({ date: 1, time: 1 }).lean();
    const grouped = {};
    apts.forEach((a) => {
        const d = a.date;
        if (!d) return;
        if (!grouped[d]) grouped[d] = [];
        grouped[d].push({
            id: a._id,
            order: grouped[d].length + 1,
            patientName: a.patient,
            time: a.time,
            address: a.location === "Domicile" ? "Domicile patient" : "Cabinet",
            type: a.type,
            status: a.status === "Confirmé" ? "in_progress" : a.status === "Annulé" ? "pending" : "pending",
            distance: 2,
            duration: 60,
        });
    });
    res.json(grouped);
});

// ── Products (paramedical stock) ─────────────────────────────
router.get("/products", auth, async (req, res) => {
    const items = await ParamedicalProduct.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/products", auth, async (req, res) => {
    const { catalogItemId, name, brand, category, price, stockQty, prescription, imageUrl, shortDesc, description, usage, features } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Nom du produit requis" });
    // Check for duplicate by catalogItemId (preferred) or by name
    const dupQuery = catalogItemId
        ? { userId: req.user.id, catalogItemId }
        : { userId: req.user.id, name: name.trim() };
    const exists = await ParamedicalProduct.findOne(dupQuery);
    if (exists) return res.status(409).json({ message: "Ce produit existe déjà dans votre stock" });
    const doc = await ParamedicalProduct.create({
        _id: randomUUID(), userId: req.user.id,
        catalogItemId: catalogItemId || "",
        name: name.trim(), brand: brand || "", category: category || "",
        price: Number(price) || 0, stockQty: Number(stockQty) || 0,
        inStock: (Number(stockQty) || 0) > 0,
        prescription: prescription || false,
        imageUrl: imageUrl || "", shortDesc: shortDesc || "",
        description: description || "", usage: usage || "",
        features: features || [],
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.put("/products/:id", auth, async (req, res) => {
    const update = { ...req.body };
    if (update.stockQty !== undefined) update.inStock = Number(update.stockQty) > 0;
    const doc = await ParamedicalProduct.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: update }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Produit introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

router.patch("/products/:id/stock", auth, async (req, res) => {
    const { stockQty } = req.body;
    const qty = Number(stockQty);
    if (isNaN(qty) || qty < 0) return res.status(400).json({ message: "Quantité invalide" });
    const doc = await ParamedicalProduct.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: { stockQty: qty, inStock: qty > 0 } }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Produit introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

router.delete("/products/:id", auth, async (req, res) => {
    const doc = await ParamedicalProduct.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!doc) return res.status(404).json({ message: "Produit introuvable" });
    res.json({ success: true });
});

// ── Settings ──────────────────────────────────────────────────
router.get("/settings", auth, async (req, res) => {
    const user = await User.findById(req.user.id).lean();
    res.json({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        specialization: user?.specialization || "",
        email: user?.email || "",
    });
});

router.patch("/settings", auth, async (req, res) => {
    const { firstName, lastName, phone, specialization } = req.body;
    const update = {};
    if (firstName !== undefined) update.firstName = firstName;
    if (lastName !== undefined) update.lastName = lastName;
    if (phone !== undefined) update.phone = phone;
    if (specialization !== undefined) update.specialization = specialization;
    await User.findByIdAndUpdate(req.user.id, { $set: update });
    res.json({ success: true });
});

// ── Clients (order-based) ─────────────────────────────────────
// GET /api/paramedical/clients — unique clients who placed orders with this paramedical
router.get("/clients", auth, async (req, res) => {
    const orders = await ParamedicalOrder.find({ paramedicalId: req.user.id }).lean();
    const clientMap = {};
    for (const o of orders) {
        if (!clientMap[o.userId]) {
            clientMap[o.userId] = { totalOrders: 0, totalSpent: 0, lastOrderDate: o.createdAt };
        }
        clientMap[o.userId].totalOrders += 1;
        clientMap[o.userId].totalSpent += o.total;
        if (new Date(o.createdAt) > new Date(clientMap[o.userId].lastOrderDate)) {
            clientMap[o.userId].lastOrderDate = o.createdAt;
        }
    }
    const userIds = Object.keys(clientMap);
    const users = await User.find({ _id: { $in: userIds } })
        .select("firstName lastName phone governorate delegation")
        .lean();
    const clients = users.map((u) => ({
        id: String(u._id),
        name: `${u.firstName} ${u.lastName}`,
        phone: u.phone || "",
        governorate: u.governorate || "",
        delegation: u.delegation || "",
        totalOrders: clientMap[String(u._id)].totalOrders,
        totalSpent: clientMap[String(u._id)].totalSpent,
        lastOrderDate: clientMap[String(u._id)].lastOrderDate,
    }));
    res.json(clients);
});

// GET /api/paramedical/clients/:clientId/orders — order history for a specific client
router.get("/clients/:clientId/orders", auth, async (req, res) => {
    const orders = await ParamedicalOrder.find({
        paramedicalId: req.user.id,
        userId: req.params.clientId,
    })
        .sort({ createdAt: -1 })
        .lean();
    res.json(orders.map((o) => ({ ...o, id: o._id })));
});

// ── Orders ────────────────────────────────────────────────────
// GET /api/paramedical/orders — list orders assigned to this paramedical
router.get("/orders", auth, async (req, res) => {
    const orders = await ParamedicalOrder.find({ paramedicalId: req.user.id })
        .sort({ createdAt: -1 })
        .lean();

    // Enrich with patient names
    const userIds = [...new Set(orders.map((o) => o.userId))];
    const users = await User.find({ _id: { $in: userIds } }).select("firstName lastName phone governorate delegation").lean();
    const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));

    const enriched = orders.map((o) => {
        const patient = userMap[o.userId];
        return {
            ...o,
            id: o._id,
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Patient",
            patientPhone: patient?.phone || "",
            patientGovernorate: patient?.governorate || "",
            patientDelegation: patient?.delegation || "",
        };
    });

    res.json(enriched);
});

// PATCH /api/paramedical/orders/:id — update order status
router.patch("/orders/:id", auth, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["pending", "confirmed", "ready", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Statut invalide" });
    }
    const order = await ParamedicalOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Commande non trouvée" });
    if (order.paramedicalId !== req.user.id) {
        return res.status(403).json({ message: "Accès refusé" });
    }
    order.status = status;
    await order.save();
    res.json({ ...order.toObject(), id: order._id });
});

module.exports = router;
