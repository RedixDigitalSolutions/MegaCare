const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedServiceTeamMemberSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        name: { type: String, required: true },
        role: {
            type: String,
            enum: ["Infirmier", "Infirmière", "Aide-soignant", "Aide-soignante", "Thérapeute", "Kinésithérapeute"],
            default: "Infirmier",
        },
        status: { type: String, enum: ["Actif", "En pause", "Absent"], default: "Actif" },
        patients: { type: Number, default: 0 },
        phone: { type: String, default: "" },
        email: { type: String, default: "" },
        specialty: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("MedServiceTeamMember", MedServiceTeamMemberSchema);
