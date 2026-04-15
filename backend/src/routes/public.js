const express = require("express");
const router = express.Router();
const ParamedicalProduct = require("../models/ParamedicalProduct");
const MedicalEstablishment = require("../models/MedicalEstablishment");
const PublicLabCenter = require("../models/PublicLabCenter");

// GET /api/public/paramedical-products
router.get("/paramedical-products", async (req, res) => {
    let filter = {};
    if (req.query.search) {
        const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { name: { $regex: escaped, $options: "i" } },
            { brand: { $regex: escaped, $options: "i" } },
            { shortDesc: { $regex: escaped, $options: "i" } },
        ];
    }
    if (req.query.category && req.query.category !== "Tous") {
        filter.category = { $regex: String(req.query.category).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }
    const products = await ParamedicalProduct.find(filter).lean();
    res.json(products.map((p) => ({ ...p, id: p._id })));
});

// GET /api/public/establishments
router.get("/establishments", async (req, res) => {
    let filter = {};
    if (req.query.search) {
        const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { name: { $regex: escaped, $options: "i" } },
            { city: { $regex: escaped, $options: "i" } },
        ];
    }
    if (req.query.governorate) {
        filter.governorate = { $regex: String(req.query.governorate).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }
    if (req.query.type) {
        filter.type = req.query.type;
    }
    const items = await MedicalEstablishment.find(filter).lean();
    res.json(items.map((e) => ({ ...e, id: e._id })));
});

// GET /api/public/labs
router.get("/labs", async (req, res) => {
    let filter = {};
    if (req.query.search) {
        const escaped = String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filter.$or = [
            { name: { $regex: escaped, $options: "i" } },
            { city: { $regex: escaped, $options: "i" } },
        ];
    }
    if (req.query.governorate) {
        filter.governorate = { $regex: String(req.query.governorate).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }
    if (req.query.type) {
        filter.type = req.query.type;
    }
    const items = await PublicLabCenter.find(filter).lean();
    res.json(items.map((l) => ({ ...l, id: l._id })));
});

// GET /api/public/labs/:id
router.get("/labs/:id", async (req, res) => {
    const item = await PublicLabCenter.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Laboratoire non trouvé" });
    res.json({ ...item, id: item._id });
});

// GET /api/public/establishments/:id
router.get("/establishments/:id", async (req, res) => {
    const item = await MedicalEstablishment.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Établissement non trouvé" });
    res.json({ ...item, id: item._id });
});

// GET /api/public/paramedical-products/:id
router.get("/paramedical-products/:id", async (req, res) => {
    const item = await ParamedicalProduct.findById(req.params.id).lean();
    if (!item) return res.status(404).json({ message: "Produit non trouvé" });
    res.json({ ...item, id: item._id });
});

module.exports = router;
