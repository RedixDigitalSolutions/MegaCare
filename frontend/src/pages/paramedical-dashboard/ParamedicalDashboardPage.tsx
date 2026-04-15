import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  CalendarDays,
  ClipboardList,
  UserCircle,
  FileHeart,
  Activity,
  Video,
  MessageSquare,
  Bell,
  Map,
  Package,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const tok = () => localStorage.getItem("megacare_token") ?? "";

const quickLinks = [
  { href: "/paramedical-dashboard/appointments", label: "Rendez-vous", desc: "Gérer l'agenda", icon: CalendarDays, color: "text-blue-500", bg: "bg-blue-50" },
  { href: "/paramedical-dashboard/planning", label: "Planning", desc: "Ordre des visites", icon: ClipboardList, color: "text-indigo-500", bg: "bg-indigo-50" },
  { href: "/paramedical-dashboard/patients", label: "Patients", desc: "Fiches patients", icon: UserCircle, color: "text-teal-500", bg: "bg-teal-50" },
  { href: "/paramedical-dashboard/care-record", label: "Dossier de soins", desc: "Documenter les soins", icon: FileHeart, color: "text-rose-500", bg: "bg-rose-50" },
  { href: "/paramedical-dashboard/vitals", label: "Constantes", desc: "Suivi des vitales", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
  { href: "/paramedical-dashboard/teleconsultation", label: "Téléconsultation", desc: "Appel avec médecin", icon: Video, color: "text-violet-500", bg: "bg-violet-50" },
  { href: "/paramedical-dashboard/messaging", label: "Messagerie", desc: "Communication médicale", icon: MessageSquare, color: "text-sky-500", bg: "bg-sky-50" },
  { href: "/paramedical-dashboard/notifications", label: "Notifications", desc: "Alertes et rappels", icon: Bell, color: "text-orange-500", bg: "bg-orange-50" },
  { href: "/paramedical-dashboard/map", label: "Carte", desc: "Itinéraire optimisé", icon: Map, color: "text-green-500", bg: "bg-green-50" },
  { href: "/paramedical-dashboard/supplies", label: "Matériel", desc: "Inventaire médical", icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
  { href: "/paramedical-dashboard/reports", label: "Rapports", desc: "Résumés d'activité", icon: BarChart3, color: "text-slate-500", bg: "bg-slate-50" },
];

const recentActivity = [
  { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50", text: "Visite terminée — Mme Khaled (Pansement)", time: "Il y a 45 min" },
  { icon: Activity, color: "text-red-500", bg: "bg-red-50", text: "Alerte constantes — M. Gharbi : TA élevée", time: "Il y a 1h 10" },
  { icon: ClipboardCheck, color: "text-blue-500", bg: "bg-blue-50", text: "Dossier de soins validé — Mme Mansouri", time: "Il y a 2h 30" },
  { icon: CreditCard, color: "text-amber-500", bg: "bg-amber-50", text: "Paiement reçu : 450 DT — M. Nasser", time: "Il y a 4h" },
  { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50", text: "Rappel : Visite planifiée demain 08h00 — Mme Zahra", time: "Il y a 5h" },
];

export default function ParamedicalDashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<{
    totalPatients: number;
    consultationsToday: number;
    weeklyHours: number;
    recentActivities: { text: string; time: string; status: string }[];
  } | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    if (user.role !== "paramedical") {
      const dashboards: Partial<Record<UserRole, string>> = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        lab_radiology: "/lab-dashboard",
        admin: "/admin",
      };
      navigate(dashboards[user.role] ?? "/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    fetch("/api/paramedical/kpis", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d && typeof d === "object") setKpiData(d);
      })
      .catch(() => { });
  }, []);

  const kpis = [
    {
      label: "Patients Suivis",
      value: String(kpiData?.totalPatients ?? "—"),
      sub: "Suivi actif",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
      trend: "Données en direct",
      trendColor: "text-green-600",
    },
    {
      label: "Consultations Aujourd'hui",
      value: String(kpiData?.consultationsToday ?? "—"),
      sub: "Rendez-vous du jour",
      icon: Calendar,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      trend: "Mise a jour continue",
      trendColor: "text-amber-600",
    },
    {
      label: "Heures Cette Semaine",
      value: `${kpiData?.weeklyHours ?? "—"}h`,
      sub: "Semaine en cours",
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-50",
      trend: "Base soins enregistres",
      trendColor: "text-muted-foreground",
    },
    {
      label: "Revenus Mensuels",
      value: "—",
      sub: "Indisponible",
      icon: TrendingUp,
      color: "text-amber-500",
      bg: "bg-amber-50",
      trend: "Non calcule cote backend",
      trendColor: "text-muted-foreground",
    },
  ];

  const activities = (kpiData?.recentActivities ?? []).length
    ? (kpiData?.recentActivities ?? []).map((a) => ({
      icon: CheckCircle2,
      color: "text-blue-500",
      bg: "bg-blue-50",
      text: a.text,
      time: a.time,
    }))
    : recentActivity;

  if (isLoading || !isAuthenticated || !user || user.role !== "paramedical") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Page header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Bonjour, {user.firstName} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Tableau de bord — Paramédical
              </p>
            </div>
            <Link
              to="/paramedical-dashboard/planning"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
            >
              <CalendarDays size={15} />
              Voir le planning
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPI cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {kpis.map((kpi) => {
              const Icon = kpi.icon;
              return (
                <div
                  key={kpi.label}
                  className="bg-card rounded-xl border border-border p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-muted-foreground leading-tight">
                      {kpi.label}
                    </p>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${kpi.bg}`}>
                      <Icon size={16} className={kpi.color} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{kpi.sub}</span>
                    <span className={`text-xs font-medium ${kpi.trendColor}`}>{kpi.trend}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick links grid — 11 tiles */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Accès rapide</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {quickLinks.map((q) => {
                const Icon = q.icon;
                return (
                  <Link
                    key={q.href}
                    to={q.href}
                    className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/40 transition-all group space-y-2"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${q.bg}`}>
                      <Icon size={18} className={q.color} />
                    </div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-primary transition leading-tight">
                      {q.label}
                    </p>
                    <p className="text-xs text-muted-foreground leading-tight">{q.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground text-sm">Activité récente</h2>
              <Link
                to="/paramedical-dashboard/reports"
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                Voir rapports <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-border">
              {activities.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.bg}`}>
                      <Icon size={15} className={a.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{a.text}</p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
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
