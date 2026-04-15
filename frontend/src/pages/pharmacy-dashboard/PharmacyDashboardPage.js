import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Package, TrendingUp, ShoppingCart, AlertCircle, AlertTriangle, } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
export default function PharmacyDashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [kpiData, setKpiData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== "pharmacy")
            return;
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
    const orderStatusCfg = {
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
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(PharmacyDashboardSidebar, { pharmacyName: pharmacyName }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Tableau de bord" }), _jsx("p", { className: "text-muted-foreground mt-1 capitalize", children: todayDate })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpiCards.map((card, idx) => {
                                        const Icon = card.icon;
                                        return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5 space-y-3", children: [_jsx("div", { className: `w-11 h-11 rounded-lg ${card.bgColor} flex items-center justify-center`, children: _jsx(Icon, { className: `w-5 h-5 ${card.color}` }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: card.title }), _jsx("p", { className: "text-2xl font-bold text-foreground mt-0.5", children: card.value })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: card.subtitle })] }, idx));
                                    }) }), _jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-5 space-y-3", children: [_jsxs("h3", { className: "font-semibold text-red-800 flex items-center gap-2 text-sm", children: [_jsx(AlertTriangle, { size: 16, className: "text-red-500" }), lowStockProducts.length, " produits en alerte de stock faible"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: lowStockProducts.map((p, i) => (_jsxs("div", { className: "bg-white rounded-lg border border-red-100 px-4 py-3 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-medium text-foreground text-sm truncate", children: p.name }), _jsxs("p", { className: "text-xs text-red-600 mt-0.5", children: [p.current, " / ", p.minimum, " unit\u00E9s min."] })] }), _jsx(Link, { to: "/pharmacy-dashboard/stock", className: "shrink-0 px-2.5 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition", children: "G\u00E9rer" })] }, i))) })] }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 bg-card rounded-xl border border-border p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-bold text-foreground", children: "Commandes en attente" }), _jsx(Link, { to: "/pharmacy-dashboard/orders", className: "text-primary hover:underline text-sm font-medium", children: "Voir toutes \u2192" })] }), _jsx("div", { className: "space-y-3", children: pendingOrders.map((order) => {
                                                        const cfg = orderStatusCfg[order.status] ??
                                                            orderStatusCfg["En attente"];
                                                        return (_jsxs("div", { className: `rounded-lg p-4 border ${cfg.bg} transition`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: order.customer }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [order.id, " \u00B7 ", order.items, " article", order.items > 1 ? "s" : "", " \u00B7 ", order.orderDate] })] }), _jsxs("p", { className: "font-bold text-primary", children: [order.total, " DT"] })] }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-current/10", children: [_jsx("span", { className: `text-xs px-2.5 py-1 rounded-full font-medium ${cfg.badge}`, children: cfg.text }), _jsx("button", { className: "text-xs px-2.5 py-1 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium", children: "D\u00E9tails" })] })] }, order.id));
                                                    }) })] }), _jsxs("div", { className: "bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl border border-primary/20 p-5 space-y-4 flex flex-col justify-between", children: [_jsx("h3", { className: "font-bold text-foreground text-lg", children: "\u00C9tat du stock" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white/70 rounded-xl p-4", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Produits actifs" }), _jsx("p", { className: "text-2xl font-bold text-primary", children: loadingData ? "…" : (kpiData?.totalStock ?? 0).toLocaleString() })] }), _jsxs("div", { className: "bg-white/70 rounded-xl p-4", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Revenu ce mois" }), _jsx("p", { className: "text-2xl font-bold text-foreground", children: loadingData ? "…" : `${(kpiData?.revenue ?? 0).toLocaleString()} DT` })] }), _jsxs("div", { className: "bg-white/70 rounded-xl p-4", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Alertes actives" }), _jsx("p", { className: "text-2xl font-bold text-red-600", children: loadingData ? "…" : (kpiData?.lowStockCount ?? 0) })] })] }), _jsx(Link, { to: "/pharmacy-dashboard/stock", className: "w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition text-center block", children: "G\u00E9rer le stock \u2192" })] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "p-5 border-b border-border flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-foreground", children: "Top 5 m\u00E9dicaments vendus ce mois" }), _jsx(Link, { to: "/pharmacy-dashboard/sales", className: "text-primary hover:underline text-sm font-medium", children: "Voir les ventes \u2192" })] }), _jsx("div", { className: "divide-y divide-border", children: topSelling.map((med) => (_jsxs("div", { className: "px-5 py-3 flex items-center gap-4", children: [_jsx("span", { className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${med.rank === 1
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : med.rank === 2
                                                                ? "bg-gray-100 text-gray-600"
                                                                : med.rank === 3
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-muted text-muted-foreground"}`, children: med.rank }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("p", { className: "font-medium text-foreground text-sm truncate", children: med.name }), _jsxs("p", { className: "text-green-600 font-semibold text-sm shrink-0 ml-2", children: [med.revenue.toLocaleString(), " DT"] })] }), _jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-primary/70 rounded-full", style: {
                                                                        width: `${Math.round((med.sold / maxSold) * 100)}%`,
                                                                    } }) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [med.sold, " unit\u00E9s vendues"] })] })] }, med.rank))) })] })] })] })] }) }));
}
