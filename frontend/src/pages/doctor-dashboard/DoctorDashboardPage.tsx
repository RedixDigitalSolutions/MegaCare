import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Video, TrendingUp, Star, Clock, Settings } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: string;
  createdAt: string;
}

export default function DoctorDashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const fetchAppointments = useCallback(async () => {
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    try {
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: Appointment[] = await res.json();
        setAllAppointments(data);
      }
    } catch {
      /* server unreachable */
    } finally {
      setFetchLoading(false);
    }
  }, []);

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
    if (
      !isLoading &&
      user &&
      user.role === "doctor" &&
      user.status !== "approved"
    ) {
      navigate("/account-review");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "doctor") {
      fetchAppointments();
    }
  }, [isAuthenticated, user, fetchAppointments]);

  useEffect(() => {
    const timer = setInterval(
      () => setCountdown((s) => Math.max(0, s - 1)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  if (isLoading || fetchLoading) {
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
  const specialty = user.specialization || "Cardiologie";

  const todayDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const todayKey = new Date().toISOString().split("T")[0];

  // Derive data from fetched appointments
  const todayAppointments = allAppointments.filter(
    (a) => a.date === todayKey && a.status !== "rejected",
  );
  const pendingAppointments = allAppointments.filter(
    (a) => a.status === "pending",
  );
  const confirmedToday = todayAppointments.filter(
    (a) => a.status === "confirmed",
  );

  // Build time slots for today's agenda view
  const SLOT_TIMES = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
  ];
  const timeSlots = SLOT_TIMES.map((time) => {
    const appt = todayAppointments.find((a) => a.time === time);
    if (appt) {
      return {
        time,
        status: appt.status,
        patient: appt.patientName,
        reason: appt.reason,
      };
    }
    return {
      time,
      status: "free" as const,
      patient: undefined,
      reason: undefined,
    };
  });

  // Next consultation: first confirmed appointment after now
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const upcomingConfirmed = confirmedToday
    .filter((a) => {
      const [h, m] = a.time.split(":").map(Number);
      return h * 60 + m > nowMinutes;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const nextConsultation = upcomingConfirmed[0] || null;

  // Countdown to next consultation
  if (nextConsultation && countdown === 0) {
    const [h, m] = nextConsultation.time.split(":").map(Number);
    const diff = h * 60 + m - nowMinutes;
    if (diff > 0) {
      setCountdown(diff * 60);
    }
  }

  const confirmAppointment = async (id: string) => {
    const token = localStorage.getItem("megacare_token");
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "confirmed" }),
      });
      if (res.ok) {
        setAllAppointments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a)),
        );
      }
    } catch {
      /* ignore */
    }
  };

  const rejectAppointment = async (id: string) => {
    const token = localStorage.getItem("megacare_token");
    try {
      const res = await fetch(`/api/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (res.ok) {
        setAllAppointments((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {
      /* ignore */
    }
  };

  const kpiCards = [
    {
      icon: Video,
      title: "Consultations",
      value: String(confirmedToday.length),
      subtitle: "Aujourd'hui",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      title: "Total RDV",
      value: String(allAppointments.length),
      subtitle: "Tous les rendez-vous",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Star,
      title: "Aujourd'hui",
      value: String(todayAppointments.length),
      subtitle: "Créneaux occupés",
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Clock,
      title: "RDV en attente",
      value: String(pendingAppointments.length),
      subtitle: "Confirmation requise",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Dr. {doctorName}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {specialty} • {todayDate}
                </p>
              </div>
              <Link
                to="/doctor-dashboard/settings"
                className="px-5 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2 text-sm"
              >
                <Settings size={16} />
                Mon profil
              </Link>
            </div>
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
                          {apt.time} • {apt.date} • {apt.reason}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => confirmAppointment(apt.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition font-medium"
                        >
                          ✓ Confirmer
                        </button>
                        <button
                          onClick={() => rejectAppointment(apt.id)}
                          className="px-3 py-1 border border-red-300 text-red-700 rounded text-xs hover:bg-red-50 transition font-medium"
                        >
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
                {nextConsultation ? (
                  <div className="space-y-3">
                    <div className="bg-white/60 rounded-lg p-4 space-y-2">
                      <p className="text-sm text-muted-foreground">Dans</p>
                      <p
                        className={`text-3xl font-bold ${countdown === 0 ? "text-destructive animate-pulse" : "text-primary"}`}
                      >
                        {countdown > 0
                          ? `${Math.floor(countdown / 60)}m ${String(countdown % 60).padStart(2, "0")}s`
                          : "Maintenant"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        👤 {nextConsultation.patientName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Heure: {nextConsultation.time}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Motif: {nextConsultation.reason || "—"}
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
                ) : (
                  <div className="bg-white/60 rounded-lg p-4 text-center">
                    <p className="text-muted-foreground text-sm">
                      Aucune consultation confirmée à venir aujourd'hui
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Appointments by status */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-bold text-foreground">
                  Répartition par statut
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      name: "Confirmés",
                      count: allAppointments.filter(
                        (a) => a.status === "confirmed",
                      ).length,
                      color: "bg-blue-500",
                    },
                    {
                      name: "En attente",
                      count: allAppointments.filter(
                        (a) => a.status === "pending",
                      ).length,
                      color: "bg-orange-500",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <p className="text-sm text-foreground">{item.name}</p>
                      </div>
                      <p className="font-semibold text-primary">{item.count}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming appointments */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <h3 className="font-bold text-foreground">
                  Prochains rendez-vous
                </h3>
                <div className="space-y-3">
                  {allAppointments
                    .filter(
                      (a) => a.date >= todayKey && a.status !== "rejected",
                    )
                    .sort(
                      (a, b) =>
                        a.date.localeCompare(b.date) ||
                        a.time.localeCompare(b.time),
                    )
                    .slice(0, 5)
                    .map((a) => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="text-sm text-foreground">
                            {a.patientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {a.date} à {a.time}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            a.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {a.status === "confirmed" ? "Confirmé" : "En attente"}
                        </span>
                      </div>
                    ))}
                  {allAppointments.filter(
                    (a) => a.date >= todayKey && a.status !== "rejected",
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Aucun rendez-vous à venir
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
