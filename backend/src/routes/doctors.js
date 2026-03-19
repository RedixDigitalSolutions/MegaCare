const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");

if (!global._mcDoctors) global._mcDoctors = [];
const doctors = global._mcDoctors;

// GET /api/doctors  — supports ?specialty= and ?governorate= filters
router.get("/", (req, res) => {
  let result = doctors;
  if (req.query.specialty) {
    result = result.filter((d) =>
      d.specialty?.toLowerCase().includes(req.query.specialty.toLowerCase()),
    );
  }
  if (req.query.governorate) {
    result = result.filter((d) =>
      d.governorate
        ?.toLowerCase()
        .includes(req.query.governorate.toLowerCase()),
    );
  }
  res.json(result);
});

// GET /api/doctors/:id
router.get("/:id", (req, res) => {
  const doctor = doctors.find((d) => d.id === req.params.id);
  if (!doctor) return res.status(404).json({ message: "Médecin non trouvé" });
  res.json(doctor);
});

// POST /api/doctors  (requires auth)
router.post("/", authMiddleware, (req, res) => {
  const { name, specialty, governorate, ...rest } = req.body;
  if (!name || !specialty) {
    return res.status(400).json({ message: "Nom et spécialité requis" });
  }
  const doctor = {
    id: randomUUID(),
    name,
    specialty,
    governorate,
    ...rest,
    userId: req.user.id,
  };
  doctors.push(doctor);
  res.status(201).json(doctor);
});

module.exports = router;
