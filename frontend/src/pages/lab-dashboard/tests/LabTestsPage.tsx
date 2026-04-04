
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, CheckCircle, Clock } from 'lucide-react';

export default function TestsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [tests, setTests] = useState([
    { id: 1, patient: 'Fatima Ben Ali', testType: 'Analyse Sanguin', status: 'En cours', priority: 'Normal', date: '2024-03-08' },
    { id: 2, patient: 'Mohammed Gharbi', testType: 'Glycémie', status: 'Complété', priority: 'Normal', date: '2024-03-08' },
    { id: 3, patient: 'Leila Mansouri', testType: 'Test ADN', status: 'En attente', priority: 'Urgent', date: '2024-03-08' },
    { id: 4, patient: 'Ahmed Nasser', testType: 'Cholestérol', status: 'En cours', priority: 'Normal', date: '2024-03-07' },
    { id: 5, patient: 'Sara Meddeb', testType: 'TSH', status: 'Complété', priority: 'Normal', date: '2024-03-07' },
  ]);

  const filteredTests = tests.filter(t => 
    t.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.testType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Complété': return 'bg-green-100 text-green-700';
      case 'En cours': return 'bg-blue-100 text-blue-700';
      case 'En attente': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/lab-dashboard" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Analyses</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
            <Plus size={20} />
            Nouvelle Analyse
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
              placeholder="Rechercher un test..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Tests Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type de Test</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Priorité</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{test.patient}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{test.testType}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        test.priority === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {test.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{test.date}</td>
                    <td className="px-6 py-4 text-sm flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition text-primary flex items-center gap-1">
                        <CheckCircle size={16} />
                      </button>
                      <button className="p-2 hover:bg-muted rounded-lg transition text-primary flex items-center gap-1">
                        <Clock size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun test trouvé</p>
          </div>
        )}
      </main>
    </div>
  );
}
