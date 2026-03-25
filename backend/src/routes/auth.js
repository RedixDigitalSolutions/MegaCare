const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "megacare_secret_key";

// In-memory user store (shared via module-level variable)
if (!global._mcUsers) {
  global._mcUsers = [];
  // Seed default admin account
  bcrypt.hash("Admin@megacare2024", 10).then((hash) => {
    global._mcUsers.push({
      id: randomUUID(),
      name: "Admin MegaCare",
      firstName: "Admin",
      lastName: "MegaCare",
      email: "admin@megacare.tn",
      password: hash,
      role: "admin",
      status: "approved",
      phone: "",
    });
  });
}
const users = global._mcUsers;

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
    transportId,
    paramedicalId,
    companyName,
  } = req.body;

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
  const userRole = role || "patient";
  const parts = name.trim().split(" ");

  const user = {
    id: randomUUID(),
    name,
    firstName: firstName || parts[0] || "",
    lastName: lastName || parts.slice(1).join(" ") || "",
    email,
    password: hashedPassword,
    role: userRole,
    phone: phone || "",
    // Patients are approved immediately; all other roles require admin review
    status: userRole === "patient" ? "approved" : "pending",
    ...(specialization && { specialization }),
    ...(doctorId && { doctorId }),
    ...(pharmacyId && { pharmacyId }),
    ...(serviceId && { serviceId }),
    ...(labId && { labId }),
    ...(transportId && { transportId }),
    ...(paramedicalId && { paramedicalId }),
    ...(companyName && { companyName }),
  };

  users.push(user);

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

  const { password: _pw, ...safeUser } = user;
  res.status(201).json({ token, user: safeUser });
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
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  const { password: _pw, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

module.exports = router;
