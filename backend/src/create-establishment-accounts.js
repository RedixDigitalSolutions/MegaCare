/**
 * create-establishment-accounts.js
 * Creates one medical_service user account per MedicalEstablishment (estab-01 → estab-35).
 * Run with: node src/create-establishment-accounts.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/megacare";
const PASSWORD = "Service@2024";

// Maps estab _id → { email, firstName, lastName, serviceId }
const ACCOUNTS = [
  { id: "estab-01", email: "clinique.lamarsa@megacare.tn",        firstName: "Amira",    lastName: "Bouslama",   serviceId: "SVC-TN-2024-0101", name: "Clinique La Marsa" },
  { id: "estab-02", email: "clinique.pasteur@megacare.tn",         firstName: "Khalil",   lastName: "Sfar",       serviceId: "SVC-TN-2024-0102", name: "Clinique Pasteur" },
  { id: "estab-03", email: "clinique.alhayat@megacare.tn",         firstName: "Sirine",   lastName: "Chaabane",   serviceId: "SVC-TN-2024-0103", name: "Clinique Al Hayat" },
  { id: "estab-04", email: "clinique.taoufik@megacare.tn",         firstName: "Mounir",   lastName: "Taoufik",    serviceId: "SVC-TN-2024-0104", name: "Clinique Taoufik" },
  { id: "estab-05", email: "clinique.carthage@megacare.tn",        firstName: "Leila",    lastName: "Dridi",      serviceId: "SVC-TN-2024-0105", name: "Clinique Carthage" },
  { id: "estab-06", email: "centre.elmenzah@megacare.tn",          firstName: "Sami",     lastName: "Belhaj",     serviceId: "SVC-TN-2024-0106", name: "Centre Medical El Menzah" },
  { id: "estab-07", email: "polyclinique.jasmins@megacare.tn",     firstName: "Ines",     lastName: "Karray",     serviceId: "SVC-TN-2024-0107", name: "Polyclinique Les Jasmins" },
  { id: "estab-08", email: "clinique.ennasr@megacare.tn",          firstName: "Wafa",     lastName: "Hammami",    serviceId: "SVC-TN-2024-0108", name: "Clinique Ennasr" },
  { id: "estab-09", email: "polyclinique.lasoukra@megacare.tn",    firstName: "Hichem",   lastName: "Zouari",     serviceId: "SVC-TN-2024-0109", name: "Polyclinique La Soukra" },
  { id: "estab-10", email: "clinique.megrine@megacare.tn",         firstName: "Randa",    lastName: "Slim",       serviceId: "SVC-TN-2024-0110", name: "Clinique Megrine" },
  { id: "estab-11", email: "clinique.elamen.nabeul@megacare.tn",   firstName: "Mehdi",    lastName: "Oueslati",   serviceId: "SVC-TN-2024-0111", name: "Clinique El Amen Nabeul" },
  { id: "estab-12", email: "clinique.ibnrochd@megacare.tn",        firstName: "Asma",     lastName: "Abidi",      serviceId: "SVC-TN-2024-0112", name: "Clinique Ibn Rochd Hammamet" },
  { id: "estab-13", email: "centre.bizerte@megacare.tn",           firstName: "Tarek",    lastName: "Trabelsi",   serviceId: "SVC-TN-2024-0113", name: "Centre Medical Bizerte" },
  { id: "estab-14", email: "clinique.palmiers@megacare.tn",        firstName: "Nadia",    lastName: "Ben Salem",  serviceId: "SVC-TN-2024-0114", name: "Clinique Les Palmiers" },
  { id: "estab-15", email: "polyclinique.soussenord@megacare.tn",  firstName: "Farid",    lastName: "Gharbi",     serviceId: "SVC-TN-2024-0115", name: "Polyclinique Sousse Nord" },
  { id: "estab-16", email: "polyclinique.akouda@megacare.tn",      firstName: "Samira",   lastName: "Riahi",      serviceId: "SVC-TN-2024-0116", name: "Polyclinique Akouda" },
  { id: "estab-17", email: "clinique.ibnjazzar@megacare.tn",       firstName: "Lotfi",    lastName: "Mssedi",     serviceId: "SVC-TN-2024-0117", name: "Clinique Ibn El Jazzar" },
  { id: "estab-18", email: "clinique.ksarhellal@megacare.tn",      firstName: "Najla",    lastName: "Saidi",      serviceId: "SVC-TN-2024-0118", name: "Clinique Ksar Hellal" },
  { id: "estab-19", email: "centre.jemmal@megacare.tn",            firstName: "Bassem",   lastName: "Mahjoub",    serviceId: "SVC-TN-2024-0119", name: "Centre Medical Jemmal" },
  { id: "estab-20", email: "clinique.lesoliviers@megacare.tn",     firstName: "Hatem",    lastName: "Ben Fredj",  serviceId: "SVC-TN-2024-0120", name: "Clinique Les Oliviers" },
  { id: "estab-21", email: "clinique.elyasmine@megacare.tn",       firstName: "Emna",     lastName: "Toumi",      serviceId: "SVC-TN-2024-0121", name: "Clinique El Yasmine Sfax" },
  { id: "estab-22", email: "centre.ibnkhaldoun@megacare.tn",       firstName: "Walid",    lastName: "Gargouri",   serviceId: "SVC-TN-2024-0122", name: "Centre Medical Ibn Khaldoun" },
  { id: "estab-23", email: "clinique.elamal.kairouan@megacare.tn", firstName: "Sonia",    lastName: "Jebali",     serviceId: "SVC-TN-2024-0123", name: "Clinique El Amal Kairouan" },
  { id: "estab-24", email: "centre.beja@megacare.tn",              firstName: "Rachid",   lastName: "Ferchichi",  serviceId: "SVC-TN-2024-0124", name: "Centre Medical Beja" },
  { id: "estab-25", email: "clinique.elhayat.gabes@megacare.tn",   firstName: "Mariam",   lastName: "Khelifi",    serviceId: "SVC-TN-2024-0125", name: "Clinique El Hayat Gabes" },
  { id: "estab-26", email: "had.tunisnord@megacare.tn",            firstName: "Olfa",     lastName: "Ayari",      serviceId: "SVC-TN-2024-0126", name: "HAD Soins Tunis Nord" },
  { id: "estab-27", email: "had.ariana@megacare.tn",               firstName: "Zied",     lastName: "Mellouli",   serviceId: "SVC-TN-2024-0127", name: "HAD Ariana Domicile Sante" },
  { id: "estab-28", email: "had.benarous@megacare.tn",             firstName: "Hela",     lastName: "Msaddek",    serviceId: "SVC-TN-2024-0128", name: "HAD Ben Arous Confort Soin" },
  { id: "estab-29", email: "had.sousse@megacare.tn",               firstName: "Anis",     lastName: "Turki",      serviceId: "SVC-TN-2024-0129", name: "HAD Sousse Aile Medicale" },
  { id: "estab-30", email: "had.monastir@megacare.tn",             firstName: "Dorra",    lastName: "Mansouri",   serviceId: "SVC-TN-2024-0130", name: "HAD Monastir Sante Proximite" },
  { id: "estab-31", email: "had.sfax@megacare.tn",                 firstName: "Yacine",   lastName: "Lahmar",     serviceId: "SVC-TN-2024-0131", name: "HAD Sfax Soins Integres" },
  { id: "estab-32", email: "had.nabeul@megacare.tn",               firstName: "Imen",     lastName: "Baccouche",  serviceId: "SVC-TN-2024-0132", name: "HAD Nabeul Cap Bon Sante" },
  { id: "estab-33", email: "had.bizerte@megacare.tn",              firstName: "Kamel",    lastName: "Hadj Ali",   serviceId: "SVC-TN-2024-0133", name: "HAD Bizerte Nord Sante" },
  { id: "estab-34", email: "had.kairouan@megacare.tn",             firstName: "Fatma",    lastName: "Chouchane",  serviceId: "SVC-TN-2024-0134", name: "HAD Kairouan Domicile Plus" },
  { id: "estab-35", email: "had.gabes@megacare.tn",                firstName: "Majdi",    lastName: "Riahi",      serviceId: "SVC-TN-2024-0135", name: "HAD Gabes Soins Domicile" },
];

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB:", MONGO_URI);

  const db = mongoose.connection.db;
  const hashed = await bcrypt.hash(PASSWORD, 10);

  // Look up governorates from establishments
  const estabIds = ACCOUNTS.map((a) => a.id);
  const estabs = await db.collection("medicalestablishments").find({ _id: { $in: estabIds } }).toArray();
  const estabMap = Object.fromEntries(estabs.map((e) => [e._id, e]));

  let created = 0;
  let skipped = 0;

  for (const acc of ACCOUNTS) {
    const exists = await db.collection("users").findOne({ email: acc.email });
    if (exists) {
      console.log(`  SKIP (exists): ${acc.email}`);
      skipped++;
      continue;
    }

    const estab = estabMap[acc.id];
    const userId = `svc-${acc.id}`;

    await db.collection("users").insertOne({
      _id: userId,
      firstName: acc.firstName,
      lastName: acc.lastName,
      name: `${acc.firstName} ${acc.lastName}`,
      email: acc.email,
      password: hashed,
      role: "medical_service",
      status: "approved",
      phone: estab?.phone || "",
      serviceId: acc.serviceId,
      establishmentId: acc.id,
      companyName: acc.name,
      governorate: estab?.governorate || "",
      delegation: estab?.city || "",
      mapsUrl: "",
      isOnDuty: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`  CREATED: ${acc.email} → ${acc.id}`);
    created++;
  }

  console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
