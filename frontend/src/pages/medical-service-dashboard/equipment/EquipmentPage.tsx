import { useState } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Plus, Search, X, Wrench, Package, CheckCircle2, AlertCircle, Edit2, Trash2 } from "lucide-react";

type EqStatus = "Disponible" | "En utilisation" | "Maintenance";

interface Equipment {
  id: number;
  name: string;
  type: string;
  serial: string;
  status: EqStatus;
  patient: string;
  maintenanceDate: string;
  location: string;
}

const initialEquipment: Equipment[] = [
  { id: 1, name: "Tensiomètre électronique", type: "Diagnostic", serial: "BP-1042", status: "Disponible", patient: "—", maintenanceDate: "2026-06-01", location: "Salle A" },
  { id: 2, name: "Oxymètre de pouls", type: "Diagnostic", serial: "OX-5511", status: "En utilisation", patient: "Fatima Ben Ali", maintenanceDate: "2026-07-15", location: "Salle B" },
  { id: 3, name: "Pompe à perfusion", type: "Thérapeutique", serial: "IV-2230", status: "En utilisation", patient: "Mohammed Gharbi", maintenanceDate: "2026-05-20", location: "Salle C" },
  { id: 4, name: "Défibrillateur", type: "Urgence", serial: "DF-0087", status: "Disponible", patient: "—", maintenanceDate: "2026-04-10", location: "Couloir" },
  { id: 5, name: "Nébuliseur", type: "Thérapeutique", serial: "NB-3317", status: "Maintenance", patient: "—", maintenanceDate: "2026-04-05", location: "Atelier" },
  { id: 6, name: "ECG portable", type: "Diagnostic", serial: "EC-9980", status: "Disponible", patient: "—", maintenanceDate: "2026-08-01", location: "Salle A" },
  { id: 7, name: "Glucomètre", type: "Diagnostic", serial: "GL-4423", status: "En utilisation", patient: "Sonia Trabelsi", maintenanceDate: "2026-09-01", location: "Salle B" },
];

type FilterKey = "Tous" | EqStatus;

const statusConfig: Record<EqStatus, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
  Disponible: { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
  "En utilisation": { color: "text-blue-600", bg: "bg-blue-100", icon: Package },
  Maintenance: { color: "text-amber-600", bg: "bg-amber-100", icon: Wrench },
};

const emptyForm = { name: "", type: "", serial: "", status: "Disponible" as EqStatus, patient: "", maintenanceDate: "", location: "" };

export default function EquipmentPage() {
  const [items, setItems] = useState<Equipment[]>(initialEquipment);
  const [filter, setFilter] = useState<FilterKey>("Tous");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Equipment | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Equipment | null>(null);

  const filtered = items.filter((i) => {
    const matchFilter = filter === "Tous" || i.status === filter;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.serial.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const kpis = [
    { label: "Total équipements", value: items.length, color: "text-indigo-500", bg: "bg-indigo-50", icon: Package },
    { label: "Disponibles", value: items.filter((i) => i.status === "Disponible").length, color: "text-green-500", bg: "bg-green-50", icon: CheckCircle2 },
    { label: "En utilisation", value: items.filter((i) => i.status === "En utilisation").length, color: "text-blue-500", bg: "bg-blue-50", icon: Package },
    { label: "En maintenance", value: items.filter((i) => i.status === "Maintenance").length, color: "text-amber-500", bg: "bg-amber-50", icon: Wrench },
  ];

  function openAdd() { setEditing(null); setForm(emptyForm); setShowModal(true); }
  function openEdit(item: Equipment) {
    setEditing(item);
    setForm({ name: item.name, type: item.type, serial: item.serial, status: item.status, patient: item.patient, maintenanceDate: item.maintenanceDate, location: item.location });
    setShowModal(true);
  }
  function saveForm() {
    if (!form.name.trim() || !form.serial.trim()) return;
    if (editing) {
      setItems((prev) => prev.map((i) => i.id === editing.id ? { ...i, ...form } : i));
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  }
  function confirmDelete() {
    if (deleteTarget) { setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id)); setDeleteTarget(null); }
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Équipements</h1>
            <p className="text-xs text-muted-foreground">Inventaire et suivi du matériel médical</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
            <Plus size={16} /> Ajouter équipement
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => { const Icon = k.icon; return (
              <div key={k.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`}><Icon size={20} className={k.color} /></div>
                <div><p className="text-2xl font-bold text-foreground">{k.value}</p><p className="text-xs text-muted-foreground">{k.label}</p></div>
              </div>
            ); })}
          </div>

          {/* Filters + Search */}
          <div className="flex flex-wrap items-center gap-3">
            {(["Tous", "Disponible", "En utilisation", "Maintenance"] as FilterKey[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                {f}
              </button>
            ))}
            <div className="relative ml-auto">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Nom ou numéro série…"
                className="pl-9 pr-4 py-1.5 border border-border rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-56" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Équipement", "Série", "Type", "Statut", "Patient assigné", "Prochaine maintenance", "Lieu", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const cfg = statusConfig[item.status]; const StatusIcon = cfg.icon;
                    return (
                      <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                        <td className="px-4 py-3 font-medium text-foreground">{item.name}</td>
                        <td className="px-4 py-3 text-muted-foreground font-mono">{item.serial}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.type}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon size={11} />{item.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-foreground">{item.patient}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.maintenanceDate}</td>
                        <td className="px-4 py-3 text-muted-foreground">{item.location}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"><Edit2 size={14} /></button>
                            <button onClick={() => setDeleteTarget(item)} className="p-1.5 rounded-lg hover:bg-red-50 transition text-muted-foreground hover:text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">{editing ? "Modifier équipement" : "Ajouter un équipement"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Nom", key: "name", type: "text", placeholder: "Ex: Tensiomètre" },
                { label: "Type", key: "type", type: "text", placeholder: "Ex: Diagnostic" },
                { label: "N° de série", key: "serial", type: "text", placeholder: "Ex: BP-1042" },
                { label: "Patient assigné", key: "patient", type: "text", placeholder: "— si non assigné" },
                { label: "Prochaine maintenance", key: "maintenanceDate", type: "date", placeholder: "" },
                { label: "Emplacement", key: "location", type: "text", placeholder: "Ex: Salle A" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={(form as Record<string, string>)[f.key]}
                    onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Statut</label>
                <select value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as EqStatus }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  {["Disponible", "En utilisation", "Maintenance"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition">Annuler</button>
                <button onClick={saveForm} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl border border-border w-full max-w-sm shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center"><AlertCircle size={20} className="text-red-500" /></div>
              <div><p className="font-semibold text-foreground">Supprimer l'équipement</p><p className="text-xs text-muted-foreground">{deleteTarget.name}</p></div>
            </div>
            <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition">Annuler</button>
              <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition font-medium">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
