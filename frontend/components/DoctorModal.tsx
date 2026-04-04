
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import {
  X,
  Star,
  MapPin,
  Video,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  User,
  Award,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  governorate: string;
  distance: number;
  price: number;
  availability: string;
  certified: boolean;
  videoConsultation: boolean;
  imageUrl?: string;
  bio?: string;
  languages?: string[];
  experience?: number;
  education?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

interface DoctorModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

// Generate a week of availability slots per doctor
function generateSlots(doctorId: string) {
  const days: { date: Date; slots: string[] }[] = [];
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
  const seed = parseInt(doctorId, 10) || 1;
  for (let d = 0; d < 7; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    // deterministic pseudo-random slots per day/doctor
    const available = allSlots.filter((_, i) => (i + d + seed) % 3 !== 0);
    days.push({ date, slots: available });
  }
  return days;
}

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

export function DoctorModal({ doctor, isOpen, onClose }: DoctorModalProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"profile" | "rdv">("profile");
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  if (!isOpen || !doctor) return null;

  const allWeekDays = generateSlots(doctor.id);
  // shift by weekOffset * 7 conceptually — just re-use same 7 for simplicity, offset the displayed dates
  const weekDays = allWeekDays.map((d) => {
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
    if (!selectedSlot) return;
    setBooked(true);
    setTimeout(() => {
      setBooked(false);
      setSelectedSlot(null);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[94vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-background border border-border hover:bg-secondary transition"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        {/* Hero */}
        <div
          className={`relative h-48 flex items-center justify-center overflow-hidden ${
            doctor.specialty === "Cardiologie"
              ? "bg-gradient-to-br from-red-50 to-rose-100"
              : doctor.specialty === "Dermatologie"
                ? "bg-gradient-to-br from-peach-50 to-orange-100"
                : doctor.specialty === "Psychiatrie" ||
                    doctor.specialty === "Psychologie"
                  ? "bg-gradient-to-br from-purple-50 to-violet-100"
                  : doctor.specialty === "Pédiatrie"
                    ? "bg-gradient-to-br from-yellow-50 to-amber-100"
                    : "bg-gradient-to-br from-blue-50 to-indigo-100"
          }`}
        >
          {doctor.imageUrl ? (
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg text-5xl">
              👨‍⚕️
            </div>
          )}
          {doctor.certified && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Award size={12} /> Certifié
            </div>
          )}
          {doctor.videoConsultation && (
            <div className="absolute top-4 right-12 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Video size={12} /> Vidéo
            </div>
          )}
        </div>

        {/* Name + Rating */}
        <div className="px-6 pt-5 pb-3 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Dr. {doctor.name}
              </h2>
              <p className="text-primary font-medium text-sm mt-0.5 flex items-center gap-1">
                <Stethoscope size={14} /> {doctor.specialty}
              </p>
              {doctor.experience && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {doctor.experience} ans d'expérience
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={
                      i < Math.floor(doctor.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }
                  />
                ))}
                <span className="text-sm font-bold text-foreground ml-1">
                  {doctor.rating}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {doctor.reviews} avis
              </p>
              <p className="text-xl font-bold text-primary mt-1">
                {doctor.price} DT
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <button
              onClick={() => setTab("profile")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === "profile"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              Profil
            </button>
            <button
              onClick={() => setTab("rdv")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === "rdv"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
            >
              Prendre RDV
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5">
          {tab === "profile" && (
            <>
              {/* Info row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-primary" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Localisation
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {doctor.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doctor.governorate} • à {doctor.distance} km
                  </p>
                </div>

                <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-green-500" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Disponibilité
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">
                    {doctor.availability}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Prochain créneau
                  </p>
                </div>

                {doctor.education && (
                  <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Formation
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {doctor.education}
                    </p>
                  </div>
                )}

                {doctor.languages && doctor.languages.length > 0 && (
                  <div className="bg-secondary/50 rounded-xl p-3 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-primary" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Langues
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {doctor.languages.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              {/* Bio */}
              {doctor.bio && (
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">
                    À propos
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-3 italic">
                    {doctor.bio}
                  </p>
                </div>
              )}

              {/* Map */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" /> Localisation sur
                  la carte
                </h4>
                <div className="rounded-xl overflow-hidden border border-border h-48">
                  <iframe
                    title={`Carte ${doctor.name}`}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=9.5%2C33.5%2C11.0%2C37.5&layer=mapnik&marker=${
                      doctor.lat ?? 36.8065
                    }%2C${doctor.lng ?? 10.1815}`}
                    style={{ border: 0 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <MapPin size={11} />{" "}
                  {doctor.address ??
                    doctor.location + ", " + doctor.governorate + ", Tunisie"}
                </p>
              </div>

              {/* CTA */}
              <button
                onClick={() => setTab("rdv")}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Prendre rendez-vous
              </button>
            </>
          )}

          {tab === "rdv" && (
            <>
              {booked ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle size={36} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    Rendez-vous confirmé !
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Votre RDV avec <strong>Dr. {doctor.name}</strong> le{" "}
                    <strong>
                      {currentDay.date.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </strong>{" "}
                    à <strong>{selectedSlot}</strong> a été enregistré dans
                    votre tableau de bord.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-base font-bold text-foreground">
                    Choisissez une date
                  </h3>

                  {/* Week navigation */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setWeekOffset((w) => Math.max(0, w - 1));
                        setSelectedDayIdx(0);
                        setSelectedSlot(null);
                      }}
                      disabled={weekOffset === 0}
                      className="p-1.5 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 transition"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div className="flex-1 grid grid-cols-7 gap-1">
                      {weekDays.map((d, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedDayIdx(idx);
                            setSelectedSlot(null);
                          }}
                          className={`flex flex-col items-center py-2 px-1 rounded-lg transition text-xs ${
                            selectedDayIdx === idx
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80 text-foreground"
                          }`}
                        >
                          <span className="font-medium">
                            {DAY_LABELS[d.date.getDay()]}
                          </span>
                          <span className="font-bold text-sm">
                            {d.date.getDate()}
                          </span>
                          <span className="opacity-70">
                            {MONTH_LABELS[d.date.getMonth()]}
                          </span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        setWeekOffset((w) => w + 1);
                        setSelectedDayIdx(0);
                        setSelectedSlot(null);
                      }}
                      className="p-1.5 rounded-lg border border-border hover:bg-secondary transition"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Time slots */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                      <Clock size={14} className="text-primary" />
                      Créneaux disponibles —{" "}
                      {currentDay.date.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h4>
                    {currentDay.slots.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4 text-center">
                        Aucun créneau disponible ce jour.
                      </p>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {currentDay.slots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            className={`py-2 rounded-lg text-sm font-medium border transition ${
                              selectedSlot === slot
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-secondary border-border text-foreground hover:border-primary hover:bg-primary/5"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary + Book */}
                  {selectedSlot && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                      <p className="text-sm text-foreground">
                        <strong>Dr. {doctor.name}</strong> —{" "}
                        {currentDay.date.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        à <strong>{selectedSlot}</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Tarif :{" "}
                        <strong className="text-primary">
                          {doctor.price} DT
                        </strong>
                      </p>
                      <button
                        onClick={handleBook}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <Calendar size={18} />
                        {isAuthenticated
                          ? "Confirmer le rendez-vous"
                          : "Se connecter pour confirmer"}
                      </button>
                      {!isAuthenticated && (
                        <p className="text-xs text-center text-muted-foreground">
                          Vous serez redirigé vers la page de connexion.
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
