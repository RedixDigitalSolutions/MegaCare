
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { MapPin, Truck, CheckCircle, Clock, Navigation } from 'lucide-react';
import { useEffect } from 'react';

export default function TrackingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const deliveries = [
    {
      id: 'CMD-001',
      status: 'Livré',
      deliveryDate: '28 Février 2025 à 15:30',
      current: 3,
      steps: [
        { title: 'Commande validée', status: 'done', date: '28 Feb, 10:00' },
        { title: 'Pharmacie préparation', status: 'done', date: '28 Feb, 12:00' },
        { title: 'En cours de livraison', status: 'done', date: '28 Feb, 14:00' },
        { title: 'Livré', status: 'done', date: '28 Feb, 15:30' },
      ],
    },
    {
      id: 'CMD-002',
      status: 'En cours de livraison',
      deliveryDate: 'Aujourd\'hui entre 16h et 18h',
      current: 2,
      steps: [
        { title: 'Commande validée', status: 'done', date: '25 Feb, 10:00' },
        { title: 'Pharmacie préparation', status: 'done', date: '25 Feb, 14:00' },
        { title: 'En cours de livraison', status: 'current', date: '28 Feb, 16:00' },
        { title: 'Livré', status: 'pending', date: 'Aujourd\'hui' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Suivi de livraison</h1>
              <p className="text-muted-foreground mt-2">Suivez l'état de vos commandes en temps réel</p>
            </div>

            <div className="space-y-6">
              {deliveries.map((delivery) => (
                <div key={delivery.id} className="bg-card border border-border rounded-lg p-6 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{delivery.id}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{delivery.deliveryDate}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-medium ${
                      delivery.status === 'Livré' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {delivery.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {delivery.steps.map((step, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.status === 'done' 
                              ? 'bg-green-100 text-green-700'
                              : step.status === 'current'
                              ? 'bg-blue-100 text-blue-700 animate-pulse'
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {step.status === 'done' && <CheckCircle size={20} />}
                            {step.status === 'current' && <Navigation size={20} />}
                            {step.status === 'pending' && <Clock size={20} />}
                          </div>
                          {idx < delivery.steps.length - 1 && (
                            <div className={`w-1 h-8 ${
                              step.status === 'done' ? 'bg-green-200' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pt-2">
                          <p className="font-medium text-foreground">{step.title}</p>
                          <p className="text-sm text-muted-foreground">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
