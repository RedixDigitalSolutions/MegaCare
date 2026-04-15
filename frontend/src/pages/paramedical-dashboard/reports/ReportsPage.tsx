import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  Download,
  FileText,
  CalendarDays,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  History,
} from "lucide-react";

type ReportType = "daily" | "weekly";
type ViewMode = "daily" | "weekly";

interface Report {
  id: string;
  date: string;
  type: ReportType;
  visits: number;
  hours: string;
  patientsNote: string;
}

interface HistoryEntry {
  id: string;
  date: string;
  patient: string;
  care: string;
  duration: string;
  practitioner: string;
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

const REPORTS: Report[] = [];

const HISTORY: HistoryEntry[] = [];

const fmtDate = (d: string) => {
  if (d.includes("–")) return d;
  const dt = new Date(d);
  return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
};

const handlePdfDownload = (r: Report) => {
  const lines = [
    `RAPPORT ${r.type === "daily" ? "JOURNALIER" : "HEBDOMADAIRE"}`,
    `Période : ${fmtDate(r.date)}`,
    `Visites : ${r.visits}`,
    `Heures : ${r.hours}`,
    `Patients : ${r.patientsNote}`,
    ``,
    `Généré par MegaCare – ${new Date().toLocaleDateString("fr-FR")}`,
  ].join("\n");
  const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `rapport-${r.date}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>(REPORTS);
  const [history, setHistory] = useState<HistoryEntry[]>(HISTORY);
  const [view, setView] = useState<ViewMode>("daily");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [histPage, setHistPage] = useState(0);
  const PAGE_SIZE = 5;

  useEffect(() => {
    fetch("/api/paramedical/reports", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => {
        if (d?.reports) setReports(d.reports);
        if (d?.history) setHistory(d.history);
      })
      .catch(() => { });
  }, []);

  const filtered = reports.filter((r) => r.type === view);
  const histSlice = history.slice(histPage * PAGE_SIZE, (histPage + 1) * PAGE_SIZE);
  const totalHistPages = Math.ceil(history.length / PAGE_SIZE);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  // Weekly KPIs
  const weeklyReport = reports.find((r) => r.type === "weekly");
  const kpis = [
    { label: "Visites aujourd'hui", value: "6", icon: CheckCircle2, color: "text-green-600" },
    { label: "Heures cette semaine", value: weeklyReport?.hours ?? "—", icon: Clock, color: "text-blue-600" },
    { label: "Visites cette semaine", value: String(weeklyReport?.visits ?? "—"), icon: CalendarDays, color: "text-primary" },
    { label: "Patients actifs", value: "12", icon: Users, color: "text-violet-600" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Rapports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Résumés de soins et historique</p>
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0`}>
                    <Icon size={18} className={k.color} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{k.value}</p>
                    <p className="text-xs text-muted-foreground">{k.label}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Reports section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <FileText size={16} />
                Rapports de soins
              </h2>
              {/* Toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden text-sm">
                {(["daily", "weekly"] as ViewMode[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-4 py-1.5 font-medium transition ${view === v ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {v === "daily" ? "Journaliers" : "Hebdomadaires"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              {filtered.map((r) => {
                const isOpen = expandedId === r.id;
                return (
                  <div key={r.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggle(r.id)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition text-left"
                    >
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{fmtDate(r.date)}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarDays size={10} />{r.visits} visites</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{r.hours}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePdfDownload(r); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-primary hover:border-primary transition"
                        title="Télécharger"
                      >
                        <Download size={12} />
                        PDF
                      </button>
                      <div className="text-muted-foreground">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-0 border-t border-border bg-muted/20">
                        <div className="grid grid-cols-3 gap-4 py-3 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Visites</p>
                            <p className="font-semibold text-foreground">{r.visits}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Heures</p>
                            <p className="font-semibold text-foreground">{r.hours}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Type</p>
                            <p className="font-semibold text-foreground capitalize">{r.type === "daily" ? "Journalier" : "Hebdomadaire"}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Patients</p>
                          <p className="text-sm text-foreground">{r.patientsNote}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Care history log */}
          <div className="space-y-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <History size={16} />
              Historique des soins
            </h2>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Date & heure</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Patient</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Soin</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {histSlice.map((h) => (
                    <tr key={h.id} className="hover:bg-muted/20 transition">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{h.date}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{h.patient}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{h.care}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{h.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {totalHistPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10 text-sm">
                  <button
                    onClick={() => setHistPage((p) => Math.max(0, p - 1))}
                    disabled={histPage === 0}
                    className="px-3 py-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Précédent
                  </button>
                  <span className="text-muted-foreground text-xs">Page {histPage + 1} / {totalHistPages}</span>
                  <button
                    onClick={() => setHistPage((p) => Math.min(totalHistPages - 1, p + 1))}
                    disabled={histPage === totalHistPages - 1}
                    className="px-3 py-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
