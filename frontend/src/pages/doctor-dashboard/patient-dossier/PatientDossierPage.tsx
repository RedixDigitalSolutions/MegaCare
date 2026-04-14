import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { ArrowLeft, ChevronDown, FileText, Loader2, User } from "lucide-react";

interface Dossier {
  patientName: string;
  patientEmail?: string;
  patientPhone?: string;
  personal: {
    age: number;
    gender: string;
    bloodType: string;
    height: number;
    weight: number;
  };
  medicalHistory: {
    chronicIllnesses: string[];
    pastSurgeries: { name: string; date: string; notes: string }[];
    familyHistory: { condition: string; relation: string }[];
  };
  allergies: {
    type: string;
    name: string;
    severity: string;
    reaction: string;
  }[];
  activeMedications: {
    name: string;
    dosage: string;
    frequency: string;
    since: string;
  }[];
  documents: {
    id: string;
    type: string;
    name: string;
    date: string;
    description: string;
  }[];
  updatedAt: string;
}

export default function PatientDossierPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string[]>(["personal", "allergies"]);

  const token = localStorage.getItem("megacare_token");

  const fetchDossier = useCallback(async () => {
    try {
      const res = await fetch(`/api/dossier/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Dossier introuvable");
        return;
      }
      setDossier(await res.json());
    } catch {
      setError("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }, [patientId, token]);

  useEffect(() => {
    fetchDossier();
  }, [fetchDossier]);

  const toggle = (id: string) =>
    setExpanded((p) =>
      p.includes(id) ? p.filter((s) => s !== id) : [...p, id],
    );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col md:flex-row">
          <DoctorDashboardSidebar />
          <main className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </main>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col md:flex-row">
          <DoctorDashboardSidebar />
          <main className="flex-1 flex flex-col items-center justify-center p-12 gap-4">
            <p className="text-muted-foreground">
              {error || "Aucun dossier trouvé pour ce patient"}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg"
            >
              Retour
            </button>
          </main>
        </div>
      </div>
    );
  }

  const d = dossier;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-secondary/30 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {d.patientName}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {d.patientEmail}
                    {d.patientPhone && ` · ${d.patientPhone}`}
                    {d.updatedAt &&
                      ` · Mis à jour le ${new Date(d.updatedAt).toLocaleDateString("fr-FR")}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 max-w-4xl mx-auto space-y-4">
            {/* Personal */}
            <Section
              id="personal"
              title="Données personnelles & biométriques"
              icon="❤️"
              expanded={expanded}
              onToggle={toggle}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field
                  label="Âge"
                  value={d.personal?.age ? `${d.personal.age} ans` : "—"}
                />
                <Field label="Genre" value={d.personal?.gender || "—"} />
                <Field
                  label="Groupe sanguin"
                  value={d.personal?.bloodType || "—"}
                />
                <Field
                  label="Taille"
                  value={d.personal?.height ? `${d.personal.height} cm` : "—"}
                />
                <Field
                  label="Poids"
                  value={d.personal?.weight ? `${d.personal.weight} kg` : "—"}
                />
              </div>
            </Section>

            {/* Medical History */}
            <Section
              id="medicalHistory"
              title="Antécédents médicaux"
              icon="🔬"
              expanded={expanded}
              onToggle={toggle}
            >
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Maladies chroniques
                  </h4>
                  {d.medicalHistory?.chronicIllnesses?.length ? (
                    d.medicalHistory.chronicIllnesses.map((c, i) => (
                      <span
                        key={i}
                        className="inline-block mr-2 mb-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {c}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Aucune
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Chirurgies passées
                  </h4>
                  {d.medicalHistory?.pastSurgeries?.length ? (
                    d.medicalHistory.pastSurgeries.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-foreground text-sm">
                          {s.name}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {s.date}
                        </span>
                        {s.notes && (
                          <span className="text-xs text-muted-foreground">
                            — {s.notes}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Aucune
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Antécédents familiaux
                  </h4>
                  {d.medicalHistory?.familyHistory?.length ? (
                    d.medicalHistory.familyHistory.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground text-sm">
                          {f.condition}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({f.relation})
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Aucun
                    </p>
                  )}
                </div>
              </div>
            </Section>

            {/* Allergies */}
            <Section
              id="allergies"
              title="Allergies"
              icon="⚠️"
              expanded={expanded}
              onToggle={toggle}
            >
              {d.allergies?.length ? (
                d.allergies.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between mb-2"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {a.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.type === "drug"
                          ? "Médicament"
                          : a.type === "food"
                            ? "Alimentaire"
                            : "Environnementale"}{" "}
                        — {a.reaction}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${a.severity === "Sévère" ? "bg-red-50 text-red-700" : a.severity === "Modérée" ? "bg-orange-50 text-orange-700" : "bg-yellow-50 text-yellow-700"}`}
                    >
                      {a.severity}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Aucune allergie
                </p>
              )}
            </Section>

            {/* Active Medications */}
            <Section
              id="medications"
              title="Médicaments actifs"
              icon="💊"
              expanded={expanded}
              onToggle={toggle}
            >
              {d.activeMedications?.length ? (
                d.activeMedications.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between mb-2"
                  >
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        {m.name} — {m.dosage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {m.frequency} · depuis {m.since}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Aucun médicament
                </p>
              )}
            </Section>

            {/* Documents */}
            <Section
              id="documents"
              title="Documents médicaux"
              icon="📄"
              expanded={expanded}
              onToggle={toggle}
            >
              {d.documents?.length ? (
                d.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg mb-2"
                  >
                    <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {doc.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doc.type === "lab"
                          ? "Analyse"
                          : doc.type === "imaging"
                            ? "Imagerie"
                            : doc.type === "prescription"
                              ? "Ordonnance"
                              : "Autre"}{" "}
                        · {doc.date}
                      </p>
                      {doc.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Aucun document
                </p>
              )}
            </Section>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ── Helper Components ── */

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground text-sm">{value}</p>
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  expanded,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: string;
  expanded: string[];
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  const isOpen = expanded.includes(id);
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <ChevronDown
          size={20}
          className={`text-muted-foreground transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t border-border bg-secondary/5 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
