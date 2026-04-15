const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");
const User = require("../models/User");
const { addToBlacklist } = require("../middleware/tokenBlacklist");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET environment variable is not set");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const {
    name,
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
    specialization,
    doctorId,
    pharmacyId,
    serviceId,
    labId,
    paramedicalId,
    companyName,
  } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Nom, email et mot de passe requis" });
  }
  // #6 — Password policy on registration
  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Le mot de passe doit contenir au moins 8 caractères" });
  }
  const existing = await User.findOne({ email });
  if (existing) {
    return res
      .status(409)
      .json({ message: "Un compte avec cet email existe déjà" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  // #8 — Whitelist allowed self-registration roles; block admin/lab_radiology
  const ALLOWED_REGISTRATION_ROLES = [
    "patient", "doctor", "pharmacist", "medical_service", "paramedical",
  ];
  const userRole = ALLOWED_REGISTRATION_ROLES.includes(role) ? role : "patient";
  const parts = name.trim().split(" ");

  const user = await User.create({
    _id: randomUUID(),
    name,
    firstName: firstName || parts[0] || "",
    lastName: lastName || parts.slice(1).join(" ") || "",
    email,
    password: hashedPassword,
    role: userRole,
    phone: phone || "",
    status: userRole === "patient" ? "approved" : "pending",
    ...(specialization && { specialization }),
    ...(doctorId && { doctorId }),
    ...(pharmacyId && { pharmacyId }),
    ...(serviceId && { serviceId }),
    ...(labId && { labId }),
    ...(paramedicalId && { paramedicalId }),
    ...(companyName && { companyName }),
  });

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

  const safeUser = user.toObject();
  delete safeUser.password;
  res.status(201).json({ token, user: { ...safeUser, id: safeUser._id } });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Email ou mot de passe incorrect" });
  }
  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  const safeUser = user.toObject();
  delete safeUser.password;
  res.json({ token, user: { ...safeUser, id: safeUser._id } });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const decoded = jwt.decode(token);
      const expiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + 7 * 24 * 60 * 60 * 1000;
      addToBlacklist(token, expiresAt);
    } catch {
      // ignore malformed tokens
    }
  }
  res.json({ message: "Logged out" });
});

const authMiddleware = require("../middleware/auth");

// GET /api/auth/profile
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  const safeUser = user.toObject();
  delete safeUser.password;
  res.json({ user: { ...safeUser, id: safeUser._id } });
});

// PATCH /api/auth/profile
router.patch("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  const { firstName, lastName, phone, email, specialization, avatar } =
    req.body;
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (phone !== undefined) user.phone = phone;
  if (specialization !== undefined) user.specialization = specialization;
  if (avatar !== undefined) user.avatar = avatar;
  if (email !== undefined && email !== user.email) {
    const taken = await User.findOne({ email, _id: { $ne: user._id } });
    if (taken)
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    user.email = email;
  }
  user.name = `${user.firstName} ${user.lastName}`.trim();
  await user.save();
  const safeUser = user.toObject();
  delete safeUser.password;
  res.json({ user: { ...safeUser, id: safeUser._id } });
});

// POST /api/auth/change-password
router.post("/change-password", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Mot de passe actuel et nouveau requis" });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({
      message: "Le nouveau mot de passe doit contenir au moins 8 caractères",
    });
  }
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    return res.status(401).json({ message: "Mot de passe actuel incorrect" });
  }
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Mot de passe modifié avec succès" });
});

module.exports = router;
