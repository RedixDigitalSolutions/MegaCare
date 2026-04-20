import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import { Search, Package, UserCircle2, Phone, Truck, Store, Calendar, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp, QrCode, } from "lucide-react";
const STATUS_CFG = {
    pending: { badge: "bg-amber-100 text-amber-700", label: "En attente", icon: _jsx(Clock, { size: 15, className: "text-amber-600" }) },
    confirmed: { badge: "bg-blue-100 text-blue-700", label: "Confirmée", icon: _jsx(CheckCircle, { size: 15, className: "text-blue-600" }) },
    ready: { badge: "bg-purple-100 text-purple-700", label: "Prête", icon: _jsx(Package, { size: 15, className: "text-purple-600" }) },
    completed: { badge: "bg-green-100 text-green-700", label: "Complétée", icon: _jsx(CheckCircle, { size: 15, className: "text-green-600" }) },
    cancelled: { badge: "bg-red-100 text-red-700", label: "Annulée", icon: _jsx(XCircle, { size: 15, className: "text-red-600" }) },
};
const TAB_LABELS = {
    all: "Toutes",
    pending: "En attente",
    confirmed: "Confirmées",
    ready: "Prêtes",
    completed: "Complétées",
    cancelled: "Annulées",
};
const tok = () => localStorage.getItem("megacare_token") ?? "";
export default function PharmacyOrdersPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [tab, setTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [updating, setUpdating] = useState(null);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    const fetchOrders = () => {
        fetch("/api/pharmacy/patient-orders", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoadingData(false); })
            .catch(() => setLoadingData(false));
    };
    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== "pharmacy")
            return;
        fetchOrders();
    }, [isAuthenticated, user]);
    const handleSearch = async () => {
        const q = searchQuery.trim();
        if (!q) {
            setSearchResults(null);
            return;
        }
        const res = await fetch(`/api/pharmacy/patient-orders/search?q=${encodeURIComponent(q)}`, {
            headers: { Authorization: `Bearer ${tok()}` },
        });
        if (res.ok) {
            const data = await res.json();
            setSearchResults(Array.isArray(data) ? data : []);
        }
    };
    useEffect(() => {
        if (!searchQuery.trim())
            setSearchResults(null);
    }, [searchQuery]);
    const updateStatus = async (orderId, status) => {
        setUpdating(orderId);
        try {
            const res = await fetch(`/api/pharmacy/patient-orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
                if (searchResults) {
                    setSearchResults((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
                }
            }
        }
        catch { /* ignore */ }
        setUpdating(null);
    };
    if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
        return null;
    const displayOrders = searchResults !== null ? searchResults : orders;
    const filtered = tab === "all" ? displayOrders : displayOrders.filter((o) => o.status === tab);
    const countOf = (s) => s === "all" ? displayOrders.length : displayOrders.filter((o) => o.status === s).length;
    const renderOrder = (order) => {
        const cfg = STATUS_CFG[order.status];
        const isOpen = expanded === order.id;
        return (_jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition", children: [_jsxs("div", { className: "p-5 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [_jsx("div", { className: "mt-0.5", children: cfg.icon }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap mb-1", children: [_jsxs("span", { className: "text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded font-bold tracking-wider flex items-center gap-1", children: [_jsx(QrCode, { size: 11 }), order.orderCode] }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`, children: cfg.label }), _jsx("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: order.deliveryMethod === "delivery" ? _jsxs(_Fragment, { children: [_jsx(Truck, { size: 12 }), " Livraison"] }) : _jsxs(_Fragment, { children: [_jsx(Store, { size: 12 }), " Retrait"] }) })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(UserCircle2, { size: 14, className: "text-muted-foreground" }), _jsx("span", { className: "font-medium text-foreground", children: order.patientName })] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap", children: [order.patientPhone && _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Phone, { size: 11 }), order.patientPhone] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 11 }), new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }), " ", new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })] })] })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 shrink-0", children: [_jsxs("span", { className: "text-lg font-bold text-foreground", children: [order.total.toFixed(2), " DT"] }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [order.items.length, " article", order.items.length !== 1 ? "s" : ""] }), _jsxs("button", { onClick: () => setExpanded(isOpen ? null : order.id), className: "flex items-center gap-1 text-xs text-primary hover:underline", children: [isOpen ? _jsx(ChevronUp, { size: 13 }) : _jsx(ChevronDown, { size: 13 }), isOpen ? "Masquer" : "Détails"] })] })] }), isOpen && (_jsxs("div", { className: "border-t border-border bg-muted/20 px-5 py-4 space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Articles command\u00E9s" }), _jsx("div", { className: "space-y-1.5", children: order.items.map((item, i) => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "flex items-center gap-2 text-foreground", children: [_jsx(Package, { size: 13, className: "text-muted-foreground" }), item.name, _jsxs("span", { className: "text-xs text-muted-foreground", children: ["\u00D7", item.quantity] })] }), _jsxs("span", { className: "font-medium text-foreground", children: [(item.price * item.quantity).toFixed(2), " DT"] })] }, i))) })] }), order.deliveryMethod === "delivery" && (_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1", children: "Adresse de livraison" }), _jsx("p", { className: "text-sm text-foreground", children: order.deliveryAddress }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [[order.deliveryDelegation, order.deliveryGovernorate].filter(Boolean).join(", "), order.deliveryPhone && ` · ${order.deliveryPhone}`] })] })), _jsxs("div", { className: "flex gap-2 flex-wrap pt-1", children: [order.status === "pending" && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => updateStatus(order.id, "confirmed"), disabled: updating === order.id, className: "px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition disabled:opacity-50", children: "Confirmer" }), _jsx("button", { onClick: () => updateStatus(order.id, "cancelled"), disabled: updating === order.id, className: "px-4 py-2 border border-red-300 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition disabled:opacity-50", children: "Annuler" })] })), order.status === "confirmed" && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => updateStatus(order.id, "ready"), disabled: updating === order.id, className: "px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition disabled:opacity-50", children: "Pr\u00EAte" }), _jsx("button", { onClick: () => updateStatus(order.id, "cancelled"), disabled: updating === order.id, className: "px-4 py-2 border border-red-300 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition disabled:opacity-50", children: "Annuler" })] })), order.status === "ready" && (_jsx("button", { onClick: () => updateStatus(order.id, "completed"), disabled: updating === order.id, className: "px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition disabled:opacity-50", children: "Marquer comme compl\u00E9t\u00E9e" }))] })] }))] }, order.id));
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(PharmacyDashboardSidebar, { pharmacyName: user.firstName || "Pharmacie" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Commandes clients" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: loadingData ? "Chargement…" : `${orders.length} commande${orders.length !== 1 ? "s" : ""}` })] }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 16 }), _jsx("input", { type: "text", placeholder: "Rechercher par code commande, nom du patient...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSearch(), className: "w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("button", { onClick: handleSearch, className: "px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center gap-2", children: [_jsx(QrCode, { size: 16 }), "Rechercher"] })] }), searchResults !== null && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: [searchResults.length, " r\u00E9sultat", searchResults.length !== 1 ? "s" : "", " pour \"", searchQuery, "\""] }), _jsx("button", { onClick: () => { setSearchQuery(""); setSearchResults(null); }, className: "text-xs text-primary hover:underline", children: "Effacer la recherche" })] })), _jsx("div", { className: "flex gap-2 flex-wrap", children: ["all", "pending", "confirmed", "ready", "completed", "cancelled"].map((s) => (_jsxs("button", { onClick: () => setTab(s), className: `px-3 py-1.5 rounded-full text-xs font-medium transition ${tab === s
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground hover:bg-muted/70"}`, children: [TAB_LABELS[s], " (", countOf(s), ")"] }, s))) }), loadingData ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" }) })) : (_jsx("div", { className: "space-y-3", children: filtered.length === 0 ? (_jsx("div", { className: "text-center py-16 text-muted-foreground text-sm", children: "Aucune commande pour ce filtre." })) : (filtered.map(renderOrder)) }))] })] })] }) }));
}
