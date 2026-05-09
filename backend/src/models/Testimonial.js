const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    role:     { type: String, required: true, trim: true },
    text:     { type: String, required: true, trim: true },
    rating:   { type: Number, default: 5, min: 1, max: 5 },
    location: { type: String, default: "", trim: true },
    avatar:   { type: String, default: "" }, // initials fallback
    imageUrl: { type: String, default: "" }, // profile photo URL
    visible:  { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", testimonialSchema);
