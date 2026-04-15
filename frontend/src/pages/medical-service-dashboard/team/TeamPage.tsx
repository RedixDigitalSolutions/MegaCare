
import { useState, useEffect } from "react";

const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import {
  Search,
  Plus,
  Phone,
  Mail,
  Users,
  UserCheck,
  X,
  Edit2,
  Trash2,
} from "lucide-react";

type MemberStatus = "Actif" | "En pause" | "Absent";
type MemberRole = "Infirmier" | "Infirmière" | "Aide-soignant" | "Aide-soignante" | "Thérapeute" | "Kinésithérapeute";

interface TeamMember {
  id: string;
  name: string;
  role: MemberRole;
  status: MemberStatus;
  patients: number;
  phone: string;
  email: string;
  specialty: string;
}



const statusConfig: Record<MemberStatus, { bg: string; text: string; dot: string }> = {
  "Actif": { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  "En pause": { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-400" },
  "Absent": { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-400" },
};

const roleColors: Record<string, string> = {
  "Infirmier": "bg-blue-50 text-blue-700",
  "Infirmière": "bg-blue-50 text-blue-700",
  "Aide-soignant": "bg-purple-50 text-purple-700",
  "Aide-soignante": "bg-purple-50 text-purple-700",
  "Thérapeute": "bg-teal-50 text-teal-700",
  "Kinésithérapeute": "bg-indigo-50 text-indigo-700",
};

const emptyForm = { name: "", role: "Infirmier" as MemberRole, status: "Actif" as MemberStatus, patients: "0", phone: "", email: "", specialty: "" };

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [detailMember, setDetailMember] = useState<TeamMember | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/medical-service/team", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => setTeam(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const roles = ["all", "Infirmier/ière", "Aide-soignant(e)", "Thérapeute", "Kinésithérapeute"];

  const filtered = team.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.specialty.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" ||
      (filterRole === "Infirmier/ière" && (m.role === "Infirmier" || m.role === "Infirmière")) ||
      (filterRole === "Aide-soignant(e)" && (m.role === "Aide-soignant" || m.role === "Aide-soignante")) ||
      m.role === filterRole;
    return matchSearch && matchRole;
  });

  const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setForm({ name: m.name, role: m.role, status: m.status, patients: String(m.patients), phone: m.phone, email: m.email, specialty: m.specialty });
    setShowModal(true);
    setDetailMember(null);
  };

  const saveMember = async () => {
    if (!form.name.trim()) return;
    const url = editingId ? `/api/medical-service/team/${editingId}` : "/api/medical-service/team";
    const r = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ ...form, patients: Number(form.patients) }),
    });
    const data = await r.json();
    if (editingId) setTeam(prev => prev.map(m => m.id === editingId ? data : m));
    else setTeam(prev => [...prev, data]);
    setShowModal(false);
  };

  const confirmDelete = async () => {
    if (deleteId !== null) {
      await fetch(`/api/medical-service/team/${deleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } });
      setTeam(prev => prev.filter(m => m.id !== deleteId));
    }
    setDeleteId(null);
    setDetailMember(null);
  };

  const kpis = [
    { label: "Total membres", value: team.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Actifs", value: team.filter((m) => m.status === "Actif").length, icon: UserCheck, color: "text-green-500", bg: "bg-green-50" },
    { label: "En pause", value: team.filter((m) => m.status === "En pause").length, icon: UserCheck, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Patients pris en charge", value: team.reduce((s, m) => s + m.patients, 0), icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Mon Équipe</h1>
            <p className="text-xs text-muted-foreground">Infirmiers, aides-soignants et thérapeutes</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <Plus size={16} />
            Ajouter Membre
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
                placeholder="Rechercher par nom ou spécialité…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filterRole === r ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"
                    }`}
                >
                  {r === "all" ? "Tous" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((m) => {
              const cfg = statusConfig[m.status];
              return (
                <div key={m.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/70 to-accent/70 flex items-center justify-center text-sm font-bold text-white">
                          {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${cfg.dot}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{m.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[m.role] ?? "bg-slate-50 text-slate-700"}`}>{m.role}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${cfg.bg} ${cfg.text}`}>{m.status}</span>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground mb-4">
                    <p>🏥 <span className="font-medium text-foreground">{m.specialty}</span></p>
                    <p>👥 <span className="font-medium text-foreground">{m.patients}</span> patients assignés</p>
                    <div className="flex items-center gap-1"><Phone size={11} /> {m.phone}</div>
                    <div className="flex items-center gap-1"><Mail size={11} /> {m.email}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <button
                      onClick={() => setDetailMember(m)}
                      className="flex-1 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-xs font-medium"
                    >
                      Détails
                    </button>
                    <button
                      onClick={() => openEdit(m)}
                      className="p-1.5 rounded-lg hover:bg-muted text-primary transition"
                      title="Modifier"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(m.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Users size={40} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun membre trouvé</p>
            </div>
          )}
        </main>
      </div>

      {/* Detail panel */}
      {detailMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDetailMember(null)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Fiche membre</h2>
              <button onClick={() => setDetailMember(null)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition"><X size={18} /></button>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold text-white">
                {detailMember.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-foreground text-base">{detailMember.name}</p>
                <p className="text-sm text-muted-foreground">{detailMember.role} · {detailMember.specialty}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold ${statusConfig[detailMember.status].bg} ${statusConfig[detailMember.status].text}`}>{detailMember.status}</span>
              </div>
            </div>
            <div className="bg-muted/40 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Patients assignés</span><span className="font-semibold text-foreground">{detailMember.patients}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Téléphone</span><span className="font-semibold text-foreground">{detailMember.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-semibold text-foreground">{detailMember.email}</span></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => openEdit(detailMember)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                <Edit2 size={14} /> Modifier
              </button>
              <button onClick={() => { setDeleteId(detailMember.id); setDetailMember(null); }} className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">{editingId ? "Modifier le membre" : "Ajouter un membre"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Nom complet *</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Samir Khalifa" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Rôle</label>
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as MemberRole }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  {["Infirmier", "Infirmière", "Aide-soignant", "Aide-soignante", "Thérapeute", "Kinésithérapeute"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Statut</label>
                <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as MemberStatus }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40">
                  <option>Actif</option><option>En pause</option><option>Absent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Spécialité</label>
                <input value={form.specialty} onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Cardiologie" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Patients assignés</label>
                <input type="number" value={form.patients} onChange={(e) => setForm((f) => ({ ...f, patients: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" min={0} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Téléphone</label>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="22 111 222" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="nom@megacare.tn" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition">Annuler</button>
              <button onClick={saveMember} disabled={!form.name.trim()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50">
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
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><Trash2 size={18} className="text-red-600" /></div>
              <div>
                <h3 className="font-bold text-foreground">Supprimer le membre</h3>
                <p className="text-sm text-muted-foreground">Cette action est irréversible.</p>
              </div>
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
