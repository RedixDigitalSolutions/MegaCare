import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Eye,
  Activity,
  Shield,
  X,
  Mail,
  ArrowLeft,
  Upload,
  FileText,
  Award,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Exam {
  name: string;
  category: string;
  price: number; // TND
  duration: string; // e.g. "15 min"
  preparation?: string;
}

interface LabCenter {
  id: string;
  name: string;
  type: "Laboratoire" | "Radiologie" | "Mixte";
  governorate: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  rating: number;
  reviews: number;
  cnam: boolean;
  resultDelay: string;
  exams: string[];
  allExamTypes: string[];
  priceFrom: number;
  imageUrl: string;
  gallery?: string[];
  description: string;
  open24h?: boolean;
  accreditations?: string[];
  equipment?: string[];
  schedule?: { day: string; hours: string }[];
  team?: { name: string; specialty: string }[];
  patientReviews?: {
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
  examCatalog?: Exam[];
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const labs: LabCenter[] = []; /* MOCK DATA REMOVED — fetched from API
[
  {
    id: "1",
    name: "Laboratoire Pasteur Tunis",
    type: "Laboratoire",
    governorate: "Tunis",
    city: "Tunis Centre",
    address: "Avenue de la Liberté, Tunis",
    phone: "+216 71 283 400",
    email: "contact@labo-pasteur.tn",
    rating: 4.9,
    reviews: 428,
    cnam: true,
    resultDelay: "24h",
    exams: ["NFS", "Glycémie à jeun", "Bilan hépatique", "TSH", "CRP"],
    allExamTypes: ["Biologie", "Hématologie", "Endocrinologie"],
    priceFrom: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1578496480157-697fc14d2e55?w=1200&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&fit=crop&q=80",
    ],
    description:
      "Laboratoire de biologie médicale de référence au cœur de Tunis, accrédité ISO 15189 depuis 2010. Notre équipe de biologistes expérimentés traite plus de 500 prélèvements par jour avec des automates de dernière génération. Les résultats sont disponibles en ligne sous 24h via votre espace patient sécurisé.",
    accreditations: ["ISO 15189:2022", "Accrédité COFRAC", "Conventionné CNAM"],
    equipment: [
      "Automate Roche Cobas",
      "Cytométrie en flux",
      "PCR temps réel",
      "Électrophorèse",
    ],
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h00 – 18h00" },
      { day: "Samedi", hours: "07h30 – 13h00" },
      { day: "Dimanche", hours: "08h00 – 11h00" },
    ],
    team: [
      { name: "Dr. Leila Mansouri", specialty: "Biologiste médicale" },
      { name: "Dr. Karim Ben Ali", specialty: "Hématologue biologique" },
      { name: "Dr. Sonia Trabelsi", specialty: "Biochimiste clinique" },
    ],
    patientReviews: [
      {
        author: "Mme. Khadija B.",
        rating: 5,
        comment:
          "Accueil excellent, résultats reçus par email en moins de 24h. Je recommande vivement.",
        date: "15 mars 2026",
      },
      {
        author: "M. Youssef T.",
        rating: 5,
        comment:
          "Personnel très professionnel. Prélèvement rapide et sans douleur.",
        date: "02 mars 2026",
      },
      {
        author: "Mme. Fatma A.",
        rating: 4,
        comment: "Très bon labo, légère attente mais résultats impeccables.",
        date: "18 fév. 2026",
      },
    ],
    examCatalog: [
      {
        name: "NFS (Numération Formule Sanguine)",
        category: "Hématologie",
        price: 12,
        duration: "5 min",
        preparation: "Aucune préparation requise",
      },
      {
        name: "Glycémie à jeun",
        category: "Biochimie",
        price: 8,
        duration: "5 min",
        preparation: "Jeûn de 8 heures",
      },
      {
        name: "Bilan lipidique complet",
        category: "Biochimie",
        price: 25,
        duration: "5 min",
        preparation: "Jeûn de 12 heures",
      },
      {
        name: "TSH (Thyroïde)",
        category: "Endocrinologie",
        price: 18,
        duration: "5 min",
      },
      {
        name: "CRP (Protéine C-Réactive)",
        category: "Immunologie",
        price: 15,
        duration: "5 min",
      },
      {
        name: "ECBU (Analyse d'urine)",
        category: "Microbiologie",
        price: 20,
        duration: "5 min",
        preparation: "Prélèvement mi-jet",
      },
      {
        name: "HbA1c (Hémoglobine glyquée)",
        category: "Endocrinologie",
        price: 22,
        duration: "5 min",
      },
      {
        name: "Bilan hépatique (GOT/GPT/GGT)",
        category: "Biochimie",
        price: 30,
        duration: "5 min",
      },
    ],
  },
  {
    id: "2",
    name: "Centre d'Imagerie Ibn Sina",
    type: "Radiologie",
    governorate: "Tunis",
    city: "La Marsa",
    address: "Avenue Tahar Sfar, La Marsa, Tunis",
    phone: "+216 71 748 200",
    email: "rdv@ibnsina-imagerie.tn",
    rating: 4.8,
    reviews: 317,
    cnam: true,
    resultDelay: "2–3h",
    exams: ["IRM 3T", "Scanner", "Échographie", "Mammographie", "Radio"],
    allExamTypes: ["Imagerie", "IRM", "Scanner", "Échographie"],
    priceFrom: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=1200&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&fit=crop&q=80",
    ],
    description:
      "Centre d'imagerie médicale de référence équipé de l'IRM 3 Tesla dernière génération (Siemens MAGNETOM Vida) et d'un scanner 128 coupes. Nos radiologues délivrent des comptes-rendus signés dans un délai de 2 à 3 heures, accessibles en ligne.",
    accreditations: ["Certifié ISO 9001", "Conventionné CNAM", "Membre SFNR"],
    equipment: [
      "IRM 3T Siemens MAGNETOM Vida",
      "Scanner 128 coupes GE",
      "Mammographe numérique Hologic",
      "Échographe 4D Samsung",
    ],
    schedule: [
      { day: "Lundi – Vendredi", hours: "08h00 – 19h00" },
      { day: "Samedi", hours: "08h30 – 14h00" },
      { day: "Dimanche", hours: "Fermé (urgences sur appel)" },
    ],
    team: [
      {
        name: "Dr. Ahmed Baccouche",
        specialty: "Radiologue – Neuroradiologie",
      },
      {
        name: "Dr. Ines Chaouachi",
        specialty: "Radiologue – Imagerie ostéo-articulaire",
      },
    ],
    patientReviews: [
      {
        author: "M. Tarek M.",
        rating: 5,
        comment:
          "Équipement ultra-moderne et compte-rendu très détaillé reçu en 2h. Bravo à l'équipe.",
        date: "20 mars 2026",
      },
      {
        author: "Mme. Rania S.",
        rating: 4,
        comment:
          "Très bon centre, j'ai attendu 30 min mais l'examen s'est très bien passé.",
        date: "10 mars 2026",
      },
    ],
    examCatalog: [
      {
        name: "IRM Cérébrale",
        category: "IRM",
        price: 320,
        duration: "45 min",
        preparation: "Retirer les objets métalliques",
      },
      { name: "IRM Lombaire", category: "IRM", price: 280, duration: "35 min" },
      {
        name: "Scanner Thoracique",
        category: "Scanner",
        price: 220,
        duration: "20 min",
        preparation: "Produit de contraste possible",
      },
      {
        name: "Échographie Abdominale",
        category: "Échographie",
        price: 80,
        duration: "20 min",
        preparation: "Jeûn de 6 heures",
      },
      {
        name: "Mammographie Numérique",
        category: "Mammographie",
        price: 120,
        duration: "15 min",
      },
      {
        name: "Radiographie Thoracique",
        category: "Radiographie",
        price: 40,
        duration: "10 min",
      },
    ],
  },
  {
    id: "3",
    name: "BioMédical Lac",
    type: "Mixte",
    governorate: "Tunis",
    city: "Les Berges du Lac",
    address: "Immeuble Médical B1, Lac 2, Tunis",
    phone: "+216 71 965 300",
    email: "info@biomedical-lac.tn",
    rating: 4.7,
    reviews: 214,
    cnam: true,
    resultDelay: "4h",
    exams: ["NFS", "Bilan lipidique", "Échographie", "Radio pulmonaire", "PCR"],
    allExamTypes: ["Biologie", "Imagerie", "Microbiologie"],
    priceFrom: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=1200&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578496480157-697fc14d2e55?w=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&fit=crop&q=80",
    ],
    description:
      "Centre médico-biologique complet aux Berges du Lac. Analyses biologiques et imagerie médicale sous le même toit pour une prise en charge intégrée et rapide.",
    accreditations: ["Conventionné CNAM", "Agréé Ministère de la Santé"],
    equipment: [
      "Automate biologique",
      "Échographe couleur",
      "Radiologie numérique",
    ],
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h30 – 17h30" },
      { day: "Samedi", hours: "08h00 – 13h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [
      { name: "Dr. Salma Karray", specialty: "Biologiste" },
      { name: "Dr. Nizar Ferjani", specialty: "Radiologue" },
    ],
    patientReviews: [
      {
        author: "M. Slim B.",
        rating: 5,
        comment:
          "Très pratique d'avoir analyses et imagerie au même endroit. Service rapide.",
        date: "5 avr. 2026",
      },
    ],
    examCatalog: [
      { name: "NFS", category: "Hématologie", price: 12, duration: "5 min" },
      {
        name: "Bilan lipidique",
        category: "Biochimie",
        price: 25,
        duration: "5 min",
        preparation: "Jeûn de 12h",
      },
      {
        name: "PCR COVID/Grippe",
        category: "Microbiologie",
        price: 40,
        duration: "10 min",
      },
      {
        name: "Échographie Pelvienne",
        category: "Échographie",
        price: 90,
        duration: "20 min",
      },
      {
        name: "Radio Pulmonaire",
        category: "Radiographie",
        price: 40,
        duration: "10 min",
      },
    ],
  },
  {
    id: "4",
    name: "Labo Analyses Sfax Central",
    type: "Laboratoire",
    governorate: "Sfax",
    city: "Sfax",
    address: "Rue Habib Maazoun, Sfax",
    phone: "+216 74 227 100",
    email: "sfax@laboscentral.tn",
    rating: 4.6,
    reviews: 189,
    cnam: true,
    resultDelay: "24h",
    exams: ["NFS", "Urée-Créatinine", "Ionogramme", "Hémoculture", "ECBU"],
    allExamTypes: ["Biologie", "Microbiologie", "Hématologie"],
    priceFrom: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&fit=crop&q=80",
    gallery: [],
    description:
      "Principal laboratoire privé de Sfax. Accrédité COFRAC, résultats disponibles par email et sur l'application sous 24h.",
    accreditations: ["Accrédité COFRAC", "Conventionné CNAM"],
    equipment: [
      "Automate Siemens ADVIA",
      "Coagulomètre",
      "Analyseur de gaz du sang",
    ],
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h00 – 17h00" },
      { day: "Samedi", hours: "07h30 – 12h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [{ name: "Dr. Hamdi Dridi", specialty: "Biologiste médical" }],
    patientReviews: [
      {
        author: "Mme. Najoua C.",
        rating: 5,
        comment: "Équipe très sympa, résultats clairs et rapides.",
        date: "12 mars 2026",
      },
      {
        author: "M. Fares B.",
        rating: 4,
        comment: "Bon labo, prix raisonnables.",
        date: "1 mars 2026",
      },
    ],
    examCatalog: [
      { name: "NFS", category: "Hématologie", price: 10, duration: "5 min" },
      {
        name: "Urée-Créatinine",
        category: "Biochimie",
        price: 18,
        duration: "5 min",
        preparation: "Jeûn de 8h",
      },
      {
        name: "Ionogramme sanguin",
        category: "Biochimie",
        price: 22,
        duration: "5 min",
      },
      { name: "ECBU", category: "Microbiologie", price: 20, duration: "5 min" },
      {
        name: "Hémoculture",
        category: "Microbiologie",
        price: 35,
        duration: "10 min",
      },
    ],
  },
  {
    id: "5",
    name: "RadioSanté Sousse",
    type: "Radiologie",
    governorate: "Sousse",
    city: "Sousse",
    address: "Boulevard du 14 Janvier, Sousse",
    phone: "+216 73 232 900",
    rating: 4.5,
    reviews: 152,
    cnam: false,
    resultDelay: "3h",
    exams: ["IRM", "Scanner", "Ostéodensitométrie", "Échographie", "Radio"],
    allExamTypes: ["Imagerie", "IRM", "Scanner", "Radiographie"],
    priceFrom: 70,
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&fit=crop&q=80",
    gallery: [],
    description:
      "Centre de radiologie avec IRM 1.5T, scanner multi-coupes et système de téléradiologie pour la région du Sahel.",
    accreditations: ["Agréé Ministère de la Santé"],
    equipment: [
      "IRM 1.5T Philips",
      "Scanner multi-coupes",
      "Ostéodensitomètre",
    ],
    schedule: [
      { day: "Lundi – Vendredi", hours: "08h00 – 18h00" },
      { day: "Samedi", hours: "09h00 – 14h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [{ name: "Dr. Mouna Gharbi", specialty: "Radiologue" }],
    patientReviews: [
      {
        author: "M. Bilel K.",
        rating: 5,
        comment: "Très bon centre, compte-rendu clair et remis rapidement.",
        date: "8 avril 2026",
      },
    ],
    examCatalog: [
      { name: "IRM Genoux", category: "IRM", price: 260, duration: "40 min" },
      {
        name: "Scanner Abdominal",
        category: "Scanner",
        price: 200,
        duration: "20 min",
      },
      {
        name: "Ostéodensitométrie",
        category: "Imagerie",
        price: 150,
        duration: "20 min",
      },
      {
        name: "Échographie Doppler",
        category: "Échographie",
        price: 100,
        duration: "25 min",
      },
      {
        name: "Radio Cheville",
        category: "Radiographie",
        price: 40,
        duration: "10 min",
      },
    ],
  },
  {
    id: "6",
    name: "BioLis Nabeul",
    type: "Laboratoire",
    governorate: "Nabeul",
    city: "Nabeul",
    address: "Avenue Habib Bourguiba, Nabeul",
    phone: "+216 72 285 500",
    email: "contact@biolis-nabeul.tn",
    rating: 4.4,
    reviews: 97,
    cnam: true,
    resultDelay: "24–48h",
    exams: ["Glycémie", "Cholestérol", "NFS", "Sérologie", "Coagulation"],
    allExamTypes: ["Biologie", "Hématologie", "Sérologie"],
    priceFrom: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=1200&fit=crop&q=80",
    gallery: [],
    description:
      "Laboratoire chaleureux et réactif à Nabeul, avec accueil sans rendez-vous et résultats rapides.",
    accreditations: ["Conventionné CNAM", "Agréé Ministère de la Santé"],
    equipment: ["Automate biochimie", "Analyseur hématologique"],
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h00 – 16h00" },
      { day: "Samedi", hours: "07h30 – 12h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [{ name: "Dr. Olfa Hamdi", specialty: "Biologiste médicale" }],
    patientReviews: [
      {
        author: "Mme. Rim G.",
        rating: 4,
        comment: "Très bien pour le quotidien, personnel aimable.",
        date: "22 mars 2026",
      },
    ],
    examCatalog: [
      {
        name: "Glycémie",
        category: "Biochimie",
        price: 8,
        duration: "5 min",
        preparation: "Jeûn de 8h",
      },
      {
        name: "Cholestérol total + HDL + LDL",
        category: "Biochimie",
        price: 20,
        duration: "5 min",
        preparation: "Jeûn de 12h",
      },
      { name: "NFS", category: "Hématologie", price: 12, duration: "5 min" },
      {
        name: "Sérologie HBS Ag",
        category: "Sérologie",
        price: 25,
        duration: "10 min",
      },
      {
        name: "TP/INR (Coagulation)",
        category: "Hématologie",
        price: 15,
        duration: "5 min",
      },
    ],
  },
  {
    id: "7",
    name: "Centre Imagerie Monastir",
    type: "Mixte",
    governorate: "Monastir",
    city: "Monastir",
    address: "Rue Hussein Ben Ali, Monastir",
    phone: "+216 73 462 200",
    email: "info@imagerie-monastir.tn",
    rating: 4.6,
    reviews: 133,
    cnam: true,
    resultDelay: "2h",
    exams: ["IRM", "Scanner", "Scintigraphie", "NFS", "PCR"],
    allExamTypes: ["Imagerie", "IRM", "Biologie", "Médecine nucléaire"],
    priceFrom: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=1200&fit=crop&q=80",
    gallery: [],
    description:
      "Centre médical complet à Monastir combinant biologie médicale et imagerie de pointe, incluant médecine nucléaire.",
    accreditations: ["Conventionné CNAM", "Certifié médecine nucléaire"],
    equipment: ["IRM 1.5T", "Scanner", "Scintigraphe SPECT/CT"],
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h30 – 18h00" },
      { day: "Samedi", hours: "08h00 – 13h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [
      { name: "Dr. Walid Keskes", specialty: "Radiologue" },
      { name: "Dr. Nadia Farhat", specialty: "Médecin nucléaire" },
    ],
    patientReviews: [
      {
        author: "M. Omar N.",
        rating: 5,
        comment: "Excellent centre, très complet.",
        date: "3 avr. 2026",
      },
    ],
    examCatalog: [
      { name: "IRM Épaule", category: "IRM", price: 270, duration: "35 min" },
      {
        name: "Scanner Crânien",
        category: "Scanner",
        price: 200,
        duration: "15 min",
      },
      {
        name: "Scintigraphie osseuse",
        category: "Médecine nucléaire",
        price: 400,
        duration: "3h",
      },
      {
        name: "NFS + VS",
        category: "Hématologie",
        price: 15,
        duration: "5 min",
      },
      { name: "PCR", category: "Microbiologie", price: 40, duration: "10 min" },
    ],
  },
  {
    id: "8",
    name: "RadioGabès",
    type: "Radiologie",
    governorate: "Gabès",
    city: "Gabès",
    address: "Avenue Farhat Hached, Gabès",
    phone: "+216 75 272 800",
    rating: 4.3,
    reviews: 76,
    cnam: true,
    resultDelay: "4h",
    exams: ["Radio", "Échographie", "Scanner", "IRM", "Mammographie"],
    allExamTypes: ["Imagerie", "Scanner", "Radiographie", "Échographie"],
    priceFrom: 60,
    imageUrl:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&fit=crop&q=80",
    gallery: [],
    description:
      "Premier centre de radiologie de la région Sud avec scanner et échographie doppler couleur.",
    accreditations: ["Conventionné CNAM"],
    equipment: ["Scanner GE", "Échographe doppler", "Radiologie numérique"],
    schedule: [
      { day: "Lundi – Vendredi", hours: "08h00 – 17h00" },
      { day: "Samedi", hours: "08h30 – 13h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [{ name: "Dr. Sami Loukil", specialty: "Radiologue" }],
    patientReviews: [
      {
        author: "M. Amine R.",
        rating: 4,
        comment: "Bon service dans une région où c'est rare.",
        date: "15 mars 2026",
      },
    ],
    examCatalog: [
      {
        name: "Radio Rachis",
        category: "Radiographie",
        price: 40,
        duration: "10 min",
      },
      {
        name: "Échographie Abdominale",
        category: "Échographie",
        price: 80,
        duration: "20 min",
      },
      {
        name: "Scanner Abdomino-Pelvien",
        category: "Scanner",
        price: 210,
        duration: "25 min",
      },
      { name: "IRM Genou", category: "IRM", price: 260, duration: "40 min" },
      {
        name: "Mammographie",
        category: "Mammographie",
        price: 110,
        duration: "15 min",
      },
    ],
  },
  {
    id: "9",
    name: "Labo Bizerte Bio",
    type: "Laboratoire",
    governorate: "Bizerte",
    city: "Bizerte",
    address: "Avenue de la République, Bizerte",
    phone: "+216 72 433 600",
    email: "contact@bizerte-bio.tn",
    rating: 4.5,
    reviews: 108,
    cnam: true,
    resultDelay: "24h",
    exams: ["NFS", "Bilan rénal", "Bilan thyroïdien", "ECBU", "HbA1c"],
    allExamTypes: ["Biologie", "Endocrinologie", "Microbiologie"],
    priceFrom: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?w=1200&fit=crop&q=80",
    gallery: [],
    description:
      "Laboratoire moderne à Bizerte avec équipements automatisés et résultats disponibles en 24h par email.",
    accreditations: ["Conventionné CNAM", "Agréé Ministère de la Santé"],
    equipment: ["Automate biochimie Beckman", "Analyseur thyroïdien"],
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h00 – 17h00" },
      { day: "Samedi", hours: "07h30 – 12h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [{ name: "Dr. Souhaib Bejaoui", specialty: "Biologiste médical" }],
    patientReviews: [
      {
        author: "Mme. Leila M.",
        rating: 5,
        comment: "Simple, rapide et professionnel.",
        date: "28 mars 2026",
      },
    ],
    examCatalog: [
      { name: "NFS", category: "Hématologie", price: 10, duration: "5 min" },
      {
        name: "Bilan rénal (urée + créat)",
        category: "Biochimie",
        price: 18,
        duration: "5 min",
      },
      {
        name: "TSH + T3 + T4",
        category: "Endocrinologie",
        price: 35,
        duration: "5 min",
      },
      { name: "ECBU", category: "Microbiologie", price: 20, duration: "5 min" },
      {
        name: "HbA1c",
        category: "Endocrinologie",
        price: 22,
        duration: "5 min",
      },
    ],
  },
]*/

// ─── Helpers ──────────────────────────────────────────────────────────────────
const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_LABELS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
  "Jul",
  "Aoû",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

const typeColors: Record<string, string> = {
  Laboratoire: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Radiologie: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  Mixte: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
};

function generateSlots(id: string) {
  const allSlots = [
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];
  const seed = parseInt(id, 10) || 1;
  return Array.from({ length: 7 }, (_, d) => {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const slots = allSlots.filter((_, i) => (i + d + seed) % 3 !== 0);
    return { date, slots };
  });
}

// ─── Ordonnance Upload Widget ─────────────────────────────────────────────────
function OrdonnanceWidget({ lab }: { lab: LabCenter }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);

  const handleSend = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setStep(3);
  };

