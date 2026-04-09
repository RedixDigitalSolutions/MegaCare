import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";

type Period = "Ce mois" | "3 mois" | "6 mois" | "Cette année";

interface SaleData {
  revenue: number;
  orders: number;
  customers: number;
  avgOrder: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  avgGrowth: number;
  chartBars: { label: string; value: number }[];
  topMedicines: {
    rank: number;
    name: string;
    qty: number;
    revenue: number;
    growth: number;
  }[];
}

const DATA: Record<Period, SaleData> = {
  "Ce mois": {
    revenue: 12450,
    orders: 142,
    customers: 324,
    avgOrder: 87.7,
    revenueGrowth: 18,
    ordersGrowth: 12,
    customersGrowth: 14,
    avgGrowth: 5,
    chartBars: [
      { label: "Lun", value: 1820 },
      { label: "Mar", value: 2340 },
      { label: "Mer", value: 1560 },
      { label: "Jeu", value: 2890 },
      { label: "Ven", value: 2100 },
      { label: "Sam", value: 1740 },
      { label: "Dim", value: 0 },
    ],
    topMedicines: [
      {
        rank: 1,
        name: "Paracétamol 500mg",
        qty: 342,
        revenue: 2568,
        growth: 22,
      },
      {
        rank: 2,
        name: "Vitamine D3 1000UI",
        qty: 256,
        revenue: 3840,
        growth: 18,
      },
      { rank: 3, name: "Oméga-3 1000mg", qty: 189, revenue: 4725, growth: 11 },
      { rank: 4, name: "Doliprane 1000mg", qty: 178, revenue: 1424, growth: 7 },
      {
        rank: 5,
        name: "Vitamine C 1000mg",
        qty: 203,
        revenue: 1218,
        growth: -3,
      },
    ],
  },
  "3 mois": {
    revenue: 34800,
    orders: 412,
    customers: 890,
    avgOrder: 84.5,
    revenueGrowth: 15,
    ordersGrowth: 9,
    customersGrowth: 20,
    avgGrowth: -2,
    chartBars: [
      { label: "Fév", value: 10200 },
      { label: "Mar", value: 12150 },
      { label: "Avr", value: 12450 },
      { label: "", value: 0 },
      { label: "", value: 0 },
      { label: "", value: 0 },
      { label: "", value: 0 },
    ],
    topMedicines: [
      {
        rank: 1,
        name: "Paracétamol 500mg",
        qty: 980,
        revenue: 7350,
        growth: 16,
      },
      {
        rank: 2,
        name: "Vitamine D3 1000UI",
        qty: 720,
        revenue: 10800,
        growth: 24,
      },
      { rank: 3, name: "Doliprane 1000mg", qty: 560, revenue: 4480, growth: 8 },
      { rank: 4, name: "Oméga-3 1000mg", qty: 540, revenue: 13500, growth: 12 },
      {
        rank: 5,
        name: "Amoxicilline 500mg",
        qty: 490,
        revenue: 3920,
        growth: -5,
      },
    ],
  },
  "6 mois": {
    revenue: 71200,
    orders: 850,
    customers: 1640,
    avgOrder: 83.8,
    revenueGrowth: 21,
    ordersGrowth: 17,
    customersGrowth: 28,
    avgGrowth: 3,
    chartBars: [
      { label: "Nov", value: 9800 },
      { label: "Déc", value: 11200 },
      { label: "Jan", value: 10500 },
      { label: "Fév", value: 10200 },
      { label: "Mar", value: 12150 },
      { label: "Avr", value: 12450 },
      { label: "", value: 0 },
    ],
    topMedicines: [
      {
        rank: 1,
        name: "Paracétamol 500mg",
        qty: 1980,
        revenue: 14850,
        growth: 19,
      },
      {
        rank: 2,
        name: "Vitamine D3 1000UI",
        qty: 1450,
        revenue: 21750,
        growth: 26,
      },
      {
        rank: 3,
        name: "Oméga-3 1000mg",
        qty: 1120,
        revenue: 28000,
        growth: 14,
      },
      {
        rank: 4,
        name: "Doliprane 1000mg",
        qty: 1050,
        revenue: 8400,
        growth: 10,
      },
      { rank: 5, name: "Magnésium B6", qty: 890, revenue: 5340, growth: 7 },
    ],
  },
  "Cette année": {
    revenue: 124800,
    orders: 1482,
    customers: 2890,
    avgOrder: 84.2,
    revenueGrowth: 31,
    ordersGrowth: 24,
    customersGrowth: 38,
    avgGrowth: 6,
    chartBars: [
      { label: "Jan", value: 9800 },
      { label: "Fév", value: 10200 },
      { label: "Mar", value: 12150 },
      { label: "Avr", value: 12450 },
      { label: "Mai", value: 0 },
      { label: "Jun", value: 0 },
      { label: "Jul", value: 0 },
    ],
    topMedicines: [
      {
        rank: 1,
        name: "Paracétamol 500mg",
        qty: 3420,
        revenue: 25650,
        growth: 28,
      },
      {
        rank: 2,
        name: "Vitamine D3 1000UI",
        qty: 2560,
        revenue: 38400,
        growth: 32,
      },
      {
        rank: 3,
        name: "Oméga-3 1000mg",
        qty: 1890,
        revenue: 47250,
        growth: 19,
      },
      {
        rank: 4,
        name: "Doliprane 1000mg",
        qty: 1780,
        revenue: 14240,
        growth: 15,
      },
      { rank: 5, name: "Magnésium B6", qty: 1560, revenue: 9360, growth: 11 },
    ],
  },
};

