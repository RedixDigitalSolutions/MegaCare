const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const path = require("path");
const multer = require("multer");
const LabTest = require("../models/LabTest");
const LabResult = require("../models/LabResult");
const PublicLabCenter = require("../models/PublicLabCenter");
const FacilityAvailability = require("../models/FacilityAvailability");
const FacilityAppointment = require("../models/FacilityAppointment");

// Multer — banner upload to uploads/Labos-Radiologie/
const bannerStorage = multer.diskStorage({
    destination: path.join(__dirname, "../uploads/Labos-Radiologie"),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `banner-${req.user.id}-${Date.now()}${ext}`);
    },
});
const bannerUpload = multer({
    storage: bannerStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
        if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
        else cb(new Error("Format non supporté"));
    },
});

function labGuard(req, res, next) {
    if (req.user.role !== "lab_radiology")
        return res.status(403).json({ message: "Accès refusé" });
    next();
}

// GET /api/lab/kpis
router.get("/kpis", authMiddleware, labGuard, async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    const [tests, results] = await Promise.all([
        LabTest.find().lean(),
        LabResult.find().lean(),
    ]);
    const todayTests = tests.filter((t) => t.date === today);
    res.json({
        examsToday: todayTests.length,
        completedToday: todayTests.filter((t) => t.status === "Complété").length,
        pendingResults: tests.filter((t) => t.status !== "Complété").length,
        criticalResults: results.filter((r) => r.status === "Critique").length,
    });
});

// GET /api/lab/activity — recent activity feed built from real data
router.get("/activity", authMiddleware, labGuard, async (req, res) => {
    try {
        const [recentTests, recentResults] = await Promise.all([
            LabTest.find().sort({ createdAt: -1 }).limit(10).lean(),
            LabResult.find().sort({ createdAt: -1 }).limit(10).lean(),
        ]);

        const items = [];
        for (const t of recentTests) {
            let type, text;
            if (t.status === "Complété") {
                type = "completed";
                text = `Analyse ${t.testType} — ${t.patient} complétée`;
            } else if (t.status === "En cours") {
                type = "in_progress";
                text = `Analyse ${t.testType} en cours — ${t.patient}`;
            } else {
                type = "new_request";
                text = `Nouvelle demande d'analyse ${t.testType} — ${t.patient}`;
            }
            items.push({ type, text, createdAt: t.createdAt });
        }
        for (const r of recentResults) {
            if (r.status === "Critique") {
                items.push({
                    type: "critical",
                    text: `Résultat ${r.testType} critique — ${r.patient}`,
                    createdAt: r.createdAt,
                });
            } else {
                items.push({
                    type: "result",
                    text: `Résultat ${r.testType} partagé — ${r.patient}`,
                    createdAt: r.createdAt,
                });
            }
        }

        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json(items.slice(0, 8));
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// GET /api/lab/partner-doctors — count of distinct doctors
router.get("/partner-doctors", authMiddleware, labGuard, async (req, res) => {
    try {
        const [testDoctors, resultDoctors] = await Promise.all([
            LabTest.distinct("doctor"),
            LabResult.distinct("doctor"),
        ]);
        const all = new Set([...testDoctors, ...resultDoctors]);
        all.delete("");
        res.json({ count: all.size });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// GET /api/lab/tests
router.get("/tests", authMiddleware, labGuard, async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [tests, total] = await Promise.all([
        LabTest.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        LabTest.countDocuments(),
    ]);
    res.json({
        data: tests.map((t) => ({ ...t, id: t._id })),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    });
});

// POST /api/lab/tests
router.post("/tests", authMiddleware, labGuard, async (req, res) => {
    const { patient, testType, doctor, priority, date, notes } = req.body;
    if (!patient?.trim() || !testType?.trim())
        return res
            .status(400)
            .json({ message: "Patient et type d'analyse requis" });
    const test = await LabTest.create({
        _id: randomUUID(),
        patient,
        testType,
        doctor: doctor || "",
        priority: priority || "Normal",
        date: date || new Date().toISOString().slice(0, 10),
        notes: notes || "",
        status: "En attente",
    });
    res.status(201).json({ ...test.toObject(), id: test._id });
});

// PUT /api/lab/tests/:id
router.put("/tests/:id", authMiddleware, labGuard, async (req, res) => {
    const updated = await LabTest.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    }).lean();
    if (!updated) return res.status(404).json({ message: "Analyse non trouvée" });
    res.json({ ...updated, id: updated._id });
});

// GET /api/lab/results
router.get("/results", authMiddleware, labGuard, async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
        LabResult.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        LabResult.countDocuments(),
    ]);
    res.json({
        data: results.map((r) => ({ ...r, id: r._id })),
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    });
});

