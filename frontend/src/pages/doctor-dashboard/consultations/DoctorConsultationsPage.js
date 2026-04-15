import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { Clock, CheckCircle, XCircle, Video, FileText, User, } from "lucide-react";
const TABS = [
    "Toutes",
    "Confirmée",
    "En attente",
    "Terminée",
    "Annulée",
];
const STATUS_CONFIG = {
    Confirmée: {
        label: "Confirmée",
        icon: _jsx(CheckCircle, { size: 16, className: "text-green-600" }),
        badgeCls: "bg-green-100 text-green-700",
        ringCls: "border-l-green-400",
    },
    "En attente": {
        label: "En attente",
        icon: _jsx(Clock, { size: 16, className: "text-orange-500" }),
        badgeCls: "bg-orange-100 text-orange-700",
        ringCls: "border-l-orange-400",
    },
    Annulée: {
        label: "Annulée",
        icon: _jsx(XCircle, { size: 16, className: "text-red-500" }),
        badgeCls: "bg-red-100 text-red-600",
        ringCls: "border-l-red-400",
    },
    Terminée: {
        label: "Terminée",
        icon: _jsx(CheckCircle, { size: 16, className: "text-blue-500" }),
        badgeCls: "bg-blue-100 text-blue-700",
        ringCls: "border-l-blue-400",
    },
};
function mapStatus(raw) {
    switch (raw) {
        case "confirmed":
            return "Confirmée";
        case "completed":
            return "Terminée";
        case "cancelled":
        case "rejected":
            return "Annulée";
        default:
            return "En attente";
    }
}
export default function DoctorConsultationsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Toutes");
    const [expandedId, setExpandedId] = useState(null);
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated)
            return;
        const token = localStorage.getItem("megacare_token");
        fetch("/api/appointments", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
            if (Array.isArray(data))
                setAppointments(data);
        })
            .catch(() => { });
    }, [isAuthenticated]);
    if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
        return null;
    const items = appointments.map((a) => ({
        ...a,
        displayStatus: mapStatus(a.status),
    }));
    const filtered = activeTab === "Toutes"
        ? items
        : items.filter((c) => c.displayStatus === activeTab);
    const countOf = (s) => s === "Toutes"
        ? items.length
        : items.filter((c) => c.displayStatus === s).length;
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, { doctorName: user.firstName || "Amira Mansouri" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Consultations" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Historique complet par patient" })] }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: TABS.map((tab) => (_jsxs("div", { className: "bg-card border border-border rounded-xl p-4 text-center", children: [_jsx("p", { className: `text-2xl font-bold ${tab === "Terminée"
                                                    ? "text-green-600"
                                                    : tab === "En attente"
                                                        ? "text-orange-500"
                                                        : tab === "Annulée"
                                                            ? "text-red-500"
                                                            : "text-foreground"}`, children: countOf(tab) }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: tab === "Toutes" ? "Total" : tab })] }, tab))) }), _jsx("div", { className: "flex flex-wrap gap-2", children: TABS.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab), className: `px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-card border border-border text-foreground hover:bg-muted"}`, children: [tab === "Toutes" ? "Toutes" : tab, _jsx("span", { className: `ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab
                                                    ? "bg-white/20 text-white"
                                                    : "bg-muted text-muted-foreground"}`, children: countOf(tab) })] }, tab))) }), _jsxs("div", { className: "space-y-3", children: [filtered.length === 0 && (_jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Aucune consultation dans cette cat\u00E9gorie." })), filtered.map((cons) => {
                                            const cfg = STATUS_CONFIG[cons.displayStatus];
                                            const isExpanded = expandedId === cons.id;
                                            return (_jsx("div", { className: `bg-card rounded-xl border border-border border-l-4 ${cfg.ringCls} transition hover:shadow-md`, children: _jsxs("div", { className: "p-5 flex items-start gap-4", children: [_jsx("div", { className: "w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0", children: _jsx(User, { size: 20, className: "text-primary" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [_jsx("h3", { className: "font-semibold text-foreground", children: cons.patientName }), _jsxs("span", { className: `flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.badgeCls}`, children: [cfg.icon, cfg.label] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-3 text-sm text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 13 }), cons.date, " \u00E0 ", cons.time, " \u2014 30 min"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Video, { size: 13 }), "Vid\u00E9o"] }), cons.reason && (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(FileText, { size: 13 }), cons.reason] }))] })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0 flex-wrap justify-end", children: [cons.displayStatus === "En attente" && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => {
                                                                                sessionStorage.setItem("live_consultation", JSON.stringify({
                                                                                    patientName: cons.patientName,
                                                                                    patientId: cons.patientId,
                                                                                    appointmentId: cons.id,
                                                                                    type: "Vidéo",
                                                                                }));
                                                                                navigate("/doctor-dashboard/live-consultation");
                                                                            }, className: "flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Video, { size: 14 }), "Rejoindre"] }), _jsx("button", { className: "px-3 py-1.5 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition text-sm", children: "Annuler" })] })), cons.displayStatus === "Confirmée" && (_jsxs("button", { onClick: () => {
                                                                        sessionStorage.setItem("live_consultation", JSON.stringify({
                                                                            patientName: cons.patientName,
                                                                            patientId: cons.patientId,
                                                                            appointmentId: cons.id,
                                                                            type: "Vidéo",
                                                                        }));
                                                                        navigate("/doctor-dashboard/live-consultation");
                                                                    }, className: "flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Video, { size: 14 }), "Rejoindre"] }))] })] }) }, cons.id));
                                        })] })] })] })] }) }));
}
