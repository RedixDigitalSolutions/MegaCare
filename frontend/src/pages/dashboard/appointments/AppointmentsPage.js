import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Calendar, Clock, Video, CalendarX2, RefreshCw } from "lucide-react";
export default function AppointmentsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState({});
    useEffect(() => {
        if (!isLoading && !isAuthenticated)
            navigate("/login");
    }, [isLoading, isAuthenticated, navigate]);
    useEffect(() => {
        if (!isAuthenticated)
            return;
        const token = localStorage.getItem("megacare_token");
        const headers = { Authorization: `Bearer ${token}` };
        fetch("/api/appointments", { headers })
            .then((r) => r.json())
            .then((j) => (Array.isArray(j) ? j : (j.data ?? [])))
            .then((data) => {
            setAppointments(data);
            const doctorIds = [...new Set(data.map((a) => a.doctorId))];
            doctorIds.forEach((dId) => {
                fetch(`/api/users/${dId}`, { headers })
                    .then((r) => r.json())
                    .then((u) => {
                    if (u?.firstName)
                        setDoctors((prev) => ({ ...prev, [dId]: `${u.firstName} ${u.lastName}` }));
                })
                    .catch(() => { });
            });
        })
            .catch(() => { });
    }, [isAuthenticated]);
    if (isLoading || !isAuthenticated || !user)
        return null;
    const today = new Date().toISOString().split("T")[0];
    const upcoming = appointments
        .filter((a) => a.status !== "cancelled" && a.status !== "rejected" && a.status !== "completed" && a.date >= today)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const nextConfirmed = upcoming.filter((a) => a.status === "confirmed");
    const pending = upcoming.filter((a) => a.status === "pending");
    const past = appointments
        .filter((a) => a.status === "completed" || ((a.status === "confirmed" || a.status === "pending") && a.date < today))
        .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
    const hasAny = upcoming.length > 0 || past.length > 0;
    const statusLabel = (s) => {
        const m = { confirmed: "Confirmé", pending: "En attente", cancelled: "Annulé", rejected: "Refusé", completed: "Terminée" };
        return m[s] || s;
    };
    const statusColor = (s) => {
        const m = { confirmed: "bg-green-50 text-green-700 border-green-200", pending: "bg-orange-50 text-orange-700 border-orange-200", cancelled: "bg-red-50 text-red-700 border-red-200", rejected: "bg-red-50 text-red-700 border-red-200", completed: "bg-blue-50 text-blue-700 border-blue-200" };
        return m[s] || "bg-gray-50 text-gray-700 border-gray-200";
    };
    const handleJoin = (apt) => {
        sessionStorage.setItem("patient_live_consultation", JSON.stringify({ doctorName: doctors[apt.doctorId] || "Médecin", doctorId: apt.doctorId, appointmentId: apt.id }));
        navigate("/dashboard/live-consultation");
    };
    const handleCancel = async (aptId) => {
        const token = localStorage.getItem("megacare_token");
        await fetch(`/api/appointments/${aptId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        setAppointments((prev) => prev.filter((a) => a.id !== aptId));
    };
    const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const Card = ({ apt }) => {
        const name = doctors[apt.doctorId] || "Médecin";
        const canAct = apt.date >= today && apt.status !== "completed" && apt.status !== "cancelled" && apt.status !== "rejected";
        return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5 space-y-4 hover:shadow-md transition", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl shrink-0", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), _jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-foreground", children: ["Dr. ", name] }), _jsx("p", { className: "text-sm text-muted-foreground", children: apt.reason || "Consultation" })] })] }), _jsx("span", { className: `px-2.5 py-1 rounded-full text-xs font-medium border ${statusColor(apt.status)}`, children: statusLabel(apt.status) })] }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(Calendar, { size: 15, className: "text-primary" }), fmtDate(apt.date)] }), _jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(Clock, { size: 15, className: "text-primary" }), apt.time, " \u00B7 30 min"] }), _jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(Video, { size: 15, className: "text-primary" }), "Vid\u00E9o"] })] }), canAct && (_jsxs("div", { className: "flex flex-wrap gap-2 pt-2 border-t border-border", children: [apt.status === "confirmed" && (_jsx("button", { onClick: () => handleJoin(apt), className: "px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition", children: "Rejoindre" })), _jsx("button", { onClick: () => handleCancel(apt.id), className: "px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-secondary transition", children: "Annuler" })] }))] }));
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, { userName: user.firstName }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Mes Rendez-vous" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "G\u00E9rez vos consultations m\u00E9dicales" })] }), _jsxs("div", { className: "p-6 max-w-5xl mx-auto space-y-8", children: [!hasAny && (_jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6", children: _jsx(CalendarX2, { size: 36, className: "text-primary/60" }) }), _jsx("h2", { className: "text-xl font-semibold text-foreground mb-2", children: "Vous n'avez aucun rendez-vous actuellement" }), _jsx("p", { className: "text-muted-foreground max-w-md mb-6", children: "Prenez rendez-vous avec un m\u00E9decin pour commencer. Vos prochains rendez-vous appara\u00EEtront ici." }), _jsx("button", { onClick: () => navigate("/doctors"), className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition", children: "Trouver un m\u00E9decin" })] })), nextConfirmed.length > 0 && (_jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Calendar, { size: 20, className: "text-primary" }), _jsx("h2", { className: "text-lg font-bold text-foreground", children: "Prochains rendez-vous" }), _jsx("span", { className: "text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full", children: nextConfirmed.length })] }), _jsx("div", { className: "space-y-3", children: nextConfirmed.map((a) => _jsx(Card, { apt: a }, a.id)) })] })), pending.length > 0 && (_jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(RefreshCw, { size: 20, className: "text-orange-500" }), _jsx("h2", { className: "text-lg font-bold text-foreground", children: "En attente de confirmation" }), _jsx("span", { className: "text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full", children: pending.length })] }), _jsx("div", { className: "space-y-3", children: pending.map((a) => _jsx(Card, { apt: a }, a.id)) })] })), past.length > 0 && (_jsxs("section", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Clock, { size: 20, className: "text-muted-foreground" }), _jsx("h2", { className: "text-lg font-bold text-foreground", children: "Historique" }), _jsx("span", { className: "text-xs font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded-full", children: past.length })] }), _jsx("div", { className: "space-y-3", children: past.map((a) => _jsx(Card, { apt: a }, a.id)) })] }))] })] })] }) }));
}
