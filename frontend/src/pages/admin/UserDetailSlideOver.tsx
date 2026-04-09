import {
  X,
  Mail,
  Phone,
  Calendar,
  Stethoscope,
  Building2,
  FileText,
  MapPin,
} from "lucide-react";
import { FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa";
import {
  ManagedUser,
  AdminAction,
  roleConfig,
  StatusBadge,
  getDisplayName,
  getRegDate,
} from "./adminConfig";

interface Props {
  user: ManagedUser;
  onClose: () => void;
  onAction: (userId: string, action: AdminAction) => void;
  actionLoading: string | null;
}

export function UserDetailSlideOver({
  user,
  onClose,
  onAction,
  actionLoading,
}: Props) {
  const cfg = roleConfig[user.role] ?? roleConfig.patient;
  const { Icon: RoleIcon, gradient, label } = cfg;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-bold text-foreground text-base">
            Profil utilisateur
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Avatar + status */}
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0`}
            >
              <RoleIcon className="text-white" size={22} />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                {getDisplayName(user)}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
              <div className="mt-1">
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          {/* Fields */}
          <div className="bg-muted/30 rounded-xl divide-y divide-border overflow-hidden">
            {[
              { icon: <Mail size={13} />, label: "Email", value: user.email },
              {
                icon: <Phone size={13} />,
                label: "Téléphone",
                value: user.phone,
              },
              {
                icon: <Stethoscope size={13} />,
                label: "Spécialisation",
                value: user.specialization,
              },
              {
                icon: <FileText size={13} />,
                label: "N° de licence",
                value: user.doctorId,
              },
              {
                icon: <Building2 size={13} />,
                label: "Agrément pharmacie",
                value: user.pharmacyId,
              },
              {
                icon: <Building2 size={13} />,
                label: "Établissement",
                value: user.companyName,
              },
              {
                icon: <MapPin size={13} />,
                label: "Adresse",
                value: user.address,
              },
              {
                icon: <Calendar size={13} />,
                label: "Inscrit le",
                value: getRegDate(user),
              },
            ]
              .filter((f) => f.value)
              .map((f) => (
                <div key={f.label} className="flex items-start gap-3 px-4 py-3">
                  <span className="text-muted-foreground mt-0.5 shrink-0">
                    {f.icon}
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">{f.label}</p>
                    <p className="text-sm text-foreground font-medium">
                      {f.value}
                    </p>
                  </div>
                </div>
              ))}
          </div>

          {/* Role-specific extra info */}
          {user.role === "doctor" && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
              <p className="font-semibold mb-1">Informations médicales</p>
              <p>Licence : {user.doctorId ?? "Non renseignée"}</p>
              {user.specialization && <p>Spécialité : {user.specialization}</p>}
            </div>
          )}
          {user.role === "pharmacy" && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
              <p className="font-semibold mb-1">Informations pharmacie</p>
              <p>Agrément : {user.pharmacyId ?? "Non renseigné"}</p>
              {user.address && <p>Adresse : {user.address}</p>}
            </div>
          )}
          {(user.role === "medical_service" ||
            user.role === "lab_radiology") && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-800">
              <p className="font-semibold mb-1">Informations établissement</p>
              {user.companyName && <p>Établissement : {user.companyName}</p>}
              {user.address && <p>Adresse : {user.address}</p>}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-4 border-t border-border shrink-0 flex flex-wrap gap-2">
          {user.status === "pending" && (
            <>
              <button
                onClick={() => onAction(user.id, "approve")}
                disabled={actionLoading === user.id + "approve"}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {actionLoading === user.id + "approve" ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                ) : (
                  <FaCheckCircle size={13} />
                )}
                Approuver
              </button>
              <button
                onClick={() => onAction(user.id, "reject")}
                disabled={actionLoading === user.id + "reject"}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-destructive hover:opacity-90 text-white text-sm font-semibold transition disabled:opacity-50"
              >
                {actionLoading === user.id + "reject" ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                ) : (
                  <FaTimesCircle size={13} />
                )}
                Refuser
              </button>
            </>
          )}
          {user.status === "approved" && (
            <>
              <button
                onClick={() => onAction(user.id, "suspend")}
                disabled={actionLoading === user.id + "suspend"}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition disabled:opacity-50"
              >
                <FaBan size={13} />
                Suspendre
              </button>
              <button
                onClick={() => onAction(user.id, "reject")}
                disabled={actionLoading === user.id + "reject"}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-destructive/30 text-destructive hover:bg-destructive/5 text-sm font-semibold transition disabled:opacity-50"
              >
                <FaTimesCircle size={13} />
                Révoquer
              </button>
            </>
          )}
          {user.status === "suspended" && (
            <button
              onClick={() => onAction(user.id, "reactivate")}
              disabled={actionLoading === user.id + "reactivate"}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-sm font-semibold transition disabled:opacity-50"
            >
              <FaCheckCircle size={13} />
              Réactiver
            </button>
          )}
          {user.status === "rejected" && (
            <button
              onClick={() => onAction(user.id, "approve")}
              disabled={actionLoading === user.id + "approve"}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-300 text-emerald-600 hover:bg-emerald-50 text-sm font-semibold transition disabled:opacity-50"
            >
              <FaCheckCircle size={13} />
              Ré-approuver
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
