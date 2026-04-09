import React from "react";
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
  FaBan,
} from "react-icons/fa";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserStatus = "pending" | "approved" | "rejected" | "suspended";
export type FilterStatus = "all" | UserStatus;
export type AdminAction = "approve" | "reject" | "suspend" | "reactivate";

export interface ManagedUser {
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

// ── Constants ─────────────────────────────────────────────────────────────────

export const ROLES = [
  "patient",
  "doctor",
  "pharmacy",
  "medical_service",
  "lab_radiology",
  "paramedical",
] as const;

export const roleConfig: Record<
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

export const statusCfg: Record<
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

// ── Components ────────────────────────────────────────────────────────────────

export const StatusBadge = ({ status }: { status: UserStatus }) => {
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

// ── Helpers ───────────────────────────────────────────────────────────────────

export const getDisplayName = (u: ManagedUser) =>
  u.firstName && u.lastName
    ? `${u.firstName} ${u.lastName}`
    : u.name || u.email;

export const getRegDate = (u: ManagedUser) => {
  const raw = u.registrationDate ?? u.createdAt;
  if (!raw) return "—";
  return new Date(raw).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── API helpers ───────────────────────────────────────────────────────────────

export const fetchAdminUsers = async (): Promise<ManagedUser[]> => {
  const token = localStorage.getItem("megacare_token");
  if (!token) return [];
  try {
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
  } catch {
    /* network error */
  }
  return [];
};

export const doAdminAction = async (
  userId: string,
  action: AdminAction,
): Promise<boolean> => {
  const token = localStorage.getItem("megacare_token");
  if (!token) return false;
  const endpoint = action === "reactivate" ? "approve" : action;
  try {
    const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
};

export const resolveNewStatus = (action: AdminAction): UserStatus =>
  action === "approve" || action === "reactivate"
    ? "approved"
    : action === "suspend"
      ? "suspended"
      : "rejected";
