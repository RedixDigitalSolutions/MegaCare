import { useState, useEffect, useCallback } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  ChevronDown,
  FileText,
  Lock,
  AlertCircle,
  Loader2,
  Save,
  X,
  Pencil,
  Plus,
  Trash2,
  ShieldCheck,
  ShieldOff,
  Clock,
} from "lucide-react";

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
  updatedAt: string;
}

export default function MedicalRecordsPage() {
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "personal",
  ]);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
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

  const startEdit = (sectionId: string) => {
    if (!dossier) return;
    const map: Record<string, any> = {
      personal: { ...dossier.personal },
      medicalHistory: JSON.parse(JSON.stringify(dossier.medicalHistory)),
      allergies: JSON.parse(JSON.stringify(dossier.allergies)),
      medications: JSON.parse(JSON.stringify(dossier.activeMedications)),
      documents: JSON.parse(JSON.stringify(dossier.documents)),
    };
    setEditData(map[sectionId]);
    setEditingSection(sectionId);
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setEditData(null);
  };

  const saveSection = async (sectionId: string) => {
    if (!editData) return;
    setSaving(true);
    const bodyMap: Record<string, any> = {
      personal: { personal: editData },
      medicalHistory: { medicalHistory: editData },
      allergies: { allergies: editData },
      medications: { activeMedications: editData },
      documents: { documents: editData },
    };
    try {
      const res = await fetch("/api/dossier", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyMap[sectionId]),
      });
      if (res.ok) {
        const updated = await res.json();
        setDossier(updated);
        setEditingSection(null);
        setEditData(null);
      }
    } finally {
      setSaving(false);
    }
  };

  const completionPercent = (() => {
    if (!dossier) return 0;
    let filled = 0;
    let total = 5;
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
              <span className="text-xs text-muted-foreground">
                {dossier?.updatedAt
                  ? `Mis à jour le ${new Date(dossier.updatedAt).toLocaleDateString("fr-FR")}`
                  : "Aucune mise à jour"}
              </span>
            </div>
          </div>

          <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Completion Alert */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Complétez votre dossier pour une meilleure prise en charge
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Taux de complétion: {completionPercent}%
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
              editing={editingSection === "personal"}
              onEdit={() => startEdit("personal")}
              onCancel={cancelEdit}
              onSave={() => saveSection("personal")}
              saving={saving}
            >
              {editingSection === "personal" && editData ? (
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "age", label: "Âge", type: "number" },
                    { key: "gender", label: "Genre", type: "text" },
                    { key: "bloodType", label: "Groupe sanguin", type: "text" },
                    { key: "height", label: "Taille (cm)", type: "number" },
                    { key: "weight", label: "Poids (kg)", type: "number" },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="text-xs text-muted-foreground">
                        {f.label}
                      </label>
                      <input
                        type={f.type}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                        value={editData[f.key] ?? ""}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            [f.key]:
                              f.type === "number"
                                ? Number(e.target.value)
                                : e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              ) : (
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
              )}
            </SectionAccordion>

            {/* ── Medical History ── */}
            <SectionAccordion
              id="medicalHistory"
              title="Antécédents médicaux"
              icon="🔬"
              expanded={expandedSections}
              onToggle={toggleSection}
              editing={editingSection === "medicalHistory"}
              onEdit={() => startEdit("medicalHistory")}
              onCancel={cancelEdit}
              onSave={() => saveSection("medicalHistory")}
              saving={saving}
            >
              {editingSection === "medicalHistory" && editData ? (
                <div className="space-y-6">
                  {/* Chronic */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Maladies chroniques
                    </h4>
                    {editData.chronicIllnesses?.map((c: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 mb-2">
                        <input
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                          value={c}
                          onChange={(e) => {
                            const arr = [...editData.chronicIllnesses];
                            arr[i] = e.target.value;
                            setEditData({ ...editData, chronicIllnesses: arr });
                          }}
                        />
                        <button
                          onClick={() => {
                            const arr = editData.chronicIllnesses.filter(
                              (_: any, j: number) => j !== i,
                            );
                            setEditData({ ...editData, chronicIllnesses: arr });
                          }}
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEditData({
                          ...editData,
                          chronicIllnesses: [
                            ...(editData.chronicIllnesses || []),
                            "",
                          ],
                        })
                      }
                      className="text-primary text-sm font-medium"
                    >
                      + Ajouter
                    </button>
                  </div>
                  {/* Surgeries */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Chirurgies passées
                    </h4>
                    {editData.pastSurgeries?.map((s: any, i: number) => (
                      <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                        <input
                          placeholder="Nom"
                          className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                          value={s.name}
                          onChange={(e) => {
                            const arr = [...editData.pastSurgeries];
                            arr[i] = { ...arr[i], name: e.target.value };
                            setEditData({ ...editData, pastSurgeries: arr });
                          }}
                        />
                        <input
                          type="date"
                          className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                          value={s.date}
                          onChange={(e) => {
                            const arr = [...editData.pastSurgeries];
                            arr[i] = { ...arr[i], date: e.target.value };
                            setEditData({ ...editData, pastSurgeries: arr });
                          }}
                        />
                        <div className="flex gap-1">
                          <input
                            placeholder="Notes"
                            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                            value={s.notes}
                            onChange={(e) => {
                              const arr = [...editData.pastSurgeries];
                              arr[i] = { ...arr[i], notes: e.target.value };
                              setEditData({ ...editData, pastSurgeries: arr });
                            }}
                          />
                          <button
                            onClick={() =>
                              setEditData({
                                ...editData,
                                pastSurgeries: editData.pastSurgeries.filter(
                                  (_: any, j: number) => j !== i,
                                ),
                              })
                            }
                            className="text-destructive"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEditData({
                          ...editData,
                          pastSurgeries: [
                            ...(editData.pastSurgeries || []),
                            { name: "", date: "", notes: "" },
                          ],
                        })
                      }
                      className="text-primary text-sm font-medium"
                    >
                      + Ajouter
                    </button>
                  </div>
                  {/* Family */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Antécédents familiaux
                    </h4>
                    {editData.familyHistory?.map((f: any, i: number) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input
                          placeholder="Condition"
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                          value={f.condition}
                          onChange={(e) => {
                            const arr = [...editData.familyHistory];
                            arr[i] = { ...arr[i], condition: e.target.value };
                            setEditData({ ...editData, familyHistory: arr });
                          }}
                        />
                        <input
                          placeholder="Relation"
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                          value={f.relation}
                          onChange={(e) => {
                            const arr = [...editData.familyHistory];
                            arr[i] = { ...arr[i], relation: e.target.value };
                            setEditData({ ...editData, familyHistory: arr });
                          }}
                        />
                        <button
                          onClick={() =>
                            setEditData({
                              ...editData,
                              familyHistory: editData.familyHistory.filter(
                                (_: any, j: number) => j !== i,
                              ),
                            })
                          }
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEditData({
                          ...editData,
                          familyHistory: [
                            ...(editData.familyHistory || []),
                            { condition: "", relation: "" },
                          ],
                        })
                      }
                      className="text-primary text-sm font-medium"
                    >
                      + Ajouter
                    </button>
                  </div>
                </div>
              ) : (
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
              )}
            </SectionAccordion>

            {/* ── Allergies ── */}
            <SectionAccordion
              id="allergies"
              title="Allergies"
              icon="⚠️"
              expanded={expandedSections}
              onToggle={toggleSection}
              editing={editingSection === "allergies"}
              onEdit={() => startEdit("allergies")}
              onCancel={cancelEdit}
              onSave={() => saveSection("allergies")}
              saving={saving}
            >
              {editingSection === "allergies" && editData ? (
                <div className="space-y-3">
                  {editData.map((a: any, i: number) => (
                    <div key={i} className="grid grid-cols-4 gap-2">
                      <select
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={a.type}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], type: e.target.value };
                          setEditData(arr);
                        }}
                      >
                        <option value="drug">Médicament</option>
                        <option value="food">Alimentaire</option>
                        <option value="environmental">Environnementale</option>
                      </select>
                      <input
                        placeholder="Nom"
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={a.name}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], name: e.target.value };
                          setEditData(arr);
                        }}
                      />
                      <select
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={a.severity}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], severity: e.target.value };
                          setEditData(arr);
                        }}
                      >
                        <option value="Légère">Légère</option>
                        <option value="Modérée">Modérée</option>
                        <option value="Sévère">Sévère</option>
                      </select>
                      <div className="flex gap-1">
                        <input
                          placeholder="Réaction"
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                          value={a.reaction}
                          onChange={(e) => {
                            const arr = [...editData];
                            arr[i] = { ...arr[i], reaction: e.target.value };
                            setEditData(arr);
                          }}
                        />
                        <button
                          onClick={() =>
                            setEditData(
                              editData.filter((_: any, j: number) => j !== i),
                            )
                          }
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setEditData([
                        ...editData,
                        {
                          type: "drug",
                          name: "",
                          severity: "Légère",
                          reaction: "",
                        },
                      ])
                    }
                    className="text-primary text-sm font-medium"
                  >
                    + Ajouter une allergie
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {d.allergies?.length ? (
                    d.allergies.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
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
                      Aucune allergie enregistrée
                    </p>
                  )}
                </div>
              )}
            </SectionAccordion>

            {/* ── Active Medications ── */}
            <SectionAccordion
              id="medications"
              title="Médicaments actifs"
              icon="💊"
              expanded={expandedSections}
              onToggle={toggleSection}
              editing={editingSection === "medications"}
              onEdit={() => startEdit("medications")}
              onCancel={cancelEdit}
              onSave={() => saveSection("medications")}
              saving={saving}
            >
              {editingSection === "medications" && editData ? (
                <div className="space-y-3">
                  {editData.map((m: any, i: number) => (
                    <div key={i} className="grid grid-cols-4 gap-2">
                      <input
                        placeholder="Nom"
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={m.name}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], name: e.target.value };
                          setEditData(arr);
                        }}
                      />
                      <input
                        placeholder="Dosage"
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={m.dosage}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], dosage: e.target.value };
                          setEditData(arr);
                        }}
                      />
                      <input
                        placeholder="Fréquence"
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={m.frequency}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], frequency: e.target.value };
                          setEditData(arr);
                        }}
                      />
                      <div className="flex gap-1">
                        <input
                          type="date"
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                          value={m.since}
                          onChange={(e) => {
                            const arr = [...editData];
                            arr[i] = { ...arr[i], since: e.target.value };
                            setEditData(arr);
                          }}
                        />
                        <button
                          onClick={() =>
                            setEditData(
                              editData.filter((_: any, j: number) => j !== i),
                            )
                          }
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setEditData([
                        ...editData,
                        { name: "", dosage: "", frequency: "", since: "" },
                      ])
                    }
                    className="text-primary text-sm font-medium"
                  >
                    + Ajouter un médicament
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {d.activeMedications?.length ? (
                    d.activeMedications.map((m, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between"
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
                      Aucun médicament actif
                    </p>
                  )}
                </div>
              )}
            </SectionAccordion>

            {/* ── Documents ── */}
            <SectionAccordion
              id="documents"
              title="Documents médicaux"
              icon="📄"
              expanded={expandedSections}
              onToggle={toggleSection}
              editing={editingSection === "documents"}
              onEdit={() => startEdit("documents")}
              onCancel={cancelEdit}
              onSave={() => saveSection("documents")}
              saving={saving}
            >
              {editingSection === "documents" && editData ? (
                <div className="space-y-3">
                  {editData.map((doc: any, i: number) => (
                    <div key={i} className="grid grid-cols-4 gap-2">
                      <select
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={doc.type}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], type: e.target.value };
                          setEditData(arr);
                        }}
                      >
                        <option value="lab">Analyse</option>
                        <option value="imaging">Imagerie</option>
                        <option value="prescription">Ordonnance</option>
                        <option value="other">Autre</option>
                      </select>
                      <input
                        placeholder="Nom"
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={doc.name}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], name: e.target.value };
                          setEditData(arr);
                        }}
                      />
                      <input
                        type="date"
                        className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                        value={doc.date}
                        onChange={(e) => {
                          const arr = [...editData];
                          arr[i] = { ...arr[i], date: e.target.value };
                          setEditData(arr);
                        }}
                      />
                      <div className="flex gap-1">
                        <input
                          placeholder="Description"
                          className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm"
                          value={doc.description}
                          onChange={(e) => {
                            const arr = [...editData];
                            arr[i] = { ...arr[i], description: e.target.value };
                            setEditData(arr);
                          }}
                        />
                        <button
                          onClick={() =>
                            setEditData(
                              editData.filter((_: any, j: number) => j !== i),
                            )
                          }
                          className="text-destructive"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() =>
                      setEditData([
                        ...editData,
                        {
                          id: `doc-${Date.now()}`,
                          type: "lab",
                          name: "",
                          date: "",
                          description: "",
                        },
                      ])
                    }
                    className="text-primary text-sm font-medium"
                  >
                    + Ajouter un document
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {d.documents?.length ? (
                    d.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 bg-secondary/10 rounded-lg"
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
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center space-y-2">
                      <FileText className="w-8 h-8 text-primary mx-auto" />
                      <p className="font-semibold text-foreground text-sm">
                        Aucun document
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cliquez sur Modifier pour ajouter des documents
                      </p>
                    </div>
                  )}
                </div>
              )}
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
                    <p className="text-xs text-muted-foreground">
                      Aucun médecin n'a actuellement accès à votre dossier
                    </p>
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
                              <p className="font-medium text-sm text-foreground">
                                Dr. {p.doctorName || "Médecin"}
                              </p>
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
  editing,
  onEdit,
  onCancel,
  onSave,
  saving,
  children,
}: {
  id: string;
  title: string;
  icon: string;
  expanded: string[];
  onToggle: (id: string) => void;
  editing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
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
          <div className="flex justify-end gap-2 pt-2">
            {editing ? (
              <>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary/30 transition"
                >
                  <X size={14} className="inline mr-1" />
                  Annuler
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={14} className="inline mr-1 animate-spin" />
                  ) : (
                    <Save size={14} className="inline mr-1" />
                  )}
                  Enregistrer
                </button>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary/5 transition"
              >
                <Pencil size={14} className="inline mr-1" />
                Modifier
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
