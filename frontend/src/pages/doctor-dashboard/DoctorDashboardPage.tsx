
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Video, TrendingUp, Star, Clock, LogOut } from "lucide-react";
import { useEffect } from "react";

export default function DoctorDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
    if (!isLoading && user && user.role !== "doctor") {
      const dashboards = {
        patient: "/dashboard",
        pharmacy: "/pharmacy-dashboard",
      };
      navigate(dashboards[user.role as keyof typeof dashboards]);
    }
    // Block access if account not yet approved
    if (
      !isLoading &&
      user &&
      user.role === "doctor" &&
      user.status !== "approved"
    ) {
      navigate("/account-review");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== "doctor") {
    return null;
  }

  const doctorName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name || `${user.email.split("@")[0]}`;
  const licenseId = user.doctorId || "MD-001-2024";
  const specialty = user.specialization || "Cardiologie";

  const todayDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const kpiCards = [
    {
      icon: Video,
      title: "Consultations",
      value: "8",
      subtitle: "+2 vs hier",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      title: "Revenus",
      value: "360 DT",
      subtitle: "Mois: 4200 DT",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Star,
      title: "Note",
      value: "4.8",
      subtitle: "312 avis",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Clock,
      title: "RDV en attente",
      value: "3",
      subtitle: "Confirmation requise",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  const pendingAppointments = [
    {
      id: 1,
      patientName: "Fatima B.",
      specialty: "Cardiologie",
      time: "14:00",
      status: "En attente",
    },
    {
      id: 2,
      patientName: "Mohamed K.",
      specialty: "Cardiologie",
      time: "15:30",
      status: "En attente",
    },
    {
      id: 3,
      patientName: "Aisha H.",
      specialty: "Cardiologie",
      time: "17:00",
      status: "En attente",
    },
  ];

  const timeSlots = [
    { time: "08:00", status: "free" },
    { time: "08:30", status: "free" },
    { time: "09:00", status: "confirmed", patient: "Patient 1" },
    { time: "09:30", status: "confirmed", patient: "Patient 2" },
    { time: "10:00", status: "pending", patient: "Patient 3" },
    { time: "10:30", status: "free" },
    { time: "11:00", status: "free" },
    { time: "11:30", status: "confirmed", patient: "Patient 4" },
    { time: "12:00", status: "free" },
    { time: "12:30", status: "free" },
    { time: "14:00", status: "confirmed", patient: "Patient 5" },
    { time: "14:30", status: "free" },
  ];

  const nextConsultation = {
    patientName: "Prochaine consultation",
    timeUntil: "45 minutes",
    patientAge: 52,
    reason: "Suivi cardiaque régulier",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Dr. {doctorName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {specialty} • Licence: {licenseId}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
                  Paramètres du profil
                </button>
                <button
                  onClick={logout}
                  className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </div>
            <p className="text-muted-foreground">{todayDate}</p>
          </div>

          {/* Content */}
          <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-card rounded-xl border border-border p-6 space-y-3"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {card.value}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Pending Appointments Alert */}
            {pendingAppointments.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-orange-900 flex items-center gap-2">
                  <span className="text-xl">⏳</span>
                  {pendingAppointments.length} rendez-vous en attente de
                  confirmation
                </h3>
                <div className="space-y-2">
                  {pendingAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between bg-white rounded-lg p-3 border border-orange-100"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {apt.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {apt.time} • {apt.specialty}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition font-medium">
                          ✓ Confirmer
                        </button>
                        <button className="px-3 py-1 border border-red-300 text-red-700 rounded text-xs hover:bg-red-50 transition font-medium">
                          ✗ Refuser
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Agenda Timeline */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="text-xl font-bold text-foreground">
                  Agenda —{" "}
                  {todayDate.split(" ")[0].charAt(0).toUpperCase() +
                    todayDate.split(" ")[0].slice(1)}{" "}
                  {todayDate.split(" ")[1]}
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {timeSlots.map((slot, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 p-3 rounded-lg transition ${
                        slot.status === "free"
                          ? "bg-secondary/30 hover:bg-secondary"
                          : slot.status === "confirmed"
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-orange-50 border border-orange-200"
                      }`}
                    >
                      <p className="w-16 font-mono font-bold text-foreground">
                        {slot.time}
                      </p>
                      <div className="flex-1">
                        {slot.status === "free" ? (
                          <p className="text-xs text-muted-foreground">Libre</p>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-foreground">
                              {slot.patient}
                            </p>
                            <p
                              className={`text-xs ${
                                slot.status === "confirmed"
                                  ? "text-blue-700"
                                  : "text-orange-700"
                              }`}
                            >
                              {slot.status === "confirmed"
                                ? "Confirmé"
                                : "En attente"}
                            </p>
                          </>
                        )}
                      </div>
                      {slot.status === "free" && (
                        <button className="text-xs px-2 py-1 text-muted-foreground hover:bg-foreground/5 rounded transition">
                          Bloquer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Consultation */}
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border-2 border-primary/30 p-6 space-y-4">
                <h3 className="font-bold text-foreground">
                  Prochaine consultation
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/60 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">Dans</p>
                    <p className="text-3xl font-bold text-primary">
                      {nextConsultation.timeUntil}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      👤 {nextConsultation.patientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Âge: {nextConsultation.patientAge}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Motif: {nextConsultation.reason}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium text-sm">
                      Voir dossier
                    </button>
                    <button className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium text-sm">
                      Ouvrir salle
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Consultation Chart */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-bold text-foreground">
                  Consultations (7 derniers jours)
                </h3>
                <div className="flex items-end justify-between gap-2 h-32">
                  {[3, 5, 4, 6, 7, 8, 6].map((value, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center gap-2"
                    >
                      <div
                        className="w-full bg-primary rounded-t"
                        style={{ height: `${(value / 8) * 100}%` }}
                      ></div>
                      <p className="text-xs text-muted-foreground">
                        {["L", "M", "M", "J", "V", "S", "D"][idx]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Specialties */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-bold text-foreground">Top 5 spécialités</h3>
                <div className="space-y-3">
                  {[
                    { name: "Cardiologie", count: 342 },
                    { name: "Hypertension", count: 156 },
                    { name: "Cholestérol", count: 98 },
                    { name: "Arythmie", count: 67 },
                    { name: "Insuffisance", count: 45 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <p className="text-sm text-foreground">{item.name}</p>
                      <p className="font-semibold text-primary">{item.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
