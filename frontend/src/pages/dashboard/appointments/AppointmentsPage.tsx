import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Calendar, Clock, Video, MapPin } from "lucide-react";

interface Appointment {
  id: string;
  doctorId: string;
  doctorName?: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

export default function AppointmentsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">(
    "upcoming",
  );
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Fetch appointments + doctor names
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("megacare_token");
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/appointments", { headers })
      .then((r) => r.json())
      .then((data: Appointment[]) => {
        setAppointments(data);
        // Fetch doctor names
        const doctorIds = [...new Set(data.map((a) => a.doctorId))];
        doctorIds.forEach((dId) => {
          fetch(`/api/users/${dId}`, { headers })
            .then((r) => r.json())
            .then((u) => {
              if (u && u.firstName) {
                setDoctors((prev) => ({
                  ...prev,
                  [dId]: `${u.firstName} ${u.lastName}`,
                }));
              }
            })
            .catch(() => {});
        });
      })
      .catch(() => {});
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  const upcoming = appointments.filter(
    (a) =>
      a.status !== "cancelled" &&
      a.status !== "rejected" &&
      a.status !== "completed" &&
      a.date >= today,
  );
  const past = appointments.filter(
    (a) =>
      a.status === "completed" ||
      ((a.status === "confirmed" || a.status === "pending") && a.date < today),
  );
  const cancelled = appointments.filter(
    (a) => a.status === "cancelled" || a.status === "rejected",
  );

  const current =
    activeTab === "upcoming"
      ? upcoming
      : activeTab === "past"
        ? past
        : cancelled;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmé";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulé";
      case "rejected":
        return "Refusé";
      case "completed":
        return "Terminée";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-orange-50 text-orange-700";
      case "cancelled":
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const handleJoin = (apt: Appointment) => {
    const doctorFullName = doctors[apt.doctorId] || "Médecin";
    sessionStorage.setItem(
      "patient_live_consultation",
      JSON.stringify({
        doctorName: doctorFullName,
        doctorId: apt.doctorId,
        appointmentId: apt.id,
      }),
    );
    navigate("/dashboard/live-consultation");
  };

  const handleCancel = async (aptId: string) => {
    const token = localStorage.getItem("megacare_token");
    await fetch(`/api/appointments/${aptId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setAppointments((prev) => prev.filter((a) => a.id !== aptId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">
              Mes Rendez-vous
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos consultations médicales
            </p>
          </div>

          <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              {(["upcoming", "past", "cancelled"] as const).map((tab) => {
                const label =
                  tab === "upcoming"
                    ? "À venir"
                    : tab === "past"
                      ? "Passés"
                      : "Annulés";
                const count =
                  tab === "upcoming"
                    ? upcoming.length
                    : tab === "past"
                      ? past.length
                      : cancelled.length;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium border-b-2 transition ${
                      activeTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {current.map((apt) => {
                const doctorName = doctors[apt.doctorId] || "Médecin";
                return (
                  <div
                    key={apt.id}
                    className="bg-card rounded-lg border border-border p-6 space-y-4"
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          👨‍⚕️
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-foreground">
                            Dr. {doctorName}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {apt.reason}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(apt.status)}`}
                      >
                        {getStatusLabel(apt.status)}
                      </span>
                    </div>

                    {/* Details Row */}
                    <div className="flex flex-wrap gap-4 py-4 border-y border-border text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={16} className="text-primary" />
                        {apt.date}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock size={16} className="text-primary" />
                        {apt.time} · 30 min
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Video size={16} className="text-primary" />
                        Vidéo
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {(apt.status === "confirmed" ||
                        apt.status === "pending") &&
                        apt.status !== "completed" &&
                        apt.date >= today && (
                          <>
                            <button
                              onClick={() => handleJoin(apt)}
                              className="px-4 py-2 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition"
                            >
                              Rejoindre
                            </button>
                            <button
                              onClick={() => handleCancel(apt.id)}
                              className="px-4 py-2 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-secondary transition"
                            >
                              Annuler
                            </button>
                          </>
                        )}
                    </div>
                  </div>
                );
              })}

              {current.length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <p className="text-lg font-medium text-foreground">
                    Aucun rendez-vous
                  </p>
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore de rendez-vous{" "}
                    {activeTab === "upcoming"
                      ? "à venir"
                      : activeTab === "past"
                        ? "passés"
                        : "annulés"}
                    .
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
