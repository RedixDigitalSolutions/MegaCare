import { useState } from "react";
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

const patientsData: Record<string, PatientVitals> = {
  "P-001": {
    name: "Fatima Ben Ali",
    vitals: [
      { label: "Tension Artérielle", value: "120/80", unit: "mmHg", status: "Normal", reference: "< 130/80", icon: Activity },
      { label: "Pouls", value: "72", unit: "bpm", status: "Normal", reference: "60–100", icon: Heart },
      { label: "Température", value: "37.2", unit: "°C", status: "Normal", reference: "36.1–37.2", icon: Thermometer },
      { label: "SpO₂", value: "98", unit: "%", status: "Normal", reference: "> 95", icon: Droplets },
      { label: "Glycémie", value: "5.4", unit: "mmol/L", status: "Normal", reference: "3.9–7.8", icon: Activity },
    ],
    history: [
      { date: "2026-04-04", bp: "122/82", pulse: 74, temp: 37.1, spo2: 98, glucose: 5.5 },
      { date: "2026-04-03", bp: "118/78", pulse: 70, temp: 37.0, spo2: 99, glucose: 5.2 },
      { date: "2026-04-02", bp: "125/85", pulse: 78, temp: 37.3, spo2: 97, glucose: 5.8 },
    ],
  },
  "P-002": {
    name: "Mohammed Gharbi",
    vitals: [
      { label: "Tension Artérielle", value: "145/95", unit: "mmHg", status: "Attention", reference: "< 130/80", icon: Activity },
      { label: "Pouls", value: "88", unit: "bpm", status: "Normal", reference: "60–100", icon: Heart },
      { label: "Température", value: "38.5", unit: "°C", status: "Attention", reference: "36.1–37.2", icon: Thermometer },
      { label: "SpO₂", value: "94", unit: "%", status: "Attention", reference: "> 95", icon: Droplets },
      { label: "Glycémie", value: "12.8", unit: "mmol/L", status: "Critique", reference: "3.9–7.8", icon: Activity },
    ],
    history: [
      { date: "2026-04-04", bp: "142/92", pulse: 85, temp: 38.2, spo2: 95, glucose: 11.5 },
      { date: "2026-04-03", bp: "148/96", pulse: 90, temp: 38.0, spo2: 94, glucose: 13.2 },
      { date: "2026-04-02", bp: "150/98", pulse: 92, temp: 37.8, spo2: 96, glucose: 14.1 },
    ],
  },
  "P-003": {
    name: "Sonia Trabelsi",
    vitals: [
      { label: "Tension Artérielle", value: "160/100", unit: "mmHg", status: "Critique", reference: "< 130/80", icon: Activity },
      { label: "Pouls", value: "110", unit: "bpm", status: "Attention", reference: "60–100", icon: Heart },
      { label: "Température", value: "39.1", unit: "°C", status: "Critique", reference: "36.1–37.2", icon: Thermometer },
      { label: "SpO₂", value: "90", unit: "%", status: "Critique", reference: "> 95", icon: Droplets },
      { label: "Glycémie", value: "7.2", unit: "mmol/L", status: "Normal", reference: "3.9–7.8", icon: Activity },
    ],
    history: [
      { date: "2026-04-04", bp: "158/98", pulse: 108, temp: 38.8, spo2: 91, glucose: 7.0 },
      { date: "2026-04-03", bp: "162/102", pulse: 112, temp: 39.5, spo2: 89, glucose: 7.4 },
      { date: "2026-04-02", bp: "155/96", pulse: 106, temp: 38.6, spo2: 92, glucose: 6.8 },
    ],
  },
};

const patientList = [
  { id: "P-001", name: "Fatima Ben Ali" },
  { id: "P-002", name: "Mohammed Gharbi" },
  { id: "P-003", name: "Sonia Trabelsi" },
];

const statusConfig: Record<VitalStatus, { label: string; color: string; bg: string; border: string; icon: typeof CheckCircle2 }> = {
  Normal: { label: "Normal", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
  Attention: { label: "Attention", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle },
  Critique: { label: "Critique", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertCircle },
};

export default function VitalsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState("P-001");

  const patient = patientsData[selectedPatientId];
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
