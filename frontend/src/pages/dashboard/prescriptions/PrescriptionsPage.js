import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Pill, ShoppingCart, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Calendar, User, FileText, QrCode, Copy, Check, } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
const statusConfig = {
    active: { label: "Active", icon: CheckCircle2, classes: "bg-green-100 text-green-700 border-green-200" },
    expired: { label: "Expirée", icon: XCircle, classes: "bg-red-100 text-red-700 border-red-200" },
};
const purchaseConfig = {
    pending: { label: "Non achetée", classes: "bg-orange-100 text-orange-700 border-orange-200" },
    purchased: { label: "Achetée", classes: "bg-blue-100 text-blue-700 border-blue-200" },
};
export default function PrescriptionsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);
    const [qrModalId, setQrModalId] = useState(null);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "patient"))
            navigate("/login");
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user)
            return;
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        const headers = { Authorization: `Bearer ${token}` };
        fetch("/api/prescriptions", { headers })
            .then((r) => (r.ok ? r.json() : []))
            .then((j) => (Array.isArray(j) ? j : (j.data ?? [])))
            .then(async (rxs) => {
            const doctorIds = [...new Set(rxs.map((r) => r.doctorId))];
            const names = {};
            await Promise.all(doctorIds.map((id) => fetch(`/api/users/${id}`, { headers })
                .then((r) => (r.ok ? r.json() : null))
                .then((u) => { if (u)
                names[id] = `Dr. ${u.firstName} ${u.lastName}`; })
                .catch(() => { })));
            const now = new Date();
            setPrescriptions(rxs.map((rx) => {
                const created = new Date(rx.createdAt);
                const expiry = new Date(created.getTime() + 90 * 24 * 3600000);
                return {
                    id: rx.id,
                    doctor: names[rx.doctorId] || "Médecin",
                    date: created.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
                    expiryDate: expiry.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
                    status: expiry < now ? "expired" : "active",
                    purchaseStatus: rx.purchaseStatus || "pending",
                    secretCode: rx.secretCode || "",
                    medicines: rx.medicines || [],
                    notes: rx.notes || "",
                };
            }));
            if (rxs.length > 0)
                setExpandedId(rxs[0].id);
        })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [isAuthenticated, user]);
    if (isLoading || !isAuthenticated || !user || user.role !== "patient")
        return null;
    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };
    const active = prescriptions.filter((rx) => rx.status === "active");
    const expired = prescriptions.filter((rx) => rx.status === "expired");
    const purchased = prescriptions.filter((rx) => rx.purchaseStatus === "purchased");
    const qrRx = qrModalId ? prescriptions.find((rx) => rx.id === qrModalId) : null;
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, { userName: user.firstName }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "p-6 space-y-6 max-w-4xl", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [_jsx(Pill, { size: 28, className: "text-primary" }), " Mes Ordonnances"] }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Consultez et g\u00E9rez vos prescriptions m\u00E9dicales" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle2, { size: 20, className: "text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: active.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Actives" })] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center", children: _jsx(ShoppingCart, { size: 20, className: "text-blue-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: purchased.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Achet\u00E9es" })] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center", children: _jsx(XCircle, { size: 20, className: "text-red-500" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: expired.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Expir\u00E9es" })] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center", children: _jsx(FileText, { size: 20, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: prescriptions.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Total" })] })] })] }), _jsxs("div", { className: "space-y-4", children: [prescriptions.map((rx) => {
                                            const cfg = statusConfig[rx.status];
                                            const pCfg = purchaseConfig[rx.purchaseStatus];
                                            const StatusIcon = cfg.icon;
                                            const isExpanded = expandedId === rx.id;
                                            return (_jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition", children: [_jsxs("button", { onClick: () => setExpandedId(isExpanded ? null : rx.id), className: "w-full text-left p-5 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [_jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5", children: _jsx(User, { size: 18, className: "text-primary" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("h3", { className: "font-semibold text-foreground", children: rx.doctor }), _jsxs("div", { className: "flex items-center gap-3 mt-1 flex-wrap", children: [_jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Calendar, { size: 11 }), " ", rx.date] }), _jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), " Expire: ", rx.expiryDate] })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0 flex-wrap justify-end", children: [_jsxs("span", { className: `text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${pCfg.classes}`, children: [rx.purchaseStatus === "purchased" ? _jsx(Check, { size: 11 }) : _jsx(Clock, { size: 11 }), pCfg.label] }), _jsxs("span", { className: `text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${cfg.classes}`, children: [_jsx(StatusIcon, { size: 11 }), " ", cfg.label] }), isExpanded ? _jsx(ChevronUp, { size: 16, className: "text-muted-foreground" }) : _jsx(ChevronDown, { size: 16, className: "text-muted-foreground" })] })] }), isExpanded && (_jsxs("div", { className: "border-t border-border px-5 pb-5 pt-4 space-y-4", children: [rx.secretCode && (_jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between gap-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(QrCode, { size: 20, className: "text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Code de v\u00E9rification" }), _jsx("p", { className: "text-lg font-mono font-bold text-foreground tracking-widest mt-0.5", children: rx.secretCode })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => copyCode(rx.secretCode), className: "px-3 py-1.5 text-xs font-medium border border-border rounded-lg hover:bg-secondary transition flex items-center gap-1", children: copiedCode === rx.secretCode ? _jsxs(_Fragment, { children: [_jsx(Check, { size: 12, className: "text-green-600" }), " Copi\u00E9"] }) : _jsxs(_Fragment, { children: [_jsx(Copy, { size: 12 }), " Copier"] }) }), _jsxs("button", { onClick: () => setQrModalId(rx.id), className: "px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center gap-1", children: [_jsx(QrCode, { size: 12 }), " QR Code"] })] })] })), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "M\u00E9dicaments prescrits" }), _jsx("div", { className: "space-y-2", children: rx.medicines.map((med, idx) => (_jsx("div", { className: "flex items-start gap-2 bg-secondary/50 rounded-lg px-4 py-3", children: _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [_jsx(Pill, { size: 13, className: "text-primary shrink-0" }), " ", med.name] }), med.dosage && _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: med.dosage }), med.duration && (_jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5", children: [_jsx(Clock, { size: 10 }), " ", med.duration] }))] }) }, idx))) })] }), rx.notes && (_jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg px-4 py-3", children: [_jsx("p", { className: "text-xs font-semibold text-amber-800 mb-1", children: "Notes du m\u00E9decin" }), _jsx("p", { className: "text-sm text-amber-700 italic", children: rx.notes })] })), _jsxs("div", { className: "flex gap-2 flex-wrap pt-1", children: [rx.status === "active" && rx.purchaseStatus === "pending" && (_jsxs(Link, { to: "/pharmacy", className: "flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(ShoppingCart, { size: 14 }), " Commander en pharmacie"] })), rx.purchaseStatus === "purchased" && (_jsxs("span", { className: "flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium", children: [_jsx(CheckCircle2, { size: 14 }), " Ordonnance d\u00E9j\u00E0 achet\u00E9e"] }))] })] }))] }, rx.id));
                                        }), !loading && prescriptions.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(FileText, { size: 40, className: "mx-auto text-muted-foreground/40 mb-3" }), _jsx("p", { className: "text-lg font-medium text-foreground", children: "Aucune ordonnance" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Vos ordonnances appara\u00EEtront ici apr\u00E8s une consultation" })] }))] })] }) })] }), qrRx && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: () => setQrModalId(null), children: _jsxs("div", { className: "bg-card rounded-2xl border border-border p-8 max-w-sm w-full mx-4 text-center space-y-4", onClick: (e) => e.stopPropagation(), children: [_jsx("h3", { className: "text-lg font-bold text-foreground", children: "QR Code Ordonnance" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Pr\u00E9sentez ce QR code \u00E0 votre pharmacien pour v\u00E9rification" }), _jsx("div", { className: "flex justify-center py-4", children: _jsx(QRCodeSVG, { value: JSON.stringify({ prescriptionId: qrRx.id, secretCode: qrRx.secretCode }), size: 200, level: "H", includeMargin: true }) }), _jsxs("div", { className: "bg-secondary/50 rounded-lg px-4 py-3", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Code secret" }), _jsx("p", { className: "text-xl font-mono font-bold text-foreground tracking-widest", children: qrRx.secretCode })] }), _jsxs("div", { className: "text-xs text-muted-foreground space-y-1", children: [_jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "M\u00E9decin:" }), " ", qrRx.doctor] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium", children: "Date:" }), " ", qrRx.date] }), _jsx("p", { children: _jsxs("span", { className: "font-medium", children: [qrRx.medicines.length, " m\u00E9dicament(s)"] }) })] }), _jsx("button", { onClick: () => setQrModalId(null), className: "w-full px-4 py-2.5 border border-border rounded-lg hover:bg-secondary transition text-sm font-medium", children: "Fermer" })] }) }))] }));
}
