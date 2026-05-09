/**
 * fix-product-images.js
 * Updates all pharmacy products to have the correct imageUrl from the medicines catalog.
 * Run with: node src/fix-product-images.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megacare";

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB:", MONGO_URI);

  const db = mongoose.connection.db;

  const medicines = await db.collection("medicines").find({}).toArray();
  console.log("Medicines in catalog:", medicines.length);

  let totalUpdated = 0;
  for (const med of medicines) {
    if (!med.imageUrl) continue;
    const result = await db.collection("products").updateMany(
      { medicineId: med._id },
      { $set: { imageUrl: med.imageUrl, name: med.name } }
    );
    if (result.modifiedCount > 0) {
      console.log(`  ${med.name} (${med._id}): updated ${result.modifiedCount} products`);
    }
    totalUpdated += result.modifiedCount;
  }

  console.log(`\nTotal products updated: ${totalUpdated}`);
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
