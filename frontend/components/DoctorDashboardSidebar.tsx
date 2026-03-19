'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Video,
  FileText,
  TrendingUp,
  Star,
  Settings,
  LogOut,
  ToggleRight,
} from 'lucide-react';

const menuItems = [
  { href: '/doctor-dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/doctor-dashboard/agenda', label: 'Mon agenda', icon: Calendar },
  { href: '/doctor-dashboard/patients', label: 'Mes patients', icon: Users },
  { href: '/doctor-dashboard/consultations', label: 'Consultations', icon: Video },
  { href: '/doctor-dashboard/prescriptions', label: 'Ordonnances', icon: FileText },
  { href: '/doctor-dashboard/revenue', label: 'Mes revenus', icon: TrendingUp },
  { href: '/doctor-dashboard/reviews', label: 'Avis patients', icon: Star },
  { href: '/doctor-dashboard/settings', label: 'Paramètres', icon: Settings },
];

interface DoctorDashboardSidebarProps {
  doctorName?: string;
}

export function DoctorDashboardSidebar({ doctorName = 'Amira Mansouri' }: DoctorDashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-sidebar text-sidebar-foreground border-b md:border-b-0 md:border-r border-sidebar-border">
      {/* Logo & Profile */}
      <div className="p-6 border-b border-sidebar-border space-y-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
            MC
          </div>
          <span className="hidden sm:inline">MegaCare</span>
        </Link>

        <div className="flex items-center gap-4 pt-4 border-t border-sidebar-border">
          <div className="w-12 h-12 rounded-full bg-sidebar-accent text-sidebar-accent-foreground flex items-center justify-center text-lg font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-sidebar-foreground">Dr. {doctorName}</p>
            <p className="text-xs text-sidebar-foreground/70 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Certifié
            </p>
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
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold border-l-4 border-sidebar-accent'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }`}
              >
                <Icon size={20} />
                <span className="flex-1 text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-sidebar-border mt-auto space-y-3">
        {/* Availability Toggle */}
        <div className="bg-sidebar-primary/10 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-sidebar-foreground">Disponibilité</p>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-600">
              <span className="inline-block h-5 w-5 transform rounded-full bg-white transition"></span>
            </button>
          </div>
          <p className="text-xs text-sidebar-foreground/70">Disponible maintenant</p>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-lg transition-all text-sm font-medium">
          <LogOut size={20} />
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
