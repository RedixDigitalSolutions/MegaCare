import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import { Search, QrCode, Pill, Clock, CheckCircle2, AlertCircle, User, Calendar, Loader2, } from "lucide-react";
export default function PrescriptionLookupPage() {
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [marking, setMarking] = useState(false);
    const lookup = async () => {
        if (!code.trim())
            return;
        setLoading(true);
        setError("");
        setResult(null);
        const token = localStorage.getItem("megacare_token");
        try {
            const res = await fetch(`/api/prescriptions/verify/${code.trim().toUpperCase()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                setError(err.message || "Ordonnance introuvable");
                return;
            }
            setResult(await res.json());
        }
        catch {
            setError("Erreur de connexion");
        }
        finally {
            setLoading(false);
        }
    };
    const markPurchased = async () => {
        if (!result)
            return;
        setMarking(true);
        const token = localStorage.getItem("megacare_token");
        try {
            const res = await fetch(`/api/prescriptions/${result.id}/purchase`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({}),
            });
            if (res.ok) {
                setResult({ ...result, purchaseStatus: "purchased" });
            }
        }
        finally {
            setMarking(false);
        }
    };
    const statusLabel = (s) => {
        const m = { en_attente: "En attente", "validée": "Validée", "rejetée": "Rejetée", "expirée": "Expirée" };
        return m[s] || s;
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(PharmacyDashboardSidebar, {}), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [_jsx(QrCode, { size: 28, className: "text-primary" }), " V\u00E9rification Ordonnance"] }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Recherchez une ordonnance par code de v\u00E9rification" })] }), _jsxs("div", { className: "p-6 max-w-3xl mx-auto space-y-6", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border p-6", children: [_jsx("label", { className: "text-sm font-medium text-foreground block mb-2", children: "Code de v\u00E9rification" }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { size: 18, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", value: code, onChange: (e) => setCode(e.target.value.toUpperCase()), onKeyDown: (e) => e.key === "Enter" && lookup(), placeholder: "Ex: A1B2C3D4", className: "w-full pl-10 pr-4 py-3 border border-border rounded-lg bg-background text-foreground font-mono text-lg tracking-widest uppercase placeholder:text-muted-foreground/50 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm", maxLength: 8 })] }), _jsxs("button", { onClick: lookup, disabled: loading || !code.trim(), className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center gap-2", children: [loading ? _jsx(Loader2, { size: 16, className: "animate-spin" }) : _jsx(Search, { size: 16 }), "V\u00E9rifier"] })] })] }), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3", children: [_jsx(AlertCircle, { size: 20, className: "text-red-500 shrink-0" }), _jsx("p", { className: "text-sm text-red-700 font-medium", children: error })] })), result && (_jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-border bg-primary/5", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-foreground", children: "Ordonnance v\u00E9rifi\u00E9e" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: ["Code: ", result.secretCode] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("span", { className: `text-xs font-medium px-2.5 py-1 rounded-full border ${result.purchaseStatus === "purchased"
                                                                    ? "bg-blue-100 text-blue-700 border-blue-200"
                                                                    : "bg-orange-100 text-orange-700 border-orange-200"}`, children: result.purchaseStatus === "purchased" ? "Achetée" : "Non achetée" }), _jsx("span", { className: `text-xs font-medium px-2.5 py-1 rounded-full border ${result.status === "validée"
                                                                    ? "bg-green-100 text-green-700 border-green-200"
                                                                    : result.status === "expirée" || result.status === "rejetée"
                                                                        ? "bg-red-100 text-red-700 border-red-200"
                                                                        : "bg-orange-100 text-orange-700 border-orange-200"}`, children: statusLabel(result.status) })] })] }) }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { size: 16, className: "text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Patient" }), _jsx("p", { className: "text-sm font-medium text-foreground", children: result.patientName })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(User, { size: 16, className: "text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "M\u00E9decin" }), _jsx("p", { className: "text-sm font-medium text-foreground", children: result.doctorName })] })] })] }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-muted-foreground", children: [_jsx(Calendar, { size: 14 }), _jsxs("span", { children: ["\u00C9mise le ", new Date(result.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })] })] }), _jsxs("div", { children: [_jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: ["M\u00E9dicaments (", result.medicines.length, ")"] }), _jsx("div", { className: "space-y-2", children: result.medicines.map((med, i) => (_jsxs("div", { className: "flex items-start gap-2 bg-secondary/50 rounded-lg px-4 py-3", children: [_jsx(Pill, { size: 14, className: "text-primary shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: med.name }), med.dosage && _jsx("p", { className: "text-xs text-muted-foreground", children: med.dosage }), med.duration && (_jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Clock, { size: 10 }), " ", med.duration] }))] })] }, i))) })] }), result.notes && (_jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg px-4 py-3", children: [_jsx("p", { className: "text-xs font-semibold text-amber-800 mb-1", children: "Notes" }), _jsx("p", { className: "text-sm text-amber-700 italic", children: result.notes })] })), result.purchaseStatus !== "purchased" && (_jsxs("button", { onClick: markPurchased, disabled: marking, className: "w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2", children: [marking ? _jsx(Loader2, { size: 16, className: "animate-spin" }) : _jsx(CheckCircle2, { size: 16 }), "Marquer comme achet\u00E9e"] })), result.purchaseStatus === "purchased" && (_jsxs("div", { className: "w-full px-4 py-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg font-medium flex items-center justify-center gap-2", children: [_jsx(CheckCircle2, { size: 16 }), " Cette ordonnance a d\u00E9j\u00E0 \u00E9t\u00E9 achet\u00E9e"] }))] })] }))] })] })] }) }));
}
