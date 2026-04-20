const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID, randomBytes } = require("crypto");
const Prescription = require("../models/Prescription");

function generateSecretCode() {
  return randomBytes(4).toString("hex").toUpperCase(); // 8-char hex
}

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
    secretCode: generateSecretCode(),
    purchaseStatus: "pending",
  });
  res.status(201).json({ ...pres.toObject(), id: pres._id });
});

// GET /api/prescriptions/verify/:secretCode — pharmacy verifies prescription
router.get("/verify/:secretCode", authMiddleware, async (req, res) => {
  const pres = await Prescription.findOne({ secretCode: req.params.secretCode }).lean();
  if (!pres) return res.status(404).json({ message: "Ordonnance introuvable" });

  const User = require("../models/User");
  const doctor = await User.findById(pres.doctorId).lean();
  const patient = await User.findById(pres.patientId).lean();

  res.json({
    ...pres,
    id: pres._id,
    doctorName: doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "Médecin",
    patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Patient",
  });
});

// PATCH /api/prescriptions/:id/purchase — mark as purchased
router.patch("/:id/purchase", authMiddleware, async (req, res) => {
  const pres = await Prescription.findById(req.params.id);
  if (!pres) return res.status(404).json({ message: "Ordonnance non trouvée" });
  pres.purchaseStatus = "purchased";
  pres.scanned = true;
  if (!pres.pharmacyId && req.body.pharmacyId) {
    pres.pharmacyId = req.body.pharmacyId;
  }
  await pres.save();
  res.json({ ...pres.toObject(), id: pres._id });
});

module.exports = router;
