import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Plus, X, CheckCircle2, Clock, AlertCircle, CreditCard, FileText, Banknote } from "lucide-react";
const invStatusConfig = {
    Payée: { color: "text-green-600", bg: "bg-green-100", icon: CheckCircle2 },
    "En attente": { color: "text-amber-600", bg: "bg-amber-100", icon: Clock },
    "En retard": { color: "text-red-600", bg: "bg-red-100", icon: AlertCircle },
};
const emptyForm = { patient: "", amount: "", date: "", dueDate: "", services: "", status: "En attente" };
export default function BillingPage() {
    const [activeTab, setActiveTab] = useState("invoices");
    const [invoices, setInvoices] = useState([]);
    const [payments, setPayments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState(null);
    useEffect(() => {
        fetch("/api/medical-service/billing/invoices", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json()).then(d => setInvoices(Array.isArray(d) ? d : [])).catch(() => { });
        fetch("/api/medical-service/billing/payments", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json()).then(d => setPayments(Array.isArray(d) ? d : [])).catch(() => { });
    }, []);
    const totalRevenue = invoices.filter((i) => i.status === "Payée").reduce((s, i) => s + i.amount, 0);
    const pending = invoices.filter((i) => i.status === "En attente").reduce((s, i) => s + i.amount, 0);
    const overdue = invoices.filter((i) => i.status === "En retard").reduce((s, i) => s + i.amount, 0);
    const kpis = [
        { label: "Revenus encaissés", value: `${totalRevenue} DT`, icon: Banknote, color: "text-green-500", bg: "bg-green-50" },
        { label: "En attente", value: `${pending} DT`, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
        { label: "En retard", value: `${overdue} DT`, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
        { label: "Total factures", value: invoices.length, icon: FileText, color: "text-indigo-500", bg: "bg-indigo-50" },
    ];
    async function saveInvoice() {
        if (!form.patient.trim() || !form.amount)
            return;
        const r = await fetch("/api/medical-service/billing/invoices", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify({ ...form, amount: Number(form.amount) }),
        });
        const data = await r.json();
        setInvoices(prev => [...prev, data]);
        setShowModal(false);
        setForm(emptyForm);
    }
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Facturation" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Gestion des factures et paiements" })] }), _jsxs("button", { onClick: () => setShowModal(true), className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Plus, { size: 16 }), " Cr\u00E9er une facture"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((k) => {
                                    const Icon = k.icon;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(Icon, { size: 20, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label));
                                }) }), _jsx("div", { className: "flex gap-1 bg-muted/40 p-1 rounded-xl w-fit", children: [{ key: "invoices", label: "Factures", icon: FileText }, { key: "payments", label: "Paiements", icon: CreditCard }].map((t) => {
                                    const Icon = t.icon;
                                    return (_jsxs("button", { onClick: () => setActiveTab(t.key), className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`, children: [_jsx(Icon, { size: 15 }), t.label] }, t.key));
                                }) }), activeTab === "invoices" && (_jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-border", children: ["Réf.", "Patient", "Montant", "Date", "Échéance", "Services", "Statut", "Actions"].map((h) => (_jsx("th", { className: "px-4 py-3 text-left text-muted-foreground font-medium whitespace-nowrap", children: h }, h))) }) }), _jsx("tbody", { children: invoices.map((inv) => {
                                                    const cfg = invStatusConfig[inv.status];
                                                    const StatusIcon = cfg.icon;
                                                    return (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/30 transition", children: [_jsx("td", { className: "px-4 py-3 font-mono text-xs text-foreground", children: inv.ref }), _jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: inv.patient }), _jsxs("td", { className: "px-4 py-3 font-semibold text-foreground", children: [inv.amount, " DT"] }), _jsx("td", { className: "px-4 py-3 text-muted-foreground", children: inv.date }), _jsx("td", { className: "px-4 py-3 text-muted-foreground", children: inv.dueDate }), _jsx("td", { className: "px-4 py-3 text-muted-foreground max-w-[180px] truncate", children: inv.services }), _jsx("td", { className: "px-4 py-3", children: _jsxs("span", { className: `flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${cfg.bg} ${cfg.color}`, children: [_jsx(StatusIcon, { size: 11 }), inv.status] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { onClick: () => setDeleteTarget(inv), className: "p-1.5 rounded-lg hover:bg-red-50 transition text-muted-foreground hover:text-red-500", children: _jsx(X, { size: 14 }) }) })] }, inv.id));
                                                }) })] }) }) })), activeTab === "payments" && (_jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsx("tr", { className: "border-b border-border", children: ["Réf.", "Patient", "Montant", "Date", "Mode de paiement", "Facture liée"].map((h) => (_jsx("th", { className: "px-4 py-3 text-left text-muted-foreground font-medium whitespace-nowrap", children: h }, h))) }) }), _jsx("tbody", { children: payments.map((p) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/30 transition", children: [_jsx("td", { className: "px-4 py-3 font-mono text-xs text-foreground", children: p.ref }), _jsx("td", { className: "px-4 py-3 font-medium text-foreground", children: p.patient }), _jsxs("td", { className: "px-4 py-3 font-semibold text-foreground", children: [p.amount, " DT"] }), _jsx("td", { className: "px-4 py-3 text-muted-foreground", children: p.date }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium", children: p.method }) }), _jsx("td", { className: "px-4 py-3 font-mono text-xs text-muted-foreground", children: p.invoice })] }, p.id))) })] }) }) }))] })] }), showModal && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-card rounded-2xl border border-border w-full max-w-md shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [_jsx("h2", { className: "font-semibold text-foreground", children: "Nouvelle facture" }), _jsx("button", { onClick: () => setShowModal(false), className: "p-1.5 rounded-lg hover:bg-muted transition", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [[
                                    { label: "Patient", key: "patient", type: "text", placeholder: "Nom du patient" },
                                    { label: "Montant (DT)", key: "amount", type: "number", placeholder: "Ex: 450" },
                                    { label: "Date de facturation", key: "date", type: "date", placeholder: "" },
                                    { label: "Date d'échéance", key: "dueDate", type: "date", placeholder: "" },
                                    { label: "Services rendus", key: "services", type: "text", placeholder: "Ex: Soins infirmiers x3" },
                                ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1", children: f.label }), _jsx("input", { type: f.type, placeholder: f.placeholder, value: form[f.key], onChange: (e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value })), className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" })] }, f.key))), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1", children: "Statut" }), _jsx("select", { value: form.status, onChange: (e) => setForm((prev) => ({ ...prev, status: e.target.value })), className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: ["Payée", "En attente", "En retard"].map((s) => _jsx("option", { children: s }, s)) })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { onClick: () => setShowModal(false), className: "flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: saveInvoice, className: "flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium", children: "Cr\u00E9er" })] })] })] }) })), deleteTarget && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-card rounded-2xl border border-border w-full max-w-sm shadow-2xl p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-red-100 flex items-center justify-center", children: _jsx(AlertCircle, { size: 20, className: "text-red-500" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: "Supprimer la facture" }), _jsx("p", { className: "text-xs text-muted-foreground", children: deleteTarget.ref })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setDeleteTarget(null), className: "flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition", children: "Annuler" }), _jsx("button", { onClick: async () => { await fetch(`/api/medical-service/billing/invoices/${deleteTarget.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${tok()}` } }); setInvoices((p) => p.filter((i) => i.id !== deleteTarget.id)); setDeleteTarget(null); }, className: "flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition font-medium", children: "Supprimer" })] })] }) }))] }));
}
