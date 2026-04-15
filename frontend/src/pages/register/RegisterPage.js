import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FaEye, FaEyeSlash, FaChevronLeft, FaUserAlt, FaUserMd, FaPills, FaHospital, FaMicroscope, FaUserNurse, FaArrowRight, FaShieldAlt, FaHeartbeat, FaCheckCircle, } from "react-icons/fa";
export default function RegisterPage() {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const [userType, setUserType] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        specialization: "",
        doctorId: "",
        pharmacyId: "",
        serviceId: "",
        labId: "",
        paramedicalId: "",
        companyName: "",
        agreeToTerms: false,
    });
    const handleInputChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userType)
            return;
        if (formData.password !== formData.confirmPassword) {
            setAuthError("Les mots de passe ne correspondent pas");
            return;
        }
        if (!formData.agreeToTerms) {
            setAuthError("Vous devez accepter les conditions d'utilisation");
            return;
        }
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                    role: userType,
                    ...(formData.specialization && {
                        specialization: formData.specialization,
                    }),
                    ...(formData.doctorId && { doctorId: formData.doctorId }),
                    ...(formData.pharmacyId && { pharmacyId: formData.pharmacyId }),
                    ...(formData.serviceId && { serviceId: formData.serviceId }),
                    ...(formData.labId && { labId: formData.labId }),
                    ...(formData.paramedicalId && {
                        paramedicalId: formData.paramedicalId,
                    }),
                    ...(formData.companyName && { companyName: formData.companyName }),
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setAuthError(data.message || "Erreur lors de l'inscription. Veuillez réessayer.");
                return;
            }
            const { user: apiUser, token } = data;
            if (token) {
                localStorage.setItem("megacare_token", token);
            }
            registerUser(apiUser);
            // Non-patient accounts are put on hold pending admin review
            if (userType !== "patient" && apiUser.status === "pending") {
                navigate("/account-review");
                return;
            }
            const dashboards = {
                patient: "/dashboard",
                doctor: "/doctor-dashboard",
                pharmacy: "/pharmacy-dashboard",
                medical_service: "/medical-service-dashboard",
                lab_radiology: "/lab-dashboard",
                paramedical: "/paramedical-dashboard",
            };
            navigate(dashboards[userType] || "/dashboard");
        }
        catch {
            setAuthError("Impossible de contacter le serveur. Vérifiez votre connexion internet.");
        }
        finally {
            setIsLoading(false);
        }
    };
    const roles = [
        {
            key: "patient",
            label: "Patient",
            Icon: FaUserAlt,
            color: "from-blue-500 to-cyan-500",
            badge: "Gratuit",
            perks: ["Consultations vidéo", "Dossier médical", "Prescriptions"],
        },
        {
            key: "doctor",
            label: "Médecin",
            Icon: FaUserMd,
            color: "from-emerald-500 to-teal-500",
            badge: "Rejoindre",
            perks: ["Gérer agenda", "Dossiers patients", "Consultations vidéo"],
        },
        {
            key: "pharmacy",
            label: "Pharmacien",
            Icon: FaPills,
            color: "from-green-500 to-lime-500",
            badge: "Partenariat",
            perks: ["Gestion stock", "Commandes", "Livraisons"],
        },
        {
            key: "medical_service",
            label: "Services Médicaux",
            Icon: FaHospital,
            color: "from-purple-500 to-indigo-500",
            badge: "Partenariat",
            perks: ["Hospitalisation", "Soins domicile", "Gestion équipe"],
        },
        {
            key: "lab_radiology",
            label: "Labos & Radiologie",
            Icon: FaMicroscope,
            color: "from-rose-500 to-pink-500",
            badge: "Partenariat",
            perks: ["Analyses", "Imagerie médicale", "Résultats patients"],
        },
        {
            key: "paramedical",
            label: "Paramédicaux",
            Icon: FaUserNurse,
            color: "from-sky-500 to-blue-500",
            badge: "Rejoindre",
            perks: ["Infirmiers", "Thérapeutes", "Soins patients"],
        },
    ];
    const specializations = [
        "Cardiologie",
        "Dermatologie",
        "Neurologie",
        "Gynécologie",
        "Ophtalmologie",
        "Orthopédie",
        "Pédiatrie",
        "Psychiatrie",
        "Psychologie",
        "Thérapie",
        "Généraliste",
    ];
    if (!userType) {
        return (_jsxs("div", { className: "min-h-screen bg-background flex", children: [_jsxs("div", { className: "hidden lg:flex lg:w-2/5 xl:w-1/3 relative flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" }), _jsxs(Link, { to: "/", className: "relative flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 32, height: 32, className: "object-contain" }) }), _jsx("span", { className: "text-white font-bold text-2xl tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "relative space-y-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-white/90 text-xs font-medium mb-4", children: [_jsx(FaHeartbeat, { className: "text-white" }), "Rejoignez des milliers de professionnels"] }), _jsxs("h2", { className: "text-3xl xl:text-4xl font-bold text-white leading-tight mb-4", children: ["Cr\u00E9ez votre compte", _jsx("br", {}), "en quelques minutes"] }), _jsx("p", { className: "text-white/70 text-sm leading-relaxed", children: "Que vous soyez patient, m\u00E9decin ou professionnel de sant\u00E9, MegaCare vous offre les outils pour exercer et vous soigner en toute s\u00E9r\u00E9nit\u00E9." })] }), _jsx("div", { className: "space-y-3", children: [
                                        "Inscription rapide et sécurisée",
                                        "Accès immédiat à votre espace",
                                        "Support dédié 7j/7",
                                        "Conformité réglementaire garantie",
                                    ].map((f) => (_jsxs("div", { className: "flex items-center gap-3 text-white/80 text-sm", children: [_jsx(FaCheckCircle, { className: "text-white/60 shrink-0" }), f] }, f))) })] }), _jsxs("div", { className: "relative flex items-center gap-2", children: [_jsx(FaShieldAlt, { className: "text-white/40", size: 14 }), _jsx("span", { className: "text-white/40 text-xs", children: "Donn\u00E9es prot\u00E9g\u00E9es \u00B7 Conforme RGPD" })] })] }), _jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto relative", children: [_jsxs(Link, { to: "/", className: "absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition group", children: [_jsx(FaChevronLeft, { size: 11, className: "group-hover:-translate-x-0.5 transition-transform" }), "Accueil"] }), _jsxs(Link, { to: "/", className: "lg:hidden flex items-center gap-3 mb-8", children: [_jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 28, height: 28, className: "object-contain" }) }), _jsx("span", { className: "text-foreground font-bold text-xl tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "w-full max-w-2xl", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground mb-2", children: "Rejoignez MegaCare" }), _jsx("p", { className: "text-muted-foreground", children: "Choisissez votre profil pour commencer" })] }), (() => {
                                    const patient = roles.find((r) => r.key === "patient");
                                    return (_jsxs("button", { onClick: () => setUserType("patient"), className: "group w-full mb-4 relative p-5 bg-card rounded-2xl border-2 border-border hover:border-blue-400/50 hover:shadow-xl transition-all duration-300 overflow-hidden text-left", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20", children: _jsx(patient.Icon, { className: "text-white", size: 24 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [_jsx("span", { className: "font-bold text-foreground text-base", children: "Patient" }), _jsx("span", { className: "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400", children: "Gratuit" })] }), _jsx("div", { className: "flex flex-wrap gap-x-4 gap-y-1", children: patient.perks.map((p) => (_jsxs("span", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [_jsx(FaCheckCircle, { className: "text-primary/60 shrink-0", size: 9 }), p] }, p))) })] }), _jsx(FaArrowRight, { className: "shrink-0 mt-1 text-muted-foreground/30 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300", size: 15 })] })] }));
                                })(), _jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-0.5", children: "Professionnels de sant\u00E9" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8", children: roles
                                        .filter((r) => r.key !== "patient")
                                        .map(({ key, label, Icon, color, badge, perks }) => (_jsxs("button", { onClick: () => setUserType(key), className: "group relative p-4 bg-card rounded-2xl border-2 border-border hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden", children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300` }), _jsx("div", { className: `w-10 h-10 mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`, children: _jsx(Icon, { className: "text-white", size: 17 }) }), _jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsx("p", { className: "font-semibold text-foreground text-sm leading-tight", children: label }), _jsx("span", { className: `shrink-0 ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r ${color} text-white`, children: badge })] }), _jsx("ul", { className: "space-y-0.5", children: perks.map((p) => (_jsxs("li", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [_jsx(FaCheckCircle, { className: "text-primary/50 shrink-0", size: 8 }), p] }, p))) }), _jsx(FaArrowRight, { className: "absolute bottom-3.5 right-3.5 text-muted-foreground/25 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300", size: 11 })] }, key))) }), _jsxs("p", { className: "text-center text-sm text-muted-foreground", children: ["Vous avez d\u00E9j\u00E0 un compte?", " ", _jsx(Link, { to: "/login", className: "text-primary font-semibold hover:underline", children: "Connectez-vous" })] })] })] })] }));
    }
    const activeRole = roles.find((r) => r.key === userType);
    return (_jsxs("div", { className: "min-h-screen bg-background flex", children: [_jsxs("div", { className: "hidden lg:flex lg:w-2/5 xl:w-1/3 relative flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" }), _jsxs(Link, { to: "/", className: "relative flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 32, height: 32, className: "object-contain" }) }), _jsx("span", { className: "text-white font-bold text-2xl tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "relative space-y-6", children: [_jsx("div", { className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${activeRole.color} flex items-center justify-center`, children: _jsx(activeRole.Icon, { className: "text-white", size: 28 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white/60 text-sm mb-1", children: "Inscription en tant que" }), _jsx("h2", { className: "text-3xl font-bold text-white", children: activeRole.label })] }), _jsx("div", { className: "space-y-3", children: activeRole.perks.map((p) => (_jsxs("div", { className: "flex items-center gap-3 text-white/70 text-sm", children: [_jsx(FaCheckCircle, { className: "text-white/50 shrink-0" }), p] }, p))) })] }), _jsxs("div", { className: "relative flex items-center gap-2", children: [_jsx(FaShieldAlt, { className: "text-white/40", size: 14 }), _jsx("span", { className: "text-white/40 text-xs", children: "Donn\u00E9es prot\u00E9g\u00E9es \u00B7 Conforme RGPD" })] })] }), _jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto relative", children: [_jsxs(Link, { to: "/", className: "absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition group", children: [_jsx(FaChevronLeft, { size: 11, className: "group-hover:-translate-x-0.5 transition-transform" }), "Accueil"] }), _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("button", { onClick: () => {
                                    setUserType(null);
                                    setAuthError(null);
                                }, className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8 group", children: [_jsx(FaChevronLeft, { size: 12, className: "group-hover:-translate-x-0.5 transition-transform" }), "Changer de profil"] }), _jsxs(Link, { to: "/", className: "lg:hidden flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 24, height: 24, className: "object-contain" }) }), _jsx("span", { className: "text-foreground font-bold text-lg tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: `inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r ${activeRole.color} mb-4`, children: [_jsx(activeRole.Icon, { className: "text-white", size: 14 }), _jsx("span", { className: "text-white text-xs font-semibold", children: activeRole.label })] }), _jsx("h1", { className: "text-3xl font-bold text-foreground mb-1", children: "Cr\u00E9er un compte" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Remplissez le formulaire pour rejoindre MegaCare." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [authError && (_jsxs("div", { className: "bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm flex items-start gap-2", children: [_jsx("span", { className: "mt-0.5 shrink-0", children: "\u26A0" }), authError] })), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "firstName", className: "text-sm font-medium text-foreground", children: "Pr\u00E9nom" }), _jsx("input", { id: "firstName", type: "text", name: "firstName", value: formData.firstName, onChange: handleInputChange, placeholder: "Pr\u00E9nom", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "lastName", className: "text-sm font-medium text-foreground", children: "Nom" }), _jsx("input", { id: "lastName", type: "text", name: "lastName", value: formData.lastName, onChange: handleInputChange, placeholder: "Nom", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "email", className: "text-sm font-medium text-foreground", children: "Adresse email" }), _jsx("input", { id: "email", type: "email", name: "email", value: formData.email, onChange: handleInputChange, placeholder: "exemple@email.com", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "phone", className: "text-sm font-medium text-foreground", children: "T\u00E9l\u00E9phone" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: "+216", disabled: true, className: "w-16 px-3 py-3 bg-muted border border-border rounded-xl text-foreground text-center text-sm" }), _jsx("input", { id: "phone", type: "tel", name: "phone", value: formData.phone, onChange: handleInputChange, placeholder: "XXXXXXXX", className: "flex-1 px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] })] }), userType === "doctor" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "specialization", className: "text-sm font-medium text-foreground", children: "Sp\u00E9cialit\u00E9" }), _jsxs("select", { id: "specialization", name: "specialization", value: formData.specialization, onChange: (e) => setFormData((prev) => ({
                                                            ...prev,
                                                            specialization: e.target.value,
                                                        })), className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true, children: [_jsx("option", { value: "", children: "S\u00E9lectionner une sp\u00E9cialit\u00E9" }), specializations.map((s) => (_jsx("option", { value: s, children: s }, s)))] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "doctorId", className: "text-sm font-medium text-foreground", children: "N\u00B0 de licence m\u00E9dicale" }), _jsx("input", { id: "doctorId", type: "text", name: "doctorId", value: formData.doctorId, onChange: handleInputChange, placeholder: "Ex: MD123456", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] })] })), userType === "pharmacy" && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "pharmacyId", className: "text-sm font-medium text-foreground", children: "N\u00B0 d'agr\u00E9ment pharmacie" }), _jsx("input", { id: "pharmacyId", type: "text", name: "pharmacyId", value: formData.pharmacyId, onChange: handleInputChange, placeholder: "Ex: PH789456", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] })), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "password", className: "text-sm font-medium text-foreground", children: "Mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", type: showPassword ? "text" : "password", name: "password", value: formData.password, onChange: handleInputChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition pr-11", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition", children: showPassword ? (_jsx(FaEyeSlash, { size: 17 })) : (_jsx(FaEye, { size: 17 })) })] })] }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "confirmPassword", className: "text-sm font-medium text-foreground", children: "Confirmer le mot de passe" }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "confirmPassword", type: showConfirmPassword ? "text" : "password", name: "confirmPassword", value: formData.confirmPassword, onChange: handleInputChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition pr-11", required: true }), _jsx("button", { type: "button", onClick: () => setShowConfirmPassword(!showConfirmPassword), className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition", children: showConfirmPassword ? (_jsx(FaEyeSlash, { size: 17 })) : (_jsx(FaEye, { size: 17 })) })] })] }), _jsxs("div", { className: "flex items-start gap-3 pt-1", children: [_jsx("input", { id: "agreeToTerms", type: "checkbox", name: "agreeToTerms", checked: formData.agreeToTerms, onChange: handleInputChange, className: "w-4 h-4 mt-0.5 bg-input border border-border rounded cursor-pointer accent-primary", required: true }), _jsxs("label", { htmlFor: "agreeToTerms", className: "text-sm text-muted-foreground leading-relaxed", children: ["J'accepte les", " ", _jsx(Link, { to: "/conditions-utilisation", target: "_blank", className: "text-primary hover:underline", children: "conditions d'utilisation" }), " ", "et la", " ", _jsx(Link, { to: "/politique-confidentialite", target: "_blank", className: "text-primary hover:underline", children: "politique de confidentialit\u00E9" })] })] }), _jsx("button", { type: "submit", disabled: isLoading || !formData.agreeToTerms, className: `w-full py-3.5 bg-gradient-to-r ${activeRole.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg mt-2`, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Cr\u00E9ation du compte..."] })) : (_jsxs(_Fragment, { children: ["Cr\u00E9er mon compte", _jsx(FaArrowRight, { size: 14 })] })) })] }), _jsxs("p", { className: "text-center text-sm text-muted-foreground mt-6", children: ["Vous avez d\u00E9j\u00E0 un compte?", " ", _jsx(Link, { to: "/login", className: "text-primary font-semibold hover:underline", children: "Connectez-vous" })] })] })] })] }));
}
