import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  User,
  Lock,
  Bell,
  Shield,
  Save,
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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, email, phone }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Erreur lors de la sauvegarde");
      // Update local auth context
      const stored = localStorage.getItem("megacare_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "megacare_user",
          JSON.stringify({ ...parsed, firstName, lastName, email, phone }),
        );
      }
      setSaveMsg({ type: "success", text: "Profil mis à jour avec succès" });
    } catch (err: any) {
      setSaveMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

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

            {/* Profile Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <User size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Profil personnel
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                  />
                </div>

                {saveMsg && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-lg text-sm ${saveMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                  >
                    {saveMsg.type === "success" ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    {saveMsg.text}
                  </div>
                )}

                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Save size={18} />
                  )}
                  {saving
                    ? "Enregistrement..."
                    : "Enregistrer les modifications"}
                </button>
              </div>
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

            {/* Notification Settings */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Bell size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Notifications
                </h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-foreground">
                    Rappels de rendez-vous
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-foreground">Suivi de commandes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-foreground">Avis des médecins</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-border"
                  />
                  <span className="text-foreground">Offres spéciales</span>
                </label>
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
