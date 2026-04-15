
import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import {
  Video, Clock, CheckCircle2, History, Phone, Calendar,
  Users, TrendingUp,
} from "lucide-react";

type Tab = "upcoming" | "completed" | "history";

interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  status: string;
  notes: string;
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

function statusToTab(status: string): Tab {
  if (status === "Planifié" || status === "En cours") return "upcoming";
  if (status === "Complété") return "completed";
  return "history";
}

const appointments: Appointment[] = [];

export default function TeleconsultationPage() {
  const [activeTab, setActiveTab] = useState<Tab>("upcoming");
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    fetch("/api/medical-service/teleconsultation", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => setAppointments(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const filtered = appointments.filter((a) => statusToTab(a.status) === activeTab);

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
              const count = appointments.filter((a) => statusToTab(a.status) === t.key).length;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
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

                {statusToTab(a.status) === "upcoming" && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
                    <Video size={15} />
                    Démarrer la consultation
                  </button>
                )}
                {statusToTab(a.status) === "completed" && (
                  <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <CheckCircle2 size={14} />
                    Consultation terminée
                  </div>
                )}
                {statusToTab(a.status) === "history" && (
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
