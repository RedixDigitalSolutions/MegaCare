const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Prescription = require("../models/Prescription");

// GET /api/prescriptions
router.get("/", authMiddleware, async (req, res) => {
  const result = await Prescription.find({
    $or: [{ patientId: req.user.id }, { doctorId: req.user.id }],
  }).lean();
  res.json(result.map((p) => ({ ...p, id: p._id })));
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
