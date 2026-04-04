
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';

const careTypes = [
  'Pansement',
  'Injection',
  'Perfusion',
  'Kinésithérapie',
  'Prise de sang',
  'Cathéter',
  'Traitement plaie',
];

export default function CareRecordPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedCareType, setSelectedCareType] = useState('');
  const [notes, setNotes] = useState('');
  const [hasPhotos, setHasPhotos] = useState(false);
  const [isPatientSigned, setIsPatientSigned] = useState(false);

  const mockPatients = [
    { id: 1, name: 'Madame Khaled' },
    { id: 2, name: 'Monsieur Ali Ben' },
    { id: 3, name: 'Mme Fatima Zahra' },
  ];

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Enregistrement du soin validé');
    setSelectedPatient('');
    setSelectedCareType('');
    setNotes('');
    setHasPhotos(false);
    setIsPatientSigned(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/paramedical-dashboard" className="flex items-center gap-2 text-primary hover:underline">
            <ChevronLeft size={20} />
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Enregistrer un Soin</h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Patient</label>
            <select
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner un patient</option>
              {mockPatients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Care Type */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Type de Soin</label>
            <select
              value={selectedCareType}
              onChange={(e) => setSelectedCareType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner un type</option>
              {careTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Medical Notes */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Notes Médicales</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Décrivez le soin réalisé..."
              className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary min-h-32"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Photos (Évolution)</label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input type="file" multiple accept="image/*" className="hidden" />
              <button
                type="button"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
              >
                Ajouter des Photos
              </button>
              <p className="text-sm text-muted-foreground mt-2">
                {hasPhotos ? '2 photos ajoutées' : 'Glissez-déposez ou cliquez pour ajouter'}
              </p>
            </div>
          </div>

          {/* Patient Signature */}
          <div className="border border-border rounded-lg p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPatientSigned}
                onChange={(e) => setIsPatientSigned(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm font-semibold text-foreground">Signature du patient</span>
            </label>
            <p className="text-xs text-muted-foreground mt-2">Le patient a validé le soin</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition"
          >
            Valider l'Enregistrement
          </button>
        </form>
      </main>
    </div>
  );
}
