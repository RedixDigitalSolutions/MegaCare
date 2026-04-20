import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Star, ShoppingCart, ArrowLeft, ChevronRight, ChevronLeft, Truck, Shield, Package, CheckCircle, } from "lucide-react";
// ─── Product data (same as catalogue) ────────────────────────────────────────
const products = []; /* MOCK DATA REMOVED — loaded from API
[
    {
      id: "1",
      name: "Fauteuil roulant manuel pliant",
      brand: "VERMEIREN",
      category: "Orthopédie",
      price: 580,
      originalPrice: 720,
      rating: 4.8,
      reviews: 143,
      inStock: true,
      stockQty: 5,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&fit=crop&q=80",
      shortDesc: "Fauteuil léger aluminium, poids 12 kg, dossier rabattable",
      deliveryDays: "3–5 jours",
      description:
        "Fauteuil roulant manuel ultra-léger en aluminium anodisé. Sa structure pliant facilite le transport et le rangement. Idéal pour un usage quotidien en intérieur et en extérieur.",
      usage:
        "Pour personnes à mobilité réduite, post-opératoire ou convalescence. Utilisation intérieur/extérieur sur sol plat ou légèrement incliné.",
      compatibility:
        "Cadre universel, largeur assise 45 cm. Capacité max 120 kg. Compatible accessoires standard VERMEIREN.",
      features: [
        "Poids net 12 kg",
        "Structure aluminium anodisé pliant",
        "Dossier rabattable",
        "Repose-pieds escamotables",
        "Roues arrière 24 pouces avec bandage pneumatique",
        "Accoudoirs fixes",
      ],
      images: [
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&fit=crop&q=80",
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&fit=crop&q=80",
        "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "2",
      name: "Tensiomètre électronique bras",
      brand: "OMRON",
      category: "Maintien à domicile",
      price: 89,
      originalPrice: 110,
      rating: 4.9,
      reviews: 512,
      inStock: true,
      stockQty: 30,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&fit=crop&q=80",
      shortDesc: "Mesure tensiométrique automatique, mémoire 60 mesures",
      deliveryDays: "24h",
      description:
        "Tensiomètre électronique de bras OMRON avec technologie IntelliSense pour une mesure précise. Mémoire de 60 mesures avec indicateur de tendance hypertension.",
      usage:
        "Utilisation au repos, après 5 minutes d'assise. Bras gauche à hauteur du cœur. Manchette 22–42 cm comprise.",
      compatibility:
        "Connexion Bluetooth compatible application OMRON Connect (iOS/Android). Manchette standard et M incluses.",
      features: [
        "Technologie IntelliSense",
        "Mémoire 60 mesures",
        "Détection de fibrillation auriculaire",
        "Indicateur de mouvement du corps",
        "Connectivité Bluetooth",
        "Alimentation piles AA × 4",
      ],
      images: [
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&fit=crop&q=80",
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "3",
      name: "Glucomètre AccuChek Active",
      brand: "ROCHE",
      category: "Diabétologie",
      price: 45,
      rating: 4.7,
      reviews: 328,
      inStock: true,
      stockQty: 20,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&fit=crop&q=80",
      shortDesc: "Lecteur de glycémie rapide, résultat en 5 secondes",
      deliveryDays: "24h",
      description:
        "Le glucomètre AccuChek Active de Roche est un lecteur de glycémie capillaire fiable et simple d'utilisation. Résultat en 5 secondes avec une goutte de sang de 2 µl.",
      usage:
        "Piqûre au bout du doigt (ou site alternatif). Insérer la bandelette, appliquer la goutte. Ne dépasse pas l'usage autour des repas et à jeun.",
      compatibility:
        "Bandelettes AccuChek Active exclusivement. Autopiqueur AccuChek FastClix recommandé (vendu séparément).",
      features: [
        "Résultat en 5 secondes",
        "Volume de sang 2 µl",
        "Mémoire 500 résultats avec date/heure",
        "Alerte hypoglycémie",
        "Compatible protocole Bluetooth",
        "Boîtier ergonomique",
      ],
      images: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&fit=crop&q=80",
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "4",
      name: "Déambulateur 4 roues avec siège",
      brand: "DRIVE MEDICAL",
      category: "Maintien à domicile",
      price: 210,
      rating: 4.6,
      reviews: 97,
      inStock: true,
      stockQty: 8,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&fit=crop&q=80",
      shortDesc:
        "Rollator léger aluminium, panier de rangement, hauteur réglable",
      deliveryDays: "3–5 jours",
      description:
        "Rollator 4 roues en aluminium léger avec siège intégré. Idéal pour les personnes à mobilité réduite souhaitant se déplacer en autonomie. Pliable pour le transport.",
      usage:
        "Déplacements intérieur/extérieur. Régler la hauteur des poignées selon la morphologie. Ne pas dépasser 130 kg.",
      compatibility:
        "Accessoires Drive Medical compatibles. Sac de rangement universel 30L inclus.",
      features: [
        "Structure aluminium pliable",
        "Siège rembourré 35 cm de profondeur",
        "Frein de parking",
        "Hauteur poignées réglable 82–96 cm",
        "Panier 18L inclus",
        "4 roues 6 pouces",
      ],
      images: [
        "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&fit=crop&q=80",
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "5",
      name: "Collier cervical souple",
      brand: "THUASNE",
      category: "Orthopédie",
      price: 24,
      rating: 4.5,
      reviews: 215,
      inStock: true,
      stockQty: 50,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&fit=crop&q=80",
      shortDesc: "Maintien cervical confort, mousse polyuréthane, taille M",
      deliveryDays: "24h",
      description:
        "Collier cervical souple THUASNE en mousse polyuréthane à mémoire de forme. Maintien discret adapté aux contractures musculaires, torticolis et douleurs légères.",
      usage:
        "Porter quelques heures par jour selon prescription. Ne pas utiliser en conduite. Hauteur 7,5 cm taille M.",
      compatibility: "Disponible en S, M, L. Lavable à la main 30°C.",
      features: [
        "Mousse polyuréthane à mémoire de forme",
        "Fermeture velcro ajustable",
        "Hauteur 7,5 cm (taille M)",
        "Hypoallergénique",
        "Lavable main 30°C",
      ],
      images: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "6",
      name: "Genouillère ligamentaire sport",
      brand: "GIBAUD",
      category: "Orthopédie",
      price: 38,
      originalPrice: 48,
      rating: 4.7,
      reviews: 176,
      inStock: true,
      stockQty: 25,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=800&fit=crop&q=80",
      shortDesc: "Genouillère renforcée, baleines bilatérales, taille S–XL",
      deliveryDays: "48h",
      description:
        "Genouillère ligamentaire GIBAUD avec baleines bilatérales et rotulienne. Tissage compressif pour stabilisation et drainage lors d'activités sportives ou de rééducation.",
      usage:
        "Entorse, instabilité ligamentaire, gonalgie légère. Sport ou usage quotidien. Enfiler à froid, retirer en cas de douleur accrue.",
      compatibility:
        "Taille S à XL selon périmètre genoux. Tableau des tailles inclus.",
      features: [
        "Baleines bilatérales flexibles",
        "Anneau rotulien integré",
        "Tissu respirant 72% polyamide",
        "Compression douce 10–15 mmHg",
        "Tailles S / M / L / XL",
      ],
      images: [
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "7",
      name: "Oxymètre de pouls digital",
      brand: "BEURER",
      category: "Maintien à domicile",
      price: 35,
      rating: 4.8,
      reviews: 389,
      inStock: true,
      stockQty: 40,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&fit=crop&q=80",
      shortDesc: "Mesure SpO2 et fréquence cardiaque, écran LED, piles incluses",
      deliveryDays: "24h",
      description:
        "Oxymètre de pouls BEURER à pince pour mesure non invasive de la saturation en oxygène (SpO2) et de la fréquence cardiaque. Idéal pour surveillance à domicile.",
      usage:
        "Installer sur index ou majeur propre et sec. Rester immobile pendant 10 secondes. Ne pas utiliser en remplacement d'un diagnostic médical.",
      compatibility:
        "Piles AAA × 2 incluses. Compatible doigts adultes 7–25 mm. Étui de transport inclus.",
      features: [
        "Affichage LED 4 directions",
        "SpO2 précision ±2%",
        "FC 30–250 bpm",
        "Alarme SpO2 < 90%",
        "Piles AAA × 2 incluses",
        "Étui de transport",
      ],
      images: [
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "8",
      name: "Pansements stériles complets 20 pcs",
      brand: "HARTMANN",
      category: "Soins & pansements",
      price: 12,
      rating: 4.6,
      reviews: 254,
      inStock: true,
      stockQty: 100,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&fit=crop&q=80",
      shortDesc: "Pansements hypoallergéniques toutes tailles, emballage stérile",
      deliveryDays: "24h",
      description:
        "Assortiment de pansements stériles Hartmann Cosmopor en 4 formats. Coussin absorbant non adhérent, bords renforcés, hypoallergéniques. Usage plaies superficielles.",
      usage:
        "Nettoyer et sécher la plaie. Appliquer sans tension sur peau sèche. Changer toutes les 24h ou si souillé.",
      compatibility:
        "20 pansements : 4×5 formats différents 5×7 cm, 7×10 cm, 9×15 cm, 9×20 cm.",
      features: [
        "Coussin absorbant non adhérent",
        "Bords adhésifs hypoallergéniques",
        "Conditionnement stérile individuel",
        "20 pièces, 4 tailles",
        "Sans latex",
      ],
      images: [
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "9",
      name: "Compresses stériles non tissées 100 pcs",
      brand: "HARTMANN",
      category: "Soins & pansements",
      price: 8.5,
      rating: 4.7,
      reviews: 198,
      inStock: true,
      stockQty: 80,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&fit=crop&q=80",
      shortDesc: "Compresses 10×10 cm, non pelucheuses, lot de 100",
      deliveryDays: "24h",
      description:
        "Compresses stériles non-tissées Hartmann en viscose / polyester. Non pelucheuses, assurent une absorption efficace. Conditionnées par 5 en pochette individuelle.",
      usage:
        "Nettoyage de plaies, protection post-opératoire, pansements. Usage unique, ne pas réutiliser.",
      compatibility:
        "10 × 10 cm. 100 compresses en 20 sachets de 5. Stérilisation EO.",
      features: [
        "100% non pelucheuses",
        "Viscose + polyester",
        "Stérilisée à l'oxyde d'éthylène",
        "100 pcs / 20 sachets de 5",
        "Usage unique",
      ],
      images: [
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "10",
      name: "Thermomètre digital auriculaire",
      brand: "BRAUN",
      category: "Maintien à domicile",
      price: 52,
      originalPrice: 65,
      rating: 4.9,
      reviews: 643,
      inStock: true,
      stockQty: 18,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&fit=crop&q=80",
      shortDesc: "Mesure auriculaire en 1 seconde, 9 positions mémoire",
      deliveryDays: "24h",
      description:
        "Thermomètre auriculaire Braun ThermoScan 5 avec technologie ExactTemp. Mesure précise en 1 seconde. Embouts Lens Filter jetables garantissent hygiène optimale.",
      usage:
        "Insérer dans le conduit auditif. Appuyer sur le bouton jusqu'au signal sonore (1 seconde). Utiliser un embout propre par mesure.",
      compatibility:
        "Embouts LF 40 compatibles (disponibles séparément). Piles AA × 2 incluses.",
      features: [
        "Mesure en 1 seconde",
        "Technologie ExactTemp",
        "Mémoire 9 mesures",
        "Embouts lens filter × 21 inclus",
        "Indicateur fièvre par couleur",
        "Piles AA × 2 incluses",
      ],
      images: [
        "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "11",
      name: "Coussin anti-escarres rond",
      brand: "THUASNE",
      category: "Maintien à domicile",
      price: 42,
      rating: 4.5,
      reviews: 88,
      inStock: true,
      stockQty: 12,
      prescription: true,
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&fit=crop&q=80",
      shortDesc: "Mousse viscoélastique mémoire de forme, diamètre 40 cm",
      deliveryDays: "48h",
      description:
        "Coussin anti-escarres en mousse viscoélastique à mémoire de forme. Répartit la pression et améliore la circulation sanguine pour les patients assis prolongés.",
      usage:
        "À poser sur siège de fauteuil roulant, chaise ou voiture. Utilisation sur prescription médicale recommandée.",
      compatibility:
        "Diamètre 40 cm, hauteur 5 cm. Housse déhoussable lavable 40°C.",
      features: [
        "Mousse viscoélastique T50",
        "Diamètre 40 cm, hauteur 5 cm",
        "Housse déhoussable lavable 40°C",
        "Base anti-dérapante",
        "Certification CE Classe I",
      ],
      images: [
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "12",
      name: "Semelles orthopédiques sport",
      brand: "BAUERFEIND",
      category: "Orthopédie",
      price: 65,
      rating: 4.6,
      reviews: 134,
      inStock: true,
      stockQty: 30,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&fit=crop&q=80",
      shortDesc: "Semelles gel sport, soutien voûte plantaire, taille 36–46",
      deliveryDays: "48h",
      description:
        "Semelles orthopédiques sport Bauerfeind avec gel amortisseur au talon et métatarse. Soutien voûte plantaire et correction légère de la pronation.",
      usage:
        "Insérer dans chaussures de sport ou marche. Taille sur semelle d'origine. Durée de vie ~12 mois d'usage régulier.",
      compatibility:
        "Tailles 36 à 46. Découpage selon gabarit. Compatible chaussures standard ≥ 6 mm de profondeur.",
      features: [
        "Insert gel talon et métatarse",
        "Soutien voûte plantaire",
        "Tissu tissu respirant",
        "Découpable selon gabarit",
        "Tailles 36 à 46",
      ],
      images: [
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "13",
      name: "Bande de contention élastique",
      brand: "SIGVARIS",
      category: "Soins & pansements",
      price: 15,
      rating: 4.4,
      reviews: 162,
      inStock: true,
      stockQty: 60,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&fit=crop&q=80",
      shortDesc: "Bande Velpeau extensible 10 cm × 4 m, lot de 2",
      deliveryDays: "24h",
      description:
        "Bandes de contention élastiques Sigvaris pour maintien des entorses et pansements compressifs. Extensibles, elles épousent parfaitement la morphologie.",
      usage:
        "Bandage à froid après entorse. Poser sans excès de pression. Retirer si douleur ou engourdissement.",
      compatibility:
        "10 cm × 4 m étiré. Lot de 2 bandes. Lavable 30°C, réutilisable.",
      features: [
        "10 cm × 4 m étiré",
        "Extensibilité 150%",
        "Lot de 2 bandes",
        "Lavable 30°C, réutilisable",
        "Coton + élasthanne",
      ],
      images: [
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "14",
      name: "Bandelettes glycémie AccuChek ×50",
      brand: "ROCHE",
      category: "Diabétologie",
      price: 32,
      rating: 4.8,
      reviews: 294,
      inStock: true,
      stockQty: 45,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=800&fit=crop&q=80",
      shortDesc: "Bandelettes réactives compatibles AccuChek Active, boîte 50",
      deliveryDays: "24h",
      description:
        "Bandelettes glycémie originals Roche pour lecteur AccuChek Active. Technologie PhotoSense pour résultats précis sans codage. Boîte de 50 unités.",
      usage:
        "Insérer la bandelette dans le lecteur. Appliquer 2 µL de sang capillaire. Résultat en 5 secondes. Jeter après usage.",
      compatibility:
        "Compatibles lecteurs AccuChek Active uniquement. Conserver < 25°C, humidité < 85%.",
      features: [
        "Technologie PhotoSense",
        "Sans codage",
        "Résultat en 5 secondes",
        "50 bandelettes / boîte",
        "Compatible AccuChek Active",
        "Usage unique",
      ],
      images: [
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "15",
      name: "Autopiqueur lancettes ×100",
      brand: "BD",
      category: "Diabétologie",
      price: 18,
      rating: 4.6,
      reviews: 211,
      inStock: true,
      stockQty: 70,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&fit=crop&q=80",
      shortDesc: "Lancettes universelles 28G, indolores, lot de 100",
      deliveryDays: "24h",
      description:
        "Lancettes BD Ultra-Fine 28G pour autopiqueur. Biseau triple affûtage pour perforation moins douloureuse. Stérilisées en ETO, conditionnées individuellement.",
      usage:
        "Utiliser avec autopiqueur BD (ou universel). Un usage unique. Mettre dans conteneur DASRI après usage.",
      compatibility:
        "Compatibles majorité des autopiqueurs du marché (universels). 28 Gauge, longueur 1,8 mm.",
      features: [
        "Calibre 28G, longueur 1,8 mm",
        "Biseau triple affûtage",
        "Stérilisation ETO",
        "100 lancettes",
        "Conditionnement individuel",
        "Usage unique",
      ],
      images: [
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "16",
      name: "Tire-lait électrique double pompe",
      brand: "MEDELA",
      category: "Matériel bébé",
      price: 320,
      originalPrice: 395,
      rating: 4.9,
      reviews: 328,
      inStock: true,
      stockQty: 6,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&fit=crop&q=80",
      shortDesc: "Double pompe silencieuse, technologie 2-phase, mains libres",
      deliveryDays: "3–5 jours",
      description:
        "Tire-lait électrique double Medela Swing Maxi avec technologie 2-Phase Expression imitant la succion naturelle du bébé. Utilisation mains libres avec bustier dédié.",
      usage:
        "Brancher les tétines selon taille (S/M/L). Régler l'aspiration progressivement. Séance 15–20 mn. Stériliser les pièces après chaque usage.",
      compatibility:
        "Bustier mains libres Medela requis (vendu séparément). Universel seins 21–30 mm. Cordon secteur inclus.",
      features: [
        "Technologie 2-Phase Expression",
        "Silencieux < 45 dB",
        "Adaptateurs tailles S/M/L inclus",
        "Timer LCD intégré",
        "Piles ou secteur",
        "Kit 3 biberons 150 mL inclus",
      ],
      images: [
        "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "17",
      name: "Ballon de rééducation 65 cm",
      brand: "GYMNIC",
      category: "Bien-être & rééducation",
      price: 28,
      rating: 4.7,
      reviews: 187,
      inStock: true,
      stockQty: 22,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&fit=crop&q=80",
      shortDesc: "Ballon d'exercice anti-éclatement, 65 cm, pompe incluse",
      deliveryDays: "48h",
      description:
        "Ballon de gym/rééducation Gymnic Pastorelli anti-éclatement. Utilisé en kinésithérapie, renforcement musculaire, grossesse et yoga. Diamètre 65 cm pour taille 160–175 cm.",
      usage:
        "Gonfler à pression modérée. Ne pas exposer à la chaleur. Utilisable surface plane non abrasive. Capacité 300 kg.",
      compatibility:
        "Pour utilisateurs 160–175 cm. Pompe manuelle incluse. PVC sans phtalates.",
      features: [
        "Diamètre 65 cm",
        "Anti-éclatement ABS",
        "Capacité 300 kg",
        "PVC sans phtalates, sans latex",
        "Pompe manuelle incluse",
      ],
      images: [
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "18",
      name: "Bande élastique rééducation ×1.5 m",
      brand: "THERA-BAND",
      category: "Bien-être & rééducation",
      price: 12,
      rating: 4.5,
      reviews: 246,
      inStock: true,
      stockQty: 55,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&fit=crop&q=80",
      shortDesc: "Bande latex résistance légère à forte, plusieurs niveaux",
      deliveryDays: "24h",
      description:
        "Bande de résistance Thera-Band pour rééducation et renforcement musculaire. Latex naturel, 1,5 m × 15 cm. Disponible en 5 niveaux de résistance (jaune à bleu).",
      usage:
        "Ancrer à un support fixe ou utiliser avec les mains. Progression de la résistance par couleur. Rincer à l'eau froide après usage.",
      compatibility:
        "1,5 m × 15 cm. Choisir la couleur/résistance selon niveau : jaune (faible) → bleu (forte).",
      features: [
        "5 niveaux couleur",
        "Latex naturel 0,3 mm d'épaisseur",
        "1,5 m × 15 cm",
        "Rinçable, réutilisable",
        "Fabriqué aux USA",
      ],
      images: [
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "19",
      name: "Béquilles réglables aluminium (paire)",
      brand: "INVACARE",
      category: "Orthopédie",
      price: 75,
      rating: 4.4,
      reviews: 112,
      inStock: false,
      stockQty: 0,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&fit=crop&q=80",
      shortDesc: "Béquilles axillaires léger aluminium, hauteur 1.10–1.50 m",
      deliveryDays: "7–10 jours",
      description:
        "Paire de béquilles axillaires Invacare en aluminium léger. Hauteur réglable pour utilisateurs de 1,10 à 1,50 m. Embout axillaire rembourré, poignée ergonomique.",
      usage:
        "Régler la hauteur avant utilisation. Poser la béquille 5 cm à l'extérieur du pied. Appui sur la poignée, pas l'aisselle.",
      compatibility:
        "Paire. Hauteur réglable 1,10–1,50 m. Capacité 100 kg. Embout pavé 30 mm.",
      features: [
        "Aluminium éloxé léger",
        "Embout axillaire rembourré",
        "Poignée ergonomique antidérapante",
        "Embout pavé 30 mm",
        "Capacité max 100 kg",
      ],
      images: [
        "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&fit=crop&q=80",
      ],
    },
    {
      id: "20",
      name: "Nébuliseur à compresseur silencieux",
      brand: "OMRON",
      category: "Maintien à domicile",
      price: 98,
      originalPrice: 125,
      rating: 4.8,
      reviews: 174,
      inStock: true,
      stockQty: 10,
      prescription: false,
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&fit=crop&q=80",
      shortDesc:
        "Aérosol à compresseur < 45 dB, embout buccal + masques adulte & enfant",
      deliveryDays: "48h",
      description:
        "Nébuliseur OMRON A3 Complete à compresseur silencieux. Convient aux maladies respiratoires : asthme, bronchite, BPCO. Technologie V.V.T pour traitement efficace.",
      usage:
        "Remplir le nébuliseur selon prescription. Utiliser masque ou embout buccal. Séance 10–15 mn. Rincer et sécher après usage.",
      compatibility:
        "Médicaments en solution aqueuse (prescrits). Kit complet : embout buccal, masque adulte, masque enfant, filtre.",
      features: [
        "Mode V.V.T (Virtual Valve Technology)",
        "< 45 dB",
        "Masque adulte + enfant + embout buccal",
        "Débit 0,4 mL/min",
        "Particules MMAD 2,7 µm",
        "Filtres × 5 inclus",
      ],
      images: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&fit=crop&q=80",
      ],
    },
  */
