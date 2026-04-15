const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParamedPatientSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        name: { type: String, required: true },
        age: { type: Number, default: 0 },
        condition: { type: String, default: "" },
        status: { type: String, enum: ["Actif", "Suivi", "Clôturé"], default: "Actif" },
        nextAppointment: { type: String, default: null },
        careType: { type: String, default: "" },
        phone: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("ParamedPatient", ParamedPatientSchema);
