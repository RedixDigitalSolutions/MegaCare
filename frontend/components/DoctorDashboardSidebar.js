import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Calendar, Users, Video, FileText, TrendingUp, Star, Settings, LogOut, Stethoscope, Menu, X, MessageSquare, } from "lucide-react";
const menuItems = [
    {
        href: "/doctor-dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
    },
    { href: "/doctor-dashboard/agenda", label: "Mon agenda", icon: Calendar },
    { href: "/doctor-dashboard/patients", label: "Mes patients", icon: Users },
    {
        href: "/doctor-dashboard/consultations",
        label: "Consultations",
        icon: Video,
    },
    {
        href: "/doctor-dashboard/prescriptions",
        label: "Ordonnances",
        icon: FileText,
    },
    { href: "/doctor-dashboard/revenue", label: "Mes revenus", icon: TrendingUp },
    { href: "/doctor-dashboard/reviews", label: "Avis patients", icon: Star },
    {
        href: "/doctor-dashboard/messaging",
        label: "Messages",
        icon: MessageSquare,
    },
    { href: "/doctor-dashboard/settings", label: "Paramètres", icon: Settings },
];
export function DoctorDashboardSidebar({ doctorName, livePatientName, }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const displayName = user
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
            doctorName ||
            "Médecin"
        : doctorName || "Médecin";
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const initials = user
        ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
            displayName[0].toUpperCase()
        : displayName[0].toUpperCase();
    const NavContent = () => (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-5 border-b border-sidebar-border shrink-0", children: [_jsx("div", { className: "w-9 h-9 bg-sidebar-primary/20 rounded-xl flex items-center justify-center", children: _jsx(Stethoscope, { size: 17, className: "text-sidebar-primary" }) }), _jsxs("span", { className: "font-bold text-lg text-sidebar-foreground tracking-tight", children: ["MEGA", _jsx("span", { className: "text-sidebar-primary", children: "CARE" })] })] }), _jsx("div", { className: "px-4 py-3 border-b border-sidebar-border shrink-0", children: _jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/40", children: [_jsxs("div", { className: "relative shrink-0", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white", children: initials }), _jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sidebar" })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("p", { className: "font-semibold text-sm text-sidebar-foreground truncate", children: ["Dr. ", displayName] }), _jsx("p", { className: "text-xs text-sidebar-foreground/50", children: "M\u00E9decin" })] })] }) }), _jsxs("nav", { className: "flex-1 overflow-y-auto px-3 py-3 space-y-0.5", children: [livePatientName && (_jsxs(Link, { to: "/doctor-dashboard/live-consultation", onClick: () => setMobileOpen(false), className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${pathname === "/doctor-dashboard/live-consultation"
                            ? "bg-red-500/10 text-red-600 font-semibold"
                            : "text-red-500 hover:bg-red-500/10 font-medium"}`, children: [_jsxs("span", { className: "relative flex h-2.5 w-2.5", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }), _jsx("span", { className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" })] }), _jsxs("span", { className: "flex-1 truncate", children: ["Live \u2014 ", livePatientName] })] })), menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (_jsxs(Link, { to: item.href, onClick: () => setMobileOpen(false), className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${isActive
                                ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`, children: [_jsx(Icon, { size: 17, className: isActive ? "text-sidebar-primary" : "" }), _jsx("span", { className: "flex-1", children: item.label })] }, item.href));
                    })] }), _jsx("div", { className: "px-3 py-3 border-t border-sidebar-border shrink-0", children: _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all text-sm font-medium", children: [_jsx(LogOut, { size: 17 }), "Se d\u00E9connecter"] }) })] }));
    return (_jsxs(_Fragment, { children: [_jsx("aside", { className: "hidden md:flex flex-col w-64 shrink-0 bg-sidebar h-screen sticky top-0", children: _jsx(NavContent, {}) }), _jsxs("div", { className: "md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border sticky top-0 z-40", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-7 h-7 bg-sidebar-primary/20 rounded-lg flex items-center justify-center", children: _jsx(Stethoscope, { size: 13, className: "text-sidebar-primary" }) }), _jsx("span", { className: "font-bold text-sidebar-foreground tracking-tight text-sm", children: "MEGACARE" })] }), _jsx("button", { onClick: () => setMobileOpen(true), className: "p-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground transition", children: _jsx(Menu, { size: 20 }) })] }), mobileOpen && (_jsxs("div", { className: "md:hidden fixed inset-0 z-50 flex", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: () => setMobileOpen(false) }), _jsxs("aside", { className: "relative w-72 bg-sidebar flex flex-col h-full overflow-hidden shadow-2xl animate-slide-right", children: [_jsx("button", { onClick: () => setMobileOpen(false), className: "absolute top-4 right-4 z-10 p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground transition", children: _jsx(X, { size: 18 }) }), _jsx(NavContent, {})] })] }))] }));
}
