const mongoose = require("mongoose");
const { Schema } = mongoose;

const MedServiceInvoiceSchema = new Schema(
    {
        _id: { type: String, required: true },
        userId: { type: String, required: true },
        ref: { type: String, default: "" },
        patient: { type: String, required: true },
        amount: { type: Number, default: 0 },
        date: { type: String, default: "" },
        dueDate: { type: String, default: "" },
        status: { type: String, enum: ["Payée", "En attente", "En retard"], default: "En attente" },
        services: { type: String, default: "" },
        paymentMethod: { type: String, enum: ["Virement", "Espèces", "Carte", "Assurance", ""], default: "" },
        paymentDate: { type: String, default: "" },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("MedServiceInvoice", MedServiceInvoiceSchema);
