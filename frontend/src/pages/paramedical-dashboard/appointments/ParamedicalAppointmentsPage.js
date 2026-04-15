import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { Plus, Search, Calendar, Clock, Edit2, X, Home, Building2, Filter, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const initialAppointments = [];
const statusColors = {
    "Confirmé": "bg-green-100 text-green-700",
    "En attente": "bg-amber-100 text-amber-700",
    "Annulé": "bg-red-100 text-red-700",
};
const careTypes = [
    "Soins infirmiers", "Kinésithérapie", "Pansement", "Injection",
    "Perfusion", "Prise de sang", "Massage thérapeutique", "Rééducation",
];
const emptyForm = {
    patient: "", type: careTypes[0], date: "", time: "",
    location: "Domicile", status: "En attente", notes: "",
};
export default function ParamedicalAppointmentsPage() {
    const [appointments, setAppointments] = useState(initialAppointments);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Tous");
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    useEffect(() => {
        fetch("/api/paramedical/appointments", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => setAppointments(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);
    const filtered = appointments.filter((a) => {
        const matchSearch = a.patient.toLowerCase().includes(search.toLowerCase()) ||
            a.type.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "Tous" || a.status === filterStatus;
        return matchSearch && matchStatus;
    });
    const openAdd = () => {
        setEditId(null);
        setForm(emptyForm);
        setShowModal(true);
    };
    const openEdit = (a) => {
        setEditId(a.id);
        setForm({ patient: a.patient, type: a.type, date: a.date, time: a.time, location: a.location, status: a.status, notes: a.notes ?? "" });
        setShowModal(true);
    };
    const handleSubmit = async () => {
        if (!form.patient || !form.date || !form.time)
            return;
        if (editId !== null) {
            const r = await fetch(`/api/paramedical/appointments/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
                body: JSON.stringify(form),
            }).catch(() => null);
            if (r && r.ok) {
                const data = await r.json();
                setAppointments((prev) => prev.map((a) => (a.id === editId ? data : a)));
            }
        }
        else {
            const r = await fetch("/api/paramedical/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
                body: JSON.stringify(form),
            }).catch(() => null);
            if (r && r.ok) {
                const data = await r.json();
                setAppointments((prev) => [...prev, data]);
            }
        }
        setShowModal(false);
    };
    const statusCounts = {
        Tous: appointments.length,
        Confirmé: appointments.filter((a) => a.status === "Confirmé").length,
        "En attente": appointments.filter((a) => a.status === "En attente").length,
        Annulé: appointments.filter((a) => a.status === "Annulé").length,
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Rendez-vous" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "G\u00E9rez vos consultations et visites \u00E0 domicile" })] }), _jsxs("button", { onClick: openAdd, className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition", children: [_jsx(Plus, { size: 15 }), "Nouveau rendez-vous"] })] }) }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-5", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: ["Tous", "Confirmé", "En attente", "Annulé"].map((s) => (_jsxs("button", { onClick: () => setFilterStatus(s), className: `rounded-xl border p-3 text-left transition ${filterStatus === s
                                        ? "border-primary bg-primary/5"
                                        : "border-border bg-card hover:border-primary/40"}`, children: [_jsx("p", { className: "text-xl font-bold text-foreground", children: statusCounts[s] }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s })] }, s))) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 16 }), _jsx("input", { type: "text", placeholder: "Rechercher patient ou type de soin...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { size: 15, className: "text-muted-foreground shrink-0" }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: [_jsx("option", { value: "Tous", children: "Tous les statuts" }), _jsx("option", { value: "Confirm\u00E9", children: "Confirm\u00E9" }), _jsx("option", { value: "En attente", children: "En attente" }), _jsx("option", { value: "Annul\u00E9", children: "Annul\u00E9" })] })] })] }), _jsx("div", { className: "space-y-3", children: filtered.length === 0 ? (_jsx("div", { className: "bg-card rounded-xl border border-border p-10 text-center text-muted-foreground text-sm", children: "Aucun rendez-vous trouv\u00E9." })) : (filtered.map((a) => (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex flex-col sm:flex-row sm:items-center gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("p", { className: "font-semibold text-sm text-foreground", children: a.patient }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[a.status]}`, children: a.status })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: a.type })] }), _jsxs("div", { className: "flex flex-wrap gap-4 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { size: 13 }), new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { size: 13 }), a.time] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [a.location === "Domicile" ? _jsx(Home, { size: 13 }) : _jsx(Building2, { size: 13 }), a.location] })] }), _jsxs("button", { onClick: () => openEdit(a), className: "flex items-center gap-1.5 px-3 py-1.5 text-xs border border-border rounded-lg hover:border-primary hover:text-primary transition shrink-0", children: [_jsx(Edit2, { size: 13 }), "Modifier"] })] }, a.id)))) })] })] }), showModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm", children: _jsxs("div", { className: "bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [_jsx("h2", { className: "font-semibold text-foreground", children: editId !== null ? "Modifier le rendez-vous" : "Nouveau rendez-vous" }), _jsx("button", { onClick: () => setShowModal(false), className: "p-1.5 text-muted-foreground hover:text-foreground transition", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "px-6 py-5 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Patient" }), _jsx("input", { type: "text", placeholder: "Nom du patient", value: form.patient, onChange: (e) => setForm({ ...form, patient: e.target.value }), className: "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Type de soin" }), _jsx("select", { value: form.type, onChange: (e) => setForm({ ...form, type: e.target.value }), className: "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: careTypes.map((t) => _jsx("option", { children: t }, t)) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Date" }), _jsx("input", { type: "date", value: form.date, onChange: (e) => setForm({ ...form, date: e.target.value }), className: "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Heure" }), _jsx("input", { type: "time", value: form.time, onChange: (e) => setForm({ ...form, time: e.target.value }), className: "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Lieu" }), _jsxs("select", { value: form.location, onChange: (e) => setForm({ ...form, location: e.target.value }), className: "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: [_jsx("option", { value: "Domicile", children: "Domicile" }), _jsx("option", { value: "Cabinet", children: "Cabinet" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Statut" }), _jsxs("select", { value: form.status, onChange: (e) => setForm({ ...form, status: e.target.value }), className: "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: [_jsx("option", { value: "Confirm\u00E9", children: "Confirm\u00E9" }), _jsx("option", { value: "En attente", children: "En attente" }), _jsx("option", { value: "Annul\u00E9", children: "Annul\u00E9" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Notes (optionnel)" }), _jsx("textarea", { rows: 2, placeholder: "Observations...", value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }), className: "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" })] })] }), _jsxs("div", { className: "flex gap-3 px-6 py-4 border-t border-border", children: [_jsx("button", { onClick: () => setShowModal(false), className: "flex-1 px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: handleSubmit, disabled: !form.patient || !form.date || !form.time, className: "flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed", children: editId !== null ? "Enregistrer" : "Ajouter" })] })] }) }))] }));
}
