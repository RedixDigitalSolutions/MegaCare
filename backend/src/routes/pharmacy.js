const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Product = require("../models/Product");
const Order = require("../models/Order");

// GET /api/pharmacy/products
router.get("/products", async (req, res) => {
  let filter = {};
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }
  if (req.query.category) {
    filter.category = { $regex: req.query.category, $options: "i" };
  }
  const result = await Product.find(filter).lean();
  res.json(result.map((p) => ({ ...p, id: p._id })));
});

// GET /api/pharmacy/products/:id
router.get("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id).lean();
  if (!product) return res.status(404).json({ message: "Produit non trouvé" });
  res.json({ ...product, id: product._id });
});

// POST /api/pharmacy/orders
router.post("/orders", authMiddleware, async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Au moins un article requis" });
  }
  const products = await Product.find({
    _id: { $in: items.map((i) => i.productId) },
  }).lean();
  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p._id === item.productId);
    return sum + (product ? product.price * (item.quantity || 1) : 0);
  }, 0);
  const order = await Order.create({
    _id: randomUUID(),
    userId: req.user.id,
    items,
    total: Math.round(total * 100) / 100,
    status: "pending",
  });
  res.status(201).json({ ...order.toObject(), id: order._id });
});

// GET /api/pharmacy/orders/:id
router.get("/orders/:id", authMiddleware, async (req, res) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) return res.status(404).json({ message: "Commande non trouvée" });
  if (order.userId !== req.user.id)
    return res.status(403).json({ message: "Accès refusé" });
  res.json({ ...order, id: order._id });
});

module.exports = router;
