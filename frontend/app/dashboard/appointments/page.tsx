'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Calendar, Clock, Video, MapPin, Phone } from 'lucide-react';

export default function AppointmentsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const appointments = {
    upcoming: [
      {
        id: 1,
        doctor: 'Amira Mansouri',
        specialty: 'Cardiologie',
        date: '21 Janvier 2025',
        time: '14:00',
        duration: '30 min',
        type: 'Vidéo',
        status: 'Confirmé',
        actions: ['Rejoindre', 'Annuler'],
      },
      {
        id: 2,
        doctor: 'Fatima Zahra',
        specialty: 'Dermatologie',
        date: '30 Janvier 2025',
        time: '11:00',
        duration: '30 min',
        type: 'Vidéo',
        status: 'En attente',
        actions: ['Confirmer', 'Reporter'],
      },
    ],
    past: [
      {
        id: 3,
        doctor: 'Mohamed Nasser',
        specialty: 'Pédiatrie',
        date: '14 Janvier 2025',
        time: '10:00',
        duration: '30 min',
        type: 'Vidéo',
        status: 'Terminé',
        actions: ['Voir compte rendu', 'Reprendre RDV'],
      },
      {
        id: 4,
        doctor: 'Hana Dhawi',
        specialty: 'Gynécologie',
        date: '7 Janvier 2025',
        time: '15:30',
        duration: '30 min',
        type: 'Vidéo',
        status: 'Terminé',
        actions: ['Voir compte rendu'],
      },
    ],
    cancelled: [
      {
        id: 5,
        doctor: 'Riadh Gharbi',
        specialty: 'Orthopédie',
        date: '10 Janvier 2025',
        time: '09:00',
        duration: '30 min',
        type: 'Vidéo',
        status: 'Annulé',
        reason: 'Annulé par le patient',
        actions: ['Reprendre RDV'],
      },
    ],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmé':
        return 'bg-green-50 text-green-700';
      case 'En attente':
        return 'bg-orange-50 text-orange-700';
      case 'Terminé':
        return 'bg-gray-50 text-gray-700';
      case 'Annulé':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const getCurrentAppointments = () => {
    const data = appointments[activeTab];
    return data || [];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">Mes Rendez-vous</h1>
            <p className="text-muted-foreground mt-1">Gérez vos consultations médicales</p>
          </div>

          <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              {(['upcoming', 'past', 'cancelled'] as const).map((tab) => {
                const label =
                  tab === 'upcoming'
                    ? 'À venir'
                    : tab === 'past'
                    ? 'Passés'
                    : 'Annulés';
                const count =
                  tab === 'upcoming'
                    ? 2
                    : tab === 'past'
                    ? 2
                    : 1;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 font-medium border-b-2 transition ${
                      activeTab === tab
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Appointments List */}
            <div className="space-y-4">
              {getCurrentAppointments().map((apt) => (
                <div
                  key={apt.id}
                  className="bg-card rounded-lg border border-border p-6 space-y-4"
                >
                  {/* Top Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        👨‍⚕️
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          Dr. {apt.doctor}
                        </h3>
                        <p className="text-primary font-medium">{apt.specialty}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getStatusColor(
                        apt.status
                      )}`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  {/* Details Row */}
                  <div className="flex flex-wrap gap-4 py-4 border-y border-border text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={16} className="text-primary" />
                      {apt.date}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={16} className="text-primary" />
                      {apt.time} · {apt.duration}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Video size={16} className="text-primary" />
                      {apt.type}
                    </div>
                  </div>

                  {/* Reason if cancelled */}
                  {apt.status === 'Annulé' && 'reason' in apt && (
                    <p className="text-sm text-muted-foreground italic">{apt.reason}</p>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {apt.actions.map((action, idx) => (
                      <button
                        key={idx}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                          idx === 0
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'border border-border text-foreground hover:bg-secondary'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {getCurrentAppointments().length === 0 && (
                <div className="text-center py-12 space-y-3">
                  <p className="text-lg font-medium text-foreground">Aucun rendez-vous</p>
                  <p className="text-muted-foreground">
                    Vous n'avez pas encore de rendez-vous {activeTab === 'upcoming' ? 'à venir' : activeTab}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
