import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  Search,
  Phone,
  FileText,
  User,
  ChevronRight,
  X,
  Calendar,
  Activity,
  Heart,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

type PatientStatus = "Actif" | "Inactif" | "Urgent";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  phone: string;
  email: string;
  lastVisit: string;
  nextVisit: string | null;
  status: PatientStatus;
  condition: string;
  consultations: number;
  bloodType: string;
  allergies: string[];
  recentNotes: string;
}

const PATIENTS: Patient[] = [
  {
    id: 1,
    firstName: "Fatima",
    lastName: "Benali",
    age: 34,
    phone: "+216 98 123 456",
    email: "fatima.benali@email.com",
    lastVisit: "2026-04-03",
    nextVisit: "2026-05-03",
    status: "Actif",
    condition: "Hypertension artérielle",
    consultations: 12,
    bloodType: "A+",
    allergies: ["Pénicilline"],
    recentNotes: "TA stable sous traitement. Renouvellement Amlodipine 5mg.",
  },
  {
    id: 2,
    firstName: "Mohamed",
    lastName: "Karoui",
    age: 52,
    phone: "+216 98 234 567",
    email: "m.karoui@email.com",
    lastVisit: "2026-04-02",
    nextVisit: "2026-04-16",
    status: "Urgent",
    condition: "Insuffisance cardiaque",
    consultations: 24,
    bloodType: "O+",
    allergies: ["Aspirine", "Iode"],
    recentNotes: "Œdèmes aux membres inférieurs. Ajustement Furosémide.",
  },
  {
    id: 3,
    firstName: "Aisha",
    lastName: "Hamdi",
    age: 28,
    phone: "+216 98 345 678",
    email: "aisha.hamdi@email.com",
    lastVisit: "2026-03-28",
    nextVisit: "2026-04-05",
    status: "Actif",
    condition: "Palpitations bénignes",
    consultations: 4,
    bloodType: "B+",
    allergies: [],
    recentNotes: "Holter prescrit. Éviter excitants.",
  },
  {
    id: 4,
    firstName: "Salim",
    lastName: "Drissi",
    age: 61,
    phone: "+216 98 456 789",
    email: "s.drissi@email.com",
    lastVisit: "2026-02-15",
    nextVisit: null,
    status: "Inactif",
    condition: "Cholestérolémie",
    consultations: 7,
    bloodType: "AB-",
    allergies: ["Statines (myopathie)"],
    recentNotes: "Perdu de vue depuis 6 semaines. Rappel recommandé.",
  },
  {
    id: 5,
    firstName: "Layla",
    lastName: "Meddeb",
    age: 41,
    phone: "+216 98 567 890",
    email: "layla.meddeb@email.com",
    lastVisit: "2026-04-01",
    nextVisit: "2026-04-15",
    status: "Actif",
    condition: "Arythmie sinusale",
    consultations: 9,
    bloodType: "A-",
    allergies: [],
    recentNotes: "ECG de contrôle normal. Surveillance continue.",
  },
  {
    id: 6,
    firstName: "Youssef",
    lastName: "Tlili",
    age: 47,
    phone: "+216 98 678 901",
    email: "y.tlili@email.com",
    lastVisit: "2026-04-01",
    nextVisit: "2026-04-22",
    status: "Actif",
    condition: "Angine de poitrine stable",
    consultations: 18,
    bloodType: "O-",
    allergies: ["Bêtabloquants"],
    recentNotes: "Stabilisé sous nitrates longue durée.",
  },
  {
    id: 7,
    firstName: "Nadia",
    lastName: "Boughanmi",
    age: 36,
    phone: "+216 98 789 012",
    email: "n.boughanmi@email.com",
    lastVisit: "2026-03-30",
    nextVisit: "2026-05-10",
    status: "Actif",
    condition: "Anxiété cardiovasculaire",
    consultations: 5,
    bloodType: "B-",
    allergies: [],
    recentNotes: "Bilan complet normal. Suivi trimestriel.",
  },
];

const STATUS_CFG: Record<
  PatientStatus,
  { label: string; badgeCls: string; dot: string; icon: React.ReactNode }
> = {
  Actif: {
    label: "Actif",
    badgeCls: "bg-green-100 text-green-700",
    dot: "bg-green-400",
    icon: <CheckCircle size={14} className="text-green-600" />,
  },
  Inactif: {
    label: "Inactif",
    badgeCls: "bg-gray-100 text-gray-600",
    dot: "bg-gray-400",
    icon: <Activity size={14} className="text-gray-500" />,
  },
  Urgent: {
    label: "Urgent",
    badgeCls: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    icon: <AlertCircle size={14} className="text-red-600" />,
  },
};

function getInitials(p: Patient) {
  return `${p.firstName[0]}${p.lastName[0]}`.toUpperCase();
}

