
import { useState } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Users,
  UserCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

type HospStatus = "En cours" | "Suspendu" | "Terminé";

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
  status: HospStatus;
  startDate: string;
  nurse: string;
  phone: string;
}

const initialPatients: Patient[] = [
  { id: 1, name: "Fatima Ben Ali", age: 65, condition: "Suivi post-opératoire", status: "En cours", startDate: "2026-01-15", nurse: "Samir Khalifa", phone: "22 123 456" },
  { id: 2, name: "Mohammed Gharbi", age: 78, condition: "Rééducation cardiaque", status: "En cours", startDate: "2026-01-20", nurse: "Nadia Fayed", phone: "98 234 567" },
  { id: 3, name: "Leila Mansouri", age: 72, condition: "Traitement diabète", status: "Suspendu", startDate: "2025-12-01", nurse: "Ali Ben Mahmoud", phone: "55 345 678" },
  { id: 4, name: "Ahmed Nasser", age: 85, condition: "Soins palliatifs", status: "En cours", startDate: "2025-11-10", nurse: "Hassan Abidi", phone: "77 456 789" },
  { id: 5, name: "Sonia Trabelsi", age: 58, condition: "Convalescence fracture", status: "En cours", startDate: "2026-02-05", nurse: "Fatma Krichene", phone: "50 567 890" },
  { id: 6, name: "Youssef Hamdi", age: 70, condition: "Soins plaies", status: "Terminé", startDate: "2025-10-01", nurse: "Samir Khalifa", phone: "23 678 901" },
];

const statusConfig: Record<HospStatus, { label: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
  "En cours": { label: "En cours", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  "Suspendu": { label: "Suspendu", bg: "bg-amber-100", text: "text-amber-700", icon: AlertCircle },
  "Terminé": { label: "Terminé", bg: "bg-slate-100", text: "text-slate-600", icon: UserCheck },
};

const emptyForm = { name: "", age: "", condition: "", status: "En cours" as HospStatus, startDate: "", nurse: "", phone: "" };

export default function MedicalServicePatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | HospStatus>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p: Patient) => {
    setEditingId(p.id);
    setForm({ name: p.name, age: String(p.age), condition: p.condition, status: p.status, startDate: p.startDate, nurse: p.nurse, phone: p.phone });
    setShowModal(true);
  };

  const savePatient = () => {
    if (!form.name.trim() || !form.condition.trim()) return;
    if (editingId !== null) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name: form.name, age: Number(form.age), condition: form.condition, status: form.status, startDate: form.startDate, nurse: form.nurse, phone: form.phone }
            : p
        )
      );
    } else {
      const newId = Math.max(0, ...patients.map((p) => p.id)) + 1;
      setPatients((prev) => [...prev, { id: newId, name: form.name, age: Number(form.age), condition: form.condition, status: form.status, startDate: form.startDate || new Date().toISOString().slice(0, 10), nurse: form.nurse, phone: form.phone }]);
    }
    setShowModal(false);
  };

  const confirmDelete = () => {
    if (deleteId !== null) setPatients((prev) => prev.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  const kpis = [
    { label: "Total patients", value: patients.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "En cours", value: patients.filter((p) => p.status === "En cours").length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Suspendus", value: patients.filter((p) => p.status === "Suspendu").length, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Terminés", value: patients.filter((p) => p.status === "Terminé").length, icon: UserCheck, color: "text-slate-500", bg: "bg-slate-50" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Patients</h1>
            <p className="text-xs text-muted-foreground">Gestion des hospitalisations à domicile</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <Plus size={16} />
            Ajouter Patient
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => {
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

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom ou condition…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "En cours", "Suspendu", "Terminé"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                    filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {s === "all" ? "Tous" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {["Patient", "Âge", "Condition", "Infirmier", "Statut", "Depuis", "Téléphone", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((p) => {
                    const cfg = statusConfig[p.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                            {p.name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.age} ans</td>
                        <td className="px-4 py-3 text-muted-foreground">{p.condition}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.nurse}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            <StatusIcon size={11} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.startDate}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{p.phone}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition"
                              title="Modifier"
                            >
                              <Edit2 size={15} />
                            </button>
                            <button
                              onClick={() => setDeleteId(p.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                              title="Supprimer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <Users size={40} className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Aucun patient trouvé</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editingId ? "Modifier le patient" : "Ajouter un patient"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg transition text-muted-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Nom complet *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Fatima Ben Ali"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Âge</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="65"
                  min={0}
                  max={120}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as HospStatus }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option>En cours</option>
                  <option>Suspendu</option>
                  <option>Terminé</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Condition / Motif *</label>
                <input
                  value={form.condition}
                  onChange={(e) => setForm((f) => ({ ...f, condition: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Suivi post-opératoire"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Infirmier assigné</label>
                <input
                  value={form.nurse}
                  onChange={(e) => setForm((f) => ({ ...f, nurse: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Samir Khalifa"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Téléphone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="22 123 456"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Date d'entrée</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition">
                Annuler
              </button>
              <button
                onClick={savePatient}
                disabled={!form.name.trim() || !form.condition.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingId ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 size={18} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Supprimer le patient</h3>
                <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition">
                Annuler
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
