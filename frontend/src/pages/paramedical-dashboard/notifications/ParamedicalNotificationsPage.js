import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { AlertTriangle, MessageSquare, Calendar, FileText, CheckCheck, Check, ChevronRight, BellOff, } from "lucide-react";
const typeConfig = {
    urgent: { label: "Urgent", icon: AlertTriangle, dot: "bg-red-500", bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
    doctor: { label: "Médecin", icon: MessageSquare, dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
    schedule: { label: "Planning", icon: Calendar, dot: "bg-amber-400", bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
    prescription: { label: "Ordonnance", icon: FileText, dot: "bg-violet-500", bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700" },
};
const tok = () => localStorage.getItem("megacare_token") ?? "";
const INITIAL = [];
export default function ParamedicalNotificationsPage() {
    const [notifs, setNotifs] = useState(INITIAL);
    const [filter, setFilter] = useState("all");
    useEffect(() => {
        fetch("/api/paramedical/notifications", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => setNotifs(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);
    const unreadCount = notifs.filter((n) => !n.read).length;
    const markRead = (id) => setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    const handleAct = (n) => {
        markRead(n.id);
        // In a real app this would navigate or open a modal
    };
    const filtered = notifs.filter((n) => filter === "all" || n.type === filter);
    const filters = [
        { key: "all", label: "Tout" },
        { key: "urgent", label: "Urgents" },
        { key: "doctor", label: "Médecins" },
        { key: "schedule", label: "Planning" },
        { key: "prescription", label: "Ordonnances" },
    ];
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Notifications" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: unreadCount > 0 ? (_jsxs("span", { className: "text-primary font-medium", children: [unreadCount, " non lue", unreadCount > 1 ? "s" : ""] })) : ("Tout est à jour") })] }), unreadCount > 0 && (_jsxs("button", { onClick: markAllRead, className: "flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition", children: [_jsx(CheckCheck, { size: 15 }), "Tout marquer comme lu"] }))] }), _jsx("main", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("div", { className: "max-w-2xl mx-auto space-y-5", children: [_jsx("div", { className: "flex flex-wrap gap-2", children: filters.map((f) => {
                                        const count = f.key === "all"
                                            ? notifs.filter((n) => !n.read).length
                                            : notifs.filter((n) => n.type === f.key && !n.read).length;
                                        return (_jsxs("button", { onClick: () => setFilter(f.key), className: `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition ${filter === f.key
                                                ? "bg-primary text-primary-foreground border-primary"
                                                : "bg-card border-border text-muted-foreground hover:border-primary/40"}`, children: [f.label, count > 0 && (_jsx("span", { className: `w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold ${filter === f.key ? "bg-white/30 text-white" : "bg-primary/10 text-primary"}`, children: count }))] }, f.key));
                                    }) }), filtered.length === 0 && (_jsxs("div", { className: "text-center py-16 text-muted-foreground", children: [_jsx(BellOff, { size: 36, className: "mx-auto mb-3 opacity-40" }), _jsx("p", { className: "text-sm", children: "Aucune notification dans cette cat\u00E9gorie" })] })), _jsx("div", { className: "space-y-2.5", children: filtered.map((n) => {
                                        const cfg = typeConfig[n.type];
                                        const Icon = cfg.icon;
                                        const isUrgent = n.type === "urgent";
                                        return (_jsx("div", { className: `rounded-xl border p-4 transition ${n.read
                                                ? "bg-card border-border opacity-70"
                                                : `${cfg.bg} ${cfg.border}`}`, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${n.read ? "bg-muted" : cfg.bg}`, children: _jsx(Icon, { size: 16, className: n.read ? "text-muted-foreground" : cfg.text }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: `text-sm font-semibold ${n.read ? "text-foreground" : cfg.text}`, children: n.title }), !n.read && _jsx("span", { className: `w-2 h-2 rounded-full ${cfg.dot} shrink-0` })] }), _jsx("span", { className: "text-xs text-muted-foreground shrink-0 whitespace-nowrap", children: n.time })] }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5 leading-snug", children: n.body }), _jsxs("div", { className: "flex items-center gap-2 mt-3", children: [isUrgent && !n.read && (_jsxs("button", { onClick: () => handleAct(n), className: "flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition", children: [_jsx(ChevronRight, { size: 12 }), "Intervenir"] })), !n.read && (_jsxs("button", { onClick: () => markRead(n.id), className: "flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition", children: [_jsx(Check, { size: 12 }), "Marquer lu"] })), n.read && (_jsxs("span", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [_jsx(Check, { size: 11 }), "Lu"] }))] })] })] }) }, n.id));
                                    }) })] }) })] })] }));
}
