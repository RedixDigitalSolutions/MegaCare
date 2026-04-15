import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, ShoppingCart, TrendingUp, Package, LogOut, FlaskConical, Menu, X, } from "lucide-react";
const menuItems = [
    {
        href: "/pharmacy-dashboard",
        label: "Tableau de bord",
        icon: LayoutDashboard,
    },
    {
        href: "/pharmacy-dashboard/orders",
        label: "Commandes",
        icon: ShoppingCart,
    },
    { href: "/pharmacy-dashboard/sales", label: "Ventes", icon: TrendingUp },
    { href: "/pharmacy-dashboard/stock", label: "Stock", icon: Package },
];
export function PharmacyDashboardSidebar({ pharmacyName = "Pharmacie", }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const initials = pharmacyName
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase();
    const handleLogout = () => {
        logout();
        navigate("/login");
    };
    const isActive = (href) => href === "/pharmacy-dashboard"
        ? location.pathname === "/pharmacy-dashboard"
        : location.pathname.startsWith(href);
    const SidebarContent = () => (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "p-6 border-b border-sidebar-border", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center", children: _jsx(FlaskConical, { size: 20, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-sidebar-foreground text-sm leading-tight", children: "MegaCare" }), _jsx("p", { className: "text-xs text-sidebar-foreground/60", children: "Pharmacie" })] })] }) }), _jsx("div", { className: "p-4 border-b border-sidebar-border", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0", children: initials }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-semibold text-sidebar-foreground text-sm truncate", children: pharmacyName }), _jsx("p", { className: "text-xs text-sidebar-foreground/60", children: "Pharmacien" })] })] }) }), _jsx("nav", { className: "flex-1 p-4 space-y-1 overflow-y-auto", children: menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (_jsxs(Link, { to: item.href, onClick: () => setMobileOpen(false), className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${active
                            ? "bg-sidebar-accent text-sidebar-foreground"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`, children: [_jsx(Icon, { size: 18, className: active ? "text-primary" : "text-sidebar-foreground/50" }), item.label] }, item.href));
                }) }), _jsx("div", { className: "p-4 border-t border-sidebar-border", children: _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-sidebar-foreground/70 hover:bg-red-500/10 hover:text-red-500 transition", children: [_jsx(LogOut, { size: 18 }), "D\u00E9connexion"] }) })] }));
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "md:hidden fixed top-4 left-4 z-50", children: _jsx("button", { onClick: () => setMobileOpen(true), className: "p-2 bg-card border border-border rounded-lg shadow-md", children: _jsx(Menu, { size: 20 }) }) }), mobileOpen && (_jsx("div", { className: "fixed inset-0 z-40 bg-black/50 md:hidden", onClick: () => setMobileOpen(false) })), _jsxs("aside", { className: `fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-200 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`, children: [_jsx("div", { className: "absolute top-4 right-4", children: _jsx("button", { onClick: () => setMobileOpen(false), className: "p-1 hover:bg-muted rounded", children: _jsx(X, { size: 18 }) }) }), _jsx(SidebarContent, {})] }), _jsx("aside", { className: "hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 shrink-0", children: _jsx(SidebarContent, {}) })] }));
}
