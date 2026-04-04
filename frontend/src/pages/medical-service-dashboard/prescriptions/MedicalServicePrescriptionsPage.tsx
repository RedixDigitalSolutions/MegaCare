
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search } from 'lucide-react';

export default function PrescriptionsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);

  const prescriptions = [
    {
      id: 1,
      patient: 'Fatima Béchir',
      medication: 'Amoxicilline 500mg',
      dosage: '3 fois par jour',
      duration: '10 jours',
      date: '2026-03-09',
      status: 'active',
    },
    {
      id: 2,
      patient: 'Mohamed Ali',
      medication: 'Métoprolol 50mg',
      dosage: '2 fois par jour',
      duration: 'Permanent',
      date: '2026-02-15',
      status: 'active',
    },
    {
      id: 3,
      patient: 'Aïcha Karray',
      medication: 'Doliprane 1000mg',
      dosage: 'Au besoin',
      duration: '5 jours',
      date: '2026-03-05',
      status: 'completed',
    },
  ];

  const filteredPrescriptions = prescriptions.filter((p) =>
    p.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/medical-service-dashboard" className="text-primary hover:text-primary/80">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Ordonnances & Traitements</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus size={20} />
            Nouvelle Ordonnance
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Rechercher une ordonnance ou un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Prescriptions Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Médicament</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Posologie</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Durée</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="border-b border-border hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm text-foreground">{prescription.patient}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-semibold">{prescription.medication}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{prescription.dosage}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{prescription.duration}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{prescription.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        prescription.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prescription.status === 'active' ? 'Actif' : 'Complété'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-primary hover:underline text-sm font-semibold">Modifier</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Ordonnances Actives</p>
            <p className="text-3xl font-bold text-foreground">14</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Complétées</p>
            <p className="text-3xl font-bold text-foreground">8</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Cette Semaine</p>
            <p className="text-3xl font-bold text-foreground">3</p>
          </div>
        </div>
      </main>
    </div>
  );
}
