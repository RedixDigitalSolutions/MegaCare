import { Link } from "react-router-dom";
import {
  Package,
  AlertCircle,
  AlertTriangle,
  Users,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";

interface LowStockProduct {
  name: string;
  current: number;
  minimum: number;
}
interface TopSellingItem {
  rank: number;
  name: string;
  sold: number;
  revenue: number;
}
interface KpiData {
  totalPatients: number;
  consultationsToday: number;
  totalStock: number;
  totalProducts: number;
  lowStockCount: number;
  lowStockProducts: LowStockProduct[];
  topSelling: TopSellingItem[];
}

export default function ParamedicalDashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "paramedical")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "paramedical") return;
    const token = localStorage.getItem("megacare_token");
    fetch("/api/paramedical/kpis", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setKpiData(data);
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user || user.role !== "paramedical")
    return null;

  const todayDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const kpiCards = [
    {
      icon: Package,
      title: "Stock Total",
      value: loadingData ? "…" : (kpiData?.totalStock ?? 0).toLocaleString(),
      subtitle: "Produits en catalogue",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      title: "Produits actifs",
      value: loadingData ? "…" : (kpiData?.totalProducts ?? 0).toLocaleString(),
      subtitle: "En catalogue",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: Users,
      title: "Patients suivis",
      value: loadingData ? "…" : (kpiData?.totalPatients ?? 0).toLocaleString(),
      subtitle: "Suivi actif",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: AlertCircle,
      title: "Alertes stock faible",
      value: loadingData ? "…" : (kpiData?.lowStockCount ?? 0).toLocaleString(),
      subtitle: "Produits sous le seuil",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  const lowStockProducts = kpiData?.lowStockProducts ?? [];
  const topSelling = kpiData?.topSelling ?? [];
  const maxSold = topSelling.length > 0 ? Math.max(...topSelling.map((p) => p.sold)) : 1;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <ParamedicalDashboardSidebar />

        <main className="flex-1 overflow-auto">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">
              Tableau de bord
            </h1>
            <p className="text-muted-foreground mt-1 capitalize">{todayDate}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-card rounded-xl border border-border p-5 space-y-3"
                  >
                    <div
                      className={`w-11 h-11 rounded-lg ${card.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground mt-0.5">
                        {card.value}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Low Stock Alert Panel */}
            {lowStockProducts.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-5 space-y-3">
                <h3 className="font-semibold text-red-800 flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} className="text-red-500" />
                  {lowStockProducts.length} produits en alerte de stock faible
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {lowStockProducts.map((p, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg border border-red-100 px-4 py-3 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-red-600 mt-0.5">
                          {p.current} / {p.minimum} unités min.
                        </p>
                      </div>
                      <Link
                        to="/paramedical-dashboard/stock"
                        className="shrink-0 px-2.5 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition"
                      >
                        Gérer
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Summary */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl border border-primary/20 p-5 space-y-4 flex flex-col justify-between">
                <h3 className="font-bold text-foreground text-lg">
                  État du stock
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">Produits actifs</p>
                    <p className="text-2xl font-bold text-primary">
                      {loadingData ? "…" : (kpiData?.totalProducts ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">Stock total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {loadingData ? "…" : (kpiData?.totalStock ?? 0).toLocaleString()} unités
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">Alertes actives</p>
                    <p className="text-2xl font-bold text-red-600">
                      {loadingData ? "…" : (kpiData?.lowStockCount ?? 0)}
                    </p>
                  </div>
                </div>
                <Link
                  to="/paramedical-dashboard/stock"
                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition text-center block"
                >
                  Gérer le stock →
                </Link>
              </div>
            </div>

            {/* Top 5 Best-selling Products */}
            {topSelling.length > 0 && (
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    Top 5 produits les plus demandés
                  </h3>
                  <Link
                    to="/paramedical-dashboard/stock"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Voir le stock →
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {topSelling.map((prod) => (
                    <div
                      key={prod.rank}
                      className="px-5 py-3 flex items-center gap-4"
                    >
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          prod.rank === 1
                            ? "bg-yellow-100 text-yellow-700"
                            : prod.rank === 2
                              ? "bg-gray-100 text-gray-600"
                              : prod.rank === 3
                                ? "bg-orange-100 text-orange-700"
                                : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {prod.rank}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground text-sm truncate">
                            {prod.name}
                          </p>
                          <p className="text-green-600 font-semibold text-sm shrink-0 ml-2">
                            {prod.revenue.toLocaleString()} DT
                          </p>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-1.5">
                          <div
                            className="bg-primary h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.max(5, (prod.sold / maxSold) * 100)}%`,
                            }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {prod.sold} demandes
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
