"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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
  const router = useRouter();
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

      const dashboards: Record<string, string> = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        lab_radiology: "/lab-dashboard",
        medical_transport: "/transport-dashboard",
        paramedical: "/paramedical-dashboard",
      };

      router.push(dashboards[userType]);
    } catch {
      setAuthError(
        "Impossible de contacter le serveur. Vérifiez votre connexion internet.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!userType) {
    // Step 1: Choose User Type
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-12 px-4 pt-32">
          <div className="w-full max-w-2xl space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold text-foreground">
                Rejoignez MegaCare
              </h1>
              <p className="text-lg text-muted-foreground">
                Choisissez votre profil pour commencer
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Patient Card */}
              <button
                onClick={() => setUserType("patient")}
                className="group p-5 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">👤</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Patient
                </h3>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>✓ Consultations</li>
                  <li>✓ Dossier médical</li>
                  <li>✓ Prescriptions</li>
                </ul>
                <p className="text-sm font-semibold text-primary">Gratuit</p>
              </button>

              {/* Doctor Card */}
              <button
                onClick={() => setUserType("doctor")}
                className="group p-5 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">👨‍⚕️</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Médecin
                </h3>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>✓ Gérer agenda</li>
                  <li>✓ Dossiers patients</li>
                  <li>✓ Consultations vidéo</li>
                </ul>
                <p className="text-sm font-semibold text-primary">Rejoindre</p>
              </button>

              {/* Pharmacy Card */}
              <button
                onClick={() => setUserType("pharmacy")}
                className="group p-5 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">💊</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Pharmacien
                </h3>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>✓ Gestion stock</li>
                  <li>✓ Commandes</li>
                  <li>✓ Livraisons</li>
                </ul>
                <p className="text-sm font-semibold text-primary">
                  Partenariat
                </p>
              </button>

              {/* Medical Service Card */}
              <button
                onClick={() => setUserType("medical_service")}
                className="group p-5 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">🏥</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Services Médicaux
                </h3>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>✓ Hospitalisation</li>
                  <li>✓ Soins à domicile</li>
                  <li>✓ Gestion infirmiers</li>
                </ul>
                <p className="text-sm font-semibold text-primary">
                  Partenariat
                </p>
              </button>

              {/* Lab & Radiology Card */}
              <button
                onClick={() => setUserType("lab_radiology")}
                className="group p-5 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">🔬</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Labos & Radiologie
                </h3>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>✓ Analyses</li>
                  <li>✓ Imagerie médicale</li>
                  <li>✓ Résultats patients</li>
                </ul>
                <p className="text-sm font-semibold text-primary">
                  Partenariat
                </p>
              </button>

              {/* Medical Transport Card */}
              <button
                onClick={() => setUserType("medical_transport")}
                className="group p-5 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">🚑</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Transport Médicalisé
                </h3>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>✓ Ambulances</li>
                  <li>✓ Gestion flotte</li>
                  <li>✓ Trajets patients</li>
                </ul>
                <p className="text-sm font-semibold text-primary">
                  Partenariat
                </p>
              </button>

              {/* Paramedical Card */}
              <button
                onClick={() => setUserType("paramedical")}
                className="group p-5 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">👩‍⚕️</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Paramédicaux
                </h3>
                <ul className="space-y-1 text-muted-foreground text-xs">
                  <li>✓ Infirmiers</li>
                  <li>✓ Thérapeutes</li>
                  <li>✓ Soins patients</li>
                </ul>
                <p className="text-sm font-semibold text-primary">Rejoindre</p>
              </button>
            </div>

            <p className="text-center text-muted-foreground">
              Vous avez déjà un compte?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Connectez-vous
              </Link>
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Step 2: Registration Form
  const typeLabels = {
    patient: "Patient",
    doctor: "Professionnel Médical",
    pharmacy: "Pharmacien",
    medical_service: "Services Médicaux",
    lab_radiology: "Labos & Radiologie",
    medical_transport: "Transport Médicalisé",
    paramedical: "Paramédicaux",
  };

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 pt-32">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <button
            onClick={() => setUserType(null)}
            className="flex items-center gap-2 text-primary hover:underline transition"
          >
            <ChevronLeft size={20} />
            Retour
          </button>

          {/* Form Card */}
          <div className="bg-card rounded-2xl border border-border p-8 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white text-lg font-bold">
                  MC
                </div>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Inscription - {typeLabels[userType]}
              </h1>
              <p className="text-muted-foreground">
                Créez votre compte MegaCare
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {authError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
                  {authError}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-2">
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
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
                    className="w-16 px-3 py-3 bg-muted border border-border rounded-lg text-foreground text-center"
                  />
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="XXXXXXXX"
                    className="flex-1 px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Specialization for Doctor */}
              {userType === "doctor" && (
                <div className="space-y-2">
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Sélectionner une spécialité</option>
                    {specializations.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Doctor ID */}
              {userType === "doctor" && (
                <div className="space-y-2">
                  <label
                    htmlFor="doctorId"
                    className="text-sm font-medium text-foreground"
                  >
                    Numéro de licence médicale (Ordre des Médecins)
                  </label>
                  <input
                    id="doctorId"
                    type="text"
                    name="doctorId"
                    value={formData.doctorId}
                    onChange={handleInputChange}
                    placeholder="Ex: MD123456"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              )}

              {/* Pharmacy ID */}
              {userType === "pharmacy" && (
                <div className="space-y-2">
                  <label
                    htmlFor="pharmacyId"
                    className="text-sm font-medium text-foreground"
                  >
                    Numéro d'agrément pharmacie
                  </label>
                  <input
                    id="pharmacyId"
                    type="text"
                    name="pharmacyId"
                    value={formData.pharmacyId}
                    onChange={handleInputChange}
                    placeholder="Ex: PH789456"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              )}

              {/* Password Input */}
              <div className="space-y-2">
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
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
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 mt-1 bg-input border border-border rounded cursor-pointer accent-primary"
                  required
                />
                <label
                  htmlFor="agreeToTerms"
                  className="text-sm text-muted-foreground"
                >
                  J'accepte les conditions d'utilisation et la politique de
                  confidentialité
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.agreeToTerms}
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Création du compte...
                  </>
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <p className="text-center text-sm text-muted-foreground">
              Vous avez déjà un compte?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
