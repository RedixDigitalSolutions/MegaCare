'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { ChevronLeft, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    specialization: user?.specialization || '',
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushNotifications: true,
    dailyReport: true,
  });

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Paramètres sauvegardés avec succès');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/paramedical-dashboard" className="flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft size={20} />
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Profil Personnel</h2>

          <form onSubmit={handleSave} className="bg-card border border-border rounded-xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Prénom</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Nom</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-foreground mb-2">Spécialisation</label>
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner une spécialisation</option>
                  <option value="infirmier">Infirmier</option>
                  <option value="aide-soignant">Aide-Soignant</option>
                  <option value="kinetherapeute">Kinésithérapeute</option>
                  <option value="psychologue">Psychologue</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Sauvegarder les Modifications
            </button>
          </form>
        </div>

        {/* Notifications Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Notifications</h2>

          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.emailAlerts}
                onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <div>
                <p className="font-semibold text-foreground">Alertes par Email</p>
                <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.smsAlerts}
                onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <div>
                <p className="font-semibold text-foreground">Alertes par SMS</p>
                <p className="text-sm text-muted-foreground">Recevoir les alertes urgentes par SMS</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.pushNotifications}
                onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <div>
                <p className="font-semibold text-foreground">Notifications Push</p>
                <p className="text-sm text-muted-foreground">Recevoir les notifications sur votre appareil</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.dailyReport}
                onChange={(e) => setNotifications({ ...notifications, dailyReport: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <div>
                <p className="font-semibold text-foreground">Rapport Journalier</p>
                <p className="text-sm text-muted-foreground">Recevoir un résumé quotidien de vos activités</p>
              </div>
            </label>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Sécurité</h2>

          <div className="bg-card border border-border rounded-xl p-8 space-y-4">
            <button className="w-full px-6 py-3 bg-card border border-border text-foreground rounded-lg font-semibold hover:border-primary transition">
              Changer le Mot de Passe
            </button>
            <button className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition">
              Déconnexion de Tous les Appareils
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <div className="text-center pt-8 border-t border-border">
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Déconnexion
          </button>
        </div>
      </main>
    </div>
  );
}
