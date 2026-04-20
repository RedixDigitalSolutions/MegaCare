import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Package, Clock, CheckCircle, Truck, XCircle, MapPin, Phone, User, Loader2, } from "lucide-react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
const STATUS_CONFIG = {
    pending: { label: "En attente", color: "text-amber-600", icon: Clock, bg: "bg-amber-50 dark:bg-amber-950/30" },
    confirmed: { label: "Confirmée", color: "text-blue-600", icon: CheckCircle, bg: "bg-blue-50 dark:bg-blue-950/30" },
    ready: { label: "Prête", color: "text-emerald-600", icon: Package, bg: "bg-emerald-50 dark:bg-emerald-950/30" },
    delivered: { label: "Livrée", color: "text-green-600", icon: Truck, bg: "bg-green-50 dark:bg-green-950/30" },
    cancelled: { label: "Annulée", color: "text-red-500", icon: XCircle, bg: "bg-red-50 dark:bg-red-950/30" },
};
const STATUS_TRANSITIONS = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["ready", "cancelled"],
    ready: ["delivered"],
    delivered: [],
    cancelled: [],
};
export default function ParamedicalOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [updatingId, setUpdatingId] = useState(null);
    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("megacare_token");
            const res = await fetch("/api/paramedical/orders", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : []);
            }
        }
        catch {
            /* ignore */
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchOrders();
    }, []);
    const updateStatus = async (orderId, status) => {
        setUpdatingId(orderId);
        try {
            const token = localStorage.getItem("megacare_token");
            const res = await fetch(`/api/paramedical/orders/${orderId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: status } : o)));
            }
        }
        catch {
            /* ignore */
        }
        setUpdatingId(null);
    };
    const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
    const counts = {
        all: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        confirmed: orders.filter((o) => o.status === "confirmed").length,
        ready: orders.filter((o) => o.status === "ready").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsx("main", { className: "flex-1 p-4 md:p-8 overflow-y-auto", children: _jsxs("div", { className: "max-w-5xl mx-auto space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Commandes" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "G\u00E9rez les commandes de produits param\u00E9dicaux de vos patients" })] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", children: ["pending", "confirmed", "ready", "delivered", "cancelled"].map((s) => {
                                const cfg = STATUS_CONFIG[s];
                                const Icon = cfg.icon;
                                return (_jsxs("button", { onClick: () => setFilter(filter === s ? "all" : s), className: `flex items-center gap-3 p-3 rounded-xl border transition ${filter === s
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/30"}`, children: [_jsx("div", { className: `p-2 rounded-lg ${cfg.bg}`, children: _jsx(Icon, { size: 16, className: cfg.color }) }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-lg font-bold text-foreground", children: counts[s] }), _jsx("p", { className: "text-[10px] text-muted-foreground", children: cfg.label })] })] }, s));
                            }) }), loading ? (_jsx("div", { className: "flex justify-center py-16", children: _jsx(Loader2, { size: 32, className: "animate-spin text-primary" }) })) : filtered.length === 0 ? (_jsxs("div", { className: "text-center py-16 space-y-3", children: [_jsx(Package, { size: 48, className: "mx-auto text-muted-foreground/40" }), _jsx("p", { className: "text-lg font-medium text-foreground", children: "Aucune commande" }), _jsx("p", { className: "text-sm text-muted-foreground", children: filter === "all"
                                        ? "Vous n'avez pas encore reçu de commandes"
                                        : `Aucune commande avec le statut "${STATUS_CONFIG[filter]?.label}"` })] })) : (_jsx("div", { className: "space-y-4", children: filtered.map((order) => {
                                const cfg = STATUS_CONFIG[order.status];
                                const StatusIcon = cfg.icon;
                                const transitions = STATUS_TRANSITIONS[order.status] || [];
                                const date = new Date(order.createdAt);
                                return (_jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("span", { className: `flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`, children: [_jsx(StatusIcon, { size: 12 }), cfg.label] }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["#", order.id.slice(-6).toUpperCase()] })] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [date.toLocaleDateString("fr-FR", {
                                                                    day: "2-digit",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                }), " ", "\u00E0", " ", date.toLocaleTimeString("fr-FR", {
                                                                    hour: "2-digit",
                                                                    minute: "2-digit",
                                                                })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: "text-lg font-bold text-primary", children: [order.total.toFixed(2), " TND"] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [order.items.length, " article", order.items.length > 1 ? "s" : ""] })] })] }), _jsxs("div", { className: "flex items-center gap-4 flex-wrap text-sm", children: [_jsxs("span", { className: "flex items-center gap-1.5 text-foreground", children: [_jsx(User, { size: 14, className: "text-muted-foreground" }), order.patientName] }), (order.deliveryPhone || order.patientPhone) && (_jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [_jsx(Phone, { size: 14 }), order.deliveryPhone || order.patientPhone] })), _jsxs("span", { className: "flex items-center gap-1.5 text-muted-foreground", children: [_jsx(MapPin, { size: 14 }), order.deliveryMethod === "delivery"
                                                            ? `Livraison — ${order.deliveryAddress || ""} ${order.deliveryGovernorate || ""}`
                                                            : `Retrait sur place — ${order.patientGovernorate || ""}`] })] }), _jsx("div", { className: "bg-secondary/30 rounded-lg p-3 space-y-2", children: order.items.map((item, idx) => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-foreground", children: [item.name, " ", item.quantity > 1 && (_jsxs("span", { className: "text-muted-foreground", children: ["\u00D7", item.quantity] }))] }), _jsxs("span", { className: "font-medium text-foreground", children: [(item.price * item.quantity).toFixed(2), " TND"] })] }, idx))) }), transitions.length > 0 && (_jsx("div", { className: "flex items-center gap-2 flex-wrap", children: transitions.map((next) => {
                                                const nextCfg = STATUS_CONFIG[next];
                                                const NextIcon = nextCfg.icon;
                                                const isCancel = next === "cancelled";
                                                return (_jsxs("button", { onClick: () => updateStatus(order.id, next), disabled: updatingId === order.id, className: `flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50 ${isCancel
                                                        ? "border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        : "bg-primary text-primary-foreground hover:bg-primary/90"}`, children: [updatingId === order.id ? (_jsx(Loader2, { size: 12, className: "animate-spin" })) : (_jsx(NextIcon, { size: 12 })), nextCfg.label] }, next));
                                            }) }))] }, order.id));
                            }) }))] }) })] }));
}
