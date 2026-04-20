const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    doctorId: { type: String, required: true },
    patientId: String,
    medicines: [mongoose.Schema.Types.Mixed],
    status: { type: String, enum: ["en_attente", "validée", "rejetée", "expirée"], default: "en_attente" },
    expiryDate: Date,
    scanned: { type: Boolean, default: false },
    pharmacyId: String,
    notes: String,
    secretCode: { type: String, unique: true, sparse: true },
    purchaseStatus: {
      type: String,
      enum: ["pending", "purchased"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    _id: false,
  },
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
