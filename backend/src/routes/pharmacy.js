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
    const regex = { $regex: escapeRegex(String(req.query.search)), $options: "i" };
    filter.$or = [{ name: regex }, { dci: regex }, { brand: regex }];
  }
  if (req.query.category) {
    filter.category = { $regex: escapeRegex(String(req.query.category)), $options: "i" };
  }
  if (req.query.pharmacyId) {
    filter.pharmacyId = String(req.query.pharmacyId);
  }
  if (req.query.pharmacy) {
    filter.pharmacy = { $regex: escapeRegex(String(req.query.pharmacy)), $options: "i" };
  }
  const [result, total] = await Promise.all([
    Product.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  // Populate pharmacy name from User model
  const pharmacyIds = [...new Set(result.map((p) => p.pharmacyId).filter(Boolean))];
  let pharmacyMap = {};
  if (pharmacyIds.length > 0) {
    const pharmacyUsers = await User.find({ _id: { $in: pharmacyIds } }).lean();
    pharmacyMap = Object.fromEntries(
      pharmacyUsers.map((u) => [u._id, u.companyName || `${u.firstName} ${u.lastName}`])
    );
  }

  res.json({
    data: result.map((p) => ({
      ...p,
      id: p._id,
      pharmacy: p.pharmacyId ? (pharmacyMap[p.pharmacyId] || p.pharmacy || "") : (p.pharmacy || ""),
    })),
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
  const { items, pharmacyId: requestedPharmacyId, deliveryMethod, deliveryAddress, deliveryGovernorate, deliveryDelegation, deliveryPhone } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Au moins un article requis" });
  }
  if (!["pickup", "delivery"].includes(deliveryMethod)) {
    return res.status(400).json({ message: "Méthode de livraison invalide" });
  }
  const products = await Product.find({
    _id: { $in: items.map((i) => i.productId) },
  }).lean();
  if (products.length === 0) {
    return res.status(400).json({ message: "Produits introuvables" });
  }
  // Use pharmacy from request body if provided, otherwise from products
  let pharmacyId = requestedPharmacyId;
  if (!pharmacyId) {
    pharmacyId = String(products[0].pharmacyId);
    if (!pharmacyId || products.some((p) => String(p.pharmacyId) !== pharmacyId)) {
      return res.status(400).json({ message: "Veuillez sélectionner une pharmacie" });
    }
  }
  // Verify pharmacy exists
  const pharmacy = await User.findOne({ _id: pharmacyId, role: "pharmacy", status: "approved" });
  if (!pharmacy) {
    return res.status(400).json({ message: "Pharmacie introuvable" });
  }
  const DELIVERY_FEE = 8;
  const itemsTotal = items.reduce((sum, item) => {
    const product = products.find((p) => String(p._id) === String(item.productId));
    return sum + (product ? product.price * (item.quantity || 1) : 0);
  }, 0);
  const deliveryFee = deliveryMethod === "delivery" ? DELIVERY_FEE : 0;
  const total = itemsTotal + deliveryFee;
  const enrichedItems = items.map((item) => {
    const product = products.find((p) => String(p._id) === String(item.productId));
    return { productId: item.productId, name: item.name || product?.name || "", price: product?.price || 0, quantity: item.quantity || 1 };
  });

  // Generate unique alphanumeric order code
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let orderCode;
  for (let attempt = 0; attempt < 10; attempt++) {
    orderCode = "";
    for (let i = 0; i < 8; i++) orderCode += chars[Math.floor(Math.random() * chars.length)];
    const exists = await Order.findOne({ orderCode });
    if (!exists) break;
  }

  const order = await Order.create({
    _id: randomUUID(),
    userId: req.user.id,
    pharmacyId,
    orderCode,
    items: enrichedItems,
    total: Math.round(total * 100) / 100,
    deliveryFee,
    deliveryMethod,
    deliveryAddress: deliveryAddress || "",
    deliveryGovernorate: deliveryGovernorate || "",
    deliveryDelegation: deliveryDelegation || "",
    deliveryPhone: deliveryPhone || "",
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
  const pharmacyId = req.user.id;

  const [totalStock, pendingOrdersCount, completedOrders, lowStockProducts, pendingOrders] =
    await Promise.all([
      Product.countDocuments({ pharmacyId }),
      Order.countDocuments({ pharmacyId, status: "pending" }),
      Order.find({ pharmacyId, status: "completed", createdAt: { $gte: startOfMonth } }).lean(),
      Product.find({ pharmacyId, stock: { $lt: 20 } }).sort({ stock: 1 }).limit(6).lean(),
      Order.find({ pharmacyId, status: "pending" }).sort({ createdAt: -1 }).limit(4).lean(),
    ]);

  const revenue = completedOrders.reduce((s, o) => s + (o.total || 0), 0);
  const lowStockCount = await Product.countDocuments({ pharmacyId, stock: { $lt: 20 } });

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
    Order.find({ pharmacyId: req.user.id, status: "completed", createdAt: { $gte: startDate } }).lean(),
    Order.find({ pharmacyId: req.user.id, status: "completed", createdAt: { $gte: prevStart, $lt: prevEnd } }).lean(),
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

// POST /api/pharmacy/products
router.post("/products", authMiddleware, pharmacyGuard, async (req, res) => {
  const { medicineId, name, category, price, stock, requiresPrescription, form, brand, dci, description, imageUrl, usage, contraindications, sideEffects } = req.body;
  if (!name?.trim()) return res.status(400).json({ message: "Nom du produit requis" });
  if (price == null || isNaN(price) || price < 0) return res.status(400).json({ message: "Prix invalide" });

  // Check if this pharmacy already has this medicine in stock (prevent duplicates)
  if (medicineId) {
    const existing = await Product.findOne({ medicineId, pharmacyId: req.user.id }).lean();
    if (existing) return res.status(409).json({ message: "Ce médicament est déjà dans votre stock", product: { ...existing, id: existing._id } });
  }

  // Look up pharmacy name for the product
  const pharmacyUser = await User.findById(req.user.id).lean();
  const pharmacyName = pharmacyUser?.companyName || `${pharmacyUser?.firstName || ""} ${pharmacyUser?.lastName || ""}`.trim() || "Pharmacie";

  const product = await Product.create({
    _id: randomUUID(),
    medicineId: medicineId || "",
    pharmacyId: req.user.id,
    name: name.trim(),
    category: category?.trim() || "",
    price: Number(price),
    stock: Math.max(0, parseInt(stock) || 0),
    requiresPrescription: !!requiresPrescription,
    form: form?.trim() || "",
    brand: brand?.trim() || "",
    dci: dci?.trim() || "",
    description: description?.trim() || "",
    imageUrl: imageUrl?.trim() || "",
    pharmacy: pharmacyName,
    usage: usage?.trim() || "",
    contraindications: contraindications?.trim() || "",
    sideEffects: sideEffects?.trim() || "",
  });
  res.status(201).json({ ...product.toObject(), id: product._id });
});

// PUT /api/pharmacy/products/:id
router.put("/products/:id", authMiddleware, pharmacyGuard, async (req, res) => {
  const allowed = ["name", "category", "price", "stock", "requiresPrescription", "form", "brand", "dci", "description", "imageUrl", "usage", "contraindications", "sideEffects"];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      if (key === "price") updates[key] = Number(req.body[key]);
      else if (key === "stock") updates[key] = Math.max(0, parseInt(req.body[key]) || 0);
      else if (key === "requiresPrescription") updates[key] = !!req.body[key];
      else updates[key] = typeof req.body[key] === "string" ? req.body[key].trim() : req.body[key];
    }
  }
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true }).lean();
  if (!product) return res.status(404).json({ message: "Produit non trouvé" });
  res.json({ ...product, id: product._id });
});

// PATCH /api/pharmacy/products/:id/stock
router.patch("/products/:id/stock", authMiddleware, pharmacyGuard, async (req, res) => {
  const { stock: newStock } = req.body;
  if (newStock == null || isNaN(newStock) || newStock < 0) return res.status(400).json({ message: "Quantité invalide" });
  const product = await Product.findByIdAndUpdate(req.params.id, { stock: parseInt(newStock) }, { new: true }).lean();
  if (!product) return res.status(404).json({ message: "Produit non trouvé" });
  res.json({ ...product, id: product._id });
});

// DELETE /api/pharmacy/products/:id
router.delete("/products/:id", authMiddleware, pharmacyGuard, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: "Produit non trouvé" });
  res.json({ message: "Produit supprimé" });
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

