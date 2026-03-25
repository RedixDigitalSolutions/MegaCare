"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Phone,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setIsOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass shadow-lg shadow-black/5 py-3" : "bg-transparent py-5"
      }`}
    >
      {/* Top Bar */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          scrolled ? "h-0 opacity-0" : "h-auto opacity-100"
        }`}
      >
        <div className="hidden lg:flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-end items-center gap-6 text-xs text-muted-foreground pb-2">
          <a
            href="tel:+21612345678"
            className="flex items-center gap-2 hover:text-primary transition-colors duration-300"
          >
            <Phone size={12} />
            +216 12 345 678
          </a>
          <span className="text-muted-foreground/30">|</span>
          <span>Disponible 24/7</span>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500 group-hover:scale-105">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_-_Copie-removebg-preview%20%281%29-1lHtn7bUP56gkeKOohlFiO7U9vRpnw.png"
              alt="MegaCare Logo"
              className="w-full h-full object-contain"
              fetchPriority="low"
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
        <div ref={dropdownRef} className="hidden lg:flex items-center gap-0.5">
          <NavLink href="/">Accueil</NavLink>

          {/* Services Dropdown - includes Medecins & Pharmacie */}
          <div
            className="relative"
            onMouseEnter={() => setActiveDropdown("services")}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "services" ? null : "services",
                )
              }
              className="flex items-center gap-1.5 px-4 py-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all duration-300 font-medium text-sm"
            >
              Services
              <ChevronDown
                size={15}
                className={`transition-transform duration-300 ${
                  activeDropdown === "services" ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`absolute left-1/2 -translate-x-1/2 mt-2 w-80 transition-all duration-300 ${
                activeDropdown === "services"
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible -translate-y-2"
              }`}
            >
              <div className="glass rounded-2xl shadow-2xl overflow-hidden border border-border/50 p-2">
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Consultation & Pharmacie
                  </p>
                </div>
                <DropdownLink
                  href="/doctors"
                  icon="👨‍⚕️"
                  title="Medecins"
                  description="Consultez un specialiste en video"
                />
                <DropdownLink
                  href="/pharmacy"
                  icon="💊"
                  title="Pharmacie"
                  description="Commandez vos medicaments en ligne"
                />
                <div className="mx-2 my-1 border-t border-border/50" />
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Autres services
                  </p>
                </div>
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

          <NavLink href="/guide">Guide & Tarifs</NavLink>
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          {!isLoading && isAuthenticated && user ? (
            <ProfileMenuButton user={user} logout={logout} />
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 text-foreground/80 hover:text-primary transition-all duration-300 font-medium rounded-xl hover:bg-secondary/50 text-sm"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="group relative px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/25 hover:scale-105 text-sm"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Inscription
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </>
          )}
        </div>

        {/* Tablet CTA (md to lg) */}
        <div className="hidden md:flex lg:hidden items-center gap-2">
          {!isLoading && isAuthenticated && user ? (
            <ProfileMenuButton user={user} logout={logout} />
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-foreground/80 hover:text-primary transition-colors font-medium rounded-xl hover:bg-secondary/50 text-sm"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2.5 hover:bg-secondary/50 rounded-xl transition-all duration-300"
          aria-label="Menu"
          aria-expanded={isOpen}
        >
          <div className="relative w-5 h-5">
            <Menu
              size={20}
              className={`absolute inset-0 transition-all duration-300 ${
                isOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100"
              }`}
            />
            <X
              size={20}
              className={`absolute inset-0 transition-all duration-300 ${
                isOpen ? "opacity-100" : "opacity-0 -rotate-90 scale-50"
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${
          isOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass mx-4 mt-4 rounded-2xl p-5 space-y-1 border border-border/50 shadow-2xl">
          <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
            Accueil
          </MobileNavLink>

          {/* Mobile Services Accordion */}
          <details className="group">
            <summary className="cursor-pointer py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 flex items-center justify-between font-medium text-sm list-none select-none">
              Services
              <ChevronDown
                size={16}
                className="transition-transform duration-300 group-open:rotate-180 text-muted-foreground"
              />
            </summary>
            <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-primary/20 pl-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-1">
                Consultation & Pharmacie
              </p>
              <MobileSubLink href="/doctors" onClick={() => setIsOpen(false)}>
                👨‍⚕️ Medecins
              </MobileSubLink>
              <MobileSubLink href="/pharmacy" onClick={() => setIsOpen(false)}>
                💊 Pharmacie
              </MobileSubLink>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-3 pb-1">
                Autres services
              </p>
              <MobileSubLink
                href="/medical-service-dashboard"
                onClick={() => setIsOpen(false)}
              >
                🏥 Services Medicaux
              </MobileSubLink>
              <MobileSubLink
                href="/lab-dashboard"
                onClick={() => setIsOpen(false)}
              >
                🔬 Labos & Radiologie
              </MobileSubLink>
              <MobileSubLink
                href="/transport-dashboard"
                onClick={() => setIsOpen(false)}
              >
                🚑 Transport Medicalise
              </MobileSubLink>
              <MobileSubLink
                href="/paramedical-dashboard"
                onClick={() => setIsOpen(false)}
              >
                💉 Paramedicaux
              </MobileSubLink>
            </div>
          </details>

          <MobileNavLink href="/guide" onClick={() => setIsOpen(false)}>
            Guide & Tarifs
          </MobileNavLink>

          <div className="border-t border-border/50 pt-4 mt-3 space-y-1">
            {!isLoading && isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mb-1">
                  <div
                    className={`w-9 h-9 rounded-full flex-shrink-0 overflow-hidden ${
                      user.status === "pending"
                        ? "ring-2 ring-amber-400"
                        : user.status === "rejected"
                          ? "ring-2 ring-destructive"
                          : "ring-2 ring-primary/20"
                    }`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <span className="text-xs font-bold text-white">
                          {(
                            (user.firstName?.[0] ?? "") +
                            (user.lastName?.[0] ?? "")
                          ).toUpperCase() || user.email[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">
                      {user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user.name || user.email}
                    </p>
                    {user.status === "pending" && (
                      <span className="text-xs text-amber-500">
                        ⏳ En attente de validation
                      </span>
                    )}
                    {user.status === "rejected" && (
                      <span className="text-xs text-destructive">
                        Compte refusé
                      </span>
                    )}
                  </div>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block py-2.5 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium text-sm"
                >
                  Mon profil
                </Link>
                {user.status === "approved" && (
                  <Link
                    href={
                      (
                        {
                          patient: "/dashboard",
                          doctor: "/doctor-dashboard",
                          pharmacy: "/pharmacy-dashboard",
                          medical_service: "/medical-service-dashboard",
                          lab_radiology: "/lab-dashboard",
                          medical_transport: "/transport-dashboard",
                          paramedical: "/paramedical-dashboard",
                          admin: "/admin",
                        } as Record<string, string>
                      )[user.role] || "/dashboard"
                    }
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium text-sm"
                  >
                    Tableau de bord
                  </Link>
                )}
                {(user.status === "pending" || user.status === "rejected") && (
                  <Link
                    href="/account-review"
                    onClick={() => setIsOpen(false)}
                    className="block py-2.5 px-4 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/5 rounded-xl transition-all duration-300 font-medium text-sm"
                  >
                    Statut du compte
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    router.push("/");
                  }}
                  className="w-full text-left block py-2.5 px-4 text-destructive hover:bg-destructive/5 rounded-xl transition-all duration-300 font-medium text-sm"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-3 px-4 text-center text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium text-sm"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl text-center font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 text-sm"
                >
                  <Sparkles size={15} />
                  Inscription gratuite
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="relative px-4 py-2.5 text-foreground/80 hover:text-primary rounded-xl transition-all duration-300 font-medium text-sm group"
    >
      {children}
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-1/2 rounded-full" />
    </Link>
  );
}

function DropdownLink({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-all duration-300 group"
    >
      <span className="text-xl mt-0.5 group-hover:scale-110 transition-transform duration-300 leading-none">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-300">
          {title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-3 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-all duration-300 font-medium text-sm"
    >
      {children}
    </Link>
  );
}

function MobileSubLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block py-2.5 px-3 text-sm text-foreground/70 hover:text-primary hover:bg-secondary/30 rounded-lg transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

function ProfileMenuButton({
  user,
  logout,
}: {
  user: User;
  logout: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName =
    user.firstName || user.name?.split(" ")[0] || user.email.split("@")[0];

  const initials =
    ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? ""))
      .toUpperCase()
      .trim() || user.email[0].toUpperCase();

  const isPending = user.status === "pending";
  const isRejected = user.status === "rejected";

  const dashboards: Record<string, string> = {
    patient: "/dashboard",
    doctor: "/doctor-dashboard",
    pharmacy: "/pharmacy-dashboard",
    medical_service: "/medical-service-dashboard",
    lab_radiology: "/lab-dashboard",
    medical_transport: "/transport-dashboard",
    paramedical: "/paramedical-dashboard",
    admin: "/admin",
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-secondary/50 transition-all duration-200 group"
      >
        {/* Avatar circle */}
        <div
          className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ${
            isPending
              ? "ring-2 ring-amber-400"
              : isRejected
                ? "ring-2 ring-destructive"
                : "ring-2 ring-primary/20"
          }`}
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
          )}
        </div>
        <span className="hidden xl:block text-sm font-medium text-foreground/80 group-hover:text-foreground max-w-[100px] truncate">
          {displayName}
        </span>
        {isPending && (
          <span
            className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse"
            title="Compte en attente de validation"
          />
        )}
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 glass rounded-2xl shadow-2xl border border-border/50 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
            <p className="font-semibold text-foreground text-sm truncate">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.name || user.email}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {user.email}
            </p>
            {isPending && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                ⏳ En attente de validation
              </span>
            )}
            {isRejected && (
              <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-destructive">
                ✕ Compte refusé
              </span>
            )}
          </div>

          <div className="py-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors"
            >
              <UserIcon size={15} />
              Mon profil
            </Link>
            {!isPending && !isRejected && (
              <Link
                href={dashboards[user.role] || "/dashboard"}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors"
              >
                <LayoutDashboard size={15} />
                Tableau de bord
              </Link>
            )}
            {(isPending || isRejected) && (
              <Link
                href="/account-review"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/5 transition-colors"
              >
                <span className="text-base leading-none">⏳</span>
                Statut du compte
              </Link>
            )}
          </div>

          <div className="border-t border-border/50 py-1.5">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors w-full text-left"
            >
              <LogOut size={15} />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
