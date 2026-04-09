import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  Plus,
  Download,
  Eye,
  X,
  CheckCircle,
  Clock,
  Trash2,
  FileText,
} from "lucide-react";

type PrescriptionStatus = "Validée" | "En attente";
type TabFilter = "Toutes" | PrescriptionStatus;

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
}

interface Prescription {
  id: string;
  patient: string;
  age: number;
  date: string;
  medicines: Medicine[];
  status: PrescriptionStatus;
  notes: string;
}

const PRESCRIPTIONS: Prescription[] = [
  {
    id: "ORD-001",
    patient: "Fatima Benali",
    age: 34,
    date: "2026-04-03",
    medicines: [
      { name: "Amlodipine 5mg", dosage: "1 cp/jour", duration: "3 mois" },
      { name: "Ramipril 10mg", dosage: "1 cp/soir", duration: "3 mois" },
    ],
    status: "Validée",
    notes: "Contrôle TA dans 4 semaines.",
  },
  {
    id: "ORD-002",
    patient: "Mohamed Karoui",
    age: 52,
    date: "2026-04-02",
    medicines: [
      { name: "Furosémide 40mg", dosage: "1 cp matin", duration: "1 mois" },
      { name: "Spironolactone 25mg", dosage: "1 cp/jour", duration: "3 mois" },
      { name: "Bisoprolol 5mg", dosage: "½ cp/jour", duration: "3 mois" },
    ],
    status: "En attente",
    notes: "Surveiller kaliémie. Bilan J+15.",
  },
  {
    id: "ORD-003",
    patient: "Aisha Hamdi",
    age: 28,
    date: "2026-03-28",
    medicines: [
      {
        name: "Propranolol 10mg",
        dosage: "½ cp si palpitations",
        duration: "1 mois",
      },
    ],
    status: "Validée",
    notes: "Résultat Holter attendu.",
  },
  {
    id: "ORD-004",
    patient: "Youssef Tlili",
    age: 47,
    date: "2026-04-01",
    medicines: [
      {
        name: "Nitroglycérine LP 5mg",
        dosage: "1 cp matin",
        duration: "6 mois",
      },
      { name: "Aspirine 100mg", dosage: "1 cp/jour", duration: "6 mois" },
      {
        name: "Atorvastatine 20mg",
        dosage: "1 cp le soir",
        duration: "6 mois",
      },
    ],
    status: "En attente",
    notes: "Test effort prévu le 12/04.",
  },
];

const STATUS_CFG: Record<
  PrescriptionStatus,
  { badgeCls: string; icon: React.ReactNode; borderCls: string }
> = {
  Validée: {
    badgeCls: "bg-green-100 text-green-700",
    icon: <CheckCircle size={13} className="text-green-600" />,
    borderCls: "border-l-green-500",
  },
  "En attente": {
    badgeCls: "bg-amber-100 text-amber-700",
    icon: <Clock size={13} className="text-amber-600" />,
    borderCls: "border-l-amber-400",
  },
};

