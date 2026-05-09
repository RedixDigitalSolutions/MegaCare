/**
 * assign-doctor-avatars.js
 * Assigns random profile pictures from /uploads/doctor/ to all doctor users.
 * Run with: node src/assign-doctor-avatars.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megacare";

const AVATARS = [
  "/uploads/doctor/doctor-pdp1.jpg",
  "/uploads/doctor/doctor-pdp2.jpg",
  "/uploads/doctor/doctor-pdp3.jpg",
  "/uploads/doctor/doctor-pdp4.jpg",
  "/uploads/doctor/doctor-pdp5.jpg",
  "/uploads/doctor/doctor-pdp6.jpg",
  "/uploads/doctor/doctor-pdp7.webp",
  "/uploads/doctor/doctor-pdp8.webp",
  "/uploads/doctor/doctor-pdp9.webp",
  "/uploads/doctor/doctor-pdp10.png",
  "/uploads/doctor/doctor-pdp11.jpg",
  "/uploads/doctor/doctor-pdp12.jpg",
  "/uploads/doctor/doctor-pdp13.jpg",
  "/uploads/doctor/doctor-pdp14.webp",
  "/uploads/doctor/doctor-pdp15.jpg",
  "/uploads/doctor/doctor-pdp16.webp",
  "/uploads/doctor/doctor-pdp17.avif",
  "/uploads/doctor/doctor-pdp18.png",
  "/uploads/doctor/doctor-pdp19.png",
  "/uploads/doctor/doctor-pdp20.jpg",
  "/uploads/doctor/doctor-pdp21.jpg",
  "/uploads/doctor/doctor-pdp22.webp",
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB:", MONGO_URI);

  const db = mongoose.connection.db;
  const doctors = await db.collection("users").find({ role: "doctor" }).toArray();
  console.log("Doctors found:", doctors.length);

  let updated = 0;
  for (let i = 0; i < doctors.length; i++) {
    const avatar = AVATARS[i % AVATARS.length];
    await db.collection("users").updateOne(
      { _id: doctors[i]._id },
      { $set: { avatar } }
    );
    console.log(`  ${doctors[i].firstName} ${doctors[i].lastName} → ${avatar}`);
    updated++;
  }

  console.log(`\nUpdated ${updated} doctors with avatar images.`);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
