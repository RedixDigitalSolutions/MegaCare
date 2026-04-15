import { Link } from "react-router-dom";
import {
  Package,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";

interface PendingOrder {
  id: string;
  customer: string;
  items: number;
  total: number;
  orderDate: string;
  status: string;
}
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
  totalStock: number;
  pendingOrdersCount: number;
  revenue: number;
  lowStockCount: number;
  pendingOrders: PendingOrder[];
  lowStockProducts: LowStockProduct[];
  topSelling: TopSellingItem[];
}

export default function PharmacyDashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "pharmacy") return;
    const token = localStorage.getItem("megacare_token");
    fetch("/api/pharmacy/kpis", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setKpiData(data);
        setLoadingData(false);
      })
      .catch(() => setLoadingData(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
    return null;

  const pharmacyName = user.firstName || "Pharmacie Central";

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
      value: loadingData ? "…" : kpiData?.totalStock.toLocaleString() ?? "0",
      subtitle: "Produits en catalogue",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: ShoppingCart,
      title: "Commandes en attente",
      value: loadingData ? "…" : kpiData?.pendingOrdersCount.toLocaleString() ?? "0",
      subtitle: "À traiter",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: TrendingUp,
      title: "Revenu ce mois",
      value: loadingData ? "…" : `${(kpiData?.revenue ?? 0).toLocaleString()} DT`,
      subtitle: "Commandes complétées",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: AlertCircle,
      title: "Alertes stock faible",
      value: loadingData ? "…" : kpiData?.lowStockCount.toLocaleString() ?? "0",
      subtitle: "Produits sous le seuil",
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  const pendingOrders = kpiData?.pendingOrders ?? [];
  const lowStockProducts = kpiData?.lowStockProducts ?? [];
  const topSelling = kpiData?.topSelling ?? [];
  const maxSold = topSelling.length > 0 ? Math.max(...topSelling.map((p) => p.sold)) : 1;

  const orderStatusCfg: Record<
    string,
    { bg: string; badge: string; text: string }
  > = {
    "En attente": {
      bg: "bg-orange-50 border-orange-200",
      badge: "bg-orange-100 text-orange-700",
      text: "En attente",
    },
    "En préparation": {
      bg: "bg-blue-50 border-blue-200",
      badge: "bg-blue-100 text-blue-700",
      text: "En préparation",
    },
    "Prête pour livraison": {
      bg: "bg-green-50 border-green-200",
      badge: "bg-green-100 text-green-700",
      text: "Prête",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <PharmacyDashboardSidebar pharmacyName={pharmacyName} />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
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
                      to="/pharmacy-dashboard/stock"
                      className="shrink-0 px-2.5 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition"
                    >
                      Gérer
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Orders + Stock Summary */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Pending Orders */}
              <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">
                    Commandes en attente
                  </h3>
                  <Link
                    to="/pharmacy-dashboard/orders"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Voir toutes →
                  </Link>
                </div>
                <div className="space-y-3">
                  {pendingOrders.map((order) => {
                    const cfg =
                      orderStatusCfg[order.status] ??
                      orderStatusCfg["En attente"];
                    return (
                      <div
                        key={order.id}
                        className={`rounded-lg p-4 border ${cfg.bg} transition`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {order.customer}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.id} · {order.items} article
                              {order.items > 1 ? "s" : ""} · {order.orderDate}
                            </p>
                          </div>
                          <p className="font-bold text-primary">
                            {order.total} DT
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-current/10">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge}`}
                          >
                            {cfg.text}
                          </span>
                          <button className="text-xs px-2.5 py-1 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium">
                            Détails
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stock Summary */}
              <div className="bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl border border-primary/20 p-5 space-y-4 flex flex-col justify-between">
                <h3 className="font-bold text-foreground text-lg">
                  État du stock
                </h3>
                <div className="space-y-3">
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">
                      Produits actifs
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {loadingData ? "…" : (kpiData?.totalStock ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">
                      Revenu ce mois
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {loadingData ? "…" : `${(kpiData?.revenue ?? 0).toLocaleString()} DT`}
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground">
                      Alertes actives
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {loadingData ? "…" : (kpiData?.lowStockCount ?? 0)}
                    </p>
                  </div>
                </div>
                <Link
                  to="/pharmacy-dashboard/stock"
                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition text-center block"
                >
                  Gérer le stock →
                </Link>
              </div>
            </div>

            {/* Top 5 Best-selling */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  Top 5 médicaments vendus ce mois
                </h3>
                <Link
                  to="/pharmacy-dashboard/sales"
                  className="text-primary hover:underline text-sm font-medium"
                >
                  Voir les ventes →
                </Link>
              </div>
              <div className="divide-y divide-border">
                {topSelling.map((med) => (
                  <div
                    key={med.rank}
                    className="px-5 py-3 flex items-center gap-4"
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${med.rank === 1
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
                        <p className="text-green-600 font-semibold text-sm shrink-0 ml-2">
                          {med.revenue.toLocaleString()} DT
                        </p>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary/70 rounded-full"
                          style={{
                            width: `${Math.round((med.sold / maxSold) * 100)}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {med.sold} unités vendues
                      </p>
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
