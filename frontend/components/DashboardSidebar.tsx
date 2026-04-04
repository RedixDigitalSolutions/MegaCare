
import React from "react";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  Video,
  FileText,
  Pill,
  ShoppingBag,
  Package,
  Bell,
  Settings,
  LogOut,
  Search,
  Camera,
} from "lucide-react";

const menuItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/find-doctor", label: "Trouver un médecin", icon: Search },
  { href: "/dashboard/appointments", label: "Mes rendez-vous", icon: Calendar },
  { href: "/dashboard/consultations", label: "Mes consultations", icon: Video },
  {
    href: "/dashboard/medical-records",
    label: "Mon dossier médical",
    icon: FileText,
  },
  { href: "/dashboard/prescriptions", label: "Mes ordonnances", icon: Pill },
  {
    href: "/pharmacy/prescription-scanner",
    label: "Pharmacie en ligne",
    icon: Camera,
    badge: "NEW",
  },
  { href: "/dashboard/orders", label: "Mes commandes", icon: ShoppingBag },
  { href: "/dashboard/tracking", label: "Suivi livraison", icon: Package },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    badge: 3,
  },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
];

interface MenuItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

interface DashboardSidebarProps {
  userName?: string;
}

export function DashboardSidebar({
  userName = "Fatima",
}: DashboardSidebarProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-full md:w-64 bg-sidebar text-sidebar-foreground border-b md:border-b-0 md:border-r border-sidebar-border">
      {/* Profile Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-sidebar-accent text-sidebar-accent-foreground flex items-center justify-center text-lg font-bold">
            F
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-sidebar-foreground">
              {userName}
            </p>
            <p className="text-xs text-sidebar-foreground/70">Patient</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all relative ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-semibold border-l-4 border-sidebar-accent"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <Icon size={20} />
                <span className="flex-1 text-sm">{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      typeof item.badge === "string"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-destructive text-destructive-foreground"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-sidebar-border mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-all text-sm font-medium"
        >
          <LogOut size={20} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}

