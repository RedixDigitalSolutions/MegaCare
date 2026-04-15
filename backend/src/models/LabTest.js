const mongoose = require("mongoose");

const labTestSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        patient: { type: String, required: true },
        testType: { type: String, required: true },
        doctor: { type: String, default: "" },
        status: {
            type: String,
            enum: ["En attente", "En cours", "Complété"],
            default: "En attente",
        },
        priority: { type: String, enum: ["Normal", "Urgent"], default: "Normal" },
        date: { type: String, default: "" },
        notes: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("LabTest", labTestSchema);
