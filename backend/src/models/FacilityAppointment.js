const mongoose = require("mongoose");

/**
 * A patient-initiated booking at a medical service facility or lab.
 *
 * ownerId        — userId of the facility owner (for easy dashboard queries)
 * facilityId     — _id of the MedicalEstablishment or PublicLabCenter
 * facilityType   — 'med_service' | 'lab'
 * patientId      — userId of the patient
 * patientName    — display name
 * patientPhone / patientEmail — contact info snapshotted at booking time
 * service        — selected service (med) or exam type (lab)
 * date           — "YYYY-MM-DD"
 * time           — "HH:MM"
 * status         — pending → confirmed | rejected; or completed / cancelled
 * notes          — patient-provided notes (immutable after booking)
 * adminNotes      — internal notes written by the facility admin
 * prescriptionUrl   — uploaded ordonnance URL (lab only)
 * prescriptionMime  — mime type so the viewer knows how to render it
 */
const facilityAppointmentSchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, index: true },
    facilityId: { type: String, required: true, index: true },
    facilityType: { type: String, enum: ["med_service", "lab"], required: true },
    patientId: { type: String, required: true, index: true },
    patientName: { type: String, default: "" },
    patientPhone: { type: String, default: "" },
    patientEmail: { type: String, default: "" },
    service: { type: String, default: "" },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    notes: { type: String, default: "" },
    adminNotes: { type: String, default: "" },
    prescriptionUrl: { type: String, default: "" },
    prescriptionMime: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound index to enforce no double-booking for the same slot
facilityAppointmentSchema.index(
  { ownerId: 1, date: 1, time: 1 },
  {
    unique: false, // we check manually to give a human-readable error
  }
);

module.exports = mongoose.model("FacilityAppointment", facilityAppointmentSchema);
