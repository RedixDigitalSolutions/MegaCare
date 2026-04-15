const mongoose = require("mongoose");

const supplierOrderSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        ref: { type: String, required: true },
        supplier: { type: String, required: true },
        date: { type: String, default: "" },
        expectedDate: { type: String, default: null },
        items: [{ name: String, qty: Number, unit: String }],
        total: { type: Number, default: 0 },
        status: {
            type: String,
            enum: ["Livré", "En transit", "En attente"],
            default: "En attente",
        },
    },
    { timestamps: true, _id: false }
);

module.exports = mongoose.model("SupplierOrder", supplierOrderSchema);
