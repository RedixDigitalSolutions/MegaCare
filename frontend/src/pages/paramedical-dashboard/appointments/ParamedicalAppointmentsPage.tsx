import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  Edit2,
  X,
  Home,
  Building2,
  Filter,
} from "lucide-react";

type AppStatus = "Confirmé" | "En attente" | "Annulé";
type Location = "Domicile" | "Cabinet";

interface Appointment {
  id: string;
  patient: string;
  type: string;
  date: string;
  time: string;
  location: Location;
  status: AppStatus;
  notes?: string;
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

const initialAppointments: Appointment[] = [];

const statusColors: Record<AppStatus, string> = {
  "Confirmé": "bg-green-100 text-green-700",
  "En attente": "bg-amber-100 text-amber-700",
  "Annulé": "bg-red-100 text-red-700",
};

const careTypes = [
  "Soins infirmiers", "Kinésithérapie", "Pansement", "Injection",
  "Perfusion", "Prise de sang", "Massage thérapeutique", "Rééducation",
];

const emptyForm = {
  patient: "", type: careTypes[0], date: "", time: "",
  location: "Domicile" as Location, status: "En attente" as AppStatus, notes: "",
};

export default function ParamedicalAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<AppStatus | "Tous">("Tous");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/paramedical/appointments", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => setAppointments(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patient.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tous" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openAdd = () => {
    setEditId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (a: Appointment) => {
    setEditId(a.id);
    setForm({ patient: a.patient, type: a.type, date: a.date, time: a.time, location: a.location, status: a.status, notes: a.notes ?? "" });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.patient || !form.date || !form.time) return;
    if (editId !== null) {
      const r = await fetch(`/api/paramedical/appointments/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
        body: JSON.stringify(form),
      }).catch(() => null);
      if (r && r.ok) {
        const data = await r.json();
        setAppointments((prev) => prev.map((a) => (a.id === editId ? data : a)));
      }
    } else {
      const r = await fetch("/api/paramedical/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
        body: JSON.stringify(form),
      }).catch(() => null);
      if (r && r.ok) {
        const data = await r.json();
        setAppointments((prev) => [...prev, data]);
      }
    }
    setShowModal(false);
  };

  const statusCounts = {
    Tous: appointments.length,
    Confirmé: appointments.filter((a) => a.status === "Confirmé").length,
    "En attente": appointments.filter((a) => a.status === "En attente").length,
    Annulé: appointments.filter((a) => a.status === "Annulé").length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Rendez-vous</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Gérez vos consultations et visites à domicile
              </p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
            >
              <Plus size={15} />
              Nouveau rendez-vous
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["Tous", "Confirmé", "En attente", "Annulé"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`rounded-xl border p-3 text-left transition ${filterStatus === s
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40"
                  }`}
              >
                <p className="text-xl font-bold text-foreground">{statusCounts[s]}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s}</p>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Rechercher patient ou type de soin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-muted-foreground shrink-0" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as AppStatus | "Tous")}
                className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="Confirmé">Confirmé</option>
                <option value="En attente">En attente</option>
                <option value="Annulé">Annulé</option>
              </select>
            </div>
          </div>

          {/* Appointments list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground text-sm">
                Aucun rendez-vous trouvé.
              </div>
            ) : (
              filtered.map((a) => (
                <div
                  key={a.id}
                  className="bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Patient info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-foreground">{a.patient}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[a.status]}`}>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.type}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {a.time}
                    </span>
                    <span className="flex items-center gap-1.5">
                      {a.location === "Domicile" ? <Home size={13} /> : <Building2 size={13} />}
                      {a.location}
                    </span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => openEdit(a)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:border-primary hover:text-primary transition shrink-0"
                  >
                    <Edit2 size={13} />
                    Modifier
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">
                {editId !== null ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-muted-foreground hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Patient</label>
                <input
                  type="text"
                  placeholder="Nom du patient"
                  value={form.patient}
                  onChange={(e) => setForm({ ...form, patient: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Type de soin</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {careTypes.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Heure</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Lieu</label>
                  <select
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value as Location })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Domicile">Domicile</option>
                    <option value="Cabinet">Cabinet</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Statut</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as AppStatus })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    <option value="Confirmé">Confirmé</option>
                    <option value="En attente">En attente</option>
                    <option value="Annulé">Annulé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Notes (optionnel)</label>
                <textarea
                  rows={2}
                  placeholder="Observations..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.patient || !form.date || !form.time}
                className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editId !== null ? "Enregistrer" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
