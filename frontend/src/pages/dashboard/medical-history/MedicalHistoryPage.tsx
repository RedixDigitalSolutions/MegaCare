
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, FileText, Download } from 'lucide-react';

export default function MedicalHistoryPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'patient')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'patient') return null;

  const medicalHistory = [
    { id: 1, date: '2026-02-25', doctor: 'Dr. Amira Mansouri', reason: 'Consultation cardiologie', notes: 'Tension artérielle: 120/80' },
    { id: 2, date: '2026-02-20', doctor: 'Dr. Fatima Zahra', reason: 'Consultation dermatologie', notes: 'Prescription appliquée' },
    { id: 3, date: '2026-02-15', doctor: 'Dr. Riadh Gharbi', reason: 'Consultation orthopédie', notes: 'Physiothérapie recommandée' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Historique Médical</h1>
            <p className="text-muted-foreground mt-1">Votre parcours de santé</p>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard" className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium">
              Retour
            </Link>
            <button 
              onClick={logout}
              className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="space-y-4">
          {medicalHistory.map((record) => (
            <div key={record.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{record.reason}</h3>
                  <p className="text-sm text-muted-foreground">{record.doctor} - {record.date}</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition">
                  <Download size={18} />
                  Télécharger
                </button>
              </div>
              <p className="text-muted-foreground">{record.notes}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
