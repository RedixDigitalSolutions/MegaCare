const mongoose = require("mongoose");
const { Schema } = mongoose;

const VitalSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        patientId: { type: String, required: true },
        patientName: { type: String, default: "" },
        role: { type: String, enum: ["medical_service", "paramedical"], required: true },
        sbp: { type: Number, default: null },
        dbp: { type: Number, default: null },
        hr: { type: Number, default: null },
        temp: { type: Number, default: null },
        spo2: { type: Number, default: null },
        glucose: { type: Number, default: null },
        date: { type: String, default: "" },
        time: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("Vital", VitalSchema);