// ── Dashboard: Patient Orders ─────────────────────────────────

// GET /api/pharmacy/patient-orders — list all patient orders for this pharmacy
router.get("/patient-orders", authMiddleware, pharmacyGuard, async (req, res) => {
  const orders = await Order.find({ pharmacyId: req.user.id })
    .sort({ createdAt: -1 })
    .lean();
  const userIds = [...new Set(orders.map((o) => o.userId))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("firstName lastName phone governorate delegation")
    .lean();
  const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));
  const enriched = orders.map((o) => {
    const patient = userMap[o.userId];
    return {
      ...o,
      id: o._id,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Patient",
      patientPhone: patient?.phone || "",
      patientGovernorate: patient?.governorate || "",
      patientDelegation: patient?.delegation || "",
    };
  });
  res.json(enriched);
});

// GET /api/pharmacy/patient-orders/search?q=... — search by order code or patient name
router.get("/patient-orders/search", authMiddleware, pharmacyGuard, async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Search by order code (exact or partial)
  const codeOrders = await Order.find({
    pharmacyId: req.user.id,
    orderCode: { $regex: escapeRegex(q), $options: "i" },
  }).lean();

  // Search by patient name
  const nameRegex = new RegExp(escapeRegex(q), "i");
  const matchedUsers = await User.find({
    $or: [{ firstName: nameRegex }, { lastName: nameRegex }],
  }).select("_id").lean();
  const matchedUserIds = matchedUsers.map((u) => String(u._id));
  const nameOrders = matchedUserIds.length > 0
    ? await Order.find({ pharmacyId: req.user.id, userId: { $in: matchedUserIds } }).lean()
    : [];

  // Merge and deduplicate
  const allMap = {};
  [...codeOrders, ...nameOrders].forEach((o) => { allMap[o._id] = o; });
  const merged = Object.values(allMap).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Enrich with patient names
  const userIds = [...new Set(merged.map((o) => o.userId))];
  const users = await User.find({ _id: { $in: userIds } })
    .select("firstName lastName phone")
    .lean();
  const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]));
  res.json(merged.map((o) => {
    const patient = userMap[o.userId];
    return {
      ...o,
      id: o._id,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : "Patient",
      patientPhone: patient?.phone || "",
    };
  }));
});

