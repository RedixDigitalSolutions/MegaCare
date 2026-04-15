import { useState, useEffect } from "react";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import {
  Search,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  TrendingUp,
} from "lucide-react";

type ResultStatus = "Normal" | "Élevé" | "Critique";

interface LabResult {
  id: string;
  patient: string;
  testType: string;
  value: string;
  unit: string;
  reference: string;
  status: ResultStatus;
  doctor: string;
  date: string;
}



const statusConfig: Record<
  ResultStatus,
  { bg: string; text: string; border: string; icon: typeof CheckCircle2 }
> = {
  Normal: {
    bg: "bg-green-100",
    text: "text-green-700",
    border: "border-green-200",
    icon: CheckCircle2,
  },
  Élevé: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: AlertTriangle,
  },
  Critique: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    icon: AlertTriangle,
  },
};

export default function LabResultsPage() {
  const [results, setResults] = useState<LabResult[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("megacare_token");
    fetch("/api/lab/results", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json: any) => setResults(Array.isArray(json) ? json : (json.data ?? [])))
      .catch(() => { });
  }, []);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | ResultStatus>("all");

  const filtered = results.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.patient.toLowerCase().includes(q) ||
      r.testType.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const kpis = [
    {
      label: "Résultats totaux",
      value: results.length,
      color: "text-indigo-500",
      bg: "bg-indigo-50",
      icon: FileText,
    },
    {
      label: "Normaux",
      value: results.filter((r) => r.status === "Normal").length,
      color: "text-green-500",
      bg: "bg-green-50",
      icon: CheckCircle2,
    },
    {
      label: "Élevés",
      value: results.filter((r) => r.status === "Élevé").length,
      color: "text-amber-500",
      bg: "bg-amber-50",
      icon: TrendingUp,
    },
    {
      label: "Critiques",
      value: results.filter((r) => r.status === "Critique").length,
      color: "text-red-500",
      bg: "bg-red-50",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <LabDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground">
            Résultats d'analyses
          </h1>
          <p className="text-xs text-muted-foreground">
            Consultation et partage des résultats de laboratoire
          </p>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div
                  key={k.label}
                  className="bg-card rounded-xl border border-border p-4 flex items-center gap-3"
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${k.bg}`}
                  >
                    <Icon size={18} className={k.color} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-foreground">
                      {k.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                  </div>
                </div>
              );
            })}
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
                placeholder="Rechercher par patient ou type d'analyse…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "Normal", "Élevé", "Critique"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
                >
                  {s === "all" ? "Tous" : s}
                </button>
              ))}
            </div>
          </div>

          {/* Critical alert */}
          {filtered.some((r) => r.status === "Critique") && (
            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertTriangle size={16} />
              <span className="text-sm font-medium">
                Des résultats critiques nécessitent une attention immédiate.
              </span>
            </div>
          )}

          {/* Results list */}
          <div className="space-y-3">
            {filtered.map((r) => {
              const cfg = statusConfig[r.status];
              const StatusIcon = cfg.icon;
              return (
                <div
                  key={r.id}
                  className={`bg-card rounded-xl border-2 ${cfg.border} p-5`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">
                            {r.patient}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.doctor} · {r.date}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}
                        >
                          <StatusIcon size={12} />
                          {r.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Type d'analyse
                          </p>
                          <p className="text-sm font-medium text-foreground mt-0.5">
                            {r.testType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Résultat
                          </p>
                          <p className={`text-sm font-bold mt-0.5 ${cfg.text}`}>
                            {r.value}{" "}
                            <span className="font-normal text-muted-foreground">
                              {r.unit}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Référence
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {r.reference}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Date</p>
                          <p className="text-sm text-foreground mt-0.5">
                            {r.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 mt-1 border-t border-border">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-xs font-medium">
                      <Download size={13} /> Télécharger PDF
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-border text-foreground rounded-lg hover:bg-muted transition text-xs font-medium">
                      <Share2 size={13} /> Partager au médecin
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 bg-card rounded-xl border border-border">
              <FileText
                size={36}
                className="mx-auto mb-2 text-muted-foreground/30"
              />
              <p className="text-muted-foreground">Aucun résultat trouvé</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
