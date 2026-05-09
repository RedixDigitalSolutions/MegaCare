import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { tunisianGovernorates, allServices, establishmentTypes } from "@/lib/config";
import { DELEGATIONS } from "@/lib/governorates";
import {
  Search,
  MapPin,
  ChevronDown,
  X,
  Phone,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Building2,
  Shield,
  Users,
  Activity,
  SlidersHorizontal,
  Loader2,
  BedDouble,
  Stethoscope,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MedicalEstablishment {
  id: string;
  name: string;
  type: "Clinique" | "Hospitalisation À Domicile" | "Centre médical" | string;
  governorate: string;
  city: string;
  address: string;
  phone: string;
  rating: number;
  reviews: number;
  price: number; // consultation de base en TND
  services: string[];
  accredited: boolean;
  emergencies: boolean;
  imageUrl: string;
  logo?: string;
  description: string;
  beds?: number;
  doctors?: number;
  founded?: number;
}

// ─── (data loaded from API in component) ────────────────────────────────────

const typeColors: Record<string, string> = {
  Clinique: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  "Hospitalisation À Domicile": "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  "Centre médical": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

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

// ─── Booking helpers ──────────────────────────────────────────────────────────
/** Returns "YYYY-MM-DD" using the user's LOCAL timezone (avoids UTC off-by-one). */
function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function buildWeekDates(offset: number) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + 1 + offset * 7 + i);
    return d;
  });
}

