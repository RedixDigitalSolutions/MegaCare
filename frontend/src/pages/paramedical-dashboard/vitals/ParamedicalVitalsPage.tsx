
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const mockPatients = [
  { id: 1, name: 'Madame Khaled', bp: '130/85', hr: 72, temp: 36.8, spo2: 98, glucose: 110 },
  { id: 2, name: 'Monsieur Ali Ben', bp: '120/80', hr: 68, temp: 36.5, spo2: 99, glucose: 95 },
  { id: 3, name: 'Mme Fatima Zahra', bp: '145/90', hr: 88, temp: 37.2, spo2: 97, glucose: 140 },
];

export default function VitalsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [vitals, setVitals] = useState({
    bp: '',
    hr: '',
    temp: '',
    spo2: '',
    glucose: '',
  });

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Constantes vitales enregistrées');
    setVitals({ bp: '', hr: '', temp: '', spo2: '', glucose: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/paramedical-dashboard" className="flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft size={20} />
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Suivi des Constantes Vitales</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient Selection */}
          <div className="lg:col-span-1">
            <h2 className="font-semibold text-foreground mb-4">Sélectionner un Patient</h2>
            <div className="space-y-2">
              {mockPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                    selectedPatient.id === patient.id
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-primary'
                  }`}
                >
                  <p className="font-semibold text-foreground">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">TA: {patient.bp}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Vitals Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tension */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Tension Artérielle (mmHg)</label>
                  <input
                    type="text"
                    placeholder="ex: 120/80"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* Heart Rate */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Fréquence Cardiaque (bpm)</label>
                  <input
                    type="number"
                    placeholder="ex: 72"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* Temperature */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Température (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="ex: 36.8"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* SpO2 */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Saturation O2 (%)</label>
                  <input
                    type="number"
                    max="100"
                    placeholder="ex: 98"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>

                {/* Glucose */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Glycémie (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="ex: 110"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
              >
                Enregistrer
              </button>
            </form>

            {/* Alerts */}
            <div className="mt-6 space-y-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-orange-900 text-sm">Tension artérielle élevée</p>
                  <p className="text-xs text-orange-800">TA actuelle: 145/90 (anormale)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
