const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const path = require("path");
const multer = require("multer");

const MedServicePatient = require("../models/MedServicePatient");
const MedServiceEquipment = require("../models/MedServiceEquipment");
const MedServiceTeamMember = require("../models/MedServiceTeamMember");
const MedServiceVisit = require("../models/MedServiceVisit");
const MedServiceInvoice = require("../models/MedServiceInvoice");
const MedServicePrescription = require("../models/MedServicePrescription");
const MedServiceSettings = require("../models/MedServiceSettings");
const Vital = require("../models/Vital");
const MedicalEstablishment = require("../models/MedicalEstablishment");
const FacilityAvailability = require("../models/FacilityAvailability");
const FacilityAppointment = require("../models/FacilityAppointment");

// Multer setup — save banner images to uploads/medical-service-banner/
const bannerStorage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/medical-service-banner"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `banner-${req.user.id}-${Date.now()}${ext}`);
    },
});
const bannerUpload = multer({
    storage: bannerStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
        if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
        else cb(new Error("Format non supporté"));
    },
});

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

/* ---------------------------------------------------------------
   GET /api/medical-service/establishment
   Returns the MedicalEstablishment linked to this user account.
   --------------------------------------------------------------- */
router.get("/establishment", authMiddleware, medGuard, async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.user.id).lean();
        if (!user || !user.establishmentId)
            return res.json(null);
        const estab = await MedicalEstablishment.findById(user.establishmentId).lean();
        if (!estab) return res.json(null);
        res.json({ ...estab, id: estab._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* ---------------------------------------------------------------
   POST /api/medical-service/banner
   Uploads a new banner image and updates the establishment record.
   --------------------------------------------------------------- */
router.post("/banner", authMiddleware, medGuard, bannerUpload.single("banner"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });
        const User = require("../models/User");
        const user = await User.findById(req.user.id).lean();
        if (!user || !user.establishmentId)
            return res.status(400).json({ message: "Aucun établissement lié à ce compte" });
        const imageUrl = `/uploads/medical-service-banner/${req.file.filename}`;
        await MedicalEstablishment.findByIdAndUpdate(user.establishmentId, { $set: { imageUrl } });
        res.json({ success: true, imageUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* ---------------------------------------------------------------
   PUT /api/medical-service/establishment
   Update the public-facing profile of the linked MedicalEstablishment.
   --------------------------------------------------------------- */
router.put("/establishment", authMiddleware, medGuard, async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.user.id).lean();
        if (!user || !user.establishmentId)
            return res.status(404).json({ message: "Aucun établissement lié à ce compte" });
        const ALLOWED = [
            "name", "address", "phone", "governorate", "city",
            "description", "services", "accredited", "emergencies",
            "beds", "doctors", "founded", "mapUrl",
        ];
        if (req.body.mapUrl !== undefined && req.body.mapUrl !== "") {
            if (!/^https?:\/\/.+/.test(req.body.mapUrl))
                return res.status(400).json({ message: "URL Google Maps invalide (doit commencer par http:// ou https://)" });
        }
        const update = {};
        for (const key of ALLOWED) {
            if (req.body[key] !== undefined) update[key] = req.body[key];
        }
        const updated = await MedicalEstablishment.findByIdAndUpdate(
            user.establishmentId,
            { $set: update },
            { new: true }
        ).lean();
        if (!updated) return res.status(404).json({ message: "Établissement introuvable" });
        res.json({ ...updated, id: updated._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ── Availability (working hours + blocked slots) ───────────────────────────

const DEFAULT_WORKING_DAYS = [
    { day: 1, start: "08:00", end: "18:00" }, // Monday
    { day: 2, start: "08:00", end: "18:00" },
    { day: 3, start: "08:00", end: "18:00" },
    { day: 4, start: "08:00", end: "18:00" },
    { day: 5, start: "08:00", end: "18:00" }, // Friday
    { day: 6, start: "08:00", end: "13:00" }, // Saturday (half day)
];

/** Returns or creates the availability document for the logged-in facility. */
async function getOrCreateAvailability(userId) {
    let av = await FacilityAvailability.findOne({ ownerId: userId });
    if (!av) {
        av = await FacilityAvailability.create({
            ownerId: userId,
            facilityType: "med_service",
            workingDays: DEFAULT_WORKING_DAYS,
            slotDuration: 30,
        });
    }
    return av;
}

// GET /api/medical-service/availability
router.get("/availability", auth, async (req, res) => {
    const av = await getOrCreateAvailability(req.user.id);
    res.json(av);
});

// PUT /api/medical-service/availability
router.put("/availability", auth, async (req, res) => {
    const { workingDays, slotDuration } = req.body;
    const av = await getOrCreateAvailability(req.user.id);
    if (Array.isArray(workingDays)) av.workingDays = workingDays;
    if (slotDuration != null) av.slotDuration = Math.max(15, Math.min(120, Number(slotDuration)));
    await av.save();
    res.json(av);
});

// POST /api/medical-service/availability/block  { date, time?, label?, color? }
// Omit `time` to block an entire day.
router.post("/availability/block", auth, async (req, res) => {
    const { date, time, label, color } = req.body;
    if (!date) return res.status(400).json({ message: "date requis" });
    const av = await getOrCreateAvailability(req.user.id);
    if (!time) {
        if (!av.blockedDays.includes(date)) av.blockedDays.push(date);
    } else {
        const exists = av.blockedSlots.some((s) => s.date === date && s.time === time);
        if (!exists) {
            av.blockedSlots.push({ date, time, label: label || "", color: color || "" });
        } else {
            // Update label/color if entry already exists (e.g. admin edits the event)
            const entry = av.blockedSlots.find((s) => s.date === date && s.time === time);
            if (entry) { entry.label = label || entry.label; entry.color = color || entry.color; }
        }
    }
    await av.save();
    res.json(av);
});

// DELETE /api/medical-service/availability/block/:date/:time  (time = "day" to unblock a full day)
router.delete("/availability/block/:date/:time", auth, async (req, res) => {
    const { date, time } = req.params;
    const av = await getOrCreateAvailability(req.user.id);
    if (time === "day") {
        av.blockedDays = av.blockedDays.filter((d) => d !== date);
    } else {
        av.blockedSlots = av.blockedSlots.filter(
            (s) => !(s.date === date && s.time === time)
        );
    }
    await av.save();
    res.json(av);
});

// GET /api/medical-service/availability/events?start=YYYY-MM-DD&end=YYYY-MM-DD
// Returns named calendar events (blockedSlots with a label) for the given date range.
// Used by the admin calendar to restore custom events on page load.
router.get("/availability/events", auth, async (req, res) => {
    const { start, end } = req.query;
    const av = await FacilityAvailability.findOne({ ownerId: req.user.id }).lean();
    if (!av) return res.json([]);
    let events = (av.blockedSlots || []).filter((s) => s.label && s.label.trim() !== "");
    if (start) events = events.filter((s) => s.date >= start);
    if (end) events = events.filter((s) => s.date <= end);
    res.json(events);
});

// ── Patient Appointments ──────────────────────────────────────────────────────

// GET /api/medical-service/appointments
router.get("/appointments", auth, async (req, res) => {
    const { status, date } = req.query;
    const filter = { ownerId: req.user.id };
    if (status) filter.status = status;
    if (date) filter.date = date;
    const appts = await FacilityAppointment.find(filter)
        .sort({ date: 1, time: 1 })
        .lean();
    res.json(appts.map((a) => ({ ...a, id: a._id })));
});

// PUT /api/medical-service/appointments/:id
router.put("/appointments/:id", auth, async (req, res) => {
    const allowed = ["confirmed", "rejected", "completed", "cancelled"];
    const { status, notes } = req.body;
    if (status && !allowed.includes(status))
        return res.status(400).json({ message: "Statut invalide" });
    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;
    const appt = await FacilityAppointment.findOneAndUpdate(
        { _id: req.params.id, ownerId: req.user.id },
        { $set: update },
        { new: true }
    ).lean();
    if (!appt) return res.status(404).json({ message: "Rendez-vous introuvable" });
    res.json({ ...appt, id: appt._id });
});

module.exports = router;
