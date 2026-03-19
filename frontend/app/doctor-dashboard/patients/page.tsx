'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DoctorDashboardSidebar } from '@/components/DoctorDashboardSidebar';
import { LogOut, Search, Phone, Mail, FileText } from 'lucide-react';

export default function DoctorPatientsPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'doctor') return null;

  const patients = [
    { id: 1, name: 'Fatima B.', age: 28, phone: '+216 98 123 456', lastVisit: '2026-02-25', status: 'Actif' },
    { id: 2, name: 'Mohamed K.', age: 45, phone: '+216 98 234 567', lastVisit: '2026-02-20', status: 'Actif' },
    { id: 3, name: 'Aisha H.', age: 32, phone: '+216 98 345 678', lastVisit: '2026-02-28', status: 'Actif' },
    { id: 4, name: 'Salim D.', age: 55, phone: '+216 98 456 789', lastVisit: '2026-02-15', status: 'Inactif' },
    { id: 5, name: 'Layla M.', age: 29, phone: '+216 98 567 890', lastVisit: '2026-02-22', status: 'Actif' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar doctorName={user.firstName || 'Amira Mansouri'} />
        
        <main className="flex-1">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mes Patients</h1>
                <p className="text-muted-foreground mt-1">{patients.length} patients</p>
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
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center gap-2">
                <Search size={20} className="text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Rechercher un patient..." 
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nom</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Âge</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Téléphone</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Dernière visite</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Statut</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {patients.map((patient) => (
                      <tr key={patient.id} className="hover:bg-muted/50 transition">
                        <td className="px-6 py-4 font-medium text-foreground">{patient.name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{patient.age} ans</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone size={16} />
                            {patient.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">{patient.lastVisit}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            patient.status === 'Actif' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="flex items-center gap-2 text-primary hover:underline">
                            <FileText size={18} />
                            Dossier
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
