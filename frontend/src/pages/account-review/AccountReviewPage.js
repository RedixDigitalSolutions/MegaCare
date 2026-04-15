import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FaClock, FaCheckCircle, FaTimesCircle, FaEnvelope, FaSignOutAlt, FaShieldAlt, FaUserMd, FaPills, FaHospital, FaMicroscope, FaUserNurse, FaUser, } from "react-icons/fa";
const roleLabels = {
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
};
export default function AccountReviewPage() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if (!isLoading && !user) {
            navigate("/login");
        }
        // Approved users should go to their dashboard
        if (!isLoading && user && user.status === "approved") {
            const dashboards = {
                patient: "/dashboard",
                doctor: "/doctor-dashboard",
                pharmacy: "/pharmacy-dashboard",
                medical_service: "/medical-service-dashboard",
                lab_radiology: "/lab-dashboard",
                paramedical: "/paramedical-dashboard",
                admin: "/admin",
            };
            navigate(dashboards[user.role] || "/dashboard");
        }
    }, [isLoading, user, navigate]);
    if (isLoading || !user)
        return null;
    const isRejected = user.status === "rejected";
    const roleInfo = roleLabels[user.role] ?? {
        label: user.role,
        Icon: FaShieldAlt,
        color: "from-gray-400 to-gray-600",
    };
    const { Icon: RoleIcon, color: roleColor, label: roleLabel } = roleInfo;
    const userName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.name || user.email;
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative", children: [_jsxs(Link, { to: "/", className: "absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition group", children: [_jsx("svg", { className: "w-3 h-3 group-hover:-translate-x-0.5 transition-transform", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 19l-7-7 7-7" }) }), "Accueil"] }), _jsxs(Link, { to: "/", className: "flex items-center gap-3 mb-10", children: [_jsx("div", { className: "w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", width: 28, height: 28, className: "object-contain" }) }), _jsx("span", { className: "text-foreground font-bold text-xl tracking-tight", children: "MEGACARE" })] }), _jsxs("div", { className: "w-full max-w-lg bg-card border border-border rounded-3xl px-8 py-10 shadow-xl text-center", children: [_jsx("div", { className: "flex justify-center mb-6", children: isRejected ? (_jsx("div", { className: "w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center", children: _jsx(FaTimesCircle, { className: "text-destructive", size: 40 }) })) : (_jsxs("div", { className: "relative w-20 h-20", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center", children: _jsx(FaClock, { className: "text-amber-500", size: 36 }) }), _jsx("span", { className: "absolute -bottom-1 -right-1 w-7 h-7 bg-card rounded-full border-2 border-border flex items-center justify-center", children: _jsx("div", { className: `w-4 h-4 rounded-full bg-gradient-to-br ${roleColor} flex items-center justify-center`, children: _jsx(RoleIcon, { className: "text-white", size: 8 }) }) })] })) }), _jsx("h1", { className: "text-2xl font-bold text-foreground mb-2", children: isRejected
                            ? "Compte non approuvé"
                            : "Compte en cours de vérification" }), _jsx("p", { className: "text-muted-foreground text-sm mb-6 leading-relaxed", children: isRejected
                            ? "Votre demande d'inscription en tant que " +
                                roleLabel +
                                " n'a pas été approuvée. Contactez notre support pour plus d'informations."
                            : "Votre demande d'inscription en tant que " +
                                roleLabel +
                                " est en cours d'examen par notre équipe. Vous recevrez une confirmation dès son approbation." }), _jsxs("div", { className: "bg-muted/50 rounded-2xl px-5 py-4 mb-6 text-left space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Nom" }), _jsx("span", { className: "font-medium text-foreground", children: userName })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Email" }), _jsx("span", { className: "font-medium text-foreground", children: user.email })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Profil" }), _jsxs("span", { className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${roleColor} text-white`, children: [_jsx(RoleIcon, { size: 10 }), roleLabel] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Statut" }), isRejected ? (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive", children: [_jsx(FaTimesCircle, { size: 10 }), " Refus\u00E9"] })) : (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", children: [_jsx(FaClock, { size: 10 }), " En attente"] }))] })] }), !isRejected && (_jsxs("div", { className: "text-left mb-6", children: [_jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Prochaines \u00E9tapes" }), _jsx("div", { className: "space-y-3", children: [
                                    {
                                        icon: FaCheckCircle,
                                        color: "text-primary",
                                        label: "Inscription soumise avec succès",
                                    },
                                    {
                                        icon: FaClock,
                                        color: "text-amber-500",
                                        label: "Vérification par l'équipe MegaCare (24–48h)",
                                    },
                                    {
                                        icon: FaEnvelope,
                                        color: "text-muted-foreground",
                                        label: "Notification par email dès approbation",
                                    },
                                ].map(({ icon: StepIcon, color, label }, i) => (_jsxs("div", { className: "flex items-center gap-3 text-sm", children: [_jsx(StepIcon, { className: `${color} shrink-0`, size: 16 }), _jsx("span", { className: i === 0
                                                ? "text-foreground"
                                                : i === 1
                                                    ? "text-foreground font-medium"
                                                    : "text-muted-foreground", children: label })] }, i))) })] })), _jsxs("div", { className: "space-y-3", children: [_jsxs(Link, { to: "/profile", className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20", children: [_jsx(FaUser, { size: 13 }), "Modifier mon profil"] }), _jsxs("a", { href: "mailto:support@megacare.tn", className: "w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition", children: [_jsx(FaEnvelope, { size: 14 }), "Contacter le support"] }), _jsxs("button", { onClick: handleLogout, className: "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition", children: [_jsx(FaSignOutAlt, { size: 14 }), "Se d\u00E9connecter"] })] })] }), _jsxs("p", { className: "mt-6 text-xs text-muted-foreground flex items-center gap-1.5", children: [_jsx(FaShieldAlt, { size: 11 }), "Vos donn\u00E9es sont prot\u00E9g\u00E9es \u00B7 MegaCare \u00A9 2024"] })] }));
}
