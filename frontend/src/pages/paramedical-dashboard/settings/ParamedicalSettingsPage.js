import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { User, Bell, Save, Check, Eye, EyeOff, Lock, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
export default function ParamedicalSettingsPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        phone: user?.phone ?? "",
        specialization: user?.specialization ?? "",
    });
    const [passwords, setPasswords] = useState({
        current: "",
        next: "",
        confirm: "",
    });
    const [showPwd, setShowPwd] = useState(false);
    const [notifs, setNotifs] = useState({
        email: true,
        sms: true,
        push: true,
        dailyReport: true,
    });
    const [toast, setToast] = useState("");
    const [pwdError, setPwdError] = useState("");
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 3200);
    };
    const handleProfileSave = async (e) => {
        e.preventDefault();
        const r = await fetch("/api/auth/profile", {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify(profile),
        }).catch(() => null);
        if (r && r.ok)
            showToast("Profil mis a jour avec succes");
        else
            showToast("Erreur lors de la mise a jour du profil");
    };
    const handlePasswordSave = async (e) => {
        e.preventDefault();
        setPwdError("");
        if (!passwords.current) {
            setPwdError("Mot de passe actuel requis.");
            return;
        }
        if (passwords.next.length < 8) {
            setPwdError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
            return;
        }
        if (passwords.next !== passwords.confirm) {
            setPwdError("Les mots de passe ne correspondent pas.");
            return;
        }
        const r = await fetch("/api/auth/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
        }).catch(() => null);
        if (r && r.ok) {
            setPasswords({ current: "", next: "", confirm: "" });
            showToast("Mot de passe mis a jour");
        }
        else {
            setPwdError("Impossible de mettre a jour le mot de passe.");
        }
    };
    const toggleNotif = (key) => setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Param\u00E8tres" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "G\u00E9rez votre profil et pr\u00E9f\u00E9rences" })] }), toast && (_jsxs("div", { className: "fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm", children: [_jsx(Check, { size: 15 }), toast] })), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full", children: [_jsxs("section", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border", children: [_jsx(User, { size: 16, className: "text-primary" }), _jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Profil" })] }), _jsxs("form", { onSubmit: handleProfileSave, className: "p-5 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0", children: [(profile.firstName[0] ?? "?").toUpperCase(), (profile.lastName[0] ?? "").toUpperCase()] }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-foreground text-sm", children: [profile.firstName, " ", profile.lastName] }), _jsx("p", { className: "text-xs text-muted-foreground", children: user?.email })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", value: profile.firstName, onChange: (e) => setProfile({ ...profile, firstName: e.target.value }), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Nom" }), _jsx("input", { type: "text", value: profile.lastName, onChange: (e) => setProfile({ ...profile, lastName: e.target.value }), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", value: profile.phone, onChange: (e) => setProfile({ ...profile, phone: e.target.value }), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background", placeholder: "+216 XX XXX XXX" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Sp\u00E9cialisation" }), _jsxs("select", { value: profile.specialization, onChange: (e) => setProfile({ ...profile, specialization: e.target.value }), className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background", children: [_jsx("option", { value: "", children: "\u2014 Choisir \u2014" }), ["Infirmier(e)",
                                                                        "Kinésithérapeute",
                                                                        "Aide-soignant(e)",
                                                                        "Sage-femme",
                                                                        "Ergothérapeute",
                                                                        "Orthophoniste",
                                                                        "Psychomotricien(ne)",
                                                                        "Diététicien(ne)",
                                                                        "Autre paramédical"].map((s) => (_jsx("option", { value: s, children: s }, s)))] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { type: "submit", className: "flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition", children: [_jsx(Save, { size: 14 }), "Enregistrer le profil"] }) })] })] }), _jsxs("section", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border", children: [_jsx(Lock, { size: 16, className: "text-primary" }), _jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Mot de passe" })] }), _jsxs("form", { onSubmit: handlePasswordSave, className: "p-5 space-y-4", children: [["current", "next", "confirm"].map((field, i) => (_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: field === "current" ? "Mot de passe actuel" : field === "next" ? "Nouveau mot de passe" : "Confirmer le nouveau" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPwd ? "text" : "password", value: passwords[field], onChange: (e) => setPasswords({ ...passwords, [field]: e.target.value }), className: "w-full pl-3 pr-10 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background", placeholder: field === "current" ? "••••••••" : field === "next" ? "Minimum 8 caractères" : "Répéter le mot de passe" }), i === 0 && (_jsx("button", { type: "button", onClick: () => setShowPwd((v) => !v), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition", children: showPwd ? _jsx(EyeOff, { size: 15 }) : _jsx(Eye, { size: 15 }) }))] })] }, field))), pwdError && _jsx("p", { className: "text-xs text-red-600", children: pwdError }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { type: "submit", className: "flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition", children: [_jsx(Save, { size: 14 }), "Mettre \u00E0 jour"] }) })] })] }), _jsxs("section", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border", children: [_jsx(Bell, { size: 16, className: "text-primary" }), _jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Notifications" })] }), _jsx("div", { className: "p-5 space-y-0 divide-y divide-border", children: [
                                            { key: "email", label: "Alertes email", description: "Recevoir les notifications par e-mail" },
                                            { key: "sms", label: "Alertes SMS", description: "Recevoir les alertes urgentes par SMS" },
                                            { key: "push", label: "Notifications push", description: "Notifications en temps réel dans l'application" },
                                            { key: "dailyReport", label: "Rapport journalier", description: "Recevoir un résumé quotidien de vos soins" },
                                        ].map(({ key, label, description }) => {
                                            const on = notifs[key];
                                            return (_jsxs("div", { className: "flex items-center justify-between py-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: label }), _jsx("p", { className: "text-xs text-muted-foreground", children: description })] }), _jsx("button", { onClick: () => toggleNotif(key), className: `relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`, role: "switch", "aria-checked": on, children: _jsx("span", { className: `absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}` }) })] }, key));
                                        }) })] })] })] })] }));
}
