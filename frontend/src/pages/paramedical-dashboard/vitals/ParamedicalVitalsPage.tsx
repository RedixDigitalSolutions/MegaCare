import { useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  UserCircle2,
  Save,
  ChevronRight,
} from "lucide-react";

/* ── Vital thresholds ── */
type VitalKey = "sbp" | "dbp" | "hr" | "temp" | "spo2" | "glucose";

interface ThresholdRule {
  low?: number;
  high?: number;
  critLow?: number;
  critHigh?: number;
}

const THRESHOLDS: Record<VitalKey, ThresholdRule> = {
  sbp:     { low: 90,   high: 140,  critHigh: 180, critLow: 80 },
  dbp:     { low: 60,   high: 90,   critHigh: 110, critLow: 50 },
  hr:      { low: 50,   high: 100,  critHigh: 130, critLow: 40 },
  temp:    { low: 36.0, high: 37.5, critHigh: 39.5, critLow: 35.0 },
  spo2:    { low: 95,   critLow: 90 },
  glucose: { low: 70,   high: 140,  critHigh: 250, critLow: 55 },
};

const getStatus = (key: VitalKey, val: number): "normal" | "warning" | "critical" => {
  const t = THRESHOLDS[key];
  if ((t.critLow !== undefined && val < t.critLow) || (t.critHigh !== undefined && val > t.critHigh)) return "critical";
  if ((t.low !== undefined && val < t.low) || (t.high !== undefined && val > t.high)) return "warning";
  return "normal";
};

