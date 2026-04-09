import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  MapPin,
  Star,
  X,
  Clock,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Activity,
  SlidersHorizontal,
  FlaskConical,
  Eye,
  Upload,
  FileText,
  Shield,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LabCenter {
  id: string;
  name: string;
  type: "Laboratoire" | "Radiologie" | "Mixte";
  governorate: string;
  city: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  cnam: boolean; // conventionné CNAM
  resultDelay: string; // e.g. "24h", "2–3 jours"
  exams: string[]; // exams phares displayed on card
  allExamTypes: string[]; // for filter matching
  priceFrom: number; // tarif indicatif (TND)
  imageUrl: string;
  description: string;
  open24h?: boolean;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const labs: LabCenter[] = [
  {
    id: "1",
    name: "Laboratoire Pasteur Tunis",
    type: "Laboratoire",
    governorate: "Tunis",
    city: "Tunis Centre",
    address: "Avenue de la Liberté, Tunis",
    phone: "+216 71 283 400",
    rating: 4.9,
    reviews: 428,
    cnam: true,
    resultDelay: "24h",
    exams: ["NFS", "Glycémie à jeun", "Bilan hépatique", "TSH", "CRP"],
    allExamTypes: ["Biologie", "Hématologie", "Endocrinologie"],
    priceFrom: 12,
    imageUrl:
      "https://images.unsplash.com/photo-1578496480157-697fc14d2e55?w=800&fit=crop&q=80",
    description:
      "Laboratoire de référence au cœur de Tunis, accrédité ISO 15189. Résultats disponibles en ligne sous 24h.",
  },
  {
    id: "2",
    name: "Centre d'Imagerie Ibn Sina",
    type: "Radiologie",
    governorate: "Tunis",
    city: "La Marsa",
    address: "Avenue Tahar Sfar, La Marsa, Tunis",
    phone: "+216 71 748 200",
    rating: 4.8,
    reviews: 317,
    cnam: true,
    resultDelay: "2–3h",
    exams: ["IRM 3T", "Scanner", "Échographie", "Mammographie", "Radio"],
    allExamTypes: ["Imagerie", "IRM", "Scanner", "Échographie"],
    priceFrom: 80,
    imageUrl:
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=800&fit=crop&q=80",
    description:
      "Centre d'imagerie médicale équipé de l'IRM 3 Tesla dernière génération et d'un scanner 128 coupes.",
  },
  {
    id: "3",
    name: "BioMédical Lac",
    type: "Mixte",
    governorate: "Tunis",
    city: "Les Berges du Lac",
    address: "Immeuble Médical B1, Lac 2, Tunis",
    phone: "+216 71 965 300",
    rating: 4.7,
    reviews: 214,
    cnam: true,
    resultDelay: "4h",
    exams: ["NFS", "Bilan lipidique", "Échographie", "Radio pulmonaire", "PCR"],
    allExamTypes: ["Biologie", "Imagerie", "Microbiologie"],
    priceFrom: 15,
    imageUrl:
      "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=800&fit=crop&q=80",
    description:
      "Centre médico-biologique complet aux Berges du Lac. Analyses et imagerie sous le même toit.",
  },
  {
    id: "4",
    name: "Labo Analyses Sfax Central",
    type: "Laboratoire",
    governorate: "Sfax",
    city: "Sfax",
    address: "Rue Habib Maazoun, Sfax",
    phone: "+216 74 227 100",
    rating: 4.6,
    reviews: 189,
    cnam: true,
    resultDelay: "24h",
    exams: ["NFS", "Urée-Créatinine", "Ionogramme", "Hémoculture", "ECBU"],
    allExamTypes: ["Biologie", "Microbiologie", "Hématologie"],
    priceFrom: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&fit=crop&q=80",
    description:
      "Principal laboratoire privé de Sfax. Accrédité COFRAC, résultats disponibles par email et sur l'application.",
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
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&fit=crop&q=80",
    description:
      "Centre de radiologie avec IRM 1.5T, scanner multi-coupes et système de téléradiologie.",
  },
  {
    id: "6",
    name: "BioLis Nabeul",
    type: "Laboratoire",
    governorate: "Nabeul",
    city: "Nabeul",
    address: "Avenue Habib Bourguiba, Nabeul",
    phone: "+216 72 285 500",
    rating: 4.4,
    reviews: 97,
    cnam: true,
    resultDelay: "24–48h",
    exams: ["Glycémie", "Cholestérol", "NFS", "Sérologie", "Coagulation"],
    allExamTypes: ["Biologie", "Hématologie", "Sérologie"],
    priceFrom: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&fit=crop&q=80",
    description:
      "Laboratoire chaleureux et réactif à Nabeul, avec accueil sans rendez-vous et résultats rapides.",
  },
  {
    id: "7",
    name: "Centre Imagerie Monastir",
    type: "Mixte",
    governorate: "Monastir",
    city: "Monastir",
    address: "Rue Hussein Ben Ali, Monastir",
    phone: "+216 73 462 200",
    rating: 4.6,
    reviews: 133,
    cnam: true,
    resultDelay: "2h",
    exams: ["IRM", "Scanner", "Scintigraphie", "NFS", "PCR"],
    allExamTypes: ["Imagerie", "IRM", "Biologie", "Médecine nucléaire"],
    priceFrom: 25,
    imageUrl:
      "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&fit=crop&q=80",
    description:
      "Centre médical complet à Monastir combinant biologie médicale et imagerie de pointe.",
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
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&fit=crop&q=80",
    description:
      "Premier centre de radiologie de la région Sud avec scanner et échographie doppler couleur.",
  },
  {
    id: "9",
    name: "Labo Bizerte Bio",
    type: "Laboratoire",
    governorate: "Bizerte",
    city: "Bizerte",
    address: "Avenue de la République, Bizerte",
    phone: "+216 72 433 600",
    rating: 4.5,
    reviews: 108,
    cnam: true,
    resultDelay: "24h",
    exams: ["NFS", "Bilan rénal", "Bilan thyroïdien", "ECBU", "HbA1c"],
    allExamTypes: ["Biologie", "Endocrinologie", "Microbiologie"],
    priceFrom: 10,
    imageUrl:
      "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?w=800&fit=crop&q=80",
    description:
      "Laboratoire moderne à Bizerte avec équipements automatisés et résultats disponibles en 24h.",
  },
];

const tunisianGovernorates = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Sousse",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];

const examTypeOptions = [
  "Biologie",
  "Hématologie",
  "Microbiologie",
  "Sérologie",
  "Endocrinologie",
  "Imagerie",
  "IRM",
  "Scanner",
  "Échographie",
  "Radiographie",
  "Médecine nucléaire",
];

const labTypes = ["Laboratoire", "Radiologie", "Mixte"] as const;

const typeColors: Record<string, string> = {
  Laboratoire: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Radiologie: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  Mixte: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
};

const typeIcons: Record<string, React.ReactNode> = {
  Laboratoire: <FlaskConical size={12} className="inline mr-1" />,
  Radiologie: <Eye size={12} className="inline mr-1" />,
  Mixte: <Activity size={12} className="inline mr-1" />,
};

// ─── Ordre Ordonnance Modal ────────────────────────────────────────────────────
function OrdonnanceModal({
  lab,
  onClose,
}: {
  lab: LabCenter;
  onClose: () => void;
}) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <FileText className="text-violet-500" size={20} />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">
                Envoyer une ordonnance
              </p>
              <p className="text-xs text-muted-foreground">{lab.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 px-5 pt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  step >= s
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 flex-1 rounded transition-colors ${
                    step > s ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between px-4 mt-1 mb-2">
          <span className="text-[10px] text-muted-foreground">Centre</span>
          <span className="text-[10px] text-muted-foreground">Upload</span>
          <span className="text-[10px] text-muted-foreground">
            Confirmation
          </span>
        </div>

        <div className="p-5">
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-secondary/40 border border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FlaskConical className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {lab.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin size={10} /> {lab.city}, {lab.governorate}
                  </p>
                </div>
                <CheckCircle size={18} className="text-emerald-500 ml-auto" />
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
              >
                Confirmer ce centre →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Téléversez une photo ou un scan de votre ordonnance médicale.
              </p>
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
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${
                  drag
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => document.getElementById("ord-input")?.click()}
              >
                <Upload
                  size={28}
                  className="mx-auto mb-3 text-muted-foreground"
                />
                {file ? (
                  <p className="text-sm font-medium text-foreground">
                    {file.name}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      Glisser-déposer ou cliquer pour importer
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, PDF — max 10 Mo
                    </p>
                  </>
                )}
                <input
                  id="ord-input"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFile(f);
                  }}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition"
                >
                  Retour
                </button>
                <button
                  onClick={handleSend}
                  disabled={!file}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Envoyer
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald-500" size={30} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                Ordonnance envoyée !
              </h3>
              <p className="text-sm text-muted-foreground mb-1">
                {lab.name} a reçu votre ordonnance.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Résultats disponibles sous <strong>{lab.resultDelay}</strong>.
                Vous serez notifié.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Booking Modal ─────────────────────────────────────────────────────────────
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

function BookingModal({
  lab,
  onClose,
}: {
  lab: LabCenter;
  onClose: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedExam, setSelectedExam] = useState(lab.exams[0]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [booked, setBooked] = useState(false);

  const allDays = generateSlots(lab.id);
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FlaskConical className="text-primary" size={20} />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">
                {lab.name}
              </p>
              <p className="text-xs text-muted-foreground">{lab.city}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {booked ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-500" size={30} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Rendez-vous confirmé !
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {DAY_LABELS[currentDay.date.getDay()]} {currentDay.date.getDate()}{" "}
              {MONTH_LABELS[currentDay.date.getMonth()]} à {selectedSlot}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {selectedExam} · {lab.name}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
            >
              Fermer
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Examen
              </label>
              <select
                value={selectedExam}
                onChange={(e) => setSelectedExam(e.target.value)}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {lab.exams.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-foreground">
                  Choisir une date
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
                    <ChevronLeft size={16} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => {
                      setWeekOffset(weekOffset + 1);
                      setSelectedSlot(null);
                    }}
                    className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <ChevronRight size={16} className="text-muted-foreground" />
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
                    className={`flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all ${
                      i === selectedDayIdx
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

            <div>
              <label className="text-sm font-semibold text-foreground block mb-3">
                Créneaux disponibles
                <span className="font-normal text-muted-foreground ml-2">
                  ({currentDay.slots.length} disponibles)
                </span>
              </label>
              {currentDay.slots.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun créneau ce jour
                </p>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {currentDay.slots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all text-center ${
                        selectedSlot === slot
                          ? "bg-primary text-primary-foreground shadow-sm"
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
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Calendar size={16} />
              Confirmer le rendez-vous
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Lab Card ─────────────────────────────────────────────────────────────────
function LabCard({
  lab,
  onBook,
  onOrdonnance,
}: {
  lab: LabCenter;
  onBook: (l: LabCenter) => void;
  onOrdonnance: (l: LabCenter) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={lab.imageUrl}
          alt={lab.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${typeColors[lab.type]}`}
          >
            {typeIcons[lab.type]}
            {lab.type}
          </span>
          {lab.cnam && (
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent/90 text-accent-foreground flex items-center gap-1">
              <Shield size={10} /> CNAM
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-white font-bold text-sm">
            {lab.rating.toFixed(1)}
          </span>
          <span className="text-white/70 text-xs">({lab.reviews} avis)</span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-bold text-foreground text-base leading-tight">
            {lab.name}
          </h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin size={11} /> {lab.city}, {lab.governorate}
          </p>
        </div>

        {/* Exams pills */}
        <div className="flex flex-wrap gap-1.5">
          {lab.exams.slice(0, 4).map((ex) => (
            <span
              key={ex}
              className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/70 text-foreground/80"
            >
              {ex}
            </span>
          ))}
          {lab.exams.length > 4 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/70 text-muted-foreground">
              +{lab.exams.length - 4}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={12} /> Résultats : {lab.resultDelay}
          </span>
          <span className="font-semibold text-foreground">
            À partir de{" "}
            <span className="text-primary">{lab.priceFrom} TND</span>
          </span>
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-2">
          <Link
            to={`/labos-radiologie/${lab.id}`}
            className="flex-1 py-2.5 text-center text-xs font-semibold border border-border rounded-xl hover:bg-secondary/50 transition text-foreground"
          >
            Voir détails
          </Link>
          <button
            onClick={() => onOrdonnance(lab)}
            className="flex-1 py-2.5 text-xs font-semibold border border-primary/40 rounded-xl hover:bg-primary/5 transition text-primary flex items-center justify-center gap-1"
          >
            <Upload size={13} /> Ordonnance
          </button>
          <button
            onClick={() => onBook(lab)}
            className="flex-1 py-2.5 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
          >
            RDV
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({
  selectedTypes,
  toggleType,
  selectedGov,
  setSelectedGov,
  selectedExamTypes,
  toggleExamType,
  cnamOnly,
  setCnamOnly,
  onReset,
}: {
  selectedTypes: string[];
  toggleType: (t: string) => void;
  selectedGov: string;
  setSelectedGov: (g: string) => void;
  selectedExamTypes: string[];
  toggleExamType: (e: string) => void;
  cnamOnly: boolean;
  setCnamOnly: (v: boolean) => void;
  onReset: () => void;
}) {
  return (
    <aside className="space-y-6">
      {/* Type */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">
          Type de centre
        </h4>
        {labTypes.map((t) => (
          <label
            key={t}
            className="flex items-center gap-2 mb-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(t)}
              onChange={() => toggleType(t)}
              className="rounded border-border accent-primary"
            />
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition">
              {t}
            </span>
          </label>
        ))}
      </div>

      {/* Gouvernorat */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">Gouvernorat</h4>
        <select
          value={selectedGov}
          onChange={(e) => setSelectedGov(e.target.value)}
          className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Tous les gouvernorats</option>
          {tunisianGovernorates.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Type d'examen */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">
          Type d'examen
        </h4>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {examTypeOptions.map((ex) => (
            <label
              key={ex}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedExamTypes.includes(ex)}
                onChange={() => toggleExamType(ex)}
                className="rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition">
                {ex}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* CNAM */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">Conventionné</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => setCnamOnly(!cnamOnly)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
              cnamOnly ? "bg-primary" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                cnamOnly ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-sm text-foreground/80">CNAM uniquement</span>
        </label>
      </div>

      <button
        onClick={onReset}
        className="w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition"
      >
        Réinitialiser les filtres
      </button>
    </aside>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LabosRadiologiePage() {
  const [query, setQuery] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExamTypes, setSelectedExamTypes] = useState<string[]>([]);
  const [cnamOnly, setCnamOnly] = useState(false);
  const [sort, setSort] = useState<"rating" | "price" | "name">("rating");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [bookingLab, setBookingLab] = useState<LabCenter | null>(null);
  const [ordonnanceLab, setOrdonnanceLab] = useState<LabCenter | null>(null);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string | null>(null);

  const toggleType = (t: string) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const toggleExamType = (e: string) =>
    setSelectedExamTypes((prev) =>
      prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e],
    );

  const resetFilters = () => {
    setQuery("");
    setSelectedGov("");
    setSelectedTypes([]);
    setSelectedExamTypes([]);
    setCnamOnly(false);
    setSort("rating");
    setActiveTypeFilter(null);
  };

  const filtered = useMemo(() => {
    let result = [...labs];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q) ||
          l.exams.some((e) => e.toLowerCase().includes(q)),
      );
    }
    if (selectedGov)
      result = result.filter((l) => l.governorate === selectedGov);
    if (selectedTypes.length > 0)
      result = result.filter((l) => selectedTypes.includes(l.type));
    if (activeTypeFilter)
      result = result.filter((l) => l.type === activeTypeFilter);
    if (selectedExamTypes.length > 0)
      result = result.filter((l) =>
        selectedExamTypes.some((et) => l.allExamTypes.includes(et)),
      );
    if (cnamOnly) result = result.filter((l) => l.cnam);

    if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sort === "price") result.sort((a, b) => a.priceFrom - b.priceFrom);
    else result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [
    query,
    selectedGov,
    selectedTypes,
    selectedExamTypes,
    cnamOnly,
    sort,
    activeTypeFilter,
  ]);

  const filterProps = {
    selectedTypes,
    toggleType,
    selectedGov,
    setSelectedGov,
    selectedExamTypes,
    toggleExamType,
    cnamOnly,
    setCnamOnly,
    onReset: resetFilters,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Labos & Radiologie</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Trouvez un laboratoire d'analyses ou un centre de radiologie
                partenaire. Prenez rendez-vous ou envoyez votre ordonnance en
                ligne.
              </p>
            </div>
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Examen, centre, ville..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              {[
                { label: "Tous", value: null },
                { label: "🔬 Laboratoire", value: "Laboratoire" },
                { label: "🩻 Radiologie", value: "Radiologie" },
                { label: "⚗️ Mixte", value: "Mixte" },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => setActiveTypeFilter(value)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile filter toggle */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              centre{filtered.length !== 1 ? "s" : ""} trouvé
              {filtered.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition"
            >
              <SlidersHorizontal size={16} />
              Filtres
            </button>
          </div>

          {showMobileFilters && (
            <div className="lg:hidden mb-6 p-6 bg-card border border-border rounded-xl">
              <FilterPanel {...filterProps} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6 sticky top-24">
                <FilterPanel {...filterProps} />
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  centre{filtered.length !== 1 ? "s" : ""} trouvé
                  {filtered.length !== 1 ? "s" : ""}
                </p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="rating">Meilleure note</option>
                  <option value="price">Prix croissant</option>
                  <option value="name">Nom A–Z</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center space-y-4">
                  <FlaskConical
                    size={48}
                    className="mx-auto text-muted-foreground/40"
                  />
                  <p className="text-lg font-medium text-foreground">
                    Aucun centre trouvé
                  </p>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos filtres
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
                  >
                    Réinitialiser
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((lab) => (
                    <LabCard
                      key={lab.id}
                      lab={lab}
                      onBook={setBookingLab}
                      onOrdonnance={setOrdonnanceLab}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {bookingLab && (
        <BookingModal lab={bookingLab} onClose={() => setBookingLab(null)} />
      )}
      {ordonnanceLab && (
        <OrdonnanceModal
          lab={ordonnanceLab}
          onClose={() => setOrdonnanceLab(null)}
        />
      )}

      <Footer />
    </div>
  );
}
