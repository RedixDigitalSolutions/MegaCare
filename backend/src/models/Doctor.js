const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: String,
    specialty: String,
    governorate: String,
    userId: String,
  },
  {
    timestamps: true,
    _id: false,
  },
);

module.exports = mongoose.model("Doctor", doctorSchema);
