const express = require("express");
const router = express.Router();
const { randomUUID } = require("crypto");
const ParamedicalCatalog = require("../models/ParamedicalCatalog");
const authMiddleware = require("../middleware/auth");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/paramedical-catalog/popular — top items for empty search state
router.get("/popular", async (req, res) => {
  try {
    const category = String(req.query.category || "").trim();
    const filter = category ? { category: { $regex: `^${escapeRegex(category)}$`, $options: "i" } } : {};
    const results = await ParamedicalCatalog.find(filter)
      .sort({ name: 1 })
      .limit(20)
      .lean();
    res.json(results.map((m) => ({ ...m, id: m._id })));
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/paramedical-catalog/search?q=...&category=... — real-time autocomplete
router.get("/search", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const category = String(req.query.category || "").trim();
    if (!q) return res.json([]);

    const words = q.split(/\s+/).filter((w) => w.length >= 1);
    if (words.length === 0) return res.json([]);

    const wordConditions = words.map((w) => {
      const regex = { $regex: escapeRegex(w), $options: "i" };
      return { $or: [{ name: regex }, { brand: regex }, { category: regex }] };
    });

    const filter = { $and: wordConditions };
    if (category) {
      filter.$and.push({ category: { $regex: `^${escapeRegex(category)}$`, $options: "i" } });
    }

    const results = await ParamedicalCatalog.find(filter)
      .limit(20)
      .lean();

    const qLower = q.toLowerCase();
    results.sort((a, b) => {
      const aPfx = a.name.toLowerCase().startsWith(qLower) ? 0 : 1;
      const bPfx = b.name.toLowerCase().startsWith(qLower) ? 0 : 1;
      if (aPfx !== bPfx) return aPfx - bPfx;
      return a.name.localeCompare(b.name);
    });

    res.json(results.map((m) => ({ ...m, id: m._id })));
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET /api/paramedical-catalog/:id
router.get("/:id", async (req, res) => {
  const item = await ParamedicalCatalog.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ message: "Produit non trouvé" });
  res.json({ ...item, id: item._id });
});

// POST /api/paramedical-catalog — create new global catalog entry
router.post("/", authMiddleware, async (req, res) => {
  const { name, brand, category, prescription, description, imageUrl, shortDesc, usage } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Nom du produit requis" });

  const existing = await ParamedicalCatalog.findOne({
    name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" },
    brand: { $regex: `^${escapeRegex((brand || "").trim())}$`, $options: "i" },
  }).lean();

  if (existing) {
    return res.json({ ...existing, id: existing._id, alreadyExists: true });
  }

  const item = await ParamedicalCatalog.create({
    _id: randomUUID(),
    name: name.trim(),
    brand: brand?.trim() || "",
    category: category?.trim() || "",
    prescription: !!prescription,
    description: description?.trim() || "",
    imageUrl: imageUrl?.trim() || "",
    shortDesc: shortDesc?.trim() || "",
    usage: usage?.trim() || "",
  });

  res.status(201).json({ ...item.toObject(), id: item._id });
});

module.exports = router;
