'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, Plus, AlertTriangle } from 'lucide-react';

export default function PharmacyStockPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'pharmacy')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'pharmacy') return null;

  const stock = [
    { id: 1, name: 'Amoxicilline 500mg', quantity: 250, minStock: 100, supplier: 'Pharma Plus', price: '8 DT' },
    { id: 2, name: 'Paracétamol 1g', quantity: 45, minStock: 100, supplier: 'Med Care', price: '3.5 DT', warning: true },
    { id: 3, name: 'Ibuprofène 400mg', quantity: 180, minStock: 100, supplier: 'Pharma Plus', price: '5 DT' },
    { id: 4, name: 'Vitamine C', quantity: 20, minStock: 50, supplier: 'Vita Lab', price: '6 DT', warning: true },
    { id: 5, name: 'Sirop pour toux', quantity: 120, minStock: 50, supplier: 'Medicare', price: '12 DT' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion du Stock</h1>
            <p className="text-muted-foreground mt-1">Suivi des médicaments en stock</p>
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2">
              <Plus size={18} />
              Ajouter un produit
            </button>
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

      <div className="p-6">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Médicament</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Min Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Fournisseur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Prix</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stock.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 font-medium text-foreground">{item.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.quantity} unités</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.minStock} unités</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.supplier}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.price}</td>
                    <td className="px-6 py-4">
                      {item.warning ? (
                        <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-lg text-xs font-medium">
                          <AlertTriangle size={14} />
                          Stock faible
                        </span>
                      ) : (
                        <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg text-xs font-medium">Normal</span>
                      )}
                    </td>
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
