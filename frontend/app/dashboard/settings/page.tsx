'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';
import { useEffect } from 'react';

export default function SettingsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />
        
        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-2xl">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
              <p className="text-muted-foreground mt-2">Gérez vos préférences et informations personnelles</p>
            </div>

            {/* Profile Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <User size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Profil personnel</h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
                    <input 
                      type="text" 
                      defaultValue={user.firstName}
                      readOnly
                      className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-foreground" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                    <input 
                      type="text" 
                      defaultValue={user.lastName}
                      readOnly
                      className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-foreground" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input 
                    type="email" 
                    defaultValue={user.email}
                    readOnly
                    className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-foreground" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                  <input 
                    type="tel" 
                    defaultValue={user.phone || '+216 XX XXX XXX'}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground" 
                  />
                </div>

                <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2">
                  <Save size={18} />
                  Enregistrer les modifications
                </button>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Lock size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Sécurité</h2>
              </div>

              <div className="space-y-4">
                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Changer le mot de passe
                </button>
                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Authentification à deux facteurs
                </button>
                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Gérer les sessions actives
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Bell size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Notifications</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
                  <span className="text-foreground">Rappels de rendez-vous</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
                  <span className="text-foreground">Suivi de commandes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-border" />
                  <span className="text-foreground">Avis des médecins</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-border" />
                  <span className="text-foreground">Offres spéciales</span>
                </label>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Shield size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Confidentialité</h2>
              </div>

              <div className="space-y-4">
                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Télécharger mes données
                </button>
                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Consulter la politique de confidentialité
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
