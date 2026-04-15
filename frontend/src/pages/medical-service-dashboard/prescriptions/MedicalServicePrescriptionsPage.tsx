
import { useState, useEffect } from "react";

const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import {
  Search, Plus, Edit2, Trash2, X, FileText, CheckCircle2, Clock, AlertCircle,
} from "lucide-react";

type RxStatus = "Active" | "Terminée" | "En attente";

interface Prescription {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  medications: string;
  status: RxStatus;
  notes: string;
}



const statusConfig: Record<RxStatus, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
  "Active": { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  "Terminée": { bg: "bg-slate-100", text: "text-slate-600", icon: FileText },
  "En attente": { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
};

const emptyForm = { patient: "", doctor: "", date: "", medications: "", status: "Active" as RxStatus, notes: "" };

export default function MedicalServicePrescriptionsPage() {
  const [rxList, setRxList] = useState<Prescription[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | RxStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/medical-service/prescriptions", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => setRxList(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const filtered = rxList.filter((r) => {
    const matchSearch = r.patient.toLowerCase().includes(search.toLowerCase()) ||
      r.medications.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (r: Prescription) => {
    setEditingId(r.id);
    setForm({ patient: r.patient, doctor: r.doctor, date: r.date, medications: r.medications, status: r.status, notes: r.notes });
    setShowModal(true);
  };

  const saveRx = async () => {
    if (!form.patient.trim() || !form.medications.trim()) return;
    const url = editingId ? `/api/medical-service/prescriptions/${editingId}` : "/api/medical-service/prescriptions";
    const r = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ ...form, date: form.date || new Date().toISOString().slice(0, 10) }),
    });
    const data = await r.json();
    if (editingId) setRxList(prev => prev.map(r => r.id === editingId ? data : r));
    else setRxList(prev => [...prev, data]);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      await fetch(`/api/medical-service/prescriptions/${deleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } });
      setRxList(prev => prev.filter(r => r.id !== deleteId));
    }
    setDeleteId(null);
  };

  const kpis = [
    { label: "Total ordonnances", value: rxList.length, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Actives", value: rxList.filter((r) => r.status === "Active").length, color: "text-green-500", bg: "bg-green-50" },
    { label: "En attente", value: rxList.filter((r) => r.status === "En attente").length, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Terminées", value: rxList.filter((r) => r.status === "Terminée").length, color: "text-slate-500", bg: "bg-slate-50" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Ordonnances</h1>
            <p className="text-xs text-muted-foreground">Prescriptions des patients en hospitalisation</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
            <Plus size={16} /> Créer Ordonnance
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <div key={k.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`}>
                  <FileText size={20} className={k.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="Rechercher par patient ou médicament…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
            </div>
            <div className="flex gap-2">
              {(["all", "Active", "En attente", "Terminée"] as const).map((s) => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}>
                  {s === "all" ? "Toutes" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>{["Patient", "Médecin", "Date", "Médicaments", "Statut", "Notes", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => {
                    const cfg = statusConfig[r.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{r.patient}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.doctor}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{r.date}</td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{r.medications}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            <StatusIcon size={11} />{r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground italic text-xs max-w-[140px] truncate">{r.notes}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition"><Edit2 size={14} /></button>
                            <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16"><AlertCircle size={36} className="mx-auto mb-2 text-muted-foreground/30" /><p className="text-muted-foreground">Aucune ordonnance trouvée</p></div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editingId ? "Modifier l'ordonnance" : "Nouvelle ordonnance"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Patient *</label>
                <input value={form.patient} onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Fatima Ben Ali" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Médecin</label>
                <input value={form.doctor} onChange={(e) => setForm((f) => ({ ...f, doctor: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Dr. Mansouri" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Statut</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as RxStatus }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option>Active</option><option>En attente</option><option>Terminée</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Médicaments *</label>
                <input value={form.medications} onChange={(e) => setForm((f) => ({ ...f, medications: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Paracétamol 1g, Amoxicilline 500mg" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Notes posologie</label>
                <input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="3x/jour après repas" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition">Annuler</button>
              <button onClick={saveRx} disabled={!form.patient.trim() || !form.medications.trim()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50">
                {editingId ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><Trash2 size={18} className="text-red-600" /></div>
              <div><h3 className="font-bold text-foreground">Supprimer l'ordonnance</h3><p className="text-sm text-muted-foreground">Action irréversible.</p></div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition">Annuler</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
