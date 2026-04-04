
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, AlertCircle, Bell, Clock, Zap } from 'lucide-react';

const mockNotifications = [
  {
    id: 1,
    type: 'urgent',
    icon: AlertCircle,
    title: 'Alerte Médicale Urgente',
    message: 'Mme Zahra: Tension artérielle anormale (145/90)',
    time: 'Il y a 5 min',
  },
  {
    id: 2,
    type: 'doctor',
    icon: Bell,
    title: 'Nouveau Message du Médecin',
    message: 'Dr. Mansouri: Modifier le traitement de Mme Khaled',
    time: 'Il y a 15 min',
  },
  {
    id: 3,
    type: 'schedule',
    icon: Clock,
    title: 'Modification de Planning',
    message: 'Visite chez M. Riadh reportée à 14:30',
    time: 'Il y a 30 min',
  },
  {
    id: 4,
    type: 'prescription',
    icon: Zap,
    title: 'Nouvelle Prescription',
    message: 'Dr. Ben Ali a prescrit un nouveau traitement',
    time: 'Il y a 1 heure',
  },
  {
    id: 5,
    type: 'urgent',
    icon: AlertCircle,
    title: 'Alerte Médicale',
    message: 'M. Ben Ali: Température anormale (38.5°C)',
    time: 'Il y a 2 heures',
  },
];

const typeColors = {
  urgent: { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-600' },
  doctor: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600' },
  schedule: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'text-orange-600' },
  prescription: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600' },
};

export default function NotificationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/paramedical-dashboard" className="flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft size={20} />
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Alertes et Notifications</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4">
          {mockNotifications.map((notification) => {
            const colors = typeColors[notification.type as keyof typeof typeColors];
            const Icon = notification.icon;

            return (
              <div
                key={notification.id}
                className={`border rounded-xl p-4 flex items-start gap-4 ${colors.bg} ${colors.border}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                  <Icon size={20} className={colors.icon} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{notification.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                </div>

                {notification.type === 'urgent' && (
                  <button className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:opacity-90 transition font-semibold flex-shrink-0 whitespace-nowrap">
                    Agir
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Clear All */}
        <div className="mt-8 text-center">
          <button className="text-primary hover:underline font-semibold text-sm">
            Marquer tout comme lu
          </button>
        </div>
      </main>
    </div>
  );
}
