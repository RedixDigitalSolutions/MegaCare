const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const User = require("../models/User");

// GET /api/users
router.get("/", authMiddleware, async (req, res) => {
  const users = await User.find().select("-password").lean();
  res.json(users.map((u) => ({ ...u, id: u._id })));
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
  const { password, id, email, ...updates } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  })
    .select("-password")
    .lean();
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  res.json({ ...user, id: user._id });
});

module.exports = router;
