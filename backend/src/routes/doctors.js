const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Doctor = require("../models/Doctor");
const User = require("../models/User");

// GET /api/doctors — returns doctors from User model (role=doctor)
router.get("/", async (req, res) => {
  let filter = { role: "doctor", status: "approved" };
  if (req.query.specialty) {
    filter.specialization = {
      $regex: String(req.query.specialty).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      ),
      $options: "i",
    };
  }
  if (req.query.governorate) {
    filter.governorate = {
      $regex: String(req.query.governorate).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&",
      ),
      $options: "i",
    };
  }
  const users = await User.find(filter).select("-password").lean();
  const result = users.map((u) => ({
    id: u._id,
    _id: u._id,
    name: `${u.firstName} ${u.lastName}`,
    specialty: u.specialization || "",
    governorate: u.governorate || "",
    location: u.location || u.governorate || "",
    phone: u.phone || "",
    email: u.email,
    avatar: u.avatar || "",
    doctorId: u.doctorId || "",
    certified: !!u.doctorId,
    videoConsultation: true,
    rating: u.rating || 4.5,
    reviews: u.reviewCount || 0,
    price: u.price || 50,
    distance: u.distance || 0,
    availability: u.availability || "",
  }));
  res.json(result);
});

// GET /api/doctors/:id — returns a single doctor from User model
router.get("/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: "doctor" })
    .select("-password")
    .lean();
  if (!user) return res.status(404).json({ message: "Médecin non trouvé" });
  res.json({
    id: user._id,
    _id: user._id,
    name: `${user.firstName} ${user.lastName}`,
    specialty: user.specialization || "",
    governorate: user.governorate || "",
    location: user.location || user.governorate || "",
    phone: user.phone || "",
    email: user.email,
    avatar: user.avatar || "",
    doctorId: user.doctorId || "",
    certified: !!user.doctorId,
    videoConsultation: true,
    rating: user.rating || 4.5,
    reviews: user.reviewCount || 0,
    price: user.price || 50,
    distance: user.distance || 0,
    availability: user.availability || "",
    bio: user.bio || "",
    experience: user.experience || "",
    education: user.education || [],
    languages: user.languages || ["Français", "Arabe"],
  });
});

// POST /api/doctors
router.post("/", authMiddleware, async (req, res) => {
  const { name, specialty, governorate, ...rest } = req.body;
  if (!name || !specialty) {
    return res.status(400).json({ message: "Nom et spécialité requis" });
  }
  const doctor = await Doctor.create({
    _id: randomUUID(),
    name,
    specialty,
    governorate,
    ...rest,
    userId: req.user.id,
  });
  res.status(201).json({ ...doctor.toObject(), id: doctor._id });
});

module.exports = router;
