
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
;
import { useAuth } from "@/contexts/AuthContext";
import {
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaUserAlt,
  FaUserMd,
  FaPills,
  FaHospital,
  FaMicroscope,
  FaAmbulance,
  FaUserNurse,
  FaArrowRight,
  FaShieldAlt,
  FaHeartbeat,
  FaCheckCircle,
} from "react-icons/fa";

type UserType =
  | "patient"
  | "doctor"
  | "pharmacy"
  | "medical_service"
  | "lab_radiology"
  | "medical_transport"
  | "paramedical"
  | null;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [userType, setUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    specialization: "",
    doctorId: "",
    pharmacyId: "",
    serviceId: "",
    labId: "",
    transportId: "",
    paramedicalId: "",
    companyName: "",
    agreeToTerms: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) return;
    if (formData.password !== formData.confirmPassword) {
      setAuthError("Les mots de passe ne correspondent pas");
      return;
    }
    if (!formData.agreeToTerms) {
      setAuthError("Vous devez accepter les conditions d'utilisation");
      return;
    }
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          role: userType,
          ...(formData.specialization && {
            specialization: formData.specialization,
          }),
          ...(formData.doctorId && { doctorId: formData.doctorId }),
          ...(formData.pharmacyId && { pharmacyId: formData.pharmacyId }),
          ...(formData.serviceId && { serviceId: formData.serviceId }),
          ...(formData.labId && { labId: formData.labId }),
          ...(formData.transportId && { transportId: formData.transportId }),
          ...(formData.paramedicalId && {
            paramedicalId: formData.paramedicalId,
          }),
          ...(formData.companyName && { companyName: formData.companyName }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError(
          data.message || "Erreur lors de l'inscription. Veuillez réessayer.",
        );
        return;
      }

      const { user: apiUser, token } = data;
      if (token) {
        localStorage.setItem("megacare_token", token);
      }

      registerUser(apiUser);

      // Non-patient accounts are put on hold pending admin review
      if (userType !== "patient" && apiUser.status === "pending") {
        navigate("/account-review");
        return;
      }

      const dashboards: Record<string, string> = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        lab_radiology: "/lab-dashboard",
        medical_transport: "/transport-dashboard",
        paramedical: "/paramedical-dashboard",
      };

      navigate(dashboards[userType] || "/dashboard");
    } catch {
      setAuthError(
        "Impossible de contacter le serveur. Vérifiez votre connexion internet.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    {
      key: "patient" as const,
      label: "Patient",
      Icon: FaUserAlt,
      color: "from-blue-500 to-cyan-500",
      badge: "Gratuit",
      perks: ["Consultations vidéo", "Dossier médical", "Prescriptions"],
    },
    {
      key: "doctor" as const,
      label: "Médecin",
      Icon: FaUserMd,
      color: "from-emerald-500 to-teal-500",
      badge: "Rejoindre",
      perks: ["Gérer agenda", "Dossiers patients", "Consultations vidéo"],
    },
    {
      key: "pharmacy" as const,
      label: "Pharmacien",
      Icon: FaPills,
      color: "from-green-500 to-lime-500",
      badge: "Partenariat",
      perks: ["Gestion stock", "Commandes", "Livraisons"],
    },
    {
      key: "medical_service" as const,
      label: "Services Médicaux",
      Icon: FaHospital,
      color: "from-purple-500 to-indigo-500",
      badge: "Partenariat",
      perks: ["Hospitalisation", "Soins domicile", "Gestion équipe"],
    },
    {
      key: "lab_radiology" as const,
      label: "Labos & Radiologie",
      Icon: FaMicroscope,
      color: "from-rose-500 to-pink-500",
      badge: "Partenariat",
      perks: ["Analyses", "Imagerie médicale", "Résultats patients"],
    },
    {
      key: "medical_transport" as const,
      label: "Transport Médicalisé",
      Icon: FaAmbulance,
      color: "from-orange-500 to-red-500",
      badge: "Partenariat",
      perks: ["Ambulances", "Gestion flotte", "Trajets patients"],
    },
    {
      key: "paramedical" as const,
      label: "Paramédicaux",
      Icon: FaUserNurse,
      color: "from-sky-500 to-blue-500",
      badge: "Rejoindre",
      perks: ["Infirmiers", "Thérapeutes", "Soins patients"],
    },
  ];

  const specializations = [
    "Cardiologie",
    "Dermatologie",
    "Neurologie",
    "Gynécologie",
    "Ophtalmologie",
    "Orthopédie",
    "Pédiatrie",
    "Psychiatrie",
    "Psychologie",
    "Thérapie",
    "Généraliste",
  ];

  if (!userType) {
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

          <div className="relative space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-white/90 text-xs font-medium mb-4">
                <FaHeartbeat className="text-white" />
                Rejoignez des milliers de professionnels
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
                Créez votre compte
                <br />
                en quelques minutes
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Que vous soyez patient, médecin ou professionnel de santé,
                MegaCare vous offre les outils pour exercer et vous soigner en
                toute sérénité.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Inscription rapide et sécurisée",
                "Accès immédiat à votre espace",
                "Support dédié 7j/7",
                "Conformité réglementaire garantie",
              ].map((f) => (
                <div
                  key={f}
                  className="flex items-center gap-3 text-white/80 text-sm"
                >
                  <FaCheckCircle className="text-white/60 shrink-0" />
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

          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Rejoignez MegaCare
              </h1>
              <p className="text-muted-foreground">
                Choisissez votre profil pour commencer
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {roles.map(({ key, label, Icon, color, badge, perks }) => (
                <button
                  key={key}
                  onClick={() => setUserType(key)}
                  className="group relative p-5 bg-card rounded-2xl border-2 border-border hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  <div
                    className={`w-10 h-10 mb-3 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}
                  >
                    <Icon className="text-white" size={18} />
                  </div>
                  <p className="font-semibold text-foreground text-sm leading-tight mb-2">
                    {label}
                  </p>
                  <ul className="space-y-1 mb-3">
                    {perks.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground"
                      >
                        <FaCheckCircle
                          className="text-primary/60 shrink-0"
                          size={9}
                        />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <span
                    className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r ${color} text-white`}
                  >
                    {badge}
                  </span>
                  <FaArrowRight
                    className="absolute bottom-4 right-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                    size={12}
                  />
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Vous avez déjà un compte?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeRole = roles.find((r) => r.key === userType)!;

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
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeRole.color} flex items-center justify-center`}
          >
            <activeRole.Icon className="text-white" size={28} />
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">
              Inscription en tant que
            </p>
            <h2 className="text-3xl font-bold text-white">
              {activeRole.label}
            </h2>
          </div>
          <div className="space-y-3">
            {activeRole.perks.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 text-white/70 text-sm"
              >
                <FaCheckCircle className="text-white/50 shrink-0" />
                {p}
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

      {/* Right form panel */}
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
        <div className="w-full max-w-md">
          <button
            onClick={() => {
              setUserType(null);
              setAuthError(null);
            }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8 group"
          >
            <FaChevronLeft
              size={12}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Changer de profil
          </button>

          <Link to="/" className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <img
                src="/images/logo.png"
                alt="MegaCare"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <span className="text-foreground font-bold text-lg tracking-tight">
              MEGACARE
            </span>
          </Link>

          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r ${activeRole.color} mb-4`}
            >
              <activeRole.Icon className="text-white" size={14} />
              <span className="text-white text-xs font-semibold">
                {activeRole.label}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Créer un compte
            </h1>
            <p className="text-muted-foreground text-sm">
              Remplissez le formulaire pour rejoindre MegaCare.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm flex items-start gap-2">
                <span className="mt-0.5 shrink-0">⚠</span>
                {authError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="firstName"
                  className="text-sm font-medium text-foreground"
                >
                  Prénom
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Prénom"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="lastName"
                  className="text-sm font-medium text-foreground"
                >
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Nom"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="exemple@email.com"
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-foreground"
              >
                Téléphone
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value="+216"
                  disabled
                  className="w-16 px-3 py-3 bg-muted border border-border rounded-xl text-foreground text-center text-sm"
                />
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="XXXXXXXX"
                  className="flex-1 px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  required
                />
              </div>
            </div>

            {userType === "doctor" && (
              <>
                <div className="space-y-1.5">
                  <label
                    htmlFor="specialization"
                    className="text-sm font-medium text-foreground"
                  >
                    Spécialité
                  </label>
                  <select
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialization: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    required
                  >
                    <option value="">Sélectionner une spécialité</option>
                    {specializations.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="doctorId"
                    className="text-sm font-medium text-foreground"
                  >
                    N° de licence médicale
                  </label>
                  <input
                    id="doctorId"
                    type="text"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    placeholder="Ex: MD123456"
                    className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                    required
                  />
                </div>
              </>
            )}

            {userType === "pharmacy" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="pharmacyId"
                  className="text-sm font-medium text-foreground"
                >
                  N° d'agrément pharmacie
                </label>
                <input
                  id="pharmacyId"
                  type="text"
                  name="pharmacyId"
                  value={formData.pharmacyId}
                  onChange={handleInputChange}
                  placeholder="Ex: PH789456"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? (
                    <FaEyeSlash size={17} />
                  ) : (
                    <FaEye size={17} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-foreground"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash size={17} />
                  ) : (
                    <FaEye size={17} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                id="agreeToTerms"
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 mt-0.5 bg-input border border-border rounded cursor-pointer accent-primary"
                required
              />
              <label
                htmlFor="agreeToTerms"
                className="text-sm text-muted-foreground leading-relaxed"
              >
                J'accepte les{" "}
                <Link
                  to="/conditions-utilisation"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  to="/politique-confidentialite"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.agreeToTerms}
              className={`w-full py-3.5 bg-gradient-to-r ${activeRole.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg mt-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Création du compte...
                </>
              ) : (
                <>
                  Créer mon compte
                  <FaArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Vous avez déjà un compte?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

