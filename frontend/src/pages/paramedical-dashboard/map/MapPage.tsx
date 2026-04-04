
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';

const mockPatientLocations = [
  {
    id: 1,
    name: 'Madame Khaled',
    address: '45 Rue de la Paix, Tunis',
    type: 'Pansement',
    time: '08:00',
    distance: 2.3,
  },
  {
    id: 2,
    name: 'Monsieur Ali Ben',
    address: '78 Avenue Bourguiba, Tunis',
    type: 'Injection',
    time: '09:30',
    distance: 3.5,
  },
  {
    id: 3,
    name: 'Mme Fatima Zahra',
    address: '120 Rue Mohamed V, La Marsa',
    type: 'Perfusion',
    time: '11:00',
    distance: 5.2,
  },
];

export default function MapPage() {
  const { user, isLoading, isAuthenticated } = useAuth();

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
          <h1 className="text-2xl font-bold text-foreground">Carte des Patients</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Placeholder */}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden h-96 lg:h-96 relative">
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-blue-400 mx-auto mb-2" />
                <p className="text-muted-foreground font-semibold">Carte Interactive</p>
                <p className="text-sm text-muted-foreground">Intégration Google Maps</p>
              </div>
            </div>

            {/* Map Markers */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {mockPatientLocations.map((patient, idx) => (
                <div
                  key={patient.id}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${30 + idx * 20}%`,
                    top: `${40 + idx * 15}%`,
                  }}
                >
                  <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs shadow-lg">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Patient List */}
          <div className="lg:col-span-1">
            <h2 className="font-semibold text-foreground mb-4">Ordre Optimal des Visites</h2>
            <div className="space-y-3">
              {mockPatientLocations.map((patient, idx) => (
                <div key={patient.id} className="bg-card border border-border rounded-lg p-3 hover:border-primary transition">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground">{patient.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{patient.address}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold text-primary">{patient.distance} km</span>
                        <span className="text-xs text-muted-foreground">{patient.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-2">Kilométrage Total</p>
              <p className="text-2xl font-bold text-blue-700">11 km</p>
              <p className="text-xs text-blue-600 mt-1">Économie de 5 km vs ordre aléatoire</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
