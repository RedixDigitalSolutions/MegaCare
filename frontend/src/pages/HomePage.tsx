import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Star,
  Shield,
  Clock,
  CheckCircle,
  Zap,
  ArrowRight,
  Play,
  Heart,
  Stethoscope,
  Pill,
  Brain,
  Eye,
  Bone,
  Baby,
  Activity,
  Sparkles,
  Video,
  FileText,
  Users,
  Award,
  TrendingUp,
  MousePointer,
  ChevronRight,
  X,
  Microscope,
  Building2,
  HeartPulse,
  Calendar,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <PartnersSection />
        <StatsSection />
        <ServicesSection />
        <SpecialtiesSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}

// Custom hook for intersection observer
function useInView(options = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1, ...options },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
}

// Animated Counter Hook
function useCounter(
  end: number,
  duration: number = 2000,
  startOnView: boolean = true,
) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
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

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animation: `particle-float ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// Hero Section
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: (e.clientX - rect.left - rect.width / 2) / 50,
      y: (e.clientY - rect.top - rect.height / 2) / 50,
    });
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div
        className="absolute top-20 right-20 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px] animate-blob"
        style={{
          transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
        }}
      />
      <div
        className="absolute bottom-20 left-20 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] animate-blob delay-300"
        style={{
          transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)`,
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,100,150,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,100,150,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />

      {/* Floating Particles */}
      <ParticleBackground />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-3 px-5 py-2.5 glass rounded-full border border-primary/20 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
              </span>
              <span className="text-sm font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Plateforme N1 de Telemedecine en Tunisie
              </span>
              <Sparkles size={16} className="text-accent animate-pulse" />
            </div>

            {/* Main Heading */}
            <div
              className={`space-y-4 transition-all duration-1000 delay-150 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] tracking-tight">
                <span className="text-foreground block">Votre Santé,</span>
                <span className="gradient-text block">connectée</span>
              </h1>
            </div>

            <p
              className={`text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-1000 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Consultez des medecins specialistes en ligne, accedez a votre
              dossier medical securise et recevez vos medicaments directement
              chez vous.
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <Link
                to="/doctors"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02] hover-glow"
              >
                <span className="relative z-10">Trouver un medecin</span>
                <ArrowRight
                  size={20}
                  className="relative z-10 transition-transform duration-500 group-hover:translate-x-2"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
              </Link>

              <Link
                to="/guide"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 glass border-2 border-border hover:border-primary/50 rounded-2xl font-semibold transition-all duration-500 hover:bg-primary/5 hover:scale-[1.02]"
              >
                <span className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <Play
                    size={18}
                    className="text-primary group-hover:text-primary-foreground-current"
                  />
                </span>
                Comment ça marche
              </Link>
            </div>

            {/* Trust Indicators */}
            <div
              className={`flex flex-wrap items-center gap-8 pt-6 transition-all duration-1000 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-4">
                  {["Dr. A", "Dr. M", "Dr. S", "Dr. K"].map((name, i) => (
                    <div
                      key={i}
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-bold border-3 border-background shadow-lg hover:scale-110 hover:z-10 transition-transform duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      {name.split(" ")[1]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="ml-2 font-semibold text-foreground">
                      4.9
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    +15,000 patients satisfaits
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-3 px-4 py-2 glass rounded-xl">
                <Shield size={20} className="text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">
                  Donnees 100% securisees
                </span>
              </div>
            </div>
          </div>

          {/* Right Visual - Interactive Card */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <div
              className="relative perspective-1000"
              style={{
                transform: `perspective(1000px) rotateY(${mousePosition.x * 0.5}deg) rotateX(${-mousePosition.y * 0.5}deg)`,
              }}
            >
              {/* Main Card */}
              <div className="relative glass rounded-[2rem] p-8 shadow-2xl border border-white/30 overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ animationDuration: "3s" }}
                  />
                </div>

                {/* Logo Display */}
                <div className="relative flex items-center justify-center mb-8">
                  <div className="absolute w-48 h-48 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-44 h-44 animate-float">
                    <img
                      src="/images/logo.png"
                      alt="MegaCare"
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

                {/* Mini Stats Grid */}
                <div className="grid grid-cols-3 gap-4">
                  {[
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
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="relative p-4 bg-background/60 rounded-2xl text-center group hover:scale-105 transition-transform duration-300"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                      />
                      <p
                        className={`text-2xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -left-12 top-1/4 glass p-4 rounded-2xl shadow-xl animate-float delay-200 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-500/20 rounded-xl">
                    <CheckCircle size={22} className="text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      Consultation confirmee
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Dr. Amira - 14:00
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 top-1/3 glass p-4 rounded-2xl shadow-xl animate-float delay-500 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/20 rounded-xl">
                    <Video size={22} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Teleconsultation</p>
                    <p className="text-xs text-muted-foreground">En cours...</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 glass p-4 rounded-2xl shadow-xl animate-float delay-700 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-accent/20 rounded-xl animate-pulse">
                    <Pill size={22} className="text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Ordonnance prete</p>
                    <p className="text-xs text-muted-foreground">
                      Prête pour retrait
                    </p>
                  </div>
                </div>
              </div>

              {/* Orbiting Elements */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full animate-orbit opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-xs text-muted-foreground font-medium">
            Decouvrir
          </span>
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
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

  return (
    <section className="py-12 border-y border-border/50 bg-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-muted-foreground mb-8">
          Ils nous font confiance
        </p>
        <div className="relative">
          <div className="flex animate-scroll">
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={i}
                className="flex-shrink-0 mx-12 px-6 py-3 glass rounded-xl text-muted-foreground font-medium hover:text-primary hover:scale-105 transition-all duration-300"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
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
      `}</style>
    </section>
  );
}

// Stats Section with Animated Counters
function StatsSection() {
  const { ref, isInView } = useInView();

  const stats = [
    { end: 15000, suffix: "+", label: "Patients actifs",        icon: Users,       color: "from-sky-400 to-blue-500" },
    { end: 800,   suffix: "+", label: "Médecins certifiés",     icon: Stethoscope, color: "from-violet-400 to-purple-500" },
    { end: 200,   suffix: "+", label: "Pharmacies partenaires", icon: Pill,        color: "from-emerald-400 to-green-500" },
    { end: 50,    suffix: "+", label: "Laboratoires & Radios",  icon: Microscope,  color: "from-amber-400 to-orange-500" },
    { end: 98,    suffix: "%", label: "Taux de satisfaction",   icon: Award,       color: "from-rose-400 to-pink-500" },
  ];

  return (
    <section
      ref={ref}
      className="relative py-20 bg-foreground text-background overflow-hidden"
    >
      {/* Grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      {/* Top/bottom edge glows */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-0 lg:divide-x lg:divide-white/10">
          {stats.map((stat, idx) => (
            <StatCard key={idx} stat={stat} index={idx} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  stat,
  index,
  isInView,
}: {
  stat: { end: number; suffix: string; label: string; icon: React.ElementType; color: string };
  index: number;
  isInView: boolean;
}) {
  const { count, start } = useCounter(stat.end, 2000, true);
  const Icon = stat.icon;

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => start(), index * 150);
      return () => clearTimeout(timer);
    }
  }, [isInView, index, start]);

  return (
    <div
      className={`flex flex-col items-center text-center px-6 py-10 group transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Icon — gradient border ring + dark center */}
      <div className={`relative mb-5 p-0.5 rounded-2xl bg-gradient-to-br ${stat.color} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
        <div className="w-12 h-12 rounded-[14px] bg-foreground flex items-center justify-center">
          <Icon size={22} className="text-white" />
        </div>
        {/* Glow behind icon on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-50 blur-lg transition-opacity duration-300 -z-10`} />
      </div>

      {/* Rolling number */}
      <p className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-1 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tabular-nums`}>
        {count.toLocaleString()}{stat.suffix}
      </p>

      {/* Expanding accent underline */}
      <div className={`h-0.5 rounded-full bg-gradient-to-r ${stat.color} mb-3 transition-all duration-500 ${
        isInView ? "w-10" : "w-0"
      } group-hover:w-16`}
        style={{ transitionDelay: `${index * 150 + 400}ms` }}
      />

      {/* Label */}
      <p className="text-background/55 text-sm font-medium leading-snug">
        {stat.label}
      </p>
    </div>
  );
}

// Services Section (NEW)
type ServiceItem = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  link: string;
  modalTitle: string;
  modalBody: string;
  features: string[];
};

function ServicesSection() {
  const { ref, isInView } = useInView();
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  const services: ServiceItem[] = [
    {
      icon: Stethoscope,
      title: "Médecins & Spécialistes",
      description: "Trouvez et consultez le spécialiste qu'il vous faut, près de chez vous.",
      color: "from-blue-500 to-blue-600",
      link: "/doctors",
      modalTitle: "Trouvez votre Médecin",
      modalBody: "Accédez à un réseau de médecins généralistes et spécialistes certifiés à travers toute la Tunisie. Consultez les profils, vérifiez les disponibilités et prenez rendez-vous en quelques clics.",
      features: ["Médecins généralistes et 20+ spécialités", "Fiches détaillées avec disponibilités", "Créneaux en temps réel", "Prise de RDV instantanée en ligne"],
    },
    {
      icon: Video,
      title: "Téléconsultation Vidéo",
      description: "Consultez un médecin par vidéo, depuis votre domicile, 7j/7.",
      color: "from-cyan-500 to-teal-500",
      link: "/consultation",
      modalTitle: "Téléconsultation Vidéo",
      modalBody: "Notre service de téléconsultation vous connecte en temps réel avec des médecins certifiés via une plateforme vidéo sécurisée. Recevez un diagnostic, une ordonnance et un suivi — sans quitter votre domicile.",
      features: ["Disponible 7j/7, 24h/24", "Ordonnances électroniques instantanées", "Généralistes et spécialistes", "Connexion chiffrée de bout en bout"],
    },
    {
      icon: Pill,
      title: "Pharmacie Numérique",
      description: "Commandez vos médicaments et retirez-les dans la pharmacie de votre choix.",
      color: "from-emerald-500 to-green-600",
      link: "/pharmacy",
      modalTitle: "Pharmacie Numérique",
      modalBody: "Achetez vos médicaments en toute simplicité depuis notre pharmacie en ligne partenaire. Importez votre ordonnance, choisissez votre pharmacie et retirez votre commande en quelques heures.",
      features: ["Catalogue de plus de 5 000 références", "Scan et validation d'ordonnance", "Retrait rapide en pharmacie", "Rappels de prise de médicaments"],
    },
    {
      icon: Building2,
      title: "Services Médicaux",
      description: "Accédez aux meilleures cliniques et centres médicaux de Tunisie.",
      color: "from-violet-500 to-purple-600",
      link: "/services-medicaux",
      modalTitle: "Services Médicaux",
      modalBody: "Accédez aux meilleures cliniques et centres médicaux de Tunisie. Prenez rendez-vous facilement et gérez vos soins en toute sérénité.",
      features: ["Cliniques et centres certifiés", "Prise de rendez-vous en ligne", "Suivi des dossiers patients", "Disponible partout en Tunisie"],
    },
    {
      icon: Microscope,
      title: "Labos & Radiologie",
      description: "Réservez vos analyses biologiques et examens d'imagerie médicale.",
      color: "from-amber-500 to-orange-500",
      link: "/labos-radiologie",
      modalTitle: "Laboratoires & Radiologie",
      modalBody: "Réservez vos analyses biologiques et examens d'imagerie auprès des meilleurs laboratoires et centres de radiologie partenaires.",
      features: ["Laboratoires d'analyses accrédités", "Radiologie et imagerie médicale", "Résultats sécurisés en ligne", "Joindre une ordonnance au RDV"],
    },
    {
      icon: HeartPulse,
      title: "Paramédicaux & Soins",
      description: "Infirmiers, kinésithérapeutes et soignants qualifiés à domicile.",
      color: "from-pink-500 to-rose-600",
      link: "/paramedical-services",
      modalTitle: "Paramédicaux & Soins",
      modalBody: "Trouvez des professionnels paramédicaux qualifiés près de chez vous. Infirmiers, kinésithérapeutes, orthophonistes et bien plus encore.",
      features: ["Infirmiers et aides-soignants", "Kinésithérapeutes et rééducation", "Soins à domicile disponibles", "Profils vérifiés et certifiés"],
    },
    {
      icon: FileText,
      title: "Dossier Médical",
      description: "Historique de santé complet, sécurisé et partageable avec vos médecins.",
      color: "from-indigo-500 to-blue-600",
      link: "/dashboard/medical-records",
      modalTitle: "Dossier Médical Numérique",
      modalBody: "Centralisez l'ensemble de votre historique de santé dans un dossier médical personnel sécurisé. Partagez vos données avec vos médecins en un clic pour des consultations plus efficaces.",
      features: ["Ordonnances, analyses et radios", "Partage sécurisé avec vos praticiens", "Suivi constantes et vaccinations", "Données hébergées en Tunisie"],
    },
    {
      icon: Calendar,
      title: "Mes Rendez-vous",
      description: "Gérez et suivez tous vos rendez-vous médicaux en un seul endroit.",
      color: "from-sky-500 to-cyan-500",
      link: "/dashboard",
      modalTitle: "Gestion des Rendez-vous",
      modalBody: "Retrouvez l'ensemble de vos rendez-vous médicaux passés et à venir dans un tableau de bord centralisé. Annulez, reprogrammez ou ajoutez facilement un nouveau rendez-vous.",
      features: ["Vue agenda hebdomadaire et mensuelle", "Rappels automatiques par notification", "Historique complet des consultations", "Annulation et reprogrammation faciles"],
    },
    {
      icon: Sparkles,
      title: "Guide Santé",
      description: "Conseils de prévention et fiches santé rédigés par des médecins certifiés.",
      color: "from-purple-500 to-violet-600",
      link: "/guide",
      modalTitle: "Guide Santé MegaCare",
      modalBody: "Accédez à des guides pratiques, conseils de prévention et fiches santé rédigés par des médecins certifiés. Tout ce qu'il faut savoir pour prendre soin de vous.",
      features: ["Guides rédigés par des professionnels", "Conseils de prévention et bien-être", "Fiches maladies et symptômes", "Contenu mis à jour régulièrement"],
    },
  ];

  // Double the list for seamless infinite loop
  const doubled = [...services, ...services];

  return (
    <>
      <style>{`
        @keyframes marquee-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <section ref={ref} className="py-24 bg-background overflow-hidden">
        {/* Section header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span
              className={`inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-5 transition-all duration-700 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Nos Services
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Une solution{" "}
              <span className="gradient-text">complète</span>
              {" "}pour votre{" "}
              <span className="gradient-text">santé</span>
            </h2>
            <p
              className={`text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Tout ce dont vous avez besoin, réuni en une seule plateforme.
              Survolez une carte pour en savoir plus.
            </p>
          </div>
        </div>

        {/* Marquee track */}
        <div className="relative">
          {/* Edge fade masks */}
          <div className="absolute left-0 inset-y-0 w-28 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 inset-y-0 w-28 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            className="flex gap-5 py-3"
            style={{
              width: "max-content",
              animation: `marquee-scroll 36s linear infinite`,
            }}
          >
            {doubled.map((service, idx) => (
              <ServiceCard
                key={idx}
                service={service}
                onClick={() => setActiveService(service)}
              />
            ))}
          </div>
        </div>
      </section>

      {activeService && (
        <ServiceModal
          service={activeService}
          onClose={() => setActiveService(null)}
        />
      )}
    </>
  );
}

