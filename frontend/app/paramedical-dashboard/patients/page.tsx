'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, MessageCircle, FileText } from 'lucide-react';

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([
    { id: 1, name: 'Fatima Ben Ali', age: 65, condition: 'Suivi post-opératoire', nextAppointment: '2024-03-08', status: 'Suivi' },
    { id: 2, name: 'Mohammed Gharbi', age: 72, condition: 'Rééducation physique', nextAppointment: '2024-03-08', status: 'Actif' },
    { id: 3, name: 'Leila Mansouri', age: 58, condition: 'Soins de plaies', nextAppointment: '2024-03-09', status: 'Actif' },
    { id: 4, name: 'Ahmed Nasser', age: 80, condition: 'Kinésithérapie', nextAppointment: '2024-03-10', status: 'Suivi' },
    { id: 5, name: 'Sara Meddeb', age: 52, condition: 'Massage thérapeutique', nextAppointment: '2024-03-12', status: 'Actif' },
  ]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-2xl font-bold text-foreground">Mes Patients</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
            <Plus size={20} />
            Ajouter Patient
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
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div key={patient.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{patient.name}</h3>
                  <p className="text-sm text-muted-foreground">{patient.age} ans</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  patient.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {patient.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground"><span className="font-medium text-foreground">Condition:</span> {patient.condition}</p>
                <p className="text-muted-foreground"><span className="font-medium text-foreground">Prochain RDV:</span> {patient.nextAppointment}</p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-medium">
                  <FileText size={16} />
                  Dossier
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition text-sm font-medium">
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun patient trouvé</p>
          </div>
        )}
      </main>
    </div>
  );
}
