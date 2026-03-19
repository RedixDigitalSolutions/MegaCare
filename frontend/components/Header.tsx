'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, ArrowRight, Sparkles, Phone } from 'lucide-react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass shadow-lg shadow-black/5 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      {/* Top Bar - Contact Info */}
      <div className={`transition-all duration-500 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
        <div className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-end items-center gap-6 text-xs text-muted-foreground pb-2">
          <a href="tel:+21612345678" className="flex items-center gap-2 hover:text-primary transition-colors duration-300">
            <Phone size={12} />
            +216 12 345 678
          </a>
          <span className="text-muted-foreground/30">|</span>
          <span>Disponible 24/7</span>
        </div>
      </div>
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-12 h-12 transition-all duration-500 group-hover:scale-105">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_-_Copie-removebg-preview%20%281%29-1lHtn7bUP56gkeKOohlFiO7U9vRpnw.png"
              alt="MegaCare Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-xl tracking-tight text-[#1a237e]">
              MEGACARE
            </span>
            <p className="text-[10px] text-muted-foreground -mt-1 tracking-wide">
              Votre sante, connectee
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <NavLink href="/">Accueil</NavLink>
          <NavLink href="/doctors">Medecins</NavLink>
          <NavLink href="/pharmacy">Pharmacie</NavLink>
          
          {/* Services Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setActiveDropdown('services')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center gap-1.5 px-4 py-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all duration-300 font-medium group">
              Services
              <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>
            
            <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-72 transition-all duration-300 ${
              activeDropdown === 'services' 
                ? 'opacity-100 visible translate-y-0' 
                : 'opacity-0 invisible -translate-y-2'
            }`}>
              <div className="glass rounded-2xl shadow-2xl overflow-hidden border border-border/50 p-2">
                <DropdownLink 
                  href="/medical-service-dashboard" 
                  icon="🏥" 
                  title="Services Medicaux"
                  description="Hopitaux et cliniques partenaires"
                />
                <DropdownLink 
                  href="/lab-dashboard" 
                  icon="🔬" 
                  title="Labos & Radiologie"
                  description="Analyses et examens medicaux"
                />
                <DropdownLink 
                  href="/transport-dashboard" 
                  icon="🚑" 
                  title="Transport Medicalise"
                  description="Ambulances et transport sanitaire"
                />
                <DropdownLink 
                  href="/paramedical-dashboard" 
                  icon="💉" 
                  title="Paramedicaux"
                  description="Soins infirmiers a domicile"
                />
              </div>
            </div>
          </div>

          <NavLink href="/how-it-works">Comment ca marche</NavLink>
          <NavLink href="/pricing">Tarifs</NavLink>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 text-foreground/80 hover:text-primary transition-all duration-300 font-medium rounded-xl hover:bg-secondary/50"
          >
            Connexion
          </Link>
          <Link
            href="/register"
            className="group relative px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/25 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Inscription
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2.5 hover:bg-secondary/50 rounded-xl transition-all duration-300"
          aria-label="Menu"
        >
          <div className="relative w-6 h-6">
            <Menu 
              size={24} 
              className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
            />
            <X 
              size={24} 
              className={`absolute inset-0 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
            />
          </div>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div 
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass mx-4 mt-4 rounded-2xl p-6 space-y-1 border border-border/50 shadow-2xl">
          <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Accueil</MobileNavLink>
          <MobileNavLink href="/doctors" onClick={() => setIsOpen(false)}>Medecins</MobileNavLink>
          <MobileNavLink href="/pharmacy" onClick={() => setIsOpen(false)}>Pharmacie</MobileNavLink>
          
          {/* Mobile Services Accordion */}
          <details className="group">
            <summary className="cursor-pointer py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 flex items-center justify-between font-medium list-none">
              Services
              <ChevronDown size={18} className="transition-transform duration-300 group-open:rotate-180" />
            </summary>
            <div className="ml-4 mt-2 space-y-1 border-l-2 border-primary/20 pl-4">
              <MobileSubLink href="/medical-service-dashboard" onClick={() => setIsOpen(false)}>
                Services Medicaux
              </MobileSubLink>
              <MobileSubLink href="/lab-dashboard" onClick={() => setIsOpen(false)}>
                Labos & Radiologie
              </MobileSubLink>
              <MobileSubLink href="/transport-dashboard" onClick={() => setIsOpen(false)}>
                Transport Medicalise
              </MobileSubLink>
              <MobileSubLink href="/paramedical-dashboard" onClick={() => setIsOpen(false)}>
                Paramedicaux
              </MobileSubLink>
            </div>
          </details>

          <MobileNavLink href="/how-it-works" onClick={() => setIsOpen(false)}>Comment ca marche</MobileNavLink>
          <MobileNavLink href="/pricing" onClick={() => setIsOpen(false)}>Tarifs</MobileNavLink>
          
          <div className="border-t border-border/50 pt-4 mt-4 space-y-3">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="block py-3 px-4 text-center text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl text-center font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
            >
              <Sparkles size={16} />
              Inscription gratuite
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="relative px-4 py-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all duration-300 font-medium group"
    >
      {children}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-1/2 rounded-full" />
    </Link>
  );
}

function DropdownLink({ href, icon, title, description }: { href: string; icon: string; title: string; description: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-300 group"
    >
      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
      <div>
        <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="block py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium"
    >
      {children}
    </Link>
  );
}

function MobileSubLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="block py-2.5 px-3 text-sm text-foreground/70 hover:text-primary transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
