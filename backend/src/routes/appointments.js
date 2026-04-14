const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Appointment = require("../models/Appointment");

// GET /api/appointments
router.get("/", authMiddleware, async (req, res) => {
  const result = await Appointment.find({
    $or: [{ patientId: req.user.id }, { doctorId: req.user.id }],
  }).lean();
  res.json(result.map((a) => ({ ...a, id: a._id })));
});

// GET /api/appointments/:id
router.get("/:id", authMiddleware, async (req, res) => {
  const appt = await Appointment.findById(req.params.id).lean();
  if (!appt) return res.status(404).json({ message: "Rendez-vous non trouvé" });
  if (appt.patientId !== req.user.id && appt.doctorId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  res.json({ ...appt, id: appt._id });
});

// POST /api/appointments
router.post("/", authMiddleware, async (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: "doctorId, date et time requis" });
  }
  const appt = await Appointment.create({
    _id: randomUUID(),
    patientId: req.user.id,
    doctorId,
    date,
    time,
    reason: reason || "",
    status: "pending",
  });
  res.status(201).json({ ...appt.toObject(), id: appt._id });
});

// PUT /api/appointments/:id
router.put("/:id", authMiddleware, async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Rendez-vous non trouvé" });
  if (appt.patientId !== req.user.id && appt.doctorId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  const { id, patientId, ...updates } = req.body;
  Object.assign(appt, updates);
  await appt.save();
  res.json({ ...appt.toObject(), id: appt._id });
});

// DELETE /api/appointments/:id
router.delete("/:id", authMiddleware, async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Rendez-vous non trouvé" });
  if (appt.patientId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  await appt.deleteOne();
  res.status(204).end();
});

// PATCH /api/appointments/:id/status
router.patch("/:id/status", authMiddleware, async (req, res) => {
  const { status } = req.body;
  if (!["confirmed", "rejected", "cancelled", "completed"].includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Rendez-vous non trouvé" });
  if (appt.doctorId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  if (status === "rejected") {
    await appt.deleteOne();
    return res.json({ message: "Rendez-vous refusé et supprimé" });
  }
  appt.status = status;
  await appt.save();
  res.json({ ...appt.toObject(), id: appt._id });
});

module.exports = router;
