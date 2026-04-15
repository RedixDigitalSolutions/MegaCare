import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import { Search, Download, Share2, CheckCircle2, AlertTriangle, FileText, TrendingUp, } from "lucide-react";
const statusConfig = {
    Normal: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-200",
        icon: CheckCircle2,
    },
    Élevé: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: AlertTriangle,
    },
    Critique: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
        icon: AlertTriangle,
    },
};
export default function LabResultsPage() {
    const [results, setResults] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem("megacare_token");
        fetch("/api/lab/results", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => setResults(Array.isArray(data) ? data : []))
            .catch(() => { });
    }, []);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const filtered = results.filter((r) => {
        const q = search.toLowerCase();
        const matchSearch = r.patient.toLowerCase().includes(q) ||
            r.testType.toLowerCase().includes(q);
        const matchStatus = filterStatus === "all" || r.status === filterStatus;
        return matchSearch && matchStatus;
    });
    const kpis = [
        {
            label: "Résultats totaux",
            value: results.length,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
            icon: FileText,
        },
        {
            label: "Normaux",
            value: results.filter((r) => r.status === "Normal").length,
            color: "text-green-500",
            bg: "bg-green-50",
            icon: CheckCircle2,
        },
        {
            label: "Élevés",
            value: results.filter((r) => r.status === "Élevé").length,
            color: "text-amber-500",
            bg: "bg-amber-50",
            icon: TrendingUp,
        },
        {
            label: "Critiques",
            value: results.filter((r) => r.status === "Critique").length,
            color: "text-red-500",
            bg: "bg-red-50",
            icon: AlertTriangle,
        },
    ];
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(LabDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "R\u00E9sultats d'analyses" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Consultation et partage des r\u00E9sultats de laboratoire" })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((k) => {
                                    const Icon = k.icon;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3", children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(Icon, { size: 18, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label));
                                }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Rechercher par patient ou type d'analyse\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsx("div", { className: "flex gap-2", children: ["all", "Normal", "Élevé", "Critique"].map((s) => (_jsx("button", { onClick: () => setFilterStatus(s), className: `px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`, children: s === "all" ? "Tous" : s }, s))) })] }), filtered.some((r) => r.status === "Critique") && (_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700", children: [_jsx(AlertTriangle, { size: 16 }), _jsx("span", { className: "text-sm font-medium", children: "Des r\u00E9sultats critiques n\u00E9cessitent une attention imm\u00E9diate." })] })), _jsx("div", { className: "space-y-3", children: filtered.map((r) => {
                                    const cfg = statusConfig[r.status];
                                    const StatusIcon = cfg.icon;
                                    return (_jsxs("div", { className: `bg-card rounded-xl border-2 ${cfg.border} p-5`, children: [_jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { className: "flex-1 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: r.patient }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [r.doctor, " \u00B7 ", r.date] })] }), _jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`, children: [_jsx(StatusIcon, { size: 12 }), r.status] })] }), _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Type d'analyse" }), _jsx("p", { className: "text-sm font-medium text-foreground mt-0.5", children: r.testType })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "R\u00E9sultat" }), _jsxs("p", { className: `text-sm font-bold mt-0.5 ${cfg.text}`, children: [r.value, " ", _jsx("span", { className: "font-normal text-muted-foreground", children: r.unit })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "R\u00E9f\u00E9rence" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: r.reference })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Date" }), _jsx("p", { className: "text-sm text-foreground mt-0.5", children: r.date })] })] })] }) }), _jsxs("div", { className: "flex items-center gap-2 pt-4 mt-1 border-t border-border", children: [_jsxs("button", { className: "flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-xs font-medium", children: [_jsx(Download, { size: 13 }), " T\u00E9l\u00E9charger PDF"] }), _jsxs("button", { className: "flex items-center gap-2 px-3 py-1.5 border border-border text-foreground rounded-lg hover:bg-muted transition text-xs font-medium", children: [_jsx(Share2, { size: 13 }), " Partager au m\u00E9decin"] })] })] }, r.id));
                                }) }), filtered.length === 0 && (_jsxs("div", { className: "text-center py-16 bg-card rounded-xl border border-border", children: [_jsx(FileText, { size: 36, className: "mx-auto mb-2 text-muted-foreground/30" }), _jsx("p", { className: "text-muted-foreground", children: "Aucun r\u00E9sultat trouv\u00E9" })] }))] })] })] }));
}
