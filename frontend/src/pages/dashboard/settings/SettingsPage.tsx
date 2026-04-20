import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  Lock,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const handleChangePassword = async () => {
    setPwMsg(null);
    if (newPassword.length < 6) {
      setPwMsg({
        type: "error",
        text: "Le nouveau mot de passe doit contenir au moins 6 caractères",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({
        type: "error",
        text: "Les mots de passe ne correspondent pas",
      });
      return;
    }
    setPwSaving(true);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Erreur lors du changement");
      setPwMsg({ type: "success", text: "Mot de passe modifié avec succès" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err: any) {
      setPwMsg({ type: "error", text: err.message });
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-2xl">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
              <p className="text-muted-foreground mt-2">
                Gérez vos préférences et informations personnelles
              </p>
            </div>

            {/* Security Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Lock size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Sécurité</h2>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setShowPasswordForm(!showPasswordForm);
                    setPwMsg(null);
                  }}
                  className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground"
                >
                  Changer le mot de passe
                </button>

                {showPasswordForm && (
                  <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="relative">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mot de passe actuel
                      </label>
                      <input
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-input text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-9 text-muted-foreground"
                      >
                        {showCurrentPw ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Nouveau mot de passe
                      </label>
                      <input
                        type={showNewPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 pr-10 border border-border rounded-lg bg-input text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-9 text-muted-foreground"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Confirmer le nouveau mot de passe
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                      />
                    </div>

                    {pwMsg && (
                      <div
                        className={`flex items-center gap-2 p-3 rounded-lg text-sm ${pwMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                      >
                        {pwMsg.type === "success" ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          <AlertCircle size={16} />
                        )}
                        {pwMsg.text}
                      </div>
                    )}

                    <button
                      onClick={handleChangePassword}
                      disabled={
                        pwSaving ||
                        !currentPassword ||
                        !newPassword ||
                        !confirmPassword
                      }
                      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {pwSaving ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Lock size={18} />
                      )}
                      {pwSaving
                        ? "Modification..."
                        : "Modifier le mot de passe"}
                    </button>
                  </div>
                )}

                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Authentification à deux facteurs
                </button>
                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Gérer les sessions actives
                </button>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Shield size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Confidentialité
                </h2>
              </div>

              <div className="space-y-4">
                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Télécharger mes données
                </button>
                <button className="w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground">
                  Consulter la politique de confidentialité
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