// ─── Stars ────────────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }) {
    return (_jsx("div", { className: "flex items-center gap-0.5", children: [1, 2, 3, 4, 5].map((s) => (_jsx(Star, { size: size, className: s <= Math.round(rating)
                ? "text-amber-400 fill-amber-400"
                : "text-muted-foreground/30" }, s))) }));
}
// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParamedicalProductPage() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const [imgIdx, setImgIdx] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch(`/api/public/paramedical-products/${id}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => { setProduct(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);
    if (loading)
        return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 flex items-center justify-center py-20", children: _jsx("div", { className: "animate-pulse text-muted-foreground text-sm", children: "Chargement\u2026" }) }), _jsx(Footer, {})] }));
    if (!product) {
        return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1 flex flex-col items-center justify-center gap-6 text-center px-4", children: [_jsx(Package, { size: 56, className: "text-muted-foreground/30" }), _jsx("p", { className: "text-2xl font-bold text-foreground", children: "Produit introuvable" }), _jsx("p", { className: "text-muted-foreground", children: "Ce produit n'existe pas ou a \u00E9t\u00E9 retir\u00E9." }), _jsx(Link, { to: "/paramedical", className: "px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition", children: "Retour au catalogue" })] }), _jsx(Footer, {})] }));
    }
    const similar = [];
    const hasPromo = !!product.originalPrice;
    const promoPercent = hasPromo
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) *
            100)
        : 0;
    const handleAddToCart = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
    };
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsx("div", { className: "border-b border-border bg-card", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Link, { to: "/", className: "hover:text-foreground transition", children: "Accueil" }), _jsx(ChevronRight, { size: 14 }), _jsx(Link, { to: "/paramedical", className: "hover:text-foreground transition", children: "Param\u00E9dicaux" }), _jsx(ChevronRight, { size: 14 }), _jsx("span", { className: "text-foreground font-medium truncate max-w-[200px]", children: product.name })] }) }), _jsxs("main", { className: "flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full", children: [_jsxs(Link, { to: "/paramedical", className: "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8", children: [_jsx(ArrowLeft, { size: 16 }), " Retour au catalogue"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16", children: [_jsxs("div", { children: [_jsxs("div", { className: "relative aspect-square rounded-3xl overflow-hidden bg-secondary/20 mb-4", children: [_jsx("img", { src: product.images[imgIdx], alt: product.name, className: "w-full h-full object-cover" }), product.images.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => setImgIdx((i) => (i - 1 + product.images.length) %
                                                            product.images.length), className: "absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-xl border border-border hover:bg-card transition", children: _jsx(ChevronLeft, { size: 18 }) }), _jsx("button", { onClick: () => setImgIdx((i) => (i + 1) % product.images.length), className: "absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-card/80 backdrop-blur-sm rounded-xl border border-border hover:bg-card transition", children: _jsx(ChevronRight, { size: 18 }) })] }))] }), product.images.length > 1 && (_jsx("div", { className: "flex gap-3", children: product.images.map((img, i) => (_jsx("button", { onClick: () => setImgIdx(i), className: `w-20 h-20 rounded-xl overflow-hidden border-2 transition ${imgIdx === i
                                                ? "border-primary"
                                                : "border-border hover:border-primary/40"}`, children: _jsx("img", { src: img, alt: "", className: "w-full h-full object-cover" }) }, i))) }))] }), _jsxs("div", { className: "flex flex-col gap-5", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-xs font-bold tracking-widest uppercase text-muted-foreground", children: product.brand }), _jsx("span", { className: "text-xs px-2 py-1 bg-primary/10 text-primary rounded-lg font-medium", children: product.category }), product.prescription && (_jsx("span", { className: "text-xs px-2 py-1 border border-amber-400 text-amber-600 dark:text-amber-400 rounded-lg font-medium", children: "Sur ordonnance" }))] }), _jsx("h1", { className: "text-3xl font-extrabold text-foreground tracking-tight leading-tight", children: product.name }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(StarRating, { rating: product.rating, size: 16 }), _jsx("span", { className: "text-sm font-semibold text-foreground", children: product.rating })] }), _jsxs("div", { className: "flex items-baseline gap-3", children: [_jsx("span", { className: "text-4xl font-extrabold text-foreground", children: product.price.toFixed(2) }), _jsx("span", { className: "text-lg text-foreground/60", children: "TND" }), hasPromo && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-lg text-muted-foreground line-through", children: product.originalPrice.toFixed(2) }), _jsxs("span", { className: "px-2.5 py-1 bg-emerald-500 text-white text-sm font-bold rounded-lg", children: ["-", promoPercent, "%"] })] }))] }), _jsxs("div", { className: `flex items-center gap-2 text-sm font-semibold ${product.inStock ? "text-emerald-600 dark:text-emerald-500" : "text-red-500"}`, children: [_jsx("span", { className: `w-2 h-2 rounded-full flex-shrink-0 ${product.inStock ? "bg-emerald-500" : "bg-red-400"}` }), product.inStock
                                                ? `En stock (${product.stockQty} unités)`
                                                : "Rupture de stock"] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-sm font-semibold text-foreground", children: "Quantit\u00E9 :" }), _jsxs("div", { className: "flex items-center gap-0 border border-border rounded-xl overflow-hidden", children: [_jsx("button", { onClick: () => setQty((q) => Math.max(1, q - 1)), disabled: !product.inStock, className: "w-10 h-10 flex items-center justify-center hover:bg-secondary/50 transition disabled:opacity-40", children: _jsx("span", { className: "text-xl font-bold leading-none", children: "\u2212" }) }), _jsx("span", { className: "w-12 text-center text-sm font-bold text-foreground", children: qty }), _jsx("button", { onClick: () => setQty((q) => Math.min(product.stockQty, q + 1)), disabled: !product.inStock, className: "w-10 h-10 flex items-center justify-center hover:bg-secondary/50 transition disabled:opacity-40", children: _jsx("span", { className: "text-xl font-bold leading-none", children: "+" }) })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: handleAddToCart, disabled: !product.inStock, className: "flex-1 flex items-center justify-center gap-2.5 py-4 bg-primary text-primary-foreground rounded-2xl text-base font-bold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed", children: addedToCart ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 18 }), " Ajout\u00E9 au panier !"] })) : (_jsxs(_Fragment, { children: [_jsx(ShoppingCart, { size: 18 }), " Ajouter au panier"] })) }), _jsxs(Link, { to: "/pharmacy", className: "px-5 py-4 border border-border rounded-2xl font-semibold text-sm hover:bg-secondary/50 transition flex items-center gap-2 text-foreground", children: [_jsx(ShoppingCart, { size: 16 }), " Pharmacie"] })] }), _jsx("div", { className: "grid grid-cols-3 gap-3 mt-2", children: [
                                            { icon: _jsx(Shield, { size: 14 }), text: "Certifié CE" },
                                            { icon: _jsx(Truck, { size: 14 }), text: "Retour gratuit 30j" },
                                            { icon: _jsx(CheckCircle, { size: 14 }), text: "Paiement sécurisé" },
                                        ].map(({ icon, text }) => (_jsxs("div", { className: "flex flex-col items-center gap-1.5 p-3 bg-secondary/30 rounded-xl text-center", children: [_jsx("span", { className: "text-primary", children: icon }), _jsx("span", { className: "text-xs text-muted-foreground", children: text })] }, text))) })] })] }), product.features.length > 0 && (_jsxs("div", { className: "mb-12", children: [_jsx("h2", { className: "text-lg font-bold text-foreground mb-4", children: "Points cl\u00E9s" }), _jsx("div", { className: "flex flex-wrap gap-2.5", children: product.features.map((feat) => (_jsxs("span", { className: "flex items-center gap-1.5 px-3 py-1.5 bg-primary/8 text-primary text-sm font-medium rounded-xl", children: [_jsx(CheckCircle, { size: 13 }), feat] }, feat))) })] })), _jsxs("div", { className: "mb-12", children: [_jsx("div", { className: "flex gap-1 border-b border-border mb-6", children: [
                                    { key: "description", label: "Description" },
                                    { key: "usage", label: "Utilisation" },
                                    { key: "compat", label: "Compatibilité" },
                                ].map(({ key, label }) => (_jsx("button", { onClick: () => setActiveTab(key), className: `px-5 py-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === key
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground"}`, children: label }, key))) }), _jsxs("div", { className: "max-w-3xl text-base leading-relaxed text-foreground/80", children: [activeTab === "description" && _jsx("p", { children: product.description }), activeTab === "usage" && _jsx("p", { children: product.usage }), activeTab === "compat" && _jsx("p", { children: product.compatibility })] })] }), similar.length > 0 && (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("h2", { className: "text-xl font-extrabold text-foreground", children: ["Produits similaires \u2014 ", product.category] }), _jsx(Link, { to: `/paramedical`, className: "text-sm text-primary hover:underline font-medium", children: "Voir tout \u2192" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5", children: similar.map((p) => {
                                    const sp = p.originalPrice
                                        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                                        : 0;
                                    return (_jsxs(Link, { to: `/paramedical/product/${p.id}`, className: "group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col", children: [_jsxs("div", { className: "relative h-44 bg-secondary/20 overflow-hidden", children: [_jsx("img", { src: p.imageUrl, alt: p.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" }), sp > 0 && (_jsxs("span", { className: "absolute top-2 left-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-lg", children: ["-", sp, "%"] }))] }), _jsxs("div", { className: "p-4", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: p.brand }), _jsx("p", { className: "font-bold text-foreground text-sm mt-0.5 line-clamp-2 group-hover:text-primary transition", children: p.name }), _jsxs("div", { className: "flex items-center gap-1 mt-2", children: [_jsx(StarRating, { rating: p.rating, size: 12 }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["(", p.reviews, ")"] })] }), _jsxs("div", { className: "flex items-baseline gap-2 mt-2", children: [_jsx("span", { className: "text-lg font-extrabold text-foreground", children: p.price.toFixed(2) }), _jsx("span", { className: "text-xs text-foreground/60", children: "TND" }), p.originalPrice && (_jsx("span", { className: "text-xs text-muted-foreground line-through", children: p.originalPrice.toFixed(2) }))] })] })] }, p.id));
                                }) })] }))] }), _jsx(Footer, {})] }));
}
