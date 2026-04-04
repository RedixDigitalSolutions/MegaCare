
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, AlertTriangle } from 'lucide-react';

const mockSupplies = [
  { id: 1, name: 'Pansements stériles', used: 15, status: 'good' },
  { id: 2, name: 'Seringues 10ml', used: 8, status: 'good' },
  { id: 3, name: 'Cathéters IV', used: 3, status: 'low' },
  { id: 4, name: 'Gants médicaux', used: 50, status: 'good' },
  { id: 5, name: 'Oxygène', used: 45, status: 'low' },
  { id: 6, name: 'Alcool médical', used: 1, status: 'good' },
];

export default function SuppliesPage() {
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
          <h1 className="text-2xl font-bold text-foreground">Gestion du Matériel</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Alert */}
        <div className="mb-8 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-900">2 articles manquants</p>
            <p className="text-sm text-orange-800">Cathéters IV et Oxygène sont faibles</p>
          </div>
        </div>

        {/* Supplies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockSupplies.map((supply) => (
            <div key={supply.id} className="bg-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{supply.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  supply.status === 'good' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {supply.status === 'good' ? 'Bon Stock' : 'Stock Faible'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Utilisé aujourd'hui</span>
                  <span className="font-semibold text-foreground">{supply.used}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${supply.status === 'good' ? 'bg-green-500' : 'bg-orange-500'}`}
                    style={{ width: `${Math.min(supply.used * 5, 100)}%` }}
                  />
                </div>
              </div>

              {supply.status === 'low' && (
                <button className="w-full px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-semibold">
                  Demander une Livraison
                </button>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
