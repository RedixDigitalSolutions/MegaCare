const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        doctorId: { type: String, required: true },
        patientId: { type: String, required: true },
        patientName: { type: String, default: "" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, required: true },
        type: { type: String, enum: ["Vidéo", "Cabinet"], default: "Vidéo" },
        helpful: { type: Number, default: 0 },
    },
    { timestamps: true, _id: false },
);

module.exports = mongoose.model("Review", reviewSchema);
