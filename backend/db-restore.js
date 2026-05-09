#!/usr/bin/env node
/**
 * db-restore.js — MegaCare database restore helper
 *
 * Wraps `mongorestore` to load the dump located at backend/dump/ into a
 * local (or remote) MongoDB instance.  Run from the repository root or from
 * the backend/ directory.
 *
 * Usage:
 *   node backend/db-restore.js                        # local default
 *   MONGO_URI=mongodb+srv://... node backend/db-restore.js
 *   node backend/db-restore.js --drop                 # wipe before restore
 */

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// ── Resolve paths ────────────────────────────────────────────────────────────
const repoRoot = path.resolve(__dirname, "..");
const dumpDir = path.join(__dirname, "dump", "megacare");

if (!fs.existsSync(dumpDir)) {
    console.error(`\n✗  Dump directory not found: ${dumpDir}`);
    console.error("  Run  mongodump --uri=<uri> --out=backend/dump --gzip  first.\n");
    process.exit(1);
}

// ── Connection URI ───────────────────────────────────────────────────────────
require("dotenv").config({ path: path.join(__dirname, ".env") });
const uri = process.env.MONGO_URI || "mongodb://localhost:27017/megacare";

// ── Flags ────────────────────────────────────────────────────────────────────
const drop = process.argv.includes("--drop") ? "--drop" : "";

// ── Build command ────────────────────────────────────────────────────────────
const cmd = [
    "mongorestore",
    `--uri="${uri}"`,
    "--gzip",
    "--dir", `"${dumpDir}"`,
    "--nsInclude", '"megacare.*"',
    drop,
].filter(Boolean).join(" ");

console.log("\n── MegaCare DB Restore ─────────────────────────────────────────");
console.log(`   Target URI : ${uri.replace(/:\/\/([^:]+:[^@]+)@/, "://<credentials>@")}`);
console.log(`   Dump path  : ${dumpDir}`);
if (drop) console.log("   Mode       : --drop (existing data will be wiped first)");
console.log("────────────────────────────────────────────────────────────────\n");

try {
    execSync(cmd, { stdio: "inherit" });
    console.log("\n✓  Restore complete.\n");
} catch (err) {
    console.error("\n✗  mongorestore failed. Is MongoDB Tools installed?\n");
    console.error("   macOS  : brew install mongodb/brew/mongodb-database-tools");
    console.error("   Ubuntu : sudo apt install mongodb-database-tools");
    console.error("   Windows: https://www.mongodb.com/try/download/database-tools\n");
    process.exit(1);
}
