import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import {
  FaUserMd,
  FaPills,
  FaHospital,
  FaMicroscope,
  FaUserNurse,
  FaUserAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaShieldAlt,
  FaUsers,
  FaSync,
  FaBan,
} from "react-icons/fa";
import {
  X,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  Building2,
  FileText,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";

// ── Types ─────────────────────────────────────────────────────────────────────

type UserStatus = "pending" | "approved" | "rejected" | "suspended";

interface ManagedUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  status: UserStatus;
  phone?: string;
  specialization?: string;
  doctorId?: string;
  pharmacyId?: string;
  companyName?: string;
  address?: string;
  registrationDate?: string;
  createdAt?: string;
}

type FilterStatus = "all" | UserStatus;

// ── Config ───────────────────────────────────────────────────────────────────

const ROLES = [
  "patient",
  "doctor",
  "pharmacy",
  "medical_service",
  "lab_radiology",
  "paramedical",
] as const;

const roleConfig: Record<
  string,
  { label: string; Icon: React.ElementType; gradient: string; light: string }
> = {
  patient: {
    label: "Patient",
    Icon: FaUserAlt,
    gradient: "from-blue-500 to-cyan-500",
    light: "bg-blue-50 text-blue-700",
  },
  doctor: {
    label: "Médecin",
    Icon: FaUserMd,
    gradient: "from-emerald-500 to-teal-500",
    light: "bg-emerald-50 text-emerald-700",
  },
  pharmacy: {
    label: "Pharmacien",
    Icon: FaPills,
    gradient: "from-green-500 to-lime-500",
    light: "bg-green-50 text-green-700",
  },
  medical_service: {
    label: "Services Médicaux",
    Icon: FaHospital,
    gradient: "from-purple-500 to-indigo-500",
    light: "bg-purple-50 text-purple-700",
  },
  lab_radiology: {
    label: "Labos & Radiologie",
    Icon: FaMicroscope,
    gradient: "from-rose-500 to-pink-500",
    light: "bg-rose-50 text-rose-700",
  },
  paramedical: {
    label: "Paramédicaux",
    Icon: FaUserNurse,
    gradient: "from-sky-500 to-blue-500",
    light: "bg-sky-50 text-sky-700",
  },
};

