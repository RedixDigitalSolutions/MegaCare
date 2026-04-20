import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { User, Save, Loader2, CheckCircle2, AlertCircle, Camera, Mail, Phone, Shield, } from "lucide-react";
import { useEffect, useState, useRef } from "react";
const roleLabels = {
    patient: "Patient",
    doctor: "Médecin",
    pharmacy: "Pharmacien",
    medical_service: "Services Médicaux",
    lab_radiology: "Labos & Radiologie",
    paramedical: "Paramédicaux",
    admin: "Administrateur",
};
export default function DashboardProfilePage() {
    const { user, isLoading, isAuthenticated, updateUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState(null);
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, navigate]);
    useEffect(() => {
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setPhone(user.phone || "");
            setAvatarPreview(user.avatar ?? null);
        }
    }, [user]);
    if (isLoading || !isAuthenticated || !user) {
        return null;
    }
    const initials = ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase().trim() ||
        user.email[0].toUpperCase();
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 2 * 1024 * 1024) {
            setSaveMsg({ type: "error", text: "L'image ne doit pas dépasser 2 Mo." });
            return;
        }
        const reader = new FileReader();
        reader.onload = (ev) => setAvatarPreview(ev.target?.result);
        reader.readAsDataURL(file);
    };
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
                body: JSON.stringify({ firstName, lastName, phone }),
            });
            const data = await res.json();
            if (!res.ok)
                throw new Error(data.message || "Erreur lors de la sauvegarde");
            const stored = localStorage.getItem("megacare_user");
            if (stored) {
                const parsed = JSON.parse(stored);
                localStorage.setItem("megacare_user", JSON.stringify({ ...parsed, firstName, lastName, phone }));
            }
            updateUser({
                firstName,
                lastName,
                phone,
                name: `${firstName} ${lastName}`.trim(),
                avatar: avatarPreview ?? undefined,
            });
            setSaveMsg({ type: "success", text: "Profil mis à jour avec succès" });
        }
        catch (err) {
            setSaveMsg({ type: "error", text: err.message });
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, { userName: user.firstName }), _jsx("main", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "p-6 space-y-6 max-w-2xl", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Mon profil" }), _jsx("p", { className: "text-muted-foreground mt-2", children: "G\u00E9rez vos informations personnelles" })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-2 ring-primary/20", children: avatarPreview ? (_jsx("img", { src: avatarPreview, alt: "Avatar", className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-2xl font-bold text-white", children: initials })) }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow hover:bg-primary/90 transition", children: _jsx(Camera, { size: 14 }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/jpeg,image/png,image/webp", className: "hidden", onChange: handleAvatarChange })] }), _jsxs("div", { className: "text-center sm:text-left space-y-1", children: [_jsxs("h2", { className: "text-xl font-bold text-foreground", children: [firstName, " ", lastName] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Mail, { size: 14 }), user.email] }), phone && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx(Phone, { size: 14 }), phone] })), _jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mt-1", children: [_jsx(Shield, { size: 11 }), roleLabels[user.role] || user.role] })] })] }), _jsx("p", { className: "text-xs text-muted-foreground mt-4", children: "JPG, PNG, WebP \u2014 max 2 Mo" }), avatarPreview && (_jsx("button", { type: "button", onClick: () => setAvatarPreview(null), className: "text-xs text-muted-foreground hover:text-destructive transition mt-1", children: "Supprimer la photo" }))] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(User, { size: 24, className: "text-primary" }), _jsx("h2", { className: "text-xl font-bold text-foreground", children: "Informations personnelles" })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", value: firstName, onChange: (e) => setFirstName(e.target.value), className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Nom" }), _jsx("input", { type: "text", value: lastName, onChange: (e) => setLastName(e.target.value), className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Adresse email" }), _jsx("input", { type: "email", value: user.email, disabled: true, className: "w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "L'adresse email ne peut pas \u00EAtre modifi\u00E9e." })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+216 XX XXX XXX", className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" })] }), user.specialization && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Sp\u00E9cialisation" }), _jsx("input", { type: "text", value: user.specialization, disabled: true, className: "w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed" })] })), _jsxs("div", { className: "pt-2 border-t border-border", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Statut du compte" }), user.status === "approved" && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20", children: [_jsx(CheckCircle2, { size: 12 }), " Approuv\u00E9"] })), user.status === "pending" && (_jsx("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20", children: "En attente de validation" })), user.status === "rejected" && (_jsx("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-destructive border border-red-200 dark:border-red-500/20", children: "Non approuv\u00E9" }))] }), saveMsg && (_jsxs("div", { className: `flex items-center gap-2 p-3 rounded-lg text-sm ${saveMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`, children: [saveMsg.type === "success" ? (_jsx(CheckCircle2, { size: 16 })) : (_jsx(AlertCircle, { size: 16 })), saveMsg.text] })), _jsxs("button", { onClick: handleSaveProfile, disabled: saving, className: "w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50", children: [saving ? (_jsx(Loader2, { size: 18, className: "animate-spin" })) : (_jsx(Save, { size: 18 })), saving
                                                ? "Enregistrement..."
                                                : "Enregistrer les modifications"] })] })] }) })] }) }));
}
