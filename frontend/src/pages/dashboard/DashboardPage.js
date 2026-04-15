import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useNavigate, Link } from "react-router-dom";
import { Calendar, Pill, Package, FileText, Clock, Camera, MapPin, Stethoscope, Video, Bell, TrendingUp, ChevronRight, ArrowRight, CheckCircle2, Activity, } from "lucide-react";
import { useEffect, useState } from "react";
export default function DashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [doctorNames, setDoctorNames] = useState({});
    const [dataLoading, setDataLoading] = useState(true);
    useEffect(() => {
        if (!isLoading && !isAuthenticated)
            navigate("/login");
        if (!isLoading && user && user.role !== "patient") {
            const dashboards = {
                doctor: "/doctor-dashboard",
                pharmacy: "/pharmacy-dashboard",
                medical_service: "/medical-service-dashboard",
                lab_radiology: "/lab-dashboard",
                paramedical: "/paramedical-dashboard",
                admin: "/admin",
            };
            navigate(dashboards[user.role] || "/");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user)
            return;
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        const headers = { Authorization: `Bearer ${token}` };
        Promise.all([
            fetch("/api/appointments", { headers }).then((r) => r.ok ? r.json() : []),
            fetch("/api/prescriptions", { headers }).then((r) => r.ok ? r.json() : []),
        ])
            .then(async ([appts, rxs]) => {
            setAppointments(appts);
            setPrescriptions(rxs);
            // Resolve doctor names for appointments
            const doctorIds = [...new Set(appts.map((a) => a.doctorId))];
            const names = {};
            await Promise.all(doctorIds.map((id) => fetch(`/api/users/${id}`, { headers })
                .then((r) => r.ok ? r.json() : null)
                .then((u) => { if (u)
                names[id] = `${u.firstName} ${u.lastName}`; })
                .catch(() => { })));
            setDoctorNames(names);
        })
            .catch(() => { })
            .finally(() => setDataLoading(false));
    }, [isAuthenticated, user]);
    if (isLoading || dataLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-background", children: _jsxs("div", { className: "space-y-4 text-center", children: [_jsx("div", { className: "w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Chargement du dashboard..." })] }) }));
    }
    if (!isAuthenticated || !user || user.role !== "patient")
        return null;
    const patientName = user.firstName || user.name?.split(" ")[0] || user.email.split("@")[0];
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
    // Compute upcoming appointments from real data
    const now = new Date();
    const upcomingAppointments = appointments
        .filter((a) => {
        const apptDate = new Date(`${a.date}T${a.time}`);
        return apptDate >= now && a.status !== "cancelled" && a.status !== "rejected";
    })
        .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
        .slice(0, 3)
        .map((a) => {
        const apptDate = new Date(`${a.date}T${a.time}`);
        const hoursUntil = Math.max(0, Math.round((apptDate.getTime() - now.getTime()) / 3600000));
        const isToday = a.date === now.toISOString().split("T")[0];
        const isTomorrow = a.date === new Date(now.getTime() + 86400000).toISOString().split("T")[0];
        const dateLabel = isToday ? "Aujourd'hui" : isTomorrow ? "Demain" : new Date(a.date).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" });
        return {
            id: a.id,
            doctor: doctorNames[a.doctorId] || "Médecin",
            specialty: a.reason || "Consultation",
            date: dateLabel,
            time: a.time,
            type: "Vidéo",
            hoursUntil,
        };
    });
    const upcomingCount = upcomingAppointments.length;
    const nextApptLabel = upcomingAppointments.length > 0
        ? `Prochain: ${upcomingAppointments[0].date} ${upcomingAppointments[0].time}`
        : "Aucun RDV";
    const kpiCards = [
        {
            icon: Calendar,
            title: "RDV à venir",
            value: String(upcomingCount),
            subtitle: nextApptLabel,
            iconClass: "text-primary",
            bgClass: "bg-primary/10",
        },
        {
            icon: Pill,
            title: "Ordonnances",
            value: String(prescriptions.length),
            subtitle: prescriptions.length > 0 ? `${prescriptions.length} ordonnance(s)` : "Aucune ordonnance",
            iconClass: "text-accent",
            bgClass: "bg-accent/10",
        },
        {
            icon: FileText,
            title: "Consultations",
            value: String(appointments.filter((a) => a.status === "completed").length),
            subtitle: "Consultations passées",
            iconClass: "text-violet-500",
            bgClass: "bg-violet-500/10",
        },
        {
            icon: CheckCircle2,
            title: "Total RDV",
            value: String(appointments.length),
            subtitle: "Tous les rendez-vous",
            iconClass: "text-amber-500",
            bgClass: "bg-amber-500/10",
        },
    ];
    const quickActions = [
        {
            to: "/dashboard/find-doctor",
            icon: Stethoscope,
            label: "Trouver un médecin",
            desc: "Nouveau rendez-vous",
            iconClass: "text-primary",
            bgClass: "bg-primary/10",
        },
        {
            to: "/pharmacy/prescription-scanner",
            icon: Camera,
            label: "Scanner ordonnance",
            desc: "Extraction OCR auto",
            iconClass: "text-accent",
            bgClass: "bg-accent/10",
        },
        {
            to: "/dashboard/medical-records",
            icon: FileText,
            label: "Mon dossier",
            desc: "Gérer mes informations",
            iconClass: "text-violet-500",
            bgClass: "bg-violet-500/10",
        },
        {
            to: "/consultation",
            icon: Video,
            label: "Consultation vidéo",
            desc: "Rejoindre maintenant",
            iconClass: "text-amber-500",
            bgClass: "bg-amber-500/10",
        },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-background flex", children: [_jsx(DashboardSidebar, { userName: patientName }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsx("div", { className: "sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border", children: _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-xl font-bold text-foreground", children: [greeting, ", ", patientName, " \uD83D\uDC4B"] }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: new Date().toLocaleDateString("fr-FR", {
                                                weekday: "long",
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }) })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsxs(Link, { to: "/dashboard/notifications", className: "relative p-2 rounded-lg hover:bg-secondary transition text-muted-foreground hover:text-foreground", children: [_jsx(Bell, { size: 18 }), _jsx("span", { className: "absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" })] }), _jsxs(Link, { to: "/dashboard/find-doctor", className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium flex items-center gap-2", children: [_jsx(Stethoscope, { size: 14 }), "Consulter"] })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-6 py-8 space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: kpiCards.map((card, idx) => {
                                    const Icon = card.icon;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5 space-y-4 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsx("div", { className: `w-11 h-11 rounded-xl ${card.bgClass} flex items-center justify-center`, children: _jsx(Icon, { size: 20, className: card.iconClass }) }), _jsx(TrendingUp, { size: 13, className: "text-muted-foreground/30 mt-1" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: card.title }), _jsx("p", { className: "text-2xl font-extrabold text-foreground mt-0.5", children: card.value })] }), _jsx("p", { className: "text-xs text-muted-foreground border-t border-border pt-3", children: card.subtitle })] }, idx));
                                }) }), _jsxs("div", { className: "grid lg:grid-cols-5 gap-6", children: [_jsxs("div", { className: "lg:col-span-3 bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "bg-gradient-to-r from-primary to-primary/80 px-6 py-4 flex items-center justify-between", children: [_jsxs("p", { className: "text-white font-semibold text-sm flex items-center gap-2", children: [_jsx(Calendar, { size: 14 }), "Prochain rendez-vous"] }), upcomingAppointments.length > 0 && (_jsxs("span", { className: "text-xs text-white/80 bg-white/20 px-2.5 py-1 rounded-full", children: ["Dans ", upcomingAppointments[0].hoursUntil, "h"] }))] }), upcomingAppointments.length > 0 ? (_jsxs("div", { className: "p-6 space-y-5", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0", children: _jsx(Stethoscope, { size: 24, className: "text-primary" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "font-bold text-foreground", children: ["Dr. ", upcomingAppointments[0].doctor] }), _jsx("p", { className: "text-sm text-primary font-medium", children: upcomingAppointments[0].specialty }), _jsxs("div", { className: "flex items-center gap-4 mt-2 text-sm text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Calendar, { size: 12 }), upcomingAppointments[0].date] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { size: 12 }), upcomingAppointments[0].time] })] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { className: "flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-semibold flex items-center justify-center gap-2", children: [_jsx(Video, { size: 14 }), "Rejoindre la salle"] }), _jsx("button", { className: "flex-1 py-2.5 border border-border text-foreground rounded-lg hover:bg-secondary transition text-sm font-medium", children: "Voir d\u00E9tails" })] }), _jsxs("p", { className: "text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5", children: [_jsx(Clock, { size: 11 }), "Salle active 10 min avant le rendez-vous"] })] })) : (_jsxs("div", { className: "p-6 text-center text-muted-foreground", children: [_jsx("p", { className: "text-sm", children: "Aucun rendez-vous \u00E0 venir" }), _jsx(Link, { to: "/dashboard/find-doctor", className: "text-primary text-sm font-medium hover:underline mt-2 inline-block", children: "Prendre un rendez-vous" })] }))] }), _jsxs("div", { className: "lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-accent to-accent/80 px-6 py-4", children: _jsxs("p", { className: "text-white font-semibold text-sm flex items-center gap-2", children: [_jsx(Pill, { size: 14 }), "Pharmacie en ligne"] }) }), _jsx("div", { className: "p-4 space-y-2", children: [
                                                    {
                                                        to: "/pharmacy/prescription-scanner",
                                                        icon: Camera,
                                                        label: "Scanner d'ordonnance",
                                                        desc: "Extraction OCR automatique",
                                                        iconClass: "text-primary",
                                                        bgClass: "bg-primary/10",
                                                        hoverBorder: "hover:border-primary/30 hover:bg-primary/5",
                                                        chevronHover: "group-hover:text-primary",
                                                    },
                                                    {
                                                        to: "/pharmacy",
                                                        icon: MapPin,
                                                        label: "Trouver une pharmacie",
                                                        desc: "Près de chez vous",
                                                        iconClass: "text-accent",
                                                        bgClass: "bg-accent/10",
                                                        hoverBorder: "hover:border-accent/30 hover:bg-accent/5",
                                                        chevronHover: "group-hover:text-accent",
                                                    },
                                                    {
                                                        to: "/dashboard/orders",
                                                        icon: Package,
                                                        label: "Mes commandes",
                                                        desc: "Suivi en temps réel",
                                                        iconClass: "text-amber-500",
                                                        bgClass: "bg-amber-500/10",
                                                        hoverBorder: "hover:border-amber-500/30 hover:bg-amber-500/5",
                                                        chevronHover: "group-hover:text-amber-500",
                                                    },
                                                ].map(({ to, icon: Icon, label, desc, iconClass, bgClass, hoverBorder, chevronHover, }) => (_jsxs(Link, { to: to, className: `flex items-center gap-3 p-3.5 rounded-xl border border-border ${hoverBorder} transition group`, children: [_jsx("div", { className: `w-9 h-9 rounded-lg ${bgClass} flex items-center justify-center shrink-0`, children: _jsx(Icon, { size: 16, className: iconClass }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: label }), _jsx("p", { className: "text-xs text-muted-foreground", children: desc })] }), _jsx(ChevronRight, { size: 14, className: `text-muted-foreground/30 ${chevronHover} transition` })] }, to))) })] })] }), _jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [_jsxs("h3", { className: "font-semibold text-foreground text-sm flex items-center gap-2", children: [_jsx(Calendar, { size: 15, className: "text-primary" }), "Mes rendez-vous"] }), _jsxs(Link, { to: "/dashboard/appointments", className: "text-xs text-primary hover:underline font-medium flex items-center gap-1", children: ["Voir tous ", _jsx(ArrowRight, { size: 12 })] })] }), _jsx("div", { className: "p-4 space-y-2", children: upcomingAppointments.length > 0 ? upcomingAppointments.map((apt, index) => (_jsxs("div", { className: `flex items-center gap-3 p-3.5 rounded-xl border transition ${index === 0
                                                        ? "bg-primary/5 border-primary/20"
                                                        : "border-border hover:bg-secondary/30"}`, children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${index === 0 ? "bg-primary/10" : "bg-secondary"}`, children: _jsx(Stethoscope, { size: 15, className: index === 0 ? "text-primary" : "text-muted-foreground" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "font-semibold text-foreground text-sm truncate", children: ["Dr. ", apt.doctor] }), _jsx("p", { className: "text-xs text-muted-foreground", children: apt.specialty })] }), _jsxs("div", { className: "text-right shrink-0", children: [_jsx("p", { className: `text-xs font-semibold ${index === 0 ? "text-primary" : "text-muted-foreground"}`, children: apt.date }), _jsx("p", { className: "text-xs text-muted-foreground", children: apt.time })] })] }, apt.id))) : (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Aucun rendez-vous \u00E0 venir" })) })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [_jsxs("h3", { className: "font-semibold text-foreground text-sm flex items-center gap-2", children: [_jsx(Pill, { size: 15, className: "text-accent" }), "Ordonnances r\u00E9centes"] }), _jsxs(Link, { to: "/dashboard/prescriptions", className: "text-xs text-primary hover:underline font-medium flex items-center gap-1", children: ["Voir toutes ", _jsx(ArrowRight, { size: 12 })] })] }), _jsx("div", { className: "p-4 space-y-2", children: prescriptions.length > 0 ? prescriptions.slice(0, 3).map((rx) => (_jsx("div", { className: "p-4 rounded-xl border border-border hover:bg-secondary/30 transition space-y-2", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: doctorNames[rx.doctorId] ? `Dr. ${doctorNames[rx.doctorId]}` : "Ordonnance" }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: new Date(rx.createdAt).toLocaleDateString("fr-FR") })] }), _jsxs("span", { className: "text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/10 text-accent flex items-center gap-1.5", children: [_jsx(Pill, { size: 10 }), rx.medicines?.length || 0, " m\u00E9dicament(s)"] })] }) }, rx.id))) : (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Aucune ordonnance" })) })] })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Activity, { size: 15, className: "text-muted-foreground" }), _jsx("h2", { className: "text-sm font-semibold text-foreground", children: "Acc\u00E8s rapide" })] }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: quickActions.map(({ to, icon: Icon, label, desc, iconClass, bgClass }) => (_jsxs(Link, { to: to, className: "group bg-card rounded-xl border border-border p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 space-y-3", children: [_jsx("div", { className: `w-11 h-11 rounded-xl ${bgClass} flex items-center justify-center group-hover:scale-110 transition-transform`, children: _jsx(Icon, { size: 20, className: iconClass }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: label }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: desc })] }), _jsxs("div", { className: `flex items-center gap-1 text-xs font-medium ${iconClass}`, children: ["Acc\u00E9der ", _jsx(ArrowRight, { size: 11 })] })] }, to))) })] })] })] })] }));
}
