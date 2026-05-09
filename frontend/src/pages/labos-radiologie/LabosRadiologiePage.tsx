import { useState, useMemo, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { tunisianGovernorates, examTypeOptions, labTypes } from "@/lib/config";
import { DELEGATIONS } from "@/lib/governorates";
import {
  Search,
  MapPin,
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
  Loader2,
  AlertCircle,
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
  resultDelay: string; // e.g. "24h", "2–3 jours"
  exams: string[]; // exams phares displayed on card
  allExamTypes: string[]; // for filter matching
  priceFrom: number; // tarif indicatif (TND)
  imageUrl: string;
  description: string;
  open24h?: boolean;
}

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
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${step >= s
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
                  }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`h-0.5 flex-1 rounded transition-colors ${step > s ? "bg-primary" : "bg-border"
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
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${drag
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

// ─── Booking helpers ─────────────────────────────────────────────────────────
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
  lab,
  onClose,
}: {
  lab: LabCenter;
  onClose: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);
  const [booked, setBooked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

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

  // Fetch real availability for the visible week
  useEffect(() => {
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
  }, [lab.id, weekOffset]);

  const currentDate = weekDates[selectedDayIdx];
  const currentAvailable = slotMap[toDateStr(currentDate)] ?? [];

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
              <p className="font-semibold text-foreground text-sm leading-tight">{lab.name}</p>
              <p className="text-xs text-muted-foreground">{lab.city}</p>
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
            <p className="text-xs text-muted-foreground mb-5">{lab.name}</p>
            <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-4 py-3 mb-6 text-left">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                Votre demande est en attente de confirmation par le laboratoire. Vous serez notifié par téléphone.
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
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Choisir une date</label>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => setWeekOffset((w) => Math.max(0, w - 1))}
                    disabled={weekOffset === 0}
                    className="p-1.5 rounded-lg hover:bg-secondary/50 transition disabled:opacity-30"
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
                placeholder="Type d'examen, symptômes ou informations utiles…"
                rows={2}
                maxLength={500}
                className="w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
              />
            </div>

            {/* ── Document médical ── */}
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wide block mb-2">
                Document médical <span className="font-normal normal-case text-muted-foreground/70">(facultatif)</span>
              </label>
              <div
                className={`border-2 border-dashed rounded-xl p-3.5 cursor-pointer transition-colors ${
                  imageFile ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/40"
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

            {/* ── Error ── */}
            {bookError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl">
                <AlertCircle size={14} className="text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive leading-relaxed">{bookError}</p>
              </div>
            )}

            {/* ── Confirm ── */}
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

// ─── Lab Card ─────────────────────────────────────────────────────────────────
function LabCard({
  lab,
  onBook,
}: {
  lab: LabCenter;
  onBook: (l: LabCenter) => void;
}) {
  const typeAccent: Record<string, string> = {
    Laboratoire: "bg-blue-500/20 text-blue-100 border-blue-400/30",
    Radiologie: "bg-violet-500/20 text-violet-100 border-violet-400/30",
    Mixte: "bg-teal-500/20 text-teal-100 border-teal-400/30",
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={lab.imageUrl}
          alt={lab.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Top row badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-sm border ${typeAccent[lab.type] ?? "bg-white/15 text-white border-white/20"}`}>
            {typeIcons[lab.type]}{lab.type}
          </span>
          {lab.open24h && (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white shadow">24h/24</span>
          )}
        </div>

        {/* Name + city + delay overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-base leading-tight drop-shadow-md mb-1">{lab.name}</h3>
          <div className="flex items-center gap-3 text-white/75 text-xs">
            <span className="flex items-center gap-1"><MapPin size={10} /> {lab.city}</span>
            <span className="flex items-center gap-1"><Clock size={10} /> {lab.resultDelay}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Exam pills */}
        <div className="flex flex-wrap gap-1.5">
          {lab.exams.slice(0, 3).map((ex) => (
            <span key={ex} className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-secondary/80 text-foreground/80 border border-border/60">
              {ex}
            </span>
          ))}
          {lab.exams.length > 3 && (
            <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-primary/[0.08] text-primary border border-primary/[0.15]">
              +{lab.exams.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex gap-2 pt-1">
          <Link
            to={`/labos-radiologie/${lab.id}`}
            className="flex-1 py-2.5 text-center text-xs font-semibold border border-border rounded-xl hover:bg-secondary/50 transition text-foreground/80 hover:text-foreground"
          >
            Voir détails
          </Link>
          <button
            onClick={() => onBook(lab)}
            className="flex-1 py-2.5 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition flex items-center justify-center gap-1.5"
          >
            <Calendar size={13} /> Prendre RDV
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
  selectedExamTypes,
  toggleExamType,
  onReset,
}: {
  selectedTypes: string[];
  toggleType: (t: string) => void;
  selectedExamTypes: string[];
  toggleExamType: (e: string) => void;
  onReset: () => void;
}) {
  const activeCount = selectedTypes.length + selectedExamTypes.length;
  return (
    <aside className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-base flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>
          Filtres
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-primary text-primary-foreground rounded-full">{activeCount}</span>
          )}
        </h3>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-primary hover:underline font-medium">Tout effacer</button>
        )}
      </div>

      {/* Type de centre */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Type de centre
        </h4>
        <div className="space-y-1">
          {labTypes.map((t) => (
            <label
              key={t}
              className={`flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-lg transition-colors ${selectedTypes.includes(t) ? "bg-primary/10" : "hover:bg-secondary/50"}`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selectedTypes.includes(t) ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}>
                {selectedTypes.includes(t) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
              <span className={`text-sm transition-colors ${selectedTypes.includes(t) ? "text-foreground font-medium" : "text-foreground/80 group-hover:text-foreground"}`}>
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Type d'examen */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Type d'examen
        </h4>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          {examTypeOptions.map((ex) => (
            <label
              key={ex}
              className={`flex items-center gap-2.5 cursor-pointer group px-2 py-1.5 rounded-lg transition-colors ${selectedExamTypes.includes(ex) ? "bg-primary/10" : "hover:bg-secondary/50"}`}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selectedExamTypes.includes(ex) ? "bg-primary border-primary" : "border-border group-hover:border-primary/50"}`}>
                {selectedExamTypes.includes(ex) && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
              <span className={`text-sm transition-colors ${selectedExamTypes.includes(ex) ? "text-foreground font-medium" : "text-foreground/80 group-hover:text-foreground"}`}>
                {ex}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Active filters tags */}
      {activeCount > 0 && (
        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-xs text-muted-foreground font-medium">Filtres actifs :</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedTypes.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                {t}<button onClick={() => toggleType(t)} className="hover:text-primary/70">×</button>
              </span>
            ))}
            {selectedExamTypes.slice(0, 3).map((e) => (
              <span key={e} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                {e}<button onClick={() => toggleExamType(e)} className="hover:text-primary/70">×</button>
              </span>
            ))}
            {selectedExamTypes.length > 3 && (
              <span className="px-2 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full">+{selectedExamTypes.length - 3}</span>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full px-3 py-2.5 border border-border hover:bg-secondary/80 text-foreground rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        Réinitialiser les filtres
      </button>
    </aside>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LabosRadiologiePage() {
  const [labs, setLabs] = useState<LabCenter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/public/labs")
      .then((r) => r.json())
      .then((data) => setLabs(Array.isArray(data) ? data : []))
      .catch(() => setLabs([]))
      .finally(() => setLoading(false));
  }, []);

  const [query, setQuery] = useState("");
  const [selectedGov, setSelectedGov] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExamTypes, setSelectedExamTypes] = useState<string[]>([]);
  const [selectedDelegation, setSelectedDelegation] = useState("");
  const [sort, setSort] = useState<"name">("name");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [bookingLab, setBookingLab] = useState<LabCenter | null>(null);
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
    setSelectedDelegation("");
    setSelectedTypes([]);
    setSelectedExamTypes([]);
    setSort("name");
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
    if (selectedDelegation)
      result = result.filter((l) => l.city === selectedDelegation);
    if (selectedTypes.length > 0)
      result = result.filter((l) => selectedTypes.includes(l.type));
    if (activeTypeFilter)
      result = result.filter((l) => l.type === activeTypeFilter);
    if (selectedExamTypes.length > 0)
      result = result.filter((l) =>
        selectedExamTypes.some((et) => l.allExamTypes.includes(et)),
      );

    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [
    labs,
    query,
    selectedGov,
    selectedDelegation,
    selectedTypes,
    selectedExamTypes,
    sort,
    activeTypeFilter,
  ]);

  const filterProps = {
    selectedTypes,
    toggleType,
    selectedExamTypes,
    toggleExamType,
    onReset: resetFilters,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Header Section */}
        <section className="relative overflow-hidden bg-gray-950 py-16 md:py-20">
          {/* Background atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900 to-violet-950" />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 15% 60%, #3b82f6 0%, transparent 45%), radial-gradient(ellipse at 85% 15%, #7c3aed 0%, transparent 40%)",
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
            {/* Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-white/70 text-xs font-medium mb-1 backdrop-blur-sm">
                <FlaskConical size={13} /> Analyses & Imagerie Médicale
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Labos &amp; Radiologie
              </h1>
              <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Trouvez un laboratoire d'analyses ou un centre d'imagerie
                partenaire et prenez rendez-vous en ligne.
              </p>
            </div>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
                size={17}
              />
              <input
                type="text"
                placeholder="Examen, centre, ville…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 backdrop-blur-sm text-sm transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Location selects */}
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <MapPin size={14} className="text-white/50 shrink-0" />
                <select
                  value={selectedGov}
                  onChange={(e) => { setSelectedGov(e.target.value); setSelectedDelegation(""); }}
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
                    onChange={(e) => setSelectedDelegation(e.target.value)}
                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="" className="text-foreground bg-gray-900">Toutes les délégations</option>
                    {DELEGATIONS[selectedGov].map((d: string) => (
                      <option key={d} value={d} className="text-foreground bg-gray-900">{d}</option>
                    ))}
                  </select>
                </div>
              )}
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
              <div className="bg-card rounded-xl border border-border p-5 space-y-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
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
                  <option value="name">Nom A–Z</option>
                </select>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-24">
                  <Loader2 size={40} className="animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
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

      <Footer />
    </div>
  );
}
