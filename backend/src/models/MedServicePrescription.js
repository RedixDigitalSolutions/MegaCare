const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedServicePrescriptionSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        patient: { type: String, required: true },
        doctor: { type: String, default: "" },
        date: { type: String, default: "" },
        medications: { type: String, default: "" },
        status: { type: String, enum: ["Active", "Terminée", "En attente"], default: "Active" },
        notes: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("MedServicePrescription", MedServicePrescriptionSchema);
