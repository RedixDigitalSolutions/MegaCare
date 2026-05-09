import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { User } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  Leaf,
} from "lucide-react";

export function Header({ forceOpaque }: { forceOpaque?: boolean } = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Cart counts — driven by custom events from page components
  const [cartCounts, setCartCounts] = useState(() => {
    try {
      if (!localStorage.getItem("megacare_token")) return { pharma: 0, para: 0 };
      const pharma = JSON.parse(localStorage.getItem("megacare_pharma_cart") || "[]");
      const paramedical = JSON.parse(localStorage.getItem("megacare_para_cart") || "[]");
      return {
        pharma: Array.isArray(pharma) ? pharma.length : 0,
        para: Array.isArray(paramedical) ? paramedical.reduce((s: number, i: any) => s + (i.quantity || 0), 0) : 0,
      };
    } catch { return { pharma: 0, para: 0 }; }
  });

  // Reset cart counts immediately when user logs out
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setCartCounts({ pharma: 0, para: 0 });
      localStorage.removeItem("megacare_pharma_cart");
      localStorage.removeItem("megacare_para_cart");
      localStorage.removeItem("megacare_parapharma_cart");
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) return;
      setCartCounts((prev) => {
        const next = { ...prev };
        if (detail.pharma !== undefined) next.pharma = detail.pharma;
        if (detail.paramedical !== undefined) next.para = detail.paramedical;
        return next;
      });
    };
    window.addEventListener("megacare:cart", handler);
    return () => window.removeEventListener("megacare:cart", handler);
  }, []);

  const openCart = (type: "pharma" | "para") => {
    if (type === "pharma") {
      if (location.pathname === "/pharmacy") {
        window.dispatchEvent(new CustomEvent("megacare:open-cart", { detail: "pharma" }));
      } else {
        navigate("/pharmacy?openCart=pharma");
      }
      return;
    }
    // para → always opens the Parapharmacy page
    if (location.pathname === "/parapharmacy") {
      window.dispatchEvent(new CustomEvent("megacare:open-cart", { detail: "paramedical" }));
    } else {
      navigate("/parapharmacy?openCart=1");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 10);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isSolid = scrolled || forceOpaque;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          isSolid
            ? "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm py-3"
            : "bg-transparent py-4"
        }`}
      >
        {/* Scroll progress bar */}
        {isSolid && (
          <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary to-accent transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        )}

        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_-_Copie-removebg-preview%20%281%29-1lHtn7bUP56gkeKOohlFiO7U9vRpnw.png"
                alt="MegaCare"
                className="w-full h-full object-contain"
                fetchPriority="low"
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className={`font-bold text-[17px] tracking-tight transition-colors duration-300 ${isSolid ? "text-[#1a237e]" : "text-[#1a237e]"}`}>
                MEGACARE
              </span>
              <p className="text-[10px] text-muted-foreground tracking-wide">Votre santé, connectée</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div ref={dropdownRef} className="hidden lg:flex items-center gap-1">
            <NavLink href="/" label="Accueil" />

            {/* Services Dropdown */}
            {(!user || user.role === "patient" || user.role === "admin") && (
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown("services")}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => setActiveDropdown(activeDropdown === "services" ? null : "services")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
                    activeDropdown === "services"
                      ? "text-primary bg-primary/8"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  Services
                  <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === "services" ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
                </button>

                {/* Dropdown panel */}
                <div className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 w-80 transition-all duration-200 origin-top ${
                  activeDropdown === "services" ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                }`}>
                  {/* Arrow */}
                  <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-card border-l border-t border-border/50 rounded-sm z-10" />
                  <div className="relative bg-card rounded-2xl shadow-xl border border-border/60 overflow-hidden p-2 z-20">
                    <div className="px-3 pt-2 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Consultation & Pharmacie
                      </p>
                    </div>
                    <DropdownLink href="/doctors" icon="👨‍⚕️" title="Médecins" description="Consultez un spécialiste en vidéo" />
                    <DropdownLink href="/pharmacy" icon="💊" title="Pharmacie" description="Commandez vos médicaments en ligne" />
                    <div className="mx-2 my-1.5 border-t border-border/50" />
                    <div className="px-3 pt-1 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Autres services
                      </p>
                    </div>
                    <DropdownLink href="/services-medicaux" icon="🏥" title="Services Médicaux" description="Cliniques et centres médicaux" />
                    <DropdownLink href="/labos-radiologie" icon="🔬" title="Labos & Radiologie" description="Analyses et examens médicaux" />
                    <DropdownLink href="/parapharmacy" icon="🧴" title="Parapharmacy" description="Produits médicaux et bien-être" />
                    <DropdownLink href="/paramedical-services" icon="🩺" title="Paramédicaux & Soins" description="Infirmiers, kinés et soignants" />
                  </div>
                </div>
              </div>
            )}

            <NavLink href="/guide" label="Guide & Tarifs" />
          </div>

          {/* Right section */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Cart buttons — authenticated users only */}
            {isAuthenticated && !isLoading && (
              <div className="flex items-center gap-1.5 mr-1">
                <CartButton onClick={() => openCart("pharma")} title="Panier Pharmacie" count={cartCounts.pharma} color="orange">
                  <Stethoscope size={17} className="text-orange-600" />
                </CartButton>
                <CartButton onClick={() => openCart("para")} title="Panier Parapharmacie" count={cartCounts.para} color="green">
                  <Leaf size={17} className="text-green-600" />
                </CartButton>
              </div>
            )}

            {!isLoading && isAuthenticated && user ? (
              <ProfileMenuButton user={user} logout={logout} />
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-foreground/70 hover:text-primary transition-all duration-200 font-medium rounded-xl hover:bg-secondary/60 text-sm"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="group relative px-5 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] text-sm"
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    Inscription
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </>
            )}
          </div>

          {/* Tablet (md–lg) */}
          <div className="hidden md:flex lg:hidden items-center gap-2">
            {isAuthenticated && !isLoading && (
              <div className="flex items-center gap-1.5">
                <CartButton onClick={() => openCart("pharma")} title="Panier Pharmacie" count={cartCounts.pharma} color="orange">
                  <Stethoscope size={16} className="text-orange-600" />
                </CartButton>
                <CartButton onClick={() => openCart("para")} title="Panier Parapharmacie" count={cartCounts.para} color="green">
                  <Leaf size={16} className="text-green-600" />
                </CartButton>
              </div>
            )}
            {!isLoading && isAuthenticated && user ? (
              <ProfileMenuButton user={user} logout={logout} />
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-foreground/70 hover:text-primary transition-colors font-medium rounded-xl hover:bg-secondary/60 text-sm">
                  Connexion
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            {isAuthenticated && !isLoading && (
              <>
                <CartButton onClick={() => openCart("pharma")} title="Pharmacie" count={cartCounts.pharma} color="orange" size="sm">
                  <Stethoscope size={15} className="text-orange-600" />
                </CartButton>
                <CartButton onClick={() => openCart("para")} title="Parapharmacie" count={cartCounts.para} color="green" size="sm">
                  <Leaf size={15} className="text-green-600" />
                </CartButton>
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-secondary/60 rounded-xl transition-colors"
              aria-label="Menu"
            >
              <div className="relative w-5 h-5">
                <Menu size={20} className={`absolute inset-0 transition-all duration-200 ${isOpen ? "opacity-0 rotate-45 scale-75" : "opacity-100"}`} />
                <X size={20} className={`absolute inset-0 transition-all duration-200 ${isOpen ? "opacity-100" : "opacity-0 -rotate-45 scale-75"}`} />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${isOpen ? "bg-black/40 backdrop-blur-sm pointer-events-auto" : "bg-transparent pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile menu drawer */}
      <div className={`fixed top-0 right-0 bottom-0 z-40 w-[min(320px,90vw)] lg:hidden flex flex-col bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_-_Copie-removebg-preview%20%281%29-1lHtn7bUP56gkeKOohlFiO7U9vRpnw.png"
              alt="MegaCare"
              className="w-8 h-8 object-contain"
            />
            <span className="font-bold text-[#1a237e]">MEGACARE</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-secondary/60 transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          <MobileNavLink href="/" onClick={() => setIsOpen(false)} active={location.pathname === "/"}>Accueil</MobileNavLink>

          {(!user || user.role === "patient" || user.role === "admin") && (
            <details className="group" open>
              <summary className="cursor-pointer py-3 px-4 text-foreground/70 hover:text-foreground hover:bg-secondary/50 rounded-xl transition-all duration-200 flex items-center justify-between font-medium text-sm list-none select-none">
                Services
                <ChevronDown size={15} className="transition-transform duration-200 group-open:rotate-180 text-muted-foreground" />
              </summary>
              <div className="mt-1 ml-2 space-y-0.5 border-l-2 border-primary/20 pl-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-1">
                  Consultation & Pharmacie
                </p>
                <MobileSubLink href="/doctors" onClick={() => setIsOpen(false)}>👨‍⚕️ Médecins</MobileSubLink>
                <MobileSubLink href="/pharmacy" onClick={() => setIsOpen(false)}>💊 Pharmacie</MobileSubLink>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-3 pb-1">
                  Autres services
                </p>
                <MobileSubLink href="/services-medicaux" onClick={() => setIsOpen(false)}>🏥 Services Médicaux</MobileSubLink>
                <MobileSubLink href="/labos-radiologie" onClick={() => setIsOpen(false)}>🔬 Labos & Radiologie</MobileSubLink>
                <MobileSubLink href="/parapharmacy" onClick={() => setIsOpen(false)}>🧴 Parapharmacy</MobileSubLink>
                <MobileSubLink href="/paramedical-services" onClick={() => setIsOpen(false)}>🩺 Paramédicaux & Soins</MobileSubLink>
              </div>
            </details>
          )}

          <MobileNavLink href="/guide" onClick={() => setIsOpen(false)} active={location.pathname === "/guide"}>Guide & Tarifs</MobileNavLink>
        </div>

        {/* Auth section at bottom */}
        <div className="border-t border-border p-4 space-y-2">
          {!isLoading && isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-3 px-3 py-2 mb-1 bg-secondary/40 rounded-xl">
                <div className={`w-9 h-9 rounded-full flex-shrink-0 overflow-hidden ${user.status === "pending" ? "ring-2 ring-amber-400" : user.status === "rejected" ? "ring-2 ring-destructive" : "ring-2 ring-primary/20"}`}>
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase() || user.email[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || user.email}
                  </p>
                  {user.status === "pending" && <span className="text-xs text-amber-500">⏳ En attente</span>}
                </div>
              </div>
              {user.status === "approved" && (
                <Link
                  to={({ patient: "/dashboard", doctor: "/doctor-dashboard", pharmacy: "/pharmacy-dashboard", medical_service: "/medical-service-dashboard", lab_radiology: "/lab-dashboard", paramedical: "/paramedical-dashboard", admin: "/admin" } as Record<string, string>)[user.role] || "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 py-2.5 px-4 text-foreground/80 hover:text-primary hover:bg-secondary/50 rounded-xl transition-colors font-medium text-sm"
                >
                  <LayoutDashboard size={15} />
                  Tableau de bord
                </Link>
              )}
              <button
                onClick={() => { logout(); setIsOpen(false); navigate("/"); }}
                className="w-full flex items-center gap-2.5 py-2.5 px-4 text-destructive hover:bg-destructive/5 rounded-xl transition-colors font-medium text-sm"
              >
                <LogOut size={15} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2.5 px-4 text-center text-foreground/70 hover:text-primary hover:bg-secondary/50 rounded-xl transition-colors font-medium text-sm">
                Connexion
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl text-center font-semibold hover:shadow-lg hover:shadow-primary/20 transition-all text-sm">
                <Sparkles size={14} />
                Inscription gratuite
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function NavLink({ href, label }: { href: string; label: string }) {
  const location = useLocation();
  const isActive = href === "/" ? location.pathname === "/" : location.pathname.startsWith(href);
  return (
    <Link
      to={href}
      className={`relative px-4 py-2 rounded-xl transition-all duration-200 font-medium text-sm ${
        isActive
          ? "text-primary bg-primary/8 font-semibold"
          : "text-foreground/70 hover:text-foreground hover:bg-secondary/60"
      }`}
    >
      {label}
      {isActive && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      )}
    </Link>
  );
}

function CartButton({
  onClick,
  title,
  count,
  color,
  size = "md",
  children,
}: {
  onClick: () => void;
  title: string;
  count: number;
  color: "orange" | "green";
  size?: "sm" | "md";
  children: React.ReactNode;
}) {
  const bg = color === "orange" ? "bg-orange-100 hover:bg-orange-200 dark:bg-orange-500/10 dark:hover:bg-orange-500/20" : "bg-green-100 hover:bg-green-200 dark:bg-green-500/10 dark:hover:bg-green-500/20";
  const p = size === "sm" ? "p-1.5" : "p-2";
  return (
    <button onClick={onClick} title={title} className={`relative ${p} rounded-xl ${bg} transition-all duration-200 hover:scale-105`}>
      {children}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 shadow-sm">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </button>
  );
}

function DropdownLink({ href, icon, title, description }: { href: string; icon: string; title: string; description: string }) {
  const location = useLocation();
  const isActive = location.pathname === href;
  return (
    <Link
      to={href}
      className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-200 group ${isActive ? "bg-primary/8" : "hover:bg-secondary/60"}`}
    >
      <span className="text-lg mt-0.5 leading-none">{icon}</span>
      <div>
        <p className={`font-semibold text-sm transition-colors duration-200 ${isActive ? "text-primary" : "text-foreground group-hover:text-primary"}`}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

function MobileNavLink({ href, onClick, active, children }: { href: string; onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`block py-2.5 px-4 rounded-xl transition-all duration-200 font-medium text-sm ${
        active ? "text-primary bg-primary/8 font-semibold" : "text-foreground/70 hover:text-foreground hover:bg-secondary/50"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileSubLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === href;
  return (
    <Link
      to={href}
      onClick={onClick}
      className={`block py-2.5 px-3 text-sm rounded-lg transition-colors duration-200 ${
        isActive ? "text-primary font-medium bg-primary/5" : "text-foreground/60 hover:text-foreground hover:bg-secondary/40"
      }`}
    >
      {children}
    </Link>
  );
}

function ProfileMenuButton({ user, logout }: { user: User; logout: () => void }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayName = user.firstName || user.name?.split(" ")[0] || user.email.split("@")[0];
  const initials = ((user.firstName?.[0] ?? "") + (user.lastName?.[0] ?? "")).toUpperCase().trim() || user.email[0].toUpperCase();
  const isPending = user.status === "pending";
  const isRejected = user.status === "rejected";

  const dashboards: Record<string, string> = {
    patient: "/dashboard",
    doctor: "/doctor-dashboard",
    pharmacy: "/pharmacy-dashboard",
    medical_service: "/medical-service-dashboard",
    lab_radiology: "/lab-dashboard",
    paramedical: "/paramedical-dashboard",
    admin: "/admin",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-secondary/60 transition-all duration-200 group"
      >
        <div className={`w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 transition-all duration-200 ${isPending ? "ring-amber-400" : isRejected ? "ring-destructive" : open ? "ring-primary" : "ring-border group-hover:ring-primary/50"}`}>
          {user.avatar ? (
            <img src={user.avatar} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
          )}
        </div>
        <span className="hidden xl:block text-sm font-medium text-foreground/80 group-hover:text-foreground max-w-[100px] truncate">
          {displayName}
        </span>
        {isPending && <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />}
        <ChevronDown size={13} className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <div className={`absolute right-0 top-full mt-2 w-60 bg-card rounded-2xl shadow-xl border border-border/60 z-50 overflow-hidden transition-all duration-200 origin-top-right ${open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}`}>
        <div className="px-4 py-3 border-b border-border/50 bg-muted/30">
          <p className="font-semibold text-foreground text-sm truncate">
            {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || user.email}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{user.email}</p>
          {isPending && (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
              ⏳ En attente de validation
            </span>
          )}
          {isRejected && (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-destructive">
              ✕ Compte refusé
            </span>
          )}
        </div>

        <div className="py-1.5">
          {!isPending && !isRejected && (
            <Link
              to={dashboards[user.role] || "/dashboard"}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-secondary/50 transition-colors"
            >
              <LayoutDashboard size={15} />
              Tableau de bord
            </Link>
          )}
          {(isPending || isRejected) && (
            <Link
              to="/account-review"
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
            onClick={() => { logout(); setOpen(false); navigate("/"); }}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors w-full text-left"
          >
            <LogOut size={15} />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}

