import { useState } from "react";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import {
  Search,
  Plus,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  FlaskConical,
  Edit2,
} from "lucide-react";

type TestStatus = "En attente" | "En cours" | "Complété";
type Priority = "Normal" | "Urgent";

interface LabTest {
  id: number;
  patient: string;
  testType: string;
  doctor: string;
  status: TestStatus;
  priority: Priority;
  date: string;
  notes: string;
}

const initialTests: LabTest[] = [
  {
    id: 1,
    patient: "Fatima Ben Ali",
    testType: "Numération sanguine",
    doctor: "Dr. Karim Mansouri",
    status: "En cours",
    priority: "Normal",
    date: "2026-04-05",
    notes: "À jeun",
  },
  {
    id: 2,
    patient: "Mohammed Gharbi",
    testType: "Glycémie",
    doctor: "Dr. Nour Belhadj",
    status: "Complété",
    priority: "Normal",
    date: "2026-04-05",
    notes: "Matin",
  },
  {
    id: 3,
    patient: "Leila Mansouri",
    testType: "Test PCR ADN",
    doctor: "Dr. Sana Triki",
    status: "En attente",
    priority: "Urgent",
    date: "2026-04-05",
    notes: "Résultat sous 24h",
  },
  {
    id: 4,
    patient: "Ahmed Nasser",
    testType: "Bilan lipidique",
    doctor: "Dr. Karim Mansouri",
    status: "En cours",
    priority: "Normal",
    date: "2026-04-04",
    notes: "—",
  },
  {
    id: 5,
    patient: "Sara Meddeb",
    testType: "TSH",
    doctor: "Dr. Nour Belhadj",
    status: "Complété",
    priority: "Normal",
    date: "2026-04-04",
    notes: "—",
  },
  {
    id: 6,
    patient: "Karim Smaoui",
    testType: "Créatinine",
    doctor: "Dr. Sana Triki",
    status: "En attente",
    priority: "Urgent",
    date: "2026-04-05",
    notes: "Insuffisance rénale suspectée",
  },
  {
    id: 7,
    patient: "Nida Khadija",
    testType: "Hémoculture",
    doctor: "Dr. Karim Mansouri",
    status: "En attente",
    priority: "Urgent",
    date: "2026-04-05",
    notes: "Fièvre persistante",
  },
];

const statusConfig: Record<
  TestStatus,
  { bg: string; text: string; icon: typeof CheckCircle2 }
> = {
  Complété: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
  "En cours": { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
  "En attente": {
    bg: "bg-amber-100",
    text: "text-amber-700",
    icon: AlertCircle,
  },
};

const emptyForm = {
  patient: "",
  testType: "",
  doctor: "",
  priority: "Normal" as Priority,
  date: "",
  notes: "",
};

export default function LabTestsPage() {
  const [tests, setTests] = useState<LabTest[]>(initialTests);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | TestStatus>("all");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority>("all");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = tests.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      t.patient.toLowerCase().includes(q) ||
      t.testType.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || t.status === filterStatus;
    const matchPriority =
      filterPriority === "all" || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const kpis = [
    {
      label: "Total",
      value: tests.length,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
    },
    {
      label: "En attente",
      value: tests.filter((t) => t.status === "En attente").length,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "En cours",
      value: tests.filter((t) => t.status === "En cours").length,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Complétés",
      value: tests.filter((t) => t.status === "Complété").length,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Urgents",
      value: tests.filter((t) => t.priority === "Urgent").length,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }
  function openEdit(t: LabTest) {
    setEditingId(t.id);
    setForm({
      patient: t.patient,
      testType: t.testType,
      doctor: t.doctor,
      priority: t.priority,
      date: t.date,
      notes: t.notes,
    });
    setShowModal(true);
  }
  function markComplete(id: number) {
    setTests((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Complété" } : t)),
    );
  }
  function saveForm() {
    if (!form.patient.trim() || !form.testType.trim()) return;
    if (editingId !== null) {
      setTests((prev) =>
        prev.map((t) => (t.id === editingId ? { ...t, ...form } : t)),
      );
    } else {
      setTests((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          status: "En attente",
          date: form.date || new Date().toISOString().slice(0, 10),
        },
      ]);
    }
    setShowModal(false);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <LabDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Analyses</h1>
            <p className="text-xs text-muted-foreground">
              Gestion des demandes d'analyse par patient
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
          >
            <Plus size={16} /> Nouvelle analyse
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {kpis.map((k) => (
              <div
                key={k.label}
                className="bg-card rounded-xl border border-border p-4 flex items-center gap-3"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${k.bg}`}
                >
                  <FlaskConical size={18} className={k.color} />
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground">{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Rechercher patient ou type d'analyse…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "En attente", "En cours", "Complété"] as const).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
                  >
                    {s === "all" ? "Tous statuts" : s}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setFilterPriority(
                    filterPriority === "Urgent" ? "all" : "Urgent",
                  )
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterPriority === "Urgent" ? "bg-red-500 text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
              >
                Urgents seulement
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    {[
                      "Patient",
                      "Type d'analyse",
                      "Médecin prescripteur",
                      "Priorité",
                      "Statut",
                      "Date",
                      "Notes",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((t) => {
                    const cfg = statusConfig[t.status];
                    const StatusIcon = cfg.icon;
                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                          {t.patient}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {t.testType}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {t.doctor}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${t.priority === "Urgent" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                          >
                            <StatusIcon size={11} />
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                          {t.date}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground italic text-xs max-w-[140px] truncate">
                          {t.notes}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {t.status !== "Complété" && (
                              <button
                                onClick={() => markComplete(t.id)}
                                title="Marquer comme complété"
                                className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition"
                              >
                                <CheckCircle2 size={14} />
                              </button>
                            )}
                            <button
                              onClick={() => openEdit(t)}
                              className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition"
                            >
                              <Edit2 size={14} />
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
                <FlaskConical
                  size={36}
                  className="mx-auto mb-2 text-muted-foreground/30"
                />
                <p className="text-muted-foreground">Aucune analyse trouvée</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                {editingId ? "Modifier l'analyse" : "Nouvelle analyse"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  {
                    label: "Patient *",
                    key: "patient",
                    placeholder: "Nom du patient",
                  },
                  {
                    label: "Type d'analyse *",
                    key: "testType",
                    placeholder: "Ex: Glycémie",
                  },
                  {
                    label: "Médecin prescripteur",
                    key: "doctor",
                    placeholder: "Dr. Nom",
                  },
                  { label: "Date", key: "date", type: "date", placeholder: "" },
                ] as {
                  label: string;
                  key: keyof typeof emptyForm;
                  placeholder: string;
                  type?: string;
                }[]
              ).map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type ?? "text"}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Priorité
                </label>
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      priority: e.target.value as Priority,
                    }))
                  }
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option>Normal</option>
                  <option>Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Notes
                </label>
                <input
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  placeholder="À jeun, instructions…"
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition"
              >
                Annuler
              </button>
              <button
                onClick={saveForm}
                disabled={!form.patient.trim() || !form.testType.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50"
              >
                {editingId ? "Enregistrer" : "Créer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
