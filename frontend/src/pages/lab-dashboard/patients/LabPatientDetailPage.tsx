import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import {
    ArrowLeft,
    Phone,
    Mail,
    Calendar,
    Clock,
    FlaskConical,
    FileText,
    Loader2,
    Users,
} from "lucide-react";

const tok = () => localStorage.getItem("megacare_token") ?? "";

interface Appointment {
    id: string;
    date: string;
    time: string;
    service: string;
    status: string;
    notes: string;
    adminNotes: string;
    prescriptionUrl: string;
}

interface PatientDetail {
    patientId: string;
    name: string;
    email: string;
    phone: string;
    appointments: Appointment[];
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    pending: { label: "En attente", bg: "bg-amber-100", text: "text-amber-700" },
    confirmed: { label: "Confirmé", bg: "bg-blue-100", text: "text-blue-700" },
    completed: { label: "Terminé", bg: "bg-green-100", text: "text-green-700" },
    rejected: { label: "Refusé", bg: "bg-red-100", text: "text-red-700" },
    cancelled: { label: "Annulé", bg: "bg-slate-100", text: "text-slate-600" },
};

function formatDate(dateStr: string): string {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
}

export default function LabPatientDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [patient, setPatient] = useState<PatientDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/lab/patients/${id}`, {
            headers: { Authorization: `Bearer ${tok()}` },
        })
            .then((r) => {
                if (!r.ok) throw new Error();
                return r.json();
            })
            .then((d) => setPatient(d))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    const completed = patient?.appointments.filter((a) => a.status === "completed").length ?? 0;
    const pending = patient?.appointments.filter((a) => a.status === "pending" || a.status === "confirmed").length ?? 0;
    const total = patient?.appointments.length ?? 0;

    return (
        <div className="flex min-h-screen bg-background">
            <LabDashboardSidebar />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-card border-b border-border px-6 py-4 flex items-center gap-4 shrink-0">
                    <button
                        onClick={() => navigate("/lab-dashboard/patients")}
                        className="p-2 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
                        aria-label="Retour"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-foreground">
                            {loading ? "Chargement…" : patient?.name ?? "Patient"}
                        </h1>
                        <p className="text-xs text-muted-foreground">Fiche patient &amp; historique des rendez-vous</p>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={28} className="animate-spin text-muted-foreground" />
                        </div>
                    ) : error || !patient ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-3 text-center">
                            <Users size={32} className="text-muted-foreground" />
                            <p className="text-base font-medium text-foreground">Patient introuvable</p>
                            <Link
                                to="/lab-dashboard/patients"
                                className="text-sm text-primary hover:underline"
                            >
                                Retour à la liste
                            </Link>
                        </div>
                    ) : (
                        <>
                            {/* Profile card */}
                            <div className="bg-card border border-border rounded-xl p-5">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <span className="text-primary font-bold text-xl">
                                            {patient.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-bold text-foreground">{patient.name}</p>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                            {patient.phone && (
                                                <a
                                                    href={`tel:${patient.phone}`}
                                                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
                                                >
                                                    <Phone size={13} />
                                                    {patient.phone}
                                                </a>
                                            )}
                                            {patient.email && (
                                                <a
                                                    href={`mailto:${patient.email}`}
                                                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
                                                >
                                                    <Mail size={13} />
                                                    {patient.email}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats row */}
                                <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-foreground">{total}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Total RDV</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-green-600">{completed}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">Terminés</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-amber-600">{pending}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">En cours</p>
                                    </div>
                                </div>
                            </div>

                            {/* Appointment history */}
                            <div className="bg-card border border-border rounded-xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-border">
                                    <h2 className="font-semibold text-foreground flex items-center gap-2">
                                        <Calendar size={16} className="text-primary" />
                                        Historique des rendez-vous
                                    </h2>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Uniquement les rendez-vous pris dans ce laboratoire
                                    </p>
                                </div>

                                {patient.appointments.length === 0 ? (
                                    <div className="py-12 text-center text-muted-foreground text-sm">
                                        Aucun rendez-vous enregistré.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border">
                                        {patient.appointments.map((appt) => {
                                            const st = statusConfig[appt.status] ?? {
                                                label: appt.status,
                                                bg: "bg-slate-100",
                                                text: "text-slate-600",
                                            };
                                            return (
                                                <div key={appt.id} className="px-5 py-4 flex items-start gap-4">
                                                    {/* Date/time column */}
                                                    <div className="shrink-0 w-24 text-right">
                                                        <p className="text-sm font-semibold text-foreground">{formatDate(appt.date)}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                                                            <Clock size={11} />
                                                            {appt.time}
                                                        </p>
                                                    </div>

                                                    {/* Divider dot */}
                                                    <div className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-primary/40" />

                                                    {/* Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {appt.service && (
                                                                <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                                                                    <FlaskConical size={13} className="text-primary" />
                                                                    {appt.service}
                                                                </span>
                                                            )}
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}
                                                            >
                                                                {st.label}
                                                            </span>
                                                        </div>
                                                        {appt.notes && (
                                                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                                                <span className="font-medium text-foreground">Note patient : </span>
                                                                {appt.notes}
                                                            </p>
                                                        )}
                                                        {appt.adminNotes && (
                                                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                                                <span className="font-medium text-foreground">Note interne : </span>
                                                                {appt.adminNotes}
                                                            </p>
                                                        )}
                                                        {appt.prescriptionUrl && (
                                                            <a
                                                                href={appt.prescriptionUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                            >
                                                                <FileText size={12} />
                                                                Voir l'ordonnance
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}
