import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  FlaskConical,
  Microscope,
  ImageIcon,
  FileCheck,
  Clock,
  Shield,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  MapPin,
  Star,
  Activity,
  Heart,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Microscope,
    title: "Analyses de biologie médicale",
    desc: "Hémogramme, bilan hépatique, lipidique, hormonal, sérologies et bien plus — résultats certifiés en 24h.",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    icon: ImageIcon,
    title: "Imagerie médicale",
    desc: "Radiographies, échographies, IRM, scanner, mammographies réalisés sur des équipements de dernière génération.",
    color: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    icon: FileCheck,
    title: "Résultats en ligne sécurisés",
    desc: "Accédez à vos résultats depuis votre espace personnel MegaCare, partagez-les avec vos médecins en un clic.",
    color: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
  },
  {
    icon: FlaskConical,
    title: "Prélèvements à domicile",
    desc: "Un préleveur qualifié se déplace chez vous aux horaires souhaités pour vos analyses sanguines ou urinaires.",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    icon: Zap,
    title: "Résultats urgents < 2h",
    desc: "Pour les bilans préopératoires ou situations critiques, obtenez vos résultats en moins de 2 heures.",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: MapPin,
    title: "Réseau national de laboratoires",
    desc: "Plus de 80 laboratoires et centres d'imagerie partenaires répartis sur tout le territoire tunisien.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
];

const steps = [
  {
    num: "01",
    title: "Ordonnance ou prescription",
    desc: "Importez votre ordonnance médicale ou choisissez parmi nos bilans standards disponibles sans prescription.",
    color: "from-rose-500 to-pink-500",
  },
  {
    num: "02",
    title: "Sélection du centre",
    desc: "Choisissez le laboratoire ou centre d'imagerie le plus proche selon disponibilités et délais.",
    color: "from-pink-500 to-fuchsia-500",
  },
  {
    num: "03",
    title: "Prélèvement ou examen",
    desc: "Rendez-vous en centre ou demandez un prélèvement à domicile selon votre convenance.",
    color: "from-fuchsia-500 to-purple-500",
  },
  {
    num: "04",
    title: "Résultats & consultation",
    desc: "Recevez vos résultats en ligne et consultez un médecin directement pour interprétation.",
    color: "from-purple-500 to-indigo-500",
  },
];

const stats = [
  { value: "80+", label: "Centres partenaires" },
  { value: "200+", label: "Types d'analyses" },
  { value: "24h", label: "Délai résultats standard" },
  { value: "99.8%", label: "Fiabilité des résultats" },
];

const examTypes = [
  "Bilan de santé complet",
  "Bilan thyroïdien",
  "Bilan rénal & hépatique",
  "Bilan lipidique",
  "Hémogramme (NFS)",
  "PCR & sérologies",
  "Radiographie thorax",
  "Échographie abdominale",
  "IRM cérébrale",
  "Mammographie",
  "Densitométrie osseuse",
  "Scanner thorax-abdomen",
];

