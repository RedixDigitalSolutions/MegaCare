
import { useState } from "react";
import { Link } from 'react-router-dom';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  CheckCircle,
  Video,
  Calendar,
  FileText,
  Search,
  ShoppingCart,
  Truck,
  Shield,
  Lock,
  Award,
  CreditCard,
  ArrowRight,
  ChevronDown,
  Stethoscope,
  Pill,
} from "lucide-react";

type Tab = "comment" | "tarifs" | "faq";

const consultationSteps = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Créer votre compte",
    description:
      "Inscrivez-vous gratuitement en 2 minutes. Renseignez votre profil médical une seule fois.",
    color: "bg-blue-500",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Choisir un médecin",
    description:
      "Parcourez nos médecins spécialistes certifiés et filtrez par spécialité, disponibilité et tarif.",
    color: "bg-indigo-500",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Prendre rendez-vous",
    description:
      "Sélectionnez un créneau disponible en temps réel. Confirmation instantanée par e-mail et SMS.",
    color: "bg-violet-500",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Consulter en vidéo",
    description:
      "Rejoignez la salle vidéo sécurisée depuis votre navigateur, sans installation requise.",
    color: "bg-purple-500",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Recevoir l'ordonnance",
    description:
      "Votre ordonnance numérique est disponible immédiatement dans votre espace personnel.",
    color: "bg-fuchsia-500",
  },
];

const pharmacySteps = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Trouver un médicament",
    description:
      "Recherchez dans notre base de données complète. Comparez les prix entre pharmacies partenaires.",
    color: "bg-green-500",
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    title: "Commander en ligne",
    description:
      "Ajoutez au panier, choisissez votre pharmacie et réglez en toute sécurité en quelques clics.",
    color: "bg-emerald-500",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Livraison rapide",
    description:
      "Recevez vos médicaments en 2 à 4 heures selon votre zone. Suivi en temps réel disponible.",
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

