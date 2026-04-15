const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedServiceSettingsSchema = new Schema(
    {
        _id: { type: String, required: true }, // userId
        address: { type: String, default: "" },
        director: { type: String, default: "" },
        capacity: { type: String, default: "30" },
        serviceType: { type: String, default: "Soins infirmiers à domicile" },
        notifs: {
            newPatient: { type: Boolean, default: true },
            vitalAlert: { type: Boolean, default: true },
            appointmentReminder: { type: Boolean, default: true },
            teamMessage: { type: Boolean, default: false },
            billing: { type: Boolean, default: true },
            maintenance: { type: Boolean, default: false },
        },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("MedServiceSettings", MedServiceSettingsSchema);
