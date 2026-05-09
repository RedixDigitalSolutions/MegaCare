import { useState, useEffect, useRef } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Building2, Shield, Save, Eye, EyeOff, AlertTriangle, ImagePlus, Upload, Globe, MapPin, Phone, Clock, CheckCircle2, ExternalLink } from "lucide-react";

const MAPS_URL_REGEX = /^https?:\/\/(maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|www\.google\.[a-z.]+\/maps)/i;

interface ServiceInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  capacity: string;
  type: string;
}

interface EstabProfile {
  description: string;
  services: string[];    // stored; edited as newline-separated textarea
  accredited: boolean;
  emergencies: boolean;
  beds: string;         // number stored as string in form
  doctors: string;
  founded: string;
  mapUrl: string;
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

type Tab = "general" | "services" | "location" | "security";

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">{icon}</div>
      <div><h3 className="text-sm font-semibold text-foreground">{title}</h3>{subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} role="switch" aria-checked={checked}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}>
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"
        }`} />
    </button>
  );
}

function ReadField({ label, value, span2 }: { label: string; value: string; span2?: boolean }) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-1">{label}</p>
      <p className="text-sm font-medium text-foreground truncate">{value || <span className="italic opacity-50">—</span>}</p>
    </div>
  );
}

const emptyService: ServiceInfo = { name: "", address: "", phone: "", email: "", director: "", capacity: "", type: "" };
const emptyEstab: EstabProfile = { description: "", services: [], accredited: false, emergencies: false, beds: "", doctors: "", founded: "", mapUrl: "" };

export default function MedicalServiceSettingsPage() {
  const [service, setService] = useState<ServiceInfo>(emptyService);
  const [editingService, setEditingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<ServiceInfo>(emptyService);

  const [estab, setEstab] = useState<EstabProfile>(emptyEstab);
  const [editingEstab, setEditingEstab] = useState(false);
  const [estabForm, setEstabForm] = useState<EstabProfile>(emptyEstab);
  const [servicesText, setServicesText] = useState("");

  // Banner state
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/medical-service/settings", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => {
        if (d) {
          setService({ name: d.name || "", address: d.address || "", phone: d.phone || "", email: d.email || "", director: d.director || "", capacity: String(d.capacity || ""), type: d.serviceType || "" });
        }
      })
      .catch(() => { });

    // Fetch linked establishment for banner + profile data
    fetch("/api/medical-service/establishment", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d?.imageUrl) setBannerUrl(d.imageUrl);
        if (d) {
          const estabData = {
            description: d.description || "",
            services: d.services || [],
            accredited: d.accredited ?? false,
            emergencies: d.emergencies ?? false,
            beds: d.beds != null ? String(d.beds) : "",
            doctors: d.doctors != null ? String(d.doctors) : "",
            founded: d.founded != null ? String(d.founded) : "",
            mapUrl: d.mapUrl || "",
          };
          setEstab(estabData);
          setEstabForm(estabData);
        }
      })
      .catch(() => { });
  }, []);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [savedMsg, setSavedMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const [activeTab, setActiveTab] = useState<Tab>("general");

  async function saveService() {
    await fetch("/api/medical-service/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ address: serviceForm.address, director: serviceForm.director, capacity: serviceForm.capacity, serviceType: serviceForm.type }),
    }).catch(() => { });
    setService(serviceForm);
    setEditingService(false);
    flash("Informations du service enregistrées.");
  }

  async function saveEstab() {
    const services = servicesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const data: EstabProfile = { ...estabForm, services };
    if (data.mapUrl && !MAPS_URL_REGEX.test(data.mapUrl)) {
      flash("URL Google Maps invalide.", false);
      return;
    }
    const r = await fetch("/api/medical-service/establishment", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({
        description: data.description,
        services: data.services,
        accredited: data.accredited,
        emergencies: data.emergencies,
        beds: data.beds !== "" ? Number(data.beds) : undefined,
        doctors: data.doctors !== "" ? Number(data.doctors) : undefined,
        founded: data.founded !== "" ? Number(data.founded) : undefined,
        mapUrl: data.mapUrl,
      }),
    }).catch(() => null);
    if (r?.ok) {
      setEstab(data);
      setEditingEstab(false);
      flash("Profil de l'établissement mis à jour.");
    } else {
      flash("Erreur lors de la sauvegarde.", false);
    }
  }

  async function savePassword() {
    if (!pwForm.current || !pwForm.next) return;
    if (pwForm.next !== pwForm.confirm) { flash("Les mots de passe ne correspondent pas."); return; }
    const r = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    }).catch(() => null);
    if (r && r.ok) { setPwForm({ current: "", next: "", confirm: "" }); flash("Mot de passe mis à jour."); }
    else { flash("Erreur lors de la mise à jour du mot de passe.", false); }
  }

  function flash(text: string, ok = true) {
    setSavedMsg({ text, ok });
    setTimeout(() => setSavedMsg(null), 3000);
  }

  function onBannerFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  }

  async function uploadBanner() {
    if (!bannerFile) return;
    setUploadingBanner(true);
    const form = new FormData();
    form.append("banner", bannerFile);
    try {
      const r = await fetch("/api/medical-service/banner", {
        method: "POST",
        headers: { Authorization: `Bearer ${tok()}` },
        body: form,
      });
      const data = await r.json();
      if (r.ok && data.imageUrl) {
        setBannerUrl(data.imageUrl);
        setBannerPreview("");
        setBannerFile(null);
        if (bannerInputRef.current) bannerInputRef.current.value = "";
        flash("Bannière mise à jour avec succès.");
      } else {
        flash(data.message || "Erreur lors de l'envoi de la bannière.");
      }
    } catch {
      flash("Erreur réseau.");
    } finally {
      setUploadingBanner(false);
    }
  }


  // ── Tab config ───────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "Général", icon: <Building2 size={15} /> },
    { id: "services", label: "Services", icon: <Globe size={15} /> },
    { id: "location", label: "Localisation", icon: <MapPin size={15} /> },
    { id: "security", label: "Sécurité", icon: <Shield size={15} /> },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="bg-card border-b border-border px-6 py-5 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Paramètres</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gérez votre fiche — les modifications sont visibles par les patients sur votre page publique.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto">

          {/* Tab bar */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 sm:px-6">
            <nav className="flex -mb-px overflow-x-auto" aria-label="Onglets paramètres">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors shrink-0 ${activeTab === t.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Toast */}
          {savedMsg && (
            <div className={`mx-6 mt-5 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium border ${savedMsg.ok
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400"
                : "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400"
              }`}>
              {savedMsg.ok ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
              {savedMsg.text}
            </div>
          )}

          {/* ══ TAB: GÉNÉRAL ══ */}
          {activeTab === "general" && (
            <div className="p-6 max-w-2xl space-y-8">

              <section>
                <SectionHeader
                  icon={<ImagePlus size={18} className="text-primary" />}
                  title="Photo de bannière"
                  subtitle="Affichée en haut de votre fiche publique — recommandé 1400 × 400 px"
                />
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-muted border border-border">
                    {(bannerPreview || bannerUrl) ? (
                      <img src={bannerPreview || bannerUrl} alt="Bannière" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                        <ImagePlus size={36} className="opacity-25" />
                        <p className="text-sm">Aucune bannière définie</p>
                      </div>
                    )}
                    {bannerPreview && (
                      <span className="absolute top-3 left-3 text-xs bg-amber-400 text-amber-900 font-semibold px-2.5 py-1 rounded-full shadow">
                        Aperçu non enregistré
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input ref={bannerInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={onBannerFileChange} />
                      <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-dashed border-primary/40 rounded-xl text-sm text-primary hover:bg-primary/5 hover:border-primary/60 transition">
                        <Upload size={14} />
                        {bannerFile ? bannerFile.name : "Choisir une image"}
                      </div>
                    </label>
                    <button onClick={uploadBanner} disabled={!bannerFile || uploadingBanner}
                      className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0">
                      <Save size={14} />{uploadingBanner ? "Envoi…" : "Enregistrer"}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Formats : JPG, PNG, WEBP, AVIF — max 5 Mo</p>
                </div>
              </section>

              <div className="border-t border-border" />

              <section>
                <div className="flex items-start justify-between mb-6">
                  <SectionHeader icon={<Building2 size={18} className="text-primary" />} title="Informations du service" subtitle="Nom, téléphone, directeur et type" />
                  {!editingService && (
                    <button onClick={() => { setServiceForm(service); setEditingService(true); }} className="text-sm text-primary font-medium hover:underline shrink-0 mt-1">Modifier</button>
                  )}
                </div>
                {editingService ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {([
                        { label: "Nom du service", key: "name" as const, readonly: true },
                        { label: "Type de service", key: "type" as const },
                        { label: "Téléphone", key: "phone" as const, readonly: true },
                        { label: "Email", key: "email" as const, readonly: true },
                        { label: "Directeur / Responsable", key: "director" as const },
                        { label: "Capacité (patients simultanés)", key: "capacity" as const },
                      ] as { label: string; key: keyof ServiceInfo; readonly?: boolean }[]).map((f) => (
                        <div key={f.key}>
                          <label className="text-xs font-medium text-muted-foreground block mb-1.5">{f.label}</label>
                          <input type="text" value={serviceForm[f.key]} readOnly={f.readonly}
                            onChange={(e) => !f.readonly && setServiceForm((p) => ({ ...p, [f.key]: e.target.value }))}
                            className={`w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition ${f.readonly ? "opacity-50 cursor-not-allowed bg-muted" : ""}`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setEditingService(false)} className="px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition">Annuler</button>
                      <button onClick={saveService} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"><Save size={14} />Enregistrer</button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-2xl">
                    <ReadField label="Nom du service" value={service.name} />
                    <ReadField label="Type" value={service.type} />
                    <ReadField label="Téléphone" value={service.phone} />
                    <ReadField label="Email" value={service.email} />
                    <ReadField label="Directeur" value={service.director} />
                    <ReadField label="Capacité" value={service.capacity} />
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ══ TAB: SERVICES ══ */}
          {activeTab === "services" && (
            <div className="p-6 max-w-2xl space-y-8">

              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                <Globe size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80 leading-relaxed">
                  Ces informations apparaissent dans la section <strong>Services disponibles</strong> et la description de votre fiche publique.
                </p>
              </div>

              <section>
                <div className="flex items-start justify-between mb-6">
                  <SectionHeader icon={<Building2 size={18} className="text-primary" />} title="Profil de l&apos;établissement" subtitle="Description, services, statistiques et options" />
                  {!editingEstab && (
                    <button onClick={() => { setEstabForm(estab); setServicesText(estab.services.join("\n")); setEditingEstab(true); }}
                      className="text-sm text-primary font-medium hover:underline shrink-0 mt-1">Modifier</button>
                  )}
                </div>

                {editingEstab ? (
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Description publique</label>
                      <textarea rows={4} value={estabForm.description} onChange={(e) => setEstabForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Décrivez votre établissement, ses spécialités, son équipement…"
                        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Services proposés <span className="font-normal opacity-70">(un par ligne)</span></label>
                      <textarea rows={6} value={servicesText} onChange={(e) => setServicesText(e.target.value)}
                        placeholder="Cardiologie&#10;Neurologie&#10;Urgences&#10;Chirurgie"
                        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary transition font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {([
                        { label: "Nombre de lits", key: "beds" as const, placeholder: "ex: 120" },
                        { label: "Nombre de médecins", key: "doctors" as const, placeholder: "ex: 45" },
                        { label: "Année de fondation", key: "founded" as const, placeholder: "ex: 1998" },
                      ]).map((f) => (
                        <div key={f.key}>
                          <label className="text-xs font-medium text-muted-foreground block mb-1.5">{f.label}</label>
                          <input type="number" value={estabForm[f.key]} onChange={(e) => setEstabForm((p) => ({ ...p, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-center justify-between gap-4 flex-1 p-3.5 bg-secondary/30 rounded-xl border border-border">
                        <div><p className="text-sm font-medium text-foreground">Établissement accrédité</p><p className="text-xs text-muted-foreground">Accréditation nationale obtenue</p></div>
                        <Toggle checked={estabForm.accredited} onChange={() => setEstabForm((p) => ({ ...p, accredited: !p.accredited }))} />
                      </div>
                      <div className="flex items-center justify-between gap-4 flex-1 p-3.5 bg-secondary/30 rounded-xl border border-border">
                        <div><p className="text-sm font-medium text-foreground">Service d&apos;urgences</p><p className="text-xs text-muted-foreground">Urgences disponibles 24h/24</p></div>
                        <Toggle checked={estabForm.emergencies} onChange={() => setEstabForm((p) => ({ ...p, emergencies: !p.emergencies }))} />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setEditingEstab(false)} className="px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition">Annuler</button>
                      <button onClick={saveEstab} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"><Save size={14} />Enregistrer</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-2xl">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">Description</p>
                      {estab.description
                        ? <p className="text-sm text-foreground leading-relaxed">{estab.description}</p>
                        : <p className="text-sm text-muted-foreground italic">Aucune description définie.</p>}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { icon: <Building2 size={14} className="text-blue-500" />, label: "Lits", value: estab.beds },
                        { icon: <Phone size={14} className="text-green-500" />, label: "Médecins", value: estab.doctors },
                        { icon: <Clock size={14} className="text-amber-500" />, label: "Fondé en", value: estab.founded },
                      ].map((s) => (
                        <div key={s.label} className="p-4 bg-secondary/30 rounded-2xl flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center shrink-0 border border-border">{s.icon}</div>
                          <div><p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">{s.label}</p><p className="text-sm font-semibold text-foreground">{s.value || "—"}</p></div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-2xl">
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-2">Options</p>
                      <div className="flex flex-wrap gap-2">
                        {estab.accredited && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"><CheckCircle2 size={11} />Accrédité</span>}
                        {estab.emergencies && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"><AlertTriangle size={11} />Urgences 24h</span>}
                        {!estab.accredited && !estab.emergencies && <span className="text-sm text-muted-foreground italic">Aucune option activée</span>}
                      </div>
                    </div>
                    {estab.services.length > 0 && (
                      <div className="p-4 bg-secondary/30 rounded-2xl">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium mb-3">Services proposés ({estab.services.length})</p>
                        <div className="flex flex-wrap gap-2">{estab.services.map((s) => <span key={s} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/15">{s}</span>)}</div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ══ TAB: LOCALISATION ══ */}
          {activeTab === "location" && (
            <div className="p-6 max-w-2xl space-y-8">

              <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                <MapPin size={16} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80 leading-relaxed">
                  Ajoutez votre lien Google Maps pour afficher un bouton de localisation sur votre fiche publique.
                </p>
              </div>

              <section>
                <div className="flex items-start justify-between mb-6">
                  <SectionHeader icon={<MapPin size={18} className="text-primary" />} title="Adresse & Localisation" subtitle="Gouvernorat, ville et adresse complète" />
                  {!editingService && (
                    <button onClick={() => { setServiceForm(service); setEditingService(true); }} className="text-sm text-primary font-medium hover:underline shrink-0 mt-1">Modifier</button>
                  )}
                </div>
                {editingService ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Adresse complète</label>
                      <input type="text" value={serviceForm.address} onChange={(e) => setServiceForm((p) => ({ ...p, address: e.target.value }))} placeholder="Rue, numéro, bâtiment…" className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition" />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setEditingService(false)} className="px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition">Annuler</button>
                      <button onClick={saveService} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"><Save size={14} />Enregistrer</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/30 rounded-2xl">
                      <ReadField label="Adresse complète" value={service.address} span2 />
                    </div>
                  </div>
                )}
              </section>

              {/* Google Maps Link */}
              <section>
                <SectionHeader icon={<MapPin size={18} className="text-primary" />} title="Lien Google Maps" subtitle="Affiché comme bouton sur votre fiche publique" />
                <div className="space-y-3">
                  <input
                    type="text"
                    value={estabForm.mapUrl}
                    onChange={(e) => setEstabForm((p) => ({ ...p, mapUrl: e.target.value }))}
                    placeholder="https://maps.google.com/..."
                    className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                  />
                  {estabForm.mapUrl && !MAPS_URL_REGEX.test(estabForm.mapUrl) && (
                    <p className="text-xs text-red-500">URL Google Maps invalide (doit commencer par maps.google.com, goo.gl/maps…)</p>
                  )}
                  {estabForm.mapUrl && MAPS_URL_REGEX.test(estabForm.mapUrl) && (
                    <a href={estabForm.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <ExternalLink size={11} />Voir sur Maps
                    </a>
                  )}
                  <button
                    onClick={async () => {
                      if (estabForm.mapUrl && !MAPS_URL_REGEX.test(estabForm.mapUrl)) {
                        flash("URL Google Maps invalide.", false);
                        return;
                      }
                      const r = await fetch("/api/medical-service/establishment", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
                        body: JSON.stringify({ mapUrl: estabForm.mapUrl }),
                      }).catch(() => null);
                      if (r?.ok) {
                        setEstab((p) => ({ ...p, mapUrl: estabForm.mapUrl }));
                        flash("Lien Google Maps enregistré.");
                      } else {
                        flash("Erreur lors de la sauvegarde.", false);
                      }
                    }}
                    className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                  >
                    <Save size={14} />Enregistrer le lien
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* ══ TAB: SÉCURITÉ ══ */}
          {activeTab === "security" && (
            <div className="p-6 max-w-2xl space-y-8">

              <section>
                <SectionHeader icon={<Shield size={18} className="text-primary" />} title="Changer le mot de passe" subtitle="Utilisez un mot de passe fort d&apos;au moins 8 caractères" />
                <div className="space-y-4">
                  {([
                    { label: "Mot de passe actuel", key: "current" as const },
                    { label: "Nouveau mot de passe", key: "next" as const },
                    { label: "Confirmer le nouveau mot de passe", key: "confirm" as const },
                  ]).map((f) => (
                    <div key={f.key}>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">{f.label}</label>
                      <div className="relative">
                        <input type={showPw ? "text" : "password"} value={pwForm[f.key]} onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full border border-border rounded-xl px-3 py-2.5 pr-10 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition"
                        />
                        <button type="button" onClick={() => setShowPw((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button onClick={savePassword} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2">
                    <Save size={14} />Mettre à jour le mot de passe
                  </button>
                </div>
              </section>

              <div className="border-t border-border" />

              <section>
                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Shield size={16} className="text-primary" /></div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Double authentification (2FA)</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Renforce la sécurité de votre compte</p>
                    </div>
                  </div>
                  <Toggle checked={twoFA} onChange={() => setTwoFA((p) => !p)} />
                </div>
              </section>

              <div className="border-t border-border" />

              <section>
                <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-5 space-y-3">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                    <AlertTriangle size={16} /><p className="text-sm font-bold">Zone de danger</p>
                  </div>
                  <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                    La suppression définitive du compte effacera toutes vos données. Cette action est <strong>irréversible</strong>.
                  </p>
                  <button className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition">
                    Supprimer le compte
                  </button>
                </div>
              </section>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
