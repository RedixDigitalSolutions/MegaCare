import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { Download, FileText, CalendarDays, Clock, Users, ChevronDown, ChevronUp, CheckCircle2, History, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const REPORTS = [];
const HISTORY = [];
const fmtDate = (d) => {
    if (d.includes("–"))
        return d;
    const dt = new Date(d);
    return dt.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
};
const handlePdfDownload = (r) => {
    const lines = [
        `RAPPORT ${r.type === "daily" ? "JOURNALIER" : "HEBDOMADAIRE"}`,
        `Période : ${fmtDate(r.date)}`,
        `Visites : ${r.visits}`,
        `Heures : ${r.hours}`,
        `Patients : ${r.patientsNote}`,
        ``,
        `Généré par MegaCare – ${new Date().toLocaleDateString("fr-FR")}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rapport-${r.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};
export default function ReportsPage() {
    const [reports, setReports] = useState(REPORTS);
    const [history, setHistory] = useState(HISTORY);
    const [view, setView] = useState("daily");
    const [expandedId, setExpandedId] = useState(null);
    const [histPage, setHistPage] = useState(0);
    const PAGE_SIZE = 5;
    useEffect(() => {
        fetch("/api/paramedical/reports", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => {
            if (d?.reports)
                setReports(d.reports);
            if (d?.history)
                setHistory(d.history);
        })
            .catch(() => { });
    }, []);
    const filtered = reports.filter((r) => r.type === view);
    const histSlice = history.slice(histPage * PAGE_SIZE, (histPage + 1) * PAGE_SIZE);
    const totalHistPages = Math.ceil(history.length / PAGE_SIZE);
    const toggle = (id) => setExpandedId(expandedId === id ? null : id);
    // Weekly KPIs
    const weeklyReport = reports.find((r) => r.type === "weekly");
    const kpis = [
        { label: "Visites aujourd'hui", value: "6", icon: CheckCircle2, color: "text-green-600" },
        { label: "Heures cette semaine", value: weeklyReport?.hours ?? "—", icon: Clock, color: "text-blue-600" },
        { label: "Visites cette semaine", value: String(weeklyReport?.visits ?? "—"), icon: CalendarDays, color: "text-primary" },
        { label: "Patients actifs", value: "12", icon: Users, color: "text-violet-600" },
    ];
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Rapports" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "R\u00E9sum\u00E9s de soins et historique" })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3", children: kpis.map((k) => {
                                    const Icon = k.icon;
                                    return (_jsxs("div", { className: "bg-card border border-border rounded-xl p-4 flex items-center gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0`, children: _jsx(Icon, { size: 18, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-lg font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label));
                                }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-3", children: [_jsxs("h2", { className: "font-semibold text-foreground flex items-center gap-2", children: [_jsx(FileText, { size: 16 }), "Rapports de soins"] }), _jsx("div", { className: "flex rounded-lg border border-border overflow-hidden text-sm", children: ["daily", "weekly"].map((v) => (_jsx("button", { onClick: () => setView(v), className: `px-4 py-1.5 font-medium transition ${view === v ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`, children: v === "daily" ? "Journaliers" : "Hebdomadaires" }, v))) })] }), _jsx("div", { className: "space-y-2.5", children: filtered.map((r) => {
                                            const isOpen = expandedId === r.id;
                                            return (_jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [_jsxs("button", { onClick: () => toggle(r.id), className: "w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition text-left", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: _jsx(FileText, { size: 16, className: "text-primary" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: fmtDate(r.date) }), _jsxs("div", { className: "flex items-center gap-3 mt-0.5 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(CalendarDays, { size: 10 }), r.visits, " visites"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 10 }), r.hours] })] })] }), _jsxs("button", { onClick: (e) => { e.stopPropagation(); handlePdfDownload(r); }, className: "flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-primary hover:border-primary transition", title: "T\u00E9l\u00E9charger", children: [_jsx(Download, { size: 12 }), "PDF"] }), _jsx("div", { className: "text-muted-foreground", children: isOpen ? _jsx(ChevronUp, { size: 16 }) : _jsx(ChevronDown, { size: 16 }) })] }), isOpen && (_jsxs("div", { className: "px-5 pb-4 pt-0 border-t border-border bg-muted/20", children: [_jsxs("div", { className: "grid grid-cols-3 gap-4 py-3 text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Visites" }), _jsx("p", { className: "font-semibold text-foreground", children: r.visits })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Heures" }), _jsx("p", { className: "font-semibold text-foreground", children: r.hours })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Type" }), _jsx("p", { className: "font-semibold text-foreground capitalize", children: r.type === "daily" ? "Journalier" : "Hebdomadaire" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground mb-1", children: "Patients" }), _jsx("p", { className: "text-sm text-foreground", children: r.patientsNote })] })] }))] }, r.id));
                                        }) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("h2", { className: "font-semibold text-foreground flex items-center gap-2", children: [_jsx(History, { size: 16 }), "Historique des soins"] }), _jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden", children: [_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border bg-muted/30", children: [_jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Date & heure" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground", children: "Patient" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden sm:table-cell", children: "Soin" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-muted-foreground hidden md:table-cell", children: "Dur\u00E9e" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: histSlice.map((h) => (_jsxs("tr", { className: "hover:bg-muted/20 transition", children: [_jsx("td", { className: "px-4 py-3 text-xs text-muted-foreground", children: h.date }), _jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: h.patient }), _jsx("td", { className: "px-4 py-3 text-muted-foreground hidden sm:table-cell", children: h.care }), _jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell", children: h.duration })] }, h.id))) })] }), totalHistPages > 1 && (_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10 text-sm", children: [_jsx("button", { onClick: () => setHistPage((p) => Math.max(0, p - 1)), disabled: histPage === 0, className: "px-3 py-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition", children: "Pr\u00E9c\u00E9dent" }), _jsxs("span", { className: "text-muted-foreground text-xs", children: ["Page ", histPage + 1, " / ", totalHistPages] }), _jsx("button", { onClick: () => setHistPage((p) => Math.min(totalHistPages - 1, p + 1)), disabled: histPage === totalHistPages - 1, className: "px-3 py-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition", children: "Suivant" })] }))] })] })] })] })] }));
}
