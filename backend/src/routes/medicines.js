const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const Medicine = require("../models/Medicine");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/medicines/popular — top medicines for empty search state
router.get("/popular", async (req, res) => {
  try {
    const category = String(req.query.category || "").trim();
    const filter = category ? { category: { $regex: `^${escapeRegex(category)}$`, $options: "i" } } : {};
    const results = await Medicine.find(filter)
      .sort({ name: 1 })
      .limit(20)
      .lean();
    res.json(results.map((m) => ({ ...m, id: m._id })));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/medicines/search?q=para&category=... — real-time autocomplete
router.get("/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const category = String(req.query.category || "").trim();
    if (!q) return res.json([]);

    // Split query into words for multi-word matching ("para 500" → ["para","500"])
    const words = q.split(/\s+/).filter((w) => w.length >= 1);
    if (words.length === 0) return res.json([]);

    // Each word must appear in at least one of name/dci/brand
    const wordConditions = words.map((w) => {
      const regex = { $regex: escapeRegex(w), $options: "i" };
      return { $or: [{ name: regex }, { dci: regex }, { brand: regex }, { category: regex }] };
    });

    const filter = { $and: wordConditions };
    if (category) {
      filter.$and.push({ category: { $regex: `^${escapeRegex(category)}$`, $options: "i" } });
    }

    const results = await Medicine.find(filter)
      .limit(20)
      .lean();

    // Sort: prefix matches on name first, then alphabetical
    const qLower = q.toLowerCase();
    results.sort((a, b) => {
      const aPfx = a.name.toLowerCase().startsWith(qLower) ? 0 : 1;
      const bPfx = b.name.toLowerCase().startsWith(qLower) ? 0 : 1;
      if (aPfx !== bPfx) return aPfx - bPfx;
      return a.name.localeCompare(b.name);
    });

    res.json(results.map((m) => ({ ...m, id: m._id })));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/medicines/:id
router.get("/:id", async (req, res) => {
  const med = await Medicine.findById(req.params.id).lean();
  if (!med) return res.status(404).json({ message: "Médicament non trouvé" });
  res.json({ ...med, id: med._id });
});

// POST /api/medicines — create new global medicine entry (any authenticated pharmacist)
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  const { name, dci, category, form, brand, requiresPrescription, description, imageUrl, usage, contraindications, sideEffects } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Nom du médicament requis" });

  // Prevent duplicates: check if exact name + dci + form already exists
  const existing = await Medicine.findOne({
    name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" },
    dci: { $regex: `^${escapeRegex((dci || "").trim())}$`, $options: "i" },
    form: { $regex: `^${escapeRegex((form || "").trim())}$`, $options: "i" },
  }).lean();

  if (existing) {
    return res.json({ ...existing, id: existing._id, alreadyExists: true });
  }

  const medicine = await Medicine.create({
    _id: randomUUID(),
    name: name.trim(),
    dci: dci?.trim() || "",
    category: category?.trim() || "",
    form: form?.trim() || "",
    brand: brand?.trim() || "",
    requiresPrescription: !!requiresPrescription,
    description: description?.trim() || "",
    imageUrl: imageUrl?.trim() || "",
    usage: usage?.trim() || "",
    contraindications: contraindications?.trim() || "",
    sideEffects: sideEffects?.trim() || "",
  });

  res.status(201).json({ ...medicine.toObject(), id: medicine._id });
});

module.exports = router;
