const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Appointment = require("./models/Appointment");
const Message = require("./models/Message");
const Dossier = require("./models/Dossier");
const Product = require("./models/Product");
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
    if (prodCount === 0) {
      console.log("🌱 Seeding pharmacy products...");
      const products = [
        {
          _id: "1",
          name: "Paracétamol 500mg",
          category: "Analgésique",
          price: 2.5,
          stock: 100,
          requiresPrescription: false,
        },
        {
          _id: "2",
          name: "Amoxicilline 500mg",
          category: "Antibiotique",
          price: 8.0,
          stock: 50,
          requiresPrescription: true,
        },
        {
          _id: "3",
          name: "Ibuprofène 400mg",
          category: "Anti-inflammatoire",
          price: 3.5,
          stock: 75,
          requiresPrescription: false,
        },
        {
          _id: "4",
          name: "Oméprazole 20mg",
          category: "Gastro-entérologie",
          price: 5.0,
          stock: 60,
          requiresPrescription: true,
        },
        {
          _id: "5",
          name: "Metformine 500mg",
          category: "Diabétologie",
          price: 4.0,
          stock: 80,
          requiresPrescription: true,
        },
      ];
      await Product.insertMany(products);
      console.log(`   ✅ ${products.length} products seeded`);
    }

    console.log("🌱 Seeding complete!");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  }
}

module.exports = seedDatabase;
