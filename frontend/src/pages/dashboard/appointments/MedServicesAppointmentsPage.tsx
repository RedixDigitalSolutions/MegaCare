import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
    Building2,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

interface FacilityAppointment {
    id: string;
    facilityId: string;
    facilityName: string;
    facilityType: "med_service" | "lab";
    service: string;
    date: string;
    time: string;
    status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled";
    notes: string;
    adminNotes: string;
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; classes: string; icon: React.ElementType }> = {
    pending: { label: "En attente", classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800", icon: Clock },
    confirmed: { label: "Confirmé", classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800", icon: CheckCircle2 },
    completed: { label: "Complété", classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800", icon: CheckCircle2 },
    cancelled: { label: "Annulé", classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800", icon: XCircle },
    rejected: { label: "Refusé", classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800", icon: XCircle },
};

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status, classes: "bg-secondary/50 text-foreground border-border", icon: AlertCircle };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
            <Icon size={12} />
            {cfg.label}
        </span>
    );
}

export default function MedServicesAppointmentsPage() {
    const [appointments, setAppointments] = useState<FacilityAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
    const tok = () => localStorage.getItem("megacare_token") ?? "";

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/appointments/facility?type=med_service", {
                    headers: { Authorization: `Bearer ${tok()}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setAppointments(Array.isArray(data) ? data : []);
                }
            } catch { /* ignore */ }
            setLoading(false);
        })();
    }, []);

    const today = new Date().toISOString().slice(0, 10);
    const upcoming = appointments.filter(
        (a) => (a.date >= today || a.status === "pending" || a.status === "confirmed") &&
            !["completed", "cancelled", "rejected"].includes(a.status)
    );
    const history = appointments.filter(
        (a) => ["completed", "cancelled", "rejected"].includes(a.status) || a.date < today
    );

    const shown = tab === "upcoming" ? upcoming : history;

    const fmtDate = (d: string) =>
        new Date(d + "T00:00:00").toLocaleDateString("fr-FR", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
        });

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <DashboardSidebar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Building2 size={18} className="text-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Services Médicaux</h1>
                            <p className="text-sm text-muted-foreground">Vos rendez-vous dans les cliniques et centres médicaux</p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-border gap-1">
                        {(["upcoming", "history"] as const).map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition ${tab === t
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {t === "upcoming" ? `À venir (${upcoming.length})` : `Historique (${history.length})`}
                            </button>
                        ))}
                    </div>

                    {/* Content */}
                    {shown.length === 0 ? (
                        <div className="text-center py-20 space-y-3 bg-card border border-border rounded-2xl">
                            <Calendar size={48} className="mx-auto text-muted-foreground/30" />
                            <p className="text-lg font-semibold text-foreground">
                                {tab === "upcoming" ? "Aucun rendez-vous à venir" : "Aucun historique"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {tab === "upcoming"
                                    ? "Vos rendez-vous avec les services médicaux apparaîtront ici."
                                    : "Vos anciens rendez-vous apparaîtront ici."}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            {/* Table header */}
                            <div className="hidden md:grid grid-cols-[1fr_1.2fr_auto_auto_auto] gap-4 px-5 py-3 bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                                <span>Établissement</span>
                                <span>Service / Examen</span>
                                <span>Date</span>
                                <span>Heure</span>
                                <span>Statut</span>
                            </div>

                            <div className="divide-y divide-border">
                                {shown.map((appt) => {
                                    const isExpanded = expandedId === appt.id;
                                    return (
                                        <div key={appt.id}>
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : appt.id)}
                                                className="w-full text-left px-5 py-4 hover:bg-secondary/20 transition"
                                            >
                                                <div className="grid md:grid-cols-[1fr_1.2fr_auto_auto_auto] gap-3 md:gap-4 items-center">
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                            <Building2 size={14} className="text-primary" />
                                                        </div>
                                                        <p className="text-sm font-semibold text-foreground truncate">{appt.facilityName}</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate hidden md:block">
                                                        {appt.service || "—"}
                                                    </p>
                                                    <p className="text-sm text-foreground hidden md:block whitespace-nowrap">
                                                        {fmtDate(appt.date)}
                                                    </p>
                                                    <p className="text-sm text-foreground hidden md:block whitespace-nowrap">
                                                        {appt.time}
                                                    </p>
                                                    <div className="flex items-center gap-2 justify-between md:justify-end">
                                                        <StatusBadge status={appt.status} />
                                                        {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                                                    </div>
                                                </div>
                                                {/* Mobile: date + time */}
                                                <div className="md:hidden flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                    <Calendar size={12} />
                                                    <span>{fmtDate(appt.date)}</span>
                                                    <Clock size={12} />
                                                    <span>{appt.time}</span>
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="px-5 pb-4 bg-secondary/10 border-t border-border space-y-2">
                                                    {appt.service && (
                                                        <p className="text-sm mt-3"><span className="font-medium">Service :</span> {appt.service}</p>
                                                    )}
                                                    {appt.notes && (
                                                        <p className="text-sm"><span className="font-medium">Vos notes :</span> {appt.notes}</p>
                                                    )}
                                                    {appt.adminNotes && (
                                                        <p className="text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-3 py-2 rounded-lg">
                                                            <span className="font-medium">Message de l'établissement :</span> {appt.adminNotes}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