const EMPTY_FORM = {
  patient: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export default function DoctorPrescriptionsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabFilter>("Toutes");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", duration: "" },
  ]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const filtered =
    tab === "Toutes" ? PRESCRIPTIONS : PRESCRIPTIONS.filter((p) => p.status === tab);

  const countOf = (s: TabFilter) =>
    s === "Toutes"
      ? PRESCRIPTIONS.length
      : PRESCRIPTIONS.filter((p) => p.status === s).length;

  const addMedicineRow = () =>
    setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "" }]);

  const removeMedicineRow = (i: number) =>
    setMedicines((prev) => prev.filter((_, idx) => idx !== i));

  const updateMedicine = (
    i: number,
    field: keyof Medicine,
    value: string,
  ) => {
    setMedicines((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
    setForm(EMPTY_FORM);
    setMedicines([{ name: "", dosage: "", duration: "" }]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Ordonnances
              </h1>
              <p className="text-muted-foreground mt-1">
                {PRESCRIPTIONS.length} ordonnances émises
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-medium text-sm"
            >
              <Plus size={16} />
              Nouvelle ordonnance
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
              {(["Toutes", "Validée", "En attente"] as TabFilter[]).map(
                (s) => (
                  <div
                    key={s}
                    onClick={() => setTab(s)}
                    className={`bg-card border rounded-xl p-4 text-center cursor-pointer transition hover:shadow-md ${
                      tab === s
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    }`}
                  >
                    <p
                      className={`text-2xl font-bold ${
                        s === "Validée"
                          ? "text-green-600"
                          : s === "En attente"
                            ? "text-amber-600"
                            : "text-foreground"
                      }`}
                    >
                      {countOf(s)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">{s}</p>
                  </div>
                ),
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {(["Toutes", "Validée", "En attente"] as TabFilter[]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setTab(s)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      tab === s
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {s}
                    <span className="ml-1.5 text-xs opacity-75">
                      ({countOf(s)})
                    </span>
                  </button>
                ),
              )}
            </div>

            {/* Prescription Cards */}
            <div className="space-y-4">
              {filtered.map((rx) => {
                const cfg = STATUS_CFG[rx.status];
                return (
                  <div
                    key={rx.id}
                    className={`bg-card border border-border border-l-4 ${cfg.borderCls} rounded-xl p-5 hover:shadow-md transition`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                            {rx.id}
                          </span>
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badgeCls}`}
                          >
                            {cfg.icon}
                            {rx.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">
                          {rx.patient}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {rx.age} ans · Émise le {rx.date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 rounded-lg border border-border hover:bg-muted transition">
                          <Eye size={16} className="text-muted-foreground" />
                        </button>
                        <button className="p-2 rounded-lg border border-border hover:bg-muted transition">
                          <Download
                            size={16}
                            className="text-muted-foreground"
                          />
                        </button>
                      </div>
                    </div>

                    {/* Medicines */}
                    <div className="space-y-2 mb-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        Médicaments prescrits
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {rx.medicines.map((m, i) => (
                          <div
                            key={i}
                            className="bg-muted/40 border border-border rounded-lg px-3 py-1.5 text-xs"
                          >
                            <span className="font-medium text-foreground">
                              {m.name}
                            </span>
                            <span className="text-muted-foreground ml-1">
                              — {m.dosage} · {m.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {rx.notes && (
                      <p className="text-sm text-muted-foreground border-t border-border pt-3 flex items-start gap-1.5">
                        <FileText
                          size={13}
                          className="shrink-0 mt-0.5 text-muted-foreground"
                        />
                        {rx.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* New Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Nouvelle ordonnance
                </h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Nom du patient *
                  </label>
                  <input
                    required
                    value={form.patient}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patient: e.target.value }))
                    }
                    placeholder="Prénom Nom"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, date: e.target.value }))
                    }
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>
              </div>

              {/* Medicines */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Médicaments *
                  </label>
                  <button
                    type="button"
                    onClick={addMedicineRow}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Plus size={12} /> Ajouter
                  </button>
                </div>
                <div className="space-y-3">
                  {medicines.map((m, i) => (
                    <div
                      key={i}
                      className="border border-border rounded-lg p-3 space-y-2 bg-muted/20"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          required
                          value={m.name}
                          onChange={(e) =>
                            updateMedicine(i, "name", e.target.value)
                          }
                          placeholder="Nom du médicament"
                          className="flex-1 border border-border rounded px-2.5 py-1.5 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        />
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeMedicineRow(i)}
                            className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          required
                          value={m.dosage}
                          onChange={(e) =>
                            updateMedicine(i, "dosage", e.target.value)
                          }
                          placeholder="Posologie"
                          className="border border-border rounded px-2.5 py-1.5 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        />
                        <input
                          required
                          value={m.duration}
                          onChange={(e) =>
                            updateMedicine(i, "duration", e.target.value)
                          }
                          placeholder="Durée"
                          className="border border-border rounded px-2.5 py-1.5 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Notes / Recommandations
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="Instructions particulières…"
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition text-sm font-medium"
                >
                  <FileText size={15} />
                  Émettre l'ordonnance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
