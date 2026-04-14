const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const Dossier = require("../models/Dossier");
const User = require("../models/User");

// GET /api/dossier
router.get("/", authMiddleware, async (req, res) => {
  const dossier = await Dossier.findOne({ patientId: req.user.id }).lean();
  if (!dossier) return res.json(null);
  res.json(dossier);
});

// GET /api/dossier/:patientId
router.get("/:patientId", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Accès réservé aux médecins" });
  }
  const dossier = await Dossier.findOne({
    patientId: req.params.patientId,
  }).lean();
  if (!dossier) return res.status(404).json({ message: "Dossier non trouvé" });

  const patient = await User.findById(req.params.patientId).lean();
  const result = {
    ...dossier,
    patientName: patient
      ? patient.firstName + " " + patient.lastName
      : "Inconnu",
    patientEmail: patient?.email,
    patientPhone: patient?.phone,
  };
  res.json(result);
});

// PUT /api/dossier
router.put("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "patient") {
    return res
      .status(403)
      .json({ message: "Seul le patient peut modifier son dossier" });
  }

  const { personal, medicalHistory, allergies, activeMedications, documents } =
    req.body;

  const dossier = await Dossier.findOneAndUpdate(
    { patientId: req.user.id },
    {
      patientId: req.user.id,
      ...(personal !== undefined && { personal }),
      ...(medicalHistory !== undefined && { medicalHistory }),
      ...(allergies !== undefined && { allergies }),
      ...(activeMedications !== undefined && { activeMedications }),
      ...(documents !== undefined && { documents }),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  res.json(dossier);
});

// POST /api/dossier/:patientId/consultation
router.post("/:patientId/consultation", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") {
    return res.status(403).json({ message: "Accès réservé aux médecins" });
  }

  const { symptoms, observations, diagnosis, medications, followUp, notes } =
    req.body;

  const doctor = await User.findById(req.user.id).lean();
  const doctorName = doctor
    ? `${doctor.firstName} ${doctor.lastName}`
    : "Médecin";

  const consultation = {
    doctorId: req.user.id,
    doctorName,
    date: new Date().toISOString(),
    symptoms: symptoms || "",
    observations: observations || "",
    diagnosis: diagnosis || "",
    medications: medications || [],
    followUp: followUp || "",
    notes: notes || "",
  };

  const dossier = await Dossier.findOneAndUpdate(
    { patientId: req.params.patientId },
    { $push: { consultations: consultation } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  res.status(201).json(dossier);
});

module.exports = router;
