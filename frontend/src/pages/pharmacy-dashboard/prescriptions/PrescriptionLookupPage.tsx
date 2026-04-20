import { useState } from "react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import {
  Search, QrCode, Pill, Clock, CheckCircle2, AlertCircle, User, Calendar, Loader2,
} from "lucide-react";

interface LookupResult {
  id: string;
  doctorName: string;
  patientName: string;
  medicines: { name: string; dosage?: string; duration?: string }[];
  status: string;
  purchaseStatus: string;
  secretCode: string;
  createdAt: string;
  expiryDate?: string;
  notes?: string;
}

export default function PrescriptionLookupPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState(false);

  const lookup = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    const token = localStorage.getItem("megacare_token");
    try {
      const res = await fetch(`/api/prescriptions/verify/${code.trim().toUpperCase()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.message || "Ordonnance introuvable");
        return;
      }
      setResult(await res.json());
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const markPurchased = async () => {
    if (!result) return;
    setMarking(true);
    const token = localStorage.getItem("megacare_token");
    try {
      const res = await fetch(`/api/prescriptions/${result.id}/purchase`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        setResult({ ...result, purchaseStatus: "purchased" });
      }
    } finally {
      setMarking(false);
    }
  };

  const statusLabel = (s: string) => {
    const m: Record<string, string> = { en_attente: "En attente", "validée": "Validée", "rejetée": "Rejetée", "expirée": "Expirée" };
    return m[s] || s;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <PharmacyDashboardSidebar />
        <main className="flex-1 overflow-auto">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <QrCode size={28} className="text-primary" /> Vérification Ordonnance
            </h1>
            <p className="text-muted-foreground mt-1">
              Recherchez une ordonnance par code de vérification
            </p>
          </div>

          <div className="p-6 max-w-3xl mx-auto space-y-6">
            {/* Search */}
            <div className="bg-card rounded-xl border border-border p-6">
              <label className="text-sm font-medium text-foreground block mb-2">
                Code de vérification
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && lookup()}
                    placeholder="Ex: A1B2C3D4"
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground font-mono text-lg tracking-widest uppercase placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm"
                    maxLength={8}
                  />
                </div>
                <button
                  onClick={lookup}
                  disabled={loading || !code.trim()}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                  Vérifier
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-primary/5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-foreground">Ordonnance vérifiée</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">Code: {result.secretCode}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        result.purchaseStatus === "purchased"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-orange-100 text-orange-700 border-orange-200"
                      }`}>
                        {result.purchaseStatus === "purchased" ? "Achetée" : "Non achetée"}
                      </span>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                        result.status === "validée"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : result.status === "expirée" || result.status === "rejetée"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-orange-100 text-orange-700 border-orange-200"
                      }`}>
                        {statusLabel(result.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Patient & Doctor info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Patient</p>
                        <p className="text-sm font-medium text-foreground">{result.patientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Médecin</p>
                        <p className="text-sm font-medium text-foreground">{result.doctorName}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    <span>Émise le {new Date(result.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>

                  {/* Medicines */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Médicaments ({result.medicines.length})
                    </p>
                    <div className="space-y-2">
                      {result.medicines.map((med, i) => (
                        <div key={i} className="flex items-start gap-2 bg-secondary/50 rounded-lg px-4 py-3">
                          <Pill size={14} className="text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{med.name}</p>
                            {med.dosage && <p className="text-xs text-muted-foreground">{med.dosage}</p>}
                            {med.duration && (
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock size={10} /> {med.duration}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {result.notes && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                      <p className="text-xs font-semibold text-amber-800 mb-1">Notes</p>
                      <p className="text-sm text-amber-700 italic">{result.notes}</p>
                    </div>
                  )}

                  {/* Mark as purchased */}
                  {result.purchaseStatus !== "purchased" && (
                    <button
                      onClick={markPurchased}
                      disabled={marking}
                      className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {marking ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                      Marquer comme achetée
                    </button>
                  )}
                  {result.purchaseStatus === "purchased" && (
                    <div className="w-full px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 size={16} /> Cette ordonnance a déjà été achetée
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
