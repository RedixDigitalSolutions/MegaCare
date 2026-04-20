const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    dci: { type: String, default: "" },
    category: { type: String, default: "" },
    form: { type: String, default: "" },
    brand: { type: String, default: "" },
    requiresPrescription: { type: Boolean, default: false },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    usage: { type: String, default: "" },
    contraindications: { type: String, default: "" },
    sideEffects: { type: String, default: "" },
  },
  {
    _id: false,
    timestamps: true,
  },
);

// Text index for efficient autocomplete search
medicineSchema.index({ name: "text", dci: "text", brand: "text" });
// Regular indexes for regex-based search
medicineSchema.index({ name: 1 });
medicineSchema.index({ dci: 1 });

module.exports = mongoose.model("Medicine", medicineSchema);
