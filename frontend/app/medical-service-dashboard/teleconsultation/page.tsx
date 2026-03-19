'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, Video, MessageSquare } from 'lucide-react';

export default function TeleconsultationPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'history'>('upcoming');

  const consultations = [
    {
      id: 1,
      patient: 'Fatima Béchir',
      time: 'Aujourd\'hui 14:00',
      type: 'video',
      status: 'upcoming',
    },
    {
      id: 2,
      patient: 'Mohamed Ali',
      time: 'Aujourd\'hui 15:30',
      type: 'video',
      status: 'upcoming',
    },
    {
      id: 3,
      patient: 'Aïcha Karray',
      time: 'Hier 10:00',
      type: 'video',
      status: 'completed',
      duration: '25 min',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/medical-service-dashboard" className="text-primary hover:text-primary/80">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Téléconsultations</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'upcoming' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            À Venir
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'completed' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            Complétées
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'history' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            Historique
          </button>
        </div>

        {/* Upcoming Consultations */}
        {activeTab === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultations
              .filter((c) => c.status === 'upcoming')
              .map((consultation) => (
                <div key={consultation.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{consultation.patient}</h3>
                      <p className="text-sm text-muted-foreground">{consultation.time}</p>
                    </div>
                    {consultation.type === 'video' && <Video size={24} className="text-primary" />}
                  </div>
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold text-sm">
                      Démarrer l'appel
                    </button>
                    <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-semibold">
                      <MessageSquare size={18} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Completed Consultations */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {consultations
              .filter((c) => c.status === 'completed')
              .map((consultation) => (
                <div key={consultation.id} className="bg-card rounded-xl border border-border p-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{consultation.patient}</h3>
                    <p className="text-sm text-muted-foreground">{consultation.time} • Durée: {consultation.duration}</p>
                  </div>
                  <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted font-semibold text-sm">
                    Voir le résumé
                  </button>
                </div>
              ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Ce Mois</p>
            <p className="text-3xl font-bold text-foreground">24</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Temps Total</p>
            <p className="text-3xl font-bold text-foreground">15h</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Satisfaction</p>
            <p className="text-3xl font-bold text-foreground">4.8/5</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">À Venir</p>
            <p className="text-3xl font-bold text-foreground">3</p>
          </div>
        </div>
      </main>
    </div>
  );
}
