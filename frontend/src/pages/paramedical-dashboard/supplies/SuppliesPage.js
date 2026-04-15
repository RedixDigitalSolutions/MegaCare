import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { AlertTriangle, Package, ShoppingCart, Check, Search, X, } from "lucide-react";
const levelConfig = {
    ok: { bar: "bg-green-500", badge: "bg-green-100 text-green-700", badgeText: "Stock OK", threshold: "" },
    low: { bar: "bg-amber-400", badge: "bg-amber-100 text-amber-700", badgeText: "Stock faible", threshold: "" },
    critical: { bar: "bg-red-500", badge: "bg-red-100 text-red-700", badgeText: "Critique", threshold: "" },
};
const tok = () => localStorage.getItem("megacare_token") ?? "";
const INITIAL = [];
export default function SuppliesPage() {
    const [supplies, setSupplies] = useState(INITIAL);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState("");
    useEffect(() => {
        fetch("/api/paramedical/supplies", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => setSupplies(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);
    const filtered = supplies.filter((s) => {
        const matchFilter = filter === "all" || s.level === filter;
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.category.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });
    const lowCount = supplies.filter((s) => s.level === "low").length;
    const critCount = supplies.filter((s) => s.level === "critical").length;
    const orderedCount = supplies.filter((s) => s.ordered).length;
    const openRequest = (s) => setModal({ supply: s, qty: 1, note: "" });
    const confirmRequest = async () => {
        if (!modal)
            return;
        const r = await fetch(`/api/paramedical/supplies/${modal.supply.id}/order`, {
            method: "POST",
            headers: { Authorization: `Bearer ${tok()}` },
        }).catch(() => null);
        if (r && r.ok) {
            const data = await r.json();
            setSupplies((prev) => prev.map((s) => (s.id === modal.supply.id ? data : s)));
        }
        setModal(null);
        setToast(`Demande de livraison envoyée pour : ${modal.supply.name}`);
        setTimeout(() => setToast(""), 3500);
    };
    const pct = (s) => Math.round((s.current / s.max) * 100);
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between flex-wrap gap-3", children: _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Mat\u00E9riel m\u00E9dical" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [supplies.length, " articles \u00B7 ", orderedCount, " commande", orderedCount !== 1 ? "s" : "", " en cours"] })] }) }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-5", children: [toast && (_jsxs("div", { className: "fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm", children: [_jsx(Check, { size: 15 }), toast] })), (critCount > 0 || lowCount > 0) && (_jsxs("div", { className: `rounded-xl border p-4 flex items-start gap-3 ${critCount > 0 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`, children: [_jsx(AlertTriangle, { size: 18, className: critCount > 0 ? "text-red-600 shrink-0 mt-0.5" : "text-amber-600 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: `font-semibold text-sm ${critCount > 0 ? "text-red-800" : "text-amber-800"}`, children: critCount > 0
                                                    ? `${critCount} article${critCount > 1 ? "s" : ""} en stock critique`
                                                    : `${lowCount} article${lowCount > 1 ? "s" : ""} en stock faible` }), _jsx("p", { className: `text-xs mt-0.5 ${critCount > 0 ? "text-red-600" : "text-amber-600"}`, children: "Commandez rapidement pour \u00E9viter une rupture de stock." })] })] })), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
                                    { label: "Total articles", value: supplies.length, color: "text-foreground" },
                                    { label: "Stocks critiques", value: critCount, color: "text-red-600" },
                                    { label: "Stocks faibles", value: lowCount, color: "text-amber-600" },
                                    { label: "Commandes en cours", value: orderedCount, color: "text-primary" },
                                ].map((k) => (_jsxs("div", { className: "bg-card border border-border rounded-xl px-4 py-3 text-center", children: [_jsx("p", { className: `text-2xl font-bold ${k.color}`, children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: k.label })] }, k.label))) }), _jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [_jsxs("div", { className: "relative flex-1 min-w-36", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 14 }), _jsx("input", { type: "text", placeholder: "Rechercher...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-8 pr-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), ["all", "ok", "low", "critical"].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `px-3 py-1.5 rounded-lg text-xs font-medium border transition ${filter === f
                                            ? "bg-primary text-primary-foreground border-primary"
                                            : "bg-card border-border text-muted-foreground hover:border-primary/40"}`, children: f === "all" ? "Tout" : f === "ok" ? "Stock OK" : f === "low" ? "Faible" : "Critique" }, f)))] }), _jsxs("div", { className: "space-y-2.5", children: [filtered.length === 0 && (_jsxs("div", { className: "text-center py-10 text-muted-foreground", children: [_jsx(Package, { size: 32, className: "mx-auto mb-2 opacity-30" }), _jsx("p", { className: "text-sm", children: "Aucun article correspondant" })] })), filtered.map((s) => {
                                        const cfg = levelConfig[s.level];
                                        const p = pct(s);
                                        return (_jsx("div", { className: "bg-card border border-border rounded-xl p-4", children: _jsxs("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: s.name }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`, children: cfg.badgeText }), s.ordered && (_jsx("span", { className: "text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700", children: "Command\u00E9" }))] }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s.category }), _jsxs("div", { className: "mt-2.5 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("span", { children: [s.current, " ", s.unit] }), _jsxs("span", { children: [p, "% du stock max (", s.max, " ", s.unit, ")"] })] }), _jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all ${cfg.bar}`, style: { width: `${Math.max(p, 2)}%` } }) })] })] }), !s.ordered && s.level !== "ok" && (_jsxs("button", { onClick: () => openRequest(s), className: "flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition shrink-0", children: [_jsx(ShoppingCart, { size: 13 }), "Commander"] }))] }) }, s.id));
                                    })] })] })] }), modal && (_jsx("div", { className: "fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-base font-bold text-foreground", children: "Demande de livraison" }), _jsx("p", { className: "text-sm text-muted-foreground", children: modal.supply.name })] }), _jsx("button", { onClick: () => setModal(null), className: "p-1 text-muted-foreground hover:text-foreground", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-xs font-medium text-muted-foreground block mb-1", children: ["Quantit\u00E9 souhait\u00E9e (", modal.supply.unit, ")"] }), _jsx("input", { type: "number", min: 1, value: modal.qty, onChange: (e) => setModal({ ...modal, qty: Math.max(1, Number(e.target.value)) }), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1", children: "Note (optionnel)" }), _jsx("textarea", { rows: 2, placeholder: "Pr\u00E9cision ou urgence...", value: modal.note, onChange: (e) => setModal({ ...modal, note: e.target.value }), className: "w-full px-3 py-2 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background" })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setModal(null), className: "flex-1 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition", children: "Annuler" }), _jsxs("button", { onClick: confirmRequest, className: "flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-1.5", children: [_jsx(ShoppingCart, { size: 14 }), "Confirmer"] })] })] }) }))] }));
}
