/**
 * seedParamedicalAvatars.js
 *
 * Randomly assigns profile pictures from uploads/paramedical-services/
 * to all ParamedicalServiceProvider documents in the database.
 *
 * Run:  node backend/src/scripts/seedParamedicalAvatars.js
 */

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const ParamedicalServiceProvider = require("../models/ParamedicalServiceProvider");

const IMAGES_DIR = path.join(__dirname, "../uploads/paramedical-services");
const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function run() {
  await connectDB();

  // Collect available images
  const files = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => ALLOWED_EXT.has(path.extname(f).toLowerCase()));

  if (files.length === 0) {
    console.error("❌ No images found in", IMAGES_DIR);
    process.exit(1);
  }

  console.log(`📸 Found ${files.length} image(s) in uploads/paramedical-services/`);

  const providers = await ParamedicalServiceProvider.find({}).lean();
  if (providers.length === 0) {
    console.log("⚠️  No providers found in database. Nothing to seed.");
    process.exit(0);
  }

  console.log(`👥 Found ${providers.length} provider(s). Assigning random avatars…`);

  // Shuffle pool; repeat pool if more providers than images
  let pool = shuffle(files);
  while (pool.length < providers.length) pool = pool.concat(shuffle(files));
  pool = pool.slice(0, providers.length);

  const ops = providers.map((p, i) => ({
    updateOne: {
      filter: { _id: p._id },
      update: { $set: { avatar: `/uploads/paramedical-services/${pool[i]}` } },
    },
  }));

  const result = await ParamedicalServiceProvider.bulkWrite(ops);
  console.log(`✅ Updated ${result.modifiedCount} provider(s) with random avatars.`);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
