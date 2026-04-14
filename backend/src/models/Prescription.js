const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    doctorId: { type: String, required: true },
    patientId: String,
    medicines: [mongoose.Schema.Types.Mixed],
  },
  {
    timestamps: true,
    _id: false,
  },
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
