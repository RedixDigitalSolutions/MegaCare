const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");

if (!global._mcProducts) {
  global._mcProducts = [
    {
      id: "1",
      name: "Paracétamol 500mg",
      category: "Analgésique",
      price: 2.5,
      stock: 100,
      requiresPrescription: false,
    },
    {
      id: "2",
      name: "Amoxicilline 500mg",
      category: "Antibiotique",
      price: 8.0,
      stock: 50,
      requiresPrescription: true,
    },
    {
      id: "3",
      name: "Ibuprofène 400mg",
      category: "Anti-inflammatoire",
      price: 3.5,
      stock: 75,
      requiresPrescription: false,
    },
    {
      id: "4",
      name: "Oméprazole 20mg",
      category: "Gastro-entérologie",
      price: 5.0,
      stock: 60,
      requiresPrescription: true,
    },
    {
      id: "5",
      name: "Metformine 500mg",
      category: "Diabétologie",
      price: 4.0,
      stock: 80,
      requiresPrescription: true,
    },
  ];
}
if (!global._mcOrders) global._mcOrders = [];
const products = global._mcProducts;
const orders = global._mcOrders;

// GET /api/pharmacy/products
router.get("/products", (req, res) => {
  let result = products;
  if (req.query.search) {
    result = result.filter((p) =>
      p.name.toLowerCase().includes(req.query.search.toLowerCase()),
    );
  }
  if (req.query.category) {
    result = result.filter((p) =>
      p.category?.toLowerCase().includes(req.query.category.toLowerCase()),
    );
  }
  res.json(result);
});

// GET /api/pharmacy/products/:id
router.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Produit non trouvé" });
  res.json(product);
});

// POST /api/pharmacy/orders  (requires auth)
router.post("/orders", authMiddleware, (req, res) => {
  const { items, deliveryAddress } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Au moins un article requis" });
  }
  const total = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product ? product.price * (item.quantity || 1) : 0);
  }, 0);
  const order = {
    id: randomUUID(),
    userId: req.user.id,
    items,
    deliveryAddress: deliveryAddress || "",
    total: Math.round(total * 100) / 100,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  res.status(201).json(order);
});

// GET /api/pharmacy/orders/:id
router.get("/orders/:id", authMiddleware, (req, res) => {
  const order = orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ message: "Commande non trouvée" });
  if (order.userId !== req.user.id)
    return res.status(403).json({ message: "Accès refusé" });
  res.json(order);
});

module.exports = router;
