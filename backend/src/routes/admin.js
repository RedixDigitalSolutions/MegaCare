const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "megacare_secret_key";

// Admin-only middleware
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Non autorisé" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Accès réservé aux administrateurs" });
    }
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
};

// GET /api/admin/users — list all non-admin users
router.get("/users", adminAuth, (req, res) => {
  const users = (global._mcUsers || [])
    .filter((u) => u.role !== "admin")
    .map(({ password, ...u }) => u);
  res.json(users);
});

// PATCH /api/admin/users/:id/approve
router.patch("/users/:id/approve", adminAuth, (req, res) => {
  const user = (global._mcUsers || []).find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  user.status = "approved";
  const { password, ...safeUser } = user;
  res.json({ message: "Compte approuvé", user: safeUser });
});

// PATCH /api/admin/users/:id/reject
router.patch("/users/:id/reject", adminAuth, (req, res) => {
  const user = (global._mcUsers || []).find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  user.status = "rejected";
  const { password, ...safeUser } = user;
  res.json({ message: "Compte rejeté", user: safeUser });
});

module.exports = router;
