import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { tunisianGovernorates, allServices, establishmentTypes } from "@/lib/config";
import {
  Search,
  MapPin,
  Star,
  ChevronDown,
  X,
  Clock,
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
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface MedicalEstablishment {
  id: string;
  name: string;
  type: "Clinique" | "Hôpital" | "HAD" | "Centre médical";
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
  Hôpital: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
  HAD: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
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

function BookingModal({
  estab,
  onClose,
}: {
  estab: MedicalEstablishment;
  onClose: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState(estab.services[0]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [booked, setBooked] = useState(false);

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
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 className="text-primary" size={20} />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">
                {estab.name}
              </p>
              <p className="text-xs text-muted-foreground">{estab.city}</p>
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
              Rendez-vous confirmé!
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              {DAY_LABELS[currentDay.date.getDay()]} {currentDay.date.getDate()}{" "}
              {MONTH_LABELS[currentDay.date.getMonth()]} à {selectedSlot}
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              {selectedService} · {estab.name}
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
            {/* Service selector */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Service
              </label>
              <select
                value={selectedService}
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

            {/* Week navigation */}
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

            {/* Time slots */}
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
                      className={`py-2 rounded-xl text-xs font-semibold transition-all text-center ${selectedSlot === slot
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
              {!isAuthenticated
                ? "Se connecter pour réserver"
                : selectedSlot
                  ? `Confirmer à ${selectedSlot}`
                  : "Sélectionnez un créneau"}
            </button>
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
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={estab.imageUrl}
          alt={estab.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${typeColors[estab.type]}`}
          >
            {estab.type}
          </span>
          {estab.emergencies && (
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/90 text-white backdrop-blur-sm">
              Urgences 24h
            </span>
          )}
        </div>
        {estab.accredited && (
          <div
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
            title="Établissement accrédité"
          >
            <Shield className="text-emerald-600" size={14} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors">
            {estab.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="text-amber-400 fill-amber-400" size={14} />
            <span className="text-sm font-bold text-foreground">
              {estab.rating}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
          <MapPin size={13} />
          <span>
            {estab.city}, {estab.governorate}
          </span>
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {estab.services.slice(0, 3).map((s) => (
            <span
              key={s}
              className="px-2.5 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full"
            >
              {s}
            </span>
          ))}
          {estab.services.length > 3 && (
            <span className="px-2.5 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full">
              +{estab.services.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 mt-auto">
          <Clock size={12} />
          <span>Consultation dès {estab.price} TND</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/services-medicaux/${estab.id}`}
            className="flex-1 py-2.5 border border-border text-foreground rounded-xl text-xs font-semibold text-center hover:bg-secondary/50 transition-colors"
          >
            Voir détails
          </Link>
          <button
            onClick={onBook}
            className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
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
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    new Set(),
  );
  const [maxPrice, setMaxPrice] = useState(100);
  const [minRating, setMinRating] = useState(0);
  const [emergenciesOnly, setEmergenciesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"rating" | "price" | "name">("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [bookingEstab, setBookingEstab] = useState<MedicalEstablishment | null>(
    null,
  );

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
      const matchService =
        selectedServices.size === 0 ||
        [...selectedServices].some((s) => e.services.includes(s));
      const matchPrice = e.price <= maxPrice;
      const matchRating = e.rating >= minRating;
      const matchEmergency = !emergenciesOnly || e.emergencies;
      return (
        matchQ &&
        matchType &&
        matchGov &&
        matchService &&
        matchPrice &&
        matchRating &&
        matchEmergency
      );
    });
    results.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.price - b.price;
      return a.name.localeCompare(b.name);
    });
    return results;
  }, [
    establishments,
    searchQuery,
    selectedTypes,
    selectedGov,
    selectedServices,
    maxPrice,
    minRating,
    emergenciesOnly,
    sortBy,
  ]);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Type */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Type d'établissement
        </p>
        <div className="space-y-2">
          {establishmentTypes.map((t) => (
            <label
              key={t}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedTypes.has(t)}
                onChange={() => setSelectedTypes(toggleSet(selectedTypes, t))}
                className="w-4 h-4 rounded border-border text-primary"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Gouvernorat */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Gouvernorat
        </p>
        <div className="relative">
          <select
            value={selectedGov}
            onChange={(e) => setSelectedGov(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Tous les gouvernorats</option>
            {tunisianGovernorates.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
        </div>
      </div>

      {/* Services */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Services
        </p>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {allServices.map((s) => (
            <label
              key={s}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedServices.has(s)}
                onChange={() =>
                  setSelectedServices(toggleSet(selectedServices, s))
                }
                className="w-4 h-4 rounded border-border text-primary"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {s}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Tarif max
        </p>
        <input
          type="range"
          min={20}
          max={150}
          step={5}
          value={maxPrice}
          onChange={(e) => setMaxPrice(+e.target.value)}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>20 TND</span>
          <span className="font-semibold text-foreground">{maxPrice} TND</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Note minimale
        </p>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`flex-1 py-1.5 text-xs rounded-xl font-semibold transition-all ${minRating === r
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/60 text-foreground/70 hover:bg-secondary"
                }`}
            >
              {r === 0 ? "Tous" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      {/* Urgences */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={emergenciesOnly}
          onChange={(e) => setEmergenciesOnly(e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary"
        />
        <span className="text-sm text-foreground/80">Urgences disponibles</span>
      </label>

      {/* Reset */}
      <button
        onClick={() => {
          setSelectedTypes(new Set());
          setSelectedGov("");
          setSelectedServices(new Set());
          setMaxPrice(100);
          setMinRating(0);
          setEmergenciesOnly(false);
        }}
        className="w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Services Médicaux</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Cliniques, hôpitaux, HAD et centres médicaux — comparez et
                prenez rendez-vous en ligne.
              </p>
            </div>
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Nom d'établissement, spécialité ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              {establishmentTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTypes(toggleSet(selectedTypes, t))}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar (desktop) */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6 sticky top-24">
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
                      <option value="rating">Meilleure note</option>
                      <option value="price">Prix croissant</option>
                      <option value="name">Nom A–Z</option>
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
