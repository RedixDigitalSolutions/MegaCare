import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import { UserDetailSlideOver } from "../UserDetailSlideOver";
import { roleConfig, getDisplayName, fetchAdminUsers, doAdminAction, resolveNewStatus, } from "../adminConfig";
import { FaCheckCircle, FaTimesCircle, FaSync, FaClipboardCheck, } from "react-icons/fa";
import { ChevronRight, AlertTriangle } from "lucide-react";
export default function AdminPendingPage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
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
    const pending = users.filter((u) => u.status === "pending");
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(AdminDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-3", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-xl font-bold text-foreground flex items-center gap-2", children: ["Approbations en attente", pending.length > 0 && (_jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold", children: pending.length }))] }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Examinez et approuvez les nouveaux comptes professionnels" })] }) }), _jsxs("button", { onClick: loadUsers, disabled: fetching, className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50", children: [_jsx(FaSync, { size: 12, className: fetching ? "animate-spin" : "" }), "Actualiser"] })] }), _jsx("main", { className: "flex-1 overflow-y-auto px-6 py-8", children: fetching ? (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" }) })) : pending.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-24 text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4", children: _jsx(FaClipboardCheck, { size: 28, className: "text-emerald-500" }) }), _jsx("h2", { className: "text-lg font-bold text-foreground mb-1", children: "Aucune approbation en attente" }), _jsx("p", { className: "text-sm text-muted-foreground max-w-xs", children: "Tous les comptes ont \u00E9t\u00E9 trait\u00E9s. Revenez plus tard pour de nouvelles inscriptions." })] })) : (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800", children: [_jsx(AlertTriangle, { size: 15, className: "shrink-0" }), _jsxs("span", { children: [_jsx("strong", { children: pending.length }), " compte", pending.length !== 1 ? "s" : "", " en attente de validation. V\u00E9rifiez les informations avant d'approuver."] })] }), pending.map((u) => {
                                    const cfg = roleConfig[u.role] ?? roleConfig.patient;
                                    const { Icon: RoleIcon, gradient, label } = cfg;
                                    return (_jsxs("div", { className: "bg-card border border-amber-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition", children: [_jsx("div", { className: `w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`, children: _jsx(RoleIcon, { className: "text-white", size: 18 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-0.5", children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: getDisplayName(u) }), _jsx("span", { className: "text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold", children: label })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: u.email }), u.specialization && (_jsx("p", { className: "text-xs text-muted-foreground", children: u.specialization })), u.phone && (_jsx("p", { className: "text-xs text-muted-foreground", children: u.phone }))] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsx("button", { onClick: () => setDetailUser(u), className: "p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition", title: "Voir le profil complet", children: _jsx(ChevronRight, { size: 16 }) }), _jsxs("button", { onClick: () => handleAction(u.id, "approve"), disabled: actionLoading === u.id + "approve", className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition disabled:opacity-50", children: [actionLoading === u.id + "approve" ? (_jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaCheckCircle, { size: 12 })), "Approuver"] }), _jsxs("button", { onClick: () => handleAction(u.id, "reject"), disabled: actionLoading === u.id + "reject", className: "flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive hover:opacity-90 text-white text-sm font-semibold transition disabled:opacity-50", children: [actionLoading === u.id + "reject" ? (_jsx("span", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaTimesCircle, { size: 12 })), "Refuser"] })] })] }, u.id));
                                })] })) })] }), detailUser && (_jsx(UserDetailSlideOver, { user: detailUser, onClose: () => setDetailUser(null), onAction: handleAction, actionLoading: actionLoading }))] }));
}
