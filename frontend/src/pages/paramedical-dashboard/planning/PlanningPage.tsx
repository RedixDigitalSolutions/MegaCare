import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  Navigation,
  Car,
  ChevronRight,
} from "lucide-react";

type VisitStatus = "done" | "in_progress" | "pending";

interface Visit {
  id: string;
  order: number;
  patientName: string;
  time: string;
  address: string;
  type: string;
  status: VisitStatus;
  distance: number;
  duration: number;
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

const weekDays: string[] = [];

const weeklyData: Record<string, Visit[]> = {};

const statusConfig: Record<VisitStatus, { label: string; icon: typeof CheckCircle2; className: string; cardClass: string }> = {
  done: { label: "Terminée", icon: CheckCircle2, className: "text-green-500", cardClass: "border-green-200 bg-green-50/40" },
  in_progress: { label: "En cours", icon: Loader2, className: "text-blue-500", cardClass: "border-blue-200 bg-blue-50/40" },
  pending: { label: "À faire", icon: Circle, className: "text-muted-foreground", cardClass: "border-border bg-card" },
};

export default function ParamedicalPlanningPage() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [selectedDay, setSelectedDay] = useState("");
  const [visits, setVisits] = useState(weeklyData);

  useEffect(() => {
    fetch("/api/paramedical/planning", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => {
        const data = d && typeof d === "object" ? d : {};
        setVisits(data);
        const keys = Object.keys(data);
        if (keys.length) setSelectedDay(keys[0]);
      })
      .catch(() => { });
  }, []);

  const dayKeys = Object.keys(visits);

  const dayVisits = visits[selectedDay] ?? [];
  const totalKm = dayVisits.reduce((sum, v) => sum + v.distance, 0);
  const totalMinutes = dayVisits.reduce((sum, v) => sum + v.duration, 0);
  const doneCount = dayVisits.filter((v) => v.status === "done").length;

  const cycleStatus = (day: string, id: string) => {
    const cycle: Record<VisitStatus, VisitStatus> = { pending: "in_progress", in_progress: "done", done: "pending" };
    setVisits((prev) => ({
      ...prev,
      [day]: prev[day].map((v) => v.id === id ? { ...v, status: cycle[v.status] } : v),
    }));
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Planning des visites</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Ordre chronologique optimisé</p>
            </div>
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {(["daily", "weekly"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${view === v ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {v === "daily" ? "Journalier" : "Hebdomadaire"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {view === "daily" && (
            <>
              {/* Day selector */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dayKeys.map((day) => {
                  const dayV = visits[day] ?? [];
                  const doneCt = dayV.filter((v) => v.status === "done").length;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition shrink-0 ${selectedDay === day
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card hover:border-primary/40 text-foreground"
                        }`}
                    >
                      <span>{day}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{doneCt}/{dayV.length}</span>
                    </button>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-card rounded-xl border border-border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Visites</p>
                  <p className="text-2xl font-bold text-foreground">{doneCount}/{dayVisits.length}</p>
                  <p className="text-xs text-green-600">{doneCount} terminées</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Kilométrage</p>
                  <p className="text-2xl font-bold text-foreground">{totalKm.toFixed(1)} km</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Car size={11} /> Estimé</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4 space-y-1">
                  <p className="text-xs text-muted-foreground">Temps estimé</p>
                  <p className="text-2xl font-bold text-foreground">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60 > 0 ? `${totalMinutes % 60}min` : ""}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={11} /> Soins seuls</p>
                </div>
              </div>

              {/* Visit list */}
              <div className="space-y-3">
                {dayVisits.map((visit, idx) => {
                  const cfg = statusConfig[visit.status];
                  const Icon = cfg.icon;
                  return (
                    <div key={visit.id} className={`rounded-xl border p-4 flex gap-4 items-start transition ${cfg.cardClass}`}>
                      {/* Order + status */}
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                          {visit.order}
                        </span>
                        {idx < dayVisits.length - 1 && (
                          <div className="w-px h-4 bg-border" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <p className="font-semibold text-sm text-foreground">{visit.patientName}</p>
                          <span className={`text-xs flex items-center gap-1 ${cfg.className}`}>
                            <Icon size={12} className={visit.status === "in_progress" ? "animate-spin" : ""} />
                            {cfg.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{visit.type}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock size={11} />{visit.time} · {visit.duration} min</span>
                          <span className="flex items-center gap-1"><MapPin size={11} />{visit.address}</span>
                          <span className="flex items-center gap-1"><Navigation size={11} />{visit.distance} km</span>
                        </div>
                      </div>

                      {/* Status cycle button */}
                      <button
                        onClick={() => cycleStatus(selectedDay, visit.id)}
                        title="Changer le statut"
                        className="shrink-0 p-2 rounded-lg border border-border bg-background hover:border-primary hover:text-primary transition"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {view === "weekly" && (
            <div className="space-y-4">
              {dayKeys.map((day) => {
                const dayV = visits[day] ?? [];
                const doneCt = dayV.filter((v) => v.status === "done").length;
                const kmTotal = dayV.reduce((s, v) => s + v.distance, 0);
                return (
                  <div key={day} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                      <h3 className="font-semibold text-sm text-foreground">{day}</h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{doneCt}/{dayV.length} visites</span>
                        <span className="flex items-center gap-1"><Navigation size={11} />{kmTotal.toFixed(1)} km</span>
                        <button
                          onClick={() => { setView("daily"); setSelectedDay(day); }}
                          className="text-primary hover:underline"
                        >
                          Détail
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-border">
                      {dayV.map((v) => {
                        const cfg = statusConfig[v.status];
                        const Icon = cfg.icon;
                        return (
                          <div key={v.id} className="flex items-center gap-3 px-5 py-2.5">
                            <Icon size={14} className={`${cfg.className} shrink-0 ${v.status === "in_progress" ? "animate-spin" : ""}`} />
                            <span className="text-xs text-muted-foreground w-10 shrink-0">{v.time}</span>
                            <span className="text-sm text-foreground flex-1 truncate">{v.patientName}</span>
                            <span className="text-xs text-muted-foreground">{v.type}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
