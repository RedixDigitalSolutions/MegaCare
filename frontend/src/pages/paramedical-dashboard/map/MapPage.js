import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useEffect } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { MapPin, Navigation, Clock, Route, CheckCircle2, Circle, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const VISITS = [];
const statusConfig = {
    done: { icon: CheckCircle2, ring: "border-green-400", bg: "bg-green-50", badge: "bg-green-100 text-green-700", badgeText: "Effectuée" },
    current: { icon: Navigation, ring: "border-primary", bg: "bg-primary/5", badge: "bg-primary/10 text-primary", badgeText: "En cours" },
    pending: { icon: Circle, ring: "border-border", bg: "bg-card", badge: "bg-muted text-muted-foreground", badgeText: "À venir" },
};
const totalKm = 0;
const doneCount = 0;
export default function MapPage() {
    const [visits, setVisits] = useState(VISITS);
    const [activeId, setActiveId] = useState(null);
    useEffect(() => {
        fetch("/api/paramedical/map-visits", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => {
            const list = Array.isArray(d) ? d : [];
            setVisits(list);
            setActiveId(list.find((v) => v.status === "current")?.id ?? null);
        })
            .catch(() => { });
    }, []);
    const totalKm = visits.reduce((sum, v) => sum + v.distFromPrev, 0);
    const doneCount = visits.filter((v) => v.status === "done").length;
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Carte & Itin\u00E9raire" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Tourn\u00E9e optimis\u00E9e du jour" })] }), _jsxs("div", { className: "flex items-center gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [_jsx(Route, { size: 15, className: "text-primary" }), _jsxs("span", { children: [_jsxs("strong", { className: "text-foreground", children: [totalKm.toFixed(1), " km"] }), " total"] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [_jsx(CheckCircle2, { size: 15, className: "text-green-500" }), _jsxs("span", { children: [_jsxs("strong", { className: "text-foreground", children: [doneCount, "/", visits.length] }), " visites"] })] })] })] }), _jsxs("main", { className: "flex-1 flex flex-col lg:flex-row overflow-hidden", children: [_jsx("div", { className: "flex-1 bg-slate-100 relative min-h-72 overflow-hidden", children: _jsxs("div", { className: "absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100", children: [_jsx("div", { className: "absolute inset-0 opacity-20", style: { backgroundImage: "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)", backgroundSize: "40px 40px" } }), _jsx("svg", { className: "absolute inset-0 w-full h-full", preserveAspectRatio: "none", children: _jsx("polyline", { points: "18%,82% 32%,68% 50%,55% 65%,40% 78%,28% 90%,18%", fill: "none", stroke: "#6366f1", strokeWidth: "2.5", strokeDasharray: "8,4", opacity: "0.7" }) }), [
                                            { order: 1, x: "18%", y: "82%", status: "done" },
                                            { order: 2, x: "32%", y: "68%", status: "done" },
                                            { order: 3, x: "50%", y: "55%", status: "current" },
                                            { order: 4, x: "65%", y: "40%", status: "pending" },
                                            { order: 5, x: "78%", y: "28%", status: "pending" },
                                            { order: 6, x: "90%", y: "18%", status: "pending" },
                                        ].map((m) => (_jsxs("div", { className: "absolute -translate-x-1/2 -translate-y-full", style: { left: m.x, top: m.y }, children: [_jsx("div", { className: `relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-md font-bold text-sm cursor-pointer transition-transform hover:scale-110 ${m.status === "done" ? "bg-green-500 border-green-700 text-white" :
                                                        m.status === "current" ? "bg-primary border-primary/80 text-white ring-4 ring-primary/30" :
                                                            "bg-white border-slate-400 text-slate-700"}`, children: m.order }), _jsx("div", { className: `absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-6 border-l-transparent border-r-transparent ${m.status === "done" ? "border-t-green-500" : m.status === "current" ? "border-t-primary" : "border-t-slate-400"}`, style: { borderTopWidth: 6 } })] }, m.order))), _jsx("div", { className: "absolute bottom-3 right-3 text-xs text-slate-400 bg-white/70 px-2 py-0.5 rounded", children: "Carte simul\u00E9e \u2013 int\u00E9gration OpenStreetMap pr\u00E9vue" })] }) }), _jsxs("aside", { className: "w-full lg:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col overflow-y-auto", children: [_jsxs("div", { className: "px-4 py-3 border-b border-border", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "Ordre des visites" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [VISITS.length, " patients \u00B7 ", totalKm.toFixed(1), " km"] })] }), _jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-border", children: VISITS.map((v) => {
                                            const cfg = statusConfig[v.status];
                                            const Icon = cfg.icon;
                                            const isActive = v.id === activeId;
                                            return (_jsxs("button", { onClick: () => setActiveId(v.id), className: `w-full text-left px-4 py-3.5 flex items-start gap-3 transition ${isActive ? "bg-primary/5" : "hover:bg-muted/40"}`, children: [_jsx("div", { className: `w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${cfg.ring} ${v.status === "done" ? "bg-green-500 text-white" :
                                                            v.status === "current" ? "bg-primary text-white" :
                                                                "bg-background text-muted-foreground"}`, children: v.order }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-1", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", children: v.name }), _jsx("span", { className: `text-xs px-1.5 py-0.5 rounded-full shrink-0 font-medium ${cfg.badge}`, children: cfg.badgeText })] }), _jsxs("div", { className: "flex items-center gap-1 mt-0.5 text-xs text-muted-foreground", children: [_jsx(MapPin, { size: 10, className: "shrink-0" }), _jsx("span", { className: "truncate", children: v.address })] }), _jsxs("div", { className: "flex items-center gap-3 mt-1 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 10 }), v.time] }), _jsx("span", { className: "flex items-center gap-1", children: v.careType }), v.distFromPrev > 0 && (_jsxs("span", { className: "flex items-center gap-1 text-primary", children: [_jsx(Route, { size: 10 }), v.distFromPrev, " km"] }))] })] })] }, v.id));
                                        }) }), _jsxs("div", { className: "px-4 py-3 border-t border-border bg-muted/30", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsxs("span", { className: "text-muted-foreground flex items-center gap-1.5", children: [_jsx(Route, { size: 14 }), "Distance totale"] }), _jsxs("span", { className: "font-bold text-foreground", children: [totalKm.toFixed(1), " km"] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm mt-1", children: [_jsxs("span", { className: "text-muted-foreground flex items-center gap-1.5", children: [_jsx(Clock, { size: 14 }), "Dur\u00E9e estim\u00E9e"] }), _jsxs("span", { className: "font-bold text-foreground", children: ["~", Math.round(totalKm * 3 + VISITS.length * 20), " min"] })] })] })] })] })] })] }));
}
