const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Message = require("./models/Message");
const Dossier = require("./models/Dossier");
const Product = require("./models/Product");
const Review = require("./models/Review");
const LabTest = require("./models/LabTest");
const LabResult = require("./models/LabResult");
const SupplierOrder = require("./models/SupplierOrder");
const Order = require("./models/Order");
const MedServicePatient = require("./models/MedServicePatient");
const MedServiceEquipment = require("./models/MedServiceEquipment");
const MedServiceTeamMember = require("./models/MedServiceTeamMember");
const MedServiceVisit = require("./models/MedServiceVisit");
const MedServiceInvoice = require("./models/MedServiceInvoice");
const MedServicePrescription = require("./models/MedServicePrescription");
const MedServiceSettings = require("./models/MedServiceSettings");
const Vital = require("./models/Vital");
const ParamedPatient = require("./models/ParamedPatient");
const ParamedAppointment = require("./models/ParamedAppointment");
const ParamedSupply = require("./models/ParamedSupply");
const ParamedCareSession = require("./models/ParamedCareSession");
const ParamedicalProduct = require("./models/ParamedicalProduct");
const ParamedicalCatalog = require("./models/ParamedicalCatalog");
const MedicalEstablishment = require("./models/MedicalEstablishment");
const PublicLabCenter = require("./models/PublicLabCenter");
const Medicine = require("./models/Medicine");
const Prescription = require("./models/Prescription");
const Doctor = require("./models/Doctor");
const { randomUUID } = require("crypto");

/* ================================================================== */
/*  Helpers                                                            */
/* ================================================================== */
const uuid = () => randomUUID();
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
function dateStr(d) {
  return d.toISOString().split("T")[0];
}
function timeSlot() {
  return String(rand(8, 17)).padStart(2, "0") + ":" + pick(["00", "15", "30", "45"]);
}

const GOVERNORATES = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul",
  "Sousse", "Sfax", "Monastir", "Bizerte", "Gabes",
  "Kairouan", "Beja",
];

/* ================================================================== */
/*  Governorate → Delegation map (for pharmacy/para generation)        */
/* ================================================================== */
const GOV_DELEGATIONS = {
  "Tunis": ["Tunis Ville", "Le Bardo", "La Marsa", "Carthage", "La Goulette", "El Menzah", "El Omrane", "Sidi Hassine"],
  "Ariana": ["Ariana Ville", "Soukra", "Raoued", "Sidi Thabet", "Ettadhamen", "Mnihla", "Kalaat el-Andalous"],
  "Ben Arous": ["Ben Arous", "El Mourouj", "Hammam Lif", "Hammam Chott", "Ezzahra", "Rades", "Megrine", "Fouchana"],
  "Manouba": ["Manouba", "Den Den", "Douar Hicher", "Oued Ellil", "Tebourba", "Jedaida", "Mornaguia", "Borj El Amri"],
  "Nabeul": ["Nabeul", "Hammamet", "Korba", "Kelibia", "Soliman", "Grombalia", "Menzel Temime", "Dar Chaabane"],
  "Zaghouan": ["Zaghouan", "Zriba", "Bir Mcherga", "El Fahs", "Nadhour"],
  "Bizerte": ["Bizerte Nord", "Bizerte Sud", "Menzel Bourguiba", "Mateur", "Sejnane", "Ras Jebel", "Tinja", "El Alia"],
  "Beja": ["Beja Nord", "Beja Sud", "Medjez el-Bab", "Testour", "Teboursouk", "Nefza", "Goubellat", "Amdoun"],
  "Jendouba": ["Jendouba", "Bou Salem", "Tabarka", "Ain Draham", "Fernana", "Ghardimaou", "Oued Meliz"],
  "Le Kef": ["Le Kef Ouest", "Le Kef Est", "Dahmani", "Tajerouine", "Sakiet Sidi Youssef", "Kalaat Senan"],
  "Siliana": ["Siliana Nord", "Siliana Sud", "Bou Arada", "Gaafour", "El Krib", "Maktar", "Rouhia"],
  "Sousse": ["Sousse Ville", "Sousse Jawhara", "Hammam Sousse", "Akouda", "Msaken", "Enfida", "Kalaa Kebira", "Kalaa Seghira"],
  "Monastir": ["Monastir", "Jemmal", "Ksar Hellal", "Moknine", "Sahline", "Teboulba", "Bembla", "Ouerdanine"],
  "Mahdia": ["Mahdia", "Ksour Essef", "El Jem", "Chebba", "Essouassi", "Bou Merdes", "Chorbane"],
  "Sfax": ["Sfax Ville", "Sfax Ouest", "Sfax Sud", "Sakiet Ezzit", "Sakiet Eddaier", "Agareb", "Jebeniana", "Mahares"],
  "Kairouan": ["Kairouan Nord", "Kairouan Sud", "Haffouz", "Sbikha", "Nasrallah", "Hajeb El Ayoun", "Chebika"],
  "Kasserine": ["Kasserine Nord", "Kasserine Sud", "Sbeitla", "Sbiba", "Thala", "Foussana", "Feriana"],
  "Sidi Bouzid": ["Sidi Bouzid Ouest", "Sidi Bouzid Est", "Regueb", "Meknassy", "Jilma", "Bir El Hafey", "Menzel Bouzaiane"],
  "Gabes": ["Gabes Ville", "Gabes Ouest", "Gabes Sud", "El Hamma", "Mareth", "Matmata", "Metouia"],
  "Medenine": ["Medenine Nord", "Medenine Sud", "Ben Gardane", "Zarzis", "Djerba Houmt Souk", "Djerba Midoun", "Beni Khedache"],
  "Tataouine": ["Tataouine Nord", "Tataouine Sud", "Ghomrassen", "Remada", "Dehiba"],
  "Gafsa": ["Gafsa Nord", "Gafsa Sud", "Metlaoui", "Redeyef", "Moulares", "El Guettar", "Sened"],
  "Tozeur": ["Tozeur", "Degache", "Tamerza", "Nefta", "Hazoua"],
  "Kebili": ["Kebili Nord", "Kebili Sud", "Douz Nord", "Douz Sud", "Souk Lahad"],
};
const ALL_GOVS = Object.keys(GOV_DELEGATIONS); // 24 governorates

/* ================================================================== */
/*  Pharmacy & Paramedical generators                                  */
/* ================================================================== */
const PHARMA_FIRST = [
  "Hichem", "Sonia", "Mehdi", "Rim", "Nizar", "Olfa", "Wael", "Imen", "Ahmed", "Fatma",
  "Ali", "Salma", "Omar", "Amira", "Hamza", "Yasmine", "Sofiane", "Dorra", "Bilel", "Manel",
  "Tarek", "Henda", "Adel", "Lamia", "Khaled", "Sabrine", "Raouf", "Emna", "Zied", "Nadia",
  "Sami", "Wafa", "Malek", "Amel", "Fares", "Sahar", "Ghazi", "Asma", "Ismail", "Rania",
  "Hatem", "Khadija", "Mounir", "Nour", "Bassem", "Ines", "Chaker", "Maha", "Lotfi", "Salwa",
  "Habib", "Marwa", "Walid", "Hana", "Riadh", "Leila", "Slim", "Samia", "Ridha", "Jihene",
  "Naceur", "Wissal", "Ramzi", "Sihem", "Mondher", "Afef", "Abdelaziz", "Neila", "Youssef", "Dalila",
  "Karim", "Raja", "Amine", "Souad", "Fathi", "Najet", "Hedi", "Zohra", "Taoufik", "Meriem",
  "Mourad", "Feriel", "Nabil", "Ichrak", "Fethi", "Houda", "Jamel", "Ahlem", "Lassaad", "Olga",
  "Anis", "Chaima", "Bechir", "Eya", "Faouzi", "Rihab", "Noomen", "Sarra", "Habib", "Linda",
  "Skander", "Amani", "Rached", "Nesrine", "Ayman", "Cyrine", "Moez", "Mayssa", "Taha", "Aya",
  "Brahim", "Khaoula", "Wassim", "Ons", "Aymen", "Lina", "Oussama", "Maissa", "Yassine", "Rim",
];
const PHARMA_LAST = [
  "Trabelsi", "Bouslimi", "Jlassi", "Ghorbel", "Hamza", "Saadaoui", "Ferchichi", "Boughdiri",
  "Khelifi", "Mrad", "Louati", "Bouzid", "Zarrouk", "Chaabane", "Ghribi", "Mansouri",
  "Karoui", "Hamdi", "Drissi", "Meddeb", "Bouazizi", "Triki", "Saidi", "Hajri",
  "Ben Youssef", "Tlili", "Gharbi", "Benali", "Dridi", "Hannachi", "Mabrouk", "Fatnassi",
  "Souissi", "Chamkhi", "Mejri", "Brahmi", "Sellami", "Oueslati", "Helali", "Guesmi",
  "Belhadj", "Romdhani", "Nassri", "Ketari", "Amri", "Ben Salah", "Khemiri", "Sfar",
  "Turki", "Grami", "Chebbi", "Makhlouf", "Hammami", "Rezgui", "Ayari", "Boukhris",
  "Sassi", "Arfaoui", "Nouri", "Dhahri",
];
const PHARMA_NAMES = [
  "Pharmacie Centrale", "Pharmacie El Nour", "Pharmacie Ibn Sina", "Pharmacie El Kahena", "Pharmacie du Soleil",
  "Pharmacie El Amal", "Pharmacie de la Republique", "Pharmacie Pasteur", "Pharmacie Avicenne", "Pharmacie El Amen",
  "Pharmacie de la Sante", "Pharmacie El Hayat", "Grande Pharmacie", "Pharmacie El Razi", "Pharmacie de l Etoile",
  "Pharmacie El Merja", "Pharmacie du Centre", "Pharmacie El Wafa", "Pharmacie de la Place", "Pharmacie El Yaqin",
  "Pharmacie Ennasr", "Pharmacie El Manar", "Pharmacie de la Gare", "Pharmacie El Bassatine", "Pharmacie de l Avenir",
];
const PARA_NAMES = [
  "Parapharmacie Beaute Plus", "Parapharmacie El Jawhara", "Parapharmacie Rose de Sable",
  "Parapharmacie Belle Vie", "Parapharmacie Dermo Sante", "Parapharmacie Hana Beauty",
  "Parapharmacie Nour El Ain", "Parapharmacie L Oasis", "Parapharmacie Jasmin",
  "Parapharmacie Eclat de Perle", "Parapharmacie Syrine", "Parapharmacie Nature et Soin",
  "Parapharmacie La Perle", "Parapharmacie Fleur de Peau", "Parapharmacie Douce Peau",
  "Parapharmacie Reine de Beaute", "Parapharmacie El Warda", "Parapharmacie Rituel",
  "Parapharmacie Silhouette", "Parapharmacie Zen Beaute", "Parapharmacie Teint Parfait",
  "Parapharmacie La Source", "Parapharmacie Narcisse", "Parapharmacie Lina Cosmetics",
  "Parapharmacie Derma Expert",
];
const OPENING_HOURS = [
  "08:00 - 20:00", "08:00 - 21:00", "08:30 - 21:00", "08:00 - 22:00", "07:30 - 22:00",
  "08:00 - 19:30", "07:30 - 23:00", "09:00 - 21:00", "08:30 - 20:30", "07:00 - 23:00",
];

