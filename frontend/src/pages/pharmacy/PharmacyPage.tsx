import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Search, Star, ShoppingCart, Pill, MapPin, Zap } from "lucide-react";
import { MedicineModal, type Medicine } from "@/components/MedicineModal";
import { useAuth } from "@/contexts/AuthContext";

export default function PharmacyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "delivery">(
    "price",
  );
  const [cartCount, setCartCount] = useState(0);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleOpenModal = (med: Medicine) => {
    setSelectedMedicine(med);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleAddToCart = (med: Medicine) => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    setCartCount((prev) => prev + 1);
  };

  const categories = [
    { name: "Tous", count: 245, icon: "💊" },
    { name: "Médicaments avec ordonnance", count: 87, icon: "📋" },
    { name: "Médicaments sans ordonnance", count: 120, icon: "✓" },
    { name: "Vitamines & Suppléments", count: 54, icon: "🌿" },
    { name: "Dermatologie", count: 38, icon: "🧴" },
    { name: "Grippe & Rhume", count: 32, icon: "🤧" },
  ];

  const medicines: Medicine[] = [
    // ── Original 4 with images ──────────────────────────────────
    {
      id: 1,
      name: "Paracétamol 500mg",
      form: "Comprimés - Boîte 16",
      brand: "EVOLUPHARM",
      dci: "Paracétamol",
      price: 2.0,
      rating: 4.8,
      reviews: 156,
      available: 8,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antalgique et antipyrétique",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Amoxicilline 500mg",
      form: "Gélules",
      brand: "SANDOZ",
      dci: "Amoxicilline",
      price: 9.2,
      rating: 4.6,
      reviews: 89,
      available: 5,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Antibiotique – Nécessite ordonnance",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Vitamine C 1000mg",
      form: "Comprimés effervescents",
      brand: "WASSEN",
      dci: "Acide ascorbique",
      price: 5.5,
      rating: 4.9,
      reviews: 234,
      available: 20,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Renforce l'immunité",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Ibuprofène 400mg",
      form: "Comprimés - Boîte 30",
      brand: "NUROFEN",
      dci: "Ibuprofène",
      price: 6.0,
      rating: 4.7,
      reviews: 178,
      available: 15,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Anti-inflammatoire et analgésique",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    // ── 50 new medicines ────────────────────────────────────────
    {
      id: 5,
      name: "Aspirine 500mg",
      form: "Comprimés - Boîte 20",
      brand: "BAYER",
      dci: "Ac. acétylsalicylique",
      price: 3.5,
      rating: 4.5,
      reviews: 210,
      available: 30,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antalgique, antipyrétique, antiaggégant",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 6,
      name: "Oméprazole 20mg",
      form: "Gélules gastro-résistantes",
      brand: "BIOGARAN",
      dci: "Oméprazole",
      price: 7.8,
      rating: 4.7,
      reviews: 145,
      available: 12,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Inhibiteur de la pompe à protons",
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
    {
      id: 7,
      name: "Metformine 500mg",
      form: "Comprimés pelliculés",
      brand: "TEVA",
      dci: "Metformine",
      price: 5.2,
      rating: 4.4,
      reviews: 98,
      available: 18,
      prescription: true,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Antidiabétique oral",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    },
    {
      id: 8,
      name: "Loratadine 10mg",
      form: "Comprimés - Boîte 10",
      brand: "CLARITIN",
      dci: "Loratadine",
      price: 4.9,
      rating: 4.6,
      reviews: 187,
      available: 25,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antihistaminique anti-allergique",
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
    {
      id: 9,
      name: "Amlodipine 5mg",
      form: "Comprimés",
      brand: "NORVASC",
      dci: "Amlodipine",
      price: 11.3,
      rating: 4.5,
      reviews: 76,
      available: 10,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Inhibiteur calcique antihypertenseur",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 10,
      name: "Simvastatine 20mg",
      form: "Comprimés pelliculés",
      brand: "ZOCOR",
      dci: "Simvastatine",
      price: 8.6,
      rating: 4.3,
      reviews: 112,
      available: 7,
      prescription: true,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Hypocholestérolémiant statine",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 11,
      name: "Atorvastatine 10mg",
      form: "Gélules",
      brand: "LIPITOR",
      dci: "Atorvastatine",
      price: 12.0,
      rating: 4.7,
      reviews: 203,
      available: 14,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Réduction du cholestérol LDL",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 12,
      name: "Lisinopril 10mg",
      form: "Comprimés",
      brand: "ZESTRIL",
      dci: "Lisinopril",
      price: 9.4,
      rating: 4.4,
      reviews: 88,
      available: 9,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "IEC antihypertenseur",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    {
      id: 13,
      name: "Doliprane 1000mg",
      form: "Comprimés effervescents",
      brand: "SANOFI",
      dci: "Paracétamol",
      price: 3.2,
      rating: 4.9,
      reviews: 412,
      available: 40,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Antalgique adulte fort dosage",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 14,
      name: "Amoxicilline 1g",
      form: "Comprimés - Boîte 8",
      brand: "CLAMOXYL",
      dci: "Amoxicilline",
      price: 14.5,
      rating: 4.5,
      reviews: 67,
      available: 6,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antibiotique pénicilline haut dosage",
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
    {
      id: 15,
      name: "Vitamine D3 1000 UI",
      form: "Capsules molles",
      brand: "ZYMA D",
      dci: "Cholécalciférol",
      price: 6.9,
      rating: 4.8,
      reviews: 298,
      available: 35,
      prescription: false,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Supplémentation en vitamine D",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    },
    {
      id: 16,
      name: "Magnésium B6",
      form: "Comprimés - Boîte 60",
      brand: "MAGNE B6",
      dci: "Magnésium",
      price: 8.1,
      rating: 4.7,
      reviews: 321,
      available: 22,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Complément minéral anti-stress",
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
    {
      id: 17,
      name: "Cétirizine 10mg",
      form: "Comprimés pelliculés",
      brand: "ZYRTEC",
      dci: "Cétirizine",
      price: 5.7,
      rating: 4.6,
      reviews: 176,
      available: 17,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antihistaminique 2ème génération",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 18,
      name: "Pantoprazole 40mg",
      form: "Gélules gastro-résistantes",
      brand: "PANTOLOC",
      dci: "Pantoprazole",
      price: 10.2,
      rating: 4.5,
      reviews: 93,
      available: 11,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Traitement ulcère gastrique",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 19,
      name: "Bisoprolol 5mg",
      form: "Comprimés pelliculés",
      brand: "CARDENSIEL",
      dci: "Bisoprolol",
      price: 13.8,
      rating: 4.4,
      reviews: 54,
      available: 8,
      prescription: true,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Bêta-bloquant cardiosélectif",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 20,
      name: "Fluoxétine 20mg",
      form: "Gélules",
      brand: "PROZAC",
      dci: "Fluoxétine",
      price: 16.5,
      rating: 4.3,
      reviews: 71,
      available: 4,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antidépresseur ISRS",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    {
      id: 21,
      name: "Zinc 15mg",
      form: "Comprimés à croquer",
      brand: "PHYSIOLOGICA",
      dci: "Zinc",
      price: 4.3,
      rating: 4.6,
      reviews: 189,
      available: 28,
      prescription: false,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Oligoélément immunité et peau",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 22,
      name: "Oméga-3 1000mg",
      form: "Capsules - Boîte 90",
      brand: "ISOMEGA",
      dci: "Ac. gras oméga-3",
      price: 15.9,
      rating: 4.8,
      reviews: 267,
      available: 19,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Complément cardiovasculaire",
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
    {
      id: 23,
      name: "Prednisolone 5mg",
      form: "Comprimés sécables",
      brand: "SOLUPRED",
      dci: "Prednisolone",
      price: 7.3,
      rating: 4.2,
      reviews: 62,
      available: 6,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Corticostéroïde anti-inflammatoire",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    },
    {
      id: 24,
      name: "Azithromycine 250mg",
      form: "Gélules - Boîte 6",
      brand: "ZITHROMAX",
      dci: "Azithromycine",
      price: 18.4,
      rating: 4.5,
      reviews: 83,
      available: 5,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Antibiotique macrolide",
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
    {
      id: 25,
      name: "Lévétiracétam 500mg",
      form: "Comprimés pelliculés",
      brand: "KEPPRA",
      dci: "Lévétiracétam",
      price: 22.0,
      rating: 4.3,
      reviews: 41,
      available: 3,
      prescription: true,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Antiépileptique",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 26,
      name: "Hydroxyzine 25mg",
      form: "Comprimés pelliculés",
      brand: "ATARAX",
      dci: "Hydroxyzine",
      price: 6.6,
      rating: 4.4,
      reviews: 107,
      available: 13,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Anxiolytique antihistaminique",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 27,
      name: "Acide Folique 5mg",
      form: "Comprimés",
      brand: "SPECIAFOLDINE",
      dci: "Acide folique",
      price: 3.8,
      rating: 4.7,
      reviews: 155,
      available: 24,
      prescription: false,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Vitamine B9 – grossesse",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 28,
      name: "Métoclopramide 10mg",
      form: "Comprimés",
      brand: "PRIMPERAN",
      dci: "Métoclopramide",
      price: 4.5,
      rating: 4.4,
      reviews: 96,
      available: 16,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Antiémétique prokynétique",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    {
      id: 29,
      name: "Tramadol 50mg",
      form: "Gélules - Boîte 20",
      brand: "CONTRAMAL",
      dci: "Tramadol",
      price: 11.7,
      rating: 4.1,
      reviews: 59,
      available: 4,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antalgique opioïde faible",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 30,
      name: "Spironolactone 25mg",
      form: "Comprimés sécables",
      brand: "ALDACTONE",
      dci: "Spironolactone",
      price: 9.9,
      rating: 4.3,
      reviews: 47,
      available: 7,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Diurétique antialdostérone",
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
    {
      id: 31,
      name: "Fer 50mg",
      form: "Gélules - Boîte 30",
      brand: "TARDYFERON",
      dci: "Sulfate ferreux",
      price: 5.1,
      rating: 4.6,
      reviews: 132,
      available: 21,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Traitement anémie ferriprive",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    },
    {
      id: 32,
      name: "Clopidogrel 75mg",
      form: "Comprimés pelliculés",
      brand: "PLAVIX",
      dci: "Clopidogrel",
      price: 17.2,
      rating: 4.4,
      reviews: 68,
      available: 9,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antiagrégant plaquettaire",
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
    {
      id: 33,
      name: "Fluconazole 150mg",
      form: "Gélule unique",
      brand: "TRIFLUCAN",
      dci: "Fluconazole",
      price: 8.3,
      rating: 4.6,
      reviews: 114,
      available: 15,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Antifongique candidose",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 34,
      name: "Fosfomycine 3g",
      form: "Sachet poudre",
      brand: "MONURIL",
      dci: "Fosfomycine",
      price: 6.7,
      rating: 4.7,
      reviews: 201,
      available: 20,
      prescription: true,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Antibiotique cystite aiguë",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 35,
      name: "Nifédipine 10mg",
      form: "Capsules",
      brand: "ADALATE",
      dci: "Nifédipine",
      price: 14.1,
      rating: 4.2,
      reviews: 38,
      available: 5,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Inhibiteur calcique vasculaire",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 36,
      name: "Dompéridone 10mg",
      form: "Comprimés pelliculés",
      brand: "MOTILIUM",
      dci: "Dompéridone",
      price: 5.4,
      rating: 4.5,
      reviews: 128,
      available: 18,
      prescription: false,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Prokinétique antinaupathique",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    {
      id: 37,
      name: "Zolpidem 10mg",
      form: "Comprimés pelliculés",
      brand: "STILNOX",
      dci: "Zolpidem",
      price: 7.0,
      rating: 4.1,
      reviews: 85,
      available: 6,
      prescription: true,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Hypnotique troubles du sommeil",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 38,
      name: "Ciprofloxacine 500mg",
      form: "Comprimés pelliculés",
      brand: "CIFLOX",
      dci: "Ciprofloxacine",
      price: 13.6,
      rating: 4.5,
      reviews: 91,
      available: 8,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antibiotique fluoroquinolone",
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
    {
      id: 39,
      name: "Acyclovir 200mg",
      form: "Comprimés - Boîte 25",
      brand: "ZOVIRAX",
      dci: "Aciclovir",
      price: 10.8,
      rating: 4.6,
      reviews: 109,
      available: 13,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Antiviral herpès",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    },
    {
      id: 40,
      name: "Probiotiques Équilibre",
      form: "Gélules - Boîte 30",
      brand: "LACTIBIANE",
      dci: "Lactobacillus",
      price: 18.9,
      rating: 4.8,
      reviews: 243,
      available: 26,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Flore intestinale et digestion",
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
    {
      id: 41,
      name: "Diclofénac 50mg",
      form: "Comprimés gastro-résistants",
      brand: "VOLTARENE",
      dci: "Diclofénac",
      price: 8.9,
      rating: 4.6,
      reviews: 167,
      available: 14,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "AINS douleurs articulaires",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 42,
      name: "Naproxène 250mg",
      form: "Comprimés entéro-résistants",
      brand: "APRANAX",
      dci: "Naproxène",
      price: 7.4,
      rating: 4.4,
      reviews: 88,
      available: 10,
      prescription: false,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Anti-inflammatoire non stéroïdien",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 43,
      name: "Kétoprofène Gel 2.5%",
      form: "Gel - Tube 60g",
      brand: "KETUM",
      dci: "Kétoprofène",
      price: 6.2,
      rating: 4.5,
      reviews: 122,
      available: 19,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "AINS usage topique local",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 44,
      name: "Xylométazoline 0.1%",
      form: "Solution nasale - Spray",
      brand: "OTRIVINE",
      dci: "Xylométazoline",
      price: 4.1,
      rating: 4.7,
      reviews: 295,
      available: 33,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Décongestionnant nasal rhinite",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    {
      id: 45,
      name: "Sérum Physiologique",
      form: "Unidoses - Boîte 20",
      brand: "GIFRER",
      dci: "NaCl 0.9%",
      price: 3.6,
      rating: 4.9,
      reviews: 387,
      available: 45,
      prescription: false,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Lavage nasal et oculaire",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 46,
      name: "Sirop Toux Sèche",
      form: "Sirop - Flacon 150ml",
      brand: "TOPLEXIL",
      dci: "Oxomémazine",
      price: 7.8,
      rating: 4.5,
      reviews: 143,
      available: 12,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Antitussif central adulte",
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
    {
      id: 47,
      name: "Sirop Toux Grasse",
      form: "Sirop - Flacon 200ml",
      brand: "MUCOMYST",
      dci: "Acétylcystéine",
      price: 6.5,
      rating: 4.4,
      reviews: 118,
      available: 16,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Mucolytique expectorant",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    },
    {
      id: 48,
      name: "Charbon Actif 260mg",
      form: "Gélules - Boîte 32",
      brand: "CARBOLEVURE",
      dci: "Charbon végétal",
      price: 5.0,
      rating: 4.5,
      reviews: 162,
      available: 23,
      prescription: false,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Ballonnements troubles digestifs",
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
    {
      id: 49,
      name: "Bétaméthasone 0.05%",
      form: "Crème - Tube 30g",
      brand: "DIPROSONE",
      dci: "Bétaméthasone",
      price: 8.7,
      rating: 4.3,
      reviews: 79,
      available: 8,
      prescription: true,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Corticostéroïde cutané dermatologie",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 50,
      name: "Vitamine B12 1000µg",
      form: "Ampoules buvables x10",
      brand: "DODEX",
      dci: "Cyanocobalamine",
      price: 9.3,
      rating: 4.7,
      reviews: 194,
      available: 20,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Carence B12 – fatigue",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 51,
      name: "Furosémide 40mg",
      form: "Comprimés sécables",
      brand: "LASILIX",
      dci: "Furosémide",
      price: 4.8,
      rating: 4.2,
      reviews: 52,
      available: 6,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Diurétique de l'anse",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 52,
      name: "Céfixime 200mg",
      form: "Gélules - Boîte 6",
      brand: "OROKEN",
      dci: "Céfixime",
      price: 16.0,
      rating: 4.6,
      reviews: 103,
      available: 9,
      prescription: true,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Antibiotique céphalosporine",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    {
      id: 53,
      name: "Doxycycline 100mg",
      form: "Comprimés - Boîte 10",
      brand: "TOLEXINE",
      dci: "Doxycycline",
      price: 10.4,
      rating: 4.4,
      reviews: 77,
      available: 11,
      prescription: true,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antibiotique tétracycline",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 54,
      name: "Propranolol 40mg",
      form: "Comprimés sécables",
      brand: "AVLOCARDYL",
      dci: "Propranolol",
      price: 7.6,
      rating: 4.3,
      reviews: 64,
      available: 10,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Bêta-bloquant non sélectif",
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
  ];

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dci.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" ||
      (selectedCategory === "Médicaments avec ordonnance" &&
        med.prescription) ||
      (selectedCategory === "Médicaments sans ordonnance" && !med.prescription);
    const matchesPrice =
      med.price >= priceRange[0] && med.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Pharmacie en Ligne</h1>
              <p className="text-lg opacity-90">
                Trouvez vos médicaments et faites-vous livrer rapidement
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom, principe actif, symptôme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Quick Links */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/pharmacy/prescriptions"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                Mes ordonnances
              </Link>
              <Link
                to="/pharmacy/chat"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                Chat pharmacien
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories & Filters */}
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Pill size={18} /> Catégories
                </h3>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`block w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === cat.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {cat.icon} {cat.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({cat.count})
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground">Prix</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Jusqu'à {priceRange[1]} DT
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "price" | "rating" | "delivery")
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="price">Prix (croissant)</option>
                  <option value="rating">Note (décroissant)</option>
                  <option value="delivery">Livraison la plus rapide</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {filteredMedicines.length === 0 ? (
                <div className="text-center py-12">
                  <Pill
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground opacity-50"
                  />
                  <p className="text-muted-foreground">
                    Aucun médicament trouvé
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredMedicines.map((med) => {
                    return (
                      <div
                        key={med.id}
                        onClick={() => handleOpenModal(med)}
                        className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
                      >
                        {/* Image Area */}
                        <div
                          className={`relative h-40 flex items-center justify-center shrink-0 ${
                            med.prescription
                              ? "bg-gradient-to-br from-orange-50 to-red-100"
                              : "bg-gradient-to-br from-blue-50 to-indigo-100"
                          }`}
                        >
                          {med.imageUrl ? (
                            <img
                              src={med.imageUrl}
                              alt={med.name}
                              className="h-full w-full object-contain p-4"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                              <Pill
                                size={28}
                                className={
                                  med.prescription
                                    ? "text-orange-500"
                                    : "text-primary"
                                }
                              />
                            </div>
                          )}
                          {/* Status Badge */}
                          <div className="absolute top-2.5 left-2.5">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                med.prescription
                                  ? "bg-orange-500 text-white"
                                  : "bg-green-500 text-white"
                              }`}
                            >
                              {med.prescription ? "📋 Ordon." : "✓ Libre"}
                            </span>
                          </div>
                          {/* Stock Badge */}
                          <div className="absolute bottom-2.5 right-2.5">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                med.available > 10
                                  ? "bg-green-100 text-green-700"
                                  : med.available > 3
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {med.available > 0
                                ? `${med.available} en stock`
                                : "Rupture"}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 space-y-2.5 flex flex-col flex-1">
                          {/* Title & Brand */}
                          <div>
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm leading-tight line-clamp-2">
                              {med.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {med.form}
                            </p>
                            <span className="inline-block text-xs font-medium bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded mt-1">
                              {med.brand}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground line-clamp-1 italic flex-1">
                            {med.description}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={11}
                                  className={
                                    i < Math.floor(med.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-foreground">
                              {med.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({med.reviews})
                            </span>
                          </div>

                          {/* Delivery & Distance */}
                          <div className="flex items-center gap-1.5">
                            <Zap
                              size={11}
                              className="text-green-500 shrink-0"
                            />
                            <span className="text-xs text-muted-foreground">
                              Livraison en {med.delivery}
                            </span>
                            <span className="ml-auto flex items-center gap-0.5 text-xs text-muted-foreground shrink-0">
                              <MapPin size={11} className="text-primary" />
                              {med.distance} km
                            </span>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                            <div>
                              <span className="text-lg font-bold text-primary">
                                {med.price} DT
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">
                                TTC
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isAuthenticated) {
                                  navigate("/register");
                                } else {
                                  setCartCount((prev) => prev + 1);
                                }
                              }}
                              className="flex items-center gap-1 bg-primary text-primary-foreground px-2.5 py-1.5 rounded-lg hover:bg-primary/90 active:scale-95 transition-all text-xs font-medium"
                            >
                              <ShoppingCart size={13} />
                              Ajouter
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MedicineModal
        medicine={selectedMedicine}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}
