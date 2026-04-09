const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomUUID } = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "megacare_secret_key";

// In-memory user store (shared via module-level variable)
if (!global._mcUsers) {
  global._mcUsers = [];

  // Seed one demo account per role (all pre-approved)
  const seedUsers = [
    {
      name: "Admin MegaCare",
      firstName: "Admin",
      lastName: "MegaCare",
      email: "admin@megacare.tn",
      plainPassword: "Admin@megacare2024",
      role: "admin",
      phone: "",
    },
    {
      name: "Patient Demo",
      firstName: "Patient",
      lastName: "Demo",
      email: "patient@megacare.tn",
      plainPassword: "Patient@2024",
      role: "patient",
      phone: "20000001",
    },
    {
      name: "Dr. Demo Médecin",
      firstName: "Demo",
      lastName: "Médecin",
      email: "medecin@megacare.tn",
      plainPassword: "Medecin@2024",
      role: "doctor",
      phone: "20000002",
      specialization: "Médecine générale",
    },
    {
      name: "Labo Demo",
      firstName: "Labo",
      lastName: "Demo",
      email: "labo@megacare.tn",
      plainPassword: "Labo@2024",
      role: "lab_radiology",
      phone: "20000003",
      labId: "LAB-DEMO-001",
    },
    {
      name: "Pharmacie Demo",
      firstName: "Pharmacie",
      lastName: "Demo",
      email: "pharmacien@megacare.tn",
      plainPassword: "Pharmacien@2024",
      role: "pharmacy",
      phone: "20000004",
      pharmacyId: "PHARM-DEMO-001",
    },
    {
      name: "Paramédical Demo",
      firstName: "Paramédical",
      lastName: "Demo",
      email: "paramedical@megacare.tn",
      plainPassword: "Paramedical@2024",
      role: "paramedical",
      phone: "20000005",
      paramedicalId: "PARA-DEMO-001",
    },
    {
      name: "Service Médical Demo",
      firstName: "Service",
      lastName: "Médical",
      email: "service@megacare.tn",
      plainPassword: "Service@2024",
      role: "medical_service",
      phone: "20000006",
      serviceId: "SVC-DEMO-001",
    },
  ];

  Promise.all(
    seedUsers.map(async ({ plainPassword, ...rest }) => {
      const password = await bcrypt.hash(plainPassword, 10);
      global._mcUsers.push({
        id: randomUUID(),
        ...rest,
        password,
        status: "approved",
      });
    }),
  );
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

// PATCH /api/auth/profile — update own basic info (requires auth)
const authMiddleware = require("../middleware/auth");
router.patch("/profile", authMiddleware, async (req, res) => {
  const user = (global._mcUsers || []).find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
  const { firstName, lastName, phone } = req.body;
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (phone !== undefined) user.phone = phone;
  user.name = `${user.firstName} ${user.lastName}`.trim();
  const { password: _pw, ...safeUser } = user;
  res.json({ user: safeUser });
});

module.exports = router;
