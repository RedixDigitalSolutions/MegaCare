import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  Pill,
  Package,
  FileText,
  Clock,
  Camera,
  MapPin,
  Stethoscope,
  Video,
  Bell,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
    if (!isLoading && user && user.role !== "patient") {
      const dashboards: Record<string, string> = {
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        lab_radiology: "/lab-dashboard",
        paramedical: "/paramedical-dashboard",
        admin: "/admin",
      };
      navigate(dashboards[user.role] || "/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">
            Chargement du dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "patient") return null;

  const patientName =
    user.firstName || user.name?.split(" ")[0] || user.email.split("@")[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Amira Mansouri",
      specialty: "Cardiologie",
      date: "Demain",
      time: "14:00",
      type: "Vidéo",
      hoursUntil: 18,
    },
    {
      id: 2,
      doctor: "Fatima Zahra",
      specialty: "Dermatologie",
      date: "Jeu. 30 Jan",
      time: "11:00",
      type: "Vidéo",
      hoursUntil: 72,
    },
    {
      id: 3,
      doctor: "Leïla Khaled",
      specialty: "Psychologie",
      date: "Ven. 31 Jan",
      time: "17:00",
      type: "Vidéo",
      hoursUntil: 96,
    },
  ];

  const kpiCards = [
    {
      icon: Calendar,
      title: "RDV à venir",
      value: "2",
      subtitle: "Prochain: Demain 14h",
      iconClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      icon: Pill,
      title: "Ordonnances",
      value: "3",
      subtitle: "Expire dans 12 jours",
      iconClass: "text-accent",
      bgClass: "bg-accent/10",
    },
    {
      icon: Package,
      title: "Commandes",
      value: "1",
      subtitle: "Prête pour retrait",
      iconClass: "text-amber-500",
      bgClass: "bg-amber-500/10",
    },
    {
      icon: FileText,
      title: "Dossier médical",
      value: "65%",
      subtitle: "Mis à jour il y a 3j",
      iconClass: "text-violet-500",
      bgClass: "bg-violet-500/10",
    },
  ];

  const recentOrders = [
    {
      id: "CMD-001",
      pharmacy: "Pharmacie El Amal",
      items: 3,
      total: 125,
      status: "En attente",
      date: "Aujourd'hui",
    },
    {
      id: "CMD-002",
      pharmacy: "Pharmacie Centrale",
      items: 2,
      total: 89,
      status: "Retirée",
      date: "Hier",
    },
  ];

  const quickActions = [
    {
      to: "/dashboard/find-doctor",
      icon: Stethoscope,
      label: "Trouver un médecin",
      desc: "Nouveau rendez-vous",
      iconClass: "text-primary",
      bgClass: "bg-primary/10",
    },
    {
      to: "/pharmacy/prescription-scanner",
      icon: Camera,
      label: "Scanner ordonnance",
      desc: "Extraction OCR auto",
      iconClass: "text-accent",
      bgClass: "bg-accent/10",
    },
    {
      to: "/dashboard/medical-records",
      icon: FileText,
      label: "Mon dossier",
      desc: "Gérer mes informations",
      iconClass: "text-violet-500",
      bgClass: "bg-violet-500/10",
    },
    {
      to: "/consultation",
      icon: Video,
      label: "Consultation vidéo",
      desc: "Rejoindre maintenant",
      iconClass: "text-amber-500",
      bgClass: "bg-amber-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar userName={patientName} />

      <main className="flex-1 overflow-auto">
        {/* Sticky glass sub-header */}
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {greeting}, {patientName} 👋
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/dashboard/notifications"
                className="relative p-2 rounded-lg hover:bg-secondary transition text-muted-foreground hover:text-foreground"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
              </Link>
              <Link
                to="/dashboard/find-doctor"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium flex items-center gap-2"
              >
                <Stethoscope size={14} />
                Consulter
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-card rounded-xl border border-border p-5 space-y-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-11 h-11 rounded-xl ${card.bgClass} flex items-center justify-center`}
                    >
                      <Icon size={20} className={card.iconClass} />
                    </div>
                    <TrendingUp
                      size={13}
                      className="text-muted-foreground/30 mt-1"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-2xl font-extrabold text-foreground mt-0.5">
                      {card.value}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground border-t border-border pt-3">
                    {card.subtitle}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Next Appointment + Pharmacy ── */}
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Next Appointment — 3 cols */}
            <div className="lg:col-span-3 bg-card rounded-xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 flex items-center justify-between">
                <p className="text-white font-semibold text-sm flex items-center gap-2">
                  <Calendar size={14} />
                  Prochain rendez-vous
                </p>
                <span className="text-xs text-white/80 bg-white/20 px-2.5 py-1 rounded-full">
                  Dans {upcomingAppointments[0].hoursUntil}h
                </span>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Stethoscope size={24} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-foreground">
                      Dr. {upcomingAppointments[0].doctor}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      {upcomingAppointments[0].specialty}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {upcomingAppointments[0].date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {upcomingAppointments[0].time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-semibold flex items-center justify-center gap-2">
                    <Video size={14} />
                    Rejoindre la salle
                  </button>
                  <button className="flex-1 py-2.5 border border-border text-foreground rounded-lg hover:bg-secondary transition text-sm font-medium">
                    Voir détails
                  </button>
                </div>
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
                  <Clock size={11} />
                  Salle active 10 min avant le rendez-vous
                </p>
              </div>
            </div>

            {/* Pharmacy Quick Access — 2 cols */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden">
              <div className="bg-gradient-to-r from-accent to-accent/80 px-6 py-4">
                <p className="text-white font-semibold text-sm flex items-center gap-2">
                  <Pill size={14} />
                  Pharmacie en ligne
                </p>
              </div>
              <div className="p-4 space-y-2">
                {[
                  {
                    to: "/pharmacy/prescription-scanner",
                    icon: Camera,
                    label: "Scanner d'ordonnance",
                    desc: "Extraction OCR automatique",
                    iconClass: "text-primary",
                    bgClass: "bg-primary/10",
                    hoverBorder: "hover:border-primary/30 hover:bg-primary/5",
                    chevronHover: "group-hover:text-primary",
                  },
                  {
                    to: "/pharmacy",
                    icon: MapPin,
                    label: "Trouver une pharmacie",
                    desc: "Près de chez vous",
                    iconClass: "text-accent",
                    bgClass: "bg-accent/10",
                    hoverBorder: "hover:border-accent/30 hover:bg-accent/5",
                    chevronHover: "group-hover:text-accent",
                  },
                  {
                    to: "/dashboard/orders",
                    icon: Package,
                    label: "Mes commandes",
                    desc: "Suivi en temps réel",
                    iconClass: "text-amber-500",
                    bgClass: "bg-amber-500/10",
                    hoverBorder:
                      "hover:border-amber-500/30 hover:bg-amber-500/5",
                    chevronHover: "group-hover:text-amber-500",
                  },
                ].map(
                  ({
                    to,
                    icon: Icon,
                    label,
                    desc,
                    iconClass,
                    bgClass,
                    hoverBorder,
                    chevronHover,
                  }) => (
                    <Link
                      key={to}
                      to={to}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border border-border ${hoverBorder} transition group`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg ${bgClass} flex items-center justify-center shrink-0`}
                      >
                        <Icon size={16} className={iconClass} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">
                          {label}
                        </p>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`text-muted-foreground/30 ${chevronHover} transition`}
                      />
                    </Link>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* ── Appointments + Orders ── */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Appointments list */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Calendar size={15} className="text-primary" />
                  Mes rendez-vous
                </h3>
                <Link
                  to="/dashboard/appointments"
                  className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                >
                  Voir tous <ArrowRight size={12} />
                </Link>
              </div>
              <div className="p-4 space-y-2">
                {upcomingAppointments.map((apt, index) => (
                  <div
                    key={apt.id}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition ${
                      index === 0
                        ? "bg-primary/5 border-primary/20"
                        : "border-border hover:bg-secondary/30"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        index === 0 ? "bg-primary/10" : "bg-secondary"
                      }`}
                    >
                      <Stethoscope
                        size={15}
                        className={
                          index === 0 ? "text-primary" : "text-muted-foreground"
                        }
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">
                        Dr. {apt.doctor}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {apt.specialty}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-xs font-semibold ${
                          index === 0 ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {apt.date}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {apt.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders list */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <Package size={15} className="text-amber-500" />
                  Commandes récentes
                </h3>
                <Link
                  to="/dashboard/orders"
                  className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
                >
                  Voir toutes <ArrowRight size={12} />
                </Link>
              </div>
              <div className="p-4 space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-border hover:bg-secondary/30 transition space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {order.pharmacy}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {order.id} · {order.date}
                        </p>
                      </div>
                      <p className="font-bold text-foreground">
                        {order.total}{" "}
                        <span className="text-xs text-muted-foreground font-normal">
                          DT
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-2.5 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        {order.items} article{order.items > 1 ? "s" : ""}
                      </p>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          order.status === "En attente"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-accent/10 text-accent"
                        }`}
                      >
                        <CheckCircle2 size={10} />
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Quick Actions ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity size={15} className="text-muted-foreground" />
              <h2 className="text-sm font-semibold text-foreground">
                Accès rapide
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map(
                ({ to, icon: Icon, label, desc, iconClass, bgClass }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group bg-card rounded-xl border border-border p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 space-y-3"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <Icon size={20} className={iconClass} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {desc}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${iconClass}`}
                    >
                      Accéder <ArrowRight size={11} />
                    </div>
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
