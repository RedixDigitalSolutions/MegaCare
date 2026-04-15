import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Calendar, Clock, Plus, Edit2, X, Ban, CheckCircle2, Loader2, Users, BarChart3, } from "lucide-react";
const today = new Date().toISOString().slice(0, 10);
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
const statusConfig = {
    "Planifié": { bg: "bg-blue-100", text: "text-blue-700", icon: Calendar },
    "En cours": { bg: "bg-amber-100", text: "text-amber-700", icon: Loader2 },
    "Complété": { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    "Annulé": { bg: "bg-slate-100", text: "text-slate-600", icon: Ban },
};
const emptyForm = { patient: "", staff: "", date: today, time: "09:00", duration: "1h", status: "Planifié", notes: "" };
export default function SchedulePage() {
    const [visits, setVisits] = useState([]);
    const [filterDate, setFilterDate] = useState("today");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [cancelId, setCancelId] = useState(null);
    useEffect(() => {
        fetch("/api/medical-service/schedule", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then(d => setVisits(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);
    const filtered = visits.filter((v) => {
        if (filterDate === "today")
            return v.date === today;
        if (filterDate === "tomorrow")
            return v.date === tomorrow;
        return true;
    });
    const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (v) => {
        setEditingId(v.id);
        setForm({ patient: v.patient, staff: v.staff, date: v.date, time: v.time, duration: v.duration, status: v.status, notes: v.notes });
        setShowModal(true);
    };
    const saveVisit = async () => {
        if (!form.patient.trim() || !form.staff.trim())
            return;
        const url = editingId ? `/api/medical-service/schedule/${editingId}` : "/api/medical-service/schedule";
        const r = await fetch(url, {
            method: editingId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify(form),
        });
        const data = await r.json();
        if (editingId)
            setVisits(prev => prev.map(v => v.id === editingId ? data : v));
        else
            setVisits(prev => [...prev, data]);
        setShowModal(false);
    };
    const confirmCancel = async () => {
        if (cancelId !== null) {
            await fetch(`/api/medical-service/schedule/${cancelId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
                body: JSON.stringify({ status: "Annulé" }),
            });
            setVisits(prev => prev.map(v => v.id === cancelId ? { ...v, status: "Annulé" } : v));
        }
        setCancelId(null);
    };
    // Stats
    const todayVisits = visits.filter((v) => v.date === today);
    const weekVisits = visits.filter((v) => v.status !== "Annulé");
    const completedToday = todayVisits.filter((v) => v.status === "Complété").length;
    const inProgressToday = todayVisits.filter((v) => v.status === "En cours").length;
    const statsCards = [
        { label: "Visites aujourd'hui", value: todayVisits.length, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "En cours", value: inProgressToday, icon: Loader2, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Complétées aujourd'hui", value: completedToday, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        { label: "Total semaine", value: weekVisits.length, icon: BarChart3, color: "text-purple-500", bg: "bg-purple-50" },
    ];
    // Weekly summary — visits per day
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - d.getDay() + 1 + i);
        return d.toISOString().slice(0, 10);
    });
    const weeklyStats = daysOfWeek.map((d) => ({
        date: d,
        label: new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" }),
        count: visits.filter((v) => v.date === d && v.status !== "Annulé").length,
    }));
    const maxWeekly = Math.max(1, ...weeklyStats.map((w) => w.count));
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-h-screen overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Planification" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Visites \u00E0 domicile et interventions planifi\u00E9es" })] }), _jsxs("button", { onClick: openAdd, className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Plus, { size: 16 }), "Programmer Visite"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: statsCards.map((k) => {
                                    const Icon = k.icon;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(Icon, { size: 20, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label));
                                }) }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [_jsxs("div", { className: "xl:col-span-2 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [["today", "tomorrow", "all"].map((f) => (_jsx("button", { onClick: () => setFilterDate(f), className: `px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterDate === f ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`, children: f === "today" ? "Aujourd'hui" : f === "tomorrow" ? "Demain" : "Toutes" }, f))), _jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [filtered.length, " visite", filtered.length !== 1 ? "s" : ""] })] }), filtered.length === 0 && (_jsxs("div", { className: "text-center py-16 bg-card rounded-xl border border-border", children: [_jsx(Calendar, { size: 40, className: "text-muted-foreground/30 mx-auto mb-3" }), _jsx("p", { className: "text-muted-foreground", children: "Aucune visite programm\u00E9e" })] })), _jsx("div", { className: "space-y-3", children: filtered.map((v) => {
                                                    const cfg = statusConfig[v.status];
                                                    const StatusIcon = cfg.icon;
                                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: v.patient }), _jsxs("p", { className: "text-sm text-muted-foreground flex items-center gap-1 mt-0.5", children: [_jsx(Users, { size: 12 }), " ", v.staff] })] }), _jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`, children: [_jsx(StatusIcon, { size: 11 }), v.status] })] }), _jsxs("div", { className: "flex flex-wrap gap-4 text-xs text-muted-foreground mb-4", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 12 }), " ", v.date] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), " ", v.time, " \u00B7 ", v.duration] }), v.notes && _jsxs("span", { className: "text-foreground/70 italic", children: ["\"", v.notes, "\""] })] }), v.status !== "Annulé" && v.status !== "Complété" && (_jsxs("div", { className: "flex items-center gap-2 pt-3 border-t border-border", children: [_jsxs("button", { onClick: () => openEdit(v), className: "flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-xs font-medium", children: [_jsx(Edit2, { size: 12 }), " Modifier"] }), _jsxs("button", { onClick: () => setCancelId(v.id), className: "flex items-center gap-1.5 px-3 py-1.5 border border-border text-muted-foreground rounded-lg hover:bg-muted transition text-xs font-medium", children: [_jsx(Ban, { size: 12 }), " Annuler"] })] }))] }, v.id));
                                                }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [_jsxs("h3", { className: "font-semibold text-foreground mb-4 flex items-center gap-2", children: [_jsx(BarChart3, { size: 16, className: "text-muted-foreground" }), "Semaine en cours"] }), _jsx("div", { className: "space-y-2", children: weeklyStats.map((ws) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `text-xs w-16 shrink-0 capitalize ${ws.date === today ? "font-bold text-primary" : "text-muted-foreground"}`, children: ws.label }), _jsx("div", { className: "flex-1 bg-muted rounded-full h-2 overflow-hidden", children: _jsx("div", { className: `h-2 rounded-full transition-all ${ws.date === today ? "bg-primary" : "bg-primary/40"}`, style: { width: `${(ws.count / maxWeekly) * 100}%` } }) }), _jsx("span", { className: "text-xs font-semibold text-foreground w-4 text-right", children: ws.count })] }, ws.date))) })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-5 space-y-3", children: [_jsx("h3", { className: "font-semibold text-foreground", children: "R\u00E9sum\u00E9 du jour" }), ["Planifié", "En cours", "Complété", "Annulé"].map((s) => {
                                                        const count = todayVisits.filter((v) => v.status === s).length;
                                                        const cfg = statusConfig[s];
                                                        return (_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: `inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text}`, children: s }), _jsx("span", { className: "font-semibold text-foreground", children: count })] }, s));
                                                    })] })] })] })] })] }), showModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowModal(false) }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-bold text-foreground", children: editingId ? "Modifier la visite" : "Programmer une visite" }), _jsx("button", { onClick: () => setShowModal(false), className: "p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Patient *" }), _jsx("input", { value: form.patient, onChange: (e) => setForm((f) => ({ ...f, patient: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Fatima Ben Ali" })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Personnel assign\u00E9 *" }), _jsx("input", { value: form.staff, onChange: (e) => setForm((f) => ({ ...f, staff: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Samir Khalifa" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Date" }), _jsx("input", { type: "date", value: form.date, onChange: (e) => setForm((f) => ({ ...f, date: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Heure" }), _jsx("input", { type: "time", value: form.time, onChange: (e) => setForm((f) => ({ ...f, time: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Dur\u00E9e" }), _jsx("select", { value: form.duration, onChange: (e) => setForm((f) => ({ ...f, duration: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: ["30min", "45min", "1h", "1h30", "2h", "2h30", "3h"].map((d) => _jsx("option", { children: d }, d)) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Statut" }), _jsxs("select", { value: form.status, onChange: (e) => setForm((f) => ({ ...f, status: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: [_jsx("option", { children: "Planifi\u00E9" }), _jsx("option", { children: "En cours" }), _jsx("option", { children: "Compl\u00E9t\u00E9" }), _jsx("option", { children: "Annul\u00E9" })] })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Notes" }), _jsx("input", { value: form.notes, onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Contr\u00F4le pansement, injection\u2026" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { onClick: () => setShowModal(false), className: "px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: saveVisit, disabled: !form.patient.trim() || !form.staff.trim(), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50", children: editingId ? "Enregistrer" : "Programmer" })] })] })] })), cancelId !== null && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setCancelId(null) }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center", children: _jsx(Ban, { size: 18, className: "text-amber-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-foreground", children: "Annuler cette visite ?" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "La visite sera marqu\u00E9e comme annul\u00E9e." })] })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: () => setCancelId(null), className: "px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition", children: "Retour" }), _jsx("button", { onClick: confirmCancel, className: "px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition", children: "Confirmer" })] })] })] }))] }));
}
