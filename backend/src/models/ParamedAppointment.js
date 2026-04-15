const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParamedAppointmentSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        patient: { type: String, required: true },
        type: { type: String, default: "Soins infirmiers" },
        date: { type: String, default: "" },
        time: { type: String, default: "09:00" },
        location: { type: String, enum: ["Domicile", "Cabinet"], default: "Domicile" },
        status: { type: String, enum: ["Confirmé", "En attente", "Annulé"], default: "En attente" },
        notes: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("ParamedAppointment", ParamedAppointmentSchema);
