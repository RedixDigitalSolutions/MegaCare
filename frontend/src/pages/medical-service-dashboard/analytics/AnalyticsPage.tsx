import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Users, ClipboardList, TrendingUp, Banknote } from "lucide-react";

const kpis = [
  { label: "Patients pris en charge", value: "124", sub: "+8 ce mois", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Visites effectuées", value: "342", sub: "+24 ce mois", icon: ClipboardList, color: "text-purple-500", bg: "bg-purple-50" },
  { label: "Taux de satisfaction", value: "91%", sub: "+2% vs mois dernier", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
  { label: "Revenus du mois", value: "24 800 DT", sub: "+12% vs mois dernier", icon: Banknote, color: "text-amber-500", bg: "bg-amber-50" },
];

const teamPerf = [
  { name: "Sofia Cherif", role: "Infirmière", visits: 68, score: 94 },
  { name: "Bilel Amdouni", role: "Aide-soignant", visits: 55, score: 87 },
  { name: "Nadia Boussaid", role: "Kinésithérapeute", visits: 48, score: 91 },
  { name: "Kamel Tlili", role: "Infirmier", visits: 72, score: 89 },
  { name: "Rania Fersi", role: "Infirmière", visits: 60, score: 96 },
];

const pathologies = [
  { label: "Diabète", count: 34, color: "bg-blue-400" },
  { label: "HTA", count: 28, color: "bg-purple-400" },
  { label: "Plaies chroniques", count: 22, color: "bg-green-400" },
  { label: "Insuffisance cardiaque", count: 18, color: "bg-amber-400" },
  { label: "BPCO", count: 14, color: "bg-red-400" },
  { label: "Cancer", count: 8, color: "bg-pink-400" },
];
const maxPath = Math.max(...pathologies.map((p) => p.count));

const monthly = [
  { month: "Novembre", visits: 48, patients: 18, revenue: 19200 },
  { month: "Décembre", visits: 52, patients: 20, revenue: 20800 },
  { month: "Janvier", visits: 60, patients: 22, revenue: 22400 },
  { month: "Février", visits: 58, patients: 21, revenue: 21900 },
  { month: "Mars", visits: 66, patients: 23, revenue: 23600 },
  { month: "Avril", visits: 58, patients: 20, revenue: 24800 },
];
const maxVisits = Math.max(...monthly.map((m) => m.visits));

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Statistiques</h1>
          <p className="text-xs text-muted-foreground">Analyse des performances et de l'activité du service</p>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => { const Icon = k.icon; return (
              <div key={k.label} className="bg-card rounded-xl border border-border p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${k.bg}`}><Icon size={18} className={k.color} /></div>
                </div>
                <p className="text-2xl font-bold text-foreground">{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
                <p className="text-xs text-green-500 font-medium">{k.sub}</p>
              </div>
            ); })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Team performance */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground text-sm">Performance de l'équipe</h2>
              </div>
              <div className="p-4 space-y-3">
                {teamPerf.map((m) => (
                  <div key={m.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-foreground">{m.name}</span>
                        <span className="text-xs text-muted-foreground ml-2">{m.role}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">{m.visits} visites</span>
                        <span className="text-sm font-bold text-foreground">{m.score}%</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${m.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top pathologies */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground text-sm">Principales pathologies</h2>
              </div>
              <div className="p-4 space-y-3">
                {pathologies.map((p) => (
                  <div key={p.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">{p.label}</span>
                      <span className="text-muted-foreground text-xs">{p.count} patients</span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                      <div className={`h-2.5 ${p.color} rounded-full transition-all`} style={{ width: `${Math.round((p.count / maxPath) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly bar chart */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground text-sm">Activité mensuelle — Visites</h2>
            </div>
            <div className="p-5">
              <div className="flex items-end gap-3 h-36">
                {monthly.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-foreground">{m.visits}</span>
                    <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${Math.round((m.visits / maxVisits) * 100)}px` }} />
                    <span className="text-[10px] text-muted-foreground text-center leading-tight">{m.month.slice(0, 3)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground text-sm">Tableau de bord mensuel</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Mois", "Visites", "Patients", "Revenus"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {monthly.map((m) => (
                    <tr key={m.month} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                      <td className="px-5 py-3 font-medium text-foreground">{m.month}</td>
                      <td className="px-5 py-3 text-foreground">{m.visits}</td>
                      <td className="px-5 py-3 text-foreground">{m.patients}</td>
                      <td className="px-5 py-3 font-semibold text-foreground">{m.revenue} DT</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
