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
        <AppShowcaseSection />
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
                <span className="text-foreground block">Votre sante,</span>
                <span className="gradient-text block">connectee</span>
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
                to="/how-it-works"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 glass border-2 border-border hover:border-primary/50 rounded-2xl font-semibold transition-all duration-500 hover:bg-primary/5 hover:scale-[1.02]"
              >
                <span className="p-2.5 bg-primary/10 rounded-xl group-hover:bg-primary group-hover:scale-110 transition-all duration-500">
                  <Play
                    size={18}
                    className="text-primary group-hover:text-primary-foreground-current"
                  />
                </span>
                Comment ca marche
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
    { end: 15000, suffix: "+", label: "Patients actifs", icon: Users },
    { end: 800, suffix: "+", label: "Medecins certifies", icon: Stethoscope },
    { end: 200, suffix: "+", label: "Pharmacies partenaires", icon: Pill },
    { end: 98, suffix: "%", label: "Taux de satisfaction", icon: Award },
  ];

  return (
    <section
      ref={ref}
      className="relative py-24 bg-foreground text-background overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Animated Gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
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
  stat: { end: number; suffix: string; label: string; icon: React.ElementType };
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
      className={`text-center group transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-background/10 group-hover:bg-background/20 group-hover:scale-110 transition-all duration-300">
        <Icon size={28} className="text-accent" />
      </div>
      <p className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-2 bg-gradient-to-r from-background via-accent to-background bg-clip-text text-transparent">
        {count.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="text-background/60 text-sm sm:text-base font-medium">
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
      icon: Video,
      title: "Teleconsultation",
      description: "Consultez un medecin en video depuis chez vous",
      color: "from-blue-500 to-cyan-500",
      link: "/consultation",
      modalTitle: "Teleconsultation Video",
      modalBody:
        "Notre service de teleconsultation vous connecte en temps reel avec des medecins certifies via une plateforme video securisee. Recevez un diagnostic, une ordonnance et un suivi — sans quitter votre domicile.",
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
      modalBody:
        "Achetez vos medicaments en toute simplicite depuis notre pharmacie en ligne partenaire. Importez votre ordonnance, choisissez votre pharmacie et retirez votre commande en quelques heures.",
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
      modalBody:
        "Centralisez l'ensemble de votre historique de sante dans un dossier medical personnel securise. Partagez vos donnees avec vos medecins en un clic pour des consultations plus efficaces.",
      features: [
        "Stockage des ordonnances, analyses et radios",
        "Partage securise avec vos praticiens",
        "Suivi de vos constantes et vaccinations",
        "Conformite RGPD et donnees hebergees en Tunisie",
      ],
    },
  ];

  return (
    <>
      <section ref={ref} className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span
              className={`inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Nos Services
            </span>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance transition-all duration-700 delay-100 ${
                isInView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              Une solution complete pour
              <span className="gradient-text block sm:inline">
                {" "}
                votre sante
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <ServiceCard
                key={idx}
                service={service}
                index={idx}
                isInView={isInView}
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
  index,
  isInView,
  onClick,
}: {
  service: ServiceItem;
  index: number;
  isInView: boolean;
  onClick: () => void;
}) {
  const Icon = service.icon;

  return (
    <button
      onClick={onClick}
      className={`group relative p-8 bg-card rounded-3xl border border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:scale-[1.02] hover:border-transparent text-left w-full cursor-pointer ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Gradient Background on Hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
      />

      {/* Icon */}
      <div
        className={`relative w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${service.color} p-0.5`}
      >
        <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center group-hover:bg-transparent transition-colors duration-500">
          <Icon
            size={28}
            className={`text-transparent bg-gradient-to-br ${service.color} bg-clip-text group-hover:text-white transition-colors duration-500`}
          />
          <Icon
            size={28}
            className={`absolute bg-gradient-to-br ${service.color} bg-clip-text [-webkit-text-fill-color:transparent] group-hover:text-white transition-all duration-500`}
          />
        </div>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-foreground transition-colors duration-300">
        {service.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        {service.description}
      </p>

      <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-4 transition-all duration-300">
        En savoir plus
        <ChevronRight
          size={16}
          className="group-hover:translate-x-1 transition-transform duration-300"
        />
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-colors duration-300 ${visible ? "bg-black/60" : "bg-black/0"}`}
      onClick={onClose}
    >
      <div
        className={`relative bg-card rounded-3xl border border-border shadow-2xl max-w-lg w-full p-8 transition-all duration-300 ease-out ${visible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-6"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200"
          aria-label="Fermer"
        >
          <X size={20} />
        </button>

        {/* Icon */}
        <div
          className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center`}
        >
          <Icon size={28} className="text-white" />
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-3">
          {service.modalTitle}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-6">
          {service.modalBody}
        </p>

        <ul className="space-y-3 mb-8">
          {service.features.map((feat, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm text-foreground"
            >
              <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
              {feat}
            </li>
          ))}
        </ul>

        <Link
          to={service.link}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r ${service.color} text-white font-semibold text-sm hover:opacity-90 transition-opacity duration-200`}
          onClick={onClose}
        >
          Acceder au service
          <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
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
            className={`group inline-flex items-center gap-2 text-primary hover:text-accent font-semibold transition-all duration-500 ${
              isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            Voir toutes les specialites
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
  };
  index: number;
  isInView: boolean;
}) {
  const Icon = specialty.icon;

  return (
    <Link
      to={`/doctors?specialty=${specialty.name}`}
      className={`group p-6 bg-card rounded-2xl border border-border hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 75}ms` }}
    >
      <div
        className={`w-14 h-14 ${specialty.color.split(" ").slice(0, 2).join(" ")} rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:text-white ${specialty.color.split(" ")[2]}`}
      >
        <Icon size={26} />
      </div>
      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
        {specialty.name}
      </h3>
      <p className="text-sm text-muted-foreground">
        {specialty.doctors} medecins disponibles
      </p>
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

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span
            className={`inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4 transition-all duration-700 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Temoignages
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
            className={`text-muted-foreground text-lg max-w-2xl mx-auto transition-all duration-700 delay-200 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Rejoignez des milliers de patients et medecins satisfaits
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <TestimonialCard
              key={idx}
              testimonial={testimonial}
              index={idx}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  testimonial,
  index,
  isInView,
}: {
  testimonial: {
    name: string;
    role: string;
    text: string;
    rating: number;
    avatar: string;
    location: string;
  };
  index: number;
  isInView: boolean;
}) {
  return (
    <div
      className={`group relative bg-card rounded-3xl p-8 border border-border overflow-hidden transition-all duration-700 hover:shadow-2xl hover:border-primary/20 hover:scale-[1.02] ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Quote Mark */}
      <div className="absolute top-6 right-6 text-8xl font-serif text-primary/10 leading-none group-hover:text-primary/20 transition-colors duration-300">
        "
      </div>

      {/* Rating */}
      <div className="flex gap-1 mb-6">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-foreground mb-8 leading-relaxed relative z-10">
        "{testimonial.text}"
      </p>

      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          {testimonial.avatar}
        </div>
        <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">
            {testimonial.role} - {testimonial.location}
          </p>
        </div>
      </div>
    </div>
  );
}

// App Showcase Section (NEW)
function AppShowcaseSection() {
  const { ref, isInView } = useInView();

  return (
    <section
      ref={ref}
      className="py-24 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-700 ${
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            }`}
          >
            <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-semibold">
              Application Mobile
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
              MegaCare dans
              <span className="gradient-text"> votre poche</span>
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Telechargez notre application mobile pour acceder a tous nos
              services ou que vous soyez. Disponible sur iOS et Android.
            </p>

            <ul className="space-y-4">
              {[
                "Notifications en temps reel",
                "Chat avec votre medecin",
                "Rappels de medicaments",
                "Suivi de sante personnalise",
              ].map((feature, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isInView
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-8"
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <CheckCircle size={14} className="text-accent" />
                  </div>
                  <span className="text-foreground font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="group flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-2xl font-semibold hover:scale-105 transition-all duration-300">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] opacity-80">Telecharger sur</p>
                  <p className="text-sm font-bold -mt-0.5">App Store</p>
                </div>
              </button>

              <button className="group flex items-center gap-3 px-6 py-3 bg-foreground text-background rounded-2xl font-semibold hover:scale-105 transition-all duration-300">
                <svg
                  className="w-8 h-8"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] opacity-80">Disponible sur</p>
                  <p className="text-sm font-bold -mt-0.5">Google Play</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div
            className={`relative transition-all duration-700 delay-300 ${
              isInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            }`}
          >
            <div className="relative flex justify-center">
              {/* Background Glow */}
              <div className="absolute w-80 h-80 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-[100px]" />

              {/* Phone Mockup */}
              <div className="relative glass rounded-[3rem] p-3 shadow-2xl border border-white/20">
                <div className="w-64 h-[500px] bg-gradient-to-br from-primary to-accent rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                  <div className="text-center text-primary-foreground p-6">
                    <div className="w-24 h-24 mx-auto mb-6 bg-white/20 rounded-3xl flex items-center justify-center">
                      <img
                        src="/images/logo.png"
                        alt="MegaCare App"
                        width={60}
                        height={60}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">MegaCare</h3>
                    <p className="text-sm opacity-80">Votre sante, connectee</p>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -left-8 top-1/4 glass p-3 rounded-2xl shadow-lg animate-float">
                <TrendingUp size={24} className="text-green-500" />
              </div>
              <div className="absolute -right-8 top-1/3 glass p-3 rounded-2xl shadow-lg animate-float delay-500">
                <Heart size={24} className="text-red-500" />
              </div>
              <div className="absolute -right-4 bottom-1/4 glass p-3 rounded-2xl shadow-lg animate-float delay-300">
                <Pill size={24} className="text-accent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
            to="/how-it-works"
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
