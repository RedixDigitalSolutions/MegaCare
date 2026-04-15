import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { FaEye, FaEyeSlash, FaChevronLeft, FaUserAlt, FaUserMd, FaPills, FaHospital, FaMicroscope, FaUserNurse, FaArrowRight, FaShieldAlt, FaHeartbeat, FaCheckCircle, } from "react-icons/fa";
export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        doctorId: "",
        pharmacyId: "",
        serviceId: "",
        labId: "",
        paramedicalId: "",
        companyName: "",
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userRole)
            return;
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    role: userRole,
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
                setAuthError(data.message || "Identifiants incorrects. Veuillez réessayer.");
                return;
            }
            const { user: apiUser, token } = data;
            if (token) {
                localStorage.setItem("megacare_token", token);
            }
            login(apiUser);
            // Non-patient accounts must be approved before accessing their dashboard
            if (userRole !== "patient" &&
                userRole !== "admin" &&
                apiUser.status === "pending") {
                navigate("/account-review");
                return;
            }
            if (userRole !== "patient" &&
                userRole !== "admin" &&
                apiUser.status === "rejected") {
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
                admin: "/admin",
            };
            navigate(dashboards[userRole] || "/dashboard");
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
            desc: "Consultations en ligne",
            Icon: FaUserAlt,
            color: "from-blue-500 to-cyan-500",
        },
        {
            key: "doctor",
            label: "Médecin",
            desc: "Gérer vos patients",
            Icon: FaUserMd,
            color: "from-emerald-500 to-teal-500",
        },
        {
            key: "pharmacy",
            label: "Pharmacien",
            desc: "Gestion du stock",
            Icon: FaPills,
            color: "from-green-500 to-lime-500",
        },
        {
            key: "medical_service",
            label: "Services Médicaux",
            desc: "Hospitalisation à domicile",
            Icon: FaHospital,
            color: "from-purple-500 to-indigo-500",
        },
        {
            key: "lab_radiology",
            label: "Labos & Radiologie",
            desc: "Analyses & Imagerie",
            Icon: FaMicroscope,
            color: "from-rose-500 to-pink-500",
        },
        {
            key: "paramedical",
            label: "Paramédicaux",
            desc: "Infirmiers & thérapeutes",
            Icon: FaUserNurse,
            color: "from-sky-500 to-blue-500",
        },
        {
            key: "admin",
            label: "Administrateur",
            desc: "Gestion de la plateforme",
            Icon: FaShieldAlt,
            color: "from-slate-500 to-gray-700",
        },
    ];
    if (!userRole) {
        return (_jsxs("div", { className: "min-h-screen bg-background flex", children: [_jsxs("div", { className: "hidden lg:flex lg:w-2/5 xl:w-1/3 relative flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" }), _jsxs(Link, { to: "/", className: "relative flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 32, height: 32, className: "object-contain" }) }), _jsx("span", { className: "text-white font-bold text-2xl tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "relative space-y-8", children: [_jsxs("div", { children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-white/90 text-xs font-medium mb-4", children: [_jsx(FaHeartbeat, { className: "text-white" }), "Plateforme de sant\u00E9 #1 en Tunisie"] }), _jsxs("h2", { className: "text-3xl xl:text-4xl font-bold text-white leading-tight mb-4", children: ["Votre sant\u00E9,", _jsx("br", {}), "connect\u00E9e et s\u00E9curis\u00E9e"] }), _jsx("p", { className: "text-white/70 text-sm leading-relaxed", children: "Acc\u00E9dez \u00E0 des m\u00E9decins sp\u00E9cialistes, g\u00E9rez vos prescriptions et suivez votre parcours de sant\u00E9 depuis un seul endroit." })] }), _jsx("div", { className: "space-y-3", children: [
                                        "Consultations vidéo 24h/24",
                                        "Dossier médical sécurisé",
                                        "Pharmacie en ligne",
                                    ].map((f) => (_jsxs("div", { className: "flex items-center gap-3 text-white/80 text-sm", children: [_jsx(FaCheckCircle, { className: "text-white/60 shrink-0" }), f] }, f))) })] }), _jsxs("div", { className: "relative flex items-center gap-2", children: [_jsx(FaShieldAlt, { className: "text-white/40", size: 14 }), _jsx("span", { className: "text-white/40 text-xs", children: "Donn\u00E9es prot\u00E9g\u00E9es \u00B7 Conforme RGPD" })] })] }), _jsxs("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto relative", children: [_jsxs(Link, { to: "/", className: "absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition group", children: [_jsx(FaChevronLeft, { size: 11, className: "group-hover:-translate-x-0.5 transition-transform" }), "Accueil"] }), _jsxs(Link, { to: "/", className: "lg:hidden flex items-center gap-3 mb-8", children: [_jsx("div", { className: "w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 28, height: 28, className: "object-contain" }) }), _jsx("span", { className: "text-foreground font-bold text-xl tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "w-full max-w-2xl", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground mb-2", children: "Se connecter" }), _jsx("p", { className: "text-muted-foreground", children: "S\u00E9lectionnez votre profil pour continuer" })] }), (() => {
                                    const patient = roles.find((r) => r.key === "patient");
                                    return (_jsxs("button", { onClick: () => setUserRole("patient"), className: "group w-full mb-4 relative p-5 bg-card rounded-2xl border-2 border-border hover:border-blue-400/50 hover:shadow-xl transition-all duration-300 overflow-hidden text-left", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20", children: _jsx(patient.Icon, { className: "text-white", size: 24 }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-bold text-foreground text-base", children: "Patient" }), _jsx("span", { className: "text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400", children: "Acc\u00E8s gratuit" })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Consultations vid\u00E9o, ordonnances, pharmacie & dossier m\u00E9dical" })] }), _jsx(FaArrowRight, { className: "shrink-0 text-muted-foreground/30 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300", size: 15 })] })] }));
                                })(), _jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-0.5", children: "Professionnels de sant\u00E9" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8", children: roles
                                        .filter((r) => r.key !== "patient")
                                        .map(({ key, label, desc, Icon, color }) => (_jsxs("button", { onClick: () => setUserRole(key), className: "group relative p-4 bg-card rounded-2xl border-2 border-border hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden", children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300` }), _jsx("div", { className: `w-10 h-10 mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md`, children: _jsx(Icon, { className: "text-white", size: 17 }) }), _jsx("p", { className: "font-semibold text-foreground text-sm leading-tight mb-0.5", children: label }), _jsx("p", { className: "text-xs text-muted-foreground leading-tight", children: desc }), _jsx(FaArrowRight, { className: "absolute bottom-3.5 right-3.5 text-muted-foreground/25 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-300", size: 11 })] }, key))) }), _jsxs("p", { className: "text-center text-sm text-muted-foreground", children: ["Pas encore de compte?", " ", _jsx(Link, { to: "/register", className: "text-primary font-semibold hover:underline", children: "Inscrivez-vous gratuitement" })] })] })] })] }));
    }
    const activeRole = roles.find((r) => r.key === userRole);
    return (_jsxs("div", { className: "min-h-screen bg-background flex", children: [_jsxs("div", { className: "hidden lg:flex lg:w-2/5 xl:w-1/3 relative flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" }), _jsxs(Link, { to: "/", className: "relative flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 32, height: 32, className: "object-contain" }) }), _jsx("span", { className: "text-white font-bold text-2xl tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "relative space-y-6", children: [_jsx("div", { className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${activeRole.color} bg-white/10 flex items-center justify-center`, children: _jsx(activeRole.Icon, { className: "text-white", size: 28 }) }), _jsxs("div", { children: [_jsx("p", { className: "text-white/60 text-sm mb-1", children: "Connexion en tant que" }), _jsx("h2", { className: "text-3xl font-bold text-white", children: activeRole.label })] }), _jsx("div", { className: "space-y-3", children: [
                                    "Accès sécurisé à votre espace",
                                    "Données chiffrées de bout en bout",
                                    "Conforme aux normes de santé",
                                ].map((f) => (_jsxs("div", { className: "flex items-center gap-3 text-white/70 text-sm", children: [_jsx(FaCheckCircle, { className: "text-white/50 shrink-0" }), f] }, f))) })] }), _jsxs("div", { className: "relative flex items-center gap-2", children: [_jsx(FaShieldAlt, { className: "text-white/40", size: 14 }), _jsx("span", { className: "text-white/40 text-xs", children: "Donn\u00E9es prot\u00E9g\u00E9es \u00B7 Conforme RGPD" })] })] }), _jsx("div", { className: "flex-1 flex flex-col items-center justify-center px-6 py-12", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("button", { onClick: () => {
                                setUserRole(null);
                                setAuthError(null);
                                setFormData({
                                    email: "",
                                    password: "",
                                    doctorId: "",
                                    pharmacyId: "",
                                    serviceId: "",
                                    labId: "",
                                    paramedicalId: "",
                                    companyName: "",
                                });
                            }, className: "flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8 group", children: [_jsx(FaChevronLeft, { size: 12, className: "group-hover:-translate-x-0.5 transition-transform" }), "Changer de profil"] }), _jsxs(Link, { to: "/", className: "lg:hidden flex items-center gap-3 mb-6", children: [_jsx("div", { className: "w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 24, height: 24, className: "object-contain" }) }), _jsx("span", { className: "text-foreground font-bold text-lg tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: `inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r ${activeRole.color} mb-4`, children: [_jsx(activeRole.Icon, { className: "text-white", size: 14 }), _jsx("span", { className: "text-white text-xs font-semibold", children: activeRole.label })] }), _jsx("h1", { className: "text-3xl font-bold text-foreground mb-1", children: "Connexion" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Bienvenue. Entrez vos identifiants pour continuer." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [authError && (_jsxs("div", { className: "bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm flex items-start gap-2", children: [_jsx("span", { className: "mt-0.5 shrink-0", children: "\u26A0" }), authError] })), _jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "email", className: "text-sm font-medium text-foreground", children: "Adresse email" }), _jsx("input", { id: "email", type: "email", name: "email", value: formData.email, onChange: handleInputChange, placeholder: "exemple@email.com", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] }), userRole === "doctor" && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "doctorId", className: "text-sm font-medium text-foreground", children: "N\u00B0 de licence m\u00E9dicale" }), _jsx("input", { id: "doctorId", type: "text", name: "doctorId", value: formData.doctorId, onChange: handleInputChange, placeholder: "Ex: MD123456", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] })), userRole === "pharmacy" && (_jsxs("div", { className: "space-y-1.5", children: [_jsx("label", { htmlFor: "pharmacyId", className: "text-sm font-medium text-foreground", children: "N\u00B0 d'agr\u00E9ment pharmacie" }), _jsx("input", { id: "pharmacyId", type: "text", name: "pharmacyId", value: formData.pharmacyId, onChange: handleInputChange, placeholder: "Ex: PH789456", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition", required: true })] })), _jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("label", { htmlFor: "password", className: "text-sm font-medium text-foreground", children: "Mot de passe" }), _jsx(Link, { to: "#", className: "text-xs text-primary hover:underline", children: "Mot de passe oubli\u00E9?" })] }), _jsxs("div", { className: "relative", children: [_jsx("input", { id: "password", type: showPassword ? "text" : "password", name: "password", value: formData.password, onChange: handleInputChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition pr-11", required: true }), _jsx("button", { type: "button", onClick: () => setShowPassword(!showPassword), className: "absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition", children: showPassword ? (_jsx(FaEyeSlash, { size: 17 })) : (_jsx(FaEye, { size: 17 })) })] })] }), _jsx("button", { type: "submit", disabled: isLoading ||
                                        !formData.email ||
                                        !formData.password ||
                                        (userRole === "doctor" && !formData.doctorId) ||
                                        (userRole === "pharmacy" && !formData.pharmacyId), className: `w-full py-3.5 bg-gradient-to-r ${activeRole.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg`, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" }), "Connexion en cours..."] })) : (_jsxs(_Fragment, { children: ["Se connecter", _jsx(FaArrowRight, { size: 14 })] })) })] }), _jsxs("p", { className: "text-center text-sm text-muted-foreground mt-6", children: ["Pas encore de compte?", " ", _jsx(Link, { to: "/register", className: "text-primary font-semibold hover:underline", children: "Inscrivez-vous gratuitement" })] })] }) })] }));
}
