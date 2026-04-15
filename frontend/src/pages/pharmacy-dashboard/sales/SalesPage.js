import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import { TrendingUp, TrendingDown, ShoppingCart, Users, DollarSign, } from "lucide-react";
const DEFAULT_SALE_DATA = {
    revenue: 0,
    orders: 0,
    customers: 0,
    avgOrder: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    avgGrowth: 0,
    chartBars: [
        { label: "Lun", value: 0 },
        { label: "Mar", value: 0 },
        { label: "Mer", value: 0 },
        { label: "Jeu", value: 0 },
        { label: "Ven", value: 0 },
        { label: "Sam", value: 0 },
        { label: "Dim", value: 0 },
    ],
    topMedicines: [],
};
function GrowthBadge({ value }) {
    return (_jsxs("span", { className: `flex items-center gap-0.5 text-xs font-semibold ${value >= 0 ? "text-green-600" : "text-red-500"}`, children: [value >= 0 ? _jsx(TrendingUp, { size: 11 }) : _jsx(TrendingDown, { size: 11 }), value >= 0 ? "+" : "", value, "%"] }));
}
export default function PharmacySalesPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [period, setPeriod] = useState("Ce mois");
    const [salesData, setSalesData] = useState(DEFAULT_SALE_DATA);
    const [loadingData, setLoadingData] = useState(true);
    const fetchedPeriods = useState(() => new Map())[0];
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== "pharmacy")
            return;
        if (fetchedPeriods.has(period)) {
            setSalesData(fetchedPeriods.get(period));
            setLoadingData(false);
            return;
        }
        setLoadingData(true);
        const token = localStorage.getItem("megacare_token");
        fetch(`/api/pharmacy/sales?period=${encodeURIComponent(period)}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
            fetchedPeriods.set(period, data);
            setSalesData(data);
            setLoadingData(false);
        })
            .catch(() => setLoadingData(false));
    }, [period, isAuthenticated, user]);
    if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
        return null;
    const d = salesData;
    const maxBar = Math.max(...d.chartBars.map((b) => b.value), 1);
    const maxQty = Math.max(...d.topMedicines.map((m) => m.qty), 1);
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(PharmacyDashboardSidebar, { pharmacyName: user.firstName || "Pharmacie Central" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Ventes" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Analyse des ventes et statistiques" })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "flex gap-2 flex-wrap", children: ["Ce mois", "3 mois", "6 mois", "Cette année"].map((p) => (_jsx("button", { onClick: () => setPeriod(p), className: `px-4 py-1.5 rounded-full text-sm font-medium transition ${period === p
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-muted/70"}`, children: p }, p))) }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
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
                                        return (_jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-3", children: [_jsx("div", { className: `w-11 h-11 rounded-lg ${card.bg} flex items-center justify-center`, children: _jsx(Icon, { size: 18, className: card.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: card.label }), _jsx("p", { className: "text-2xl font-bold text-foreground mt-0.5", children: card.value })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(GrowthBadge, { value: card.growth }), _jsx("span", { className: "text-xs text-muted-foreground", children: "vs p\u00E9riode pr\u00E9c." })] })] }, i));
                                    }) }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [_jsx("h3", { className: "font-semibold text-foreground mb-4", children: "\u00C9volution du revenu (DT)" }), _jsx("div", { className: "flex items-end gap-2 h-36", children: d.chartBars.map((bar, i) => (_jsxs("div", { className: "flex-1 flex flex-col items-center gap-1", children: [bar.value > 0 ? (_jsxs("span", { className: "text-xs text-muted-foreground", children: [(bar.value / 1000).toFixed(1), "k"] })) : (_jsx("span", { className: "text-xs text-transparent", children: "0" })), _jsx("div", { className: `w-full rounded-t-md transition-all ${bar.value > 0 ? "bg-primary/80" : "bg-muted/30"}`, style: {
                                                            height: `${Math.round((bar.value / maxBar) * 96)}px`,
                                                            minHeight: bar.value > 0 ? "4px" : "0",
                                                        } }), _jsx("span", { className: "text-xs text-muted-foreground", children: bar.label })] }, i))) })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [_jsxs("div", { className: "p-5 border-b border-border flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-foreground", children: "Top 5 m\u00E9dicaments vendus" }), _jsx("span", { className: "text-xs text-muted-foreground", children: period })] }), _jsx("div", { className: "divide-y divide-border", children: d.topMedicines.map((med) => (_jsxs("div", { className: "px-5 py-4 flex items-center gap-4", children: [_jsx("span", { className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${med.rank === 1
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : med.rank === 2
                                                                ? "bg-gray-100 text-gray-600"
                                                                : med.rank === 3
                                                                    ? "bg-orange-100 text-orange-700"
                                                                    : "bg-muted text-muted-foreground"}`, children: med.rank }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("p", { className: "font-medium text-foreground text-sm truncate", children: med.name }), _jsx(GrowthBadge, { value: med.growth })] }), _jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden mb-1", children: _jsx("div", { className: "h-full bg-primary/70 rounded-full", style: {
                                                                        width: `${Math.round((med.qty / maxQty) * 100)}%`,
                                                                    } }) }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: [med.qty, " unit\u00E9s vendues"] }), _jsxs("span", { className: "text-green-600 font-semibold", children: [med.revenue.toLocaleString(), " DT"] })] })] })] }, med.rank))) })] })] })] })] }) }));
}
