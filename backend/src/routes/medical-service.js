const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");

const MedServicePatient = require("../models/MedServicePatient");
const MedServiceEquipment = require("../models/MedServiceEquipment");
const MedServiceTeamMember = require("../models/MedServiceTeamMember");
const MedServiceVisit = require("../models/MedServiceVisit");
const MedServiceInvoice = require("../models/MedServiceInvoice");
const MedServicePrescription = require("../models/MedServicePrescription");
const MedServiceSettings = require("../models/MedServiceSettings");
const Vital = require("../models/Vital");

function medGuard(req, res, next) {
    if (!req.user || req.user.role !== "medical_service")
        return res.status(403).json({ message: "Accès refusé" });
    next();
}

const auth = [authMiddleware, medGuard];

function map(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    return { ...obj, id: obj._id };
}

// ── KPIs ──────────────────────────────────────────────────────
router.get("/kpis", auth, async (req, res) => {
    const uid = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    const [patients, visits, team, invoices] = await Promise.all([
        MedServicePatient.find({ userId: uid }).lean(),
        MedServiceVisit.find({ userId: uid }).lean(),
        MedServiceTeamMember.find({ userId: uid }).lean(),
        MedServiceInvoice.find({ userId: uid }).lean(),
    ]);
    const todayVisits = visits.filter((v) => v.date === today && v.status !== "Annulé");
    const revenue = invoices
        .filter((i) => i.status === "Payée")
        .reduce((s, i) => s + (i.amount || 0), 0);
    res.json({
        totalPatients: patients.filter((p) => p.status === "En cours").length,
        visitsToday: todayVisits.length,
        teamCount: team.filter((m) => m.status === "Actif").length,
        revenue,
        recentActivities: visits
            .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
            .slice(0, 5)
            .map((v) => ({
                text: `Visite planifiée — ${v.patient} à ${v.time}`,
                time: v.date,
                status: v.status,
            })),
    });
});

