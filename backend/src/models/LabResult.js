const mongoose = require("mongoose");

const labResultSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        patient: { type: String, required: true },
        testType: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String, default: "" },
        reference: { type: String, default: "" },
        status: {
            type: String,
            enum: ["Normal", "Élevé", "Critique"],
            default: "Normal",
        },
        doctor: { type: String, default: "" },
        date: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("LabResult", labResultSchema);
