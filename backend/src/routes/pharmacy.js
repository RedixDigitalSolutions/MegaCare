const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Product = require("../models/Product");
const Order = require("../models/Order");
const SupplierOrder = require("../models/SupplierOrder");
const User = require("../models/User");

function pharmacyGuard(req, res, next) {
  if (req.user.role !== "pharmacy")
    return res.status(403).json({ message: "Accès refusé" });
  next();
}

// GET /api/pharmacy/products
router.get("/products", async (req, res) => {
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  let filter = {};
  if (req.query.search) {
    filter.name = { $regex: escapeRegex(String(req.query.search)), $options: "i" };
  }
  if (req.query.category) {
    filter.category = { $regex: escapeRegex(String(req.query.category)), $options: "i" };
  }
  const [result, total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);
  res.json({
    data: result.map((p) => ({ ...p, id: p._id })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
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

// GET /api/pharmacy/kpis
router.get("/kpis", authMiddleware, pharmacyGuard, async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalStock, pendingOrdersCount, completedOrders, lowStockProducts, pendingOrders] =
    await Promise.all([
      Product.countDocuments(),
      Order.countDocuments({ status: "pending" }),
      Order.find({ status: "completed", createdAt: { $gte: startOfMonth } }).lean(),
      Product.find({ stock: { $lt: 20 } }).sort({ stock: 1 }).limit(6).lean(),
      Order.find({ status: "pending" }).sort({ createdAt: -1 }).limit(4).lean(),
    ]);

  const revenue = completedOrders.reduce((s, o) => s + (o.total || 0), 0);
  const lowStockCount = await Product.countDocuments({ stock: { $lt: 20 } });

  // Enrich pending orders with customer names
  const userIds = [...new Set(pendingOrders.map((o) => o.userId))];
  const users = await User.find({ _id: { $in: userIds } }).lean();
  const userMap = Object.fromEntries(users.map((u) => [u._id, `${u.firstName} ${u.lastName}`]));

  const pendingList = pendingOrders.map((o) => ({
    id: o._id,
    customer: userMap[o.userId] || "Patient",
    items: Array.isArray(o.items) ? o.items.length : 0,
    total: o.total || 0,
    orderDate: new Date(o.createdAt).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "En attente",
  }));

  const lowStockList = lowStockProducts.map((p) => ({
    name: p.name,
    current: p.stock,
    minimum: 20,
  }));

  // Top selling from completed orders this month
  const medicineMap = {};
  for (const order of completedOrders) {
    for (const item of order.items || []) {
      const key = item.name || item.productId || "Inconnu";
      if (!medicineMap[key]) medicineMap[key] = { name: key, sold: 0, revenue: 0 };
      medicineMap[key].sold += item.quantity || 1;
      medicineMap[key].revenue += (item.price || 0) * (item.quantity || 1);
    }
  }
  const topSelling = Object.values(medicineMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((m, i) => ({
      rank: i + 1,
      name: m.name,
      sold: m.sold,
      revenue: Math.round(m.revenue * 100) / 100,
    }));

  res.json({
    totalStock,
    pendingOrdersCount,
    revenue: Math.round(revenue * 100) / 100,
    lowStockCount,
    pendingOrders: pendingList,
    lowStockProducts: lowStockList,
    topSelling,
  });
});

// GET /api/pharmacy/sales
router.get("/sales", authMiddleware, pharmacyGuard, async (req, res) => {
  const period = req.query.period || "Ce mois";
  const now = new Date();

  let startDate, prevStart, prevEnd;
  let chartLabels;

  if (period === "Ce mois") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    prevEnd = startDate;
    chartLabels = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  } else if (period === "3 mois") {
    startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    prevStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    prevEnd = startDate;
    chartLabels = [
      new Date(now.getFullYear(), now.getMonth() - 2, 1).toLocaleString("fr-FR", { month: "short" }),
      new Date(now.getFullYear(), now.getMonth() - 1, 1).toLocaleString("fr-FR", { month: "short" }),
      new Date(now.getFullYear(), now.getMonth(), 1).toLocaleString("fr-FR", { month: "short" }),
      "", "", "", "",
    ];
  } else if (period === "6 mois") {
    startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    prevStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    prevEnd = startDate;
    chartLabels = Array.from({ length: 6 }, (_, i) =>
      new Date(now.getFullYear(), now.getMonth() - 5 + i, 1).toLocaleString("fr-FR", { month: "short" })
    ).concat([""]);
  } else {
    startDate = new Date(now.getFullYear(), 0, 1);
    prevStart = new Date(now.getFullYear() - 1, 0, 1);
    prevEnd = startDate;
    chartLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul"];
  }

  const [currentOrders, prevOrders] = await Promise.all([
    Order.find({ status: "completed", createdAt: { $gte: startDate } }).lean(),
    Order.find({ status: "completed", createdAt: { $gte: prevStart, $lt: prevEnd } }).lean(),
  ]);

  const calcStats = (orders) => ({
    revenue: Math.round(orders.reduce((s, o) => s + (o.total || 0), 0) * 100) / 100,
    count: orders.length,
    customers: new Set(orders.map((o) => o.userId)).size,
  });

  const curr = calcStats(currentOrders);
  const prev = calcStats(prevOrders);

  const pct = (c, p) => (p === 0 ? 0 : Math.round(((c - p) / p) * 100));

  // Chart bars – aggregate revenue per bar bucket
  const barValues = chartLabels.map((label, idx) => {
    if (!label) return { label, value: 0 };
    let bucketStart, bucketEnd;
    if (period === "Ce mois") {
      // Group by weekday Mon-Sun of most recent full week
      const monday = new Date(now);
      monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      bucketStart = new Date(monday);
      bucketStart.setDate(monday.getDate() + idx);
      bucketEnd = new Date(bucketStart);
      bucketEnd.setDate(bucketStart.getDate() + 1);
    } else {
      // Group by month
      const monthOffset = period === "3 mois" ? now.getMonth() - 2 + idx
        : period === "6 mois" ? now.getMonth() - 5 + idx
          : idx;
      bucketStart = new Date(now.getFullYear(), monthOffset, 1);
      bucketEnd = new Date(now.getFullYear(), monthOffset + 1, 1);
    }
    const val = currentOrders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d >= bucketStart && d < bucketEnd;
      })
      .reduce((s, o) => s + (o.total || 0), 0);
    return { label, value: Math.round(val * 100) / 100 };
  });

  // Top medicines from order items
  const medicineMap = {};
  for (const order of currentOrders) {
    for (const item of order.items || []) {
      const key = item.name || item.productId || "Inconnu";
      if (!medicineMap[key]) medicineMap[key] = { name: key, qty: 0, revenue: 0 };
      medicineMap[key].qty += item.quantity || 1;
      medicineMap[key].revenue += (item.price || 0) * (item.quantity || 1);
    }
  }
  const topMedicines = Object.values(medicineMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map((m, i) => ({ rank: i + 1, name: m.name, qty: m.qty, revenue: Math.round(m.revenue * 100) / 100, growth: 0 }));

  res.json({
    revenue: curr.revenue,
    orders: curr.count,
    customers: curr.customers,
    avgOrder: curr.count > 0 ? Math.round((curr.revenue / curr.count) * 100) / 100 : 0,
    revenueGrowth: pct(curr.revenue, prev.revenue),
    ordersGrowth: pct(curr.count, prev.count),
    customersGrowth: pct(curr.customers, prev.customers),
    avgGrowth: 0,
    chartBars: barValues,
    topMedicines,
  });
});

// GET /api/pharmacy/supplier-orders
router.get("/supplier-orders", authMiddleware, pharmacyGuard, async (req, res) => {
  const orders = await SupplierOrder.find().sort({ createdAt: -1 }).lean();
  res.json(orders.map((o) => ({ ...o, id: o._id })));
});

// POST /api/pharmacy/supplier-orders
router.post("/supplier-orders", authMiddleware, pharmacyGuard, async (req, res) => {
  const { ref, supplier, date, expectedDate, items, total, status } = req.body;
  if (!supplier?.trim())
    return res.status(400).json({ message: "Fournisseur requis" });
  const order = await SupplierOrder.create({
    _id: randomUUID(),
    ref: ref || `ORD-F-${Date.now()}`,
    supplier,
    date: date || new Date().toISOString().slice(0, 10),
    expectedDate: expectedDate || null,
    items: items || [],
    total: total || 0,
    status: status || "En attente",
  });
  res.status(201).json({ ...order.toObject(), id: order._id });
});

// PUT /api/pharmacy/supplier-orders/:id
router.put("/supplier-orders/:id", authMiddleware, pharmacyGuard, async (req, res) => {
  const order = await SupplierOrder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).lean();
  if (!order) return res.status(404).json({ message: "Commande non trouvée" });
  res.json({ ...order, id: order._id });
});

module.exports = router;
