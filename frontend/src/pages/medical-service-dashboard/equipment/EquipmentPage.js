import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Plus, Search, X, Wrench, Package, CheckCircle2, AlertCircle, Edit2, Trash2 } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const statusConfig = {
    Disponible: { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
    "En utilisation": { color: "text-blue-600", bg: "bg-blue-100", icon: Package },
    Maintenance: { color: "text-amber-600", bg: "bg-amber-100", icon: Wrench },
};
const emptyForm = { name: "", type: "", serial: "", status: "Disponible", patient: "", maintenanceDate: "", location: "" };
export default function EquipmentPage() {
    const [items, setItems] = useState([]);
    const [filter, setFilter] = useState("Tous");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState(null);
    useEffect(() => {
        fetch("/api/medical-service/equipment", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then(d => setItems(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);
    const filtered = items.filter((i) => {
        const matchFilter = filter === "Tous" || i.status === filter;
        const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.serial.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });
    const kpis = [
        { label: "Total équipements", value: items.length, color: "text-indigo-500", bg: "bg-indigo-50", icon: Package },
        { label: "Disponibles", value: items.filter((i) => i.status === "Disponible").length, color: "text-green-500", bg: "bg-green-50", icon: CheckCircle2 },
        { label: "En utilisation", value: items.filter((i) => i.status === "En utilisation").length, color: "text-blue-500", bg: "bg-blue-50", icon: Package },
        { label: "En maintenance", value: items.filter((i) => i.status === "Maintenance").length, color: "text-amber-500", bg: "bg-amber-50", icon: Wrench },
    ];
    function openAdd() { setEditing(null); setForm(emptyForm); setShowModal(true); }
    function openEdit(item) {
        setEditing(item);
        setForm({ name: item.name, type: item.type, serial: item.serial, status: item.status, patient: item.patient, maintenanceDate: item.maintenanceDate, location: item.location });
        setShowModal(true);
    }
    async function saveForm() {
        if (!form.name.trim() || !form.serial.trim())
            return;
        const url = editing ? `/api/medical-service/equipment/${editing.id}` : "/api/medical-service/equipment";
        const r = await fetch(url, {
            method: editing ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify(form),
        });
        const data = await r.json();
        if (editing)
            setItems(prev => prev.map(i => i.id === editing.id ? data : i));
        else
            setItems(prev => [...prev, data]);
        setShowModal(false);
    }
    async function confirmDelete() {
        if (deleteTarget) {
            await fetch(`/api/medical-service/equipment/${deleteTarget.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } });
            setItems(prev => prev.filter(i => i.id !== deleteTarget.id));
            setDeleteTarget(null);
        }
    }
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "\u00C9quipements" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Inventaire et suivi du mat\u00E9riel m\u00E9dical" })] }), _jsxs("button", { onClick: openAdd, className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Plus, { size: 16 }), " Ajouter \u00E9quipement"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((k) => {
                                    const Icon = k.icon;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(Icon, { size: 20, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label));
                                }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [["Tous", "Disponible", "En utilisation", "Maintenance"].map((f) => (_jsx("button", { onClick: () => setFilter(f), className: `px-3 py-1.5 rounded-lg text-sm font-medium transition ${filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`, children: f }, f))), _jsxs("div", { className: "relative ml-auto", children: [_jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Nom ou num\u00E9ro s\u00E9rie\u2026", className: "pl-9 pr-4 py-1.5 border border-border rounded-lg bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-56" })] })] }), _jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-border", children: ["Équipement", "Série", "Type", "Statut", "Patient assigné", "Prochaine maintenance", "Lieu", "Actions"].map((h) => (_jsx("th", { className: "px-4 py-3 text-left text-muted-foreground font-medium whitespace-nowrap", children: h }, h))) }) }), _jsx("tbody", { children: filtered.map((item) => {
                                                    const cfg = statusConfig[item.status];
                                                    const StatusIcon = cfg.icon;
                                                    return (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/30 transition", children: [_jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: item.name }), _jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono", children: item.serial }), _jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.type }), _jsx("td", { className: "px-4 py-3", children: _jsxs("span", { className: `flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${cfg.bg} ${cfg.color}`, children: [_jsx(StatusIcon, { size: 11 }), item.status] }) }), _jsx("td", { className: "px-4 py-3 text-foreground", children: item.patient }), _jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.maintenanceDate }), _jsx("td", { className: "px-4 py-3 text-muted-foreground", children: item.location }), _jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => openEdit(item), className: "p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground", children: _jsx(Edit2, { size: 14 }) }), _jsx("button", { onClick: () => setDeleteTarget(item), className: "p-1.5 rounded-lg hover:bg-red-50 transition text-muted-foreground hover:text-red-500", children: _jsx(Trash2, { size: 14 }) })] }) })] }, item.id));
                                                }) })] }) }) })] })] }), showModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [_jsx("h2", { className: "font-semibold text-foreground", children: editing ? "Modifier équipement" : "Ajouter un équipement" }), _jsx("button", { onClick: () => setShowModal(false), className: "p-1.5 rounded-lg hover:bg-muted transition", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [[
                                    { label: "Nom", key: "name", type: "text", placeholder: "Ex: Tensiomètre" },
                                    { label: "Type", key: "type", type: "text", placeholder: "Ex: Diagnostic" },
                                    { label: "N° de série", key: "serial", type: "text", placeholder: "Ex: BP-1042" },
                                    { label: "Patient assigné", key: "patient", type: "text", placeholder: "— si non assigné" },
                                    { label: "Prochaine maintenance", key: "maintenanceDate", type: "date", placeholder: "" },
                                    { label: "Emplacement", key: "location", type: "text", placeholder: "Ex: Salle A" },
                                ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1", children: f.label }), _jsx("input", { type: f.type, placeholder: f.placeholder, value: form[f.key], onChange: (e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value })), className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" })] }, f.key))), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1", children: "Statut" }), _jsx("select", { value: form.status, onChange: (e) => setForm((prev) => ({ ...prev, status: e.target.value })), className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: ["Disponible", "En utilisation", "Maintenance"].map((s) => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { onClick: () => setShowModal(false), className: "flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: saveForm, className: "flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium", children: "Enregistrer" })] })] })] }) })), deleteTarget && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-card rounded-2xl border border-border w-full max-w-sm shadow-2xl p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-red-100 flex items-center justify-center", children: _jsx(AlertCircle, { size: 20, className: "text-red-500" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: "Supprimer l'\u00E9quipement" }), _jsx("p", { className: "text-xs text-muted-foreground", children: deleteTarget.name })] })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Cette action est irr\u00E9versible." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setDeleteTarget(null), className: "flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: confirmDelete, className: "flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition font-medium", children: "Supprimer" })] })] }) }))] }));
}
