import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Video,
  MapPin,
  CheckCircle,
  Clock,
} from "lucide-react";

type Period = "Ce mois" | "3 mois" | "6 mois" | "Cette année";

interface Transaction {
  id: number;
  patient: string;
  date: string;
  amount: number;
  type: "Vidéo" | "Cabinet";
  status: "Payée" | "En attente";
}

const DATA: Record<
  Period,
  {
    revenue: number;
    consultations: number;
    avgRevenue: number;
    growth: number;
    video: number;
    cabinet: number;
    chartBars: { label: string; value: number }[];
    transactions: Transaction[];
  }
> = {
  "Ce mois": {
    revenue: 2450,
    consultations: 28,
    avgRevenue: 87.5,
    growth: 12,
    video: 16,
    cabinet: 12,
    chartBars: [
      { label: "Lun", value: 320 },
      { label: "Mar", value: 480 },
      { label: "Mer", value: 210 },
      { label: "Jeu", value: 560 },
      { label: "Ven", value: 390 },
      { label: "Sam", value: 150 },
      { label: "Dim", value: 0 },
    ],
    transactions: [
      {
        id: 1,
        patient: "Fatima Benali",
        date: "2026-04-03",
        amount: 80,
        type: "Vidéo",
        status: "Payée",
      },
      {
        id: 2,
        patient: "Mohamed Karoui",
        date: "2026-04-02",
        amount: 120,
        type: "Cabinet",
        status: "Payée",
      },
      {
        id: 3,
        patient: "Aisha Hamdi",
        date: "2026-04-01",
        amount: 80,
        type: "Vidéo",
        status: "Payée",
      },
      {
        id: 4,
        patient: "Youssef Tlili",
        date: "2026-04-01",
        amount: 120,
        type: "Cabinet",
        status: "En attente",
      },
      {
        id: 5,
        patient: "Layla Meddeb",
        date: "2026-03-30",
        amount: 80,
        type: "Vidéo",
        status: "Payée",
      },
    ],
  },
  "3 mois": {
    revenue: 6820,
    consultations: 79,
    avgRevenue: 86.3,
    growth: 8,
    video: 45,
    cabinet: 34,
    chartBars: [
      { label: "Jan", value: 1900 },
      { label: "Fév", value: 2270 },
      { label: "Mar", value: 2450 },
      { label: "", value: 0 },
      { label: "", value: 0 },
      { label: "", value: 0 },
      { label: "", value: 0 },
    ],
    transactions: [
      {
        id: 6,
        patient: "Nadia Boughanmi",
        date: "2026-03-28",
        amount: 80,
        type: "Vidéo",
        status: "Payée",
      },
      {
        id: 7,
        patient: "Salim Drissi",
        date: "2026-03-15",
        amount: 100,
        type: "Cabinet",
        status: "Payée",
      },
      {
        id: 8,
        patient: "Fatima Benali",
        date: "2026-02-10",
        amount: 80,
        type: "Vidéo",
        status: "Payée",
      },
    ],
  },
  "6 mois": {
    revenue: 13200,
    consultations: 152,
    avgRevenue: 86.8,
    growth: 15,
    video: 88,
    cabinet: 64,
    chartBars: [
      { label: "Oct", value: 1800 },
      { label: "Nov", value: 2100 },
      { label: "Déc", value: 1950 },
      { label: "Jan", value: 2300 },
      { label: "Fév", value: 2600 },
      { label: "Mar", value: 2450 },
      { label: "", value: 0 },
    ],
    transactions: [
      {
        id: 9,
        patient: "Mohamed Karoui",
        date: "2025-11-18",
        amount: 120,
        type: "Cabinet",
        status: "Payée",
      },
    ],
  },
  "Cette année": {
    revenue: 24800,
    consultations: 286,
    avgRevenue: 86.7,
    growth: 21,
    video: 165,
    cabinet: 121,
    chartBars: [
      { label: "Jan", value: 1900 },
      { label: "Fév", value: 2270 },
      { label: "Mar", value: 2450 },
      { label: "Avr", value: 2100 },
      { label: "Mai", value: 0 },
      { label: "Jun", value: 0 },
      { label: "Jul", value: 0 },
    ],
    transactions: [
      {
        id: 10,
        patient: "Aisha Hamdi",
        date: "2026-01-04",
        amount: 80,
        type: "Vidéo",
        status: "Payée",
      },
    ],
  },
};

