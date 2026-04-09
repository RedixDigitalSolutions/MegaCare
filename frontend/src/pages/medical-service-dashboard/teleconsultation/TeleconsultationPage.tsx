
import { useState } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import {
  Video, Clock, CheckCircle2, History, Phone, Calendar,
  Users, TrendingUp,
} from "lucide-react";

type Tab = "upcoming" | "completed" | "history";

interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  tab: Tab;
  notes: string;
}

const appointments: Appointment[] = [
  { id: 1, patient: "Fatima Ben Ali", doctor: "Dr. Karim Mansouri", date: "2026-04-05", time: "10:00", duration: "30min", type: "Suivi post-op", tab: "upcoming", notes: "Contrôle cicatrisation" },
  { id: 2, patient: "Mohammed Gharbi", doctor: "Dr. Nour Belhadj", date: "2026-04-05", time: "11:30", duration: "20min", type: "Diabète", tab: "upcoming", notes: "Ajustement glycémie" },
  { id: 3, patient: "Sonia Trabelsi", doctor: "Dr. Sana Triki", date: "2026-04-06", time: "09:00", duration: "45min", type: "Kinésithérapie", tab: "upcoming", notes: "Séance rééducation" },
  { id: 4, patient: "Leila Mansouri", doctor: "Dr. Karim Mansouri", date: "2026-04-04", time: "14:00", duration: "30min", type: "Oncologie", tab: "completed", notes: "Résultats biopsie" },
  { id: 5, patient: "Ahmed Nasser", doctor: "Dr. Sana Triki", date: "2026-04-03", time: "10:30", duration: "20min", type: "Soins palliatifs", tab: "completed", notes: "Évaluation douleur" },
  { id: 6, patient: "Youssef Hamdi", doctor: "Dr. Nour Belhadj", date: "2026-03-28", time: "09:00", duration: "30min", type: "Plaies", tab: "history", notes: "Bilan cicatrisation" },
  { id: 7, patient: "Fatima Ben Ali", doctor: "Dr. Karim Mansouri", date: "2026-03-15", time: "11:00", duration: "20min", type: "Post-op", tab: "history", notes: "Premier contrôle" },
  { id: 8, patient: "Mohammed Gharbi", doctor: "Dr. Nour Belhadj", date: "2026-03-01", time: "14:00", duration: "30min", type: "Diabète", tab: "history", notes: "Bilan mensuel" },
];

export default function TeleconsultationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");

  const filtered = appointments.filter((a) => a.tab === activeTab);

  const kpis = [
    { label: "Consultations ce mois", value: "18", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Durée moyenne", value: "28 min", icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Taux de présence", value: "94%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { label: "Médecins connectés", value: "3", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const tabs: { key: Tab; label: string; icon: typeof CheckCircle2 }[] = [
    { key: "upcoming", label: "À venir", icon: Clock },
    { key: "completed", label: "Complétées", icon: CheckCircle2 },
    { key: "history", label: "Historique", icon: History },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Téléconsultation</h1>
          <p className="text-xs text-muted-foreground">Consultations vidéo avec médecins et spécialistes</p>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`}>
                    <Icon size={20} className={k.color} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{k.value}</p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted/40 p-1 rounded-xl w-fit">
            {tabs.map((t) => {
              const Icon = t.icon;
              const count = appointments.filter((a) => a.tab === t.key).length;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={15} />
                  {t.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === t.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <div key={a.id} className="bg-card rounded-xl border border-border p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{a.patient}</p>
                    <p className="text-xs text-muted-foreground">{a.doctor}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{a.type}</span>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2"><Calendar size={12} /> {a.date} à {a.time}</p>
                  <p className="flex items-center gap-2"><Clock size={12} /> Durée : {a.duration}</p>
                  {a.notes && <p className="italic text-foreground/60">"{a.notes}"</p>}
                </div>

                {a.tab === "upcoming" && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
                    <Video size={15} />
                    Démarrer la consultation
                  </button>
                )}
                {a.tab === "completed" && (
                  <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    Consultation terminée
                  </div>
                )}
                {a.tab === "history" && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition text-sm font-medium">
                    <Phone size={15} />
                    Voir le compte rendu
                  </button>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <Video size={40} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune consultation dans cet onglet</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
