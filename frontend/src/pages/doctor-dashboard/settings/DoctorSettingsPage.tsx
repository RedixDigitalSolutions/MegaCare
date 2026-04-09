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
} from "lucide-react";

export default function DoctorSettingsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
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
  const [specialty, setSpecialty] = useState("");
  const [licenseId, setLicenseId] = useState("");

  // Notifications
  const [notifAppointments, setNotifAppointments] = useState(true);
  const [notifReminders, setNotifReminders] = useState(true);
  const [notifReviews, setNotifReviews] = useState(true);

  // Save state
  const [saved, setSaved] = useState(false);

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
      setSpecialty(user.specialization ?? "");
      setLicenseId(user.doctorId ?? "");
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

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground mt-1">
              Gérez votre profil et préférences
            </p>
          </div>

          {/* Save success toast */}
          {saved && (
            <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2">
              <CheckCircle size={16} />
              Modifications enregistrées
            </div>
          )}

          <div className="p-6">
            <form onSubmit={handleSave} className="max-w-2xl space-y-6">
              {/* ── Profile Section ── */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <User size={18} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">Profil</h2>
                </div>

                {/* Photo de profil */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Photo de profil
                  </label>
                  <div className="flex items-start gap-4">
                    {/* Preview */}
                    <div className="w-20 h-20 rounded-xl border-2 border-border overflow-hidden bg-muted flex items-center justify-center shrink-0">
                      {profileImageUrl ? (
                        <img
                          src={profileImageUrl}
                          alt="Photo profil"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-primary/60">
                          {firstName?.[0]}
                          {lastName?.[0]}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() =>
                            setImageMode(imageMode === "url" ? "idle" : "url")
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-muted transition font-medium"
                        >
                          <Link2 size={14} /> Lien URL
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-muted transition font-medium"
                        >
                          <Upload size={14} /> Télécharger
                        </button>
                        {profileImageUrl && (
                          <button
                            type="button"
                            onClick={() => setProfileImageUrl("")}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition font-medium"
                          >
                            <X size={14} /> Supprimer
                          </button>
                        )}
                      </div>

                      {imageMode === "url" && (
                        <div className="flex gap-2">
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
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground">
                        JPG, PNG ou WebP · Affiché sur votre profil public.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-foreground">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Prénom"
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-foreground">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nom de famille"
                      className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@exemple.com"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>

                {/* Specialty */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-foreground">
                    Spécialité
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="ex. Cardiologie"
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                  />
                </div>

                {/* License ID — read-only indicator */}
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-foreground">
                    Numéro de licence
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      (non modifiable)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={licenseId}
                    readOnly
                    className="w-full px-4 py-2.5 border border-border rounded-lg bg-muted text-muted-foreground text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* ── Notifications Section ── */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Bell size={18} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">
                    Notifications
                  </h2>
                </div>

                {[
                  {
                    label: "Nouveaux rendez-vous",
                    value: notifAppointments,
                    set: setNotifAppointments,
                  },
                  {
                    label: "Rappels d'agenda",
                    value: notifReminders,
                    set: setNotifReminders,
                  },
                  {
                    label: "Nouveaux avis patients",
                    value: notifReviews,
                    set: setNotifReviews,
                  },
                ].map(({ label, value, set }) => (
                  <label
                    key={label}
                    className="flex items-center justify-between cursor-pointer py-1"
                  >
                    <span className="text-sm text-foreground">{label}</span>
                    {/* Toggle switch */}
                    <button
                      type="button"
                      onClick={() => set(!value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        value ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>

              {/* ── Security Section ── */}
              <div className="bg-card rounded-xl border border-border p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={18} className="text-primary" />
                  <h2 className="text-lg font-bold text-foreground">
                    Sécurité
                  </h2>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition text-sm font-medium"
                >
                  Changer le mot de passe
                </button>
              </div>

              {/* ── Save Button ── */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-medium text-sm"
              >
                <Save size={17} />
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
