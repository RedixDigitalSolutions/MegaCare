import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import { UserDetailSlideOver } from "../UserDetailSlideOver";
import {
  ManagedUser,
  AdminAction,
  roleConfig,
  getDisplayName,
  fetchAdminUsers,
  doAdminAction,
  resolveNewStatus,
} from "../adminConfig";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaSync,
  FaClipboardCheck,
} from "react-icons/fa";
import { ChevronRight, AlertTriangle } from "lucide-react";

export default function AdminPendingPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<ManagedUser | null>(null);

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

  const handleAction = async (userId: string, action: AdminAction) => {
    const key = userId + action;
    setActionLoading(key);
    const ok = await doAdminAction(userId, action);
    if (ok) {
      const ns = resolveNewStatus(action);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: ns } : u)),
      );
      if (detailUser?.id === userId)
        setDetailUser((u) => (u ? { ...u, status: ns } : u));
    }
    setActionLoading(null);
  };

  if (isLoading || !user) return null;
  if (user.role !== "admin") return null;

  const pending = users.filter((u) => u.status === "pending");

  return (
    <div className="flex min-h-screen bg-background">
      <AdminDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Page header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                Approbations en attente
                {pending.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-sm font-bold">
                    {pending.length}
                  </span>
                )}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Examinez et approuvez les nouveaux comptes professionnels
              </p>
            </div>
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

        <main className="flex-1 overflow-y-auto px-6 py-8">
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : pending.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
                <FaClipboardCheck size={28} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">
                Aucune approbation en attente
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Tous les comptes ont été traités. Revenez plus tard pour de
                nouvelles inscriptions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Banner */}
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <AlertTriangle size={15} className="shrink-0" />
                <span>
                  <strong>{pending.length}</strong> compte
                  {pending.length !== 1 ? "s" : ""} en attente de validation.
                  Vérifiez les informations avant d&apos;approuver.
                </span>
              </div>

              {/* Pending list */}
              {pending.map((u) => {
                const cfg = roleConfig[u.role] ?? roleConfig.patient;
                const { Icon: RoleIcon, gradient, label } = cfg;
                return (
                  <div
                    key={u.id}
                    className="bg-card border border-amber-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-sm transition"
                  >
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
                    >
                      <RoleIcon className="text-white" size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <p className="font-semibold text-foreground text-sm">
                          {getDisplayName(u)}
                        </p>
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                          {label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                      {u.specialization && (
                        <p className="text-xs text-muted-foreground">
                          {u.specialization}
                        </p>
                      )}
                      {u.phone && (
                        <p className="text-xs text-muted-foreground">
                          {u.phone}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setDetailUser(u)}
                        className="p-2 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
                        title="Voir le profil complet"
                      >
                        <ChevronRight size={16} />
                      </button>
                      <button
                        onClick={() => handleAction(u.id, "approve")}
                        disabled={actionLoading === u.id + "approve"}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition disabled:opacity-50"
                      >
                        {actionLoading === u.id + "approve" ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                        ) : (
                          <FaCheckCircle size={12} />
                        )}
                        Approuver
                      </button>
                      <button
                        onClick={() => handleAction(u.id, "reject")}
                        disabled={actionLoading === u.id + "reject"}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive hover:opacity-90 text-white text-sm font-semibold transition disabled:opacity-50"
                      >
                        {actionLoading === u.id + "reject" ? (
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                        ) : (
                          <FaTimesCircle size={12} />
                        )}
                        Refuser
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {detailUser && (
        <UserDetailSlideOver
          user={detailUser}
          onClose={() => setDetailUser(null)}
          onAction={handleAction}
          actionLoading={actionLoading}
        />
      )}
    </div>
  );
}
