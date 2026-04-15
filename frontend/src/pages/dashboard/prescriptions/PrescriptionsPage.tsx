import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  Pill,
  Eye,
  ShoppingCart,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  User,
  FileText,
  Loader2,
} from "lucide-react";

interface PrescriptionData {
  id: string;
  doctorId: string;
  patientId: string;
  medicines: { name: string; dosage?: string; duration?: string }[];
  createdAt: string;
}

interface UIPrescription {
  id: string;
  doctor: string;
  date: string;
  expiryDate: string;
  status: "active" | "expired";
  medicines: { name: string; dosage?: string; duration?: string }[];
  notes?: string;
}

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    classes: "bg-green-100 text-green-700 border-green-200",
  },
  expired: {
    label: "Expirée",
    icon: XCircle,
    classes: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function PrescriptionsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [prescriptions, setPrescriptions] = useState<UIPrescription[]>([]);
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
    const headers = { Authorization: `Bearer ${token}` };

    fetch("/api/prescriptions", { headers })
      .then((r) => (r.ok ? r.json() : []))
      .then((j: any) => Array.isArray(j) ? j : (j.data ?? []))
      .then(async (rxs: PrescriptionData[]) => {
        // Resolve doctor names
        const doctorIds = [...new Set(rxs.map((r) => r.doctorId))];
        const names: Record<string, string> = {};
        await Promise.all(
          doctorIds.map((id) =>
            fetch(`/api/users/${id}`, { headers })
              .then((r) => (r.ok ? r.json() : null))
              .then((u) => {
                if (u) names[id] = `Dr. ${u.firstName} ${u.lastName}`;
              })
              .catch(() => { }),
          ),
        );

        const now = new Date();
        setPrescriptions(
          rxs.map((rx) => {
            const created = new Date(rx.createdAt);
            const expiry = new Date(created.getTime() + 90 * 24 * 3600000); // 90 days validity
            const isExpired = expiry < now;
            return {
              id: rx.id,
              doctor: names[rx.doctorId] || "Médecin",
              date: created.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              expiryDate: expiry.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
              status: isExpired ? "expired" : "active",
              medicines: rx.medicines || [],
              notes: "",
            };
          }),
        );
        if (rxs.length > 0) setExpandedId(rxs[0].id);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user || user.role !== "patient")
    return null;

  const active = prescriptions.filter((rx) => rx.status === "active");
  const expired = prescriptions.filter((rx) => rx.status === "expired");

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-4xl">
            {/* Page Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Pill size={28} className="text-primary" />
                Mes Ordonnances
              </h1>
              <p className="text-muted-foreground mt-1">
                Consultez et gérez vos prescriptions médicales
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {active.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Actives</p>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {expired.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Expirées</p>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 col-span-2 md:col-span-1">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {prescriptions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </div>

            {/* Prescription list */}
            <div className="space-y-4">
              {prescriptions.map((rx) => {
                const cfg =
                  statusConfig[rx.status as keyof typeof statusConfig];
                const StatusIcon = cfg.icon;
                const isExpanded = expandedId === rx.id;

                return (
                  <div
                    key={rx.id}
                    className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition"
                  >
                    {/* Card Header */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : rx.id)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <User size={18} className="text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">
                              {rx.doctor}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar size={11} /> {rx.date}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock size={11} /> Expire: {rx.expiryDate}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border flex items-center gap-1 ${cfg.classes}`}
                        >
                          <StatusIcon size={11} /> {cfg.label}
                        </span>
                        {isExpanded ? (
                          <ChevronUp
                            size={16}
                            className="text-muted-foreground"
                          />
                        ) : (
                          <ChevronDown
                            size={16}
                            className="text-muted-foreground"
                          />
                        )}
                      </div>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="border-t border-border px-5 pb-5 pt-4 space-y-4">
                        {/* Medicines */}
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                            Médicaments prescrits
                          </p>
                          <div className="space-y-2">
                            {rx.medicines.map((med, idx) => (
                              <div
                                key={idx}
                                className="flex items-start justify-between gap-2 bg-secondary/50 rounded-lg px-4 py-3"
                              >
                                <div>
                                  <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                                    <Pill
                                      size={13}
                                      className="text-primary shrink-0"
                                    />
                                    {med.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {med.dosage}
                                  </p>
                                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <Clock size={10} /> {med.duration}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Notes */}
                        {rx.notes && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                            <p className="text-xs font-semibold text-amber-800 mb-1">
                              Notes du médecin
                            </p>
                            <p className="text-sm text-amber-700 italic">
                              {rx.notes}
                            </p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 flex-wrap pt-1">
                          {rx.status === "active" && (
                            <Link
                              to="/pharmacy"
                              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
                            >
                              <ShoppingCart size={14} />
                              Commander en pharmacie
                            </Link>
                          )}
                          <button className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition text-sm font-medium text-foreground">
                            <Eye size={14} />
                            Voir l'ordonnance PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
