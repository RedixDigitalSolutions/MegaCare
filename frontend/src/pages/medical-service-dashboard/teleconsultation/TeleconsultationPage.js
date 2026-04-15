import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Video, Clock, CheckCircle2, History, Phone, Calendar, Users, TrendingUp, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
function statusToTab(status) {
    if (status === "Planifié" || status === "En cours")
        return "upcoming";
    if (status === "Complété")
        return "completed";
    return "history";
}
const appointments = [];
export default function TeleconsultationPage() {
    const [activeTab, setActiveTab] = useState("upcoming");
    const [appointments, setAppointments] = useState([]);
    useEffect(() => {
        fetch("/api/medical-service/teleconsultation", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then(d => setAppointments(Array.isArray(d) ? d : []))
            .catch(() => { });
    }, []);
    const filtered = appointments.filter((a) => statusToTab(a.status) === activeTab);
    const kpis = [
        { label: "Consultations ce mois", value: "18", icon: Video, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "Durée moyenne", value: "28 min", icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
        { label: "Taux de présence", value: "94%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
        { label: "Médecins connectés", value: "3", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
    ];
    const tabs = [
        { key: "upcoming", label: "À venir", icon: Clock },
        { key: "completed", label: "Complétées", icon: CheckCircle2 },
        { key: "history", label: "Historique", icon: History },
    ];
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "T\u00E9l\u00E9consultation" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Consultations vid\u00E9o avec m\u00E9decins et sp\u00E9cialistes" })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((k) => {
                                    const Icon = k.icon;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(Icon, { size: 20, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label })] })] }, k.label));
                                }) }), _jsx("div", { className: "flex gap-1 bg-muted/40 p-1 rounded-xl w-fit", children: tabs.map((t) => {
                                    const Icon = t.icon;
                                    const count = appointments.filter((a) => statusToTab(a.status) === t.key).length;
                                    return (_jsxs("button", { onClick: () => setActiveTab(t.key), className: `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === t.key ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`, children: [_jsx(Icon, { size: 15 }), t.label, _jsx("span", { className: `text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === t.key ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`, children: count })] }, t.key));
                                }) }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4", children: filtered.map((a) => (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5 space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: a.patient }), _jsx("p", { className: "text-xs text-muted-foreground", children: a.doctor })] }), _jsx("span", { className: "text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium", children: a.type })] }), _jsxs("div", { className: "space-y-1 text-xs text-muted-foreground", children: [_jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Calendar, { size: 12 }), " ", a.date, " \u00E0 ", a.time] }), _jsxs("p", { className: "flex items-center gap-2", children: [_jsx(Clock, { size: 12 }), " Dur\u00E9e : ", a.duration] }), a.notes && _jsxs("p", { className: "italic text-foreground/60", children: ["\"", a.notes, "\""] })] }), statusToTab(a.status) === "upcoming" && (_jsxs("button", { className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(Video, { size: 15 }), "D\u00E9marrer la consultation"] })), statusToTab(a.status) === "completed" && (_jsxs("div", { className: "flex items-center gap-2 text-xs text-green-600 font-medium", children: [_jsx(CheckCircle2, { size: 14 }), "Consultation termin\u00E9e"] })), statusToTab(a.status) === "history" && (_jsxs("button", { className: "w-full flex items-center justify-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition text-sm font-medium", children: [_jsx(Phone, { size: 15 }), "Voir le compte rendu"] }))] }, a.id))) }), filtered.length === 0 && (_jsxs("div", { className: "text-center py-16 bg-card rounded-xl border border-border", children: [_jsx(Video, { size: 40, className: "text-muted-foreground/30 mx-auto mb-3" }), _jsx("p", { className: "text-muted-foreground", children: "Aucune consultation dans cet onglet" })] }))] })] })] }));
}
