'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const mockVisits = [
  {
    id: 1,
    patientName: 'Madame Khaled',
    time: '08:00',
    address: '45 Rue de la Paix, Tunis',
    type: 'Pansement',
    status: 'completed',
    distance: 2.3,
  },
  {
    id: 2,
    patientName: 'Monsieur Ali Ben',
    time: '09:30',
    address: '78 Avenue Bourguiba, Tunis',
    type: 'Injection',
    status: 'completed',
    distance: 3.5,
  },
  {
    id: 3,
    patientName: 'Mme Fatima Zahra',
    time: '11:00',
    address: '120 Rue Mohamed V, La Marsa',
    type: 'Perfusion',
    status: 'in_progress',
    distance: 5.2,
  },
  {
    id: 4,
    patientName: 'Monsieur Riadh',
    time: '13:30',
    address: '33 Rue des Fleurs, Ariana',
    type: 'Kinésithérapie',
    status: 'pending',
    distance: 7.1,
  },
  {
    id: 5,
    patientName: 'Mme Leïla Karmous',
    time: '15:00',
    address: '99 Rue Al-Jazira, Sfax',
    type: 'Prise de sang',
    status: 'pending',
    distance: 12.0,
  },
  {
    id: 6,
    patientName: 'Monsieur Hassan',
    time: '16:30',
    address: '55 Rue de Carthage, Tunis',
    type: 'Pansement',
    status: 'pending',
    distance: 4.5,
  },
];

const statusColors = {
  completed: 'bg-green-50 border-green-200',
  in_progress: 'bg-blue-50 border-blue-200',
  pending: 'bg-gray-50 border-gray-200',
};

const statusLabels = {
  completed: 'Terminée',
  in_progress: 'En cours',
  pending: 'À faire',
};

export default function PlanningPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedView, setSelectedView] = useState<'daily' | 'weekly'>('daily');

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/paramedical-dashboard" className="flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft size={20} />
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Planning des Visites</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* View Selector */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setSelectedView('daily')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedView === 'daily'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary'
            }`}
          >
            Vue Journalière
          </button>
          <button
            onClick={() => setSelectedView('weekly')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedView === 'weekly'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary'
            }`}
          >
            Vue Hebdomadaire
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Visites Aujourd'hui</p>
            <p className="text-2xl font-bold text-foreground">6</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Kilométrage Total</p>
            <p className="text-2xl font-bold text-foreground">34.6 km</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground">Temps Estimé</p>
            <p className="text-2xl font-bold text-foreground">8h 30</p>
          </div>
        </div>

        {/* Visits List */}
        <div className="space-y-4">
          {mockVisits.map((visit) => (
            <div key={visit.id} className={`rounded-xl border p-4 ${statusColors[visit.status as keyof typeof statusColors]}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{visit.patientName}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      visit.status === 'completed' ? 'bg-green-100 text-green-700' :
                      visit.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {statusLabels[visit.status as keyof typeof statusLabels]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{visit.type}</p>
                  
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span>{visit.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span>{visit.address}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-muted-foreground">{visit.distance} km</p>
                  {visit.status === 'pending' && (
                    <button className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                      Commencer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alert */}
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-orange-600 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-900">1 visite en retard</p>
            <p className="text-sm text-orange-800">Visite de Mme Fatima Zahra prévue à 11:00</p>
          </div>
        </div>
      </main>
    </div>
  );
}
