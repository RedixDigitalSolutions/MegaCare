import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { User, Lock, Bell, Shield, Save, Loader2, CheckCircle2, AlertCircle, Eye, EyeOff, } from "lucide-react";
import { useEffect, useState } from "react";
export default function SettingsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState(null);
    // Password change
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState(null);
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, navigate]);
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setEmail(user.email || "");
            setPhone(user.phone || "");
        }
    }, [user]);
    if (isLoading || !isAuthenticated || !user) {
        return null;
    }
    const handleSaveProfile = async () => {
        setSaving(true);
        setSaveMsg(null);
        try {
            const token = localStorage.getItem("megacare_token");
            const res = await fetch("/api/auth/profile", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ firstName, lastName, email, phone }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Erreur lors de la sauvegarde");
            // Update local auth context
            const stored = localStorage.getItem("megacare_user");
            if (stored) {
                const parsed = JSON.parse(stored);
                localStorage.setItem("megacare_user", JSON.stringify({ ...parsed, firstName, lastName, email, phone }));
            }
            setSaveMsg({ type: "success", text: "Profil mis à jour avec succès" });
        }
        catch (err) {
            setSaveMsg({ type: "error", text: err.message });
        }
        finally {
            setSaving(false);
        }
    };
    const handleChangePassword = async () => {
        setPwMsg(null);
        if (newPassword.length < 6) {
            setPwMsg({
                type: "error",
                text: "Le nouveau mot de passe doit contenir au moins 6 caractères",
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPwMsg({
                type: "error",
                text: "Les mots de passe ne correspondent pas",
            });
            return;
        }
        setPwSaving(true);
        try {
            const token = localStorage.getItem("megacare_token");
            const res = await fetch("/api/auth/change-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Erreur lors du changement");
            setPwMsg({ type: "success", text: "Mot de passe modifié avec succès" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordForm(false);
        }
        catch (err) {
            setPwMsg({ type: "error", text: err.message });
        }
        finally {
            setPwSaving(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, { userName: user.firstName }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "p-6 space-y-6 max-w-2xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Param\u00E8tres" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "G\u00E9rez vos pr\u00E9f\u00E9rences et informations personnelles" })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(User, { size: 24, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold text-foreground", children: "Profil personnel" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", value: firstName, onChange: (e) => setFirstName(e.target.value), className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Nom" }), _jsx("input", { type: "text", value: lastName, onChange: (e) => setLastName(e.target.value), className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" })] }), saveMsg && (_jsxs("div", { className: `flex items-center gap-2 p-3 rounded-lg text-sm ${saveMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`, children: [saveMsg.type === "success" ? (_jsx(CheckCircle2, { size: 16 })) : (_jsx(AlertCircle, { size: 16 })), saveMsg.text] })), _jsxs("button", { onClick: handleSaveProfile, disabled: saving, className: "w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50", children: [saving ? (_jsx(Loader2, { size: 18, className: "animate-spin" })) : (_jsx(Save, { size: 18 })), saving
                                                        ? "Enregistrement..."
                                                        : "Enregistrer les modifications"] })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Lock, { size: 24, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold text-foreground", children: "S\u00E9curit\u00E9" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("button", { onClick: () => {
                                                    setShowPasswordForm(!showPasswordForm);
                                                    setPwMsg(null);
                                                }, className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "Changer le mot de passe" }), showPasswordForm && (_jsxs("div", { className: "space-y-4 p-4 bg-muted/50 rounded-lg border border-border", children: [_jsxs("div", { className: "relative", children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Mot de passe actuel" }), _jsx("input", { type: showCurrentPw ? "text" : "password", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), className: "w-full px-4 py-2 pr-10 border border-border rounded-lg bg-input text-foreground" }), _jsx("button", { type: "button", onClick: () => setShowCurrentPw(!showCurrentPw), className: "absolute right-3 top-9 text-muted-foreground", children: showCurrentPw ? (_jsx(EyeOff, { size: 16 })) : (_jsx(Eye, { size: 16 })) })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Nouveau mot de passe" }), _jsx("input", { type: showNewPw ? "text" : "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full px-4 py-2 pr-10 border border-border rounded-lg bg-input text-foreground" }), _jsx("button", { type: "button", onClick: () => setShowNewPw(!showNewPw), className: "absolute right-3 top-9 text-muted-foreground", children: showNewPw ? _jsx(EyeOff, { size: 16 }) : _jsx(Eye, { size: 16 }) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Confirmer le nouveau mot de passe" }), _jsx("input", { type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" })] }), pwMsg && (_jsxs("div", { className: `flex items-center gap-2 p-3 rounded-lg text-sm ${pwMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`, children: [pwMsg.type === "success" ? (_jsx(CheckCircle2, { size: 16 })) : (_jsx(AlertCircle, { size: 16 })), pwMsg.text] })), _jsxs("button", { onClick: handleChangePassword, disabled: pwSaving ||
                                                            !currentPassword ||
                                                            !newPassword ||
                                                            !confirmPassword, className: "w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50", children: [pwSaving ? (_jsx(Loader2, { size: 18, className: "animate-spin" })) : (_jsx(Lock, { size: 18 })), pwSaving
                                                                ? "Modification..."
                                                                : "Modifier le mot de passe"] })] })), _jsx("button", { className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "Authentification \u00E0 deux facteurs" }), _jsx("button", { className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "G\u00E9rer les sessions actives" })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Bell, { size: 24, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold text-foreground", children: "Notifications" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "w-5 h-5 rounded border-border" }), _jsx("span", { className: "text-foreground", children: "Rappels de rendez-vous" })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "w-5 h-5 rounded border-border" }), _jsx("span", { className: "text-foreground", children: "Suivi de commandes" })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", defaultChecked: true, className: "w-5 h-5 rounded border-border" }), _jsx("span", { className: "text-foreground", children: "Avis des m\u00E9decins" })] }), _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", className: "w-5 h-5 rounded border-border" }), _jsx("span", { className: "text-foreground", children: "Offres sp\u00E9ciales" })] })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Shield, { size: 24, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold text-foreground", children: "Confidentialit\u00E9" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("button", { className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "T\u00E9l\u00E9charger mes donn\u00E9es" }), _jsx("button", { className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "Consulter la politique de confidentialit\u00E9" })] })] })] }) })] }) }));
}
