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
const Testimonial = require("./models/Testimonial");
const ParamedicalServiceProvider = require("./models/ParamedicalServiceProvider");
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
  doc5: "00000000-0000-0000-0000-000000000205",
  doc6: "00000000-0000-0000-0000-000000000206",
  doc7: "00000000-0000-0000-0000-000000000207",
  doc8: "00000000-0000-0000-0000-000000000208",
  doc9: "00000000-0000-0000-0000-000000000209",
  doc10: "00000000-0000-0000-0000-000000000210",
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
  // 10 Doctors (9 approved + 1 pending) — 10 distinct specialties
  { _id: ID.doc1, firstName: "Amira", lastName: "Mansouri", email: "dr.mansouri@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 234 567", specialization: "Cardiologie", doctorId: "MED-TN-2024-0742", governorate: "Tunis", delegation: "Tunis" },
  { _id: ID.doc2, firstName: "Slim", lastName: "Hajri", email: "dr.hajri@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 345 678", specialization: "Dermatologie", doctorId: "MED-TN-2024-0891", governorate: "Ariana", delegation: "Ariana Ville" },
  { _id: ID.doc3, firstName: "Ines", lastName: "Ben Youssef", email: "dr.benyoussef@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 456 789", specialization: "Pediatrie", doctorId: "MED-TN-2024-0556", governorate: "Sousse", delegation: "Sousse Ville" },
  { _id: ID.doc4, firstName: "Karim", lastName: "Tlili", email: "dr.tlili@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 321 654", specialization: "Neurologie", doctorId: "MED-TN-2024-0991", governorate: "Tunis", delegation: "Bardo" },
  { _id: ID.doc5, firstName: "Sonia", lastName: "Belhaj", email: "dr.belhaj@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 567 890", specialization: "Gynecologie", doctorId: "MED-TN-2024-1123", governorate: "Tunis", delegation: "Le Bardo" },
  { _id: ID.doc6, firstName: "Riadh", lastName: "Chaabane", email: "dr.chaabane@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 73 123 456", specialization: "Ophtalmologie", doctorId: "MED-TN-2024-1254", governorate: "Sfax", delegation: "Sfax Ville" },
  { _id: ID.doc7, firstName: "Leila", lastName: "Trabelsi", email: "dr.trabelsi@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 72 234 567", specialization: "Psychiatrie", doctorId: "MED-TN-2024-1387", governorate: "Sousse", delegation: "Hammam Sousse" },
  { _id: ID.doc8, firstName: "Nizar", lastName: "Gharbi", email: "dr.gharbi@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 678 901", specialization: "Chirurgie generale", doctorId: "MED-TN-2024-1498", governorate: "Tunis", delegation: "La Marsa" },
  { _id: ID.doc9, firstName: "Hajer", lastName: "Mekni", email: "dr.mekni@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 74 345 678", specialization: "Rhumatologie", doctorId: "MED-TN-2024-1612", governorate: "Monastir", delegation: "Monastir Ville" },
  { _id: ID.doc10, firstName: "Bassem", lastName: "Zouari", email: "dr.zouari@megacare.tn", password: "Medecin@2024", role: "doctor", status: "approved", phone: "+216 71 789 012", specialization: "Medecine generale", doctorId: "MED-TN-2024-1734", governorate: "Ariana", delegation: "Raoued" },
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
  { _id: "med-01", name: "Advil",       dci: "Ibuprofene",                        category: "Anti-inflammatoire",  form: "Comprimes enrobes",              brand: "ADVIL",       requiresPrescription: false, imageUrl: "/uploads/medecines/Advil.avif",        description: "Antalgique et anti-inflammatoire non steroidien",             usage: "200-400 mg toutes les 4 a 6 heures au cours des repas.",                    contraindications: "Ulcere gastroduodenal, insuffisance renale, grossesse",    sideEffects: "Troubles digestifs, douleurs abdominales" },
  { _id: "med-02", name: "Aleve",       dci: "Naproxene sodique",                  category: "Anti-inflammatoire",  form: "Comprimes",                      brand: "ALEVE",       requiresPrescription: false, imageUrl: "/uploads/medecines/Aleve.jpeg",        description: "Anti-inflammatoire a longue duree d action",                  usage: "220 mg toutes les 8 a 12 heures. Max 660 mg/jour.",                         contraindications: "Ulcere, insuffisance renale, grossesse",                   sideEffects: "Troubles digestifs, maux de tete" },
  { _id: "med-03", name: "Allegra",     dci: "Fexofenadine",                       category: "Antihistaminique",    form: "Comprimes",                      brand: "ALLEGRA",     requiresPrescription: false, imageUrl: "/uploads/medecines/Allegra.avif",      description: "Antihistaminique H1 non sedatif pour allergies saisonnieres", usage: "120 mg une fois par jour ou 180 mg une fois par jour.",                      contraindications: "Insuffisance renale severe",                               sideEffects: "Cephalees, nausees, somnolence rare" },
  { _id: "med-04", name: "Aspirin",     dci: "Acide acetylsalicylique",            category: "Analgesique",         form: "Comprimes",                      brand: "ASPIRIN",     requiresPrescription: false, imageUrl: "/uploads/medecines/Aspirin.jpeg",      description: "Analgesique, antipyretique et anti-inflammatoire classique",  usage: "500-1000 mg toutes les 4 a 8 heures. Max 4 g/jour.",                        contraindications: "Allergie aspirine, ulcere, enfants < 16 ans, grossesse",   sideEffects: "Troubles gastro-intestinaux, risque hemorragique" },
  { _id: "med-05", name: "Benadryl",    dci: "Diphenhydramine",                    category: "Antihistaminique",    form: "Gelules",                        brand: "BENADRYL",    requiresPrescription: false, imageUrl: "/uploads/medecines/Benadryl.jpg",      description: "Antihistaminique sedatif - allergies et rhume",               usage: "25-50 mg toutes les 4 a 6 heures. Max 300 mg/jour.",                        contraindications: "Glaucome, retention urinaire, asthme aigu",                sideEffects: "Somnolence, secheresse buccale, vertiges" },
  { _id: "med-06", name: "Brufen",      dci: "Ibuprofene",                         category: "Anti-inflammatoire",  form: "Comprimes",                      brand: "BRUFEN",      requiresPrescription: false, imageUrl: "/uploads/medecines/Brufen.jpeg",       description: "Anti-inflammatoire non steroidien - douleurs et fievre",      usage: "400 mg toutes les 6 a 8 heures au cours des repas.",                        contraindications: "Ulcere gastro-duodenal, insuffisance cardiaque severe",    sideEffects: "Nausees, douleurs gastriques, diarrhee" },
  { _id: "med-07", name: "Calpol",      dci: "Paracetamol",                        category: "Analgesique",         form: "Sirop pediatrique",              brand: "CALPOL",      requiresPrescription: false, imageUrl: "/uploads/medecines/Calpol.webp",       description: "Analgesique et antipyretique pediatrique",                    usage: "120 mg/5 ml selon le poids de l enfant toutes les 4 a 6 heures.",           contraindications: "Insuffisance hepatique",                                   sideEffects: "Rarement : reactions cutanees allergiques" },
  { _id: "med-08", name: "Claritin",    dci: "Loratadine",                         category: "Antihistaminique",    form: "Comprimes",                      brand: "CLARITIN",    requiresPrescription: false, imageUrl: "/uploads/medecines/Claritin.jpeg",     description: "Antihistaminique non sedatif pour rhinite allergique",        usage: "10 mg une fois par jour.",                                                  contraindications: "Insuffisance hepatique severe",                            sideEffects: "Cephalees, somnolence rare, secheresse buccale" },
  { _id: "med-09", name: "Crocin",      dci: "Paracetamol",                        category: "Analgesique",         form: "Comprimes",                      brand: "CROCIN",      requiresPrescription: false, imageUrl: "/uploads/medecines/Crocin.jpg",        description: "Antalgique et antipyretique a base de paracetamol",           usage: "500-1000 mg toutes les 4 a 6 heures. Max 4 g/jour.",                        contraindications: "Insuffisance hepatique severe",                            sideEffects: "Rarement : reactions allergiques, toxicite hepatique a forte dose" },
  { _id: "med-10", name: "DayQuil",     dci: "Acetaminophene / Dextromethorphane", category: "Grippe & Rhume",      form: "Solution buvable",               brand: "DAYQUIL",     requiresPrescription: false, imageUrl: "/uploads/medecines/DayQuil.avif",      description: "Traitement multi-symptomes rhume et grippe sans somnolence",  usage: "30 ml toutes les 4 heures. Max 4 doses/jour.",                              contraindications: "Association IMAO, insuffisance hepatique",                 sideEffects: "Nausees, vertiges, insomnie" },
  { _id: "med-11", name: "Dafalgan",    dci: "Paracetamol",                        category: "Analgesique",         form: "Comprimes effervescents",         brand: "DAFALGAN",    requiresPrescription: false, imageUrl: "/uploads/medecines/Dafalgan .jpeg",    description: "Analgesique et antipyretique effervescent",                   usage: "500-1000 mg toutes les 4 a 6 heures. Max 4 g/jour.",                        contraindications: "Insuffisance hepatique, alcoolisme",                       sideEffects: "Bien tolere aux doses therapeutiques" },
  { _id: "med-12", name: "Doliprane",   dci: "Paracetamol",                        category: "Analgesique",         form: "Comprimes",                      brand: "DOLIPRANE",   requiresPrescription: false, imageUrl: "/uploads/medecines/Doliprane.jpeg",    description: "Antalgique et antipyretique de reference",                    usage: "1 g toutes les 6 heures. Max 4 g/jour.",                                    contraindications: "Insuffisance hepatique severe",                            sideEffects: "Rarement : reactions allergiques" },
  { _id: "med-13", name: "Efferalgan",  dci: "Paracetamol",                        category: "Analgesique",         form: "Comprimes effervescents",         brand: "EFFERALGAN",  requiresPrescription: false, imageUrl: "/uploads/medecines/Efferalgan.jpg",    description: "Paracetamol effervescent a dissolution rapide",               usage: "500 mg a 1 g toutes les 4 a 6 heures. Max 3-4 g/jour.",                     contraindications: "Insuffisance hepatique, regimes pauvres en sodium",        sideEffects: "Generalement bien tolere" },
  { _id: "med-14", name: "Imodium",     dci: "Loperamide",                         category: "Gastro-enterologie",  form: "Gelules",                        brand: "IMODIUM",     requiresPrescription: false, imageUrl: "/uploads/medecines/Imodium.webp",      description: "Antidiarrheique - ralentit le transit intestinal",            usage: "2 mg apres chaque selle liquide. Max 16 mg/jour.",                          contraindications: "Colite infectieuse aigue, enfants < 2 ans",                sideEffects: "Constipation, nausees, ballonnements" },
  { _id: "med-15", name: "Mucinex",     dci: "Guaifenesin",                        category: "Pneumologie",         form: "Comprimes a liberation prolongee", brand: "MUCINEX",   requiresPrescription: false, imageUrl: "/uploads/medecines/Mucinex.jpg",       description: "Expectorant - facilite l evacuation des secretions bronchiques", usage: "600-1200 mg toutes les 12 heures avec un grand verre d eau.",             contraindications: "Hypersensibilite",                                         sideEffects: "Nausees, vomissements, cephalees" },
  { _id: "med-16", name: "Nimulid",     dci: "Nimesulide",                         category: "Anti-inflammatoire",  form: "Comprimes",                      brand: "NIMULID",     requiresPrescription: true,  imageUrl: "/uploads/medecines/Nimulid.jpeg",      description: "AINS selectif COX-2 - douleurs et inflammation",              usage: "100 mg deux fois par jour apres les repas.",                                contraindications: "Insuffisance hepatique, ulcere, grossesse",                sideEffects: "Troubles digestifs, elevation des transaminases" },
  { _id: "med-17", name: "Nurofen",     dci: "Ibuprofene",                         category: "Anti-inflammatoire",  form: "Comprimes enrobes",              brand: "NUROFEN",     requiresPrescription: false, imageUrl: "/uploads/medecines/Nurofen.jpeg",      description: "Antalgique et antipyretique - douleurs moderees a intenses",  usage: "200-400 mg toutes les 4 a 6 heures. Max 1200 mg/jour sans avis medical.", contraindications: "Ulcere gastroduodenal, insuffisance renale, grossesse",    sideEffects: "Troubles digestifs, maux de tete" },
  { _id: "med-18", name: "Panadol",     dci: "Paracetamol",                        category: "Analgesique",         form: "Comprimes",                      brand: "PANADOL",     requiresPrescription: false, imageUrl: "/uploads/medecines/panadol.png",       description: "Antalgique et antipyretique largement utilise",               usage: "500-1000 mg toutes les 4 a 6 heures. Max 4 g/jour.",                        contraindications: "Insuffisance hepatique severe, alcoolisme",                sideEffects: "Bien tolere aux doses recommandees" },
  { _id: "med-19", name: "Pepcid",      dci: "Famotidine",                         category: "Gastro-enterologie",  form: "Comprimes",                      brand: "PEPCID",      requiresPrescription: false, imageUrl: "/uploads/medecines/Pepcid.webp",       description: "Antihistaminique H2 - reducteur d acidite gastrique",         usage: "20 mg deux fois par jour ou 40 mg le soir au coucher.",                     contraindications: "Insuffisance renale severe",                               sideEffects: "Cephalees, constipation, diarrhee" },
  { _id: "med-20", name: "Robitussin",  dci: "Dextromethorphane / Guaifenesin",    category: "Pneumologie",         form: "Sirop",                          brand: "ROBITUSSIN",  requiresPrescription: false, imageUrl: "/uploads/medecines/Robitussin.jpeg",   description: "Antitussif et expectorant pour toux seche et productive",     usage: "10-20 ml toutes les 4 heures. Max 6 doses/jour.",                           contraindications: "Association IMAO, enfants < 6 ans",                        sideEffects: "Somnolence, nausees, vertiges" },
  { _id: "med-21", name: "Sudafed",     dci: "Pseudoephedrine",                    category: "Grippe & Rhume",      form: "Comprimes",                      brand: "SUDAFED",     requiresPrescription: false, imageUrl: "/uploads/medecines/Sudafed.jpeg",      description: "Decongestionnant nasal oral",                                 usage: "60 mg toutes les 4 a 6 heures. Max 240 mg/jour.",                           contraindications: "Hypertension, cardiopathie, IMAO, glaucome",               sideEffects: "Insomnie, palpitations, agitation" },
  { _id: "med-22", name: "Tums",        dci: "Carbonate de calcium",               category: "Gastro-enterologie",  form: "Comprimes a croquer",            brand: "TUMS",        requiresPrescription: false, imageUrl: "/uploads/medecines/Tums.avif",         description: "Antiacide rapide - brulures d estomac et indigestion",        usage: "2 a 4 comprimes a croquer selon les besoins. Max 15/jour.",                 contraindications: "Hypercalcemie, lithiase urinaire calcique",                sideEffects: "Constipation, flatulences" },
  { _id: "med-23", name: "Tylenol",     dci: "Acetaminophene",                     category: "Analgesique",         form: "Comprimes",                      brand: "TYLENOL",     requiresPrescription: false, imageUrl: "/uploads/medecines/Tylenol.jpg",       description: "Analgesique et antipyretique de reference en Amerique du Nord", usage: "325-1000 mg toutes les 4 a 6 heures. Max 4 g/jour.",                      contraindications: "Insuffisance hepatique, consommation alcoolique",          sideEffects: "Hepatotoxicite en cas de surdosage" },
  { _id: "med-24", name: "Voltaren",    dci: "Diclofenac sodique",                 category: "Anti-inflammatoire",  form: "Comprimes gastro-resistants",    brand: "VOLTAREN",    requiresPrescription: true,  imageUrl: "/uploads/medecines/Voltaren.png",      description: "AINS puissant - douleurs rhumatismales et inflammatoires",    usage: "50 mg 2 a 3 fois par jour au cours des repas.",                             contraindications: "Insuffisance cardiaque, ulcere, grossesse",                sideEffects: "Douleurs gastriques, vertiges, elevation des transaminases" },
  { _id: "med-25", name: "Zyrtec",      dci: "Cetirizine",                         category: "Antihistaminique",    form: "Comprimes",                      brand: "ZYRTEC",      requiresPrescription: false, imageUrl: "/uploads/medecines/Zyrtec.webp",       description: "Antihistaminique H1 - rhinite allergique et urticaire",       usage: "10 mg une fois par jour le soir.",                                          contraindications: "Insuffisance renale terminale",                            sideEffects: "Somnolence, secheresse buccale, cephalees" },
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
  // ── Soin visage ──────────────────────────────────────────────────────────
  { name: "Eau thermale Avene spray 300ml", brand: "Avene", category: "Soin visage", price: 28.00, originalPrice: 33.00, shortDesc: "Apaisante et anti-irritante", description: "Eau thermale naturellement riche en ions silicates pour calmer les peaux sensibles et irrites.", prescription: false, stockQty: 40 },
  { name: "Creme hydratante Toleriane Ultra", brand: "La Roche-Posay", category: "Soin visage", price: 42.00, originalPrice: null, shortDesc: "Ultra-toleree par les peaux sensibles", description: "Soin hydratant intensif pour peaux ultra-sensibles avec neurosensine apaisante.", prescription: false, stockQty: 28 },
  { name: "Serum vitamine C anti-taches", brand: "Vichy", category: "Soin visage", price: 68.00, originalPrice: 79.00, shortDesc: "Eclat et uniformite du teint", description: "Serum concentre en vitamine C pure 15% pour corriger les taches et illuminer le teint.", prescription: false, stockQty: 15 },
  { name: "Fluide anti-imperfections Effaclar", brand: "La Roche-Posay", category: "Soin visage", price: 38.00, originalPrice: null, shortDesc: "Pores affines, teint net", description: "Soin quotidien anti-recidive des imperfections pour peaux grasses et a tendance acneique.", prescription: false, stockQty: 20 },
  { name: "Creme contour yeux anti-cernes", brand: "Avene", category: "Soin visage", price: 35.00, originalPrice: 42.00, shortDesc: "Regard frais et repose", description: "Soin delicat qui attenue les cernes et reduit les poches sous les yeux.", prescription: false, stockQty: 18 },
  { name: "Masque purifiant argile blanche", brand: "Bioderma", category: "Soin visage", price: 29.00, originalPrice: null, shortDesc: "Pores nettoyes, peau lisse", description: "Masque a l argile pour absorber l exces de sebum et purifier les pores en profondeur.", prescription: false, stockQty: 25 },

  // ── Soin corps ────────────────────────────────────────────────────────────
  { name: "Lait corporel nourrissant Lipikar", brand: "La Roche-Posay", category: "Soin corps", price: 36.00, originalPrice: 43.00, shortDesc: "Hydratation 48h peaux seches", description: "Lait corporel surgras pour relipider et proteger les peaux seches a tres seches.", prescription: false, stockQty: 30 },
  { name: "Gel douche surgras Pain de douche", brand: "Dove", category: "Soin corps", price: 12.50, originalPrice: null, shortDesc: "Doux pour les peaux sensibles", description: "Gel douche sans savon enrichi en creme hydratante pour peaux sensibles.", prescription: false, stockQty: 50 },
  { name: "Baume corps reparateur Cicaplast", brand: "La Roche-Posay", category: "Soin corps", price: 32.00, originalPrice: null, shortDesc: "Reparation et protection", description: "Baume multi-reparateur pour peaux abimees, crevasses et zone a vif.", prescription: false, stockQty: 22 },
  { name: "Huile corps eclat amande douce", brand: "Mustela", category: "Soin corps", price: 28.00, originalPrice: 34.00, shortDesc: "Peau soyeuse et lumineuse", description: "Huile corps a l amande douce pour nourrir et embellir la peau en profondeur.", prescription: false, stockQty: 20 },
  { name: "Creme pieds reparatrice uree 25%", brand: "Eucerin", category: "Soin corps", price: 24.00, originalPrice: null, shortDesc: "Talons secs et craqueles", description: "Creme intensive a l uree 25% pour traiter les pieds tres secs et keratosiques.", prescription: false, stockQty: 18 },

  // ── Cheveux & ongles ──────────────────────────────────────────────────────
  { name: "Huile d argan pure bio 100ml", brand: "Karite Nature", category: "Cheveux & ongles", price: 42.00, originalPrice: null, shortDesc: "Soin nourrissant multi-usage", description: "Huile d argan certifiee bio pour nourrir, lisser et faire briller les cheveux.", prescription: false, stockQty: 25 },
  { name: "Shampoing antipelliculaire ketoconazole", brand: "Nizoral", category: "Cheveux & ongles", price: 22.00, originalPrice: 26.00, shortDesc: "Traitement pellicules persistantes", description: "Shampoing medicamenteux au ketoconazole 2% pour eliminer les pellicules rebelles.", prescription: false, stockQty: 20 },
  { name: "Serum fortifiant anti-chute", brand: "Rene Furterer", category: "Cheveux & ongles", price: 58.00, originalPrice: 68.00, shortDesc: "Stimule la pousse capillaire", description: "Serum concentre aux actifs vegetaux pour fortifier le cheveu et reduire la chute.", prescription: false, stockQty: 12 },
  { name: "Vernis soin ongles fragiles", brand: "Isdin", category: "Cheveux & ongles", price: 18.00, originalPrice: null, shortDesc: "Ongles fortifies et proteges", description: "Vernis therapeutique durcissant pour ongles mous, cassants et stries.", prescription: false, stockQty: 30 },

  // ── Bebe & maternite ──────────────────────────────────────────────────────
  { name: "Lait de toilette bebe doux", brand: "Mustela", category: "Bebe & maternite", price: 18.50, originalPrice: null, shortDesc: "Nettoyage doux sans rincage", description: "Lait de toilette sans alcool ni colorant pour nettoyer visage et corps de bebe.", prescription: false, stockQty: 35 },
  { name: "Creme change protectrice 123", brand: "Bepanthen", category: "Bebe & maternite", price: 14.00, originalPrice: 17.00, shortDesc: "Prevention et soin erytheme fessier", description: "Creme protectrice au dexpanthenol pour prevenir et traiter l erytheme fessier.", prescription: false, stockQty: 40 },
  { name: "Thermometre frontal sans contact", brand: "Beurer", category: "Bebe & maternite", price: 45.00, originalPrice: 55.00, shortDesc: "Mesure instantanee et hygienique", description: "Thermometre infrarouge frontal avec affichage numerique et alarme fievre.", prescription: false, stockQty: 14 },
  { name: "Huile de massage bebe calmante", brand: "Weleda", category: "Bebe & maternite", price: 22.00, originalPrice: null, shortDesc: "Detente et douceur pour bebe", description: "Huile de massage bio pour apaiser et relaxer bebe avec huile de sesame et lavande.", prescription: false, stockQty: 20 },

  // ── Vitamines & complements ───────────────────────────────────────────────
  { name: "Vitamine D3 1000 UI softgels", brand: "Solgar", category: "Vitamines & complements", price: 28.00, originalPrice: null, shortDesc: "Os, systeme immunitaire", description: "Complement en vitamine D3 (cholecalciferol) 1000 UI pour soutenir la mineralization osseuse.", prescription: false, stockQty: 32 },
  { name: "Magnesium marin + vitamine B6", brand: "Supradyn", category: "Vitamines & complements", price: 32.00, originalPrice: 38.00, shortDesc: "Fatigue, crampes, stress", description: "Complement alimentaire associant magnesium d origine marine et vitamine B6 pour reduire la fatigue.", prescription: false, stockQty: 28 },
  { name: "Omega 3 EPA/DHA 1000mg", brand: "Solgar", category: "Vitamines & complements", price: 52.00, originalPrice: 62.00, shortDesc: "Coeur et cerveau", description: "Complement en acides gras omega-3 hautement concentres EPA et DHA issus de poissons sauvages.", prescription: false, stockQty: 18 },
  { name: "Probiotiques Lactibiane Equilibre", brand: "PiLeJe", category: "Vitamines & complements", price: 38.00, originalPrice: null, shortDesc: "Equilibre de la flore intestinale", description: "10 milliards de bacteries lactiques par gelule pour restaurer et maintenir la flore intestinale.", prescription: false, stockQty: 20 },
  { name: "Fer + vitamine C Tardyferon", brand: "Tardyferon", category: "Vitamines & complements", price: 18.00, originalPrice: null, shortDesc: "Anemie ferriprive", description: "Complement en fer bivalent a liberation prolongee avec vitamine C pour meilleure absorption.", prescription: false, stockQty: 25 },

  // ── Hygiene dentaire ──────────────────────────────────────────────────────
  { name: "Dentifrice sensitive dents sensibles", brand: "Sensodyne", category: "Hygiene dentaire", price: 14.00, originalPrice: null, shortDesc: "Soulage la sensibilite dentaire", description: "Dentifrice au nitrate de potassium pour soulager les douleurs dues aux dents sensibles.", prescription: false, stockQty: 45 },
  { name: "Bain de bouche antibacterien", brand: "Listerine", category: "Hygiene dentaire", price: 16.00, originalPrice: 19.00, shortDesc: "Protection 24h contre les bacteries", description: "Bain de bouche aux huiles essentielles pour eliminer 99.9% des bacteries buccales.", prescription: false, stockQty: 38 },
  { name: "Brosse a dents souple extra-souple", brand: "Oral-B", category: "Hygiene dentaire", price: 8.50, originalPrice: null, shortDesc: "Nettoyage doux et efficace", description: "Brosse a dents manuelle avec poils ultra-souples pour gencives sensibles et appareils dentaires.", prescription: false, stockQty: 60 },
  { name: "Fil dentaire satin 50m", brand: "Oral-B", category: "Hygiene dentaire", price: 7.50, originalPrice: null, shortDesc: "Nettoyage inter-dentaire glisse", description: "Fil dentaire cire satin pour un passage facile entre les dents serrees.", prescription: false, stockQty: 55 },

  // ── Solaire ───────────────────────────────────────────────────────────────
  { name: "Creme solaire visage SPF50+ fluide", brand: "La Roche-Posay", category: "Solaire", price: 52.00, originalPrice: 62.00, shortDesc: "Protection maximale non grasse", description: "Fluide solaire SPF50+ texture ultra-legere non comedogenique pour peau grasse.", prescription: false, stockQty: 20 },
  { name: "Spray solaire corps SPF30 200ml", brand: "Bioderma", category: "Solaire", price: 38.00, originalPrice: null, shortDesc: "Application facile, peau douce", description: "Spray solaire transparent SPF30 avec filtre mineral pour toute la famille.", prescription: false, stockQty: 25 },
  { name: "Apres-soleil reparateur apaisant", brand: "Vichy", category: "Solaire", price: 32.00, originalPrice: 38.00, shortDesc: "Repare et prolonge le bronzage", description: "Soin apres-soleil riche en eau thermale pour apaiser, hydrater et prolonger le bronzage.", prescription: false, stockQty: 18 },

  // ── Premiers secours ──────────────────────────────────────────────────────
  { name: "Compresses steriles 10x10cm bte 25", brand: "Urgo", category: "Premiers secours", price: 8.00, originalPrice: null, shortDesc: "Pansements plaies propres", description: "Compresses de gaze steriles non tissees 10x10cm pour soins de plaies.", prescription: false, stockQty: 80 },
  { name: "Pansements assortis waterproof bte 20", brand: "Urgo", category: "Premiers secours", price: 9.50, originalPrice: null, shortDesc: "Impermeables et flexibles", description: "Pansements hydrocolloides waterproof en differentes tailles pour petites blessures.", prescription: false, stockQty: 65 },
  { name: "Solution antiseptique Betadine 500ml", brand: "Betadine", category: "Premiers secours", price: 12.00, originalPrice: 14.00, shortDesc: "Antisepsie plaies et muqueuses", description: "Solution iodee pour l antisepsie des plaies cutanees superficielles et dermatoplaies.", prescription: false, stockQty: 42 },
  { name: "Bande cohesive elastique 6cm", brand: "Tensoplast", category: "Premiers secours", price: 11.00, originalPrice: null, shortDesc: "Maintien sans colle", description: "Bande elastique auto-adhesive cohesive pour soutien musculaire et bandages de maintien.", prescription: false, stockQty: 35 },
];

