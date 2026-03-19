const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

if (!global._mcUsers) global._mcUsers = [];
const users = global._mcUsers;

// GET /api/users  (admin only in production; open for now)
router.get("/", authMiddleware, (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json(safeUsers);
});

// GET /api/users/:id
router.get("/:id", authMiddleware, (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

// PUT /api/users/:id
router.put("/:id", authMiddleware, (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  const idx = users.findIndex((u) => u.id === req.params.id);
  if (idx === -1)
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  const { password, id, email, ...updates } = req.body;
  users[idx] = { ...users[idx], ...updates };
  const { password: _pw, ...safeUser } = users[idx];
  res.json(safeUser);
});

module.exports = router;
