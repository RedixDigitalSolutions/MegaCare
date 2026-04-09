import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  FaUserMd,
  FaPills,
  FaHospital,
  FaMicroscope,
  FaUserNurse,
  FaUserAlt,
  FaCamera,
  FaCheck,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";

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
  paramedical: {
    label: "Paramédicaux",
    Icon: FaUserNurse,
    color: "from-sky-500 to-blue-500",
  },
  admin: {
    label: "Administrateur",
    Icon: FaShieldAlt,
    color: "from-slate-500 to-gray-700",
  },
};

const dashboardLinks: Record<string, string> = {
  patient: "/dashboard",
  doctor: "/doctor-dashboard",
  pharmacy: "/pharmacy-dashboard",
  medical_service: "/medical-service-dashboard",
  lab_radiology: "/lab-dashboard",
  paramedical: "/paramedical-dashboard",
  admin: "/admin",
};

export default function ProfilePage() {
  const { user, updateUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setAvatarPreview(user.avatar ?? null);
    }
  }, [isLoading, user, navigate]);

  if (isLoading || !user) return null;

  const cfg = roleConfig[user.role] ?? roleConfig.patient;
  const { Icon: RoleIcon, color: roleColor, label: roleLabel } = cfg;

  const isPending = user.status === "pending";
  const isRejected = user.status === "rejected";
  const isApproved = user.status === "approved";

  const backHref =
    isPending || isRejected
      ? "/account-review"
      : dashboardLinks[user.role] || "/";

  const backLabel =
    isPending || isRejected
      ? "Retour au statut du compte"
      : "Retour au tableau de bord";

  const initials =
    ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase().trim() ||
    user.email[0].toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 2 Mo.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    try {
      const token = localStorage.getItem("megacare_token");
      if (token) {
        const res = await fetch("/api/auth/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ firstName, lastName, phone }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Erreur lors de la sauvegarde");
        }
      }
      // Update local auth state (avatar is only stored in localStorage)
      updateUser({
        firstName,
        lastName,
        phone,
        name: `${firstName} ${lastName}`.trim(),
        ...(avatarPreview !== null && { avatar: avatarPreview }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        {/* Back link */}
        <Link
          to={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-6 group"
        >
          <FaArrowLeft
            size={11}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          {backLabel}
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6">Mon profil</h1>

        {/* Status banner */}
        {isPending && (
          <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
            <FaClock className="text-amber-500 shrink-0 mt-0.5" size={16} />
            <div>
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                Compte en cours de vérification
              </p>
              <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-0.5">
                Votre compte est en attente d'approbation. Vous pouvez mettre à
                jour votre profil en attendant.
              </p>
            </div>
          </div>
        )}
        {isRejected && (
          <div className="flex items-start gap-3 p-4 mb-6 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
            <FaTimesCircle
              className="text-destructive shrink-0 mt-0.5"
              size={16}
            />
            <div>
              <p className="text-sm font-semibold text-destructive">
                Compte non approuvé
              </p>
              <p className="text-xs text-destructive/70 mt-0.5">
                Votre demande n'a pas été approuvée. Contactez le support pour
                plus d'informations.
              </p>
            </div>
          </div>
        )}
        {isApproved && (
          <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
            <FaCheckCircle className="text-emerald-500 shrink-0" size={16} />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              Compte actif et approuvé
            </p>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            {/* Avatar section */}
            <div className="sm:col-span-1 flex flex-col items-center gap-4 pt-2">
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-border bg-muted flex items-center justify-center">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${roleColor} flex items-center justify-center`}
                    >
                      <span className="text-3xl font-bold text-white">
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90 transition"
                  title="Changer la photo de profil"
                >
                  <FaCamera size={14} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="text-center space-y-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${roleColor} text-white`}
                >
                  <RoleIcon size={11} />
                  {roleLabel}
                </span>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP — max 2 Mo
                </p>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={() => setAvatarPreview(null)}
                    className="text-xs text-muted-foreground hover:text-destructive transition"
                  >
                    Supprimer la photo
                  </button>
                )}
              </div>
            </div>

            {/* Personal info form */}
            <div className="sm:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-4">
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠</span>
                  {error}
                </div>
              )}
              {saved && (
                <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                  <FaCheck size={12} />
                  Profil mis à jour avec succès
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Prénom"
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Nom"
                    className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Adresse email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  L'adresse email ne peut pas être modifiée.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+216 XX XXX XXX"
                  className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition text-sm"
                />
              </div>

              {user.specialization && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">
                    Spécialisation
                  </label>
                  <input
                    type="text"
                    value={user.specialization}
                    disabled
                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-muted-foreground text-sm cursor-not-allowed"
                  />
                </div>
              )}

              {/* Account status info */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Statut du compte
                </p>
                <div className="flex items-center gap-2">
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                      <FaClock size={10} />
                      En attente de validation (24–48h)
                    </span>
                  )}
                  {isRejected && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-destructive border border-red-200 dark:border-red-500/20">
                      <FaTimesCircle size={10} />
                      Compte non approuvé
                    </span>
                  )}
                  {isApproved && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <FaCheckCircle size={10} />
                      Approuvé
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm shadow-lg shadow-primary/20"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : saved ? (
                <>
                  <FaCheck size={12} />
                  Sauvegardé
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
