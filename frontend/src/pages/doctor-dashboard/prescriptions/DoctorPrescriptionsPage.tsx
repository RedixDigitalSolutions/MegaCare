import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  Download,
  Eye,
  X,
  CheckCircle,
  FileText,
} from "lucide-react";

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

const STATUS_CFG = {
  badgeCls: "bg-green-100 text-green-700",
  icon: <CheckCircle size={13} className="text-green-600" />,
  borderCls: "border-l-green-500",
};

export default function DoctorPrescriptionsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"Toutes" | "Validée">("Toutes");
  const [prescriptions, setPrescriptions] = useState<RxData[]>([]);
  const [patientNames, setPatientNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [viewingRx, setViewingRx] = useState<RxData | null>(null);

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

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role === "doctor") {
      fetchPrescriptions();
    }
  }, [isLoading, isAuthenticated, user, fetchPrescriptions]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const filtered = prescriptions;
  const countOf = () => prescriptions.length;

  const doctorLabel = user
    ? `Dr. ${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    : "Médecin";

  const handleDownload = (rx: RxData) => {
    const patientLabel = rx.patientId
      ? patientNames[rx.patientId] || "Patient"
      : "Sans patient";
    const displayId = `ORD-${rx.id.slice(0, 7).toUpperCase()}`;
    const displayDate = new Date(rx.createdAt).toLocaleDateString("fr-FR");
    const medicineRows = rx.medicines
      .map((m) => `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${m.name}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${m.dosage || "—"}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${m.duration || "—"}</td></tr>`)
      .join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Ordonnance ${displayId}</title><style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;color:#111}h1{font-size:20px}th{text-align:left;background:#f3f4f6;padding:6px 12px}table{border-collapse:collapse;width:100%}.footer{margin-top:40px;font-size:12px;color:#6b7280}</style></head><body><h1>Ordonnance Médicale</h1><p><strong>${doctorLabel}</strong></p><hr/><p><strong>Patient :</strong> ${patientLabel}<br/><strong>Référence :</strong> ${displayId}<br/><strong>Date :</strong> ${displayDate}</p><h3>Médicaments prescrits</h3><table><thead><tr><th>Médicament</th><th>Posologie</th><th>Durée</th></tr></thead><tbody>${medicineRows}</tbody></table><div class="footer"><p>Document généré par MegaCare — À conserver.</p></div></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ordonnance-${displayId}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">Ordonnances</h1>
            <p className="text-muted-foreground mt-1">
              {loading ? "Chargement..." : `${prescriptions.length} ordonnance${prescriptions.length !== 1 ? "s" : ""} émise${prescriptions.length !== 1 ? "s" : ""} — générées depuis les consultations`}
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {(["Toutes", "Validée"] as const).map((s) => (
                <div
                  key={s}
                  onClick={() => setTab(s)}
                  className={`bg-card border rounded-xl p-4 text-center cursor-pointer transition hover:shadow-md ${tab === s ? "border-primary ring-2 ring-primary/20" : "border-border"
                    }`}
                >
                  <p className={`text-2xl font-bold ${s === "Validée" ? "text-green-600" : "text-foreground"}`}>
                    {prescriptions.length}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{s}</p>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {(["Toutes", "Validée"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setTab(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${tab === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                >
                  {s}
                  <span className="ml-1.5 text-xs opacity-75">({prescriptions.length})</span>
                </button>
              ))}
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
                          <button
                            onClick={() => setViewingRx(rx)}
                            title="Voir"
                            className="p-2 rounded-lg border border-border hover:bg-muted transition"
                          >
                            <Eye size={16} className="text-muted-foreground" />
                          </button>
                          <button
                            onClick={() => handleDownload(rx)}
                            title="Télécharger"
                            className="p-2 rounded-lg border border-border hover:bg-muted transition"
                          >
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

      {/* View Prescription Modal */}
      {viewingRx && (() => {
        const rx = viewingRx;
        const patientLabel = rx.patientId ? patientNames[rx.patientId] || "Patient" : "Sans patient";
        const displayId = `ORD-${rx.id.slice(0, 7).toUpperCase()}`;
        const displayDate = new Date(rx.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewingRx(null)} />
            <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText size={18} className="text-green-700" />
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-base">Ordonnance médicale</h2>
                    <p className="text-xs text-muted-foreground font-mono">{displayId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(rx)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition text-xs font-medium"
                  >
                    <Download size={13} />
                    Télécharger
                  </button>
                  <button onClick={() => setViewingRx(null)} className="p-2 hover:bg-muted rounded-lg transition">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                <div className="bg-muted/30 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Médecin prescripteur</p>
                  <p className="font-bold text-foreground">{doctorLabel}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Patient</p>
                    <p className="text-sm font-medium text-foreground">{patientLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Date d'émission</p>
                    <p className="text-sm font-medium text-foreground">{displayDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Médicaments prescrits</p>
                  <div className="space-y-2">
                    {rx.medicines.map((m, i) => (
                      <div key={i} className="flex items-start gap-3 bg-background border border-border rounded-xl px-4 py-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">{i + 1}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground text-sm">{m.name}</p>
                          <div className="flex gap-3 mt-0.5">
                            {m.dosage && <span className="text-xs text-muted-foreground">Posologie : {m.dosage}</span>}
                            {m.duration && <span className="text-xs text-muted-foreground">Durée : {m.duration}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-center text-muted-foreground pt-2 border-t border-border">
                  Document généré par MegaCare — Ce document est strictement confidentiel.
                </p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
