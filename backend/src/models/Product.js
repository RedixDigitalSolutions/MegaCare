const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    category: String,
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    requiresPrescription: { type: Boolean, default: false },
  },
  {
    _id: false,
  },
);

module.exports = mongoose.model("Product", productSchema);
