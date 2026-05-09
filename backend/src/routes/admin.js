const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { randomUUID } = require("crypto");
const User = require("../models/User");
const Newsletter = require("../models/Newsletter");
const Testimonial = require("../models/Testimonial");
const ParamedicalServiceProvider = require("../models/ParamedicalServiceProvider");
const adminAuth = require("../middleware/adminAuth");

// ── Multer: paramedical agent photo upload ────────────────────────────────────
const PARAMEDIC_UPLOAD_DIR = path.join(__dirname, "../uploads/paramedical-services");

const paramedicalPhotoStorage = multer.diskStorage({
  destination: PARAMEDIC_UPLOAD_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `agent-${randomUUID()}${ext}`);
  },
});

const paramedicalPhotoUpload = multer({
  storage: paramedicalPhotoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error("Format non supporté. Utilisez JPG, PNG, WEBP ou AVIF."));
  },
});

/** Delete a locally stored paramedical avatar (if it lives in our upload folder). */
function deleteLocalAvatar(avatarPath) {
  if (!avatarPath || !avatarPath.startsWith("/uploads/paramedical-services/")) return;
  const abs = path.join(__dirname, "..", avatarPath);
  fs.unlink(abs, () => {}); // fire-and-forget; ignore "not found" errors
}

// GET /api/admin/stats — aggregated stats for charts
router.get("/stats", adminAuth, async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } }).select("role status gender").lean();
  const roles = {};
  const genders = { male: 0, female: 0, other: 0 };
  const statuses = { pending: 0, approved: 0, rejected: 0, suspended: 0 };
  for (const u of users) {
    roles[u.role] = (roles[u.role] || 0) + 1;
    if (u.gender === "male") genders.male++;
    else if (u.gender === "female") genders.female++;
    else genders.other++;
    if (statuses[u.status] !== undefined) statuses[u.status]++;
  }
  res.json({ total: users.length, roles, genders, statuses });
});

// GET /api/admin/newsletter — list all subscribers
router.get("/newsletter", adminAuth, async (req, res) => {
    const { search, page = 1, limit = 50 } = req.query;
    const filter = search ? { email: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [subscribers, total] = await Promise.all([
        Newsletter.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean(),
        Newsletter.countDocuments(filter),
    ]);
    res.json({ subscribers, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});

// DELETE /api/admin/newsletter/:id — remove a subscriber
router.delete("/newsletter/:id", adminAuth, async (req, res) => {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ message: "Abonné supprimé" });
});

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

// ── Testimonials ──────────────────────────────────────────────────────────────

// GET /api/admin/testimonials
router.get("/testimonials", adminAuth, async (req, res) => {
  const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 }).lean();
  res.json(testimonials.map((t) => ({ ...t, id: t._id })));
});

// POST /api/admin/testimonials
router.post("/testimonials", adminAuth, async (req, res) => {
  const { name, role, text, rating, location, avatar, imageUrl, visible, order } = req.body;
  if (!name || !role || !text) {
    return res.status(400).json({ message: "Nom, rôle et texte sont obligatoires" });
  }
  const testimonial = await Testimonial.create({
    name: String(name).trim().slice(0, 100),
    role: String(role).trim().slice(0, 100),
    text: String(text).trim().slice(0, 1000),
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    location: String(location || "").trim().slice(0, 100),
    avatar: String(avatar || "").trim().slice(0, 10),
    imageUrl: String(imageUrl || "").trim().slice(0, 500),
    visible: visible !== false,
    order: Number(order) || 0,
  });
  res.status(201).json({ ...testimonial.toObject(), id: testimonial._id });
});

// PATCH /api/admin/testimonials/:id
router.patch("/testimonials/:id", adminAuth, async (req, res) => {
  const allowed = ["name", "role", "text", "rating", "location", "avatar", "imageUrl", "visible", "order"];
  const update = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = req.body[key];
  }
  if (update.name) update.name = String(update.name).trim().slice(0, 100);
  if (update.role) update.role = String(update.role).trim().slice(0, 100);
  if (update.text) update.text = String(update.text).trim().slice(0, 1000);
  if (update.location) update.location = String(update.location).trim().slice(0, 100);
  if (update.avatar) update.avatar = String(update.avatar).trim().slice(0, 10);
  if (update.imageUrl !== undefined) update.imageUrl = String(update.imageUrl).trim().slice(0, 500);
  if (update.rating) update.rating = Math.min(5, Math.max(1, Number(update.rating)));
  const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
  if (!testimonial) return res.status(404).json({ message: "Témoignage non trouvé" });
  res.json({ ...testimonial, id: testimonial._id });
});

