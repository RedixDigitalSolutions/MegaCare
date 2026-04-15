import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Activity, Heart, Thermometer, Droplets, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

type VitalStatus = "Normal" | "Attention" | "Critique";

interface VitalReading {
  id: number;
  label: string;
  value: string;
  unit: string;
  status: VitalStatus;
  timestamp: string;
  icon: typeof Activity;
}

interface PatientVitals {
  name: string;
  vitals: { label: string; value: string; unit: string; status: VitalStatus; reference: string; icon: typeof Activity }[];
  history: { date: string; bp: string; pulse: number; temp: number; spo2: number; glucose: number }[];
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

function bpStatus(sbp: number, dbp: number): VitalStatus {
  if (sbp >= 160 || dbp >= 100) return "Critique";
  if (sbp >= 130 || dbp >= 80) return "Attention";
  return "Normal";
}
function hrStatus(hr: number): VitalStatus {
  if (hr > 110) return "Critique";
  if (hr > 100 || hr < 60) return "Attention";
  return "Normal";
}
function tempStatus(t: number): VitalStatus {
  if (t >= 39) return "Critique";
  if (t >= 37.3) return "Attention";
  return "Normal";
}
function spo2Status(s: number): VitalStatus {
  if (s < 90) return "Critique";
  if (s < 95) return "Attention";
  return "Normal";
}
function glucStatus(g: number): VitalStatus {
  if (g > 12 || g < 3.9) return "Critique";
  if (g > 7.8) return "Attention";
  return "Normal";
}

interface ApiVitalRecord { sbp: number; dbp: number; hr: number; temp: number; spo2: number; glucose: number; date: string; }

function toPatientVitals(name: string, records: ApiVitalRecord[]): PatientVitals {
  const latest = records[0] ?? { sbp: 0, dbp: 0, hr: 0, temp: 0, spo2: 0, glucose: 0, date: "" };
  return {
    name,
    vitals: [
      { label: "Tension Artérielle", value: `${latest.sbp}/${latest.dbp}`, unit: "mmHg", status: bpStatus(latest.sbp, latest.dbp), reference: "< 130/80", icon: Activity },
      { label: "Pouls", value: String(latest.hr), unit: "bpm", status: hrStatus(latest.hr), reference: "60–100", icon: Heart },
      { label: "Température", value: String(latest.temp), unit: "°C", status: tempStatus(latest.temp), reference: "36.1–37.2", icon: Thermometer },
      { label: "SpO₂", value: String(latest.spo2), unit: "%", status: spo2Status(latest.spo2), reference: "> 95", icon: Droplets },
      { label: "Glycémie", value: String(latest.glucose), unit: "mmol/L", status: glucStatus(latest.glucose), reference: "3.9–7.8", icon: Activity },
    ],
    history: records.map(v => ({ date: v.date, bp: `${v.sbp}/${v.dbp}`, pulse: v.hr, temp: v.temp, spo2: v.spo2, glucose: v.glucose })),
  };
}

const statusConfig: Record<VitalStatus, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  Normal: { label: "Normal", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
  Attention: { label: "Attention", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle },
  Critique: { label: "Critique", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertCircle },
};

export default function VitalsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [patientList, setPatientList] = useState<{ id: string; name: string }[]>([]);
  const [patient, setPatient] = useState<PatientVitals | null>(null);

  useEffect(() => {
    fetch("/api/medical-service/patients", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : [];
        setPatientList(list);
        if (list.length) setSelectedPatientId(list[0].id);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!selectedPatientId) return;
    const pt = patientList.find(p => p.id === selectedPatientId);
    fetch(`/api/medical-service/vitals/${selectedPatientId}`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => setPatient(toPatientVitals(pt?.name ?? "", Array.isArray(d) ? d : [])))
      .catch(() => { });
  }, [selectedPatientId, patientList]);

  if (!patient) return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Chargement...</div>
    </div>
  );

  const hasCritical = patient.vitals.some((v) => v.status === "Critique");
  const hasAttention = patient.vitals.some((v) => v.status === "Attention");

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Constantes Vitales</h1>
            <p className="text-xs text-muted-foreground">Surveillance des paramètres vitaux des patients</p>
          </div>
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {patientList.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Alert banner */}
          {hasCritical && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">Alerte critique — Certaines constantes de {patient.name} nécessitent une attention immédiate.</span>
            </div>
          )}
          {!hasCritical && hasAttention && (
            <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
              <AlertTriangle size={18} />
              <span className="text-sm font-medium">Constantes sous surveillance pour {patient.name}.</span>
            </div>
          )}

          {/* Vital cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {patient.vitals.map((v) => {
              const cfg = statusConfig[v.status];
              const Icon = v.icon;
              const StatusIcon = cfg.icon;
              return (
                <div key={v.label} className={`bg-card rounded-xl border-2 ${cfg.border} p-5 space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                      <Icon size={18} className={cfg.color} />
                    </div>
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                      <StatusIcon size={11} />
                      {cfg.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{v.value} <span className="text-sm font-normal text-muted-foreground">{v.unit}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">{v.label}</p>
                    <p className="text-xs text-muted-foreground/60">Ref : {v.reference}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* History table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-3 border-b border-border">
              <h2 className="font-semibold text-foreground text-sm">Historique des mesures</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-3 text-left text-muted-foreground font-medium">Date</th>
                    <th className="px-5 py-3 text-left text-muted-foreground font-medium">TA (mmHg)</th>
                    <th className="px-5 py-3 text-left text-muted-foreground font-medium">Pouls (bpm)</th>
                    <th className="px-5 py-3 text-left text-muted-foreground font-medium">Temp. (°C)</th>
                    <th className="px-5 py-3 text-left text-muted-foreground font-medium">SpO₂ (%)</th>
                    <th className="px-5 py-3 text-left text-muted-foreground font-medium">Glc (mmol/L)</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.history.map((h) => (
                    <tr key={h.date} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                      <td className="px-5 py-3 text-foreground">{h.date}</td>
                      <td className="px-5 py-3 text-foreground">{h.bp}</td>
                      <td className="px-5 py-3 text-foreground">{h.pulse}</td>
                      <td className="px-5 py-3 text-foreground">{h.temp}</td>
                      <td className="px-5 py-3 text-foreground">{h.spo2}</td>
                      <td className="px-5 py-3 text-foreground">{h.glucose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