export default function DoctorPatientsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientStatus | "Tous">(
    "Tous",
  );
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const filtered = PATIENTS.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const matchQuery =
      !query ||
      fullName.includes(query.toLowerCase()) ||
      p.condition.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query);
    const matchStatus = statusFilter === "Tous" || p.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const countOf = (s: PatientStatus | "Tous") =>
    s === "Tous"
      ? PATIENTS.length
      : PATIENTS.filter((p) => p.status === s).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">Mes Patients</h1>
            <p className="text-muted-foreground mt-1">
              {PATIENTS.length} patients enregistrés
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(["Tous", "Actif", "Urgent", "Inactif"] as const).map((s) => (
                <div
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`bg-card border rounded-xl p-4 text-center cursor-pointer transition hover:shadow-md ${
                    statusFilter === s
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  <p
                    className={`text-2xl font-bold ${
                      s === "Urgent"
                        ? "text-red-600"
                        : s === "Inactif"
                          ? "text-gray-500"
                          : s === "Actif"
                            ? "text-green-600"
                            : "text-foreground"
                    }`}
                  >
                    {countOf(s)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {s === "Tous" ? "Total" : s}
                  </p>
                </div>
              ))}
            </div>

            {/* Search + Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5">
                <Search size={17} className="text-muted-foreground shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher par nom, condition, téléphone…"
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-0.5 hover:bg-muted rounded"
                  >
                    <X size={14} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Patient Cards */}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                Aucun patient ne correspond à votre recherche.
              </div>
            )}
            <div className="space-y-3">
              {filtered.map((patient) => {
                const cfg = STATUS_CFG[patient.status];
                return (
                  <div
                    key={patient.id}
                    className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition flex items-start gap-4"
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-sm">
                        {getInitials(patient)}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${cfg.dot}`}
                      />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {patient.firstName} {patient.lastName}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {patient.age} ans · {patient.bloodType}
                        </span>
                        <span
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badgeCls}`}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                        <Heart size={12} className="text-primary/60" />
                        {patient.condition}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          Dernière visite: {patient.lastVisit}
                        </span>
                        {patient.nextVisit && (
                          <span className="flex items-center gap-1 text-primary">
                            <Calendar size={11} />
                            Prochaine: {patient.nextVisit}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Phone size={11} />
                          {patient.phone}
                        </span>
                        <span>{patient.consultations} consultations</span>
                      </div>

                      {patient.allergies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {patient.allergies.map((a) => (
                            <span
                              key={a}
                              className="text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full"
                            >
                              ⚠ {a}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0 items-end">
                      <button
                        onClick={() => setSelectedPatient(patient)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                      >
                        <FileText size={14} />
                        Dossier
                      </button>
                      <a
                        href={`tel:${patient.phone}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition text-sm"
                      >
                        <Phone size={14} />
                        Appeler
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>

      {/* Patient File Drawer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedPatient(null)}
          />
          <aside className="relative w-full max-w-md bg-card flex flex-col h-full overflow-y-auto shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-lg">
                  {getInitials(selectedPatient)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.age} ans · {selectedPatient.bloodType}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 hover:bg-muted rounded-lg transition mt-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 p-6 space-y-6">
              {/* Status & Condition */}
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${STATUS_CFG[selectedPatient.status].badgeCls}`}
                >
                  {STATUS_CFG[selectedPatient.status].icon}
                  {selectedPatient.status}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Heart size={14} className="text-primary/60" />
                  {selectedPatient.condition}
                </span>
              </div>

              {/* Contact */}
              <section className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Contact
                </h3>
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <Phone size={14} className="text-muted-foreground" />
                    {selectedPatient.phone}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground">
                    <User size={14} className="text-muted-foreground" />
                    {selectedPatient.email}
                  </div>
                </div>
              </section>

              {/* Visits */}
              <section className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Visites
                </h3>
                <div className="bg-muted/30 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Dernière visite
                    </span>
                    <span className="font-medium text-foreground">
                      {selectedPatient.lastVisit}
                    </span>
                  </div>
                  {selectedPatient.nextVisit && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Prochaine visite
                      </span>
                      <span className="font-medium text-primary">
                        {selectedPatient.nextVisit}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-medium text-foreground">
                      {selectedPatient.consultations} consultation
                      {selectedPatient.consultations > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </section>

              {/* Allergies */}
              <section className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Allergies
                </h3>
                {selectedPatient.allergies.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">
                    Aucune allergie connue
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((a) => (
                      <span
                        key={a}
                        className="text-sm bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full font-medium"
                      >
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                )}
              </section>

              {/* Recent Notes */}
              <section className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Dernières notes
                </h3>
                <p className="text-sm text-foreground bg-muted/40 rounded-xl p-4 leading-relaxed">
                  {selectedPatient.recentNotes}
                </p>
              </section>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-border flex gap-3">
              <a
                href={`tel:${selectedPatient.phone}`}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition text-sm font-medium"
              >
                <Phone size={15} />
                Appeler
              </a>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium">
                <ChevronRight size={15} />
                Voir dossier complet
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
