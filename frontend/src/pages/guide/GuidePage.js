import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CheckCircle, Video, Calendar, FileText, Search, ShoppingCart, Truck, Shield, Lock, Award, CreditCard, ArrowRight, ChevronDown, Stethoscope, Pill, } from "lucide-react";
const consultationSteps = [
    {
        icon: _jsx(Award, { className: "w-6 h-6" }),
        title: "Créer votre compte",
        description: "Inscrivez-vous gratuitement en 2 minutes. Renseignez votre profil médical une seule fois.",
        color: "bg-blue-500",
    },
    {
        icon: _jsx(Search, { className: "w-6 h-6" }),
        title: "Choisir un médecin",
        description: "Parcourez nos médecins spécialistes certifiés et filtrez par spécialité, disponibilité et tarif.",
        color: "bg-indigo-500",
    },
    {
        icon: _jsx(Calendar, { className: "w-6 h-6" }),
        title: "Prendre rendez-vous",
        description: "Sélectionnez un créneau disponible en temps réel. Confirmation instantanée par e-mail et SMS.",
        color: "bg-violet-500",
    },
    {
        icon: _jsx(Video, { className: "w-6 h-6" }),
        title: "Consulter en vidéo",
        description: "Rejoignez la salle vidéo sécurisée depuis votre navigateur, sans installation requise.",
        color: "bg-purple-500",
    },
    {
        icon: _jsx(FileText, { className: "w-6 h-6" }),
        title: "Recevoir l'ordonnance",
        description: "Votre ordonnance numérique est disponible immédiatement dans votre espace personnel.",
        color: "bg-fuchsia-500",
    },
];
const pharmacySteps = [
    {
        icon: _jsx(Search, { className: "w-6 h-6" }),
        title: "Trouver un médicament",
        description: "Recherchez dans notre base de données complète. Comparez les prix entre pharmacies partenaires.",
        color: "bg-green-500",
    },
    {
        icon: _jsx(ShoppingCart, { className: "w-6 h-6" }),
        title: "Commander en ligne",
        description: "Ajoutez au panier, choisissez votre pharmacie et réglez en toute sécurité en quelques clics.",
        color: "bg-emerald-500",
    },
    {
        icon: _jsx(Truck, { className: "w-6 h-6" }),
        title: "Livraison rapide",
        description: "Recevez vos médicaments en 2 à 4 heures selon votre zone. Suivi en temps réel disponible.",
        color: "bg-teal-500",
    },
];
const doctorPricing = [
    {
        title: "Médecin Généraliste",
        price: 25,
        gradient: "from-blue-500 to-cyan-500",
        features: [
            "Consultation générale",
            "Ordonnance numérique",
            "Suivi 7 jours",
            "Accès dossier médical",
        ],
    },
    {
        title: "Spécialiste",
        price: 35,
        gradient: "from-violet-500 to-purple-500",
        highlighted: true,
        features: [
            "Consultation spécialisée",
            "Analyse approfondie",
            "Ordonnance numérique",
            "Suivi 14 jours",
            "Accès complet au dossier",
        ],
    },
    {
        title: "Super-spécialiste",
        price: 55,
        gradient: "from-rose-500 to-pink-500",
        features: [
            "Consultation d'expert",
            "Avis professionnel",
            "Ordonnance numérique",
            "Suivi 30 jours",
            "Rapport détaillé",
        ],
    },
];
const allFaqs = [
    {
        q: "La plateforme est-elle sécurisée ?",
        a: "Oui, MegaCare utilise le chiffrement de bout en bout (E2E) pour toutes les consultations et données médicales, conformément à la législation tunisienne.",
    },
    {
        q: "Comment se déroulent les consultations vidéo ?",
        a: "Les consultations se font en direct par vidéo HD. Vous recevrez un lien pour rejoindre la salle virtuelle 10 minutes avant votre rendez-vous, sans installation requise.",
    },
    {
        q: "Puis-je annuler mon rendez-vous ?",
        a: "Oui, vous pouvez annuler jusqu'à 24 heures avant la consultation sans frais. Au-delà, des frais d'annulation peuvent s'appliquer.",
    },
    {
        q: "Existe-t-il des abonnements mensuels ?",
        a: "Non, nous offrons uniquement la tarification à la consultation. Payez uniquement pour les consultations que vous utilisez.",
    },
    {
        q: "Y a-t-il des frais cachés ?",
        a: "Non, les tarifs affichés sont totaux. Vous voyez le prix exact avant de confirmer votre consultation.",
    },
    {
        q: "Quels sont les modes de paiement acceptés ?",
        a: "Nous acceptons le paiement par carte bancaire (Visa, Mastercard) via notre plateforme sécurisée.",
    },
    {
        q: "Ma prescription est-elle valide 24h/24 ?",
        a: "Oui, vos prescriptions numériques sont valides 24h/24 et peuvent être utilisées chez tout pharmacien partenaire.",
    },
    {
        q: "Puis-je obtenir un remboursement ?",
        a: "Remboursement garanti si vous n'êtes pas satisfait dans les 48 heures suivant votre consultation.",
    },
    {
        q: "Les ordonnances ont-elles un coût supplémentaire ?",
        a: "Non, les ordonnances numériques sont incluses dans le prix de la consultation.",
    },
];
const tabs = [
    {
        id: "comment",
        label: "Comment ça marche",
        icon: _jsx(Stethoscope, { className: "w-4 h-4" }),
    },
    { id: "tarifs", label: "Tarifs", icon: _jsx(CreditCard, { className: "w-4 h-4" }) },
    { id: "faq", label: "FAQ", icon: _jsx(ChevronDown, { className: "w-4 h-4" }) },
];
export default function GuidePage() {
    const [activeTab, setActiveTab] = useState("comment");
    const [openFaq, setOpenFaq] = useState(null);
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1 pt-24", children: [_jsxs("section", { className: "relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border py-16", children: [_jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [_jsx("div", { className: "absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" }), _jsx("div", { className: "absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" })] }), _jsxs("div", { className: "relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5", children: [_jsx("div", { className: "inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full", children: "Guide complet MegaCare" }), _jsx("h1", { className: "text-4xl sm:text-5xl font-bold text-foreground leading-tight", children: "Tout pour bien commencer" }), _jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "D\u00E9couvrez comment utiliser MegaCare, consultez nos tarifs transparents et trouvez les r\u00E9ponses \u00E0 vos questions." }), _jsxs("div", { className: "flex items-center justify-center gap-4 pt-2", children: [_jsxs(Link, { to: "/register", className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/25", children: ["Cr\u00E9er mon compte ", _jsx(ArrowRight, { className: "w-4 h-4" })] }), _jsx(Link, { to: "/doctors", className: "inline-flex items-center gap-2 border border-border text-foreground/80 font-semibold px-6 py-3 rounded-xl hover:bg-secondary/50 transition-colors", children: "Voir les m\u00E9decins" })] })] })] }), _jsx("div", { className: "sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border", children: _jsx("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 flex", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [tab.icon, _jsx("span", { className: "hidden sm:inline", children: tab.label }), _jsx("span", { className: "sm:hidden", children: tab.id === "comment"
                                            ? "Guide"
                                            : tab.id === "tarifs"
                                                ? "Tarifs"
                                                : "FAQ" })] }, tab.id))) }) }), activeTab === "comment" && (_jsxs("div", { className: "animate-fade-in", children: [_jsx("section", { className: "py-16 bg-background", children: _jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-10", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center", children: _jsx(Video, { className: "w-5 h-5 text-blue-500" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", children: "T\u00E9l\u00E9consultation m\u00E9dicale" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Consultez un m\u00E9decin depuis chez vous en quelques minutes" })] })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500 via-violet-500 to-fuchsia-500 hidden sm:block" }), _jsx("div", { className: "space-y-4", children: consultationSteps.map((step, i) => (_jsxs("div", { className: "flex gap-6 items-start group", children: [_jsx("div", { className: `relative z-10 shrink-0 w-12 h-12 rounded-xl ${step.color} text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`, children: step.icon }), _jsx("div", { className: "flex-1 bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300", children: _jsx("div", { className: "flex items-start justify-between gap-4", children: _jsxs("div", { children: [_jsx("div", { className: "flex items-center gap-2 mb-1", children: _jsxs("span", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider", children: ["\u00C9tape ", i + 1] }) }), _jsx("h3", { className: "text-lg font-semibold text-foreground", children: step.title }), _jsx("p", { className: "text-muted-foreground mt-1 text-sm leading-relaxed", children: step.description })] }) }) })] }, i))) })] })] }) }), _jsx("section", { className: "py-16 bg-secondary/30", children: _jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-10", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center", children: _jsx(Pill, { className: "w-5 h-5 text-green-500" }) }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Pharmacie en ligne" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Commandez vos m\u00E9dicaments avec livraison rapide" })] })] }), _jsx("div", { className: "grid sm:grid-cols-3 gap-6", children: pharmacySteps.map((step, i) => (_jsxs("div", { className: "group bg-card border border-border rounded-2xl p-6 hover:border-green-400/40 hover:shadow-lg transition-all duration-300", children: [_jsx("div", { className: `w-12 h-12 rounded-xl ${step.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`, children: step.icon }), _jsxs("div", { className: "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1", children: ["\u00C9tape ", i + 1] }), _jsx("h3", { className: "text-lg font-semibold text-foreground mb-2", children: step.title }), _jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: step.description })] }, i))) })] }) }), _jsx("section", { className: "py-16 bg-background", children: _jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h2", { className: "text-2xl font-bold text-foreground mb-8 text-center", children: "S\u00E9curit\u00E9 & confidentialit\u00E9" }), _jsx("div", { className: "grid sm:grid-cols-3 gap-6", children: [
                                                {
                                                    icon: _jsx(Lock, { className: "w-6 h-6" }),
                                                    color: "text-blue-500 bg-blue-500/10",
                                                    title: "Chiffrement E2E",
                                                    desc: "Toutes vos données sont chiffrées de bout en bout, de votre appareil à nos serveurs.",
                                                },
                                                {
                                                    icon: _jsx(Shield, { className: "w-6 h-6" }),
                                                    color: "text-emerald-500 bg-emerald-500/10",
                                                    title: "Données conformes",
                                                    desc: "Conformité avec la loi n°2004-63 tunisienne sur la protection des données personnelles.",
                                                },
                                                {
                                                    icon: _jsx(Award, { className: "w-6 h-6" }),
                                                    color: "text-violet-500 bg-violet-500/10",
                                                    title: "Médecins certifiés",
                                                    desc: "Tous nos médecins sont vérifiés, inscrits à l'Ordre des Médecins de Tunisie.",
                                                },
                                            ].map((item, i) => (_jsxs("div", { className: "bg-card border border-border rounded-2xl p-6 text-center space-y-3", children: [_jsx("div", { className: `w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto`, children: item.icon }), _jsx("h3", { className: "font-semibold text-foreground", children: item.title }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: item.desc })] }, i))) })] }) })] })), activeTab === "tarifs" && (_jsxs("div", { className: "animate-fade-in", children: [_jsx("section", { className: "py-16 bg-background", children: _jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-2", children: "Consultations m\u00E9dicales" }), _jsx("p", { className: "text-muted-foreground", children: "Tarifs pour une consultation vid\u00E9o de 30 minutes. Aucun abonnement requis." })] }), _jsx("div", { className: "grid md:grid-cols-3 gap-6", children: doctorPricing.map((plan, i) => (_jsxs("div", { className: `relative rounded-2xl border-2 p-8 space-y-6 transition-all duration-300 hover:shadow-xl ${plan.highlighted
                                                    ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg scale-[1.02]"
                                                    : "border-border hover:border-primary/40"}`, children: [plan.highlighted && (_jsx("div", { className: "absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap", children: "\u2B50 Le plus populaire" })), _jsxs("div", { children: [_jsx("div", { className: `inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${plan.gradient} text-white mb-3`, children: plan.title }), _jsxs("div", { className: "flex items-baseline gap-1 mt-2", children: [_jsx("span", { className: "text-5xl font-bold text-foreground", children: plan.price }), _jsx("span", { className: "text-muted-foreground text-lg", children: "DT" })] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "par consultation \u00B7 30 min" })] }), _jsx(Link, { to: "/doctors", className: `block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${plan.highlighted
                                                            ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/25"
                                                            : "border-2 border-border text-foreground hover:border-primary hover:text-primary"}`, children: "Prendre rendez-vous" }), _jsx("ul", { className: "space-y-2.5 border-t border-border pt-5", children: plan.features.map((f, j) => (_jsxs("li", { className: "flex items-center gap-2.5 text-sm", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-primary shrink-0" }), _jsx("span", { className: "text-foreground", children: f })] }, j))) })] }, i))) })] }) }), _jsx("section", { className: "py-16 bg-background", children: _jsx("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-card border border-border rounded-2xl p-8", children: [_jsx("h3", { className: "text-xl font-bold text-foreground mb-6", children: "Ce qui est inclus" }), _jsx("ul", { className: "space-y-3", children: [
                                                            "Consultation vidéo avec médecin certifié",
                                                            "Ordonnance numérique",
                                                            "Accès au dossier médical",
                                                            "Support client 24/7",
                                                            "Paiement sécurisé",
                                                            "Garantie de remboursement 48h",
                                                        ].map((item, i) => (_jsxs("li", { className: "flex items-center gap-3 text-sm", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-primary shrink-0" }), _jsx("span", { className: "text-foreground", children: item })] }, i))) })] }), _jsxs("div", { className: "bg-card border border-border rounded-2xl p-8", children: [_jsx("h3", { className: "text-xl font-bold text-foreground mb-6", children: "Moyens de paiement" }), _jsx("div", { className: "flex justify-center", children: _jsxs("div", { className: "border border-border rounded-xl p-6 text-center space-y-2 max-w-xs w-full hover:border-primary/30 transition-colors", children: [_jsx("div", { className: "text-3xl", children: "\uD83D\uDCB3" }), _jsx("p", { className: "text-sm font-medium text-foreground", children: "Carte bancaire" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Visa & Mastercard \u2014 paiement s\u00E9curis\u00E9" })] }) })] })] }) }) })] })), activeTab === "faq" && (_jsx("div", { className: "animate-fade-in", children: _jsx("section", { className: "py-16 bg-background", children: _jsxs("div", { className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl font-bold text-foreground mb-2", children: "Questions fr\u00E9quentes" }), _jsx("p", { className: "text-muted-foreground", children: "Tout ce que vous devez savoir sur MegaCare" })] }), _jsx("div", { className: "space-y-3", children: allFaqs.map((faq, i) => (_jsxs("div", { className: `border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? "border-primary/40 shadow-md" : "border-border"}`, children: [_jsxs("button", { onClick: () => setOpenFaq(openFaq === i ? null : i), className: "w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-secondary/30 transition-colors", children: [_jsx("span", { className: "font-semibold text-foreground text-sm sm:text-base", children: faq.q }), _jsx(ChevronDown, { className: `w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-primary" : ""}` })] }), openFaq === i && (_jsx("div", { className: "px-5 pb-5", children: _jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: faq.a }) }))] }, i))) })] }) }) })), _jsx("section", { className: "py-16 bg-gradient-to-r from-primary to-primary/80", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5", children: [_jsx("h2", { className: "text-3xl font-bold text-primary-foreground", children: "Pr\u00EAt \u00E0 commencer ?" }), _jsx("p", { className: "text-lg text-primary-foreground/90", children: "Cr\u00E9ez votre compte gratuit et acc\u00E9dez aux meilleurs m\u00E9decins tunisiens" }), _jsxs(Link, { to: "/register", className: "inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg", children: ["Cr\u00E9er mon compte gratuit ", _jsx(ArrowRight, { className: "w-4 h-4" })] })] }) })] }), _jsx(Footer, {})] }));
}
