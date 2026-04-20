import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Calendar, Clock, Video, CalendarX2, RefreshCw } from "lucide-react";

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isLoading && !isAuthenticated) navigate("/login");
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("megacare_token");
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/appointments", { headers })
      .then((r) => r.json())
      .then((j: any) => (Array.isArray(j) ? j : (j.data ?? [])))
      .then((data: Appointment[]) => {
        setAppointments(data);
        const doctorIds = [...new Set(data.map((a) => a.doctorId))];
        doctorIds.forEach((dId) => {
          fetch(`/api/users/${dId}`, { headers })
            .then((r) => r.json())
            .then((u) => {
              if (u?.firstName) setDoctors((prev) => ({ ...prev, [dId]: `${u.firstName} ${u.lastName}` }));
            })
            .catch(() => {});
        });
      })
      .catch(() => {});
  }, [isAuthenticated]);

  if (isLoading || !isAuthenticated || !user) return null;

  const today = new Date().toISOString().split("T")[0];

  const upcoming = appointments
    .filter((a) => a.status !== "cancelled" && a.status !== "rejected" && a.status !== "completed" && a.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const nextConfirmed = upcoming.filter((a) => a.status === "confirmed");
  const pending = upcoming.filter((a) => a.status === "pending");

  const past = appointments
    .filter((a) => a.status === "completed" || ((a.status === "confirmed" || a.status === "pending") && a.date < today))
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  const hasAny = upcoming.length > 0 || past.length > 0;

  const statusLabel = (s: string) => {
    const m: Record<string, string> = { confirmed: "Confirmé", pending: "En attente", cancelled: "Annulé", rejected: "Refusé", completed: "Terminée" };
    return m[s] || s;
  };
  const statusColor = (s: string) => {
    const m: Record<string, string> = { confirmed: "bg-green-50 text-green-700 border-green-200", pending: "bg-orange-50 text-orange-700 border-orange-200", cancelled: "bg-red-50 text-red-700 border-red-200", rejected: "bg-red-50 text-red-700 border-red-200", completed: "bg-blue-50 text-blue-700 border-blue-200" };
    return m[s] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const handleJoin = (apt: Appointment) => {
    sessionStorage.setItem("patient_live_consultation", JSON.stringify({ doctorName: doctors[apt.doctorId] || "Médecin", doctorId: apt.doctorId, appointmentId: apt.id }));
    navigate("/dashboard/live-consultation");
  };

  const handleCancel = async (aptId: string) => {
    const token = localStorage.getItem("megacare_token");
    await fetch(`/api/appointments/${aptId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    setAppointments((prev) => prev.filter((a) => a.id !== aptId));
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const Card = ({ apt }: { apt: Appointment }) => {
    const name = doctors[apt.doctorId] || "Médecin";
    const canAct = apt.date >= today && apt.status !== "completed" && apt.status !== "cancelled" && apt.status !== "rejected";
    return (
      <div className="bg-card rounded-xl border border-border p-5 space-y-4 hover:shadow-md transition">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0">👨‍⚕️</div>
            <div>
              <h3 className="font-semibold text-foreground">Dr. {name}</h3>
              <p className="text-sm text-muted-foreground">{apt.reason || "Consultation"}</p>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(apt.status)}`}>{statusLabel(apt.status)}</span>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground"><Calendar size={15} className="text-primary" />{fmtDate(apt.date)}</div>
          <div className="flex items-center gap-2 text-muted-foreground"><Clock size={15} className="text-primary" />{apt.time} · 30 min</div>
          <div className="flex items-center gap-2 text-muted-foreground"><Video size={15} className="text-primary" />Vidéo</div>
        </div>
        {canAct && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {apt.status === "confirmed" && (
              <button onClick={() => handleJoin(apt)} className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition">Rejoindre</button>
            )}
            <button onClick={() => handleCancel(apt.id)} className="px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-secondary transition">Annuler</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />
        <main className="flex-1 overflow-auto">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">Mes Rendez-vous</h1>
            <p className="text-muted-foreground mt-1">Gérez vos consultations médicales</p>
          </div>

          <div className="p-6 max-w-5xl mx-auto space-y-8">
            {!hasAny && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <CalendarX2 size={36} className="text-primary/60" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Vous n'avez aucun rendez-vous actuellement</h2>
                <p className="text-muted-foreground max-w-md mb-6">Prenez rendez-vous avec un médecin pour commencer. Vos prochains rendez-vous apparaîtront ici.</p>
                <button onClick={() => navigate("/doctors")} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition">Trouver un médecin</button>
              </div>
            )}

            {nextConfirmed.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar size={20} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Prochains rendez-vous</h2>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{nextConfirmed.length}</span>
                </div>
                <div className="space-y-3">{nextConfirmed.map((a) => <Card key={a.id} apt={a} />)}</div>
              </section>
            )}

            {pending.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <RefreshCw size={20} className="text-orange-500" />
                  <h2 className="text-lg font-bold text-foreground">En attente de confirmation</h2>
                  <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{pending.length}</span>
                </div>
                <div className="space-y-3">{pending.map((a) => <Card key={a.id} apt={a} />)}</div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} className="text-muted-foreground" />
                  <h2 className="text-lg font-bold text-foreground">Historique</h2>
                  <span className="text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{past.length}</span>
                </div>
                <div className="space-y-3">{past.map((a) => <Card key={a.id} apt={a} />)}</div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
