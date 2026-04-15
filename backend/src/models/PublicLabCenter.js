const mongoose = require("mongoose");

const publicLabCenterSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["Laboratoire", "Radiologie", "Mixte"],
            required: true,
        },
        governorate: { type: String, default: "" },
        city: { type: String, default: "" },
        address: { type: String, default: "" },
        phone: { type: String, default: "" },
        rating: { type: Number, default: 4.5 },
        reviews: { type: Number, default: 0 },
        cnam: { type: Boolean, default: false },
        resultDelay: { type: String, default: "24h" },
        exams: { type: [String], default: [] },
        allExamTypes: { type: [String], default: [] },
        priceFrom: { type: Number, default: 15 },
        imageUrl: { type: String, default: "" },
        description: { type: String, default: "" },
        open24h: { type: Boolean, default: false },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("PublicLabCenter", publicLabCenterSchema);
