import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import {
  FlaskConical,
  FileText,
  Users,
  TrendingUp,
  Image,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

const quickLinks = [
  {
    href: "/lab-dashboard/tests",
    label: "Analyses",
    desc: "Gérer les demandes d'analyse",
    icon: FlaskConical,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    href: "/lab-dashboard/results",
    label: "Résultats",
    desc: "Consulter et partager les résultats",
    icon: FileText,
    color: "text-green-500",
    bg: "bg-green-50",
  },
  {
    href: "/lab-dashboard/imaging",
    label: "Imagerie",
    desc: "Radiologies et imagerie diagnostique",
    icon: Image,
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    href: "/lab-dashboard/patients",
    label: "Patients",
    desc: "Gérer les dossiers patients",
    icon: Users,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    href: "/lab-dashboard/appointments",
    label: "Rendez-vous",
    desc: "Planifier les examens",
    icon: Calendar,
    color: "text-pink-500",
    bg: "bg-pink-50",
  },
  {
    href: "/lab-dashboard/billing",
    label: "Facturation",
    desc: "Gérer factures et paiements",
    icon: CreditCard,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    href: "/lab-dashboard/messaging",
    label: "Messagerie",
    desc: "Communication avec l'équipe",
    icon: MessageSquare,
    color: "text-teal-500",
    bg: "bg-teal-50",
  },
  {
    href: "/lab-dashboard/analytics",
    label: "Statistiques",
    desc: "Rapports d'activité",
    icon: BarChart3,
    color: "text-red-500",
    bg: "bg-red-50",
  },
  {
    href: "/lab-dashboard/settings",
    label: "Paramètres",
    desc: "Configurer le laboratoire",
    icon: Settings,
    color: "text-slate-500",
    bg: "bg-slate-50",
  },
];

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export default function LabDashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [kpiResponse, setKpiResponse] = useState({
    examsToday: 0,
    completedToday: 0,
    pendingResults: 0,
    criticalResults: 0,
  });
  const [loadingKpis, setLoadingKpis] = useState(true);
  const [partnerDoctors, setPartnerDoctors] = useState(0);
  const [recentActivity, setRecentActivity] = useState<
    { type: string; text: string; createdAt: string }[]
  >([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
    if (!isLoading && user && user.role !== "lab_radiology") {
      const dashboards: Record<string, string> = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        paramedical: "/paramedical-dashboard",
      };
      navigate(dashboards[user.role] ?? "/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "lab_radiology") return;
    const token = localStorage.getItem("megacare_token");
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/lab/kpis", { headers })
      .then((r) => r.json())
      .then((data) => {
        setKpiResponse(data);
        setLoadingKpis(false);
      })
      .catch(() => setLoadingKpis(false));

    fetch("/api/lab/partner-doctors", { headers })
      .then((r) => r.json())
      .then((data) => setPartnerDoctors(data.count ?? 0))
      .catch(() => {});

    fetch("/api/lab/activity", { headers })
      .then((r) => r.json())
      .then((data) => {
        setRecentActivity(Array.isArray(data) ? data : []);
        setLoadingActivity(false);
      })
      .catch(() => setLoadingActivity(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user || user.role !== "lab_radiology")
    return null;

  const kpis = [
    {
      label: "Examens aujourd'hui",
      value: loadingKpis ? "…" : String(kpiResponse.examsToday),
      sub: loadingKpis ? "" : `${kpiResponse.completedToday} complétés`,
      icon: FlaskConical,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Résultats en attente",
      value: loadingKpis ? "…" : String(kpiResponse.pendingResults),
      sub: "À traiter",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Résultats critiques",
      value: loadingKpis ? "…" : String(kpiResponse.criticalResults),
      sub: "Nécessitent attention",
      icon: AlertCircle,
      color: "text-red-500",
      bg: "bg-red-50",
    },
    {
      label: "Médecins partenaires",
      value: loadingKpis ? "…" : String(partnerDoctors),
      sub: "Actifs",
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <LabDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-xs text-muted-foreground">
            Bonjour {user.firstName} — Laboratoire & Radiologie
          </p>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className="bg-card rounded-xl border border-border p-4 flex items-center gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`}
                  >
                    <Icon size={20} className={k.color} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {k.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                    <p className="text-xs text-green-600 font-medium">
                      {k.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              Accès rapide
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {quickLinks.map((q) => {
                const Icon = q.icon;
                return (
                  <Link
                    key={q.href}
                    to={q.href}
                    className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/40 transition-all group space-y-2"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${q.bg}`}
                    >
                      <Icon size={18} className={q.color} />
                    </div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                      {q.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {q.desc}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground text-sm">
                Activité récente
              </h2>
            </div>
            <div className="divide-y divide-border">
              {loadingActivity ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} className="animate-spin text-muted-foreground" />
                </div>
              ) : recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground px-5 py-6 text-center">
                  Aucune activité récente
                </p>
              ) : (
                recentActivity.map((a, i) => {
                  const iconMap: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
                    completed: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
                    critical: { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                    in_progress: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                    new_request: { icon: FlaskConical, color: "text-blue-500", bg: "bg-blue-50" },
                    result: { icon: FileText, color: "text-purple-500", bg: "bg-purple-50" },
                  };
                  const style = iconMap[a.type] ?? iconMap.result;
                  const Icon = style.icon;
                  const ago = formatTimeAgo(a.createdAt);
                  return (
                    <div key={i} className="flex items-center gap-4 px-5 py-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${style.bg} shrink-0`}
                      >
                        <Icon size={15} className={style.color} />
                      </div>
                      <p className="flex-1 text-sm text-foreground">{a.text}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {ago}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