// POST /api/lab/results
router.post("/results", authMiddleware, labGuard, async (req, res) => {
    const { patient, testType, value } = req.body;
    if (!patient?.trim() || !testType?.trim() || !value?.trim())
        return res.status(400).json({ message: "Champs requis manquants" });
    const result = await LabResult.create({
        _id: randomUUID(),
        ...req.body,
    });
    res.status(201).json({ ...result.toObject(), id: result._id });
});

/* ---------------------------------------------------------------
   GET /api/lab/center
   Returns the PublicLabCenter linked to this user.
   --------------------------------------------------------------- */
router.get("/center", authMiddleware, labGuard, async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.user.id).lean();
        if (!user || !user.labCenterId)
            return res.status(404).json({ message: "Aucun centre lié à ce compte" });
        const center = await PublicLabCenter.findById(user.labCenterId).lean();
        if (!center) return res.status(404).json({ message: "Centre introuvable" });
        res.json({ ...center, id: center._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* ---------------------------------------------------------------
   POST /api/lab/banner
   Uploads a new banner and updates PublicLabCenter.imageUrl.
   --------------------------------------------------------------- */
router.post("/banner", authMiddleware, labGuard, bannerUpload.single("banner"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });
        const User = require("../models/User");
        const user = await User.findById(req.user.id).lean();
        if (!user || !user.labCenterId)
            return res.status(400).json({ message: "Aucun centre lié à ce compte" });
        const imageUrl = `/uploads/Labos-Radiologie/${req.file.filename}`;
        await PublicLabCenter.findByIdAndUpdate(user.labCenterId, { $set: { imageUrl } });
        res.json({ success: true, imageUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* ---------------------------------------------------------------
   GET /api/lab/settings  — basic lab center info
   --------------------------------------------------------------- */
router.get("/settings", authMiddleware, labGuard, async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.user.id).lean();
        let center = null;
        if (user?.labCenterId) {
            center = await PublicLabCenter.findById(user.labCenterId).lean();
        }
        res.json({
            name: center?.name || user?.companyName || "",
            address: center?.address || "",
            phone: center?.phone || user?.phone || "",
            email: user?.email || "",
            type: center?.type || "",
            governorate: center?.governorate || user?.governorate || "",
            city: center?.city || user?.delegation || "",
            imageUrl: center?.imageUrl || "",
            // Public profile fields
            description: center?.description || "",
            resultDelay: center?.resultDelay || "24h",
            exams: center?.exams || [],
            allExamTypes: center?.allExamTypes || [],
            cnam: center?.cnam ?? false,
            open24h: center?.open24h ?? false,
            mapUrl: center?.mapUrl || "",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

/* ---------------------------------------------------------------
   PUT /api/lab/center  — update all editable profile fields
   --------------------------------------------------------------- */
router.put("/center", authMiddleware, labGuard, async (req, res) => {
    try {
        const User = require("../models/User");
        const user = await User.findById(req.user.id).lean();
        if (!user || !user.labCenterId)
            return res.status(404).json({ message: "Aucun centre lié à ce compte" });
        const ALLOWED = [
            "name", "address", "phone", "governorate", "city",
            "description", "resultDelay", "exams", "allExamTypes", "cnam", "open24h", "mapUrl",
        ];
        const update = {};
        for (const key of ALLOWED) {
            if (req.body[key] !== undefined) update[key] = req.body[key];
        }
        if (update.mapUrl !== undefined && update.mapUrl !== "") {
            if (!/^https?:\/\/.+/.test(update.mapUrl))
                return res.status(400).json({ message: "URL Google Maps invalide (doit commencer par http:// ou https://)" });
        }
        const updated = await PublicLabCenter.findByIdAndUpdate(
            user.labCenterId,
            { $set: update },
            { new: true }
        ).lean();
        if (!updated) return res.status(404).json({ message: "Centre introuvable" });
        res.json({ ...updated, id: updated._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// ── Availability ────────────────────────────────────────────────────────────

const LAB_DEFAULT_WORKING_DAYS = [
    { day: 1, start: "07:30", end: "17:00" },
    { day: 2, start: "07:30", end: "17:00" },
    { day: 3, start: "07:30", end: "17:00" },
    { day: 4, start: "07:30", end: "17:00" },
    { day: 5, start: "07:30", end: "17:00" },
    { day: 6, start: "07:30", end: "12:00" },
];

async function getOrCreateLabAvailability(userId) {
    let av = await FacilityAvailability.findOne({ ownerId: userId });
    if (!av) {
        av = await FacilityAvailability.create({
            ownerId: userId,
            facilityType: "lab",
            workingDays: LAB_DEFAULT_WORKING_DAYS,
            slotDuration: 30,
        });
    }
    return av;
}

router.get("/availability", authMiddleware, labGuard, async (req, res) => {
    const av = await getOrCreateLabAvailability(req.user.id);
    res.json(av);
});

router.put("/availability", authMiddleware, labGuard, async (req, res) => {
    const { workingDays, slotDuration } = req.body;
    const av = await getOrCreateLabAvailability(req.user.id);
    if (Array.isArray(workingDays)) av.workingDays = workingDays;
    if (slotDuration != null) av.slotDuration = Math.max(15, Math.min(120, Number(slotDuration)));
    await av.save();
    res.json(av);
});

router.post("/availability/block", authMiddleware, labGuard, async (req, res) => {
    const { date, time } = req.body;
    if (!date) return res.status(400).json({ message: "date requis" });
    const av = await getOrCreateLabAvailability(req.user.id);
    if (!time) {
        if (!av.blockedDays.includes(date)) av.blockedDays.push(date);
    } else {
        const exists = av.blockedSlots.some((s) => s.date === date && s.time === time);
        if (!exists) av.blockedSlots.push({ date, time });
    }
    await av.save();
    res.json(av);
});

router.delete("/availability/block/:date/:time", authMiddleware, labGuard, async (req, res) => {
    const { date, time } = req.params;
    const av = await getOrCreateLabAvailability(req.user.id);
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

// ── Patient Appointments ───────────────────────────────────────────────────

router.get("/appointments", authMiddleware, labGuard, async (req, res) => {
    const { status, date } = req.query;
    const filter = { ownerId: req.user.id };
    if (status) filter.status = status;
    if (date) filter.date = date;
    const appts = await FacilityAppointment.find(filter)
        .sort({ date: 1, time: 1 })
        .lean();
    res.json(appts.map((a) => ({ ...a, id: a._id })));
});

router.put("/appointments/:id", authMiddleware, labGuard, async (req, res) => {
    const allowed = ["confirmed", "rejected", "completed", "cancelled"];
    const { status, adminNotes } = req.body;
    if (status && !allowed.includes(status))
        return res.status(400).json({ message: "Statut invalide" });
    const update = {};
    if (status) update.status = status;
    if (adminNotes !== undefined) update.adminNotes = adminNotes;
    const appt = await FacilityAppointment.findOneAndUpdate(
        { _id: req.params.id, ownerId: req.user.id },
        { $set: update },
        { new: true }
    ).lean();
    if (!appt) return res.status(404).json({ message: "Rendez-vous introuvable" });
    res.json({ ...appt, id: appt._id });
});

// GET /api/lab/patients — unique patients derived from appointments at this lab
router.get("/patients", authMiddleware, labGuard, async (req, res) => {
    try {
        const { search } = req.query;
        const matchStage = { ownerId: req.user.id };
        if (search) matchStage.patientName = { $regex: search, $options: "i" };
        const patients = await FacilityAppointment.aggregate([
            { $match: matchStage },
            { $sort: { date: -1, time: -1 } },
            {
                $group: {
                    _id: "$patientId",
                    name: { $first: "$patientName" },
                    email: { $first: "$patientEmail" },
                    phone: { $first: "$patientPhone" },
                    appointmentCount: { $sum: 1 },
                    lastDate: { $max: "$date" },
                    lastStatus: { $first: "$status" },
                    lastService: { $first: "$service" },
                },
            },
            { $sort: { lastDate: -1 } },
        ]);
        res.json(patients.map((p) => ({
            patientId: p._id,
            name: p.name,
            email: p.email,
            phone: p.phone,
            appointmentCount: p.appointmentCount,
            lastDate: p.lastDate,
            lastStatus: p.lastStatus,
            lastService: p.lastService,
        })));
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

// GET /api/lab/patients/:patientId — patient profile + appointment history at this lab
router.get("/patients/:patientId", authMiddleware, labGuard, async (req, res) => {
    try {
        const { patientId } = req.params;
        const appointments = await FacilityAppointment.find({
            ownerId: req.user.id,
            patientId,
        })
            .sort({ date: -1, time: -1 })
            .lean();
        if (appointments.length === 0)
            return res.status(404).json({ message: "Aucun patient trouvé" });
        const latest = appointments[0];
        res.json({
            patientId,
            name: latest.patientName,
            email: latest.patientEmail,
            phone: latest.patientPhone,
            appointments: appointments.map((a) => ({ ...a, id: a._id })),
        });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur" });
    }
});

module.exports = router;
