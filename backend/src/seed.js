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
const MedicalEstablishment = require("./models/MedicalEstablishment");
const PublicLabCenter = require("./models/PublicLabCenter");
const { randomUUID } = require("crypto");

const seedUsers = [
  {
    _id: "00000000-0000-0000-0000-000000000001",
    firstName: "Nabil",
    lastName: "Gharbi",
    email: "admin@megacare.tn",
    password: "Admin@megacare2024",
    role: "admin",
    status: "approved",
    phone: "+216 71 800 100",
  },
  {
    _id: "00000000-0000-0000-0000-000000000002",
    firstName: "Fatima",
    lastName: "Benali",
    email: "patient@megacare.tn",
    password: "Patient@2024",
    role: "patient",
    status: "approved",
    phone: "+216 98 123 456",
  },
  {
    _id: "00000000-0000-0000-0000-000000000003",
    firstName: "Mohamed",
    lastName: "Karoui",
    email: "patient2@megacare.tn",
    password: "Patient@2024",
    role: "patient",
    status: "approved",
    phone: "+216 98 234 567",
  },
  {
    _id: "00000000-0000-0000-0000-000000000004",
    firstName: "Aisha",
    lastName: "Hamdi",
    email: "patient3@megacare.tn",
    password: "Patient@2024",
    role: "patient",
    status: "approved",
    phone: "+216 98 345 678",
  },
  {
    _id: "00000000-0000-0000-0000-000000000005",
    firstName: "Salim",
    lastName: "Drissi",
    email: "patient4@megacare.tn",
    password: "Patient@2024",
    role: "patient",
    status: "approved",
    phone: "+216 98 456 789",
  },
  {
    _id: "00000000-0000-0000-0000-000000000006",
    firstName: "Layla",
    lastName: "Meddeb",
    email: "patient5@megacare.tn",
    password: "Patient@2024",
    role: "patient",
    status: "approved",
    phone: "+216 98 567 890",
  },
  {
    _id: "00000000-0000-0000-0000-000000000007",
    firstName: "Amira",
    lastName: "Mansouri",
    email: "medecin@megacare.tn",
    password: "Medecin@2024",
    role: "doctor",
    status: "approved",
    phone: "+216 71 234 567",
    specialization: "Cardiologie",
    doctorId: "MED-TN-2024-0742",
  },
  {
    _id: "00000000-0000-0000-0000-000000000008",
    firstName: "Yassine",
    lastName: "Bouzid",
    email: "labo@megacare.tn",
    password: "Labo@2024",
    role: "lab_radiology",
    status: "approved",
    phone: "+216 71 456 890",
    labId: "LAB-TN-2024-0031",
    companyName: "Laboratoire El Amal",
  },
  {
    _id: "00000000-0000-0000-0000-000000000009",
    firstName: "Hichem",
    lastName: "Trabelsi",
    email: "pharmacien@megacare.tn",
    password: "Pharmacien@2024",
    role: "pharmacy",
    status: "approved",
    phone: "+216 71 567 123",
    pharmacyId: "PHARM-TN-2024-0158",
    companyName: "Pharmacie Centrale Tunis",
  },
  {
    _id: "00000000-0000-0000-0000-00000000000a",
    firstName: "Sana",
    lastName: "Khelifi",
    email: "paramedical@megacare.tn",
    password: "Paramedical@2024",
    role: "paramedical",
    status: "approved",
    phone: "+216 98 678 234",
    paramedicalId: "PARA-TN-2024-0089",
    companyName: "Cabinet de Kinésithérapie Khelifi",
  },
  {
    _id: "00000000-0000-0000-0000-00000000000b",
    firstName: "Rania",
    lastName: "Cherif",
    email: "service@megacare.tn",
    password: "Service@2024",
    role: "medical_service",
    status: "approved",
    phone: "+216 71 789 456",
    serviceId: "SVC-TN-2024-0012",
    companyName: "HAD Santé à Domicile",
  },
];

