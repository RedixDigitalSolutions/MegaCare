
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DoctorDashboardSidebar } from '@/components/DoctorDashboardSidebar';
import { LogOut, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function DoctorConsultationsPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'doctor')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'doctor') return null;

  const consultations = [
    { id: 1, patient: 'Fatima B.', date: '2026-02-25', time: '14:00', status: 'Complétée', duration: '30 min' },
    { id: 2, patient: 'Mohamed K.', date: '2026-02-28', time: '10:30', status: 'Complétée', duration: '45 min' },
    { id: 3, patient: 'Aisha H.', date: '2026-03-01', time: '17:00', status: 'En attente', duration: '30 min' },
    { id: 4, patient: 'Salim D.', date: '2026-02-20', time: '09:00', status: 'Annulée', duration: '30 min' },
    { id: 5, patient: 'Layla M.', date: '2026-03-02', time: '15:30', status: 'En attente', duration: '30 min' },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Complétée':
        return <CheckCircle size={20} className="text-green-600" />;
      case 'En attente':
        return <Clock size={20} className="text-blue-600" />;
      case 'Annulée':
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <AlertCircle size={20} className="text-yellow-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar doctorName={user.firstName || 'Amira Mansouri'} />
        
        <main className="flex-1">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Consultations</h1>
                <p className="text-muted-foreground mt-1">Historique des consultations</p>
              </div>
              <button 
                onClick={logout}
                className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {consultations.map((cons) => (
                <div key={cons.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(cons.status)}
                        <h3 className="font-semibold text-lg text-foreground">{cons.patient}</h3>
                      </div>
                      <p className="text-muted-foreground">
                        {cons.date} à {cons.time} - {cons.duration}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        cons.status === 'Complétée' 
                          ? 'bg-green-100 text-green-700' 
                          : cons.status === 'En attente'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {cons.status}
                      </span>
                    </div>
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
