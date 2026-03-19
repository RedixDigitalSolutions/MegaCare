'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Calendar, Clock } from 'lucide-react';

export default function SchedulePage() {
  const [visits, setVisits] = useState([
    { id: 1, patient: 'Fatima Ben Ali', staff: 'Samir Khalifa', date: '2024-03-08', time: '09:00', duration: '1h', status: 'Planifié' },
    { id: 2, patient: 'Mohammed Gharbi', staff: 'Nadia Fayed', date: '2024-03-08', time: '11:00', duration: '45min', status: 'Planifié' },
    { id: 3, patient: 'Leila Mansouri', staff: 'Ali Ben Mahmoud', date: '2024-03-08', time: '14:00', duration: '1h30', status: 'En cours' },
    { id: 4, patient: 'Ahmed Nasser', staff: 'Hassan Abidi', date: '2024-03-09', time: '10:00', duration: '2h', status: 'Planifié' },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/medical-service-dashboard" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Planification des Visites</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
            <Plus size={20} />
            Programmer Visite
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Calendar View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Schedule List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground mb-6">Visites Programmées</h2>
            {visits.map((visit) => (
              <div key={visit.id} className="bg-card rounded-xl border border-border p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{visit.patient}</h3>
                    <p className="text-sm text-muted-foreground">{visit.staff}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    visit.status === 'En cours' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {visit.status}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {visit.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {visit.time} - {visit.duration}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-medium">
                    Modifier
                  </button>
                  <button className="flex-1 px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition text-sm font-medium">
                    Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Statistiques</h2>
            
            <div className="bg-card rounded-xl border border-border p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Visites Aujourd'hui</p>
              <p className="text-3xl font-bold text-foreground">3</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Visites Cette Semaine</p>
              <p className="text-3xl font-bold text-foreground">12</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-2">
              <p className="text-sm text-muted-foreground">Heures de Travail</p>
              <p className="text-3xl font-bold text-foreground">24.5h</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
