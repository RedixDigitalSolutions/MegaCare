"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type UserRole =
  | "patient"
  | "doctor"
  | "pharmacy"
  | "medical_service"
  | "lab_radiology"
  | "medical_transport"
  | "paramedical"
  | null;

const roleDisplayNames: { [key: string]: string } = {
  patient: "Patient",
  doctor: "Médecin",
  pharmacy: "Pharmacien",
  medical_service: "Services Médicaux",
  lab_radiology: "Labos & Radiologie",
  medical_transport: "Transport Médicalisé",
  paramedical: "Paramédicaux",
};

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

      const dashboards: Record<string, string> = {
        patient: "/dashboard",
        doctor: "/doctor-dashboard",
        pharmacy: "/pharmacy-dashboard",
        medical_service: "/medical-service-dashboard",
        lab_radiology: "/lab-dashboard",
        medical_transport: "/transport-dashboard",
        paramedical: "/paramedical-dashboard",
      };

      router.push(dashboards[userRole]);
    } catch {
      setAuthError(
        "Impossible de contacter le serveur. Vérifiez votre connexion internet.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-12 px-4 pt-32">
          <div className="w-full max-w-3xl space-y-8">
            <div className="text-center space-y-4 mb-12">
              <h1 className="text-4xl font-bold text-foreground">
                Se connecter à MegaCare
              </h1>
              <p className="text-lg text-muted-foreground">
                Sélectionnez votre profil
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Patient Login */}
              <button
                onClick={() => setUserRole("patient")}
                className="group p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">👤</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Patient
                </h3>
                <p className="text-sm text-muted-foreground">
                  Consultations en ligne
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    Se connecter →
                  </p>
                </div>
              </button>

              {/* Doctor Login */}
              <button
                onClick={() => setUserRole("doctor")}
                className="group p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">👨‍⚕️</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Médecin
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gérer les patients
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    Se connecter →
                  </p>
                </div>
              </button>

              {/* Pharmacy Login */}
              <button
                onClick={() => setUserRole("pharmacy")}
                className="group p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">💊</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Pharmacien
                </h3>
                <p className="text-sm text-muted-foreground">
                  Gestion du stock
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    Se connecter →
                  </p>
                </div>
              </button>

              {/* Medical Service Login */}
              <button
                onClick={() => setUserRole("medical_service")}
                className="group p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">🏥</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Services Médicaux
                </h3>
                <p className="text-sm text-muted-foreground">
                  Hospitalisation à domicile
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    Se connecter →
                  </p>
                </div>
              </button>

              {/* Lab & Radiology Login */}
              <button
                onClick={() => setUserRole("lab_radiology")}
                className="group p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">🔬</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Labos & Radiologie
                </h3>
                <p className="text-sm text-muted-foreground">
                  Analyses & Imagerie
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    Se connecter →
                  </p>
                </div>
              </button>

              {/* Medical Transport Login */}
              <button
                onClick={() => setUserRole("medical_transport")}
                className="group p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">🚑</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Transport Médicalisé
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ambulances & transport
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    Se connecter →
                  </p>
                </div>
              </button>

              {/* Paramedical Login */}
              <button
                onClick={() => setUserRole("paramedical")}
                className="group p-6 bg-card rounded-2xl border-2 border-border hover:border-primary hover:shadow-lg transition space-y-3 text-left"
              >
                <div className="text-4xl">👩‍⚕️</div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition">
                  Paramédicaux
                </h3>
                <p className="text-sm text-muted-foreground">
                  Infirmiers & thérapeutes
                </p>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-primary font-semibold">
                    Se connecter →
                  </p>
                </div>
              </button>
            </div>

            <p className="text-center text-muted-foreground">
              Pas encore de compte?{" "}
              <Link
                href="/register"
                className="text-primary font-semibold hover:underline"
              >
                Inscrivez-vous gratuitement
              </Link>
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4 pt-32">
        <div className="w-full max-w-md space-y-8">
          {/* Back Button */}
          <button
            onClick={() => {
              setUserRole(null);
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
            className="flex items-center gap-2 text-primary hover:underline transition"
          >
            <ChevronLeft size={20} />
            Changer de profil
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
              <h1 className="text-3xl font-bold text-foreground">
                Connexion {userRole && roleDisplayNames[userRole]}
              </h1>
              <p className="text-muted-foreground">Entrez vos identifiants</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {authError && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm">
                  {authError}
                </div>
              )}

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

              {/* Doctor ID Input */}
              {userRole === "doctor" && (
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

              {/* Pharmacy ID Input */}
              {userRole === "pharmacy" && (
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
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-foreground"
                  >
                    Mot de passe
                  </label>
                  <Link
                    href="#"
                    className="text-sm text-primary hover:underline"
                  >
                    Oublié?
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !formData.email ||
                  !formData.password ||
                  (userRole === "doctor" && !formData.doctorId) ||
                  (userRole === "pharmacy" && !formData.pharmacyId)
                }
                className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Connexion en cours...
                  </>
                ) : (
                  "Connexion"
                )}
              </button>
            </form>

            {/* Sign Up Link */}
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
      </main>

      <Footer />
    </div>
  );
}
