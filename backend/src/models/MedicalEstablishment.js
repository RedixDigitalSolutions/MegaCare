const mongoose = require("mongoose");

const medicalEstablishmentSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["Clinique", "Hôpital", "HAD", "Centre médical"],
            required: true,
        },
        governorate: { type: String, default: "" },
        city: { type: String, default: "" },
        address: { type: String, default: "" },
        phone: { type: String, default: "" },
        rating: { type: Number, default: 4.5 },
        reviews: { type: Number, default: 0 },
        price: { type: Number, default: 50 },
        services: { type: [String], default: [] },
        accredited: { type: Boolean, default: false },
        emergencies: { type: Boolean, default: false },
        imageUrl: { type: String, default: "" },
        description: { type: String, default: "" },
        beds: { type: Number, default: 0 },
        doctors: { type: Number, default: 0 },
        founded: { type: Number, default: 2000 },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("MedicalEstablishment", medicalEstablishmentSchema);
