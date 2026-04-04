
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function VitalsPage() {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const patients = [
    {
      id: 1,
      name: 'Fatima Béchir',
      age: 72,
      condition: 'Diabétique',
      vitals: {
        bloodPressure: '140/90',
        pulse: 78,
        temperature: 36.8,
        oxygen: 98,
        glucose: 185,
      },
      alerts: ['Tension légèrement élevée'],
      status: 'warning',
    },
    {
      id: 2,
      name: 'Mohamed Ali',
      age: 65,
      condition: 'Cardiaque',
      vitals: {
        bloodPressure: '120/80',
        pulse: 72,
        temperature: 37.0,
        oxygen: 99,
        glucose: 110,
      },
      alerts: [],
      status: 'normal',
    },
    {
      id: 3,
      name: 'Aïcha Karray',
      age: 58,
      condition: 'Hypertension',
      vitals: {
        bloodPressure: '155/95',
        pulse: 85,
        temperature: 36.5,
        oxygen: 97,
        glucose: 130,
      },
      alerts: ['Tension anormale', 'Pouls élevé'],
      status: 'critical',
    },
  ];

  const currentPatient = patients.find((p) => p.id === parseInt(selectedPatient || '0'));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link to="/medical-service-dashboard" className="text-primary hover:text-primary/80">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Suivi Médical - Constantes Vitales</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">Patients</h2>
            <div className="space-y-3">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient.id.toString())}
                  className={`w-full p-4 rounded-lg border transition text-left ${
                    selectedPatient === patient.id.toString()
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card border-border hover:border-primary'
                  }`}
                >
                  <p className="font-semibold text-foreground">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.age} ans • {patient.condition}</p>
                  {patient.alerts.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle size={14} />
                      {patient.alerts.length} alerte(s)
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Vitals Display */}
          <div className="lg:col-span-2">
            {currentPatient ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <h3 className="text-2xl font-bold text-foreground">{currentPatient.name}</h3>
                  <p className="text-muted-foreground">{currentPatient.age} ans • {currentPatient.condition}</p>
                  <div className={`mt-4 px-4 py-2 rounded-lg w-fit text-sm font-semibold ${
                    currentPatient.status === 'normal' 
                      ? 'bg-green-100 text-green-800'
                      : currentPatient.status === 'warning'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {currentPatient.status === 'normal' ? 'Normal' : currentPatient.status === 'warning' ? 'Attention' : 'Critique'}
                  </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card rounded-xl border border-border p-6 space-y-2">
                    <p className="text-sm text-muted-foreground">Tension Artérielle</p>
                    <p className="text-3xl font-bold text-foreground">{currentPatient.vitals.bloodPressure}</p>
                    <p className="text-xs text-muted-foreground">mmHg</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6 space-y-2">
                    <p className="text-sm text-muted-foreground">Pouls</p>
                    <p className="text-3xl font-bold text-foreground">{currentPatient.vitals.pulse}</p>
                    <p className="text-xs text-muted-foreground">bpm</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6 space-y-2">
                    <p className="text-sm text-muted-foreground">Température</p>
                    <p className="text-3xl font-bold text-foreground">{currentPatient.vitals.temperature}°C</p>
                    <p className="text-xs text-muted-foreground">Corporelle</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6 space-y-2">
                    <p className="text-sm text-muted-foreground">Oxygénation</p>
                    <p className="text-3xl font-bold text-foreground">{currentPatient.vitals.oxygen}%</p>
                    <p className="text-xs text-muted-foreground">SpO2</p>
                  </div>
                  <div className="bg-card rounded-xl border border-border p-6 space-y-2 col-span-2">
                    <p className="text-sm text-muted-foreground">Glycémie</p>
                    <p className="text-3xl font-bold text-foreground">{currentPatient.vitals.glucose}</p>
                    <p className="text-xs text-muted-foreground">mg/dL</p>
                  </div>
                </div>

                {/* Alerts */}
                {currentPatient.alerts.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h4 className="font-semibold text-red-900 mb-3">Alertes Détectées</h4>
                    <ul className="space-y-2">
                      {currentPatient.alerts.map((alert, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-red-900">
                          <AlertCircle size={16} />
                          {alert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <p className="text-muted-foreground">Sélectionnez un patient pour voir ses constantes</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
