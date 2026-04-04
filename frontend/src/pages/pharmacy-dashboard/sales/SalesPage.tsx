
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LogOut, TrendingUp, ShoppingCart, DollarSign } from 'lucide-react';

export default function PharmacySalesPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'pharmacy')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'pharmacy') return null;

  const stats = [
    { label: 'Ventes ce mois', value: '8,500 DT', icon: DollarSign, change: '+18%' },
    { label: 'Commandes', value: '142', icon: ShoppingCart, change: '+12' },
    { label: 'Clients', value: '324', icon: TrendingUp, change: '+45' },
  ];

  const salesByMedicine = [
    { medicine: 'Amoxicilline 500mg', quantity: 245, revenue: '1,960 DT' },
    { medicine: 'Paracétamol 1g', quantity: 418, revenue: '1,463 DT' },
    { medicine: 'Ibuprofène 400mg', quantity: 156, revenue: '780 DT' },
    { medicine: 'Sirop pour toux', quantity: 89, revenue: '1,068 DT' },
    { medicine: 'Vitamine C', quantity: 203, revenue: '1,218 DT' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Ventes</h1>
            <p className="text-muted-foreground mt-1">Analyse des ventes et statistiques</p>
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

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mt-2">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={24} className="text-primary" />
                  </div>
                </div>
                <p className="text-sm text-green-600 font-medium">{stat.change} cette période</p>
              </div>
            );
          })}
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-lg text-foreground">Top 5 Médicaments</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Médicament</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Quantité vendue</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Revenu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {salesByMedicine.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-medium text-foreground">{item.medicine}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.quantity} unités</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">{item.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
