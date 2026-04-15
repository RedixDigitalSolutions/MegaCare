import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, ChevronDown, ArrowRight, Sparkles, Phone, User as UserIcon, LayoutDashboard, LogOut, } from "lucide-react";
export function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current &&
                !dropdownRef.current.contains(e.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024)
                setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (_jsxs("header", { className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-lg shadow-black/5 py-3" : "bg-transparent py-5"}`, children: [_jsx("div", { className: `transition-all duration-500 overflow-hidden ${scrolled ? "h-0 opacity-0" : "h-auto opacity-100"}`, children: _jsxs("div", { className: "hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-end items-center gap-6 text-xs text-muted-foreground pb-2", children: [_jsxs("a", { href: "tel:+21612345678", className: "flex items-center gap-2 hover:text-primary transition-colors duration-300", children: [_jsx(Phone, { size: 12 }), "+216 12 345 678"] }), _jsx("span", { className: "text-muted-foreground/30", children: "|" }), _jsx("span", { children: "Disponible 24/7" })] }) }), _jsxs("nav", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 group shrink-0", children: [_jsx("div", { className: "relative w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500 group-hover:scale-105", children: _jsx("img", { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_-_Copie-removebg-preview%20%281%29-1lHtn7bUP56gkeKOohlFiO7U9vRpnw.png", alt: "MegaCare Logo", className: "w-full h-full object-contain", fetchPriority: "low" }) }), _jsxs("div", { className: "hidden sm:block", children: [_jsx("span", { className: "font-bold text-xl tracking-tight text-[#1a237e]", children: "MEGACARE" }), _jsx("p", { className: "text-[10px] text-muted-foreground -mt-1 tracking-wide", children: "Votre sante, connectee" })] })] }), _jsxs("div", { ref: dropdownRef, className: "hidden lg:flex items-center gap-0.5", children: [_jsx(NavLink, { href: "/", children: "Accueil" }), _jsxs("div", { className: "relative", onMouseEnter: () => setActiveDropdown("services"), onMouseLeave: () => setActiveDropdown(null), children: [_jsxs("button", { onClick: () => setActiveDropdown(activeDropdown === "services" ? null : "services"), className: "flex items-center gap-1.5 px-4 py-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all duration-300 font-medium text-sm", children: ["Services", _jsx(ChevronDown, { size: 15, className: `transition-transform duration-300 ${activeDropdown === "services" ? "rotate-180" : ""}` })] }), _jsx("div", { className: `absolute left-1/2 -translate-x-1/2 mt-2 w-80 transition-all duration-300 ${activeDropdown === "services"
                                            ? "opacity-100 visible translate-y-0"
                                            : "opacity-0 invisible -translate-y-2"}`, children: _jsxs("div", { className: "glass rounded-2xl shadow-2xl overflow-hidden border border-border/50 p-2", children: [_jsx("div", { className: "px-3 pt-2 pb-1", children: _jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Consultation & Pharmacie" }) }), _jsx(DropdownLink, { href: "/doctors", icon: "\uD83D\uDC68\u200D\u2695\uFE0F", title: "Medecins", description: "Consultez un specialiste en video" }), _jsx(DropdownLink, { href: "/pharmacy", icon: "\uD83D\uDC8A", title: "Pharmacie", description: "Commandez vos medicaments en ligne" }), _jsx("div", { className: "mx-2 my-1 border-t border-border/50" }), _jsx("div", { className: "px-3 pt-2 pb-1", children: _jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground", children: "Autres services" }) }), _jsx(DropdownLink, { href: "/services-medicaux", icon: "\uD83C\uDFE5", title: "Services Medicaux", description: "Hopitaux et cliniques partenaires" }), _jsx(DropdownLink, { href: "/labos-radiologie", icon: "\uD83D\uDD2C", title: "Labos & Radiologie", description: "Analyses et examens medicaux" }), _jsx(DropdownLink, { href: "/paramedical", icon: "\uD83D\uDC89", title: "Paramedicaux", description: "Soins infirmiers a domicile" })] }) })] }), _jsx(NavLink, { href: "/guide", children: "Guide & Tarifs" })] }), _jsx("div", { className: "hidden lg:flex items-center gap-3", children: !isLoading && isAuthenticated && user ? (_jsx(ProfileMenuButton, { user: user, logout: logout })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "px-5 py-2.5 text-foreground/80 hover:text-primary transition-all duration-300 font-medium rounded-xl hover:bg-secondary/50 text-sm", children: "Connexion" }), _jsxs(Link, { to: "/register", className: "group relative px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/25 hover:scale-105 text-sm", children: [_jsxs("span", { className: "relative z-10 flex items-center gap-2", children: ["Inscription", _jsx(ArrowRight, { size: 15, className: "transition-transform duration-300 group-hover:translate-x-1" })] }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" })] })] })) }), _jsx("div", { className: "hidden md:flex lg:hidden items-center gap-2", children: !isLoading && isAuthenticated && user ? (_jsx(ProfileMenuButton, { user: user, logout: logout })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", className: "px-4 py-2 text-foreground/80 hover:text-primary transition-colors font-medium rounded-xl hover:bg-secondary/50 text-sm", children: "Connexion" }), _jsx(Link, { to: "/register", className: "px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity", children: "S'inscrire" })] })) }), _jsx("button", { onClick: () => setIsOpen(!isOpen), className: "lg:hidden p-2.5 hover:bg-secondary/50 rounded-xl transition-all duration-300", "aria-label": "Menu", "aria-expanded": isOpen, children: _jsxs("div", { className: "relative w-5 h-5", children: [_jsx(Menu, { size: 20, className: `absolute inset-0 transition-all duration-300 ${isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100"}` }), _jsx(X, { size: 20, className: `absolute inset-0 transition-all duration-300 ${isOpen ? "opacity-100" : "opacity-0 -rotate-90 scale-50"}` })] }) })] }), _jsx("div", { className: `lg:hidden overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}`, children: _jsxs("div", { className: "glass mx-4 mt-4 rounded-2xl p-5 space-y-1 border border-border/50 shadow-2xl", children: [_jsx(MobileNavLink, { href: "/", onClick: () => setIsOpen(false), children: "Accueil" }), _jsxs("details", { className: "group", children: [_jsxs("summary", { className: "cursor-pointer py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 flex items-center justify-between font-medium text-sm list-none select-none", children: ["Services", _jsx(ChevronDown, { size: 16, className: "transition-transform duration-300 group-open:rotate-180 text-muted-foreground" })] }), _jsxs("div", { className: "ml-2 mt-1 space-y-0.5 border-l-2 border-primary/20 pl-3", children: [_jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-1", children: "Consultation & Pharmacie" }), _jsx(MobileSubLink, { href: "/doctors", onClick: () => setIsOpen(false), children: "\uD83D\uDC68\u200D\u2695\uFE0F Medecins" }), _jsx(MobileSubLink, { href: "/pharmacy", onClick: () => setIsOpen(false), children: "\uD83D\uDC8A Pharmacie" }), _jsx("p", { className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-3 pb-1", children: "Autres services" }), _jsx(MobileSubLink, { href: "/services-medicaux", onClick: () => setIsOpen(false), children: "\uD83C\uDFE5 Services Medicaux" }), _jsx(MobileSubLink, { href: "/labos-radiologie", onClick: () => setIsOpen(false), children: "\uD83D\uDD2C Labos & Radiologie" }), _jsx(MobileSubLink, { href: "/paramedical", onClick: () => setIsOpen(false), children: "\uD83D\uDC89 Paramedicaux" })] })] }), _jsx(MobileNavLink, { href: "/guide", onClick: () => setIsOpen(false), children: "Guide & Tarifs" }), _jsx("div", { className: "border-t border-border/50 pt-4 mt-3 space-y-1", children: !isLoading && isAuthenticated && user ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 mb-1", children: [_jsx("div", { className: `w-9 h-9 rounded-full flex-shrink-0 overflow-hidden ${user.status === "pending"
                                                    ? "ring-2 ring-amber-400"
                                                    : user.status === "rejected"
                                                        ? "ring-2 ring-destructive"
                                                        : "ring-2 ring-primary/20"}`, children: user.avatar ? (_jsx("img", { src: user.avatar, alt: "", className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center", children: _jsx("span", { className: "text-xs font-bold text-white", children: ((user.firstName?.[0] ?? "") +
                                                            (user.lastName?.[0] ?? "")).toUpperCase() || user.email[0].toUpperCase() }) })) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-semibold text-foreground text-sm truncate", children: user.firstName && user.lastName
                                                            ? `${user.firstName} ${user.lastName}`
                                                            : user.name || user.email }), user.status === "pending" && (_jsx("span", { className: "text-xs text-amber-500", children: "\u23F3 En attente de validation" })), user.status === "rejected" && (_jsx("span", { className: "text-xs text-destructive", children: "Compte refus\u00E9" }))] })] }), _jsx(Link, { to: "/profile", onClick: () => setIsOpen(false), className: "block py-2.5 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium text-sm", children: "Mon profil" }), user.status === "approved" && (_jsx(Link, { to: {
                                            patient: "/dashboard",
                                            doctor: "/doctor-dashboard",
                                            pharmacy: "/pharmacy-dashboard",
                                            medical_service: "/medical-service-dashboard",
                                            lab_radiology: "/lab-dashboard",
                                            paramedical: "/paramedical-dashboard",
                                            admin: "/admin",
                                        }[user.role] || "/dashboard", onClick: () => setIsOpen(false), className: "block py-2.5 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium text-sm", children: "Tableau de bord" })), (user.status === "pending" || user.status === "rejected") && (_jsx(Link, { to: "/account-review", onClick: () => setIsOpen(false), className: "block py-2.5 px-4 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/5 rounded-xl transition-all duration-300 font-medium text-sm", children: "Statut du compte" })), _jsx("button", { onClick: () => {
                                            logout();
                                            setIsOpen(false);
                                            navigate("/");
                                        }, className: "w-full text-left block py-2.5 px-4 text-destructive hover:bg-destructive/5 rounded-xl transition-all duration-300 font-medium text-sm", children: "D\u00E9connexion" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", onClick: () => setIsOpen(false), className: "block py-3 px-4 text-center text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium text-sm", children: "Connexion" }), _jsxs(Link, { to: "/register", onClick: () => setIsOpen(false), className: "flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl text-center font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm", children: [_jsx(Sparkles, { size: 15 }), "Inscription gratuite"] })] })) })] }) })] }));
}
function NavLink({ href, children, }) {
    return (_jsxs(Link, { to: href, className: "relative px-4 py-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all duration-300 font-medium text-sm group", children: [children, _jsx("span", { className: "absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-1/2 rounded-full" })] }));
}
function DropdownLink({ href, icon, title, description, }) {
    return (_jsxs(Link, { to: href, className: "flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-300 group", children: [_jsx("span", { className: "text-xl mt-0.5 group-hover:scale-110 transition-transform duration-300 leading-none", children: icon }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-300", children: title }), _jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: description })] })] }));
}
function MobileNavLink({ href, onClick, children, }) {
    return (_jsx(Link, { to: href, onClick: onClick, className: "block py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium text-sm", children: children }));
}
function MobileSubLink({ href, onClick, children, }) {
    return (_jsx(Link, { to: href, onClick: onClick, className: "block py-2.5 px-3 text-sm text-foreground/70 hover:text-primary hover:bg-secondary/30 rounded-lg transition-colors duration-300", children: children }));
}
function ProfileMenuButton({ user, logout, }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);
    const displayName = user.firstName || user.name?.split(" ")[0] || user.email.split("@")[0];
    const initials = ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? ""))
        .toUpperCase()
        .trim() || user.email[0].toUpperCase();
    const isPending = user.status === "pending";
    const isRejected = user.status === "rejected";
    const dashboards = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        lab_radiology: "/lab-dashboard",
        paramedical: "/paramedical-dashboard",
        admin: "/admin",
    };
    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/");
    };
    return (_jsxs("div", { ref: ref, className: "relative", children: [_jsxs("button", { onClick: () => setOpen(!open), className: "flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary/50 transition-all duration-200 group", children: [_jsx("div", { className: `w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${isPending
                            ? "ring-2 ring-amber-400"
                            : isRejected
                                ? "ring-2 ring-destructive"
                                : "ring-2 ring-primary/20"}`, children: user.avatar ? (_jsx("img", { src: user.avatar, alt: displayName, className: "w-full h-full object-cover" })) : (_jsx("div", { className: "w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center", children: _jsx("span", { className: "text-xs font-bold text-white", children: initials }) })) }), _jsx("span", { className: "hidden xl:block text-sm font-medium text-foreground/80 group-hover:text-foreground max-w-[100px] truncate", children: displayName }), isPending && (_jsx("span", { className: "w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse", title: "Compte en attente de validation" })), _jsx(ChevronDown, { size: 14, className: `text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}` })] }), open && (_jsxs("div", { className: "absolute right-0 mt-2 w-60 glass rounded-2xl shadow-2xl border border-border/50 z-50 overflow-hidden", children: [_jsxs("div", { className: "px-4 py-3 border-b border-border/50 bg-muted/30", children: [_jsx("p", { className: "font-semibold text-foreground text-sm truncate", children: user.firstName && user.lastName
                                    ? `${user.firstName} ${user.lastName}`
                                    : user.name || user.email }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: user.email }), isPending && (_jsx("span", { className: "inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400", children: "\u23F3 En attente de validation" })), isRejected && (_jsx("span", { className: "inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-destructive", children: "\u2715 Compte refus\u00E9" }))] }), _jsxs("div", { className: "py-1.5", children: [_jsxs(Link, { to: "/profile", onClick: () => setOpen(false), className: "flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors", children: [_jsx(UserIcon, { size: 15 }), "Mon profil"] }), !isPending && !isRejected && (_jsxs(Link, { to: dashboards[user.role] || "/dashboard", onClick: () => setOpen(false), className: "flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors", children: [_jsx(LayoutDashboard, { size: 15 }), "Tableau de bord"] })), (isPending || isRejected) && (_jsxs(Link, { to: "/account-review", onClick: () => setOpen(false), className: "flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-colors", children: [_jsx("span", { className: "text-base leading-none", children: "\u23F3" }), "Statut du compte"] }))] }), _jsx("div", { className: "border-t border-border/50 py-1.5", children: _jsxs("button", { onClick: handleLogout, className: "flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors w-full text-left", children: [_jsx(LogOut, { size: 15 }), "D\u00E9connexion"] }) })] }))] }));
}
