'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, Pill, Eye } from 'lucide-react';

export default function PrescriptionsPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'patient')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'patient') return null;

  const prescriptions = [
    { id: 1, doctor: 'Dr. Amira Mansouri', date: '2026-02-25', medicines: ['Amoxicilline 500mg', 'Paracétamol 1g'], duration: '7 jours' },
    { id: 2, doctor: 'Dr. Fatima Zahra', date: '2026-02-20', medicines: ['Crème dermatologique'], duration: 'Au besoin' },
    { id: 3, doctor: 'Dr. Riadh Gharbi', date: '2026-02-15', medicines: ['Voltarène 75mg', 'Magnésium'], duration: '10 jours' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mes Ordonnances</h1>
            <p className="text-muted-foreground mt-1">Vos prescriptions médicales</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard" className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium">
              Retour
            </Link>
            <button 
              onClick={logout}
              className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div key={rx.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <Pill size={20} className="text-blue-600" />
                    {rx.doctor}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{rx.date} - Durée: {rx.duration}</p>
                </div>
                <button className="flex items-center gap-2 text-primary hover:underline">
                  <Eye size={18} />
                  Détails
                </button>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm font-medium text-foreground mb-2">Médicaments:</p>
                <ul className="space-y-1">
                  {rx.medicines.map((med, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground">• {med}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
