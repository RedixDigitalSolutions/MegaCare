
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { DoctorDashboardSidebar } from '@/components/DoctorDashboardSidebar';
import { LogOut, Star, ThumbsUp } from 'lucide-react';

export default function DoctorReviewsPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== 'doctor')) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== 'doctor') return null;

  const reviews = [
    { id: 1, patient: 'Fatima B.', rating: 5, text: 'Très bon médecin, très attentif et professionnel', date: '2026-02-25' },
    { id: 2, patient: 'Mohamed K.', rating: 5, text: 'Consultation excellente, explications claires', date: '2026-02-28' },
    { id: 3, patient: 'Aisha H.', rating: 4, text: 'Bon diagnostic, à recommander', date: '2026-02-20' },
    { id: 4, patient: 'Salim D.', rating: 5, text: 'Médecin compétent, très courtois', date: '2026-02-15' },
    { id: 5, patient: 'Layla M.', rating: 4, text: 'Bonne expérience globale', date: '2026-02-22' },
  ];

  const avgRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar doctorName={user.firstName || 'Amira Mansouri'} />
        
        <main className="flex-1">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Avis Patients</h1>
                <p className="text-muted-foreground mt-1">Note moyenne: {avgRating}/5</p>
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

          <div className="p-6 space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{review.patient}</h3>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">{review.text}</p>
                <button className="flex items-center gap-2 text-primary hover:underline text-sm">
                  <ThumbsUp size={16} />
                  Utile
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