function GrowthBadge({ value }: { value: number }) {
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-semibold ${value >= 0 ? "text-green-600" : "text-red-500"}`}
    >
      {value >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {value >= 0 ? "+" : ""}
      {value}%
    </span>
  );
}

export default function PharmacySalesPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>("Ce mois");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
    return null;

  const d = DATA[period];
  const maxBar = Math.max(...d.chartBars.map((b) => b.value), 1);
  const maxQty = Math.max(...d.topMedicines.map((m) => m.qty), 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <PharmacyDashboardSidebar
          pharmacyName={user.firstName || "Pharmacie Central"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">Ventes</h1>
            <p className="text-muted-foreground mt-1">
              Analyse des ventes et statistiques
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
              {[
                {
                  label: "Revenu",
                  value: `${d.revenue.toLocaleString()} DT`,
                  growth: d.revenueGrowth,
                  icon: DollarSign,
                  color: "text-green-500",
                  bg: "bg-green-50",
                },
                {
                  label: "Commandes",
                  value: d.orders,
                  growth: d.ordersGrowth,
                  icon: ShoppingCart,
                  color: "text-blue-500",
                  bg: "bg-blue-50",
                },
                {
                  label: "Clients",
                  value: d.customers,
                  growth: d.customersGrowth,
                  icon: Users,
                  color: "text-purple-500",
                  bg: "bg-purple-50",
                },
                {
                  label: "Panier moyen",
                  value: `${d.avgOrder} DT`,
                  growth: d.avgGrowth,
                  icon: TrendingUp,
                  color: "text-orange-500",
                  bg: "bg-orange-50",
                },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-5 space-y-3"
                  >
                    <div
                      className={`w-11 h-11 rounded-lg ${card.bg} flex items-center justify-center`}
                    >
                      <Icon size={18} className={card.color} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {card.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-0.5">
                        {card.value}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <GrowthBadge value={card.growth} />
                      <span className="text-xs text-muted-foreground">
                        vs période préc.
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bar Chart */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold text-foreground mb-4">
                Évolution du revenu (DT)
              </h3>
              <div className="flex items-end gap-2 h-36">
                {d.chartBars.map((bar, i) => (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    {bar.value > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        {(bar.value / 1000).toFixed(1)}k
                      </span>
                    ) : (
                      <span className="text-xs text-transparent">0</span>
                    )}
                    <div
                      className={`w-full rounded-t-md transition-all ${bar.value > 0 ? "bg-primary/80" : "bg-muted/30"}`}
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

            {/* Top 5 Medicines Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Top 5 médicaments vendus
                </h3>
                <span className="text-xs text-muted-foreground">{period}</span>
              </div>
              <div className="divide-y divide-border">
                {d.topMedicines.map((med) => (
                  <div
                    key={med.rank}
                    className="px-5 py-4 flex items-center gap-4"
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        med.rank === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : med.rank === 2
                            ? "bg-gray-100 text-gray-600"
                            : med.rank === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {med.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-foreground text-sm truncate">
                          {med.name}
                        </p>
                        <GrowthBadge value={med.growth} />
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full bg-primary/70 rounded-full"
                          style={{
                            width: `${Math.round((med.qty / maxQty) * 100)}%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{med.qty} unités vendues</span>
                        <span className="text-green-600 font-semibold">
                          {med.revenue.toLocaleString()} DT
                        </span>
                      </div>
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
