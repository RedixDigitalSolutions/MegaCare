import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  Save,
  Link2,
  Upload,
  X,
  User,
  CheckCircle,
  Bell,
  Shield,
  Loader2,
  AlertCircle,
  Phone,
  Eye,
  EyeOff,
  Mail,
  Stethoscope,
  BadgeCheck,
  Camera,
  KeyRound,
} from "lucide-react";

const NOTIF_STORAGE_KEY = "megacare_doctor_notif_prefs";

function loadNotifPrefs() {
  try {
    const raw = localStorage.getItem(NOTIF_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { appointments: true, reminders: true, reviews: true };
}

function saveNotifPrefs(prefs: {
  appointments: boolean;
  reminders: boolean;
  reviews: boolean;
}) {
  localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(prefs));
}

export default function DoctorSettingsPage() {
  const { user, isLoading, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile photo
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [imageMode, setImageMode] = useState<"idle" | "url">("idle");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseId, setLicenseId] = useState("");

  // Notifications (persisted in localStorage)
  const [notifPrefs, setNotifPrefs] = useState(loadNotifPrefs);
  const toggleNotif = (key: "appointments" | "reminders" | "reviews") => {
    setNotifPrefs(
      (prev: {
        appointments: boolean;
        reminders: boolean;
        reviews: boolean;
      }) => {
        const next = { ...prev, [key]: !prev[key] };
        saveNotifPrefs(next);
        return next;
      },
    );
  };

  // Save state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Password change
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwChanging, setPwChanging] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Seed fields from user once loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      setSpecialty(user.specialization ?? "");
      setLicenseId(user.doctorId ?? "");
      if (user.avatar) setProfileImageUrl(user.avatar);

      // Fetch full profile from backend to get avatar (may be stripped from localStorage)
      const token = localStorage.getItem("megacare_token");
      if (token && !user.avatar) {
        fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((data) => {
            if (data?.user?.avatar) {
              setProfileImageUrl(data.user.avatar);
            }
          })
          .catch(() => {});
      }
    }
  }, [user]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setProfileImageUrl(urlInput.trim());
      setImageMode("idle");
      setUrlInput("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setProfileImageUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          specialization: specialty,
          avatar: profileImageUrl || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.message || "Erreur lors de la sauvegarde");
        return;
      }
      updateUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setSaveError("Impossible de contacter le serveur");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwError("");
    if (!currentPassword || !newPassword) {
      setPwError("Tous les champs sont requis");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Les mots de passe ne correspondent pas");
      return;
    }
    setPwChanging(true);
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
      if (!res.ok) {
        setPwError(data.message || "Erreur lors du changement");
        return;
      }
      setPwSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPwSuccess(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch {
      setPwError("Impossible de contacter le serveur");
    } finally {
      setPwChanging(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border px-6 lg:px-10 py-6 sticky top-0 z-10">
            <div className="max-w-5xl">
              <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
              <p className="text-muted-foreground mt-1">
                Gérez votre profil, notifications et sécurité
              </p>
            </div>
          </div>

          {/* Save success toast */}
          {saved && (
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2">
              <CheckCircle size={16} />
              Modifications enregistrées avec succès
            </div>
          )}

          {/* Save error toast */}
          {saveError && (
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2">
              <AlertCircle size={16} />
              {saveError}
              <button
                onClick={() => setSaveError("")}
                className="ml-2 hover:text-red-200"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="px-6 lg:px-10 py-8">
            <form onSubmit={handleSave} className="max-w-5xl space-y-8">
              {/* ── Profile Header Card ── */}
              <div className="bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-2xl border border-border p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  {/* Avatar */}
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-sm">
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt="Photo profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl font-bold text-primary/60">
                          {firstName?.[0]}
                          {lastName?.[0]}
                        </span>
                      )}
                    </div>
                    {/* Overlay buttons */}
                    <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setImageMode(imageMode === "url" ? "idle" : "url")
                        }
                        className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition"
                        title="Ajouter par URL"
                      >
                        <Link2 size={14} className="text-gray-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 bg-white/90 rounded-lg hover:bg-white transition"
                        title="Télécharger"
                      >
                        <Camera size={14} className="text-gray-700" />
                      </button>
                      {profileImageUrl && (
                        <button
                          type="button"
                          onClick={() => setProfileImageUrl("")}
                          className="p-1.5 bg-red-100 rounded-lg hover:bg-red-200 transition"
                          title="Supprimer"
                        >
                          <X size={14} className="text-red-600" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-foreground">
                      Dr. {firstName} {lastName}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {specialty || "Spécialité non définie"} ·{" "}
                      {licenseId || "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {email}
                    </p>

                    {/* URL input row (shown when URL mode active) */}
                    {imageMode === "url" && (
                      <div className="flex gap-2 mt-3 max-w-md">
                        <input
                          type="url"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleUrlSubmit();
                            }
                            if (e.key === "Escape") setImageMode("idle");
                          }}
                          placeholder="https://exemple.com/photo.jpg"
                          className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleUrlSubmit}
                          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium"
                        >
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageMode("idle")}
                          className="px-2 py-1.5 text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* ── Two-column grid for form fields ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left column: Personal Info */}
                <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User size={18} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        Informations personnelles
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Nom, email et coordonnées
                      </p>
                    </div>
                  </div>

                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-foreground">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Prénom"
                        className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-foreground">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Nom de famille"
                        className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Mail size={14} className="text-muted-foreground" /> Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemple.com"
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <Phone size={14} className="text-muted-foreground" />{" "}
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="06 12 34 56 78"
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                    />
                  </div>
                </div>

                {/* Right column: Professional Info */}
                <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Stethoscope size={18} className="text-primary" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        Informations professionnelles
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Spécialité et identifiants
                      </p>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-foreground">
                      Spécialité
                    </label>
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="ex. Cardiologie"
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                    />
                  </div>

                  {/* License ID — read-only */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <BadgeCheck size={14} className="text-muted-foreground" />
                      Numéro de licence
                      <span className="ml-1 text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        lecture seule
                      </span>
                    </label>
                    <input
                      type="text"
                      value={licenseId}
                      readOnly
                      className="w-full px-4 py-2.5 border border-border rounded-xl bg-muted text-muted-foreground text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* ── Bottom row: Notifications + Security side by side ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Notifications */}
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Bell size={18} className="text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        Notifications
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Choisissez ce qui vous alerte
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {[
                      {
                        label: "Nouveaux rendez-vous",
                        desc: "Alerte à chaque nouvelle réservation",
                        key: "appointments" as const,
                      },
                      {
                        label: "Rappels d'agenda",
                        desc: "Rappels avant vos consultations",
                        key: "reminders" as const,
                      },
                      {
                        label: "Nouveaux avis patients",
                        desc: "Quand un patient laisse un avis",
                        key: "reviews" as const,
                      },
                    ].map(({ label, desc, key }) => (
                      <label
                        key={key}
                        className="flex items-center justify-between cursor-pointer py-3 px-2 rounded-xl hover:bg-muted/50 transition"
                      >
                        <div className="pr-4">
                          <span className="text-sm font-medium text-foreground block">
                            {label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {desc}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleNotif(key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
                            notifPrefs[key]
                              ? "bg-primary"
                              : "bg-muted-foreground/20"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              notifPrefs[key]
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Security */}
                <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                    <div className="p-2 bg-red-500/10 rounded-lg">
                      <Shield size={18} className="text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-foreground">
                        Sécurité
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Protégez votre compte
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-muted/50 transition">
                      <div>
                        <span className="text-sm font-medium text-foreground block">
                          Mot de passe
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Dernière modification inconnue
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordModal(true);
                          setPwError("");
                          setPwSuccess(false);
                          setCurrentPassword("");
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl hover:bg-muted-foreground/10 transition text-sm font-medium"
                      >
                        <KeyRound size={14} />
                        Modifier
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 px-2 rounded-xl">
                      <div>
                        <span className="text-sm font-medium text-foreground block">
                          Authentification à deux facteurs
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Non configurée
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-lg font-medium">
                        Bientôt
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Save Button ── */}
              <div className="flex justify-end pt-2 pb-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {saving ? "Enregistrement…" : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* ── Password Change Modal ── */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Shield size={18} className="text-primary" />
                Changer le mot de passe
              </h3>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {pwSuccess ? (
              <div className="flex flex-col items-center gap-3 py-6">
                <CheckCircle size={48} className="text-green-500" />
                <p className="text-sm font-medium text-green-600">
                  Mot de passe modifié avec succès
                </p>
              </div>
            ) : (
              <>
                {pwError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    <AlertCircle size={14} />
                    {pwError}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-foreground">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPw ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPw ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-foreground">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPw ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum 8 caractères
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-foreground">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition text-sm font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handlePasswordChange}
                    disabled={pwChanging}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium disabled:opacity-60"
                  >
                    {pwChanging && (
                      <Loader2 size={14} className="animate-spin" />
                    )}
                    {pwChanging ? "Changement…" : "Confirmer"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