  if (step === 3) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="text-emerald-500" size={26} />
        </div>
        <p className="font-bold text-foreground mb-1">Ordonnance envoyée !</p>
        <p className="text-sm text-muted-foreground mb-4">
          Résultats attendus sous <strong>{lab.resultDelay}</strong>. Vous serez
          notifié par email.
        </p>
        <button
          onClick={() => {
            setStep(1);
            setFile(null);
          }}
          className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
        >
          Nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
                }`}
            >
              {s}
            </div>
            {s < 2 && (
              <div
                className={`h-0.5 flex-1 rounded ${step > s ? "bg-primary" : "bg-border"}`}
              />
            )}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Centre sélectionné :</p>
          <div className="p-3 rounded-xl bg-secondary/40 border border-border flex items-center gap-2">
            <FlaskConical size={16} className="text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">
              {lab.name}
            </span>
            <CheckCircle size={14} className="text-emerald-500 ml-auto" />
          </div>
          <button
            onClick={() => setStep(2)}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition"
          >
            Continuer →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files[0];
              if (f) setFile(f);
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${drag
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
              }`}
            onClick={() => document.getElementById("ord-widget-input")?.click()}
          >
            <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
            {file ? (
              <p className="text-sm font-medium text-foreground">{file.name}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground">
                  Importer votre ordonnance
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG ou PDF — max 10 Mo
                </p>
              </>
            )}
            <input
              id="ord-widget-input"
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFile(f);
              }}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition"
            >
              Retour
            </button>
            <button
              onClick={handleSend}
              disabled={!file}
              className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Detail Page ───────────────────────────────────────────────────────────────
