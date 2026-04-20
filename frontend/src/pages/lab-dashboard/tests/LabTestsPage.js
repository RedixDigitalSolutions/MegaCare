import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import { Search, Plus, X, CheckCircle2, Clock, AlertCircle, FlaskConical, Edit2, } from "lucide-react";
const statusConfig = {
    Complété: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle2 },
    "En cours": { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
    "En attente": {
        bg: "bg-amber-100",
        text: "text-amber-700",
        icon: AlertCircle,
    },
};
const emptyForm = {
    patient: "",
    testType: "",
    doctor: "",
    priority: "Normal",
    date: "",
    notes: "",
};
export default function LabTestsPage() {
    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPriority, setFilterPriority] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const token = () => localStorage.getItem("megacare_token") ?? "";
    useEffect(() => {
        fetch("/api/lab/tests", {
            headers: { Authorization: `Bearer ${token()}` },
        })
            .then((r) => r.json())
            .then((json) => setTests(Array.isArray(json) ? json : (json.data ?? [])))
            .catch(() => { });
    }, []);
    const filtered = tests.filter((t) => {
        const q = search.toLowerCase();
        const matchSearch = t.patient.toLowerCase().includes(q) ||
            t.testType.toLowerCase().includes(q);
        const matchStatus = filterStatus === "all" || t.status === filterStatus;
        const matchPriority = filterPriority === "all" || t.priority === filterPriority;
        return matchSearch && matchStatus && matchPriority;
    });
    const kpis = [
        {
            label: "Total",
            value: tests.length,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
        },
        {
            label: "En attente",
            value: tests.filter((t) => t.status === "En attente").length,
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
        {
            label: "En cours",
            value: tests.filter((t) => t.status === "En cours").length,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            label: "Complétés",
            value: tests.filter((t) => t.status === "Complété").length,
            color: "text-green-500",
            bg: "bg-green-50",
        },
        {
            label: "Urgents",
            value: tests.filter((t) => t.priority === "Urgent").length,
            color: "text-red-500",
            bg: "bg-red-50",
        },
    ];
    function openAdd() {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    }
    function openEdit(t) {
        setEditingId(t.id);
        setForm({
            patient: t.patient,
            testType: t.testType,
            doctor: t.doctor,
            priority: t.priority,
            date: t.date,
            notes: t.notes,
        });
        setShowModal(true);
    }
    function markComplete(id) {
        fetch(`/api/lab/tests/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token()}`,
            },
            body: JSON.stringify({ status: "Complété" }),
        })
            .then((r) => r.json())
            .then((updated) => setTests((prev) => prev.map((t) => (t.id === id ? updated : t))))
            .catch(() => { });
    }
    function saveForm() {
        if (!form.patient.trim() || !form.testType.trim())
            return;
        if (editingId !== null) {
            fetch(`/api/lab/tests/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify(form),
            })
                .then((r) => r.json())
                .then((updated) => setTests((prev) => prev.map((t) => (t.id === editingId ? updated : t))))
                .catch(() => { });
        }
        else {
            fetch("/api/lab/tests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify({ ...form, status: "En attente" }),
            })
                .then((r) => r.json())
                .then((created) => setTests((prev) => [created, ...prev]))
                .catch(() => { });
        }
        setShowModal(false);
    }
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(LabDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Analyses" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Gestion des demandes d'analyse par patient" })] }), _jsxs("button", { onClick: openAdd, className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Plus, { size: 16 }), " Nouvelle analyse"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4", children: kpis.map((k) => (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3", children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(FlaskConical, { size: 18, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label))) }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Rechercher patient ou type d'analyse\u2026", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [["all", "En attente", "En cours", "Complété"].map((s) => (_jsx("button", { onClick: () => setFilterStatus(s), className: `px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterStatus === s ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`, children: s === "all" ? "Tous statuts" : s }, s))), _jsx("button", { onClick: () => setFilterPriority(filterPriority === "Urgent" ? "all" : "Urgent"), className: `px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterPriority === "Urgent" ? "bg-red-500 text-white" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`, children: "Urgents seulement" })] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-muted/50 border-b border-border", children: _jsx("tr", { children: [
                                                            "Patient",
                                                            "Type d'analyse",
                                                            "Médecin prescripteur",
                                                            "Priorité",
                                                            "Statut",
                                                            "Date",
                                                            "Notes",
                                                            "Actions",
                                                        ].map((h) => (_jsx("th", { className: "px-4 py-3 text-left font-semibold text-foreground whitespace-nowrap", children: h }, h))) }) }), _jsx("tbody", { className: "divide-y divide-border", children: filtered.map((t) => {
                                                        const cfg = statusConfig[t.status];
                                                        const StatusIcon = cfg.icon;
                                                        return (_jsxs("tr", { className: "hover:bg-muted/30 transition-colors", children: [_jsx("td", { className: "px-4 py-3 font-medium text-foreground whitespace-nowrap", children: t.patient }), _jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: t.testType }), _jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: t.doctor }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: _jsx("span", { className: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${t.priority === "Urgent" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"}`, children: t.priority }) }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: _jsxs("span", { className: `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`, children: [_jsx(StatusIcon, { size: 11 }), t.status] }) }), _jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: t.date }), _jsx("td", { className: "px-4 py-3 text-muted-foreground italic text-xs max-w-[140px] truncate", children: t.notes }), _jsx("td", { className: "px-4 py-3 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center gap-1", children: [t.status !== "Complété" && (_jsx("button", { onClick: () => markComplete(t.id), title: "Marquer comme compl\u00E9t\u00E9", className: "p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition", children: _jsx(CheckCircle2, { size: 14 }) })), _jsx("button", { onClick: () => openEdit(t), className: "p-1.5 rounded-lg hover:bg-primary/10 text-primary transition", children: _jsx(Edit2, { size: 14 }) })] }) })] }, t.id));
                                                    }) })] }) }), filtered.length === 0 && (_jsxs("div", { className: "text-center py-16", children: [_jsx(FlaskConical, { size: 36, className: "mx-auto mb-2 text-muted-foreground/30" }), _jsx("p", { className: "text-muted-foreground", children: "Aucune analyse trouv\u00E9e" })] }))] })] })] }), showModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowModal(false) }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-bold text-foreground", children: editingId ? "Modifier l'analyse" : "Nouvelle analyse" }), _jsx("button", { onClick: () => setShowModal(false), className: "p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [[
                                        {
                                            label: "Patient *",
                                            key: "patient",
                                            placeholder: "Nom du patient",
                                        },
                                        {
                                            label: "Type d'analyse *",
                                            key: "testType",
                                            placeholder: "Ex: Glycémie",
                                        },
                                        {
                                            label: "Médecin prescripteur",
                                            key: "doctor",
                                            placeholder: "Dr. Nom",
                                        },
                                        { label: "Date", key: "date", type: "date", placeholder: "" },
                                    ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: f.label }), _jsx("input", { type: f.type ?? "text", placeholder: f.placeholder, value: form[f.key], onChange: (e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }, f.key))), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Priorit\u00E9" }), _jsxs("select", { value: form.priority, onChange: (e) => setForm((p) => ({
                                                    ...p,
                                                    priority: e.target.value,
                                                })), className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: [_jsx("option", { children: "Normal" }), _jsx("option", { children: "Urgent" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-muted-foreground mb-1", children: "Notes" }), _jsx("input", { value: form.notes, onChange: (e) => setForm((p) => ({ ...p, notes: e.target.value })), placeholder: "\u00C0 jeun, instructions\u2026", className: "w-full px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-2", children: [_jsx("button", { onClick: () => setShowModal(false), className: "px-4 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: saveForm, disabled: !form.patient.trim() || !form.testType.trim(), className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50", children: editingId ? "Enregistrer" : "Créer" })] })] })] }))] }));
}
