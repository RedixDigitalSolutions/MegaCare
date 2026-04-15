const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Prescription = require("../models/Prescription");

// GET /api/prescriptions
router.get("/", authMiddleware, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const filter = { $or: [{ patientId: req.user.id }, { doctorId: req.user.id }] };
  const [result, total] = await Promise.all([
    Prescription.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Prescription.countDocuments(filter),
  ]);
  res.json({
    data: result.map((p) => ({ ...p, id: p._id })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});

// GET /api/prescriptions/:id
router.get("/:id", authMiddleware, async (req, res) => {
  const pres = await Prescription.findById(req.params.id).lean();
  if (!pres) return res.status(404).json({ message: "Ordonnance non trouvée" });
  if (pres.patientId !== req.user.id && pres.doctorId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  res.json({ ...pres, id: pres._id });
});

// POST /api/prescriptions
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Accès réservé aux médecins" });
  }
  const { patientId, medicines } = req.body;
  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ message: "Au moins un médicament requis" });
  }
  const pres = await Prescription.create({
    _id: randomUUID(),
    doctorId: req.user.id,
    patientId: patientId || null,
    medicines,
  });
  res.status(201).json({ ...pres.toObject(), id: pres._id });
});

module.exports = router;
