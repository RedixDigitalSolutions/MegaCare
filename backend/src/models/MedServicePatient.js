const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedServicePatientSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        name: { type: String, required: true },
        age: { type: Number, default: 0 },
        condition: { type: String, default: "" },
        status: { type: String, enum: ["En cours", "Suspendu", "Terminé"], default: "En cours" },
        startDate: { type: String, default: "" },
        nurse: { type: String, default: "" },
        phone: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("MedServicePatient", MedServicePatientSchema);
