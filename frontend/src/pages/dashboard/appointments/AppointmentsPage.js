import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Calendar, Clock, Video } from "lucide-react";
export default function AppointmentsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("upcoming");
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState({});
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, navigate]);
    // Fetch appointments + doctor names
    useEffect(() => {
        if (!isAuthenticated)
            return;
        const token = localStorage.getItem("megacare_token");
        const headers = { Authorization: `Bearer ${token}` };
        fetch("/api/appointments", { headers })
            .then((r) => r.json())
            .then((data) => {
            setAppointments(data);
            // Fetch doctor names
            const doctorIds = [...new Set(data.map((a) => a.doctorId))];
            doctorIds.forEach((dId) => {
                fetch(`/api/users/${dId}`, { headers })
                    .then((r) => r.json())
                    .then((u) => {
                    if (u && u.firstName) {
                        setDoctors((prev) => ({
                            ...prev,
                            [dId]: `${u.firstName} ${u.lastName}`,
                        }));
                    }
                })
                    .catch(() => { });
            });
        })
            .catch(() => { });
    }, [isAuthenticated]);
    if (isLoading || !isAuthenticated || !user) {
        return null;
    }
    const today = new Date().toISOString().split("T")[0];
    const upcoming = appointments.filter((a) => a.status !== "cancelled" &&
        a.status !== "rejected" &&
        a.status !== "completed" &&
        a.date >= today);
    const past = appointments.filter((a) => a.status === "completed" ||
        ((a.status === "confirmed" || a.status === "pending") && a.date < today));
    const cancelled = appointments.filter((a) => a.status === "cancelled" || a.status === "rejected");
    const current = activeTab === "upcoming"
        ? upcoming
        : activeTab === "past"
            ? past
            : cancelled;
    const getStatusLabel = (status) => {
        switch (status) {
            case "confirmed":
                return "Confirmé";
            case "pending":
                return "En attente";
            case "cancelled":
                return "Annulé";
            case "rejected":
                return "Refusé";
            case "completed":
                return "Terminée";
            default:
                return status;
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-50 text-green-700";
            case "pending":
                return "bg-orange-50 text-orange-700";
            case "cancelled":
            case "rejected":
                return "bg-red-50 text-red-700";
            default:
                return "bg-gray-50 text-gray-700";
        }
    };
    const handleJoin = (apt) => {
        const doctorFullName = doctors[apt.doctorId] || "Médecin";
        sessionStorage.setItem("patient_live_consultation", JSON.stringify({
            doctorName: doctorFullName,
            doctorId: apt.doctorId,
            appointmentId: apt.id,
        }));
        navigate("/dashboard/live-consultation");
    };
    const handleCancel = async (aptId) => {
        const token = localStorage.getItem("megacare_token");
        await fetch(`/api/appointments/${aptId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments((prev) => prev.filter((a) => a.id !== aptId));
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, { userName: user.firstName }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Mes Rendez-vous" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "G\u00E9rez vos consultations m\u00E9dicales" })] }), _jsxs("div", { className: "p-6 max-w-5xl mx-auto space-y-6", children: [_jsx("div", { className: "flex gap-2 border-b border-border", children: ["upcoming", "past", "cancelled"].map((tab) => {
                                        const label = tab === "upcoming"
                                            ? "À venir"
                                            : tab === "past"
                                                ? "Passés"
                                                : "Annulés";
                                        const count = tab === "upcoming"
                                            ? upcoming.length
                                            : tab === "past"
                                                ? past.length
                                                : cancelled.length;
                                        return (_jsxs("button", { onClick: () => setActiveTab(tab), className: `px-4 py-3 font-medium border-b-2 transition ${activeTab === tab
                                                ? "border-primary text-primary"
                                                : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [label, " (", count, ")"] }, tab));
                                    }) }), _jsxs("div", { className: "space-y-4", children: [current.map((apt) => {
                                            const doctorName = doctors[apt.doctorId] || "Médecin";
                                            return (_jsxs("div", { className: "bg-card rounded-lg border border-border p-6 space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), _jsxs("div", { children: [_jsxs("h3", { className: "font-semibold text-lg text-foreground", children: ["Dr. ", doctorName] }), _jsx("p", { className: "text-muted-foreground text-sm", children: apt.reason })] })] }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(apt.status)}`, children: getStatusLabel(apt.status) })] }), _jsxs("div", { className: "flex flex-wrap gap-4 py-4 border-y border-border text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(Calendar, { size: 16, className: "text-primary" }), apt.date] }), _jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(Clock, { size: 16, className: "text-primary" }), apt.time, " \u00B7 30 min"] }), _jsxs("div", { className: "flex items-center gap-2 text-muted-foreground", children: [_jsx(Video, { size: 16, className: "text-primary" }), "Vid\u00E9o"] })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: (apt.status === "confirmed" ||
                                                            apt.status === "pending") &&
                                                            apt.date >= today && (_jsxs(_Fragment, { children: [_jsx("button", { onClick: () => handleJoin(apt), className: "px-4 py-2 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition", children: "Rejoindre" }), _jsx("button", { onClick: () => handleCancel(apt.id), className: "px-4 py-2 rounded-lg font-medium text-sm border border-border text-foreground hover:bg-secondary transition", children: "Annuler" })] })) })] }, apt.id));
                                        }), current.length === 0 && (_jsxs("div", { className: "text-center py-12 space-y-3", children: [_jsx("p", { className: "text-lg font-medium text-foreground", children: "Aucun rendez-vous" }), _jsxs("p", { className: "text-muted-foreground", children: ["Vous n'avez pas encore de rendez-vous", " ", activeTab === "upcoming"
                                                            ? "à venir"
                                                            : activeTab === "past"
                                                                ? "passés"
                                                                : "annulés", "."] })] }))] })] })] })] }) }));
}