async function seedDatabase() {
  try {
    // --- Users ---
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("🌱 Seeding users...");
      for (const u of seedUsers) {
        const hashed = await bcrypt.hash(u.password, 10);
        await User.create({
          ...u,
          password: hashed,
          name: `${u.firstName} ${u.lastName}`,
        });
      }
      console.log(`   ✅ ${seedUsers.length} users seeded`);
    }

    // --- Appointments ---
    const apptCount = await Appointment.countDocuments();
    if (apptCount === 0) {
      console.log("🌱 Seeding appointments...");
      const doctor = await User.findById(
        "00000000-0000-0000-0000-000000000007",
      );
      const patient = await User.findById(
        "00000000-0000-0000-0000-000000000002",
      );
      if (doctor && patient) {
        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date(Date.now() + 86400000)
          .toISOString()
          .split("T")[0];
        const seeds = [
          {
            date: today,
            time: "09:00",
            reason: "Consultation de suivi",
            status: "confirmed",
          },
          {
            date: today,
            time: "10:00",
            reason: "Contrôle tension artérielle",
            status: "pending",
          },
          {
            date: today,
            time: "14:00",
            reason: "Renouvellement ordonnance",
            status: "pending",
          },
          {
            date: today,
            time: "15:30",
            reason: "Douleurs thoraciques",
            status: "pending",
          },
          {
            date: today,
            time: "11:30",
            reason: "Bilan annuel",
            status: "confirmed",
          },
          {
            date: tomorrow,
            time: "09:00",
            reason: "Suivi post-opératoire",
            status: "confirmed",
          },
          {
            date: tomorrow,
            time: "10:30",
            reason: "Électrocardiogramme",
            status: "pending",
          },
        ];
        for (const s of seeds) {
          await Appointment.create({
            _id: randomUUID(),
            patientId: patient._id,
            patientName: `${patient.firstName} ${patient.lastName}`,
            doctorId: doctor._id,
            ...s,
          });
        }
        console.log(`   ✅ ${seeds.length} appointments seeded`);
      }
    }

    // --- Messages ---
    const msgCount = await Message.countDocuments();
    if (msgCount === 0) {
      console.log("🌱 Seeding messages...");
      const doctor = await User.findById(
        "00000000-0000-0000-0000-000000000007",
      );
      const patient = await User.findById(
        "00000000-0000-0000-0000-000000000002",
      );
      if (doctor && patient) {
        const now = Date.now();
        const seeds = [
          {
            senderId: patient._id,
            senderName: `${patient.firstName} ${patient.lastName}`,
            senderRole: "patient",
            receiverId: doctor._id,
            receiverName: `${doctor.firstName} ${doctor.lastName}`,
            receiverRole: "doctor",
            content: "Bonjour Docteur, j'ai des questions sur mon traitement.",
            createdAt: new Date(now - 3600000 * 3),
          },
          {
            senderId: doctor._id,
            senderName: `${doctor.firstName} ${doctor.lastName}`,
            senderRole: "doctor",
            receiverId: patient._id,
            receiverName: `${patient.firstName} ${patient.lastName}`,
            receiverRole: "patient",
            content: "Bonjour, bien sûr. Quelles sont vos questions ?",
            createdAt: new Date(now - 3600000 * 2.5),
          },
          {
            senderId: patient._id,
            senderName: `${patient.firstName} ${patient.lastName}`,
            senderRole: "patient",
            receiverId: doctor._id,
            receiverName: `${doctor.firstName} ${doctor.lastName}`,
            receiverRole: "doctor",
            content:
              "Est-ce que je peux prendre le médicament le soir au lieu du matin ?",
            createdAt: new Date(now - 3600000 * 2),
          },
          {
            senderId: doctor._id,
            senderName: `${doctor.firstName} ${doctor.lastName}`,
            senderRole: "doctor",
            receiverId: patient._id,
            receiverName: `${patient.firstName} ${patient.lastName}`,
            receiverRole: "patient",
            content:
              "Oui, vous pouvez le prendre le soir. L'important est de le prendre à heure régulière.",
            createdAt: new Date(now - 3600000 * 1.5),
          },
        ];
        for (const s of seeds) {
          await Message.create({ _id: randomUUID(), read: false, ...s });
        }
        console.log(`   ✅ ${seeds.length} messages seeded`);
      }
    }

    // --- Dossiers ---
    const dosCount = await Dossier.countDocuments();
    if (dosCount === 0) {
      console.log("🌱 Seeding dossiers...");
      const dossierSeeds = [
        {
          email: "patient@megacare.tn",
          personal: {
            age: 34,
            gender: "Féminin",
            bloodType: "A+",
            height: 165,
            weight: 62,
          },
          medicalHistory: {
            chronicIllnesses: ["Hypertension artérielle"],
            pastSurgeries: [
              {
                name: "Appendicectomie",
                date: "2018-03-15",
                notes: "Sans complications",
              },
            ],
            familyHistory: [
              { condition: "Diabète type 2", relation: "Père" },
              { condition: "Hypertension", relation: "Mère" },
            ],
          },
          allergies: [
            {
              type: "drug",
              name: "Pénicilline",
              severity: "Sévère",
              reaction: "Choc anaphylactique",
            },
          ],
          activeMedications: [
            {
              name: "Amlodipine",
              dosage: "5mg",
              frequency: "1x/jour",
              since: "2022-01-10",
            },
          ],
          documents: [
            {
              id: "doc-1",
              type: "lab",
              name: "Bilan sanguin complet",
              date: "2025-11-20",
              description: "NFS, glycémie, bilan lipidique",
            },
            {
              id: "doc-2",
              type: "prescription",
              name: "Ordonnance cardiologie",
              date: "2025-12-01",
              description: "Renouvellement traitement hypertension",
            },
          ],
        },
        {
          email: "patient2@megacare.tn",
          personal: {
            age: 52,
            gender: "Masculin",
            bloodType: "O+",
            height: 178,
            weight: 85,
          },
          medicalHistory: {
            chronicIllnesses: ["Insuffisance cardiaque", "Diabète type 2"],
            pastSurgeries: [
              {
                name: "Pontage coronarien",
                date: "2020-06-01",
                notes: "Triple pontage",
              },
            ],
            familyHistory: [
              { condition: "Infarctus du myocarde", relation: "Père" },
            ],
          },
          allergies: [
            {
              type: "drug",
              name: "Aspirine",
              severity: "Modérée",
              reaction: "Gastrite sévère",
            },
            {
              type: "drug",
              name: "Iode",
              severity: "Légère",
              reaction: "Rash cutané",
            },
          ],
          activeMedications: [
            {
              name: "Furosémide",
              dosage: "40mg",
              frequency: "1x/jour",
              since: "2020-07-01",
            },
            {
              name: "Metformine",
              dosage: "500mg",
              frequency: "3x/jour",
              since: "2019-03-15",
            },
            {
              name: "Bisoprolol",
              dosage: "5mg",
              frequency: "1x/jour",
              since: "2020-07-01",
            },
          ],
          documents: [
            {
              id: "doc-3",
              type: "imaging",
              name: "Échocardiographie",
              date: "2026-01-15",
              description: "FE 45%, dilatation VG modérée",
            },
            {
              id: "doc-4",
              type: "lab",
              name: "Bilan rénal",
              date: "2026-02-20",
              description: "Créatinine, urée, ionogramme",
            },
          ],
        },
        {
          email: "patient3@megacare.tn",
          personal: {
            age: 28,
            gender: "Féminin",
            bloodType: "B+",
            height: 160,
            weight: 55,
          },
          medicalHistory: {
            chronicIllnesses: [],
            pastSurgeries: [],
            familyHistory: [{ condition: "Asthme", relation: "Mère" }],
          },
          allergies: [],
          activeMedications: [],
          documents: [
            {
              id: "doc-5",
              type: "lab",
              name: "Holter ECG 24h",
              date: "2026-03-28",
              description: "Quelques extrasystoles bénignes",
            },
          ],
        },
        {
          email: "patient4@megacare.tn",
          personal: {
            age: 61,
            gender: "Masculin",
            bloodType: "AB-",
            height: 172,
            weight: 90,
          },
          medicalHistory: {
            chronicIllnesses: ["Hypercholestérolémie"],
            pastSurgeries: [
              {
                name: "Prothèse de hanche",
                date: "2023-09-20",
                notes: "Hanche droite",
              },
            ],
            familyHistory: [
              { condition: "AVC", relation: "Mère" },
              { condition: "Cholestérol", relation: "Père" },
            ],
          },
          allergies: [
            {
              type: "drug",
              name: "Statines",
              severity: "Modérée",
              reaction: "Myopathie",
            },
          ],
          activeMedications: [
            {
              name: "Ézétimibe",
              dosage: "10mg",
              frequency: "1x/jour",
              since: "2024-01-15",
            },
          ],
          documents: [
            {
              id: "doc-6",
              type: "lab",
              name: "Bilan lipidique",
              date: "2026-01-10",
              description: "LDL 1.8g/L, HDL 0.4g/L",
            },
          ],
        },
        {
          email: "patient5@megacare.tn",
          personal: {
            age: 41,
            gender: "Féminin",
            bloodType: "A-",
            height: 168,
            weight: 65,
          },
          medicalHistory: {
            chronicIllnesses: ["Arythmie sinusale"],
            pastSurgeries: [],
            familyHistory: [],
          },
          allergies: [],
          activeMedications: [
            {
              name: "Flécaïnide",
              dosage: "100mg",
              frequency: "2x/jour",
              since: "2025-06-01",
            },
          ],
          documents: [
            {
              id: "doc-7",
              type: "imaging",
              name: "ECG de contrôle",
              date: "2026-04-01",
              description: "Rythme sinusal régulier",
            },
            {
              id: "doc-8",
              type: "lab",
              name: "TSH / T4",
              date: "2026-03-15",
              description: "Bilan thyroïdien normal",
            },
          ],
        },
      ];

      for (const seed of dossierSeeds) {
        const patient = await User.findOne({ email: seed.email });
        if (!patient) continue;
        await Dossier.create({
          patientId: patient._id,
          personal: seed.personal,
          medicalHistory: seed.medicalHistory,
          allergies: seed.allergies,
          activeMedications: seed.activeMedications,
          documents: seed.documents,
        });
      }
      console.log(`   ✅ ${dossierSeeds.length} dossiers seeded`);
    }

    // --- Products ---
    const prodCount = await Product.countDocuments();
    if (prodCount < 20) {
      await Product.deleteMany({});
      console.log("🌱 Seeding pharmacy products...");
      const IMG = [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
      ];
      const products = [
        { _id: "prod-01", name: "Paracétamol 500mg", category: "Analgésique", price: 2.0, stock: 8, requiresPrescription: false, form: "Comprimés - Boîte 16", brand: "EVOLUPHARM", dci: "Paracétamol", rating: 4.8, reviews: 156, description: "Antalgique et antipyrétique", imageUrl: IMG[0], pharmacy: "Pharmacie El Amal", distance: 1.2, delivery: "2h", usage: "1 à 2 comprimés toutes les 4 à 6 heures. Maximum 8 comprimés/jour.", contraindications: "Insuffisance hépatique sévère. Hypersensibilité au paracétamol.", sideEffects: "Généralement bien toléré. Rarement : réactions allergiques, hépatotoxicité." },
        { _id: "prod-02", name: "Amoxicilline 500mg", category: "Antibiotique", price: 9.2, stock: 5, requiresPrescription: true, form: "Gélules", brand: "SANDOZ", dci: "Amoxicilline", rating: 4.6, reviews: 89, description: "Antibiotique pénicilline – Nécessite ordonnance", imageUrl: IMG[1], pharmacy: "Pharmacie Centrale", distance: 2.8, delivery: "3h", usage: "500 mg toutes les 8 heures. Durée selon prescription (7 à 14 jours).", contraindications: "Allergie aux pénicillines. Mononucléose infectieuse.", sideEffects: "Diarrhée, nausées. Rarement : réactions allergiques graves." },
        { _id: "prod-03", name: "Vitamine C 1000mg", category: "Vitamines", price: 5.5, stock: 20, requiresPrescription: false, form: "Comprimés effervescents", brand: "WASSEN", dci: "Acide ascorbique", rating: 4.9, reviews: 234, description: "Renforce l'immunité et la défense naturelle de l'organisme", imageUrl: IMG[2], pharmacy: "Pharmacie Moderne", distance: 0.8, delivery: "1h", usage: "1 comprimé effervescent par jour dissous dans un verre d'eau.", contraindications: "Lithiases rénales oxaliques. Hémochromatose.", sideEffects: "Troubles digestifs à forte dose. Diarrhée possible." },
        { _id: "prod-04", name: "Ibuprofène 400mg", category: "Anti-inflammatoire", price: 6.0, stock: 15, requiresPrescription: false, form: "Comprimés - Boîte 30", brand: "NUROFEN", dci: "Ibuprofène", rating: 4.7, reviews: 178, description: "Anti-inflammatoire non stéroïdien et analgésique", imageUrl: IMG[3], pharmacy: "Pharmacie El Amal", distance: 1.2, delivery: "2h", usage: "400 mg toutes les 6 à 8 heures au cours des repas. Max 1200 mg/jour.", contraindications: "Antécédents d'ulcère gastroduodénal. Insuffisance rénale sévère. Grossesse.", sideEffects: "Troubles digestifs, nausées. Risque cardiovasculaire à long terme." },
        { _id: "prod-05", name: "Oméprazole 20mg", category: "Gastro-entérologie", price: 7.8, stock: 12, requiresPrescription: true, form: "Gélules gastro-résistantes", brand: "BIOGARAN", dci: "Oméprazole", rating: 4.7, reviews: 145, description: "Inhibiteur de la pompe à protons – traitement de l'ulcère", imageUrl: IMG[4], pharmacy: "Pharmacie Centrale", distance: 2.8, delivery: "3h", usage: "20 mg par jour le matin avant le repas.", contraindications: "Association avec le nelfinavir.", sideEffects: "Maux de tête, diarrhée, nausées. Rarement : colite microscopique." },
        { _id: "prod-06", name: "Metformine 500mg", category: "Diabétologie", price: 5.2, stock: 18, requiresPrescription: true, form: "Comprimés pelliculés", brand: "TEVA", dci: "Metformine", rating: 4.4, reviews: 98, description: "Antidiabétique oral de référence pour le diabète de type 2", imageUrl: IMG[5], pharmacy: "Pharmacie Moderne", distance: 0.8, delivery: "1h", usage: "500 mg 2 à 3 fois par jour au cours des repas.", contraindications: "Insuffisance rénale ou hépatique. Acidose métabolique.", sideEffects: "Troubles digestifs initiaux (nausées, diarrhée). Très rarement : acidose lactique." },
        { _id: "prod-07", name: "Loratadine 10mg", category: "Allergie", price: 4.9, stock: 25, requiresPrescription: false, form: "Comprimés - Boîte 10", brand: "CLARITIN", dci: "Loratadine", rating: 4.6, reviews: 187, description: "Antihistaminique non sédatif contre les allergies saisonnières", imageUrl: IMG[6], pharmacy: "Pharmacie El Amal", distance: 1.2, delivery: "2h", usage: "1 comprimé de 10 mg par jour.", contraindications: "Hypersensibilité à la loratadine.", sideEffects: "Somnolence légère, sécheresse buccale." },
        { _id: "prod-08", name: "Amlodipine 5mg", category: "Cardiologie", price: 11.3, stock: 10, requiresPrescription: true, form: "Comprimés", brand: "NORVASC", dci: "Amlodipine", rating: 4.5, reviews: 76, description: "Inhibiteur calcique pour l'hypertension artérielle", imageUrl: IMG[7], pharmacy: "Pharmacie Centrale", distance: 2.8, delivery: "3h", usage: "5 mg une fois par jour. Dose maximale : 10 mg/jour.", contraindications: "Choc cardiogénique. Sténose aortique sévère.", sideEffects: "Œdèmes des membres inférieurs, flush. Rarement : palpitations." },
        { _id: "prod-09", name: "Simvastatine 20mg", category: "Cardiologie", price: 8.6, stock: 7, requiresPrescription: true, form: "Comprimés pelliculés", brand: "ZOCOR", dci: "Simvastatine", rating: 4.3, reviews: 112, description: "Hypocholestérolémiant de la famille des statines", imageUrl: IMG[0], pharmacy: "Pharmacie Moderne", distance: 0.8, delivery: "1h", usage: "20 à 40 mg le soir au coucher.", contraindications: "Hépatopathie évolutive. Association avec certains fibrates.", sideEffects: "Myopathie, élévation des CPK. Rarement : rhabdomyolyse." },
        { _id: "prod-10", name: "Atorvastatine 10mg", category: "Cardiologie", price: 12.0, stock: 14, requiresPrescription: true, form: "Gélules", brand: "LIPITOR", dci: "Atorvastatine", rating: 4.7, reviews: 203, description: "Réduction puissante du cholestérol LDL", imageUrl: IMG[1], pharmacy: "Pharmacie El Amal", distance: 1.2, delivery: "2h", usage: "10 à 80 mg une fois par jour à n'importe quel moment de la journée.", contraindications: "Hépatopathie active ou inexpliquée. Grossesse.", sideEffects: "Myalgies, céphalées, troubles digestifs." },
        { _id: "prod-11", name: "Lisinopril 10mg", category: "Cardiologie", price: 9.4, stock: 9, requiresPrescription: true, form: "Comprimés", brand: "ZESTRIL", dci: "Lisinopril", rating: 4.4, reviews: 88, description: "Inhibiteur de l'enzyme de conversion antihypertenseur", imageUrl: IMG[2], pharmacy: "Pharmacie Centrale", distance: 2.8, delivery: "3h", usage: "10 mg une fois par jour. Ajustement selon la réponse tensionnelle.", contraindications: "Antécédents d'angio-œdème. Sténose rénale bilatérale.", sideEffects: "Toux sèche persistante, hypotension, hyperkaliémie." },
        { _id: "prod-12", name: "Vitamine D3 1000 UI", category: "Vitamines", price: 6.9, stock: 35, requiresPrescription: false, form: "Capsules molles", brand: "ZYMA D", dci: "Cholécalciférol", rating: 4.8, reviews: 298, description: "Supplémentation en vitamine D, essentielle pour les os et l'immunité", imageUrl: IMG[3], pharmacy: "Pharmacie Centrale", distance: 2.8, delivery: "3h", usage: "1 capsule par jour ou selon prescription médicale.", contraindications: "Hypercalcémie. Hypersensibilité à la vitamine D.", sideEffects: "À dose normale : bien toléré. Surdosage : hypercalcémie, lithiases rénales." },
        { _id: "prod-13", name: "Magnésium B6", category: "Vitamines", price: 8.1, stock: 22, requiresPrescription: false, form: "Comprimés - Boîte 60", brand: "MAGNE B6", dci: "Magnésium", rating: 4.7, reviews: 321, description: "Complément minéral anti-stress et anti-fatigue", imageUrl: IMG[4], pharmacy: "Pharmacie Moderne", distance: 0.8, delivery: "1h", usage: "2 à 3 comprimés par jour en 2 prises au cours des repas.", contraindications: "Insuffisance rénale sévère.", sideEffects: "Troubles digestifs (diarrhée) à fortes doses." },
        { _id: "prod-14", name: "Cétirizine 10mg", category: "Allergie", price: 5.7, stock: 17, requiresPrescription: false, form: "Comprimés pelliculés", brand: "ZYRTEC", dci: "Cétirizine", rating: 4.6, reviews: 176, description: "Antihistaminique de 2ème génération contre les rhinites et urticaires", imageUrl: IMG[5], pharmacy: "Pharmacie El Amal", distance: 1.2, delivery: "2h", usage: "10 mg une fois par jour de préférence le soir.", contraindications: "Insuffisance rénale sévère. Hypersensibilité à la cétirizine.", sideEffects: "Somnolence légère, maux de tête, sécheresse buccale." },
        { _id: "prod-15", name: "Bisoprolol 5mg", category: "Cardiologie", price: 13.8, stock: 8, requiresPrescription: true, form: "Comprimés pelliculés", brand: "CARDENSIEL", dci: "Bisoprolol", rating: 4.4, reviews: 54, description: "Bêta-bloquant cardiosélectif pour l'insuffisance cardiaque", imageUrl: IMG[6], pharmacy: "Pharmacie Centrale", distance: 2.8, delivery: "3h", usage: "5 mg une fois par jour le matin avec ou sans repas.", contraindications: "Asthme bronchique. Bradycardie sévère. Bloc AV de haut degré.", sideEffects: "Bradycardie, asthénie, extrémités froides. Rarement : bronchospasme." },
        { _id: "prod-16", name: "Azithromycine 250mg", category: "Antibiotique", price: 18.4, stock: 5, requiresPrescription: true, form: "Gélules - Boîte 6", brand: "ZITHROMAX", dci: "Azithromycine", rating: 4.5, reviews: 83, description: "Antibiotique macrolide à spectre large", imageUrl: IMG[7], pharmacy: "Pharmacie Moderne", distance: 0.8, delivery: "1h", usage: "500 mg le 1er jour puis 250 mg du 2ème au 5ème jour.", contraindications: "Allergie aux macrolides. Arythmies avec allongement du QT.", sideEffects: "Troubles digestifs, diarrhée. Rarement : arythmie ventriculaire." },
        { _id: "prod-17", name: "Diclofénac 50mg", category: "Anti-inflammatoire", price: 8.9, stock: 14, requiresPrescription: false, form: "Comprimés gastro-résistants", brand: "VOLTARENE", dci: "Diclofénac", rating: 4.6, reviews: 167, description: "AINS indiqué dans les douleurs articulaires et rhumatismales", imageUrl: IMG[0], pharmacy: "Pharmacie El Amal", distance: 1.2, delivery: "2h", usage: "50 mg 2 à 3 fois par jour au cours des repas.", contraindications: "Ulcère gastroduodénal actif. Insuffisance rénale ou cardiaque sévère.", sideEffects: "Douleurs épigastriques, nausées. Risque cardiovasculaire accru." },
        { _id: "prod-18", name: "Fluconazole 150mg", category: "Antibiotique", price: 8.3, stock: 15, requiresPrescription: true, form: "Gélule unique", brand: "TRIFLUCAN", dci: "Fluconazole", rating: 4.6, reviews: 114, description: "Antifongique systémique contre les candidoses", imageUrl: IMG[1], pharmacy: "Pharmacie Centrale", distance: 2.8, delivery: "3h", usage: "150 mg en prise orale unique.", contraindications: "Association avec terfénadine ou astémizole. Insuffisance hépatique.", sideEffects: "Céphalées, nausées, douleurs abdominales. Élévation des enzymes hépatiques." },
        { _id: "prod-19", name: "Acide Folique 5mg", category: "Vitamines", price: 3.8, stock: 24, requiresPrescription: false, form: "Comprimés", brand: "SPECIAFOLDINE", dci: "Acide folique", rating: 4.7, reviews: 155, description: "Vitamine B9 indispensable en période de grossesse et contre l'anémie", imageUrl: IMG[2], pharmacy: "Pharmacie Moderne", distance: 0.8, delivery: "1h", usage: "1 comprimé par jour pendant 3 mois ou selon prescription.", contraindications: "Tumeurs dépendant des folates (certaines leucémies).", sideEffects: "Très bien toléré aux doses thérapeutiques habituelles." },
        { _id: "prod-20", name: "Probiotiques Équilibre", category: "Gastro-entérologie", price: 18.9, stock: 26, requiresPrescription: false, form: "Gélules - Boîte 30", brand: "LACTIBIANE", dci: "Lactobacillus acidophilus", rating: 4.8, reviews: 243, description: "Rétablissement de la flore intestinale et amélioration de la digestion", imageUrl: IMG[3], pharmacy: "Pharmacie El Amal", distance: 1.2, delivery: "2h", usage: "2 gélules par jour au cours du repas.", contraindications: "Immunodépression sévère. Patients sous chimiothérapie.", sideEffects: "Très rarement : ballonnements transitoires les premiers jours." },
      ];
      await Product.insertMany(products);
      console.log(`   ✅ ${products.length} products seeded`);
    }

    // --- Reviews ---
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log("🌱 Seeding reviews...");
      const doctor = await User.findById("00000000-0000-0000-0000-000000000007");
      if (doctor) {
        const reviewSeeds = [
          {
            patientId: "00000000-0000-0000-0000-000000000002",
            patientName: "Fatima Benali",
            rating: 5,
            text: "Très bon médecin, très attentif et professionnel. Explications claires et rassurantes. Je recommande vivement.",
            type: "Vidéo",
            helpful: 4,
            createdAt: new Date("2026-04-01"),
          },
          {
            patientId: "00000000-0000-0000-0000-000000000003",
            patientName: "Mohamed Karoui",
            rating: 5,
            text: "Consultation excellente, le docteur prend vraiment le temps d'écouter. Diagnostic précis et suivi sérieux.",
            type: "Cabinet",
            helpful: 7,
            createdAt: new Date("2026-03-28"),
          },
          {
            patientId: "00000000-0000-0000-0000-000000000004",
            patientName: "Aisha Hamdi",
            rating: 4,
            text: "Bon diagnostic, à recommander. Légèrement pressée lors de la consultation mais très compétente.",
            type: "Vidéo",
            helpful: 2,
            createdAt: new Date("2026-03-20"),
          },
          {
            patientId: "00000000-0000-0000-0000-000000000005",
            patientName: "Salim Drissi",
            rating: 5,
            text: "Médecin compétent, très courtois et disponible pour répondre aux questions après la séance.",
            type: "Cabinet",
            helpful: 5,
            createdAt: new Date("2026-03-15"),
          },
          {
            patientId: "00000000-0000-0000-0000-000000000006",
            patientName: "Layla Meddeb",
            rating: 4,
            text: "Bonne expérience globale, prise en charge rapide et professionnelle.",
            type: "Cabinet",
            helpful: 3,
            createdAt: new Date("2026-03-10"),
          },
          {
            patientId: "00000000-0000-0000-0000-000000000002",
            patientName: "Fatima Benali",
            rating: 3,
            text: "Consultation correcte mais temps d'attente un peu long. Médecin sympathique et compétent.",
            type: "Cabinet",
            helpful: 1,
            createdAt: new Date("2026-02-28"),
          },
          {
            patientId: "00000000-0000-0000-0000-000000000004",
            patientName: "Aisha Hamdi",
            rating: 5,
            text: "Excellente séance de téléconsultation, lien vidéo parfaitement stable. Suivi impeccable.",
            type: "Vidéo",
            helpful: 6,
            createdAt: new Date("2026-02-22"),
          },
        ];
        for (const r of reviewSeeds) {
          await Review.create({ _id: randomUUID(), doctorId: doctor._id, ...r });
        }
        console.log(`   ✅ ${reviewSeeds.length} reviews seeded`);
      }
    }

    console.log("🌱 Seeding complete!");

    // --- Lab Tests ---
    const labTestCount = await LabTest.countDocuments();
    if (labTestCount === 0) {
      console.log("🌱 Seeding lab tests...");
      const today = new Date().toISOString().slice(0, 10);
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const labTests = [
        { _id: randomUUID(), patient: "Fatima Ben Ali", testType: "Numération sanguine", doctor: "Dr. Karim Mansouri", status: "En cours", priority: "Normal", date: today, notes: "À jeun" },
        { _id: randomUUID(), patient: "Mohammed Gharbi", testType: "Glycémie", doctor: "Dr. Nour Belhadj", status: "Complété", priority: "Normal", date: today, notes: "Matin" },
        { _id: randomUUID(), patient: "Leila Mansouri", testType: "Test PCR ADN", doctor: "Dr. Sana Triki", status: "En attente", priority: "Urgent", date: today, notes: "Résultat sous 24h" },
        { _id: randomUUID(), patient: "Ahmed Nasser", testType: "Bilan lipidique", doctor: "Dr. Karim Mansouri", status: "En cours", priority: "Normal", date: yesterday, notes: "—" },
        { _id: randomUUID(), patient: "Sara Meddeb", testType: "TSH", doctor: "Dr. Nour Belhadj", status: "Complété", priority: "Normal", date: yesterday, notes: "—" },
        { _id: randomUUID(), patient: "Karim Smaoui", testType: "Créatinine", doctor: "Dr. Sana Triki", status: "En attente", priority: "Urgent", date: today, notes: "Insuffisance rénale suspectée" },
        { _id: randomUUID(), patient: "Nida Khadija", testType: "Hémoculture", doctor: "Dr. Karim Mansouri", status: "En attente", priority: "Urgent", date: today, notes: "Fièvre persistante" },
      ];
      await LabTest.insertMany(labTests);
      console.log(`   ✅ ${labTests.length} lab tests seeded`);
    }

    // --- Lab Results ---
    const labResultCount = await LabResult.countDocuments();
    if (labResultCount === 0) {
      console.log("🌱 Seeding lab results...");
      const today = new Date().toISOString().slice(0, 10);
      const d1 = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const d2 = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
      const d3 = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
      const d4 = new Date(Date.now() - 4 * 86400000).toISOString().slice(0, 10);
      const labResults = [
        { _id: randomUUID(), patient: "Mohammed Gharbi", testType: "Glycémie", value: "1.15", unit: "g/L", reference: "0.7–1.1", status: "Élevé", doctor: "Dr. Nour Belhadj", date: today },
        { _id: randomUUID(), patient: "Sara Meddeb", testType: "TSH", value: "2.5", unit: "mIU/L", reference: "0.4–4.0", status: "Normal", doctor: "Dr. Nour Belhadj", date: d1 },
        { _id: randomUUID(), patient: "Karim Smaoui", testType: "Cholestérol total", value: "6.8", unit: "mmol/L", reference: "< 5.0", status: "Élevé", doctor: "Dr. Sana Triki", date: d2 },
        { _id: randomUUID(), patient: "Nida Khadija", testType: "Créatinine", value: "85", unit: "µmol/L", reference: "44–97", status: "Normal", doctor: "Dr. Karim Mansouri", date: d3 },
        { _id: randomUUID(), patient: "Ali Ben Romdhane", testType: "Bilirubine", value: "15", unit: "µmol/L", reference: "< 17", status: "Normal", doctor: "Dr. Karim Mansouri", date: d4 },
        { _id: randomUUID(), patient: "Fatima Ben Ali", testType: "Numération sanguine", value: "2.8", unit: "T/µL", reference: "4.5–5.9", status: "Critique", doctor: "Dr. Karim Mansouri", date: today },
        { _id: randomUUID(), patient: "Ahmed Nasser", testType: "Bilan lipidique", value: "3.2", unit: "g/L", reference: "< 1.5", status: "Critique", doctor: "Dr. Sana Triki", date: d1 },
      ];
      await LabResult.insertMany(labResults);
      console.log(`   ✅ ${labResults.length} lab results seeded`);
    }

    // --- Supplier Orders ---
    const supplierOrderCount = await SupplierOrder.countDocuments();
    if (supplierOrderCount === 0) {
      console.log("🌱 Seeding supplier orders...");
      const supplierOrders = [
        { _id: randomUUID(), ref: "ORD-F-001", supplier: "EVOLUPHARM Tunisie", date: "2026-04-01", expectedDate: null, items: [{ name: "Paracétamol 500mg", qty: 200, unit: "boîtes" }, { name: "Aspirine 500mg", qty: 100, unit: "boîtes" }, { name: "Vitamine C 1000mg", qty: 150, unit: "boîtes" }], total: 1240, status: "Livré" },
        { _id: randomUUID(), ref: "ORD-F-002", supplier: "SANDOZ Maghreb", date: "2026-04-02", expectedDate: "2026-04-07", items: [{ name: "Amoxicilline 500mg", qty: 80, unit: "boîtes" }, { name: "Amoxicilline 1g", qty: 60, unit: "boîtes" }], total: 736, status: "En transit" },
        { _id: randomUUID(), ref: "ORD-F-003", supplier: "WASSEN International", date: "2026-03-28", expectedDate: null, items: [{ name: "Vitamine D3 1000UI", qty: 120, unit: "boîtes" }, { name: "Oméga-3 1000mg", qty: 80, unit: "boîtes" }, { name: "Magnésium B6", qty: 100, unit: "boîtes" }], total: 2310, status: "Livré" },
        { _id: randomUUID(), ref: "ORD-F-004", supplier: "BIOGARAN Afrique du Nord", date: "2026-03-25", expectedDate: null, items: [{ name: "Oméprazole 20mg", qty: 150, unit: "boîtes" }], total: 450, status: "Livré" },
        { _id: randomUUID(), ref: "ORD-F-005", supplier: "SANOFI Maroc", date: "2026-04-03", expectedDate: "2026-04-10", items: [{ name: "Doliprane 1000mg", qty: 300, unit: "boîtes" }, { name: "Sérum Physiologique", qty: 200, unit: "unités" }], total: 1820, status: "En attente" },
        { _id: randomUUID(), ref: "ORD-F-006", supplier: "ZYRTEC MENA", date: "2026-04-04", expectedDate: "2026-04-12", items: [{ name: "Cétirizine 10mg", qty: 120, unit: "boîtes" }], total: 684, status: "En attente" },
        { _id: randomUUID(), ref: "ORD-F-007", supplier: "MYLAN Tunisie", date: "2026-03-20", expectedDate: null, items: [{ name: "Diclofénac 50mg", qty: 100, unit: "boîtes" }, { name: "Fluconazole 150mg", qty: 60, unit: "boîtes" }], total: 1398, status: "Livré" },
      ];
      await SupplierOrder.insertMany(supplierOrders);
      console.log(`   ✅ ${supplierOrders.length} supplier orders seeded`);
    }

    // --- Pharmacy Orders (patient orders for sales/dashboard) ---
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      console.log("🌱 Seeding pharmacy orders...");
      const patientId = "00000000-0000-0000-0000-000000000002";
      const patient2Id = "00000000-0000-0000-0000-000000000003";
      const patient3Id = "00000000-0000-0000-0000-000000000004";
      const now = Date.now();
      const day = 86400000;
      const pharmacyOrders = [
        // Current month - completed
        { status: "completed", userId: patientId, items: [{ productId: "prod-01", name: "Paracétamol 500mg", quantity: 3, price: 2.0 }, { productId: "prod-03", name: "Vitamine C 1000mg", quantity: 2, price: 5.5 }], total: 17.0, createdAt: new Date(now - 2 * day) },
        { status: "completed", userId: patient2Id, items: [{ productId: "prod-12", name: "Vitamine D3 1000 UI", quantity: 2, price: 6.9 }, { productId: "prod-13", name: "Magnésium B6", quantity: 1, price: 8.1 }], total: 21.9, createdAt: new Date(now - 3 * day) },
        { status: "completed", userId: patient3Id, items: [{ productId: "prod-04", name: "Ibuprofène 400mg", quantity: 1, price: 6.0 }, { productId: "prod-07", name: "Loratadine 10mg", quantity: 2, price: 4.9 }], total: 15.8, createdAt: new Date(now - 4 * day) },
        { status: "completed", userId: patientId, items: [{ productId: "prod-02", name: "Amoxicilline 500mg", quantity: 1, price: 9.2 }, { productId: "prod-01", name: "Paracétamol 500mg", quantity: 2, price: 2.0 }], total: 13.2, createdAt: new Date(now - 5 * day) },
        { status: "completed", userId: patient2Id, items: [{ productId: "prod-17", name: "Diclofénac 50mg", quantity: 1, price: 8.9 }, { productId: "prod-14", name: "Cétirizine 10mg", quantity: 1, price: 5.7 }], total: 14.6, createdAt: new Date(now - 6 * day) },
        { status: "completed", userId: patient3Id, items: [{ productId: "prod-03", name: "Vitamine C 1000mg", quantity: 3, price: 5.5 }, { productId: "prod-12", name: "Vitamine D3 1000 UI", quantity: 1, price: 6.9 }], total: 23.4, createdAt: new Date(now - 7 * day) },
        { status: "completed", userId: patientId, items: [{ productId: "prod-20", name: "Probiotiques Équilibre", quantity: 1, price: 18.9 }], total: 18.9, createdAt: new Date(now - 8 * day) },
        { status: "completed", userId: patient2Id, items: [{ productId: "prod-01", name: "Paracétamol 500mg", quantity: 4, price: 2.0 }, { productId: "prod-04", name: "Ibuprofène 400mg", quantity: 2, price: 6.0 }], total: 20.0, createdAt: new Date(now - 9 * day) },
        { status: "completed", userId: patient3Id, items: [{ productId: "prod-13", name: "Magnésium B6", quantity: 2, price: 8.1 }, { productId: "prod-07", name: "Loratadine 10mg", quantity: 1, price: 4.9 }], total: 21.1, createdAt: new Date(now - 10 * day) },
        { status: "completed", userId: patientId, items: [{ productId: "prod-12", name: "Vitamine D3 1000 UI", quantity: 3, price: 6.9 }], total: 20.7, createdAt: new Date(now - 12 * day) },
        // Last month - completed (for growth comparison)
        { status: "completed", userId: patientId, items: [{ productId: "prod-01", name: "Paracétamol 500mg", quantity: 2, price: 2.0 }], total: 4.0, createdAt: new Date(now - 35 * day) },
        { status: "completed", userId: patient2Id, items: [{ productId: "prod-03", name: "Vitamine C 1000mg", quantity: 1, price: 5.5 }], total: 5.5, createdAt: new Date(now - 40 * day) },
        { status: "completed", userId: patient3Id, items: [{ productId: "prod-12", name: "Vitamine D3 1000 UI", quantity: 2, price: 6.9 }], total: 13.8, createdAt: new Date(now - 45 * day) },
        // Pending orders (for dashboard)
        { status: "pending", userId: patientId, items: [{ productId: "prod-01", name: "Paracétamol 500mg", quantity: 4, price: 2.0 }, { productId: "prod-03", name: "Vitamine C 1000mg", quantity: 2, price: 5.5 }, { productId: "prod-04", name: "Ibuprofène 400mg", quantity: 2, price: 6.0 }], total: 31.0, createdAt: new Date(now - 2 * 3600000) },
        { status: "pending", userId: patient2Id, items: [{ productId: "prod-02", name: "Amoxicilline 500mg", quantity: 2, price: 9.2 }], total: 18.4, createdAt: new Date(now - 4 * 3600000) },
        { status: "pending", userId: patient3Id, items: [{ productId: "prod-12", name: "Vitamine D3 1000 UI", quantity: 3, price: 6.9 }, { productId: "prod-13", name: "Magnésium B6", quantity: 2, price: 8.1 }, { productId: "prod-07", name: "Loratadine 10mg", quantity: 3, price: 4.9 }, { productId: "prod-03", name: "Vitamine C 1000mg", quantity: 1, price: 5.5 }, { productId: "prod-20", name: "Probiotiques Équilibre", quantity: 1, price: 18.9 }, { productId: "prod-14", name: "Cétirizine 10mg", quantity: 2, price: 5.7 }], total: 77.8, createdAt: new Date(now - 6 * 3600000) },
        { status: "pending", userId: patientId, items: [{ productId: "prod-17", name: "Diclofénac 50mg", quantity: 1, price: 8.9 }, { productId: "prod-20", name: "Probiotiques Équilibre", quantity: 1, price: 18.9 }, { productId: "prod-01", name: "Paracétamol 500mg", quantity: 3, price: 2.0 }], total: 33.8, createdAt: new Date(now - 8 * 3600000) },
      ];
      for (const o of pharmacyOrders) {
        await Order.create({ _id: randomUUID(), ...o });
      }
      console.log(`   ✅ ${pharmacyOrders.length} pharmacy orders seeded`);
    }

    console.log("✅ All seeding complete!");

    // ── Medical Service Seeds ──────────────────────────────────
    const medUserId = "00000000-0000-0000-0000-00000000000b";
    const today2 = new Date().toISOString().slice(0, 10);
    const tomorrow2 = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

    const msPatCount = await MedServicePatient.countDocuments();
    if (msPatCount === 0) {
      console.log("🌱 Seeding medical service patients...");
      const msPats = [
        { name: "Fatima Ben Ali", age: 72, condition: "Diabète", status: "En cours", startDate: "2026-03-01", nurse: "Sonia Khlifi", phone: "+216 98 111 222" },
        { name: "Mohammed Gharbi", age: 65, condition: "HTA", status: "En cours", startDate: "2026-02-15", nurse: "Karim Mrad", phone: "+216 98 222 333" },
        { name: "Sara Meddeb", age: 58, condition: "Plaies chroniques", status: "En cours", startDate: "2026-03-10", nurse: "Sonia Khlifi", phone: "+216 98 333 444" },
        { name: "Ahmed Nasser", age: 80, condition: "Insuffisance cardiaque", status: "Suspendu", startDate: "2026-01-20", nurse: "Karim Mrad", phone: "+216 98 444 555" },
        { name: "Leila Mansouri", age: 67, condition: "Rééducation post-AVC", status: "En cours", startDate: "2026-03-20", nurse: "Nour Chaabane", phone: "+216 98 555 666" },
        { name: "Riadh Karmous", age: 74, condition: "BPCO", status: "Terminé", startDate: "2026-01-10", nurse: "Karim Mrad", phone: "+216 98 666 777" },
      ];
      for (const p of msPats) await MedServicePatient.create({ _id: randomUUID(), userId: medUserId, ...p });
      console.log(`   ✅ ${msPats.length} medical service patients seeded`);
    }

    const msEqCount = await MedServiceEquipment.countDocuments();
    if (msEqCount === 0) {
      console.log("🌱 Seeding medical service equipment...");
      const msEq = [
        { name: "Tensiomètre électronique", type: "Monitoring", serial: "TEN-2024-001", status: "En utilisation", patient: "Fatima Ben Ali", maintenanceDate: "2026-06-01", location: "Domicile patient" },
        { name: "Oxymètre de pouls", type: "Monitoring", serial: "OXY-2024-002", status: "Disponible", patient: "", maintenanceDate: "2026-07-01", location: "Stock clinique" },
        { name: "Pompe à perfusion", type: "Perfusion", serial: "PMP-2024-003", status: "En utilisation", patient: "Sara Meddeb", maintenanceDate: "2026-05-15", location: "Domicile patient" },
        { name: "Glucomètre", type: "Monitoring", serial: "GLU-2024-004", status: "En utilisation", patient: "Mohammed Gharbi", maintenanceDate: "2026-08-01", location: "Domicile patient" },
        { name: "Concentrateur d'oxygène", type: "Respiratoire", serial: "O2-2024-005", status: "Maintenance", patient: "", maintenanceDate: today2, location: "Atelier maintenance" },
        { name: "Lit médicalisé", type: "Mobilier médical", serial: "LIT-2024-006", status: "En utilisation", patient: "Leila Mansouri", maintenanceDate: "2026-09-01", location: "Domicile patient" },
        { name: "Fauteuil roulant", type: "Mobilité", serial: "FR-2024-007", status: "Disponible", patient: "", maintenanceDate: "2026-10-01", location: "Stock clinique" },
      ];
      for (const e of msEq) await MedServiceEquipment.create({ _id: randomUUID(), userId: medUserId, ...e });
      console.log(`   ✅ ${msEq.length} equipment seeded`);
    }

    const msTeamCount = await MedServiceTeamMember.countDocuments();
    if (msTeamCount === 0) {
      console.log("🌱 Seeding medical service team...");
      const msTeam = [
        { name: "Sonia Khlifi", role: "Infirmière", status: "Actif", patients: 8, phone: "+216 97 111 222", email: "sonia@had.tn", specialty: "Soins infirmiers généraux" },
        { name: "Karim Mrad", role: "Infirmier", status: "Actif", patients: 7, phone: "+216 97 222 333", email: "karim@had.tn", specialty: "Soins intensifs à domicile" },
        { name: "Nour Chaabane", role: "Kinésithérapeute", status: "Actif", patients: 5, phone: "+216 97 333 444", email: "nour@had.tn", specialty: "Rééducation neurologique" },
        { name: "Amine Belkhodja", role: "Aide-soignant", status: "En pause", patients: 3, phone: "+216 97 444 555", email: "amine@had.tn", specialty: "Soins de base" },
        { name: "Dina Gharbi", role: "Infirmière", status: "Actif", patients: 6, phone: "+216 97 555 666", email: "dina@had.tn", specialty: "Gériatrie" },
        { name: "Tarek Sassi", role: "Aide-soignant", status: "Absent", patients: 2, phone: "+216 97 666 777", email: "tarek@had.tn", specialty: "Aide aux soins quotidiens" },
      ];
      for (const m of msTeam) await MedServiceTeamMember.create({ _id: randomUUID(), userId: medUserId, ...m });
      console.log(`   ✅ ${msTeam.length} team members seeded`);
    }

    const msVisitCount = await MedServiceVisit.countDocuments();
    if (msVisitCount === 0) {
      console.log("🌱 Seeding medical service visits...");
      const msVisits = [
        { patient: "Fatima Ben Ali", staff: "Sonia Khlifi", date: today2, time: "09:00", duration: "1h", status: "En cours", channel: "présentiel", notes: "Injection insuline + pansement pied" },
        { patient: "Mohammed Gharbi", staff: "Karim Mrad", date: today2, time: "10:30", duration: "45min", status: "Planifié", channel: "présentiel", notes: "Contrôle tension" },
        { patient: "Sara Meddeb", staff: "Sonia Khlifi", date: today2, time: "14:00", duration: "1h30", status: "Planifié", channel: "présentiel", notes: "Pansement plaie chronique" },
        { patient: "Leila Mansouri", staff: "Nour Chaabane", date: tomorrow2, time: "09:30", duration: "1h", status: "Planifié", channel: "présentiel", notes: "Séance kinésithérapie post-AVC" },
        { patient: "Mohammed Gharbi", staff: "Dina Gharbi", date: tomorrow2, time: "11:00", duration: "30min", status: "Planifié", channel: "présentiel", notes: "Prise de sang" },
        { patient: "Fatima Ben Ali", staff: "Karim Mrad", date: "2026-04-10", time: "09:00", duration: "1h", status: "Complété", channel: "présentiel", notes: "Soins hebdomadaires" },
        // Teleconsultation visits
        { patient: "Ahmed Nasser", staff: "Dr. Amira Mansouri", date: today2, time: "11:00", duration: "30min", status: "Planifié", channel: "téléconsultation", notes: "Suivi cardiologique" },
        { patient: "Riadh Karmous", staff: "Dr. Karim Bouazizi", date: tomorrow2, time: "15:00", duration: "20min", status: "Planifié", channel: "téléconsultation", notes: "Bilan BPCO" },
        { patient: "Sara Meddeb", staff: "Dr. Amira Mansouri", date: "2026-04-12", time: "10:00", duration: "30min", status: "Complété", channel: "téléconsultation", notes: "Résultats analyses" },
      ];
      for (const v of msVisits) await MedServiceVisit.create({ _id: randomUUID(), userId: medUserId, ...v });
      console.log(`   ✅ ${msVisits.length} visits seeded`);
    }

    const msInvCount = await MedServiceInvoice.countDocuments();
    if (msInvCount === 0) {
      console.log("🌱 Seeding medical service invoices...");
      const msInvoices = [
        { ref: "FACT-2026-001", patient: "Fatima Ben Ali", amount: 450, date: "2026-04-01", dueDate: "2026-04-15", status: "Payée", services: "Soins infirmiers × 6, Pansements × 4", paymentMethod: "Virement", paymentDate: "2026-04-10" },
        { ref: "FACT-2026-002", patient: "Mohammed Gharbi", amount: 320, date: "2026-04-03", dueDate: "2026-04-17", status: "En attente", services: "Soins infirmiers × 4, Prises de sang × 2" },
        { ref: "FACT-2026-003", patient: "Sara Meddeb", amount: 580, date: "2026-03-20", dueDate: "2026-04-03", status: "En retard", services: "Pansements plaie × 8, Kinésithérapie × 2" },
        { ref: "FACT-2026-004", patient: "Leila Mansouri", amount: 750, date: "2026-04-05", dueDate: "2026-04-19", status: "En attente", services: "Kinésithérapie × 10, Évaluation neurologique" },
        { ref: "FACT-2026-005", patient: "Riadh Karmous", amount: 280, date: "2026-03-15", dueDate: "2026-03-29", status: "Payée", services: "Soins respiratoires × 4", paymentMethod: "Espèces", paymentDate: "2026-03-28" },
      ];
      for (const inv of msInvoices) await MedServiceInvoice.create({ _id: randomUUID(), userId: medUserId, ...inv });
      console.log(`   ✅ ${msInvoices.length} invoices seeded`);
    }

    const msRxCount = await MedServicePrescription.countDocuments();
    if (msRxCount === 0) {
      console.log("🌱 Seeding medical service prescriptions...");
      const msRx = [
        { patient: "Fatima Ben Ali", doctor: "Dr. Amira Mansouri", date: "2026-04-01", medications: "Insuline Glargine 10U SC soir, Metformine 850mg 2×/j", status: "Active", notes: "Contrôle glycémie quotidien" },
        { patient: "Mohammed Gharbi", doctor: "Dr. Karim Bouazizi", date: "2026-03-25", medications: "Amlodipine 5mg 1×/j, Ramipril 5mg 1×/j", status: "Active", notes: "Surveiller tension et K+" },
        { patient: "Sara Meddeb", doctor: "Dr. Amira Mansouri", date: "2026-03-15", medications: "Amoxicilline 1g 3×/j × 7j, Pansement Urgotul quantasept", status: "Terminée", notes: "Plaie infectée — cicatrisation en cours" },
        { patient: "Leila Mansouri", doctor: "Dr. Amira Mansouri", date: "2026-04-05", medications: "Baclofène 10mg 3×/j, Kinésithérapie 3×/semaine", status: "Active", notes: "Post-AVC J+30" },
        { patient: "Ahmed Nasser", doctor: "Dr. Karim Bouazizi", date: "2026-04-08", medications: "Furosémide 40mg 1×/j, Spironolactone 25mg 1×/j", status: "En attente", notes: "En attente bio" },
      ];
      for (const rx of msRx) await MedServicePrescription.create({ _id: randomUUID(), userId: medUserId, ...rx });
      console.log(`   ✅ ${msRx.length} prescriptions seeded`);
    }

    const msSettingsCount = await MedServiceSettings.countDocuments();
    if (msSettingsCount === 0) {
      console.log("🌱 Seeding medical service settings...");
      await MedServiceSettings.create({
        _id: medUserId,
        address: "12 Rue de la Santé, Les Berges du Lac, 1053 Tunis",
        director: "Dr. Rania Cherif",
        capacity: "30",
        serviceType: "Soins infirmiers à domicile",
        notifs: { newPatient: true, vitalAlert: true, appointmentReminder: true, teamMessage: false, billing: true, maintenance: false },
      });
      console.log("   ✅ Medical service settings seeded");
    }

    const msVitalCount = await Vital.countDocuments({ role: "medical_service" });
    if (msVitalCount === 0) {
      console.log("🌱 Seeding medical service vitals...");
      const msPats = await MedServicePatient.find({ userId: medUserId }).lean();
      const vitalsData = [
        { sbp: 145, dbp: 88, hr: 76, temp: 36.8, spo2: 97, glucose: 1.42 },
        { sbp: 155, dbp: 95, hr: 82, temp: 37.0, spo2: 96, glucose: 1.18 },
        { sbp: 120, dbp: 78, hr: 68, temp: 36.6, spo2: 98, glucose: 1.05 },
      ];
      for (let i = 0; i < Math.min(msPats.length, 3); i++) {
        const p = msPats[i];
        for (const v of vitalsData) {
          await Vital.create({ _id: randomUUID(), userId: medUserId, patientId: p._id, patientName: p.name, role: "medical_service", ...v, date: today2, time: "08:00" });
        }
      }
      console.log("   ✅ Medical service vitals seeded");
    }

    // ── Paramedical Seeds ──────────────────────────────────────
    const paraUserId = "00000000-0000-0000-0000-00000000000a";

    const paraPatsCount = await ParamedPatient.countDocuments();
    if (paraPatsCount === 0) {
      console.log("🌱 Seeding paramedical patients...");
      const paraPatients = [
        { name: "Fatima Ben Ali", age: 72, condition: "Diabète type 2", status: "Actif", nextAppointment: today2, careType: "Pansement", phone: "+216 98 111 222" },
        { name: "Mohammed Gharbi", age: 65, condition: "HTA", status: "Actif", nextAppointment: today2, careType: "Injection", phone: "+216 98 222 333" },
        { name: "Karim Smaoui", age: 45, condition: "Post-opératoire genou", status: "Suivi", nextAppointment: tomorrow2, careType: "Kinésithérapie", phone: "+216 98 333 444" },
        { name: "Nida Khadija", age: 38, condition: "Grossesse à risque", status: "Actif", nextAppointment: tomorrow2, careType: "Soins infirmiers", phone: "+216 98 444 555" },
        { name: "Ali Ben Romdhane", age: 55, condition: "Insuffisance veineuse", status: "Actif", nextAppointment: null, careType: "Pansement", phone: "+216 98 555 666" },
        { name: "Sonia Trabelsi", age: 30, condition: "Rééducation dos", status: "Suivi", nextAppointment: null, careType: "Kinésithérapie", phone: "+216 98 666 777" },
        { name: "Ahmed Nasser", age: 70, condition: "AVC séquellaire", status: "Actif", nextAppointment: today2, careType: "Rééducation", phone: "+216 98 777 888" },
        { name: "Sara Meddeb", age: 29, condition: "Fracture cheville", status: "Suivi", nextAppointment: tomorrow2, careType: "Kinésithérapie", phone: "+216 98 888 999" },
        { name: "Riadh Karmous", age: 82, condition: "BPCO", status: "Clôturé", nextAppointment: null, careType: "Soins infirmiers", phone: "+216 98 999 000" },
      ];
      for (const p of paraPatients) await ParamedPatient.create({ _id: randomUUID(), userId: paraUserId, ...p });
      console.log(`   ✅ ${paraPatients.length} paramedical patients seeded`);
    }

    const paraApptCount = await ParamedAppointment.countDocuments();
    if (paraApptCount === 0) {
      console.log("🌱 Seeding paramedical appointments...");
      const paraApts = [
        { patient: "Fatima Ben Ali", type: "Pansement", date: today2, time: "09:00", location: "Domicile", status: "Confirmé", notes: "Plaie pied diabétique" },
        { patient: "Mohammed Gharbi", type: "Injection", date: today2, time: "10:30", location: "Domicile", status: "Confirmé", notes: "Injection Enoxaparine" },
        { patient: "Ahmed Nasser", type: "Rééducation", date: today2, time: "14:00", location: "Domicile", status: "En attente", notes: "Rééducation marche" },
        { patient: "Karim Smaoui", type: "Kinésithérapie", date: tomorrow2, time: "09:30", location: "Cabinet", status: "Confirmé", notes: "Séance genou post-op" },
        { patient: "Nida Khadija", type: "Soins infirmiers", date: tomorrow2, time: "11:00", location: "Domicile", status: "En attente", notes: "Surveillance TA" },
        { patient: "Sara Meddeb", type: "Kinésithérapie", date: tomorrow2, time: "15:00", location: "Cabinet", status: "En attente", notes: "Rech cheville" },
        { patient: "Ali Ben Romdhane", type: "Pansement", date: "2026-04-16", time: "10:00", location: "Domicile", status: "En attente", notes: "Compression veineuse" },
      ];
      for (const a of paraApts) await ParamedAppointment.create({ _id: randomUUID(), userId: paraUserId, ...a });
      console.log(`   ✅ ${paraApts.length} paramedical appointments seeded`);
    }

    const paraSupplyCount = await ParamedSupply.countDocuments();
    if (paraSupplyCount === 0) {
      console.log("🌱 Seeding paramedical supplies...");
      const paraSupplies = [
        { name: "Compresses stériles 10×10", category: "Soin des plaies", current: 45, max: 200, unit: "boîtes", level: "low", ordered: false },
        { name: "Bandages élastiques", category: "Soin des plaies", current: 8, max: 50, unit: "rouleaux", level: "critical", ordered: false },
        { name: "Seringues 5mL", category: "Injection", current: 120, max: 500, unit: "unités", level: "ok", ordered: false },
        { name: "Aiguilles IM 0,8×40", category: "Injection", current: 80, max: 400, unit: "unités", level: "ok", ordered: false },
        { name: "Tubulure perfusion", category: "Perfusion", current: 6, max: 30, unit: "unités", level: "critical", ordered: true },
        { name: "Gants latex M", category: "Protection", current: 3, max: 20, unit: "boîtes", level: "critical", ordered: false },
        { name: "Masques chirurgicaux", category: "Protection", current: 60, max: 200, unit: "unités", level: "ok", ordered: false },
        { name: "Alcool 70°", category: "Désinfection", current: 4, max: 15, unit: "flacons", level: "low", ordered: false },
        { name: "Bétadine", category: "Désinfection", current: 12, max: 24, unit: "flacons", level: "ok", ordered: false },
        { name: "Nébuliseur", category: "Respiratoire", current: 2, max: 5, unit: "unités", level: "low", ordered: false },
      ];
      for (const s of paraSupplies) await ParamedSupply.create({ _id: randomUUID(), userId: paraUserId, ...s });
      console.log(`   ✅ ${paraSupplies.length} supplies seeded`);
    }

    const paraSessionCount = await ParamedCareSession.countDocuments();
    if (paraSessionCount === 0) {
      console.log("🌱 Seeding paramedical care sessions...");
      const paraSessions = [
        { patient: "Fatima Ben Ali", careType: "Pansement", notes: "Pansement plaie plantaire gauche — cicatrisation en cours", photos: 2, signed: true, date: today2, time: "09:15" },
        { patient: "Mohammed Gharbi", careType: "Injection", notes: "Injection Enoxaparine 4000UI SC", photos: 0, signed: true, date: today2, time: "10:45" },
        { patient: "Ahmed Nasser", careType: "Rééducation", notes: "Exercices mobilité MI — progrès satisfaisants", photos: 1, signed: false, date: "2026-04-13", time: "14:30" },
      ];
      for (const s of paraSessions) await ParamedCareSession.create({ _id: randomUUID(), userId: paraUserId, ...s });
      console.log(`   ✅ ${paraSessions.length} care sessions seeded`);
    }

    const paraVitalCount = await Vital.countDocuments({ role: "paramedical" });
    if (paraVitalCount === 0) {
      console.log("🌱 Seeding paramedical vitals...");
      const paraPats = await ParamedPatient.find({ userId: paraUserId }).lean();
      const vitSamples = [
        { sbp: 148, dbp: 90, hr: 78, temp: 37.1, spo2: 96, glucose: 1.55 },
        { sbp: 132, dbp: 84, hr: 72, temp: 36.9, spo2: 97, glucose: 1.10 },
      ];
      for (let i = 0; i < Math.min(paraPats.length, 5); i++) {
        const p = paraPats[i];
        await Vital.create({ _id: randomUUID(), userId: paraUserId, patientId: p._id, patientName: p.name, role: "paramedical", ...vitSamples[i % 2], date: today2, time: "09:00" });
      }
      console.log("   ✅ Paramedical vitals seeded");
    }

    // ── Public Paramedical Products ──────────────────────────────
    const paraProductCount = await ParamedicalProduct.countDocuments();
    if (paraProductCount === 0) {
      console.log("🌱 Seeding public paramedical products...");
      const paraProducts = [
        { _id: randomUUID(), name: "Fauteuil roulant manuel pliant", brand: "VERMEIREN", category: "Orthopédie", price: 580, originalPrice: 720, rating: 4.8, reviews: 143, inStock: true, stockQty: 5, prescription: false, imageUrl: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800", "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800", "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800"], shortDesc: "Fauteuil léger aluminium, poids 12 kg, dossier rabattable", deliveryDays: "3–5 jours", description: "Fauteuil roulant manuel ultra-léger en aluminium anodisé.", usage: "Pour personnes à mobilité réduite, post-opératoire ou convalescence.", compatibility: "Cadre universel, largeur assise 45 cm. Capacité max 120 kg.", features: ["Poids net 12 kg", "Structure aluminium pliant", "Dossier rabattable", "Repose-pieds escamotables"] },
        { _id: randomUUID(), name: "Tensiomètre électronique bras", brand: "OMRON", category: "Maintien à domicile", price: 89, originalPrice: 110, rating: 4.9, reviews: 512, inStock: true, stockQty: 30, prescription: false, imageUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1576671081837-49000212a370?w=800"], shortDesc: "Mesure tensiométrique automatique, mémoire 60 mesures", deliveryDays: "24h", description: "Tensiomètre bras OMRON avec mémoire 60 mesures.", usage: "Mesure de la pression artérielle à domicile.", compatibility: "Brassard taille M inclus.", features: ["Mémoire 60 mesures", "Détection arythmie", "Écran large"] },
        { _id: randomUUID(), name: "Glucomètre AccuChek Active", brand: "ROCHE", category: "Diabétologie", price: 45, rating: 4.7, reviews: 328, inStock: true, stockQty: 20, prescription: false, imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800"], shortDesc: "Lecteur de glycémie rapide, résultat en 5 secondes", deliveryDays: "24h", description: "Glucomètre compact et fiable.", usage: "Auto-surveillance glycémique.", compatibility: "Bandelettes AccuChek Active.", features: ["Résultat en 5s", "Mémoire 500 mesures", "Compact"] },
        { _id: randomUUID(), name: "Déambulateur 4 roues avec siège", brand: "DRIVE MEDICAL", category: "Maintien à domicile", price: 210, rating: 4.6, reviews: 97, inStock: true, stockQty: 8, prescription: false, imageUrl: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800"], shortDesc: "Rollator léger aluminium, panier de rangement, hauteur réglable", deliveryDays: "3–5 jours", description: "Rollator robuste avec siège amovible.", usage: "Aide à la marche pour personnes âgées.", compatibility: "Hauteur réglable 80–95 cm.", features: ["Siège intégré", "Panier rabattable", "Freins à blocage"] },
        { _id: randomUUID(), name: "Collier cervical souple", brand: "THUASNE", category: "Orthopédie", price: 24, rating: 4.5, reviews: 215, inStock: true, stockQty: 50, prescription: false, imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800"], shortDesc: "Maintien cervical confort, mousse polyuréthane, taille M", deliveryDays: "24h", description: "Collier cervical en mousse polyuréthane haute densité.", usage: "Soulagement douleurs cervicales.", compatibility: "Taille M, hauteur 9 cm.", features: ["Mousse haute densité", "Couvercle amovible", "Lavable"] },
        { _id: randomUUID(), name: "Genouillère ligamentaire sport", brand: "GIBAUD", category: "Orthopédie", price: 38, originalPrice: 48, rating: 4.7, reviews: 176, inStock: true, stockQty: 25, prescription: false, imageUrl: "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1550572017-ea058ca87258?w=800"], shortDesc: "Genouillère renforcée, baleines bilatérales, taille S–XL", deliveryDays: "48h", description: "Genouillère sportive avec baleines latérales.", usage: "Stabilisation du genou après blessure.", compatibility: "Tailles S à XL.", features: ["Baleines bilatérales", "Ouverture rotulienne", "Respirant"] },
        { _id: randomUUID(), name: "Oxymètre de pouls digital", brand: "BEURER", category: "Maintien à domicile", price: 35, rating: 4.8, reviews: 389, inStock: true, stockQty: 40, prescription: false, imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800"], shortDesc: "Mesure SpO2 et fréquence cardiaque, écran LED, piles incluses", deliveryDays: "24h", description: "Oxymètre compact pour mesure SpO2.", usage: "Surveillance saturation en oxygène.", compatibility: "Tous doigts adulte.", features: ["Écran LED rotatif", "Alarme basse saturation", "Piles incluses"] },
        { _id: randomUUID(), name: "Pansements stériles complets 20 pcs", brand: "HARTMANN", category: "Soins & pansements", price: 12, rating: 4.6, reviews: 254, inStock: true, stockQty: 100, prescription: false, imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800"], shortDesc: "Pansements hypoallergéniques toutes tailles, emballage stérile", deliveryDays: "24h", description: "Pansements stériles hypoallergéniques.", usage: "Protection de plaies superficielles.", compatibility: "Peau sensible.", features: ["Hypoallergénique", "20 pièces assorties", "Emballage individuel"] },
        { _id: randomUUID(), name: "Compresses stériles non tissées 100 pcs", brand: "HARTMANN", category: "Soins & pansements", price: 8.5, rating: 4.7, reviews: 198, inStock: true, stockQty: 80, prescription: false, imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800"], shortDesc: "Compresses 10×10 cm, non pelucheuses, lot de 100", deliveryDays: "24h", description: "Compresses stériles non pelucheuses.", usage: "Soins de plaies et pansements.", compatibility: "Usage universel.", features: ["100% viscose", "Non pelucheuses", "Lot 100 pcs"] },
        { _id: randomUUID(), name: "Thermomètre digital auriculaire", brand: "BRAUN", category: "Maintien à domicile", price: 52, originalPrice: 65, rating: 4.9, reviews: 643, inStock: true, stockQty: 18, prescription: false, imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800"], shortDesc: "Mesure auriculaire en 1 seconde, 9 positions mémoire", deliveryDays: "24h", description: "Thermomètre auriculaire de précision.", usage: "Mesure rapide de la température corporelle.", compatibility: "Enfants et adultes.", features: ["Mesure en 1 seconde", "9 mesures mémoire", "Embout jetable"] },
        { _id: randomUUID(), name: "Coussin anti-escarres rond", brand: "THUASNE", category: "Maintien à domicile", price: 42, rating: 4.5, reviews: 88, inStock: true, stockQty: 12, prescription: true, imageUrl: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800"], shortDesc: "Mousse viscoélastique mémoire de forme, diamètre 40 cm", deliveryDays: "48h", description: "Coussin anti-escarres en mousse mémoire de forme.", usage: "Prévention des escarres en position assise prolongée.", compatibility: "Fauteuil roulant et chaise standard.", features: ["Mousse viscoélastique", "Housse lavable", "Ø 40 cm"] },
        { _id: randomUUID(), name: "Semelles orthopédiques sport", brand: "BAUERFEIND", category: "Orthopédie", price: 65, rating: 4.6, reviews: 134, inStock: true, stockQty: 30, prescription: false, imageUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1576671081837-49000212a370?w=800"], shortDesc: "Semelles gel sport, soutien voûte plantaire, taille 36–46", deliveryDays: "48h", description: "Semelles orthopédiques à gel pour sport.", usage: "Soutien voûte plantaire, amortissement.", compatibility: "Tailles 36 à 46.", features: ["Gel absorbant les chocs", "Soutien voûte", "Machine lavable"] },
        { _id: randomUUID(), name: "Bandelettes glycémie AccuChek ×50", brand: "ROCHE", category: "Diabétologie", price: 32, rating: 4.8, reviews: 294, inStock: true, stockQty: 45, prescription: false, imageUrl: "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1550572017-ea058ca87258?w=800"], shortDesc: "Bandelettes réactives compatibles AccuChek Active, boîte 50", deliveryDays: "24h", description: "Bandelettes réactives AccuChek Active.", usage: "Auto-surveillance glycémique.", compatibility: "AccuChek Active uniquement.", features: ["Boîte 50 bandelettes", "Résultat précis", "Compatible AccuChek Active"] },
        { _id: randomUUID(), name: "Bande de contention élastique", brand: "SIGVARIS", category: "Soins & pansements", price: 15, rating: 4.4, reviews: 162, inStock: true, stockQty: 60, prescription: false, imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800"], shortDesc: "Bande Velpeau extensible 10 cm × 4 m, lot de 2", deliveryDays: "24h", description: "Bande de contention extensible.", usage: "Contention légère, immobilisation.", compatibility: "Usage universel.", features: ["Extensible", "10 cm × 4 m", "Lot de 2"] },
        { _id: randomUUID(), name: "Tire-lait électrique double pompe", brand: "MEDELA", category: "Matériel bébé", price: 320, originalPrice: 395, rating: 4.9, reviews: 328, inStock: true, stockQty: 6, prescription: false, imageUrl: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800"], shortDesc: "Double pompe silencieuse, technologie 2-phase, mains libres", deliveryDays: "3–5 jours", description: "Tire-lait électrique double pompe de haute qualité.", usage: "Allaitement et conservation du lait maternel.", compatibility: "Biberons Medela standards.", features: ["Double pompe", "Silencieux < 45 dB", "Mains libres", "Technologie 2-phase"] },
        { _id: randomUUID(), name: "Ballon de rééducation 65 cm", brand: "GYMNIC", category: "Bien-être & rééducation", price: 28, rating: 4.7, reviews: 187, inStock: true, stockQty: 22, prescription: false, imageUrl: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800"], shortDesc: "Ballon d'exercice anti-éclatement, 65 cm, pompe incluse", deliveryDays: "48h", description: "Ballon de gym anti-éclatement.", usage: "Exercices de rééducation et renforcement.", compatibility: "Adultes et seniors.", features: ["Anti-éclatement", "65 cm", "Pompe incluse"] },
        { _id: randomUUID(), name: "Bande élastique rééducation ×1.5 m", brand: "THERA-BAND", category: "Bien-être & rééducation", price: 12, rating: 4.5, reviews: 246, inStock: true, stockQty: 55, prescription: false, imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800"], shortDesc: "Bande latex résistance légère à forte, plusieurs niveaux", deliveryDays: "24h", description: "Bande élastique de rééducation Thera-Band.", usage: "Exercices de résistance et rééducation.", compatibility: "Tous niveaux.", features: ["Latex naturel", "1.5 m", "Varios niveaux de résistance"] },
        { _id: randomUUID(), name: "Béquilles réglables aluminium (paire)", brand: "INVACARE", category: "Orthopédie", price: 75, rating: 4.4, reviews: 112, inStock: false, stockQty: 0, prescription: false, imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800"], shortDesc: "Béquilles axillaires léger aluminium, hauteur 1.10–1.50 m", deliveryDays: "7–10 jours", description: "Paire de béquilles axillaires réglables.", usage: "Aide à la marche post-opératoire.", compatibility: "Hauteur 1.10 à 1.50 m.", features: ["Aluminium léger", "Hauteur réglable", "Embouts antidérapants"] },
        { _id: randomUUID(), name: "Nébuliseur à compresseur silencieux", brand: "OMRON", category: "Maintien à domicile", price: 98, originalPrice: 125, rating: 4.8, reviews: 174, inStock: true, stockQty: 10, prescription: false, imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800"], shortDesc: "Aérosol à compresseur < 45 dB, embout buccal + masques adulte & enfant", deliveryDays: "48h", description: "Nébuliseur à compresseur silencieux OMRON.", usage: "Traitement des affections respiratoires.", compatibility: "Adultes et enfants.", features: ["< 45 dB", "Embout buccal + 2 masques", "Auto-nettoyage"] },
        { _id: randomUUID(), name: "Autopiqueur lancettes ×100", brand: "BD", category: "Diabétologie", price: 18, rating: 4.6, reviews: 211, inStock: true, stockQty: 70, prescription: false, imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80", images: ["https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800"], shortDesc: "Lancettes universelles 28G, indolores, lot de 100", deliveryDays: "24h", description: "Lancettes universelles indolores.", usage: "Prélèvement capillaire pour glycémie.", compatibility: "Autopiqueurs universels.", features: ["28G ultra-fins", "Indolores", "Lot 100 pcs"] },
      ];
      for (const p of paraProducts) await ParamedicalProduct.create(p);
      console.log(`   ✅ ${paraProducts.length} paramedical products seeded`);
    }

    // ── Public Medical Establishments ────────────────────────────
    const estabCount = await MedicalEstablishment.countDocuments();
    if (estabCount === 0) {
      console.log("🌱 Seeding public medical establishments...");
      const establishments = [
        { _id: randomUUID(), name: "Clinique Hannibal", type: "Clinique", governorate: "Tunis", city: "Carthage", address: "Route de la Marsa, Carthage, Tunis", phone: "+216 71 777 888", rating: 4.8, reviews: 312, price: 60, services: ["Cardiologie", "Chirurgie", "Obstétrique", "Réanimation", "Imagerie"], accredited: true, emergencies: true, imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&fit=crop&q=80", description: "Clinique médicale privée de référence avec un plateau technique de pointe et une équipe de 120 médecins spécialistes.", beds: 180, doctors: 120, founded: 1994 },
        { _id: randomUUID(), name: "Hôpital Aziza Othmana", type: "Hôpital", governorate: "Tunis", city: "Tunis Centre", address: "Place de la Kasbah, Tunis", phone: "+216 71 562 344", rating: 4.3, reviews: 540, price: 30, services: ["Urgences", "Médecine interne", "Pédiatrie", "Chirurgie", "Maternité"], accredited: true, emergencies: true, imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&fit=crop&q=80", description: "Grand hôpital public universitaire offrant des soins de qualité dans 15 services spécialisés. Conventions CNAM.", beds: 450, doctors: 280, founded: 1949 },
        { _id: randomUUID(), name: "Centre Médical des Berges du Lac", type: "Centre médical", governorate: "Tunis", city: "Les Berges du Lac", address: "Immeuble Médical, Les Berges du Lac 2, Tunis", phone: "+216 71 964 100", rating: 4.9, reviews: 198, price: 50, services: ["Dermatologie", "Ophtalmologie", "ORL", "Gynécologie", "Radiologie"], accredited: true, emergencies: false, imageUrl: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&fit=crop&q=80", description: "Centre multi-spécialités moderne au cœur des Berges du Lac avec IRM 3T et plateau d'imagerie complet.", beds: 0, doctors: 45, founded: 2012 },
        { _id: randomUUID(), name: "Clinique El Menzah", type: "Clinique", governorate: "Tunis", city: "Menzah", address: "Avenue Tahar Ben Ammar, El Menzah 6, Tunis", phone: "+216 71 238 900", rating: 4.6, reviews: 241, price: 55, services: ["Orthopédie", "Cardiologie", "Neurologie", "Urologie", "Chirurgie"], accredited: true, emergencies: true, imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&fit=crop&q=80", description: "Clinique pluridisciplinaire au nord de Tunis offrant chirurgie mini-invasive et soins de rééducation.", beds: 120, doctors: 80, founded: 2003 },
        { _id: randomUUID(), name: "HAD MédiHome Sfax", type: "HAD", governorate: "Sfax", city: "Sfax", address: "Rue des Palmiers, Sfax", phone: "+216 74 225 300", rating: 4.7, reviews: 89, price: 45, services: ["Hospitalisation à domicile", "Soins infirmiers", "Perfusions", "Soins palliatifs", "Rééducation"], accredited: true, emergencies: false, imageUrl: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&fit=crop&q=80", description: "Premier réseau d'hospitalisation à domicile à Sfax. Équipes soignantes 7j/7 avec tout le matériel.", beds: 0, doctors: 22, founded: 2018 },
        { _id: randomUUID(), name: "Polyclinique de Sousse", type: "Clinique", governorate: "Sousse", city: "Sousse", address: "Boulevard du 7 Novembre, Sousse", phone: "+216 73 228 600", rating: 4.5, reviews: 176, price: 45, services: ["Cardiologie", "Gastro-entérologie", "Endocrinologie", "Radiologie", "Réanimation"], accredited: true, emergencies: true, imageUrl: "https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=800&fit=crop&q=80", description: "Principale clinique privée du Sahel avec bloc opératoire de 6 salles.", beds: 200, doctors: 95, founded: 1989 },
        { _id: randomUUID(), name: "Centre Médical Nabeul", type: "Centre médical", governorate: "Nabeul", city: "Nabeul", address: "Avenue Habib Bourguiba, Nabeul", phone: "+216 72 285 700", rating: 4.4, reviews: 134, price: 40, services: ["Médecine générale", "Pédiatrie", "Gynécologie", "Dentisterie", "Radiologie"], accredited: false, emergencies: false, imageUrl: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=800&fit=crop&q=80", description: "Centre de santé accessible avec consultations spécialisées et tarifs conventionnés CNAM.", beds: 0, doctors: 18, founded: 2008 },
        { _id: randomUUID(), name: "Hôpital Farhat Hached", type: "Hôpital", governorate: "Sousse", city: "Sousse", address: "Rue Ibn El Jazzar, Sousse", phone: "+216 73 221 411", rating: 4.2, reviews: 480, price: 25, services: ["Urgences", "Neurochirurgie", "Cardiologie", "Oncologie", "Maternité"], accredited: true, emergencies: true, imageUrl: "https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=800&fit=crop&q=80", description: "Centre hospitalier universitaire régional desservant le Sahel. 800 lits, 20 services spécialisés.", beds: 800, doctors: 380, founded: 1983 },
        { _id: randomUUID(), name: "Clinique Bizerte Santé", type: "Clinique", governorate: "Bizerte", city: "Bizerte", address: "Avenue Taieb Mhiri, Bizerte", phone: "+216 72 432 100", rating: 4.6, reviews: 112, price: 50, services: ["Chirurgie", "Maternité", "Pédiatrie", "Cardiologie", "Imagerie"], accredited: true, emergencies: true, imageUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&fit=crop&q=80", description: "Principale clinique privée de la région nord, offrant maternité, chirurgie et urgences.", beds: 90, doctors: 55, founded: 2007 },
      ];
      for (const e of establishments) await MedicalEstablishment.create(e);
      console.log(`   ✅ ${establishments.length} medical establishments seeded`);
    }

    // ── Public Lab Centers ────────────────────────────────────────
    const labCenterCount = await PublicLabCenter.countDocuments();
    if (labCenterCount === 0) {
      console.log("🌱 Seeding public lab centers...");
      const labCenters = [
        { _id: randomUUID(), name: "Laboratoire Pasteur Tunis", type: "Laboratoire", governorate: "Tunis", city: "Tunis Centre", address: "Avenue de la Liberté, Tunis", phone: "+216 71 283 400", rating: 4.9, reviews: 428, cnam: true, resultDelay: "24h", exams: ["NFS", "Glycémie à jeun", "Bilan hépatique", "TSH", "CRP"], allExamTypes: ["Biologie", "Hématologie", "Endocrinologie"], priceFrom: 12, imageUrl: "https://images.unsplash.com/photo-1578496480157-697fc14d2e55?w=800&fit=crop&q=80", description: "Laboratoire de référence accrédité ISO 15189. Résultats disponibles en ligne sous 24h." },
        { _id: randomUUID(), name: "Centre d'Imagerie Ibn Sina", type: "Radiologie", governorate: "Tunis", city: "La Marsa", address: "Avenue Tahar Sfar, La Marsa, Tunis", phone: "+216 71 748 200", rating: 4.8, reviews: 317, cnam: true, resultDelay: "2–3h", exams: ["IRM 3T", "Scanner", "Échographie", "Mammographie", "Radio"], allExamTypes: ["Imagerie", "IRM", "Scanner", "Échographie"], priceFrom: 80, imageUrl: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&fit=crop&q=80", description: "Centre d'imagerie équipé d'un IRM 3 Tesla et d'un scanner 128 coupes." },
        { _id: randomUUID(), name: "BioMédical Lac", type: "Mixte", governorate: "Tunis", city: "Les Berges du Lac", address: "Immeuble Médical B1, Lac 2, Tunis", phone: "+216 71 965 300", rating: 4.7, reviews: 214, cnam: true, resultDelay: "4h", exams: ["NFS", "Bilan lipidique", "Échographie", "Radio pulmonaire", "PCR"], allExamTypes: ["Biologie", "Imagerie", "Microbiologie"], priceFrom: 15, imageUrl: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=800&fit=crop&q=80", description: "Centre médico-biologique complet aux Berges du Lac. Analyses et imagerie sous le même toit." },
        { _id: randomUUID(), name: "Labo Analyses Sfax Central", type: "Laboratoire", governorate: "Sfax", city: "Sfax", address: "Rue Habib Maazoun, Sfax", phone: "+216 74 227 100", rating: 4.6, reviews: 189, cnam: true, resultDelay: "24h", exams: ["NFS", "Urée-Créatinine", "Ionogramme", "Hémoculture", "ECBU"], allExamTypes: ["Biologie", "Microbiologie", "Hématologie"], priceFrom: 10, imageUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&fit=crop&q=80", description: "Principal laboratoire privé de Sfax. Accrédité COFRAC, résultats par email." },
        { _id: randomUUID(), name: "RadioSanté Sousse", type: "Radiologie", governorate: "Sousse", city: "Sousse", address: "Boulevard du 14 Janvier, Sousse", phone: "+216 73 232 900", rating: 4.5, reviews: 152, cnam: false, resultDelay: "3h", exams: ["IRM", "Scanner", "Ostéodensitométrie", "Échographie", "Radio"], allExamTypes: ["Imagerie", "IRM", "Scanner", "Radiographie"], priceFrom: 70, imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&fit=crop&q=80", description: "Centre de radiologie avec IRM 1.5T et scanner multi-coupes." },
        { _id: randomUUID(), name: "BioLis Nabeul", type: "Laboratoire", governorate: "Nabeul", city: "Nabeul", address: "Avenue Habib Bourguiba, Nabeul", phone: "+216 72 285 500", rating: 4.4, reviews: 97, cnam: true, resultDelay: "24–48h", exams: ["Glycémie", "Cholestérol", "NFS", "Sérologie", "Coagulation"], allExamTypes: ["Biologie", "Hématologie", "Sérologie"], priceFrom: 10, imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&fit=crop&q=80", description: "Laboratoire à Nabeul avec accueil sans rendez-vous et résultats rapides." },
        { _id: randomUUID(), name: "Centre Imagerie Monastir", type: "Mixte", governorate: "Monastir", city: "Monastir", address: "Rue Hussein Ben Ali, Monastir", phone: "+216 73 462 200", rating: 4.6, reviews: 133, cnam: true, resultDelay: "2h", exams: ["IRM", "Scanner", "Scintigraphie", "NFS", "PCR"], allExamTypes: ["Imagerie", "IRM", "Biologie", "Médecine nucléaire"], priceFrom: 25, imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&fit=crop&q=80", description: "Centre médical complet à Monastir combinant biologie et imagerie de pointe." },
        { _id: randomUUID(), name: "RadioGabès", type: "Radiologie", governorate: "Gabès", city: "Gabès", address: "Avenue Farhat Hached, Gabès", phone: "+216 75 272 800", rating: 4.3, reviews: 76, cnam: true, resultDelay: "4h", exams: ["Radio", "Échographie", "Scanner", "IRM", "Mammographie"], allExamTypes: ["Imagerie", "Scanner", "Radiographie", "Échographie"], priceFrom: 60, imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&fit=crop&q=80", description: "Premier centre de radiologie du Sud avec scanner et échographie doppler couleur." },
        { _id: randomUUID(), name: "Labo Bizerte Bio", type: "Laboratoire", governorate: "Bizerte", city: "Bizerte", address: "Avenue de la République, Bizerte", phone: "+216 72 433 600", rating: 4.5, reviews: 108, cnam: true, resultDelay: "24h", exams: ["NFS", "Bilan rénal", "Bilan thyroïdien", "ECBU", "HbA1c"], allExamTypes: ["Biologie", "Endocrinologie", "Microbiologie"], priceFrom: 10, imageUrl: "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?w=800&fit=crop&q=80", description: "Laboratoire moderne à Bizerte avec équipements automatisés et résultats en 24h." },
      ];
      for (const l of labCenters) await PublicLabCenter.create(l);
      console.log(`   ✅ ${labCenters.length} lab centers seeded`);
    }

  } catch (err) {
    console.error("❌ Seed error:", err.message);
  }
}

module.exports = seedDatabase;
