const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true },
    items: [mongoose.Schema.Types.Mixed],
    total: Number,
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
    _id: false,
  },
);

module.exports = mongoose.model("Order", orderSchema);
