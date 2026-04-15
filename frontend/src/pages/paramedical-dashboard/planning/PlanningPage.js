import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { MapPin, Clock, CheckCircle2, Circle, Loader2, Navigation, Car, ChevronRight, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const weekDays = [];
const weeklyData = {};
const statusConfig = {
    done: { label: "Terminée", icon: CheckCircle2, className: "text-green-500", cardClass: "border-green-200 bg-green-50/40" },
    in_progress: { label: "En cours", icon: Loader2, className: "text-blue-500", cardClass: "border-blue-200 bg-blue-50/40" },
    pending: { label: "À faire", icon: Circle, className: "text-muted-foreground", cardClass: "border-border bg-card" },
};
export default function ParamedicalPlanningPage() {
    const [view, setView] = useState("daily");
    const [selectedDay, setSelectedDay] = useState("");
    const [visits, setVisits] = useState(weeklyData);
    useEffect(() => {
        fetch("/api/paramedical/planning", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => {
            const data = d && typeof d === "object" ? d : {};
            setVisits(data);
            const keys = Object.keys(data);
            if (keys.length)
                setSelectedDay(keys[0]);
        })
            .catch(() => { });
    }, []);
    const dayKeys = Object.keys(visits);
    const dayVisits = visits[selectedDay] ?? [];
    const totalKm = dayVisits.reduce((sum, v) => sum + v.distance, 0);
    const totalMinutes = dayVisits.reduce((sum, v) => sum + v.duration, 0);
    const doneCount = dayVisits.filter((v) => v.status === "done").length;
    const cycleStatus = (day, id) => {
        const cycle = { pending: "in_progress", in_progress: "done", done: "pending" };
        setVisits((prev) => ({
            ...prev,
            [day]: prev[day].map((v) => v.id === id ? { ...v, status: cycle[v.status] } : v),
        }));
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Planning des visites" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Ordre chronologique optimis\u00E9" })] }), _jsx("div", { className: "flex items-center gap-1 bg-muted rounded-lg p-1", children: ["daily", "weekly"].map((v) => (_jsx("button", { onClick: () => setView(v), className: `px-4 py-1.5 rounded-md text-sm font-medium transition ${view === v ? "bg-card shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`, children: v === "daily" ? "Journalier" : "Hebdomadaire" }, v))) })] }) }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-5", children: [view === "daily" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: dayKeys.map((day) => {
                                            const dayV = visits[day] ?? [];
                                            const doneCt = dayV.filter((v) => v.status === "done").length;
                                            return (_jsxs("button", { onClick: () => setSelectedDay(day), className: `px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition shrink-0 ${selectedDay === day
                                                    ? "border-primary bg-primary/5 text-primary"
                                                    : "border-border bg-card hover:border-primary/40 text-foreground"}`, children: [_jsx("span", { children: day }), _jsxs("span", { className: "ml-2 text-xs text-muted-foreground", children: [doneCt, "/", dayV.length] })] }, day));
                                        }) }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 space-y-1", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Visites" }), _jsxs("p", { className: "text-2xl font-bold text-foreground", children: [doneCount, "/", dayVisits.length] }), _jsxs("p", { className: "text-xs text-green-600", children: [doneCount, " termin\u00E9es"] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-4 space-y-1", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Kilom\u00E9trage" }), _jsxs("p", { className: "text-2xl font-bold text-foreground", children: [totalKm.toFixed(1), " km"] }), _jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Car, { size: 11 }), " Estim\u00E9"] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-4 space-y-1", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Temps estim\u00E9" }), _jsxs("p", { className: "text-2xl font-bold text-foreground", children: [Math.floor(totalMinutes / 60), "h ", totalMinutes % 60 > 0 ? `${totalMinutes % 60}min` : ""] }), _jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), " Soins seuls"] })] })] }), _jsx("div", { className: "space-y-3", children: dayVisits.map((visit, idx) => {
                                            const cfg = statusConfig[visit.status];
                                            const Icon = cfg.icon;
                                            return (_jsxs("div", { className: `rounded-xl border p-4 flex gap-4 items-start transition ${cfg.cardClass}`, children: [_jsxs("div", { className: "flex flex-col items-center gap-1 shrink-0", children: [_jsx("span", { className: "w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center", children: visit.order }), idx < dayVisits.length - 1 && (_jsx("div", { className: "w-px h-4 bg-border" }))] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-0.5 flex-wrap", children: [_jsx("p", { className: "font-semibold text-sm text-foreground", children: visit.patientName }), _jsxs("span", { className: `text-xs flex items-center gap-1 ${cfg.className}`, children: [_jsx(Icon, { size: 12, className: visit.status === "in_progress" ? "animate-spin" : "" }), cfg.label] })] }), _jsx("p", { className: "text-xs text-muted-foreground mb-2", children: visit.type }), _jsxs("div", { className: "flex flex-wrap gap-3 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), visit.time, " \u00B7 ", visit.duration, " min"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { size: 11 }), visit.address] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Navigation, { size: 11 }), visit.distance, " km"] })] })] }), _jsx("button", { onClick: () => cycleStatus(selectedDay, visit.id), title: "Changer le statut", className: "shrink-0 p-2 rounded-lg border border-border bg-background hover:border-primary hover:text-primary transition", children: _jsx(ChevronRight, { size: 14 }) })] }, visit.id));
                                        }) })] })), view === "weekly" && (_jsx("div", { className: "space-y-4", children: dayKeys.map((day) => {
                                    const dayV = visits[day] ?? [];
                                    const doneCt = dayV.filter((v) => v.status === "done").length;
                                    const kmTotal = dayV.reduce((s, v) => s + v.distance, 0);
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-3 border-b border-border", children: [_jsx("h3", { className: "font-semibold text-sm text-foreground", children: day }), _jsxs("div", { className: "flex items-center gap-4 text-xs text-muted-foreground", children: [_jsxs("span", { children: [doneCt, "/", dayV.length, " visites"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Navigation, { size: 11 }), kmTotal.toFixed(1), " km"] }), _jsx("button", { onClick: () => { setView("daily"); setSelectedDay(day); }, className: "text-primary hover:underline", children: "D\u00E9tail" })] })] }), _jsx("div", { className: "divide-y divide-border", children: dayV.map((v) => {
                                                    const cfg = statusConfig[v.status];
                                                    const Icon = cfg.icon;
                                                    return (_jsxs("div", { className: "flex items-center gap-3 px-5 py-2.5", children: [_jsx(Icon, { size: 14, className: `${cfg.className} shrink-0 ${v.status === "in_progress" ? "animate-spin" : ""}` }), _jsx("span", { className: "text-xs text-muted-foreground w-10 shrink-0", children: v.time }), _jsx("span", { className: "text-sm text-foreground flex-1 truncate", children: v.patientName }), _jsx("span", { className: "text-xs text-muted-foreground", children: v.type })] }, v.id));
                                                }) })] }, day));
                                }) }))] })] })] }));
}