export default function LaboDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [lab, setLab] = useState<LabCenter | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/public/labs/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { setLab(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const [activeTab, setActiveTab] = useState<
    "catalogue" | "equipe" | "horaires" | "avis"
  >("catalogue");
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [selectedExam, setSelectedExam] = useState<string>("");
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [booked, setBooked] = useState(false);
  const [activeWidget, setActiveWidget] = useState<"booking" | "ordonnance">(
    "booking",
  );

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-pulse text-muted-foreground text-sm">Chargement…</div>
      </main>
      <Footer />
    </div>
  );

  if (!lab) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <FlaskConical size={48} className="text-muted-foreground/40 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Centre introuvable
          </h1>
          <p className="text-muted-foreground mb-6">
            Ce centre n'existe pas ou a été supprimé.
          </p>
          <Link
            to="/labos-radiologie"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
          >
            Retour aux laboratoires
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allDays = generateSlots(lab.id);
  const weekDays = allDays.map((d) => {
    const shifted = new Date(d.date);
    shifted.setDate(shifted.getDate() + weekOffset * 7);
    return { ...d, date: shifted };
  });
  const currentDay = weekDays[selectedDayIdx];

  const examOptions = lab.examCatalog?.map((e) => e.name) ?? lab.exams;
  const displayExam = selectedExam || examOptions[0] || "";

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBooked(true);
  };

  const gallery = [lab.imageUrl, ...(lab.gallery ?? [])];

  const tabs = [
    { key: "catalogue", label: "Catalogue" },
    { key: "equipe", label: "Équipe" },
    { key: "horaires", label: "Horaires" },
    { key: "avis", label: `Avis (${lab.reviews})` },
  ] as const;

  // Group exam catalog by category
  const examsByCategory = (lab.examCatalog ?? []).reduce<
    Record<string, Exam[]>
  >((acc, ex) => {
    if (!acc[ex.category]) acc[ex.category] = [];
    acc[ex.category].push(ex);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* ── Hero Banner ── */}
      <div className="relative h-64 lg:h-80 overflow-hidden">
        <img
          src={gallery[galleryIdx] ?? lab.imageUrl}
          alt={lab.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <Link
          to="/labos-radiologie"
          className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm text-white rounded-xl text-sm font-medium hover:bg-black/60 transition"
        >
          <ArrowLeft size={16} /> Retour aux laboratoires
        </Link>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* ── Left: content ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Identity card */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${typeColors[lab.type]}`}
                >
                  {lab.type}
                </span>
                {lab.cnam && (
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-accent/20 text-accent-foreground flex items-center gap-1">
                    <Shield size={11} /> Conventionné CNAM
                  </span>
                )}
                {lab.open24h && (
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                    24h/24
                  </span>
                )}
              </div>

              <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground mb-2">
                {lab.name}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} /> {lab.address}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> Résultats : {lab.resultDelay}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={16}
                      className={
                        s <= Math.round(lab.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted-foreground/30"
                      }
                    />
                  ))}
                  <span className="font-bold text-foreground ml-1">
                    {lab.rating.toFixed(1)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    ({lab.reviews} avis)
                  </span>
                </div>
                <span className="text-sm text-foreground">
                  À partir de{" "}
                  <span className="font-bold text-primary">
                    {lab.priceFrom} TND
                  </span>
                </span>
              </div>

              {/* Accreditations */}
              {lab.accreditations && lab.accreditations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {lab.accreditations.map((a) => (
                    <span
                      key={a}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/70 text-foreground/80 flex items-center gap-1"
                    >
                      <Award size={11} /> {a}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Gallery */}
            {gallery.length > 1 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="text-sm font-bold text-foreground mb-3">
                  Galerie
                </h3>
                <div className="relative h-48 rounded-xl overflow-hidden mb-3">
                  <img
                    src={gallery[galleryIdx]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setGalleryIdx(Math.max(0, galleryIdx - 1))}
                    disabled={galleryIdx === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center disabled:opacity-30 transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setGalleryIdx(
                        Math.min(gallery.length - 1, galleryIdx + 1),
                      )
                    }
                    disabled={galleryIdx === gallery.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center disabled:opacity-30 transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIdx(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${i === galleryIdx
                          ? "border-primary"
                          : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="flex border-b border-border overflow-x-auto">
                {tabs.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === key
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* CATALOGUE */}
                {activeTab === "catalogue" && (
                  <div className="space-y-6">
                    <p className="text-sm text-muted-foreground">
                      {lab.description}
                    </p>

                    {lab.equipment && lab.equipment.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-3">
                          Équipements
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {lab.equipment.map((eq) => (
                            <span
                              key={eq}
                              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-secondary/70 text-foreground/80 flex items-center gap-1.5"
                            >
                              <Activity size={11} className="text-primary" />{" "}
                              {eq}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {Object.keys(examsByCategory).length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-foreground mb-4">
                          Catalogue des examens
                        </h4>
                        {Object.entries(examsByCategory).map(([cat, exams]) => (
                          <div key={cat} className="mb-5">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                              {cat}
                            </p>
                            <div className="space-y-2">
                              {exams.map((ex) => (
                                <div
                                  key={ex.name}
                                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition"
                                >
                                  <div>
                                    <p className="text-sm font-medium text-foreground">
                                      {ex.name}
                                    </p>
                                    <div className="flex items-center gap-3 mt-0.5">
                                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Clock size={10} /> {ex.duration}
                                      </span>
                                      {ex.preparation && (
                                        <span className="text-xs text-amber-600 dark:text-amber-400">
                                          ⚠ {ex.preparation}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <span className="font-bold text-primary text-sm">
                                    {ex.price} TND
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ÉQUIPE */}
                {activeTab === "equipe" && (
                  <div>
                    {lab.team && lab.team.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lab.team.map((member) => (
                          <div
                            key={member.name}
                            className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30"
                          >
                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-lg font-bold text-primary">
                                {member.name.split(" ").pop()?.charAt(0) ?? "?"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {member.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {member.specialty}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Informations d'équipe non disponibles.
                      </p>
                    )}
                  </div>
                )}

                {/* HORAIRES */}
                {activeTab === "horaires" && (
                  <div className="space-y-4">
                    {lab.schedule && lab.schedule.length > 0 ? (
                      <div className="divide-y divide-border">
                        {lab.schedule.map(({ day, hours }) => (
                          <div
                            key={day}
                            className="flex justify-between items-center py-3"
                          >
                            <span className="text-sm font-medium text-foreground">
                              {day}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Horaires non disponibles.
                      </p>
                    )}
                    <div className="pt-2 space-y-2">
                      <a
                        href={`tel:${lab.phone}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition"
                      >
                        <Phone size={16} className="text-primary" />
                        <span className="text-sm text-foreground">
                          {lab.phone}
                        </span>
                      </a>
                      {lab.email && (
                        <a
                          href={`mailto:${lab.email}`}
                          className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition"
                        >
                          <Mail size={16} className="text-primary" />
                          <span className="text-sm text-foreground">
                            {lab.email}
                          </span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* AVIS */}
                {activeTab === "avis" && (
                  <div className="space-y-4">
                    {lab.patientReviews && lab.patientReviews.length > 0 ? (
                      lab.patientReviews.map((r, i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-secondary/30 border border-border/50"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-foreground">
                              {r.author}
                            </span>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  className={
                                    s <= r.rating
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-muted-foreground/30"
                                  }
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {r.comment}
                          </p>
                          <p className="text-xs text-muted-foreground/60">
                            {r.date}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucun avis pour le moment.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: sticky booking + ordonnance widget ── */}
          <div className="mt-6 lg:mt-0">
            <div className="sticky top-6 space-y-4">
              {/* Widget selector tabs */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="flex border-b border-border">
                  <button
                    onClick={() => setActiveWidget("booking")}
                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeWidget === "booking"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <Calendar size={15} /> Prendre RDV
                  </button>
                  <button
                    onClick={() => setActiveWidget("ordonnance")}
                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeWidget === "ordonnance"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <FileText size={15} /> Ordonnance
                  </button>
                </div>

                <div className="p-5">
                  {/* ── BOOKING ── */}
                  {activeWidget === "booking" && (
                    <>
                      {booked ? (
                        <div className="text-center py-4">
                          <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle
                              className="text-emerald-500"
                              size={26}
                            />
                          </div>
                          <p className="font-bold text-foreground mb-1">
                            Rendez-vous confirmé !
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            {DAY_LABELS[currentDay.date.getDay()]}{" "}
                            {currentDay.date.getDate()}{" "}
                            {MONTH_LABELS[currentDay.date.getMonth()]} à{" "}
                            {selectedSlot}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            {displayExam}
                          </p>
                          <button
                            onClick={() => {
                              setBooked(false);
                              setSelectedSlot(null);
                            }}
                            className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
                          >
                            Nouveau RDV
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                              Tarif indicatif
                            </span>
                            <span className="font-bold text-primary">
                              {lab.examCatalog?.find(
                                (e) => e.name === displayExam,
                              )?.price ?? lab.priceFrom}{" "}
                              TND
                            </span>
                          </div>

                          {/* Exam selector */}
                          <div>
                            <label className="text-sm font-semibold text-foreground block mb-2">
                              Examen
                            </label>
                            <select
                              value={displayExam}
                              onChange={(e) => setSelectedExam(e.target.value)}
                              className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                              {examOptions.map((ex) => (
                                <option key={ex} value={ex}>
                                  {ex}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Week navigation */}
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <label className="text-sm font-semibold text-foreground">
                                Date
                              </label>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setWeekOffset(Math.max(0, weekOffset - 1));
                                    setSelectedSlot(null);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-40"
                                  disabled={weekOffset === 0}
                                >
                                  <ChevronLeft
                                    size={15}
                                    className="text-muted-foreground"
                                  />
                                </button>
                                <button
                                  onClick={() => {
                                    setWeekOffset(weekOffset + 1);
                                    setSelectedSlot(null);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
                                >
                                  <ChevronRight
                                    size={15}
                                    className="text-muted-foreground"
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-7 gap-1">
                              {weekDays.map((d, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setSelectedDayIdx(i);
                                    setSelectedSlot(null);
                                  }}
                                  className={`flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all ${i === selectedDayIdx
                                      ? "bg-primary text-primary-foreground"
                                      : "hover:bg-secondary/70 text-foreground/70"
                                    } ${d.slots.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                                  disabled={d.slots.length === 0}
                                >
                                  <span className="text-[10px] opacity-70">
                                    {DAY_LABELS[d.date.getDay()]}
                                  </span>
                                  <span className="text-sm font-bold">
                                    {d.date.getDate()}
                                  </span>
                                  <span className="text-[9px] opacity-60">
                                    {MONTH_LABELS[d.date.getMonth()]}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Slots */}
                          <div>
                            <label className="text-sm font-semibold text-foreground block mb-3">
                              Créneaux
                              <span className="font-normal text-muted-foreground ml-2">
                                ({currentDay.slots.length})
                              </span>
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {currentDay.slots.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => setSelectedSlot(slot)}
                                  className={`py-2 rounded-xl text-xs font-semibold transition-all text-center ${selectedSlot === slot
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
                                    }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={handleBook}
                            disabled={!selectedSlot}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <Calendar size={16} />
                            {isAuthenticated
                              ? "Confirmer le rendez-vous"
                              : "Se connecter pour réserver"}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* ── ORDONNANCE ── */}
                  {activeWidget === "ordonnance" && (
                    <OrdonnanceWidget lab={lab} />
                  )}
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-foreground">Contact</h4>
                <a
                  href={`tel:${lab.phone}`}
                  className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition"
                >
                  <Phone size={15} className="text-primary flex-shrink-0" />{" "}
                  {lab.phone}
                </a>
                {lab.email && (
                  <a
                    href={`mailto:${lab.email}`}
                    className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition"
                  >
                    <Mail size={15} className="text-primary flex-shrink-0" />{" "}
                    {lab.email}
                  </a>
                )}
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <MapPin
                    size={15}
                    className="text-primary flex-shrink-0 mt-0.5"
                  />{" "}
                  {lab.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
