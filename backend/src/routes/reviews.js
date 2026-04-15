const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { randomUUID } = require("crypto");
const Review = require("../models/Review");
const User = require("../models/User");

// GET /api/reviews — doctor gets own reviews, patient gets their submitted reviews
router.get("/", authMiddleware, async (req, res) => {
    const query =
        req.user.role === "doctor"
            ? { doctorId: req.user.id }
            : { patientId: req.user.id };
    const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
    res.json(reviews.map((r) => ({ ...r, id: r._id })));
});

// POST /api/reviews — patient submits a review for a doctor
router.post("/", authMiddleware, async (req, res) => {
    if (req.user.role !== "patient") {
        return res
            .status(403)
            .json({ message: "Seuls les patients peuvent soumettre un avis" });
    }
    const { doctorId, rating, text, type } = req.body;
    if (!doctorId || !rating || !text) {
        return res
            .status(400)
            .json({ message: "doctorId, rating et text requis" });
    }
    const patientUser = await User.findById(req.user.id).lean();
    const patientName = patientUser
        ? `${patientUser.firstName || ""} ${patientUser.lastName || ""}`.trim()
        : "";
    const review = await Review.create({
        _id: randomUUID(),
        doctorId,
        patientId: req.user.id,
        patientName,
        rating: Number(rating),
        text,
        type: type || "Vidéo",
        helpful: 0,
    });
    res.status(201).json({ ...review.toObject(), id: review._id });
});

// PATCH /api/reviews/:id/helpful — increment helpful count
router.patch("/:id/helpful", authMiddleware, async (req, res) => {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Avis non trouvé" });
    review.helpful = (review.helpful || 0) + 1;
    await review.save();
    res.json({ ...review.toObject(), id: review._id });
});

module.exports = router;
