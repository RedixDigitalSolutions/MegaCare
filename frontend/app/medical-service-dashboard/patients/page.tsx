'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, Trash2, Edit } from 'lucide-react';

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState([
    { id: 1, name: 'Fatima Ben Ali', age: 65, condition: 'Suivi post-opératoire', status: 'En cours', startDate: '2024-01-15' },
    { id: 2, name: 'Mohammed Gharbi', age: 78, condition: 'Rééducation cardiaque', status: 'En cours', startDate: '2024-01-20' },
    { id: 3, name: 'Leila Mansouri', age: 72, condition: 'Traitement diabète', status: 'Suspendu', startDate: '2023-12-01' },
    { id: 4, name: 'Ahmed Nasser', age: 85, condition: 'Soins palliatifs', status: 'En cours', startDate: '2023-11-10' },
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
            <Link href="/medical-service-dashboard" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Patients</h1>
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

        {/* Patients Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nom</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Âge</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Condition</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Depuis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.age} ans</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.condition}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        patient.status === 'En cours' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{patient.startDate}</td>
                    <td className="px-6 py-4 text-sm flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition text-primary">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
