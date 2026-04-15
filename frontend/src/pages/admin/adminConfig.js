import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FaUserMd, FaPills, FaHospital, FaMicroscope, FaUserNurse, FaUserAlt, FaCheckCircle, FaTimesCircle, FaClock, FaBan, } from "react-icons/fa";
// ── Constants ─────────────────────────────────────────────────────────────────
export const ROLES = [
    "patient",
    "doctor",
    "pharmacy",
    "medical_service",
    "lab_radiology",
    "paramedical",
];
export const roleConfig = {
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
export const statusCfg = {
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
export const StatusBadge = ({ status }) => {
    const cfg = statusCfg[status];
    const icons = {
        pending: _jsx(FaClock, { size: 9 }),
        approved: _jsx(FaCheckCircle, { size: 9 }),
        rejected: _jsx(FaTimesCircle, { size: 9 }),
        suspended: _jsx(FaBan, { size: 9 }),
    };
    return (_jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`, children: [icons[status], " ", cfg.label] }));
};
// ── Helpers ───────────────────────────────────────────────────────────────────
export const getDisplayName = (u) => u.firstName && u.lastName
    ? `${u.firstName} ${u.lastName}`
    : u.name || u.email;
export const getRegDate = (u) => {
    const raw = u.registrationDate ?? u.createdAt;
    if (!raw)
        return "—";
    return new Date(raw).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};
// ── API helpers ───────────────────────────────────────────────────────────────
export const fetchAdminUsers = async () => {
    const token = localStorage.getItem("megacare_token");
    if (!token)
        return [];
    try {
        const res = await fetch("/api/admin/users", {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok)
            return res.json();
    }
    catch {
        /* network error */
    }
    return [];
};
export const doAdminAction = async (userId, action) => {
    const token = localStorage.getItem("megacare_token");
    if (!token)
        return false;
    const endpoint = action === "reactivate" ? "approve" : action;
    try {
        const res = await fetch(`/api/admin/users/${userId}/${endpoint}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.ok;
    }
    catch {
        return false;
    }
};
export const resolveNewStatus = (action) => action === "approve" || action === "reactivate"
    ? "approved"
    : action === "suspend"
        ? "suspended"
        : "rejected";
