import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  Bell,
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Pill,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: LucideIcon;
}

export default function NotificationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
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

    Promise.all([
      fetch("/api/appointments", { headers }).then((r) =>
        r.ok ? r.json() : [],
      ),
      fetch("/api/prescriptions", { headers }).then((r) =>
        r.ok ? r.json() : [],
      ),
    ])
      .then(async ([appts, rxs]) => {
        const notifs: Notification[] = [];
        let id = 1;
        const now = new Date();

        // Resolve doctor names
        const doctorIds = [
          ...new Set([
            ...appts.map((a: any) => a.doctorId),
            ...rxs.map((r: any) => r.doctorId),
          ]),
        ];
        const names: Record<string, string> = {};
        await Promise.all(
          doctorIds.map((did) =>
            fetch(`/api/users/${did}`, { headers })
              .then((r) => (r.ok ? r.json() : null))
              .then((u) => {
                if (u) names[did] = `Dr. ${u.firstName} ${u.lastName}`;
              })
              .catch(() => {}),
          ),
        );

        // Upcoming appointment reminders
        for (const appt of appts) {
          const apptDate = new Date(`${appt.date}T${appt.time}`);
          if (
            apptDate > now &&
            (appt.status === "confirmed" || appt.status === "pending")
          ) {
            const hoursUntil = Math.round(
              (apptDate.getTime() - now.getTime()) / 3600000,
            );
            const timeLabel =
              hoursUntil <= 24
                ? `dans ${hoursUntil}h`
                : `le ${new Date(appt.date).toLocaleDateString("fr-FR")}`;
            notifs.push({
              id: id++,
              type: "appointment",
              title: "Rappel de rendez-vous",
              message: `Vous avez un rendez-vous avec ${names[appt.doctorId] || "un médecin"} ${timeLabel} à ${appt.time}`,
              date: new Date().toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              read: hoursUntil > 48,
              icon: Calendar,
            });
          }
        }

        // Completed consultation notifications
        for (const appt of appts) {
          if (appt.status === "completed") {
            notifs.push({
              id: id++,
              type: "success",
              title: "Consultation complétée",
              message: `Votre consultation avec ${names[appt.doctorId] || "un médecin"} a été complétée`,
              date: new Date(appt.date).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              read: true,
              icon: CheckCircle,
            });
          }
        }

        // Prescription notifications
        for (const rx of rxs) {
          notifs.push({
            id: id++,
            type: "prescription",
            title: "Nouvelle ordonnance",
            message: `${names[rx.doctorId] || "Un médecin"} vous a prescrit ${rx.medicines?.length || 0} médicament(s)`,
            date: new Date(rx.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
            read: true,
            icon: Pill,
          });
        }

        setNotifications(notifs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Notifications
                </h1>
                <p className="text-muted-foreground mt-2">
                  Vous avez {notifications.filter((n) => !n.read).length}{" "}
                  nouvelle(s) notification(s)
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucune notification</p>
                <p className="text-sm mt-1">
                  Vos notifications apparaîtront ici
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-lg border-2 flex items-start gap-4 ${
                        notif.read
                          ? "bg-card border-border"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg flex-shrink-0 ${
                          notif.type === "appointment"
                            ? "bg-blue-100 text-blue-700"
                            : notif.type === "prescription"
                              ? "bg-purple-100 text-purple-700"
                              : notif.type === "alert"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                        }`}
                      >
                        <Icon size={20} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground">
                          {notif.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notif.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {notif.date}
                        </p>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                          >
                            Marquer
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notif.id)}
                          className="p-2 hover:bg-muted rounded transition"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
