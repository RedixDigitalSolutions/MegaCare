
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LogOut, Truck, Clock, CheckCircle } from 'lucide-react';

export default function PharmacyOrdersPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'pharmacy')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'pharmacy') return null;

  const orders = [
    { id: 1, supplier: 'Pharma Plus', date: '2026-02-28', items: 15, status: 'Livré', total: '450 DT' },
    { id: 2, supplier: 'Med Care', date: '2026-02-25', items: 8, status: 'En route', total: '240 DT' },
    { id: 3, supplier: 'Vita Lab', date: '2026-02-20', items: 12, status: 'Livré', total: '380 DT' },
    { id: 4, supplier: 'Medicare', date: '2026-02-18', items: 10, status: 'Livré', total: '320 DT' },
    { id: 5, supplier: 'Pharma Plus', date: '2026-03-01', items: 20, status: 'En attente', total: '600 DT' },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Livré':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'En route':
        return <Truck size={20} className="text-blue-600" />;
      case 'En attente':
        return <Clock size={20} className="text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Commandes</h1>
            <p className="text-muted-foreground mt-1">Historique des commandes fournisseurs</p>
          </div>
          <button 
            onClick={logout}
            className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(order.status)}
                    <h3 className="font-semibold text-lg text-foreground">{order.supplier}</h3>
                  </div>
                  <p className="text-muted-foreground">
                    {order.date} - {order.items} articles
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-foreground mb-2">{order.total}</p>
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    order.status === 'Livré' 
                      ? 'bg-green-100 text-green-700' 
                      : order.status === 'En route'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
