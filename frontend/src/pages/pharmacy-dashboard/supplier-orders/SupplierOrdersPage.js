import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import { Truck, Clock, CheckCircle, Package, ChevronDown, ChevronUp, } from "lucide-react";
const STATUS_CFG = {
    Livré: {
        badge: "bg-green-100 text-green-700",
        border: "border-l-green-500",
        icon: _jsx(CheckCircle, { size: 16, className: "text-green-600" }),
        label: "Livré",
    },
    "En transit": {
        badge: "bg-blue-100 text-blue-700",
        border: "border-l-blue-500",
        icon: _jsx(Truck, { size: 16, className: "text-blue-600" }),
        label: "En transit",
    },
    "En attente": {
        badge: "bg-amber-100 text-amber-700",
        border: "border-l-amber-400",
        icon: _jsx(Clock, { size: 16, className: "text-amber-600" }),
        label: "En attente",
    },
};
export default function PharmacyOrdersPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState("Toutes");
    const [expanded, setExpanded] = useState(null);
    const [orders, setOrders] = useState([]);
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
        fetch("/api/pharmacy/supplier-orders", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
            setOrders(Array.isArray(data) ? data : []);
            setLoadingData(false);
        })
            .catch(() => setLoadingData(false));
    }, [isAuthenticated, user]);
    if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
        return null;
    const filtered = tab === "Toutes" ? orders : orders.filter((o) => o.status === tab);
    const countOf = (s) => s === "Toutes"
        ? orders.length
        : orders.filter((o) => o.status === s).length;
    const totalValue = orders.reduce((s, o) => s + o.total, 0);
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(PharmacyDashboardSidebar, { pharmacyName: user.firstName || "Pharmacie Central" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Commandes Fournisseurs" }), _jsx("p", { className: "text-muted-foreground mt-1", children: loadingData ? "Chargement…" : `${orders.length} commandes · ${totalValue.toLocaleString()} DT total` })] }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: ["Toutes", "Livré", "En transit", "En attente"].map((s) => (_jsxs("div", { onClick: () => setTab(s), className: `bg-card border rounded-xl p-4 text-center cursor-pointer transition hover:shadow-md ${tab === s
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-border"}`, children: [_jsx("p", { className: `text-2xl font-bold ${s === "Livré"
                                                    ? "text-green-600"
                                                    : s === "En transit"
                                                        ? "text-blue-600"
                                                        : s === "En attente"
                                                            ? "text-amber-600"
                                                            : "text-foreground"}`, children: countOf(s) }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s === "Toutes" ? "Total" : s })] }, s))) }), _jsx("div", { className: "flex gap-2 flex-wrap", children: ["Toutes", "Livré", "En transit", "En attente"].map((s) => (_jsxs("button", { onClick: () => setTab(s), className: `px-4 py-1.5 rounded-full text-sm font-medium transition ${tab === s
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-muted/70"}`, children: [s, " (", countOf(s), ")"] }, s))) }), _jsxs("div", { className: "space-y-3", children: [filtered.map((order) => {
                                            const cfg = STATUS_CFG[order.status];
                                            const isOpen = expanded === order.id;
                                            return (_jsxs("div", { className: `bg-card border border-border border-l-4 ${cfg.border} rounded-xl overflow-hidden hover:shadow-md transition`, children: [_jsxs("div", { className: "p-5 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [_jsx("div", { className: "mt-0.5", children: cfg.icon }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-0.5", children: [_jsx("span", { className: "text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded", children: order.ref }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`, children: cfg.label })] }), _jsx("h3", { className: "font-semibold text-foreground", children: order.supplier }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Command\u00E9 le ", order.date, order.expectedDate &&
                                                                                        ` · Livraison prévue le ${order.expectedDate}`] })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 shrink-0", children: [_jsxs("span", { className: "text-lg font-bold text-foreground", children: [order.total, " DT"] }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [order.items.length, " r\u00E9f."] }), _jsxs("button", { onClick: () => setExpanded(isOpen ? null : order.id), className: "flex items-center gap-1 text-xs text-primary hover:underline", children: [isOpen ? (_jsx(ChevronUp, { size: 13 })) : (_jsx(ChevronDown, { size: 13 })), isOpen ? "Masquer" : "Détails"] })] })] }), isOpen && (_jsxs("div", { className: "border-t border-border bg-muted/20 px-5 py-4", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Articles command\u00E9s" }), _jsx("div", { className: "space-y-1.5", children: order.items.map((item, i) => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "flex items-center gap-2 text-foreground", children: [_jsx(Package, { size: 13, className: "text-muted-foreground" }), item.name] }), _jsxs("span", { className: "text-muted-foreground", children: [item.qty, " ", item.unit] })] }, i))) })] }))] }, order.id));
                                        }), filtered.length === 0 && (_jsx("p", { className: "text-center py-16 text-muted-foreground", children: "Aucune commande pour ce statut." }))] })] })] })] }) }));
}
