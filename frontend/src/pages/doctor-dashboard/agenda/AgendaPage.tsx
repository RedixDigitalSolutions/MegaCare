import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { ChevronLeft, ChevronRight, Plus, X, Clock } from "lucide-react";

const TIME_SLOTS = [
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

type SlotStatus = "confirmed" | "pending";
type SlotData = { status: SlotStatus; patient: string };
type AgendaMap = Record<string, Record<string, SlotData>>;

function dateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getWeekDays(weekOffset: number): Date[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7) + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function buildInitialAgenda(): AgendaMap {
  const days = getWeekDays(0);
  const map: AgendaMap = {};
  const seeds: [number, string, string, SlotStatus][] = [
    [0, "09:00", "Fatima B.", "confirmed"],
    [0, "10:00", "Mohamed K.", "pending"],
    [1, "08:30", "Aisha H.", "confirmed"],
    [1, "14:00", "Salim D.", "confirmed"],
    [2, "09:30", "Layla M.", "pending"],
    [3, "11:00", "Youssef T.", "confirmed"],
    [3, "15:00", "Nadia B.", "confirmed"],
    [4, "09:00", "Hatem R.", "confirmed"],
    [4, "10:30", "Sonia K.", "pending"],
  ];
  seeds.forEach(([di, time, patient, status]) => {
    if (days[di]) {
      const key = dateKey(days[di]);
      if (!map[key]) map[key] = {};
      map[key][time] = { status, patient };
    }
  });
  return map;
}

export default function DoctorAgendaPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [agenda, setAgenda] = useState<AgendaMap>(buildInitialAgenda);
  const [showModal, setShowModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: "", time: "", patient: "" });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const weekDays = getWeekDays(weekOffset);
  const todayStr = dateKey(new Date());

  const weekLabel = `${weekDays[0].toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  })} – ${weekDays[6].toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })}`;

  const allSlots = Object.values(agenda).flatMap((d) => Object.values(d));
  const confirmedCount = allSlots.filter(
    (s) => s.status === "confirmed",
  ).length;
  const pendingCount = allSlots.filter((s) => s.status === "pending").length;

  const openAddModal = (date = "", time = "") => {
    setNewSlot({ date, time, patient: "" });
    setShowModal(true);
  };

  const addSlot = () => {
    if (!newSlot.date || !newSlot.time || !newSlot.patient.trim()) return;
    setAgenda((prev) => ({
      ...prev,
      [newSlot.date]: {
        ...(prev[newSlot.date] || {}),
        [newSlot.time]: {
          status: "confirmed",
          patient: newSlot.patient.trim(),
        },
      },
    }));
    setShowModal(false);
    setNewSlot({ date: "", time: "", patient: "" });
  };

  const removeSlot = (dk: string, time: string) => {
    setAgenda((prev) => {
      const updated = { ...prev, [dk]: { ...prev[dk] } };
      delete updated[dk][time];
      if (Object.keys(updated[dk]).length === 0) delete updated[dk];
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Mon Agenda
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gérez vos créneaux et rendez-vous
                </p>
              </div>
              <button
                onClick={() => openAddModal()}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2"
              >
                <Plus size={18} />
                Nouveau créneau
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {allSlots.length}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Créneaux actifs
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {confirmedCount}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Confirmés
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-orange-500">
                  {pendingCount}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  En attente
                </p>
              </div>
            </div>

            {/* Week Navigation */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-3">
              <button
                onClick={() => setWeekOffset((w) => w - 1)}
                className="p-2 hover:bg-muted rounded-lg transition"
                aria-label="Semaine précédente"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="text-center">
                <p className="font-bold text-foreground">{weekLabel}</p>
                {weekOffset === 0 && (
                  <p className="text-xs text-primary font-medium mt-0.5">
                    Semaine actuelle
                  </p>
                )}
              </div>
              <button
                onClick={() => setWeekOffset((w) => w + 1)}
                className="p-2 hover:bg-muted rounded-lg transition"
                aria-label="Semaine suivante"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                  {/* Day Headers */}
                  <div className="grid grid-cols-8 border-b border-border bg-muted/30">
                    <div className="p-3 flex items-center justify-center border-r border-border">
                      <Clock size={14} className="text-muted-foreground" />
                    </div>
                    {weekDays.map((day, i) => {
                      const isToday = dateKey(day) === todayStr;
                      return (
                        <div
                          key={i}
                          className={`p-3 text-center border-r border-border last:border-r-0 ${
                            isToday ? "bg-primary/10" : ""
                          }`}
                        >
                          <p
                            className={`text-xs font-semibold uppercase tracking-wide ${
                              isToday ? "text-primary" : "text-muted-foreground"
                            }`}
                          >
                            {day.toLocaleDateString("fr-FR", {
                              weekday: "short",
                            })}
                          </p>
                          <p
                            className={`text-base font-bold mt-0.5 ${
                              isToday ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {day.getDate()}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Time Rows */}
                  {TIME_SLOTS.map((time) => (
                    <div
                      key={time}
                      className="grid grid-cols-8 border-b border-border last:border-b-0"
                    >
                      {/* Time label */}
                      <div className="p-2 flex items-center justify-center border-r border-border bg-muted/10">
                        <span className="text-xs font-mono text-muted-foreground">
                          {time}
                        </span>
                      </div>

                      {/* Day cells */}
                      {weekDays.map((day, di) => {
                        const dk = dateKey(day);
                        const slot = agenda[dk]?.[time];
                        const isToday = dk === todayStr;

                        if (!slot) {
                          return (
                            <button
                              key={di}
                              onClick={() => openAddModal(dk, time)}
                              className={`h-11 border-r border-border last:border-r-0 transition hover:bg-primary/5 group ${
                                isToday ? "bg-primary/[0.03]" : ""
                              }`}
                              title={`Ajouter ${time}`}
                            >
                              <Plus
                                size={12}
                                className="mx-auto text-muted-foreground opacity-0 group-hover:opacity-40 transition"
                              />
                            </button>
                          );
                        }

                        return (
                          <div
                            key={di}
                            className={`h-11 border-r border-border last:border-r-0 px-1.5 flex items-center gap-1 ${
                              slot.status === "confirmed"
                                ? "bg-blue-50 border-l-2 border-l-blue-400"
                                : "bg-orange-50 border-l-2 border-l-orange-400"
                            }`}
                          >
                            <span
                              className={`flex-1 text-xs font-medium truncate ${
                                slot.status === "confirmed"
                                  ? "text-blue-700"
                                  : "text-orange-700"
                              }`}
                            >
                              {slot.patient}
                            </span>
                            <button
                              onClick={() => removeSlot(dk, time)}
                              className="shrink-0 p-0.5 rounded opacity-0 hover:opacity-100 hover:bg-black/10 transition"
                              title="Supprimer ce créneau"
                            >
                              <X
                                size={10}
                                className={
                                  slot.status === "confirmed"
                                    ? "text-blue-600"
                                    : "text-orange-600"
                                }
                              />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground pb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border-l-2 border-l-blue-400" />
                <span>Confirmé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-100 border-l-2 border-l-orange-400" />
                <span>En attente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-dashed border-muted-foreground/30" />
                <span>Libre — cliquer pour ajouter</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Nouveau créneau
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-muted rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) =>
                    setNewSlot((s) => ({ ...s, date: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Heure
                </label>
                <select
                  value={newSlot.time}
                  onChange={(e) =>
                    setNewSlot((s) => ({ ...s, time: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner une heure</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nom du patient
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fatima B."
                  value={newSlot.patient}
                  onChange={(e) =>
                    setNewSlot((s) => ({ ...s, patient: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && addSlot()}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={addSlot}
                disabled={
                  !newSlot.date || !newSlot.time || !newSlot.patient.trim()
                }
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
