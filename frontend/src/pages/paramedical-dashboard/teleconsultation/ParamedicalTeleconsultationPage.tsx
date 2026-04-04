
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, Phone, Video, MessageSquare, Share2 } from 'lucide-react';
import { useState } from 'react';

const mockDoctors = [
  { id: 1, name: 'Dr. Amira Mansouri', specialty: 'Cardiologie', status: 'available' },
  { id: 2, name: 'Dr. Karim Ben Ali', specialty: 'Cardiologie', status: 'available' },
  { id: 3, name: 'Dr. Fatima Zahra', specialty: 'Dermatologie', status: 'busy' },
];

export default function TeleconsultationPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(mockDoctors[0]);
  const [isCallActive, setIsCallActive] = useState(false);

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
          <h1 className="text-2xl font-bold text-foreground">Téléconsultation avec Médecin</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Doctors */}
          <div className="lg:col-span-1">
            <h2 className="font-semibold text-foreground mb-4">Médecins Disponibles</h2>
            <div className="space-y-3">
              {mockDoctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  disabled={doctor.status === 'busy'}
                  className={`w-full text-left p-4 rounded-lg border transition ${
                    selectedDoctor.id === doctor.id
                      ? 'bg-primary/10 border-primary'
                      : doctor.status === 'busy'
                      ? 'bg-gray-50 border-border opacity-50 cursor-not-allowed'
                      : 'bg-card border-border hover:border-primary'
                  }`}
                >
                  <p className="font-semibold text-foreground">{doctor.name}</p>
                  <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className={`w-2 h-2 rounded-full ${doctor.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-xs text-muted-foreground">
                      {doctor.status === 'available' ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Consultation Area */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              {/* Selected Doctor Info */}
              <div className="border-b border-border pb-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">{selectedDoctor.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
              </div>

              {/* Call Area */}
              {!isCallActive ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setIsCallActive(true)}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
                  >
                    <Video size={20} />
                    Appel Vidéo
                  </button>
                  <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                    <Phone size={20} />
                    Appel Audio
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Video size={40} className="text-primary" />
                      </div>
                      <p className="text-white font-semibold">Appel en cours...</p>
                      <p className="text-gray-400 text-sm mt-1">00:45</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsCallActive(false)}
                    className="w-full px-6 py-2 bg-red-500 text-white rounded-lg font-semibold hover:opacity-90 transition"
                  >
                    Terminer l'Appel
                  </button>
                </div>
              )}

              {/* Tools */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                <button className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary transition flex items-center justify-center gap-2 text-sm">
                  <Share2 size={16} />
                  Partager Images
                </button>
                <button className="px-4 py-2 bg-card border border-border rounded-lg hover:border-primary transition flex items-center justify-center gap-2 text-sm">
                  <MessageSquare size={16} />
                  Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
