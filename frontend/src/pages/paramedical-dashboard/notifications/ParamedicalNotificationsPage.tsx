import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  AlertTriangle,
  MessageSquare,
  Calendar,
  FileText,
  CheckCheck,
  Check,
  ChevronRight,
  Bell,
  BellOff,
} from "lucide-react";

type NotifType = "urgent" | "doctor" | "schedule" | "prescription";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

const typeConfig: Record<NotifType, { label: string; icon: typeof Bell; dot: string; bg: string; border: string; text: string }> = {
  urgent: { label: "Urgent", icon: AlertTriangle, dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  doctor: { label: "Médecin", icon: MessageSquare, dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  schedule: { label: "Planning", icon: Calendar, dot: "bg-amber-400", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  prescription: { label: "Ordonnance", icon: FileText, dot: "bg-violet-500", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
};

const tok = () => localStorage.getItem("megacare_token") ?? "";

const INITIAL: Notification[] = [];

type FilterType = "all" | NotifType;

export default function ParamedicalNotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(INITIAL);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetch("/api/paramedical/notifications", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => setNotifs(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const unreadCount = notifs.filter((n) => !n.read).length;

  const markRead = (id: string) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const markAllRead = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleAct = (n: Notification) => {
    markRead(n.id);
    // In a real app this would navigate or open a modal
  };

  const filtered = notifs.filter((n) => filter === "all" || n.type === filter);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "Tout" },
    { key: "urgent", label: "Urgents" },
    { key: "doctor", label: "Médecins" },
    { key: "schedule", label: "Planning" },
    { key: "prescription", label: "Ordonnances" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Notifications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unreadCount > 0 ? (
                <span className="text-primary font-medium">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</span>
              ) : (
                "Tout est à jour"
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition"
            >
              <CheckCheck size={15} />
              Tout marquer comme lu
            </button>
          )}
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-5">
            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => {
                const count = f.key === "all"
                  ? notifs.filter((n) => !n.read).length
                  : notifs.filter((n) => n.type === f.key && !n.read).length;
                return (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${filter === f.key
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border text-muted-foreground hover:border-primary/40"
                      }`}
                  >
                    {f.label}
                    {count > 0 && (
                      <span className={`w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold ${filter === f.key ? "bg-white/30 text-white" : "bg-primary/10 text-primary"
                        }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Notification list */}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <BellOff size={36} className="mx-auto mb-3 opacity-40" />
                <p className="text-sm">Aucune notification dans cette catégorie</p>
              </div>
            )}

            <div className="space-y-2.5">
              {filtered.map((n) => {
                const cfg = typeConfig[n.type];
                const Icon = cfg.icon;
                const isUrgent = n.type === "urgent";
                return (
                  <div
                    key={n.id}
                    className={`rounded-xl border p-4 transition ${n.read
                        ? "bg-card border-border opacity-70"
                        : `${cfg.bg} ${cfg.border}`
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : cfg.bg}`}>
                        <Icon size={16} className={n.read ? "text-muted-foreground" : cfg.text} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`text-sm font-semibold ${n.read ? "text-foreground" : cfg.text}`}>{n.title}</p>
                            {!n.read && <span className={`w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />}
                          </div>
                          <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5 leading-snug">{n.body}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3">
                          {isUrgent && !n.read && (
                            <button
                              onClick={() => handleAct(n)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition"
                            >
                              <ChevronRight size={12} />
                              Intervenir
                            </button>
                          )}
                          {!n.read && (
                            <button
                              onClick={() => markRead(n.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
                            >
                              <Check size={12} />
                              Marquer lu
                            </button>
                          )}
                          {n.read && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Check size={11} />
                              Lu
                            </span>
                          )}
                        </div>
                      </div>
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