/* ================================================================== */
/*  Public establishments                                              */
/* ================================================================== */
const BANNER_IMAGES = [
  "medical-clinic-banner-facebook-cover-design-template_519207-51.jpg",
  "hospital-healthcare-service-sale-banner_23-2150394136.avif",
  "clinic-and-hospital-horizontal-banner-healthcare-vector-24655598.avif",
  "hospital-healthcare-service-facebook-template_23-2150395866.avif",
  "gradient-medical-clinic-sale-banner_23-2149645554.avif",
  "flat-design-medical-center-sale-banner_23-2149097118.avif",
  "health-clinic-horizontal-banner-medical-web-template-social-media-post_565745-188.avif",
  "healthcare-medical-service-ads-promotional-web-banner-template-design_84443-10612.avif",
  "gradient-medical-center-sale-banner_23-2151082971.avif",
  "medical-banner-11.jpg",
  "flat-design-medical-clinic-sale-banner_23-2149641439.avif",
  "clinic-medical-center-horizontal-banner-260nw-2716869991.webp",
  "medical-staff-clinic-banner-with-copy-space-on-the-right-side-hospital-HR7801.jpg",
  "medical-healthcare-social-media-banner-600nw-2577528539.webp",
  "linkedin-healthcare-medical-banner-cover-modern-flat-and-green-design-for-hospital-clinic-flyer-poster-facebook-youtube-and-website-promotion-vector.jpg",
];
const ESTABLISHMENTS = [
  // Grand Tunis
  { name: "Clinique La Marsa", type: "Clinique", governorate: "Tunis", city: "La Marsa", address: "Avenue Taieb Mhiri, La Marsa 2078", phone: "+216 71 749 000", rating: 4.6, reviews: 234, price: 150, services: ["Cardiologie", "Chirurgie generale", "Maternite", "Urgences 24h"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/medical-clinic-banner-facebook-cover-design-template_519207-51.jpg", description: "Clinique privee multidisciplinaire avec plateau technique moderne.", beds: 120, doctors: 45, founded: 1998 },
  { name: "Clinique Pasteur", type: "Clinique", governorate: "Tunis", city: "Tunis", address: "4 Place Pasteur, Tunis 1002", phone: "+216 71 843 000", rating: 4.7, reviews: 312, price: 200, services: ["Ophtalmologie", "Chirurgie refractive", "ORL", "Stomatologie"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/clinic-and-hospital-horizontal-banner-healthcare-vector-24655598.avif", description: "Centre d excellence en ophtalmologie et chirurgie du visage.", beds: 60, doctors: 35, founded: 2005 },
  { name: "Clinique Al Hayat", type: "Clinique", governorate: "Tunis", city: "Tunis", address: "19 Rue Sidi El Hani, Bab Saadoun, Tunis 1006", phone: "+216 71 562 800", rating: 4.5, reviews: 187, price: 120, services: ["Medecine interne", "Cardiologie", "Chirurgie vasculaire", "Urgences"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/gradient-medical-center-sale-banner_23-2151082971.avif", description: "Clinique polyvalente au coeur de Tunis avec service d urgences 24h/24.", beds: 90, doctors: 38, founded: 2003 },
  { name: "Clinique Taoufik", type: "Clinique", governorate: "Tunis", city: "La Marsa", address: "2 Rue de la Corniche, La Marsa 2078", phone: "+216 71 774 500", rating: 4.8, reviews: 298, price: 180, services: ["Cardiologie", "Neurologie", "Chirurgie plastique", "Oncologie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/medical-banner-11.jpg", description: "Clinique de luxe en bord de mer specialisee en chirurgie et oncologie.", beds: 110, doctors: 52, founded: 2001 },
  { name: "Clinique Carthage", type: "Clinique", governorate: "Tunis", city: "Carthage", address: "Rue Hannibal, Carthage Salambo, Tunis 1010", phone: "+216 71 731 100", rating: 4.7, reviews: 225, price: 170, services: ["Chirurgie esthetique", "Dermatologie", "ORL", "Ophtalmologie"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/medical-staff-clinic-banner-with-copy-space-on-the-right-side-hospital-HR7801.jpg", description: "Clinique haut de gamme dans le quartier historique de Carthage.", beds: 45, doctors: 30, founded: 2007 },
  { name: "Centre Medical El Menzah", type: "Centre médical", governorate: "Tunis", city: "El Menzah", address: "64 Avenue Tahar Haddad, El Menzah 6, Tunis 1004", phone: "+216 71 230 900", rating: 4.6, reviews: 143, price: 90, services: ["Medecine generale", "Cardiologie", "Endocrinologie", "Biologie"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/clinic-medical-center-horizontal-banner-260nw-2716869991.webp", description: "Centre medical pluridisciplinaire dans le quartier residentiel de Menzah.", beds: 20, doctors: 22, founded: 2011 },
  // Ariana
  { name: "Polyclinique Les Jasmins", type: "Clinique", governorate: "Ariana", city: "Ariana", address: "Avenue de l Independance, Ariana 2080", phone: "+216 71 709 000", rating: 4.4, reviews: 201, price: 80, services: ["Medecine generale", "Radiologie", "Kinesitherapie", "Analyses"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/flat-design-medical-clinic-sale-banner_23-2149641439.avif", description: "Centre de soins ambulatoires avec plateau technique complet.", beds: 30, doctors: 15, founded: 2015 },
  { name: "Clinique Ennasr", type: "Clinique", governorate: "Ariana", city: "Ennasr", address: "Centre Urbain Ennasr 2, Ariana 2037", phone: "+216 71 854 300", rating: 4.5, reviews: 167, price: 100, services: ["Medecine generale", "Gynecologie-obstetrique", "Pediatrie", "Urgences"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/healthcare-medical-service-ads-promotional-web-banner-template-design_84443-10612.avif", description: "Clinique de quartier bien equipee desservant la cite Ennasr.", beds: 65, doctors: 28, founded: 2009 },
  { name: "Polyclinique La Soukra", type: "Clinique", governorate: "Ariana", city: "La Soukra", address: "Route de La Soukra Km 4, Ariana 2036", phone: "+216 71 861 700", rating: 4.4, reviews: 132, price: 110, services: ["Chirurgie generale", "Maternite", "Radiologie", "Kinesitherapie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/medical-healthcare-social-media-banner-600nw-2577528539.webp", description: "Polyclinique de banlieue avec maternite et bloc operatoire.", beds: 70, doctors: 32, founded: 2013 },
  // Ben Arous
  { name: "Clinique Megrine", type: "Clinique", governorate: "Ben Arous", city: "Megrine", address: "Avenue du 7 Novembre, Megrine 2033", phone: "+216 71 399 600", rating: 4.3, reviews: 118, price: 95, services: ["Medecine interne", "Cardiologie", "Chirurgie", "Imagerie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/linkedin-healthcare-medical-banner-cover-modern-flat-and-green-design-for-hospital-clinic-flyer-poster-facebook-youtube-and-website-promotion-vector.jpg", description: "Clinique moderne desservant la banlieue sud de Tunis.", beds: 60, doctors: 25, founded: 2016 },
  // Nabeul
  { name: "Clinique El Amen Nabeul", type: "Clinique", governorate: "Nabeul", city: "Nabeul", address: "Route de Tunis, Nabeul 8000", phone: "+216 72 235 000", rating: 4.3, reviews: 156, price: 120, services: ["Medecine generale", "Gynecologie", "Pediatrie", "Analyses"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/health-clinic-horizontal-banner-medical-web-template-social-media-post_565745-188.avif", description: "Clinique polyvalente du Cap Bon.", beds: 50, doctors: 20, founded: 2012 },
  { name: "Clinique Ibn Rochd Hammamet", type: "Clinique", governorate: "Nabeul", city: "Hammamet", address: "Route Touristique, Hammamet 8050", phone: "+216 72 281 400", rating: 4.6, reviews: 203, price: 160, services: ["Medecine generale", "Chirurgie esthetique", "Gynecologie", "Pediatrie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/medical-clinic-banner-facebook-cover-design-template_519207-51.jpg", description: "Clinique internationale accueillant aussi une clientele etrangere.", beds: 55, doctors: 26, founded: 2004 },
  // Bizerte
  { name: "Centre Medical Bizerte", type: "Centre médical", governorate: "Bizerte", city: "Bizerte", address: "2 Avenue Habib Bourguiba, Bizerte 7000", phone: "+216 72 432 200", rating: 4.3, reviews: 98, price: 75, services: ["Medecine generale", "Cardiologie", "Analyses medicales", "Echographie"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/gradient-medical-clinic-sale-banner_23-2149645554.avif", description: "Centre medical de reference dans le gouvernorat de Bizerte.", beds: 18, doctors: 14, founded: 2012 },
  // Sousse
  { name: "Clinique Les Palmiers", type: "Clinique", governorate: "Sousse", city: "Hammam Sousse", address: "Avenue du 20 Mars, Hammam Sousse 4011", phone: "+216 73 227 500", rating: 4.5, reviews: 210, price: 130, services: ["Cardiologie", "Chirurgie generale", "Obstetrique", "Pediatrie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/hospital-healthcare-service-facebook-template_23-2150395866.avif", description: "Clinique moderne du Sahel avec maternite et service de pediatrie.", beds: 100, doctors: 42, founded: 2008 },
  { name: "Polyclinique Sousse Nord", type: "Clinique", governorate: "Sousse", city: "Sousse", address: "Route de la Corniche, Sousse 4000", phone: "+216 73 210 800", rating: 4.5, reviews: 234, price: 125, services: ["Cardiologie", "Chirurgie orthopedique", "Gastro-enterologie", "Imagerie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/clinic-and-hospital-horizontal-banner-healthcare-vector-24655598.avif", description: "Grande polyclinique privee au nord de Sousse avec plusieurs specialites.", beds: 95, doctors: 40, founded: 1999 },
  { name: "Polyclinique Akouda", type: "Clinique", governorate: "Sousse", city: "Akouda", address: "Route de Sousse, Akouda 4022", phone: "+216 73 371 200", rating: 4.4, reviews: 158, price: 110, services: ["Chirurgie generale", "Maternite", "Cardiologie", "Radiologie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/medical-healthcare-social-media-banner-600nw-2577528539.webp", description: "Polyclinique moderne desservant la zone cotiere nord de Sousse.", beds: 70, doctors: 30, founded: 2011 },
  // Monastir
  { name: "Clinique Ibn El Jazzar", type: "Clinique", governorate: "Monastir", city: "Monastir", address: "Avenue Habib Bourguiba, Monastir 5000", phone: "+216 73 465 200", rating: 4.4, reviews: 178, price: 140, services: ["Cardiologie", "Urologie", "Chirurgie digestive", "Maternite"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/flat-design-medical-center-sale-banner_23-2149097118.avif", description: "Clinique privee de reference a Monastir avec plateau technique avance.", beds: 85, doctors: 36, founded: 2006 },
  { name: "Clinique Ksar Hellal", type: "Clinique", governorate: "Monastir", city: "Ksar Hellal", address: "Avenue Habib Bourguiba, Ksar Hellal 5070", phone: "+216 73 475 300", rating: 4.1, reviews: 92, price: 85, services: ["Medecine generale", "Maternite", "Chirurgie", "Analyses"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/healthcare-medical-service-ads-promotional-web-banner-template-design_84443-10612.avif", description: "Clinique de la region de Ksar Hellal couvrant le bassin textile.", beds: 45, doctors: 18, founded: 2005 },
  { name: "Centre Medical Jemmal", type: "Centre médical", governorate: "Monastir", city: "Jemmal", address: "Route de Monastir, Jemmal 5020", phone: "+216 73 483 100", rating: 4.2, reviews: 87, price: 70, services: ["Medecine generale", "Cardiologie", "Radiologie", "Biologie"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/gradient-medical-center-sale-banner_23-2151082971.avif", description: "Centre medical polyvalent desservant la region de Jemmal.", beds: 15, doctors: 12, founded: 2017 },
  // Sfax
  { name: "Clinique Les Oliviers", type: "Clinique", governorate: "Sfax", city: "Sfax", address: "Route de Tunis Km 2, Sfax 3000", phone: "+216 74 240 000", rating: 4.5, reviews: 189, price: 100, services: ["Chirurgie orthopedique", "Traumatologie", "Reeducation", "Imagerie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/gradient-medical-clinic-sale-banner_23-2149645554.avif", description: "Clinique specialisee en chirurgie osseuse et reeducation fonctionnelle.", beds: 80, doctors: 30, founded: 2010 },
  { name: "Clinique El Yasmine Sfax", type: "Clinique", governorate: "Sfax", city: "Sfax", address: "Avenue Majida Boulila, Sfax 3000", phone: "+216 74 244 800", rating: 4.5, reviews: 167, price: 120, services: ["Gynecologie", "Maternite", "Pediatrie", "Neonatologie"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/hospital-healthcare-service-sale-banner_23-2150394136.avif", description: "Clinique de la mere et de l enfant specialisee en maternite et pediatrie.", beds: 75, doctors: 28, founded: 2009 },
  { name: "Centre Medical Ibn Khaldoun", type: "Centre médical", governorate: "Sfax", city: "Sfax", address: "Rue Ibn Khaldoun, Sfax 3000", phone: "+216 74 298 700", rating: 4.4, reviews: 156, price: 80, services: ["Medecine generale", "Dermatologie", "Pediatrie", "Analyses medicales"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/clinic-medical-center-horizontal-banner-260nw-2716869991.webp", description: "Centre medical polyvalent au centre de Sfax avec plusieurs specialites.", beds: 25, doctors: 18, founded: 2014 },
  // Kairouan
  { name: "Clinique El Amal Kairouan", type: "Clinique", governorate: "Kairouan", city: "Kairouan", address: "Avenue de la Republique, Kairouan 3100", phone: "+216 77 225 600", rating: 4.2, reviews: 145, price: 90, services: ["Medecine generale", "Pediatrie", "Chirurgie generale", "Urgences"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/health-clinic-horizontal-banner-medical-web-template-social-media-post_565745-188.avif", description: "Principale clinique privee de Kairouan avec urgences permanentes.", beds: 55, doctors: 22, founded: 2000 },
  // Beja
  { name: "Centre Medical Beja", type: "Centre médical", governorate: "Beja", city: "Beja", address: "Avenue Habib Bourguiba, Beja 9000", phone: "+216 78 459 500", rating: 4.0, reviews: 63, price: 65, services: ["Medecine generale", "Pediatrie", "Gynecologie", "Biologie"], accredited: false, emergencies: false, imageUrl: "/uploads/medical-service-banner/flat-design-medical-clinic-sale-banner_23-2149641439.avif", description: "Centre medical principal du gouvernorat de Beja.", beds: 20, doctors: 10, founded: 2015 },
  // Gabes
  { name: "Clinique El Hayat Gabes", type: "Clinique", governorate: "Gabes", city: "Gabes", address: "Rue Farhat Hached, Gabes 6000", phone: "+216 75 270 400", rating: 4.3, reviews: 112, price: 95, services: ["Medecine generale", "Chirurgie generale", "Maternite", "Urgences"], accredited: true, emergencies: true, imageUrl: "/uploads/medical-service-banner/medical-staff-clinic-banner-with-copy-space-on-the-right-side-hospital-HR7801.jpg", description: "Clinique privee de reference dans le gouvernorat de Gabes.", beds: 60, doctors: 24, founded: 2007 },
  // Hospitalisation À Domicile
  { name: "HAD Soins Tunis Nord", type: "Hospitalisation À Domicile", governorate: "Tunis", city: "La Marsa", address: "12 Rue de la Liberté, La Marsa 2078", phone: "+216 71 774 100", rating: 4.6, reviews: 89, price: 120, services: ["Soins infirmiers", "Kinesitherapie", "Suivi post-operatoire", "Soins palliatifs"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/medical-clinic-banner-facebook-cover-design-template_519207-51.jpg", description: "Service d hospitalisation à domicile couvrant Tunis Nord et La Marsa, avec equipe pluridisciplinaire disponible 7j/7.", doctors: 8, founded: 2014 },
  { name: "HAD Ariana Domicile Sante", type: "Hospitalisation À Domicile", governorate: "Ariana", city: "Ariana", address: "Avenue de l Independance, Ariana 2080", phone: "+216 71 709 500", rating: 4.5, reviews: 67, price: 100, services: ["Soins infirmiers", "Reeducation", "Nutrition medicale", "Surveillance medicale"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/gradient-medical-center-sale-banner_23-2151082971.avif", description: "Structure HAD de la region d Ariana assurant la continuite des soins apres hospitalisation.", doctors: 6, founded: 2016 },
  { name: "HAD Ben Arous Confort Soin", type: "Hospitalisation À Domicile", governorate: "Ben Arous", city: "Ben Arous", address: "Avenue du 7 Novembre, Ben Arous 2013", phone: "+216 71 380 200", rating: 4.4, reviews: 53, price: 110, services: ["Soins infirmiers", "Soins de plaies", "Chimiotherapie a domicile", "Kinesitherapie"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/health-clinic-horizontal-banner-medical-web-template-social-media-post_565745-188.avif", description: "Service HAD specialise dans les soins oncologiques et post-chirurgicaux a domicile.", doctors: 7, founded: 2017 },
  { name: "HAD Sousse Aile Medicale", type: "Hospitalisation À Domicile", governorate: "Sousse", city: "Sousse", address: "Route de la Corniche, Sousse 4000", phone: "+216 73 210 300", rating: 4.7, reviews: 104, price: 115, services: ["Soins infirmiers", "Readaptation cardiaque", "Dialyse a domicile", "Suivi diabetique"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/clinic-and-hospital-horizontal-banner-healthcare-vector-24655598.avif", description: "Pionnier de l HAD dans le Sahel, reconnu pour ses soins cardiaques et reeducatifs a domicile.", doctors: 10, founded: 2012 },
  { name: "HAD Monastir Sante Proximite", type: "Hospitalisation À Domicile", governorate: "Monastir", city: "Monastir", address: "Avenue Habib Bourguiba, Monastir 5000", phone: "+216 73 462 700", rating: 4.3, reviews: 48, price: 95, services: ["Soins infirmiers", "Kinesitherapie", "Orthophonie", "Ergotherapie"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/flat-design-medical-center-sale-banner_23-2149097118.avif", description: "Equipe HAD pluridisciplinaire au service des patients du Monastir metropolitain.", doctors: 6, founded: 2018 },
  { name: "HAD Sfax Soins Integres", type: "Hospitalisation À Domicile", governorate: "Sfax", city: "Sfax", address: "Route de Tunis Km 3, Sfax 3000", phone: "+216 74 240 500", rating: 4.5, reviews: 76, price: 105, services: ["Soins infirmiers", "Soins palliatifs", "Nutrition parenterale", "Suivi post-AVC"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/gradient-medical-clinic-sale-banner_23-2149645554.avif", description: "Service HAD de reference a Sfax, specialise dans les soins complexes et le maintien a domicile de longue duree.", doctors: 9, founded: 2013 },
  { name: "HAD Nabeul Cap Bon Sante", type: "Hospitalisation À Domicile", governorate: "Nabeul", city: "Nabeul", address: "Route de Tunis, Nabeul 8000", phone: "+216 72 235 400", rating: 4.4, reviews: 42, price: 90, services: ["Soins infirmiers", "Kinesitherapie", "Soins de plaies", "Surveillance post-chirurgie"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/hospital-healthcare-service-sale-banner_23-2150394136.avif", description: "Service HAD du Cap Bon assurant le suivi et les soins a domicile pour les patients du gouvernorat de Nabeul.", doctors: 5, founded: 2019 },
  { name: "HAD Bizerte Nord Sante", type: "Hospitalisation À Domicile", governorate: "Bizerte", city: "Bizerte", address: "Avenue Habib Thameur, Bizerte 7000", phone: "+216 72 432 600", rating: 4.2, reviews: 35, price: 85, services: ["Soins infirmiers", "Reeducation motrice", "Soins palliatifs", "Nutrition"], accredited: false, emergencies: false, imageUrl: "/uploads/medical-service-banner/healthcare-medical-service-ads-promotional-web-banner-template-design_84443-10612.avif", description: "Premier service HAD du nord du pays, offrant soins infirmiers et readaptation fonctionnelle a domicile.", doctors: 4, founded: 2020 },
  { name: "HAD Kairouan Domicile Plus", type: "Hospitalisation À Domicile", governorate: "Kairouan", city: "Kairouan", address: "Avenue de la Republique, Kairouan 3100", phone: "+216 77 225 900", rating: 4.3, reviews: 51, price: 80, services: ["Soins infirmiers", "Kinesitherapie", "Suivi diabetique", "Soins de plaies"], accredited: true, emergencies: false, imageUrl: "/uploads/medical-service-banner/medical-healthcare-social-media-banner-600nw-2577528539.webp", description: "Service HAD couvrant Kairouan et les delegations limitrophes, dedié au maintien a domicile des patients chroniques.", doctors: 5, founded: 2018 },
  { name: "HAD Gabes Soins Domicile", type: "Hospitalisation À Domicile", governorate: "Gabes", city: "Gabes", address: "Rue Farhat Hached, Gabes 6000", phone: "+216 75 270 800", rating: 4.1, reviews: 29, price: 80, services: ["Soins infirmiers", "Soins palliatifs", "Kinesitherapie", "Surveillance cardiaque"], accredited: false, emergencies: false, imageUrl: "/uploads/medical-service-banner/linkedin-healthcare-medical-banner-cover-modern-flat-and-green-design-for-hospital-clinic-flyer-poster-facebook-youtube-and-website-promotion-vector.jpg", description: "Service HAD du sud tunisien proposant soins infirmiers et accompagnement des patients en fin de vie a domicile.", doctors: 4, founded: 2021 },
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
/*  Paramedical Service Providers seed data                           */
/* ================================================================== */
const PARAMEDICAL_SERVICE_PROVIDERS = [
  // Tunis
  { name: "Fatma Ben Salah", specialization: "Infirmier(ère)", governorate: "Tunis", delegation: "Tunis Ville", address: "12 Rue de la Liberté, Tunis 1000", phone: "+216 71 234 567", email: "fatma.bensalah@soin.tn", openingHours: "Lun–Sam 08:00–18:00", description: "Infirmière libérale avec 10 ans d’expérience en soins à domicile et injections." },
  { name: "Mohamed Ali Gharbi", specialization: "Kinésithérapeute", governorate: "Tunis", delegation: "El Menzah", address: "45 Avenue de la Jeunesse, El Menzah 1004", phone: "+216 71 890 123", email: "ma.gharbi@kine.tn", openingHours: "Lun–Ven 08:00–19:00", description: "Kinésithérapeute spécialisé en rééducation orthopédique et sportive." },
  { name: "Sonia Trabelsi", specialization: "Orthophoniste", governorate: "Tunis", delegation: "La Marsa", address: "8 Rue de la République, La Marsa 2078", phone: "+216 71 776 432", email: "sonia.trabelsi@ortho.tn", openingHours: "Lun–Ven 09:00–17:00", description: "Orthophoniste pour enfants et adultes, spécialité troubles du langage et de la déglutition." },
  { name: "Anis Jebali", specialization: "Aide-soignant(e)", governorate: "Tunis", delegation: "Le Bardo", address: "23 Avenue de la République, Le Bardo 2000", phone: "+216 71 512 789", email: "", openingHours: "24h/24 7j/7", description: "Aide-soignant disponible pour soins à domicile nuit et week-end." },
  // Ariana
  { name: "Hajer Mansouri", specialization: "Infirmier(ère)", governorate: "Ariana", delegation: "Ariana Ville", address: "15 Avenue de l’Indépendance, Ariana 2080", phone: "+216 71 710 345", email: "hajer.mansouri@soin.tn", openingHours: "Lun–Sam 07:30–18:30", description: "Infirmière certifiée pour pansements, prélèvements et soins post-opératoires." },
  { name: "Rim Khemiri", specialization: "Kinésithérapeute", governorate: "Ariana", delegation: "Soukra", address: "32 Route de La Soukra, Ariana 2036", phone: "+216 71 860 678", email: "rim.khemiri@kine.tn", openingHours: "Lun–Sam 08:00–20:00", description: "Kinésithérapeute à domicile, drainage lymphatique et kinésithérapie respiratoire." },
  { name: "Walid Zouari", specialization: "Ergothérapeute", governorate: "Ariana", delegation: "Raoued", address: "7 Rue des Oliviers, Raoued 2073", phone: "+216 71 840 901", email: "walid.zouari@ergo.tn", openingHours: "Lun–Ven 08:00–17:00", description: "Ergothérapeute spécialisé dans la rééducation cognitive et la réadaptation du handicap." },
  // Ben Arous
  { name: "Leila Chaouachi", specialization: "Sage-femme", governorate: "Ben Arous", delegation: "El Mourouj", address: "10 Rue Ibn Rachiq, El Mourouj 2074", phone: "+216 71 400 234", email: "leila.chaouachi@sagefemme.tn", openingHours: "Lun–Sam 08:00–18:00", description: "Sage-femme libérale pour suivi de grossesse, accouchement préparé et soins post-natals." },
  { name: "Karim Hamza", specialization: "Kinésithérapeute", governorate: "Ben Arous", delegation: "Hammam Lif", address: "55 Avenue des Martyrs, Hammam Lif 2050", phone: "+216 71 291 567", email: "", openingHours: "Lun–Sam 09:00–18:00", description: "Kinésithérapeute rééducation neurologique post-AVC et rééducation fonctionnelle." },
  // Nabeul
  { name: "Ines Jellouli", specialization: "Infirmier(ère)", governorate: "Nabeul", delegation: "Hammamet", address: "22 Avenue des Hôtels, Hammamet 8050", phone: "+216 72 280 789", email: "ines.jellouli@soin.tn", openingHours: "Lun–Sam 08:00–18:00", description: "Infirmière expérimentée, soins aux seniors et patients oncologiques à domicile." },
  { name: "Nabil Sfaxi", specialization: "Kinésithérapeute", governorate: "Nabeul", delegation: "Nabeul", address: "14 Rue Farhat Hached, Nabeul 8000", phone: "+216 72 236 012", email: "nabil.sfaxi@kine.tn", openingHours: "Lun–Ven 08:30–19:00", description: "Kinésithérapeute spécialisé en traumatologie du sport et décontraction musculaire." },
  // Sousse
  { name: "Amira Bouazizi", specialization: "Infirmier(ère)", governorate: "Sousse", delegation: "Sousse Ville", address: "30 Avenue Habib Bourguiba, Sousse 4000", phone: "+216 73 220 456", email: "amira.bouazizi@soin.tn", openingHours: "Lun–Sam 07:00–20:00", description: "Infirmière avec expertise en soins de plaies, injectables et prélèvements biologiques." },
  { name: "Bilel Souissi", specialization: "Kinésithérapeute", governorate: "Sousse", delegation: "Hammam Sousse", address: "9 Rue de l’Unité, Hammam Sousse 4011", phone: "+216 73 228 789", email: "bilel.souissi@kine.tn", openingHours: "Lun–Sam 08:00–20:00", description: "Kinésithérapeute en rééducation post-fracture, lombalgies et rééducation respiratoire." },
  { name: "Maroua Hamrouni", specialization: "Psychomotricien(ne)", governorate: "Sousse", delegation: "Akouda", address: "17 Route Côtière, Akouda 4022", phone: "+216 73 370 321", email: "maroua.hamrouni@psycho.tn", openingHours: "Lun–Ven 09:00–17:00", description: "Psychomotricienne pour enfants et adolescents présentant des troubles du tonus ou des apprentissages." },
  // Monastir
  { name: "Rania Gharib", specialization: "Infirmier(ère)", governorate: "Monastir", delegation: "Monastir", address: "6 Avenue Habib Bourguiba, Monastir 5000", phone: "+216 73 462 456", email: "rania.gharib@soin.tn", openingHours: "Lun–Sam 08:00–18:00", description: "Infirmière libérale pour soins quotidiens, insuline, pansements et perfusions." },
  { name: "Youssef Marzouki", specialization: "Kinésithérapeute", governorate: "Monastir", delegation: "Jemmal", address: "3 Rue de l’Espérance, Jemmal 5020", phone: "+216 73 484 567", email: "youssef.marzouki@kine.tn", openingHours: "Lun–Sam 08:00–19:00", description: "Kinésithérapeute polyvalent en rééducation neurologique et posturale." },
  // Sfax
  { name: "Sabrine Elloumi", specialization: "Infirmier(ère)", governorate: "Sfax", delegation: "Sfax Ville", address: "28 Rue Ali Bach Hamba, Sfax 3000", phone: "+216 74 241 234", email: "sabrine.elloumi@soin.tn", openingHours: "Lun–Sam 07:30–19:30", description: "Infirmière libérale à Sfax, spécialiste soins aux patients diabétiques et oncologiques." },
  { name: "Hassen Ghribi", specialization: "Kinésithérapeute", governorate: "Sfax", delegation: "Sakiet Ezzit", address: "12 Route de la Corniche, Sfax 3021", phone: "+216 74 297 890", email: "hassen.ghribi@kine.tn", openingHours: "Lun–Sam 08:00–20:00", description: "Kinésithérapeute rééducation du rachis, scoliose et algies vertabrales." },
  { name: "Dorra Driss", specialization: "Diététicien(ne)", governorate: "Sfax", delegation: "Sfax Ville", address: "5 Avenue Tahar Sfar, Sfax 3000", phone: "+216 74 255 678", email: "dorra.driss@diet.tn", openingHours: "Lun–Ven 09:00–17:00", description: "Diététicienne clinicienne, prise en charge obésité, diabète et maladies cardiovasculaires." },
  // Bizerte
  { name: "Cyrine Tlili", specialization: "Infirmier(ère)", governorate: "Bizerte", delegation: "Bizerte Nord", address: "18 Avenue Habib Thameur, Bizerte 7000", phone: "+216 72 432 789", email: "cyrine.tlili@soin.tn", openingHours: "Lun–Sam 08:00–18:00", description: "Infirmière à domicile, soins infirmiers courants et surveillance médicale." },
  { name: "Mehdi Fennich", specialization: "Kinésithérapeute", governorate: "Bizerte", delegation: "Menzel Bourguiba", address: "7 Rue Habib Bourguiba, Menzel Bourguiba 7050", phone: "+216 72 460 234", email: "mehdi.fennich@kine.tn", openingHours: "Lun–Sam 09:00–18:00", description: "Kinésithérapeute axe rééducation sport et traumatologie." },
  // Kairouan
  { name: "Asma Jarray", specialization: "Infirmier(ère)", governorate: "Kairouan", delegation: "Kairouan Nord", address: "4 Avenue de la République, Kairouan 3100", phone: "+216 77 226 345", email: "asma.jarray@soin.tn", openingHours: "Lun–Sam 08:00–18:00", description: "Infirmière de soins généraux, pédialtre et périnalité." },
  // Gabes
  { name: "Slim Haddad", specialization: "Kinésithérapeute", governorate: "Gabes", delegation: "Gabes Ville", address: "11 Rue Farhat Hached, Gabes 6000", phone: "+216 75 271 012", email: "slim.haddad@kine.tn", openingHours: "Lun–Sam 08:00–19:00", description: "Kinésithérapeute généraliste, rééducation fonctionnelle post-fracture et orthopédie." },
  { name: "Manel Brik", specialization: "Orthophoniste", governorate: "Gabes", delegation: "Gabes Ville", address: "3 Rue de la Paix, Gabes 6000", phone: "+216 75 275 678", email: "manel.brik@ortho.tn", openingHours: "Lun–Ven 09:00–17:00", description: "Orthophoniste pour enfants (retard de parole, bilinguisme) et adultes (aphasie post-AVC)." },
  // Beja
  { name: "Issam Saidi", specialization: "Aide-soignant(e)", governorate: "Beja", delegation: "Beja Nord", address: "20 Avenue Habib Bourguiba, Beja 9000", phone: "+216 78 460 123", email: "", openingHours: "Lun–Sam 08:00–18:00", description: "Aide-soignant à domicile, assistance aux personnes âgées et post-hospitalisation." },
];

/* ================================================================== */
/*  Testimonials seed data                                            */
/* ================================================================== */
const SEED_TESTIMONIALS = [
  {
    name: "Fatima Ben Ali",
    role: "Patiente",
    text: "MegaCare a changé ma façon de gérer ma santé. Plus besoin de perdre des heures à l'hôpital pour une simple consultation. Tout est rapide, simple et vraiment efficace.",
    rating: 5,
    avatar: "F",
    location: "Tunis",
    visible: true,
    order: 1,
  },
  {
    name: "Dr. Amira Mansouri",
    role: "Cardiologue",
    text: "Interface professionnelle et intuitive. Mes patients sont ravis de pouvoir me consulter depuis chez eux. C'est une véritable révolution dans la pratique médicale quotidienne.",
    rating: 5,
    avatar: "A",
    location: "Sfax",
    visible: true,
    order: 2,
  },
  {
    name: "Mohamed Karim",
    role: "Patient",
    text: "Service impeccable et pharmaciens compétents. Ma commande était prête en moins d'une heure. J'utilise MegaCare chaque fois que j'ai besoin d'un médecin ou d'une ordonnance.",
    rating: 5,
    avatar: "M",
    location: "Sousse",
    visible: true,
    order: 3,
  },
  {
    name: "Sonia Trabelsi",
    role: "Patiente",
    text: "Enfin une plateforme qui simplifie vraiment les démarches médicales. Le dossier patient centralisé est une fonctionnalité que j'attendais depuis longtemps.",
    rating: 5,
    avatar: "S",
    location: "Monastir",
    visible: true,
    order: 4,
  },
  {
    name: "Dr. Khaled Hamdi",
    role: "Médecin généraliste",
    text: "La gestion des rendez-vous est fluide et la téléconsultation fonctionne parfaitement. MegaCare est devenu un outil quotidien indispensable dans mon cabinet.",
    rating: 5,
    avatar: "K",
    location: "Bizerte",
    visible: true,
    order: 5,
  },
  {
    name: "Leila Bouzid",
    role: "Patiente",
    text: "J'apprécie la transparence des tarifs et la facilité de trouver un médecin disponible rapidement. Le service client est très réactif et à l'écoute.",
    rating: 4,
    avatar: "L",
    location: "Nabeul",
    visible: true,
    order: 6,
  },
];

/* ================================================================== */
/*  Establishment user accounts (one per MedicalEstablishment)        */
/* ================================================================== */
const ESTAB_ACCOUNTS = [
  { id: "estab-01", email: "clinique.lamarsa@megacare.tn",        firstName: "Amira",    lastName: "Bouslama",   serviceId: "SVC-TN-2024-0101" },
  { id: "estab-02", email: "clinique.pasteur@megacare.tn",         firstName: "Khalil",   lastName: "Sfar",       serviceId: "SVC-TN-2024-0102" },
  { id: "estab-03", email: "clinique.alhayat@megacare.tn",         firstName: "Sirine",   lastName: "Chaabane",   serviceId: "SVC-TN-2024-0103" },
  { id: "estab-04", email: "clinique.taoufik@megacare.tn",         firstName: "Mounir",   lastName: "Taoufik",    serviceId: "SVC-TN-2024-0104" },
  { id: "estab-05", email: "clinique.carthage@megacare.tn",        firstName: "Leila",    lastName: "Dridi",      serviceId: "SVC-TN-2024-0105" },
  { id: "estab-06", email: "centre.elmenzah@megacare.tn",          firstName: "Sami",     lastName: "Belhaj",     serviceId: "SVC-TN-2024-0106" },
  { id: "estab-07", email: "polyclinique.jasmins@megacare.tn",     firstName: "Ines",     lastName: "Karray",     serviceId: "SVC-TN-2024-0107" },
  { id: "estab-08", email: "clinique.ennasr@megacare.tn",          firstName: "Wafa",     lastName: "Hammami",    serviceId: "SVC-TN-2024-0108" },
  { id: "estab-09", email: "polyclinique.lasoukra@megacare.tn",    firstName: "Hichem",   lastName: "Zouari",     serviceId: "SVC-TN-2024-0109" },
  { id: "estab-10", email: "clinique.megrine@megacare.tn",         firstName: "Randa",    lastName: "Slim",       serviceId: "SVC-TN-2024-0110" },
  { id: "estab-11", email: "clinique.elamen.nabeul@megacare.tn",   firstName: "Mehdi",    lastName: "Oueslati",   serviceId: "SVC-TN-2024-0111" },
  { id: "estab-12", email: "clinique.ibnrochd@megacare.tn",        firstName: "Asma",     lastName: "Abidi",      serviceId: "SVC-TN-2024-0112" },
  { id: "estab-13", email: "centre.bizerte@megacare.tn",           firstName: "Tarek",    lastName: "Trabelsi",   serviceId: "SVC-TN-2024-0113" },
  { id: "estab-14", email: "clinique.palmiers@megacare.tn",        firstName: "Nadia",    lastName: "Ben Salem",  serviceId: "SVC-TN-2024-0114" },
  { id: "estab-15", email: "polyclinique.soussenord@megacare.tn",  firstName: "Farid",    lastName: "Gharbi",     serviceId: "SVC-TN-2024-0115" },
  { id: "estab-16", email: "polyclinique.akouda@megacare.tn",      firstName: "Samira",   lastName: "Riahi",      serviceId: "SVC-TN-2024-0116" },
  { id: "estab-17", email: "clinique.ibnjazzar@megacare.tn",       firstName: "Lotfi",    lastName: "Mssedi",     serviceId: "SVC-TN-2024-0117" },
  { id: "estab-18", email: "clinique.ksarhellal@megacare.tn",      firstName: "Najla",    lastName: "Saidi",      serviceId: "SVC-TN-2024-0118" },
  { id: "estab-19", email: "centre.jemmal@megacare.tn",            firstName: "Bassem",   lastName: "Mahjoub",    serviceId: "SVC-TN-2024-0119" },
  { id: "estab-20", email: "clinique.lesoliviers@megacare.tn",     firstName: "Hatem",    lastName: "Ben Fredj",  serviceId: "SVC-TN-2024-0120" },
  { id: "estab-21", email: "clinique.elyasmine@megacare.tn",       firstName: "Emna",     lastName: "Toumi",      serviceId: "SVC-TN-2024-0121" },
  { id: "estab-22", email: "centre.ibnkhaldoun@megacare.tn",       firstName: "Walid",    lastName: "Gargouri",   serviceId: "SVC-TN-2024-0122" },
  { id: "estab-23", email: "clinique.elamal.kairouan@megacare.tn", firstName: "Sonia",    lastName: "Jebali",     serviceId: "SVC-TN-2024-0123" },
  { id: "estab-24", email: "centre.beja@megacare.tn",              firstName: "Rachid",   lastName: "Ferchichi",  serviceId: "SVC-TN-2024-0124" },
  { id: "estab-25", email: "clinique.elhayat.gabes@megacare.tn",   firstName: "Mariam",   lastName: "Khelifi",    serviceId: "SVC-TN-2024-0125" },
  { id: "estab-26", email: "had.tunisnord@megacare.tn",            firstName: "Olfa",     lastName: "Ayari",      serviceId: "SVC-TN-2024-0126" },
  { id: "estab-27", email: "had.ariana@megacare.tn",               firstName: "Zied",     lastName: "Mellouli",   serviceId: "SVC-TN-2024-0127" },
  { id: "estab-28", email: "had.benarous@megacare.tn",             firstName: "Hela",     lastName: "Msaddek",    serviceId: "SVC-TN-2024-0128" },
  { id: "estab-29", email: "had.sousse@megacare.tn",               firstName: "Anis",     lastName: "Turki",      serviceId: "SVC-TN-2024-0129" },
  { id: "estab-30", email: "had.monastir@megacare.tn",             firstName: "Dorra",    lastName: "Mansouri",   serviceId: "SVC-TN-2024-0130" },
  { id: "estab-31", email: "had.sfax@megacare.tn",                 firstName: "Yacine",   lastName: "Lahmar",     serviceId: "SVC-TN-2024-0131" },
  { id: "estab-32", email: "had.nabeul@megacare.tn",               firstName: "Imen",     lastName: "Baccouche",  serviceId: "SVC-TN-2024-0132" },
  { id: "estab-33", email: "had.bizerte@megacare.tn",              firstName: "Kamel",    lastName: "Hadj Ali",   serviceId: "SVC-TN-2024-0133" },
  { id: "estab-34", email: "had.kairouan@megacare.tn",             firstName: "Fatma",    lastName: "Chouchane",  serviceId: "SVC-TN-2024-0134" },
  { id: "estab-35", email: "had.gabes@megacare.tn",                firstName: "Majdi",    lastName: "Riahi",      serviceId: "SVC-TN-2024-0135" },
];

async function seedEstablishmentAccounts(hashedPassword) {
  let created = 0;
  for (let i = 0; i < ESTAB_ACCOUNTS.length; i++) {
    const acc = ESTAB_ACCOUNTS[i];
    const estab = ESTABLISHMENTS[i]; // same index order
    const exists = await User.findOne({ email: acc.email }).lean();
    if (exists) continue;
    await User.create({
      _id: "svc-" + acc.id,
      firstName: acc.firstName,
      lastName: acc.lastName,
      name: acc.firstName + " " + acc.lastName,
      email: acc.email,
      password: hashedPassword,
      role: "medical_service",
      status: "approved",
      phone: "+216 71 000 000",
      serviceId: acc.serviceId,
      establishmentId: acc.id,
      governorate: estab.governorate || "Tunis",
      delegation: estab.city || "Tunis",
    });
    created++;
  }
  return created;
}

/* ================================================================== */
/*  MAIN SEED FUNCTION                                                 */
/* ================================================================== */
async function seedDatabase() {
  try {
    // --- Testimonials: always seed independently of user data ---
    try {
      const testimonialCount = await Testimonial.countDocuments();
      if (testimonialCount === 0) {
        await Testimonial.insertMany(SEED_TESTIMONIALS);
        console.log("  " + SEED_TESTIMONIALS.length + " testimonials seeded");
      }
    } catch (e) { console.error("  Testimonial seed error:", e.message); }

    // --- Banner migration: assign banners to establishments with empty imageUrl ---
    try {
      const emptyBannerEstabs = await MedicalEstablishment.find({ imageUrl: "" }).lean();
      if (emptyBannerEstabs.length > 0) {
        console.log("Migrating " + emptyBannerEstabs.length + " establishment banners...");
        for (let i = 0; i < emptyBannerEstabs.length; i++) {
          const banner = BANNER_IMAGES[i % BANNER_IMAGES.length];
          await MedicalEstablishment.findByIdAndUpdate(emptyBannerEstabs[i]._id, {
            imageUrl: "/uploads/medical-service-banner/" + banner,
          });
        }
        console.log("  Banners assigned.");
      }
    } catch (e) { console.error("  Banner migration error:", e.message); }

    const userCount = await User.countDocuments();
    if (userCount > 0) {
      // Seed independent collections even on already-seeded DBs
      try {
        const providerCount = await ParamedicalServiceProvider.countDocuments();
        if (providerCount === 0) {
          await ParamedicalServiceProvider.insertMany(PARAMEDICAL_SERVICE_PROVIDERS);
          console.log("  " + PARAMEDICAL_SERVICE_PROVIDERS.length + " paramedical service providers seeded");
        }
      } catch (e) { console.error("  ParamedicalServiceProvider seed error:", e.message); }
      // Ensure establishment user accounts exist (needed for public booking flow)
      try {
        const estabAcctCount = await User.countDocuments({ role: "medical_service", establishmentId: { $exists: true, $ne: null } });
        if (estabAcctCount === 0) {
          const h = await bcrypt.hash("Service@2024", 10);
          const created = await seedEstablishmentAccounts(h);
          console.log("  " + created + " establishment user accounts created");
        }
      } catch (e) { console.error("  EstablishmentAccounts seed error:", e.message); }
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
      // Create one User account per establishment (needed for public booking flow)
      const hEstab = await bcrypt.hash("Service@2024", 10);
      const estabCreated = await seedEstablishmentAccounts(hEstab);
      console.log("  " + estabCreated + " establishment user accounts");
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

    // --- Paramedical service providers ---
    try {
      const providerCount = await ParamedicalServiceProvider.countDocuments();
      if (providerCount === 0) {
        await ParamedicalServiceProvider.insertMany(PARAMEDICAL_SERVICE_PROVIDERS);
        console.log("  " + PARAMEDICAL_SERVICE_PROVIDERS.length + " paramedical service providers seeded");
      }
    } catch (e) { console.error("  ParamedicalServiceProvider seed error:", e.message); }

    console.log("\nSeed complete!\n");
  } catch (err) {
    console.error("Seed error:", err);
  }
}

module.exports = seedDatabase;
