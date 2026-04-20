import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Star, Phone, Clock, CheckCircle, Calendar, ChevronLeft, ChevronRight, FlaskConical, Activity, Shield, Mail, ArrowLeft, Upload, FileText, Award, } from "lucide-react";
// ─── Mock Data ─────────────────────────────────────────────────────────────────
const labs = []; /* MOCK DATA REMOVED — fetched from API
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
const typeColors = {
    Laboratoire: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Radiologie: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    Mixte: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
};
function generateSlots(id) {
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
function OrdonnanceWidget({ lab }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [drag, setDrag] = useState(false);
    const handleSend = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setStep(3);
    };
    if (step === 3) {
        return (_jsxs("div", { className: "text-center py-6", children: [_jsx("div", { className: "w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3", children: _jsx(CheckCircle, { className: "text-emerald-500", size: 26 }) }), _jsx("p", { className: "font-bold text-foreground mb-1", children: "Ordonnance envoy\u00E9e !" }), _jsxs("p", { className: "text-sm text-muted-foreground mb-4", children: ["R\u00E9sultats attendus sous ", _jsx("strong", { children: lab.resultDelay }), ". Vous serez notifi\u00E9 par email."] }), _jsx("button", { onClick: () => {
                        setStep(1);
                        setFile(null);
                    }, className: "px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition", children: "Nouvelle demande" })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex items-center gap-2", children: [1, 2].map((s) => (_jsxs("div", { className: "flex items-center gap-2 flex-1", children: [_jsx("div", { className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${step >= s
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground"}`, children: s }), s < 2 && (_jsx("div", { className: `h-0.5 flex-1 rounded ${step > s ? "bg-primary" : "bg-border"}` }))] }, s))) }), step === 1 && (_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Centre s\u00E9lectionn\u00E9 :" }), _jsxs("div", { className: "p-3 rounded-xl bg-secondary/40 border border-border flex items-center gap-2", children: [_jsx(FlaskConical, { size: 16, className: "text-primary flex-shrink-0" }), _jsx("span", { className: "text-sm font-medium text-foreground", children: lab.name }), _jsx(CheckCircle, { size: 14, className: "text-emerald-500 ml-auto" })] }), _jsx("button", { onClick: () => setStep(2), className: "w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition", children: "Continuer \u2192" })] })), step === 2 && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { onDragOver: (e) => {
                            e.preventDefault();
                            setDrag(true);
                        }, onDragLeave: () => setDrag(false), onDrop: (e) => {
                            e.preventDefault();
                            setDrag(false);
                            const f = e.dataTransfer.files[0];
                            if (f)
                                setFile(f);
                        }, className: `border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${drag
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"}`, onClick: () => document.getElementById("ord-widget-input")?.click(), children: [_jsx(Upload, { size: 24, className: "mx-auto mb-2 text-muted-foreground" }), file ? (_jsx("p", { className: "text-sm font-medium text-foreground", children: file.name })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: "Importer votre ordonnance" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "JPG, PNG ou PDF \u2014 max 10 Mo" })] })), _jsx("input", { id: "ord-widget-input", type: "file", accept: "image/*,.pdf", className: "hidden", onChange: (e) => {
                                    const f = e.target.files?.[0];
                                    if (f)
                                        setFile(f);
                                } })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setStep(1), className: "flex-1 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition", children: "Retour" }), _jsx("button", { onClick: handleSend, disabled: !file, className: "flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed", children: "Envoyer" })] })] }))] }));
}
// ─── Detail Page ───────────────────────────────────────────────────────────────
export default function LaboDetailPage() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [lab, setLab] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch(`/api/public/labs/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => { setLab(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);
    const [activeTab, setActiveTab] = useState("catalogue");
    const [galleryIdx, setGalleryIdx] = useState(0);
    const [selectedExam, setSelectedExam] = useState("");
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [weekOffset, setWeekOffset] = useState(0);
    const [booked, setBooked] = useState(false);
    const [activeWidget, setActiveWidget] = useState("booking");
    if (loading)
        return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 flex items-center justify-center py-20", children: _jsx("div", { className: "animate-pulse text-muted-foreground text-sm", children: "Chargement\u2026" }) }), _jsx(Footer, {})] }));
    if (!lab) {
        return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1 flex flex-col items-center justify-center py-20 px-4", children: [_jsx(FlaskConical, { size: 48, className: "text-muted-foreground/40 mb-4" }), _jsx("h1", { className: "text-2xl font-bold text-foreground mb-2", children: "Centre introuvable" }), _jsx("p", { className: "text-muted-foreground mb-6", children: "Ce centre n'existe pas ou a \u00E9t\u00E9 supprim\u00E9." }), _jsx(Link, { to: "/labos-radiologie", className: "px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition", children: "Retour aux laboratoires" })] }), _jsx(Footer, {})] }));
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
    ];
    // Group exam catalog by category
    const examsByCategory = (lab.examCatalog ?? []).reduce((acc, ex) => {
        if (!acc[ex.category])
            acc[ex.category] = [];
        acc[ex.category].push(ex);
        return acc;
    }, {});
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsxs("div", { className: "relative h-64 lg:h-80 overflow-hidden", children: [_jsx("img", { src: gallery[galleryIdx] ?? lab.imageUrl, alt: lab.name, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" }), _jsxs(Link, { to: "/labos-radiologie", className: "absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm text-white rounded-xl text-sm font-medium hover:bg-black/60 transition", children: [_jsx(ArrowLeft, { size: 16 }), " Retour aux laboratoires"] })] }), _jsx("main", { className: "flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full", children: _jsxs("div", { className: "lg:grid lg:grid-cols-3 lg:gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs("div", { className: "bg-card border border-border rounded-2xl p-6", children: [_jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [_jsx("span", { className: `px-3 py-1 rounded-lg text-xs font-semibold ${typeColors[lab.type]}`, children: lab.type }), lab.cnam && (_jsxs("span", { className: "px-3 py-1 rounded-lg text-xs font-semibold bg-accent/20 text-accent-foreground flex items-center gap-1", children: [_jsx(Shield, { size: 11 }), " Conventionn\u00E9 CNAM"] })), lab.open24h && (_jsx("span", { className: "px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400", children: "24h/24" }))] }), _jsx("h1", { className: "text-2xl lg:text-3xl font-extrabold text-foreground mb-2", children: lab.name }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-muted-foreground flex-wrap mb-4", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { size: 14 }), " ", lab.address] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { size: 14 }), " R\u00E9sultats : ", lab.resultDelay] })] }), _jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [[1, 2, 3, 4, 5].map((s) => (_jsx(Star, { size: 16, className: s <= Math.round(lab.rating)
                                                                ? "text-amber-400 fill-amber-400"
                                                                : "text-muted-foreground/30" }, s))), _jsx("span", { className: "font-bold text-foreground ml-1", children: lab.rating.toFixed(1) })] }), _jsxs("span", { className: "text-sm text-foreground", children: ["\u00C0 partir de", " ", _jsxs("span", { className: "font-bold text-primary", children: [lab.priceFrom, " TND"] })] })] }), lab.accreditations && lab.accreditations.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-4", children: lab.accreditations.map((a) => (_jsxs("span", { className: "px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/70 text-foreground/80 flex items-center gap-1", children: [_jsx(Award, { size: 11 }), " ", a] }, a))) }))] }), gallery.length > 1 && (_jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [_jsx("h3", { className: "text-sm font-bold text-foreground mb-3", children: "Galerie" }), _jsxs("div", { className: "relative h-48 rounded-xl overflow-hidden mb-3", children: [_jsx("img", { src: gallery[galleryIdx], alt: "", className: "w-full h-full object-cover" }), _jsx("button", { onClick: () => setGalleryIdx(Math.max(0, galleryIdx - 1)), disabled: galleryIdx === 0, className: "absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center disabled:opacity-30 transition", children: _jsx(ChevronLeft, { size: 16 }) }), _jsx("button", { onClick: () => setGalleryIdx(Math.min(gallery.length - 1, galleryIdx + 1)), disabled: galleryIdx === gallery.length - 1, className: "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center disabled:opacity-30 transition", children: _jsx(ChevronRight, { size: 16 }) })] }), _jsx("div", { className: "flex gap-2 overflow-x-auto", children: gallery.map((img, i) => (_jsx("button", { onClick: () => setGalleryIdx(i), className: `flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition ${i === galleryIdx
                                                    ? "border-primary"
                                                    : "border-transparent opacity-60 hover:opacity-100"}`, children: _jsx("img", { src: img, alt: "", className: "w-full h-full object-cover" }) }, i))) })] })), _jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [_jsx("div", { className: "flex border-b border-border overflow-x-auto", children: tabs.map(({ key, label }) => (_jsx("button", { onClick: () => setActiveTab(key), className: `px-5 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${activeTab === key
                                                    ? "border-b-2 border-primary text-primary"
                                                    : "text-muted-foreground hover:text-foreground"}`, children: label }, key))) }), _jsxs("div", { className: "p-6", children: [activeTab === "catalogue" && (_jsxs("div", { className: "space-y-6", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: lab.description }), lab.equipment && lab.equipment.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "\u00C9quipements" }), _jsx("div", { className: "flex flex-wrap gap-2", children: lab.equipment.map((eq) => (_jsxs("span", { className: "px-3 py-1.5 rounded-xl text-xs font-medium bg-secondary/70 text-foreground/80 flex items-center gap-1.5", children: [_jsx(Activity, { size: 11, className: "text-primary" }), " ", eq] }, eq))) })] })), Object.keys(examsByCategory).length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-4", children: "Catalogue des examens" }), Object.entries(examsByCategory).map(([cat, exams]) => (_jsxs("div", { className: "mb-5", children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2", children: cat }), _jsx("div", { className: "space-y-2", children: exams.map((ex) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: ex.name }), _jsxs("div", { className: "flex items-center gap-3 mt-0.5", children: [_jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Clock, { size: 10 }), " ", ex.duration] }), ex.preparation && (_jsxs("span", { className: "text-xs text-amber-600 dark:text-amber-400", children: ["\u26A0 ", ex.preparation] }))] })] }), _jsxs("span", { className: "font-bold text-primary text-sm", children: [ex.price, " TND"] })] }, ex.name))) })] }, cat)))] }))] })), activeTab === "equipe" && (_jsx("div", { children: lab.team && lab.team.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: lab.team.map((member) => (_jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-secondary/30", children: [_jsx("div", { className: "w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0", children: _jsx("span", { className: "text-lg font-bold text-primary", children: member.name.split(" ").pop()?.charAt(0) ?? "?" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: member.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: member.specialty })] })] }, member.name))) })) : (_jsx("p", { className: "text-sm text-muted-foreground", children: "Informations d'\u00E9quipe non disponibles." })) })), activeTab === "horaires" && (_jsxs("div", { className: "space-y-4", children: [lab.schedule && lab.schedule.length > 0 ? (_jsx("div", { className: "divide-y divide-border", children: lab.schedule.map(({ day, hours }) => (_jsxs("div", { className: "flex justify-between items-center py-3", children: [_jsx("span", { className: "text-sm font-medium text-foreground", children: day }), _jsx("span", { className: "text-sm text-muted-foreground", children: hours })] }, day))) })) : (_jsx("p", { className: "text-sm text-muted-foreground", children: "Horaires non disponibles." })), _jsxs("div", { className: "pt-2 space-y-2", children: [_jsxs("a", { href: `tel:${lab.phone}`, className: "flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition", children: [_jsx(Phone, { size: 16, className: "text-primary" }), _jsx("span", { className: "text-sm text-foreground", children: lab.phone })] }), lab.email && (_jsxs("a", { href: `mailto:${lab.email}`, className: "flex items-center gap-3 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition", children: [_jsx(Mail, { size: 16, className: "text-primary" }), _jsx("span", { className: "text-sm text-foreground", children: lab.email })] }))] })] }))] })] })] }), _jsx("div", { className: "mt-6 lg:mt-0", children: _jsxs("div", { className: "sticky top-6 space-y-4", children: [_jsxs("div", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [_jsxs("div", { className: "flex border-b border-border", children: [_jsxs("button", { onClick: () => setActiveWidget("booking"), className: `flex-1 py-3.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeWidget === "booking"
                                                            ? "border-b-2 border-primary text-primary"
                                                            : "text-muted-foreground hover:text-foreground"}`, children: [_jsx(Calendar, { size: 15 }), " Prendre RDV"] }), _jsxs("button", { onClick: () => setActiveWidget("ordonnance"), className: `flex-1 py-3.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${activeWidget === "ordonnance"
                                                            ? "border-b-2 border-primary text-primary"
                                                            : "text-muted-foreground hover:text-foreground"}`, children: [_jsx(FileText, { size: 15 }), " Ordonnance"] })] }), _jsxs("div", { className: "p-5", children: [activeWidget === "booking" && (_jsx(_Fragment, { children: booked ? (_jsxs("div", { className: "text-center py-4", children: [_jsx("div", { className: "w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3", children: _jsx(CheckCircle, { className: "text-emerald-500", size: 26 }) }), _jsx("p", { className: "font-bold text-foreground mb-1", children: "Rendez-vous confirm\u00E9 !" }), _jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: [DAY_LABELS[currentDay.date.getDay()], " ", currentDay.date.getDate(), " ", MONTH_LABELS[currentDay.date.getMonth()], " \u00E0", " ", selectedSlot] }), _jsx("p", { className: "text-sm text-muted-foreground mb-4", children: displayExam }), _jsx("button", { onClick: () => {
                                                                        setBooked(false);
                                                                        setSelectedSlot(null);
                                                                    }, className: "px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition", children: "Nouveau RDV" })] })) : (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Tarif indicatif" }), _jsxs("span", { className: "font-bold text-primary", children: [lab.examCatalog?.find((e) => e.name === displayExam)?.price ?? lab.priceFrom, " ", "TND"] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground block mb-2", children: "Examen" }), _jsx("select", { value: displayExam, onChange: (e) => setSelectedExam(e.target.value), className: "w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30", children: examOptions.map((ex) => (_jsx("option", { value: ex, children: ex }, ex))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Date" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => {
                                                                                                setWeekOffset(Math.max(0, weekOffset - 1));
                                                                                                setSelectedSlot(null);
                                                                                            }, className: "p-1.5 rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-40", disabled: weekOffset === 0, children: _jsx(ChevronLeft, { size: 15, className: "text-muted-foreground" }) }), _jsx("button", { onClick: () => {
                                                                                                setWeekOffset(weekOffset + 1);
                                                                                                setSelectedSlot(null);
                                                                                            }, className: "p-1.5 rounded-lg hover:bg-secondary/50 transition-colors", children: _jsx(ChevronRight, { size: 15, className: "text-muted-foreground" }) })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: weekDays.map((d, i) => (_jsxs("button", { onClick: () => {
                                                                                    setSelectedDayIdx(i);
                                                                                    setSelectedSlot(null);
                                                                                }, className: `flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all ${i === selectedDayIdx
                                                                                    ? "bg-primary text-primary-foreground"
                                                                                    : "hover:bg-secondary/70 text-foreground/70"} ${d.slots.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`, disabled: d.slots.length === 0, children: [_jsx("span", { className: "text-[10px] opacity-70", children: DAY_LABELS[d.date.getDay()] }), _jsx("span", { className: "text-sm font-bold", children: d.date.getDate() }), _jsx("span", { className: "text-[9px] opacity-60", children: MONTH_LABELS[d.date.getMonth()] })] }, i))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-semibold text-foreground block mb-3", children: ["Cr\u00E9neaux", _jsxs("span", { className: "font-normal text-muted-foreground ml-2", children: ["(", currentDay.slots.length, ")"] })] }), _jsx("div", { className: "grid grid-cols-3 gap-2", children: currentDay.slots.map((slot) => (_jsx("button", { onClick: () => setSelectedSlot(slot), className: `py-2 rounded-xl text-xs font-semibold transition-all text-center ${selectedSlot === slot
                                                                                    ? "bg-primary text-primary-foreground shadow-sm"
                                                                                    : "bg-secondary/60 text-foreground/80 hover:bg-secondary"}`, children: slot }, slot))) })] }), _jsxs("button", { onClick: handleBook, disabled: !selectedSlot, className: "w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: [_jsx(Calendar, { size: 16 }), isAuthenticated
                                                                            ? "Confirmer le rendez-vous"
                                                                            : "Se connecter pour réserver"] })] })) })), activeWidget === "ordonnance" && (_jsx(OrdonnanceWidget, { lab: lab }))] })] }), _jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-3", children: [_jsx("h4", { className: "text-sm font-bold text-foreground", children: "Contact" }), _jsxs("a", { href: `tel:${lab.phone}`, className: "flex items-center gap-3 text-sm text-foreground hover:text-primary transition", children: [_jsx(Phone, { size: 15, className: "text-primary flex-shrink-0" }), " ", lab.phone] }), lab.email && (_jsxs("a", { href: `mailto:${lab.email}`, className: "flex items-center gap-3 text-sm text-foreground hover:text-primary transition", children: [_jsx(Mail, { size: 15, className: "text-primary flex-shrink-0" }), " ", lab.email] })), _jsxs("div", { className: "flex items-start gap-3 text-sm text-muted-foreground", children: [_jsx(MapPin, { size: 15, className: "text-primary flex-shrink-0 mt-0.5" }), " ", lab.address] })] })] }) })] }) }), _jsx(Footer, {})] }));
}
