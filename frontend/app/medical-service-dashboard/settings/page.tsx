'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    companyName: 'HAD Tunisie',
    email: 'contact@hadtunisie.tn',
    phone: '+216 71 123 456',
    address: 'Tunis, Tunisie',
    licenseNumber: 'HAD-2024-001',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/medical-service-dashboard" className="text-primary hover:text-primary/80">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Paramètres du Service</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Service Information */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Informations du Service</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Nom du Service</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Adresse</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Numéro de Licence</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <button className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold">
            Enregistrer les Modifications
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-6">Notifications</h2>
          <div className="space-y-4">
            {[
              { label: 'Alertes Patients Urgentes', enabled: true },
              { label: 'Confirmations de Visites', enabled: true },
              { label: 'Rappels de Paiement', enabled: true },
              { label: 'Mises à Jour du Système', enabled: false },
            ].map((notification) => (
              <div key={notification.label} className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">{notification.label}</label>
                <input
                  type="checkbox"
                  defaultChecked={notification.enabled}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Sécurité</h2>
          <div className="space-y-4">
            <button className="w-full px-4 py-3 border border-border rounded-lg hover:bg-muted font-semibold text-sm text-left">
              Changer le Mot de Passe
            </button>
            <button className="w-full px-4 py-3 border border-border rounded-lg hover:bg-muted font-semibold text-sm text-left">
              Authentification à Deux Facteurs
            </button>
            <button className="w-full px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 font-semibold text-sm text-left text-red-600">
              Supprimer le Compte
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
