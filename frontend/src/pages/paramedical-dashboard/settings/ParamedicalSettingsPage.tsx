import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  User,
  Save,
  Check,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";

const tok = () => localStorage.getItem("megacare_token") ?? "";

const MAPS_URL_REGEX = /^https?:\/\/(maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|www\.google\.[a-z.]+\/maps)/i;

export default function ParamedicalSettingsPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    specialization: user?.specialization ?? "",
  });

  const [location, setLocation] = useState({
    companyName: (user as any)?.companyName ?? "",
    address: (user as any)?.address ?? "",
    governorate: (user as any)?.governorate ?? "",
    delegation: (user as any)?.delegation ?? "",
    mapsUrl: (user as any)?.mapsUrl ?? "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  const [showPwd, setShowPwd] = useState(false);

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

  const handleLocationSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (location.mapsUrl && !MAPS_URL_REGEX.test(location.mapsUrl)) {
      showToast("URL Google Maps invalide");
      return;
    }
    const r = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify(location),
    }).catch(() => null);
    if (r && r.ok) showToast("Localisation mise à jour");
    else showToast("Erreur lors de la mise à jour");
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

          {/* ── Location section ── */}
          <section className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <MapPin size={16} className="text-primary" />
              <h2 className="font-semibold text-foreground text-sm">Localisation & Parapharmacie</h2>
            </div>
            <form onSubmit={handleLocationSave} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Nom de la boutique / enseigne</label>
                <input
                  type="text"
                  value={location.companyName}
                  onChange={(e) => setLocation({ ...location, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  placeholder="Parapharmacie El Amal"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5">Adresse complète</label>
                <input
                  type="text"
                  value={location.address}
                  onChange={(e) => setLocation({ ...location, address: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  placeholder="12 Rue de la République"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Gouvernorat</label>
                  <select
                    value={location.governorate}
                    onChange={(e) => setLocation({ ...location, governorate: e.target.value, delegation: "" })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  >
                    <option value="">Sélectionner</option>
                    {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Délégation</label>
                  <select
                    value={location.delegation}
                    onChange={(e) => setLocation({ ...location, delegation: e.target.value })}
                    disabled={!location.governorate}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background disabled:opacity-50"
                  >
                    <option value="">Sélectionner</option>
                    {(DELEGATIONS[location.governorate] ?? []).map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1.5 flex items-center gap-1">
                  <ExternalLink size={11} />
                  Lien Google Maps
                </label>
                <input
                  type="url"
                  value={location.mapsUrl}
                  onChange={(e) => setLocation({ ...location, mapsUrl: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 bg-background ${location.mapsUrl && !MAPS_URL_REGEX.test(location.mapsUrl) ? "border-red-400 focus:ring-red-400" : "border-border focus:ring-primary/40"}`}
                  placeholder="https://maps.google.com/..."
                />
                {location.mapsUrl && !MAPS_URL_REGEX.test(location.mapsUrl) && (
                  <p className="text-xs text-red-500 mt-1">URL invalide. Utilisez un lien Google Maps</p>
                )}
                {location.mapsUrl && MAPS_URL_REGEX.test(location.mapsUrl) && (
                  <a href={location.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                    <MapPin size={11} /> Aperçu — Ouvrir dans Google Maps
                  </a>
                )}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition">
                  <Save size={14} />
                  Enregistrer la localisation
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

        </main>
      </div>
    </div>
  );
}
