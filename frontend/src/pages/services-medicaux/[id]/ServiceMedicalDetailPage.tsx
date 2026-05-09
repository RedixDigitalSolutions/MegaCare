import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Phone,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Building2,
  Shield,
  Users,
  Mail,
  Award,
  Stethoscope,
  Activity,
  AlertCircle,
  BedDouble,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MedicalEstablishment {
  id: string;
  name: string;
  type: "Clinique" | "Hospitalisation À Domicile" | "Centre médical" | string;
  governorate: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  rating: number;
  reviews: number;
  price: number;
  services: string[];
  accredited: boolean;
  emergencies: boolean;
  imageUrl: string;
  description: string;
  beds?: number;
  doctors?: number;
  founded?: number;
  mapUrl?: string;
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const typeColors: Record<string, string> = {
  Clinique: "bg-blue-500/20 text-blue-100 border border-blue-400/30",
  "Hospitalisation À Domicile": "bg-emerald-500/20 text-emerald-100 border border-emerald-400/30",
  "Centre médical": "bg-amber-500/20 text-amber-100 border border-amber-400/30",
};

// ─── Booking helpers ──────────────────────────────────────────────────────────
const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_LABELS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

/** Returns "YYYY-MM-DD" using the user's LOCAL timezone (avoids UTC off-by-one). */
function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildWeekDates(offset: number) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    // Start from tomorrow — today and past dates are not bookable
    d.setDate(d.getDate() + 1 + offset * 7 + i);
    return d;
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ServiceMedicalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [estab, setEstab] = useState<MedicalEstablishment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    fetch(`/api/public/establishments/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { setEstab(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  // Slot state: map of dateStr → { available, booked, blocked }
  type DaySlots = { available: string[]; booked: string[]; blocked: string[] };
  const [slotMap, setSlotMap] = useState<Record<string, DaySlots>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  const weekDates = buildWeekDates(weekOffset);

  // When the week changes, auto-select the first bookable (non-Sunday) day
  useEffect(() => {
    const firstIdx = weekDates.findIndex((d) => d.getDay() !== 0);
    setSelectedDayIdx(firstIdx >= 0 ? firstIdx : 0);
    setSelectedSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  // Fetch slots for the whole visible week whenever week or estab changes
  useEffect(() => {
    if (!estab) return;
    let cancelled = false;
    setSelectedSlot(null);
    setLoadingSlots(true);
    Promise.all(
      weekDates.map(async (d) => {
        const ds = toDateStr(d);
        try {
          const r = await fetch(`/api/public/establishments/${estab.id}/slots?date=${ds}`);
          const data = r.ok ? await r.json() : { available: [], booked: [], blocked: [] };
          return [ds, {
            available: (data.available ?? data.slots ?? []) as string[],
            booked: (data.booked ?? []) as string[],
            blocked: (data.blocked ?? []) as string[],
          }] as const;
        } catch {
          return [ds, { available: [], booked: [], blocked: [] }] as const;
        }
      })
    ).then((results) => {
      if (!cancelled) {
        setSlotMap(Object.fromEntries(results));
        setLoadingSlots(false);
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estab?.id, weekOffset]);

  const currentDate = weekDates[selectedDayIdx];
  const currentDaySlots = slotMap[toDateStr(currentDate)] ?? { available: [], booked: [], blocked: [] };
  // Only available slots are shown to patients; booked and admin-blocked slots are hidden
  const currentAvailable = currentDaySlots.available;

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header forceOpaque />
      <main className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Chargement…</p>
        </div>
      </main>
      <Footer />
    </div>
  );

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!estab) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header forceOpaque />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Building2 size={28} className="text-muted-foreground/50" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Établissement introuvable</h1>
          <p className="text-muted-foreground text-sm mb-6">Cet établissement n'existe pas ou n'est plus disponible.</p>
          <Link to="/services-medicaux" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition">
            <ArrowLeft size={15} /> Retour à la liste
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  const handleBook = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!selectedSlot) return;
    setBooking(true);
    setBookError(null);
    try {
      const token = localStorage.getItem("megacare_token");
      const r = await fetch(`/api/public/establishments/${estab.id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          service: estab.services[0] ?? "",
          date: toDateStr(currentDate),
          time: selectedSlot,
          notes: noteText.trim(),
        }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setBookError(d.message || "Erreur lors de la réservation");
        return;
      }
      setBooked(true);
      // Remove the booked slot from local state to prevent re-booking
      const ds = toDateStr(currentDate);
      setSlotMap((prev) => {
        const prevDay = prev[ds] ?? { available: [], booked: [], blocked: [] };
        return {
          ...prev,
          [ds]: {
            available: prevDay.available.filter((s) => s !== selectedSlot),
            booked: [...prevDay.booked, selectedSlot!],
            blocked: prevDay.blocked,
          },
        };
      });
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header forceOpaque />

      <main className="flex-1 pt-16">
        {/* ══════════════════════════════════════════════════════════════════
            HERO — full-width banner, navbar is always opaque on this page
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative h-[380px] md:h-[460px] overflow-hidden bg-gray-900">
          {/* Banner image */}
          {!imgError && estab.imageUrl ? (
            <img
              src={estab.imageUrl}
              alt={estab.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10" />
          )}

          {/* Gradient overlay — strong bottom gradient so text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Establishment info overlaid at bottom of hero */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
            {/* Badges row */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${typeColors[estab.type] ?? "bg-white/20 text-white border border-white/30"}`}>
                {estab.type}
              </span>
              {estab.emergencies && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-500/25 text-red-200 border border-red-400/30 backdrop-blur-sm flex items-center gap-1.5">
                  <AlertCircle size={11} />
                  Urgences 24h/24
                </span>
              )}
              {estab.accredited && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm flex items-center gap-1.5">
                  <Shield size={11} />
                  Accrédité
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
              {estab.name}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <MapPin size={14} className="shrink-0" />
                <span>{estab.city}, {estab.governorate}</span>
              </div>
              {estab.founded && (
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Award size={13} className="shrink-0" />
                  <span>Fondé en {estab.founded}</span>
                </div>
              )}
              {estab.doctors != null && estab.doctors > 0 && (
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <Users size={13} className="shrink-0" />
                  <span>{estab.doctors} médecins</span>
                </div>
              )}
              {estab.beds != null && estab.beds > 0 && (
                <div className="flex items-center gap-1.5 text-white/70 text-sm">
                  <BedDouble size={13} className="shrink-0" />
                  <span>{estab.beds} lits</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════════════
            BODY — two-column layout
        ══════════════════════════════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-6">

              {/* À propos */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><Building2 size={14} className="text-primary" /></div>
                  <h2 className="font-bold text-foreground text-base">À propos</h2>
                </div>
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {estab.description}
                  </p>

                  {/* Stats grid */}
                  {(estab.founded || (estab.doctors && estab.doctors > 0) || (estab.beds && estab.beds > 0) || estab.accredited || estab.emergencies) && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {estab.founded && (
                        <div className="text-center p-4 bg-secondary/40 rounded-xl">
                          <p className="text-xl font-bold text-foreground">{estab.founded}</p>
                          <p className="text-xs text-muted-foreground mt-1">Fondé en</p>
                        </div>
                      )}
                      {estab.doctors != null && estab.doctors > 0 && (
                        <div className="text-center p-4 bg-secondary/40 rounded-xl">
                          <p className="text-xl font-bold text-foreground">{estab.doctors}</p>
                          <p className="text-xs text-muted-foreground mt-1">Médecins</p>
                        </div>
                      )}
                      {estab.beds != null && estab.beds > 0 && (
                        <div className="text-center p-4 bg-secondary/40 rounded-xl">
                          <p className="text-xl font-bold text-foreground">{estab.beds}</p>
                          <p className="text-xs text-muted-foreground mt-1">Lits</p>
                        </div>
                      )}
                      {estab.accredited && (
                        <div className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          <Shield size={18} className="text-emerald-600 dark:text-emerald-400 mb-1" />
                          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Accrédité</p>
                          <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/70">National</p>
                        </div>
                      )}
                      {estab.emergencies && (
                        <div className="flex flex-col items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                          <AlertCircle size={18} className="text-red-600 dark:text-red-400 mb-1" />
                          <p className="text-xs font-semibold text-red-700 dark:text-red-300">Urgences</p>
                          <p className="text-[11px] text-red-600/70 dark:text-red-400/70">24h/24</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact row */}
                  <div className="flex flex-wrap gap-4 pt-1 border-t border-border">
                    <a href={`tel:${estab.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Phone size={14} className="text-primary shrink-0" />
                      {estab.phone}
                    </a>
                    {estab.email && (
                      <a href={`mailto:${estab.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Mail size={14} className="shrink-0" />
                        {estab.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-bold text-foreground text-base flex items-center gap-2">
                    <Stethoscope size={16} className="text-primary" />
                    Services disponibles
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {estab.services.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary/[0.08] text-primary text-sm font-medium rounded-xl border border-primary/[0.15] hover:bg-primary/[0.12] transition-colors"
                      >
                        <Activity size={12} className="shrink-0" />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Localisation */}
              {estab.mapUrl && (
                <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">Localisation</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{estab.address || estab.city}</p>
                    </div>
                  </div>
                  <a
                    href={estab.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition shrink-0"
                  >
                    <ExternalLink size={14} />Voir la localisation
                  </a>
                </div>
              )}
            </div>

            {/* ── RIGHT COLUMN: Booking widget ──────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border border-border overflow-hidden sticky top-24">

                {/* Header */}
                <div className="px-5 pt-5 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm leading-tight">{estab.name}</p>
                      <p className="text-xs text-muted-foreground">{estab.city}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-5">
                  {booked ? (
                    /* ── Success confirmation ── */
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="text-emerald-500" size={32} />
                      </div>
                      <h3 className="font-bold text-foreground text-lg mb-1">RDV confirmé !</h3>
                      <p className="text-sm font-medium text-foreground mb-0.5">
                        {DAY_LABELS[currentDate.getDay()]} {currentDate.getDate()} {MONTH_LABELS[currentDate.getMonth()]} · {selectedSlot}
                      </p>
                      <p className="text-xs text-muted-foreground mb-6">{estab.name}</p>
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3 mb-5 text-left">
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                          Votre demande est en attente de confirmation par l'établissement. Vous serez notifié par téléphone.
                        </p>
                      </div>
                      <button
                        onClick={() => { setBooked(false); setSelectedSlot(null); setNoteText(""); }}
                        className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition"
                      >
                        Prendre un autre RDV
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* ── Date picker ─────────────────────────────────── */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            Choisir une date
                          </label>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                              disabled={weekOffset === 0}
                              className="p-1.5 rounded-lg hover:bg-secondary/50 transition disabled:opacity-30"
                              aria-label="Semaine précédente"
                            >
                              <ChevronLeft size={14} className="text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => setWeekOffset((w) => w + 1)}
                              className="p-1.5 rounded-lg hover:bg-secondary/50 transition"
                              aria-label="Semaine suivante"
                            >
                              <ChevronRight size={14} className="text-muted-foreground" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                          {weekDates.map((d, i) => {
                            const ds = toDateStr(d);
                            const isSunday = d.getDay() === 0;
                            const daySlots = slotMap[ds] ?? { available: [], booked: [], blocked: [] };
                            const hasAvailable = daySlots.available.length > 0;
                            const isActive = i === selectedDayIdx;
                            return (
                              <button
                                key={i}
                                onClick={() => { if (!isSunday && !loadingSlots) { setSelectedDayIdx(i); setSelectedSlot(null); } }}
                                disabled={isSunday || loadingSlots || !hasAvailable}
                                title={isSunday ? "Fermé le dimanche" : !hasAvailable && !loadingSlots ? "Complet" : undefined}
                                className={`flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all
                                  ${isSunday
                                    ? "opacity-25 cursor-not-allowed text-foreground/50"
                                    : isActive
                                      ? "bg-primary text-primary-foreground shadow-sm"
                                      : !hasAvailable && !loadingSlots
                                        ? "opacity-35 cursor-not-allowed text-foreground/40"
                                        : "hover:bg-secondary/70 text-foreground/70 cursor-pointer"
                                  }`}
                              >
                                <span className="text-[9px] opacity-70 font-medium">{DAY_LABELS[d.getDay()]}</span>
                                <span className="font-bold text-sm mt-0.5">{d.getDate()}</span>
                                <span className="text-[9px] opacity-60">{MONTH_LABELS[d.getMonth()]}</span>
                                {!isSunday && !loadingSlots && hasAvailable && !isActive && (
                                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-0.5" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Selected date pill */}
                        {currentDate && (
                          <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1.5 bg-primary/[0.07] rounded-lg">
                            <Calendar size={11} className="text-primary shrink-0" />
                            <p className="text-xs text-primary font-medium">
                              {DAY_LABELS[currentDate.getDay()]} {currentDate.getDate()} {MONTH_LABELS[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* ── Time slots ──────────────────────────────────── */}
                      <div>
                        <div className="flex items-center justify-between mb-2.5">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            Horaire
                          </label>
                          {!loadingSlots && currentAvailable.length > 0 && (
                            <span className="text-[10px] text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
                              {currentAvailable.length} créneau{currentAvailable.length > 1 ? "x" : ""} libre{currentAvailable.length > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        {loadingSlots ? (
                          <div className="flex justify-center py-6">
                            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                          </div>
                        ) : currentAvailable.length === 0 ? (
                          <div className="flex flex-col items-center py-5 text-center">
                            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center mb-2">
                              <Calendar size={14} className="text-muted-foreground/60" />
                            </div>
                            <p className="text-xs text-muted-foreground">Aucun créneau disponible ce jour</p>
                            <p className="text-[10px] text-muted-foreground/70 mt-0.5">Essayez une autre date</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5">
                            {currentAvailable.map((slot) => {
                              const isSelected = selectedSlot === slot;
                              return (
                                <button
                                  key={slot}
                                  onClick={() => setSelectedSlot(isSelected ? null : slot)}
                                  className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${isSelected
                                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                      : "bg-secondary/50 text-foreground/80 border-border/40 hover:bg-secondary hover:border-border cursor-pointer"
                                    }`}
                                >
                                  {slot}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* ── Note (optional) ──────────────────────────────── */}
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                          Note <span className="font-normal normal-case text-muted-foreground/70">(facultatif)</span>
                        </label>
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Décrivez votre motif de consultation…"
                          rows={2}
                          maxLength={500}
                          className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                        />
                      </div>

                      {/* ── Error message ───────────────────────────────── */}
                      {bookError && (
                        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                          <AlertCircle size={14} className="text-destructive shrink-0 mt-0.5" />
                          <p className="text-xs text-destructive leading-relaxed">{bookError}</p>
                        </div>
                      )}

                      {/* ── Confirm button ──────────────────────────────── */}
                      <button
                        onClick={handleBook}
                        disabled={!selectedSlot || booking}
                        className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {booking ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Réservation en cours…
                          </>
                        ) : !isAuthenticated ? (
                          <>
                            <Calendar size={15} />
                            Se connecter pour réserver
                          </>
                        ) : selectedSlot ? (
                          <>
                            <CheckCircle size={15} />
                            Confirmer — {selectedSlot}
                          </>
                        ) : (
                          <>
                            <Calendar size={15} />
                            Sélectionnez un horaire
                          </>
                        )}
                      </button>

                      {/* Auth nudge */}
                      {!isAuthenticated && (
                        <p className="text-[10px] text-muted-foreground text-center -mt-2">
                          Vous devez être connecté pour prendre un rendez-vous.
                        </p>
                      )}
                    </>
                  )}

                  {/* ── Contact shortcuts ───────────────────────────────── */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <a
                      href={`tel:${estab.phone}`}
                      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition group"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Phone size={14} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">Téléphone</p>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition truncate">{estab.phone}</p>
                      </div>
                    </a>
                    {estab.email && (
                      <a
                        href={`mailto:${estab.email}`}
                        className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition group"
                      >
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                          <Mail size={14} className="text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-muted-foreground">Email</p>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition truncate">{estab.email}</p>
                        </div>
                      </a>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">Adresse</p>
                        <p className="text-sm font-medium text-foreground truncate">{estab.address}</p>
                      </div>
                    </div>
                  </div>
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
