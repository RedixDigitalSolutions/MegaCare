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

  // Check doctor has active permission
  const perm = (dossier.permissions || []).find(
    (p) => p.doctorId === req.user.id && p.status === "active"
  );
  if (!perm) {
    return res.status(403).json({ message: "Vous n'avez pas accès à ce dossier médical" });
  }
  // Check expiry
  if (perm.expiresAt && new Date(perm.expiresAt) < new Date()) {
    await Dossier.updateOne(
      { patientId: req.params.patientId, "permissions.doctorId": req.user.id },
      { $set: { "permissions.$.status": "expired" } }
    );
    return res.status(403).json({ message: "Votre accès à ce dossier a expiré" });
  }

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

// ── Permissions Management ──

// GET /api/dossier/permissions/list — patient gets their permission list
router.get("/permissions/list", authMiddleware, async (req, res) => {
  const dossier = await Dossier.findOne({ patientId: req.user.id }).lean();
  if (!dossier) return res.json([]);

  // Auto-expire stale permissions
  const now = new Date();
  const perms = (dossier.permissions || []).map((p) => {
    if (p.status === "active" && p.expiresAt && new Date(p.expiresAt) < now) {
      p.status = "expired";
    }
    return p;
  });

  // Persist any status changes
  await Dossier.updateOne(
    { patientId: req.user.id },
    { $set: { permissions: perms } }
  );

  res.json(perms);
});

// POST /api/dossier/permissions/grant — patient manually grants access
router.post("/permissions/grant", authMiddleware, async (req, res) => {
  const { doctorId } = req.body;
  if (!doctorId) return res.status(400).json({ message: "doctorId requis" });

  const doctor = await User.findById(doctorId).lean();
  if (!doctor || doctor.role !== "doctor") {
    return res.status(404).json({ message: "Médecin introuvable" });
  }

  const dossier = await Dossier.findOne({ patientId: req.user.id });
  if (!dossier) return res.status(404).json({ message: "Dossier non trouvé" });

  // Check if already active
  const existing = dossier.permissions.find(
    (p) => p.doctorId === doctorId && p.status === "active"
  );
  if (existing) return res.json({ message: "Accès déjà accordé", permissions: dossier.permissions });

  // Reactivate or add
  const revoked = dossier.permissions.find(
    (p) => p.doctorId === doctorId && (p.status === "revoked" || p.status === "expired")
  );
  if (revoked) {
    revoked.status = "active";
    revoked.grantedAt = new Date();
    revoked.expiresAt = null;
  } else {
    dossier.permissions.push({
      doctorId,
      doctorName: `${doctor.firstName} ${doctor.lastName}`,
      grantedAt: new Date(),
      expiresAt: null,
      status: "active",
    });
  }
  await dossier.save();
  res.json(dossier.permissions);
});

// DELETE /api/dossier/permissions/:doctorId — patient revokes access
router.delete("/permissions/:doctorId", authMiddleware, async (req, res) => {
  const dossier = await Dossier.findOne({ patientId: req.user.id });
  if (!dossier) return res.status(404).json({ message: "Dossier non trouvé" });

  const perm = dossier.permissions.find(
    (p) => p.doctorId === req.params.doctorId && p.status === "active"
  );
  if (!perm) return res.status(404).json({ message: "Permission introuvable" });

  perm.status = "revoked";
  await dossier.save();
  res.json(dossier.permissions);
});

module.exports = router;
