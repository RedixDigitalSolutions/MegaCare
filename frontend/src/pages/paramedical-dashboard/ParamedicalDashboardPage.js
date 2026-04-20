import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { Package, AlertCircle, AlertTriangle, Users, TrendingUp, } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
export default function ParamedicalDashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [kpiData, setKpiData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "paramedical")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== "paramedical")
            return;
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
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Tableau de bord" }), _jsx("p", { className: "text-muted-foreground mt-1 capitalize", children: todayDate })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpiCards.map((card, idx) => {
                                        const Icon = card.icon;
                                        return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5 space-y-3", children: [_jsx("div", { className: `w-11 h-11 rounded-lg ${card.bgColor} flex items-center justify-center`, children: _jsx(Icon, { className: `w-5 h-5 ${card.color}` }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: card.title }), _jsx("p", { className: "text-2xl font-bold text-foreground mt-0.5", children: card.value })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: card.subtitle })] }, idx));
                                    }) }), lowStockProducts.length > 0 && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-5 space-y-3", children: [_jsxs("h3", { className: "font-semibold text-red-800 flex items-center gap-2 text-sm", children: [_jsx(AlertTriangle, { size: 16, className: "text-red-500" }), lowStockProducts.length, " produits en alerte de stock faible"] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2", children: lowStockProducts.map((p, i) => (_jsxs("div", { className: "bg-white rounded-lg border border-red-100 px-4 py-3 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-medium text-foreground text-sm truncate", children: p.name }), _jsxs("p", { className: "text-xs text-red-600 mt-0.5", children: [p.current, " / ", p.minimum, " unit\u00E9s min."] })] }), _jsx(Link, { to: "/paramedical-dashboard/stock", className: "shrink-0 px-2.5 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition", children: "G\u00E9rer" })] }, i))) })] })), _jsx("div", { className: "grid lg:grid-cols-3 gap-6", children: _jsxs("div", { className: "lg:col-span-3 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl border border-primary/20 p-5 space-y-4 flex flex-col justify-between", children: [_jsx("h3", { className: "font-bold text-foreground text-lg", children: "\u00C9tat du stock" }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white/70 rounded-xl p-4", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Produits actifs" }), _jsx("p", { className: "text-2xl font-bold text-primary", children: loadingData ? "…" : (kpiData?.totalProducts ?? 0).toLocaleString() })] }), _jsxs("div", { className: "bg-white/70 rounded-xl p-4", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Stock total" }), _jsxs("p", { className: "text-2xl font-bold text-foreground", children: [loadingData ? "…" : (kpiData?.totalStock ?? 0).toLocaleString(), " unit\u00E9s"] })] }), _jsxs("div", { className: "bg-white/70 rounded-xl p-4", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Alertes actives" }), _jsx("p", { className: "text-2xl font-bold text-red-600", children: loadingData ? "…" : (kpiData?.lowStockCount ?? 0) })] })] }), _jsx(Link, { to: "/paramedical-dashboard/stock", className: "w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition text-center block", children: "G\u00E9rer le stock \u2192" })] }) }), topSelling.length > 0 && (_jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "p-5 border-b border-border flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-foreground", children: "Top 5 produits les plus demand\u00E9s" }), _jsx(Link, { to: "/paramedical-dashboard/stock", className: "text-primary hover:underline text-sm font-medium", children: "Voir le stock \u2192" })] }), _jsx("div", { className: "divide-y divide-border", children: topSelling.map((prod) => (_jsxs("div", { className: "px-5 py-3 flex items-center gap-4", children: [_jsx("span", { className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${prod.rank === 1
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : prod.rank === 2
                                                                ? "bg-gray-100 text-gray-600"
                                                                : prod.rank === 3
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-muted text-muted-foreground"}`, children: prod.rank }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("p", { className: "font-medium text-foreground text-sm truncate", children: prod.name }), _jsxs("p", { className: "text-green-600 font-semibold text-sm shrink-0 ml-2", children: [prod.revenue.toLocaleString(), " DT"] })] }), _jsx("div", { className: "w-full bg-secondary rounded-full h-1.5", children: _jsx("div", { className: "bg-primary h-1.5 rounded-full transition-all", style: {
                                                                        width: `${Math.max(5, (prod.sold / maxSold) * 100)}%`,
                                                                    } }) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [prod.sold, " demandes"] })] })] }, prod.rank))) })] }))] })] })] }) }));
}
