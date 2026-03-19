'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Bell, Calendar, Package, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Rappel de rendez-vous',
      message: 'Vous avez un rendez-vous avec Dr. Amira Mansouri demain à 14:00',
      date: '28 Février 2025 à 09:00',
      read: false,
      icon: Calendar,
    },
    {
      id: 2,
      type: 'delivery',
      title: 'Commande en cours de livraison',
      message: 'Votre commande CMD-002 est en cours de livraison. Livraison prévue entre 16h et 18h',
      date: '28 Février 2025 à 16:00',
      read: false,
      icon: Package,
    },
    {
      id: 3,
      type: 'alert',
      title: 'Ordonnance expirée',
      message: 'Votre ordonnance pour Paracétamol expire dans 7 jours',
      date: '25 Février 2025 à 10:30',
      read: true,
      icon: AlertCircle,
    },
    {
      id: 4,
      type: 'success',
      title: 'Consultation complétée',
      message: 'Votre consultation avec Dr. Hedi Ben Ali a été complétée avec succès',
      date: '22 Février 2025 à 14:15',
      read: true,
      icon: CheckCircle,
    },
  ]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                <p className="text-muted-foreground mt-2">Vous avez {notifications.filter(n => !n.read).length} nouvelle(s) notification(s)</p>
              </div>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div 
                    key={notif.id}
                    className={`p-4 rounded-lg border-2 flex items-start gap-4 ${
                      notif.read 
                        ? 'bg-card border-border' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className={`p-3 rounded-lg flex-shrink-0 ${
                      notif.type === 'appointment' ? 'bg-blue-100 text-blue-700' :
                      notif.type === 'delivery' ? 'bg-purple-100 text-purple-700' :
                      notif.type === 'alert' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      <Icon size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">{notif.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{notif.date}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {!notif.read && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                        >
                          Marquer
                        </button>
                      )}
                      <button 
                        onClick={() => removeNotification(notif.id)}
                        className="p-2 hover:bg-muted rounded transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
