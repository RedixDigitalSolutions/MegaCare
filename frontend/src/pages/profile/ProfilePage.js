import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaUserMd, FaPills, FaHospital, FaMicroscope, FaUserNurse, FaUserAlt, FaCamera, FaCheck, FaClock, FaCheckCircle, FaTimesCircle, FaShieldAlt, FaArrowLeft, } from "react-icons/fa";
const roleConfig = {
    patient: {
        label: "Patient",
        Icon: FaUserAlt,
        color: "from-blue-500 to-cyan-500",
    },
    doctor: {
        label: "Médecin",
        Icon: FaUserMd,
        color: "from-emerald-500 to-teal-500",
    },
    pharmacy: {
        label: "Pharmacien",
        Icon: FaPills,
        color: "from-green-500 to-lime-500",
    },
    medical_service: {
        label: "Services Médicaux",
        Icon: FaHospital,
        color: "from-purple-500 to-indigo-500",
    },
    lab_radiology: {
        label: "Labos & Radiologie",
        Icon: FaMicroscope,
        color: "from-rose-500 to-pink-500",
    },
    paramedical: {
        label: "Paramédicaux",
        Icon: FaUserNurse,
        color: "from-sky-500 to-blue-500",
    },
    admin: {
        label: "Administrateur",
        Icon: FaShieldAlt,
        color: "from-slate-500 to-gray-700",
    },
};
const dashboardLinks = {
    patient: "/dashboard",
    doctor: "/doctor-dashboard",
    pharmacy: "/pharmacy-dashboard",
    medical_service: "/medical-service-dashboard",
    lab_radiology: "/lab-dashboard",
    paramedical: "/paramedical-dashboard",
    admin: "/admin",
};
export default function ProfilePage() {
    const { user, updateUser, isLoading } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
        if (user) {
            setFirstName(user.firstName || "");
            setLastName(user.lastName || "");
            setPhone(user.phone || "");
            setAvatarPreview(user.avatar ?? null);
        }
    }, [isLoading, user, navigate]);
    if (isLoading || !user)
        return null;
    const cfg = roleConfig[user.role] ?? roleConfig.patient;
    const { Icon: RoleIcon, color: roleColor, label: roleLabel } = cfg;
    const isPending = user.status === "pending";
    const isRejected = user.status === "rejected";
    const isApproved = user.status === "approved";
    const backHref = isPending || isRejected
        ? "/account-review"
        : dashboardLinks[user.role] || "/";
    const backLabel = isPending || isRejected
        ? "Retour au statut du compte"
        : "Retour au tableau de bord";
    const initials = ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase().trim() ||
        user.email[0].toUpperCase();
    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 2 * 1024 * 1024) {
            setError("L'image ne doit pas dépasser 2 Mo.");
            return;
        }
        setError(null);
        const reader = new FileReader();
        reader.onload = (ev) => {
            setAvatarPreview(ev.target?.result);
        };
        reader.readAsDataURL(file);
    };
    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSaved(false);
        try {
            const token = localStorage.getItem("megacare_token");
            if (token) {
                const res = await fetch("/api/auth/profile", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ firstName, lastName, phone }),
                });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Erreur lors de la sauvegarde");
                }
            }
            // Update local auth state (avatar is only stored in localStorage)
            updateUser({
                firstName,
                lastName,
                phone,
                name: `${firstName} ${lastName}`.trim(),
                ...(avatarPreview !== null && { avatar: avatarPreview }),
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Erreur inconnue");
        }
        finally {
            setSaving(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx(Header, {}), _jsxs("main", { className: "max-w-3xl mx-auto px-6 pt-28 pb-16", children: [_jsxs(Link, { to: backHref, className: "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6 group", children: [_jsx(FaArrowLeft, { size: 11, className: "group-hover:-translate-x-0.5 transition-transform" }), backLabel] }), _jsx("h1", { className: "text-2xl font-bold text-foreground mb-6", children: "Mon profil" }), isPending && (_jsxs("div", { className: "flex items-start gap-3 p-4 mb-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20", children: [_jsx(FaClock, { className: "text-amber-500 shrink-0 mt-0.5", size: 16 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-amber-700 dark:text-amber-400", children: "Compte en cours de v\u00E9rification" }), _jsx("p", { className: "text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5", children: "Votre compte est en attente d'approbation. Vous pouvez mettre \u00E0 jour votre profil en attendant." })] })] })), isRejected && (_jsxs("div", { className: "flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20", children: [_jsx(FaTimesCircle, { className: "text-destructive shrink-0 mt-0.5", size: 16 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-destructive", children: "Compte non approuv\u00E9" }), _jsx("p", { className: "text-xs text-destructive/70 mt-0.5", children: "Votre demande n'a pas \u00E9t\u00E9 approuv\u00E9e. Contactez le support pour plus d'informations." })] })] })), isApproved && (_jsxs("div", { className: "flex items-center gap-3 p-4 mb-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20", children: [_jsx(FaCheckCircle, { className: "text-emerald-500 shrink-0", size: 16 }), _jsx("p", { className: "text-sm font-semibold text-emerald-700 dark:text-emerald-400", children: "Compte actif et approuv\u00E9" })] })), _jsxs("form", { onSubmit: handleSave, children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6", children: [_jsxs("div", { className: "sm:col-span-1 flex flex-col items-center gap-4 pt-2", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-border bg-muted flex items-center justify-center", children: avatarPreview ? (_jsx("img", { src: avatarPreview, alt: "Avatar", className: "w-full h-full object-cover" })) : (_jsx("div", { className: `w-full h-full bg-gradient-to-br ${roleColor} flex items-center justify-center`, children: _jsx("span", { className: "text-3xl font-bold text-white", children: initials }) })) }), _jsx("button", { type: "button", onClick: () => fileInputRef.current?.click(), className: "absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition", title: "Changer la photo de profil", children: _jsx(FaCamera, { size: 14 }) }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/jpeg,image/png,image/webp", className: "hidden", onChange: handleAvatarChange })] }), _jsxs("div", { className: "text-center space-y-2", children: [_jsxs("span", { className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${roleColor} text-white`, children: [_jsx(RoleIcon, { size: 11 }), roleLabel] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "JPG, PNG, WebP \u2014 max 2 Mo" }), avatarPreview && (_jsx("button", { type: "button", onClick: () => setAvatarPreview(null), className: "text-xs text-muted-foreground hover:text-destructive transition", children: "Supprimer la photo" }))] })] }), _jsxs("div", { className: "sm:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-4", children: [error && (_jsxs("div", { className: "bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm flex items-start gap-2", children: [_jsx("span", { className: "shrink-0 mt-0.5", children: "\u26A0" }), error] })), saved && (_jsxs("div", { className: "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2", children: [_jsx(FaCheck, { size: 12 }), "Profil mis \u00E0 jour avec succ\u00E8s"] })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm font-medium text-foreground", children: "Pr\u00E9nom" }), _jsx("input", { type: "text", value: firstName, onChange: (e) => setFirstName(e.target.value), placeholder: "Pr\u00E9nom", className: "w-full px-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-sm" })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm font-medium text-foreground", children: "Nom" }), _jsx("input", { type: "text", value: lastName, onChange: (e) => setLastName(e.target.value), placeholder: "Nom", className: "w-full px-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-sm" })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm font-medium text-foreground", children: "Adresse email" }), _jsx("input", { type: "email", value: user.email, disabled: true, className: "w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "L'adresse email ne peut pas \u00EAtre modifi\u00E9e." })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm font-medium text-foreground", children: "T\u00E9l\u00E9phone" }), _jsx("input", { type: "tel", value: phone, onChange: (e) => setPhone(e.target.value), placeholder: "+216 XX XXX XXX", className: "w-full px-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-sm" })] }), user.specialization && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { className: "text-sm font-medium text-foreground", children: "Sp\u00E9cialisation" }), _jsx("input", { type: "text", value: user.specialization, disabled: true, className: "w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed" })] })), _jsxs("div", { className: "pt-2 border-t border-border", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Statut du compte" }), _jsxs("div", { className: "flex items-center gap-2", children: [isPending && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20", children: [_jsx(FaClock, { size: 10 }), "En attente de validation (24\u201348h)"] })), isRejected && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-destructive border border-red-200 dark:border-red-500/20", children: [_jsx(FaTimesCircle, { size: 10 }), "Compte non approuv\u00E9"] })), isApproved && (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20", children: [_jsx(FaCheckCircle, { size: 10 }), "Approuv\u00E9"] }))] })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: saving, className: "flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm shadow-lg shadow-primary/20", children: saving ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Sauvegarde..."] })) : saved ? (_jsxs(_Fragment, { children: [_jsx(FaCheck, { size: 12 }), "Sauvegard\u00E9"] })) : ("Enregistrer les modifications") }) })] })] })] }));
}