// ─── Booking Modal ─────────────────────────────────────────────────────────────
function BookingModal({
  estab,
  onClose,
}: {
  estab: MedicalEstablishment;
  onClose: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  type DaySlots = { available: string[] };
  const [slotMap, setSlotMap] = useState<Record<string, DaySlots>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);

  const weekDates = buildWeekDates(weekOffset);

  // When week changes, pick the first non-Sunday day
  useEffect(() => {
    const firstIdx = weekDates.findIndex((d) => d.getDay() !== 0);
    setSelectedDayIdx(firstIdx >= 0 ? firstIdx : 0);
    setSelectedSlot(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  // Fetch real availability for the whole week from the API
  useEffect(() => {
    let cancelled = false;
    setSelectedSlot(null);
    setLoadingSlots(true);
    Promise.all(
      weekDates.map(async (d) => {
        const ds = toDateStr(d);
        if (d.getDay() === 0) return [ds, { available: [] }] as const; // skip Sundays
        try {
          const r = await fetch(`/api/public/establishments/${estab.id}/slots?date=${ds}`);
          const data = r.ok ? await r.json() : {};
          return [ds, { available: (data.available ?? data.slots ?? []) as string[] }] as const;
        } catch {
          return [ds, { available: [] }] as const;
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
  }, [estab.id, weekOffset]);

  const currentDate = weekDates[selectedDayIdx];
  const currentAvailable = slotMap[toDateStr(currentDate)]?.available ?? [];

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
    } finally {
      setBooking(false);
    }
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
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Calendar className="text-primary" size={18} />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">{estab.name}</p>
              <p className="text-xs text-muted-foreground">{estab.city}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-secondary/50 transition-colors">
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {booked ? (
          /* ── Success ── */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-emerald-500" size={30} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">RDV confirmé !</h3>
            <p className="text-sm font-medium text-foreground mb-0.5">
              {DAY_LABELS[currentDate.getDay()]} {currentDate.getDate()} {MONTH_LABELS[currentDate.getMonth()]} · {selectedSlot}
            </p>
            <p className="text-xs text-muted-foreground mb-5">{estab.name}</p>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3 mb-6 text-left">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Votre demande est en attente de confirmation par l'établissement. Vous serez notifié par téléphone.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition"
            >
              Fermer
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
            {/* ── Date picker ── */}
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
                  const available = slotMap[ds]?.available ?? [];
                  const hasSlots = available.length > 0;
                  const isActive = i === selectedDayIdx;
                  return (
                    <button
                      key={i}
                      onClick={() => { if (!isSunday && !loadingSlots) { setSelectedDayIdx(i); setSelectedSlot(null); } }}
                      disabled={isSunday || loadingSlots || !hasSlots}
                      title={isSunday ? "Fermé le dimanche" : !hasSlots && !loadingSlots ? "Complet" : undefined}
                      className={`flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all
                        ${isSunday
                          ? "opacity-25 cursor-not-allowed text-foreground/50"
                          : isActive
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : !hasSlots && !loadingSlots
                              ? "opacity-35 cursor-not-allowed text-foreground/40"
                              : "hover:bg-secondary/70 text-foreground/70 cursor-pointer"
                        }`}
                    >
                      <span className="text-[9px] opacity-70 font-medium">{DAY_LABELS[d.getDay()]}</span>
                      <span className="font-bold text-sm mt-0.5">{d.getDate()}</span>
                      <span className="text-[9px] opacity-60">{MONTH_LABELS[d.getMonth()]}</span>
                      {!isSunday && !loadingSlots && hasSlots && !isActive && (
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

            {/* ── Time slots ── */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Horaire</label>
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
                <div className="grid grid-cols-4 gap-1.5">
                  {currentAvailable.map((slot) => {
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(isSelected ? null : slot)}
                        className={`py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                          isSelected
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

            {/* ── Note ── */}
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

            {/* ── Error ── */}
            {bookError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertCircle size={14} className="text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive leading-relaxed">{bookError}</p>
              </div>
            )}

            {/* ── Confirm button ── */}
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

            {!isAuthenticated && (
              <p className="text-[10px] text-muted-foreground text-center -mt-2">
                Vous devez être connecté pour prendre un rendez-vous.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Establishment Card ────────────────────────────────────────────────────────
function EstabCard({
  estab,
  onBook,
}: {
  estab: MedicalEstablishment;
  onBook: () => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-primary/8 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={estab.imageUrl}
          alt={estab.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top badges row */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-wrap gap-1.5">
            <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full backdrop-blur-md border border-white/20 ${typeColors[estab.type] ?? "bg-secondary/90 text-foreground"}`}>
              {estab.type}
            </span>
            {estab.emergencies && (
              <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-red-500/90 text-white backdrop-blur-md border border-red-400/30">
                🚨 Urgences
              </span>
            )}
          </div>
          {estab.accredited && (
            <div className="w-8 h-8 bg-white/95 dark:bg-card/95 rounded-full flex items-center justify-center shadow-lg shrink-0" title="Établissement accrédité">
              <Shield className="text-emerald-500" size={14} />
            </div>
          )}
        </div>

        {/* Name + location overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-white text-base leading-snug drop-shadow-md line-clamp-1 mb-0.5">
            {estab.name}
          </h3>
          <div className="flex items-center gap-1 text-white/80 text-xs">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{estab.city}, {estab.governorate}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs">
          {estab.beds && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <BedDouble size={12} />
              <span>{estab.beds} lits</span>
            </div>
          )}
          {estab.doctors && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Stethoscope size={12} />
              <span>{estab.doctors} médecins</span>
            </div>
          )}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1">
          {estab.services.slice(0, 3).map((s) => (
            <span key={s} className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-medium rounded-md">
              {s}
            </span>
          ))}
          {estab.services.length > 3 && (
            <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-[11px] rounded-md font-medium">
              +{estab.services.length - 3}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/services-medicaux/${estab.id}`}
            className="flex-1 py-2.5 border border-border text-foreground rounded-xl text-xs font-semibold text-center hover:bg-secondary/60 transition-colors"
          >
            Voir détails
          </Link>
          <button
            onClick={onBook}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5"
          >
            <Calendar size={12} />
            Prendre RDV
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Partners Strip ────────────────────────────────────────────────────────────
const partners = [
  { name: "Clinique Hannibal", abbr: "CH" },
  { name: "Polyclinique Taoufik", abbr: "PT" },
  { name: "Clinique El Menzah", abbr: "CM" },
  { name: "CHU Farhat Hached", abbr: "FH" },
  { name: "Centre Médical Lac", abbr: "CL" },
  { name: "Clinique Bizerte", abbr: "CB" },
];

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ServicesMediauxPage() {
  const [establishments, setEstablishments] = useState<MedicalEstablishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/public/establishments")
      .then((r) => r.json())
      .then((data) => setEstablishments(Array.isArray(data) ? data : []))
      .catch(() => setEstablishments([]))
      .finally(() => setLoading(false));
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set());
  const [selectedGov, setSelectedGov] = useState("");
  const [selectedDelegation, setSelectedDelegation] = useState("");
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(),
  );
  const [emergenciesOnly, setEmergenciesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"price-asc" | "price-desc" | "name">("name");
  const [showFilters, setShowFilters] = useState(false);
  const [bookingEstab, setBookingEstab] = useState<MedicalEstablishment | null>(
    null,
  );
  const [heroService, setHeroService] = useState("");

  const heroServiceOptions = useMemo(() => {
    let base = establishments;
    if (selectedGov) base = base.filter((e) => e.governorate === selectedGov);
    if (selectedDelegation) base = base.filter((e) => e.city === selectedDelegation);
    const all = new Set<string>();
    base.forEach((e) => e.services.forEach((s) => all.add(s)));
    return [...all].sort();
  }, [establishments, selectedGov, selectedDelegation]);

  const toggleSet = (set: Set<string>, value: string): Set<string> => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    return next;
  };

  const filtered = useMemo(() => {
    let results = establishments.filter((e) => {
      const q = searchQuery.toLowerCase();
      const matchQ =
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.services.some((s) => s.toLowerCase().includes(q));
      const matchType = selectedTypes.size === 0 || selectedTypes.has(e.type);
      const matchGov = !selectedGov || e.governorate === selectedGov;
      const matchDelegation = !selectedDelegation || e.city === selectedDelegation;
      const matchService =
        selectedServices.size === 0 ||
        [...selectedServices].some((s) => e.services.includes(s));
      const matchEmergency = !emergenciesOnly || e.emergencies;
      return (
        matchQ &&
        matchType &&
        matchGov &&
        matchDelegation &&
        matchService &&
        matchEmergency
      );
    });
    results.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
    return results;
  }, [
    establishments,
    searchQuery,
    selectedTypes,
    selectedGov,
    selectedDelegation,
    selectedServices,
    emergenciesOnly,
    sortBy,
  ]);

  const FilterPanel = () => {
    const activeCount = selectedTypes.size + selectedServices.size + (emergenciesOnly ? 1 : 0);
    return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-base flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-primary" />
          Filtres
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-primary text-primary-foreground rounded-full">{activeCount}</span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={() => { setSelectedTypes(new Set()); setSelectedGov(""); setSelectedDelegation(""); setSelectedServices(new Set()); setHeroService(""); setEmergenciesOnly(false); }}
            className="text-xs text-primary hover:underline font-medium"
          >
            Tout effacer
          </button>
        )}
      </div>

      {/* Type d'établissement */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Type d'établissement
        </p>
        <div className="space-y-1">
          {([...establishmentTypes]).map((t) => (
            <label
              key={t}
              className={`flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-lg transition-colors ${selectedTypes.has(t) ? "bg-primary/10" : "hover:bg-secondary/50"}`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selectedTypes.has(t) ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}>
                {selectedTypes.has(t) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
              <span className={`text-sm transition-colors ${selectedTypes.has(t) ? "text-foreground font-medium" : "text-foreground/80 group-hover:text-foreground"}`}>
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Services */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Services
        </p>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
          {allServices.map((s) => (
            <label
              key={s}
              className={`flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-lg transition-colors ${selectedServices.has(s) ? "bg-primary/10" : "hover:bg-secondary/50"}`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selectedServices.has(s) ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}>
                {selectedServices.has(s) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
              <span className={`text-sm transition-colors ${selectedServices.has(s) ? "text-foreground font-medium" : "text-foreground/80 group-hover:text-foreground"}`}>
                {s}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Urgences */}
      <div className="border-t border-border pt-4">
        <label className={`flex items-center gap-3 cursor-pointer px-2 py-2 rounded-lg transition-colors ${emergenciesOnly ? "bg-red-500/10" : "hover:bg-secondary/50"}`}>
          <div
            onClick={() => setEmergenciesOnly(!emergenciesOnly)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${emergenciesOnly ? "bg-red-500" : "bg-secondary"}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${emergenciesOnly ? "translate-x-5" : "translate-x-0.5"}`} />
          </div>
          <span className={`text-sm font-medium ${emergenciesOnly ? "text-red-500" : "text-foreground/80"}`}>
            🚨 Urgences disponibles
          </span>
        </label>
      </div>

      {/* Active filters summary */}
      {(selectedTypes.size > 0 || selectedServices.size > 0) && (
        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Filtres actifs :</p>
          <div className="flex flex-wrap gap-1.5">
            {[...selectedTypes].map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                {t}
                <button onClick={() => setSelectedTypes(toggleSet(selectedTypes, t))} className="hover:text-primary/70">×</button>
              </span>
            ))}
            {[...selectedServices].slice(0, 3).map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                {s}
                <button onClick={() => setSelectedServices(toggleSet(selectedServices, s))} className="hover:text-primary/70">×</button>
              </span>
            ))}
            {selectedServices.size > 3 && (
              <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full">+{selectedServices.size - 3}</span>
            )}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={() => { setSelectedTypes(new Set()); setSelectedGov(""); setSelectedDelegation(""); setSelectedServices(new Set()); setHeroService(""); setEmergenciesOnly(false); }}
        className="w-full px-3 py-2.5 border border-border hover:bg-secondary/80 text-foreground rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
      >
        <X size={13} />
        Réinitialiser les filtres
      </button>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Header Section */}
        <section className="relative overflow-hidden bg-gray-950 py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900 to-indigo-950" />
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(ellipse at 15% 60%, #2563eb 0%, transparent 45%), radial-gradient(ellipse at 85% 15%, #4f46e5 0%, transparent 40%)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-white/70 text-xs font-medium mb-1 backdrop-blur-sm">
                <Building2 size={13} /> Cliniques & Établissements
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Services Médicaux
              </h1>
              <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Cliniques, centres médicaux et HAD — comparez et prenez rendez-vous en ligne.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" size={17} />
              <input
                type="text"
                placeholder="Nom d'établissement, spécialité ou ville…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 backdrop-blur-sm text-sm transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <MapPin size={14} className="text-white/50 shrink-0" />
                <select
                  value={selectedGov}
                  onChange={(e) => { setSelectedGov(e.target.value); setSelectedDelegation(""); setHeroService(""); setSelectedServices(new Set()); }}
                  className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" className="text-foreground bg-gray-900">Toutes les régions</option>
                  {tunisianGovernorates.map((g) => (
                    <option key={g} value={g} className="text-foreground bg-gray-900">{g}</option>
                  ))}
                </select>
              </div>
              {selectedGov && DELEGATIONS[selectedGov] && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                  <MapPin size={13} className="text-white/50 shrink-0" />
                  <select
                    value={selectedDelegation}
                    onChange={(e) => { setSelectedDelegation(e.target.value); setHeroService(""); setSelectedServices(new Set()); }}
                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="" className="text-foreground bg-gray-900">Toutes les délégations</option>
                    {DELEGATIONS[selectedGov].map((d) => (
                      <option key={d} value={d} className="text-foreground bg-gray-900">{d}</option>
                    ))}
                  </select>
                </div>
              )}
              {heroServiceOptions.length > 0 && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                  <Calendar size={13} className="text-white/50 shrink-0" />
                  <select
                    value={heroService}
                    onChange={(e) => { setHeroService(e.target.value); setSelectedServices(e.target.value ? new Set([e.target.value]) : new Set()); }}
                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="" className="text-foreground bg-gray-900">Tous les services</option>
                    {heroServiceOptions.map((s) => (
                      <option key={s} value={s} className="text-foreground bg-gray-900">{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar (desktop) */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-xl border border-border p-5 space-y-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <FilterPanel />
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  établissement{filtered.length !== 1 ? "s" : ""} trouvé
                  {filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-3">
                  {/* Mobile filter toggle */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors"
                  >
                    <SlidersHorizontal size={15} />
                    Filtres
                  </button>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(e.target.value as typeof sortBy)
                      }
                      className="pl-3 pr-8 py-2 bg-input border border-border rounded-lg text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="name">Nom A–Z</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </select>
                    <ChevronDown
                      size={13}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Mobile filters panel */}
              {showFilters && (
                <div className="lg:hidden bg-card border border-border rounded-xl p-6 mb-5">
                  <FilterPanel />
                </div>
              )}

              {loading ? (
                <div className="flex justify-center items-center py-24">
                  <Loader2 size={40} className="animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center space-y-4">
                  <Building2
                    size={40}
                    className="text-muted-foreground/30 mx-auto"
                  />
                  <p className="text-lg font-medium text-foreground">
                    Aucun résultat
                  </p>
                  <p className="text-muted-foreground">
                    Essayez d'assouplir vos filtres ou d'élargir votre zone de
                    recherche.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((e) => (
                    <EstabCard
                      key={e.id}
                      estab={e}
                      onBook={() => setBookingEstab(e)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Partners ──────────────────────────────────────────────────── */}
        <section className="py-16 bg-secondary/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8">
              Nos établissements partenaires
            </p>
            <div className="flex flex-wrap gap-4 justify-center items-center">
              {partners.map((p) => (
                <div
                  key={p.name}
                  className="flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all"
                >
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary text-sm">
                    {p.abbr}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Booking Modal */}
      {bookingEstab && (
        <BookingModal
          estab={bookingEstab}
          onClose={() => setBookingEstab(null)}
        />
      )}
    </div>
  );
}
