import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Users, Clock, BarChart3, Settings, LogOut, ShieldCheck, Menu, X, UserX, Home, } from "lucide-react";
const menuItems = [
    { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/admin/users", label: "Utilisateurs", icon: Users },
    { href: "/admin/pending", label: "Approbations", icon: Clock },
    { href: "/admin/suspended", label: "Suspendus", icon: UserX },
    { href: "/admin/stats", label: "Statistiques", icon: BarChart3 },
    { href: "/admin/settings", label: "Paramètres", icon: Settings },
];
export function AdminDashboardSidebar() {
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
            "AD"
        : "AD";
    const displayName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.name || "Administrateur";
    // All admin sub-pages start with /admin — mark parent active too
    const isActive = (href) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
    const NavContent = () => (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-5 border-b border-sidebar-border shrink-0", children: [_jsx("div", { className: "w-9 h-9 bg-sidebar-primary/20 rounded-xl flex items-center justify-center", children: _jsx(ShieldCheck, { size: 17, className: "text-sidebar-primary" }) }), _jsxs("span", { className: "font-bold text-lg text-sidebar-foreground tracking-tight", children: ["MEGA", _jsx("span", { className: "text-sidebar-primary", children: "CARE" })] })] }), _jsx("div", { className: "px-4 py-3 border-b border-sidebar-border shrink-0", children: _jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/40", children: [_jsxs("div", { className: "relative shrink-0", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white", children: initials }), _jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sidebar" })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-semibold text-sm text-sidebar-foreground truncate", children: displayName }), _jsx("p", { className: "text-xs text-sidebar-foreground/50", children: "Administrateur" })] })] }) }), _jsx("nav", { className: "flex-1 overflow-y-auto px-3 py-3 space-y-0.5", children: menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (_jsxs(Link, { to: item.href, onClick: () => setMobileOpen(false), className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${active
                            ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                            : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`, children: [_jsx(Icon, { size: 17, className: active ? "text-sidebar-primary" : "" }), _jsx("span", { className: "flex-1", children: item.label })] }, item.href));
                }) }), _jsxs("div", { className: "px-3 py-3 border-t border-sidebar-border shrink-0 space-y-0.5", children: [_jsxs(Link, { to: "/", onClick: () => setMobileOpen(false), className: "w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-lg transition-all text-sm font-medium", children: [_jsx(Home, { size: 17 }), "Retour \u00E0 l\u2019accueil"] }), _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all text-sm font-medium", children: [_jsx(LogOut, { size: 17 }), "Se d\u00E9connecter"] })] })] }));
    return (_jsxs(_Fragment, { children: [_jsx("aside", { className: "hidden md:flex flex-col w-64 shrink-0 bg-sidebar h-screen sticky top-0", children: _jsx(NavContent, {}) }), _jsxs("div", { className: "md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border sticky top-0 z-40", children: [_jsxs("div", { className: "flex items-center gap-2.5", children: [_jsx("div", { className: "w-7 h-7 bg-sidebar-primary/20 rounded-lg flex items-center justify-center", children: _jsx(ShieldCheck, { size: 13, className: "text-sidebar-primary" }) }), _jsx("span", { className: "font-bold text-sidebar-foreground tracking-tight text-sm", children: "MEGACARE" })] }), _jsx("button", { onClick: () => setMobileOpen(true), className: "p-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground transition", children: _jsx(Menu, { size: 20 }) })] }), mobileOpen && (_jsxs("div", { className: "md:hidden fixed inset-0 z-50 flex", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: () => setMobileOpen(false) }), _jsxs("aside", { className: "relative w-72 bg-sidebar flex flex-col h-full overflow-hidden shadow-2xl", children: [_jsx("button", { onClick: () => setMobileOpen(false), className: "absolute top-4 right-4 z-10 p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground transition", children: _jsx(X, { size: 18 }) }), _jsx(NavContent, {})] })] }))] }));
}
