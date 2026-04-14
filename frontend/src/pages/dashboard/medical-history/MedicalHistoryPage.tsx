import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, FileText, Download, Loader2 } from "lucide-react";

interface ConsultationRecord {
  doctorId: string;
  doctorName: string;
  date: string;
  symptoms: string;
  observations: string;
  diagnosis: string;
  medications: any[];
  followUp: string;
  notes: string;
}

interface DossierData {
  patientId: string;
  personal?: any;
  medicalHistory?: any;
  allergies?: any[];
  activeMedications?: any[];
  consultations?: ConsultationRecord[];
  documents?: any[];
}

export default function MedicalHistoryPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState<DossierData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "patient")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    const token = localStorage.getItem("megacare_token");
    if (!token) return;

    fetch("/api/dossier", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setDossier(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user || user.role !== "patient")
    return null;

  const consultations = dossier?.consultations || [];
  const allergies = dossier?.allergies || [];
  const medications = dossier?.activeMedications || [];
  const chronic = dossier?.medicalHistory?.chronicIllnesses || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Historique Médical
            </h1>
            <p className="text-muted-foreground mt-1">
              Votre parcours de santé
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/dashboard"
              className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium"
            >
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : !dossier ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">Aucun dossier médical</p>
            <p className="text-sm mt-1">
              Votre dossier sera créé lors de votre première consultation
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary cards */}
            {(chronic.length > 0 ||
              allergies.length > 0 ||
              medications.length > 0) && (
              <div className="grid md:grid-cols-3 gap-4">
                {chronic.length > 0 && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="font-semibold text-foreground mb-2">
                      Maladies chroniques
                    </h3>
                    <ul className="space-y-1">
                      {chronic.map((c: string, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {allergies.length > 0 && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="font-semibold text-foreground mb-2">
                      Allergies
                    </h3>
                    <ul className="space-y-1">
                      {allergies.map((a: any, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {a.name} ({a.severity})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {medications.length > 0 && (
                  <div className="bg-card rounded-xl border border-border p-5">
                    <h3 className="font-semibold text-foreground mb-2">
                      Médicaments actifs
                    </h3>
                    <ul className="space-y-1">
                      {medications.map((m: any, i: number) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {m.name} {m.dosage} — {m.frequency}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Consultations */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">
                Consultations
              </h2>
              {consultations.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Aucune consultation enregistrée
                </p>
              ) : (
                <div className="space-y-4">
                  {consultations
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime(),
                    )
                    .map((record, idx) => (
                      <div
                        key={idx}
                        className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              {record.diagnosis ||
                                record.symptoms ||
                                "Consultation"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {record.doctorName} —{" "}
                              {new Date(record.date).toLocaleDateString(
                                "fr-FR",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        {record.observations && (
                          <p className="text-muted-foreground mb-2">
                            <span className="font-medium text-foreground">
                              Observations:
                            </span>{" "}
                            {record.observations}
                          </p>
                        )}
                        {record.notes && (
                          <p className="text-muted-foreground">
                            <span className="font-medium text-foreground">
                              Notes:
                            </span>{" "}
                            {record.notes}
                          </p>
                        )}
                        {record.followUp && (
                          <p className="text-sm text-primary mt-2">
                            Suivi: {record.followUp}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
