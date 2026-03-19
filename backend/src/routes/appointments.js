const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");

if (!global._mcAppointments) global._mcAppointments = [];
const appointments = global._mcAppointments;

// GET /api/appointments  — returns appointments for authenticated user
router.get("/", authMiddleware, (req, res) => {
  const result = appointments.filter(
    (a) => a.patientId === req.user.id || a.doctorId === req.user.id,
  );
  res.json(result);
});

// GET /api/appointments/:id
router.get("/:id", authMiddleware, (req, res) => {
  const appt = appointments.find((a) => a.id === req.params.id);
  if (!appt) return res.status(404).json({ message: "Rendez-vous non trouvé" });
  if (appt.patientId !== req.user.id && appt.doctorId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  res.json(appt);
});

// POST /api/appointments
router.post("/", authMiddleware, (req, res) => {
  const { doctorId, date, time, reason } = req.body;
  if (!doctorId || !date || !time) {
    return res.status(400).json({ message: "doctorId, date et time requis" });
  }
  const appt = {
    id: randomUUID(),
    patientId: req.user.id,
    doctorId,
    date,
    time,
    reason: reason || "",
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  appointments.push(appt);
  res.status(201).json(appt);
});

// PUT /api/appointments/:id
router.put("/:id", authMiddleware, (req, res) => {
  const idx = appointments.findIndex((a) => a.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: "Rendez-vous non trouvé" });
  const appt = appointments[idx];
  if (appt.patientId !== req.user.id && appt.doctorId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  const { id, patientId, ...updates } = req.body;
  appointments[idx] = { ...appt, ...updates };
  res.json(appointments[idx]);
});

// DELETE /api/appointments/:id
router.delete("/:id", authMiddleware, (req, res) => {
  const idx = appointments.findIndex((a) => a.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: "Rendez-vous non trouvé" });
  if (appointments[idx].patientId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  appointments.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;
