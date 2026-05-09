import { useState, useEffect, useCallback } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  ChevronDown,
  FileText,
  Lock,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ShieldOff,
  Clock,
  EyeOff,
  Stethoscope,
  Pill,
  ClipboardList,
} from "lucide-react";

interface ConsultationMed {
  name: string;
  dosage: string;
  instructions: string;
}

interface Consultation {
  _id?: string;
  appointmentId?: string;
  doctorId: string;
  doctorName: string;
  doctorSpeciality?: string;
  date: string;
  symptoms: string;
  observations: string;
  diagnosis: string;
  medications: ConsultationMed[];
  followUp: string;
  notes: string;
}

interface Dossier {
  patientId: string;
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
  consultations: Consultation[];
  updatedAt: string;
}

export default function MedicalRecordsPage() {
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>(["personal"]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [permLoading, setPermLoading] = useState(false);

  const token = localStorage.getItem("megacare_token");

  const fetchDossier = useCallback(async () => {
    try {
      const res = await fetch("/api/dossier", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setDossier(data);
    } catch {
      // leave null
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDossier();
  }, [fetchDossier]);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await fetch("/api/dossier/permissions/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setPermissions(data);
    } catch {}
  }, [token]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const revokePermission = async (doctorId: string) => {
    setPermLoading(true);
    try {
      const res = await fetch(`/api/dossier/permissions/${doctorId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setPermissions(data);
      }
    } finally {
      setPermLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const completionPercent = (() => {
    if (!dossier) return 0;
    let filled = 0;
    const total = 5;
    if (dossier.personal?.bloodType) filled++;
    if (dossier.medicalHistory?.chronicIllnesses?.length > 0) filled++;
    if (dossier.allergies?.length > 0) filled++;
    if (dossier.activeMedications?.length > 0) filled++;
    if (dossier.documents?.length > 0) filled++;
    return Math.round((filled / total) * 100);
  })();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col md:flex-row">
          <DashboardSidebar />
          <main className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </main>
        </div>
      </div>
    );
  }

  const d = dossier || ({} as Partial<Dossier>);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Mon Dossier Médical
                </h1>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  Sécurisé & Chiffré
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-lg border border-border">
                  <EyeOff size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Lecture seule</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {dossier?.updatedAt
                    ? `Mis à jour le ${new Date(dossier.updatedAt).toLocaleDateString("fr-FR")}`
                    : "Aucune mise à jour"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Read-only notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 dark:bg-blue-950/20 dark:border-blue-900">
              <Lock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                  Dossier médical en lecture seule
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Votre dossier médical est géré par vos professionnels de santé. Contactez votre médecin pour toute mise à jour.
                </p>
              </div>
            </div>

            {/* Completion */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Taux de complétion de votre dossier
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {completionPercent}% complété
                </p>
                <div className="w-full h-2 bg-primary/20 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${completionPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* ── Personal & Biometric ── */}
            <SectionAccordion
              id="personal"
              title="Données personnelles & biométriques"
              icon="❤️"
              expanded={expandedSections}
              onToggle={toggleSection}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <Field label="Âge" value={d.personal?.age ? `${d.personal.age} ans` : "—"} />
                <Field label="Genre" value={d.personal?.gender || "—"} />
                <Field label="Groupe sanguin" value={d.personal?.bloodType || "—"} />
                <Field label="Taille" value={d.personal?.height ? `${d.personal.height} cm` : "—"} />
                <Field label="Poids" value={d.personal?.weight ? `${d.personal.weight} kg` : "—"} />
              </div>
            </SectionAccordion>

            {/* ── Medical History ── */}
            <SectionAccordion
              id="medicalHistory"
              title="Antécédents médicaux"
              icon="🔬"
              expanded={expandedSections}
              onToggle={toggleSection}
            >
              <div className="space-y-5">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Maladies chroniques
                  </h4>
                  {d.medicalHistory?.chronicIllnesses?.length ? (
                    d.medicalHistory.chronicIllnesses.map((c, i) => (
                      <span key={i} className="inline-block mr-2 mb-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium">
                        {c}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Aucune</p>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Chirurgies passées
                  </h4>
                  {d.medicalHistory?.pastSurgeries?.length ? (
                    d.medicalHistory.pastSurgeries.map((s, i) => (
                      <div key={i} className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-foreground text-sm">{s.name}</p>
                        <span className="text-xs text-muted-foreground">{s.date}</span>
                        {s.notes && <span className="text-xs text-muted-foreground">— {s.notes}</span>}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Aucune</p>
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Antécédents familiaux
                  </h4>
                  {d.medicalHistory?.familyHistory?.length ? (
                    d.medicalHistory.familyHistory.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground text-sm">{f.condition}</span>
                        <span className="text-xs text-muted-foreground">({f.relation})</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Aucun</p>
                  )}
                </div>
              </div>
            </SectionAccordion>

            {/* ── Allergies ── */}
            <SectionAccordion
              id="allergies"
              title="Allergies"
              icon="⚠️"
              expanded={expandedSections}
              onToggle={toggleSection}
            >
              <div className="space-y-2">
                {d.allergies?.length ? (
                  d.allergies.map((a, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{a.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.type === "drug" ? "Médicament" : a.type === "food" ? "Alimentaire" : "Environnementale"} — {a.reaction}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        a.severity === "Sévère" ? "bg-red-50 text-red-700"
                        : a.severity === "Modérée" ? "bg-orange-50 text-orange-700"
                        : "bg-yellow-50 text-yellow-700"
                      }`}>
                        {a.severity}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Aucune allergie enregistrée</p>
                )}
              </div>
            </SectionAccordion>

            {/* ── Active Medications ── */}
            <SectionAccordion
              id="medications"
              title="Médicaments actifs"
              icon="💊"
              expanded={expandedSections}
              onToggle={toggleSection}
            >
              <div className="space-y-2">
                {d.activeMedications?.length ? (
                  d.activeMedications.map((m, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground text-sm">{m.name} — {m.dosage}</p>
                        <p className="text-xs text-muted-foreground">{m.frequency} · depuis {m.since}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">Aucun médicament actif</p>
                )}
              </div>
            </SectionAccordion>

            {/* ── Consultation History ── */}
            <SectionAccordion
              id="consultations"
              title="Historique des consultations"
              icon="📝"
              expanded={expandedSections}
              onToggle={toggleSection}
            >
              {(() => {
                const logs = [...(d.consultations || [])].sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                if (logs.length === 0) {
                  return (
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center space-y-2">
                      <ClipboardList className="w-8 h-8 text-primary mx-auto" />
                      <p className="font-semibold text-foreground text-sm">Aucune consultation enregistrée</p>
                      <p className="text-xs text-muted-foreground">Les détails de vos consultations apparaîtront ici après chaque séance avec votre médecin</p>
                    </div>
                  );
                }
                return (
                  <div className="space-y-4">
                    {logs.map((c, i) => (
                      <div key={c._id || i} className="border border-border rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 bg-secondary/20">
                          <div className="flex items-center gap-2.5">
                            <Stethoscope size={16} className="text-primary" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                Dr. {c.doctorName}
                              </p>
                              {c.doctorSpeciality && (
                                <p className="text-xs text-muted-foreground">{c.doctorSpeciality}</p>
                              )}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(c.date).toLocaleDateString("fr-FR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="px-4 py-4 space-y-4">
                          {/* Diagnosis — prominent */}
                          {c.diagnosis && (
                            <div className="bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">Diagnostic</p>
                              <p className="text-sm font-medium text-foreground">{c.diagnosis}</p>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {c.symptoms && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Symptômes</p>
                                <p className="text-sm text-foreground">{c.symptoms}</p>
                              </div>
                            )}
                            {c.observations && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Observations</p>
                                <p className="text-sm text-foreground">{c.observations}</p>
                              </div>
                            )}
                          </div>

                          {/* Prescribed medications */}
                          {c.medications && c.medications.filter((m) => m.name).length > 0 && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Pill size={12} /> Médicaments prescrits
                              </p>
                              <div className="space-y-1.5">
                                {c.medications.filter((m) => m.name).map((m, mi) => (
                                  <div key={mi} className="flex flex-wrap items-start gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200/60 dark:border-purple-800/40">
                                    <span className="text-sm font-semibold text-foreground">{m.name}</span>
                                    {m.dosage && (
                                      <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">{m.dosage}</span>
                                    )}
                                    {m.instructions && (
                                      <span className="text-xs text-purple-700 dark:text-purple-300 italic w-full">{m.instructions}</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {c.followUp && (
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Suivi recommandé</p>
                              <p className="text-sm text-foreground">{c.followUp}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </SectionAccordion>

            {/* ── Documents ── */}
            <SectionAccordion
              id="documents"
              title="Documents médicaux"
              icon="📄"
              expanded={expandedSections}
              onToggle={toggleSection}
            >
              <div className="space-y-3">
                {d.documents?.length ? (
                  d.documents.map((doc, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type === "lab" ? "Analyse" : doc.type === "imaging" ? "Imagerie" : doc.type === "prescription" ? "Ordonnance" : "Autre"} · {doc.date}
                        </p>
                        {doc.description && <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center space-y-2">
                    <FileText className="w-8 h-8 text-primary mx-auto" />
                    <p className="font-semibold text-foreground text-sm">Aucun document</p>
                    <p className="text-xs text-muted-foreground">Les documents seront ajoutés par vos professionnels de santé</p>
                  </div>
                )}
              </div>
            </SectionAccordion>

            {/* ── Permissions / Accès médecins ── */}
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-3">
                <span className="text-2xl">🔐</span>
                <h3 className="font-semibold text-foreground">Accès au dossier</h3>
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">
                  {permissions.filter((p) => p.status === "active").length} actif(s)
                </span>
              </div>
              <div className="px-6 py-4 border-t border-border bg-secondary/5 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Les médecins ci-dessous ont accès à votre dossier médical. L'accès est accordé automatiquement lors de la prise de rendez-vous et expire 3 jours après la consultation.
                </p>
                {permissions.length === 0 ? (
                  <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center space-y-2">
                    <ShieldCheck className="w-8 h-8 text-primary mx-auto" />
                    <p className="font-semibold text-foreground text-sm">Aucun accès accordé</p>
                    <p className="text-xs text-muted-foreground">Aucun médecin n'a actuellement accès à votre dossier</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {permissions.map((p, i) => {
                      const isActive = p.status === "active";
                      const isExpired = p.status === "expired";
                      const hasExpiry = p.expiresAt && isActive;
                      return (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isActive
                              ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                              : isExpired
                                ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900"
                                : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isActive ? (
                              <ShieldCheck size={18} className="text-green-600" />
                            ) : isExpired ? (
                              <Clock size={18} className="text-orange-500" />
                            ) : (
                              <ShieldOff size={18} className="text-red-500" />
                            )}
                            <div>
                              <p className="font-medium text-sm text-foreground">Dr. {p.doctorName || "Médecin"}</p>
                              <p className="text-xs text-muted-foreground">
                                {isActive
                                  ? hasExpiry
                                    ? `Expire le ${new Date(p.expiresAt).toLocaleDateString("fr-FR")}`
                                    : `Accordé le ${new Date(p.grantedAt).toLocaleDateString("fr-FR")}`
                                  : isExpired
                                    ? "Accès expiré"
                                    : "Accès révoqué"}
                              </p>
                            </div>
                          </div>
                          {isActive && (
                            <button
                              onClick={() => revokePermission(p.doctorId)}
                              disabled={permLoading}
                              className="px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition disabled:opacity-50"
                            >
                              Révoquer
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
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

function SectionAccordion({
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
        <div className="px-6 py-4 border-t border-border bg-secondary/5">
          {children}
        </div>
      )}
    </div>
  );
}
