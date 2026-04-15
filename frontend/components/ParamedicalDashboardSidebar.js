import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Calendar, ClipboardList, Users, FileHeart, Activity, Video, MessageSquare, Bell, Map, Package, BarChart3, Settings, LogOut, Stethoscope, Menu, X, } from "lucide-react";
const menuItems = [
    {
        href: "/paramedical-dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
    },
    {
        href: "/paramedical-dashboard/appointments",
        label: "Rendez-vous",
        icon: Calendar,
    },
    {
        href: "/paramedical-dashboard/planning",
        label: "Planning",
        icon: ClipboardList,
    },
    { href: "/paramedical-dashboard/patients", label: "Patients", icon: Users },
    {
        href: "/paramedical-dashboard/care-record",
        label: "Dossier de soins",
        icon: FileHeart,
    },
    {
        href: "/paramedical-dashboard/vitals",
        label: "Constantes",
        icon: Activity,
    },
    {
        href: "/paramedical-dashboard/teleconsultation",
        label: "Téléconsultation",
        icon: Video,
    },
    {
        href: "/paramedical-dashboard/messaging",
        label: "Messagerie",
        icon: MessageSquare,
    },
    {
        href: "/paramedical-dashboard/notifications",
        label: "Notifications",
        icon: Bell,
    },
    { href: "/paramedical-dashboard/map", label: "Carte", icon: Map },
    { href: "/paramedical-dashboard/supplies", label: "Matériel", icon: Package },
    {
        href: "/paramedical-dashboard/reports",
        label: "Rapports",
        icon: BarChart3,
    },
    {
        href: "/paramedical-dashboard/settings",
        label: "Paramètres",
        icon: Settings,
    },
];
export function ParamedicalDashboardSidebar() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
            "PM"
        : "PM";
    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.name || "Paramédical";
    const NavContent = () => (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-5 border-b border-sidebar-border shrink-0", children: [_jsx("div", { className: "w-9 h-9 bg-sidebar-primary/20 rounded-xl flex items-center justify-center", children: _jsx(Stethoscope, { size: 17, className: "text-sidebar-primary" }) }), _jsxs("span", { className: "font-bold text-lg text-sidebar-foreground tracking-tight", children: ["MEGA", _jsx("span", { className: "text-sidebar-primary", children: "CARE" })] })] }), _jsx("div", { className: "px-4 py-3 border-b border-sidebar-border shrink-0", children: _jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/40", children: [_jsxs("div", { className: "relative shrink-0", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white", children: initials }), _jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sidebar" })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-sm text-sidebar-foreground truncate", children: displayName }), _jsx("p", { className: "text-xs text-sidebar-foreground/50", children: "Param\u00E9dical" })] })] }) }), _jsx("nav", { className: "flex-1 overflow-y-auto px-3 py-3 space-y-0.5", children: menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (_jsxs(Link, { to: item.href, onClick: () => setMobileOpen(false), className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${isActive
                            ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`, children: [_jsx(Icon, { size: 17, className: isActive ? "text-sidebar-primary" : "" }), _jsx("span", { className: "flex-1", children: item.label })] }, item.href));
                }) }), _jsx("div", { className: "px-3 py-3 border-t border-sidebar-border shrink-0", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all text-sm font-medium", children: [_jsx(LogOut, { size: 17 }), "Se d\u00E9connecter"] }) })] }));
    return (_jsxs(_Fragment, { children: [_jsx("aside", { className: "hidden md:flex flex-col w-64 shrink-0 bg-sidebar h-screen sticky top-0", children: _jsx(NavContent, {}) }), _jsxs("div", { className: "md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border sticky top-0 z-40", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-7 h-7 bg-sidebar-primary/20 rounded-lg flex items-center justify-center", children: _jsx(Stethoscope, { size: 13, className: "text-sidebar-primary" }) }), _jsx("span", { className: "font-bold text-sidebar-foreground tracking-tight text-sm", children: "MEGACARE" })] }), _jsx("button", { onClick: () => setMobileOpen(true), className: "p-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground transition", children: _jsx(Menu, { size: 20 }) })] }), mobileOpen && (_jsxs("div", { className: "md:hidden fixed inset-0 z-50 flex", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: () => setMobileOpen(false) }), _jsxs("aside", { className: "relative w-72 bg-sidebar flex flex-col h-full overflow-hidden shadow-2xl animate-slide-right", children: [_jsx("button", { onClick: () => setMobileOpen(false), className: "absolute top-4 right-4 z-10 p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground transition", children: _jsx(X, { size: 18 }) }), _jsx(NavContent, {})] })] }))] }));
}
