import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Video, TrendingUp, Star, Clock, Settings } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
export default function DoctorDashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [allAppointments, setAllAppointments] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [countdown, setCountdown] = useState(0);
    const fetchAppointments = useCallback(async () => {
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        try {
            const res = await fetch("/api/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setAllAppointments(data);
            }
        }
        catch {
            /* server unreachable */
        }
        finally {
            setFetchLoading(false);
        }
    }, []);
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
        if (!isLoading && user && user.role !== "doctor") {
            const dashboards = {
                patient: "/dashboard",
                pharmacy: "/pharmacy-dashboard",
            };
            navigate(dashboards[user.role]);
        }
        if (!isLoading &&
            user &&
            user.role === "doctor" &&
            user.status !== "approved") {
            navigate("/account-review");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (isAuthenticated && user?.role === "doctor") {
            fetchAppointments();
        }
    }, [isAuthenticated, user, fetchAppointments]);
    useEffect(() => {
        const timer = setInterval(() => setCountdown((s) => Math.max(0, s - 1)), 1000);
        return () => clearInterval(timer);
    }, []);
    if (isLoading || fetchLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "space-y-4 text-center", children: [_jsx("div", { className: "w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" }), _jsx("p", { className: "text-muted-foreground", children: "Chargement du dashboard..." })] }) }));
    }
    if (!isAuthenticated || !user || user.role !== "doctor") {
        return null;
    }
    const doctorName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.name || `${user.email.split("@")[0]}`;
    const specialty = user.specialization || "Cardiologie";
    const todayDate = new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const todayKey = new Date().toISOString().split("T")[0];
    // Derive data from fetched appointments
    const todayAppointments = allAppointments.filter((a) => a.date === todayKey && a.status !== "rejected");
    const pendingAppointments = allAppointments.filter((a) => a.status === "pending");
    const confirmedToday = todayAppointments.filter((a) => a.status === "confirmed");
    // Build time slots for today's agenda view
    const SLOT_TIMES = [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "12:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30",
    ];
    const timeSlots = SLOT_TIMES.map((time) => {
        const appt = todayAppointments.find((a) => a.time === time);
        if (appt) {
            return {
                time,
                status: appt.status,
                patient: appt.patientName,
                reason: appt.reason,
            };
        }
        return {
            time,
            status: "free",
            patient: undefined,
            reason: undefined,
        };
    });
    // Next consultation: first confirmed appointment after now
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const upcomingConfirmed = confirmedToday
        .filter((a) => {
        const [h, m] = a.time.split(":").map(Number);
        return h * 60 + m > nowMinutes;
    })
        .sort((a, b) => a.time.localeCompare(b.time));
    const nextConsultation = upcomingConfirmed[0] || null;
    // Countdown to next consultation
    if (nextConsultation && countdown === 0) {
        const [h, m] = nextConsultation.time.split(":").map(Number);
        const diff = h * 60 + m - nowMinutes;
        if (diff > 0) {
            setCountdown(diff * 60);
        }
    }
    const confirmAppointment = async (id) => {
        const token = localStorage.getItem("megacare_token");
        try {
            const res = await fetch(`/api/appointments/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "confirmed" }),
            });
            if (res.ok) {
                setAllAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a)));
            }
        }
        catch {
            /* ignore */
        }
    };
    const rejectAppointment = async (id) => {
        const token = localStorage.getItem("megacare_token");
        try {
            const res = await fetch(`/api/appointments/${id}/status`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: "rejected" }),
            });
            if (res.ok) {
                setAllAppointments((prev) => prev.filter((a) => a.id !== id));
            }
        }
        catch {
            /* ignore */
        }
    };
    const kpiCards = [
        {
            icon: Video,
            title: "Consultations",
            value: String(confirmedToday.length),
            subtitle: "Aujourd'hui",
            color: "text-blue-500",
            bgColor: "bg-blue-50",
        },
        {
            icon: TrendingUp,
            title: "Total RDV",
            value: String(allAppointments.length),
            subtitle: "Tous les rendez-vous",
            color: "text-green-500",
            bgColor: "bg-green-50",
        },
        {
            icon: Star,
            title: "Aujourd'hui",
            value: String(todayAppointments.length),
            subtitle: "Créneaux occupés",
            color: "text-yellow-500",
            bgColor: "bg-yellow-50",
        },
        {
            icon: Clock,
            title: "RDV en attente",
            value: String(pendingAppointments.length),
            subtitle: "Confirmation requise",
            color: "text-orange-500",
            bgColor: "bg-orange-50",
        },
    ];
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, {}), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsx("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-foreground", children: ["Dr. ", doctorName] }), _jsxs("p", { className: "text-muted-foreground mt-1", children: [specialty, " \u2022 ", todayDate] })] }), _jsxs(Link, { to: "/doctor-dashboard/settings", className: "px-5 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2 text-sm", children: [_jsx(Settings, { size: 16 }), "Mon profil"] })] }) }), _jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: kpiCards.map((card, idx) => {
                                        const Icon = card.icon;
                                        return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-3", children: [_jsx("div", { className: `w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`, children: _jsx(Icon, { className: `w-6 h-6 ${card.color}` }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: card.title }), _jsx("p", { className: "text-2xl font-bold text-foreground", children: card.value })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: card.subtitle })] }, idx));
                                    }) }), pendingAppointments.length > 0 && (_jsxs("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4", children: [_jsxs("h3", { className: "font-semibold text-orange-900 flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\u23F3" }), pendingAppointments.length, " rendez-vous en attente de confirmation"] }), _jsx("div", { className: "space-y-2", children: pendingAppointments.map((apt) => (_jsxs("div", { className: "flex items-center justify-between bg-white rounded-lg p-3 border border-orange-100", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-foreground", children: apt.patientName }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [apt.time, " \u2022 ", apt.date, " \u2022 ", apt.reason] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => confirmAppointment(apt.id), className: "px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition font-medium", children: "\u2713 Confirmer" }), _jsx("button", { onClick: () => rejectAppointment(apt.id), className: "px-3 py-1 border border-red-300 text-red-700 rounded text-xs hover:bg-red-50 transition font-medium", children: "\u2717 Refuser" })] })] }, apt.id))) })] })), _jsxs("div", { className: "grid lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 bg-card rounded-xl border border-border p-6 space-y-4", children: [_jsxs("h3", { className: "text-xl font-bold text-foreground", children: ["Agenda \u2014", " ", todayDate.split(" ")[0].charAt(0).toUpperCase() +
                                                            todayDate.split(" ")[0].slice(1), " ", todayDate.split(" ")[1]] }), _jsx("div", { className: "space-y-2 max-h-96 overflow-y-auto", children: timeSlots.map((slot, idx) => (_jsxs("div", { className: `flex items-center gap-4 p-3 rounded-lg transition ${slot.status === "free"
                                                            ? "bg-secondary/30 hover:bg-secondary"
                                                            : slot.status === "confirmed"
                                                                ? "bg-blue-50 border border-blue-200"
                                                                : "bg-orange-50 border border-orange-200"}`, children: [_jsx("p", { className: "w-16 font-mono font-bold text-foreground", children: slot.time }), _jsx("div", { className: "flex-1", children: slot.status === "free" ? (_jsx("p", { className: "text-xs text-muted-foreground", children: "Libre" })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: slot.patient }), _jsx("p", { className: `text-xs ${slot.status === "confirmed"
                                                                                ? "text-blue-700"
                                                                                : "text-orange-700"}`, children: slot.status === "confirmed"
                                                                                ? "Confirmé"
                                                                                : "En attente" })] })) }), slot.status === "free" && (_jsx("button", { className: "text-xs px-2 py-1 text-muted-foreground hover:bg-foreground/5 rounded transition", children: "Bloquer" }))] }, idx))) })] }), _jsxs("div", { className: "bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border-2 border-primary/30 p-6 space-y-4", children: [_jsx("h3", { className: "font-bold text-foreground", children: "Prochaine consultation" }), nextConsultation ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "bg-white/60 rounded-lg p-4 space-y-2", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Dans" }), _jsx("p", { className: `text-3xl font-bold ${countdown === 0 ? "text-destructive animate-pulse" : "text-primary"}`, children: countdown > 0
                                                                        ? `${Math.floor(countdown / 60)}m ${String(countdown % 60).padStart(2, "0")}s`
                                                                        : "Maintenant" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-sm font-semibold text-foreground", children: ["\uD83D\uDC64 ", nextConsultation.patientName] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Heure: ", nextConsultation.time] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Motif: ", nextConsultation.reason || "—"] })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("button", { className: "flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium text-sm", children: "Voir dossier" }), _jsx("button", { className: "flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium text-sm", children: "Ouvrir salle" })] })] })) : (_jsx("div", { className: "bg-white/60 rounded-lg p-4 text-center", children: _jsx("p", { className: "text-muted-foreground text-sm", children: "Aucune consultation confirm\u00E9e \u00E0 venir aujourd'hui" }) }))] })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-4", children: [_jsx("h3", { className: "font-bold text-foreground", children: "R\u00E9partition par statut" }), _jsx("div", { className: "space-y-3", children: [
                                                        {
                                                            name: "Confirmés",
                                                            count: allAppointments.filter((a) => a.status === "confirmed").length,
                                                            color: "bg-blue-500",
                                                        },
                                                        {
                                                            name: "En attente",
                                                            count: allAppointments.filter((a) => a.status === "pending").length,
                                                            color: "bg-orange-500",
                                                        },
                                                    ].map((item, idx) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${item.color}` }), _jsx("p", { className: "text-sm text-foreground", children: item.name })] }), _jsx("p", { className: "font-semibold text-primary", children: item.count })] }, idx))) })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-4", children: [_jsx("h3", { className: "font-bold text-foreground", children: "Prochains rendez-vous" }), _jsxs("div", { className: "space-y-3", children: [allAppointments
                                                            .filter((a) => a.date >= todayKey && a.status !== "rejected")
                                                            .sort((a, b) => a.date.localeCompare(b.date) ||
                                                            a.time.localeCompare(b.time))
                                                            .slice(0, 5)
                                                            .map((a) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-foreground", children: a.patientName }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [a.date, " \u00E0 ", a.time] })] }), _jsx("span", { className: `text-xs font-semibold px-2 py-0.5 rounded-full ${a.status === "confirmed"
                                                                        ? "bg-blue-100 text-blue-700"
                                                                        : "bg-orange-100 text-orange-700"}`, children: a.status === "confirmed" ? "Confirmé" : "En attente" })] }, a.id))), allAppointments.filter((a) => a.date >= todayKey && a.status !== "rejected").length === 0 && (_jsx("p", { className: "text-sm text-muted-foreground", children: "Aucun rendez-vous \u00E0 venir" }))] })] })] })] })] })] }) }));
}
