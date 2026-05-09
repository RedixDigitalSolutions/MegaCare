/**
 * create-lab-accounts.js
 * Creates one lab_radiology user account per PublicLabCenter that doesn't
 * already have an owner, and seeds a default FacilityAvailability document
 * so every lab shows bookable slots out of the box.
 *
 * Run with: node src/create-lab-accounts.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megacare";
const PASSWORD = "Lab@2024";

// Default Mon–Fri 08:00–17:00, Saturday 08:00–13:00
const DEFAULT_WORKING_DAYS = [
  { day: 1, start: "08:00", end: "17:00" },
  { day: 2, start: "08:00", end: "17:00" },
  { day: 3, start: "08:00", end: "17:00" },
  { day: 4, start: "08:00", end: "17:00" },
  { day: 5, start: "08:00", end: "17:00" },
  { day: 6, start: "08:00", end: "13:00" },
];

// Maps lab _id → account details
const ACCOUNTS = [
  { labId: "lab-center-01", email: "labo.central.tunis@megacare.tn",       firstName: "Karim",   lastName: "Mansouri",   companyName: "Laboratoire Central de Tunis",  governorate: "Tunis",      labIdCode: "LAB-TN-2024-0011" },
  { labId: "lab-center-02", email: "radio.avicenne@megacare.tn",            firstName: "Sana",    lastName: "Belhaj",     companyName: "Centre d'Imagerie Avicenne",     governorate: "Tunis",      labIdCode: "LAB-TN-2024-0012" },
  { labId: "lab-center-04", email: "radio.sfax@megacare.tn",                firstName: "Mounir",  lastName: "Ghribi",     companyName: "Centre Radio-Diagnostic Sfax",   governorate: "Sfax",       labIdCode: "LAB-TN-2024-0014" },
  { labId: "lab-center-06", email: "irm.monastir@megacare.tn",              firstName: "Leila",   lastName: "Ben Romdhane",companyName: "Centre IRM Monastir",           governorate: "Monastir",   labIdCode: "LAB-TN-2024-0016" },
  { labId: "lab-center-07", email: "labo.biosante.nabeul@megacare.tn",      firstName: "Tarek",   lastName: "Saidi",      companyName: "Laboratoire Bio-Santé Nabeul",   governorate: "Nabeul",     labIdCode: "LAB-TN-2024-0017" },
  { labId: "lab-center-08", email: "radio.benarous@megacare.tn",            firstName: "Ines",    lastName: "Jelassi",    companyName: "Centre de Radiologie Ben Arous",  governorate: "Ben Arous",  labIdCode: "LAB-TN-2024-0018" },
  { labId: "lab-center-09", email: "labo.moderne.bizerte@megacare.tn",      firstName: "Anis",    lastName: "Trabelsi",   companyName: "Laboratoire Moderne Bizerte",    governorate: "Bizerte",    labIdCode: "LAB-TN-2024-0019" },
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB:", MONGO_URI);

  const db = mongoose.connection.db;
  const hashed = await bcrypt.hash(PASSWORD, 10);

  let created = 0;
  let skipped = 0;

  for (const acc of ACCOUNTS) {
    // Skip if a user for this lab already exists
    const exists = await db.collection("users").findOne({ labCenterId: acc.labId });
    if (exists) {
      console.log(`  SKIP (exists): ${acc.labId} → ${exists.email}`);
      skipped++;
      continue;
    }

    // IDs 401/402 are already taken (lab-center-05, lab-center-03).
    // Map remaining labs sequentially starting from 403.
    const ID_MAP = {
      "lab-center-01": "00000000-0000-0000-0000-000000000403",
      "lab-center-02": "00000000-0000-0000-0000-000000000404",
      "lab-center-04": "00000000-0000-0000-0000-000000000405",
      "lab-center-06": "00000000-0000-0000-0000-000000000406",
      "lab-center-07": "00000000-0000-0000-0000-000000000407",
      "lab-center-08": "00000000-0000-0000-0000-000000000408",
      "lab-center-09": "00000000-0000-0000-0000-000000000409",
    };
    const userId = ID_MAP[acc.labId];

    await db.collection("users").insertOne({
      _id: userId,
      firstName: acc.firstName,
      lastName: acc.lastName,
      name: `${acc.firstName} ${acc.lastName}`,
      email: acc.email,
      password: hashed,
      role: "lab_radiology",
      status: "approved",
      phone: "+216 00 000 000",
      labId: acc.labIdCode,
      companyName: acc.companyName,
      governorate: acc.governorate,
      delegation: acc.governorate,
      mapsUrl: "",
      isOnDuty: false,
      labCenterId: acc.labId,
      createdAt: new Date(),
      updatedAt: new Date(),
      __v: 0,
    });

    // Seed a default FacilityAvailability so the lab is bookable immediately
    const faExists = await db.collection("facilityavailabilities").findOne({ ownerId: userId });
    if (!faExists) {
      await db.collection("facilityavailabilities").insertOne({
        ownerId: userId,
        facilityType: "lab",
        workingDays: DEFAULT_WORKING_DAYS,
        slotDuration: 30,
        blockedSlots: [],
        blockedDays: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
      });
      console.log(`  CREATED: ${acc.email} → ${acc.labId} (with default schedule)`);
    } else {
      console.log(`  CREATED: ${acc.email} → ${acc.labId} (FA already exists)`);
    }

    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
