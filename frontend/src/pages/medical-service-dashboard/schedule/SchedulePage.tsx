
import { useState, useEffect } from "react";

const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import {
  Calendar,
  Clock,
  Plus,
  Edit2,
  X,
  Ban,
  CheckCircle2,
  Loader2,
  Users,
  BarChart3,
} from "lucide-react";

type VisitStatus = "Planifié" | "En cours" | "Complété" | "Annulé";

interface Visit {
  id: string;
  patient: string;
  staff: string;
  date: string;
  time: string;
  duration: string;
  status: VisitStatus;
  notes: string;
}

const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);



const statusConfig: Record<VisitStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  "Planifié": { bg: "bg-blue-100", text: "text-blue-700", icon: Calendar },
  "En cours": { bg: "bg-amber-100", text: "text-amber-700", icon: Loader2 },
  "Complété": { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  "Annulé": { bg: "bg-slate-100", text: "text-slate-600", icon: Ban },
};

const emptyForm = { patient: "", staff: "", date: today, time: "09:00", duration: "1h", status: "Planifié" as VisitStatus, notes: "" };

export default function SchedulePage() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [filterDate, setFilterDate] = useState<"today" | "tomorrow" | "all">("today");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [cancelId, setCancelId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/medical-service/schedule", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => setVisits(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const filtered = visits.filter((v) => {
    if (filterDate === "today") return v.date === today;
    if (filterDate === "tomorrow") return v.date === tomorrow;
    return true;
  });

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (v: Visit) => {
    setEditingId(v.id);
    setForm({ patient: v.patient, staff: v.staff, date: v.date, time: v.time, duration: v.duration, status: v.status, notes: v.notes });
    setShowModal(true);
  };

  const saveVisit = async () => {
    if (!form.patient.trim() || !form.staff.trim()) return;
    const url = editingId ? `/api/medical-service/schedule/${editingId}` : "/api/medical-service/schedule";
    const r = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify(form),
    });
    const data = await r.json();
    if (editingId) setVisits(prev => prev.map(v => v.id === editingId ? data : v));
    else setVisits(prev => [...prev, data]);
    setShowModal(false);
  };

  const confirmCancel = async () => {
    if (cancelId !== null) {
      await fetch(`/api/medical-service/schedule/${cancelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
        body: JSON.stringify({ status: "Annulé" }),
      });
      setVisits(prev => prev.map(v => v.id === cancelId ? { ...v, status: "Annulé" } : v));
    }
    setCancelId(null);
  };

  // Stats
  const todayVisits = visits.filter((v) => v.date === today);
  const weekVisits = visits.filter((v) => v.status !== "Annulé");
  const completedToday = todayVisits.filter((v) => v.status === "Complété").length;
  const inProgressToday = todayVisits.filter((v) => v.status === "En cours").length;

  const statsCards = [
    { label: "Visites aujourd'hui", value: todayVisits.length, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "En cours", value: inProgressToday, icon: Loader2, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Complétées aujourd'hui", value: completedToday, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Total semaine", value: weekVisits.length, icon: BarChart3, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  // Weekly summary — visits per day
  const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() + 1 + i);
    return d.toISOString().slice(0, 10);
  });
  const weeklyStats = daysOfWeek.map((d) => ({
    date: d,
    label: new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
    count: visits.filter((v) => v.date === d && v.status !== "Annulé").length,
  }));
  const maxWeekly = Math.max(1, ...weeklyStats.map((w) => w.count));

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Planification</h1>
            <p className="text-xs text-muted-foreground">Visites à domicile et interventions planifiées</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <Plus size={16} />
            Programmer Visite
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`}>
                    <Icon size={20} className={k.color} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{k.value}</p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Visit list */}
            <div className="xl:col-span-2 space-y-4">
              {/* Date filter */}
              <div className="flex items-center gap-2">
                {(["today", "tomorrow", "all"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterDate(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterDate === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    {f === "today" ? "Aujourd'hui" : f === "tomorrow" ? "Demain" : "Toutes"}
                  </button>
                ))}
                <span className="ml-auto text-xs text-muted-foreground">{filtered.length} visite{filtered.length !== 1 ? "s" : ""}</span>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <Calendar size={40} className="text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aucune visite programmée</p>
                </div>
              )}

              <div className="space-y-3">
                {filtered.map((v) => {
                  const cfg = statusConfig[v.status];
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={v.id} className="bg-card rounded-xl border border-border p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{v.patient}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Users size={12} /> {v.staff}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <StatusIcon size={11} />
                          {v.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {v.date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {v.time} · {v.duration}</span>
                        {v.notes && <span className="text-foreground/70 italic">"{v.notes}"</span>}
                      </div>

                      {v.status !== "Annulé" && v.status !== "Complété" && (
                        <div className="flex items-center gap-2 pt-3 border-t border-border">
                          <button
                            onClick={() => openEdit(v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-xs font-medium"
                          >
                            <Edit2 size={12} /> Modifier
                          </button>
                          <button
                            onClick={() => setCancelId(v.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground rounded-lg hover:bg-muted transition text-xs font-medium"
                          >
                            <Ban size={12} /> Annuler
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly stats sidebar */}
            <div className="space-y-4">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 size={16} className="text-muted-foreground" />
                  Semaine en cours
                </h3>
                <div className="space-y-2">
                  {weeklyStats.map((ws) => (
                    <div key={ws.date} className="flex items-center gap-3">
                      <span className={`text-xs w-16 shrink-0 capitalize ${ws.date === today ? "font-bold text-primary" : "text-muted-foreground"}`}>{ws.label}</span>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all ${ws.date === today ? "bg-primary" : "bg-primary/40"}`}
                          style={{ width: `${(ws.count / maxWeekly) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-foreground w-4 text-right">{ws.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-5 space-y-3">
                <h3 className="font-semibold text-foreground">Résumé du jour</h3>
                {(["Planifié", "En cours", "Complété", "Annulé"] as VisitStatus[]).map((s) => {
                  const count = todayVisits.filter((v) => v.status === s).length;
                  const cfg = statusConfig[s];
                  return (
                    <div key={s} className="flex items-center justify-between text-sm">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`}>{s}</span>
                      <span className="font-semibold text-foreground">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editingId ? "Modifier la visite" : "Programmer une visite"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Patient *</label>
                <input value={form.patient} onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Fatima Ben Ali" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Personnel assigné *</label>
                <input value={form.staff} onChange={(e) => setForm((f) => ({ ...f, staff: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Samir Khalifa" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Heure</label>
                <input type="time" value={form.time} onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Durée</label>
                <select value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  {["30min", "45min", "1h", "1h30", "2h", "2h30", "3h"].map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Statut</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as VisitStatus }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option>Planifié</option><option>En cours</option><option>Complété</option><option>Annulé</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Contrôle pansement, injection…" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition">Annuler</button>
              <button onClick={saveVisit} disabled={!form.patient.trim() || !form.staff.trim()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50">
                {editingId ? "Enregistrer" : "Programmer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel confirmation */}
      {cancelId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCancelId(null)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Ban size={18} className="text-amber-600" /></div>
              <div>
                <h3 className="font-bold text-foreground">Annuler cette visite ?</h3>
                <p className="text-sm text-muted-foreground">La visite sera marquée comme annulée.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setCancelId(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition">Retour</button>
              <button onClick={confirmCancel} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition">Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
