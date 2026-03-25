"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
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

type UserRole =
  | "patient"
  | "doctor"
  | "pharmacy"
  | "medical_service"
  | "lab_radiology"
  | "medical_transport"
  | "paramedical"
  | "admin"
  | null;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    doctorId: "",
    pharmacyId: "",
    serviceId: "",
    labId: "",
    transportId: "",
    paramedicalId: "",
    companyName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRole) return;
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: userRole,
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
          data.message || "Identifiants incorrects. Veuillez réessayer.",
        );
        return;
      }

      const { user: apiUser, token } = data;
      if (token) {
        localStorage.setItem("megacare_token", token);
      }

      login(apiUser);

      // Non-patient accounts must be approved before accessing their dashboard
      if (
        userRole !== "patient" &&
        userRole !== "admin" &&
        apiUser.status === "pending"
      ) {
        router.push("/account-review");
        return;
      }
      if (
        userRole !== "patient" &&
        userRole !== "admin" &&
        apiUser.status === "rejected"
      ) {
        router.push("/account-review");
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
        admin: "/admin",
      };

      router.push(dashboards[userRole] || "/dashboard");
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
      desc: "Consultations en ligne",
      Icon: FaUserAlt,
      color: "from-blue-500 to-cyan-500",
    },
    {
      key: "doctor" as const,
      label: "Médecin",
      desc: "Gérer vos patients",
      Icon: FaUserMd,
      color: "from-emerald-500 to-teal-500",
    },
    {
      key: "pharmacy" as const,
      label: "Pharmacien",
      desc: "Gestion du stock",
      Icon: FaPills,
      color: "from-green-500 to-lime-500",
    },
    {
      key: "medical_service" as const,
      label: "Services Médicaux",
      desc: "Hospitalisation à domicile",
      Icon: FaHospital,
      color: "from-purple-500 to-indigo-500",
    },
    {
      key: "lab_radiology" as const,
      label: "Labos & Radiologie",
      desc: "Analyses & Imagerie",
      Icon: FaMicroscope,
      color: "from-rose-500 to-pink-500",
    },
    {
      key: "medical_transport" as const,
      label: "Transport Médicalisé",
      desc: "Ambulances & transport",
      Icon: FaAmbulance,
      color: "from-orange-500 to-red-500",
    },
    {
      key: "paramedical" as const,
      label: "Paramédicaux",
      desc: "Infirmiers & thérapeutes",
      Icon: FaUserNurse,
      color: "from-sky-500 to-blue-500",
    },
    {
      key: "admin" as const,
      label: "Administrateur",
      desc: "Gestion de la plateforme",
      Icon: FaShieldAlt,
      color: "from-slate-500 to-gray-700",
    },
  ];

  if (!userRole) {
    return (
      <div className="min-h-screen bg-background flex">
        {/* Left branding panel */}
        <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 relative flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

          <Link href="/" className="relative flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Image
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
                Plateforme de santé #1 en Tunisie
              </div>
              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
                Votre santé,
                <br />
                connectée et sécurisée
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Accédez à des médecins spécialistes, gérez vos prescriptions et
                suivez votre parcours de santé depuis un seul endroit.
              </p>
            </div>
            <div className="space-y-3">
              {[
                "Consultations vidéo 24h/24",
                "Dossier médical sécurisé",
                "Pharmacie en ligne",
                "Transport médicalisé",
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
            href="/"
            className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition group"
          >
            <FaChevronLeft
              size={11}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Accueil
          </Link>
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Image
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
                Se connecter
              </h1>
              <p className="text-muted-foreground">
                Sélectionnez votre profil pour continuer
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              {roles.map(({ key, label, desc, Icon, color }) => (
                <button
                  key={key}
                  onClick={() => setUserRole(key)}
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
                  <p className="font-semibold text-foreground text-sm group-hover:text-foreground leading-tight mb-1">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {desc}
                  </p>
                  <FaArrowRight
                    className="absolute bottom-4 right-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                    size={12}
                  />
                </button>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Pas encore de compte?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Inscrivez-vous gratuitement
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const activeRole = roles.find((r) => r.key === userRole)!;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 relative flex-col justify-between p-10 bg-gradient-to-br from-primary via-primary/90 to-accent overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <Link href="/" className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Image
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
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeRole.color} bg-white/10 flex items-center justify-center`}
          >
            <activeRole.Icon className="text-white" size={28} />
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Connexion en tant que</p>
            <h2 className="text-3xl font-bold text-white">
              {activeRole.label}
            </h2>
          </div>
          <div className="space-y-3">
            {[
              "Accès sécurisé à votre espace",
              "Données chiffrées de bout en bout",
              "Conforme aux normes de santé",
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

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <button
            onClick={() => {
              setUserRole(null);
              setAuthError(null);
              setFormData({
                email: "",
                password: "",
                doctorId: "",
                pharmacyId: "",
                serviceId: "",
                labId: "",
                transportId: "",
                paramedicalId: "",
                companyName: "",
              });
            }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition mb-8 group"
          >
            <FaChevronLeft
              size={12}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Changer de profil
          </button>

          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
              <Image
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

          <div className="mb-8">
            <div
              className={`inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-gradient-to-r ${activeRole.color} mb-4`}
            >
              <activeRole.Icon className="text-white" size={14} />
              <span className="text-white text-xs font-semibold">
                {activeRole.label}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Connexion
            </h1>
            <p className="text-muted-foreground text-sm">
              Bienvenue. Entrez vos identifiants pour continuer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {authError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm flex items-start gap-2">
                <span className="mt-0.5 shrink-0">⚠</span>
                {authError}
              </div>
            )}

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

            {userRole === "doctor" && (
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
            )}
            {userRole === "pharmacy" && (
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
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-foreground"
                >
                  Mot de passe
                </label>
                <Link href="#" className="text-xs text-primary hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
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

            <button
              type="submit"
              disabled={
                isLoading ||
                !formData.email ||
                !formData.password ||
                (userRole === "doctor" && !formData.doctorId) ||
                (userRole === "pharmacy" && !formData.pharmacyId)
              }
              className={`w-full py-3.5 bg-gradient-to-r ${activeRole.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  Se connecter
                  <FaArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Pas encore de compte?{" "}
            <Link
              href="/register"
              className="text-primary font-semibold hover:underline"
            >
              Inscrivez-vous gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