export default function DoctorRevenuePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("Ce mois");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const d = DATA[period];
  const videoPct = Math.round((d.video / d.consultations) * 100) || 0;
  const cabinetPct = 100 - videoPct;
  const maxBar = Math.max(...d.chartBars.map((b) => b.value), 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">Revenus</h1>
            <p className="text-muted-foreground mt-1">
              Suivi financier de votre activité
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Period Selector */}
            <div className="flex gap-2 flex-wrap">
              {(["Ce mois", "3 mois", "6 mois", "Cette année"] as Period[]).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                      period === p
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Revenus ({period})
                  </p>
                  <DollarSign size={18} className="text-primary/60" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {d.revenue.toLocaleString()} DT
                </p>
                <p className="text-xs text-green-600 flex items-center gap-0.5 mt-1">
                  <TrendingUp size={11} /> +{d.growth}% vs période préc.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Consultations</p>
                  <CheckCircle size={18} className="text-blue-400" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {d.consultations}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {d.video} vidéo · {d.cabinet} cabinet
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">
                    Moy. / consultation
                  </p>
                  <TrendingUp size={18} className="text-green-500" />
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {d.avgRevenue} DT
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Tarif moyen pondéré
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">Croissance</p>
                  {d.growth >= 0 ? (
                    <TrendingUp size={18} className="text-green-500" />
                  ) : (
                    <TrendingDown size={18} className="text-red-500" />
                  )}
                </div>
                <p
                  className={`text-2xl font-bold ${d.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {d.growth >= 0 ? "+" : ""}
                  {d.growth}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Vs période précédente
                </p>
              </div>
            </div>

            {/* Chart + Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Bar Chart */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">
                  Évolution des revenus (DT)
                </h3>
                <div className="flex items-end gap-2 h-36">
                  {d.chartBars.map((bar, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      {bar.value > 0 ? (
                        <span className="text-xs text-muted-foreground">
                          {bar.value}
                        </span>
                      ) : (
                        <span className="text-xs text-transparent">0</span>
                      )}
                      <div
                        className={`w-full rounded-t-md transition-all ${
                          bar.value > 0 ? "bg-primary/80" : "bg-muted/30"
                        }`}
                        style={{
                          height: `${Math.round((bar.value / maxBar) * 96)}px`,
                          minHeight: bar.value > 0 ? "4px" : "0",
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        {bar.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
                <h3 className="font-semibold text-foreground mb-4">
                  Répartition
                </h3>
                <div className="space-y-4">
                  {/* Video */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <Video size={14} className="text-blue-500" />
                        Vidéo
                      </span>
                      <span className="font-medium text-foreground">
                        {d.video} ({videoPct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${videoPct}%` }}
                      />
                    </div>
                  </div>
                  {/* Cabinet */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <MapPin size={14} className="text-green-500" />
                        Cabinet
                      </span>
                      <span className="font-medium text-foreground">
                        {d.cabinet} ({cabinetPct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${cabinetPct}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-muted/30 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">
                    Revenu Vidéo estimé
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {Math.round(d.video * 80)} DT
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Revenu Cabinet estimé
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {Math.round(d.cabinet * 100)} DT
                  </p>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border">
                <h3 className="font-semibold text-foreground">
                  Transactions récentes
                </h3>
              </div>
              <div className="divide-y divide-border">
                {d.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between px-5 py-4 hover:bg-muted/20 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          tx.type === "Vidéo"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {tx.type === "Vidéo" ? (
                          <Video size={16} />
                        ) : (
                          <MapPin size={16} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {tx.patient}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.type} · {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          tx.status === "Payée"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {tx.status === "Payée" ? (
                          <CheckCircle size={11} />
                        ) : (
                          <Clock size={11} />
                        )}
                        {tx.status}
                      </span>
                      <span className="font-bold text-foreground text-sm min-w-[60px] text-right">
                        {tx.amount} DT
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