const statusCfg: Record<
  UserStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  pending: {
    label: "En attente",
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  approved: {
    label: "Approuvé",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  rejected: {
    label: "Refusé",
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
  },
  suspended: {
    label: "Suspendu",
    bg: "bg-slate-100",
    text: "text-slate-600",
    border: "border-slate-200",
  },
};

const StatusBadge = ({ status }: { status: UserStatus }) => {
  const cfg = statusCfg[status];
  const icons: Record<UserStatus, React.ReactNode> = {
    pending: <FaClock size={9} />,
    approved: <FaCheckCircle size={9} />,
    rejected: <FaTimesCircle size={9} />,
    suspended: <FaBan size={9} />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      {icons[status]} {cfg.label}
    </span>
  );
};

const getDisplayName = (u: ManagedUser) =>
  u.firstName && u.lastName
    ? `${u.firstName} ${u.lastName}`
    : u.name || u.email;

const getRegDate = (u: ManagedUser) => {
  const raw = u.registrationDate ?? u.createdAt;
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [detailUser, setDetailUser] = useState<ManagedUser | null>(null);

  // ── Fetch ─────────────────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    setFetching(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers(await res.json());
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
    if (!isLoading && user && user.role !== "admin") {
      navigate("/");
      return;
    }
    if (!isLoading && user) fetchUsers();
  }, [isLoading, user, navigate, fetchUsers]);

  // ── Actions ───────────────────────────────────────────────────────────────

  type Action = "approve" | "reject" | "suspend" | "reactivate";

  const handleAction = async (userId: string, action: Action) => {
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    const key = userId + action;
    setActionLoading(key);

    const endpoint = action === "reactivate" ? "approve" : action;
    try {
      const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const newStatus: UserStatus =
          action === "approve" || action === "reactivate"
            ? "approved"
            : action === "suspend"
              ? "suspended"
              : "rejected";
        const update = (prev: ManagedUser[]) =>
          prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
        setUsers(update);
        if (detailUser?.id === userId)
          setDetailUser((u) => (u ? { ...u, status: newStatus } : u));
      }
    } finally {
      setActionLoading(null);
    }
  };

  // ── Computed ──────────────────────────────────────────────────────────────

  if (isLoading || !user) return null;
  if (user.role !== "admin") return null;

  const counts = {
    all: users.length,
    pending: users.filter((u) => u.status === "pending").length,
    approved: users.filter((u) => u.status === "approved").length,
    rejected: users.filter((u) => u.status === "rejected").length,
    suspended: users.filter((u) => u.status === "suspended").length,
  };

  const roleStats = ROLES.map((role) => {
    const group = users.filter((u) => u.role === role);
    return {
      role,
      total: group.length,
      pending: group.filter((u) => u.status === "pending").length,
      approved: group.filter((u) => u.status === "approved").length,
      rejected: group.filter((u) => u.status === "rejected").length,
      suspended: group.filter((u) => u.status === "suspended").length,
    };
  });

  const pendingUsers = users.filter((u) => u.status === "pending");

  const filtered = users.filter((u) => {
    const matchStatus = filter === "all" || u.status === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      getDisplayName(u).toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (roleConfig[u.role]?.label ?? "").toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen bg-background">
      <AdminDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Page header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Administration
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gestion des comptes et des accès
            </p>
          </div>
          <button
            onClick={fetchUsers}
            disabled={fetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50"
          >
            <FaSync size={12} className={fetching ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>

        <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          {/* ── 1. Status KPI row ── */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(
              [
                "all",
                "pending",
                "approved",
                "rejected",
                "suspended",
              ] as FilterStatus[]
            ).map((key) => {
              const labels: Record<FilterStatus, string> = {
                all: "Total",
                pending: "En attente",
                approved: "Approuvés",
                rejected: "Refusés",
                suspended: "Suspendus",
              };
              const styles: Record<FilterStatus, string> = {
                all: "text-foreground bg-card border-border",
                pending: "text-amber-700 bg-amber-50 border-amber-200",
                approved: "text-emerald-700 bg-emerald-50 border-emerald-200",
                rejected: "text-red-700 bg-red-50 border-red-200",
                suspended: "text-slate-600 bg-slate-50 border-slate-200",
              };
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`rounded-2xl border p-4 text-left transition hover:shadow-sm ${styles[key]} ${filter === key ? "ring-2 ring-primary/40" : ""}`}
                >
                  <p className="text-2xl font-bold">
                    {counts[key as keyof typeof counts]}
                  </p>
                  <p className="text-xs font-medium opacity-70 mt-0.5">
                    {labels[key]}
                  </p>
                </button>
              );
            })}
          </div>

          {/* ── 4. Role-Based Stats ── */}
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <FaUsers size={14} className="text-primary" />
              Utilisateurs par rôle
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {roleStats.map((rs) => {
                const cfg = roleConfig[rs.role] ?? roleConfig.patient;
                const { Icon: RoleIcon, gradient, label } = cfg;
                if (rs.total === 0) return null;
                return (
                  <div
                    key={rs.role}
                    className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
                    >
                      <RoleIcon className="text-white" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        {label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rs.total} compte{rs.total > 1 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {rs.pending > 0 && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            {rs.pending} en attente
                          </span>
                        )}
                        {rs.approved > 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            {rs.approved} approuvé{rs.approved > 1 ? "s" : ""}
                          </span>
                        )}
                        {rs.rejected > 0 && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                            {rs.rejected} refusé{rs.rejected > 1 ? "s" : ""}
                          </span>
                        )}
                        {rs.suspended > 0 && (
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                            {rs.suspended} suspendu{rs.suspended > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {roleStats.every((rs) => rs.total === 0) && (
                <p className="text-sm text-muted-foreground col-span-3">
                  Aucun utilisateur enregistré.
                </p>
              )}
            </div>
          </section>

          {/* ── 2. Pending Approvals Panel ── */}
          {pendingUsers.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-500" />
                  Approbations en attente
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                  {pendingUsers.length}
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-2xl divide-y divide-amber-200/60 overflow-hidden">
                {pendingUsers.map((u) => {
                  const cfg = roleConfig[u.role] ?? roleConfig.patient;
                  const { Icon: RoleIcon, gradient, label } = cfg;
                  return (
                    <div
                      key={u.id}
                      className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-3.5"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
                      >
                        <RoleIcon className="text-white" size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground">
                            {getDisplayName(u)}
                          </p>
                          <span className="text-xs bg-amber-200/70 text-amber-800 px-2 py-0.5 rounded-full">
                            {label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {u.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setDetailUser(u)}
                          className="p-1.5 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-200/50 transition"
                          title="Voir le profil"
                        >
                          <ChevronRight size={14} />
                        </button>
                        <button
                          onClick={() => handleAction(u.id, "approve")}
                          disabled={actionLoading === u.id + "approve"}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition disabled:opacity-50"
                        >
                          {actionLoading === u.id + "approve" ? (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                          ) : (
                            <FaCheckCircle size={11} />
                          )}
                          Approuver
                        </button>
                        <button
                          onClick={() => handleAction(u.id, "reject")}
                          disabled={actionLoading === u.id + "reject"}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive hover:opacity-90 text-white text-xs font-semibold transition disabled:opacity-50"
                        >
                          {actionLoading === u.id + "reject" ? (
                            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                          ) : (
                            <FaTimesCircle size={11} />
                          )}
                          Refuser
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── 1. Full User List ── */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <FaUsers size={14} className="text-primary" />
              Tous les utilisateurs
            </h2>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="text"
                placeholder="Rechercher par nom, email ou rôle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 min-w-48 px-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <div className="flex rounded-xl border border-border overflow-hidden text-xs font-medium">
                {(
                  [
                    "all",
                    "pending",
                    "approved",
                    "rejected",
                    "suspended",
                  ] as FilterStatus[]
                ).map((key) => {
                  const labels: Record<FilterStatus, string> = {
                    all: "Tout",
                    pending: "En attente",
                    approved: "Approuvés",
                    rejected: "Refusés",
                    suspended: "Suspendus",
                  };
                  return (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`px-3 py-2 transition ${filter === key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`}
                    >
                      {labels[key]}
                      {key !== "all" &&
                        counts[key as keyof typeof counts] > 0 && (
                          <span
                            className={`ml-1 px-1 rounded-full text-xs ${filter === key ? "bg-white/30" : "bg-muted"}`}
                          >
                            {counts[key as keyof typeof counts]}
                          </span>
                        )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List */}
            {fetching ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <FaUsers size={36} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">
                  Aucun utilisateur dans cette catégorie
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filtered.map((u) => {
                  const cfg = roleConfig[u.role] ?? roleConfig.patient;
                  const { Icon: RoleIcon, gradient, label, light } = cfg;
                  return (
                    <div
                      key={u.id}
                      className="bg-card border border-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-primary/30 transition cursor-pointer"
                      onClick={() => setDetailUser(u)}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
                      >
                        <RoleIcon className="text-white" size={18} />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <p className="font-semibold text-foreground text-sm">
                            {getDisplayName(u)}
                          </p>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-semibold ${light}`}
                          >
                            {label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {u.email}
                        </p>
                        {u.specialization && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {u.specialization}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Calendar size={10} />
                          {getRegDate(u)}
                        </p>
                      </div>
                      {/* Status */}
                      <StatusBadge status={u.status} />
                      {/* Quick actions — stop propagation so clicking action button doesn't open detail */}
                      <div
                        className="flex gap-2 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {u.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAction(u.id, "approve")}
                              disabled={actionLoading === u.id + "approve"}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition disabled:opacity-50"
                            >
                              {actionLoading === u.id + "approve" ? (
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                              ) : (
                                <FaCheckCircle size={11} />
                              )}
                              Approuver
                            </button>
                            <button
                              onClick={() => handleAction(u.id, "reject")}
                              disabled={actionLoading === u.id + "reject"}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive hover:opacity-90 text-white text-xs font-semibold transition disabled:opacity-50"
                            >
                              {actionLoading === u.id + "reject" ? (
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                              ) : (
                                <FaTimesCircle size={11} />
                              )}
                              Refuser
                            </button>
                          </>
                        )}
                        {u.status === "approved" && (
                          <>
                            <button
                              onClick={() => handleAction(u.id, "suspend")}
                              disabled={actionLoading === u.id + "suspend"}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition disabled:opacity-50"
                            >
                              <FaBan size={11} />
                              Suspendre
                            </button>
                            <button
                              onClick={() => handleAction(u.id, "reject")}
                              disabled={actionLoading === u.id + "reject"}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/5 text-xs font-semibold transition disabled:opacity-50"
                            >
                              <FaTimesCircle size={11} />
                              Révoquer
                            </button>
                          </>
                        )}
                        {u.status === "suspended" && (
                          <button
                            onClick={() => handleAction(u.id, "reactivate")}
                            disabled={actionLoading === u.id + "reactivate"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition disabled:opacity-50"
                          >
                            <FaCheckCircle size={11} />
                            Réactiver
                          </button>
                        )}
                        {u.status === "rejected" && (
                          <button
                            onClick={() => handleAction(u.id, "approve")}
                            disabled={actionLoading === u.id + "approve"}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold transition disabled:opacity-50"
                          >
                            <FaCheckCircle size={11} />
                            Ré-approuver
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Admin note */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-start gap-2">
            <FaShieldAlt size={13} className="text-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-foreground">
                Compte admin par défaut :
              </span>{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded">
                admin@megacare.tn
              </code>
              {" / "}
              <code className="bg-muted px-1.5 py-0.5 rounded">
                Admin@megacare2024
              </code>
              {" — Connectez-vous via la page "}
              <Link to="/login" className="text-primary underline">
                Connexion
              </Link>
              {" en sélectionnant le rôle Administrateur."}
            </div>
          </div>
        </main>
      </div>

      {/* ── 3. User Detail Slide-over ── */}
      {detailUser && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setDetailUser(null)}
          />
          {/* Panel */}
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <h2 className="font-bold text-foreground text-base">
                Profil utilisateur
              </h2>
              <button
                onClick={() => setDetailUser(null)}
                className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Avatar + status */}
              {(() => {
                const cfg = roleConfig[detailUser.role] ?? roleConfig.patient;
                const { Icon: RoleIcon, gradient, label } = cfg;
                return (
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
                    >
                      <RoleIcon className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground">
                        {getDisplayName(detailUser)}
                      </p>
                      <p className="text-xs text-muted-foreground">{label}</p>
                      <div className="mt-1">
                        <StatusBadge status={detailUser.status} />
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Fields */}
              <div className="bg-muted/30 rounded-xl divide-y divide-border overflow-hidden">
                {[
                  {
                    icon: <Mail size={13} />,
                    label: "Email",
                    value: detailUser.email,
                  },
                  {
                    icon: <Phone size={13} />,
                    label: "Téléphone",
                    value: detailUser.phone,
                  },
                  {
                    icon: <Stethoscope size={13} />,
                    label: "Spécialisation",
                    value: detailUser.specialization,
                  },
                  {
                    icon: <FileText size={13} />,
                    label: "N° de licence",
                    value: detailUser.doctorId,
                  },
                  {
                    icon: <Building2 size={13} />,
                    label: "Agrément pharmacie",
                    value: detailUser.pharmacyId,
                  },
                  {
                    icon: <Building2 size={13} />,
                    label: "Établissement",
                    value: detailUser.companyName,
                  },
                  {
                    icon: <MapPin size={13} />,
                    label: "Adresse",
                    value: detailUser.address,
                  },
                  {
                    icon: <Calendar size={13} />,
                    label: "Inscrit le",
                    value: getRegDate(detailUser),
                  },
                ]
                  .filter((f) => f.value)
                  .map((f) => (
                    <div
                      key={f.label}
                      className="flex items-start gap-3 px-4 py-3"
                    >
                      <span className="text-muted-foreground mt-0.5 shrink-0">
                        {f.icon}
                      </span>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {f.label}
                        </p>
                        <p className="text-sm text-foreground font-medium">
                          {f.value}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Role-specific extra info */}
              {detailUser.role === "doctor" && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
                  <p className="font-semibold mb-1">Informations médicales</p>
                  <p>Licence : {detailUser.doctorId ?? "Non renseignée"}</p>
                  {detailUser.specialization && (
                    <p>Spécialité : {detailUser.specialization}</p>
                  )}
                </div>
              )}
              {detailUser.role === "pharmacy" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
                  <p className="font-semibold mb-1">Informations pharmacie</p>
                  <p>Agrément : {detailUser.pharmacyId ?? "Non renseigné"}</p>
                  {detailUser.address && <p>Adresse : {detailUser.address}</p>}
                </div>
              )}
              {(detailUser.role === "medical_service" ||
                detailUser.role === "lab_radiology") && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
                  <p className="font-semibold mb-1">
                    Informations établissement
                  </p>
                  {detailUser.companyName && (
                    <p>Établissement : {detailUser.companyName}</p>
                  )}
                  {detailUser.address && <p>Adresse : {detailUser.address}</p>}
                </div>
              )}
            </div>

            {/* Actions footer */}
            <div className="border-t border-border px-5 py-4 shrink-0 space-y-2">
              {detailUser.status === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(detailUser.id, "approve")}
                    disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                  >
                    <FaCheckCircle size={13} />
                    Approuver
                  </button>
                  <button
                    onClick={() => handleAction(detailUser.id, "reject")}
                    disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-destructive hover:opacity-90 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                  >
                    <FaTimesCircle size={13} />
                    Refuser
                  </button>
                </div>
              )}
              {detailUser.status === "approved" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(detailUser.id, "suspend")}
                    disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                  >
                    <FaBan size={13} />
                    Suspendre le compte
                  </button>
                  <button
                    onClick={() => handleAction(detailUser.id, "reject")}
                    disabled={!!actionLoading}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-destructive/40 text-destructive hover:bg-destructive/5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                  >
                    <FaTimesCircle size={13} />
                    Révoquer
                  </button>
                </div>
              )}
              {detailUser.status === "suspended" && (
                <button
                  onClick={() => handleAction(detailUser.id, "reactivate")}
                  disabled={!!actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
                >
                  <FaCheckCircle size={13} />
                  Réactiver le compte
                </button>
              )}
              {detailUser.status === "rejected" && (
                <button
                  onClick={() => handleAction(detailUser.id, "approve")}
                  disabled={!!actionLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                >
                  <FaCheckCircle size={13} />
                  Ré-approuver le compte
                </button>
              )}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
