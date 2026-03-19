'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, MapPin, Clock } from 'lucide-react';

export default function TripsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState([
    { id: 1, patient: 'Fatima Ben Ali', from: 'Tunis', to: 'Hôpital La Rabta', status: 'En cours', time: '14:30', distance: '12 km' },
    { id: 2, patient: 'Mohammed Gharbi', from: 'Sfax', to: 'Clinique Jawhara', status: 'Complété', time: '10:45', distance: '8 km' },
    { id: 3, patient: 'Leila Mansouri', from: 'Bizerte', to: 'Clinique Bourguiba', status: 'Planifié', time: '16:00', distance: '15 km' },
    { id: 4, patient: 'Ahmed Nasser', from: 'Marsa', to: 'Clinique Atlas', status: 'En cours', time: '15:20', distance: '22 km' },
  ]);

  const filteredTrips = trips.filter(t => 
    t.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.to.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Complété': return 'bg-green-100 text-green-700';
      case 'En cours': return 'bg-blue-100 text-blue-700';
      case 'Planifié': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/transport-dashboard" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Trajets</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
            <Plus size={20} />
            Nouveau Trajet
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
              placeholder="Rechercher un trajet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <div key={trip.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{trip.patient}</h3>
                  <p className="text-sm text-muted-foreground">Trajet Médical</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                  {trip.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">De</p>
                    <p className="font-medium text-foreground">{trip.from}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Vers</p>
                    <p className="font-medium text-foreground">{trip.to}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Distance</p>
                    <p className="font-medium text-foreground">{trip.distance}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-medium">
                  Suivi GPS
                </button>
                <button className="flex-1 px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition text-sm font-medium">
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTrips.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun trajet trouvé</p>
          </div>
        )}
      </main>
    </div>
  );
}
