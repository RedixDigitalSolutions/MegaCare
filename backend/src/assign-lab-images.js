/**
 * assign-lab-images.js
 * Assigns a random banner image to each PublicLabCenter.
 * Run: node src/assign-lab-images.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megacare";
const UPLOADS_DIR = path.join(__dirname, "uploads/Labos-Radiologie");
const URL_PREFIX = "/uploads/Labos-Radiologie";

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected:", MONGO_URI);

  const images = fs.readdirSync(UPLOADS_DIR).filter((f) => /\.(jpg|jpeg|png|webp|avif)$/i.test(f));
  console.log(`Found ${images.length} images`);

  const labs = await mongoose.connection.db.collection("publiclabcenters").find({}).toArray();
  console.log(`Found ${labs.length} lab centers`);

  let updated = 0;
  for (const lab of labs) {
    const img = images[Math.floor(Math.random() * images.length)];
    const imageUrl = `${URL_PREFIX}/${img}`;
    await mongoose.connection.db.collection("publiclabcenters").updateOne(
      { _id: lab._id },
      { $set: { imageUrl } }
    );
    console.log(`  ${lab._id} → ${imageUrl}`);
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}`);
  await mongoose.disconnect();
}

run().catch((err) => { console.error(err); process.exit(1); });
