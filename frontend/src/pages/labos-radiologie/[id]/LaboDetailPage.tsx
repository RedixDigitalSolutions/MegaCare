import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Eye,
  Activity,
  Mail,
  ArrowLeft,
  AlertCircle,
  Upload,
  X,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LabCenter {
  id: string;
  name: string;
  type: "Laboratoire" | "Radiologie" | "Mixte";
  governorate: string;
  city: string;
  address: string;
  phone: string;
  email?: string;
  resultDelay: string;
  exams: string[];
  allExamTypes: string[];
  priceFrom: number;
  imageUrl: string;
  description: string;
  open24h?: boolean;
  cnam?: boolean;
  mapUrl?: string;
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const typeColors: Record<string, string> = {
  Laboratoire: "bg-blue-500/20 text-blue-100 border border-blue-400/30",
  Radiologie: "bg-violet-500/20 text-violet-100 border border-violet-400/30",
  Mixte: "bg-teal-500/20 text-teal-100 border border-teal-400/30",
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
    d.setDate(d.getDate() + offset * 7 + i);
    return d;
  });
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LaboDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [lab, setLab] = useState<LabCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setLoading(true);
    fetch(`/api/public/labs/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { setLab(data ? { ...data, id: data.id || data._id } : null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [noteText, setNoteText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  // Real slots
  const [slotMap, setSlotMap] = useState<Record<string, string[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const weekDates = buildWeekDates(weekOffset);

  // Auto-select first non-Sunday day when week changes
  useEffect(() => {
    const firstIdx = weekDates.findIndex((d) => d.getDay() !== 0);
    setSelectedDayIdx(firstIdx >= 0 ? firstIdx : 0);
    setSelectedSlot(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset]);

  useEffect(() => {
    if (!lab) return;
    let cancelled = false;
    setSelectedSlot(null);
    setLoadingSlots(true);
    Promise.all(
      weekDates.map(async (d) => {
        const ds = toDateStr(d);
        if (d.getDay() === 0) return [ds, []] as const;
        try {
          const r = await fetch(`/api/public/labs/${lab.id}/slots?date=${ds}`);
          const data = r.ok ? await r.json() : {};
          return [ds, (data.available ?? data.slots ?? []) as string[]] as const;
        } catch { return [ds, []] as const; }
      })
    ).then((results) => {
      if (!cancelled) {
        setSlotMap(Object.fromEntries(results));
        setLoadingSlots(false);
      }
    });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lab?.id, weekOffset]);

  const currentDate = weekDates[selectedDayIdx];
  const currentSlots = slotMap[toDateStr(currentDate)] ?? [];

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
  if (!lab) return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header forceOpaque />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center max-w-sm px-6">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FlaskConical size={28} className="text-muted-foreground/50" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Centre introuvable</h1>
          <p className="text-muted-foreground text-sm mb-6">Ce centre n'existe pas ou n'est plus disponible.</p>
          <Link to="/labos-radiologie" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition">
            <ArrowLeft size={15} /> Retour à la liste
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );

  const todaySlots = slotMap[toDateStr(new Date())]?.length ?? 0;

  const handleBook = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!selectedSlot) return;
    setBooking(true);
    setBookError(null);
    try {
      const token = localStorage.getItem("megacare_token");
      const fd = new FormData();
      fd.append("examType", lab.exams[0] ?? "");
      fd.append("date", toDateStr(currentDate));
      fd.append("time", selectedSlot);
      fd.append("notes", noteText.trim());
      if (imageFile) fd.append("document", imageFile);
      const r = await fetch(`/api/public/labs/${lab.id}/book`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setBookError(d.message || "Erreur lors de la réservation");
        return;
      }
      setBooked(true);
      const ds = toDateStr(currentDate);
      setSlotMap((prev) => ({
        ...prev,
        [ds]: (prev[ds] ?? []).filter((s) => s !== selectedSlot),
      }));
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header forceOpaque />

      <main className="flex-1 pt-16">
        {/* ══════════════════════════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════════════════════════ */}
        <section className="relative h-[380px] md:h-[460px] overflow-hidden bg-gray-900">
          {!imgError && lab.imageUrl ? (
            <img
              src={lab.imageUrl}
              alt={lab.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Back link */}
          <div className="absolute top-4 left-4 sm:left-8 max-w-7xl">
            <Link
              to="/labos-radiologie"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              <ArrowLeft size={15} /> Retour aux laboratoires
            </Link>
          </div>

          {/* Lab info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${typeColors[lab.type] ?? "bg-white/20 text-white border border-white/30"}`}
              >
                {lab.type}
              </span>
              {lab.open24h && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/25 text-amber-200 border border-amber-400/30 backdrop-blur-sm">
                  24h/24
                </span>
              )}
              {lab.cnam && (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/25 text-blue-200 border border-blue-400/30 backdrop-blur-sm flex items-center gap-1">
                  <CheckCircle size={11} />CNAM
                </span>
              )}
              {todaySlots > 0 ? (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/30 backdrop-blur-sm">
                  {todaySlots} créneaux disponibles aujourd'hui
                </span>
              ) : (
                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/15 text-white/70 border border-white/20 backdrop-blur-sm">
                  Complet aujourd'hui
                </span>
              )}
            </div>

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
              {lab.name}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <MapPin size={14} className="shrink-0" />
                <span>{lab.city}, {lab.governorate}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/70 text-sm">
                <Clock size={13} className="shrink-0" />
                <span>Résultats sous {lab.resultDelay}</span>
              </div>
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
                  <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center"><FlaskConical size={14} className="text-primary" /></div>
                  <h2 className="font-bold text-foreground text-base">À propos</h2>
                </div>
                <div className="p-6 space-y-5">
                  <p className="text-muted-foreground leading-relaxed text-sm">{lab.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="text-center p-4 bg-secondary/40 rounded-xl">
                      <p className="text-xl font-bold text-foreground">{lab.resultDelay}</p>
                      <p className="text-xs text-muted-foreground mt-1">Délai résultats</p>
                    </div>
                    {lab.cnam && (
                      <div className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <CheckCircle size={18} className="text-blue-600 dark:text-blue-400 mb-1" />
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Conventionné</p>
                        <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70">CNAM</p>
                      </div>
                    )}
                    {lab.open24h && (
                      <div className="flex flex-col items-center justify-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                        <Clock size={18} className="text-amber-600 dark:text-amber-400 mb-1" />
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Ouvert</p>
                        <p className="text-[11px] text-amber-600/70 dark:text-amber-400/70">24h/24</p>
                      </div>
                    )}
                  </div>

                  {/* Contact row */}
                  <div className="flex flex-wrap gap-4 pt-1 border-t border-border">
                    <a href={`tel:${lab.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                      <Phone size={14} className="text-primary shrink-0" />{lab.phone}
                    </a>
                    {lab.email && (
                      <a href={`mailto:${lab.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Mail size={14} className="shrink-0" />{lab.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Examens */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="font-bold text-foreground text-base flex items-center gap-2">
                    <FlaskConical size={16} className="text-primary" />
                    Examens proposés
                  </h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {lab.exams.map((ex) => (
                      <span
                        key={ex}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary/[0.08] text-primary text-sm font-medium rounded-xl border border-primary/[0.15] hover:bg-primary/[0.12] transition-colors"
                      >
                        <Eye size={12} className="shrink-0" />{ex}
                      </span>
                    ))}
                  </div>
                  {lab.allExamTypes && lab.allExamTypes.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Catégories</p>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.allExamTypes.map((et) => (
                          <span key={et} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/70 text-foreground/80">{et}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Localisation */}
              {lab.mapUrl && (
                <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">Localisation</p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">{lab.address || lab.city}</p>
                    </div>
                  </div>
                  <a
                    href={lab.mapUrl}
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
                {/* Booking header */}
                <div className="px-5 pt-5 pb-4 border-b border-border">
                  <p className="text-base font-bold text-foreground">Prendre rendez-vous</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Choisissez un examen et un créneau disponible</p>
                </div>

                <div className="p-5 space-y-5">
                  {booked ? (
                    /* Confirmation state */
                    <div className="text-center py-4">
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="text-emerald-500" size={28} />
                      </div>
                      <h3 className="font-bold text-foreground mb-1">RDV soumis !</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {DAY_LABELS[currentDate.getDay()]} {currentDate.getDate()} {MONTH_LABELS[currentDate.getMonth()]} à {selectedSlot}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">{lab.name}</p>
                      <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3 mb-4 text-left">
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                          Votre demande est en attente de confirmation. Vous serez contacté par téléphone.
                        </p>
                      </div>
                      <button
                        onClick={() => { setBooked(false); setSelectedSlot(null); setNoteText(""); setImageFile(null); }}
                        className="px-5 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition"
                      >
                        Nouveau RDV
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Week calendar */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Date</label>
                          <div className="flex items-center gap-0.5">
                            <button
                              onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                              disabled={weekOffset === 0}
                              className="p-1.5 rounded-lg hover:bg-secondary/50 transition disabled:opacity-40"
                            >
                              <ChevronLeft size={14} className="text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => setWeekOffset((w) => w + 1)}
                              className="p-1.5 rounded-lg hover:bg-secondary/50 transition"
                            >
                              <ChevronRight size={14} className="text-muted-foreground" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {weekDates.map((d, i) => {
                            const ds = toDateStr(d);
                            const isSunday = d.getDay() === 0;
                            const available = slotMap[ds] ?? [];
                            const isActive = i === selectedDayIdx;
                            return (
                              <button
                                key={i}
                                onClick={() => { if (!isSunday) { setSelectedDayIdx(i); setSelectedSlot(null); } }}
                                disabled={isSunday || loadingSlots || available.length === 0}
                                title={isSunday ? "Fermé le dimanche" : undefined}
                                className={`flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all ${isSunday
                                    ? "opacity-25 cursor-not-allowed text-foreground/50"
                                    : isActive
                                      ? "bg-primary text-primary-foreground"
                                      : available.length === 0 && !loadingSlots
                                        ? "opacity-35 cursor-not-allowed"
                                        : "hover:bg-secondary/70 text-foreground/70"
                                  }`}
                              >
                                <span className="text-[9px] opacity-70">{DAY_LABELS[d.getDay()]}</span>
                                <span className="font-bold text-sm">{d.getDate()}</span>
                                <span className="text-[9px] opacity-60">{MONTH_LABELS[d.getMonth()]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time slots */}
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                          Créneaux — <span className="font-normal normal-case">{loadingSlots ? "…" : `${currentSlots.length} disponibles`}</span>
                        </label>
                        {loadingSlots ? (
                          <div className="flex justify-center py-4"><div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>
                        ) : currentSlots.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-3">Aucun créneau ce jour</p>
                        ) : (
                          <div className="grid grid-cols-3 gap-1.5">
                            {currentSlots.map((slot) => (
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

                      {/* Note */}
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                          Note <span className="font-normal normal-case text-muted-foreground/70">(facultatif)</span>
                        </label>
                        <textarea
                          value={noteText}
                          onChange={(e) => setNoteText(e.target.value)}
                          placeholder="Type d'examen, symptômes ou informations utiles…"
                          rows={2}
                          maxLength={500}
                          className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                        />
                      </div>

                      {/* Document médical */}
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                          Document médical <span className="font-normal normal-case text-muted-foreground/70">(facultatif)</span>
                        </label>
                        <div
                          className={`border-2 border-dashed rounded-xl p-3.5 cursor-pointer transition-colors ${imageFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/40"
                            }`}
                          onClick={() => imgRef.current?.click()}
                        >
                          {imageFile ? (
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary shrink-0">
                                  <img src={URL.createObjectURL(imageFile)} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-primary truncate">{imageFile.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{(imageFile.size / 1024).toFixed(0)} Ko</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setImageFile(null); if (imgRef.current) imgRef.current.value = ""; }}
                                className="shrink-0 p-1 rounded-md hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                              <Upload size={13} />
                              <span className="text-xs">JPG, PNG, WebP · 5 Mo max</span>
                            </div>
                          )}
                        </div>
                        <input
                          ref={imgRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (!f) return;
                            if (f.size > 5 * 1024 * 1024) {
                              setBookError("Image trop volumineuse (max 5 Mo)");
                              e.target.value = "";
                              return;
                            }
                            setImageFile(f);
                            setBookError(null);
                          }}
                        />
                      </div>

                      {bookError && (
                        <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                          <AlertCircle size={13} className="text-destructive shrink-0 mt-0.5" />
                          <p className="text-xs text-destructive leading-relaxed">{bookError}</p>
                        </div>
                      )}

                      <button
                        onClick={handleBook}
                        disabled={!selectedSlot || booking}
                        className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {booking ? (
                          <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Réservation…</>
                        ) : !isAuthenticated ? (
                          <><Calendar size={15} /> Se connecter pour réserver</>
                        ) : selectedSlot ? (
                          <><CheckCircle size={15} /> Confirmer — {selectedSlot}</>
                        ) : (
                          <><Calendar size={15} /> Choisissez un créneau</>
                        )}
                      </button>
                    </>
                  )}

                  {/* Contact shortcuts */}
                  <div className="border-t border-border pt-4 space-y-2">
                    <a
                      href={`tel:${lab.phone}`}
                      className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition group"
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <Phone size={14} className="text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">Téléphone</p>
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition truncate">{lab.phone}</p>
                      </div>
                    </a>
                    {lab.email && (
                      <a
                        href={`mailto:${lab.email}`}
                        className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition group"
                      >
                        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                          <Mail size={14} className="text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-muted-foreground">Email</p>
                          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition truncate">{lab.email}</p>
                        </div>
                      </a>
                    )}
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                      <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">Adresse</p>
                        <p className="text-sm font-medium text-foreground truncate">{lab.address}</p>
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
