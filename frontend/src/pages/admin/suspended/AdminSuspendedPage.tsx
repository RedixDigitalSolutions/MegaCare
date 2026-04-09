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
  getRegDate,
  fetchAdminUsers,
  doAdminAction,
  resolveNewStatus,
} from "../adminConfig";
import { FaCheckCircle, FaSync, FaBan, FaUserSlash } from "react-icons/fa";
import { Calendar } from "lucide-react";

export default function AdminSuspendedPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [detailUser, setDetailUser] = useState<ManagedUser | null>(null);
  const [search, setSearch] = useState("");

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

  const suspended = users.filter((u) => u.status === "suspended");
  const filtered = suspended.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      getDisplayName(u).toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (roleConfig[u.role]?.label ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AdminDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Page header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              Comptes suspendus
              {suspended.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-sm font-bold">
                  {suspended.length}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Gérez les comptes suspendus et réactivez-les si nécessaire
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

        <main className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {fetching ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
          ) : suspended.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <FaUserSlash size={26} className="text-slate-400" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">
                Aucun compte suspendu
              </h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                Il n&apos;y a actuellement aucun compte suspendu sur la
                plateforme.
              </p>
            </div>
          ) : (
            <>
              {/* Search */}
              <input
                type="text"
                placeholder="Rechercher un compte suspendu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full max-w-sm px-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />

              {filtered.length === 0 ? (
                <p className="text-sm text-muted-foreground py-10 text-center">
                  Aucun résultat pour &quot;{search}&quot;
                </p>
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
                        {/* Avatar with suspended overlay */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center opacity-50`}
                          >
                            <RoleIcon className="text-white" size={18} />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-slate-500 rounded-full flex items-center justify-center">
                            <FaBan size={9} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <p className="font-semibold text-foreground text-sm">
                              {getDisplayName(u)}
                            </p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-semibold ${light} opacity-70`}
                            >
                              {label}
                            </span>
                            <span className="text-xs bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full font-semibold">
                              Suspendu
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {u.email}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Calendar size={10} />
                            {getRegDate(u)}
                          </p>
                        </div>
                        <div
                          className="flex gap-2 shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleAction(u.id, "reactivate")}
                            disabled={actionLoading === u.id + "reactivate"}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-sm font-semibold transition disabled:opacity-50"
                          >
                            {actionLoading === u.id + "reactivate" ? (
                              <span className="w-4 h-4 border-2 border-emerald-300 border-t-emerald-600 rounded-full animate-spin block" />
                            ) : (
                              <FaCheckCircle size={12} />
                            )}
                            Réactiver
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
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
