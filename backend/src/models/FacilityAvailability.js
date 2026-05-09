const mongoose = require("mongoose");

/**
 * Stores working-hours config and custom blocked slots for a medical
 * service or lab facility.
 *
 * ownerId   — userId of the account that owns the facility
 * facilityType — 'med_service' | 'lab'
 * workingDays  — array of { day (0=Sun … 6=Sat), start "HH:MM", end "HH:MM" }
 * slotDuration — minutes per slot (default 30)
 * blockedSlots — individual slot overrides: { date "YYYY-MM-DD", time "HH:MM" }
 * blockedDays  — entire days off: ["YYYY-MM-DD", …]
 */
const facilityAvailabilitySchema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true, unique: true, index: true },
    facilityType: {
      type: String,
      enum: ["med_service", "lab"],
      required: true,
    },
    workingDays: [
      {
        _id: false,
        day: { type: Number, min: 0, max: 6 }, // 0 = Sunday
        start: { type: String, default: "08:00" },
        end: { type: String, default: "18:00" },
      },
    ],
    slotDuration: { type: Number, default: 30 }, // minutes
    blockedSlots: [
      {
        _id: false,
        date: String,
        time: String,
        // Optional metadata for custom calendar events created by the admin.
        // When present, the slot represents a named event (e.g. "Réunion équipe").
        label: { type: String, default: "" },
        color: { type: String, default: "" },
      },
    ],
    blockedDays: [{ type: String }], // YYYY-MM-DD
  },
  { timestamps: true }
);

module.exports = mongoose.model("FacilityAvailability", facilityAvailabilitySchema);
