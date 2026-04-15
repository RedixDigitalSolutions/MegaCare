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
  Building2,
  Shield,
  Users,
  X,
  Mail,
  ArrowLeft,
  Award,
  Stethoscope,
  Activity,
} from "lucide-react";

// ─── Shared data (same as listing page) ──────────────────────────────────────
interface MedicalEstablishment {
  id: string;
  name: string;
  type: "Clinique" | "Hôpital" | "HAD" | "Centre médical";
  governorate: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  rating: number;
  reviews: number;
  price: number;
  services: string[];
  accredited: boolean;
  emergencies: boolean;
  imageUrl: string;
  gallery?: string[];
  description: string;
  beds?: number;
  doctors?: number;
  founded?: number;
  schedule?: { day: string; hours: string }[];
  team?: { name: string; specialty: string; image?: string }[];
  patientReviews?: {
    author: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

const establishments: MedicalEstablishment[] = []; /* MOCK DATA REMOVED — fetched from API
[
  {
    id: "1",
    name: "Clinique Hannibal",
    type: "Clinique",
    governorate: "Tunis",
    city: "Carthage",
    address: "Route de la Marsa, Carthage, Tunis",
    phone: "+216 71 777 888",
    email: "contact@clinique-hannibal.tn",
    rating: 4.8,
    reviews: 312,
    price: 60,
    services: [
      "Cardiologie",
      "Chirurgie",
      "Obstétrique",
      "Réanimation",
      "Imagerie",
      "Orthopédie",
      "Neurologie",
    ],
    accredited: true,
    emergencies: true,
    imageUrl:
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1200&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=600&fit=crop&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&fit=crop&q=80",
    ],
    description:
      "Clinique médicale privée de référence depuis 1994, la Clinique Hannibal offre une prise en charge globale avec un plateau technique de pointe. Avec 180 lits et une équipe de 120 médecins spécialistes, elle est reconnue pour la qualité de ses soins chirurgicaux, cardiologiques et obstétricaux. La clinique est dotée d'un bloc opératoire de 8 salles, d'une unité de réanimation, d'un service d'imagerie complet (IRM 3T, scanner, mammographie) et d'une maternité de niveau 3.",
    beds: 180,
    doctors: 120,
    founded: 1994,
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h00 – 22h00" },
      { day: "Samedi", hours: "08h00 – 18h00" },
      { day: "Dimanche & Jours fériés", hours: "Urgences uniquement" },
    ],
    team: [
      {
        name: "Dr Amira Ben Salah",
        specialty: "Cardiologie",
        image:
          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&fit=crop&q=80",
      },
      {
        name: "Dr Karim Trabelsi",
        specialty: "Chirurgie générale",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&fit=crop&q=80",
      },
      {
        name: "Dr Fatima Chérif",
        specialty: "Gynécologie-Obstétrique",
        image:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&fit=crop&q=80",
      },
      {
        name: "Dr Riadh Hamrouni",
        specialty: "Neurologie",
        image:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&fit=crop&q=80",
      },
    ],
    patientReviews: [
      {
        author: "Sonia M.",
        rating: 5,
        comment:
          "Personnel extrêmement professionnel. Mon intervention chirurgicale s'est parfaitement déroulée et le suivi post-op était irréprochable.",
        date: "Mars 2026",
      },
      {
        author: "Ahmed B.",
        rating: 5,
        comment:
          "Les urgences sont réactives, j'ai été pris en charge en moins de 10 minutes. Matériel moderne et équipe compétente.",
        date: "Fév 2026",
      },
      {
        author: "Leïla K.",
        rating: 4,
        comment:
          "Très bonne clinique, excellent service de cardiologie. Légère attente à l'accueil mais rien d'alarmant.",
        date: "Jan 2026",
      },
      {
        author: "Mohamed T.",
        rating: 5,
        comment:
          "La maternité est au top. Ma femme a accouché dans les meilleures conditions. On recommande vivement!",
        date: "Déc 2025",
      },
    ],
  },
  {
    id: "2",
    name: "Hôpital Aziza Othmana",
    type: "Hôpital",
    governorate: "Tunis",
    city: "Tunis Centre",
    address: "Place de la Kasbah, Tunis",
    phone: "+216 71 562 344",
    email: "contact@aziza-othmana.tn",
    rating: 4.3,
    reviews: 540,
    price: 30,
    services: [
      "Urgences",
      "Médecine interne",
      "Pédiatrie",
      "Chirurgie",
      "Maternité",
      "Cardiologie",
    ],
    accredited: true,
    emergencies: true,
    imageUrl:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&fit=crop&q=80",
    description:
      "Grand hôpital public universitaire fondé en 1949, l'Hôpital Aziza Othmana est l'un des plus anciens et des plus importants établissements de santé de Tunis. Il offre des soins de qualité dans 15 services spécialisés, avec des conventions CNAM permettant une prise en charge intégrale. L'hôpital forme également des médecins résidents en collaboration avec la Faculté de Médecine de Tunis.",
    beds: 450,
    doctors: 280,
    founded: 1949,
    schedule: [
      { day: "Tous les jours", hours: "Urgences 24h/24" },
      { day: "Consultations Lun – Ven", hours: "08h00 – 16h00" },
      { day: "Consultations Samedi", hours: "08h00 – 12h00" },
    ],
    team: [
      {
        name: "Dr Habib Saidani",
        specialty: "Médecine interne",
        image:
          "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&fit=crop&q=80",
      },
      {
        name: "Dr Wafa Jlassi",
        specialty: "Pédiatrie",
        image:
          "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&fit=crop&q=80",
      },
    ],
    patientReviews: [
      {
        author: "Rim A.",
        rating: 4,
        comment:
          "Bon suivi médical, personnel dévoué. La prise en charge CNAM est parfaite.",
        date: "Fév 2026",
      },
      {
        author: "Sofien B.",
        rating: 4,
        comment:
          "Service des urgences efficace. Quelques attentes mais inévitables dans un hôpital public.",
        date: "Jan 2026",
      },
    ],
  },
  {
    id: "3",
    name: "Centre Médical des Berges du Lac",
    type: "Centre médical",
    governorate: "Tunis",
    city: "Les Berges du Lac",
    address: "Immeuble Médical, Les Berges du Lac 2, Tunis",
    phone: "+216 71 964 100",
    email: "info@centreberges.tn",
    rating: 4.9,
    reviews: 198,
    price: 50,
    services: [
      "Dermatologie",
      "Ophtalmologie",
      "ORL",
      "Gynécologie",
      "Radiologie",
      "Cardiologie",
    ],
    accredited: true,
    emergencies: false,
    imageUrl:
      "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200&fit=crop&q=80",
    description:
      "Centre multi-spécialités d'excellence au cœur des Berges du Lac, ouvert en 2012. Ses équipements de dernière génération incluant un IRM 3T, un scanner 128 coupes et un plateau d'imagerie complet en font une référence pour le diagnostic et le suivi ambulatoire.",
    beds: 0,
    doctors: 45,
    founded: 2012,
    schedule: [
      { day: "Lundi – Vendredi", hours: "08h00 – 20h00" },
      { day: "Samedi", hours: "09h00 – 15h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [
      {
        name: "Dr Nadia Hadj Ali",
        specialty: "Dermatologie",
        image:
          "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=200&fit=crop&q=80",
      },
      {
        name: "Dr Fares Marzouk",
        specialty: "Ophtalmologie",
        image:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&fit=crop&q=80",
      },
    ],
    patientReviews: [
      {
        author: "Lina T.",
        rating: 5,
        comment:
          "Centre magnifique, équipements top de gamme. Prise en charge rapide et médecins à l'écoute.",
        date: "Mars 2026",
      },
      {
        author: "Youssef K.",
        rating: 5,
        comment:
          "IRM réalisée dans les 48h, résultats en ligne le lendemain. Service impeccable!",
        date: "Fév 2026",
      },
    ],
  },
  {
    id: "4",
    name: "Clinique El Menzah",
    type: "Clinique",
    governorate: "Tunis",
    city: "Menzah",
    address: "Avenue Tahar Ben Ammar, El Menzah 6, Tunis",
    phone: "+216 71 238 900",
    rating: 4.6,
    reviews: 241,
    price: 55,
    services: [
      "Orthopédie",
      "Cardiologie",
      "Neurologie",
      "Urologie",
      "Chirurgie",
    ],
    accredited: true,
    emergencies: true,
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&fit=crop&q=80",
    description:
      "Clinique pluridisciplinaire au nord de Tunis offrant chirurgie mini-invasive, soins de rééducation et consultations spécialisées depuis 2003.",
    beds: 120,
    doctors: 80,
    founded: 2003,
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h30 – 21h00" },
      { day: "Samedi", hours: "08h00 – 18h00" },
      { day: "Dimanche", hours: "Urgences 08h00 – 16h00" },
    ],
    team: [],
    patientReviews: [
      {
        author: "Ines B.",
        rating: 5,
        comment:
          "Excellent service orthopédique, chirurgien très compétent. Rétablissement parfait.",
        date: "Jan 2026",
      },
    ],
  },
  {
    id: "5",
    name: "HAD MédiHome Sfax",
    type: "HAD",
    governorate: "Sfax",
    city: "Sfax",
    address: "Rue des Palmiers, Sfax",
    phone: "+216 74 225 300",
    rating: 4.7,
    reviews: 89,
    price: 45,
    services: [
      "Hospitalisation à domicile",
      "Soins infirmiers",
      "Perfusions",
      "Soins palliatifs",
      "Rééducation",
    ],
    accredited: true,
    emergencies: false,
    imageUrl:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=1200&fit=crop&q=80",
    description:
      "Premier réseau d'hospitalisation à domicile à Sfax, opérationnel depuis 2018. Des équipes soignantes qualifiées se déplacent chez vous 7j/7.",
    beds: 0,
    doctors: 22,
    founded: 2018,
    schedule: [
      { day: "Tous les jours", hours: "07h00 – 22h00" },
      { day: "Astreinte nocturne", hours: "22h00 – 07h00 (sur appel)" },
    ],
    team: [],
    patientReviews: [
      {
        author: "Khaled M.",
        rating: 5,
        comment:
          "Service HAD exceptionnel. Les infirmières sont ponctuelles, professionnelles et très attentionnées.",
        date: "Mars 2026",
      },
    ],
  },
  {
    id: "6",
    name: "Polyclinique de Sousse",
    type: "Clinique",
    governorate: "Sousse",
    city: "Sousse",
    address: "Boulevard du 7 Novembre, Sousse",
    phone: "+216 73 228 600",
    rating: 4.5,
    reviews: 176,
    price: 45,
    services: [
      "Cardiologie",
      "Gastro-entérologie",
      "Endocrinologie",
      "Radiologie",
      "Réanimation",
    ],
    accredited: true,
    emergencies: true,
    imageUrl:
      "https://images.unsplash.com/photo-1599045118108-bf9954418b76?w=1200&fit=crop&q=80",
    description:
      "Principale clinique privée du Sahel depuis 1989, offrant une gamme complète de services médicaux et chirurgicaux.",
    beds: 200,
    doctors: 95,
    founded: 1989,
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h00 – 22h00" },
      { day: "Samedi – Dimanche", hours: "Urgences 24h/24" },
    ],
    team: [],
    patientReviews: [],
  },
  {
    id: "7",
    name: "Centre Médical Nabeul",
    type: "Centre médical",
    governorate: "Nabeul",
    city: "Nabeul",
    address: "Avenue Habib Bourguiba, Nabeul",
    phone: "+216 72 285 700",
    rating: 4.4,
    reviews: 134,
    price: 40,
    services: [
      "Médecine générale",
      "Pédiatrie",
      "Gynécologie",
      "Dentisterie",
      "Radiologie",
    ],
    accredited: false,
    emergencies: false,
    imageUrl:
      "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=1200&fit=crop&q=80",
    description:
      "Centre de santé accessible offrant consultations de médecine générale et spécialisée avec des tarifs conventionnés CNAM.",
    beds: 0,
    doctors: 18,
    founded: 2008,
    schedule: [
      { day: "Lundi – Vendredi", hours: "08h00 – 18h00" },
      { day: "Samedi", hours: "08h00 – 13h00" },
      { day: "Dimanche", hours: "Fermé" },
    ],
    team: [],
    patientReviews: [],
  },
  {
    id: "8",
    name: "Hôpital Farhat Hached",
    type: "Hôpital",
    governorate: "Sousse",
    city: "Sousse",
    address: "Rue Ibn El Jazzar, Sousse",
    phone: "+216 73 221 411",
    rating: 4.2,
    reviews: 480,
    price: 25,
    services: [
      "Urgences",
      "Neurochirurgie",
      "Cardiologie",
      "Oncologie",
      "Maternité",
    ],
    accredited: true,
    emergencies: true,
    imageUrl:
      "https://images.unsplash.com/photo-1536064479547-7ee40b74b807?w=1200&fit=crop&q=80",
    description:
      "Centre hospitalier universitaire régional desservant le Sahel. 800 lits, 20 services spécialisés.",
    beds: 800,
    doctors: 380,
    founded: 1983,
    schedule: [{ day: "Tous les jours", hours: "Urgences 24h/24" }],
    team: [],
    patientReviews: [],
  },
  {
    id: "9",
    name: "Clinique Bizerte Santé",
    type: "Clinique",
    governorate: "Bizerte",
    city: "Bizerte",
    address: "Avenue Taieb Mhiri, Bizerte",
    phone: "+216 72 432 100",
    rating: 4.6,
    reviews: 112,
    price: 50,
    services: [
      "Chirurgie",
      "Maternité",
      "Pédiatrie",
      "Cardiologie",
      "Imagerie",
    ],
    accredited: true,
    emergencies: true,
    imageUrl:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&fit=crop&q=80",
    description:
      "Principale clinique privée de la région nord, offrant maternité, chirurgie programmée et urgences médicales.",
    beds: 90,
    doctors: 55,
    founded: 2007,
    schedule: [
      { day: "Lundi – Vendredi", hours: "07h30 – 21h00" },
      { day: "Samedi – Dimanche", hours: "Urgences 24h/24" },
    ],
    team: [],
    patientReviews: [],
  },
]*/

const typeColors: Record<string, string> = {
  Clinique: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Hôpital: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  HAD: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  "Centre médical": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

// ─── Booking helpers ──────────────────────────────────────────────────────────
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

function generateSlots(id: string) {
  const allSlots = [
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
    "16:30",
  ];
  const seed = parseInt(id, 10) || 1;
  return Array.from({ length: 7 }, (_, d) => {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const slots = allSlots.filter((_, i) => (i + d + seed) % 3 !== 0);
    return { date, slots };
  });
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ServiceMedicalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [estab, setEstab] = useState<MedicalEstablishment | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetch(`/api/public/establishments/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { setEstab(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const [tab, setTab] = useState<"about" | "team" | "schedule" | "reviews">(
    "about",
  );
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [booked, setBooked] = useState(false);

  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="animate-pulse text-muted-foreground text-sm">Chargement…</div>
      </main>
      <Footer />
    </div>
  );

  if (!estab) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Building2
              size={48}
              className="text-muted-foreground/30 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Établissement introuvable
            </h1>
            <p className="text-muted-foreground mb-6">
              Cet établissement n'existe pas ou n'est plus disponible.
            </p>
            <Link
              to="/services-medicaux"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
            >
              Retour à la liste
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const serviceSelected = selectedService || estab.services[0];
  const allDays = generateSlots(estab.id);
  const weekDays = allDays.map((d) => {
    const shifted = new Date(d.date);
    shifted.setDate(shifted.getDate() + weekOffset * 7);
    return { ...d, date: shifted };
  });
  const currentDay = weekDays[selectedDayIdx];

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setBooked(true);
  };

  const gallery = estab.gallery ?? [];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {/* ── Hero Banner ─────────────────────────────────────────────── */}
        <div className="relative h-64 lg:h-80 overflow-hidden">
          <img
            src={estab.imageUrl}
            alt={estab.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <Link
              to="/services-medicaux"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-4 transition-colors"
            >
              <ArrowLeft size={15} />
              Retour aux établissements
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* ── Left: Info + Tabs ────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">
              {/* Identity card */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${typeColors[estab.type]}`}
                  >
                    {estab.type}
                  </span>
                  {estab.emergencies && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                      Urgences 24h/24
                    </span>
                  )}
                  {estab.accredited && (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Shield size={11} />
                      Accrédité
                    </span>
                  )}
                </div>

                <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-1">
                  {estab.name}
                </h1>

                <div className="flex items-center gap-4 flex-wrap mt-2 mb-4">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <MapPin size={14} />
                    <span>{estab.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(estab.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground/30"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold text-foreground text-sm">
                      {estab.rating}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      ({estab.reviews} avis)
                    </span>
                  </div>
                  {estab.founded && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Award size={13} />
                      Fondé en {estab.founded}
                    </div>
                  )}
                  {estab.doctors && estab.doctors > 0 && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Users size={13} />
                      {estab.doctors} médecins
                    </div>
                  )}
                  {estab.beds && estab.beds > 0 && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                      <Activity size={13} />
                      {estab.beds} lits
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery */}
              {gallery.length > 0 && (
                <div className="bg-card rounded-2xl border border-border p-5">
                  <h2 className="font-semibold text-foreground mb-4">
                    Galerie
                  </h2>
                  <div className="relative">
                    <img
                      src={gallery[galleryIdx]}
                      alt={`${estab.name} ${galleryIdx + 1}`}
                      className="w-full h-52 object-cover rounded-xl"
                    />
                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setGalleryIdx(
                              (galleryIdx - 1 + gallery.length) %
                              gallery.length,
                            )
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setGalleryIdx((galleryIdx + 1) % gallery.length)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </>
                    )}
                    <div className="flex gap-2 mt-3">
                      {gallery.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => setGalleryIdx(i)}
                          className={`relative overflow-hidden rounded-lg w-16 h-12 ${i === galleryIdx ? "ring-2 ring-primary" : "opacity-60 hover:opacity-100"} transition`}
                        >
                          <img
                            src={src}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="flex border-b border-border">
                  {(["about", "team", "schedule", "reviews"] as const).map(
                    (t) => {
                      const labels: Record<string, string> = {
                        about: "À propos",
                        team: "Équipe",
                        schedule: "Horaires",
                        reviews: "Avis",
                      };
                      return (
                        <button
                          key={t}
                          onClick={() => setTab(t)}
                          className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${tab === t
                              ? "text-primary border-b-2 border-primary bg-primary/5"
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                            }`}
                        >
                          {labels[t]}
                          {t === "reviews" && estab.patientReviews?.length ? (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full text-[10px]">
                              {estab.patientReviews.length}
                            </span>
                          ) : null}
                        </button>
                      );
                    },
                  )}
                </div>

                <div className="p-6">
                  {/* About */}
                  {tab === "about" && (
                    <div className="space-y-5">
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {estab.description}
                      </p>
                      <div>
                        <h3 className="font-semibold text-foreground text-sm mb-3">
                          Services disponibles
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {estab.services.map((s) => (
                            <span
                              key={s}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-sm text-foreground rounded-full"
                            >
                              <Stethoscope size={13} className="text-primary" />
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Team */}
                  {tab === "team" && (
                    <div>
                      {!estab.team || estab.team.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          Informations sur l'équipe non disponibles.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {estab.team.map((member) => (
                            <div
                              key={member.name}
                              className="flex items-center gap-4 p-4 bg-secondary/30 rounded-xl"
                            >
                              {member.image ? (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-14 h-14 rounded-full object-cover shrink-0"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <Users className="text-primary" size={22} />
                                </div>
                              )}
                              <div>
                                <p className="font-semibold text-foreground text-sm">
                                  {member.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {member.specialty}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Schedule */}
                  {tab === "schedule" && (
                    <div className="space-y-3">
                      {estab.schedule?.map((s) => (
                        <div
                          key={s.day}
                          className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                        >
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Clock size={15} className="text-primary" />
                            {s.day}
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {s.hours}
                          </span>
                        </div>
                      ))}
                      <div className="mt-4 flex items-start gap-3 p-3 bg-primary/5 rounded-xl">
                        <Phone
                          size={15}
                          className="text-primary mt-0.5 shrink-0"
                        />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Standard
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {estab.phone}
                          </p>
                        </div>
                      </div>
                      {estab.email && (
                        <div className="flex items-start gap-3 p-3 bg-secondary/40 rounded-xl">
                          <Mail
                            size={15}
                            className="text-muted-foreground mt-0.5 shrink-0"
                          />
                          <div>
                            <p className="text-sm font-semibold text-foreground">
                              Email
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {estab.email}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Reviews */}
                  {tab === "reviews" && (
                    <div className="space-y-4">
                      {!estab.patientReviews ||
                        estab.patientReviews.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">
                          Aucun avis pour le moment.
                        </p>
                      ) : (
                        estab.patientReviews.map((review, i) => (
                          <div
                            key={i}
                            className="p-4 bg-secondary/30 rounded-xl space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                  {review.author[0]}
                                </div>
                                <span className="font-semibold text-foreground text-sm">
                                  {review.author}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }, (_, i) => (
                                  <Star
                                    key={i}
                                    size={13}
                                    className={
                                      i < review.rating
                                        ? "text-amber-400 fill-amber-400"
                                        : "text-muted-foreground/20"
                                    }
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {review.comment}
                            </p>
                            <p className="text-xs text-muted-foreground/70">
                              {review.date}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Right: Booking Widget ────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border p-5 sticky top-24 space-y-5">
                <div>
                  <p className="text-sm text-muted-foreground mb-0.5">
                    Consultation à partir de
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {estab.price}{" "}
                    <span className="text-base font-normal text-muted-foreground">
                      TND
                    </span>
                  </p>
                </div>

                {booked ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="text-emerald-500" size={28} />
                    </div>
                    <h3 className="font-bold text-foreground mb-1">
                      Rendez-vous confirmé!
                    </h3>
                    <p className="text-sm text-muted-foreground mb-1">
                      {DAY_LABELS[currentDay.date.getDay()]}{" "}
                      {currentDay.date.getDate()}{" "}
                      {MONTH_LABELS[currentDay.date.getMonth()]} à{" "}
                      {selectedSlot}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {serviceSelected} · {estab.name}
                    </p>
                    <button
                      onClick={() => {
                        setBooked(false);
                        setSelectedSlot(null);
                      }}
                      className="px-5 py-2 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition"
                    >
                      Nouveau RDV
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Service select */}
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                        Service
                      </label>
                      <select
                        value={serviceSelected}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      >
                        {estab.services.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Week nav */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                          Date
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setWeekOffset(Math.max(0, weekOffset - 1));
                              setSelectedSlot(null);
                            }}
                            disabled={weekOffset === 0}
                            className="p-1.5 rounded-lg hover:bg-secondary/50 transition disabled:opacity-40"
                          >
                            <ChevronLeft
                              size={14}
                              className="text-muted-foreground"
                            />
                          </button>
                          <button
                            onClick={() => {
                              setWeekOffset(weekOffset + 1);
                              setSelectedSlot(null);
                            }}
                            className="p-1.5 rounded-lg hover:bg-secondary/50 transition"
                          >
                            <ChevronRight
                              size={14}
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
                            disabled={d.slots.length === 0}
                            className={`flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all ${i === selectedDayIdx
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-secondary/70 text-foreground/70"
                              } ${d.slots.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                          >
                            <span className="text-[9px] opacity-70">
                              {DAY_LABELS[d.date.getDay()]}
                            </span>
                            <span className="font-bold text-sm">
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
                      <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                        Créneaux —{" "}
                        <span className="font-normal normal-case">
                          {currentDay.slots.length} disponibles
                        </span>
                      </label>
                      {currentDay.slots.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-3">
                          Aucun créneau ce jour
                        </p>
                      ) : (
                        <div className="grid grid-cols-3 gap-1.5">
                          {currentDay.slots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`py-2.5 rounded-xl text-xs font-semibold transition-all ${selectedSlot === slot
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary/60 text-foreground/80 hover:bg-secondary"
                                }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleBook}
                      disabled={!selectedSlot}
                      className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Calendar size={16} />
                      {!isAuthenticated
                        ? "Se connecter pour réserver"
                        : selectedSlot
                          ? `Confirmer à ${selectedSlot}`
                          : "Choisissez un créneau"}
                    </button>
                  </>
                )}

                <div className="h-px bg-border" />

                {/* Contact info */}
                <div className="space-y-3">
                  <a
                    href={`tel:${estab.phone}`}
                    className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition group"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Téléphone</p>
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                        {estab.phone}
                      </p>
                    </div>
                  </a>
                  {estab.email && (
                    <a
                      href={`mailto:${estab.email}`}
                      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition group"
                    >
                      <div className="w-8 h-8 bg-secondary flex items-center justify-center rounded-lg">
                        <Mail size={14} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                          {estab.email}
                        </p>
                      </div>
                    </a>
                  )}
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
