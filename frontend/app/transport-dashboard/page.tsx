'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, MapPin, Users, DollarSign, Settings, LogOut } from 'lucide-react';

export default function TransportDashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (!isLoading && user && user.role !== 'medical_transport') {
      const dashboards = {
        patient: '/dashboard',
        doctor: '/doctor-dashboard',
        pharmacy: '/pharmacy-dashboard',
        medical_service: '/medical-service-dashboard',
        lab_radiology: '/lab-dashboard',
        paramedical: '/paramedical-dashboard',
      };
      router.push(dashboards[user.role as keyof typeof dashboards]);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'medical_transport') {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              🚑
            </div>
            <h1 className="text-2xl font-bold text-foreground">Transport Médicalisé</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition"
            >
              <LogOut size={20} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue, {user.firstName}!
          </h2>
          <p className="text-muted-foreground">Gérez votre flotte d'ambulances et trajets</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Trajets Actifs</h3>
              <MapPin size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-xs text-green-600">En cours</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Ambulances Disponibles</h3>
              <Truck size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">18</p>
            <p className="text-xs text-blue-600">Sur 20 total</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Chauffeurs Actifs</h3>
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">24</p>
            <p className="text-xs text-green-600">Tous disponibles</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Revenus Aujourd'hui</h3>
              <DollarSign size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">3,200 DT</p>
            <p className="text-xs text-green-600">15 trajets complétés</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/transport-dashboard/trips" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">🗺️</div>
            <h3 className="font-semibold text-foreground">Nouveaux Trajets</h3>
            <p className="text-sm text-muted-foreground">Créer et assigner des trajets patients</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/transport-dashboard/vehicles" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">🚗</div>
            <h3 className="font-semibold text-foreground">Gestion Flotte</h3>
            <p className="text-sm text-muted-foreground">Entretien et maintenance des ambulances</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="#" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">👥</div>
            <h3 className="font-semibold text-foreground">Équipe</h3>
            <p className="text-sm text-muted-foreground">Gérer chauffeurs et paramédicaux</p>
            <button className="text-primary text-sm font-semibold hover:underline">Accéder →</button>
          </Link>

          <Link href="#" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">📍</div>
            <h3 className="font-semibold text-foreground">Suivi GPS</h3>
            <p className="text-sm text-muted-foreground">Localisation en temps réel des trajets</p>
            <button className="text-primary text-sm font-semibold hover:underline">Accéder →</button>
          </Link>

          <Link href="#" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">💰</div>
            <h3 className="font-semibold text-foreground">Facturation</h3>
            <p className="text-sm text-muted-foreground">Factures et paiements clients</p>
            <button className="text-primary text-sm font-semibold hover:underline">Accéder →</button>
          </Link>

          <Link href="#" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">⚙️</div>
            <h3 className="font-semibold text-foreground">Paramètres</h3>
            <p className="text-sm text-muted-foreground">Configurer votre service de transport</p>
            <button className="text-primary text-sm font-semibold hover:underline">Accéder →</button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Activité Récente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">🚑</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Trajet terminé: Tunis - Ben Arous</p>
                  <p className="text-xs text-muted-foreground">Il y a 30 minutes</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">🔧</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Maintenance programmée ambulance #5</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">👤</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Nouveau chauffeur recruté</p>
                  <p className="text-xs text-muted-foreground">Il y a 1 jour</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
