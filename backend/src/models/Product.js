const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    requiresPrescription: { type: Boolean, default: false },
    form: { type: String, default: "" },
    brand: { type: String, default: "" },
    dci: { type: String, default: "" },
    rating: { type: Number, default: 4.5 },
    reviews: { type: Number, default: 0 },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    pharmacy: { type: String, default: "Pharmacie Centrale Tunis" },
    distance: { type: Number, default: 1.5 },
    delivery: { type: String, default: "2h" },
    usage: { type: String, default: "" },
    contraindications: { type: String, default: "" },
    sideEffects: { type: String, default: "" },
  },
  {
    _id: false,
    timestamps: true,
  },
);

module.exports = mongoose.model("Product", productSchema);
