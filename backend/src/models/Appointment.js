const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    patientId: { type: String, required: true },
    patientName: String,
    doctorId: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    fee: { type: Number, default: 80 },
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

appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ patientId: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
