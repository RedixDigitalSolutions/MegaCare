
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, Download } from 'lucide-react';
import { useState } from 'react';

const mockReports = [
  {
    id: 1,
    date: '2024-03-08',
    type: 'Journalier',
    visites: 6,
    heures: '8h 30',
    patients: 'Mme Khaled, M. Ben Ali, Mme Zahra, M. Riadh, Mme Karmous, M. Hassan',
  },
  {
    id: 2,
    date: '2024-03-07',
    type: 'Journalier',
    visites: 5,
    heures: '7h 45',
    patients: 'Mme Khaled, M. Ben Ali, Mme Zahra, M. Riadh, Mme Karmous',
  },
  {
    id: 3,
    date: '2024-03-04 à 2024-03-08',
    type: 'Hebdomadaire',
    visites: 28,
    heures: '38h 30',
    patients: '12 patients suivis',
  },
];

const mockHistory = [
  { date: '2024-03-08 11:30', patient: 'Mme Zahra', soin: 'Perfusion', duree: '30 min' },
  { date: '2024-03-08 09:45', patient: 'M. Ali Ben', soin: 'Injection', duree: '15 min' },
  { date: '2024-03-08 08:00', patient: 'Mme Khaled', soin: 'Pansement', duree: '20 min' },
  { date: '2024-03-07 16:30', patient: 'M. Riadh', soin: 'Kinésithérapie', duree: '45 min' },
  { date: '2024-03-07 14:00', patient: 'Mme Karmous', soin: 'Prise de sang', duree: '10 min' },
];

export default function ReportsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'reports' | 'history'>('reports');

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/paramedical-dashboard" className="flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft size={20} />
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Rapports et Historique</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setSelectedTab('reports')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              selectedTab === 'reports'
                ? 'text-primary border-b-primary'
                : 'text-muted-foreground border-b-transparent hover:text-foreground'
            }`}
          >
            Rapports
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-6 py-3 font-semibold transition border-b-2 ${
              selectedTab === 'history'
                ? 'text-primary border-b-primary'
                : 'text-muted-foreground border-b-transparent hover:text-foreground'
            }`}
          >
            Historique des Soins
          </button>
        </div>

        {/* Reports Section */}
        {selectedTab === 'reports' && (
          <div className="space-y-4">
            {mockReports.map((report) => (
              <div key={report.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Rapport {report.type}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{report.date}</p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2 text-sm">
                    <Download size={16} />
                    PDF
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Visites</p>
                    <p className="text-lg font-bold text-foreground">{report.visites}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Heures</p>
                    <p className="text-lg font-bold text-foreground">{report.heures}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Patients</p>
                    <p className="text-sm font-semibold text-foreground">{report.patients}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Section */}
        {selectedTab === 'history' && (
          <div className="space-y-3">
            {mockHistory.map((item, idx) => (
              <div key={idx} className="bg-card border border-border rounded-xl p-4 flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">{item.patient}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.soin}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">{item.duree}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
