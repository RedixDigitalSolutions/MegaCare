const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "megacare_secret_key";

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

// GET /api/admin/users
router.get("/users", adminAuth, async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } })
    .select("-password")
    .lean();
  res.json(users.map((u) => ({ ...u, id: u._id })));
});

// PATCH /api/admin/users/:id/approve
router.patch("/users/:id/approve", adminAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true },
  )
    .select("-password")
    .lean();
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ message: "Compte approuvé", user: { ...user, id: user._id } });
});

// PATCH /api/admin/users/:id/reject
router.patch("/users/:id/reject", adminAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "rejected" },
    { new: true },
  )
    .select("-password")
    .lean();
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ message: "Compte rejeté", user: { ...user, id: user._id } });
});

module.exports = router;
