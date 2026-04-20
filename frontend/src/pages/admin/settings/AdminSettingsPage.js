import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import { FaShieldAlt, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import { User, Mail, Lock, CheckCircle, AlertCircle, } from "lucide-react";
export default function AdminSettingsPage() {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    // Profile state
    const [displayName, setDisplayName] = useState(user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.name || "");
    const [email] = useState(user?.email || "");
    const [profileSaved, setProfileSaved] = useState(false);
    const [profileError, setProfileError] = useState("");
    // Password state
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [pwdError, setPwdError] = useState("");
    const [pwdSaved, setPwdSaved] = useState(false);
    if (isLoading || !user)
        return null;
    if (user.role !== "admin") {
        navigate("/");
        return null;
    }
    const handleProfileSave = async (e) => {
        e.preventDefault();
        setProfileError("");
        const parts = displayName.trim().split(" ");
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";
        try {
            const token = localStorage.getItem("megacare_token");
            const res = await fetch("/api/auth/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ firstName, lastName }),
            });
            if (!res.ok) {
                const data = await res.json();
                setProfileError(data.message || "Erreur serveur");
                return;
            }
            setProfileSaved(true);
            setTimeout(() => setProfileSaved(false), 3000);
        }
        catch {
            setProfileError("Erreur réseau");
        }
    };
    const handlePasswordSave = async (e) => {
        e.preventDefault();
        setPwdError("");
        if (!currentPwd || !newPwd || !confirmPwd) {
            setPwdError("Tous les champs sont requis.");
            return;
        }
        if (newPwd.length < 8) {
            setPwdError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
            return;
        }
        if (newPwd !== confirmPwd) {
            setPwdError("Les mots de passe ne correspondent pas.");
            return;
        }
        try {
            const token = localStorage.getItem("megacare_token");
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
            });
            const data = await res.json();
            if (!res.ok) {
                setPwdError(data.message || "Erreur serveur");
                return;
            }
            setPwdSaved(true);
            setCurrentPwd("");
            setNewPwd("");
            setConfirmPwd("");
            setTimeout(() => setPwdSaved(false), 3000);
        }
        catch {
            setPwdError("Erreur réseau");
        }
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(AdminDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Param\u00E8tres" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "G\u00E9rez votre compte administrateur et les pr\u00E9f\u00E9rences de la plateforme" })] }), _jsxs("main", { className: "flex-1 overflow-y-auto px-6 py-8 space-y-8 max-w-2xl", children: [_jsxs("section", { className: "space-y-4", children: [_jsxs("h2", { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [_jsx(User, { size: 16, className: "text-primary" }), "Profil administrateur"] }), _jsxs("div", { className: "bg-card border border-border rounded-2xl p-5", children: [_jsxs("div", { className: "flex items-center gap-3 mb-5 pb-5 border-b border-border", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center", children: _jsx(FaShieldAlt, { size: 20, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-bold text-foreground", children: displayName || user.email }), _jsx("p", { className: "text-sm text-muted-foreground", children: user.email }), _jsx("span", { className: "text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block", children: "Administrateur" })] })] }), _jsxs("form", { onSubmit: handleProfileSave, className: "space-y-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Nom complet" }), _jsx("input", { type: "text", value: displayName, onChange: (e) => setDisplayName(e.target.value), className: "w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40", placeholder: "Votre nom" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsxs("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5", children: [_jsx(Mail, { size: 12 }), "Adresse email"] }), _jsx("input", { type: "email", value: email, readOnly: true, className: "w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "L'email ne peut pas \u00EAtre modifi\u00E9 depuis cette interface." })] }), _jsxs("div", { className: "flex items-center gap-3 pt-1", children: [_jsxs("button", { type: "submit", className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition", children: [_jsx(FaSave, { size: 13 }), "Enregistrer"] }), profileSaved && (_jsxs("span", { className: "flex items-center gap-1.5 text-sm text-emerald-600", children: [_jsx(CheckCircle, { size: 14 }), "Sauvegard\u00E9"] })), profileError && (_jsxs("span", { className: "flex items-center gap-1.5 text-sm text-destructive", children: [_jsx(AlertCircle, { size: 14 }), profileError] }))] })] })] })] }), _jsxs("section", { className: "space-y-4", children: [_jsxs("h2", { className: "text-base font-semibold text-foreground flex items-center gap-2", children: [_jsx(Lock, { size: 16, className: "text-primary" }), "S\u00E9curit\u00E9"] }), _jsx("div", { className: "bg-card border border-border rounded-2xl p-5", children: _jsxs("form", { onSubmit: handlePasswordSave, className: "space-y-4", children: [[
                                                    {
                                                        label: "Mot de passe actuel",
                                                        value: currentPwd,
                                                        set: setCurrentPwd,
                                                    },
                                                    {
                                                        label: "Nouveau mot de passe",
                                                        value: newPwd,
                                                        set: setNewPwd,
                                                    },
                                                    {
                                                        label: "Confirmer le nouveau mot de passe",
                                                        value: confirmPwd,
                                                        set: setConfirmPwd,
                                                    },
                                                ].map((field) => (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: field.label }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPwd ? "text" : "password", value: field.value, onChange: (e) => field.set(e.target.value), autoComplete: "new-password", className: "w-full pr-10 px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" }), _jsx("button", { type: "button", onClick: () => setShowPwd((v) => !v), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition", children: showPwd ? (_jsx(FaEyeSlash, { size: 14 })) : (_jsx(FaEye, { size: 14 })) })] })] }, field.label))), pwdError && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2.5", children: [_jsx(AlertCircle, { size: 14 }), pwdError] })), _jsxs("div", { className: "flex items-center gap-3 pt-1", children: [_jsxs("button", { type: "submit", className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition", children: [_jsx(Lock, { size: 13 }), "Changer le mot de passe"] }), pwdSaved && (_jsxs("span", { className: "flex items-center gap-1.5 text-sm text-emerald-600", children: [_jsx(CheckCircle, { size: 14 }), "Mot de passe mis \u00E0 jour"] }))] })] }) })] })] })] })] }));
}
