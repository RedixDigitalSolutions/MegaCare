import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import { ROLES, roleConfig, fetchAdminUsers, } from "../adminConfig";
import { FaUsers, FaCheckCircle, FaClock, FaTimesCircle, FaBan, FaSync, } from "react-icons/fa";
import { BarChart3, TrendingUp } from "lucide-react";
export default function AdminStatsPage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const loadUsers = useCallback(async () => {
        setFetching(true);
        const data = await fetchAdminUsers();
        setUsers(data);
        setFetching(false);
    }, []);
    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
            return;
        }
        if (!isLoading && user && user.role !== "admin") {
            navigate("/");
            return;
        }
        if (!isLoading && user)
            loadUsers();
    }, [isLoading, user, navigate, loadUsers]);
    if (isLoading || !user)
        return null;
    if (user.role !== "admin")
        return null;
    const total = users.length;
    const approved = users.filter((u) => u.status === "approved").length;
    const pending = users.filter((u) => u.status === "pending").length;
    const rejected = users.filter((u) => u.status === "rejected").length;
    const suspended = users.filter((u) => u.status === "suspended").length;
    const approvalRate = total > 0
        ? Math.round(approved + rejected > 0
            ? (approved / (approved + rejected)) * 100
            : 0)
        : 0;
    const roleStats = ROLES.map((role) => {
        const group = users.filter((u) => u.role === role);
        return {
            role,
            total: group.length,
            pending: group.filter((u) => u.status === "pending").length,
            approved: group.filter((u) => u.status === "approved").length,
            rejected: group.filter((u) => u.status === "rejected").length,
            suspended: group.filter((u) => u.status === "suspended").length,
        };
    }).filter((rs) => rs.total > 0);
    const maxTotal = Math.max(...roleStats.map((rs) => rs.total), 1);
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(AdminDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Statistiques" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Vue d'ensemble de la plateforme" })] }), _jsxs("button", { onClick: loadUsers, disabled: fetching, className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50", children: [_jsx(FaSync, { size: 12, className: fetching ? "animate-spin" : "" }), "Actualiser"] })] }), _jsx("main", { className: "flex-1 overflow-y-auto px-6 py-8 space-y-8", children: fetching ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" }) })) : (_jsxs(_Fragment, { children: [_jsxs("section", { className: "space-y-3", children: [_jsxs("h2", { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [_jsx(BarChart3, { size: 16, className: "text-primary" }), "Vue globale"] }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3", children: [
                                                {
                                                    label: "Total comptes",
                                                    value: total,
                                                    icon: _jsx(FaUsers, { size: 16 }),
                                                    color: "text-primary",
                                                    bg: "bg-primary/10",
                                                },
                                                {
                                                    label: "Approuvés",
                                                    value: approved,
                                                    icon: _jsx(FaCheckCircle, { size: 16 }),
                                                    color: "text-emerald-600",
                                                    bg: "bg-emerald-100",
                                                },
                                                {
                                                    label: "En attente",
                                                    value: pending,
                                                    icon: _jsx(FaClock, { size: 16 }),
                                                    color: "text-amber-600",
                                                    bg: "bg-amber-100",
                                                },
                                                {
                                                    label: "Refusés",
                                                    value: rejected,
                                                    icon: _jsx(FaTimesCircle, { size: 16 }),
                                                    color: "text-red-600",
                                                    bg: "bg-red-100",
                                                },
                                                {
                                                    label: "Suspendus",
                                                    value: suspended,
                                                    icon: _jsx(FaBan, { size: 16 }),
                                                    color: "text-slate-600",
                                                    bg: "bg-slate-100",
                                                },
                                            ].map((stat) => (_jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 flex flex-col gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`, children: stat.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: stat.value }), _jsx("p", { className: "text-xs text-muted-foreground", children: stat.label })] })] }, stat.label))) })] }), _jsxs("section", { className: "space-y-3", children: [_jsxs("h2", { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [_jsx(TrendingUp, { size: 16, className: "text-primary" }), "Taux d'approbation"] }), _jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 space-y-4", children: [_jsxs("div", { className: "flex items-end justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-3xl font-bold text-foreground", children: [approvalRate, "%"] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "des demandes trait\u00E9es ont \u00E9t\u00E9 approuv\u00E9es" })] }), _jsxs("div", { className: "text-right text-xs text-muted-foreground space-y-1", children: [_jsxs("p", { children: [_jsx("span", { className: "text-emerald-600 font-semibold", children: approved }), " ", "approuv\u00E9s"] }), _jsxs("p", { children: [_jsx("span", { className: "text-red-600 font-semibold", children: rejected }), " ", "refus\u00E9s"] }), _jsxs("p", { children: [_jsx("span", { className: "text-amber-600 font-semibold", children: pending }), " ", "en attente"] })] })] }), _jsx("div", { className: "w-full h-3 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-emerald-500 rounded-full transition-all duration-500", style: { width: `${approvalRate}%` } }) }), _jsxs("div", { className: "flex gap-4 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" }), "Approuv\u00E9s"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" }), "En attente"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-red-500 inline-block" }), "Refus\u00E9s"] }), _jsxs("span", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" }), "Suspendus"] })] })] })] }), _jsxs("section", { className: "space-y-3", children: [_jsxs("h2", { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [_jsx(FaUsers, { size: 14, className: "text-primary" }), "R\u00E9partition par r\u00F4le"] }), roleStats.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground", children: "Aucun utilisateur enregistr\u00E9." })) : (_jsx("div", { className: "space-y-3", children: roleStats.map((rs) => {
                                                const cfg = roleConfig[rs.role] ?? roleConfig.patient;
                                                const { Icon: RoleIcon, gradient, label } = cfg;
                                                const widthPct = Math.round((rs.total / maxTotal) * 100);
                                                return (_jsxs("div", { className: "bg-card border border-border rounded-2xl p-4", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: `w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`, children: _jsx(RoleIcon, { className: "text-white", size: 15 }) }), _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-1", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: label }), _jsx("p", { className: "text-sm font-bold text-foreground", children: rs.total })] }), _jsx("div", { className: "w-full h-2 bg-muted rounded-full overflow-hidden", children: _jsx("div", { className: `h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`, style: { width: `${widthPct}%` } }) })] })] }), _jsxs("div", { className: "flex flex-wrap gap-2 pl-12", children: [rs.approved > 0 && (_jsxs("span", { className: "text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full", children: [rs.approved, " approuv\u00E9", rs.approved > 1 ? "s" : ""] })), rs.pending > 0 && (_jsxs("span", { className: "text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full", children: [rs.pending, " en attente"] })), rs.rejected > 0 && (_jsxs("span", { className: "text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full", children: [rs.rejected, " refus\u00E9", rs.rejected > 1 ? "s" : ""] })), rs.suspended > 0 && (_jsxs("span", { className: "text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full", children: [rs.suspended, " suspendu", rs.suspended > 1 ? "s" : ""] }))] })] }, rs.role));
                                            }) }))] })] })) })] })] }));
}
