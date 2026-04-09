import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  Clock,
  CheckCircle,
  XCircle,
  Video,
  MapPin,
  FileText,
  Download,
  Eye,
  User,
  AlertCircle,
} from "lucide-react";

type ConsultStatus = "Complétée" | "En attente" | "Annulée";
type ConsultType = "Vidéo" | "Cabinet";

interface Consultation {
  id: number;
  patient: string;
  age: number;
  date: string;
  time: string;
  duration: string;
  status: ConsultStatus;
  type: ConsultType;
  diagnosis: string;
  notes: string;
}

const consultations: Consultation[] = [
  {
    id: 1,
    patient: "Fatima Benali",
    age: 34,
    date: "2026-04-03",
    time: "14:00",
    duration: "30 min",
    status: "Complétée",
    type: "Vidéo",
    diagnosis: "Hypertension artérielle légère",
    notes: "Renouvellement ordonnance Amlodipine 5mg, contrôle dans 3 mois.",
  },
  {
    id: 2,
    patient: "Mohamed Karoui",
    age: 52,
    date: "2026-04-02",
    time: "10:30",
    duration: "45 min",
    status: "Complétée",
    type: "Cabinet",
    diagnosis: "Douleurs thoraciques atypiques",
    notes: "ECG normal. Stress professionnel probable. Repos conseillé.",
  },
  {
    id: 3,
    patient: "Aisha Hamdi",
    age: 28,
    date: "2026-04-05",
    time: "17:00",
    duration: "30 min",
    status: "En attente",
    type: "Vidéo",
    diagnosis: "—",
    notes: "—",
  },
  {
    id: 4,
    patient: "Salim Drissi",
    age: 61,
    date: "2026-03-28",
    time: "09:00",
    duration: "30 min",
    status: "Annulée",
    type: "Cabinet",
    diagnosis: "—",
    notes: "Annulé par le patient (déplacement).",
  },
  {
    id: 5,
    patient: "Layla Meddeb",
    age: 41,
    date: "2026-04-05",
    time: "15:30",
    duration: "30 min",
    status: "En attente",
    type: "Cabinet",
    diagnosis: "—",
    notes: "—",
  },
  {
    id: 6,
    patient: "Youssef Tlili",
    age: 47,
    date: "2026-04-01",
    time: "11:00",
    duration: "45 min",
    status: "Complétée",
    type: "Cabinet",
    diagnosis: "Insuffisance cardiaque compensée",
    notes: "Ajustement Furosémide. Bilan sanguin demandé.",
  },
  {
    id: 7,
    patient: "Nadia Boughanmi",
    age: 36,
    date: "2026-03-30",
    time: "09:30",
    duration: "30 min",
    status: "Complétée",
    type: "Vidéo",
    diagnosis: "Palpitations bénignes",
    notes: "Holter prescrit. Éviter café et tabac.",
  },
];

type TabFilter = "Toutes" | ConsultStatus;

const TABS: TabFilter[] = ["Toutes", "Complétée", "En attente", "Annulée"];

const STATUS_CONFIG: Record<
  ConsultStatus,
  { label: string; icon: React.ReactNode; badgeCls: string; ringCls: string }
> = {
  Complétée: {
    label: "Complétée",
    icon: <CheckCircle size={16} className="text-green-600" />,
    badgeCls: "bg-green-100 text-green-700",
    ringCls: "border-l-green-400",
  },
  "En attente": {
    label: "En attente",
    icon: <Clock size={16} className="text-orange-500" />,
    badgeCls: "bg-orange-100 text-orange-700",
    ringCls: "border-l-orange-400",
  },
  Annulée: {
    label: "Annulée",
    icon: <XCircle size={16} className="text-red-500" />,
    badgeCls: "bg-red-100 text-red-600",
    ringCls: "border-l-red-400",
  },
};

export default function DoctorConsultationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabFilter>("Toutes");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const filtered =
    activeTab === "Toutes"
      ? consultations
      : consultations.filter((c) => c.status === activeTab);

  const countOf = (s: TabFilter) =>
    s === "Toutes"
      ? consultations.length
      : consultations.filter((c) => c.status === s).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">
              Consultations
            </h1>
            <p className="text-muted-foreground mt-1">
              Historique complet par patient
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TABS.map((tab) => (
                <div
                  key={tab}
                  className="bg-card border border-border rounded-xl p-4 text-center"
                >
                  <p
                    className={`text-2xl font-bold ${
                      tab === "Complétée"
                        ? "text-green-600"
                        : tab === "En attente"
                          ? "text-orange-500"
                          : tab === "Annulée"
                            ? "text-red-500"
                            : "text-foreground"
                    }`}
                  >
                    {countOf(tab)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {tab === "Toutes" ? "Total" : tab}
                  </p>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {tab === "Toutes" ? "Toutes" : tab}
                  <span
                    className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      activeTab === tab
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {countOf(tab)}
                  </span>
                </button>
              ))}
            </div>

            {/* Consultation Cards */}
            <div className="space-y-3">
              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune consultation dans cette catégorie.
                </div>
              )}
              {filtered.map((cons) => {
                const cfg = STATUS_CONFIG[cons.status];
                const isExpanded = expandedId === cons.id;

                return (
                  <div
                    key={cons.id}
                    className={`bg-card rounded-xl border border-border border-l-4 ${cfg.ringCls} transition hover:shadow-md`}
                  >
                    {/* Card Header */}
                    <div className="p-5 flex items-start gap-4">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                        <User size={20} className="text-primary" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">
                            {cons.patient}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {cons.age} ans
                          </span>
                          <span
                            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badgeCls}`}
                          >
                            {cfg.icon}
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock size={13} />
                            {cons.date} à {cons.time} — {cons.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            {cons.type === "Vidéo" ? (
                              <Video size={13} />
                            ) : (
                              <MapPin size={13} />
                            )}
                            {cons.type}
                          </span>
                          {cons.diagnosis !== "—" && (
                            <span className="flex items-center gap-1">
                              <FileText size={13} />
                              {cons.diagnosis}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                        {cons.status === "Complétée" && (
                          <>
                            <button
                              onClick={() =>
                                setExpandedId(isExpanded ? null : cons.id)
                              }
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition text-sm"
                            >
                              <Eye size={14} />
                              {isExpanded ? "Masquer" : "Notes"}
                            </button>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition text-sm">
                              <Download size={14} />
                              Rapport
                            </button>
                          </>
                        )}
                        {cons.status === "En attente" && (
                          <>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
                              <Video size={14} />
                              Rejoindre
                            </button>
                            <button className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm">
                              Annuler
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expandable Notes (Complétée only) */}
                    {isExpanded && cons.status === "Complétée" && (
                      <div className="px-5 pb-5 border-t border-border pt-4 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Notes du médecin
                        </p>
                        <p className="text-sm text-foreground bg-muted/40 rounded-lg px-4 py-3">
                          {cons.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
