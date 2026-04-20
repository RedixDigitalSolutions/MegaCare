import { Link } from "react-router-dom";
import { useState } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaExclamationCircle,
  FaHeart,
  FaPaperPlane,
  FaBolt,
  FaArrowUp,
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-foreground text-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px] -translate-x-1/2 -translate-y-1/2 animate-blob" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[200px] translate-x-1/3 translate-y-1/3 animate-blob delay-300" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        {/* Newsletter Section */}
        <div className="relative glass-dark rounded-3xl p-8 lg:p-12 mb-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]" />

          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-4">
                <FaBolt className="text-accent" />
                Newsletter
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                Restez informe de nos actualites
              </h3>
              <p className="text-background/60">
                Recevez nos conseils sante et les dernieres nouveautes MegaCare
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-background placeholder:text-background/40 focus:outline-none focus:border-accent focus:bg-white/15 transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-2xl font-semibold hover:shadow-xl hover:shadow-accent/25 hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  <FaPaperPlane />
                  <span className="hidden sm:inline">S'inscrire</span>
                </button>
              </div>

              {isSubscribed && (
                <p className="absolute -bottom-8 left-0 text-sm text-accent animate-fade-in">
                  Merci pour votre inscription!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-16 h-16 bg-white/10 rounded-2xl p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/15">
                <img
                  src="/images/logo.png"
                  alt="MegaCare Logo"
                  className="object-contain p-1 w-full h-full"
                />
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-background via-accent to-background bg-clip-text text-transparent">
                  MEGACARE
                </span>
                <p className="text-xs text-background/60 -mt-0.5">
                  Votre sante, connectee
                </p>
              </div>
            </Link>

            <p className="text-sm text-background/70 leading-relaxed max-w-sm">
              La premiere plateforme tunisienne de telemedecine. Consultations
              en ligne, pharmacie numerique et gestion complete de votre
              parcours de sante.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <SocialLink href="#" label="Facebook">
                <FaFacebook className="w-5 h-5" />
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <FaInstagram className="w-5 h-5" />
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
                <FaLinkedinIn className="w-5 h-5" />
              </SocialLink>
              <SocialLink href="#" label="TikTok">
                <FaTiktok className="w-5 h-5" />
              </SocialLink>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-background/90">
              Plateforme
            </h4>
            <ul className="space-y-4">
              <FooterLink href="/doctors">Trouver un medecin</FooterLink>
              <FooterLink href="/pharmacy">Pharmacie en ligne</FooterLink>
              <FooterLink href="/how-it-works">Comment ca marche</FooterLink>
              <FooterLink href="/pricing">Tarifs</FooterLink>
              <FooterLink href="/dashboards-overview">
                Tableau de bord
              </FooterLink>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-background/90">Légal</h4>
            <ul className="space-y-4">
              <FooterLink href="/politique-confidentialite">Confidentialité</FooterLink>
              <FooterLink href="/accessibilite">Accessibilité</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-background/90">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:support@megacare.tn"
                  className="flex items-center gap-3 text-background/70 hover:text-background transition-all duration-300 group"
                >
                  <span className="p-2.5 bg-white/10 rounded-xl group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <FaEnvelope size={14} />
                  </span>
                  support@megacare.tn
                </a>
              </li>
              <li>
                <a
                  href="tel:+21612345678"
                  className="flex items-center gap-3 text-background/70 hover:text-background transition-all duration-300 group"
                >
                  <span className="p-2.5 bg-white/10 rounded-xl group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <FaPhone size={14} />
                  </span>
                  +216 12 345 678
                </a>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <span className="p-2.5 bg-white/10 rounded-xl">
                  <FaMapMarkerAlt size={14} />
                </span>
                Tunis, Tunisie
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <span className="p-2.5 bg-destructive/30 rounded-xl">
                  <FaExclamationCircle size={14} className="text-destructive" />
                </span>
                <span>
                  Urgence: <strong className="text-background">190</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <p className="flex items-center gap-2 text-sm text-background/60">
              &copy; {currentYear} MegaCare. Fait avec
              <FaHeart className="text-destructive animate-pulse" />
              en Tunisie
            </p>

            {/* Redix Credit */}
            <a
              href="https://redixdigitalsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-background/40 hover:text-background/80 transition-colors duration-300 group"
            >
              Développé par
              <span className="font-semibold text-accent group-hover:text-accent/80 transition-colors duration-300">
                Redix Digital Solutions
              </span>
              <FaExternalLinkAlt
                size={10}
                className="opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              />
            </a>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-background/50">
              <span>Regule par le Ministere de la Sante Tunisien</span>
              <span className="hidden sm:inline">|</span>
              <span>Loi organique n2004-63</span>
            </div>

            {/* Back to Top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="p-3 bg-white/10 rounded-xl hover:bg-accent hover:scale-110 transition-all duration-300 group"
              aria-label="Retour en haut"
            >
              <FaArrowUp
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-1"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="p-3 bg-white/10 rounded-xl hover:bg-gradient-to-br hover:from-primary hover:to-accent hover:scale-110 transition-all duration-300"
    >
      {children}
    </a>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        to={href}
        className="group flex items-center gap-2 text-background/60 hover:text-background transition-all duration-300"
      >
        <span className="w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-4 rounded-full" />
        {children}
      </Link>
    </li>
  );
}
