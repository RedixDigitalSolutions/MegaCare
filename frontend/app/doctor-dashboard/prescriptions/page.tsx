'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DoctorDashboardSidebar } from '@/components/DoctorDashboardSidebar';
import { LogOut, Plus, Download, Eye } from 'lucide-react';

export default function DoctorPrescriptionsPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'doctor') return null;

  const prescriptions = [
    { id: 1, patient: 'Fatima B.', date: '2026-02-25', medicines: 'Amoxicilline 500mg, Paracétamol 1g', status: 'Validée' },
    { id: 2, patient: 'Mohamed K.', date: '2026-02-28', medicines: 'Ibuprofène 400mg, Vitamine C', status: 'Validée' },
    { id: 3, patient: 'Aisha H.', date: '2026-03-01', medicines: 'Antibiotique, Sirop pour toux', status: 'En attente' },
    { id: 4, patient: 'Layla M.', date: '2026-02-22', medicines: 'Aspirin 500mg, Magnésium', status: 'Validée' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar doctorName={user.firstName || 'Amira Mansouri'} />
        
        <main className="flex-1">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Ordonnances</h1>
                <p className="text-muted-foreground mt-1">Gestion des ordonnances</p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2">
                  <Plus size={18} />
                  Nouvelle ordonnance
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
            <div className="space-y-4">
              {prescriptions.map((prescription) => (
                <div key={prescription.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{prescription.patient}</h3>
                      <p className="text-sm text-muted-foreground">{prescription.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      prescription.status === 'Validée' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {prescription.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{prescription.medicines}</p>
                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition text-sm">
                      <Eye size={16} />
                      Voir détails
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition text-sm">
                      <Download size={16} />
                      Télécharger
                    </button>
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