// PATCH /api/pharmacy/patient-orders/:id — update order status
router.patch("/patient-orders/:id", authMiddleware, pharmacyGuard, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "confirmed", "ready", "completed", "cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Statut invalide" });
  }
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: "Commande non trouvée" });
  if (order.pharmacyId !== req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  order.status = status;
  await order.save();
  res.json({ ...order.toObject(), id: order._id });
});

// GET /api/pharmacy/settings
router.get("/settings", authMiddleware, pharmacyGuard, async (req, res) => {
  const u = await User.findById(req.user.id).select("-password").lean();
  if (!u) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({
    id: u._id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    phone: u.phone || "",
    companyName: u.companyName || "",
    address: u.address || "",
    coordinates: u.coordinates || null,
    wilaya: u.wilaya || "",
    city: u.city || "",
    governorate: u.governorate || "",
    delegation: u.delegation || "",
    mapsUrl: u.mapsUrl || "",
    openingHours: u.openingHours || "",
    isOnDuty: u.isOnDuty || false,
    description: u.description || "",
    avatar: u.avatar || "",
    pharmacyId: u.pharmacyId || "",
  });
});

// PUT /api/pharmacy/settings
router.put("/settings", authMiddleware, pharmacyGuard, async (req, res) => {
  const allowed = [
    "firstName", "lastName", "phone", "companyName", "address",
    "wilaya", "city", "governorate", "delegation", "mapsUrl",
    "openingHours", "isOnDuty", "description", "avatar",
  ];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      if (key === "isOnDuty") updates[key] = !!req.body[key];
      else updates[key] = typeof req.body[key] === "string" ? req.body[key].trim() : req.body[key];
    }
  }
  if (req.body.coordinates && typeof req.body.coordinates === "object") {
    const lat = parseFloat(req.body.coordinates.lat);
    const lng = parseFloat(req.body.coordinates.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      updates.coordinates = { lat, lng };
    }
  }
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password").lean();
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
    companyName: user.companyName || "",
    address: user.address || "",
    coordinates: user.coordinates || null,
    wilaya: user.wilaya || "",
    city: user.city || "",
    governorate: user.governorate || "",
    delegation: user.delegation || "",
    mapsUrl: user.mapsUrl || "",
    openingHours: user.openingHours || "",
    isOnDuty: user.isOnDuty || false,
    description: user.description || "",
    avatar: user.avatar || "",
    pharmacyId: user.pharmacyId || "",
  });
});

module.exports = router;