function generatePharmaciesAndParas() {
  const pharmacyUsers = [];
  const paraUsers = [];
  const pharmacyIds = [];
  const paraIds = [];
  let phaIdx = 0;
  let paraIdx = 0;

  for (let gi = 0; gi < ALL_GOVS.length; gi++) {
    const gov = ALL_GOVS[gi];
    const dels = GOV_DELEGATIONS[gov];
    for (let di = 0; di < 5; di++) {
      const del = dels[di % dels.length];
      // Pharmacy
      phaIdx++;
      const phaId = "00000000-0000-0000-0000-00000003" + String(phaIdx).padStart(4, "0");
      const phaFirst = PHARMA_FIRST[(gi * 5 + di) % PHARMA_FIRST.length];
      const phaLast = PHARMA_LAST[(gi * 5 + di) % PHARMA_LAST.length];
      const phaCompany = PHARMA_NAMES[(gi * 5 + di) % PHARMA_NAMES.length] + " " + del;
      const phaEmail = "pharmacie." + gov.toLowerCase().replace(/[^a-z]/g, "") + "." + (di + 1) + "@megacare.tn";
      const phaPhone = "+216 " + pick(["71", "72", "73", "74", "75", "76", "77", "78", "79"]) + " " + String(rand(100, 999)) + " " + String(rand(100, 999));
      pharmacyIds.push(phaId);
      pharmacyUsers.push({
        _id: phaId, firstName: phaFirst, lastName: phaLast,
        email: phaEmail, password: "Pharmacien@2024",
        role: "pharmacy", status: "approved", phone: phaPhone,
        pharmacyId: "PHARM-TN-2024-" + String(phaIdx).padStart(4, "0"),
        companyName: phaCompany,
        address: String(rand(1, 120)) + " " + pick(["Avenue Habib Bourguiba", "Rue de la Republique", "Avenue de la Liberte", "Rue Ibn Sina", "Boulevard du 7 Novembre", "Avenue Farhat Hached", "Rue de Marseille", "Avenue de Carthage"]) + ", " + del,
        governorate: gov, delegation: del,
        wilaya: gov, city: del,
        openingHours: pick(OPENING_HOURS), isOnDuty: Math.random() > 0.5,
        description: "Pharmacie agreee avec large stock de medicaments et parapharmacie",
      });

      // Paramedical (parapharmacie)
      paraIdx++;
      const paraId = "00000000-0000-0000-0000-00000006" + String(paraIdx).padStart(4, "0");
      const paraFirst = PHARMA_FIRST[(gi * 5 + di + 60) % PHARMA_FIRST.length];
      const paraLast = PHARMA_LAST[(gi * 5 + di + 30) % PHARMA_LAST.length];
      const paraCompany = PARA_NAMES[(gi * 5 + di) % PARA_NAMES.length] + " " + del;
      const paraEmail = "para." + gov.toLowerCase().replace(/[^a-z]/g, "") + "." + (di + 1) + "@megacare.tn";
      const paraPhone = "+216 " + pick(["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "50", "51", "52", "53", "54", "55", "56", "58", "92", "93", "94", "95", "96", "97", "98", "99"]) + " " + String(rand(100, 999)) + " " + String(rand(100, 999));
      paraIds.push(paraId);
      paraUsers.push({
        _id: paraId, firstName: paraFirst, lastName: paraLast,
        email: paraEmail, password: "Paramedical@2024",
        role: "paramedical", status: "approved", phone: paraPhone,
        paramedicalId: "PARA-TN-2024-" + String(paraIdx).padStart(4, "0"),
        companyName: paraCompany,
        address: String(rand(1, 80)) + " " + pick(["Avenue Habib Bourguiba", "Rue de la Republique", "Avenue de la Liberte", "Boulevard du 7 Novembre", "Rue du Commerce", "Avenue de Carthage", "Rue de Paris"]) + ", " + del,
        governorate: gov, delegation: del,
        openingHours: pick(OPENING_HOURS),
        description: "Parapharmacie specialisee en soins de beaute, cosmetiques et produits dermatologiques",
      });
    }
  }
  return { pharmacyUsers, paraUsers, pharmacyIds, paraIds };
}

const generated = generatePharmaciesAndParas();

/* ================================================================== */
/*  IDs                                                                */
/* ================================================================== */
const ID = {
  admin1: "00000000-0000-0000-0000-000000000001",
  // Patients
  pat1: "00000000-0000-0000-0000-000000000101",
  pat2: "00000000-0000-0000-0000-000000000102",
  pat3: "00000000-0000-0000-0000-000000000103",
  pat4: "00000000-0000-0000-0000-000000000104",
  pat5: "00000000-0000-0000-0000-000000000105",
  pat6: "00000000-0000-0000-0000-000000000106",
  pat7: "00000000-0000-0000-0000-000000000107",
  pat8: "00000000-0000-0000-0000-000000000108",
  // Doctors
  doc1: "00000000-0000-0000-0000-000000000201",
  doc2: "00000000-0000-0000-0000-000000000202",
  doc3: "00000000-0000-0000-0000-000000000203",
  doc4: "00000000-0000-0000-0000-000000000204",
  // Lab
  lab1: "00000000-0000-0000-0000-000000000401",
  lab2: "00000000-0000-0000-0000-000000000402",
  // Medical service
  svc1: "00000000-0000-0000-0000-000000000501",
  // First paramedical (kept for paramed patient/appointment references)
  para1: generated.paraIds[0],
  para2: generated.paraIds[1],
};

const PATIENTS = [ID.pat1, ID.pat2, ID.pat3, ID.pat4, ID.pat5, ID.pat6, ID.pat7, ID.pat8];
const PHARMACIES = generated.pharmacyIds;
const PARAMEDICALS = generated.paraIds;

/* ================================================================== */
/*  USERS                                                              */
/* ================================================================== */
const seedUsers = [
  // Admin
  { _id: ID.admin1, firstName: "Nabil", lastName: "Gharbi", email: "admin@megacare.tn", password: "Admin@megacare2024", role: "admin", status: "approved", phone: "+216 71 800 100", governorate: "Tunis", delegation: "Tunis" },
  // 8 Patients
  { _id: ID.pat1, firstName: "Fatima", lastName: "Benali", email: "fatima.benali@gmail.com", password: "Patient@2024", role: "patient", status: "approved", phone: "+216 98 123 456", governorate: "Tunis", delegation: "La Marsa" },
  { _id: ID.pat2, firstName: "Mohamed", lastName: "Karoui", email: "mohamed.karoui@gmail.com", password: "Patient@2024", role: "patient", status: "approved", phone: "+216 98 234 567", governorate: "Ariana", delegation: "Ariana Ville" },
  { _id: ID.pat3, firstName: "Aisha", lastName: "Hamdi", email: "aisha.hamdi@gmail.com", password: "Patient@2024", role: "patient", status: "approved", phone: "+216 98 345 678", governorate: "Tunis", delegation: "Bardo" },
  { _id: ID.pat4, firstName: "Salim", lastName: "Drissi", email: "salim.drissi@gmail.com", password: "Patient@2024", role: "patient", status: "approved", phone: "+216 98 456 789", governorate: "Sousse", delegation: "Sousse Ville" },
  { _id: ID.pat5, firstName: "Layla", lastName: "Meddeb", email: "layla.meddeb@gmail.com", password: "Patient@2024", role: "patient", status: "approved", phone: "+216 98 567 890", governorate: "Tunis", delegation: "Manouba" },
  { _id: ID.pat6, firstName: "Youssef", lastName: "Bouazizi", email: "youssef.bouazizi@gmail.com", password: "Patient@2024", role: "patient", status: "approved", phone: "+216 52 112 233", governorate: "Sfax", delegation: "Sfax Ville" },
  { _id: ID.pat7, firstName: "Nour", lastName: "Triki", email: "nour.triki@gmail.com", password: "Patient@2024", role: "patient", status: "approved", phone: "+216 55 998 877", governorate: "Ariana", delegation: "Raoued" },
  { _id: ID.pat8, firstName: "Karim", lastName: "Saidi", email: "karim.saidi@gmail.com", password: "Patient@2024", role: "patient", status: "approved", phone: "+216 97 332 211", governorate: "Sousse", delegation: "Hammam Sousse" },
  // 4 Doctors (3 approved + 1 pending)
  { _id: ID.doc1, firstName: "Amira", lastName: "Mansouri", email: "dr.mansouri@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 234 567", specialization: "Cardiologie", doctorId: "MED-TN-2024-0742", governorate: "Tunis", delegation: "Tunis" },
  { _id: ID.doc2, firstName: "Slim", lastName: "Hajri", email: "dr.hajri@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 345 678", specialization: "Dermatologie", doctorId: "MED-TN-2024-0891", governorate: "Ariana", delegation: "Ariana Ville" },
  { _id: ID.doc3, firstName: "Ines", lastName: "Ben Youssef", email: "dr.benyoussef@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 456 789", specialization: "Pediatrie", doctorId: "MED-TN-2024-0556", governorate: "Sousse", delegation: "Sousse Ville" },
  { _id: ID.doc4, firstName: "Karim", lastName: "Tlili", email: "dr.tlili@megacare.tn", password: "Medecin@2024", role: "doctor", status: "pending", phone: "+216 71 321 654", specialization: "Neurologie", doctorId: "MED-TN-2024-0991", governorate: "Tunis", delegation: "Bardo" },
  // 120 Pharmacies (5 per governorate) — generated
  ...generated.pharmacyUsers,
  // 2 Labs
  { _id: ID.lab1, firstName: "Yassine", lastName: "Bouzid", email: "labo.elamal@megacare.tn", password: "Labo@2024", role: "lab_radiology", status: "approved", phone: "+216 71 456 890", labId: "LAB-TN-2024-0031", companyName: "Laboratoire El Amal", governorate: "Ariana", delegation: "Ariana Ville" },
  { _id: ID.lab2, firstName: "Rym", lastName: "Ferchichi", email: "labo.pasteur@megacare.tn", password: "Labo@2024", role: "lab_radiology", status: "approved", phone: "+216 71 567 901", labId: "LAB-TN-2024-0042", companyName: "Centre Radio-Diagnostic Pasteur", governorate: "Tunis", delegation: "Tunis" },
  // Medical service
  { _id: ID.svc1, firstName: "Rania", lastName: "Cherif", email: "had.sante@megacare.tn", password: "Service@2024", role: "medical_service", status: "approved", phone: "+216 71 789 456", serviceId: "SVC-TN-2024-0012", companyName: "HAD Sante a Domicile", governorate: "Tunis", delegation: "Tunis" },
  // 120 Paramedicals / Parapharmacies (5 per governorate) — generated
  ...generated.paraUsers,
];

/* ================================================================== */
/*  MEDICINES (global catalog - 25 products)                           */
/* ================================================================== */
const MEDICINES = [
  { _id: "med-01", name: "Paracetamol 500mg", dci: "Paracetamol", category: "Analgesique", form: "Comprimes", brand: "DOLIPRANE", requiresPrescription: false, description: "Antalgique et antipyretique", imageUrl: "", usage: "1 a 2 comprimes toutes les 4 a 6 heures. Maximum 8 comprimes/jour.", contraindications: "Insuffisance hepatique severe", sideEffects: "Rarement : reactions allergiques" },
  { _id: "med-02", name: "Amoxicilline 500mg", dci: "Amoxicilline", category: "Antibiotique", form: "Gelules", brand: "CLAMOXYL", requiresPrescription: true, description: "Antibiotique penicilline", imageUrl: "", usage: "500 mg toutes les 8 heures pendant 7 a 14 jours.", contraindications: "Allergie aux penicillines", sideEffects: "Diarrhee, nausees" },
  { _id: "med-03", name: "Vitamine C 1000mg", dci: "Acide ascorbique", category: "Vitamines", form: "Comprimes effervescents", brand: "UPSA-C", requiresPrescription: false, description: "Renforce l immunite", imageUrl: "", usage: "1 comprime par jour dissous dans un verre d eau.", contraindications: "Lithiases renales oxaliques", sideEffects: "Troubles digestifs a forte dose" },
  { _id: "med-04", name: "Ibuprofene 400mg", dci: "Ibuprofene", category: "Anti-inflammatoire", form: "Comprimes", brand: "ADVIL", requiresPrescription: false, description: "Anti-inflammatoire non steroidien", imageUrl: "", usage: "400 mg toutes les 6 a 8 heures au cours des repas.", contraindications: "Ulcere gastroduodenal, grossesse", sideEffects: "Troubles digestifs" },
  { _id: "med-05", name: "Omeprazole 20mg", dci: "Omeprazole", category: "Gastro-enterologie", form: "Gelules gastro-resistantes", brand: "MOPRAL", requiresPrescription: true, description: "Inhibiteur de la pompe a protons", imageUrl: "", usage: "20 mg par jour le matin avant le repas.", contraindications: "Association avec le nelfinavir", sideEffects: "Maux de tete, nausees" },
  { _id: "med-06", name: "Loratadine 10mg", dci: "Loratadine", category: "Antihistaminique", form: "Comprimes", brand: "CLARITYNE", requiresPrescription: false, description: "Antihistaminique non sedatif", imageUrl: "", usage: "1 comprime par jour.", contraindications: "Insuffisance hepatique severe", sideEffects: "Somnolence rare, cephalees" },
  { _id: "med-07", name: "Amlodipine 5mg", dci: "Amlodipine", category: "Antihypertenseur", form: "Comprimes", brand: "AMLOR", requiresPrescription: true, description: "Inhibiteur calcique pour hypertension", imageUrl: "", usage: "5 mg une fois par jour.", contraindications: "Hypotension severe", sideEffects: "Oedemes des chevilles, bouffees de chaleur" },
  { _id: "med-08", name: "Metformine 850mg", dci: "Metformine", category: "Antidiabetique", form: "Comprimes", brand: "GLUCOPHAGE", requiresPrescription: true, description: "Antidiabetique oral de premiere intention", imageUrl: "", usage: "850 mg 2 a 3 fois par jour au cours des repas.", contraindications: "Insuffisance renale severe", sideEffects: "Troubles digestifs frequents en debut de traitement" },
  { _id: "med-09", name: "Atorvastatine 20mg", dci: "Atorvastatine", category: "Cardiologie", form: "Comprimes pellicules", brand: "TAHOR", requiresPrescription: true, description: "Statine - hypocholesterolemiant", imageUrl: "", usage: "20 mg une fois par jour le soir.", contraindications: "Maladie hepatique active", sideEffects: "Myalgies, troubles digestifs" },
  { _id: "med-10", name: "Azithromycine 250mg", dci: "Azithromycine", category: "Antibiotique", form: "Comprimes", brand: "ZITHROMAX", requiresPrescription: true, description: "Macrolide a large spectre", imageUrl: "", usage: "500 mg J1 puis 250 mg/j de J2 a J5.", contraindications: "Allergie aux macrolides", sideEffects: "Diarrhee, nausees" },
  { _id: "med-11", name: "Diclofenac 50mg", dci: "Diclofenac", category: "Anti-inflammatoire", form: "Comprimes", brand: "VOLTARENE", requiresPrescription: true, description: "AINS puissant", imageUrl: "", usage: "50 mg 2 a 3 fois par jour au cours des repas.", contraindications: "Insuffisance cardiaque, ulcere", sideEffects: "Douleurs gastriques, vertiges" },
  { _id: "med-12", name: "Cetirizine 10mg", dci: "Cetirizine", category: "Antihistaminique", form: "Comprimes", brand: "ZYRTEC", requiresPrescription: false, description: "Anti-allergique", imageUrl: "", usage: "1 comprime par jour.", contraindications: "Insuffisance renale terminale", sideEffects: "Somnolence possible" },
  { _id: "med-13", name: "Pantoprazole 40mg", dci: "Pantoprazole", category: "Gastro-enterologie", form: "Comprimes gastro-resistants", brand: "INIPOMP", requiresPrescription: true, description: "IPP - reflux gastro-oesophagien", imageUrl: "", usage: "40 mg par jour le matin a jeun.", contraindications: "Hypersensibilite", sideEffects: "Cephalees, diarrhee" },
  { _id: "med-14", name: "Levothyroxine 50ug", dci: "Levothyroxine", category: "Endocrinologie", form: "Comprimes", brand: "LEVOTHYROX", requiresPrescription: true, description: "Hormone thyroidienne de substitution", imageUrl: "", usage: "Dose individuelle a jeun 30 min avant le petit-dejeuner.", contraindications: "Thyrotoxicose non traitee", sideEffects: "Palpitations en cas de surdosage" },
  { _id: "med-15", name: "Acide folique 5mg", dci: "Acide folique", category: "Vitamines", form: "Comprimes", brand: "SPECIAFOLDINE", requiresPrescription: false, description: "Vitamine B9 - grossesse et anemie", imageUrl: "", usage: "1 comprime par jour.", contraindications: "Tumeurs folate-dependantes", sideEffects: "Generalement bien tolere" },
  { _id: "med-16", name: "Salbutamol 100ug", dci: "Salbutamol", category: "Pneumologie", form: "Spray", brand: "VENTOLINE", requiresPrescription: true, description: "Bronchodilatateur d action rapide", imageUrl: "", usage: "1 a 2 bouffees en cas de crise, max 8/jour.", contraindications: "Hypersensibilite", sideEffects: "Tremblements, tachycardie" },
  { _id: "med-17", name: "Prednisone 20mg", dci: "Prednisone", category: "Anti-inflammatoire", form: "Comprimes", brand: "CORTANCYL", requiresPrescription: true, description: "Corticosteroide anti-inflammatoire", imageUrl: "", usage: "Dose variable selon indication, le matin au cours du repas.", contraindications: "Infection non controlee", sideEffects: "Prise de poids, insomnie, hyperglycemie" },
  { _id: "med-18", name: "Fer 80mg", dci: "Sulfate ferreux", category: "Vitamines", form: "Comprimes", brand: "TARDYFERON", requiresPrescription: false, description: "Supplement en fer - anemie ferriprive", imageUrl: "", usage: "1 comprime par jour au cours d un repas.", contraindications: "Surcharge en fer", sideEffects: "Selles noires, constipation" },
  { _id: "med-19", name: "Ciprofloxacine 500mg", dci: "Ciprofloxacine", category: "Antibiotique", form: "Comprimes", brand: "CIFLOX", requiresPrescription: true, description: "Fluoroquinolone - infections urinaires", imageUrl: "", usage: "500 mg 2 fois par jour pendant 5 a 14 jours.", contraindications: "Grossesse, enfants", sideEffects: "Tendinopathies, photosensibilite" },
  { _id: "med-20", name: "Magnesium 300mg", dci: "Magnesium", category: "Vitamines", form: "Comprimes", brand: "MAG 2", requiresPrescription: false, description: "Supplement en magnesium - fatigue, crampes", imageUrl: "", usage: "2 comprimes par jour au cours des repas.", contraindications: "Insuffisance renale severe", sideEffects: "Diarrhee a forte dose" },
  { _id: "med-21", name: "Losartan 50mg", dci: "Losartan", category: "Antihypertenseur", form: "Comprimes pellicules", brand: "COZAAR", requiresPrescription: true, description: "Antagoniste des recepteurs de l angiotensine II", imageUrl: "", usage: "50 mg une fois par jour.", contraindications: "Grossesse", sideEffects: "Hypotension, hyperkaliemie" },
  { _id: "med-22", name: "Tramadol 50mg", dci: "Tramadol", category: "Analgesique", form: "Gelules", brand: "TOPALGIC", requiresPrescription: true, description: "Antalgique opioide de palier 2", imageUrl: "", usage: "50 a 100 mg toutes les 4 a 6h. Max 400 mg/jour.", contraindications: "Epilepsie non controlee", sideEffects: "Nausees, vertiges, somnolence" },
  { _id: "med-23", name: "Domperidone 10mg", dci: "Domperidone", category: "Gastro-enterologie", form: "Comprimes", brand: "MOTILIUM", requiresPrescription: false, description: "Anti-nauseeux", imageUrl: "", usage: "10 mg 3 fois par jour avant les repas.", contraindications: "Prolactinome", sideEffects: "Rarement : allongement QT" },
  { _id: "med-24", name: "Fluconazole 150mg", dci: "Fluconazole", category: "Dermatologie", form: "Gelule unique", brand: "TRIFLUCAN", requiresPrescription: true, description: "Antifongique - candidoses", imageUrl: "", usage: "150 mg dose unique ou traitement prolonge selon indication.", contraindications: "Association avec cisapride", sideEffects: "Nausees, cephalees" },
  { _id: "med-25", name: "Vitamine D3 100000 UI", dci: "Cholecalciferol", category: "Vitamines", form: "Solution buvable", brand: "UVEDOSE", requiresPrescription: false, description: "Vitamine D - prevention carence", imageUrl: "", usage: "1 ampoule tous les 3 mois.", contraindications: "Hypercalcemie", sideEffects: "Surdosage : nausees, fatigue" },
];

/* ================================================================== */
/*  Product builder                                                    */
/* ================================================================== */
function makeProducts(pharmacyId, pharmacyName, subset) {
  return subset.map(function (med, i) {
    return {
      _id: "prod-" + pharmacyId.slice(-6) + "-" + String(i + 1).padStart(2, "0"),
      medicineId: med._id,
      pharmacyId: pharmacyId,
      name: med.name,
      category: med.category,
      price: +(rand(150, 3500) / 100).toFixed(2),
      stock: rand(0, 120),
      requiresPrescription: med.requiresPrescription,
      form: med.form,
      brand: med.brand,
      dci: med.dci,
      rating: 0,
      reviews: 0,
      description: med.description,
      imageUrl: med.imageUrl,
      pharmacy: pharmacyName,
      usage: med.usage,
      contraindications: med.contraindications,
      sideEffects: med.sideEffects,
    };
  });
}

/* ================================================================== */
/*  Appointments builder (30 past days + 7 future)                     */
/* ================================================================== */
function makeAppointments() {
  const reasons = [
    "Consultation de suivi - hypertension",
    "Douleurs thoraciques - bilan cardiaque",
    "Controle annuel - diabete type 2",
    "Eruption cutanee persistante",
    "Consultation pediatrique - fievre enfant",
    "Renouvellement ordonnance",
    "Bilan sanguin de controle",
    "Consultation dermatologie - acne",
    "Vaccination rappel",
    "Douleur articulaire genou",
    "Examen neurologique de routine",
    "Consultation ORL",
    "Suivi post-operatoire",
    "Consultation nutrition",
  ];

  const appts = [];
  const approvedDocs = [ID.doc1, ID.doc2, ID.doc3];

  // Past 30 days
  for (let day = 29; day >= 0; day--) {
    const count = rand(2, 5);
    for (let j = 0; j < count; j++) {
      const patId = pick(PATIENTS);
      const pat = seedUsers.find((u) => u._id === patId);
      const status = day > 0 ? pick(["completed", "confirmed", "cancelled"]) : pick(["confirmed", "completed", "cancelled", "pending"]);
      appts.push({
        _id: uuid(),
        patientId: patId,
        patientName: pat.firstName + " " + pat.lastName,
        doctorId: pick(approvedDocs),
        date: dateStr(daysAgo(day)),
        time: timeSlot(),
        fee: pick([60, 80, 100, 120, 150]),
        reason: pick(reasons),
        status: status,
      });
    }
  }

  // Next 7 days
  for (let day = 1; day <= 7; day++) {
    const count = rand(1, 3);
    for (let j = 0; j < count; j++) {
      const patId = pick(PATIENTS);
      const pat = seedUsers.find((u) => u._id === patId);
      appts.push({
        _id: uuid(),
        patientId: patId,
        patientName: pat.firstName + " " + pat.lastName,
        doctorId: pick(approvedDocs),
        date: dateStr(daysFromNow(day)),
        time: timeSlot(),
        fee: pick([60, 80, 100, 120]),
        reason: pick(reasons),
        status: "confirmed",
      });
    }
  }
  return appts;
}

/* ================================================================== */
/*  Messages builder                                                   */
/* ================================================================== */
function makeMessages() {
  const msgs = [];
  const convoPairs = [
    [ID.pat1, ID.doc1], [ID.pat2, ID.doc1], [ID.pat3, ID.doc2],
    [ID.pat1, ID.doc2], [ID.pat4, ID.doc3], [ID.pat5, ID.doc1],
    [ID.pat6, ID.doc2], [ID.pat7, ID.doc3],
  ];
  const texts = [
    "Bonjour Docteur, j ai une question concernant mon traitement.",
    "Bien sur, je vous ecoute. Quels sont vos symptomes ?",
    "J ai des maux de tete frequents depuis une semaine.",
    "Je vous recommande de prendre du paracetamol et de revenir si ca persiste.",
    "Merci Docteur. Et pour mes resultats d analyses ?",
    "Vos resultats sont normaux, pas d inquietude.",
    "D accord, merci beaucoup pour votre retour rapide.",
    "Je vous en prie. N hesitez pas si vous avez d autres questions.",
    "Docteur, j ai oublie la posologie prescrite.",
    "2 comprimes par jour pendant 7 jours, matin et soir au cours du repas.",
    "Merci ! Je dois reprendre rendez-vous pour le controle ?",
    "Oui, dans 2 semaines. Vous pouvez reserver en ligne.",
  ];

  for (let ci = 0; ci < convoPairs.length; ci++) {
    const patId = convoPairs[ci][0];
    const docId = convoPairs[ci][1];
    const pat = seedUsers.find((u) => u._id === patId);
    const doc = seedUsers.find((u) => u._id === docId);
    const msgCount = rand(3, 6);
    for (let i = 0; i < msgCount; i++) {
      const fromPatient = i % 2 === 0;
      msgs.push({
        _id: uuid(),
        senderId: fromPatient ? patId : docId,
        senderName: fromPatient ? pat.firstName + " " + pat.lastName : "Dr. " + doc.lastName,
        senderRole: fromPatient ? "patient" : "doctor",
        receiverId: fromPatient ? docId : patId,
        receiverName: fromPatient ? "Dr. " + doc.lastName : pat.firstName + " " + pat.lastName,
        receiverRole: fromPatient ? "doctor" : "patient",
        content: texts[(i + ci) % texts.length],
        read: i < msgCount - 1,
        createdAt: daysAgo(rand(0, 10)),
      });
    }
  }
  return msgs;
}

/* ================================================================== */
/*  Dossiers builder                                                   */
/* ================================================================== */
function makeDossiers() {
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "O+", "O-"];
  return PATIENTS.map(function (patId) {
    return {
      patientId: patId,
      personal: {
        age: rand(22, 65),
        gender: pick(["Masculin", "Feminin"]),
        bloodType: pick(bloodTypes),
        height: rand(155, 190),
        weight: rand(52, 95),
      },
      medicalHistory: {
        chronicIllnesses: pick([["Hypertension arterielle"], ["Diabete type 2"], ["Asthme"], [], ["Hypothyroidie"], ["Hypertension arterielle", "Diabete type 2"]]),
        pastSurgeries: pick([
          [{ name: "Appendicectomie", date: "2018", notes: "Sans complications" }],
          [],
          [{ name: "Cholecystectomie", date: "2020", notes: "Coelioscopie" }],
          [{ name: "Arthroscopie genou", date: "2019", notes: "Menisque interne" }],
        ]),
        familyHistory: pick([
          [{ condition: "Diabete", relation: "Mere" }],
          [{ condition: "Hypertension", relation: "Pere" }],
          [{ condition: "Cancer du sein", relation: "Grand-mere" }],
          [],
          [{ condition: "Diabete", relation: "Pere" }, { condition: "Hypertension", relation: "Mere" }],
        ]),
      },
      allergies: pick([
        [{ type: "Medicament", name: "Penicilline", severity: "Severe", reaction: "Choc anaphylactique" }],
        [{ type: "Environnement", name: "Pollen", severity: "Moderee", reaction: "Rhinite allergique" }],
        [],
        [{ type: "Alimentaire", name: "Arachides", severity: "Severe", reaction: "Urticaire generalisee" }],
        [{ type: "Medicament", name: "Aspirine", severity: "Moderee", reaction: "Bronchospasme" }],
        [{ type: "Contact", name: "Latex", severity: "Legere", reaction: "Dermatite de contact" }],
      ]),
      activeMedications: pick([
        [{ name: "Amlodipine 5mg", dosage: "5mg", frequency: "1/jour", since: "2023-01" }],
        [{ name: "Metformine 850mg", dosage: "850mg", frequency: "2/jour", since: "2022-06" }, { name: "Atorvastatine 20mg", dosage: "20mg", frequency: "1/jour", since: "2023-03" }],
        [],
        [{ name: "Levothyroxine 50ug", dosage: "50ug", frequency: "1/jour", since: "2021-09" }],
      ]),
      documents: [
        { id: uuid(), type: "Analyse", name: "Bilan sanguin complet", date: dateStr(daysAgo(rand(5, 25))), description: "Bilan de routine" },
        { id: uuid(), type: "Radio", name: "Radiographie thoracique", date: dateStr(daysAgo(rand(30, 60))), description: "Controle annuel" },
      ],
      consultations: [],
    };
  });
}

/* ================================================================== */
/*  Orders builder (30 days)                                           */
/* ================================================================== */
function makeOrders() {
  const orders = [];
  const statusWeights = ["completed", "completed", "completed", "completed", "pending", "pending", "cancelled"];
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const genCode = () => { let c = ""; for (let i = 0; i < 8; i++) c += chars[Math.floor(Math.random() * chars.length)]; return c; };
  const usedCodes = new Set();
  for (let day = 29; day >= 0; day--) {
    const numOrders = rand(1, 4);
    for (let j = 0; j < numOrders; j++) {
      const pharmacyId = pick(PHARMACIES);
      const patId = pick(PATIENTS);
      const itemCount = rand(1, 4);
      const items = [];
      for (let k = 0; k < itemCount; k++) {
        const med = pick(MEDICINES);
        const qty = rand(1, 3);
        items.push({ productId: uuid(), name: med.name, quantity: qty, price: +(rand(200, 3000) / 100).toFixed(2) });
      }
      const total = +items.reduce((s, it) => s + it.price * it.quantity, 0).toFixed(2);
      let code = genCode();
      while (usedCodes.has(code)) code = genCode();
      usedCodes.add(code);
      const method = pick(["pickup", "pickup", "pickup", "delivery"]);
      orders.push({
        _id: uuid(),
        userId: patId,
        pharmacyId: pharmacyId,
        orderCode: code,
        items: items,
        total: total,
        deliveryMethod: method,
        deliveryAddress: method === "delivery" ? "Rue de la Republique 42" : "",
        deliveryGovernorate: method === "delivery" ? "Tunis" : "",
        deliveryDelegation: method === "delivery" ? "La Marsa" : "",
        deliveryPhone: method === "delivery" ? "+216 98 111 222" : "",
        status: day > 0 ? pick(statusWeights) : pick(["pending", "completed"]),
        createdAt: daysAgo(day),
      });
    }
  }
  return orders;
}

/* ================================================================== */
/*  Reviews builder                                                    */
/* ================================================================== */
function makeReviews() {
  const reviewTexts = [
    "Medecin tres a l ecoute et professionnel. Je recommande vivement.",
    "Consultation rapide et efficace. Diagnostic precis.",
    "Tres bon suivi medical. Le docteur prend le temps d expliquer.",
    "Cabinet propre et bien organise. Temps d attente raisonnable.",
    "Excellente prise en charge de ma pathologie chronique.",
    "Je suis tres satisfait du traitement prescrit, amelioration rapide.",
    "Accueil chaleureux. Le docteur est tres competent.",
    "Un peu d attente mais la consultation valait le detour.",
    "Suivi exemplaire. Le docteur rappelle pour prendre des nouvelles.",
    "Professionnel et humain. Mon medecin depuis 3 ans.",
    "Bonne communication, explications claires sur le diagnostic.",
    "Le docteur a su me rassurer lors d un moment d inquietude.",
  ];
  const reviews = [];
  const docIds = [ID.doc1, ID.doc2, ID.doc3];
  for (const docId of docIds) {
    const count = rand(5, 10);
    for (let i = 0; i < count; i++) {
      const patA = pick(seedUsers.filter((u) => u.role === "patient"));
      reviews.push({
        _id: uuid(),
        doctorId: docId,
        patientId: pick(PATIENTS),
        patientName: patA.firstName + " " + patA.lastName,
        rating: pick([4, 4, 4, 5, 5, 5, 5, 3]),
        text: pick(reviewTexts),
        type: pick(["Cabinet", "Vid\u00e9o"]),
        helpful: rand(0, 15),
        createdAt: daysAgo(rand(0, 28)),
      });
    }
  }
  return reviews;
}

/* ================================================================== */
/*  Prescriptions builder                                              */
/* ================================================================== */
function makePrescriptions() {
  const rxs = [];
  for (let i = 0; i < 25; i++) {
    const docId = pick([ID.doc1, ID.doc2, ID.doc3]);
    const patId = pick(PATIENTS);
    const medCount = rand(1, 4);
    const meds = [];
    const used = {};
    for (let m = 0; m < medCount; m++) {
      let med;
      do {
        med = pick(MEDICINES.filter((x) => x.requiresPrescription));
      } while (used[med._id]);
      used[med._id] = true;
      meds.push({
        name: med.name,
        dosage: pick(["1 comprime/jour", "2 comprimes/jour", "1 matin et soir", "3 fois/jour"]),
        duration: pick(["7 jours", "14 jours", "30 jours", "3 mois"]),
      });
    }
    const created = daysAgo(rand(0, 28));
    rxs.push({
      _id: uuid(),
      doctorId: docId,
      patientId: patId,
      medicines: meds,
      status: pick(["en_attente", "valid\u00e9e", "valid\u00e9e", "valid\u00e9e", "expir\u00e9e"]),
      expiryDate: daysFromNow(rand(30, 90)),
      scanned: pick([true, false]),
      pharmacyId: pick(PHARMACIES.concat([""])),
      notes: pick(["Renouvellement mensuel", "Premier traitement", "Adaptation posologie", ""]),
      secretCode: require("crypto").randomBytes(4).toString("hex").toUpperCase(),
      purchaseStatus: pick(["pending", "pending", "pending", "purchased"]),
      createdAt: created,
    });
  }
  return rxs;
}

/* ================================================================== */
/*  Lab tests & results builder                                        */
/* ================================================================== */
function makeLabData() {
  const testTypes = [
    "Bilan sanguin complet", "Glycemie a jeun", "Profil lipidique",
    "TSH", "Creatinine", "Hemoglobine glyquee", "NFS", "CRP",
    "Vitesse de sedimentation", "Bilan hepatique",
  ];
  const tests = [];
  const results = [];

  for (let i = 0; i < 30; i++) {
    const patId = pick(PATIENTS);
    const pat = seedUsers.find((u) => u._id === patId);
    const testType = pick(testTypes);
    const status = pick(["Compl\u00e9t\u00e9", "Compl\u00e9t\u00e9", "Compl\u00e9t\u00e9", "En attente", "En cours"]);
    const tId = uuid();
    const created = daysAgo(rand(0, 28));

    tests.push({
      _id: tId,
      patient: pat.firstName + " " + pat.lastName,
      testType: testType,
      doctor: pick(["Dr. Mansouri", "Dr. Hajri", "Dr. Ben Youssef"]),
      status: status,
      priority: pick(["Normal", "Normal", "Normal", "Urgent"]),
      date: dateStr(created),
      notes: pick(["Bilan de routine", "Suivi traitement", "Controle annuel", ""]),
      createdAt: created,
    });

    if (status === "Compl\u00e9t\u00e9") {
      const valMap = {
        "Glycemie a jeun": { value: (rand(70, 140) / 10).toFixed(1), unit: "mmol/L", ref: "3.9-6.1" },
        "TSH": { value: (rand(5, 80) / 10).toFixed(1), unit: "mUI/L", ref: "0.4-4.0" },
        "Creatinine": { value: String(rand(60, 130)), unit: "umol/L", ref: "62-106" },
        "CRP": { value: String(rand(1, 50)), unit: "mg/L", ref: "< 5" },
        "Hemoglobine glyquee": { value: (rand(45, 90) / 10).toFixed(1), unit: "%", ref: "4.0-5.6" },
      };
      const val = valMap[testType] || { value: String(rand(35, 180)), unit: "g/L", ref: "Normes variables" };

      results.push({
        _id: uuid(),
        patient: pat.firstName + " " + pat.lastName,
        testType: testType,
        value: val.value,
        unit: val.unit,
        reference: val.ref,
        status: pick(["Normal", "Normal", "\u00c9lev\u00e9", "Critique"]),
        doctor: pick(["Dr. Mansouri", "Dr. Hajri", "Dr. Ben Youssef"]),
        date: dateStr(created),
        createdAt: created,
      });
    }
  }
  return { tests, results };
}

/* ================================================================== */
/*  Supplier orders builder                                            */
/* ================================================================== */
function makeSupplierOrders() {
  const suppliers = ["SAIPH", "Adwya", "Teriak", "Medis", "Unimed", "Dar El Dawa", "Opalia Pharma"];
  const orders = [];
  for (let i = 0; i < 15; i++) {
    const created = daysAgo(rand(0, 25));
    const itemCount = rand(2, 5);
    const items = [];
    for (let j = 0; j < itemCount; j++) {
      items.push({ name: pick(MEDICINES).name, qty: rand(20, 200), unit: "boites" });
    }
    orders.push({
      _id: uuid(),
      ref: "CMD-" + String(rand(1000, 9999)),
      supplier: pick(suppliers),
      date: dateStr(created),
      expectedDate: dateStr(daysFromNow(rand(2, 14))),
      items: items,
      total: rand(500, 5000),
      status: pick(["Livr\u00e9", "Livr\u00e9", "En transit", "En attente", "En attente"]),
      createdAt: created,
    });
  }
  return orders;
}

/* ================================================================== */
/*  Medical service data builder                                       */
/* ================================================================== */
function makeMedServiceData() {
  const patientNames = [
    "Habib Mabrouk", "Zohra Fatnassi", "Ali Hannachi", "Khadija Dridi",
    "Faouzi Sghaier", "Mounira Belkhir", "Taoufik Gharsalli", "Najla Othman",
  ];
  const conditions = [
    "Insuffisance cardiaque", "Post-AVC reeducation", "Diabete decompense",
    "Fracture du col femoral", "BPCO severe", "Soins palliatifs",
    "Plaie chronique", "Post-chirurgie hanche",
  ];
  const nurseNames = ["Inf. Sana", "Inf. Raouf", "Inf. Houda", "Inf. Anis", "Inf. Mariam"];

  const patients = patientNames.map(function (name, i) {
    return {
      _id: uuid(),
      userId: ID.svc1,
      name: name,
      age: rand(55, 85),
      condition: conditions[i % conditions.length],
      status: pick(["En cours", "En cours", "En cours", "Suspendu", "Termin\u00e9"]),
      startDate: dateStr(daysAgo(rand(5, 60))),
      nurse: pick(nurseNames),
      phone: "+216 " + rand(50, 99) + " " + rand(100, 999) + " " + rand(100, 999),
    };
  });

  const equipment = [
    { name: "Concentrateur O2 Philips", type: "Respiratoire", serial: "OXY-" + rand(1000, 9999), status: "En utilisation", patient: patients[0].name },
    { name: "Moniteur cardiaque Contec", type: "Monitoring", serial: "ECG-" + rand(1000, 9999), status: "En utilisation", patient: patients[1].name },
    { name: "Lit medicalise electrique", type: "Mobilier", serial: "LIT-" + rand(1000, 9999), status: "En utilisation", patient: patients[2].name },
    { name: "Pompe a perfusion Fresenius", type: "Perfusion", serial: "PMP-" + rand(1000, 9999), status: "Disponible", patient: "" },
    { name: "Aspirateur de mucosites", type: "Respiratoire", serial: "ASP-" + rand(1000, 9999), status: "Disponible", patient: "" },
    { name: "Fauteuil roulant pliant", type: "Mobilite", serial: "FTL-" + rand(1000, 9999), status: "En utilisation", patient: patients[3].name },
    { name: "Tensiometre automatique Omron", type: "Monitoring", serial: "TEN-" + rand(1000, 9999), status: "Maintenance", patient: "", maintenanceDate: dateStr(daysFromNow(5)) },
  ].map(function (e) {
    return Object.assign({ _id: uuid(), userId: ID.svc1, location: "Domicile patient", maintenanceDate: e.maintenanceDate || null }, e);
  });

  const team = [
    { name: "Sana Khelifi", role: "Infirmi\u00e8re", status: "Actif", patients: 4, phone: "+216 98 678 234", email: "sana@had.tn", specialty: "Soins generaux" },
    { name: "Dr. Hajri Slim", role: "Th\u00e9rapeute", status: "Actif", patients: 6, phone: "+216 71 345 678", email: "dr.hajri@had.tn", specialty: "Medecine generale" },
    { name: "Raouf Ben Salah", role: "Infirmier", status: "Actif", patients: 3, phone: "+216 55 123 456", email: "raouf@had.tn", specialty: "Soins palliatifs" },
    { name: "Houda Mejri", role: "Kin\u00e9sith\u00e9rapeute", status: "Actif", patients: 5, phone: "+216 52 234 567", email: "houda@had.tn", specialty: "Reeducation" },
    { name: "Anis Chaabane", role: "Infirmier", status: "Absent", patients: 0, phone: "+216 97 345 678", email: "anis@had.tn", specialty: "Soins intensifs" },
    { name: "Mariam Jebali", role: "Aide-soignante", status: "Actif", patients: 8, phone: "+216 50 456 789", email: "mariam@had.tn", specialty: "Coordination HAD" },
  ].map(function (t) {
    return Object.assign({ _id: uuid(), userId: ID.svc1 }, t);
  });

  const visits = [];
  for (let day = 14; day >= 0; day--) {
    const count = rand(2, 4);
    for (let j = 0; j < count; j++) {
      visits.push({
        _id: uuid(),
        userId: ID.svc1,
        patient: pick(patients).name,
        staff: pick(team).name,
        date: dateStr(daysAgo(day)),
        time: timeSlot(),
        duration: pick(["30 min", "45 min", "1h", "1h30"]),
        status: day > 0 ? pick(["Compl\u00e9t\u00e9", "Compl\u00e9t\u00e9", "Annul\u00e9"]) : pick(["Planifi\u00e9", "En cours"]),
        channel: pick(["pr\u00e9sentiel", "pr\u00e9sentiel", "pr\u00e9sentiel", "t\u00e9l\u00e9consultation"]),
        notes: pick(["Soins de routine", "Pansement + controle tension", "Reeducation marche", "Suivi glycemie", ""]),
      });
    }
  }

  const invoices = [];
  for (let ii = 0; ii < 12; ii++) {
    const created = daysAgo(rand(0, 28));
    invoices.push({
      _id: uuid(),
      userId: ID.svc1,
      ref: "FAC-HAD-" + String(rand(1000, 9999)),
      patient: pick(patients).name,
      amount: rand(150, 1200),
      date: dateStr(created),
      dueDate: dateStr(daysFromNow(rand(5, 30))),
      status: pick(["Pay\u00e9e", "Pay\u00e9e", "En attente", "En retard"]),
      services: pick(["Soins infirmiers", "Reeducation", "Surveillance monitoring", "Soins palliatifs"]),
      paymentMethod: pick(["Virement", "Esp\u00e8ces", "Carte", "Assurance"]),
      paymentDate: pick([dateStr(daysAgo(rand(1, 5))), null]),
      createdAt: created,
    });
  }

  const prescriptions = [];
  for (let pi = 0; pi < 8; pi++) {
    prescriptions.push({
      _id: uuid(),
      userId: ID.svc1,
      patient: pick(patients).name,
      doctor: pick(["Dr. Hajri", "Dr. Mansouri"]),
      date: dateStr(daysAgo(rand(0, 20))),
      medications: pick([
        "Amlodipine 5mg 1/j + Atorvastatine 20mg 1/j",
        "Metformine 850mg 2/j + Insuline rapide",
        "Paracetamol 1g 3/j + Tramadol 50mg si douleur",
        "Enoxaparine 40mg SC 1/j + Omeprazole 20mg 1/j",
      ]),
      status: pick(["Active", "Active", "Active", "Termin\u00e9e"]),
      notes: pick(["Renouvellement mensuel", "Nouveau protocole", "Ajustement apres bilan", ""]),
    });
  }

  const settings = {
    _id: ID.svc1,
    address: "25 Rue Ibn Khaldoun, Tunis 1002",
    director: "Dr. Rania Cherif",
    capacity: 30,
    serviceType: "HAD - Hospitalisation a Domicile",
    notifs: { sms: true, email: true, app: true, careAlerts: true, equipmentAlerts: true, billingAlerts: false },
  };

  return { patients, equipment, team, visits, invoices, prescriptions, settings };
}

/* ================================================================== */
/*  Vitals builder                                                     */
/* ================================================================== */
function makeVitals(userId, role, patientNames) {
  const vitals = [];
  for (const patName of patientNames) {
    for (let day = 14; day >= 0; day -= rand(1, 3)) {
      vitals.push({
        _id: uuid(),
        userId: userId,
        patientId: uuid(),
        patientName: patName,
        role: role,
        sbp: rand(110, 160),
        dbp: rand(60, 100),
        hr: rand(55, 100),
        temp: +(rand(364, 386) / 10).toFixed(1),
        spo2: rand(93, 100),
        glucose: +(rand(70, 180) / 10).toFixed(1),
        date: dateStr(daysAgo(day)),
        time: timeSlot(),
        createdAt: daysAgo(day),
      });
    }
  }
  return vitals;
}

/* ================================================================== */
/*  Paramedical data builder                                           */
/* ================================================================== */
function makeParamedData() {
  const careTypes = [
    "Kinesitherapie", "Reeducation fonctionnelle", "Drainage lymphatique",
    "Massage therapeutique", "Reeducation respiratoire", "Orthophonie",
  ];
  const patientData = [
    { name: "Ahmed Tlili", age: 45, condition: "Lombalgie chronique" },
    { name: "Samia Gharbi", age: 32, condition: "Post-entorse cheville" },
    { name: "Ridha Hamrouni", age: 58, condition: "Arthrose genou bilateral" },
    { name: "Maha Souissi", age: 28, condition: "Cervicalgie post-traumatique" },
    { name: "Nizar Bouguerra", age: 67, condition: "Reeducation post-prothese hanche" },
    { name: "Imen Jlassi", age: 41, condition: "Syndrome du canal carpien" },
    { name: "Fathi Kammoun", age: 73, condition: "BPCO - reeducation respiratoire" },
    { name: "Wafa Ben Amor", age: 35, condition: "Dysphonie fonctionnelle" },
    { name: "Hassen Mejri", age: 52, condition: "Reeducation epaule post-chirurgie" },
    { name: "Leila Bouzidi", age: 60, condition: "Lymphoedeme membre superieur" },
  ];

  const patients = patientData.map(function (p, i) {
    return {
      _id: uuid(),
      userId: i < 6 ? PARAMEDICALS[0] : PARAMEDICALS[1],
      name: p.name,
      age: p.age,
      condition: p.condition,
      status: pick(["Actif", "Actif", "Actif", "Suivi", "Cl\u00f4tur\u00e9"]),
      nextAppointment: dateStr(daysFromNow(rand(1, 10))),
      careType: careTypes[i % careTypes.length],
      phone: "+216 " + rand(50, 99) + " " + rand(100, 999) + " " + rand(100, 999),
    };
  });

  const appointments = [];
  for (let day = 14; day >= -5; day--) {
    const count = rand(2, 4);
    for (let j = 0; j < count; j++) {
      const pat = pick(patients);
      appointments.push({
        _id: uuid(),
        userId: pat.userId,
        patient: pat.name,
        type: pat.careType,
        date: dateStr(day >= 0 ? daysAgo(day) : daysFromNow(-day)),
        time: timeSlot(),
        location: pick(["Cabinet", "Cabinet", "Domicile"]),
        status: day > 0 ? pick(["Confirm\u00e9", "Confirm\u00e9", "Annul\u00e9"]) : day === 0 ? pick(["En attente", "Confirm\u00e9"]) : "Confirm\u00e9",
        notes: pick(["Seance standard", "Bilan initial", "Seance de suivi", "Derniere seance avant reevaluation", ""]),
      });
    }
  }

  const supplies = [
    { name: "Electrodes adhesives", category: "Consommables", current: rand(30, 100), max: 200, unit: "pcs" },
    { name: "Gel echographie", category: "Consommables", current: rand(2, 10), max: 20, unit: "tubes" },
    { name: "Bandes elastiques resistance", category: "Materiel reeduc.", current: rand(5, 30), max: 50, unit: "pcs" },
    { name: "Draps jetables", category: "Linge", current: rand(20, 100), max: 200, unit: "pcs" },
    { name: "Gel hydroalcoolique", category: "Hygiene", current: rand(3, 12), max: 24, unit: "flacons" },
    { name: "Swiss Ball 65cm", category: "Materiel reeduc.", current: rand(2, 6), max: 8, unit: "pcs" },
    { name: "Poches de froid", category: "Consommables", current: rand(5, 20), max: 30, unit: "pcs" },
    { name: "Cones embouts spirometre", category: "Consommables", current: rand(10, 50), max: 100, unit: "pcs" },
    { name: "Huile de massage", category: "Consommables", current: rand(2, 8), max: 12, unit: "bouteilles" },
    { name: "Gants non steriles M", category: "Hygiene", current: rand(50, 200), max: 500, unit: "pcs" },
  ].map(function (s) {
    const level = s.current / s.max < 0.2 ? "critical" : s.current / s.max < 0.4 ? "low" : "ok";
    return Object.assign({ _id: uuid(), userId: ID.para1, level: level, ordered: level === "critical" }, s);
  });

  const careSessions = [];
  for (let ci = 0; ci < 15; ci++) {
    const pat = pick(patients);
    careSessions.push({
      _id: uuid(),
      userId: pat.userId,
      patient: pat.name,
      careType: pat.careType,
      notes: pick([
        "Bonne evolution - amplitude augmentee",
        "Patient cooperatif, douleur en regression",
        "Seance complete sans incident",
        "Adaptation exercices - douleur a la mobilisation",
        "Progres satisfaisants",
      ]),
      photos: rand(0, 3),
      signed: pick([true, true, true, false]),
      date: dateStr(daysAgo(rand(0, 14))),
      time: timeSlot(),
    });
  }

  return { patients, appointments, supplies, careSessions };
}

/* ================================================================== */
/*  Paramedical products catalog                                       */
/* ================================================================== */
const PARAMED_PRODUCTS = [
  { name: "Genouillere ligamentaire rotulienne", brand: "Thuasne", category: "Orthopedie", price: 45.00, originalPrice: 55.00, shortDesc: "Maintien rotulien proprioceptif", description: "Genouillere avec anneau rotulien en silicone et baleines laterales pour stabilisation ligamentaire.", prescription: false, stockQty: 25 },
  { name: "Attelle de poignet Manurhizo", brand: "Gibaud", category: "Orthopedie", price: 38.50, originalPrice: 42.00, shortDesc: "Immobilisation poignet-pouce", description: "Attelle thermoformable pour syndrome du canal carpien et tendinite de De Quervain.", prescription: true, stockQty: 15 },
  { name: "Ceinture lombaire LombaSkin", brand: "Thuasne", category: "Orthopedie", price: 65.00, originalPrice: 78.00, shortDesc: "Soutien lombaire ergonomique", description: "Ceinture lombaire avec effet proprioceptif et insert silicone chauffant.", prescription: false, stockQty: 12 },
  { name: "Bequilles aluminium reglables", brand: "Invacare", category: "Aide a la mobilite", price: 35.00, originalPrice: 40.00, shortDesc: "Paire de bequilles legeres", description: "Bequilles en aluminium avec embouts antiderapants et poignees ergonomiques.", prescription: false, stockQty: 20 },
  { name: "Electrostimulateur TENS", brand: "Compex", category: "Reeducation", price: 189.00, originalPrice: 220.00, shortDesc: "Soulagement douleur par electrotherapie", description: "Appareil TENS 4 canaux avec 20 programmes pour douleurs chroniques et aigues.", prescription: false, stockQty: 8 },
  { name: "Bandes de resistance set 5 niveaux", brand: "TheraBand", category: "Reeducation", price: 28.00, originalPrice: 32.00, shortDesc: "Set complet de renforcement", description: "5 bandes elastiques pour reeducation progressive.", prescription: false, stockQty: 30 },
  { name: "Coussin d assise ergonomique", brand: "Sissel", category: "Ergonomie", price: 42.00, originalPrice: 48.00, shortDesc: "Prevention douleurs assise prolongee", description: "Coussin memoire de forme avec gel rafraichissant et housse lavable.", prescription: false, stockQty: 18 },
  { name: "Spirometre incitatif Voldyne", brand: "Teleflex", category: "Respiratoire", price: 22.00, originalPrice: 25.00, shortDesc: "Reeducation respiratoire", description: "Spirometre volumetrique pour exercices respiratoires post-chirurgicaux.", prescription: false, stockQty: 35 },
  { name: "Creme chauffante articulaire", brand: "Phytodolor", category: "Soins", price: 14.50, originalPrice: 16.00, shortDesc: "Preparation musculaire et articulaire", description: "Creme a base de plantes avec effet chauffant pour preparer les muscles avant la seance.", prescription: false, stockQty: 40 },
  { name: "Chevillere stabilisatrice Malleo", brand: "Bauerfeind", category: "Orthopedie", price: 52.00, originalPrice: 60.00, shortDesc: "Stabilisation cheville instable", description: "Chevillere tricotee anatomique avec pelote en silicone et sangles de maintien.", prescription: false, stockQty: 14 },
  { name: "Rouleau de massage fascia", brand: "Blackroll", category: "Reeducation", price: 32.00, originalPrice: 38.00, shortDesc: "Auto-massage des fascias", description: "Rouleau haute densite pour auto-massage et liberation myofasciale.", prescription: false, stockQty: 22 },
  { name: "Table d inversion therapeutique", brand: "Teeter", category: "Reeducation", price: 450.00, originalPrice: 520.00, shortDesc: "Decompression vertebrale", description: "Table d inversion certifiee FDA pour soulagement des douleurs dorsales.", prescription: true, stockQty: 3 },
  { name: "Huile essentielle menthe poivree", brand: "Puressentiel", category: "Soins", price: 9.50, originalPrice: 11.00, shortDesc: "Effet froid anti-douleur", description: "Huile essentielle pour massage decontractant et antalgique local.", prescription: false, stockQty: 45 },
  { name: "Poche chaud/froid reutilisable", brand: "Nexcare 3M", category: "Soins", price: 8.00, originalPrice: 10.00, shortDesc: "Therapie par le chaud et le froid", description: "Poche gel reutilisable pour thermotherapie.", prescription: false, stockQty: 50 },
  { name: "Deambulateur pliant 4 roues", brand: "Drive Medical", category: "Aide a la mobilite", price: 120.00, originalPrice: 145.00, shortDesc: "Marche securisee avec siege", description: "Rollator leger avec freins, siege integre et panier amovible.", prescription: false, stockQty: 6 },
];

/* ================================================================== */
/*  Public establishments                                              */
/* ================================================================== */
const ESTABLISHMENTS = [
  { name: "Clinique La Marsa", type: "Clinique", governorate: "Tunis", city: "La Marsa", address: "Avenue Taieb Mhiri, La Marsa 2078", phone: "+216 71 749 000", rating: 4.6, reviews: 234, price: 150, services: ["Cardiologie", "Chirurgie generale", "Maternite", "Urgences 24h"], accredited: true, emergencies: true, imageUrl: "", description: "Clinique privee multidisciplinaire avec plateau technique moderne.", beds: 120, doctors: 45, founded: 1998 },
  { name: "Hopital La Rabta", type: "H\u00f4pital", governorate: "Tunis", city: "Tunis", address: "Rue Djebel Lakhdar, Tunis 1007", phone: "+216 71 578 000", rating: 4.2, reviews: 567, price: 50, services: ["Medecine interne", "Nephrologie", "Hemodialyse", "Reanimation"], accredited: true, emergencies: true, imageUrl: "", description: "CHU de reference specialise en nephrologie et medecine interne.", beds: 450, doctors: 180, founded: 1897 },
  { name: "Clinique Pasteur", type: "Clinique", governorate: "Tunis", city: "Tunis", address: "4 Place Pasteur, Tunis 1002", phone: "+216 71 843 000", rating: 4.7, reviews: 312, price: 200, services: ["Ophtalmologie", "Chirurgie refractive", "ORL", "Stomatologie"], accredited: true, emergencies: false, imageUrl: "", description: "Centre d excellence en ophtalmologie et chirurgie du visage.", beds: 60, doctors: 35, founded: 2005 },
  { name: "Hopital Sahloul", type: "H\u00f4pital", governorate: "Sousse", city: "Sousse", address: "Route de la Ceinture, Sousse 4054", phone: "+216 73 369 000", rating: 4.4, reviews: 445, price: 80, services: ["Cardiologie interventionnelle", "Neurochirurgie", "Oncologie", "Urgences"], accredited: true, emergencies: true, imageUrl: "", description: "CHU de la region du Sahel avec service de pointe en cardiologie.", beds: 620, doctors: 250, founded: 1991 },
  { name: "Clinique Les Oliviers", type: "Clinique", governorate: "Sfax", city: "Sfax", address: "Route de Tunis Km 2, Sfax 3000", phone: "+216 74 240 000", rating: 4.5, reviews: 189, price: 100, services: ["Chirurgie orthopedique", "Traumatologie", "Reeducation", "Imagerie"], accredited: true, emergencies: true, imageUrl: "", description: "Clinique specialisee en chirurgie osseuse et reeducation fonctionnelle.", beds: 80, doctors: 30, founded: 2010 },
  { name: "Hopital Habib Bourguiba Sfax", type: "H\u00f4pital", governorate: "Sfax", city: "Sfax", address: "Avenue Majida Boulila, Sfax 3029", phone: "+216 74 241 511", rating: 4.1, reviews: 678, price: 60, services: ["Pediatrie", "Gynecologie", "Dermatologie", "Psychiatrie"], accredited: true, emergencies: true, imageUrl: "", description: "Plus grand CHU du sud tunisien.", beds: 800, doctors: 320, founded: 1963 },
  { name: "Clinique El Amen Nabeul", type: "Clinique", governorate: "Nabeul", city: "Nabeul", address: "Route de Tunis, Nabeul 8000", phone: "+216 72 235 000", rating: 4.3, reviews: 156, price: 120, services: ["Medecine generale", "Gynecologie", "Pediatrie", "Analyses"], accredited: true, emergencies: true, imageUrl: "", description: "Clinique polyvalente du Cap Bon.", beds: 50, doctors: 20, founded: 2012 },
  { name: "Hopital Fattouma Bourguiba Monastir", type: "H\u00f4pital", governorate: "Monastir", city: "Monastir", address: "Avenue Farhat Hached, Monastir 5000", phone: "+216 73 461 144", rating: 4.3, reviews: 389, price: 70, services: ["CHU complet", "Medecine nucleaire", "Neonatologie", "Cardiologie"], accredited: true, emergencies: true, imageUrl: "", description: "CHU universitaire de Monastir avec service de medecine nucleaire.", beds: 550, doctors: 200, founded: 1977 },
  { name: "Polyclinique Les Jasmins", type: "Clinique", governorate: "Ariana", city: "Ariana", address: "Avenue de l Independance, Ariana 2080", phone: "+216 71 709 000", rating: 4.4, reviews: 201, price: 80, services: ["Medecine generale", "Radiologie", "Kinesitherapie", "Analyses"], accredited: true, emergencies: false, imageUrl: "", description: "Centre de soins ambulatoires avec plateau technique complet.", beds: 30, doctors: 15, founded: 2015 },
];

/* ================================================================== */
/*  Public lab centers                                                 */
/* ================================================================== */
const LAB_CENTERS = [
  { name: "Laboratoire Central de Tunis", type: "Laboratoire", governorate: "Tunis", city: "Tunis", address: "18 Rue Charles de Gaulle, Tunis 1000", phone: "+216 71 240 555", rating: 4.7, reviews: 345, cnam: true, resultDelay: "24-48h", exams: ["Biochimie", "Hematologie", "Serologie", "Hormonologie"], allExamTypes: ["Bilan sanguin", "Glycemie", "NFS", "TSH", "Bilan lipidique", "CRP"], priceFrom: 15, imageUrl: "", description: "Laboratoire accredite de reference avec resultats en ligne.", open24h: false },
  { name: "Centre d Imagerie Avicenne", type: "Radiologie", governorate: "Tunis", city: "Tunis", address: "32 Avenue Mohamed V, Tunis 1002", phone: "+216 71 330 444", rating: 4.8, reviews: 278, cnam: true, resultDelay: "2-4h", exams: ["IRM", "Scanner", "Echographie", "Mammographie"], allExamTypes: ["IRM cerebrale", "Scanner thoracique", "Echo abdominale", "Mammographie"], priceFrom: 60, imageUrl: "", description: "Centre d imagerie de haute technologie avec IRM 3 Tesla.", open24h: false },
  { name: "Laboratoire Pasteur Sousse", type: "Laboratoire", governorate: "Sousse", city: "Sousse", address: "120 Avenue du 15 Octobre, Sousse 4000", phone: "+216 73 220 111", rating: 4.5, reviews: 198, cnam: true, resultDelay: "24h", exams: ["Biochimie", "Hematologie", "Microbiologie", "Anatomopathologie"], allExamTypes: ["Bilan sanguin", "ECBU", "Antibiogramme", "Biopsie"], priceFrom: 12, imageUrl: "", description: "Laboratoire d analyses medicales avec service de microbiologie avance.", open24h: false },
  { name: "Centre Radio-Diagnostic Sfax", type: "Radiologie", governorate: "Sfax", city: "Sfax", address: "50 Route de Tunis, Sfax 3000", phone: "+216 74 295 000", rating: 4.4, reviews: 167, cnam: true, resultDelay: "2-6h", exams: ["Scanner", "Echographie", "Radiographie", "Densitometrie"], allExamTypes: ["Scanner abdominal", "Echo pelvienne", "Radio thorax", "Osteodensitometrie"], priceFrom: 35, imageUrl: "", description: "Centre de radiologie avec scanner multibarettes derniere generation.", open24h: true },
  { name: "Laboratoire El Amal Ariana", type: "Laboratoire", governorate: "Ariana", city: "Ariana", address: "7 Rue Ibn Sina, Ariana 2080", phone: "+216 71 710 222", rating: 4.6, reviews: 145, cnam: true, resultDelay: "12-24h", exams: ["Biochimie", "Hematologie", "Hormonologie", "Serologie"], allExamTypes: ["Bilan thyroidien", "Bilan hepatique", "Bilan renal", "Serologie HIV"], priceFrom: 10, imageUrl: "", description: "Laboratoire de proximite avec resultats rapides et fiables.", open24h: false },
  { name: "Centre IRM Monastir", type: "Radiologie", governorate: "Monastir", city: "Monastir", address: "Rue de l Hopital, Monastir 5000", phone: "+216 73 462 000", rating: 4.3, reviews: 112, cnam: false, resultDelay: "4-8h", exams: ["IRM", "Scanner", "Echographie"], allExamTypes: ["IRM rachis", "Scanner cerebral", "Echo cardiaque"], priceFrom: 80, imageUrl: "", description: "Centre d imagerie moderne a proximite du CHU de Monastir.", open24h: false },
  { name: "Laboratoire Bio-Sante Nabeul", type: "Laboratoire", governorate: "Nabeul", city: "Nabeul", address: "Avenue Habib Bourguiba, Nabeul 8000", phone: "+216 72 287 000", rating: 4.4, reviews: 89, cnam: true, resultDelay: "24-48h", exams: ["Biochimie", "Hematologie", "Parasitologie"], allExamTypes: ["NFS", "Glycemie", "Bilan lipidique", "Coproculture"], priceFrom: 8, imageUrl: "", description: "Laboratoire du Cap Bon avec specialite en parasitologie.", open24h: false },
  { name: "Centre de Radiologie Ben Arous", type: "Radiologie", governorate: "Ben Arous", city: "Ben Arous", address: "12 Avenue de la Republique, Ben Arous 2013", phone: "+216 71 382 000", rating: 4.5, reviews: 134, cnam: true, resultDelay: "1-3h", exams: ["Radiographie", "Echographie", "Scanner", "Panoramique dentaire"], allExamTypes: ["Radio osseuse", "Echo thyroide", "Scanner thoracique", "Panoramique"], priceFrom: 25, imageUrl: "", description: "Centre de diagnostic rapide avec rendez-vous en ligne.", open24h: false },
  { name: "Laboratoire Moderne Bizerte", type: "Laboratoire", governorate: "Bizerte", city: "Bizerte", address: "45 Avenue Habib Thameur, Bizerte 7000", phone: "+216 72 431 000", rating: 4.2, reviews: 76, cnam: true, resultDelay: "24-48h", exams: ["Biochimie", "Hematologie", "Serologie"], allExamTypes: ["Bilan sanguin complet", "Serologie hepatite", "Bilan renal"], priceFrom: 10, imageUrl: "", description: "Laboratoire accredite au nord de la Tunisie.", open24h: false },
];

/* ================================================================== */
/*  MAIN SEED FUNCTION                                                 */
/* ================================================================== */
async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log("Database already seeded - skipping");
      return;
    }

    console.log("Seeding database with comprehensive data...\n");

    // --- Users ---
    console.log("Seeding users...");
    for (const u of seedUsers) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed, name: u.firstName + " " + u.lastName });
    }
    console.log("  " + seedUsers.length + " users created");

    // --- Doctors catalog ---
    console.log("Seeding doctors catalog...");
    const doctorEntries = seedUsers
      .filter((u) => u.role === "doctor" && u.status === "approved")
      .map((d) => ({
        _id: uuid(),
        name: "Dr. " + d.firstName + " " + d.lastName,
        specialty: d.specialization,
        governorate: pick(GOVERNORATES),
        userId: d._id,
      }));
    await Doctor.insertMany(doctorEntries);
    console.log("  " + doctorEntries.length + " doctors");

    // --- Medicines ---
    console.log("Seeding medicines catalog...");
    await Medicine.insertMany(MEDICINES);
    console.log("  " + MEDICINES.length + " medicines");

    // --- Products per pharmacy ---
    console.log("Seeding pharmacy products...");
    // --- Products per pharmacy (120 pharmacies) ---
    console.log("Seeding pharmacy products...");
    const allProducts = [];
    for (let pi = 0; pi < PHARMACIES.length; pi++) {
      const phaUser = generated.pharmacyUsers[pi];
      const start = (pi * 3) % MEDICINES.length;
      const end = Math.min(start + rand(12, 18), MEDICINES.length);
      const subset = MEDICINES.slice(start, end).concat(MEDICINES.slice(0, Math.max(0, (start + 15) - MEDICINES.length)));
      const uniqueSubset = [...new Map(subset.map(m => [m._id, m])).values()];
      allProducts.push(...makeProducts(PHARMACIES[pi], phaUser.companyName, uniqueSubset));
    }
    await Product.insertMany(allProducts);
    console.log("  " + allProducts.length + " products across " + PHARMACIES.length + " pharmacies");

    // --- Appointments ---
    console.log("Seeding appointments...");
    const appts = makeAppointments();
    await Appointment.insertMany(appts);
    console.log("  " + appts.length + " appointments (30 days + 7 future)");

    // --- Messages ---
    console.log("Seeding messages...");
    const msgList = makeMessages();
    await Message.insertMany(msgList);
    console.log("  " + msgList.length + " messages");

    // --- Dossiers ---
    try {
      console.log("Seeding patient dossiers...");
      const dossiers = makeDossiers();
      await Dossier.insertMany(dossiers);
      console.log("  " + dossiers.length + " dossiers");
    } catch (e) { console.error("  Dossier error:", e.message); }

    // --- Orders ---
    try {
      console.log("Seeding pharmacy orders...");
      const orderList = makeOrders();
      await Order.insertMany(orderList);
      console.log("  " + orderList.length + " orders (30 days)");
    } catch (e) { console.error("  Order error:", e.message); }

    // --- Reviews ---
    try {
      console.log("Seeding reviews...");
      const reviewList = makeReviews();
      await Review.insertMany(reviewList);
      console.log("  " + reviewList.length + " reviews");
    } catch (e) { console.error("  Review error:", e.message); }

    // --- Prescriptions ---
    try {
      console.log("Seeding prescriptions...");
      const rxs = makePrescriptions();
      await Prescription.insertMany(rxs);
      console.log("  " + rxs.length + " prescriptions");
    } catch (e) { console.error("  Prescription error:", e.message); }

    // --- Lab data ---
    try {
      console.log("Seeding lab tests & results...");
      const labData = makeLabData();
      await LabTest.insertMany(labData.tests);
      await LabResult.insertMany(labData.results);
      console.log("  " + labData.tests.length + " tests, " + labData.results.length + " results");
    } catch (e) { console.error("  Lab error:", e.message); }

    // --- Supplier orders ---
    try {
      console.log("Seeding supplier orders...");
      const supplierOrders = makeSupplierOrders();
      await SupplierOrder.insertMany(supplierOrders);
      console.log("  " + supplierOrders.length + " supplier orders");
    } catch (e) { console.error("  SupplierOrder error:", e.message); }

    // --- Medical service ---
    try {
      console.log("Seeding medical service data...");
      const medSvc = makeMedServiceData();
      await MedServicePatient.insertMany(medSvc.patients);
      await MedServiceEquipment.insertMany(medSvc.equipment);
      await MedServiceTeamMember.insertMany(medSvc.team);
      await MedServiceVisit.insertMany(medSvc.visits);
      await MedServiceInvoice.insertMany(medSvc.invoices);
      await MedServicePrescription.insertMany(medSvc.prescriptions);
      await MedServiceSettings.create(medSvc.settings);
      console.log("  Medical service: " + medSvc.patients.length + " patients, " + medSvc.equipment.length + " equipment, " + medSvc.team.length + " team, " + medSvc.visits.length + " visits, " + medSvc.invoices.length + " invoices");
    } catch (e) { console.error("  MedService error:", e.message); }

    // --- Vitals ---
    try {
      console.log("Seeding vitals...");
      const medSvcPatientNames = ["Habib Mabrouk", "Zohra Fatnassi", "Ali Hannachi", "Khadija Dridi"];
      const medSvcVitals = makeVitals(ID.svc1, "medical_service", medSvcPatientNames);
      const paramedVitals = makeVitals(PARAMEDICALS[0], "paramedical", ["Ahmed Tlili", "Samia Gharbi", "Ridha Hamrouni", "Maha Souissi", "Nizar Bouguerra"]);
      await Vital.insertMany([].concat(medSvcVitals, paramedVitals));
      console.log("  " + (medSvcVitals.length + paramedVitals.length) + " vitals");
    } catch (e) { console.error("  Vital error:", e.message); }

    // --- Paramedical ---
    try {
      console.log("Seeding paramedical data...");
      const paramed = makeParamedData();
      await ParamedPatient.insertMany(paramed.patients);
      await ParamedAppointment.insertMany(paramed.appointments);
      await ParamedSupply.insertMany(paramed.supplies);
      await ParamedCareSession.insertMany(paramed.careSessions);
      console.log("  Paramedical: " + paramed.patients.length + " patients, " + paramed.appointments.length + " appointments, " + paramed.supplies.length + " supplies");
    } catch (e) { console.error("  Paramedical error:", e.message); }

    // --- Paramedical catalog + products ---
    try {
      console.log("Seeding paramedical catalog...");
      const catalogEntries = PARAMED_PRODUCTS.map(function (p, i) {
        return {
          _id: "paramed-cat-" + String(i + 1).padStart(2, "0"),
          name: p.name,
          brand: p.brand,
          category: p.category,
          prescription: p.prescription,
          description: p.description,
          imageUrl: "",
          shortDesc: p.shortDesc,
          usage: "",
        };
      });
      await ParamedicalCatalog.insertMany(catalogEntries);
      console.log("  " + catalogEntries.length + " paramedical catalog entries");

      console.log("Seeding paramedical products...");
      const paraProds = PARAMED_PRODUCTS.map(function (p, i) {
        return Object.assign(
          {
            _id: "paramed-prod-" + String(i + 1).padStart(2, "0"),
            userId: PARAMEDICALS[i % PARAMEDICALS.length],
            catalogItemId: "paramed-cat-" + String(i + 1).padStart(2, "0"),
            rating: +(rand(35, 50) / 10).toFixed(1),
            reviews: rand(10, 200),
            inStock: p.stockQty > 0,
            deliveryDays: rand(1, 5),
            images: [],
            features: [],
            usage: "",
            compatibility: "",
          },
          p
        );
      });
      await ParamedicalProduct.insertMany(paraProds);
      console.log("  " + paraProds.length + " paramedical products");
    } catch (e) { console.error("  ParamedProduct error:", e.message); }

    // --- Public establishments ---
    try {
      console.log("Seeding medical establishments...");
      const estabs = ESTABLISHMENTS.map(function (e, i) {
        return Object.assign({ _id: "estab-" + String(i + 1).padStart(2, "0") }, e);
      });
      await MedicalEstablishment.insertMany(estabs);
      console.log("  " + estabs.length + " establishments");
    } catch (e) { console.error("  Establishment error:", e.message); }

    // --- Public lab centers ---
    try {
      console.log("Seeding public lab centers...");
      const labCenters = LAB_CENTERS.map(function (l, i) {
        return Object.assign({ _id: "lab-center-" + String(i + 1).padStart(2, "0") }, l);
      });
      await PublicLabCenter.insertMany(labCenters);
      console.log("  " + labCenters.length + " lab centers");
    } catch (e) { console.error("  LabCenter error:", e.message); }

    console.log("\nSeed complete!\n");
  } catch (err) {
    console.error("Seed error:", err);
  }
}

module.exports = seedDatabase;
