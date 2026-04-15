const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

// GET /api/users
router.get("/", authMiddleware, async (req, res) => {
  if (!["admin", "doctor"].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);
  res.json({
    data: users.map((u) => ({ ...u, id: u._id })),
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  });
});

// GET /api/users/:id
router.get("/:id", authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password").lean();
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ ...user, id: user._id });
});

// PUT /api/users/:id
router.put("/:id", authMiddleware, async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  const { password, id, email, role, status, ...updates } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  })
    .select("-password")
    .lean();
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ ...user, id: user._id });
});

module.exports = router;
