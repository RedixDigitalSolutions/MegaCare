"use client";

import { useAuth } from "@/contexts/AuthContext";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Pill,
  Package,
  FileText,
  Clock,
  LogOut,
  Camera,
  MapPin,
} from "lucide-react";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Rediriger si pas authentifié
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
    // Rediriger si mauvais rôle
    if (!isLoading && user && user.role !== "patient") {
      const dashboards = {
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
      };
      router.push(dashboards[user.role as keyof typeof dashboards]);
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Afficher le chargement
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  // Ne pas afficher le dashboard si pas authentifié
  if (!isAuthenticated || !user || user.role !== "patient") {
    return null;
  }

  const patientName =
    user.firstName || user.name?.split(" ")[0] || user.email.split("@")[0];

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Amira Mansouri",
      specialty: "Cardiologie",
      date: "Demain",
      time: "14:00",
      type: "Vidéo",
      hoursUntil: 18,
      doctorId: "MD001",
    },
    {
      id: 2,
      doctor: "Fatima Zahra",
      specialty: "Dermatologie",
      date: "Jeudi 30 Janvier",
      time: "11:00",
      type: "Vidéo",
      hoursUntil: 72,
      doctorId: "MD003",
    },
    {
      id: 3,
      doctor: "Leïla Khaled",
      specialty: "Psychologie",
      date: "Vendredi 31 Janvier",
      time: "17:00",
      type: "Vidéo",
      hoursUntil: 96,
      doctorId: "MD007",
    },
  ];

  const kpiCards = [
    {
      icon: Calendar,
      title: "RDV à venir",
      value: "2",
      subtitle: "Prochain: Demain 14h",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Pill,
      title: "Ordonnances",
      value: "3",
      subtitle: "Actives - Expire dans 12j",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      icon: Package,
      title: "Commandes",
      value: "1",
      subtitle: "En cours - Livraison: Auj",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: FileText,
      title: "Dossier médical",
      value: "65%",
      subtitle: "Mis à jour il y a 3j",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  const recentOrders = [
    {
      id: "CMD-001",
      pharmacy: "Pharmacie El Amal",
      items: 3,
      total: 125,
      status: "En livraison",
      date: "Aujourd'hui",
    },
    {
      id: "CMD-002",
      pharmacy: "Pharmacie Centrale",
      items: 2,
      total: 89,
      status: "Livré",
      date: "Hier",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <DashboardSidebar userName={patientName || "Patient"} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Bonjour {patientName} 👋
                </h1>
                <p className="text-muted-foreground mt-1">
                  {new Date().toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/dashboard/find-doctor"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium inline-flex items-center"
                >
                  Consulter un médecin
                </Link>
                <button
                  onClick={logout}
                  className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpiCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <div
                    key={idx}
                    className="bg-card rounded-xl border border-border p-6 space-y-3"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${card.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {card.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {card.value}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {card.subtitle}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Next Appointment */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border-2 border-primary/30 p-8 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Votre prochain rendez-vous
              </h2>

              {upcomingAppointments[0] && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center text-3xl">
                        {upcomingAppointments[0].specialty === "Psychologie"
                          ? "🧠"
                          : "👨‍⚕️"}
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-foreground">
                          Dr. {upcomingAppointments[0].doctor}
                        </p>
                        <p className="text-primary font-medium">
                          {upcomingAppointments[0].specialty}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          📅 {upcomingAppointments[0].date},{" "}
                          {upcomingAppointments[0].time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        {upcomingAppointments[0].hoursUntil}h
                      </p>
                      <p className="text-xs text-muted-foreground">avant RDV</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-primary/20">
                    <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
                      Rejoindre la salle vidéo
                    </button>
                    <button className="flex-1 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium">
                      Voir détails
                    </button>
                  </div>

                  <div className="text-sm text-muted-foreground text-center pt-2">
                    ⏰ Actif 10 minutes avant le rendez-vous
                  </div>
                </div>
              )}
            </div>

            {/* Online Pharmacy Section */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-green-900">
                    Pharmacie en ligne
                  </h2>
                  <p className="text-green-700">
                    Trouvez les pharmacies les plus proches et commandez vos
                    médicaments
                  </p>
                </div>
                <div className="text-5xl">💊</div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Link
                  href="/pharmacy/prescription-scanner"
                  className="flex items-center gap-3 bg-white hover:bg-green-50 border border-green-200 rounded-lg p-4 transition group"
                >
                  <Camera className="w-6 h-6 text-green-600 group-hover:scale-110 transition" />
                  <div>
                    <p className="font-semibold text-green-900">
                      Scanner d'ordonnance
                    </p>
                    <p className="text-xs text-green-700">
                      Extraire les médicaments
                    </p>
                  </div>
                </Link>

                <Link
                  href="/pharmacy"
                  className="flex items-center gap-3 bg-white hover:bg-green-50 border border-green-200 rounded-lg p-4 transition group"
                >
                  <MapPin className="w-6 h-6 text-green-600 group-hover:scale-110 transition" />
                  <div>
                    <p className="font-semibold text-green-900">
                      Trouver une pharmacie
                    </p>
                    <p className="text-xs text-green-700">
                      Voir les pharmacies proches
                    </p>
                  </div>
                </Link>
              </div>

              <div className="bg-white rounded-lg p-4 border border-green-100">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">💡 Conseil:</span> Utilisez le
                  scanner d'ordonnance pour extraire automatiquement les
                  médicaments prescrits par votre médecin et les commander en
                  quelques clics!
                </p>
              </div>
            </div>

            {/* Two Column Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Appointments */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">
                    Mes rendez-vous
                  </h3>
                  <Link
                    href="/dashboard/appointments"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Voir tous
                  </Link>
                </div>

                <div className="space-y-3">
                  {upcomingAppointments.map((apt, index) => (
                    <div
                      key={apt.id}
                      className={`rounded-lg p-4 flex items-start justify-between border ${
                        index === 0
                          ? "bg-blue-50 border-blue-200"
                          : "bg-secondary/30 border-border"
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          Dr. {apt.doctor}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {apt.specialty}
                        </p>
                        <p className="text-xs text-primary mt-1">
                          📅 {apt.date} - {apt.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                          {apt.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-foreground">
                    Commandes récentes
                  </h3>
                  <Link
                    href="/dashboard/orders"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Voir toutes
                  </Link>
                </div>

                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-secondary/30 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            {order.pharmacy}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.id} • {order.date}
                          </p>
                        </div>
                        <p className="font-bold text-primary">
                          {order.total} DT
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          {order.items} article{order.items > 1 ? "s" : ""}
                        </p>
                        <p
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            order.status === "En livraison"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/dashboard/find-doctor"
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition text-center space-y-3"
              >
                <div className="text-3xl">👨‍⚕️</div>
                <h4 className="font-semibold text-foreground">
                  Trouver un médecin
                </h4>
                <p className="text-sm text-muted-foreground">
                  Nouveau rendez-vous
                </p>
              </Link>

              <Link
                href="/pharmacy/prescription-scanner"
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 hover:shadow-lg transition text-center space-y-3 group"
              >
                <div className="text-3xl group-hover:scale-110 transition">
                  📸
                </div>
                <h4 className="font-semibold text-green-900">
                  Scanner ordonnance
                </h4>
                <p className="text-sm text-green-700">Extraire médicaments</p>
              </Link>

              <Link
                href="/dashboard/medical-records"
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition text-center space-y-3"
              >
                <div className="text-3xl">📋</div>
                <h4 className="font-semibold text-foreground">Mon dossier</h4>
                <p className="text-sm text-muted-foreground">
                  Gérer mes informations
                </p>
              </Link>

              <Link
                href="/consultation"
                className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition text-center space-y-3"
              >
                <div className="text-3xl">🎥</div>
                <h4 className="font-semibold text-foreground">Consultations</h4>
                <p className="text-sm text-muted-foreground">Vidéo en direct</p>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
