import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  FaUserAlt,
  FaUserMd,
  FaPills,
  FaHospital,
  FaMicroscope,
  FaUserNurse,
  FaShieldAlt,
  FaHeartbeat,
  FaCheckCircle,
  FaFlask,
  FaChevronLeft,
} from "react-icons/fa";

const TEST_ACCOUNTS = [
  {
    key: "patient",
    label: "Patient",
    desc: "Consultations, ordonnances, dossier médical",
    email: "patient@megacare.tn",
    password: "Patient@2024",
    dashboard: "/dashboard",
    Icon: FaUserAlt,
    color: "from-blue-500 to-cyan-500",
    badge: "Accès gratuit",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    key: "doctor",
    label: "Médecin",
    desc: "Agenda, patients & prescriptions",
    email: "medecin@megacare.tn",
    password: "Medecin@2024",
    dashboard: "/doctor-dashboard",
    Icon: FaUserMd,
    color: "from-emerald-500 to-teal-500",
    badge: "Pro",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "pharmacy",
    label: "Pharmacien",
    desc: "Stock, commandes & ordonnances",
    email: "pharmacien@megacare.tn",
    password: "Pharmacien@2024",
    dashboard: "/pharmacy-dashboard",
    Icon: FaPills,
    color: "from-green-500 to-lime-500",
    badge: "Pro",
    badgeColor: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  {
    key: "lab_radiology",
    label: "Labos & Radiologie",
    desc: "Examens, résultats & rendez-vous",
    email: "labo@megacare.tn",
    password: "Labo@2024",
    dashboard: "/lab-dashboard",
    Icon: FaMicroscope,
    color: "from-rose-500 to-pink-500",
    badge: "Pro",
    badgeColor: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    key: "paramedical",
    label: "Paramédicaux",
    desc: "Planning, soins & téléconsultation",
    email: "paramedical@megacare.tn",
    password: "Paramedical@2024",
    dashboard: "/paramedical-dashboard",
    Icon: FaUserNurse,
    color: "from-sky-500 to-blue-500",
    badge: "Pro",
    badgeColor: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    key: "medical_service",
    label: "Services Médicaux",
    desc: "HAD, équipe & vitaux patients",
    email: "service@megacare.tn",
    password: "Service@2024",
    dashboard: "/medical-service-dashboard",
    Icon: FaHospital,
    color: "from-purple-500 to-indigo-500",
    badge: "Pro",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    key: "admin",
    label: "Administrateur",
    desc: "Gestion complète de la plateforme",
    email: "admin@megacare.tn",
    password: "Admin@megacare2024",
    dashboard: "/admin",
    Icon: FaShieldAlt,
    color: "from-slate-500 to-gray-700",
    badge: "Admin",
    badgeColor: "bg-slate-500/10 text-slate-600 dark:text-slate-400",
  },
] as const;

export default function LoginTestDataPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickLogin = async (account: (typeof TEST_ACCOUNTS)[number]) => {
    setLoadingKey(account.key);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            `Impossible de se connecter en tant que ${account.label}.`,
        );
        return;
      }

      const { user: apiUser, token } = data;
      if (token) {
        localStorage.setItem("megacare_token", token);
      }

      login(apiUser);
      navigate(account.dashboard);
    } catch {
      setError("Impossible de contacter le serveur. Le backend est-il lancé ?");
    } finally {
      setLoadingKey(null);
    }
  };

  const patientAccount = TEST_ACCOUNTS[0];
  const proAccounts = TEST_ACCOUNTS.slice(1);

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left branding panel ── */}
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
          <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/20 rounded-xl">
            <FaFlask className="text-white" size={14} />
            <span className="text-white text-xs font-semibold uppercase tracking-wider">
              Mode Test
            </span>
          </div>
          <div>
            <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Connexion rapide
              <br />
              pour les tests
            </h2>
            <p className="text-white/70 text-sm leading-relaxed">
              Cliquez sur un rôle pour vous connecter instantanément avec un
              compte de démonstration pré-configuré.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Comptes pré-approuvés",
              "Données de démonstration",
              "Accès immédiat au dashboard",
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
          <FaHeartbeat className="text-white/40" size={14} />
          <span className="text-white/40 text-xs">
            Environnement de test · Ne pas utiliser en production
          </span>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto relative">
        <Link
          to="/login"
          className="absolute top-5 left-5 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition group"
        >
          <FaChevronLeft
            size={11}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Connexion normale
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

        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-600 dark:text-amber-400 text-xs font-semibold mb-4">
              <FaFlask size={11} />
              Données de test
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Connexion rapide
            </h1>
            <p className="text-muted-foreground">
              Cliquez sur un rôle pour accéder directement au dashboard
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl px-4 py-3 text-sm flex items-start gap-2">
              <span className="mt-0.5 shrink-0">⚠</span>
              {error}
            </div>
          )}

          {/* Patient — featured */}
          <button
            onClick={() => handleQuickLogin(patientAccount)}
            disabled={loadingKey !== null}
            className="group w-full mb-4 relative p-5 bg-card rounded-2xl border-2 border-border hover:border-blue-400/50 hover:shadow-xl transition-all duration-300 overflow-hidden text-left disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                {loadingKey === "patient" ? (
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <patientAccount.Icon className="text-white" size={22} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-foreground text-base">
                    Patient
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${patientAccount.badgeColor}`}
                  >
                    {patientAccount.badge}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {patientAccount.desc}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
                  {patientAccount.email}
                </p>
              </div>
              <div className="text-xs text-right shrink-0 space-y-1">
                <div className="px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg font-semibold text-xs group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  {loadingKey === "patient" ? "Connexion..." : "Se connecter →"}
                </div>
              </div>
            </div>
          </button>

          {/* Pro roles grid */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3 px-0.5">
            Professionnels de santé
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {proAccounts.map((account) => (
              <button
                key={account.key}
                onClick={() => handleQuickLogin(account)}
                disabled={loadingKey !== null}
                className="group relative p-4 bg-card rounded-2xl border-2 border-border hover:border-transparent hover:shadow-xl transition-all duration-300 text-left overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${account.color} opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300`}
                />
                <div
                  className={`w-10 h-10 mb-3 rounded-xl bg-gradient-to-br ${account.color} flex items-center justify-center shadow-md`}
                >
                  {loadingKey === account.key ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <account.Icon className="text-white" size={17} />
                  )}
                </div>
                <p className="font-semibold text-foreground text-sm leading-tight mb-0.5">
                  {account.label}
                </p>
                <p className="text-xs text-muted-foreground leading-tight mb-1.5">
                  {account.desc}
                </p>
                <p className="text-[10px] text-muted-foreground/50 font-mono truncate">
                  {account.email}
                </p>
                <div
                  className={`mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-md inline-block ${account.badgeColor}`}
                >
                  {loadingKey === account.key ? "Connexion..." : "Connexion →"}
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground/60 mt-8">
            Page réservée aux tests · Ne pas partager les identifiants
          </p>
        </div>
      </div>
    </div>
  );
}
