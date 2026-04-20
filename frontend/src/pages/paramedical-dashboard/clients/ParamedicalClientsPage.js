import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { Search, UserCircle2, ChevronRight, ShoppingBag, MapPin, Phone, ArrowLeft, Package, Calendar, Truck, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const statusLabels = {
    pending: "En attente",
    confirmed: "Confirmée",
    ready: "Prête",
    delivered: "Livrée",
    cancelled: "Annulée",
};
const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-blue-100 text-blue-700",
    ready: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};
export default function ParamedicalClientsPage() {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loadingClients, setLoadingClients] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(false);
    useEffect(() => {
        setLoadingClients(true);
        fetch("/api/paramedical/clients", {
            headers: { Authorization: `Bearer ${tok()}` },
        })
            .then((r) => r.json())
            .then((d) => setClients(Array.isArray(d) ? d : []))
            .catch(() => { })
            .finally(() => setLoadingClients(false));
    }, []);
    const openClient = (client) => {
        setSelectedClient(client);
        setLoadingOrders(true);
        fetch(`/api/paramedical/clients/${client.id}/orders`, {
            headers: { Authorization: `Bearer ${tok()}` },
        })
            .then((r) => r.json())
            .then((d) => setOrders(Array.isArray(d) ? d : []))
            .catch(() => { })
            .finally(() => setLoadingOrders(false));
    };
    const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.governorate.toLowerCase().includes(search.toLowerCase()) ||
        c.delegation.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search));
    // ── Client list view ──────────────────────────────────────
    const ClientListView = () => (_jsxs(_Fragment, { children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Clients" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [clients.length, " client", clients.length !== 1 ? "s" : "", " ayant pass\u00E9 des commandes"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-5", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 16 }), _jsx("input", { type: "text", placeholder: "Rechercher par nom, gouvernorat, d\u00E9l\u00E9gation, t\u00E9l\u00E9phone...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), loadingClients ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" }) })) : filtered.length === 0 ? (_jsx("div", { className: "bg-card rounded-xl border border-border p-10 text-center text-muted-foreground text-sm", children: clients.length === 0
                            ? "Aucun client pour le moment. Les clients apparaîtront ici dès qu'ils passeront des commandes."
                            : "Aucun client trouvé." })) : (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filtered.map((client) => (_jsxs("div", { onClick: () => openClient(client), className: "bg-card rounded-xl border border-border p-5 space-y-3 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0", children: _jsx(UserCircle2, { size: 22, className: "text-primary" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-sm text-foreground truncate", children: client.name }), client.phone && (_jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [_jsx(Phone, { size: 11 }), client.phone] }))] }), _jsx(ChevronRight, { size: 16, className: "text-muted-foreground mt-1" })] }), (client.governorate || client.delegation) && (_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [_jsx(MapPin, { size: 12 }), [client.delegation, client.governorate]
                                            .filter(Boolean)
                                            .join(", ")] })), _jsxs("div", { className: "flex items-center gap-4 pt-1 border-t border-border", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [_jsx(ShoppingBag, { size: 12 }), _jsx("span", { className: "font-medium text-foreground", children: client.totalOrders }), " ", "commande", client.totalOrders !== 1 ? "s" : ""] }), _jsxs("div", { className: "text-xs text-muted-foreground", children: [_jsx("span", { className: "font-medium text-foreground", children: client.totalSpent.toFixed(2) }), " ", "DT"] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [_jsx(Calendar, { size: 11 }), "Derni\u00E8re commande :", " ", new Date(client.lastOrderDate).toLocaleDateString("fr-FR", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })] })] }, client.id))) }))] })] }));
    // ── Client detail / order history view ────────────────────
    const ClientDetailView = () => (_jsxs(_Fragment, { children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: [_jsxs("button", { onClick: () => {
                            setSelectedClient(null);
                            setOrders([]);
                        }, className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-3", children: [_jsx(ArrowLeft, { size: 15 }), "Retour aux clients"] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center", children: _jsx(UserCircle2, { size: 24, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: selectedClient.name }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground mt-0.5", children: [selectedClient.phone && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Phone, { size: 12 }), selectedClient.phone] })), (selectedClient.governorate || selectedClient.delegation) && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 12 }), [selectedClient.delegation, selectedClient.governorate]
                                                        .filter(Boolean)
                                                        .join(", ")] }))] })] })] }), _jsxs("div", { className: "flex gap-6 mt-4", children: [_jsxs("div", { className: "bg-muted/40 rounded-lg px-4 py-2 text-center", children: [_jsx("p", { className: "text-lg font-bold text-foreground", children: selectedClient.totalOrders }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Commandes" })] }), _jsxs("div", { className: "bg-muted/40 rounded-lg px-4 py-2 text-center", children: [_jsxs("p", { className: "text-lg font-bold text-foreground", children: [selectedClient.totalSpent.toFixed(2), " DT"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Total d\u00E9pens\u00E9" })] })] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [_jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Historique des commandes" }), loadingOrders ? (_jsx("div", { className: "flex items-center justify-center py-16", children: _jsx("div", { className: "w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" }) })) : orders.length === 0 ? (_jsx("div", { className: "bg-card rounded-xl border border-border p-10 text-center text-muted-foreground text-sm", children: "Aucune commande trouv\u00E9e." })) : (orders.map((order) => (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`, children: statusLabels[order.status] || order.status }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["#", order.id.slice(-6).toUpperCase()] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [_jsx(Calendar, { size: 12 }), new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }), " à ", new Date(order.createdAt).toLocaleTimeString("fr-FR", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })] })] }), _jsx("div", { className: "space-y-1.5", children: order.items.map((item, idx) => (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Package, { size: 13, className: "text-muted-foreground" }), _jsx("span", { className: "text-foreground", children: item.name }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["\u00D7", item.quantity] })] }), _jsxs("span", { className: "text-sm font-medium text-foreground", children: [(item.price * item.quantity).toFixed(2), " DT"] })] }, idx))) }), _jsxs("div", { className: "flex items-center justify-between pt-2 border-t border-border", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [_jsx(Truck, { size: 13 }), order.deliveryMethod === "delivery"
                                                ? `Livraison — ${[order.deliveryAddress, order.deliveryDelegation, order.deliveryGovernorate].filter(Boolean).join(", ")}`
                                                : "Retrait sur place"] }), _jsxs("p", { className: "text-sm font-bold text-foreground", children: [order.total.toFixed(2), " DT"] })] })] }, order.id))))] })] }));
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsx("div", { className: "flex-1 flex flex-col min-w-0", children: selectedClient ? _jsx(ClientDetailView, {}) : _jsx(ClientListView, {}) })] }));
}
