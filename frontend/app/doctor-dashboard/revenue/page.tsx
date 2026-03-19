'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DoctorDashboardSidebar } from '@/components/DoctorDashboardSidebar';
import { LogOut, TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';

export default function DoctorRevenuePage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'doctor') return null;

  const stats = [
    { label: 'Revenus ce mois', value: '2,450 DT', icon: DollarSign, change: '+12%' },
    { label: 'Consultations', value: '28', icon: Calendar, change: '+5' },
    { label: 'Patients actifs', value: '156', icon: Users, change: '+8' },
    { label: 'Tendance', value: 'Positive', icon: TrendingUp, change: '+15%' },
  ];

  const transactions = [
    { date: '2026-02-28', patient: 'Fatima B.', amount: '80 DT', type: 'Consultation vidéo' },
    { date: '2026-02-27', patient: 'Mohamed K.', amount: '100 DT', type: 'Consultation en cabinet' },
    { date: '2026-02-26', patient: 'Aisha H.', amount: '80 DT', type: 'Consultation vidéo' },
    { date: '2026-02-25', patient: 'Salim D.', amount: '100 DT', type: 'Consultation en cabinet' },
    { date: '2026-02-24', patient: 'Layla M.', amount: '80 DT', type: 'Consultation vidéo' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar doctorName={user.firstName || 'Amira Mansouri'} />
        
        <main className="flex-1">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mes Revenus</h1>
                <p className="text-muted-foreground mt-1">Statistiques financières</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <h3 className="font-semibold text-lg text-foreground">Transactions récentes</h3>
              </div>
              <div className="divide-y divide-border">
                {transactions.map((trans, idx) => (
                  <div key={idx} className="p-6 flex items-center justify-between hover:bg-muted/50 transition">
                    <div>
                      <p className="font-medium text-foreground">{trans.patient}</p>
                      <p className="text-sm text-muted-foreground">{trans.type} - {trans.date}</p>
                    </div>
                    <p className="font-semibold text-green-600">{trans.amount}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
