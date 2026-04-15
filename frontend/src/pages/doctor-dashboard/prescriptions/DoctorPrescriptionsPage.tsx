import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  Plus,
  Download,
  Eye,
  X,
  CheckCircle,
  Trash2,
  FileText,
} from "lucide-react";

type TabFilter = "Toutes" | "Validée";

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
}

interface RxData {
  id: string;
  patientId: string | null;
  medicines: Medicine[];
  createdAt: string;
}

interface PatientOption {
  id: string;
  name: string;
}

const STATUS_CFG = {
  badgeCls: "bg-green-100 text-green-700",
  icon: <CheckCircle size={13} className="text-green-600" />,
  borderCls: "border-l-green-500",
};

const EMPTY_FORM = { patientId: "" };

export default function DoctorPrescriptionsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabFilter>("Toutes");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [medicines, setMedicines] = useState<Medicine[]>([
    { name: "", dosage: "", duration: "" },
  ]);
  const [prescriptions, setPrescriptions] = useState<RxData[]>([]);
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPrescriptions = useCallback(async () => {
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/prescriptions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json.data ?? []);
        const mapped: RxData[] = data.map((p: any) => ({
          id: String(p.id || p._id),
          patientId: p.patientId || null,
          medicines: Array.isArray(p.medicines) ? p.medicines : [],
          createdAt: p.createdAt || new Date().toISOString(),
        }));
        setPrescriptions(mapped);
        // Resolve patient names
        const uniqueIds = [
          ...new Set(
            mapped
              .filter((p) => p.patientId)
              .map((p) => p.patientId as string),
          ),
        ];
        const names: Record<string, string> = {};
        await Promise.all(
          uniqueIds.map((id) =>
            fetch(`/api/users/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((r) => (r.ok ? r.json() : null))
              .then((u) => {
                if (u)
                  names[id] =
                    `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                    u.email;
              })
              .catch(() => { }),
          ),
        );
        setPatientNames(names);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, []);

  const fetchPatients = useCallback(async () => {
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    try {
      const res = await fetch("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json.data ?? []);
        setPatients(
          data
            .filter((u: any) => u.role === "patient")
            .map((u: any) => ({
              id: String(u.id || u._id),
              name:
                `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
            })),
        );
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "doctor") {
      fetchPrescriptions();
      fetchPatients();
    }
  }, [isLoading, isAuthenticated, user, fetchPrescriptions, fetchPatients]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const filtered = prescriptions; // all from API are "Validée"

  const countOf = (s: TabFilter) => prescriptions.length; // all same

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientId || medicines.some((m) => !m.name.trim())) return;
    const token = localStorage.getItem("megacare_token");
    setSubmitting(true);
    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ patientId: form.patientId, medicines }),
      });
      if (res.ok) {
        await fetchPrescriptions();
        setShowModal(false);
        setForm(EMPTY_FORM);
        setMedicines([{ name: "", dosage: "", duration: "" }]);
      }
    } catch {
      /* ignore */
    }
    setSubmitting(false);
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
                {loading ? "Chargement..." : `${prescriptions.length} ordonnances émises`}
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
              {(["Toutes", "Validée"] as TabFilter[]).map(
                (s) => (
                  <div
                    key={s}
                    onClick={() => setTab(s)}
                    className={`bg-card border rounded-xl p-4 text-center cursor-pointer transition hover:shadow-md ${tab === s
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                      }`}
                  >
                    <p
                      className={`text-2xl font-bold ${s === "Validée"
                        ? "text-green-600"
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
              {(["Toutes", "Validée"] as TabFilter[]).map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setTab(s)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${tab === s
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
              {loading ? (
                [0, 1, 2].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse h-32" />
                ))
              ) : filtered.length === 0 ? (
                <p className="text-center py-12 text-muted-foreground">
                  Aucune ordonnance trouvée.
                </p>
              ) : (
                filtered.map((rx) => {
                  const patientLabel = rx.patientId
                    ? patientNames[rx.patientId] || "Patient"
                    : "Sans patient";
                  const displayId = `ORD-${rx.id.slice(0, 7).toUpperCase()}`;
                  const displayDate = new Date(rx.createdAt).toLocaleDateString("fr-FR");
                  return (
                    <div
                      key={rx.id}
                      className={`bg-card border border-border border-l-4 ${STATUS_CFG.borderCls} rounded-xl p-5 hover:shadow-md transition`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                              {displayId}
                            </span>
                            <span
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CFG.badgeCls}`}
                            >
                              {STATUS_CFG.icon}
                              Validée
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground text-lg">
                            {patientLabel}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Émise le {displayDate}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 rounded-lg border border-border hover:bg-muted transition">
                            <Eye size={16} className="text-muted-foreground" />
                          </button>
                          <button className="p-2 rounded-lg border border-border hover:bg-muted transition">
                            <Download size={16} className="text-muted-foreground" />
                          </button>
                        </div>
                      </div>

                      {/* Medicines */}
                      <div className="space-y-2">
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
                              {(m.dosage || m.duration) && (
                                <span className="text-muted-foreground ml-1">
                                  {m.dosage && `— ${m.dosage}`}{m.duration && ` · ${m.duration}`}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
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
                    Patient *
                  </label>
                  <select
                    required
                    value={form.patientId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, patientId: e.target.value }))
                    }
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  >
                    <option value="">Sélectionner un patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
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
                  disabled={submitting || !form.patientId || medicines.some((m) => !m.name.trim())}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FileText size={15} />
                  {submitting ? "Enregistrement..." : "Émettre l'ordonnance"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