const statusStyle = {
  normal:   { text: "text-green-600",  bg: "bg-green-50",  border: "border-green-200",  label: "Normal" },
  warning:  { text: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-200",  label: "Anormal" },
  critical: { text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200",    label: "Critique" },
};

/* ── Patients ── */
interface PatientVitals {
  id: number;
  name: string;
  age: number;
  condition: string;
  lastEntry: string;
}

const PATIENTS: PatientVitals[] = [
  { id: 1, name: "Fatima Ben Ali",   age: 65, condition: "Suivi post-op",        lastEntry: "Aujourd'hui 09:00" },
  { id: 2, name: "Mohammed Gharbi",  age: 72, condition: "Rééducation",           lastEntry: "Hier 14:30" },
  { id: 3, name: "Leila Mansouri",   age: 58, condition: "Plaies chroniques",     lastEntry: "Aujourd'hui 11:00" },
  { id: 4, name: "Ahmed Nasser",     age: 80, condition: "Douleurs articulaires", lastEntry: "Il y a 2 jours" },
  { id: 5, name: "Sara Meddeb",      age: 52, condition: "Post-fracture",         lastEntry: "Il y a 3 jours" },
];

const EMPTY_FORM = { sbp: "", dbp: "", hr: "", temp: "", spo2: "", glucose: "" };
type FormValues = typeof EMPTY_FORM;

/* ── Field definitions ── */
const FIELDS: { key: VitalKey; label: string; unit: string; icon: typeof Heart; placeholder: string; step: string }[] = [
  { key: "sbp",     label: "Pression systolique",  unit: "mmHg",  icon: Activity,    placeholder: "ex: 120",  step: "1"   },
  { key: "dbp",     label: "Pression diastolique", unit: "mmHg",  icon: Activity,    placeholder: "ex: 80",   step: "1"   },
  { key: "hr",      label: "Fréquence cardiaque",  unit: "bpm",   icon: Heart,       placeholder: "ex: 72",   step: "1"   },
  { key: "temp",    label: "Température",          unit: "°C",    icon: Thermometer, placeholder: "ex: 36.8", step: "0.1" },
  { key: "spo2",    label: "SpO₂",                 unit: "%",     icon: Wind,        placeholder: "ex: 98",   step: "1"   },
  { key: "glucose", label: "Glycémie",             unit: "mg/dL", icon: Droplets,    placeholder: "ex: 95",   step: "1"   },
];

export default function ParamedicalVitalsPage() {
  const [selectedId, setSelectedId] = useState(1);
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [saved, setSaved] = useState(false);

  const patient = PATIENTS.find((p) => p.id === selectedId)!;

  const getVal = (key: VitalKey) => {
    const val = parseFloat(form[key]);
    return isNaN(val) ? null : val;
  };

  const alerts = FIELDS.filter((f) => {
    const v = getVal(f.key);
    return v !== null && getStatus(f.key, v) !== "normal";
  });

  const hasCritical = alerts.some((f) => {
    const v = getVal(f.key);
    return v !== null && getStatus(f.key, v) === "critical";
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setForm(EMPTY_FORM);
      setSaved(false);
    }, 2000);
  };

  const anyFilled = FIELDS.some((f) => form[f.key] !== "");

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Constantes vitales</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Saisie et suivi des paramètres physiologiques</p>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto">

            {/* ── Left: patient list ── */}
            <div className="lg:w-64 shrink-0 space-y-2">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Patients</h2>
              {PATIENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedId(p.id); setForm(EMPTY_FORM); setSaved(false); }}
                  className={`w-full text-left p-3 rounded-xl border transition ${
                    selectedId === p.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCircle2 size={16} className={selectedId === p.id ? "text-primary" : "text-muted-foreground"} />
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    {selectedId === p.id && <ChevronRight size={12} className="text-primary ml-auto shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 pl-6">{p.age} ans · {p.condition}</p>
                  <p className="text-xs text-muted-foreground pl-6">Dernier : {p.lastEntry}</p>
                </button>
              ))}
            </div>

            {/* ── Right: form ── */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Critical alert banner */}
              {hasCritical && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-5 py-3">
                  <AlertTriangle size={16} className="text-red-500 shrink-0" />
                  <p className="text-sm font-semibold">Valeur critique détectée — vérifiez immédiatement.</p>
                </div>
              )}

              {saved && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-3">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <p className="text-sm font-medium">Constantes enregistrées pour {patient.name}.</p>
                </div>
              )}

              {/* Patient header */}
              <div className="bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle2 size={22} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.age} ans · {patient.condition}</p>
                </div>
              </div>

              {/* Vitals grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FIELDS.map((f) => {
                  const Icon = f.icon;
                  const val = getVal(f.key);
                  const status = val !== null ? getStatus(f.key, val) : null;
                  const style = status ? statusStyle[status] : null;
                  return (
                    <div
                      key={f.key}
                      className={`bg-card rounded-xl border p-4 transition ${
                        style ? `${style.border} ${style.bg}` : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                          <Icon size={13} />
                          {f.label}
                        </label>
                        {status && (
                          <span className={`text-xs font-semibold flex items-center gap-1 ${style!.text}`}>
                            {status === "critical" && <AlertTriangle size={11} />}
                            {status === "normal" && <CheckCircle2 size={11} />}
                            {style!.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step={f.step}
                          placeholder={f.placeholder}
                          value={form[f.key]}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          className="flex-1 min-w-0 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                        />
                        <span className="text-xs text-muted-foreground shrink-0 w-12">{f.unit}</span>
                      </div>
                      {/* Threshold hints */}
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Normal : {
                          f.key === "sbp" ? "90–140" :
                          f.key === "dbp" ? "60–90" :
                          f.key === "hr"  ? "50–100" :
                          f.key === "temp" ? "36–37.5" :
                          f.key === "spo2" ? "≥95" :
                          "70–140"
                        } {f.unit}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Warning list */}
              {alerts.length > 0 && (
                <div className="bg-card rounded-xl border border-amber-200 overflow-hidden">
                  <div className="px-5 py-3 border-b border-amber-200 bg-amber-50">
                    <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                      <AlertTriangle size={14} />
                      Alertes détectées ({alerts.length})
                    </h3>
                  </div>
                  <div className="divide-y divide-border">
                    {alerts.map((f) => {
                      const v = getVal(f.key)!;
                      const s = getStatus(f.key, v);
                      return (
                        <div key={f.key} className="flex items-center gap-3 px-5 py-2.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${s === "critical" ? "bg-red-500" : "bg-amber-400"}`} />
                          <p className="text-sm text-foreground flex-1">
                            <span className="font-medium">{f.label}</span> : {v} {f.unit}
                          </p>
                          <span className={`text-xs font-semibold ${statusStyle[s].text}`}>{statusStyle[s].label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!anyFilled}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Save size={15} />
                Enregistrer les constantes
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
