import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Stethoscope,
  Home,
  Activity,
  Brain,
  Heart,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Users,
  Star,
  Syringe,
  Accessibility,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: Syringe,
    title: "Soins infirmiers à domicile",
    desc: "Injections, pansements, sondes, perfusions, toilettes médicalisées réalisés par des infirmiers diplômés d'état.",
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    icon: Accessibility,
    title: "Kinésithérapie à domicile",
    desc: "Rééducation motrice, massages thérapeutiques, drainage lymphatique et renforcement musculaire chez vous.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Brain,
    title: "Orthophonie & neurologie",
    desc: "Prise en charge des troubles du langage, de la déglutition et de la communication suite à AVC ou maladie.",
    color: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    icon: Heart,
    title: "Soins de plaies & post-opératoires",
    desc: "Pansements complexes, soins de stomies, cicatrisation post-chirurgicale suivie par des infirmières spécialisées.",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    icon: MessageCircle,
    title: "Soins psychosociaux",
    desc: "Accompagnement psychologique, aide à domicile pour personnes dépendantes et soutien aux aidants familiaux.",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Activity,
    title: "Suivi diabète & plaies chroniques",
    desc: "Surveillance glycémique, éducation thérapeutique, soins podologiques et gestion des plaies chroniques.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

const specialties = [
  { label: "Infirmiers IDE" },
  { label: "Kinésithérapeutes" },
  { label: "Orthophonistes" },
  { label: "Ergothérapeutes" },
  { label: "Aides-soignants" },
  { label: "Diététiciens" },
  { label: "Psychomotriciens" },
  { label: "Podologues" },
];

const steps = [
  {
    num: "01",
    title: "Ordonnance du médecin",
    desc: "Votre médecin prescrit les actes paramédicaux nécessaires. Téléversez l'ordonnance dans votre espace.",
    color: "from-sky-500 to-blue-500",
  },
  {
    num: "02",
    title: "Sélection du praticien",
    desc: "Choisissez parmi les praticiens disponibles dans votre secteur, avec avis et spécialités affichés.",
    color: "from-blue-500 to-violet-500",
  },
  {
    num: "03",
    title: "Intervention à domicile",
    desc: "Le praticien se déplace au créneau convenu. Toutes les interventions sont horodatées et documentées.",
    color: "from-violet-500 to-purple-500",
  },
  {
    num: "04",
    title: "Compte-rendu transmis",
    desc: "Un rapport de soins est automatiquement envoyé à votre médecin référent après chaque intervention.",
    color: "from-purple-500 to-indigo-500",
  },
];

const stats = [
  { value: "300+", label: "Paramédicaux agréés" },
  { value: "8 spécialités", label: "De soins couverts" },
  { value: "48h", label: "Délai d'intervention moyen" },
  { value: "96%", label: "Taux de recommandation" },
];

export default function ParamedicalServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-sky-600 via-blue-600 to-violet-700 py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                  <Stethoscope size={15} />
                  Paramédicaux — Soins à domicile
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                  Des soins paramédicaux
                  <br />
                  <span className="text-white/80">à domicile, près</span>
                  <br />
                  de chez vous
                </h1>
                <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-xl">
                  Infirmiers, kinésithérapeutes, orthophonistes et bien d'autres
                  se déplacent à votre domicile. Planifiez vos soins en ligne et
                  suivez chaque intervention dans votre dossier patient.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-semibold rounded-xl hover:bg-white/95 transition shadow-lg shadow-black/20"
                  >
                    Trouver un soignant
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
              {/* Live data card */}
              <div className="flex-shrink-0 w-full max-w-sm">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Home className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Interventions à domicile
                      </p>
                      <p className="text-white/60 text-xs">Aujourd'hui</p>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white">
                    318 <span className="text-white/50 text-xl">visites</span>
                  </div>
                  <div className="h-px bg-white/15" />
                  {[
                    {
                      label: "Soins infirmiers",
                      value: "142 visites",
                      dot: "bg-sky-400",
                    },
                    {
                      label: "Kiné & rééducation",
                      value: "97 séances",
                      dot: "bg-blue-400",
                    },
                    {
                      label: "Autres paramédicaux",
                      value: "79 actes",
                      dot: "bg-violet-400",
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
              <span className="inline-block px-4 py-1.5 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-full text-sm font-semibold mb-4">
                Soins disponibles
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Tous les soins paramédicaux à domicile
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Notre réseau de professionnels paramédicaux intervient
                directement chez vous pour tous types de soins, du simple
                pansement à la rééducation complexe.
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

        {/* Specialties */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
                Professionnels disponibles
              </span>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                8 spécialités paramédicales
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Chaque praticien est diplômé d'état, inscrit à son ordre
                professionnel et vérifié par nos équipes avant toute mise en
                relation.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {specialties.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 px-5 py-3 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:border-sky-300 hover:bg-sky-500/5 transition cursor-default"
                >
                  <div className="w-2 h-2 rounded-full bg-sky-500" />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-full text-sm font-semibold mb-4">
                Comment ça marche
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Prise en charge en 4 étapes
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
                  Pourquoi MegaCare
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  Des soins de qualité,
                  <br />
                  sans quitter votre maison
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  MegaCare sélectionne chaque praticien paramédical avec soin :
                  diplôme d'état vérifié, inscription à l'ordre, assurance
                  professionnelle obligatoire et avis patients validés.
                </p>
                <div className="space-y-4">
                  {[
                    "Tous les praticiens sont vérifiés et assurés RCP",
                    "Compte-rendu de soins transmis au médecin référent",
                    "Historique complet de vos soins dans votre dossier",
                    "Prise de rendez-vous 24h/24 depuis l'application",
                    "Facturation et remboursement CNAM automatisés",
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
                    label: "1er RDV disponible",
                    val: "< 48h",
                    color: "from-sky-500 to-blue-500",
                  },
                  {
                    icon: Star,
                    label: "Note moyenne",
                    val: "4.8/5",
                    color: "from-amber-500 to-orange-500",
                  },
                  {
                    icon: Users,
                    label: "Patients suivis",
                    val: "8 000+",
                    color: "from-violet-500 to-purple-500",
                  },
                  {
                    icon: Shield,
                    label: "Praticiens vérifiés",
                    val: "100%",
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
        <section className="py-20 bg-gradient-to-br from-sky-600 to-violet-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Besoin d'un soin paramédical à domicile?
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
              Trouvez un infirmier, un kinésithérapeute ou tout autre praticien
              disponible près de chez vous et planifiez votre soin en ligne.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sky-700 font-bold rounded-xl hover:bg-white/95 transition shadow-lg"
              >
                Créer un compte gratuit
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition backdrop-blur-sm"
              >
                Mon espace patient
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
