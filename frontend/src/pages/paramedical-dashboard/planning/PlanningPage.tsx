import { useState } from "react";
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
  id: number;
  order: number;
  patientName: string;
  time: string;
  address: string;
  type: string;
  status: VisitStatus;
  distance: number;
  duration: number;
}

const weekDays = ["Lun 6 Avr", "Mar 7 Avr", "Mer 8 Avr", "Jeu 9 Avr", "Ven 10 Avr"];

const weeklyData: Record<string, Visit[]> = {
  "Lun 6 Avr": [
    { id: 1, order: 1, patientName: "Mme Khaled", time: "08:00", address: "45 Rue de la Paix, Tunis", type: "Pansement", status: "done", distance: 2.3, duration: 30 },
    { id: 2, order: 2, patientName: "M. Ali Ben", time: "09:30", address: "78 Avenue Bourguiba, Tunis", type: "Injection", status: "done", distance: 3.5, duration: 20 },
    { id: 3, order: 3, patientName: "Mme Fatima Zahra", time: "11:00", address: "120 Rue Mohamed V, La Marsa", type: "Perfusion", status: "in_progress", distance: 5.2, duration: 45 },
    { id: 4, order: 4, patientName: "M. Riadh", time: "13:30", address: "33 Rue des Fleurs, Ariana", type: "Kinésithérapie", status: "pending", distance: 7.1, duration: 60 },
    { id: 5, order: 5, patientName: "Mme Leïla Karmous", time: "15:00", address: "99 Rue Al-Jazira, Sfax", type: "Prise de sang", status: "pending", distance: 12.0, duration: 25 },
    { id: 6, order: 6, patientName: "M. Hassan", time: "16:30", address: "55 Rue de Carthage, Tunis", type: "Pansement", status: "pending", distance: 4.5, duration: 30 },
  ],
  "Mar 7 Avr": [
    { id: 7, order: 1, patientName: "Mme Sara Meddeb", time: "08:30", address: "12 Rue de la République, Tunis", type: "Soins infirmiers", status: "pending", distance: 3.0, duration: 40 },
    { id: 8, order: 2, patientName: "M. Fouad Trabelsi", time: "10:00", address: "67 Boulevard 7 Novembre, Sfax", type: "Rééducation", status: "pending", distance: 6.2, duration: 60 },
    { id: 9, order: 3, patientName: "Mme Nour Chaabane", time: "14:00", address: "8 Rue Ibn Khaldoun, Bizerte", type: "Pansement", status: "pending", distance: 9.5, duration: 25 },
  ],
  "Mer 8 Avr": [
    { id: 10, order: 1, patientName: "M. Karim Smaoui", time: "09:00", address: "21 Rue des Roses, Nabeul", type: "Injection", status: "pending", distance: 2.8, duration: 20 },
    { id: 11, order: 2, patientName: "Mme Amira Ben Slama", time: "11:30", address: "44 Rue de la Liberté, Sousse", type: "Perfusion", status: "pending", distance: 5.6, duration: 50 },
  ],
  "Jeu 9 Avr": [
    { id: 12, order: 1, patientName: "M. Sami Rekik", time: "08:00", address: "31 Rue du Lac, Tunis", type: "Kinésithérapie", status: "pending", distance: 4.1, duration: 60 },
    { id: 13, order: 2, patientName: "Mme Rim Hajji", time: "10:30", address: "76 Avenue de France, Tunis", type: "Soins infirmiers", status: "pending", distance: 3.3, duration: 35 },
    { id: 14, order: 3, patientName: "M. Adel Ben Youssef", time: "14:00", address: "58 Rue Istanbul, Tunis", type: "Prise de sang", status: "pending", distance: 5.0, duration: 20 },
    { id: 15, order: 4, patientName: "Mme Olfa Hamdi", time: "16:00", address: "11 Rue de Madrid, Tunis", type: "Pansement", status: "pending", distance: 2.7, duration: 30 },
  ],
  "Ven 10 Avr": [
    { id: 16, order: 1, patientName: "M. Walid Saidi", time: "08:30", address: "99 Rue de Marseille, Tunis", type: "Massage thérapeutique", status: "pending", distance: 6.0, duration: 60 },
    { id: 17, order: 2, patientName: "Mme Besma Chebbi", time: "11:00", address: "25 Avenue de l'Environnement, Sfax", type: "Injection", status: "pending", distance: 4.4, duration: 20 },
  ],
};

const statusConfig: Record<VisitStatus, { label: string; icon: typeof CheckCircle2; className: string; cardClass: string }> = {
  done: { label: "Terminée", icon: CheckCircle2, className: "text-green-500", cardClass: "border-green-200 bg-green-50/40" },
  in_progress: { label: "En cours", icon: Loader2, className: "text-blue-500", cardClass: "border-blue-200 bg-blue-50/40" },
  pending: { label: "À faire", icon: Circle, className: "text-muted-foreground", cardClass: "border-border bg-card" },
};

export default function ParamedicalPlanningPage() {
  const [view, setView] = useState<"daily" | "weekly">("daily");
  const [selectedDay, setSelectedDay] = useState(weekDays[0]);
  const [visits, setVisits] = useState(weeklyData);

  const dayVisits = visits[selectedDay] ?? [];
  const totalKm = dayVisits.reduce((sum, v) => sum + v.distance, 0);
  const totalMinutes = dayVisits.reduce((sum, v) => sum + v.duration, 0);
  const doneCount = dayVisits.filter((v) => v.status === "done").length;

  const cycleStatus = (day: string, id: number) => {
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
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                    view === v ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"
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
                {weekDays.map((day) => {
                  const dayV = visits[day] ?? [];
                  const doneCt = dayV.filter((v) => v.status === "done").length;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition shrink-0 ${
                        selectedDay === day
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
              {weekDays.map((day) => {
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
