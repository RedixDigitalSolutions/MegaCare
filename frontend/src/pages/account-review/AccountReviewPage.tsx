
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
;
import { useEffect } from "react";
import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaShieldAlt,
  FaUserMd,
  FaPills,
  FaHospital,
  FaMicroscope,
  FaAmbulance,
  FaUserNurse,
  FaUser,
} from "react-icons/fa";

const roleLabels: Record<
  string,
  { label: string; Icon: React.ElementType; color: string }
> = {
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

export default function AccountReviewPage() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    // Approved users should go to their dashboard
    if (!isLoading && user && user.status === "approved") {
      const dashboards: Record<string, string> = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        lab_radiology: "/lab-dashboard",
        medical_transport: "/transport-dashboard",
        paramedical: "/paramedical-dashboard",
        admin: "/admin",
      };
      navigate(dashboards[user.role] || "/dashboard");
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user) return null;

  const isRejected = user.status === "rejected";
  const roleInfo = roleLabels[user.role] ?? {
    label: user.role,
    Icon: FaShieldAlt,
    color: "from-gray-400 to-gray-600",
  };
  const { Icon: RoleIcon, color: roleColor, label: roleLabel } = roleInfo;
  const userName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name || user.email;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16 relative">
      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition group"
      >
        <svg
          className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Accueil
      </Link>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-10">
        <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center">
          <img
            src="/images/logo.png"
            alt="MegaCare"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <span className="text-foreground font-bold text-xl tracking-tight">
          MEGACARE
        </span>
      </Link>

      <div className="w-full max-w-lg bg-card border border-border rounded-3xl px-8 py-10 shadow-xl text-center">
        {/* Status icon */}
        <div className="flex justify-center mb-6">
          {isRejected ? (
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <FaTimesCircle className="text-destructive" size={40} />
            </div>
          ) : (
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
                <FaClock className="text-amber-500" size={36} />
              </div>
              <span className="absolute -bottom-1 -right-1 w-7 h-7 bg-card rounded-full border-2 border-border flex items-center justify-center">
                <div
                  className={`w-4 h-4 rounded-full bg-gradient-to-br ${roleColor} flex items-center justify-center`}
                >
                  <RoleIcon className="text-white" size={8} />
                </div>
              </span>
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          {isRejected
            ? "Compte non approuvé"
            : "Compte en cours de vérification"}
        </h1>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          {isRejected
            ? "Votre demande d'inscription en tant que " +
              roleLabel +
              " n'a pas été approuvée. Contactez notre support pour plus d'informations."
            : "Votre demande d'inscription en tant que " +
              roleLabel +
              " est en cours d'examen par notre équipe. Vous recevrez une confirmation dès son approbation."}
        </p>

        {/* User info card */}
        <div className="bg-muted/50 rounded-2xl px-5 py-4 mb-6 text-left space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Nom</span>
            <span className="font-medium text-foreground">{userName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-foreground">{user.email}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Profil</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${roleColor} text-white`}
            >
              <RoleIcon size={10} />
              {roleLabel}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Statut</span>
            {isRejected ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive/10 text-destructive">
                <FaTimesCircle size={10} /> Refusé
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <FaClock size={10} /> En attente
              </span>
            )}
          </div>
        </div>

        {/* Steps (only for pending) */}
        {!isRejected && (
          <div className="text-left mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Prochaines étapes
            </p>
            <div className="space-y-3">
              {[
                {
                  icon: FaCheckCircle,
                  color: "text-primary",
                  label: "Inscription soumise avec succès",
                },
                {
                  icon: FaClock,
                  color: "text-amber-500",
                  label: "Vérification par l'équipe MegaCare (24–48h)",
                },
                {
                  icon: FaEnvelope,
                  color: "text-muted-foreground",
                  label: "Notification par email dès approbation",
                },
              ].map(({ icon: StepIcon, color, label }, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <StepIcon className={`${color} shrink-0`} size={16} />
                  <span
                    className={
                      i === 0
                        ? "text-foreground"
                        : i === 1
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                    }
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <Link
            to="/profile"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition shadow-lg shadow-primary/20"
          >
            <FaUser size={13} />
            Modifier mon profil
          </Link>
          <a
            href="mailto:support@megacare.tn"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted transition"
          >
            <FaEnvelope size={14} />
            Contacter le support
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <FaSignOutAlt size={14} />
            Se déconnecter
          </button>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground flex items-center gap-1.5">
        <FaShieldAlt size={11} />
        Vos données sont protégées · MegaCare © 2024
      </p>
    </div>
  );
}

