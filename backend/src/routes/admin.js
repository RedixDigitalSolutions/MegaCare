const express = require("express");
const router = express.Router();
const User = require("../models/User");
const adminAuth = require("../middleware/adminAuth");

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

// PATCH /api/admin/users/:id/suspend
router.patch("/users/:id/suspend", adminAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "suspended" },
    { new: true },
  )
    .select("-password")
    .lean();
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ message: "Compte suspendu", user: { ...user, id: user._id } });
});

// PATCH /api/admin/users/:id/reactivate
router.patch("/users/:id/reactivate", adminAuth, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true },
  )
    .select("-password")
    .lean();
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ message: "Compte réactivé", user: { ...user, id: user._id } });
});

module.exports = router;
