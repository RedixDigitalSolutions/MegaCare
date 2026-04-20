const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    pharmacyId: { type: String, required: true },
    orderCode: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, default: 1 },
      },
    ],
    total: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    deliveryMethod: { type: String, enum: ["pickup", "delivery"], required: true },
    deliveryAddress: { type: String, default: "" },
    deliveryGovernorate: { type: String, default: "" },
    deliveryDelegation: { type: String, default: "" },
    deliveryPhone: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "ready", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

module.exports = mongoose.model("Order", orderSchema);
