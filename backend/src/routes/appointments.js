const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Appointment = require("../models/Appointment");

// GET /api/appointments
router.get("/", authMiddleware, async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const filter = { $or: [{ patientId: req.user.id }, { doctorId: req.user.id }] };
  const [result, total] = await Promise.all([
    Appointment.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean(),
    Appointment.countDocuments(filter),
  ]);
  res.json({
    data: result.map((a) => ({ ...a, id: a._id })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
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
  const User = require("../models/User");
  const patientUser = await User.findById(req.user.id).lean();
  const patientName = patientUser
    ? `${patientUser.firstName || ""} ${patientUser.lastName || ""}`.trim()
    : "";
  const appt = await Appointment.create({
    _id: randomUUID(),
    patientId: req.user.id,
    patientName,
    doctorId,
    date,
    time,
    fee: req.body.fee ?? 80,
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
  // Strip fields patients must never overwrite
  const { id, patientId, doctorId, ...updates } = req.body;
  // Patients cannot set status to doctor-only values
  const doctorOnlyStatuses = ["confirmed", "rejected", "completed"];
  if (
    req.user.role !== "doctor" &&
    updates.status &&
    doctorOnlyStatuses.includes(updates.status)
  ) {
    return res.status(403).json({ message: "Action réservée aux médecins" });
  }
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
