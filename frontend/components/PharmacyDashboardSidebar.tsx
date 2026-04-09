import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  ShoppingCart,
  TrendingUp,
  Package,
  LogOut,
  FlaskConical,
  Menu,
  X,
} from "lucide-react";

const menuItems = [
  {
    href: "/pharmacy-dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
  },
  {
    href: "/pharmacy-dashboard/orders",
    label: "Commandes",
    icon: ShoppingCart,
  },
  { href: "/pharmacy-dashboard/sales", label: "Ventes", icon: TrendingUp },
  { href: "/pharmacy-dashboard/stock", label: "Stock", icon: Package },
];

interface PharmacyDashboardSidebarProps {
  pharmacyName?: string;
}

export function PharmacyDashboardSidebar({
  pharmacyName = "Pharmacie",
}: PharmacyDashboardSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = pharmacyName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (href: string) =>
    href === "/pharmacy-dashboard"
      ? location.pathname === "/pharmacy-dashboard"
      : location.pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <FlaskConical size={20} className="text-primary" />
          </div>
          <div>
            <p className="font-bold text-sidebar-foreground text-sm leading-tight">
              MegaCare
            </p>
            <p className="text-xs text-sidebar-foreground/60">Pharmacie</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sidebar-foreground text-sm truncate">
              {pharmacyName}
            </p>
            <p className="text-xs text-sidebar-foreground/60">Pharmacien</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${
                active
                  ? "bg-sidebar-accent text-sidebar-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <Icon
                size={18}
                className={
                  active ? "text-primary" : "text-sidebar-foreground/50"
                }
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-sidebar-foreground/70 hover:bg-red-500/10 hover:text-red-500 transition"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 bg-card border border-border rounded-lg shadow-md"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 hover:bg-muted rounded"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar border-r border-sidebar-border h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
