const express = require("express");
const router = express.Router();
const Speciality = require("../models/Speciality");
const authMiddleware = require("../middleware/auth");

// Seed defaults if the collection is empty
const DEFAULTS = [
  "Cardiologie",
  "Dermatologie",
  "Endocrinologie",
  "Gastro-entérologie",
  "Généraliste",
  "Gynécologie",
  "Hématologie",
  "Médecine interne",
  "Neurologie",
  "Oncologie",
  "Ophtalmologie",
  "Orthopédie",
  "ORL",
  "Pédiatrie",
  "Pneumologie",
  "Psychiatrie",
  "Psychologie",
  "Radiologie",
  "Rhumatologie",
  "Urologie",
];

async function ensureDefaults() {
  const count = await Speciality.countDocuments();
  if (count === 0) {
    await Speciality.insertMany(DEFAULTS.map((name) => ({ name })));
  }
}
ensureDefaults().catch(() => {});

// GET /api/specialities — public, returns sorted list
router.get("/", async (_req, res) => {
  try {
    const docs = await Speciality.find().sort({ name: 1 }).lean();
    res.json(docs.map((d) => d.name));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST /api/specialities — auth required; adds a new speciality if it doesn't exist
router.post("/", authMiddleware, async (req, res) => {
  const name = (req.body.name || "").trim();
  if (!name) return res.status(400).json({ message: "Nom requis" });

  try {
    const existing = await Speciality.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (existing) return res.json({ name: existing.name, created: false });

    const created = await Speciality.create({ name });
    res.status(201).json({ name: created.name, created: true });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
