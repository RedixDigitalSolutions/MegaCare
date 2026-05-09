import { useState, useEffect, useRef } from "react";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import {
  FlaskConical,
  Shield,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  ImagePlus,
  Upload,
  Globe,
  MapPin,
  Phone,
  Clock,
  CheckCircle2,
  Building2,
  Mail,
  Tag,
  Lock,
  ExternalLink,
  FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface LabBasic {
  name: string;
  address: string;
  phone: string;
  email: string;
  type: string;
  governorate: string;
  city: string;
  mapUrl: string;
}

interface LabProfile {
  description: string;
  resultDelay: string;
  exams: string[];
  allExamTypes: string[];
  cnam: boolean;
  open24h: boolean;
}

type Tab = "general" | "exams" | "location" | "security";

const tok = () => localStorage.getItem("megacare_token") ?? "";

const MAPS_URL_REGEX = /^https?:\/\/(maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|www\.google\.[a-z.]+\/maps)/i;

const emptyBasic: LabBasic = {
  name: "", address: "", phone: "", email: "", type: "", governorate: "", city: "", mapUrl: "",
};
const emptyProfile: LabProfile = {
  description: "", resultDelay: "24h", exams: [], allExamTypes: [], cnam: false, open24h: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 shrink-0 ${checked ? "bg-primary" : "bg-muted-foreground/25"
        }`}
    >
      <span className={`inline-block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 mt-0.5 ${checked ? "translate-x-5 ml-0.5" : "translate-x-0.5"}`} />
    </button>
  );
}

function CardSection({
  children,
  title,
  subtitle,
  icon,
  action,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="flex items-start justify-between px-5 py-4 border-b border-border bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm leading-tight">{title}</p>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function FieldRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 px-5 py-4">
      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-1">{label}</p>
        <p className="text-sm text-foreground font-medium truncate">
          {value || <span className="text-muted-foreground/50 font-normal italic">—</span>}
        </p>
      </div>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  readOnly = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${readOnly
          ? "border-border/40 bg-muted/40 text-muted-foreground cursor-not-allowed"
          : "border-border hover:border-primary/40"
          }`}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LabSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [basic, setBasic] = useState<LabBasic>(emptyBasic);
  const [editingBasic, setEditingBasic] = useState(false);
  const [basicForm, setBasicForm] = useState<LabBasic>(emptyBasic);

  const [profile, setProfile] = useState<LabProfile>(emptyProfile);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<LabProfile>(emptyProfile);
  const [examsText, setExamsText] = useState("");
  const [categoriesText, setCategoriesText] = useState("");

  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [savedMsg, setSavedMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/lab/settings", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setBasic({
          name: d.name || "",
          address: d.address || "",
          phone: d.phone || "",
          email: d.email || "",
          type: d.type || "",
          governorate: d.governorate || "",
          city: d.city || "",
          mapUrl: d.mapUrl || "",
        });
        const p: LabProfile = {
          description: d.description || "",
          resultDelay: d.resultDelay || "24h",
          exams: d.exams || [],
          allExamTypes: d.allExamTypes || [],
          cnam: d.cnam ?? false,
          open24h: d.open24h ?? false,
        };
        setProfile(p);
        if (d.imageUrl) setBannerUrl(d.imageUrl);
      })
      .catch(() => { });
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  function flash(text: string, ok = true) {
    setSavedMsg({ text, ok });
    setTimeout(() => setSavedMsg(null), 3500);
  }

  async function saveBasic() {
    if (basicForm.mapUrl && !MAPS_URL_REGEX.test(basicForm.mapUrl)) {
      flash("URL Google Maps invalide.", false);
      return;
    }
    const r = await fetch("/api/lab/center", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({
        name: basicForm.name,
        address: basicForm.address,
        phone: basicForm.phone,
        governorate: basicForm.governorate,
        city: basicForm.city,
        mapUrl: basicForm.mapUrl,
      }),
    }).catch(() => null);
    if (r?.ok) {
      setBasic(basicForm);
      setEditingBasic(false);
      flash("Informations du centre enregistrées.");
    } else {
      flash("Erreur lors de la sauvegarde.", false);
    }
  }

  async function saveProfile() {
    const exams = examsText.split("\n").map((s) => s.trim()).filter(Boolean);
    const allExamTypes = categoriesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const data: LabProfile = { ...profileForm, exams, allExamTypes };
    const r = await fetch("/api/lab/center", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({
        description: data.description,
        resultDelay: data.resultDelay,
        exams: data.exams,
        allExamTypes: data.allExamTypes,
        cnam: data.cnam,
        open24h: data.open24h,
      }),
    }).catch(() => null);
    if (r?.ok) {
      setProfile(data);
      setEditingProfile(false);
      flash("Examens et profil mis à jour.");
    } else {
      flash("Erreur lors de la sauvegarde.", false);
    }
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
      const r = await fetch("/api/lab/banner", {
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
        flash(data.message || "Erreur lors de l'envoi de la bannière.", false);
      }
    } catch {
      flash("Erreur réseau.", false);
    } finally {
      setUploadingBanner(false);
    }
  }

  async function savePassword() {
    if (!pwForm.current || !pwForm.next) return;
    if (pwForm.next !== pwForm.confirm) {
      flash("Les mots de passe ne correspondent pas.", false);
      return;
    }
    const r = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    }).catch(() => null);
    if (r?.ok) {
      setPwForm({ current: "", next: "", confirm: "" });
      flash("Mot de passe mis à jour.");
    } else {
      flash("Erreur lors de la mise à jour du mot de passe.", false);
    }
  }




  // ── Tab config ───────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "Général", icon: <FlaskConical size={14} /> },
    { id: "exams", label: "Examens & Profil", icon: <FileText size={14} /> },
    { id: "location", label: "Localisation", icon: <MapPin size={14} /> },
    { id: "security", label: "Sécurité", icon: <Shield size={14} /> },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background">
      <LabDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── Page header ── */}
        <header className="bg-card border-b border-border shrink-0">
          <div className="px-6 pt-5 pb-0 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FlaskConical size={20} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Paramètres du laboratoire</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Gérez votre fiche — les modifications sont visibles par les patients sur votre page publique.
              </p>
            </div>
          </div>
          {/* Tabs anchored to header bottom */}
          <nav className="flex px-6 mt-4 -mb-px overflow-x-auto" aria-label="Onglets paramètres">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all shrink-0 ${activeTab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="flex-1 overflow-y-auto">

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
            <div className="p-6 max-w-2xl space-y-5">

              {/* Banner card */}
              <CardSection
                title="Photo de bannière"
                subtitle="Affichée en haut de votre fiche publique — recommandé 1400 × 400 px"
                icon={<ImagePlus size={16} className="text-primary" />}
              >
                <div className="p-5 space-y-4">
                  <div className="relative w-full h-44 rounded-xl overflow-hidden bg-muted border border-border/60">
                    {(bannerPreview || bannerUrl) ? (
                      <img src={bannerPreview || bannerUrl} alt="Bannière" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                        <ImagePlus size={32} className="opacity-20" />
                        <p className="text-sm">Aucune bannière définie</p>
                      </div>
                    )}
                    {bannerPreview && (
                      <span className="absolute top-3 left-3 text-xs bg-amber-400 text-amber-900 font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        Aperçu non enregistré
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <label className="flex-1 cursor-pointer">
                      <input ref={bannerInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={onBannerFileChange} />
                      <div className="flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 border-dashed border-primary/30 rounded-xl text-sm text-primary hover:bg-primary/5 hover:border-primary/50 transition font-medium">
                        <Upload size={14} />
                        {bannerFile ? bannerFile.name : "Choisir une image"}
                      </div>
                    </label>
                    <button
                      onClick={uploadBanner}
                      disabled={!bannerFile || uploadingBanner}
                      className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
                    >
                      <Save size={14} />{uploadingBanner ? "Envoi…" : "Enregistrer"}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Formats : JPG, PNG, WEBP, AVIF — max 5 Mo</p>
                </div>
              </CardSection>

              {/* Center info card */}
              <CardSection
                title="Informations du centre"
                subtitle="Nom, téléphone — email et type sont en lecture seule"
                icon={<Building2 size={16} className="text-primary" />}
                action={
                  !editingBasic ? (
                    <button
                      onClick={() => { setBasicForm(basic); setEditingBasic(true); }}
                      className="text-xs font-semibold text-primary hover:text-primary/80 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition"
                    >
                      Modifier
                    </button>
                  ) : undefined
                }
              >
                {editingBasic ? (
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput label="Nom du centre" value={basicForm.name} onChange={(v) => setBasicForm((p) => ({ ...p, name: v }))} />
                      <FormInput label="Type" value={basicForm.type} readOnly />
                      <FormInput label="Téléphone" value={basicForm.phone} onChange={(v) => setBasicForm((p) => ({ ...p, phone: v }))} />
                      <FormInput label="Email" value={basicForm.email} readOnly />
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setEditingBasic(false)} className="px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition">Annuler</button>
                      <button onClick={saveBasic} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2">
                        <Save size={14} />Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <FieldRow icon={<Building2 size={13} className="text-muted-foreground" />} label="Nom du centre" value={basic.name} />
                      <FieldRow icon={<Tag size={13} className="text-muted-foreground" />} label="Type" value={basic.type} />
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <FieldRow icon={<Phone size={13} className="text-muted-foreground" />} label="Téléphone" value={basic.phone} />
                      <FieldRow icon={<Mail size={13} className="text-muted-foreground" />} label="Email" value={basic.email} />
                    </div>
                  </div>
                )}
              </CardSection>

            </div>
          )}

          {/* ══ TAB: EXAMENS & PROFIL ══ */}
          {activeTab === "exams" && (
            <div className="p-6 max-w-2xl space-y-5">

              <div className="flex items-start gap-3 px-4 py-3.5 bg-primary/5 border border-primary/15 rounded-xl">
                <Globe size={14} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80 leading-relaxed">
                  Ces informations apparaissent dans la section <strong>Examens proposés</strong> et la description de votre fiche publique.
                </p>
              </div>

              <CardSection
                title="Examens & Profil public"
                subtitle="Description, délai de résultats, examens et options"
                icon={<FlaskConical size={16} className="text-primary" />}
                action={
                  !editingProfile ? (
                    <button
                      onClick={() => { setProfileForm(profile); setExamsText(profile.exams.join("\n")); setCategoriesText(profile.allExamTypes.join("\n")); setEditingProfile(true); }}
                      className="text-xs font-semibold text-primary hover:text-primary/80 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition"
                    >
                      Modifier
                    </button>
                  ) : undefined
                }
              >
                {editingProfile ? (
                  <div className="p-5 space-y-5">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">Description publique</label>
                      <textarea
                        rows={4}
                        value={profileForm.description}
                        onChange={(e) => setProfileForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="Décrivez votre centre, ses spécialisations, son équipement…"
                        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition hover:border-primary/40"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                        <Clock size={11} className="inline mr-1 opacity-70" />Délai de remise des résultats
                      </label>
                      <input
                        type="text"
                        value={profileForm.resultDelay}
                        onChange={(e) => setProfileForm((p) => ({ ...p, resultDelay: e.target.value }))}
                        placeholder="ex: 24h, 48h, 3 jours"
                        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition hover:border-primary/40"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                          Examens proposés <span className="font-normal opacity-60">(un par ligne)</span>
                        </label>
                        <textarea
                          rows={7}
                          value={examsText}
                          onChange={(e) => setExamsText(e.target.value)}
                          placeholder={"NFS\nGlycémie\nRadiographie thoracique"}
                          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-mono hover:border-primary/40"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                          Catégories d&apos;examens <span className="font-normal opacity-60">(un par ligne)</span>
                        </label>
                        <textarea
                          rows={7}
                          value={categoriesText}
                          onChange={(e) => setCategoriesText(e.target.value)}
                          placeholder={"Biologie\nRadiologie\nÉchographie"}
                          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition font-mono hover:border-primary/40"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                        <div>
                          <p className="text-sm font-medium text-foreground">Conventionné CNAM</p>
                          <p className="text-xs text-muted-foreground">Remboursement CNAM accepté</p>
                        </div>
                        <Toggle checked={profileForm.cnam} onChange={() => setProfileForm((p) => ({ ...p, cnam: !p.cnam }))} />
                      </div>
                      <div className="flex items-center justify-between gap-4 p-4 bg-muted/30 rounded-xl border border-border">
                        <div>
                          <p className="text-sm font-medium text-foreground">Ouvert 24h/24</p>
                          <p className="text-xs text-muted-foreground">Centre accessible en continu</p>
                        </div>
                        <Toggle checked={profileForm.open24h} onChange={() => setProfileForm((p) => ({ ...p, open24h: !p.open24h }))} />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setEditingProfile(false)} className="px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition">Annuler</button>
                      <button onClick={saveProfile} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2">
                        <Save size={14} />Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-border">

                    {/* Description */}
                    <div className="px-5 py-4">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2">Description</p>
                      {profile.description
                        ? <p className="text-sm text-foreground leading-relaxed">{profile.description}</p>
                        : <p className="text-sm text-muted-foreground italic">Aucune description définie.</p>}
                    </div>

                    {/* Delay + Options */}
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <div className="px-5 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                          <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Délai résultats</p>
                          <p className="text-base font-bold text-foreground mt-0.5">{profile.resultDelay || "—"}</p>
                        </div>
                      </div>
                      <div className="px-5 py-4">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2.5">Options actives</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.cnam && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                              <CheckCircle2 size={11} />CNAM
                            </span>
                          )}
                          {profile.open24h && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                              <Clock size={11} />24h/24
                            </span>
                          )}
                          {!profile.cnam && !profile.open24h && (
                            <span className="text-sm text-muted-foreground italic">Aucune</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Exams */}
                    <div className="px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Examens proposés</p>
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{profile.exams.length}</span>
                      </div>
                      {profile.exams.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.exams.map((ex) => (
                            <span key={ex} className="px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/15">
                              {ex}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Aucun examen défini</p>
                      )}
                    </div>

                    {/* Categories */}
                    {profile.allExamTypes.length > 0 && (
                      <div className="px-5 py-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Catégories</p>
                          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{profile.allExamTypes.length}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {profile.allExamTypes.map((c) => (
                            <span key={c} className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary border border-border text-foreground/70">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardSection>

            </div>
          )}

          {/* ══ TAB: LOCALISATION ══ */}
          {activeTab === "location" && (
            <div className="p-6 max-w-2xl space-y-5">

              <div className="flex items-start gap-3 px-4 py-3.5 bg-primary/5 border border-primary/15 rounded-xl">
                <MapPin size={14} className="text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary/80 leading-relaxed">
                  Ajoutez votre lien Google Maps pour afficher un bouton de localisation sur votre fiche publique.
                </p>
              </div>

              <CardSection
                title="Adresse & Localisation"
                subtitle="Gouvernorat, ville et adresse complète"
                icon={<MapPin size={16} className="text-primary" />}
                action={
                  !editingBasic ? (
                    <button
                      onClick={() => { setBasicForm(basic); setEditingBasic(true); }}
                      className="text-xs font-semibold text-primary hover:text-primary/80 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition"
                    >
                      Modifier
                    </button>
                  ) : undefined
                }
              >
                {editingBasic ? (
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormInput label="Gouvernorat" value={basicForm.governorate} onChange={(v) => setBasicForm((p) => ({ ...p, governorate: v }))} />
                      <FormInput label="Ville / Délégation" value={basicForm.city} onChange={(v) => setBasicForm((p) => ({ ...p, city: v }))} />
                      <div className="sm:col-span-2">
                        <FormInput label="Adresse complète" value={basicForm.address} onChange={(v) => setBasicForm((p) => ({ ...p, address: v }))} placeholder="Rue, numéro, bâtiment…" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Lien Google Maps <span className="font-normal opacity-60">(optionnel)</span></label>
                        <input
                          type="text"
                          value={basicForm.mapUrl}
                          onChange={(e) => setBasicForm((p) => ({ ...p, mapUrl: e.target.value }))}
                          placeholder="https://maps.google.com/..."
                          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition hover:border-primary/40"
                        />
                        {basicForm.mapUrl && !MAPS_URL_REGEX.test(basicForm.mapUrl) && (
                          <p className="text-xs text-red-500 mt-1.5">URL Google Maps invalide (doit commencer par maps.google.com, goo.gl/maps…)</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-1">
                      <button onClick={() => setEditingBasic(false)} className="px-4 py-2 border border-border rounded-xl text-sm hover:bg-muted transition">Annuler</button>
                      <button onClick={saveBasic} className="px-5 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2">
                        <Save size={14} />Enregistrer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    <div className="grid grid-cols-2 divide-x divide-border">
                      <FieldRow icon={<MapPin size={13} className="text-muted-foreground" />} label="Gouvernorat" value={basic.governorate} />
                      <FieldRow icon={<MapPin size={13} className="text-muted-foreground" />} label="Ville" value={basic.city} />
                    </div>
                    <FieldRow icon={<MapPin size={13} className="text-muted-foreground" />} label="Adresse complète" value={basic.address} />
                    {basic.mapUrl && (
                      <div className="px-5 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                            <MapPin size={13} className="text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Lien Maps</p>
                            <p className="text-xs text-foreground truncate max-w-xs">{basic.mapUrl}</p>
                          </div>
                        </div>
                        <a
                          href={basic.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-semibold transition shrink-0"
                        >
                          <ExternalLink size={11} />Voir sur Maps
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </CardSection>

              <CardSection
                title="Horaires d'ouverture"
                subtitle="Gérez vos créneaux depuis l'onglet Calendrier"
                icon={<Clock size={16} className="text-primary" />}
              >
                <div className="px-5 py-4 flex items-start gap-3 text-muted-foreground">
                  <Clock size={14} className="shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed">
                    Les créneaux sont gérés via votre agenda. L&apos;option{" "}
                    <strong className="text-foreground">Ouvert 24h/24</strong> est configurable dans l&apos;onglet{" "}
                    <strong className="text-foreground">Examens &amp; Profil</strong>.
                  </p>
                </div>
              </CardSection>

            </div>
          )}

          {/* ══ TAB: SÉCURITÉ ══ */}
          {activeTab === "security" && (
            <div className="p-6 max-w-2xl space-y-5">

              <CardSection
                title="Changer le mot de passe"
                subtitle="Utilisez un mot de passe fort d'au moins 8 caractères"
                icon={<Lock size={16} className="text-primary" />}
              >
                <div className="p-5 space-y-4">
                  {([
                    { label: "Mot de passe actuel", key: "current" as const },
                    { label: "Nouveau mot de passe", key: "next" as const },
                    { label: "Confirmer le nouveau mot de passe", key: "confirm" as const },
                  ]).map((f) => (
                    <div key={f.key}>
                      <label className="text-xs font-medium text-muted-foreground block mb-1.5">{f.label}</label>
                      <div className="relative">
                        <input
                          type={showPw ? "text" : "password"}
                          value={pwForm[f.key]}
                          onChange={(e) => setPwForm((p) => ({ ...p, [f.key]: e.target.value }))}
                          className="w-full border border-border rounded-xl px-3 py-2.5 pr-10 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition hover:border-primary/40"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                        >
                          {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={savePassword}
                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition flex items-center gap-2"
                  >
                    <Save size={14} />Mettre à jour le mot de passe
                  </button>
                </div>
              </CardSection>

              <CardSection
                title="Double authentification (2FA)"
                subtitle="Renforce la sécurité de votre compte"
                icon={<Shield size={16} className="text-primary" />}
              >
                <div className="px-5 py-4 flex items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-medium text-foreground">Activer le 2FA</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Protège votre compte avec une deuxième vérification à chaque connexion.
                    </p>
                  </div>
                  <Toggle checked={twoFA} onChange={() => setTwoFA((p) => !p)} />
                </div>
              </CardSection>

              <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 overflow-hidden">
                <div className="px-5 py-4 border-b border-red-200/60 dark:border-red-900/40 flex items-center gap-2 bg-red-50 dark:bg-red-900/20">
                  <AlertTriangle size={14} className="text-red-600 dark:text-red-400" />
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">Zone de danger</p>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-xs text-red-600/80 dark:text-red-400/80 leading-relaxed">
                    La suppression définitive du compte effacera toutes vos données et rendez-vous. Cette action est <strong>irréversible</strong>.
                  </p>
                  <button className="px-4 py-2 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition">
                    Supprimer le compte
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
