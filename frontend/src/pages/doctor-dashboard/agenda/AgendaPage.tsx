
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DoctorDashboardSidebar } from '@/components/DoctorDashboardSidebar';
import { LogOut, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function DoctorAgendaPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'doctor')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'doctor') return null;

  const agendaData = [
    { date: '2026-03-01', day: 'Dimanche 1 Mars', slots: ['08:00 - Libre', '08:30 - Libre', '09:00 - Patient 1 (Confirmé)', '09:30 - Patient 2 (Confirmé)'] },
    { date: '2026-03-02', day: 'Lundi 2 Mars', slots: ['10:00 - Libre', '10:30 - Patient 3 (Confirmé)', '11:00 - Libre', '14:00 - Patient 4 (Confirmé)'] },
    { date: '2026-03-03', day: 'Mardi 3 Mars', slots: ['09:00 - Libre', '09:30 - Libre', '15:00 - Patient 5 (Confirmé)', '16:00 - Libre'] },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar doctorName={user.firstName || 'Amira Mansouri'} />
        
        <main className="flex-1">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mon Agenda</h1>
                <p className="text-muted-foreground mt-1">Gérez vos rendez-vous</p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2">
                  <Plus size={18} />
                  Nouveau créneau
                </button>
                <button 
                  onClick={logout}
                  className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
                >
                  <LogOut size={18} />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <button className="p-2 hover:bg-muted rounded-lg transition">
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-2xl font-bold text-foreground">Semaine du 1-7 Mars 2026</h2>
              <button className="p-2 hover:bg-muted rounded-lg transition">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agendaData.map((day) => (
                <div key={day.date} className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <h3 className="font-bold text-lg text-foreground">{day.day}</h3>
                  <div className="space-y-2">
                    {day.slots.map((slot, idx) => (
                      <div key={idx} className={`p-3 rounded-lg text-sm ${
                        slot.includes('Libre') 
                          ? 'bg-muted text-muted-foreground' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
