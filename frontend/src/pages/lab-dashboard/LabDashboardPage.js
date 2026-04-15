import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import { FlaskConical, FileText, Users, Image, Calendar, CreditCard, MessageSquare, BarChart3, Settings, Clock, CheckCircle2, AlertCircle, } from "lucide-react";
const quickLinks = [
    {
        href: "/lab-dashboard/tests",
        label: "Analyses",
        desc: "Gérer les demandes d'analyse",
        icon: FlaskConical,
        color: "text-blue-500",
        bg: "bg-blue-50",
    },
    {
        href: "/lab-dashboard/results",
        label: "Résultats",
        desc: "Consulter et partager les résultats",
        icon: FileText,
        color: "text-green-500",
        bg: "bg-green-50",
    },
    {
        href: "/lab-dashboard/imaging",
        label: "Imagerie",
        desc: "Radiologies et imagerie diagnostique",
        icon: Image,
        color: "text-purple-500",
        bg: "bg-purple-50",
        disabled: true,
    },
    {
        href: "/lab-dashboard/patients",
        label: "Patients",
        desc: "Gérer les dossiers patients",
        icon: Users,
        color: "text-indigo-500",
        bg: "bg-indigo-50",
        disabled: true,
    },
    {
        href: "/lab-dashboard/appointments",
        label: "Rendez-vous",
        desc: "Planifier les examens",
        icon: Calendar,
        color: "text-pink-500",
        bg: "bg-pink-50",
        disabled: true,
    },
    {
        href: "/lab-dashboard/billing",
        label: "Facturation",
        desc: "Gérer factures et paiements",
        icon: CreditCard,
        color: "text-amber-500",
        bg: "bg-amber-50",
        disabled: true,
    },
    {
        href: "/lab-dashboard/messaging",
        label: "Messagerie",
        desc: "Communication avec l'équipe",
        icon: MessageSquare,
        color: "text-teal-500",
        bg: "bg-teal-50",
        disabled: true,
    },
    {
        href: "/lab-dashboard/analytics",
        label: "Statistiques",
        desc: "Rapports d'activité",
        icon: BarChart3,
        color: "text-red-500",
        bg: "bg-red-50",
        disabled: true,
    },
    {
        href: "/lab-dashboard/settings",
        label: "Paramètres",
        desc: "Configurer le laboratoire",
        icon: Settings,
        color: "text-slate-500",
        bg: "bg-slate-50",
        disabled: true,
    },
];
const recentActivity = [
    {
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-50",
        text: "Analyse ADN — Leila Mansouri complétée",
        time: "Il y a 45 min",
    },
    {
        icon: AlertCircle,
        color: "text-amber-500",
        bg: "bg-amber-50",
        text: "Résultat cholestérol élevé — Karim Smaoui",
        time: "Il y a 1h 20",
    },
    {
        icon: FlaskConical,
        color: "text-blue-500",
        bg: "bg-blue-50",
        text: "Nouvelle demande d'analyse — Ahmed Nasser",
        time: "Il y a 2h",
    },
    {
        icon: FileText,
        color: "text-purple-500",
        bg: "bg-purple-50",
        text: "Résultat TSH partagé — Sara Meddeb",
        time: "Il y a 3h",
    },
    {
        icon: CheckCircle2,
        color: "text-green-500",
        bg: "bg-green-50",
        text: "Radio pulmonaire envoyée — Dr. Mansouri",
        time: "Il y a 4h",
    },
];
export default function LabDashboardPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [kpiResponse, setKpiResponse] = useState({
        examsToday: 0,
        completedToday: 0,
        pendingResults: 0,
        criticalResults: 0,
    });
    const [loadingKpis, setLoadingKpis] = useState(true);
    useEffect(() => {
        if (!isLoading && !isAuthenticated)
            navigate("/login");
        if (!isLoading && user && user.role !== "lab_radiology") {
            const dashboards = {
                patient: "/dashboard",
                doctor: "/doctor-dashboard",
                pharmacy: "/pharmacy-dashboard",
                medical_service: "/medical-service-dashboard",
                paramedical: "/paramedical-dashboard",
            };
            navigate(dashboards[user.role] ?? "/");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== "lab_radiology")
            return;
        const token = localStorage.getItem("megacare_token");
        fetch("/api/lab/kpis", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
            setKpiResponse(data);
            setLoadingKpis(false);
        })
            .catch(() => setLoadingKpis(false));
    }, [isAuthenticated, user]);
    if (isLoading || !isAuthenticated || !user || user.role !== "lab_radiology")
        return null;
    const kpis = [
        {
            label: "Examens aujourd'hui",
            value: loadingKpis ? "…" : String(kpiResponse.examsToday),
            sub: loadingKpis ? "" : `${kpiResponse.completedToday} complétés`,
            icon: FlaskConical,
            color: "text-blue-500",
            bg: "bg-blue-50",
        },
        {
            label: "Résultats en attente",
            value: loadingKpis ? "…" : String(kpiResponse.pendingResults),
            sub: "À traiter",
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-50",
        },
        {
            label: "Résultats critiques",
            value: loadingKpis ? "…" : String(kpiResponse.criticalResults),
            sub: "Nécessitent attention",
            icon: AlertCircle,
            color: "text-red-500",
            bg: "bg-red-50",
        },
        {
            label: "Médecins partenaires",
            value: "45",
            sub: "Actifs",
            icon: Users,
            color: "text-green-500",
            bg: "bg-green-50",
        },
    ];
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(LabDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Tableau de bord" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["Bonjour ", user.firstName, " \u2014 Laboratoire & Radiologie"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: kpis.map((k) => {
                                    const Icon = k.icon;
                                    return (_jsxs("div", { className: "bg-card rounded-xl border border-border p-4 flex items-center gap-4", children: [_jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${k.bg}`, children: _jsx(Icon, { size: 20, className: k.color }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: k.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: k.label }), _jsx("p", { className: "text-xs text-green-600 font-medium", children: k.sub })] })] }, k.label));
                                }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-sm font-semibold text-foreground mb-3", children: "Acc\u00E8s rapide" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3", children: quickLinks.map((q) => {
                                            const Icon = q.icon;
                                            if (q.disabled) {
                                                return (_jsxs("div", { title: "Bient\u00F4t disponible", className: "bg-card rounded-xl border border-border p-4 opacity-50 cursor-not-allowed space-y-2", children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center ${q.bg}`, children: _jsx(Icon, { size: 18, className: q.color }) }), _jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: q.label }), _jsx("p", { className: "text-xs text-muted-foreground leading-tight", children: q.desc })] }, q.href));
                                            }
                                            return (_jsxs(Link, { to: q.href, className: "bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/40 transition-all group space-y-2", children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center ${q.bg}`, children: _jsx(Icon, { size: 18, className: q.color }) }), _jsx("p", { className: "text-sm font-semibold text-foreground group-hover:text-primary transition", children: q.label }), _jsx("p", { className: "text-xs text-muted-foreground leading-tight", children: q.desc })] }, q.href));
                                        }) })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "px-5 py-4 border-b border-border", children: _jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Activit\u00E9 r\u00E9cente" }) }), _jsx("div", { className: "divide-y divide-border", children: recentActivity.map((a, i) => {
                                            const Icon = a.icon;
                                            return (_jsxs("div", { className: "flex items-center gap-4 px-5 py-3", children: [_jsx("div", { className: `w-8 h-8 rounded-lg flex items-center justify-center ${a.bg} shrink-0`, children: _jsx(Icon, { size: 15, className: a.color }) }), _jsx("p", { className: "flex-1 text-sm text-foreground", children: a.text }), _jsx("span", { className: "text-xs text-muted-foreground whitespace-nowrap", children: a.time })] }, i));
                                        }) })] })] })] })] }));
}
