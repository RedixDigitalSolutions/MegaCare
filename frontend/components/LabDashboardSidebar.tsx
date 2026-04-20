import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FlaskConical,
  FileText,
  Image,
  Users,
  Calendar,
  CreditCard,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Microscope,
  Menu,
  X,
  Home,
} from "lucide-react";

const menuItems = [
  { href: "/lab-dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/lab-dashboard/tests", label: "Analyses", icon: FlaskConical },
  { href: "/lab-dashboard/results", label: "Résultats", icon: FileText },
  {
    href: "/lab-dashboard/imaging",
    label: "Imagerie",
    icon: Image,
  },
  {
    href: "/lab-dashboard/patients",
    label: "Patients",
    icon: Users,
  },
  {
    href: "/lab-dashboard/appointments",
    label: "Rendez-vous",
    icon: Calendar,
  },
  {
    href: "/lab-dashboard/billing",
    label: "Facturation",
    icon: CreditCard,
  },
  {
    href: "/lab-dashboard/messaging",
    label: "Messagerie",
    icon: MessageSquare,
  },
  {
    href: "/lab-dashboard/analytics",
    label: "Statistiques",
    icon: BarChart3,
  },
  {
    href: "/lab-dashboard/settings",
    label: "Paramètres",
    icon: Settings,
  },
];

export function LabDashboardSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
      "LR"
    : "LR";

  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || "Laboratoire";

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border shrink-0">
        <div className="w-9 h-9 bg-sidebar-primary/20 rounded-xl flex items-center justify-center">
          <Microscope size={17} className="text-sidebar-primary" />
        </div>
        <span className="font-bold text-lg text-sidebar-foreground tracking-tight">
          MEGA<span className="text-sidebar-primary">CARE</span>
        </span>
      </div>

      {/* Profile */}
      <div className="px-4 py-3 border-b border-sidebar-border shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/40">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sidebar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-sidebar-foreground truncate">
              {displayName}
            </p>
            <p className="text-xs text-sidebar-foreground/50">
              Labo & Radiologie
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground font-semibold"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon
                size={17}
                className={isActive ? "text-sidebar-primary" : ""}
              />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer actions */}
      <div className="px-3 py-3 border-t border-sidebar-border shrink-0 space-y-0.5">
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-lg transition-all text-sm font-medium"
        >
          <Home size={17} />
          Retour à l’accueil
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all text-sm font-medium"
        >
          <LogOut size={17} />
          Se déconnecter
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-sidebar h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-sidebar-primary/20 rounded-lg flex items-center justify-center">
            <Microscope size={13} className="text-sidebar-primary" />
          </div>
          <span className="font-bold text-sidebar-foreground tracking-tight text-sm">
            MEGACARE
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground transition"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-72 bg-sidebar flex flex-col h-full overflow-hidden shadow-2xl animate-slide-right">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground transition"
            >
              <X size={18} />
            </button>
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}
