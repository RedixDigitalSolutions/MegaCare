"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FlaskConical,
  FileText,
  Users,
  TrendingUp,
  Settings,
  LogOut,
} from "lucide-react";

export default function LabDashboardPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    if (!isLoading && user && user.role !== "lab_radiology") {
      const dashboards = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        medical_transport: "/transport-dashboard",
        paramedical: "/paramedical-dashboard",
      };
      router.push(dashboards[user.role as keyof typeof dashboards]);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== "lab_radiology") {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              🔬
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Laboratoire & Radiologie
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </span>
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
          <p className="text-muted-foreground">
            Gérez vos analyses et imagerie médicale
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">
                Examens Aujourd'hui
              </h3>
              <FlaskConical size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">36</p>
            <p className="text-xs text-blue-600">28 complétés</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">
                Résultats en Attente
              </h3>
              <FileText size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">8</p>
            <p className="text-xs text-yellow-600">À traiter</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">
                Médecins Partenaires
              </h3>
              <Users size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">45</p>
            <p className="text-xs text-green-600">Actifs</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-muted-foreground">
                Revenus Mensuels
              </h3>
              <TrendingUp size={20} className="text-primary" />
            </div>
            <p className="text-3xl font-bold text-foreground">52,000 DT</p>
            <p className="text-xs text-green-600">
              +22% par rapport au mois dernier
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link
            href="/lab-dashboard/tests"
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4"
          >
            <div className="text-3xl">🧬</div>
            <h3 className="font-semibold text-foreground">
              Nouvelles Analyses
            </h3>
            <p className="text-sm text-muted-foreground">
              Gérer et traiter les nouveaux tests
            </p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">
              Accéder →
            </span>
          </Link>

          <Link
            href="#"
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4"
          >
            <div className="text-3xl">📸</div>
            <h3 className="font-semibold text-foreground">Imagerie Médicale</h3>
            <p className="text-sm text-muted-foreground">
              Radiologies et imagerie diagnostic
            </p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">
              Accéder →
            </span>
          </Link>

          <Link
            href="/lab-dashboard/results"
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4"
          >
            <div className="text-3xl">📋</div>
            <h3 className="font-semibold text-foreground">Résultats</h3>
            <p className="text-sm text-muted-foreground">
              Consulter et partager les résultats
            </p>
            <span className="text-primary text-sm font-semibold hover:underline inline-block">
              Accéder →
            </span>
          </Link>

          <Link
            href="#"
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4"
          >
            <div className="text-3xl">👥</div>
            <h3 className="font-semibold text-foreground">Patients</h3>
            <p className="text-sm text-muted-foreground">
              Gérer les dossiers patients
            </p>
            <button className="text-primary text-sm font-semibold hover:underline">
              Accéder →
            </button>
          </Link>

          <Link
            href="#"
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4"
          >
            <div className="text-3xl">📊</div>
            <h3 className="font-semibold text-foreground">Statistiques</h3>
            <p className="text-sm text-muted-foreground">
              Rapports d'activité et analytiques
            </p>
            <button className="text-primary text-sm font-semibold hover:underline">
              Accéder →
            </button>
          </Link>

          <Link
            href="#"
            className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition space-y-4"
          >
            <div className="text-3xl">⚙️</div>
            <h3 className="font-semibold text-foreground">Paramètres</h3>
            <p className="text-sm text-muted-foreground">
              Configurer votre laboratoire
            </p>
            <button className="text-primary text-sm font-semibold hover:underline">
              Accéder →
            </button>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Activité Récente
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  🧪
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Test ADN complété
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il y a 1 heure
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  📸
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Radio pulmonaire envoyée au médecin
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Il y a 3 heures
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  💰
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Paiement reçu: 2,500 DT
                  </p>
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
