import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
const sections = [
    {
        id: "engagement",
        title: "1. Notre engagement envers l'accessibilité",
        content: [
            "MegaCare s'engage à rendre sa plateforme accessible à tous, y compris aux personnes en situation de handicap. Nous œuvrons en permanence à améliorer l'expérience utilisateur et à appliquer les normes d'accessibilité numérique reconnues.",
            "Notre objectif est de se conformer au niveau AA des Règles pour l'Accessibilité des Contenus Web (WCAG) 2.1 publiées par le World Wide Web Consortium (W3C).",
        ],
    },
    {
        id: "mesures",
        title: "2. Mesures prises pour garantir l'accessibilité",
        content: [
            "Nous avons intégré l'accessibilité à chaque étape de la conception de la plateforme :",
            "Compatibilité avec les lecteurs d'écran : les éléments interactifs disposent d'attributs ARIA et de descriptions textuelles appropriées.",
            "Navigation au clavier : l'intégralité du site est navigable sans souris, via la touche Tab et les raccourcis clavier standards.",
            "Contrastes de couleurs : les ratios de contraste des textes et éléments d'interface respectent les seuils WCAG 2.1 niveau AA.",
            "Textes alternatifs : toutes les images informatives sont dotées d'un attribut alt descriptif.",
            "Taille des polices : les textes sont redimensionnables jusqu'à 200 % sans perte de contenu ni de fonctionnalité.",
            "Formulaires accessibles : chaque champ de formulaire est associé à une étiquette visible et un message d'erreur explicite.",
        ],
    },
    {
        id: "technologies",
        title: "3. Technologies d'assistance prises en charge",
        content: [
            "MegaCare est conçue pour fonctionner avec les technologies d'assistance les plus répandues :",
            "Lecteurs d'écran : NVDA, JAWS, VoiceOver (macOS/iOS), TalkBack (Android).",
            "Navigateurs supportés : Chrome, Firefox, Safari, Edge (versions récentes).",
            "Systèmes d'exploitation : Windows, macOS, iOS, Android.",
        ],
    },
    {
        id: "limites",
        title: "4. Limitations connues",
        content: [
            "Malgré nos efforts, certaines parties de la plateforme peuvent présentrer des limitations d'accessibilité. Nous travaillons activement à les corriger :",
            "Certains contenus vidéo peuvent ne pas disposer encore de sous-titres synchronisés. Nous prévoyons de les ajouter progressivement.",
            "Quelques graphiques statistiques dans les tableaux de bord peuvent manquer de descriptions textuelles détaillées.",
            "Si vous rencontrez un problème d'accessibilité, nous vous encourageons à nous le signaler afin que nous puissions y remédier rapidement.",
        ],
    },
    {
        id: "contact",
        title: "5. Nous contacter",
        content: [
            "Si vous rencontrez des difficultés d'accessibilité sur MegaCare, ou si vous souhaitez formuler une demande d'adaptation, notre équipe est à votre disposition :",
            "Email : accessibilite@megacare.tn",
            "Téléphone : +216 12 345 678 (du lundi au vendredi, 8h–18h)",
            "Formulaire de contact disponible sur notre page d'aide.",
            "Nous nous engageons à répondre à toute demande relative à l'accessibilité dans un délai de 5 jours ouvrés.",
        ],
    },
    {
        id: "mise-a-jour",
        title: "6. Mise à jour de cette déclaration",
        content: [
            "Cette déclaration d'accessibilité a été établie en avril 2026. Elle est révisée régulièrement afin de refléter les améliorations apportées à la plateforme et les évolutions des normes applicables.",
        ],
    },
];
export default function AccessibilitePage() {
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 pt-28 pb-20", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("div", { className: "inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4", children: "Mise \u00E0 jour : avril 2026" }), _jsx("h1", { className: "text-4xl font-bold text-foreground mb-4", children: "Accessibilit\u00E9" }), _jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "MegaCare s'engage \u00E0 offrir une exp\u00E9rience num\u00E9rique inclusive, accessible \u00E0 toutes et \u00E0 tous, quelles que soient leurs capacit\u00E9s." })] }), _jsxs("div", { className: "flex items-start gap-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 mb-10", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-blue-600 dark:text-blue-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a14.957 14.957 0 01-3 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-blue-800 dark:text-blue-300 mb-1", children: "Conformit\u00E9 WCAG 2.1 niveau AA" }), _jsx("p", { className: "text-sm text-blue-700 dark:text-blue-400", children: "Nous \u0153uvrons en permanence pour que MegaCare respecte les standards d'accessibilit\u00E9 internationaux et offre une exp\u00E9rience optimale \u00E0 tous les utilisateurs." })] })] }), _jsxs("nav", { className: "bg-muted/50 border border-border rounded-2xl p-6 mb-10", children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: "Table des mati\u00E8res" }), _jsx("ol", { className: "grid sm:grid-cols-2 gap-x-8 gap-y-1.5", children: sections.map((s) => (_jsx("li", { children: _jsx("a", { href: `#${s.id}`, className: "text-sm text-primary hover:underline", children: s.title }) }, s.id))) })] }), _jsx("div", { className: "space-y-12", children: sections.map((s) => (_jsxs("section", { id: s.id, className: "scroll-mt-28", children: [_jsx("h2", { className: "text-xl font-bold text-foreground mb-4 border-b border-border pb-2", children: s.title }), _jsx("div", { className: "space-y-3", children: s.content.map((para, i) => (_jsx("p", { className: "text-muted-foreground leading-relaxed", children: para }, i))) })] }, s.id))) }), _jsx("div", { className: "mt-14 p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center", children: _jsxs("p", { className: "text-muted-foreground mb-4", children: ["Consultez \u00E9galement notre", " ", _jsx(Link, { to: "/politique-confidentialite", className: "text-primary font-medium hover:underline", children: "politique de confidentialit\u00E9" }), " ", "pour comprendre comment nous prot\u00E9geons vos donn\u00E9es personnelles."] }) })] }) }), _jsx(Footer, {})] }));
}
