'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, AlertCircle, ArrowUpRight, Heart, MapPin, Send, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail('');
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
                <Sparkles size={14} className="text-accent" />
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
                  <Send size={18} />
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
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-16 h-16 bg-white/10 rounded-2xl p-2 transition-all duration-300 group-hover:scale-110 group-hover:bg-white/15">
                <Image
                  src="/images/logo.png"
                  alt="MegaCare Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <div>
                <span className="font-bold text-2xl tracking-tight bg-gradient-to-r from-background via-accent to-background bg-clip-text text-transparent">
                  MEGACARE
                </span>
                <p className="text-xs text-background/60 -mt-0.5">Votre sante, connectee</p>
              </div>
            </Link>
            
            <p className="text-sm text-background/70 leading-relaxed max-w-sm">
              La premiere plateforme tunisienne de telemedecine. Consultations en ligne, pharmacie numerique et gestion complete de votre parcours de sante.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <SocialLink href="#" label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </SocialLink>
              <SocialLink href="#" label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </SocialLink>
              <SocialLink href="#" label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </SocialLink>
              <SocialLink href="#" label="Twitter/X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialLink>
              <SocialLink href="#" label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </SocialLink>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-background/90">Plateforme</h4>
            <ul className="space-y-4">
              <FooterLink href="/doctors">Trouver un medecin</FooterLink>
              <FooterLink href="/pharmacy">Pharmacie en ligne</FooterLink>
              <FooterLink href="/how-it-works">Comment ca marche</FooterLink>
              <FooterLink href="/pricing">Tarifs</FooterLink>
              <FooterLink href="/dashboards-overview">Tableau de bord</FooterLink>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-background/90">Legal</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Mentions legales</FooterLink>
              <FooterLink href="#">Confidentialite</FooterLink>
              <FooterLink href="#">CGU</FooterLink>
              <FooterLink href="#">Cookies</FooterLink>
              <FooterLink href="#">Accessibilite</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-background/90">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:support@megacare.tn" 
                  className="flex items-center gap-3 text-background/70 hover:text-background transition-all duration-300 group"
                >
                  <span className="p-2.5 bg-white/10 rounded-xl group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                    <Mail size={16} />
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
                    <Phone size={16} />
                  </span>
                  +216 12 345 678
                </a>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <span className="p-2.5 bg-white/10 rounded-xl">
                  <MapPin size={16} />
                </span>
                Tunis, Tunisie
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <span className="p-2.5 bg-destructive/30 rounded-xl">
                  <AlertCircle size={16} className="text-destructive" />
                </span>
                <span>Urgence: <strong className="text-background">190</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <p className="flex items-center gap-2 text-sm text-background/60">
              &copy; {currentYear} MegaCare. Fait avec 
              <Heart size={14} className="text-destructive fill-destructive animate-pulse" /> 
              en Tunisie
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-background/50">
              <span>Regule par le Ministere de la Sante Tunisien</span>
              <span className="hidden sm:inline">|</span>
              <span>Loi organique n2004-63</span>
            </div>
            
            {/* Back to Top */}
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="p-3 bg-white/10 rounded-xl hover:bg-accent hover:scale-110 transition-all duration-300 group"
              aria-label="Retour en haut"
            >
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
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

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="group flex items-center gap-2 text-background/60 hover:text-background transition-all duration-300"
      >
        <span className="w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-4 rounded-full" />
        {children}
      </Link>
    </li>
  );
}
