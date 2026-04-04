
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Download, Share2 } from 'lucide-react';

export default function ResultsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([
    { id: 1, patient: 'Mohammed Gharbi', testType: 'Glycémie', value: '1.15 g/L', status: 'Normal', date: '2024-03-08' },
    { id: 2, patient: 'Sara Meddeb', testType: 'TSH', value: '2.5 mIU/L', status: 'Normal', date: '2024-03-07' },
    { id: 3, patient: 'Karim Smaoui', testType: 'Cholestérol', value: '2.1 mmol/L', status: 'Élevé', date: '2024-03-06' },
    { id: 4, patient: 'Nida Khadija', testType: 'Créatinine', value: '85 µmol/L', status: 'Normal', date: '2024-03-05' },
    { id: 5, patient: 'Ali Ben Romdhane', testType: 'Bilirubin', value: '15 µmol/L', status: 'Normal', date: '2024-03-04' },
  ]);

  const filteredResults = results.filter(r => 
    r.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.testType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/lab-dashboard" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Résultats d'Analyses</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Rechercher un résultat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Results Cards */}
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <div key={result.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-foreground text-lg">{result.patient}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      result.status === 'Normal' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {result.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Type de Test</p>
                      <p className="font-medium text-foreground">{result.testType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Résultat</p>
                      <p className="font-medium text-foreground">{result.value}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{result.date}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-medium">
                  <Download size={16} />
                  Télécharger
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition text-sm font-medium">
                  <Share2 size={16} />
                  Partager
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun résultat trouvé</p>
          </div>
        )}
      </main>
    </div>
  );
}