function ServiceCard({
  service,
  onClick,
}: {
  service: ServiceItem;
  onClick: () => void;
}) {
  const Icon = service.icon;

  return (
    <button
      onClick={onClick}
      className="group relative shrink-0 w-80 h-80 rounded-2xl overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      aria-label={service.title}
    >
      {/* Full-card gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.color} transition-all duration-500`} />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Light sweep */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_10%,rgba(255,255,255,0.28),transparent_58%)]" />

      {/* Decorative orbs */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/10 blur-sm" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-black/15" />

      {/* ── FRONT: giant icon, center stage ── */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 transition-all duration-400 group-hover:opacity-0 group-hover:scale-75 group-hover:blur-sm">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.25)] group-hover:scale-90 transition-transform duration-300">
          <Icon size={38} className="text-white drop-shadow-lg" />
        </div>
        <p className="text-white font-bold text-sm px-4 text-center leading-snug drop-shadow">
          {service.title}
        </p>
      </div>

      {/* ── BACK: slides up on hover ── */}
      <div
        className="absolute inset-0 flex flex-col justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 60%, transparent 100%)" }}
      >
        {/* Compact icon badge */}
        <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 mb-3 shadow-lg">
          <Icon size={18} className="text-white" />
        </div>

        <h3 className="text-white font-bold text-[15px] leading-snug mb-2">
          {service.title}
        </h3>
        <p className="text-white/75 text-xs leading-relaxed mb-5 line-clamp-3">
          {service.description}
        </p>

        {/* CTA pill */}
        <div className="inline-flex items-center gap-1.5 self-start px-3.5 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/35 text-white text-xs font-semibold shadow-lg group-hover:bg-white/30 transition-colors duration-200">
          Découvrir
          <ChevronRight size={12} />
        </div>
      </div>
    </button>
  );
}

