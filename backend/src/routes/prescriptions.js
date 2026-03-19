const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");

if (!global._mcPrescriptions) global._mcPrescriptions = [];
const prescriptions = global._mcPrescriptions;

// GET /api/prescriptions  — returns prescriptions for authenticated user
router.get("/", authMiddleware, (req, res) => {
  const result = prescriptions.filter(
    (p) => p.patientId === req.user.id || p.doctorId === req.user.id,
  );
  res.json(result);
});

// GET /api/prescriptions/:id
router.get("/:id", authMiddleware, (req, res) => {
  const pres = prescriptions.find((p) => p.id === req.params.id);
  if (!pres) return res.status(404).json({ message: "Ordonnance non trouvée" });
  if (pres.patientId !== req.user.id && pres.doctorId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  res.json(pres);
});

// POST /api/prescriptions  (doctor only)
router.post("/", authMiddleware, (req, res) => {
  const { patientId, medicines } = req.body;
  if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
    return res.status(400).json({ message: "Au moins un médicament requis" });
  }
  const pres = {
    id: randomUUID(),
    doctorId: req.user.id,
    patientId: patientId || null,
    medicines,
    createdAt: new Date().toISOString(),
  };
  prescriptions.push(pres);
  res.status(201).json(pres);
});

module.exports = router;
