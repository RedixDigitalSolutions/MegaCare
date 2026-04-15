
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Upload, FileText, Check, Clock, AlertCircle, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface RxItem {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  medicines: string[];
  status: string;
  expiryDate: string;
  issuedDate: string;
  scanned: boolean;
}

export default function PrescriptionsPage() {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('megacare_token');
  const [prescriptions, setPrescriptions] = useState<RxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch('/api/prescriptions', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : [])
      .then((j: any) => Array.isArray(j) ? j : (j.data ?? []))
      .then(async (data: any[]) => {
        const t = localStorage.getItem('megacare_token');
        const resolved = await Promise.all(
          data.map(async (rx) => {
            let doctorName = 'Médecin inconnu';
            let specialty = '';
            try {
              const u = await fetch(`/api/users/${rx.doctorId}`, {
                headers: { Authorization: `Bearer ${t}` },
              });
              if (u.ok) {
                const ud = await u.json();
                doctorName = `Dr. ${ud.firstName ?? ''} ${ud.lastName ?? ''}`.trim();
                specialty = ud.specialization ?? ud.specialty ?? '';
              }
            } catch { /* ignore */ }
            const issued = new Date(rx.createdAt);
            const expiry = new Date(issued);
            expiry.setMonth(expiry.getMonth() + 3);
            return {
              id: rx._id,
              date: issued.toISOString(),
              doctor: doctorName,
              specialty,
              medicines: (rx.medicines ?? []).map((m: any) => m.name ?? String(m)),
              status: 'validée',
              issuedDate: issued.toISOString(),
              expiryDate: expiry.toISOString(),
              scanned: false,
            } as RxItem;
          })
        );
        setPrescriptions(resolved);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validée':
        return <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm"><Check size={14} /> Validée</div>;
      case 'en_attente':
        return <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm"><Clock size={14} /> En attente</div>;
      case 'rejetée':
        return <div className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm"><AlertCircle size={14} /> Rejetée</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="space-y-6 mb-12">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Mes Ordonnances</h1>
              <p className="text-muted-foreground mt-2">Gérez vos ordonnances médicales et validez-les auprès d'une pharmacie</p>
            </div>

            {/* Upload Section */}
            <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-2 border-dashed border-primary rounded-lg p-8 space-y-4">
              <div className="flex items-center gap-3">
                <Upload className="text-primary" size={24} />
                <div>
                  <h2 className="font-bold text-foreground">Ajouter une ordonnance</h2>
                  <p className="text-sm text-muted-foreground">Téléchargez une photo ou un PDF de votre ordonnance</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Télécharger une ordonnance
              </button>
            </div>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Historique</h2>
            {!isAuthenticated ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center space-y-4">
                <AlertCircle size={48} className="mx-auto text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Connectez-vous pour voir vos ordonnances</p>
              </div>
            ) : loading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse h-40" />
                ))}
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center space-y-4">
                <FileText size={48} className="mx-auto text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Aucune ordonnance pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((rx) => (
                  <div key={rx.id} className="bg-card border border-border rounded-lg p-6 space-y-4 hover:shadow-lg transition">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-bold text-foreground">{rx.doctor}</h3>
                        <p className="text-sm text-muted-foreground">{rx.specialty}</p>
                      </div>
                      {getStatusBadge(rx.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Émise le</p>
                        <p className="font-semibold text-foreground">{new Date(rx.issuedDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valide jusqu'au</p>
                        <p className="font-semibold text-foreground">{new Date(rx.expiryDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Médicaments</p>
                        <p className="font-semibold text-foreground">{rx.medicines.length}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Statut scan</p>
                        <p className="font-semibold text-foreground">{rx.scanned ? '✓ Scanné' : 'Non scanné'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Médicaments:</p>
                      <div className="flex flex-wrap gap-2">
                        {rx.medicines.map((med, idx) => (
                          <span key={idx} className="bg-secondary text-foreground text-xs px-3 py-1 rounded-full">
                            {med}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border">
                      {rx.status === 'validée' && (
                        <>
                          <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition">
                            Commander ces médicaments
                          </button>
                          <button className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition">
                            <Download size={18} className="text-foreground" />
                          </button>
                        </>
                      )}
                      {rx.status === 'en_attente' && (
                        <button className="flex-1 bg-secondary text-foreground py-2 rounded-lg font-semibold hover:bg-secondary/80 transition">
                          En attente de validation
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 space-y-4 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground">Télécharger une ordonnance</h2>

            <div className="space-y-3">
              <button className="w-full border-2 border-dashed border-primary rounded-lg p-8 space-y-2 hover:bg-primary/5 transition">
                <Upload className="mx-auto text-primary" size={32} />
                <p className="font-semibold text-foreground">Cliquez ou glissez une image/PDF</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, PDF jusqu'à 10 MB</p>
              </button>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Ou scanner avec IA</label>
                <button className="w-full bg-secondary text-foreground py-2 rounded-lg hover:bg-secondary/80 transition font-semibold">
                  Scanner l'ordonnance
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowUploadModal(false)}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
