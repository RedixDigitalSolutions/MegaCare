import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Clock,
  Check,
  Ban,
  Settings2,
  GripVertical,
  Palette,
} from "lucide-react";

/* ────────────────────────── constants ────────────────────────── */

const ALL_TIME_SLOTS = Array.from({ length: 28 }, (_, i) => {
  const h = Math.floor(i / 2) + 7;
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const DAY_NAMES_SHORT = ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."];
const DAY_NAMES_FULL = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const EVENT_COLORS = [
  { name: "Bleu", value: "#3b82f6", bg: "bg-blue-500", light: "bg-blue-50", text: "text-blue-700", border: "border-l-blue-400" },
  { name: "Vert", value: "#22c55e", bg: "bg-green-500", light: "bg-green-50", text: "text-green-700", border: "border-l-green-400" },
  { name: "Violet", value: "#a855f7", bg: "bg-purple-500", light: "bg-purple-50", text: "text-purple-700", border: "border-l-purple-400" },
  { name: "Rose", value: "#ec4899", bg: "bg-pink-500", light: "bg-pink-50", text: "text-pink-700", border: "border-l-pink-400" },
  { name: "Cyan", value: "#06b6d4", bg: "bg-cyan-500", light: "bg-cyan-50", text: "text-cyan-700", border: "border-l-cyan-400" },
  { name: "Ambre", value: "#f59e0b", bg: "bg-amber-500", light: "bg-amber-50", text: "text-amber-700", border: "border-l-amber-400" },
  { name: "Rouge", value: "#ef4444", bg: "bg-red-500", light: "bg-red-50", text: "text-red-700", border: "border-l-red-400" },
  { name: "Gris", value: "#6b7280", bg: "bg-gray-500", light: "bg-gray-100", text: "text-gray-700", border: "border-l-gray-400" },
];

/* ────────────────────────── types ────────────────────────── */

type SlotStatus = "confirmed" | "pending";

interface SlotData {
  status: SlotStatus;
  patient: string;
  appointmentId?: string;
  color?: string;
}

type AgendaMap = Record<string, Record<string, SlotData>>;

interface WorkingHours {
  enabled: boolean;
  start: string;
  end: string;
}

type WeekSchedule = Record<number, WorkingHours>;

/* ────────────────────────── helpers ────────────────────────── */

function dateKey(d: Date): string {
  return d.toISOString().split("T")[0];
}

function getWeekDays(weekOffset: number): Date[] {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7) + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function colorForSlot(slot: SlotData) {
  if (slot.color) {
    const found = EVENT_COLORS.find((c) => c.value === slot.color);
    if (found) return found;
  }
  if (slot.status === "pending")
    return { light: "bg-orange-50", text: "text-orange-700", border: "border-l-orange-400", value: "#f97316" } as (typeof EVENT_COLORS)[0];
  return EVENT_COLORS[0];
}

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/* ────────────────────────── storage ────────────────────────── */

const LOCAL_SLOTS_KEY = "megacare_doctor_local_slots";
const LOCAL_SCHEDULE_KEY = "megacare_doctor_schedule";

function loadLocalSlots(): AgendaMap {
  try {
    const s = localStorage.getItem(LOCAL_SLOTS_KEY);
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return {};
}

const defaultSchedule: WeekSchedule = {
  0: { enabled: false, start: "08:00", end: "17:00" },
  1: { enabled: true, start: "08:00", end: "17:00" },
  2: { enabled: true, start: "08:00", end: "17:00" },
  3: { enabled: true, start: "08:00", end: "17:00" },
  4: { enabled: true, start: "08:00", end: "17:00" },
  5: { enabled: true, start: "08:00", end: "17:00" },
  6: { enabled: false, start: "08:00", end: "12:00" },
};

function loadSchedule(): WeekSchedule {
  try {
    const s = localStorage.getItem(LOCAL_SCHEDULE_KEY);
    if (s) return JSON.parse(s);
  } catch { /* ignore */ }
  return defaultSchedule;
}

/* ────────────────────────── Component ────────────────────────── */

export default function DoctorAgendaPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [weekOffset, setWeekOffset] = useState(0);
  const [apiSlots, setApiSlots] = useState<AgendaMap>({});
  const [localSlots, setLocalSlots] = useState<AgendaMap>(loadLocalSlots);
  const [dataLoading, setDataLoading] = useState(true);
  const [workingHours, setWorkingHours] = useState<WeekSchedule>(loadSchedule);
  const [showSchedulePanel, setShowSchedulePanel] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: "", time: "", patient: "", color: EVENT_COLORS[0].value });
  const [detailSlot, setDetailSlot] = useState<{ dk: string; time: string } | null>(null);

  const [dragSource, setDragSource] = useState<{ dk: string; time: string } | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{ dk: string; time: string } | null>(null);

  const [drawStart, setDrawStart] = useState<{ dk: string; time: string } | null>(null);
  const [drawEnd, setDrawEnd] = useState<{ dk: string; time: string } | null>(null);
  const isDrawing = useRef(false);
  const drawRangeRef = useRef<{ dk: string; lo: number; hi: number } | null>(null);

  /* ── fetch ── */

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
            a.status === "confirmed" || a.status === "completed" ? "confirmed" : "pending";
          map[a.date][a.time] = {
            status,
            patient: a.patientName || "Patient",
            appointmentId: String(a.id || a._id),
          };
        }
        setApiSlots(map);
      }
    } catch { /* ignore */ }
    setDataLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "doctor") fetchAppointments();
  }, [isLoading, isAuthenticated, user, fetchAppointments]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) navigate("/login");
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => { localStorage.setItem(LOCAL_SLOTS_KEY, JSON.stringify(localSlots)); }, [localSlots]);
  useEffect(() => { localStorage.setItem(LOCAL_SCHEDULE_KEY, JSON.stringify(workingHours)); }, [workingHours]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor") return null;

  /* ── merge agenda ── */
  const agenda: AgendaMap = {};
  for (const [dk, slots] of Object.entries(localSlots)) agenda[dk] = { ...slots };
  for (const [dk, slots] of Object.entries(apiSlots)) {
    if (!agenda[dk]) agenda[dk] = {};
    for (const [time, slot] of Object.entries(slots)) agenda[dk][time] = slot;
  }

  const weekDays = getWeekDays(weekOffset);
  const todayStr = dateKey(new Date());

  const weekLabel = `${weekDays[0].toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} – ${weekDays[6].toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}`;

  const allSlots = Object.values(agenda).flatMap((d) => Object.values(d));
  const confirmedCount = allSlots.filter((s) => s.status === "confirmed").length;
  const pendingCount = allSlots.filter((s) => s.status === "pending").length;

  /* ── off-hours ── */
  function isOffHour(day: Date, time: string): boolean {
    const dow = day.getDay();
    const wh = workingHours[dow];
    if (!wh || !wh.enabled) return true;
    const mins = timeToMinutes(time);
    return mins < timeToMinutes(wh.start) || mins >= timeToMinutes(wh.end);
  }

  /* ── slot actions ── */

  const openAddModal = (date = "", time = "") => {
    drawRangeRef.current = null;
    setNewSlot({ date, time, patient: "", color: EVENT_COLORS[0].value });
    setShowModal(true);
  };

  const addSlot = () => {
    if (!newSlot.date || !newSlot.time || !newSlot.patient.trim()) return;
    setLocalSlots((prev) => ({
      ...prev,
      [newSlot.date]: {
        ...(prev[newSlot.date] || {}),
        [newSlot.time]: { status: "confirmed" as const, patient: newSlot.patient.trim(), color: newSlot.color },
      },
    }));
    setShowModal(false);
    setNewSlot({ date: "", time: "", patient: "", color: EVENT_COLORS[0].value });
    toast({ title: "Événement créé", description: `${newSlot.time} — ${newSlot.patient}` });
  };

  const removeSlot = (dk: string, time: string) => {
    const slot = agenda[dk]?.[time];
    if (slot?.appointmentId) return;
    setLocalSlots((prev) => {
      const updated = { ...prev, [dk]: { ...(prev[dk] || {}) } };
      delete updated[dk][time];
      if (Object.keys(updated[dk]).length === 0) delete updated[dk];
      return updated;
    });
    setDetailSlot(null);
    toast({ title: "Événement supprimé" });
  };

  const confirmSlot = async (dk: string, time: string) => {
    const slot = agenda[dk]?.[time];
    if (slot?.appointmentId) {
      const token = localStorage.getItem("megacare_token");
      await fetch(`/api/appointments/${slot.appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "confirmed" }),
      });
      await fetchAppointments();
      toast({ title: "Rendez-vous confirmé" });
    } else {
      setLocalSlots((prev) => ({
        ...prev,
        [dk]: { ...(prev[dk] || {}), [time]: { ...(prev[dk]?.[time] || { patient: "" }), status: "confirmed" } },
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: "rejected" }),
      });
      await fetchAppointments();
      toast({ title: "Rendez-vous rejeté" });
    } else {
      removeSlot(dk, time);
    }
    setDetailSlot(null);
  };

  /* ── drag & drop to move ── */
  const handleDragStart = (dk: string, time: string) => {
    const slot = agenda[dk]?.[time];
    if (slot?.appointmentId) return;
    setDragSource({ dk, time });
  };

  const handleDragOver = (e: React.DragEvent, dk: string, time: string) => {
    e.preventDefault();
    setDragOverTarget({ dk, time });
  };

  const handleDrop = (dk: string, time: string) => {
    if (!dragSource) return;
    const src = localSlots[dragSource.dk]?.[dragSource.time];
    if (!src) { setDragSource(null); setDragOverTarget(null); return; }
    if (agenda[dk]?.[time]) { setDragSource(null); setDragOverTarget(null); return; }

    setLocalSlots((prev) => {
      const updated = { ...prev };
      updated[dragSource.dk] = { ...(updated[dragSource.dk] || {}) };
      delete updated[dragSource.dk][dragSource.time];
      if (Object.keys(updated[dragSource.dk]).length === 0) delete updated[dragSource.dk];
      if (!updated[dk]) updated[dk] = {};
      updated[dk] = { ...updated[dk], [time]: src };
      return updated;
    });

    toast({ title: "Événement déplacé", description: `${dragSource.time} → ${time}` });
    setDragSource(null);
    setDragOverTarget(null);
  };

  /* ── click-drag to draw block ── */
  const handleCellMouseDown = (dk: string, time: string) => {
    if (agenda[dk]?.[time]) return;
    isDrawing.current = true;
    setDrawStart({ dk, time });
    setDrawEnd({ dk, time });
  };

  const handleCellMouseEnter = (dk: string, time: string) => {
    if (!isDrawing.current || !drawStart) return;
    if (dk !== drawStart.dk) return;
    setDrawEnd({ dk, time });
  };

  const handleCellMouseUp = () => {
    if (!isDrawing.current || !drawStart || !drawEnd) {
      isDrawing.current = false;
      setDrawStart(null);
      setDrawEnd(null);
      return;
    }
    isDrawing.current = false;
    const dk = drawStart.dk;
    const startIdx = ALL_TIME_SLOTS.indexOf(drawStart.time);
    const endIdx = ALL_TIME_SLOTS.indexOf(drawEnd.time);
    const lo = Math.min(startIdx, endIdx);
    const hi = Math.max(startIdx, endIdx);

    if (lo === hi) {
      openAddModal(dk, drawStart.time);
    } else {
      drawRangeRef.current = { dk, lo, hi };
      setNewSlot({ date: dk, time: ALL_TIME_SLOTS[lo], patient: "", color: EVENT_COLORS[0].value });
      setShowModal(true);
    }
    setDrawStart(null);
    setDrawEnd(null);
  };

  const addBlockSlots = () => {
    if (!newSlot.patient.trim()) return;
    const range = drawRangeRef.current;
    if (!range) { addSlot(); return; }
    const { dk, lo, hi } = range;
    setLocalSlots((prev) => {
      const updated = { ...prev };
      if (!updated[dk]) updated[dk] = {};
      for (let i = lo; i <= hi; i++) {
        const t = ALL_TIME_SLOTS[i];
        if (!agenda[dk]?.[t]) {
          updated[dk] = { ...updated[dk], [t]: { status: "confirmed", patient: newSlot.patient.trim(), color: newSlot.color } };
        }
      }
      return updated;
    });
    drawRangeRef.current = null;
    setShowModal(false);
    setNewSlot({ date: "", time: "", patient: "", color: EVENT_COLORS[0].value });
    toast({ title: "Bloc créé", description: `${hi - lo + 1} créneaux ajoutés` });
  };

  function isInDrawRange(dk: string, time: string): boolean {
    if (!drawStart || !drawEnd || dk !== drawStart.dk) return false;
    const idx = ALL_TIME_SLOTS.indexOf(time);
    const lo = Math.min(ALL_TIME_SLOTS.indexOf(drawStart.time), ALL_TIME_SLOTS.indexOf(drawEnd.time));
    const hi = Math.max(ALL_TIME_SLOTS.indexOf(drawStart.time), ALL_TIME_SLOTS.indexOf(drawEnd.time));
    return idx >= lo && idx <= hi;
  }

  /* ── working hours update ── */
  const updateDay = (dow: number, patch: Partial<WorkingHours>) => {
    setWorkingHours((prev) => ({ ...prev, [dow]: { ...prev[dow], ...patch } }));
  };

  const detailData = detailSlot && agenda[detailSlot.dk]?.[detailSlot.time] ? agenda[detailSlot.dk][detailSlot.time] : null;

  return (
    <div className="min-h-screen bg-background" onMouseUp={handleCellMouseUp}>
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar doctorName={user.firstName || "Amira Mansouri"} />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mon Agenda</h1>
                <p className="text-muted-foreground mt-1">Gérez vos créneaux, horaires et événements</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSchedulePanel((v) => !v)}
                  className={`px-4 py-2 border rounded-lg transition font-medium flex items-center gap-2 text-sm ${showSchedulePanel ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-foreground"}`}
                >
                  <Settings2 size={16} />
                  Horaires
                </button>
                <button
                  onClick={() => openAddModal()}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2"
                >
                  <Plus size={18} />
                  Nouveau
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Working Hours Panel */}
            {showSchedulePanel && (
              <div className="bg-card border border-border rounded-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                <button
                  className="w-full flex items-center justify-between px-5 py-3 bg-muted/30 border-b border-border"
                  onClick={() => setShowSchedulePanel(false)}
                >
                  <span className="font-semibold text-foreground text-sm flex items-center gap-2">
                    <Clock size={15} className="text-primary" />
                    Horaires de travail hebdomadaires
                  </span>
                  <ChevronDown size={16} className="text-muted-foreground rotate-180 transition" />
                </button>
                <div className="p-4 grid gap-2">
                  {[1, 2, 3, 4, 5, 6, 0].map((dow) => {
                    const wh = workingHours[dow];
                    return (
                      <div key={dow} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/30 transition">
                        <button
                          onClick={() => updateDay(dow, { enabled: !wh.enabled })}
                          className={`relative w-10 h-5 rounded-full transition-colors shrink-0 ${wh.enabled ? "bg-primary" : "bg-muted-foreground/20"}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${wh.enabled ? "left-[22px]" : "left-0.5"}`} />
                        </button>
                        <span className={`w-24 text-sm font-medium ${wh.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                          {DAY_NAMES_FULL[dow]}
                        </span>
                        {wh.enabled ? (
                          <div className="flex items-center gap-2 text-sm">
                            <select
                              value={wh.start}
                              onChange={(e) => updateDay(dow, { start: e.target.value })}
                              className="px-2 py-1.5 bg-input border border-border rounded-md text-foreground text-xs focus:ring-2 focus:ring-primary/30 focus:outline-none"
                            >
                              {ALL_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                            <span className="text-muted-foreground">à</span>
                            <select
                              value={wh.end}
                              onChange={(e) => updateDay(dow, { end: e.target.value })}
                              className="px-2 py-1.5 bg-input border border-border rounded-md text-foreground text-xs focus:ring-2 focus:ring-primary/30 focus:outline-none"
                            >
                              {ALL_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">Fermé</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

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
                  <p className="text-2xl font-bold text-foreground">{allSlots.length}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Créneaux actifs</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{confirmedCount}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">Confirmés</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-orange-500">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">En attente</p>
                </div>
              </div>
            )}

            {/* Week Navigation */}
            <div className="flex items-center justify-between bg-card border border-border rounded-xl px-5 py-3">
              <button onClick={() => setWeekOffset((w) => w - 1)} className="p-2 hover:bg-muted rounded-lg transition" aria-label="Semaine précédente">
                <ChevronLeft size={20} />
              </button>
              <div className="text-center">
                <p className="font-bold text-foreground">{weekLabel}</p>
                {weekOffset === 0 && <p className="text-xs text-primary font-medium mt-0.5">Semaine actuelle</p>}
              </div>
              <div className="flex items-center gap-2">
                {weekOffset !== 0 && (
                  <button onClick={() => setWeekOffset(0)} className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition">
                    Aujourd'hui
                  </button>
                )}
                <button onClick={() => setWeekOffset((w) => w + 1)} className="p-2 hover:bg-muted rounded-lg transition" aria-label="Semaine suivante">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-card border border-border rounded-xl overflow-hidden select-none">
              <div className="overflow-x-auto">
                <div className="min-w-[720px]">
                  {/* Day Headers */}
                  <div className="grid grid-cols-8 border-b border-border bg-muted/30">
                    <div className="p-3 flex items-center justify-center border-r border-border">
                      <Clock size={14} className="text-muted-foreground" />
                    </div>
                    {weekDays.map((day, i) => {
                      const isToday = dateKey(day) === todayStr;
                      const dow = day.getDay();
                      const dayOff = !workingHours[dow]?.enabled;
                      return (
                        <div
                          key={i}
                          className={`p-3 text-center border-r border-border last:border-r-0 ${isToday ? "bg-primary/10" : dayOff ? "bg-muted/50" : ""}`}
                        >
                          <p className={`text-xs font-semibold uppercase tracking-wide ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                            {DAY_NAMES_SHORT[dow]}
                          </p>
                          <p className={`text-base font-bold mt-0.5 ${isToday ? "text-primary" : dayOff ? "text-muted-foreground/50" : "text-foreground"}`}>
                            {day.getDate()}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Time Rows */}
                  {ALL_TIME_SLOTS.map((time) => (
                    <div key={time} className="grid grid-cols-8 border-b border-border last:border-b-0">
                      <div className="p-2 flex items-center justify-center border-r border-border bg-muted/10">
                        <span className="text-xs font-mono text-muted-foreground">{time}</span>
                      </div>

                      {weekDays.map((day, di) => {
                        const dk = dateKey(day);
                        const slot = agenda[dk]?.[time];
                        const isToday = dk === todayStr;
                        const off = isOffHour(day, time);
                        const inDraw = isInDrawRange(dk, time);
                        const isDragTarget = dragOverTarget?.dk === dk && dragOverTarget?.time === time;

                        if (!slot) {
                          return (
                            <div
                              key={di}
                              onMouseDown={() => handleCellMouseDown(dk, time)}
                              onMouseEnter={() => handleCellMouseEnter(dk, time)}
                              onDragOver={(e) => handleDragOver(e, dk, time)}
                              onDrop={() => handleDrop(dk, time)}
                              className={`h-11 border-r border-border last:border-r-0 transition cursor-crosshair group ${off ? "bg-muted/40" : isToday ? "bg-primary/[0.03]" : ""} ${inDraw ? "!bg-primary/15 ring-1 ring-inset ring-primary/30" : ""} ${isDragTarget ? "!bg-primary/10 ring-2 ring-inset ring-primary/40" : ""} hover:bg-primary/5`}
                              title={off ? "Hors horaires" : `Ajouter ${time}`}
                            >
                              {off ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <div className="w-2 h-px bg-muted-foreground/15" />
                                </div>
                              ) : (
                                <Plus size={12} className="mx-auto mt-3.5 text-muted-foreground opacity-0 group-hover:opacity-40 transition" />
                              )}
                            </div>
                          );
                        }

                        const col = colorForSlot(slot);
                        const isLocal = !slot.appointmentId;

                        return (
                          <div
                            key={di}
                            draggable={isLocal}
                            onDragStart={() => handleDragStart(dk, time)}
                            onDragEnd={() => { setDragSource(null); setDragOverTarget(null); }}
                            onClick={() => setDetailSlot({ dk, time })}
                            className={`h-11 border-r border-border last:border-r-0 px-1.5 flex items-center gap-1 cursor-pointer hover:brightness-95 transition ${col.light} border-l-2 ${col.border}`}
                          >
                            {isLocal && (
                              <GripVertical size={10} className="shrink-0 text-muted-foreground/40 cursor-grab" />
                            )}
                            <span className={`flex-1 text-xs font-medium truncate ${col.text}`}>
                              {slot.patient}
                            </span>
                            {isLocal && (
                              <button
                                onClick={(e) => { e.stopPropagation(); removeSlot(dk, time); }}
                                className="shrink-0 p-0.5 rounded opacity-0 hover:opacity-100 hover:bg-black/10 transition"
                                title="Supprimer"
                              >
                                <X size={10} className={col.text} />
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
                <div className="w-4 h-4 rounded bg-muted/60" />
                <span>Hors horaires</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border border-dashed border-muted-foreground/30" />
                <span>Libre — cliquer ou glisser pour créer</span>
              </div>
              <div className="flex items-center gap-2">
                <GripVertical size={14} className="text-muted-foreground/50" />
                <span>Glisser-déposer pour déplacer</span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Quick-Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setShowModal(false); drawRangeRef.current = null; }} />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Nouvel événement</h2>
              <button onClick={() => { setShowModal(false); drawRangeRef.current = null; }} className="p-1.5 hover:bg-muted rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
                <input
                  type="date"
                  value={newSlot.date}
                  onChange={(e) => setNewSlot((s) => ({ ...s, date: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Heure</label>
                <select
                  value={newSlot.time}
                  onChange={(e) => setNewSlot((s) => ({ ...s, time: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner une heure</option>
                  {ALL_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Titre</label>
                <input
                  type="text"
                  placeholder="Ex: Réunion · Pause déjeuner · Bloc opératoire"
                  value={newSlot.patient}
                  onChange={(e) => setNewSlot((s) => ({ ...s, patient: e.target.value }))}
                  onKeyDown={(e) => e.key === "Enter" && (drawRangeRef.current ? addBlockSlots() : addSlot())}
                  className="w-full px-4 py-2.5 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              {/* Color Picker */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                  <Palette size={14} className="text-muted-foreground" />
                  Couleur
                </label>
                <div className="flex gap-2 mt-1.5">
                  {EVENT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setNewSlot((s) => ({ ...s, color: c.value }))}
                      className={`w-7 h-7 rounded-full transition-all ${c.bg} ${newSlot.color === c.value ? "ring-2 ring-offset-2 ring-offset-card ring-primary scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"}`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowModal(false); drawRangeRef.current = null; }}
                className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition font-medium"
              >
                Annuler
              </button>
              <button
                onClick={() => drawRangeRef.current ? addBlockSlots() : addSlot()}
                disabled={!newSlot.date || !newSlot.time || !newSlot.patient.trim()}
                className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slot Detail Modal */}
      {detailSlot && detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailSlot(null)} />
          <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Détails</h2>
              <button onClick={() => setDetailSlot(null)} className="p-1.5 hover:bg-muted rounded-lg transition">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: colorForSlot(detailData).value }}
                >
                  {detailData.patient.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{detailData.patient}</p>
                  <p className="text-sm text-muted-foreground">{detailSlot.dk} à {detailSlot.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Statut :</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${detailData.status === "confirmed" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                  {detailData.status === "confirmed" ? "Confirmé" : "En attente"}
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
                <button onClick={() => setDetailSlot(null)} className="flex-1 px-4 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted transition font-medium">
                  Fermer
                </button>
              ) : (
                <button
                  onClick={() => removeSlot(detailSlot.dk, detailSlot.time)}
                  className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
