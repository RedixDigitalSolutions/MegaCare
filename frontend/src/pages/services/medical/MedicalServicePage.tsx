import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  Heart,
  Home,
  Users,
  Activity,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Stethoscope,
  Syringe,
  BedDouble,
  MonitorDot,
  ChevronRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: BedDouble,
    title: "Hospitalisation à domicile",
    desc: "Recevez des soins hospitaliers de qualité dans le confort de votre domicile, encadrés par une équipe médicale certifiée.",
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    icon: Syringe,
    title: "Soins infirmiers spécialisés",
    desc: "Administrations de perfusions, pansements complexes, injections et suivi des constantes vitales par nos infirmiers.",
    color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: MonitorDot,
    title: "Télésuivi médical",
    desc: "Monitoring continu de votre état de santé avec alertes automatiques transmises à votre médecin référent.",
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Users,
    title: "Équipe pluridisciplinaire",
    desc: "Médecins, infirmiers, aides-soignants et coordinateurs médicaux travaillent ensemble pour votre rétablissement.",
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: Heart,
    title: "Soins palliatifs & confort",
    desc: "Accompagnement bienveillant et soins de confort pour les patients en situation de fragilité ou de fin de vie.",
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    icon: Shield,
    title: "Matériel médical certifié",
    desc: "Tout le matériel nécessaire — pompes à perfusion, oxygène, lits médicaux — est fourni et installé chez vous.",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

const steps = [
  {
    num: "01",
    title: "Prescription médicale",
    desc: "Votre médecin ou spécialiste prescrit une prise en charge à domicile via la plateforme.",
    color: "from-purple-500 to-indigo-500",
  },
  {
    num: "02",
    title: "Évaluation personnalisée",
    desc: "Notre infirmière coordinatrice effectue une visite d'évaluation pour adapter le programme de soins.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    num: "03",
    title: "Mise en place des soins",
    desc: "L'équipe soignante se déplace à votre domicile selon le planning établi avec vous.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    num: "04",
    title: "Suivi & ajustements",
    desc: "Un bilan régulier permet d'adapter les soins à votre évolution et de coordonner avec votre médecin.",
    color: "from-cyan-500 to-teal-500",
  },
];

const stats = [
  { value: "500+", label: "Professionnels de santé" },
  { value: "24h/24", label: "Disponibilité" },
  { value: "98%", label: "Taux de satisfaction" },
  { value: "15 min", label: "Délai de réponse" },
];

export default function MedicalServicePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 py-24 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
                  <Stethoscope size={15} />
                  Services Médicaux à Domicile
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
                  Des soins médicaux
                  <br />
                  <span className="text-white/80">chez vous, en toute</span>
                  <br />
                  sécurité
                </h1>
                <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-xl">
                  MegaCare vous apporte l'excellence des soins hospitaliers
                  directement à votre domicile, assurés par des équipes
                  médicales agréées et disponibles 24h/24.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/95 transition shadow-lg shadow-black/20"
                  >
                    Demander une prise en charge
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/doctors"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/25 transition"
                  >
                    Voir nos médecins
                  </Link>
                </div>
              </div>
              {/* Visual card */}
              <div className="flex-shrink-0 w-full max-w-sm">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Activity className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Visites effectuées aujourd'hui
                      </p>
                      <p className="text-white/60 text-xs">
                        Mis à jour en temps réel
                      </p>
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-white">
                    247 <span className="text-white/50 text-xl">visites</span>
                  </div>
                  <div className="h-px bg-white/15" />
                  {[
                    {
                      label: "HAD actives",
                      value: "83 patients",
                      dot: "bg-emerald-400",
                    },
                    {
                      label: "Perfusions à domicile",
                      value: "41 en cours",
                      dot: "bg-blue-400",
                    },
                    {
                      label: "Soins palliatifs",
                      value: "12 suivis",
                      dot: "bg-purple-400",
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
              <span className="inline-block px-4 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
                Nos prestations
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Une gamme complète de soins médicaux
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                De l'hospitalisation à domicile au suivi post-opératoire, nos
                équipes assurent tous les actes médicaux dans votre
                environnement.
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

        {/* How it works */}
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold mb-4">
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
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-sm font-semibold mb-4">
                  Pourquoi MegaCare Santé
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  L'hôpital de demain,
                  <br />
                  dans votre salon
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Réduire le temps d'hospitalisation, prévenir les infections
                  nosocomiales et permettre au patient de guérir dans son
                  environnement familier — telle est notre mission.
                </p>
                <div className="space-y-4">
                  {[
                    "Personnel médical agréé par le Ministère de la Santé tunisien",
                    "Matériel médical fourni, installé et entretenu par nos équipes",
                    "Coordination avec votre médecin traitant et spécialistes",
                    "Disponibilité 24h/24, 7j/7 pour les urgences à domicile",
                    "Prise en charge administrative et mutuelle facilitée",
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
                    label: "Intervention rapide",
                    val: "< 2h",
                    color: "from-purple-500 to-indigo-500",
                  },
                  {
                    icon: Star,
                    label: "Satisfaction patients",
                    val: "4.9/5",
                    color: "from-amber-500 to-orange-500",
                  },
                  {
                    icon: Users,
                    label: "Patients accompagnés",
                    val: "12 000+",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: Shield,
                    label: "Actes certifiés",
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
        <section className="py-20 bg-gradient-to-br from-purple-600 to-indigo-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(255,255,255,0.1),transparent_60%)]" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Besoin d'une prise en charge médicale?
            </h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">
              Nos coordinateurs médicaux sont disponibles maintenant pour
              évaluer votre situation et organiser vos soins à domicile.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-xl hover:bg-white/95 transition shadow-lg"
              >
                Créer un compte gratuit
                <ArrowRight size={17} />
              </Link>
              <Link
                to="/consultation"
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
