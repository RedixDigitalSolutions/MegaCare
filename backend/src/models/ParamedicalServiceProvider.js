const mongoose = require("mongoose");

const paramedicalServiceProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialization: { type: String, default: "" },
    avatar: { type: String, default: "" },
    governorate: { type: String, default: "" },
    delegation: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },
    openingHours: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

paramedicalServiceProviderSchema.index({ governorate: 1 });
paramedicalServiceProviderSchema.index({ specialization: 1 });

module.exports = mongoose.model("ParamedicalServiceProvider", paramedicalServiceProviderSchema);
