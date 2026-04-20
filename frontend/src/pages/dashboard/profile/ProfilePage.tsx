import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  User,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  Mail,
  Phone,
  Shield,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

const roleLabels: Record<string, string> = {
  patient: "Patient",
  doctor: "Médecin",
  pharmacy: "Pharmacien",
  medical_service: "Services Médicaux",
  lab_radiology: "Labos & Radiologie",
  paramedical: "Paramédicaux",
  admin: "Administrateur",
};

export default function DashboardProfilePage() {
  const { user, isLoading, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{
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
      setPhone(user.phone || "");
      setAvatarPreview(user.avatar ?? null);
    }
  }, [user]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const initials =
    ((firstName?.[0] ?? "") + (lastName?.[0] ?? "")).toUpperCase().trim() ||
    user.email[0].toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveMsg({ type: "error", text: "L'image ne doit pas dépasser 2 Mo." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

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
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Erreur lors de la sauvegarde");
      const stored = localStorage.getItem("megacare_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem(
          "megacare_user",
          JSON.stringify({ ...parsed, firstName, lastName, phone }),
        );
      }
      updateUser({
        firstName,
        lastName,
        phone,
        name: `${firstName} ${lastName}`.trim(),
        avatar: avatarPreview ?? undefined,
      });
      setSaveMsg({ type: "success", text: "Profil mis à jour avec succès" });
    } catch (err: any) {
      setSaveMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6 max-w-2xl">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
              <p className="text-muted-foreground mt-2">
                Gérez vos informations personnelles
              </p>
            </div>

            {/* Avatar & Info Card */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center ring-2 ring-primary/20">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {initials}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow hover:bg-primary/90 transition"
                  >
                    <Camera size={14} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                {/* Quick info */}
                <div className="text-center sm:text-left space-y-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {firstName} {lastName}
                  </h2>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail size={14} />
                    {user.email}
                  </div>
                  {phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone size={14} />
                      {phone}
                    </div>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 mt-1">
                    <Shield size={11} />
                    {roleLabels[user.role] || user.role}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                JPG, PNG, WebP — max 2 Mo
              </p>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={() => setAvatarPreview(null)}
                  className="text-xs text-muted-foreground hover:text-destructive transition mt-1"
                >
                  Supprimer la photo
                </button>
              )}
            </div>

            {/* Edit Form */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-4">
                <User size={24} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Informations personnelles
                </h2>
              </div>

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
                  Adresse email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  L'adresse email ne peut pas être modifiée.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+216 XX XXX XXX"
                  className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                />
              </div>

              {user.specialization && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Spécialisation
                  </label>
                  <input
                    type="text"
                    value={user.specialization}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>
              )}

              {/* Account status */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Statut du compte
                </p>
                {user.status === "approved" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    <CheckCircle2 size={12} /> Approuvé
                  </span>
                )}
                {user.status === "pending" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20">
                    En attente de validation
                  </span>
                )}
                {user.status === "rejected" && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-500/10 text-destructive border border-red-200 dark:border-red-500/20">
                    Non approuvé
                  </span>
                )}
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
        </main>
      </div>
    </div>
  );
}
