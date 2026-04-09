import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import {
  ManagedUser,
  ROLES,
  roleConfig,
  fetchAdminUsers,
} from "../adminConfig";
import {
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBan,
  FaSync,
} from "react-icons/fa";
import { BarChart3, TrendingUp } from "lucide-react";

export default function AdminStatsPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [fetching, setFetching] = useState(true);

  const loadUsers = useCallback(async () => {
    setFetching(true);
    const data = await fetchAdminUsers();
    setUsers(data);
    setFetching(false);
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
    if (!isLoading && user) loadUsers();
  }, [isLoading, user, navigate, loadUsers]);

  if (isLoading || !user) return null;
  if (user.role !== "admin") return null;

  const total = users.length;
  const approved = users.filter((u) => u.status === "approved").length;
  const pending = users.filter((u) => u.status === "pending").length;
  const rejected = users.filter((u) => u.status === "rejected").length;
  const suspended = users.filter((u) => u.status === "suspended").length;

  const approvalRate =
    total > 0
      ? Math.round(
          approved + rejected > 0
            ? (approved / (approved + rejected)) * 100
            : 0,
        )
      : 0;

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
  }).filter((rs) => rs.total > 0);

  const maxTotal = Math.max(...roleStats.map((rs) => rs.total), 1);

  return (
    <div className="flex min-h-screen bg-background">
      <AdminDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Page header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Statistiques</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Vue d'ensemble de la plateforme
            </p>
          </div>
          <button
            onClick={loadUsers}
            disabled={fetching}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-50"
          >
            <FaSync size={12} className={fetching ? "animate-spin" : ""} />
            Actualiser
          </button>
        </div>

        <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* ── Global KPI grid ── */}
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 size={16} className="text-primary" />
                  Vue globale
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    {
                      label: "Total comptes",
                      value: total,
                      icon: <FaUsers size={16} />,
                      color: "text-primary",
                      bg: "bg-primary/10",
                    },
                    {
                      label: "Approuvés",
                      value: approved,
                      icon: <FaCheckCircle size={16} />,
                      color: "text-emerald-600",
                      bg: "bg-emerald-100",
                    },
                    {
                      label: "En attente",
                      value: pending,
                      icon: <FaClock size={16} />,
                      color: "text-amber-600",
                      bg: "bg-amber-100",
                    },
                    {
                      label: "Refusés",
                      value: rejected,
                      icon: <FaTimesCircle size={16} />,
                      color: "text-red-600",
                      bg: "bg-red-100",
                    },
                    {
                      label: "Suspendus",
                      value: suspended,
                      icon: <FaBan size={16} />,
                      color: "text-slate-600",
                      bg: "bg-slate-100",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3"
                    >
                      <div
                        className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── Approval rate ── */}
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" />
                  Taux d&apos;approbation
                </h2>
                <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-bold text-foreground">
                        {approvalRate}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        des demandes traitées ont été approuvées
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground space-y-1">
                      <p>
                        <span className="text-emerald-600 font-semibold">
                          {approved}
                        </span>{" "}
                        approuvés
                      </p>
                      <p>
                        <span className="text-red-600 font-semibold">
                          {rejected}
                        </span>{" "}
                        refusés
                      </p>
                      <p>
                        <span className="text-amber-600 font-semibold">
                          {pending}
                        </span>{" "}
                        en attente
                      </p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${approvalRate}%` }}
                    />
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                      Approuvés
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                      En attente
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                      Refusés
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
                      Suspendus
                    </span>
                  </div>
                </div>
              </section>

              {/* ── Per-role breakdown ── */}
              <section className="space-y-3">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <FaUsers size={14} className="text-primary" />
                  Répartition par rôle
                </h2>

                {roleStats.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun utilisateur enregistré.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {roleStats.map((rs) => {
                      const cfg = roleConfig[rs.role] ?? roleConfig.patient;
                      const { Icon: RoleIcon, gradient, label } = cfg;
                      const widthPct = Math.round((rs.total / maxTotal) * 100);
                      return (
                        <div
                          key={rs.role}
                          className="bg-card border border-border rounded-2xl p-4"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
                            >
                              <RoleIcon className="text-white" size={15} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-semibold text-foreground">
                                  {label}
                                </p>
                                <p className="text-sm font-bold text-foreground">
                                  {rs.total}
                                </p>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
                                  style={{ width: `${widthPct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 pl-12">
                            {rs.approved > 0 && (
                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                                {rs.approved} approuvé
                                {rs.approved > 1 ? "s" : ""}
                              </span>
                            )}
                            {rs.pending > 0 && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                {rs.pending} en attente
                              </span>
                            )}
                            {rs.rejected > 0 && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                {rs.rejected} refusé
                                {rs.rejected > 1 ? "s" : ""}
                              </span>
                            )}
                            {rs.suspended > 0 && (
                              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                {rs.suspended} suspendu
                                {rs.suspended > 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
