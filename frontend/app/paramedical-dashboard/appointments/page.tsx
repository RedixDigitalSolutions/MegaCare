'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Calendar, Clock, MapPin } from 'lucide-react';

export default function AppointmentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'Fatima Ben Ali', type: 'Soins infirmiers', date: '2024-03-08', time: '10:00', location: 'Domicile', status: 'Confirmé' },
    { id: 2, patient: 'Mohammed Gharbi', type: 'Kinésithérapie', date: '2024-03-08', time: '14:00', location: 'Cabinet', status: 'Confirmé' },
    { id: 3, patient: 'Leila Mansouri', type: 'Soins infirmiers', date: '2024-03-09', time: '09:30', location: 'Domicile', status: 'Confirmé' },
    { id: 4, patient: 'Ahmed Nasser', type: 'Massage thérapeutique', date: '2024-03-09', time: '15:00', location: 'Cabinet', status: 'En attente' },
  ]);

  const filteredAppointments = appointments.filter(a => 
    a.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/paramedical-dashboard" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Mon Agenda</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
            <Plus size={20} />
            Ajouter Rendez-vous
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Rechercher un rendez-vous..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{appointment.patient}</h3>
                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  appointment.status === 'Confirmé' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {appointment.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{appointment.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-medium">
                  Voir Détails
                </button>
                <button className="flex-1 px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition text-sm font-medium">
                  Modifier
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun rendez-vous trouvé</p>
          </div>
        )}
      </main>
    </div>
  );
}
