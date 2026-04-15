import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  User,
  Bell,
  Save,
  Check,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

const tok = () => localStorage.getItem("megacare_token") ?? "";

export default function ParamedicalSettingsPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    specialization: user?.specialization ?? "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [showPwd, setShowPwd] = useState(false);

  const [notifs, setNotifs] = useState({
    email: true,
    sms: true,
    push: true,
    dailyReport: true,
  });

  const [toast, setToast] = useState("");
  const [pwdError, setPwdError] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify(profile),
    }).catch(() => null);
    if (r && r.ok) showToast("Profil mis a jour avec succes");
    else showToast("Erreur lors de la mise a jour du profil");
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (!passwords.current) { setPwdError("Mot de passe actuel requis."); return; }
    if (passwords.next.length < 8) { setPwdError("Le nouveau mot de passe doit contenir au moins 8 caractères."); return; }
    if (passwords.next !== passwords.confirm) { setPwdError("Les mots de passe ne correspondent pas."); return; }
    const r = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next }),
    }).catch(() => null);
    if (r && r.ok) {
      setPasswords({ current: "", next: "", confirm: "" });
      showToast("Mot de passe mis a jour");
    } else {
      setPwdError("Impossible de mettre a jour le mot de passe.");
    }
  };

  const toggleNotif = (key: keyof typeof notifs) =>
    setNotifs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Paramètres</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gérez votre profil et préférences</p>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm">
            <Check size={15} />
            {toast}
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full">
          {/* ── Profile section ── */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <User size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Profil</h2>
            </div>
            <form onSubmit={handleProfileSave} className="p-5 space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {(profile.firstName[0] ?? "?").toUpperCase()}{(profile.lastName[0] ?? "").toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{profile.firstName} {profile.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Prénom</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Téléphone</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Spécialisation</label>
                  <select
                    value={profile.specialization}
                    onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  >
                    <option value="">— Choisir —</option>
                    {["Infirmier(e)",
                      "Kinésithérapeute",
                      "Aide-soignant(e)",
                      "Sage-femme",
                      "Ergothérapeute",
                      "Orthophoniste",
                      "Psychomotricien(ne)",
                      "Diététicien(ne)",
                      "Autre paramédical"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition">
                  <Save size={14} />
                  Enregistrer le profil
                </button>
              </div>
            </form>
          </section>

          {/* ── Password section ── */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Lock size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Mot de passe</h2>
            </div>
            <form onSubmit={handlePasswordSave} className="p-5 space-y-4">
              {["current", "next", "confirm"].map((field, i) => (
                <div key={field}>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                    {field === "current" ? "Mot de passe actuel" : field === "next" ? "Nouveau mot de passe" : "Confirmer le nouveau"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={passwords[field as keyof typeof passwords]}
                      onChange={(e) => setPasswords({ ...passwords, [field]: e.target.value })}
                      className="w-full pl-3 pr-10 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                      placeholder={field === "current" ? "••••••••" : field === "next" ? "Minimum 8 caractères" : "Répéter le mot de passe"}
                    />
                    {i === 0 && (
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                      >
                        {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {pwdError && <p className="text-xs text-red-600">{pwdError}</p>}
              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition">
                  <Save size={14} />
                  Mettre à jour
                </button>
              </div>
            </form>
          </section>

          {/* ── Notifications section ── */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Bell size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Notifications</h2>
            </div>
            <div className="p-5 space-y-0 divide-y divide-border">
              {[
                { key: "email", label: "Alertes email", description: "Recevoir les notifications par e-mail" },
                { key: "sms", label: "Alertes SMS", description: "Recevoir les alertes urgentes par SMS" },
                { key: "push", label: "Notifications push", description: "Notifications en temps réel dans l'application" },
                { key: "dailyReport", label: "Rapport journalier", description: "Recevoir un résumé quotidien de vos soins" },
              ].map(({ key, label, description }) => {
                const on = notifs[key as keyof typeof notifs];
                return (
                  <div key={key} className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotif(key as keyof typeof notifs)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`}
                      role="switch"
                      aria-checked={on}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${on ? "translate-x-5" : ""}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
