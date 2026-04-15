import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
const sections = [
    {
        id: "objet",
        title: "1. Objet et champ d'application",
        content: [
            "Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme MegaCare, accessible à l'adresse megacare.tn, ainsi que de toutes les applications mobiles et services associés (ci-après « la Plateforme »).",
            "En créant un compte ou en utilisant la Plateforme, vous acceptez sans réserve les présentes CGU. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser la Plateforme.",
            "MegaCare se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication en ligne. Vous serez informé par e-mail de toute modification substantielle.",
        ],
    },
    {
        id: "inscription",
        title: "2. Inscription et compte utilisateur",
        content: [
            "L'accès à la Plateforme nécessite la création d'un compte personnel. Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription.",
            "Vous êtes seul responsable de la confidentialité de vos identifiants de connexion et de toutes les activités effectuées sous votre compte. Toute utilisation non autorisée de votre compte doit être immédiatement signalée à MegaCare.",
            "MegaCare se réserve le droit de suspendre ou de supprimer tout compte en cas de violation des présentes CGU, de fourniture d'informations inexactes ou d'utilisation frauduleuse de la Plateforme.",
        ],
    },
    {
        id: "services",
        title: "3. Description des services",
        content: [
            "MegaCare propose une plateforme de santé numérique permettant notamment : la mise en relation avec des professionnels de santé, la téléconsultation vidéo, la commande de médicaments auprès de pharmacies partenaires, la gestion du dossier médical personnel et la prise de rendez-vous en ligne.",
            "Les services de téléconsultation sont fournis par des médecins et professionnels de santé indépendants, dûment enregistrés conformément à la législation tunisienne. MegaCare agit en qualité d'intermédiaire technique et ne fournit pas elle-même d'actes médicaux.",
            "MegaCare ne garantit pas la disponibilité permanente et ininterrompue des services et ne saurait être tenue responsable des interruptions liées à des opérations de maintenance, à des défaillances techniques ou à des causes extérieures.",
        ],
    },
    {
        id: "obligations",
        title: "4. Obligations de l'utilisateur",
        content: [
            "Vous vous engagez à utiliser la Plateforme dans le strict respect des lois et réglementations en vigueur en Tunisie, ainsi que dans le respect des droits des tiers.",
            "Il est strictement interdit de : publier des contenus illicites, diffamatoires ou portant atteinte à la vie privée d'autrui ; tenter de contourner les mesures de sécurité de la Plateforme ; utiliser la Plateforme à des fins commerciales non autorisées ; usurper l'identité d'un tiers ou d'un professionnel de santé.",
            "Vous vous engagez à ne pas transmettre de virus informatiques, logiciels malveillants ou tout autre code nuisible susceptible d'altérer le fonctionnement de la Plateforme.",
        ],
    },
    {
        id: "tarification",
        title: "5. Tarification et paiement",
        content: [
            "Les tarifs des consultations médicales sont fixés librement par les professionnels de santé et sont affichés clairement avant toute confirmation de rendez-vous. MegaCare perçoit une commission sur les transactions réalisées via la Plateforme.",
            "Les paiements sont sécurisés et traités par des prestataires de paiement certifiés. MegaCare ne stocke pas vos données bancaires.",
            "En cas d'annulation d'une consultation, les conditions de remboursement sont précisées lors de la réservation et varient selon le professionnel de santé concerné.",
        ],
    },
    {
        id: "responsabilite",
        title: "6. Limitation de responsabilité",
        content: [
            "MegaCare ne saurait être tenue responsable des dommages directs ou indirects résultant de l'utilisation de la Plateforme, notamment des erreurs, omissions ou inexactitudes dans les informations médicales publiées par les professionnels de santé.",
            "Les informations de santé disponibles sur la Plateforme ont un caractère informatif et ne sauraient se substituer à un avis médical professionnel. En cas d'urgence médicale, contactez immédiatement le 190 (SAMU) ou le 1010 (secours).",
            "La responsabilité de MegaCare est limitée, dans tous les cas, au montant des sommes versées par l'utilisateur au cours des douze derniers mois précédant le litige.",
        ],
    },
    {
        id: "propriete",
        title: "7. Propriété intellectuelle",
        content: [
            "L'ensemble des éléments constituant la Plateforme (textes, images, logotypes, logiciels, bases de données, etc.) sont protégés par les droits de propriété intellectuelle et sont la propriété exclusive de MegaCare ou de ses partenaires.",
            "Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments de la Plateforme, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation préalable écrite de MegaCare.",
        ],
    },
    {
        id: "resiliation",
        title: "8. Résiliation",
        content: [
            "Vous pouvez à tout moment clôturer votre compte en contactant notre service client ou via les paramètres de votre compte. La clôture du compte entraîne la suppression de vos données personnelles, sous réserve des obligations légales de conservation.",
            "MegaCare se réserve le droit de résilier votre accès à la Plateforme sans préavis en cas de violation grave des présentes CGU.",
        ],
    },
    {
        id: "droit-applicable",
        title: "9. Droit applicable et juridiction",
        content: [
            "Les présentes CGU sont régies par le droit tunisien. En cas de litige relatif à l'interprétation ou à l'exécution des présentes CGU, les parties s'efforceront de trouver une solution amiable.",
            "À défaut de règlement amiable, tout litige sera soumis à la compétence exclusive des tribunaux de Tunis, Tunisie.",
        ],
    },
    {
        id: "contact",
        title: "10. Contact",
        content: [
            "Pour toute question relative aux présentes CGU, vous pouvez contacter MegaCare à l'adresse suivante : legal@megacare.tn ou par courrier à : MegaCare, Centre Urbain Nord, 1082 Tunis, Tunisie.",
        ],
    },
];
export default function ConditionsUtilisationPage() {
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 pt-28 pb-20", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("div", { className: "inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4", children: "Mise \u00E0 jour : mars 2026" }), _jsx("h1", { className: "text-4xl font-bold text-foreground mb-4", children: "Conditions d'utilisation" }), _jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "Veuillez lire attentivement ces conditions avant d'utiliser la plateforme MegaCare. En vous inscrivant, vous acceptez l'ensemble de ces termes." })] }), _jsxs("nav", { className: "bg-muted/50 border border-border rounded-2xl p-6 mb-10", children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: "Table des mati\u00E8res" }), _jsx("ol", { className: "grid sm:grid-cols-2 gap-x-8 gap-y-1.5", children: sections.map((s) => (_jsx("li", { children: _jsx("a", { href: `#${s.id}`, className: "text-sm text-primary hover:underline", children: s.title }) }, s.id))) })] }), _jsx("div", { className: "space-y-10", children: sections.map((s) => (_jsxs("section", { id: s.id, className: "scroll-mt-28", children: [_jsx("h2", { className: "text-xl font-semibold text-foreground mb-4 border-b border-border pb-2", children: s.title }), _jsx("div", { className: "space-y-3", children: s.content.map((para, i) => (_jsx("p", { className: "text-muted-foreground leading-relaxed", children: para }, i))) })] }, s.id))) }), _jsxs("div", { className: "mt-14 p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center", children: [_jsxs("p", { className: "text-muted-foreground mb-4", children: ["Consultez \u00E9galement notre", " ", _jsx(Link, { to: "/politique-confidentialite", className: "text-primary font-medium hover:underline", children: "politique de confidentialit\u00E9" }), " ", "pour comprendre comment nous traitons vos donn\u00E9es personnelles."] }), _jsx(Link, { to: "/register", className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm", children: "Cr\u00E9er mon compte" })] })] }) }), _jsx(Footer, {})] }));
}
