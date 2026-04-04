
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Users, Calendar, Home, BarChart3, Settings, LogOut } from 'lucide-react';

export default function MedicalServiceDashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
    if (!isLoading && user && user.role !== 'medical_service') {
      const dashboards = {
        patient: '/dashboard',
        doctor: '/doctor-dashboard',
        pharmacy: '/pharmacy-dashboard',
        lab_radiology: '/lab-dashboard',
        medical_transport: '/transport-dashboard',
        paramedical: '/paramedical-dashboard',
      };
      navigate(dashboards[user.role as keyof typeof dashboards]);
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'medical_service') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              🏥
            </div>
            <h1 className="text-2xl font-bold text-foreground">Services Médicaux</h1>
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
          <p className="text-muted-foreground">Gérez votre service d'hospitalisation à domicile</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Patients Actifs</h3>
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">24</p>
            <p className="text-xs text-green-600">+2 cette semaine</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Rendez-vous Aujourd'hui</h3>
              <Calendar size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">8</p>
            <p className="text-xs text-yellow-600">4 en cours</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Infirmiers en Équipe</h3>
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-xs text-blue-600">8 actifs aujourd'hui</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">Revenus Mensuels</h3>
              <BarChart3 size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">48,500 DT</p>
            <p className="text-xs text-green-600">+15% par rapport au mois dernier</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link to="/medical-service-dashboard/patients" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">📋</div>
            <h3 className="font-semibold text-foreground">Gérer les Patients</h3>
            <p className="text-sm text-muted-foreground">Ajouter et suivre les patients en hospitalisation</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/team" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">👨‍⚕️</div>
            <h3 className="font-semibold text-foreground">Mon Équipe</h3>
            <p className="text-sm text-muted-foreground">Gérer les infirmiers et paramédicaux</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/schedule" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">📅</div>
            <h3 className="font-semibold text-foreground">Planifier</h3>
            <p className="text-sm text-muted-foreground">Programmer les visites et consultations</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/prescriptions" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">💊</div>
            <h3 className="font-semibold text-foreground">Ordonnances</h3>
            <p className="text-sm text-muted-foreground">Prescrire et gérer les traitements</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/teleconsultation" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">📹</div>
            <h3 className="font-semibold text-foreground">Téléconsultation</h3>
            <p className="text-sm text-muted-foreground">Consultations vidéo avec patients</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/vitals" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">❤️</div>
            <h3 className="font-semibold text-foreground">Suivi Médical</h3>
            <p className="text-sm text-muted-foreground">Constantes vitales et alertes</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/equipment" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">🏥</div>
            <h3 className="font-semibold text-foreground">Logistique</h3>
            <p className="text-sm text-muted-foreground">Équipements et matériels médicaux</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/billing" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">💳</div>
            <h3 className="font-semibold text-foreground">Facturation</h3>
            <p className="text-sm text-muted-foreground">Gérer les factures et paiements</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/messaging" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">💬</div>
            <h3 className="font-semibold text-foreground">Messagerie</h3>
            <p className="text-sm text-muted-foreground">Communication entre l'équipe</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/analytics" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">📊</div>
            <h3 className="font-semibold text-foreground">Statistiques</h3>
            <p className="text-sm text-muted-foreground">Rapports et analytics détaillés</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
          </Link>

          <Link to="/medical-service-dashboard/settings" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4">
            <div className="text-3xl">⚙️</div>
            <h3 className="font-semibold text-foreground">Paramètres</h3>
            <p className="text-sm text-muted-foreground">Configurer votre service</p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">Accéder →</span>
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
                  <p className="text-sm font-semibold text-foreground">Nouveau patient: Fatima B.</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">📋</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Visite médicale complétée</p>
                  <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">💰</div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Paiement reçu: 1,500 DT</p>
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
