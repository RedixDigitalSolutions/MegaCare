const mongoose = require("mongoose");

const paramedicalOrderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    paramedicalId: { type: String, required: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    deliveryMethod: { type: String, enum: ["pickup", "delivery"], required: true },
    // For delivery
    deliveryAddress: { type: String, default: "" },
    deliveryGovernorate: { type: String, default: "" },
    deliveryDelegation: { type: String, default: "" },
    deliveryPhone: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

module.exports = mongoose.model("ParamedicalOrder", paramedicalOrderSchema);
