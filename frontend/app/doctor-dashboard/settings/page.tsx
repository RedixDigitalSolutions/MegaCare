'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DoctorDashboardSidebar } from '@/components/DoctorDashboardSidebar';
import { LogOut, Save } from 'lucide-react';

export default function DoctorSettingsPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'doctor')) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'doctor') return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar doctorName={user.firstName || 'Amira Mansouri'} />
        
        <main className="flex-1">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
                <p className="text-muted-foreground mt-1">Gérez votre profil et préférences</p>
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

          <div className="p-6 max-w-2xl">
            <div className="bg-card rounded-xl border border-border p-8 space-y-8">
              
              {/* Profile Section */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Profil</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
                    <input type="text" value={user.firstName} className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                    <input type="text" value={user.lastName} className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <input type="email" value={user.email} className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Spécialité</label>
                    <input type="text" value={user.specialization} className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Numéro de licence</label>
                    <input type="text" value={user.doctorId} className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" />
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="border-t border-border pt-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Notifications</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-foreground">Notifications pour nouveaux RDV</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-foreground">Rappels d'agenda</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-foreground">Avis de nouveaux avis patients</span>
                  </label>
                </div>
              </div>

              {/* Security Section */}
              <div className="border-t border-border pt-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">Sécurité</h2>
                <button className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition font-medium">
                  Changer le mot de passe
                </button>
              </div>

              {/* Save Button */}
              <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center justify-center gap-2">
                <Save size={20} />
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
