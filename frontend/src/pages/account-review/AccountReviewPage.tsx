import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
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
  FaUserNurse,
  FaUser,
  FaHeartbeat,
  FaChevronLeft,
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
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 relative flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <Link to="/" className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="MegaCare"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">
            MEGACARE
          </span>
        </Link>

        <div className="relative space-y-6">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleColor} bg-white/10 flex items-center justify-center`}
          >
            <RoleIcon className="text-white" size={28} />
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Espace professionnel</p>
            <h2 className="text-3xl font-bold text-white leading-tight">
              {roleLabel}
            </h2>
            <p className="text-white/60 text-sm mt-2">
              {userName}
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Vérification de vos documents",
              "Validation de votre identité",
              "Activation de votre espace pro",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 text-white/70 text-sm"
              >
                <FaCheckCircle className="text-white/50 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2">
          <FaShieldAlt className="text-white/40" size={14} />
          <span className="text-white/40 text-xs">
            Données protégées · Conforme RGPD
          </span>
        </div>
      </div>

      {/* Right content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto relative">
        <Link
          to="/"
          className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition group"
        >
          <FaChevronLeft
            size={11}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Accueil
        </Link>

        {/* Mobile logo */}
        <Link to="/" className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
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

        <div className="w-full max-w-lg">
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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isRejected
                ? "Compte non approuvé"
                : "Compte en cours de vérification"}
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {isRejected
                ? "Votre demande d'inscription en tant que " +
                  roleLabel +
                  " n'a pas été approuvée. Contactez notre support pour plus d'informations."
                : "Votre demande d'inscription en tant que " +
                  roleLabel +
                  " est en cours d'examen par notre équipe. Vous recevrez une confirmation dès son approbation."}
            </p>
          </div>

          {/* User info card */}
          <div className="bg-card border border-border rounded-2xl p-5 mb-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Nom</span>
                <span className="font-medium text-foreground">{userName}</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{user.email}</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profil</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${roleColor} text-white`}
                >
                  <RoleIcon size={10} />
                  {roleLabel}
                </span>
              </div>
              <div className="border-t border-border" />
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
          </div>

          {/* Steps (only for pending) */}
          {!isRejected && (
            <div className="bg-card border border-border rounded-2xl p-5 mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">
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
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <FaSignOutAlt size={14} />
            Se déconnecter
          </button>

          <p className="mt-6 text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            <FaShieldAlt size={11} />
            Vos données sont protégées · MegaCare © 2024
          </p>
        </div>
      </div>
    </div>
  );
}
