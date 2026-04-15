import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Video, Download, MessageSquare, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ConsultationData {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}

export default function ConsultationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/appointments", { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((j: any) => Array.isArray(j) ? j : (j.data ?? []))
      .then(async (appts: ConsultationData[]) => {
        // Show completed appointments as past consultations
        const completed = appts.filter((a) => a.status === "completed");
        // Also include confirmed past appointments
        const now = new Date();
        const pastConfirmed = appts.filter((a) => {
          if (a.status === "completed") return false;
          const d = new Date(`${a.date}T${a.time}`);
          return d < now && a.status === "confirmed";
        });
        const all = [...completed, ...pastConfirmed];

        // Resolve doctor names
        const doctorIds = [...new Set(all.map((a) => a.doctorId))];
        const names: Record<string, { name: string; specialty: string }> = {};
        await Promise.all(
          doctorIds.map((id) =>
            fetch(`/api/users/${id}`, { headers })
              .then((r) => (r.ok ? r.json() : null))
              .then((u) => {
                if (u)
                  names[id] = {
                    name: `Dr. ${u.firstName} ${u.lastName}`,
                    specialty: u.specialization || "Médecine générale",
                  };
              })
              .catch(() => { }),
          ),
        );

        setConsultations(
          all
            .sort(
              (a, b) =>
                new Date(`${b.date}T${b.time}`).getTime() -
                new Date(`${a.date}T${a.time}`).getTime(),
            )
            .map((a) => ({
              id: a.id,
              doctor: names[a.doctorId]?.name || "Médecin",
              specialty: names[a.doctorId]?.specialty || "",
              date: new Date(a.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              reason: a.reason || "Consultation",
              status: a.status,
            })),
        );
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Mes consultations
              </h1>
              <p className="text-muted-foreground mt-2">
                Historique de vos consultations médicales
              </p>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : consultations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium">
                    Aucune consultation passée
                  </p>
                  <p className="text-sm mt-1">
                    Vos consultations complétées apparaîtront ici
                  </p>
                </div>
              ) : (
                consultations.map((cons) => (
                  <div
                    key={cons.id}
                    className="bg-card border border-border rounded-lg p-6"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {cons.doctor}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {cons.specialty}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                          {cons.date}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Motif
                        </p>
                        <p className="text-foreground">{cons.reason}</p>
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <button className="px-4 py-2 border border-border hover:bg-muted rounded-lg transition flex items-center gap-2">
                          <MessageSquare size={18} />
                          Contacter le médecin
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
