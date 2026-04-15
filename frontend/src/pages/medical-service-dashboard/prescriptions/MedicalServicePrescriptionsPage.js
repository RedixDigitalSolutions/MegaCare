import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Search, Plus, Edit2, Trash2, X, FileText, CheckCircle2, Clock, AlertCircle, } from "lucide-react";
const statusConfig = {
    "Active": { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    "Terminée": { bg: "bg-slate-100", text: "text-slate-600", icon: FileText },
    "En attente": { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
};
const emptyForm = { patient: "", doctor: "", date: "", medications: "", status: "Active", notes: "" };
export default function MedicalServicePrescriptionsPage() {
    const [rxList, setRxList] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteId, setDeleteId] = useState(null);
    useEffect(() => {
        fetch("/api/medical-service/prescriptions", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then(d => setRxList(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);
    const filtered = rxList.filter((r) => {
        const matchSearch = r.patient.toLowerCase().includes(search.toLowerCase()) ||
            r.medications.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || r.status === filterStatus;
        return matchSearch && matchStatus;
    });
    const openAdd = () => { setEditingId(null); setForm(emptyForm); setShowModal(true); };
    const openEdit = (r) => {
        setEditingId(r.id);
        setForm({ patient: r.patient, doctor: r.doctor, date: r.date, medications: r.medications, status: r.status, notes: r.notes });
        setShowModal(true);
    };
    const saveRx = async () => {
        if (!form.patient.trim() || !form.medications.trim())
            return;
        const url = editingId ? `/api/medical-service/prescriptions/${editingId}` : "/api/medical-service/prescriptions";
        const r = await fetch(url, {
            method: editingId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify({ ...form, date: form.date || new Date().toISOString().slice(0, 10) }),
        });
        const data = await r.json();
        if (editingId)
            setRxList(prev => prev.map(r => r.id === editingId ? data : r));
        else
            setRxList(prev => [...prev, data]);
        setShowModal(false);
    };
    const confirmDelete = async () => {
        if (deleteId !== null) {
            await fetch(`/api/medical-service/prescriptions/${deleteId}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } });
            setRxList(prev => prev.filter(r => r.id !== deleteId));
        }
        setDeleteId(null);
    };
    const kpis = [
        { label: "Total ordonnances", value: rxList.length, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Actives", value: rxList.filter((r) => r.status === "Active").length, color: "text-green-500", bg: "bg-green-50" },
        { label: "En attente", value: rxList.filter((r) => r.status === "En attente").length, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "Terminées", value: rxList.filter((r) => r.status === "Terminée").length, color: "text-slate-500", bg: "bg-slate-50" },
    ];
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Ordonnances" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Prescriptions des patients en hospitalisation" })] }), _jsxs("button", { onClick: openAdd, className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Plus, { size: 16 }), " Cr\u00E9er Ordonnance"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((k) => (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(FileText, { size: 20, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label))) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Rechercher par patient ou m\u00E9dicament\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsx("div", { className: "flex gap-2", children: ["all", "Active", "En attente", "Terminée"].map((s) => (_jsx("button", { onClick: () => setFilterStatus(s), className: `px-3 py-2 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`, children: s === "all" ? "Toutes" : s }, s))) })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-muted/50 border-b border-border", children: _jsx("tr", { children: ["Patient", "Médecin", "Date", "Médicaments", "Statut", "Notes", "Actions"].map((h) => (_jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap", children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-border", children: filtered.map((r) => {
                                                        const cfg = statusConfig[r.status];
                                                        const StatusIcon = cfg.icon;
                                                        return (_jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [_jsx("td", { className: "px-4 py-3 font-medium text-foreground whitespace-nowrap", children: r.patient }), _jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: r.doctor }), _jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: r.date }), _jsx("td", { className: "px-4 py-3 text-muted-foreground max-w-[200px] truncate", children: r.medications }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`, children: [_jsx(StatusIcon, { size: 11 }), r.status] }) }), _jsx("td", { className: "px-4 py-3 text-muted-foreground italic text-xs max-w-[140px] truncate", children: r.notes }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => openEdit(r), className: "p-1.5 rounded-lg hover:bg-primary/10 text-primary transition", children: _jsx(Edit2, { size: 14 }) }), _jsx("button", { onClick: () => setDeleteId(r.id), className: "p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition", children: _jsx(Trash2, { size: 14 }) })] }) })] }, r.id));
                                                    }) })] }) }), filtered.length === 0 && (_jsxs("div", { className: "text-center py-16", children: [_jsx(AlertCircle, { size: 36, className: "mx-auto mb-2 text-muted-foreground/30" }), _jsx("p", { className: "text-muted-foreground", children: "Aucune ordonnance trouv\u00E9e" })] }))] })] })] }), showModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowModal(false) }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-bold text-foreground", children: editingId ? "Modifier l'ordonnance" : "Nouvelle ordonnance" }), _jsx("button", { onClick: () => setShowModal(false), className: "p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Patient *" }), _jsx("input", { value: form.patient, onChange: (e) => setForm((f) => ({ ...f, patient: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Fatima Ben Ali" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "M\u00E9decin" }), _jsx("input", { value: form.doctor, onChange: (e) => setForm((f) => ({ ...f, doctor: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Dr. Mansouri" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Date" }), _jsx("input", { type: "date", value: form.date, onChange: (e) => setForm((f) => ({ ...f, date: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Statut" }), _jsxs("select", { value: form.status, onChange: (e) => setForm((f) => ({ ...f, status: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: [_jsx("option", { children: "Active" }), _jsx("option", { children: "En attente" }), _jsx("option", { children: "Termin\u00E9e" })] })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "M\u00E9dicaments *" }), _jsx("input", { value: form.medications, onChange: (e) => setForm((f) => ({ ...f, medications: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Parac\u00E9tamol 1g, Amoxicilline 500mg" })] }), _jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Notes posologie" }), _jsx("input", { value: form.notes, onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "3x/jour apr\u00E8s repas" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { onClick: () => setShowModal(false), className: "px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: saveRx, disabled: !form.patient.trim() || !form.medications.trim(), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50", children: editingId ? "Enregistrer" : "Créer" })] })] })] })), deleteId !== null && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setDeleteId(null) }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center", children: _jsx(Trash2, { size: 18, className: "text-red-600" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-foreground", children: "Supprimer l'ordonnance" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Action irr\u00E9versible." })] })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: () => setDeleteId(null), className: "px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: confirmDelete, className: "px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition", children: "Supprimer" })] })] })] }))] }));
}
