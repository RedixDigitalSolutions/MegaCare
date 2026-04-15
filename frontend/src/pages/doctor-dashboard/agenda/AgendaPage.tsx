import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
  Check,
  Ban,
} from "lucide-react";

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

interface SlotData {
  status: SlotStatus;
  patient: string;
  appointmentId?: string;
}

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

const LOCAL_SLOTS_KEY = "megacare_doctor_local_slots";

function loadLocalSlots(): AgendaMap {
  try {
    const s = localStorage.getItem(LOCAL_SLOTS_KEY);
    if (s) return JSON.parse(s);
  } catch {
    /* ignore */
  }
  return {};
}

export default function DoctorAgendaPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [weekOffset, setWeekOffset] = useState(0);
  const [apiSlots, setApiSlots] = useState<AgendaMap>({});
  const [localSlots, setLocalSlots] = useState<AgendaMap>(loadLocalSlots);
  const [dataLoading, setDataLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: "", time: "", patient: "" });
  const [detailSlot, setDetailSlot] = useState<{
    dk: string;
    time: string;
  } | null>(null);

  const fetchAppointments = useCallback(async () => {
    const token = localStorage.getItem("megacare_token");
    if (!token) { setDataLoading(false); return; }
    setDataLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        const appts = Array.isArray(json) ? json : (json.data ?? []);
        const map: AgendaMap = {};
        for (const a of appts) {
          if (!a.date || !a.time) continue;
          if (a.status === "rejected" || a.status === "cancelled") continue;
          if (!map[a.date]) map[a.date] = {};
          const status: SlotStatus =
            a.status === "confirmed" || a.status === "completed"
              ? "confirmed"
              : "pending";
          map[a.date][a.time] = {
            status,
            patient: a.patientName || "Patient",
            appointmentId: String(a.id || a._id),
          };
        }
        setApiSlots(map);
      }
    } catch {
      /* ignore */
    }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "doctor") {
      fetchAppointments();
    }
  }, [isLoading, isAuthenticated, user, fetchAppointments]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    localStorage.setItem(LOCAL_SLOTS_KEY, JSON.stringify(localSlots));
  }, [localSlots]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  // Merge: API slots take priority over local for same date+time
  const agenda: AgendaMap = {};
  for (const [dk, slots] of Object.entries(localSlots)) {
    agenda[dk] = { ...slots };
  }
  for (const [dk, slots] of Object.entries(apiSlots)) {
    if (!agenda[dk]) agenda[dk] = {};
    for (const [time, slot] of Object.entries(slots)) {
      agenda[dk][time] = slot;
    }
  }

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
    setLocalSlots((prev) => ({
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
    const slot = agenda[dk]?.[time];
    if (slot?.appointmentId) return; // API appointments managed via confirm/reject
    setLocalSlots((prev) => {
      const updated = { ...prev, [dk]: { ...(prev[dk] || {}) } };
      delete updated[dk][time];
      if (Object.keys(updated[dk]).length === 0) delete updated[dk];
      return updated;
    });
    setDetailSlot(null);
  };

  const confirmSlot = async (dk: string, time: string) => {
    const slot = agenda[dk]?.[time];
    if (slot?.appointmentId) {
      const token = localStorage.getItem("megacare_token");
      await fetch(`/api/appointments/${slot.appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "confirmed" }),
      });
      await fetchAppointments();
    } else {
      setLocalSlots((prev) => ({
        ...prev,
        [dk]: {
          ...(prev[dk] || {}),
          [time]: {
            ...(prev[dk]?.[time] || { patient: "" }),
            status: "confirmed",
          },
        },
      }));
    }
    setDetailSlot(null);
  };

  const rejectSlot = async (dk: string, time: string) => {
    const slot = agenda[dk]?.[time];
    if (slot?.appointmentId) {
      const token = localStorage.getItem("megacare_token");
      await fetch(`/api/appointments/${slot.appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      await fetchAppointments();
    } else {
      removeSlot(dk, time);
    }
    setDetailSlot(null);
  };

  const detailData =
    detailSlot && agenda[detailSlot.dk]?.[detailSlot.time]
      ? agenda[detailSlot.dk][detailSlot.time]
      : null;

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
            {dataLoading ? (
              <div className="grid grid-cols-3 gap-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 animate-pulse h-20" />
                ))}
              </div>
            ) : (
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
            )}

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
                          className={`p-3 text-center border-r border-border last:border-r-0 ${isToday ? "bg-primary/10" : ""
                            }`}
                        >
                          <p
                            className={`text-xs font-semibold uppercase tracking-wide ${isToday ? "text-primary" : "text-muted-foreground"
                              }`}
                          >
                            {day.toLocaleDateString("fr-FR", {
                              weekday: "short",
                            })}
                          </p>
                          <p
                            className={`text-base font-bold mt-0.5 ${isToday ? "text-primary" : "text-foreground"
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
                              className={`h-11 border-r border-border last:border-r-0 transition hover:bg-primary/5 group ${isToday ? "bg-primary/[0.03]" : ""
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
                            onClick={() => setDetailSlot({ dk, time })}
                            className={`h-11 border-r border-border last:border-r-0 px-1.5 flex items-center gap-1 cursor-pointer hover:brightness-95 transition ${slot.status === "confirmed"
                              ? "bg-blue-50 border-l-2 border-l-blue-400"
                              : "bg-orange-50 border-l-2 border-l-orange-400"
                              }`}
                          >
                            <span
                              className={`flex-1 text-xs font-medium truncate ${slot.status === "confirmed"
                                ? "text-blue-700"
                                : "text-orange-700"
                                }`}
                            >
                              {slot.patient}
                            </span>
                            {!slot.appointmentId && (
                              <button
                                onClick={(e) => { e.stopPropagation(); removeSlot(dk, time); }}
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
                            )}
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
                <span>Libre — cliquer pour ajouter une note</span>
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
                  Note
                </label>
                <input
                  type="text"
                  placeholder="Ex: Réservé · Pause déjeuner"
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

      {/* Slot Detail Modal */}
      {detailSlot && detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDetailSlot(null)}
          />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                Détails du rendez-vous
              </h2>
              <button
                onClick={() => setDetailSlot(null)}
                className="p-1.5 hover:bg-muted rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {detailData.patient
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {detailData.patient}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {detailSlot.dk} à {detailSlot.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Statut :</span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${detailData.status === "confirmed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-orange-100 text-orange-700"
                    }`}
                >
                  {detailData.status === "confirmed"
                    ? "Confirmé"
                    : "En attente"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              {detailData.status === "pending" ? (
                <>
                  <button
                    onClick={() => rejectSlot(detailSlot.dk, detailSlot.time)}
                    className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Ban size={16} />
                    Rejeter
                  </button>
                  <button
                    onClick={() => confirmSlot(detailSlot.dk, detailSlot.time)}
                    className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium flex items-center justify-center gap-2"
                  >
                    <Check size={16} />
                    Confirmer
                  </button>
                </>
              ) : detailData.appointmentId ? (
                <button
                  onClick={() => setDetailSlot(null)}
                  className="flex-1 px-4 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted transition font-medium"
                >
                  Fermer
                </button>
              ) : (
                <button
                  onClick={() => removeSlot(detailSlot.dk, detailSlot.time)}
                  className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Supprimer la note
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
