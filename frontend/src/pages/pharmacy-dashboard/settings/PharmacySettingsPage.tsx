import { useState, useEffect } from "react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Save, MapPin, Clock, Phone, Building2, FileText, Shield, ExternalLink } from "lucide-react";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";

interface PharmacySettings {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  address: string;
  coordinates: { lat: number; lng: number } | null;
  wilaya: string;
  city: string;
  governorate: string;
  delegation: string;
  mapsUrl: string;
  openingHours: string;
  isOnDuty: boolean;
  description: string;
  avatar: string;
  pharmacyId: string;
}

const MAPS_URL_REGEX = /^https?:\/\/(maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|www\.google\.[a-z.]+\/maps)/i;

export default function PharmacySettingsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<PharmacySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "pharmacy") return;
    const token = localStorage.getItem("megacare_token");
    fetch("/api/pharmacy/settings", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setSettings({
          ...data,
          governorate: data.governorate || "",
          delegation: data.delegation || "",
          mapsUrl: data.mapsUrl || "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy") return null;

  const pharmacyName = settings?.companyName || user.firstName || "Pharmacie";

  const handleChange = (field: keyof PharmacySettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleCoordChange = (field: "lat" | "lng", value: string) => {
    if (!settings) return;
    const num = parseFloat(value);
    setSettings({
      ...settings,
      coordinates: {
        lat: field === "lat" ? (isNaN(num) ? 0 : num) : (settings.coordinates?.lat ?? 0),
        lng: field === "lng" ? (isNaN(num) ? 0 : num) : (settings.coordinates?.lng ?? 0),
      },
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage(null);
    const token = localStorage.getItem("megacare_token");
    try {
      const res = await fetch("/api/pharmacy/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: settings.firstName,
          lastName: settings.lastName,
          phone: settings.phone,
          companyName: settings.companyName,
          address: settings.address,
          coordinates: settings.coordinates,
          wilaya: settings.wilaya,
          city: settings.city,
          governorate: settings.governorate,
          delegation: settings.delegation,
          mapsUrl: settings.mapsUrl,
          openingHours: settings.openingHours,
          isOnDuty: settings.isOnDuty,
          description: settings.description,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setMessage({ type: "success", text: "Paramètres enregistrés avec succès" });
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: "error", text: err.message || "Erreur lors de la sauvegarde" });
      }
    } catch {
      setMessage({ type: "error", text: "Erreur réseau" });
    }
    setSaving(false);
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm";

  return (
    <div className="flex min-h-screen bg-background">
      <PharmacyDashboardSidebar pharmacyName={pharmacyName} />

      <main className="flex-1 overflow-auto md:ml-64">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
            <p className="text-muted-foreground mt-1">
              Configurez les informations de votre pharmacie
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-card border border-border rounded-xl animate-pulse" />
              ))}
            </div>
          ) : settings ? (
            <div className="space-y-6">
              {/* Success/Error message */}
              {message && (
                <div
                  className={`p-4 rounded-lg border text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-red-50 border-red-200 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* General Info */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Building2 size={20} className="text-primary" />
                  Informations générales
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Nom de la pharmacie
                    </label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      className={inputClass}
                      placeholder="Ex: Pharmacie Centrale Tunis"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      N° d'enregistrement
                    </label>
                    <input
                      type="text"
                      value={settings.pharmacyId}
                      className={`${inputClass} opacity-60 cursor-not-allowed`}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Prénom du pharmacien
                    </label>
                    <input
                      type="text"
                      value={settings.firstName}
                      onChange={(e) => handleChange("firstName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Nom du pharmacien
                    </label>
                    <input
                      type="text"
                      value={settings.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.email}
                      className={`${inputClass} opacity-60 cursor-not-allowed`}
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      <Phone size={14} className="inline mr-1" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={inputClass}
                      placeholder="+216 71 000 000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    <FileText size={14} className="inline mr-1" />
                    Description
                  </label>
                  <textarea
                    value={settings.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    className={`${inputClass} min-h-[80px] resize-y`}
                    placeholder="Décrivez votre pharmacie, services proposés..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <MapPin size={20} className="text-primary" />
                  Adresse & Localisation
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Adresse complète
                    </label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className={inputClass}
                      placeholder="12 Avenue Habib Bourguiba, Tunis 1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Gouvernorat
                    </label>
                    <select
                      value={settings.governorate}
                      onChange={(e) => {
                        handleChange("governorate", e.target.value);
                        handleChange("delegation", "");
                      }}
                      className={inputClass}
                    >
                      <option value="">Sélectionner un gouvernorat</option>
                      {GOVERNORATES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Délégation
                    </label>
                    <select
                      value={settings.delegation}
                      onChange={(e) => handleChange("delegation", e.target.value)}
                      className={inputClass}
                      disabled={!settings.governorate}
                    >
                      <option value="">Sélectionner une délégation</option>
                      {(DELEGATIONS[settings.governorate] ?? []).map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={settings.coordinates?.lat ?? ""}
                      onChange={(e) => handleCoordChange("lat", e.target.value)}
                      className={inputClass}
                      placeholder="36.8065"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={settings.coordinates?.lng ?? ""}
                      onChange={(e) => handleCoordChange("lng", e.target.value)}
                      className={inputClass}
                      placeholder="10.1815"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-1">
                      <ExternalLink size={14} className="inline mr-1" />
                      Lien Google Maps
                    </label>
                    <input
                      type="url"
                      value={settings.mapsUrl}
                      onChange={(e) => handleChange("mapsUrl", e.target.value)}
                      className={`${inputClass} ${settings.mapsUrl && !MAPS_URL_REGEX.test(settings.mapsUrl) ? "border-red-400 focus:ring-red-400" : ""}`}
                      placeholder="https://maps.google.com/..."
                    />
                    {settings.mapsUrl && !MAPS_URL_REGEX.test(settings.mapsUrl) && (
                      <p className="text-xs text-red-500 mt-1">URL invalide. Utilisez un lien Google Maps (maps.google.com, goo.gl/maps, maps.app.goo.gl)</p>
                    )}
                    {settings.mapsUrl && MAPS_URL_REGEX.test(settings.mapsUrl) && (
                      <a
                        href={settings.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                      >
                        <MapPin size={11} />
                        Aperçu — Ouvrir dans Google Maps
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Opening hours & duty */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Clock size={20} className="text-primary" />
                  Horaires & Garde
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Horaires d'ouverture
                    </label>
                    <input
                      type="text"
                      value={settings.openingHours}
                      onChange={(e) => handleChange("openingHours", e.target.value)}
                      className={inputClass}
                      placeholder="08:00 - 22:00"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.isOnDuty}
                        onChange={(e) => handleChange("isOnDuty", e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                    </label>
                    <div>
                      <span className="text-sm font-medium text-foreground flex items-center gap-1">
                        <Shield size={14} className="text-primary" />
                        Pharmacie de garde
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Activez si votre pharmacie est actuellement de garde
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-60 transition text-sm"
                >
                  <Save size={16} />
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Impossible de charger les paramètres
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
