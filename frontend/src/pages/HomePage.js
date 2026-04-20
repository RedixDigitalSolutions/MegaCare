import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { Star, Shield, Clock, CheckCircle, Zap, ArrowRight, Play, Heart, Stethoscope, Pill, Brain, Eye, Bone, Baby, Activity, Sparkles, Video, FileText, Users, Award, MousePointer, ChevronRight, X, } from "lucide-react";
export default function HomePage() {
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col overflow-x-hidden", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1", children: [_jsx(HeroSection, {}), _jsx(PartnersSection, {}), _jsx(StatsSection, {}), _jsx(ServicesSection, {}), _jsx(SpecialtiesSection, {}), _jsx(FeaturesSection, {}), _jsx(HowItWorksSection, {}), _jsx(TestimonialsSection, {}), _jsx(CTASection, {})] }), _jsx(Footer, {})] }));
}
// Custom hook for intersection observer
function useInView(options = {}) {
    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsInView(true);
            }
        }, { threshold: 0.1, ...options });
        if (ref.current)
            observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return { ref, isInView };
}
// Animated Counter Hook
function useCounter(end, duration = 2000, startOnView = true) {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(!startOnView);
    useEffect(() => {
        if (!hasStarted)
            return;
        let startTime;
        const animate = (timestamp) => {
            if (!startTime)
                startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1)
                requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [end, duration, hasStarted]);
    return { count, start: () => setHasStarted(true) };
}
// Particle Background Component - uses deterministic positions to avoid hydration mismatch
function ParticleBackground() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    // Deterministic positions based on index
    const particles = [
        { left: 10, top: 20, duration: 18, delay: 1 },
        { left: 25, top: 80, duration: 22, delay: 3 },
        { left: 40, top: 15, duration: 16, delay: 0 },
        { left: 55, top: 65, duration: 20, delay: 2 },
        { left: 70, top: 35, duration: 19, delay: 4 },
        { left: 85, top: 75, duration: 17, delay: 1.5 },
        { left: 15, top: 50, duration: 21, delay: 2.5 },
        { left: 30, top: 90, duration: 18, delay: 0.5 },
        { left: 60, top: 25, duration: 23, delay: 3.5 },
        { left: 90, top: 55, duration: 16, delay: 4.5 },
        { left: 5, top: 70, duration: 20, delay: 1.2 },
        { left: 45, top: 40, duration: 19, delay: 2.8 },
        { left: 75, top: 10, duration: 17, delay: 0.8 },
        { left: 20, top: 60, duration: 22, delay: 3.2 },
        { left: 50, top: 85, duration: 18, delay: 4.2 },
        { left: 80, top: 30, duration: 21, delay: 1.8 },
        { left: 35, top: 45, duration: 16, delay: 2.2 },
        { left: 65, top: 95, duration: 20, delay: 0.2 },
        { left: 95, top: 5, duration: 19, delay: 3.8 },
        { left: 12, top: 38, duration: 17, delay: 4.8 },
    ];
    if (!mounted)
        return null;
    return (_jsx("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: particles.map((p, i) => (_jsx("div", { className: "absolute w-2 h-2 bg-primary/20 rounded-full", style: {
                left: `${p.left}%`,
                top: `${p.top}%`,
                animation: `particle-float ${p.duration}s linear infinite`,
                animationDelay: `${p.delay}s`,
            } }, i))) }));
}
// Hero Section
function HeroSection() {
    const [isVisible, setIsVisible] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    useEffect(() => {
        setIsVisible(true);
    }, []);
    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: (e.clientX - rect.left - rect.width / 2) / 50,
            y: (e.clientY - rect.top - rect.height / 2) / 50,
        });
    }, []);
    return (_jsxs("section", { className: "relative min-h-screen flex items-center overflow-hidden pt-20", onMouseMove: handleMouseMove, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" }), _jsx("div", { className: "absolute top-20 right-20 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px] animate-blob", style: {
                    transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
                } }), _jsx("div", { className: "absolute bottom-20 left-20 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-blob delay-300", style: {
                    transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)`,
                } }), _jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(0,100,150,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,150,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" }), _jsx(ParticleBackground, {}), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20", children: [_jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: `inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-primary/20 transition-all duration-1000 ${isVisible
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"}`, children: [_jsxs("span", { className: "relative flex h-3 w-3", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" }), _jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-accent" })] }), _jsx("span", { className: "text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", children: "Plateforme N1 de Telemedecine en Tunisie" }), _jsx(Sparkles, { size: 16, className: "text-accent animate-pulse" })] }), _jsx("div", { className: `space-y-4 transition-all duration-1000 delay-150 ${isVisible
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"}`, children: _jsxs("h1", { className: "text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight", children: [_jsx("span", { className: "text-foreground block", children: "Votre sante," }), _jsx("span", { className: "gradient-text block", children: "connectee" })] }) }), _jsx("p", { className: `text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-1000 delay-300 ${isVisible
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"}`, children: "Consultez des medecins specialistes en ligne, accedez a votre dossier medical securise et recevez vos medicaments directement chez vous." }), _jsxs("div", { className: `flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${isVisible
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"}`, children: [_jsxs(Link, { to: "/doctors", className: "group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] hover-glow", children: [_jsx("span", { className: "relative z-10", children: "Trouver un medecin" }), _jsx(ArrowRight, { size: 20, className: "relative z-10 transition-transform duration-500 group-hover:translate-x-2" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" })] }), _jsxs(Link, { to: "/how-it-works", className: "group inline-flex items-center justify-center gap-3 px-8 py-4 glass border-2 border-border hover:border-primary/50 rounded-2xl font-semibold transition-all duration-500 hover:bg-primary/5 hover:scale-[1.02]", children: [_jsx("span", { className: "p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:scale-110 transition-all duration-500", children: _jsx(Play, { size: 18, className: "text-primary group-hover:text-primary-foreground-current" }) }), "Comment ca marche"] })] }), _jsxs("div", { className: `flex flex-wrap items-center gap-8 pt-6 transition-all duration-1000 delay-700 ${isVisible
                                            ? "opacity-100 translate-y-0"
                                            : "opacity-0 translate-y-8"}`, children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex -space-x-4", children: ["Dr. A", "Dr. M", "Dr. S", "Dr. K"].map((name, i) => (_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold border-3 border-background shadow-lg hover:scale-110 hover:z-10 transition-transform duration-300", style: { animationDelay: `${i * 100}ms` }, children: name.split(" ")[1] }, i))) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-1", children: [[1, 2, 3, 4, 5].map((i) => (_jsx(Star, { size: 16, className: "fill-amber-400 text-amber-400" }, i))), _jsx("span", { className: "ml-2 font-semibold text-foreground", children: "4.9" })] }), _jsx("p", { className: "text-sm text-muted-foreground", children: "+15,000 patients satisfaits" })] })] }), _jsxs("div", { className: "hidden sm:flex items-center gap-3 px-4 py-2 glass rounded-xl", children: [_jsx(Shield, { size: 20, className: "text-green-500" }), _jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "Donnees 100% securisees" })] })] })] }), _jsx("div", { className: `relative transition-all duration-1000 delay-300 ${isVisible
                                    ? "opacity-100 translate-x-0"
                                    : "opacity-0 translate-x-20"}`, children: _jsxs("div", { className: "relative perspective-1000", style: {
                                        transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`,
                                    }, children: [_jsxs("div", { className: "relative glass rounded-[2rem] p-8 shadow-2xl border border-white/30 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 overflow-hidden", children: _jsx("div", { className: "absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent", style: { animationDuration: "3s" } }) }), _jsxs("div", { className: "relative flex items-center justify-center mb-8", children: [_jsx("div", { className: "absolute w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" }), _jsx("div", { className: "relative w-44 h-44 animate-float", children: _jsx("img", { src: "/images/logo.png", alt: "MegaCare", className: "object-contain drop-shadow-2xl" }) })] }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: [
                                                        {
                                                            value: "800+",
                                                            label: "Medecins",
                                                            color: "from-primary to-blue-500",
                                                        },
                                                        {
                                                            value: "24/7",
                                                            label: "Disponible",
                                                            color: "from-accent to-teal-400",
                                                        },
                                                        {
                                                            value: "98%",
                                                            label: "Satisfaction",
                                                            color: "from-green-500 to-emerald-400",
                                                        },
                                                    ].map((stat, i) => (_jsxs("div", { className: "relative p-4 bg-background/60 rounded-2xl text-center group hover:scale-105 transition-transform duration-300", children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300` }), _jsx("p", { className: `text-2xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`, children: stat.value }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: stat.label })] }, i))) })] }), _jsx("div", { className: "absolute -left-12 top-1/4 glass p-4 rounded-2xl shadow-xl animate-float delay-200 hover:scale-105 transition-transform duration-300", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2.5 bg-green-500/20 rounded-xl", children: _jsx(CheckCircle, { size: 22, className: "text-green-500" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sm", children: "Consultation confirmee" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Dr. Amira - 14:00" })] })] }) }), _jsx("div", { className: "absolute -right-8 top-1/3 glass p-4 rounded-2xl shadow-xl animate-float delay-500 hover:scale-105 transition-transform duration-300", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2.5 bg-primary/20 rounded-xl", children: _jsx(Video, { size: 22, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sm", children: "Teleconsultation" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "En cours..." })] })] }) }), _jsx("div", { className: "absolute -right-4 bottom-1/4 glass p-4 rounded-2xl shadow-xl animate-float delay-700 hover:scale-105 transition-transform duration-300", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "p-2.5 bg-accent/20 rounded-xl animate-pulse", children: _jsx(Pill, { size: 22, className: "text-accent" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sm", children: "Ordonnance prete" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Pr\u00EAte pour retrait" })] })] }) }), _jsx("div", { className: "absolute inset-0 pointer-events-none", children: _jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full animate-orbit opacity-50" }) })] }) })] }), _jsxs("div", { className: `absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [_jsx("span", { className: "text-xs text-muted-foreground font-medium", children: "Decouvrir" }), _jsx("div", { className: "w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2", children: _jsx("div", { className: "w-1.5 h-3 bg-primary rounded-full animate-bounce" }) })] })] })] }));
}
// Partners Section
function PartnersSection() {
    const partners = [
        "Hopital Charles Nicolle",
        "Clinique Taoufik",
        "Institut Pasteur",
        "CHU Mongi Slim",
        "Clinique El Amen",
        "Hospital Habib Thameur",
    ];
    return (_jsxs("section", { className: "py-12 border-y border-border/50 bg-secondary/30 overflow-hidden", children: [_jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("p", { className: "text-center text-sm font-medium text-muted-foreground mb-8", children: "Ils nous font confiance" }), _jsx("div", { className: "relative", children: _jsx("div", { className: "flex animate-scroll", children: [...partners, ...partners].map((partner, i) => (_jsx("div", { className: "flex-shrink-0 mx-12 px-6 py-3 glass rounded-xl text-muted-foreground font-medium hover:text-primary hover:scale-105 transition-all duration-300", children: partner }, i))) }) })] }), _jsx("style", { children: `
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      ` })] }));
}
// Stats Section with Animated Counters
function StatsSection() {
    const { ref, isInView } = useInView();
    const stats = [
        { end: 15000, suffix: "+", label: "Patients actifs", icon: Users },
        { end: 800, suffix: "+", label: "Medecins certifies", icon: Stethoscope },
        { end: 200, suffix: "+", label: "Pharmacies partenaires", icon: Pill },
        { end: 98, suffix: "%", label: "Taux de satisfaction", icon: Award },
    ];
    return (_jsxs("section", { ref: ref, className: "relative py-24 bg-foreground text-background overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" }), _jsx("div", { className: "absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" }), _jsx("div", { className: "absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" }), _jsx("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12", children: stats.map((stat, idx) => (_jsx(StatCard, { stat: stat, index: idx, isInView: isInView }, idx))) }) })] }));
}
function StatCard({ stat, index, isInView, }) {
    const { count, start } = useCounter(stat.end, 2000, true);
    const Icon = stat.icon;
    useEffect(() => {
        if (isInView) {
            const timer = setTimeout(() => start(), index * 150);
            return () => clearTimeout(timer);
        }
    }, [isInView, index, start]);
    return (_jsxs("div", { className: `text-center group transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, style: { transitionDelay: `${index * 150}ms` }, children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-background/10 group-hover:bg-background/20 group-hover:scale-110 transition-all duration-300", children: _jsx(Icon, { size: 28, className: "text-accent" }) }), _jsxs("p", { className: "text-5xl sm:text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-r from-background via-accent to-background bg-clip-text text-transparent", children: [count.toLocaleString(), stat.suffix] }), _jsx("p", { className: "text-background/60 text-sm sm:text-base font-medium", children: stat.label })] }));
}
function ServicesSection() {
    const { ref, isInView } = useInView();
    const [activeService, setActiveService] = useState(null);
    const services = [
        {
            icon: Video,
            title: "Teleconsultation",
            description: "Consultez un medecin en video depuis chez vous",
            color: "from-blue-500 to-cyan-500",
            link: "/consultation",
            modalTitle: "Teleconsultation Video",
            modalBody: "Notre service de teleconsultation vous connecte en temps reel avec des medecins certifies via une plateforme video securisee. Recevez un diagnostic, une ordonnance et un suivi — sans quitter votre domicile.",
            features: [
                "Rendez-vous disponibles 7j/7, 24h/24",
                "Ordonnances electroniques delivrees instantanement",
                "Medecins generalistes et specialistes",
                "Connexion chiffree de bout en bout",
            ],
        },
        {
            icon: Pill,
            title: "Pharmacie en ligne",
            description: "Commandez vos medicaments et recevez-les chez vous",
            color: "from-green-500 to-emerald-500",
            link: "/pharmacy",
            modalTitle: "Pharmacie Numerique",
            modalBody: "Achetez vos medicaments en toute simplicite depuis notre pharmacie en ligne partenaire. Importez votre ordonnance, choisissez votre pharmacie et retirez votre commande en quelques heures.",
            features: [
                "Catalogue de plus de 5 000 references",
                "Scan et validation d'ordonnance integres",
                "Retrait rapide en pharmacie",
                "Rappels de prise de medicaments",
            ],
        },
        {
            icon: FileText,
            title: "Dossier medical",
            description: "Acces securise a votre historique medical complet",
            color: "from-purple-500 to-pink-500",
            link: "/dashboard/medical-records",
            modalTitle: "Dossier Medical Numerique",
            modalBody: "Centralisez l'ensemble de votre historique de sante dans un dossier medical personnel securise. Partagez vos donnees avec vos medecins en un clic pour des consultations plus efficaces.",
            features: [
                "Stockage des ordonnances, analyses et radios",
                "Partage securise avec vos praticiens",
                "Suivi de vos constantes et vaccinations",
                "Conformite RGPD et donnees hebergees en Tunisie",
            ],
        },
    ];
    return (_jsxs(_Fragment, { children: [_jsx("section", { ref: ref, className: "py-24 bg-background", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("span", { className: `inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${isInView
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"}`, children: "Nos Services" }), _jsxs("h2", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${isInView
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"}`, children: ["Une solution complete pour", _jsxs("span", { className: "gradient-text block sm:inline", children: [" ", "votre sante"] })] })] }), _jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-6", children: services.map((service, idx) => (_jsx(ServiceCard, { service: service, index: idx, isInView: isInView, onClick: () => setActiveService(service) }, idx))) })] }) }), activeService && (_jsx(ServiceModal, { service: activeService, onClose: () => setActiveService(null) }))] }));
}
function ServiceCard({ service, index, isInView, onClick, }) {
    const Icon = service.icon;
    return (_jsxs("button", { onClick: onClick, className: `group relative p-8 bg-card rounded-3xl border border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] hover:border-transparent text-left w-full cursor-pointer ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, style: { transitionDelay: `${index * 100}ms` }, children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500` }), _jsx("div", { className: `relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${service.color} p-0.5`, children: _jsxs("div", { className: "w-full h-full bg-card rounded-[14px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-500", children: [_jsx(Icon, { size: 28, className: `text-transparent bg-gradient-to-br ${service.color} bg-clip-text group-hover:text-white transition-colors duration-500` }), _jsx(Icon, { size: 28, className: `absolute bg-gradient-to-br ${service.color} bg-clip-text [-webkit-text-fill-color:transparent] group-hover:text-white transition-all duration-500` })] }) }), _jsx("h3", { className: "text-xl font-bold text-foreground mb-2 group-hover:text-foreground transition-colors duration-300", children: service.title }), _jsx("p", { className: "text-muted-foreground text-sm leading-relaxed mb-4", children: service.description }), _jsxs("div", { className: "flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-4 transition-all duration-300", children: ["En savoir plus", _jsx(ChevronRight, { size: 16, className: "group-hover:translate-x-1 transition-transform duration-300" })] })] }));
}
function ServiceModal({ service, onClose, }) {
    const Icon = service.icon;
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(t);
    }, []);
    useEffect(() => {
        const handler = (e) => {
            if (e.key === "Escape")
                onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);
    return (_jsx("div", { className: `fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-300 ${visible ? "bg-black/60" : "bg-black/0"}`, onClick: onClose, children: _jsxs("div", { className: `relative bg-card rounded-3xl border border-border shadow-2xl max-w-lg w-full p-8 transition-all duration-300 ease-out ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}`, onClick: (e) => e.stopPropagation(), children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200", "aria-label": "Fermer", children: _jsx(X, { size: 20 }) }), _jsx("div", { className: `w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center`, children: _jsx(Icon, { size: 28, className: "text-white" }) }), _jsx("h3", { className: "text-2xl font-bold text-foreground mb-3", children: service.modalTitle }), _jsx("p", { className: "text-muted-foreground leading-relaxed mb-6", children: service.modalBody }), _jsx("ul", { className: "space-y-3 mb-8", children: service.features.map((feat, i) => (_jsxs("li", { className: "flex items-start gap-3 text-sm text-foreground", children: [_jsx(CheckCircle, { size: 16, className: "text-primary mt-0.5 shrink-0" }), feat] }, i))) }), _jsxs(Link, { to: service.link, className: `inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${service.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity duration-200`, onClick: onClose, children: ["Acceder au service", _jsx(ChevronRight, { size: 16 })] })] }) }));
}
// Specialties Section
function SpecialtiesSection() {
    const { ref, isInView } = useInView();
    const specialties = [
        {
            name: "Cardiologie",
            icon: Heart,
            doctors: 24,
            color: "bg-red-500/10 text-red-500 hover:bg-red-500",
        },
        {
            name: "Dermatologie",
            icon: Activity,
            doctors: 18,
            color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500",
        },
        {
            name: "Pediatrie",
            icon: Baby,
            doctors: 22,
            color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500",
        },
        {
            name: "Neurologie",
            icon: Brain,
            doctors: 15,
            color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500",
        },
        {
            name: "Ophtalmologie",
            icon: Eye,
            doctors: 18,
            color: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500",
        },
        {
            name: "Orthopedie",
            icon: Bone,
            doctors: 19,
            color: "bg-orange-500/10 text-orange-500 hover:bg-orange-500",
        },
        {
            name: "Medecine Generale",
            icon: Stethoscope,
            doctors: 45,
            color: "bg-green-500/10 text-green-500 hover:bg-green-500",
        },
        {
            name: "Psychiatrie",
            icon: Brain,
            doctors: 14,
            color: "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500",
        },
    ];
    return (_jsx("section", { ref: ref, className: "py-24 bg-secondary/30", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16", children: [_jsxs("div", { children: [_jsx("span", { className: `inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${isInView
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"}`, children: "Specialites Medicales" }), _jsxs("h2", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance transition-all duration-700 delay-100 ${isInView
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"}`, children: ["Trouvez le specialiste", _jsx("span", { className: "gradient-text", children: " qu'il vous faut" })] })] }), _jsxs(Link, { to: "/doctors", className: `group inline-flex items-center gap-2 text-primary hover:text-accent font-semibold transition-all duration-500 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`, children: ["Voir toutes les specialites", _jsx(ArrowRight, { size: 18, className: "transition-transform duration-300 group-hover:translate-x-2" })] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6", children: specialties.map((specialty, idx) => (_jsx(SpecialtyCard, { specialty: specialty, index: idx, isInView: isInView }, idx))) })] }) }));
}
function SpecialtyCard({ specialty, index, isInView, }) {
    const Icon = specialty.icon;
    return (_jsxs(Link, { to: `/doctors?specialty=${specialty.name}`, className: `group p-6 bg-card rounded-2xl border border-border hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, style: { transitionDelay: `${index * 75}ms` }, children: [_jsx("div", { className: `w-14 h-14 ${specialty.color.split(" ").slice(0, 2).join(" ")} rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:text-white ${specialty.color.split(" ")[2]}`, children: _jsx(Icon, { size: 26 }) }), _jsx("h3", { className: "font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-1", children: specialty.name }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [specialty.doctors, " medecins disponibles"] })] }));
}
// Features Section
function FeaturesSection() {
    const { ref, isInView } = useInView();
    const features = [
        {
            title: "Consultations securisees",
            description: "Teleconsultations chiffrees de bout en bout avec des medecins certifies par l'Ordre des Medecins tunisiens.",
            icon: Shield,
            color: "from-primary to-blue-600",
        },
        {
            title: "Disponible 24/7",
            description: "Prenez rendez-vous a tout moment, meme en urgence. Notre equipe medicale est toujours disponible pour vous.",
            icon: Clock,
            color: "from-accent to-teal-400",
        },
        {
            title: "Dossier medical numerique",
            description: "Acces securise a toutes vos donnees medicales, ordonnances et historique de consultations en un seul endroit.",
            icon: CheckCircle,
            color: "from-green-500 to-emerald-500",
        },
        {
            title: "Retrait express en pharmacie",
            description: "Commandez en ligne et retirez vos médicaments en pharmacie en moins d'une heure dans les grandes villes tunisiennes.",
            icon: Zap,
            color: "from-orange-500 to-amber-500",
        },
    ];
    return (_jsxs("section", { ref: ref, className: "py-24 bg-background relative overflow-hidden", children: [_jsx("div", { className: "absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("span", { className: `inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: "Pourquoi MegaCare" }), _jsxs("h2", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: ["L'excellence medicale", _jsx("span", { className: "gradient-text", children: " a portee de main" })] }), _jsx("p", { className: `text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: "Une plateforme complete concue pour simplifier votre parcours de soins" })] }), _jsx("div", { className: "grid md:grid-cols-2 gap-6 lg:gap-8", children: features.map((feature, idx) => (_jsx(FeatureCard, { feature: feature, index: idx, isInView: isInView }, idx))) })] })] }));
}
function FeatureCard({ feature, index, isInView, }) {
    const Icon = feature.icon;
    return (_jsxs("div", { className: `group relative bg-card rounded-3xl p-8 lg:p-10 border border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-transparent hover:scale-[1.01] ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, style: { transitionDelay: `${index * 150}ms` }, children: [_jsx("div", { className: `absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500` }), _jsxs("div", { className: "relative flex flex-col sm:flex-row gap-6", children: [_jsx("div", { className: `flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`, children: _jsx(Icon, { size: 30, className: "text-white" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300", children: feature.title }), _jsx("p", { className: "text-muted-foreground leading-relaxed", children: feature.description })] })] })] }));
}
// How It Works Section
function HowItWorksSection() {
    const { ref, isInView } = useInView();
    const steps = [
        {
            step: "01",
            title: "Creez votre compte",
            description: "Inscription rapide et gratuite en quelques secondes",
            icon: MousePointer,
        },
        {
            step: "02",
            title: "Choisissez un medecin",
            description: "Parcourez les profils et selectionnez votre specialiste",
            icon: Users,
        },
        {
            step: "03",
            title: "Reservez votre RDV",
            description: "Choisissez le creneau qui vous convient le mieux",
            icon: Clock,
        },
        {
            step: "04",
            title: "Consultez en ligne",
            description: "Teleconsultation video HD securisee depuis chez vous",
            icon: Video,
        },
    ];
    return (_jsxs("section", { ref: ref, className: "py-24 bg-secondary/30 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("span", { className: `inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: "Simple et Rapide" }), _jsxs("h2", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: ["Comment ca", _jsx("span", { className: "gradient-text", children: " marche ?" })] }), _jsx("p", { className: `text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: "4 etapes simples pour acceder aux meilleurs soins de sante" })] }), _jsxs("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative", children: [_jsx("div", { className: "hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary" }), steps.map((step, idx) => (_jsx(StepCard, { step: step, index: idx, isInView: isInView, isLast: idx === steps.length - 1 }, idx)))] })] })] }));
}
function StepCard({ step, index, isInView, isLast, }) {
    const Icon = step.icon;
    return (_jsxs("div", { className: `relative text-center transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, style: { transitionDelay: `${index * 150}ms` }, children: [_jsxs("div", { className: "relative inline-block mb-6", children: [_jsx("div", { className: "w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-xl shadow-primary/25 group-hover:scale-110 transition-transform duration-300 rotate-3 hover:rotate-0", children: step.step }), _jsx("div", { className: "absolute -bottom-2 -right-2 w-10 h-10 bg-card rounded-xl border border-border flex items-center justify-center shadow-lg", children: _jsx(Icon, { size: 18, className: "text-primary" }) })] }), _jsx("h3", { className: "font-bold text-lg text-foreground mb-2", children: step.title }), _jsx("p", { className: "text-muted-foreground text-sm", children: step.description })] }));
}
// Testimonials Section
function TestimonialsSection() {
    const { ref, isInView } = useInView();
    const testimonials = [
        {
            name: "Fatima Ben Ali",
            role: "Patiente",
            text: "MegaCare a change ma facon de gerer ma sante. Plus besoin de perdre des heures a l'hopital pour une simple consultation. Tout est rapide et efficace!",
            rating: 5,
            avatar: "F",
            location: "Tunis",
        },
        {
            name: "Dr. Amira Mansouri",
            role: "Cardiologue",
            text: "Interface professionnelle et intuitive. Mes patients sont ravis de pouvoir me consulter depuis chez eux. Une revolution dans la pratique medicale!",
            rating: 5,
            avatar: "A",
            location: "Sfax",
        },
        {
            name: "Mohamed Karim",
            role: "Patient",
            text: "Service impeccable, pharmaciens compétents et retrait rapide. Ma commande était prête en moins d'une heure. Je recommande vivement !",
            rating: 5,
            avatar: "M",
            location: "Sousse",
        },
    ];
    return (_jsxs("section", { ref: ref, className: "py-24 bg-background relative overflow-hidden", children: [_jsxs("div", { className: "absolute inset-0", children: [_jsx("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" }), _jsx("div", { className: "absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" })] }), _jsxs("div", { className: "relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("span", { className: `inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: "Temoignages" }), _jsxs("h2", { className: `text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: ["Ce que disent", _jsx("span", { className: "gradient-text", children: " nos utilisateurs" })] }), _jsx("p", { className: `text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: "Rejoignez des milliers de patients et medecins satisfaits" })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-8", children: testimonials.map((testimonial, idx) => (_jsx(TestimonialCard, { testimonial: testimonial, index: idx, isInView: isInView }, idx))) })] })] }));
}
function TestimonialCard({ testimonial, index, isInView, }) {
    return (_jsxs("div", { className: `group relative bg-card rounded-3xl p-8 border border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-primary/20 hover:scale-[1.02] ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`, style: { transitionDelay: `${index * 150}ms` }, children: [_jsx("div", { className: "absolute top-6 right-6 text-8xl font-serif text-primary/10 leading-none group-hover:text-primary/20 transition-colors duration-300", children: "\"" }), _jsx("div", { className: "flex gap-1 mb-6", children: [...Array(testimonial.rating)].map((_, i) => (_jsx(Star, { size: 18, className: "fill-amber-400 text-amber-400" }, i))) }), _jsxs("p", { className: "text-foreground mb-8 leading-relaxed relative z-10", children: ["\"", testimonial.text, "\""] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300", children: testimonial.avatar }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: testimonial.name }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [testimonial.role, " - ", testimonial.location] })] })] })] }));
}
// CTA Section
function CTASection() {
    const { ref, isInView } = useInView();
    return (_jsxs("section", { ref: ref, className: "relative py-32 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" }), _jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" }), _jsx("div", { className: "absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-[100px] animate-blob" }), _jsx("div", { className: "absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-[100px] animate-blob delay-300" }), _jsx("div", { className: "absolute inset-0 overflow-hidden", children: [
                    { left: 10, top: 15, duration: 6, delay: 0.2 },
                    { left: 25, top: 75, duration: 8, delay: 1.0 },
                    { left: 40, top: 30, duration: 7, delay: 0.5 },
                    { left: 55, top: 85, duration: 9, delay: 1.5 },
                    { left: 70, top: 20, duration: 6.5, delay: 0.8 },
                    { left: 85, top: 60, duration: 7.5, delay: 1.2 },
                    { left: 15, top: 45, duration: 8.5, delay: 0.3 },
                    { left: 60, top: 70, duration: 6, delay: 1.8 },
                    { left: 90, top: 40, duration: 7, delay: 0.6 },
                    { left: 35, top: 90, duration: 8, delay: 1.4 },
                ].map((p, i) => (_jsx("div", { className: "absolute w-3 h-3 bg-white/20 rounded-full", style: {
                        left: `${p.left}%`,
                        top: `${p.top}%`,
                        animation: `float ${p.duration}s ease-in-out infinite`,
                        animationDelay: `${p.delay}s`,
                    } }, i))) }), _jsxs("div", { className: "relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center", children: [_jsxs("div", { className: `inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-sm transition-all duration-700 ${isInView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`, children: [_jsxs("span", { className: "relative flex h-3 w-3", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" }), _jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-white" })] }), _jsx("span", { className: "text-sm font-semibold text-primary-foreground", children: "Inscription 100% gratuite" }), _jsx(Sparkles, { size: 16, className: "text-white/80" })] }), _jsxs("h2", { className: `text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 text-balance transition-all duration-700 delay-100 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: ["Pret a prendre soin", _jsx("span", { className: "block", children: "de votre sante?" })] }), _jsx("p", { className: `text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: "Rejoignez MegaCare et beneficiez d'un acces illimite aux meilleurs professionnels de sante tunisiens." }), _jsxs("div", { className: `flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [_jsxs(Link, { to: "/register", className: "group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-white/30 hover:scale-[1.03]", children: ["Commencer gratuitement", _jsx(ArrowRight, { size: 22, className: "transition-transform duration-500 group-hover:translate-x-2" })] }), _jsx(Link, { to: "/how-it-works", className: "inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-white/30 text-primary-foreground rounded-2xl font-bold text-lg transition-all duration-500 hover:bg-white/10 hover:border-white/50 hover:scale-[1.03]", children: "En savoir plus" })] }), _jsxs("div", { className: `mt-12 flex flex-wrap items-center justify-center gap-6 text-primary-foreground/60 text-sm transition-all duration-700 delay-500 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Shield, { size: 18 }), _jsx("span", { children: "Donnees securisees" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { size: 18 }), _jsx("span", { children: "Sans engagement" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { size: 18 }), _jsx("span", { children: "Support 24/7" })] })] })] })] }));
}