const pharmacyPricing = [
  { name: "Livraison standard", price: 5, delay: "24 – 48 heures", icon: "📦" },
  {
    name: "Livraison express",
    price: 8,
    delay: "Livré aujourd'hui",
    icon: "⚡",
  },
  { name: "Retrait pharmacie", price: 0, delay: "Prêt en 1 heure", icon: "🏪" },
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
    a: "Nous acceptons Flouci, Konnect, virement bancaire et paiement à la livraison pour les commandes pharmacie.",
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

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "comment",
    label: "Comment ça marche",
    icon: <Stethoscope className="w-4 h-4" />,
  },
  { id: "tarifs", label: "Tarifs", icon: <CreditCard className="w-4 h-4" /> },
  { id: "faq", label: "FAQ", icon: <ChevronDown className="w-4 h-4" /> },
];

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<Tab>("comment");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10 border-b border-border py-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
              Guide complet MegaCare
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Tout pour bien commencer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment utiliser MegaCare, consultez nos tarifs
              transparents et trouvez les réponses à vos questions.
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Créer mon compte <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 border border-border text-foreground/80 font-semibold px-6 py-3 rounded-xl hover:bg-secondary/50 transition-colors"
              >
                Voir les médecins
              </Link>
            </div>
          </div>
        </section>

        {/* Sticky Tab Bar */}
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">
                  {tab.id === "comment"
                    ? "Guide"
                    : tab.id === "tarifs"
                      ? "Tarifs"
                      : "FAQ"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Comment ça marche ── */}
        {activeTab === "comment" && (
          <div className="animate-fade-in">
            {/* Teleconsultation */}
            <section className="py-16 bg-background">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Video className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Téléconsultation médicale
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Consultez un médecin depuis chez vous en quelques minutes
                    </p>
                  </div>
                </div>

                <div className="relative">
                  {/* Vertical connector */}
                  <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-blue-500 via-violet-500 to-fuchsia-500 hidden sm:block" />
                  <div className="space-y-4">
                    {consultationSteps.map((step, i) => (
                      <div key={i} className="flex gap-6 items-start group">
                        <div
                          className={`relative z-10 shrink-0 w-12 h-12 rounded-xl ${step.color} text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
                        >
                          {step.icon}
                        </div>
                        <div className="flex-1 bg-card border border-border rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                  Étape {i + 1}
                                </span>
                              </div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {step.title}
                              </h3>
                              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Pharmacy Steps */}
            <section className="py-16 bg-secondary/30">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Pharmacie en ligne
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Commandez vos médicaments avec livraison rapide
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  {pharmacySteps.map((step, i) => (
                    <div
                      key={i}
                      className="group bg-card border border-border rounded-2xl p-6 hover:border-green-400/40 hover:shadow-lg transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${step.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                      >
                        {step.icon}
                      </div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Étape {i + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="py-16 bg-background">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                  Sécurité & confidentialité
                </h2>
                <div className="grid sm:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <Lock className="w-6 h-6" />,
                      color: "text-blue-500 bg-blue-500/10",
                      title: "Chiffrement E2E",
                      desc: "Toutes vos données sont chiffrées de bout en bout, de votre appareil à nos serveurs.",
                    },
                    {
                      icon: <Shield className="w-6 h-6" />,
                      color: "text-emerald-500 bg-emerald-500/10",
                      title: "Données conformes",
                      desc: "Conformité avec la loi n°2004-63 tunisienne sur la protection des données personnelles.",
                    },
                    {
                      icon: <Award className="w-6 h-6" />,
                      color: "text-violet-500 bg-violet-500/10",
                      title: "Médecins certifiés",
                      desc: "Tous nos médecins sont vérifiés, inscrits à l'Ordre des Médecins de Tunisie.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-2xl p-6 text-center space-y-3"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto`}
                      >
                        {item.icon}
                      </div>
                      <h3 className="font-semibold text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── Tab: Tarifs ── */}
        {activeTab === "tarifs" && (
          <div className="animate-fade-in">
            {/* Consultation Pricing */}
            <section className="py-16 bg-background">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Consultations médicales
                  </h2>
                  <p className="text-muted-foreground">
                    Tarifs pour une consultation vidéo de 30 minutes. Aucun
                    abonnement requis.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {doctorPricing.map((plan, i) => (
                    <div
                      key={i}
                      className={`relative rounded-2xl border-2 p-8 space-y-6 transition-all duration-300 hover:shadow-xl ${
                        plan.highlighted
                          ? "border-primary bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg scale-[1.02]"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      {plan.highlighted && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                          ⭐ Le plus populaire
                        </div>
                      )}
                      <div>
                        <div
                          className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${plan.gradient} text-white mb-3`}
                        >
                          {plan.title}
                        </div>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-5xl font-bold text-foreground">
                            {plan.price}
                          </span>
                          <span className="text-muted-foreground text-lg">
                            DT
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          par consultation · 30 min
                        </p>
                      </div>

                      <Link
                        to="/doctors"
                        className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          plan.highlighted
                            ? "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/25"
                            : "border-2 border-border text-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        Prendre rendez-vous
                      </Link>

                      <ul className="space-y-2.5 border-t border-border pt-5">
                        {plan.features.map((f, j) => (
                          <li
                            key={j}
                            className="flex items-center gap-2.5 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                            <span className="text-foreground">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Pharmacy Delivery */}
            <section className="py-16 bg-secondary/30">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Livraison pharmacie
                  </h2>
                  <p className="text-muted-foreground">
                    Frais de livraison selon votre délai souhaité
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                  {pharmacyPricing.map((opt, i) => (
                    <div
                      key={i}
                      className="bg-card border border-border rounded-2xl p-6 text-center space-y-3 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                    >
                      <div className="text-4xl">{opt.icon}</div>
                      <p className="font-semibold text-foreground">
                        {opt.name}
                      </p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold text-primary">
                          {opt.price}
                        </span>
                        <span className="text-muted-foreground">DT</span>
                      </div>
                      <p className="text-xs text-muted-foreground bg-secondary rounded-lg py-1 px-2">
                        {opt.delay}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Included + Payment */}
            <section className="py-16 bg-background">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-foreground mb-6">
                      Ce qui est inclus
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "Consultation vidéo avec médecin certifié",
                        "Ordonnance numérique",
                        "Accès au dossier médical",
                        "Support client 24/7",
                        "Paiement sécurisé",
                        "Garantie de remboursement 48h",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-card border border-border rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-foreground mb-6">
                      Moyens de paiement
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: "💳", name: "Flouci" },
                        { icon: "💰", name: "Konnect" },
                        { icon: "🏦", name: "Virement" },
                        { icon: "📦", name: "À la livraison" },
                      ].map((m, i) => (
                        <div
                          key={i}
                          className="border border-border rounded-xl p-4 text-center space-y-2 hover:border-primary/30 transition-colors"
                        >
                          <div className="text-2xl">{m.icon}</div>
                          <p className="text-sm font-medium text-foreground">
                            {m.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── Tab: FAQ ── */}
        {activeTab === "faq" && (
          <div className="animate-fade-in">
            <section className="py-16 bg-background">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-2">
                    Questions fréquentes
                  </h2>
                  <p className="text-muted-foreground">
                    Tout ce que vous devez savoir sur MegaCare
                  </p>
                </div>

                <div className="space-y-3">
                  {allFaqs.map((faq, i) => (
                    <div
                      key={i}
                      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? "border-primary/40 shadow-md" : "border-border"}`}
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-secondary/30 transition-colors"
                      >
                        <span className="font-semibold text-foreground text-sm sm:text-base">
                          {faq.q}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-primary" : ""}`}
                        />
                      </button>
                      {openFaq === i && (
                        <div className="px-5 pb-5">
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Prêt à commencer ?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Créez votre compte gratuit et accédez aux meilleurs médecins
              tunisiens
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Créer mon compte gratuit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

