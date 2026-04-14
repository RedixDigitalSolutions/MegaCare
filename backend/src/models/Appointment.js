const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: String,
    doctorId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    reason: { type: String, default: "" },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "rejected", "cancelled", "completed"],
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

module.exports = mongoose.model("Appointment", appointmentSchema);