export default function LabServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-700 py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                  <FlaskConical size={15} />
                  Labos & Radiologie
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                  Vos analyses et
                  <br />
                  <span className="text-white/80">examens en ligne,</span>
                  <br />
                  partout en Tunisie
                </h1>
                <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-xl">
                  Réservez vos analyses biologiques et examens d'imagerie dans
                  les meilleurs laboratoires partenaires. Résultats sécurisés,
                  accessibles en ligne et partagés avec vos médecins.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-rose-700 font-semibold rounded-xl hover:bg-white/95 transition shadow-lg shadow-black/20"
                  >
                    Réserver un examen
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/25 transition"
                  >
                    Consulter un médecin
                  </Link>
                </div>
              </div>
              {/* Stats card */}
              <div className="flex-shrink-0 w-full max-w-sm">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Activity className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Examens traités aujourd'hui
                      </p>
                      <p className="text-white/60 text-xs">Réseau MegaCare</p>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white">
                    1 842 <span className="text-white/50 text-xl">examens</span>
                  </div>
                  <div className="h-px bg-white/15" />
                  {[
                    {
                      label: "Analyses en cours",
                      value: "1 203",
                      dot: "bg-rose-400",
                    },
                    {
                      label: "Imageries planifiées",
                      value: "418",
                      dot: "bg-pink-400",
                    },
                    {
                      label: "Résultats disponibles",
                      value: "221",
                      dot: "bg-fuchsia-400",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                        <span className="text-white/70 text-sm">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-white text-sm font-semibold">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {s.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full text-sm font-semibold mb-4">
                Nos services
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Biologie et imagerie au même endroit
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Un accès unifié aux laboratoires d'analyses et aux centres
                d'imagerie médicale les plus fiables et les plus accessibles.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${f.color} bg-opacity-10 flex items-center justify-center mb-4`}
                  >
                    <f.icon size={22} />
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exam types catalog */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-full text-sm font-semibold mb-4">
                Catalogue d'examens
              </span>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Plus de 200 types d'analyses
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Des bilans standards aux examens spécialisés, notre catalogue
                couvre tous vos besoins diagnostiques.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {examTypes.map((exam) => (
                <span
                  key={exam}
                  className="px-4 py-2 bg-card border border-border rounded-full text-sm text-foreground hover:border-rose-300 hover:bg-rose-500/5 transition cursor-default"
                >
                  {exam}
                </span>
              ))}
              <span className="px-4 py-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-full text-sm font-medium">
                + 188 autres examens
              </span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 rounded-full text-sm font-semibold mb-4">
                Processus simplifié
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Votre bilan en 4 étapes
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.num} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-border to-transparent z-0" />
                  )}
                  <div className="relative bg-card border border-border rounded-2xl p-6 text-center z-10">
                    <div
                      className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-lg">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why choose */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold mb-4">
                  Garanties MegaCare
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Des résultats fiables,
                  <br />
                  accessibles et partagés
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Nos laboratoires et centres d'imagerie partenaires sont
                  accrédités ISO 15189 et respectent les plus hauts standards de
                  qualité pour garantir la fiabilité de chaque résultat.
                </p>
                <div className="space-y-4">
                  {[
                    "Laboratoires accrédités ISO 15189 et agréés COFRAC",
                    "Résultats chiffrés avec valeurs de référence expliquées",
                    "Partage direct avec votre médecin traitant",
                    "Historique de tous vos examens disponible en permanence",
                    "Remboursement CNAM facilité, justificatifs inclus",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle
                        className="text-emerald-500 shrink-0 mt-0.5"
                        size={18}
                      />
                      <span className="text-foreground text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: Clock,
                    label: "Résultats urgents",
                    val: "< 2h",
                    color: "from-rose-500 to-pink-500",
                  },
                  {
                    icon: Star,
                    label: "Satisfaction",
                    val: "4.8/5",
                    color: "from-amber-500 to-orange-500",
                  },
                  {
                    icon: Heart,
                    label: "Bilans effectués",
                    val: "350K+",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Shield,
                    label: "Qualité certifiée",
                    val: "ISO 15189",
                    color: "from-emerald-500 to-teal-500",
                  },
                ].map((card) => (
                  <div
                    key={card.label}
                    className="bg-card border border-border rounded-2xl p-5 text-center"
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}
                    >
                      <card.icon className="text-white" size={20} />
                    </div>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {card.val}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {card.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-rose-600 to-fuchsia-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Prêt à réserver votre examen?
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
              Trouvez le laboratoire ou centre d'imagerie le plus proche et
              réservez votre créneau en moins de 3 minutes.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-700 font-bold rounded-xl hover:bg-white/95 transition shadow-lg"
              >
                Créer un compte gratuit
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition backdrop-blur-sm"
              >
                Consulter un médecin
                <ChevronRight size={17} />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
