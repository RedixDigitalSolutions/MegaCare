const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const LabTest = require("../models/LabTest");
const LabResult = require("../models/LabResult");

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

module.exports = router;
