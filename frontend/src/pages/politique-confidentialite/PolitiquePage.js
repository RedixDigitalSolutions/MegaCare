import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
const sections = [
    {
        id: "responsable",
        title: "1. Responsable du traitement",
        content: [
            "Le responsable du traitement de vos données personnelles est la société MegaCare, dont le siège social est situé Centre Urbain Nord, 1082 Tunis, Tunisie. Vous pouvez contacter notre Délégué à la Protection des Données (DPD) à l'adresse : dpo@megacare.tn.",
            "MegaCare s'engage à traiter vos données personnelles dans le respect de la loi tunisienne n°2004-63 du 27 juillet 2004 portant sur la protection des données à caractère personnel et du Règlement Général sur la Protection des Données (RGPD) pour les utilisateurs européens.",
        ],
    },
    {
        id: "donnees-collectees",
        title: "2. Données personnelles collectées",
        content: [
            "Dans le cadre de l'utilisation de la Plateforme, MegaCare peut collecter les catégories de données suivantes :",
            "Données d'identification : nom, prénom, date de naissance, numéro de téléphone, adresse e-mail, photographie de profil.",
            "Données de santé (catégories particulières) : antécédents médicaux, ordonnances, résultats d'analyses, compte-rendus de consultations, traitements en cours. Ces données font l'objet d'une protection renforcée.",
            "Données de connexion et d'utilisation : adresse IP, type de navigateur, pages visitées, date et heure de connexion, cookies.",
            "Données de paiement : informations de transaction (non les coordonnées bancaires complètes, gérées par nos prestataires certifiés).",
        ],
    },
    {
        id: "finalites",
        title: "3. Finalités du traitement",
        content: [
            "Vos données personnelles sont collectées pour les finalités suivantes :",
            "Fourniture des services de la Plateforme : création et gestion de votre compte, mise en relation avec des professionnels de santé, gestion des rendez-vous et des consultations en ligne.",
            "Gestion du dossier médical personnel : stockage sécurisé de vos informations de santé, partage avec les professionnels de santé que vous autorisez.",
            "Relation client et support : réponse à vos demandes, traitement des réclamations, envoi de notifications liées à vos consultations.",
            "Amélioration des services : analyses statistiques anonymisées pour améliorer l'expérience utilisateur et les fonctionnalités de la Plateforme.",
            "Obligations légales : conservation des données requises par la réglementation médicale et fiscale en vigueur.",
        ],
    },
    {
        id: "base-legale",
        title: "4. Base légale du traitement",
        content: [
            "Le traitement de vos données est fondé sur les bases légales suivantes :",
            "Exécution du contrat : le traitement est nécessaire à la fourniture des services auxquels vous avez souscrit.",
            "Consentement explicite : pour le traitement de vos données de santé (catégories particulières), nous recueillons votre consentement explicite lors de l'inscription et lors de chaque partage avec un professionnel de santé.",
            "Obligation légale : certains traitements sont imposés par la réglementation médicale ou fiscale tunisienne.",
            "Intérêt légitime : amélioration et sécurisation de la Plateforme, prévention des fraudes.",
        ],
    },
    {
        id: "duree-conservation",
        title: "5. Durée de conservation",
        content: [
            "Vos données de compte et de profil sont conservées pendant toute la durée de votre inscription sur la Plateforme et supprimées dans un délai de 30 jours suivant la clôture de votre compte.",
            "Vos données de santé sont conservées conformément aux obligations légales applicables aux dossiers médicaux (10 ans à compter de la dernière consultation pour les dossiers adultes, jusqu'aux 28 ans du patient pour les mineurs).",
            "Les données de connexion et de navigation sont conservées pendant 12 mois, conformément aux obligations légales en matière de logs.",
        ],
    },
    {
        id: "partage",
        title: "6. Partage et destinataires des données",
        content: [
            "MegaCare ne vend jamais vos données personnelles à des tiers.",
            "Vos données peuvent être partagées avec : les professionnels de santé que vous consultez sur la Plateforme (uniquement avec votre consentement explicite) ; nos sous-traitants techniques (hébergeur, prestataire de paiement, service e-mail) liés par des clauses contractuelles de confidentialité strictes ; les autorités compétentes en cas d'obligation légale.",
            "Tout professionnel de santé accédant à votre dossier médical est soumis au secret médical et aux obligations déontologiques de sa profession.",
        ],
    },
    {
        id: "securite",
        title: "7. Sécurité des données",
        content: [
            "MegaCare met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, toute perte, destruction ou divulgation.",
            "Les communications entre votre navigateur et nos serveurs sont chiffrées via le protocole TLS (HTTPS). Les données de santé sont stockées avec un chiffrement AES-256 au repos.",
            "Nos serveurs sont hébergés dans des centres de données certifiés ISO 27001, situés en Tunisie ou au sein de l'Union Européenne.",
            "En cas de violation de données susceptible d'engendrer un risque pour vos droits, vous en serez informé dans les meilleurs délais conformément à la réglementation applicable.",
        ],
    },
    {
        id: "droits",
        title: "8. Vos droits",
        content: [
            "Conformément à la réglementation applicable, vous disposez des droits suivants sur vos données personnelles :",
            "Droit d'accès : obtenir la confirmation que vos données sont traitées et en recevoir une copie.",
            "Droit de rectification : corriger vos données inexactes ou incomplètes.",
            "Droit à l'effacement : demander la suppression de vos données dans les cas prévus par la loi.",
            "Droit à la limitation du traitement : demander la suspension du traitement de vos données.",
            "Droit à la portabilité : recevoir vos données dans un format structuré et lisible par machine.",
            "Droit d'opposition : vous opposer au traitement de vos données dans certaines situations.",
            "Pour exercer ces droits, contactez-nous à : dpo@megacare.tn. Nous nous engageons à répondre dans un délai d'un mois.",
        ],
    },
    {
        id: "cookies",
        title: "9. Cookies et traceurs",
        content: [
            "La Plateforme utilise des cookies pour assurer son bon fonctionnement (cookies techniques essentiels), mesurer l'audience de façon anonyme (cookies analytiques) et améliorer votre expérience.",
            "Lors de votre première visite, un bandeau vous informe de l'utilisation des cookies et vous permet de gérer vos préférences. Les cookies analytiques sont déposés uniquement avec votre consentement préalable.",
            "Vous pouvez à tout moment modifier vos préférences via les paramètres de votre navigateur ou notre gestionnaire de consentement.",
        ],
    },
    {
        id: "modifications",
        title: "10. Modifications de la politique",
        content: [
            "MegaCare se réserve le droit de modifier la présente politique de confidentialité à tout moment afin de refléter les évolutions législatives ou les changements de ses pratiques.",
            "Toute modification substantielle vous sera notifiée par e-mail au moins 15 jours avant son entrée en vigueur. La date de dernière mise à jour est indiquée en haut de cette page.",
        ],
    },
    {
        id: "reclamation",
        title: "11. Réclamation",
        content: [
            "Si vous estimez que le traitement de vos données par MegaCare ne respecte pas la réglementation applicable, vous avez le droit d'introduire une réclamation auprès de l'Instance Nationale de Protection des Données Personnelles (INPDP) en Tunisie.",
        ],
    },
];
export default function PolitiqueConfidentialitePage() {
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 pt-28 pb-20", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("div", { className: "inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-4", children: "Mise \u00E0 jour : mars 2026" }), _jsx("h1", { className: "text-4xl font-bold text-foreground mb-4", children: "Politique de confidentialit\u00E9" }), _jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mx-auto", children: "La confidentialit\u00E9 de vos donn\u00E9es, et notamment de vos donn\u00E9es de sant\u00E9, est au c\u0153ur de notre engagement. D\u00E9couvrez comment MegaCare les prot\u00E8ge." })] }), _jsxs("div", { className: "flex items-start gap-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 mb-10", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0", children: _jsx("svg", { className: "w-5 h-5 text-emerald-600 dark:text-emerald-400", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2, children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 01.17 11.89c.014.2.025.4.025.61 0 5.522 4.02 10.29 9.47 11.233C15.22 22.47 19.5 17.866 19.5 12c0-.2.01-.4.025-.61A11.955 11.955 0 0116.4 6a11.95 11.95 0 01-2.4-1.286z" }) }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-emerald-800 dark:text-emerald-300 mb-1", children: "Vos donn\u00E9es de sant\u00E9 ne sont jamais vendues" }), _jsx("p", { className: "text-sm text-emerald-700 dark:text-emerald-400", children: "MegaCare s'engage \u00E0 ne jamais vendre, louer ni partager vos donn\u00E9es personnelles ou de sant\u00E9 \u00E0 des fins commerciales. Vos informations m\u00E9dicales n'appartiennent qu'\u00E0 vous." })] })] }), _jsxs("nav", { className: "bg-muted/50 border border-border rounded-2xl p-6 mb-10", children: [_jsx("p", { className: "text-sm font-semibold text-foreground mb-3", children: "Table des mati\u00E8res" }), _jsx("ol", { className: "grid sm:grid-cols-2 gap-x-8 gap-y-1.5", children: sections.map((s) => (_jsx("li", { children: _jsx("a", { href: `#${s.id}`, className: "text-sm text-primary hover:underline", children: s.title }) }, s.id))) })] }), _jsx("div", { className: "space-y-10", children: sections.map((s) => (_jsxs("section", { id: s.id, className: "scroll-mt-28", children: [_jsx("h2", { className: "text-xl font-semibold text-foreground mb-4 border-b border-border pb-2", children: s.title }), _jsx("div", { className: "space-y-3", children: s.content.map((para, i) => (_jsx("p", { className: "text-muted-foreground leading-relaxed", children: para }, i))) })] }, s.id))) }), _jsxs("div", { className: "mt-14 p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center", children: [_jsxs("p", { className: "text-muted-foreground mb-4", children: ["Consultez \u00E9galement nos", " ", _jsx(Link, { to: "/conditions-utilisation", className: "text-primary font-medium hover:underline", children: "conditions d'utilisation" }), " ", "pour conna\u00EEtre les r\u00E8gles d'utilisation de la plateforme."] }), _jsx(Link, { to: "/register", className: "inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm", children: "Cr\u00E9er mon compte" })] })] }) }), _jsx(Footer, {})] }));
}
