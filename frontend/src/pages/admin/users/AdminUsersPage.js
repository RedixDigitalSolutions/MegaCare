import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import { UserDetailSlideOver } from "../UserDetailSlideOver";
import { ROLES, roleConfig, StatusBadge, getDisplayName, getRegDate, fetchAdminUsers, doAdminAction, resolveNewStatus, } from "../adminConfig";
import { FaUsers, FaSync, FaCheckCircle, FaTimesCircle, FaBan, } from "react-icons/fa";
import { Calendar, Search } from "lucide-react";
export default function AdminUsersPage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState("all");
    const [roleFilter, setRoleFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [detailUser, setDetailUser] = useState(null);
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
    const handleAction = async (userId, action) => {
        const key = userId + action;
        setActionLoading(key);
        const ok = await doAdminAction(userId, action);
        if (ok) {
            const ns = resolveNewStatus(action);
            setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: ns } : u)));
            if (detailUser?.id === userId)
                setDetailUser((u) => (u ? { ...u, status: ns } : u));
        }
        setActionLoading(null);
    };
    if (isLoading || !user)
        return null;
    if (user.role !== "admin")
        return null;
    const counts = {
        all: users.length,
        pending: users.filter((u) => u.status === "pending").length,
        approved: users.filter((u) => u.status === "approved").length,
        rejected: users.filter((u) => u.status === "rejected").length,
        suspended: users.filter((u) => u.status === "suspended").length,
    };
    const filtered = users.filter((u) => {
        const matchStatus = filter === "all" || u.status === filter;
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            getDisplayName(u).toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (roleConfig[u.role]?.label ?? "").toLowerCase().includes(q);
        return matchStatus && matchRole && matchSearch;
    });
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(AdminDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Utilisateurs" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [users.length, " compte", users.length !== 1 ? "s" : "", " enregistr\u00E9s"] })] }), _jsxs("button", { onClick: loadUsers, disabled: fetching, className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50", children: [_jsx(FaSync, { size: 12, className: fetching ? "animate-spin" : "" }), "Actualiser"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto px-6 py-8 space-y-6", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3", children: [
                                    "all",
                                    "pending",
                                    "approved",
                                    "rejected",
                                    "suspended",
                                ].map((key) => {
                                    const labels = {
                                        all: "Total",
                                        pending: "En attente",
                                        approved: "Approuvés",
                                        rejected: "Refusés",
                                        suspended: "Suspendus",
                                    };
                                    const styles = {
                                        all: "text-foreground bg-card border-border",
                                        pending: "text-amber-700 bg-amber-50 border-amber-200",
                                        approved: "text-emerald-700 bg-emerald-50 border-emerald-200",
                                        rejected: "text-red-700 bg-red-50 border-red-200",
                                        suspended: "text-slate-600 bg-slate-50 border-slate-200",
                                    };
                                    return (_jsxs("button", { onClick: () => setFilter(key), className: `rounded-2xl border p-4 text-left transition hover:shadow-sm ${styles[key]} ${filter === key ? "ring-2 ring-primary/40" : ""}`, children: [_jsx("p", { className: "text-2xl font-bold", children: counts[key] }), _jsx("p", { className: "text-xs font-medium opacity-70 mt-0.5", children: labels[key] })] }, key));
                                }) }), _jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [_jsxs("div", { className: "relative flex-1 min-w-56", children: [_jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Rechercher par nom, email ou r\u00F4le...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsxs("select", { value: roleFilter, onChange: (e) => setRoleFilter(e.target.value), className: "px-3 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", children: [_jsx("option", { value: "all", children: "Tous les r\u00F4les" }), ROLES.map((r) => (_jsx("option", { value: r, children: roleConfig[r]?.label ?? r }, r)))] }), _jsx("div", { className: "flex rounded-xl border border-border overflow-hidden text-xs font-medium", children: [
                                            "all",
                                            "pending",
                                            "approved",
                                            "rejected",
                                            "suspended",
                                        ].map((key) => {
                                            const labels = {
                                                all: "Tout",
                                                pending: "En attente",
                                                approved: "Approuvés",
                                                rejected: "Refusés",
                                                suspended: "Suspendus",
                                            };
                                            return (_jsxs("button", { onClick: () => setFilter(key), className: `px-3 py-2 transition ${filter === key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`, children: [labels[key], key !== "all" &&
                                                        counts[key] > 0 && (_jsx("span", { className: `ml-1 px-1 rounded-full text-xs ${filter === key ? "bg-white/30" : "bg-muted"}`, children: counts[key] }))] }, key));
                                        }) })] }), fetching ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" }) })) : filtered.length === 0 ? (_jsxs("div", { className: "text-center py-20 text-muted-foreground", children: [_jsx(FaUsers, { size: 36, className: "mx-auto mb-3 opacity-30" }), _jsx("p", { className: "font-medium", children: "Aucun utilisateur dans cette cat\u00E9gorie" })] })) : (_jsx("div", { className: "space-y-2.5", children: filtered.map((u) => {
                                    const cfg = roleConfig[u.role] ?? roleConfig.patient;
                                    const { Icon: RoleIcon, gradient, label, light } = cfg;
                                    return (_jsxs("div", { className: "bg-card border border-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/30 transition cursor-pointer", onClick: () => setDetailUser(u), children: [_jsx("div", { className: `w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`, children: _jsx(RoleIcon, { className: "text-white", size: 18 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-0.5", children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: getDisplayName(u) }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-semibold ${light}`, children: label })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: u.email }), u.specialization && (_jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: u.specialization })), _jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [_jsx(Calendar, { size: 10 }), getRegDate(u)] })] }), _jsx(StatusBadge, { status: u.status }), _jsxs("div", { className: "flex gap-2 shrink-0", onClick: (e) => e.stopPropagation(), children: [u.status === "pending" && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => handleAction(u.id, "approve"), disabled: actionLoading === u.id + "approve", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition disabled:opacity-50", children: [actionLoading === u.id + "approve" ? (_jsx("span", { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaCheckCircle, { size: 11 })), "Approuver"] }), _jsxs("button", { onClick: () => handleAction(u.id, "reject"), disabled: actionLoading === u.id + "reject", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive hover:opacity-90 text-white text-xs font-semibold transition disabled:opacity-50", children: [actionLoading === u.id + "reject" ? (_jsx("span", { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaTimesCircle, { size: 11 })), "Refuser"] })] })), u.status === "approved" && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => handleAction(u.id, "suspend"), disabled: actionLoading === u.id + "suspend", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition disabled:opacity-50", children: [_jsx(FaBan, { size: 11 }), " Suspendre"] }), _jsxs("button", { onClick: () => handleAction(u.id, "reject"), disabled: actionLoading === u.id + "reject", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/5 text-xs font-semibold transition disabled:opacity-50", children: [_jsx(FaTimesCircle, { size: 11 }), " R\u00E9voquer"] })] })), u.status === "suspended" && (_jsxs("button", { onClick: () => handleAction(u.id, "reactivate"), disabled: actionLoading === u.id + "reactivate", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 11 }), " R\u00E9activer"] })), u.status === "rejected" && (_jsxs("button", { onClick: () => handleAction(u.id, "approve"), disabled: actionLoading === u.id + "approve", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 11 }), " R\u00E9-approuver"] }))] })] }, u.id));
                                }) }))] })] }), detailUser && (_jsx(UserDetailSlideOver, { user: detailUser, onClose: () => setDetailUser(null), onAction: handleAction, actionLoading: actionLoading }))] }));
}
