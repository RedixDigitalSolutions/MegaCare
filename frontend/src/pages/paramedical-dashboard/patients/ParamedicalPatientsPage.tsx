import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  Search,
  FileText,
  MessageCircle,
  Calendar,
  ChevronRight,
  UserCircle2,
  Plus,
} from "lucide-react";

type PatientStatus = "Actif" | "Suivi" | "Clôturé";

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  status: PatientStatus;
  nextAppointment: string | null;
  careType: string;
  phone: string;
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

const statusColors: Record<PatientStatus, string> = {
  Actif: "bg-green-100 text-green-700",
  Suivi: "bg-blue-100 text-blue-700",
  Clôturé: "bg-slate-100 text-slate-500",
};

const statusFilters: Array<PatientStatus | "Tous"> = ["Tous", "Actif", "Suivi", "Clôturé"];

export default function ParamedicalPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<PatientStatus | "Tous">("Tous");
  const [selected, setSelected] = useState<Patient | null>(null);

  useEffect(() => {
    fetch("/api/paramedical/patients", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => setPatients(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const filtered = patients.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition.toLowerCase().includes(search.toLowerCase()) ||
      p.careType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tous" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Patients</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {patients.length} patients — {patients.filter((p) => p.status === "Actif").length} actifs
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition">
              <Plus size={15} />
              Nouveau patient
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Rechercher par nom, pathologie, type de soin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition ${filterStatus === s
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Patient grid */}
          {filtered.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground text-sm">
              Aucun patient trouvé.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((patient) => (
                <div
                  key={patient.id}
                  className="bg-card rounded-xl border border-border p-5 space-y-4 hover:shadow-md hover:border-primary/30 transition-all"
                >
                  {/* Patient identity */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0">
                      <UserCircle2 size={22} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-foreground truncate">{patient.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[patient.status]}`}>
                          {patient.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{patient.age} ans · {patient.careType}</p>
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="bg-muted/40 rounded-lg px-3 py-2">
                    <p className="text-xs text-muted-foreground mb-0.5">Pathologie</p>
                    <p className="text-sm text-foreground">{patient.condition}</p>
                  </div>

                  {/* Next appointment */}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    {patient.nextAppointment
                      ? <>Prochain RDV : <span className="font-medium text-foreground">{new Date(patient.nextAppointment).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}</span></>
                      : "Aucun rendez-vous planifié"
                    }
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs border border-border rounded-lg hover:border-primary hover:text-primary transition">
                      <FileText size={13} />
                      Dossier médical
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs border border-border rounded-lg hover:border-primary hover:text-primary transition">
                      <MessageCircle size={13} />
                      Message
                    </button>
                    <button
                      onClick={() => setSelected(patient)}
                      className="p-2 border border-border rounded-lg hover:border-primary hover:text-primary transition"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Patient detail slide-in */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <aside className="relative w-full max-w-sm bg-card border-l border-border flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="font-semibold text-foreground">Fiche patient</h2>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition text-xl leading-none">&times;</button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Identity */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                  <UserCircle2 size={32} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{selected.name}</p>
                  <p className="text-sm text-muted-foreground">{selected.age} ans</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[selected.status]}`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                {[
                  { label: "Pathologie", value: selected.condition },
                  { label: "Type de soin", value: selected.careType },
                  { label: "Téléphone", value: selected.phone },
                  {
                    label: "Prochain RDV",
                    value: selected.nextAppointment
                      ? new Date(selected.nextAppointment).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
                      : "Non planifié",
                  },
                ].map((row) => (
                  <div key={row.label} className="bg-muted/40 rounded-lg px-4 py-3">
                    <p className="text-xs text-muted-foreground mb-0.5">{row.label}</p>
                    <p className="text-sm font-medium text-foreground">{row.value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-1">
                <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition">
                  <FileText size={15} />
                  Ouvrir le dossier médical
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-sm hover:border-primary hover:text-primary transition">
                  <MessageCircle size={15} />
                  Envoyer un message
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
