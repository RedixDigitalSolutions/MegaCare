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
  if (req.query.delegation) {
    filter.delegation = {
      $regex: String(req.query.delegation).replace(
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
    delegation: u.delegation || "",
    location: u.location || u.delegation || u.governorate || "",
    phone: u.phone || "",
    email: u.email,
    avatar: u.avatar || "",
    imageUrl: u.avatar || "",
    doctorId: u.doctorId || "",
    certified: !!u.doctorId,
    videoConsultation: true,
    rating: u.rating || 4.5,
    reviews: u.reviewCount || 0,
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
    delegation: user.delegation || "",
    location: user.location || user.delegation || user.governorate || "",
    phone: user.phone || "",
    email: user.email,
    avatar: user.avatar || "",
    imageUrl: user.avatar || "",
    doctorId: user.doctorId || "",
    certified: !!user.doctorId,
    videoConsultation: true,
    rating: user.rating || 4.5,
    reviews: user.reviewCount || 0,
    distance: user.distance || 0,
    availability: user.availability || "",
    bio: user.bio || "",
    experience: user.experience || "",
    education: user.education || [],
    languages: user.languages || ["Français", "Arabe"],
    mapsUrl: user.mapsUrl || "",
  });
});

// GET /api/doctors/:id/booked-slots — returns booked date+time pairs for a doctor (no auth)
router.get("/:id/booked-slots", async (req, res) => {
  const Appointment = require("../models/Appointment");
  const filter = {
    doctorId: req.params.id,
    status: { $in: ["pending", "confirmed"] },
  };
  if (req.query.from || req.query.to) {
    filter.date = {};
    if (req.query.from) filter.date.$gte = new Date(req.query.from);
    if (req.query.to) filter.date.$lte = new Date(req.query.to);
  }
  const appts = await Appointment.find(filter).select("date time").lean();
  res.json(
    appts.map((a) => ({
      date:
        a.date instanceof Date
          ? a.date.toISOString().split("T")[0]
          : String(a.date).split("T")[0],
      time: a.time,
    })),
  );
});

// POST /api/doctors
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Réservé aux médecins" });
  }
  const { name, specialty, governorate } = req.body;
  if (!name || !specialty) {
    return res.status(400).json({ message: "Nom et spécialité requis" });
  }
  const doctor = await Doctor.create({
    _id: randomUUID(),
    name,
    specialty,
    governorate,
    userId: req.user.id,
  });
  res.status(201).json({ ...doctor.toObject(), id: doctor._id });
});

module.exports = router;
