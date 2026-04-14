const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: [
        "patient",
        "doctor",
        "pharmacy",
        "lab",
        "lab_radiology",
        "paramedical",
        "medical_service",
        "admin",
      ],
    },
    status: { type: String, default: "pending" },
    phone: String,
    specialization: String,
    avatar: String,
    doctorId: String,
    pharmacyId: String,
    serviceId: String,
    labId: String,
    paramedicalId: String,
    companyName: String,
  },
  {
    timestamps: true,
    _id: false,
  },
);

module.exports = mongoose.model("User", userSchema);
