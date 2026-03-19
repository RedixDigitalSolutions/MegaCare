'use client';

import Link from 'next/link';
import { Package, TrendingUp, ShoppingCart, AlertCircle, Plus, Download, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PharmacyDashboardPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (!isLoading && user && user.role !== 'pharmacy') {
      const dashboards = {
        patient: '/dashboard',
        doctor: '/doctor-dashboard',
      };
      router.push(dashboards[user.role as keyof typeof dashboards]);
    }
  }, [isLoading, isAuthenticated, user, router]);

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

  if (!isAuthenticated || !user || user.role !== 'pharmacy') {
    return null;
  }

  const pharmacyName = user.firstName || 'Pharmacie Central';
  const agreementId = user.pharmacyId || 'PH-001-2024';

  const todayDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const kpiCards = [
    {
      icon: Package,
      title: 'Stock Total',
      value: '1,245',
      subtitle: '+120 nouveaux produits',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: ShoppingCart,
      title: 'Commandes',
      value: '28',
      subtitle: '+5 en attente de traitement',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: TrendingUp,
      title: 'Chiffre d\'affaires',
      value: '12,450 DT',
      subtitle: 'Cette semaine',
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      icon: AlertCircle,
      title: 'Produits en alerte',
      value: '8',
      subtitle: 'Stock faible',
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const pendingOrders = [
    {
      id: 'CMD-P-001',
      customer: 'Fatima Ben Hamida',
      items: 4,
      total: 245.50,
      orderDate: 'Aujourd\'hui 09:15',
      status: 'En attente',
    },
    {
      id: 'CMD-P-002',
      customer: 'Mohamed Karim',
      items: 2,
      total: 89.00,
      orderDate: 'Aujourd\'hui 11:42',
      status: 'En préparation',
    },
    {
      id: 'CMD-P-003',
      customer: 'Aisha Mansouri',
      items: 6,
      total: 356.75,
      orderDate: 'Hier 15:30',
      status: 'Prête pour livraison',
    },
  ];

  const lowStockProducts = [
    { name: 'Aspirine 500mg', current: 12, minimum: 50, reorder: 100 },
    { name: 'Ibuprofène 200mg', current: 8, minimum: 40, reorder: 80 },
    { name: 'Amoxicilline 500mg', current: 15, minimum: 60, reorder: 120 },
    { name: 'Vitamine C 1000mg', current: 22, minimum: 75, reorder: 150 },
  ];

  const topSelling = [
    { name: 'Paracétamol 500mg', sold: 342, revenue: 2,568 },
    { name: 'Vitamine D 2000UI', sold: 256, revenue: 3,840 },
    { name: 'Oméga-3', sold: 189, revenue: 4,725 },
    { name: 'Masques chirurgicaux', sold: 1245, revenue: 1,245 },
    { name: 'Désinfectant 500ml', sold: 456, revenue: 2,280 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col">
        {/* Header */}
        <header className="bg-card border-b border-border p-6 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Tableau de bord Pharmacie
              </h1>
              <p className="text-muted-foreground mt-1">{todayDate}</p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition font-medium flex items-center gap-2">
                <Download size={20} />
                Rapport
              </button>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2">
                <Plus size={20} />
                Ajouter produit
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 max-w-7xl mx-auto w-full space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-card rounded-xl border border-border p-6 space-y-3"
                >
                  <div className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
              );
            })}
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-red-900 flex items-center gap-2">
                <AlertCircle size={20} />
                {lowStockProducts.length} produits en stock faible
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lowStockProducts.map((product, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-lg p-4 border border-red-100 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.current} / Minimum: {product.minimum}
                      </p>
                    </div>
                    <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition font-medium">
                      Recommander
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Pending Orders */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-foreground">Commandes récentes</h3>
                <Link href="#" className="text-primary hover:underline text-sm font-medium">
                  Voir toutes
                </Link>
              </div>

              <div className="space-y-3">
                {pendingOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`rounded-lg p-4 border transition ${
                      order.status === 'En attente'
                        ? 'bg-orange-50 border-orange-200'
                        : order.status === 'En préparation'
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.id}</p>
                      </div>
                      <p className="font-bold text-primary text-lg">{order.total} DT</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-current/10">
                      <p className="text-xs text-muted-foreground">
                        {order.items} article{order.items > 1 ? 's' : ''} • {order.orderDate}
                      </p>
                      <div className="flex gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          order.status === 'En attente'
                            ? 'bg-orange-100 text-orange-700'
                            : order.status === 'En préparation'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {order.status}
                        </span>
                        <button className="text-xs px-2 py-1 border border-primary text-primary rounded hover:bg-primary/5 transition">
                          Voir détails
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inventory Summary */}
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border-2 border-primary/30 p-6 space-y-4">
              <h3 className="font-bold text-foreground text-lg">État du stock</h3>
              <div className="space-y-4">
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Produits actifs</p>
                  <p className="text-3xl font-bold text-primary">1,245</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">Valeur du stock</p>
                  <p className="text-3xl font-bold text-primary">45,320 DT</p>
                </div>
                <div className="bg-white/60 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">En alerte</p>
                  <p className="text-3xl font-bold text-red-500">8</p>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium mt-4">
                Gérer le stock
              </button>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Top produits vendus</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {topSelling.map((product, idx) => (
                <div key={idx} className="bg-secondary/30 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-foreground text-sm">{product.name}</p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-primary">{product.sold}</p>
                    <p className="text-xs text-muted-foreground">unités vendues</p>
                  </div>
                  <p className="text-sm font-semibold text-green-600">{product.revenue} DT</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="#" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition text-center space-y-3">
              <div className="text-3xl">📦</div>
              <h4 className="font-semibold text-foreground">Gérer stock</h4>
              <p className="text-sm text-muted-foreground">Ajouter/modifier produits</p>
            </Link>

            <Link href="#" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition text-center space-y-3">
              <div className="text-3xl">🚚</div>
              <h4 className="font-semibold text-foreground">Livraisons</h4>
              <p className="text-sm text-muted-foreground">Suivi des commandes</p>
            </Link>

            <Link href="#" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition text-center space-y-3">
              <div className="text-3xl">📊</div>
              <h4 className="font-semibold text-foreground">Rapports</h4>
              <p className="text-sm text-muted-foreground">Analytiques et revenus</p>
            </Link>

            <Link href="#" className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition text-center space-y-3">
              <div className="text-3xl">⚙️</div>
              <h4 className="font-semibold text-foreground">Paramètres</h4>
              <p className="text-sm text-muted-foreground">Configuration pharmacie</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
