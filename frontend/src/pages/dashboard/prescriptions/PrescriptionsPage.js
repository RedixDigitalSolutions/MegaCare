import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Pill, Eye, ShoppingCart, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, Calendar, User, FileText, } from "lucide-react";
const statusConfig = {
    active: {
        label: "Active",
        icon: CheckCircle2,
        classes: "bg-green-100 text-green-700 border-green-200",
    },
    expired: {
        label: "Expirée",
        icon: XCircle,
        classes: "bg-red-100 text-red-700 border-red-200",
    },
};
export default function PrescriptionsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "patient")) {
            navigate("/login");
        }
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
            .then(async (rxs) => {
            // Resolve doctor names
            const doctorIds = [...new Set(rxs.map((r) => r.doctorId))];
            const names = {};
            await Promise.all(doctorIds.map((id) => fetch(`/api/users/${id}`, { headers })
                .then((r) => (r.ok ? r.json() : null))
                .then((u) => {
                if (u)
                    names[id] = `Dr. ${u.firstName} ${u.lastName}`;
            })
                .catch(() => { })));
            const now = new Date();
            setPrescriptions(rxs.map((rx) => {
                const created = new Date(rx.createdAt);
                const expiry = new Date(created.getTime() + 90 * 24 * 3600000); // 90 days validity
                const isExpired = expiry < now;
                return {
                    id: rx.id,
                    doctor: names[rx.doctorId] || "Médecin",
                    date: created.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                    expiryDate: expiry.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    }),
                    status: isExpired ? "expired" : "active",
                    medicines: rx.medicines || [],
                    notes: "",
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
    const active = prescriptions.filter((rx) => rx.status === "active");
    const expired = prescriptions.filter((rx) => rx.status === "expired");
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, { userName: user.firstName }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "p-6 space-y-6 max-w-4xl", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-2", children: [_jsx(Pill, { size: 28, className: "text-primary" }), "Mes Ordonnances"] }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Consultez et g\u00E9rez vos prescriptions m\u00E9dicales" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center", children: _jsx(CheckCircle2, { size: 20, className: "text-green-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: active.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Actives" })] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center", children: _jsx(XCircle, { size: 20, className: "text-red-500" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: expired.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Expir\u00E9es" })] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-3 col-span-2 md:col-span-1", children: [_jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center", children: _jsx(FileText, { size: 20, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: prescriptions.length }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Total" })] })] })] }), _jsx("div", { className: "space-y-4", children: prescriptions.map((rx) => {
                                    const cfg = statusConfig[rx.status];
                                    const StatusIcon = cfg.icon;
                                    const isExpanded = expandedId === rx.id;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition", children: [_jsxs("button", { onClick: () => setExpandedId(isExpanded ? null : rx.id), className: "w-full text-left p-5 flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex items-start gap-3 flex-1 min-w-0", children: [_jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5", children: _jsx(User, { size: 18, className: "text-primary" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("div", { className: "flex items-center gap-2 flex-wrap", children: _jsx("h3", { className: "font-semibold text-foreground", children: rx.doctor }) }), _jsxs("div", { className: "flex items-center gap-3 mt-1 flex-wrap", children: [_jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Calendar, { size: 11 }), " ", rx.date] }), _jsxs("span", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(Clock, { size: 11 }), " Expire: ", rx.expiryDate] })] })] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsxs("span", { className: `text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${cfg.classes}`, children: [_jsx(StatusIcon, { size: 11 }), " ", cfg.label] }), isExpanded ? (_jsx(ChevronUp, { size: 16, className: "text-muted-foreground" })) : (_jsx(ChevronDown, { size: 16, className: "text-muted-foreground" }))] })] }), isExpanded && (_jsxs("div", { className: "border-t border-border px-5 pb-5 pt-4 space-y-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "M\u00E9dicaments prescrits" }), _jsx("div", { className: "space-y-2", children: rx.medicines.map((med, idx) => (_jsx("div", { className: "flex items-start justify-between gap-2 bg-secondary/50 rounded-lg px-4 py-3", children: _jsxs("div", { children: [_jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [_jsx(Pill, { size: 13, className: "text-primary shrink-0" }), med.name] }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: med.dosage }), _jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-0.5", children: [_jsx(Clock, { size: 10 }), " ", med.duration] })] }) }, idx))) })] }), rx.notes && (_jsxs("div", { className: "bg-amber-50 border border-amber-200 rounded-lg px-4 py-3", children: [_jsx("p", { className: "text-xs font-semibold text-amber-800 mb-1", children: "Notes du m\u00E9decin" }), _jsx("p", { className: "text-sm text-amber-700 italic", children: rx.notes })] })), _jsxs("div", { className: "flex gap-2 flex-wrap pt-1", children: [rx.status === "active" && (_jsxs(Link, { to: "/pharmacy", className: "flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(ShoppingCart, { size: 14 }), "Commander en pharmacie"] })), _jsxs("button", { className: "flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition text-sm font-medium text-foreground", children: [_jsx(Eye, { size: 14 }), "Voir l'ordonnance PDF"] })] })] }))] }, rx.id));
                                }) })] }) })] }) }));
}
