const mongoose = require("mongoose");

const dossierSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true, unique: true },
    personal: {
      age: Number,
      gender: String,
      bloodType: String,
      height: Number,
      weight: Number,
    },
    medicalHistory: {
      chronicIllnesses: [String],
      pastSurgeries: [
        {
          name: String,
          date: String,
          notes: String,
        },
      ],
      familyHistory: [
        {
          condition: String,
          relation: String,
        },
      ],
    },
    allergies: [
      {
        type: { type: String },
        name: String,
        severity: String,
        reaction: String,
      },
    ],
    activeMedications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        since: String,
      },
    ],
    documents: [
      {
        id: String,
        type: { type: String },
        name: String,
        date: String,
        description: String,
      },
    ],
    consultations: [
      {
        doctorId: String,
        doctorName: String,
        date: { type: String, default: () => new Date().toISOString() },
        symptoms: String,
        observations: String,
        diagnosis: String,
        medications: [
          {
            name: String,
            dosage: String,
          },
        ],
        followUp: String,
        notes: String,
      },
    ],
    permissions: [
      {
        doctorId: { type: String, required: true },
        doctorName: { type: String, default: "" },
        grantedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, default: null },
        status: {
          type: String,
          enum: ["active", "expired", "revoked"],
          default: "active",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Dossier", dossierSchema);
