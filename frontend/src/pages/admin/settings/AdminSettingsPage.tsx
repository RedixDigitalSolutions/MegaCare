import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import { FaShieldAlt, FaSave, FaEye, FaEyeSlash } from "react-icons/fa";
import {
  User,
  Mail,
  Lock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Profile state
  const [displayName, setDisplayName] = useState(
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.name || "",
  );
  const [email] = useState(user?.email || "");
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password state
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSaved, setPwdSaved] = useState(false);

  if (isLoading || !user) return null;
  if (user.role !== "admin") {
    navigate("/");
    return null;
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    const parts = displayName.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ") || "";
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName }),
      });
      if (!res.ok) {
        const data = await res.json();
        setProfileError(data.message || "Erreur serveur");
        return;
      }
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      setProfileError("Erreur réseau");
    }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (!currentPwd || !newPwd || !confirmPwd) {
      setPwdError("Tous les champs sont requis.");
      return;
    }
    if (newPwd.length < 8) {
      setPwdError(
        "Le nouveau mot de passe doit contenir au moins 8 caractères.",
      );
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwdError(data.message || "Erreur serveur");
        return;
      }
      setPwdSaved(true);
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => setPwdSaved(false), 3000);
    } catch {
      setPwdError("Erreur réseau");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AdminDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Page header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gérez votre compte administrateur et les préférences de la
            plateforme
          </p>
        </div>

        <main className="flex-1 overflow-y-auto px-6 py-8 space-y-8 max-w-2xl">
          {/* ── Profile section ── */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <User size={16} className="text-primary" />
              Profil administrateur
            </h2>
            <div className="bg-card border border-border rounded-2xl p-5">
              {/* Admin badge */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FaShieldAlt size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">
                    {displayName || user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold mt-0.5 inline-block">
                    Administrateur
                  </span>
                </div>
              </div>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    placeholder="Votre nom"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Mail size={12} />
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    L&apos;email ne peut pas être modifié depuis cette
                    interface.
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition"
                  >
                    <FaSave size={13} />
                    Enregistrer
                  </button>
                  {profileSaved && (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                      <CheckCircle size={14} />
                      Sauvegardé
                    </span>
                  )}
                  {profileError && (
                    <span className="flex items-center gap-1.5 text-sm text-destructive">
                      <AlertCircle size={14} />
                      {profileError}
                    </span>
                  )}
                </div>
              </form>
            </div>
          </section>

          {/* ── Security section ── */}
          <section className="space-y-4">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <Lock size={16} className="text-primary" />
              Sécurité
            </h2>
            <div className="bg-card border border-border rounded-2xl p-5">
              <form onSubmit={handlePasswordSave} className="space-y-4">
                {[
                  {
                    label: "Mot de passe actuel",
                    value: currentPwd,
                    set: setCurrentPwd,
                  },
                  {
                    label: "Nouveau mot de passe",
                    value: newPwd,
                    set: setNewPwd,
                  },
                  {
                    label: "Confirmer le nouveau mot de passe",
                    value: confirmPwd,
                    set: setConfirmPwd,
                  },
                ].map((field) => (
                  <div key={field.label} className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        type={showPwd ? "text" : "password"}
                        value={field.value}
                        onChange={(e) => field.set(e.target.value)}
                        autoComplete="new-password"
                        className="w-full pr-10 px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showPwd ? (
                          <FaEyeSlash size={14} />
                        ) : (
                          <FaEye size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}

                {pwdError && (
                  <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2.5">
                    <AlertCircle size={14} />
                    {pwdError}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition"
                  >
                    <Lock size={13} />
                    Changer le mot de passe
                  </button>
                  {pwdSaved && (
                    <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                      <CheckCircle size={14} />
                      Mot de passe mis à jour
                    </span>
                  )}
                </div>
              </form>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
