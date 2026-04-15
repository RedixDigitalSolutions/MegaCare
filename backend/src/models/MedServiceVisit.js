const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedServiceVisitSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        patient: { type: String, required: true },
        staff: { type: String, default: "" },
        date: { type: String, default: "" },
        time: { type: String, default: "09:00" },
        duration: { type: String, default: "1h" },
        status: {
            type: String,
            enum: ["Planifié", "En cours", "Complété", "Annulé"],
            default: "Planifié",
        },
        channel: {
            type: String,
            enum: ["présentiel", "téléconsultation"],
            default: "présentiel",
        },
        notes: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("MedServiceVisit", MedServiceVisitSchema);
