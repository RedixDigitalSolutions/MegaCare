import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Search, Plus, Edit2, Trash2, X, Users, UserCheck, AlertCircle, CheckCircle2, } from "lucide-react";
const statusConfig = {
    "En cours": { label: "En cours", bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    "Suspendu": { label: "Suspendu", bg: "bg-amber-100", text: "text-amber-700", icon: AlertCircle },
    "Terminé": { label: "Terminé", bg: "bg-slate-100", text: "text-slate-600", icon: UserCheck },
};
const emptyForm = { name: "", age: "", condition: "", status: "En cours", startDate: "", nurse: "", phone: "" };
export default function MedicalServicePatientsPage() {
    const [patients, setPatients] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteId, setDeleteId] = useState(null);
    useEffect(() => {
        fetch("/api/medical-service/patients", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then(d => setPatients(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);
    const filtered = patients.filter((p) => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.condition.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || p.status === filterStatus;
        return matchSearch && matchStatus;
    });
    const openAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    };
    const openEdit = (p) => {
        setEditingId(p.id);
        setForm({ name: p.name, age: String(p.age), condition: p.condition, status: p.status, startDate: p.startDate, nurse: p.nurse, phone: p.phone });
        setShowModal(true);
    };
    const savePatient = async () => {
        if (!form.name.trim() || !form.condition.trim())
            return;
        const url = editingId ? `/api/medical-service/patients/${editingId}` : "/api/medical-service/patients";
        const r = await fetch(url, {
            method: editingId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify({ ...form, age: Number(form.age) }),
        });
        const data = await r.json();
        if (editingId)
            setPatients(prev => prev.map(p => p.id === editingId ? data : p));
        else
            setPatients(prev => [...prev, data]);
        setShowModal(false);
    };
    const confirmDelete = async () => {
        if (deleteId !== null) {
            await fetch(`/api/medical-service/patients/${deleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } });
            setPatients(prev => prev.filter(p => p.id !== deleteId));
        }
        setDeleteId(null);
    };
    const kpis = [
        { label: "Total patients", value: patients.length, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "En cours", value: patients.filter((p) => p.status === "En cours").length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        { label: "Suspendus", value: patients.filter((p) => p.status === "Suspendu").length, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Terminés", value: patients.filter((p) => p.status === "Terminé").length, icon: UserCheck, color: "text-slate-500", bg: "bg-slate-50" },
    ];
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-h-screen overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Patients" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Gestion des hospitalisations \u00E0 domicile" })] }), _jsxs("button", { onClick: openAdd, className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Plus, { size: 16 }), "Ajouter Patient"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((k) => {
                                    const Icon = k.icon;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(Icon, { size: 20, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label));
                                }) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Rechercher par nom ou condition\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsx("div", { className: "flex gap-2", children: ["all", "En cours", "Suspendu", "Terminé"].map((s) => (_jsx("button", { onClick: () => setFilterStatus(s), className: `px-3 py-2 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`, children: s === "all" ? "Tous" : s }, s))) })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-muted/50 border-b border-border", children: _jsx("tr", { children: ["Patient", "Âge", "Condition", "Infirmier", "Statut", "Depuis", "Téléphone", "Actions"].map((h) => (_jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap", children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-border", children: filtered.map((p) => {
                                                        const cfg = statusConfig[p.status];
                                                        const StatusIcon = cfg.icon;
                                                        return (_jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [_jsx("td", { className: "px-4 py-3 font-medium text-foreground whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary", children: p.name.split(" ").map((n) => n[0]).join("").slice(0, 2) }), p.name] }) }), _jsxs("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: [p.age, " ans"] }), _jsx("td", { className: "px-4 py-3 text-muted-foreground", children: p.condition }), _jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: p.nurse }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`, children: [_jsx(StatusIcon, { size: 11 }), cfg.label] }) }), _jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: p.startDate }), _jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: p.phone }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => openEdit(p), className: "p-1.5 rounded-lg hover:bg-primary/10 text-primary transition", title: "Modifier", children: _jsx(Edit2, { size: 15 }) }), _jsx("button", { onClick: () => setDeleteId(p.id), className: "p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition", title: "Supprimer", children: _jsx(Trash2, { size: 15 }) })] }) })] }, p.id));
                                                    }) })] }) }), filtered.length === 0 && (_jsxs("div", { className: "text-center py-16", children: [_jsx(Users, { size: 40, className: "text-muted-foreground/30 mx-auto mb-3" }), _jsx("p", { className: "text-muted-foreground", children: "Aucun patient trouv\u00E9" })] }))] })] })] }), showModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowModal(false) }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-bold text-foreground", children: editingId ? "Modifier le patient" : "Ajouter un patient" }), _jsx("button", { onClick: () => setShowModal(false), className: "p-1.5 hover:bg-muted rounded-lg transition text-muted-foreground", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Nom complet *" }), _jsx("input", { value: form.name, onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Fatima Ben Ali" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "\u00C2ge" }), _jsx("input", { type: "number", value: form.age, onChange: (e) => setForm((f) => ({ ...f, age: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "65", min: 0, max: 120 })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Statut" }), _jsxs("select", { value: form.status, onChange: (e) => setForm((f) => ({ ...f, status: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: [_jsx("option", { children: "En cours" }), _jsx("option", { children: "Suspendu" }), _jsx("option", { children: "Termin\u00E9" })] })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Condition / Motif *" }), _jsx("input", { value: form.condition, onChange: (e) => setForm((f) => ({ ...f, condition: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Suivi post-op\u00E9ratoire" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Infirmier assign\u00E9" }), _jsx("input", { value: form.nurse, onChange: (e) => setForm((f) => ({ ...f, nurse: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Samir Khalifa" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "T\u00E9l\u00E9phone" }), _jsx("input", { value: form.phone, onChange: (e) => setForm((f) => ({ ...f, phone: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "22 123 456" })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Date d'entr\u00E9e" }), _jsx("input", { type: "date", value: form.startDate, onChange: (e) => setForm((f) => ({ ...f, startDate: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { onClick: () => setShowModal(false), className: "px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: savePatient, disabled: !form.name.trim() || !form.condition.trim(), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed", children: editingId ? "Enregistrer" : "Ajouter" })] })] })] })), deleteId !== null && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setDeleteId(null) }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center", children: _jsx(Trash2, { size: 18, className: "text-red-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-foreground", children: "Supprimer le patient" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Cette action est irr\u00E9versible." })] })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: () => setDeleteId(null), className: "px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: confirmDelete, className: "px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition", children: "Supprimer" })] })] })] }))] }));
}
