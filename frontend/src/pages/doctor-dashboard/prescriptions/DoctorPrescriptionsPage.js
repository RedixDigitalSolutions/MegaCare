import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { Plus, Download, Eye, X, CheckCircle, Trash2, FileText, } from "lucide-react";
const STATUS_CFG = {
    badgeCls: "bg-green-100 text-green-700",
    icon: _jsx(CheckCircle, { size: 13, className: "text-green-600" }),
    borderCls: "border-l-green-500",
};
const EMPTY_FORM = { patientId: "" };
export default function DoctorPrescriptionsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState("Toutes");
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [medicines, setMedicines] = useState([
        { name: "", dosage: "", duration: "" },
    ]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [patientNames, setPatientNames] = useState({});
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const fetchPrescriptions = useCallback(async () => {
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        setLoading(true);
        try {
            const res = await fetch("/api/prescriptions", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                const mapped = data.map((p) => ({
                    id: String(p.id || p._id),
                    patientId: p.patientId || null,
                    medicines: Array.isArray(p.medicines) ? p.medicines : [],
                    createdAt: p.createdAt || new Date().toISOString(),
                }));
                setPrescriptions(mapped);
                // Resolve patient names
                const uniqueIds = [
                    ...new Set(mapped
                        .filter((p) => p.patientId)
                        .map((p) => p.patientId)),
                ];
                const names = {};
                await Promise.all(uniqueIds.map((id) => fetch(`/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                    .then((r) => (r.ok ? r.json() : null))
                    .then((u) => {
                    if (u)
                        names[id] =
                            `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                                u.email;
                })
                    .catch(() => { })));
                setPatientNames(names);
            }
        }
        catch {
            /* ignore */
        }
        setLoading(false);
    }, []);
    const fetchPatients = useCallback(async () => {
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        try {
            const res = await fetch("/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setPatients(data
                    .filter((u) => u.role === "patient")
                    .map((u) => ({
                    id: String(u.id || u._id),
                    name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
                })));
            }
        }
        catch {
            /* ignore */
        }
    }, []);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isLoading && isAuthenticated && user?.role === "doctor") {
            fetchPrescriptions();
            fetchPatients();
        }
    }, [isLoading, isAuthenticated, user, fetchPrescriptions, fetchPatients]);
    if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
        return null;
    const filtered = prescriptions; // all from API are "Validée"
    const countOf = (s) => prescriptions.length; // all same
    const addMedicineRow = () => setMedicines((prev) => [...prev, { name: "", dosage: "", duration: "" }]);
    const removeMedicineRow = (i) => setMedicines((prev) => prev.filter((_, idx) => idx !== i));
    const updateMedicine = (i, field, value) => {
        setMedicines((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.patientId || medicines.some((m) => !m.name.trim()))
            return;
        const token = localStorage.getItem("megacare_token");
        setSubmitting(true);
        try {
            const res = await fetch("/api/prescriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ patientId: form.patientId, medicines }),
            });
            if (res.ok) {
                await fetchPrescriptions();
                setShowModal(false);
                setForm(EMPTY_FORM);
                setMedicines([{ name: "", dosage: "", duration: "" }]);
            }
        }
        catch {
            /* ignore */
        }
        setSubmitting(false);
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, { doctorName: user.firstName || "Amira Mansouri" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Ordonnances" }), _jsx("p", { className: "text-muted-foreground mt-1", children: loading ? "Chargement..." : `${prescriptions.length} ordonnances émises` })] }), _jsxs("button", { onClick: () => setShowModal(true), className: "flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-medium text-sm", children: [_jsx(Plus, { size: 16 }), "Nouvelle ordonnance"] })] }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsx("div", { className: "grid grid-cols-3 sm:grid-cols-3 gap-4", children: ["Toutes", "Validée"].map((s) => (_jsxs("div", { onClick: () => setTab(s), className: `bg-card border rounded-xl p-4 text-center cursor-pointer transition hover:shadow-md ${tab === s
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-border"}`, children: [_jsx("p", { className: `text-2xl font-bold ${s === "Validée"
                                                        ? "text-green-600"
                                                        : "text-foreground"}`, children: countOf(s) }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: s })] }, s))) }), _jsx("div", { className: "flex gap-2 flex-wrap", children: ["Toutes", "Validée"].map((s) => (_jsxs("button", { onClick: () => setTab(s), className: `px-4 py-1.5 rounded-full text-sm font-medium transition ${tab === s
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-muted/70"}`, children: [s, _jsxs("span", { className: "ml-1.5 text-xs opacity-75", children: ["(", countOf(s), ")"] })] }, s))) }), _jsx("div", { className: "space-y-4", children: loading ? ([0, 1, 2].map((i) => (_jsx("div", { className: "bg-card border border-border rounded-xl p-5 animate-pulse h-32" }, i)))) : filtered.length === 0 ? (_jsx("p", { className: "text-center py-12 text-muted-foreground", children: "Aucune ordonnance trouv\u00E9e." })) : (filtered.map((rx) => {
                                            const patientLabel = rx.patientId
                                                ? patientNames[rx.patientId] || "Patient"
                                                : "Sans patient";
                                            const displayId = `ORD-${rx.id.slice(0, 7).toUpperCase()}`;
                                            const displayDate = new Date(rx.createdAt).toLocaleDateString("fr-FR");
                                            return (_jsxs("div", { className: `bg-card border border-border border-l-4 ${STATUS_CFG.borderCls} rounded-xl p-5 hover:shadow-md transition`, children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [_jsx("span", { className: "text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded", children: displayId }), _jsxs("span", { className: `flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_CFG.badgeCls}`, children: [STATUS_CFG.icon, "Valid\u00E9e"] })] }), _jsx("h3", { className: "font-semibold text-foreground text-lg", children: patientLabel }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["\u00C9mise le ", displayDate] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "p-2 rounded-lg border border-border hover:bg-muted transition", children: _jsx(Eye, { size: 16, className: "text-muted-foreground" }) }), _jsx("button", { className: "p-2 rounded-lg border border-border hover:bg-muted transition", children: _jsx(Download, { size: 16, className: "text-muted-foreground" }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "M\u00E9dicaments prescrits" }), _jsx("div", { className: "flex flex-wrap gap-2", children: rx.medicines.map((m, i) => (_jsxs("div", { className: "bg-muted/40 border border-border rounded-lg px-3 py-1.5 text-xs", children: [_jsx("span", { className: "font-medium text-foreground", children: m.name }), (m.dosage || m.duration) && (_jsxs("span", { className: "text-muted-foreground ml-1", children: [m.dosage && `— ${m.dosage}`, m.duration && ` · ${m.duration}`] }))] }, i))) })] })] }, rx.id));
                                        })) })] })] })] }), showModal && (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setShowModal(false) }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(FileText, { size: 20, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold text-foreground", children: "Nouvelle ordonnance" })] }), _jsx("button", { onClick: () => setShowModal(false), className: "p-2 hover:bg-muted rounded-lg transition", children: _jsx(X, { size: 18 }) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "flex-1 overflow-y-auto p-6 space-y-5", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "col-span-2 space-y-1", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Patient *" }), _jsxs("select", { required: true, value: form.patientId, onChange: (e) => setForm((f) => ({ ...f, patientId: e.target.value })), className: "w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm", children: [_jsx("option", { value: "", children: "S\u00E9lectionner un patient" }), patients.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id)))] })] }), _jsxs("div", { className: "col-span-2 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "M\u00E9dicaments *" }), _jsxs("button", { type: "button", onClick: addMedicineRow, className: "flex items-center gap-1 text-xs text-primary hover:underline", children: [_jsx(Plus, { size: 12 }), " Ajouter"] })] }), _jsx("div", { className: "space-y-3", children: medicines.map((m, i) => (_jsxs("div", { className: "border border-border rounded-lg p-3 space-y-2 bg-muted/20", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { required: true, value: m.name, onChange: (e) => updateMedicine(i, "name", e.target.value), placeholder: "Nom du m\u00E9dicament", className: "flex-1 border border-border rounded px-2.5 py-1.5 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm" }), medicines.length > 1 && (_jsx("button", { type: "button", onClick: () => removeMedicineRow(i), className: "p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-600 transition", children: _jsx(Trash2, { size: 14 }) }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("input", { required: true, value: m.dosage, onChange: (e) => updateMedicine(i, "dosage", e.target.value), placeholder: "Posologie", className: "border border-border rounded px-2.5 py-1.5 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm" }), _jsx("input", { required: true, value: m.duration, onChange: (e) => updateMedicine(i, "duration", e.target.value), placeholder: "Dur\u00E9e", className: "border border-border rounded px-2.5 py-1.5 bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm" })] })] }, i))) })] })] }), _jsxs("div", { className: "flex gap-3 pt-1", children: [_jsx("button", { type: "button", onClick: () => setShowModal(false), className: "flex-1 px-4 py-2.5 border border-border rounded-xl hover:bg-muted transition text-sm font-medium", children: "Annuler" }), _jsxs("button", { type: "submit", disabled: submitting || !form.patientId || medicines.some((m) => !m.name.trim()), className: "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(FileText, { size: 15 }), submitting ? "Enregistrement..." : "Émettre l'ordonnance"] })] })] })] })] }))] }));
}
