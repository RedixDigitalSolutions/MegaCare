
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import {
  X,
  MapPin,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  User,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  location: string;
  governorate: string;
  delegation?: string;
  distance: number;
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

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_LABELS = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Jun",
  "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc",
];

const ALL_SLOTS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];

// Mon–Fri are working days
const WORKING_DAYS = new Set([1, 2, 3, 4, 5]);

function getWeekDays(offset: number): Date[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset * 7 + i);
    return d;
  });
}

function dateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function DoctorModal({ doctor, isOpen, onClose }: DoctorModalProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"profile" | "rdv">("profile");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [bookedSlots, setBookedSlots] = useState<Record<string, Set<string>>>({});
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [hasPriorConsultation, setHasPriorConsultation] = useState<boolean | null>(null);

  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const weekDays = getWeekDays(weekOffset);
  const currentDay = weekDays[selectedDayIdx];

  // Fetch real booked slots for the current week
  useEffect(() => {
    if (!isOpen || !doctor) return;
    setSlotsLoading(true);
    const from = dateKey(weekDays[0]);
    const to = dateKey(weekDays[6]);
    fetch(`/api/doctors/${doctor.id}/booked-slots?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((data: { date: string; time: string }[]) => {
        const map: Record<string, Set<string>> = {};
        data.forEach(({ date, time }) => {
          if (!map[date]) map[date] = new Set();
          map[date].add(time);
        });
        setBookedSlots(map);
      })
      .catch(() => setBookedSlots({}))
      .finally(() => setSlotsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, doctor?.id, weekOffset]);

  // Check if authenticated patient has a prior completed consultation
  useEffect(() => {
    if (!isOpen || !doctor || !isAuthenticated) {
      setHasPriorConsultation(null);
      return;
    }
    const token = localStorage.getItem("megacare_token");
    if (!token) { setHasPriorConsultation(null); return; }
    fetch("/api/appointments", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((json) => {
        const list = Array.isArray(json) ? json : (json.data ?? []);
        const prior = list.some(
          (a: { doctorId: string; status: string }) =>
            a.doctorId === doctor.id && a.status === "completed",
        );
        setHasPriorConsultation(prior);
      })
      .catch(() => setHasPriorConsultation(null));
  }, [isOpen, doctor?.id, isAuthenticated]);

  if (!isOpen || !doctor) return null;

  const dayKey = dateKey(currentDay);
  const dayBooked = bookedSlots[dayKey] ?? new Set<string>();
  const isWorkingDay = WORKING_DAYS.has(currentDay.getDay());
  const availableSlots = isWorkingDay ? ALL_SLOTS.filter((s) => !dayBooked.has(s)) : [];

  const handleBook = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!selectedSlot) return;
    if (hasPriorConsultation === false) return;
    const token = localStorage.getItem("megacare_token");
    if (!token) { navigate("/login"); return; }
    setBooking(true);
    setBookingError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ doctorId: doctor.id, date: dayKey, time: selectedSlot, reason: "" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur lors de la réservation");
      }
      setBooked(true);
      setTimeout(() => { setBooked(false); setSelectedSlot(null); onClose(); }, 2200);
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setBooking(false);
    }
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
          className="relative h-48 flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5"
        >
          {doctor.imageUrl ? (
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Stethoscope size={40} className="text-primary/60" />
            </div>
          )}
        </div>

        {/* Name + Price */}
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
                    {doctor.delegation ? `${doctor.delegation}, ` : ""}{doctor.governorate}
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
                      {currentDay.toLocaleDateString("fr-FR", {
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
                  {/* Prior consultation notice */}
                  {isAuthenticated && hasPriorConsultation === false && (
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl text-sm">
                      <Info size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-amber-800 dark:text-amber-300">
                          Première consultation physique requise
                        </p>
                        <p className="text-amber-700 dark:text-amber-400 text-xs mt-0.5">
                          Une première consultation en présentiel avec ce médecin est
                          nécessaire avant de prendre un rendez-vous en ligne.
                        </p>
                      </div>
                    </div>
                  )}

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
                          disabled={!WORKING_DAYS.has(d.getDay())}
                          className={`flex flex-col items-center py-2 px-1 rounded-lg transition text-xs disabled:opacity-40 disabled:cursor-not-allowed ${
                            selectedDayIdx === idx
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary hover:bg-secondary/80 text-foreground"
                          }`}
                        >
                          <span className="font-medium">
                            {DAY_LABELS[d.getDay()]}
                          </span>
                          <span className="font-bold text-sm">
                            {d.getDate()}
                          </span>
                          <span className="opacity-70">
                            {MONTH_LABELS[d.getMonth()]}
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
                      {currentDay.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h4>
                    {slotsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 size={24} className="animate-spin text-primary" />
                      </div>
                    ) : !isWorkingDay ? (
                      <p className="text-sm text-muted-foreground italic py-4 text-center">
                        Le médecin ne consulte pas ce jour.
                      </p>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4 text-center">
                        Aucun créneau disponible ce jour.
                      </p>
                    ) : (
                      <div className="grid grid-cols-4 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(slot)}
                            disabled={hasPriorConsultation === false}
                            className={`py-2 rounded-lg text-sm font-medium border transition disabled:opacity-40 disabled:cursor-not-allowed ${
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

                  {/* Error */}
                  {bookingError && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive">
                      <AlertCircle size={16} className="shrink-0" />
                      {bookingError}
                    </div>
                  )}

                  {/* Summary + Book */}
                  {selectedSlot && hasPriorConsultation !== false && (
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3">
                      <p className="text-sm text-foreground">
                        <strong>Dr. {doctor.name}</strong> —{" "}
                        {currentDay.toLocaleDateString("fr-FR", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}{" "}
                        à <strong>{selectedSlot}</strong>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Consultation avec <strong>Dr. {doctor.name}</strong>
                      </p>
                      <button
                        onClick={handleBook}
                        disabled={booking}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                      >
                        {booking ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Calendar size={18} />
                        )}
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
