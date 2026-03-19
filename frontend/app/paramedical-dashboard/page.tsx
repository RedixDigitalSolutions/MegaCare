'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, Calendar, Users, TrendingUp, Settings, LogOut } from 'lucide-react';

export default function ParamedicalDashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (!isLoading && user && user.role !== 'paramedical') {
      const dashboards = {
        patient: '/dashboard',
        doctor: '/doctor-dashboard',
        pharmacy: '/pharmacy-dashboard',
        medical_service: '/medical-service-dashboard',
        lab_radiology: '/lab-dashboard',
        medical_transport: '/transport-dashboard',
      };
      router.push(dashboards[user.role as keyof typeof dashboards]);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'paramedical') {
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
              👩‍⚕️
            </div>
            <h1 className="text-2xl font-bold text-foreground">Professionnels Paramédicaux</h1>
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
          <p className="text-muted-foreground">Gérez votre calendrier et vos patients</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Patients Suivi</h3>
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">18</p>
            <p className="text-xs text-green-600">Suivi actif</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Consultations Aujourd'hui</h3>
              <Calendar size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">6</p>
            <p className="text-xs text-blue-600">3 terminées</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Heures Travaillées</h3>
              <Heart size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">38h</p>
            <p className="text-xs text-purple-600">Cette semaine</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Revenus Mensuels</h3>
              <TrendingUp size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">8,500 DT</p>
            <p className="text-xs text-green-600">+8% par rapport au mois dernier</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link href="/paramedical-dashboard/planning" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">📅</div>
            <h3 className="font-semibold text-foreground">Planning</h3>
            <p className="text-xs text-muted-foreground">Agenda journalier/hebdomadaire</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/patients" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">👥</div>
            <h3 className="font-semibold text-foreground">Mes Patients</h3>
            <p className="text-xs text-muted-foreground">Fiches patients simplifiées</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/care-record" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">📋</div>
            <h3 className="font-semibold text-foreground">Enregistrement</h3>
            <p className="text-xs text-muted-foreground">Documenter les soins</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/vitals" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">❤️</div>
            <h3 className="font-semibold text-foreground">Constantes</h3>
            <p className="text-xs text-muted-foreground">Suivi des vitales</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/teleconsultation" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">📹</div>
            <h3 className="font-semibold text-foreground">Téléconsultation</h3>
            <p className="text-xs text-muted-foreground">Appel avec le médecin</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/messaging" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">💬</div>
            <h3 className="font-semibold text-foreground">Messages</h3>
            <p className="text-xs text-muted-foreground">Messagerie médicale</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/supplies" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">📦</div>
            <h3 className="font-semibold text-foreground">Matériel</h3>
            <p className="text-xs text-muted-foreground">Gestion du matériel</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/reports" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">📊</div>
            <h3 className="font-semibold text-foreground">Rapports</h3>
            <p className="text-xs text-muted-foreground">Historique et rapports</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/map" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">🗺️</div>
            <h3 className="font-semibold text-foreground">Carte</h3>
            <p className="text-xs text-muted-foreground">Localisation des patients</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/notifications" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">🔔</div>
            <h3 className="font-semibold text-foreground">Alertes</h3>
            <p className="text-xs text-muted-foreground">Notifications urgentes</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link href="/paramedical-dashboard/settings" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-3">
            <div className="text-3xl">⚙️</div>
            <h3 className="font-semibold text-foreground">Paramètres</h3>
            <p className="text-xs text-muted-foreground">Gérer mon profil</p>
            <span className="text-primary text-xs font-semibold hover:underline inline-block">Accéder →</span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Activité Récente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">👤</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Consultation: Madame Khaled</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">📋</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Dossier patient mis à jour</p>
                  <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">💰</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Paiement reçu: 450 DT</p>
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