// DELETE /api/admin/testimonials/:id
router.delete("/testimonials/:id", adminAuth, async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ message: "Témoignage supprimé" });
});

// ── Paramedical Service Providers (admin-only, no accounts) ──────────────────

// GET /api/admin/paramedical-service-providers
router.get("/paramedical-service-providers", adminAuth, async (req, res) => {
  const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const filter = {};
  if (req.query.search) {
    const s = escapeRegex(req.query.search);
    filter.$or = [
      { name: { $regex: s, $options: "i" } },
      { specialization: { $regex: s, $options: "i" } },
      { governorate: { $regex: s, $options: "i" } },
    ];
  }
  if (req.query.specialization) filter.specialization = { $regex: escapeRegex(req.query.specialization), $options: "i" };
  const providers = await ParamedicalServiceProvider.find(filter).sort({ name: 1 }).lean();
  res.json(providers.map((p) => ({ ...p, id: p._id })));
});

// POST /api/admin/paramedical-service-providers
router.post("/paramedical-service-providers", adminAuth, async (req, res) => {
  const { name, specialization, avatar, governorate, delegation, address, phone, email, openingHours, description } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ message: "Le nom est obligatoire" });
  const provider = await ParamedicalServiceProvider.create({
    name: String(name).trim().slice(0, 150),
    specialization: String(specialization || "").trim().slice(0, 100),
    avatar: String(avatar || "").trim().slice(0, 500),
    governorate: String(governorate || "").trim().slice(0, 100),
    delegation: String(delegation || "").trim().slice(0, 100),
    address: String(address || "").trim().slice(0, 300),
    phone: String(phone || "").trim().slice(0, 30),
    email: String(email || "").trim().slice(0, 200),
    openingHours: String(openingHours || "").trim().slice(0, 200),
    description: String(description || "").trim().slice(0, 1000),
  });
  res.status(201).json({ ...provider.toObject(), id: provider._id });
});

// PATCH /api/admin/paramedical-service-providers/:id
router.patch("/paramedical-service-providers/:id", adminAuth, async (req, res) => {
  const allowed = ["name", "specialization", "avatar", "governorate", "delegation", "address", "phone", "email", "openingHours", "description"];
  const update = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) update[key] = String(req.body[key]).trim().slice(0, key === "description" ? 1000 : 500);
  }
  if (!update.name && update.name !== undefined) return res.status(400).json({ message: "Le nom est obligatoire" });
  const provider = await ParamedicalServiceProvider.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
  if (!provider) return res.status(404).json({ message: "Prestataire non trouvé" });
  res.json({ ...provider, id: provider._id });
});

// POST /api/admin/paramedical-service-providers/:id/photo — upload / replace profile picture
router.post(
  "/paramedical-service-providers/:id/photo",
  adminAuth,
  (req, res, next) => {
    paramedicalPhotoUpload.single("photo")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      }
      if (err) {
        return res.status(400).json({ message: err.message || "Erreur d'upload" });
      }
      next();
    });
  },
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Aucun fichier reçu" });

    const provider = await ParamedicalServiceProvider.findById(req.params.id);
    if (!provider) {
      // Clean up the just-uploaded file
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ message: "Prestataire non trouvé" });
    }

    // Delete the old local avatar before overwriting
    deleteLocalAvatar(provider.avatar);

    const newAvatar = `/uploads/paramedical-services/${req.file.filename}`;
    provider.avatar = newAvatar;
    await provider.save();

    res.json({ ...provider.toObject(), id: provider._id, avatar: newAvatar });
  }
);

// DELETE /api/admin/paramedical-service-providers/:id
router.delete("/paramedical-service-providers/:id", adminAuth, async (req, res) => {
  const provider = await ParamedicalServiceProvider.findByIdAndDelete(req.params.id);
  if (!provider) return res.status(404).json({ message: "Prestataire non trouvé" });
  // Clean up uploaded photo if it was stored locally
  deleteLocalAvatar(provider.avatar);
  res.json({ message: "Prestataire supprimé" });
});

module.exports = router;
