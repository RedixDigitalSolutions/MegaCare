const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

// In-memory user store (shared via module-level variable)
if (!global._mcUsers) global._mcUsers = [];
const users = global._mcUsers;

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nom, email et mot de passe requis" });
  }
  if (users.find((u) => u.email === email)) {
    return res
      .status(409)
      .json({ message: "Un compte avec cet email existe déjà" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: randomUUID(),
    name,
    email,
    password: hashedPassword,
    role: role || "patient",
  };
  users.push(user);
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" },
  );
  res
    .status(201)
    .json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" },
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

module.exports = router;
