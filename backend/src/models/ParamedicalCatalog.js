const mongoose = require("mongoose");

const paramedicalCatalogSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    brand: { type: String, default: "" },
    category: { type: String, default: "" },
    prescription: { type: Boolean, default: false },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    shortDesc: { type: String, default: "" },
    usage: { type: String, default: "" },
  },
  { _id: false, timestamps: true }
);

paramedicalCatalogSchema.index({ name: 1 });
paramedicalCatalogSchema.index({ brand: 1 });

module.exports = mongoose.model("ParamedicalCatalog", paramedicalCatalogSchema);
