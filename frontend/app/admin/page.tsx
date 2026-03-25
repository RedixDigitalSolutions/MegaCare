"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import {
  FaUserMd,
  FaPills,
  FaHospital,
  FaMicroscope,
  FaAmbulance,
  FaUserNurse,
  FaUserAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSignOutAlt,
  FaShieldAlt,
  FaUsers,
  FaSync,
} from "react-icons/fa";

interface ManagedUser {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
  status: "pending" | "approved" | "rejected";
  phone?: string;
  specialization?: string;
  doctorId?: string;
  pharmacyId?: string;
  companyName?: string;
}

const roleConfig: Record<
  string,
  { label: string; Icon: React.ElementType; color: string }
> = {
  patient: {
    label: "Patient",
    Icon: FaUserAlt,
    color: "from-blue-500 to-cyan-500",
  },
  doctor: {
    label: "Médecin",
    Icon: FaUserMd,
    color: "from-emerald-500 to-teal-500",
  },
  pharmacy: {
    label: "Pharmacien",
    Icon: FaPills,
    color: "from-green-500 to-lime-500",
  },
  medical_service: {
    label: "Services Médicaux",
    Icon: FaHospital,
    color: "from-purple-500 to-indigo-500",
  },
  lab_radiology: {
    label: "Labos & Radiologie",
    Icon: FaMicroscope,
    color: "from-rose-500 to-pink-500",
  },
  medical_transport: {
    label: "Transport Médicalisé",
    Icon: FaAmbulance,
    color: "from-orange-500 to-red-500",
  },
  paramedical: {
    label: "Paramédicaux",
    Icon: FaUserNurse,
    color: "from-sky-500 to-blue-500",
  },
};

const statusBadge = (status: string) => {
  if (status === "approved")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <FaCheckCircle size={9} /> Approuvé
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-destructive">
        <FaTimesCircle size={9} /> Refusé
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
      <FaClock size={9} /> En attente
    </span>
  );
};

export default function AdminDashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    setFetching(true);
    try {
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
      return;
    }
    if (!isLoading && user && user.role !== "admin") {
      router.push("/");
      return;
    }
    if (!isLoading && user) {
      fetchUsers();
    }
  }, [isLoading, user, router, fetchUsers]);

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    setActionLoading(userId + action);
    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, status: action === "approve" ? "approved" : "rejected" }
              : u,
          ),
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading || !user) return null;
  if (user.role !== "admin") return null;

  const filtered =
    filter === "all" ? users : users.filter((u) => u.status === filter);
  const counts = {
    all: users.length,
    pending: users.filter((u) => u.status === "pending").length,
    approved: users.filter((u) => u.status === "approved").length,
    rejected: users.filter((u) => u.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <Image
                src="/images/logo.png"
                alt="MegaCare"
                width={22}
                height={22}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-foreground tracking-tight">
              MEGACARE
            </span>
          </Link>
          <span className="text-border">|</span>
          <span className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5">
            <FaShieldAlt size={12} className="text-primary" />
            Administration
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user.name || user.email}
          </span>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <FaSignOutAlt size={13} />
            <span className="hidden sm:block">Déconnexion</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Gestion des comptes
            </h1>
            <p className="text-muted-foreground text-sm">
              Approuvez ou refusez les demandes d'inscription des professionnels
              de santé.
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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {(["all", "pending", "approved", "rejected"] as const).map((key) => {
            const labels = {
              all: "Total",
              pending: "En attente",
              approved: "Approuvés",
              rejected: "Refusés",
            };
            const styles = {
              all: "text-foreground bg-card border-border",
              pending:
                "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20",
              approved:
                "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200 dark:border-emerald-500/20",
              rejected:
                "text-destructive bg-red-50 dark:bg-red-500/5 border-red-200 dark:border-red-500/20",
            };
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-2xl border p-4 text-left transition hover:shadow-sm ${styles[key]} ${filter === key ? "ring-2 ring-primary/40" : ""}`}
              >
                <p className="text-2xl font-bold">{counts[key]}</p>
                <p className="text-xs font-medium opacity-70 mt-0.5">
                  {labels[key]}
                </p>
              </button>
            );
          })}
        </div>

        {/* Users list */}
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
          <div className="space-y-3">
            {filtered.map((u) => {
              const cfg = roleConfig[u.role] ?? roleConfig.patient;
              const {
                Icon: RoleIcon,
                color: roleColor,
                label: roleLabel,
              } = cfg;
              const displayName =
                u.firstName && u.lastName
                  ? `${u.firstName} ${u.lastName}`
                  : u.name || u.email;
              return (
                <div
                  key={u.id}
                  className="bg-card border border-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Avatar / role icon */}
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${roleColor} flex items-center justify-center shrink-0`}
                  >
                    <RoleIcon className="text-white" size={18} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {displayName}
                      </p>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r ${roleColor} text-white`}
                      >
                        {roleLabel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {u.email}
                    </p>
                    {u.specialization && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {u.specialization}
                      </p>
                    )}
                    {u.doctorId && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Licence: {u.doctorId}
                      </p>
                    )}
                    {u.pharmacyId && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Agrément: {u.pharmacyId}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div className="shrink-0">{statusBadge(u.status)}</div>

                  {/* Actions */}
                  {u.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleAction(u.id, "approve")}
                        disabled={actionLoading === u.id + "approve"}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition disabled:opacity-50"
                      >
                        {actionLoading === u.id + "approve" ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <FaTimesCircle size={11} />
                        )}
                        Refuser
                      </button>
                    </div>
                  )}
                  {u.status === "approved" && (
                    <button
                      onClick={() => handleAction(u.id, "reject")}
                      disabled={actionLoading === u.id + "reject"}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/5 text-xs font-semibold transition disabled:opacity-50"
                    >
                      <FaTimesCircle size={11} />
                      Révoquer
                    </button>
                  )}
                  {u.status === "rejected" && (
                    <button
                      onClick={() => handleAction(u.id, "approve")}
                      disabled={actionLoading === u.id + "approve"}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/5 text-xs font-semibold transition disabled:opacity-50"
                    >
                      <FaCheckCircle size={11} />
                      Ré-approuver
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Admin credentials note */}
        <div className="mt-10 p-4 rounded-2xl bg-muted/40 border border-border text-xs text-muted-foreground flex items-start gap-2">
          <FaShieldAlt size={13} className="text-primary mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-foreground">
              Compte admin par défaut :
            </span>{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              admin@megacare.tn
            </code>
            {" / "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
              Admin@megacare2024
            </code>
            {" — Connectez-vous via la page "}
            <Link href="/login" className="text-primary underline">
              Connexion
            </Link>
            {" en sélectionnant le rôle Administrateur."}
          </div>
        </div>
      </main>
    </div>
  );
}
