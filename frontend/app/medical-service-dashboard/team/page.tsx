'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Search, MessageCircle, CheckCircle } from 'lucide-react';

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [team, setTeam] = useState([
    { id: 1, name: 'Samir Khalifa', role: 'Infirmier', status: 'Actif', patients: 4 },
    { id: 2, name: 'Nadia Fayed', role: 'Infirmière', status: 'Actif', patients: 5 },
    { id: 3, name: 'Ali Ben Mahmoud', role: 'Aide-soignant', status: 'Actif', patients: 3 },
    { id: 4, name: 'Fatma Krichene', role: 'Infirmière', status: 'En pause', patients: 0 },
    { id: 5, name: 'Hassan Abidi', role: 'Thérapeute', status: 'Actif', patients: 2 },
  ]);

  const filteredTeam = team.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-2xl font-bold text-foreground">Gestion de l'Équipe</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
            <Plus size={20} />
            Ajouter Membre
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
              placeholder="Rechercher un membre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <div key={member.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  member.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Patients assignés: <span className="font-semibold text-foreground">{member.patients}</span></p>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-medium">
                  <MessageCircle size={16} />
                  Contacter
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition text-sm font-medium">
                  <CheckCircle size={16} />
                  Voir
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTeam.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun membre trouvé</p>
          </div>
        )}
      </main>
    </div>
  );
}
