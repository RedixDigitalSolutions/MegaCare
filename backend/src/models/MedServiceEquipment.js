const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedServiceEquipmentSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        name: { type: String, required: true },
        type: { type: String, default: "" },
        serial: { type: String, default: "" },
        status: { type: String, enum: ["Disponible", "En utilisation", "Maintenance"], default: "Disponible" },
        patient: { type: String, default: "" },
        maintenanceDate: { type: String, default: "" },
        location: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("MedServiceEquipment", MedServiceEquipmentSchema);
