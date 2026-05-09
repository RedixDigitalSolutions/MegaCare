/**
 * assign-paramedical-data.js
 * Assigns specializations and random profile pictures to all paramedical users.
 * Run with: node src/assign-paramedical-data.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megacare";

const SPECIALIZATIONS = [
  "Infirmier(ère)",
  "Kinésithérapeute",
  "Orthophoniste",
  "Ergothérapeute",
  "Aide-soignant(e)",
  "Sage-femme",
  "Psychomotricien(ne)",
  "Diététicien(ne)",
];

const AVATARS = [
  "/uploads/paramedical-services/pdp1.avif",
  "/uploads/paramedical-services/pdp2.jpeg",
  "/uploads/paramedical-services/pdp3.jpeg",
  "/uploads/paramedical-services/pdp4.jpeg",
  "/uploads/paramedical-services/pdp5.jpeg",
  "/uploads/paramedical-services/pdp6.jpeg",
  "/uploads/paramedical-services/pdp7.jpeg",
  "/uploads/paramedical-services/pdp8.jpeg",
  "/uploads/paramedical-services/pdp9.avif",
  "/uploads/paramedical-services/pdp10.avif",
  "/uploads/paramedical-services/pdp11.avif",
  "/uploads/paramedical-services/pdp12.avif",
  "/uploads/paramedical-services/pdp13.avif",
];

function pick(arr, i) {
  return arr[i % arr.length];
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB:", MONGO_URI);

  const db = mongoose.connection.db;
  const users = await db.collection("users").find({ role: "paramedical" }).toArray();
  console.log("Paramedical users found:", users.length);

  let updated = 0;
  for (let i = 0; i < users.length; i++) {
    const specialization = pick(SPECIALIZATIONS, i);
    const avatar = pick(AVATARS, i);
    await db.collection("users").updateOne(
      { _id: users[i]._id },
      { $set: { specialization, avatar } }
    );
    updated++;
  }

  console.log(`Updated ${updated} paramedical users with specializations and avatars.`);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
