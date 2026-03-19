'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

export default function EquipmentPage() {
  const [filter, setFilter] = useState<'all' | 'in-use' | 'available'>('all');

  const equipment = [
    {
      id: 1,
      name: 'Lit Médicalisé',
      type: 'Mobilier',
      patient: 'Fatima Béchir',
      location: 'Tunis Nord',
      status: 'in-use',
      lastMaintenance: '2026-02-20',
    },
    {
      id: 2,
      name: 'Oxygène Portable',
      type: 'Respiration',
      patient: 'Mohamed Ali',
      location: 'Bardo',
      status: 'in-use',
      lastMaintenance: '2026-03-01',
    },
    {
      id: 3,
      name: 'Tensiomètre',
      type: 'Monitoring',
      patient: null,
      location: 'Entrepôt',
      status: 'available',
      lastMaintenance: '2026-02-28',
    },
    {
      id: 4,
      name: 'Perfuseur',
      type: 'Injection',
      patient: 'Aïcha Karray',
      location: 'Nabeul',
      status: 'in-use',
      lastMaintenance: '2026-02-15',
    },
    {
      id: 5,
      name: 'Glucomètre',
      type: 'Monitoring',
      patient: null,
      location: 'Entrepôt',
      status: 'available',
      lastMaintenance: '2026-03-05',
    },
  ];

  const filteredEquipment = equipment.filter((eq) => {
    if (filter === 'in-use') return eq.status === 'in-use';
    if (filter === 'available') return eq.status === 'available';
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/medical-service-dashboard" className="text-primary hover:text-primary/80">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Équipements</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            <Plus size={20} />
            Ajouter Équipement
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex gap-4 mb-6">
          {['all', 'in-use', 'available'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as typeof filter)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:border-primary'
              }`}
            >
              {f === 'all' ? 'Tous' : f === 'in-use' ? 'En Utilisation' : 'Disponibles'}
            </button>
          ))}
        </div>

        {/* Equipment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEquipment.map((eq) => (
            <div key={eq.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{eq.name}</h3>
                  <p className="text-sm text-muted-foreground">{eq.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  eq.status === 'in-use' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {eq.status === 'in-use' ? 'En utilisation' : 'Disponible'}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                {eq.patient && <p className="text-foreground"><strong>Patient:</strong> {eq.patient}</p>}
                <p className="text-foreground"><strong>Localisation:</strong> {eq.location}</p>
                <p className="text-muted-foreground"><strong>Maintenance:</strong> {eq.lastMaintenance}</p>
              </div>
              <button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-muted font-semibold text-sm">
                Détails
              </button>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total d'Équipements</p>
            <p className="text-3xl font-bold text-foreground">{equipment.length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">En Utilisation</p>
            <p className="text-3xl font-bold text-foreground">{equipment.filter((e) => e.status === 'in-use').length}</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Disponibles</p>
            <p className="text-3xl font-bold text-foreground">{equipment.filter((e) => e.status === 'available').length}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