function ServiceModal({
  service,
  onClose,
}: {
  service: ServiceItem;
  onClose: () => void;
}) {
  const Icon = service.icon;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-colors duration-300 ${visible ? "bg-black/70 backdrop-blur-md" : "bg-black/0 backdrop-blur-none"}`}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.55)] transition-all duration-400 ease-out ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero banner ── */}
        <div className={`relative h-48 bg-gradient-to-br ${service.color} overflow-hidden`}>
          {/* Grid texture */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
          {/* Radial light */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(255,255,255,0.30),transparent_60%)]" />
          {/* Decorative orbs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-sm" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-black/15" />

          {/* Icon badge */}
          <div className="absolute bottom-5 left-6 w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/35 shadow-xl">
            <Icon size={30} className="text-white drop-shadow-lg" />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/25 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/40 transition-all duration-200"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="bg-card p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2 leading-snug">
            {service.modalTitle}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            {service.modalBody}
          </p>

          {/* Feature list */}
          <ul className="space-y-2.5 mb-8">
            {service.features.map((feat, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                  <CheckCircle size={11} className="text-white" />
                </span>
                <span className="text-sm text-foreground leading-snug">{feat}</span>
              </li>
            ))}
          </ul>

          {/* CTA row */}
          <div className="flex items-center gap-3">
            <Link
              to={service.link}
              className={`flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r ${service.color} text-white font-semibold text-sm shadow-lg hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200`}
              onClick={() => { onClose(); window.scrollTo({ top: 0, behavior: "instant" }); }}
            >
              Accéder au service
              <ChevronRight size={16} />
            </Link>
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-secondary hover:text-foreground transition-colors duration-200"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Specialties Section
function SpecialtiesSection() {
  const { ref, isInView } = useInView();
  const [specialties, setSpecialties] = useState<
    { name: string; icon: React.ElementType; doctors: number; color: string; description: string }[]
  >([]);

  const iconMap: Record<string, { icon: React.ElementType; description: string }> = {
    cardiologie:        { icon: Heart,       description: "Cœur et système cardiovasculaire" },
    dermatologie:       { icon: Activity,     description: "Peau, cheveux et ongles" },
    pédiatrie:          { icon: Baby,         description: "Santé des enfants" },
    pediatrie:          { icon: Baby,         description: "Santé des enfants" },
    neurologie:         { icon: Brain,        description: "Cerveau et système nerveux" },
    ophtalmologie:      { icon: Eye,          description: "Santé oculaire" },
    orthopédie:         { icon: Bone,         description: "Os et articulations" },
    orthopedie:         { icon: Bone,         description: "Os et articulations" },
    "médecine générale": { icon: Stethoscope, description: "Médecin de famille" },
    "medecine generale": { icon: Stethoscope, description: "Médecin de famille" },
    psychiatrie:        { icon: Brain,        description: "Santé mentale" },
    gynécologie:        { icon: Stethoscope,  description: "Santé des femmes" },
    gynecologie:        { icon: Stethoscope,  description: "Santé des femmes" },
    rhumatologie:       { icon: Bone,         description: "Articulations et tissu conjonctif" },
    "chirurgie generale": { icon: Activity,   description: "Interventions chirurgicales" },
  };

  const colorPool = [
    "bg-red-500/10 text-red-500 hover:bg-red-500",
    "bg-pink-500/10 text-pink-500 hover:bg-pink-500",
    "bg-blue-500/10 text-blue-500 hover:bg-blue-500",
    "bg-purple-500/10 text-purple-500 hover:bg-purple-500",
    "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500",
    "bg-orange-500/10 text-orange-500 hover:bg-orange-500",
    "bg-green-500/10 text-green-500 hover:bg-green-500",
    "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500",
    "bg-amber-500/10 text-amber-500 hover:bg-amber-500",
    "bg-teal-500/10 text-teal-500 hover:bg-teal-500",
  ];

  useEffect(() => {
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((doctors: { specialty?: string }[]) => {
        const counts: Record<string, number> = {};
        doctors.forEach((d) => {
          const s = d.specialty?.trim();
          if (s) counts[s] = (counts[s] || 0) + 1;
        });
        const list = Object.entries(counts).map(([name, count], idx) => {
          const entry = iconMap[name.toLowerCase()];
          return {
            name,
            icon: entry?.icon ?? Stethoscope,
            description: entry?.description ?? "",
            doctors: count,
            color: colorPool[idx % colorPool.length],
          };
        });
        setSpecialties(list);
      })
      .catch(() => {
        // fallback to defaults if API unavailable
        setSpecialties([
          { name: "Cardiologie",      icon: Heart,       description: "Cœur et système cardiovasculaire", doctors: 0, color: colorPool[0] },
          { name: "Dermatologie",     icon: Activity,    description: "Peau, cheveux et ongles",          doctors: 0, color: colorPool[1] },
          { name: "Pédiatrie",        icon: Baby,        description: "Santé des enfants",               doctors: 0, color: colorPool[2] },
          { name: "Neurologie",       icon: Brain,       description: "Cerveau et système nerveux",       doctors: 0, color: colorPool[3] },
          { name: "Ophtalmologie",    icon: Eye,         description: "Santé oculaire",                  doctors: 0, color: colorPool[4] },
          { name: "Orthopédie",       icon: Bone,        description: "Os et articulations",             doctors: 0, color: colorPool[5] },
          { name: "Médecine Générale",icon: Stethoscope, description: "Médecin de famille",              doctors: 0, color: colorPool[6] },
          { name: "Psychiatrie",      icon: Brain,       description: "Santé mentale",                   doctors: 0, color: colorPool[7] },
        ]);
      });
  }, []);

  return (
    <section ref={ref} className="py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <span
              className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Specialites Medicales
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance transition-all duration-700 delay-100 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Trouvez le specialiste
              <span className="gradient-text"> qu'il vous faut</span>
            </h2>
          </div>

          <Link
            to="/doctors"
            onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            className={`group inline-flex items-center gap-2 text-primary hover:text-accent font-semibold transition-all duration-500 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            Voir toutes les spécialités
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-2"
            />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {specialties.map((specialty, idx) => (
            <SpecialtyCard
              key={idx}
              specialty={specialty}
              index={idx}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialtyCard({
  specialty,
  index,
  isInView,
}: {
  specialty: {
    name: string;
    icon: React.ElementType;
    doctors: number;
    color: string;
    description: string;
  };
  index: number;
  isInView: boolean;
}) {
  const Icon = specialty.icon;
  // Extract base color class for glow effect (e.g. "red" from "bg-red-500/10")
  const colorBase = specialty.color.match(/bg-(\w+)-/)?.[1] ?? "primary";

  return (
    <Link
      to={`/doctors?specialty=${encodeURIComponent(specialty.name)}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
      className={`group relative overflow-hidden p-6 bg-card rounded-2xl border border-border hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      {/* Subtle glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-${colorBase}-500/5 rounded-2xl`} />

      {/* Icon badge */}
      <div
        className={`relative w-14 h-14 ${
          specialty.color.split(" ").slice(0, 2).join(" ")
        } rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:text-white ${
          specialty.color.split(" ")[2]
        }`}
      >
        <Icon size={26} />
      </div>

      {/* Text */}
      <h3 className="relative font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1 leading-snug">
        {specialty.name}
      </h3>
      {specialty.description && (
        <p className="relative text-xs text-muted-foreground mb-3 leading-relaxed">
          {specialty.description}
        </p>
      )}

      {/* Footer row */}
      <div className="relative flex items-center justify-between mt-auto">
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
          {specialty.doctors} médecin{specialty.doctors !== 1 ? "s" : ""}
        </span>
        <ArrowRight
          size={16}
          className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
        />
      </div>
    </Link>
  );
}

// Features Section
function FeaturesSection() {
  const { ref, isInView } = useInView();

  const features = [
    {
      title: "Consultations securisees",
      description:
        "Teleconsultations chiffrees de bout en bout avec des medecins certifies par l'Ordre des Medecins tunisiens.",
      icon: Shield,
      color: "from-primary to-blue-600",
    },
    {
      title: "Disponible 24/7",
      description:
        "Prenez rendez-vous a tout moment, meme en urgence. Notre equipe medicale est toujours disponible pour vous.",
      icon: Clock,
      color: "from-accent to-teal-400",
    },
    {
      title: "Dossier medical numerique",
      description:
        "Acces securise a toutes vos donnees medicales, ordonnances et historique de consultations en un seul endroit.",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Retrait express en pharmacie",
      description:
        "Commandez en ligne et retirez vos médicaments en pharmacie en moins d'une heure dans les grandes villes tunisiennes.",
      icon: Zap,
      color: "from-orange-500 to-amber-500",
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Pourquoi MegaCare
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            L'excellence medicale
            <span className="gradient-text"> a portee de main</span>
          </h2>
          <p
            className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Une plateforme complete concue pour simplifier votre parcours de
            soins
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, idx) => (
            <FeatureCard
              key={idx}
              feature={feature}
              index={idx}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  index,
  isInView,
}: {
  feature: {
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
  };
  index: number;
  isInView: boolean;
}) {
  const Icon = feature.icon;

  return (
    <div
      className={`group relative bg-card rounded-3xl p-8 lg:p-10 border border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-transparent hover:scale-[1.01] ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      <div className="relative flex flex-col sm:flex-row gap-6">
        <div
          className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
        >
          <Icon size={30} className="text-white" />
        </div>

        <div>
          <h3 className="font-bold text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
            {feature.title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
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

  return (
    <section
      ref={ref}
      className="py-24 bg-secondary/30 relative overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/30 to-background" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className={`inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Simple et Rapide
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Comment ca
            <span className="gradient-text"> marche ?</span>
          </h2>
          <p
            className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            4 etapes simples pour acceder aux meilleurs soins de sante
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />

          {steps.map((step, idx) => (
            <StepCard
              key={idx}
              step={step}
              index={idx}
              isInView={isInView}
              isLast={idx === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({
  step,
  index,
  isInView,
  isLast,
}: {
  step: {
    step: string;
    title: string;
    description: string;
    icon: React.ElementType;
  };
  index: number;
  isInView: boolean;
  isLast: boolean;
}) {
  const Icon = step.icon;

  return (
    <div
      className={`relative text-center transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Step Number */}
      <div className="relative inline-block mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-xl shadow-primary/25 group-hover:scale-110 transition-transform duration-300 rotate-3 hover:rotate-0">
          {step.step}
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-card rounded-xl border border-border flex items-center justify-center shadow-lg">
          <Icon size={18} className="text-primary" />
        </div>
      </div>

      <h3 className="font-bold text-lg text-foreground mb-2">{step.title}</h3>
      <p className="text-muted-foreground text-sm">{step.description}</p>
    </div>
  );
}

// Testimonials Section

type TestimonialData = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  avatar: string;
  imageUrl: string;
  location: string;
};

const AVATAR_GRADIENTS = [
  "from-primary to-accent",
  "from-emerald-500 to-teal-500",
  "from-violet-500 to-purple-600",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500",
  "from-sky-500 to-blue-600",
];

function getTestimonialInitials(name: string, fallback: string): string {
  if (fallback && fallback.length <= 3) return fallback.toUpperCase();
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({
  t,
  index,
  isInView,
  gradient,
}: {
  t: TestimonialData;
  index: number;
  isInView: boolean;
  gradient: string;
}) {
  const [imgError, setImgError] = useState(false);
  const showImg = !!t.imageUrl && !imgError;
  const initials = getTestimonialInitials(t.name, t.avatar);

  return (
    <div
      className={`group relative flex flex-col bg-card rounded-3xl p-7 border border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-primary/20 hover:-translate-y-1 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Gradient hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

      {/* Decorative large quote mark */}
      <div className="absolute top-4 right-5 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300 pointer-events-none select-none">
        <svg width="48" height="36" viewBox="0 0 48 36" fill="currentColor" className="text-primary">
          <path d="M0 36V22C0 10 7 3.333 21 0l3.5 5.333C17.333 7.333 13.333 11.667 12.333 18H21V36H0zm27 0V22C27 10 34 3.333 48 0l3.5 5.333C44.333 7.333 40.333 11.667 39.333 18H48V36H27z" />
        </svg>
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-5 relative z-10">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={13}
            className={n <= t.rating ? "fill-amber-400 text-amber-400" : "fill-border text-border"}
          />
        ))}
      </div>

      {/* Quote text */}
      <p className="relative z-10 text-sm sm:text-[15px] text-foreground/80 leading-relaxed flex-1 mb-7">
        &ldquo;{t.text}&rdquo;
      </p>

      {/* Author row */}
      <div className="relative z-10 flex items-center gap-3 pt-5 border-t border-border/60">
        {/* Avatar */}
        <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary/30 transition-all duration-300">
          {showImg ? (
            <img
              src={t.imageUrl}
              alt={t.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-sm`}
            >
              {initials}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm text-foreground leading-tight truncate">
            {t.name}
          </p>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {t.role}
            {t.location ? (
              <span className="text-muted-foreground/60"> · {t.location}</span>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const { ref, isInView } = useInView();
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/public/testimonials")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: TestimonialData[]) => {
        if (!cancelled) {
          setTestimonials(data);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setTestimonials([]);
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div ref={ref}>
      {loaded && testimonials.length > 0 && (
      <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — matching other section headers exactly */}
        <div className="text-center mb-14">
          <span
            className={`inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-5 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Témoignages
          </span>
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Ce que disent
            <span className="gradient-text"> nos utilisateurs</span>
          </h2>
          <p
            className={`text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Ils nous font confiance pour prendre soin de leur santé.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.id}
              t={t}
              index={i}
              isInView={isInView}
              gradient={AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length]}
            />
          ))}
        </div>
      </div>
    </section>
      )}
    </div>
  );
}

// CTA Section
function CTASection() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Animated Blobs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-white/10 rounded-full blur-[100px] animate-blob" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-[100px] animate-blob delay-300" />

      {/* Floating Particles - deterministic positions */}
      <div className="absolute inset-0 overflow-hidden">
        {[
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
        ].map((p, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white/20 rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              animation: `float ${p.duration}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className={`inline-flex items-center gap-3 px-5 py-2.5 bg-white/10 border border-white/20 rounded-full mb-8 backdrop-blur-sm transition-all duration-700 ${
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <span className="text-sm font-semibold text-primary-foreground">
            Inscription 100% gratuite
          </span>
          <Sparkles size={16} className="text-white/80" />
        </div>

        <h2
          className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 text-balance transition-all duration-700 delay-100 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Pret a prendre soin
          <span className="block">de votre sante?</span>
        </h2>

        <p
          className={`text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-12 transition-all duration-700 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          Rejoignez MegaCare et beneficiez d'un acces illimite aux meilleurs
          professionnels de sante tunisiens.
        </p>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-300 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-white/30 hover:scale-[1.03]"
          >
            Commencer gratuitement
            <ArrowRight
              size={22}
              className="transition-transform duration-500 group-hover:translate-x-2"
            />
          </Link>
          <Link
            to="/guide"
            onClick={() => window.scrollTo({ top: 0, behavior: "instant" })}
            className="inline-flex items-center justify-center gap-3 px-10 py-5 border-2 border-white/30 text-primary-foreground rounded-2xl font-bold text-lg transition-all duration-500 hover:bg-white/10 hover:border-white/50 hover:scale-[1.03]"
          >
            En savoir plus
          </Link>
        </div>

        {/* Trust Badge */}
        <div
          className={`mt-12 flex flex-wrap items-center justify-center gap-6 text-primary-foreground/60 text-sm transition-all duration-700 delay-500 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-2">
            <Shield size={18} />
            <span>Donnees securisees</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={18} />
            <span>Sans engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>Support 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
