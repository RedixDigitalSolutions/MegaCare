import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import {
    Search,
    Users,
    ChevronRight,
    Calendar,
    Clock,
    Phone,
    Mail,
    Loader2,
} from "lucide-react";

const tok = () => localStorage.getItem("megacare_token") ?? "";

interface LabPatient {
    patientId: string;
    name: string;
    email: string;
    phone: string;
    appointmentCount: number;
    lastDate: string;
    lastStatus: string;
    lastService: string;
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

export default function LabPatientsPage() {
    const [patients, setPatients] = useState<LabPatient[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("/api/lab/patients", {
            headers: { Authorization: `Bearer ${tok()}` },
        })
            .then((r) => r.json())
            .then((d) => setPatients(Array.isArray(d) ? d : []))
            .catch(() => setPatients([]))
            .finally(() => setLoading(false));
    }, []);

    const filtered = patients.filter(
        (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase()) ||
            p.phone.includes(search)
    );

    return (
        <div className="flex min-h-screen bg-background">
            <LabDashboardSidebar />

            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Header */}
                <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shrink-0">
                    <div>
                        <h1 className="text-xl font-bold text-foreground">Patients</h1>
                        <p className="text-xs text-muted-foreground">
                            Historique des patients ayant pris rendez-vous au laboratoire
                        </p>
                    </div>
                    <div className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5">
                        <Users size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">{patients.length} patient{patients.length !== 1 ? "s" : ""}</span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email ou téléphone…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                        />
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 size={28} className="animate-spin text-muted-foreground" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                                <Users size={24} className="text-muted-foreground" />
                            </div>
                            <p className="text-base font-medium text-foreground">
                                {search ? "Aucun patient trouvé" : "Aucun patient pour l'instant"}
                            </p>
                            <p className="text-sm text-muted-foreground max-w-xs">
                                {search
                                    ? "Essayez avec un autre terme de recherche."
                                    : "Les patients apparaîtront ici dès qu'un rendez-vous sera pris au laboratoire."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filtered.map((patient) => {
                                const status = statusConfig[patient.lastStatus] ?? { label: patient.lastStatus, bg: "bg-slate-100", text: "text-slate-600" };
                                return (
                                    <Link
                                        key={patient.patientId}
                                        to={`/lab-dashboard/patients/${patient.patientId}`}
                                        className="block bg-card border border-border rounded-xl p-4 hover:border-primary/40 hover:shadow-sm transition group"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <span className="text-primary font-bold text-base">
                                                    {patient.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-foreground text-sm truncate">{patient.name}</p>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1">
                                                    {patient.phone && (
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Phone size={11} />
                                                            {patient.phone}
                                                        </span>
                                                    )}
                                                    {patient.email && (
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <Mail size={11} />
                                                            {patient.email}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar size={12} />
                                                    {patient.appointmentCount} RDV
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock size={12} />
                                                    Dernier : {formatDate(patient.lastDate)}
                                                </span>
                                            </div>

                                            <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition shrink-0" />
                                        </div>

                                        {/* Last service */}
                                        {patient.lastService && (
                                            <p className="mt-2 ml-15 text-xs text-muted-foreground truncate pl-[60px]">
                                                Dernier examen : <span className="text-foreground">{patient.lastService}</span>
                                            </p>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