// ── Patients ──────────────────────────────────────────────────
router.get("/patients", auth, async (req, res) => {
    const items = await MedServicePatient.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/patients", auth, async (req, res) => {
    const { name, age, condition, status, startDate, nurse, phone } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Nom requis" });
    const doc = await MedServicePatient.create({
        _id: randomUUID(),
        userId: req.user.id,
        name, age: age || 0, condition: condition || "",
        status: status || "En cours",
        startDate: startDate || new Date().toISOString().slice(0, 10),
        nurse: nurse || "", phone: phone || "",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.put("/patients/:id", auth, async (req, res) => {
    const doc = await MedServicePatient.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body },
        { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

router.delete("/patients/:id", auth, async (req, res) => {
    await MedServicePatient.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
});

// ── Equipment ──────────────────────────────────────────────────
router.get("/equipment", auth, async (req, res) => {
    const items = await MedServiceEquipment.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/equipment", auth, async (req, res) => {
    const { name, type, serial, status, patient, maintenanceDate, location } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Nom requis" });
    const doc = await MedServiceEquipment.create({
        _id: randomUUID(), userId: req.user.id,
        name, type: type || "", serial: serial || "",
        status: status || "Disponible", patient: patient || "",
        maintenanceDate: maintenanceDate || "", location: location || "",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.put("/equipment/:id", auth, async (req, res) => {
    const doc = await MedServiceEquipment.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

router.delete("/equipment/:id", auth, async (req, res) => {
    await MedServiceEquipment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
});

// ── Team ──────────────────────────────────────────────────────
router.get("/team", auth, async (req, res) => {
    const items = await MedServiceTeamMember.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/team", auth, async (req, res) => {
    const { name, role, status, patients, phone, email, specialty } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: "Nom requis" });
    const doc = await MedServiceTeamMember.create({
        _id: randomUUID(), userId: req.user.id,
        name, role: role || "Infirmier", status: status || "Actif",
        patients: patients || 0, phone: phone || "",
        email: email || "", specialty: specialty || "",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.put("/team/:id", auth, async (req, res) => {
    const doc = await MedServiceTeamMember.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

router.delete("/team/:id", auth, async (req, res) => {
    await MedServiceTeamMember.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
});

// ── Schedule (présentiel visits) ──────────────────────────────
router.get("/schedule", auth, async (req, res) => {
    const items = await MedServiceVisit.find({ userId: req.user.id, channel: "présentiel" })
        .sort({ date: 1, time: 1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/schedule", auth, async (req, res) => {
    const { patient, staff, date, time, duration, status, notes } = req.body;
    if (!patient?.trim()) return res.status(400).json({ message: "Patient requis" });
    const doc = await MedServiceVisit.create({
        _id: randomUUID(), userId: req.user.id,
        patient, staff: staff || "", date: date || "",
        time: time || "09:00", duration: duration || "1h",
        status: status || "Planifié", channel: "présentiel",
        notes: notes || "",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.put("/schedule/:id", auth, async (req, res) => {
    const doc = await MedServiceVisit.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

// ── Billing: Invoices ──────────────────────────────────────────
router.get("/billing/invoices", auth, async (req, res) => {
    const items = await MedServiceInvoice.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/billing/invoices", auth, async (req, res) => {
    const { patient, amount, date, dueDate, services, status } = req.body;
    if (!patient?.trim()) return res.status(400).json({ message: "Patient requis" });
    const count = await MedServiceInvoice.countDocuments({ userId: req.user.id });
    const ref = `FACT-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
    const doc = await MedServiceInvoice.create({
        _id: randomUUID(), userId: req.user.id,
        ref, patient, amount: Number(amount) || 0,
        date: date || new Date().toISOString().slice(0, 10),
        dueDate: dueDate || "", services: services || "",
        status: status || "En attente",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.delete("/billing/invoices/:id", auth, async (req, res) => {
    await MedServiceInvoice.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
});

// ── Billing: Payments (derived from paid invoices) ─────────────
router.get("/billing/payments", auth, async (req, res) => {
    const paid = await MedServiceInvoice.find({ userId: req.user.id, status: "Payée" })
        .sort({ paymentDate: -1 }).lean();
    res.json(
        paid.map((i) => ({
            id: i._id,
            ref: `PAY-${i.ref}`,
            patient: i.patient,
            amount: i.amount,
            date: i.paymentDate || i.date,
            method: i.paymentMethod || "Virement",
            invoice: i.ref,
        }))
    );
});

// ── Prescriptions ──────────────────────────────────────────────
router.get("/prescriptions", auth, async (req, res) => {
    const items = await MedServicePrescription.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/prescriptions", auth, async (req, res) => {
    const { patient, doctor, date, medications, status, notes } = req.body;
    if (!patient?.trim()) return res.status(400).json({ message: "Patient requis" });
    const doc = await MedServicePrescription.create({
        _id: randomUUID(), userId: req.user.id,
        patient, doctor: doctor || "", date: date || new Date().toISOString().slice(0, 10),
        medications: medications || "", status: status || "Active", notes: notes || "",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

router.put("/prescriptions/:id", auth, async (req, res) => {
    const doc = await MedServicePrescription.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id },
        { $set: req.body }, { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Introuvable" });
    res.json({ ...doc.toObject(), id: doc._id });
});

router.delete("/prescriptions/:id", auth, async (req, res) => {
    await MedServicePrescription.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ success: true });
});

// ── Analytics ──────────────────────────────────────────────────
router.get("/analytics", auth, async (req, res) => {
    const uid = req.user.id;
    const [patients, visits, invoices, team] = await Promise.all([
        MedServicePatient.find({ userId: uid }).lean(),
        MedServiceVisit.find({ userId: uid, channel: "présentiel" }).lean(),
        MedServiceInvoice.find({ userId: uid }).lean(),
        MedServiceTeamMember.find({ userId: uid }).lean(),
    ]);

    // KPIs
    const totalPatients = patients.length;
    const totalVisits = visits.filter((v) => v.status === "Complété").length;
    const revenue = invoices.filter((i) => i.status === "Payée").reduce((s, i) => s + i.amount, 0);
    const successRate = totalVisits > 0
        ? Math.round((totalVisits / visits.filter((v) => v.status !== "Annulé").length) * 100)
        : 0;

    // Team performance
    const teamPerf = team.map((m) => {
        const memberVisits = visits.filter((v) => v.staff === m.name && v.status === "Complété").length;
        return { name: m.name, role: m.role, visits: memberVisits, score: Math.min(100, memberVisits * 5 + 60) };
    }).sort((a, b) => b.visits - a.visits).slice(0, 5);

    // Pathologies (group patients by condition)
    const pathMap = {};
    patients.forEach((p) => {
        const key = p.condition || "Autre";
        pathMap[key] = (pathMap[key] || 0) + 1;
    });
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
    const pathologies = Object.entries(pathMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([label, count], i) => ({ label, count, color: colors[i] || "#6b7280" }));

    // Monthly stats (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const ym = d.toISOString().slice(0, 7);
        const label = d.toLocaleDateString("fr-FR", { month: "short" });
        const mv = visits.filter((v) => v.date?.startsWith(ym) && v.status === "Complété").length;
        const mp = patients.filter((p) => p.startDate?.startsWith(ym)).length;
        const mr = invoices.filter((inv) => inv.date?.startsWith(ym) && inv.status === "Payée")
            .reduce((s, inv) => s + inv.amount, 0);
        months.push({ month: label, visits: mv, patients: mp, revenue: mr });
    }

    res.json({
        kpis: { totalPatients, totalVisits, revenue, successRate },
        teamPerf,
        pathologies,
        monthly: months,
    });
});

// ── Vitals ──────────────────────────────────────────────────────
router.get("/vitals/:patientId", auth, async (req, res) => {
    const records = await Vital.find({
        userId: req.user.id,
        patientId: req.params.patientId,
        role: "medical_service",
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
        role: "medical_service",
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

// ── Teleconsultation visits ─────────────────────────────────────
router.get("/teleconsultation", auth, async (req, res) => {
    const items = await MedServiceVisit.find({ userId: req.user.id, channel: "téléconsultation" })
        .sort({ date: 1, time: 1 }).lean();
    res.json(items.map((i) => ({ ...i, id: i._id })));
});

router.post("/teleconsultation", auth, async (req, res) => {
    const { patient, staff, date, time, duration, status, notes } = req.body;
    if (!patient?.trim()) return res.status(400).json({ message: "Patient requis" });
    const doc = await MedServiceVisit.create({
        _id: randomUUID(), userId: req.user.id,
        patient, staff: staff || "", date: date || "",
        time: time || "09:00", duration: duration || "30min",
        status: status || "Planifié", channel: "téléconsultation",
        notes: notes || "",
    });
    res.status(201).json({ ...doc.toObject(), id: doc._id });
});

// ── Settings ──────────────────────────────────────────────────
const User = require("../models/User");

router.get("/settings", auth, async (req, res) => {
    const [user, extra] = await Promise.all([
        User.findById(req.user.id).lean(),
        MedServiceSettings.findById(req.user.id).lean(),
    ]);
    res.json({
        name: user?.companyName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: extra?.address || "",
        director: extra?.director || "",
        capacity: extra?.capacity || "30",
        serviceType: extra?.serviceType || "Soins infirmiers à domicile",
        notifs: extra?.notifs || {
            newPatient: true, vitalAlert: true, appointmentReminder: true,
            teamMessage: false, billing: true, maintenance: false,
        },
    });
});

router.patch("/settings", auth, async (req, res) => {
    const { name, email, phone, address, director, capacity, serviceType, notifs } = req.body;
    const updates = {};
    if (name !== undefined) updates.companyName = name;
    if (phone !== undefined) updates.phone = phone;
    if (Object.keys(updates).length > 0)
        await User.findByIdAndUpdate(req.user.id, { $set: updates });
    await MedServiceSettings.findByIdAndUpdate(
        req.user.id,
        { $set: { address, director, capacity, serviceType, ...(notifs ? { notifs } : {}) } },
        { upsert: true, new: true }
    );
    res.json({ success: true });
});

module.exports = router;
