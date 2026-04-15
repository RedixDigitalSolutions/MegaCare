import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import {
  Users,
  Calendar,
  UserCheck,
  TrendingUp,
  FileText,
  Video,
  Activity,
  Package,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  ClipboardList,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const quickActions = [
  { href: "/medical-service-dashboard/patients", icon: Users, label: "Patients", desc: "Suivre les hospitalisations", color: "bg-blue-50 text-blue-600" },
  { href: "/medical-service-dashboard/team", icon: UserCheck, label: "Mon Équipe", desc: "Infirmiers & paramédicaux", color: "bg-purple-50 text-purple-600" },
  { href: "/medical-service-dashboard/schedule", icon: Calendar, label: "Planification", desc: "Visites et rendez-vous", color: "bg-indigo-50 text-indigo-600" },
  { href: "/medical-service-dashboard/prescriptions", icon: FileText, label: "Ordonnances", desc: "Prescrire et gérer", color: "bg-emerald-50 text-emerald-600" },
  { href: "/medical-service-dashboard/teleconsultation", icon: Video, label: "Téléconsultation", desc: "Consultations vidéo", color: "bg-sky-50 text-sky-600" },
  { href: "/medical-service-dashboard/vitals", icon: Activity, label: "Constantes Vitales", desc: "Suivi TA, pouls, SpO₂", color: "bg-red-50 text-red-600" },
  { href: "/medical-service-dashboard/equipment", icon: Package, label: "Équipements", desc: "Inventaire médical", color: "bg-amber-50 text-amber-600" },
  { href: "/medical-service-dashboard/billing", icon: CreditCard, label: "Facturation", desc: "Factures & paiements", color: "bg-lime-50 text-lime-600" },
  { href: "/medical-service-dashboard/messaging", icon: MessageSquare, label: "Messagerie", desc: "Chat équipe & médecins", color: "bg-cyan-50 text-cyan-600" },
  { href: "/medical-service-dashboard/analytics", icon: BarChart3, label: "Statistiques", desc: "Rapports & analytics", color: "bg-violet-50 text-violet-600" },
  { href: "/medical-service-dashboard/settings", icon: Settings, label: "Paramètres", desc: "Configuration du service", color: "bg-slate-50 text-slate-600" },
];

const recentActivities = [
  { id: 1, icon: Plus, color: "bg-blue-100 text-blue-600", text: "Nouveau patient admis : Fatima Ben Ali", time: "Il y a 20 min" },
  { id: 2, icon: CheckCircle2, color: "bg-green-100 text-green-600", text: "Visite complétée : Mohammed Gharbi — Samir K.", time: "Il y a 1h" },
  { id: 3, icon: AlertCircle, color: "bg-red-100 text-red-600", text: "Alerte critique : SpO₂ 88% — Ahmed Nasser", time: "Il y a 2h" },
  { id: 4, icon: FileText, color: "bg-purple-100 text-purple-600", text: "Ordonnance créée : Leila Mansouri — Insuline", time: "Il y a 3h" },
  { id: 5, icon: ClipboardList, color: "bg-amber-100 text-amber-600", text: "Nouvelle visite planifiée : Youssef T. — 09:00", time: "Il y a 4h" },
  { id: 6, icon: CreditCard, color: "bg-lime-100 text-lime-600", text: "Paiement reçu : Facture #2024-089 — 1 500 DT", time: "Il y a 6h" },
  { id: 7, icon: UserCheck, color: "bg-indigo-100 text-indigo-600", text: "Membre d'équipe ajouté : Hana Riahi — Infirmière", time: "Hier" },
];

export default function MedicalServiceDashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
    if (!isLoading && user && user.role !== "medical_service") {
      const dashboards: Record<string, string> = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        lab_radiology: "/lab-dashboard",
        paramedical: "/paramedical-dashboard",
      };
      navigate(dashboards[user.role] ?? "/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "medical_service") {
    return null;
  }

  const firstName = user.firstName || "Gestionnaire";
  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "MS";

  const [kpiData, setKpiData] = useState<{ totalPatients: number; visitsToday: number; teamCount: number; revenue: number } | null>(null);

  useEffect(() => {
    fetch("/api/medical-service/kpis", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => setKpiData(d))
      .catch(() => { });
  }, []);

  const kpiCards = [
    { icon: Users, label: "Patients Actifs", value: kpiData ? String(kpiData.totalPatients) : "—", sub: "En cours", subColor: "text-green-600", iconColor: "text-blue-500", iconBg: "bg-blue-50" },
    { icon: Calendar, label: "Visites Aujourd'hui", value: kpiData ? String(kpiData.visitsToday) : "—", sub: "Planifiées", subColor: "text-amber-600", iconColor: "text-indigo-500", iconBg: "bg-indigo-50" },
    { icon: UserCheck, label: "Taille de l'Équipe", value: kpiData ? String(kpiData.teamCount) : "—", sub: "Actifs", subColor: "text-blue-600", iconColor: "text-purple-500", iconBg: "bg-purple-50" },
    { icon: TrendingUp, label: "Revenus Mensuels", value: kpiData ? `${kpiData.revenue} DT` : "—", sub: "Encaissés", subColor: "text-green-600", iconColor: "text-emerald-500", iconBg: "bg-emerald-50" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Tableau de bord</h1>
            <p className="text-xs text-muted-foreground capitalize">{todayLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-foreground">{firstName}</p>
              <p className="text-xs text-muted-foreground">Services Médicaux</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Welcome */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">Bonjour, {firstName} 👋</h2>
            <p className="text-muted-foreground text-sm">Voici un résumé de votre service d'hospitalisation à domicile.</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {kpiCards.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">{k.label}</p>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${k.iconBg}`}>
                      <Icon size={18} className={k.iconColor} />
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{k.value}</p>
                  <p className={`text-xs mt-1 font-medium ${k.subColor}`}>{k.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions — 11-tile grid */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Accès rapide</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    to={action.href}
                    className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all group flex flex-col items-center text-center gap-2"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-tight">{action.label}</p>
                    <p className="text-xs text-muted-foreground leading-tight hidden sm:block">{action.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Clock size={16} className="text-muted-foreground" />
                Activité Récente
              </h3>
              <span className="text-xs text-muted-foreground">{recentActivities.length} événements</span>
            </div>
            <div className="divide-y divide-border">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${activity.color}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium leading-snug">{activity.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
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

