import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Heart,
  Menu,
  X,
  Home
} from "lucide-react";
const menuItems = [
  {
    href: "/medical-service-dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard
  },
  {
    href: "/medical-service-dashboard/patients",
    label: "Patients",
    icon: Users
  },
  {
    href: "/medical-service-dashboard/schedule",
    label: "Planification",
    icon: Calendar
  },
  {
    href: "/medical-service-dashboard/prescriptions",
    label: "Ordonnances",
    icon: FileText
  },
  {
    href: "/medical-service-dashboard/analytics",
    label: "Statistiques",
    icon: BarChart3
  },
  {
    href: "/medical-service-dashboard/settings",
    label: "Param\xE8tres",
    icon: Settings
  }
];
function MedicalServiceDashboardSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const initials = user ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() || "MS" : "MS";
  const displayName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.name || "Service M\xE9dical";
  const NavContent = () => /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-5 border-b border-sidebar-border shrink-0", children: [
      /* @__PURE__ */ jsx("div", { className: "w-9 h-9 bg-sidebar-primary/20 rounded-xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Heart, { size: 17, className: "text-sidebar-primary" }) }),
      /* @__PURE__ */ jsxs("span", { className: "font-bold text-lg text-sidebar-foreground tracking-tight", children: [
        "MEGA",
        /* @__PURE__ */ jsx("span", { className: "text-sidebar-primary", children: "CARE" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b border-sidebar-border shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-sidebar-accent/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative shrink-0", children: [
        /* @__PURE__ */ jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-white", children: initials }),
        /* @__PURE__ */ jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sidebar" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm text-sidebar-foreground truncate", children: displayName }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-sidebar-foreground/50", children: "Services M\xE9dicaux" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto px-3 py-3 space-y-0.5", children: menuItems.map((item) => {
      const Icon = item.icon;
      const isActive = pathname === item.href;
      return /* @__PURE__ */ jsxs(
        Link,
        {
          to: item.href,
          onClick: () => setMobileOpen(false),
          className: `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${isActive ? "bg-sidebar-accent text-sidebar-foreground font-semibold" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}`,
          children: [
            /* @__PURE__ */ jsx(
              Icon,
              {
                size: 17,
                className: isActive ? "text-sidebar-primary" : ""
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "flex-1", children: item.label })
          ]
        },
        item.href
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "px-3 py-3 border-t border-sidebar-border shrink-0 space-y-0.5", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          onClick: () => setMobileOpen(false),
          className: "w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground rounded-lg transition-all text-sm font-medium",
          children: [
            /* @__PURE__ */ jsx(Home, { size: 17 }),
            "Retour \xE0 l\u2019accueil"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: handleLogout,
          className: "w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all text-sm font-medium",
          children: [
            /* @__PURE__ */ jsx(LogOut, { size: 17 }),
            "Se d\xE9connecter"
          ]
        }
      )
    ] })
  ] });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("aside", { className: "hidden md:flex flex-col w-64 shrink-0 bg-sidebar h-screen sticky top-0", children: /* @__PURE__ */ jsx(NavContent, {}) }),
    /* @__PURE__ */ jsxs("div", { className: "md:hidden flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border sticky top-0 z-40", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("div", { className: "w-7 h-7 bg-sidebar-primary/20 rounded-lg flex items-center justify-center", children: /* @__PURE__ */ jsx(Heart, { size: 13, className: "text-sidebar-primary" }) }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-sidebar-foreground tracking-tight text-sm", children: "MEGACARE" })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setMobileOpen(true),
          className: "p-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground transition",
          children: /* @__PURE__ */ jsx(Menu, { size: 20 })
        }
      )
    ] }),
    mobileOpen && /* @__PURE__ */ jsxs("div", { className: "md:hidden fixed inset-0 z-50 flex", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
          onClick: () => setMobileOpen(false)
        }
      ),
      /* @__PURE__ */ jsxs("aside", { className: "relative w-72 bg-sidebar flex flex-col h-full overflow-hidden shadow-2xl animate-slide-right", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setMobileOpen(false),
            className: "absolute top-4 right-4 z-10 p-1.5 text-sidebar-foreground/50 hover:text-sidebar-foreground transition",
            children: /* @__PURE__ */ jsx(X, { size: 18 })
          }
        ),
        /* @__PURE__ */ jsx(NavContent, {})
      ] })
    ] })
  ] });
}
export {
  MedicalServiceDashboardSidebar
};
