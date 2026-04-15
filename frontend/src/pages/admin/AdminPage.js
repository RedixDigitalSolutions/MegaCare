import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { FaUserMd, FaPills, FaHospital, FaMicroscope, FaUserNurse, FaUserAlt, FaCheckCircle, FaTimesCircle, FaClock, FaShieldAlt, FaUsers, FaSync, FaBan, } from "react-icons/fa";
import { X, ChevronRight, Mail, Phone, Calendar, Stethoscope, Building2, FileText, MapPin, AlertTriangle, } from "lucide-react";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
// ── Config ───────────────────────────────────────────────────────────────────
const ROLES = [
    "patient",
    "doctor",
    "pharmacy",
    "medical_service",
    "lab_radiology",
    "paramedical",
];
const roleConfig = {
    patient: {
        label: "Patient",
        Icon: FaUserAlt,
        gradient: "from-blue-500 to-cyan-500",
        light: "bg-blue-50 text-blue-700",
    },
    doctor: {
        label: "Médecin",
        Icon: FaUserMd,
        gradient: "from-emerald-500 to-teal-500",
        light: "bg-emerald-50 text-emerald-700",
    },
    pharmacy: {
        label: "Pharmacien",
        Icon: FaPills,
        gradient: "from-green-500 to-lime-500",
        light: "bg-green-50 text-green-700",
    },
    medical_service: {
        label: "Services Médicaux",
        Icon: FaHospital,
        gradient: "from-purple-500 to-indigo-500",
        light: "bg-purple-50 text-purple-700",
    },
    lab_radiology: {
        label: "Labos & Radiologie",
        Icon: FaMicroscope,
        gradient: "from-rose-500 to-pink-500",
        light: "bg-rose-50 text-rose-700",
    },
    paramedical: {
        label: "Paramédicaux",
        Icon: FaUserNurse,
        gradient: "from-sky-500 to-blue-500",
        light: "bg-sky-50 text-sky-700",
    },
};
const statusCfg = {
    pending: {
        label: "En attente",
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
    },
    approved: {
        label: "Approuvé",
        bg: "bg-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
    },
    rejected: {
        label: "Refusé",
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-200",
    },
    suspended: {
        label: "Suspendu",
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
    },
};
const StatusBadge = ({ status }) => {
    const cfg = statusCfg[status];
    const icons = {
        pending: _jsx(FaClock, { size: 9 }),
        approved: _jsx(FaCheckCircle, { size: 9 }),
        rejected: _jsx(FaTimesCircle, { size: 9 }),
        suspended: _jsx(FaBan, { size: 9 }),
    };
    return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`, children: [icons[status], " ", cfg.label] }));
};
const getDisplayName = (u) => u.firstName && u.lastName
    ? `${u.firstName} ${u.lastName}`
    : u.name || u.email;
const getRegDate = (u) => {
    const raw = u.registrationDate ?? u.createdAt;
    if (!raw)
        return "—";
    return new Date(raw).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};
// ── Main component ────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [detailUser, setDetailUser] = useState(null);
    // ── Fetch ─────────────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async () => {
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        setFetching(true);
        try {
            const res = await fetch("/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok)
                setUsers(await res.json());
        }
        finally {
            setFetching(false);
        }
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
            fetchUsers();
    }, [isLoading, user, navigate, fetchUsers]);
    const handleAction = async (userId, action) => {
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        const key = userId + action;
        setActionLoading(key);
        const endpoint = action === "reactivate" ? "approve" : action;
        try {
            const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const newStatus = action === "approve" || action === "reactivate"
                    ? "approved"
                    : action === "suspend"
                        ? "suspended"
                        : "rejected";
                const update = (prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
                setUsers(update);
                if (detailUser?.id === userId)
                    setDetailUser((u) => (u ? { ...u, status: newStatus } : u));
            }
        }
        finally {
            setActionLoading(null);
        }
    };
    // ── Computed ──────────────────────────────────────────────────────────────
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
    });
    const pendingUsers = users.filter((u) => u.status === "pending");
    const filtered = users.filter((u) => {
        const matchStatus = filter === "all" || u.status === filter;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            getDisplayName(u).toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (roleConfig[u.role]?.label ?? "").toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });
    // ── Render ────────────────────────────────────────────────────────────────
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(AdminDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Administration" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Gestion des comptes et des acc\u00E8s" })] }), _jsxs("button", { onClick: fetchUsers, disabled: fetching, className: "flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50", children: [_jsx(FaSync, { size: 12, className: fetching ? "animate-spin" : "" }), "Actualiser"] })] }), _jsxs("main", { className: "flex-1 overflow-y-auto px-6 py-8 space-y-8", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-3", children: [
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
                                }) }), _jsxs("section", { className: "space-y-3", children: [_jsxs("h2", { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [_jsx(FaUsers, { size: 14, className: "text-primary" }), "Utilisateurs par r\u00F4le"] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3", children: [roleStats.map((rs) => {
                                                const cfg = roleConfig[rs.role] ?? roleConfig.patient;
                                                const { Icon: RoleIcon, gradient, label } = cfg;
                                                if (rs.total === 0)
                                                    return null;
                                                return (_jsxs("div", { className: "bg-card border border-border rounded-2xl p-4 flex items-start gap-3", children: [_jsx("div", { className: `w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`, children: _jsx(RoleIcon, { className: "text-white", size: 16 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: label }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [rs.total, " compte", rs.total > 1 ? "s" : ""] }), _jsxs("div", { className: "flex flex-wrap gap-2 mt-2", children: [rs.pending > 0 && (_jsxs("span", { className: "text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full", children: [rs.pending, " en attente"] })), rs.approved > 0 && (_jsxs("span", { className: "text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full", children: [rs.approved, " approuv\u00E9", rs.approved > 1 ? "s" : ""] })), rs.rejected > 0 && (_jsxs("span", { className: "text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full", children: [rs.rejected, " refus\u00E9", rs.rejected > 1 ? "s" : ""] })), rs.suspended > 0 && (_jsxs("span", { className: "text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full", children: [rs.suspended, " suspendu", rs.suspended > 1 ? "s" : ""] }))] })] })] }, rs.role));
                                            }), roleStats.every((rs) => rs.total === 0) && (_jsx("p", { className: "text-sm text-muted-foreground col-span-3", children: "Aucun utilisateur enregistr\u00E9." }))] })] }), pendingUsers.length > 0 && (_jsxs("section", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("h2", { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [_jsx(AlertTriangle, { size: 15, className: "text-amber-500" }), "Approbations en attente"] }), _jsx("span", { className: "px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold", children: pendingUsers.length })] }), _jsx("div", { className: "bg-amber-50 border border-amber-200 rounded-2xl divide-y divide-amber-200/60 overflow-hidden", children: pendingUsers.map((u) => {
                                            const cfg = roleConfig[u.role] ?? roleConfig.patient;
                                            const { Icon: RoleIcon, gradient, label } = cfg;
                                            return (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5", children: [_jsx("div", { className: `w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`, children: _jsx(RoleIcon, { className: "text-white", size: 14 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: getDisplayName(u) }), _jsx("span", { className: "text-xs bg-amber-200/70 text-amber-800 px-2 py-0.5 rounded-full", children: label })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: u.email })] }), _jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [_jsx("button", { onClick: () => setDetailUser(u), className: "p-1.5 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-200/50 transition", title: "Voir le profil", children: _jsx(ChevronRight, { size: 14 }) }), _jsxs("button", { onClick: () => handleAction(u.id, "approve"), disabled: actionLoading === u.id + "approve", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition disabled:opacity-50", children: [actionLoading === u.id + "approve" ? (_jsx("span", { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaCheckCircle, { size: 11 })), "Approuver"] }), _jsxs("button", { onClick: () => handleAction(u.id, "reject"), disabled: actionLoading === u.id + "reject", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive hover:opacity-90 text-white text-xs font-semibold transition disabled:opacity-50", children: [actionLoading === u.id + "reject" ? (_jsx("span", { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaTimesCircle, { size: 11 })), "Refuser"] })] })] }, u.id));
                                        }) })] })), _jsxs("section", { className: "space-y-4", children: [_jsxs("h2", { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [_jsx(FaUsers, { size: 14, className: "text-primary" }), "Tous les utilisateurs"] }), _jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [_jsx("input", { type: "text", placeholder: "Rechercher par nom, email ou r\u00F4le...", value: search, onChange: (e) => setSearch(e.target.value), className: "flex-1 min-w-48 px-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" }), _jsx("div", { className: "flex rounded-xl border border-border overflow-hidden text-xs font-medium", children: [
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
                                            return (_jsxs("div", { className: "bg-card border border-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/30 transition cursor-pointer", onClick: () => setDetailUser(u), children: [_jsx("div", { className: `w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`, children: _jsx(RoleIcon, { className: "text-white", size: 18 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-0.5", children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: getDisplayName(u) }), _jsx("span", { className: `text-xs px-2 py-0.5 rounded-full font-semibold ${light}`, children: label })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: u.email }), u.specialization && (_jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: u.specialization })), _jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 flex items-center gap-1", children: [_jsx(Calendar, { size: 10 }), getRegDate(u)] })] }), _jsx(StatusBadge, { status: u.status }), _jsxs("div", { className: "flex gap-2 shrink-0", onClick: (e) => e.stopPropagation(), children: [u.status === "pending" && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => handleAction(u.id, "approve"), disabled: actionLoading === u.id + "approve", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition disabled:opacity-50", children: [actionLoading === u.id + "approve" ? (_jsx("span", { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaCheckCircle, { size: 11 })), "Approuver"] }), _jsxs("button", { onClick: () => handleAction(u.id, "reject"), disabled: actionLoading === u.id + "reject", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive hover:opacity-90 text-white text-xs font-semibold transition disabled:opacity-50", children: [actionLoading === u.id + "reject" ? (_jsx("span", { className: "w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" })) : (_jsx(FaTimesCircle, { size: 11 })), "Refuser"] })] })), u.status === "approved" && (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => handleAction(u.id, "suspend"), disabled: actionLoading === u.id + "suspend", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition disabled:opacity-50", children: [_jsx(FaBan, { size: 11 }), "Suspendre"] }), _jsxs("button", { onClick: () => handleAction(u.id, "reject"), disabled: actionLoading === u.id + "reject", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/5 text-xs font-semibold transition disabled:opacity-50", children: [_jsx(FaTimesCircle, { size: 11 }), "R\u00E9voquer"] })] })), u.status === "suspended" && (_jsxs("button", { onClick: () => handleAction(u.id, "reactivate"), disabled: actionLoading === u.id + "reactivate", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 11 }), "R\u00E9activer"] })), u.status === "rejected" && (_jsxs("button", { onClick: () => handleAction(u.id, "approve"), disabled: actionLoading === u.id + "approve", className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 11 }), "R\u00E9-approuver"] }))] })] }, u.id));
                                        }) }))] }), _jsxs("div", { className: "p-4 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-start gap-2", children: [_jsx(FaShieldAlt, { size: 13, className: "text-primary mt-0.5 shrink-0" }), _jsxs("div", { children: [_jsx("span", { className: "font-semibold text-foreground", children: "Compte admin par d\u00E9faut :" }), " ", _jsx("code", { className: "bg-muted px-1.5 py-0.5 rounded", children: "admin@megacare.tn" }), " / ", _jsx("code", { className: "bg-muted px-1.5 py-0.5 rounded", children: "Admin@megacare2024" }), " — Connectez-vous via la page ", _jsx(Link, { to: "/login", className: "text-primary underline", children: "Connexion" }), " en sélectionnant le rôle Administrateur."] })] })] })] }), detailUser && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm", onClick: () => setDetailUser(null) }), _jsxs("aside", { className: "fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border shrink-0", children: [_jsx("h2", { className: "font-bold text-foreground text-base", children: "Profil utilisateur" }), _jsx("button", { onClick: () => setDetailUser(null), className: "p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-5 space-y-5", children: [(() => {
                                        const cfg = roleConfig[detailUser.role] ?? roleConfig.patient;
                                        const { Icon: RoleIcon, gradient, label } = cfg;
                                        return (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`, children: _jsx(RoleIcon, { className: "text-white", size: 22 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-base font-bold text-foreground", children: getDisplayName(detailUser) }), _jsx("p", { className: "text-xs text-muted-foreground", children: label }), _jsx("div", { className: "mt-1", children: _jsx(StatusBadge, { status: detailUser.status }) })] })] }));
                                    })(), _jsx("div", { className: "bg-muted/30 rounded-xl divide-y divide-border overflow-hidden", children: [
                                            {
                                                icon: _jsx(Mail, { size: 13 }),
                                                label: "Email",
                                                value: detailUser.email,
                                            },
                                            {
                                                icon: _jsx(Phone, { size: 13 }),
                                                label: "Téléphone",
                                                value: detailUser.phone,
                                            },
                                            {
                                                icon: _jsx(Stethoscope, { size: 13 }),
                                                label: "Spécialisation",
                                                value: detailUser.specialization,
                                            },
                                            {
                                                icon: _jsx(FileText, { size: 13 }),
                                                label: "N° de licence",
                                                value: detailUser.doctorId,
                                            },
                                            {
                                                icon: _jsx(Building2, { size: 13 }),
                                                label: "Agrément pharmacie",
                                                value: detailUser.pharmacyId,
                                            },
                                            {
                                                icon: _jsx(Building2, { size: 13 }),
                                                label: "Établissement",
                                                value: detailUser.companyName,
                                            },
                                            {
                                                icon: _jsx(MapPin, { size: 13 }),
                                                label: "Adresse",
                                                value: detailUser.address,
                                            },
                                            {
                                                icon: _jsx(Calendar, { size: 13 }),
                                                label: "Inscrit le",
                                                value: getRegDate(detailUser),
                                            },
                                        ]
                                            .filter((f) => f.value)
                                            .map((f) => (_jsxs("div", { className: "flex items-start gap-3 px-4 py-3", children: [_jsx("span", { className: "text-muted-foreground mt-0.5 shrink-0", children: f.icon }), _jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: f.label }), _jsx("p", { className: "text-sm text-foreground font-medium", children: f.value })] })] }, f.label))) }), detailUser.role === "doctor" && (_jsxs("div", { className: "bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "Informations m\u00E9dicales" }), _jsxs("p", { children: ["Licence : ", detailUser.doctorId ?? "Non renseignée"] }), detailUser.specialization && (_jsxs("p", { children: ["Sp\u00E9cialit\u00E9 : ", detailUser.specialization] }))] })), detailUser.role === "pharmacy" && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "Informations pharmacie" }), _jsxs("p", { children: ["Agr\u00E9ment : ", detailUser.pharmacyId ?? "Non renseigné"] }), detailUser.address && _jsxs("p", { children: ["Adresse : ", detailUser.address] })] })), (detailUser.role === "medical_service" ||
                                        detailUser.role === "lab_radiology") && (_jsxs("div", { className: "bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800", children: [_jsx("p", { className: "font-semibold mb-1", children: "Informations \u00E9tablissement" }), detailUser.companyName && (_jsxs("p", { children: ["\u00C9tablissement : ", detailUser.companyName] })), detailUser.address && _jsxs("p", { children: ["Adresse : ", detailUser.address] })] }))] }), _jsxs("div", { className: "border-t border-border px-5 py-4 shrink-0 space-y-2", children: [detailUser.status === "pending" && (_jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => handleAction(detailUser.id, "approve"), disabled: !!actionLoading, className: "flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 13 }), "Approuver"] }), _jsxs("button", { onClick: () => handleAction(detailUser.id, "reject"), disabled: !!actionLoading, className: "flex-1 flex items-center justify-center gap-2 py-2.5 bg-destructive hover:opacity-90 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaTimesCircle, { size: 13 }), "Refuser"] })] })), detailUser.status === "approved" && (_jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => handleAction(detailUser.id, "suspend"), disabled: !!actionLoading, className: "flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaBan, { size: 13 }), "Suspendre le compte"] }), _jsxs("button", { onClick: () => handleAction(detailUser.id, "reject"), disabled: !!actionLoading, className: "flex-1 flex items-center justify-center gap-2 py-2.5 border border-destructive/40 text-destructive hover:bg-destructive/5 rounded-xl text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaTimesCircle, { size: 13 }), "R\u00E9voquer"] })] })), detailUser.status === "suspended" && (_jsxs("button", { onClick: () => handleAction(detailUser.id, "reactivate"), disabled: !!actionLoading, className: "w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 13 }), "R\u00E9activer le compte"] })), detailUser.status === "rejected" && (_jsxs("button", { onClick: () => handleAction(detailUser.id, "approve"), disabled: !!actionLoading, className: "w-full flex items-center justify-center gap-2 py-2.5 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-semibold transition disabled:opacity-50", children: [_jsx(FaCheckCircle, { size: 13 }), "R\u00E9-approuver le compte"] }))] })] })] }))] }));
}
