
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, Truck } from 'lucide-react';

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: '#COM-001',
      date: '2024-01-20',
      status: 'livrée',
      total: 12.49,
      items: ['Paracétamol 500mg x2', 'Vitamine C 1000mg x1'],
      delivery: '2024-01-20',
    },
    {
      id: '#COM-002',
      date: '2024-01-18',
      status: 'en_livraison',
      total: 9.99,
      items: ['Ibuproféne 400mg x1'],
      delivery: '2024-01-21',
    },
    {
      id: '#COM-003',
      date: '2024-01-15',
      status: 'validation',
      total: 15.50,
      items: ['Amoxicilline 500mg x1'],
      delivery: '2024-01-22',
    },
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'validation':
        return { label: 'En attente de validation', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' };
      case 'preparation':
        return { label: 'En préparation', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' };
      case 'en_livraison':
        return { label: 'En livraison', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' };
      case 'livrée':
        return { label: 'Livrée', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' };
      default:
        return { label: status, icon: Package, color: 'text-gray-600', bg: 'bg-gray-50' };
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">Mes Commandes</h1>

          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              const Icon = statusInfo.icon;
              return (
                <Link key={order.id} to={`/pharmacy/order/${order.id}`}>
                  <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-foreground text-lg">{order.id}</h3>
                        <p className="text-sm text-muted-foreground">Commandée le {new Date(order.date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bg}`}>
                        <Icon size={18} className={statusInfo.color} />
                        <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.label}</span>
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Articles: {order.items.join(', ')}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-muted-foreground text-sm">Livraison prévue</p>
                        <p className="font-semibold text-foreground">{new Date(order.delivery).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-sm">Total</p>
                        <p className="text-2xl font-bold text-primary">{order.total.toFixed(2)}€</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {orders.length === 0 && (
            <div className="bg-card border border-border rounded-lg p-12 text-center space-y-4">
              <Package size={48} className="mx-auto text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Aucune commande pour le moment</p>
              <Link to="/pharmacy" className="text-primary hover:underline">Commencer vos achats</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

