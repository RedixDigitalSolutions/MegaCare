import { useState, useEffect, useCallback } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  RefreshCw,
  ChevronDown,
  Users,
  AlertCircle,
  UserCheck,
  Ban,
} from "lucide-react";

const tok = () => localStorage.getItem("megacare_token") ?? "";

// ─── Types ────────────────────────────────────────────────────────────────────
type ApptStatus = "pending" | "confirmed" | "rejected" | "completed" | "cancelled";

interface Appointment {
  id: string;
  _id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  service: string;
  date: string;
  time: string;
  status: ApptStatus;
  notes: string;
  createdAt: string;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<ApptStatus, { label: string; bg: string; text: string; border: string; icon: typeof CheckCircle2 }> = {
  pending:   { label: "En attente",  bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  icon: Clock },
  confirmed: { label: "Confirmé",    bg: "bg-blue-50",    text: "text-blue-700",   border: "border-blue-200",   icon: CheckCircle2 },
  completed: { label: "Effectué",    bg: "bg-emerald-50", text: "text-emerald-700",border: "border-emerald-200",icon: UserCheck },
  rejected:  { label: "Refusé",      bg: "bg-red-50",     text: "text-red-700",    border: "border-red-200",    icon: XCircle },
  cancelled: { label: "Absent",      bg: "bg-slate-100",  text: "text-slate-600",  border: "border-slate-200",  icon: Ban },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTH_LABELS = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"];
const DAY_LABELS   = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function fmtDate(ds: string) {
  const d = new Date(ds + "T00:00:00");
  return `${DAY_LABELS[d.getDay()]} ${d.getDate()} ${MONTH_LABELS[d.getMonth()]}`;
}

/** Returns "YYYY-MM-DD" for today using LOCAL timezone. */
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function weekRange() {
  const d = new Date();
  const day = d.getDay();
  const mon = new Date(d); mon.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
  const fmt = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  return { start: fmt(mon), end: fmt(sun) };
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ApptStatus }) {
  const cfg = STATUS_CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

// ─── Action Dropdown for confirmed → outcome ──────────────────────────────────
function OutcomeDropdown({ id, onUpdate }: { id: string; onUpdate: (id: string, status: ApptStatus) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-xs font-medium text-foreground transition"
      >
        Résultat <ChevronDown size={12} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-44 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden py-1">
            <button
              onClick={() => { onUpdate(id, "completed"); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-emerald-50 text-emerald-700 font-medium transition"
            >
              <UserCheck size={13} /> Patient présent
            </button>
            <button
              onClick={() => { onUpdate(id, "cancelled"); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-slate-50 text-slate-600 font-medium transition"
            >
              <Ban size={13} /> Patient absent
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MedicalServiceAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | ApptStatus>("all");
  const [dateMode, setDateMode] = useState<"all" | "today" | "week" | "custom">("all");
  const [customDate, setCustomDate] = useState(todayStr());
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (dateMode === "today") params.set("date", todayStr());
      else if (dateMode === "custom") params.set("date", customDate);
      const r = await fetch(`/api/medical-service/appointments?${params}`, {
        headers: { Authorization: `Bearer ${tok()}` },
      });
      const data = await r.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, dateMode, customDate]);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const updateStatus = async (id: string, status: ApptStatus) => {
    setUpdating(id);
    try {
      const r = await fetch(`/api/medical-service/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
        body: JSON.stringify({ status }),
      });
      if (r.ok) {
        const updated = await r.json();
        setAppointments((prev) => prev.map((a) => (a.id === id || a._id === id) ? { ...a, ...updated, id: updated._id ?? updated.id } : a));
      }
    } finally {
      setUpdating(null);
    }
  };

  // Client-side week filter (API doesn't support start/end range)
  const { start: weekStart, end: weekEnd } = weekRange();
  const visibleAppointments = appointments.filter((a) => {
    const matchSearch =
      !search ||
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.patientPhone.includes(search) ||
      a.service.toLowerCase().includes(search.toLowerCase());
    const matchDate =
      dateMode !== "week" ||
      (a.date >= weekStart && a.date <= weekEnd);
    return matchSearch && matchDate;
  });

  // KPIs
  const total     = appointments.length;
  const pending   = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const done      = appointments.filter((a) => a.status === "completed").length;

  const kpis = [
    { label: "Total", value: total,     bg: "bg-blue-50",    text: "text-blue-600",    icon: Users },
    { label: "En attente", value: pending,  bg: "bg-amber-50",   text: "text-amber-600",   icon: Clock },
    { label: "Confirmés",  value: confirmed, bg: "bg-indigo-50",  text: "text-indigo-600",  icon: CheckCircle2 },
    { label: "Effectués",  value: done,     bg: "bg-emerald-50", text: "text-emerald-600", icon: UserCheck },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Rendez-vous</h1>
            <p className="text-xs text-muted-foreground">Gestion des demandes de rendez-vous patients</p>
          </div>
          <button
            onClick={fetchAppointments}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-secondary/50 transition text-muted-foreground disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Actualiser
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ── KPIs ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${k.bg}`}>
                    <Icon size={20} className={k.text} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{k.value}</p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Filters ── */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative flex-1 min-w-52">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher patient, téléphone, service…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              {/* Date mode */}
              <div className="flex items-center gap-1 bg-secondary/40 rounded-lg p-1">
                {(["all", "today", "week", "custom"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setDateMode(m)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${dateMode === m ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {{ all: "Tout", today: "Aujourd'hui", week: "Cette semaine", custom: "Date…" }[m]}
                  </button>
                ))}
              </div>

              {/* Custom date picker */}
              {dateMode === "custom" && (
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              )}

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as "all" | ApptStatus)}
                className="px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmés</option>
                <option value="completed">Effectués</option>
                <option value="rejected">Refusés</option>
                <option value="cancelled">Absents</option>
              </select>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : visibleAppointments.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center px-6">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mb-3">
                  <Calendar size={22} className="text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">Aucun rendez-vous trouvé</p>
                <p className="text-xs text-muted-foreground">Essayez d'autres filtres ou attendez de nouvelles demandes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date / Heure</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Patient</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Contact</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Service</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Note</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Statut</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visibleAppointments.map((appt) => {
                      const apptId = appt.id || appt._id;
                      const isUpdating = updating === apptId;
                      return (
                        <tr key={apptId} className={`hover:bg-secondary/20 transition-colors ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}>
                          {/* Date / Time */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                <Calendar size={13} className="text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground text-xs">{fmtDate(appt.date)}</p>
                                <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                  <Clock size={10} /> {appt.time}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Patient name */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground">
                                {appt.patientName?.charAt(0)?.toUpperCase() || "?"}
                              </div>
                              <p className="font-medium text-foreground text-sm">{appt.patientName || "—"}</p>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3.5 hidden md:table-cell">
                            <div className="space-y-0.5">
                              {appt.patientPhone && (
                                <a href={`tel:${appt.patientPhone}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition">
                                  <Phone size={11} className="text-primary shrink-0" />
                                  {appt.patientPhone}
                                </a>
                              )}
                              {appt.patientEmail && (
                                <a href={`mailto:${appt.patientEmail}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition">
                                  <Mail size={11} className="shrink-0" />
                                  <span className="truncate max-w-36">{appt.patientEmail}</span>
                                </a>
                              )}
                            </div>
                          </td>

                          {/* Service */}
                          <td className="px-4 py-3.5 hidden lg:table-cell">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-md">
                              {appt.service || "—"}
                            </span>
                          </td>

                          {/* Note */}
                          <td className="px-4 py-3.5 hidden lg:table-cell max-w-48">
                            <p className="text-xs text-muted-foreground truncate" title={appt.notes || undefined}>
                              {appt.notes || <span className="text-muted-foreground/40 italic">Aucune note</span>}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-4 py-3.5">
                            <StatusBadge status={appt.status} />
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-3.5 text-right">
                            {appt.status === "pending" && (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => updateStatus(apptId, "confirmed")}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition"
                                  title="Confirmer"
                                >
                                  <CheckCircle2 size={12} />
                                  Confirmer
                                </button>
                                <button
                                  onClick={() => updateStatus(apptId, "rejected")}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-semibold transition"
                                  title="Refuser"
                                >
                                  <XCircle size={12} />
                                  Refuser
                                </button>
                              </div>
                            )}
                            {appt.status === "confirmed" && (
                              <OutcomeDropdown id={apptId} onUpdate={updateStatus} />
                            )}
                            {(appt.status === "completed" || appt.status === "rejected" || appt.status === "cancelled") && (
                              <span className="text-xs text-muted-foreground/50 italic">Finalisé</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer count */}
            {!loading && visibleAppointments.length > 0 && (
              <div className="px-4 py-3 border-t border-border bg-secondary/20 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {visibleAppointments.length} rendez-vous{visibleAppointments.length > 1 ? "" : ""}
                  {filterStatus !== "all" && ` · statut : ${STATUS_CONFIG[filterStatus]?.label}`}
                </p>
                {pending > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                    <AlertCircle size={12} />
                    {pending} en attente de traitement
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
