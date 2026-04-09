import { useState, useRef } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  CheckCircle2,
  ChevronDown,
  Upload,
  PenLine,
  X,
  Image as ImageIcon,
  Eraser,
  FileCheck2,
  Clock,
  User,
} from "lucide-react";

const PATIENTS = [
  "Fatima Ben Ali",
  "Mohammed Gharbi",
  "Leila Mansouri",
  "Ahmed Nasser",
  "Sara Meddeb",
  "Riadh Karmous",
  "Nour Chaabane",
];

const CARE_TYPES = [
  "Pansement",
  "Injection",
  "Perfusion",
  "Kinésithérapie",
  "Prise de sang",
  "Cathéter",
  "Traitement de plaie",
  "Soins infirmiers",
  "Rééducation",
  "Massage thérapeutique",
];

interface Session {
  id: number;
  patient: string;
  careType: string;
  notes: string;
  photos: number;
  signed: boolean;
  time: string;
}

const recentSessions: Session[] = [
  { id: 1, patient: "Fatima Ben Ali", careType: "Pansement", notes: "Plaie en bonne voie de cicatrisation.", photos: 2, signed: true, time: "Il y a 1h" },
  { id: 2, patient: "Mohammed Gharbi", careType: "Kinésithérapie", notes: "Amélioration de la mobilité de l'épaule.", photos: 0, signed: true, time: "Il y a 3h" },
  { id: 3, patient: "Leila Mansouri", careType: "Injection", notes: "Injection réalisée sans incident.", photos: 0, signed: false, time: "Il y a 4h" },
];

const emptyForm = { patient: "", careType: "", notes: "" };

export default function CareRecordPage() {
  const [form, setForm] = useState(emptyForm);
  const [photos, setPhotos] = useState<File[]>([]);
  const [signed, setSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  /* ---------- canvas drawing ---------- */
  const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    if ("touches" in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    lastPos.current = getPos(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.strokeStyle = "#1d4ed8";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
    setHasSig(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSig = () => {
    if (!canvasRef.current) return;
    canvasRef.current.getContext("2d")!.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSig(false);
    setSigned(false);
  };

  const confirmSig = () => {
    if (hasSig) setSigned(true);
  };

  /* ---------- photo upload ---------- */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos((prev) => [...prev, ...Array.from(e.target.files!)].slice(0, 5));
    }
  };

  const removePhoto = (idx: number) => setPhotos((prev) => prev.filter((_, i) => i !== idx));

  /* ---------- submit ---------- */
  const canSubmit = form.patient && form.careType && form.notes.trim().length >= 10 && signed;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    setTimeout(() => {
      setForm(emptyForm);
      setPhotos([]);
      clearSig();
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Dossier de soins</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Documentez et validez la session de soin</p>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-5">

            {/* Success banner */}
            {submitted && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-3">
                <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                <p className="text-sm font-medium">Session de soin enregistrée avec succès !</p>
              </div>
            )}

            {/* Form card */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <FileCheck2 size={15} className="text-primary" />
                  Nouvelle session de soin
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Patient + care type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                      <User size={12} className="inline mr-1" />Patient
                    </label>
                    <div className="relative">
                      <select
                        value={form.patient}
                        onChange={(e) => setForm({ ...form, patient: e.target.value })}
                        className="w-full appearance-none px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8"
                      >
                        <option value="">— Sélectionner —</option>
                        {PATIENTS.map((p) => <option key={p}>{p}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1.5">Type de soin</label>
                    <div className="relative">
                      <select
                        value={form.careType}
                        onChange={(e) => setForm({ ...form, careType: e.target.value })}
                        className="w-full appearance-none px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8"
                      >
                        <option value="">— Sélectionner —</option>
                        {CARE_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Clinical notes */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Notes cliniques</label>
                  <textarea
                    rows={4}
                    placeholder="Observations, évolution du patient, actes réalisés, réactions éventuelles..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{form.notes.length} caractères{form.notes.length < 10 ? " (min. 10)" : ""}</p>
                </div>

                {/* Photo upload */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    <ImageIcon size={12} className="inline mr-1" />Photos (optionnel, max 5)
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-5 cursor-pointer hover:border-primary/50 transition bg-background">
                    <Upload size={20} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Cliquez ou déposez des fichiers ici</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
                  </label>
                  {photos.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {photos.map((f, i) => (
                        <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border">
                          <img src={URL.createObjectURL(f)} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => removePhoto(i)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Signature */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    <PenLine size={12} className="inline mr-1" />Signature du patient
                  </label>
                  {signed ? (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                      <p className="text-sm text-green-800 font-medium">Signature validée</p>
                      <button onClick={clearSig} className="ml-auto text-xs text-muted-foreground hover:text-foreground transition">Effacer</button>
                    </div>
                  ) : (
                    <div className="border border-border rounded-xl overflow-hidden bg-background">
                      <canvas
                        ref={canvasRef}
                        width={540}
                        height={120}
                        className="w-full h-28 touch-none cursor-crosshair"
                        onMouseDown={startDraw}
                        onMouseMove={draw}
                        onMouseUp={stopDraw}
                        onMouseLeave={stopDraw}
                        onTouchStart={startDraw}
                        onTouchMove={draw}
                        onTouchEnd={stopDraw}
                      />
                      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20">
                        <span className="text-xs text-muted-foreground">Signez dans le cadre ci-dessus</span>
                        <div className="flex gap-2">
                          <button onClick={clearSig} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition">
                            <Eraser size={12} />Effacer
                          </button>
                          <button
                            onClick={confirmSig}
                            disabled={!hasSig}
                            className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed transition"
                          >
                            <CheckCircle2 size={12} />Valider
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FileCheck2 size={16} />
                  Valider la session de soin
                </button>
                {!canSubmit && (
                  <p className="text-xs text-center text-muted-foreground">
                    {!form.patient || !form.careType ? "Sélectionnez un patient et un type de soin. " : ""}
                    {form.notes.trim().length < 10 ? "Notes trop courtes. " : ""}
                    {!signed ? "Signature patient requise." : ""}
                  </p>
                )}
              </div>
            </div>

            {/* Recent sessions */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-sm text-foreground flex items-center gap-2">
                  <Clock size={14} className="text-muted-foreground" />
                  Sessions récentes
                </h2>
              </div>
              <div className="divide-y divide-border">
                {recentSessions.map((s) => (
                  <div key={s.id} className="flex items-center gap-4 px-6 py-3.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-foreground">{s.patient}</p>
                        <span className="text-xs text-muted-foreground">— {s.careType}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{s.notes}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 text-xs text-muted-foreground">
                      {s.photos > 0 && <span className="flex items-center gap-1"><ImageIcon size={11} />{s.photos}</span>}
                      {s.signed
                        ? <span className="flex items-center gap-1 text-green-600"><CheckCircle2 size={11} />Signé</span>
                        : <span className="text-amber-600">Non signé</span>
                      }
                      <span>{s.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
