import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import {
  HeartPulse, Plus, Pencil, Trash2, RefreshCw, X, Check,
  MapPin, Phone, Mail, Clock, User, Search, LayoutGrid, List,
  Users, Building2, Sparkles, SlidersHorizontal, Camera, Upload,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";
import { useAdminTheme } from "@/hooks/useAdminTheme";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ParamedicalServiceProvider {
  id: string; _id?: string; name: string; specialization: string;
  avatar: string; governorate: string; delegation: string; address: string;
  phone: string; email: string; openingHours: string; description: string;
  createdAt?: string;
}
type FormState = Omit<ParamedicalServiceProvider, "id" | "_id" | "createdAt">;
const EMPTY_FORM: FormState = {
  name: "", specialization: "", avatar: "", governorate: "", delegation: "",
  address: "", phone: "", email: "", openingHours: "", description: "",
};
const SPECIALIZATIONS = [
  "Infirmier(ère)", "Kinésithérapeute", "Orthophoniste", "Ergothérapeute",
  "Aide-soignant(e)", "Sage-femme", "Psychomotricien(ne)", "Diététicien(ne)", "Autre",
];

// Per-spec colour tokens
const SPEC: Record<string, { accent: string; tw: string; badge: string; dot: string }> = {
  "Infirmier(ère)":      { accent: "#3b82f6", tw: "text-blue-500",    badge: "bg-blue-500/15 text-blue-600 border-blue-500/20 dark:text-blue-400",    dot: "bg-blue-500" },
  "Kinésithérapeute":    { accent: "#14b8a6", tw: "text-teal-500",    badge: "bg-teal-500/15 text-teal-600 border-teal-500/20 dark:text-teal-400",    dot: "bg-teal-500" },
  "Orthophoniste":       { accent: "#8b5cf6", tw: "text-violet-500",  badge: "bg-violet-500/15 text-violet-600 border-violet-500/20 dark:text-violet-400", dot: "bg-violet-500" },
  "Ergothérapeute":      { accent: "#f97316", tw: "text-orange-500",  badge: "bg-orange-500/15 text-orange-600 border-orange-500/20 dark:text-orange-400", dot: "bg-orange-500" },
  "Aide-soignant(e)":    { accent: "#f59e0b", tw: "text-amber-500",   badge: "bg-amber-500/15 text-amber-600 border-amber-500/20 dark:text-amber-400",   dot: "bg-amber-500" },
  "Sage-femme":          { accent: "#ec4899", tw: "text-pink-500",    badge: "bg-pink-500/15 text-pink-600 border-pink-500/20 dark:text-pink-400",    dot: "bg-pink-500" },
  "Psychomotricien(ne)": { accent: "#a855f7", tw: "text-purple-500",  badge: "bg-purple-500/15 text-purple-600 border-purple-500/20 dark:text-purple-400", dot: "bg-purple-500" },
  "Diététicien(ne)":     { accent: "#22c55e", tw: "text-emerald-500", badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 dark:text-emerald-400", dot: "bg-emerald-500" },
  "Autre":               { accent: "#94a3b8", tw: "text-slate-500",   badge: "bg-slate-500/15 text-slate-600 border-slate-500/20 dark:text-slate-400",  dot: "bg-slate-500" },
};
const sc = (s: string) => SPEC[s] ?? SPEC["Autre"];

function initials(n: string) {
  return n.split(" ").slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function ProviderAvatar({ p, size = "md" }: { p: ParamedicalServiceProvider; size?: "xs" | "sm" | "md" | "lg" }) {
  const dim = { xs: "w-7 h-7 text-[10px]", sm: "w-8 h-8 text-[11px]", md: "w-11 h-11 text-sm", lg: "w-14 h-14 text-base" }[size];
  const c = sc(p.specialization);
  if (p.avatar) {
    return <img src={p.avatar} alt={p.name} className={`${dim} rounded-xl object-cover shrink-0`} />;
  }
  return (
    <div
      className={`${dim} rounded-xl shrink-0 flex items-center justify-center font-bold`}
      style={{ background: `${c.accent}22`, color: c.accent }}
    >
      {initials(p.name) || <User size={size === "xs" ? 11 : 13} />}
    </div>
  );
}

// ── Spec badge ────────────────────────────────────────────────────────────────

function SpecBadge({ spec }: { spec: string }) {
  if (!spec) return null;
  const c = sc(spec);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${c.badge} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.dot}`} />
      {spec}
    </span>
  );
}

// ── Form Modal ────────────────────────────────────────────────────────────────

interface ModalProps {
  title: string; form: FormState; saving: boolean; error: string | null;
  photoUploading: boolean;
  onChange: (f: FormState) => void; onSave: () => void; onClose: () => void;
  onPhotoFile: (file: File) => void;
}

function ProviderFormModal({ title, form, saving, error, photoUploading, onChange, onSave, onClose, onPhotoFile }: ModalProps) {
  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      onChange({ ...form, [k]: e.target.value });

  const inputCls = "w-full px-3.5 py-2.5 bg-input border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/10 transition-all";
  const labelCls = "block text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl shadow-2xl max-h-[96dvh] sm:max-h-[88vh] flex flex-col overflow-hidden bg-card border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-muted/60" />
        </div>

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-pink-500/15">
              <HeartPulse size={15} className="text-pink-500" />
            </div>
            <h2 className="font-bold text-foreground text-[15px] tracking-tight">{title}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition">
            <X size={15} />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nom complet <span className="text-pink-400 normal-case">*</span></label>
              <input type="text" value={form.name} onChange={set("name")} placeholder="Ex: Fatma Ben Ali" className={inputCls} autoFocus />
            </div>
            <div>
              <label className={labelCls}>Spécialisation</label>
              <select value={form.specialization} onChange={set("specialization")} className={inputCls}>
                <option value="">Sélectionner…</option>
                {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Gouvernorat</label>
              <select value={form.governorate} onChange={(e) => onChange({ ...form, governorate: e.target.value, delegation: "" })} className={inputCls}>
                <option value="">Sélectionner…</option>
                {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Délégation</label>
              <select value={form.delegation} onChange={set("delegation")} className={inputCls} disabled={!form.governorate}>
                <option value="">Sélectionner…</option>
                {(form.governorate ? DELEGATIONS[form.governorate] ?? [] : []).map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Adresse</label>
            <input type="text" value={form.address} onChange={set("address")} placeholder="Rue, quartier, ville…" className={inputCls} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Téléphone</label>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+216 XX XXX XXX" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="email@exemple.com" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Horaires d'ouverture</label>
              <input type="text" value={form.openingHours} onChange={set("openingHours")} placeholder="Lun–Ven 08:00–18:00" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Photo de profil</label>
              <div className="flex items-center gap-2">
                {/* Preview */}
                {form.avatar ? (
                  <img src={form.avatar} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-border" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border">
                    <User size={14} className="text-muted-foreground/40" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {/* File upload button */}
                  <label className={`flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition border border-dashed border-border hover:border-pink-500/50 text-muted-foreground hover:text-foreground ${photoUploading ? "opacity-50 pointer-events-none" : ""}`}>
                    {photoUploading ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
                    {photoUploading ? "Envoi en cours…" : "Choisir un fichier"}
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp,.avif"
                      className="sr-only"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) onPhotoFile(f); e.target.value = ""; }}
                    />
                  </label>
                  {/* URL fallback */}
                  <input type="url" value={form.avatar} onChange={set("avatar")} placeholder="…ou coller une URL" className={inputCls + " mt-1.5 text-xs py-1.5"} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={set("description")} rows={3} placeholder="Présentation courte…" className={inputCls + " resize-none"} />
          </div>
          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20">
              <X size={13} className="shrink-0" /> {error}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted border border-border transition">
            Annuler
          </button>
          <button
            onClick={onSave}
            disabled={saving || !form.name.trim()}
            className="px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition disabled:opacity-40 disabled:cursor-not-allowed text-white"
            style={{ background: saving || !form.name.trim() ? "#6b7280" : "linear-gradient(135deg, #ec4899, #be185d)" }}
          >
            {saving ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Delete Dialog ─────────────────────────────────────────────────────────────

function DeleteDialog({ name, deleting, onConfirm, onClose }: { name: string; deleting: boolean; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
      <div
        className="relative w-full max-w-sm rounded-2xl p-6 shadow-2xl bg-card border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-red-500/10 border border-red-500/20">
          <Trash2 size={21} className="text-red-500" />
        </div>
        <div className="text-center mb-6">
          <h3 className="font-bold text-foreground text-base mb-1.5">Supprimer ce prestataire ?</h3>
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-semibold">{name}</span> sera définitivement supprimé.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:bg-muted transition">
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-500 text-white transition disabled:opacity-50"
          >
            {deleting ? <RefreshCw size={13} className="animate-spin" /> : <Trash2 size={13} />}
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AdminParamedicalServicesPage() {
  useAuth();
  const { isDark } = useAdminTheme();
  const getToken = () => localStorage.getItem("megacare_token") ?? "";
  const ah = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

  const [providers, setProviders] = useState<ParamedicalServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSpec, setFilterSpec] = useState("");
  const [view, setView] = useState<"table" | "cards">("table");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [photoUploading, setPhotoUploading] = useState<string | null>(null); // provider id
  // id used for the modal photo upload (new provider has no id yet, so we track separately)
  const [modalPhotoUploading, setModalPhotoUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (search.trim()) p.set("search", search.trim());
      if (filterSpec) p.set("specialization", filterSpec);
      const res = await fetch(`/api/admin/paramedical-service-providers?${p}`, { headers: ah() });
      if (res.ok) setProviders(await res.json());
    } finally { setLoading(false); }
  }, [search, filterSpec]);

  useEffect(() => { load(); }, [load]);
  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, filterSpec]);

  const openCreate = () => { setForm(EMPTY_FORM); setFormError(null); setModal("create"); };
  const openEdit = (p: ParamedicalServiceProvider) => {
    setForm({ name: p.name, specialization: p.specialization, avatar: p.avatar, governorate: p.governorate, delegation: p.delegation, address: p.address, phone: p.phone, email: p.email, openingHours: p.openingHours, description: p.description });
    setEditId(p.id); setFormError(null); setModal("edit");
  };

  /** Upload a photo for an existing provider by id. Returns the new avatar URL or null. */
  const uploadPhoto = async (providerId: string, file: File): Promise<string | null> => {
    const token = getToken();
    const fd = new FormData();
    fd.append("photo", file);
    try {
      const res = await fetch(`/api/admin/paramedical-service-providers/${providerId}/photo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) return null;
      const data = await res.json();
      return (data.avatar as string) ?? null;
    } catch { return null; }
  };

  /** Inline photo update from table/card action buttons. */
  const handleInlinePhoto = async (p: ParamedicalServiceProvider, file: File) => {
    setPhotoUploading(p.id);
    const newAvatar = await uploadPhoto(p.id, file);
    if (newAvatar) {
      setProviders((prev) => prev.map((x) => x.id === p.id ? { ...x, avatar: newAvatar } : x));
    }
    setPhotoUploading(null);
  };

  /**
   * Photo upload from inside the edit modal.
   * If editing an existing provider, upload immediately and reflect in form.
   * If creating a new one (no id yet), we can't upload without an id — so just preview via object URL.
   */
  const handleModalPhoto = async (file: File) => {
    if (modal === "edit" && editId) {
      setModalPhotoUploading(true);
      const newAvatar = await uploadPhoto(editId, file);
      if (newAvatar) {
        setForm((prev) => ({ ...prev, avatar: newAvatar }));
        setProviders((prev) => prev.map((x) => x.id === editId ? { ...x, avatar: newAvatar } : x));
      }
      setModalPhotoUploading(false);
    } else {
      // For new providers: show a local preview URL (final save won't use this file —
      // admin should upload after the provider is created, or paste a URL).
      setForm((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError("Le nom est obligatoire"); return; }
    setSaving(true); setFormError(null);
    try {
      const url = modal === "create" ? "/api/admin/paramedical-service-providers" : `/api/admin/paramedical-service-providers/${editId}`;
      const res = await fetch(url, { method: modal === "create" ? "POST" : "PATCH", headers: ah(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setFormError(data.message || "Erreur serveur"); return; }
      setModal(null); load();
    } catch { setFormError("Erreur réseau"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/paramedical-service-providers/${deleteTarget.id}`, { method: "DELETE", headers: ah() });
      setDeleteTarget(null); load();
    } finally { setDeleting(false); }
  };

  const total = providers.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = providers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const govCount = new Set(providers.map((p) => p.governorate).filter(Boolean)).size;
  const bySpec = SPECIALIZATIONS.map((s) => ({ s, n: providers.filter((p) => p.specialization === s).length })).filter((x) => x.n > 0);

  return (
    <div className={`flex min-h-screen bg-background${isDark ? " dark" : ""}`}>
      <AdminDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ══ HERO HEADER ═══════════════════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden shrink-0"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #0f0b1a 0%, #130d1f 40%, #0d0b18 100%)"
              : "linear-gradient(135deg, #fdf2f8 0%, #fff5fb 40%, #fef9ff 100%)",
          }}
        >
          {/* decorative blobs */}
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl opacity-20" style={{ background: "radial-gradient(circle, #ec4899, transparent)" }} />
          <div className="absolute top-0 left-1/3 w-40 h-40 rounded-full blur-3xl opacity-10" style={{ background: "radial-gradient(circle, #8b5cf6, transparent)" }} />

          <div className="relative px-6 pt-8 pb-6">
            {/* title row */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #ec4899, #9d174d)" }}>
                  <HeartPulse size={22} className="text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h1 className="text-xl font-black text-foreground tracking-tight">Paramédicaux & Soins</h1>
                    <Sparkles size={14} className="text-pink-400/60" />
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">/admin/paramedical-services</p>
                </div>
              </div>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white shrink-0 shadow-lg transition hover:scale-[1.02] active:scale-95"
                style={{ background: "linear-gradient(135deg, #ec4899, #be185d)" }}
              >
                <Plus size={15} strokeWidth={2.5} />
                <span className="hidden sm:inline">Nouveau prestataire</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total */}
              <div className="rounded-xl px-4 py-3 bg-background/40 border border-border/60 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <Users size={13} className="text-pink-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total</span>
                </div>
                <p className="text-2xl font-black text-foreground leading-none">{total}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">prestataires</p>
              </div>
              {/* Gouvernorats */}
              <div className="rounded-xl px-4 py-3 bg-background/40 border border-border/60 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 size={13} className="text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Régions</span>
                </div>
                <p className="text-2xl font-black text-foreground leading-none">{govCount}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">gouvernorats</p>
              </div>
              {/* Spécialisations */}
              <div className="rounded-xl px-4 py-3 bg-background/40 border border-border/60 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <SlidersHorizontal size={13} className="text-violet-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Spécialisations</span>
                </div>
                <p className="text-2xl font-black text-foreground leading-none">{bySpec.length}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">représentées</p>
              </div>
              {/* Top spec */}
              {bySpec.length > 0 && (() => {
                const top = bySpec.sort((a, b) => b.n - a.n)[0];
                const c = sc(top.s);
                return (
                  <div className="rounded-xl px-4 py-3 bg-background/40 border border-border/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">1er groupe</span>
                    </div>
                    <p className={`text-sm font-extrabold leading-tight ${c.tw}`}>{top.s}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">{top.n} prestataire{top.n !== 1 ? "s" : ""}</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* ══ TOOLBAR ═══════════════════════════════════════════════════════════ */}
        <div className="px-6 py-3 shrink-0 flex items-center gap-2 flex-wrap bg-card/80 border-b border-border">
          {/* search */}
          <div className="relative flex-1 min-w-[160px] max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 pointer-events-none" />
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, ville…"
              className="w-full pl-8 pr-7 py-2 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 bg-input border border-border focus:outline-none focus:border-pink-500/50 transition"
            />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition"><X size={12} /></button>}
          </div>

          {/* spec filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {bySpec.slice(0, 4).map(({ s }) => {
              const c = sc(s);
              const active = filterSpec === s;
              return (
                <button
                  key={s}
                  onClick={() => setFilterSpec(active ? "" : s)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition border ${
                    active ? `${c.badge} shadow-sm` : "text-muted-foreground/60 border-border hover:text-muted-foreground bg-transparent"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                  {s.split("(")[0].trim()}
                </button>
              );
            })}
            {bySpec.length > 4 && (
              <select
                value={filterSpec}
                onChange={(e) => setFilterSpec(e.target.value)}
                className="py-1 pl-2 pr-6 rounded-lg text-[11px] font-bold text-muted-foreground/60 bg-input border border-border focus:outline-none transition"
              >
                <option value="">Plus…</option>
                {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
            {filterSpec && (
              <button onClick={() => setFilterSpec("")} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold text-muted-foreground/60 hover:text-foreground transition border border-border">
                <X size={9} /> Tout
              </button>
            )}
          </div>

          {/* right cluster */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground/50 hidden sm:inline">{total} résultat{total !== 1 ? "s" : ""}{totalPages > 1 ? ` · p.${safePage}/${totalPages}` : ""}</span>
            <button
              onClick={load} disabled={loading}
              className="p-2 rounded-xl transition text-muted-foreground/60 hover:text-foreground disabled:opacity-30 bg-input border border-border"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
            {/* view toggle */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-xl bg-input border border-border">
              {(["table", "cards"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition ${
                    view === v ? "bg-muted/60 text-foreground shadow-sm" : "text-muted-foreground/60 hover:text-muted-foreground"
                  }`}
                >
                  {v === "table" ? <List size={12} /> : <LayoutGrid size={12} />}
                  {v === "table" ? "Tableau" : "Cartes"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ══ CONTENT ═══════════════════════════════════════════════════════════ */}
        <main className="flex-1 p-6 overflow-auto">

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-14 rounded-xl animate-pulse bg-muted/20" style={{ opacity: 1 - i * 0.12 }} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && providers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-40 text-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 bg-pink-500/10 border border-pink-500/15">
                <HeartPulse size={32} className="text-pink-500/40" />
              </div>
              <p className="font-black text-foreground text-lg mb-2">Aucun prestataire trouvé</p>
              <p className="text-sm text-muted-foreground mb-8 max-w-xs">
                {search || filterSpec ? "Aucun résultat pour ces critères." : "Commencez par ajouter le premier prestataire."}
              </p>
              <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition hover:opacity-90 shadow-lg" style={{ background: "linear-gradient(135deg,#ec4899,#be185d)" }}>
                <Plus size={15} /> Nouveau prestataire
              </button>
            </div>
          )}

          {/* ── TABLE ─────────────────────────────────────────────────────────── */}
          {!loading && providers.length > 0 && view === "table" && (
            <div className="rounded-2xl overflow-hidden border border-border bg-card">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 w-[260px]">Prestataire</th>
                      <th className="text-left px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Spécialisation</th>
                      <th className="text-left px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hidden md:table-cell">Localisation</th>
                      <th className="text-left px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hidden lg:table-cell">Contact</th>
                      <th className="text-left px-4 py-3.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hidden xl:table-cell">Horaires</th>
                      <th className="px-4 py-3.5 w-[90px]" />
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((p) => {
                      const c = sc(p.specialization);
                      return (
                        <tr
                          key={p.id}
                          className="group transition-colors hover:bg-muted/30 border-b border-border/40"
                        >
                          {/* name + avatar */}
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {/* left spec accent */}
                              <div className="w-0.5 h-8 rounded-full shrink-0" style={{ background: c.accent, opacity: 0.6 }} />
                              <ProviderAvatar p={p} size="sm" />
                              <div className="min-w-0">
                                <p className="font-bold text-foreground text-sm truncate max-w-[160px]">{p.name}</p>
                                {p.address && <p className="text-[11px] text-muted-foreground/60 truncate max-w-[160px] mt-0.5">{p.address}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3"><SpecBadge spec={p.specialization} /></td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            {p.governorate || p.delegation ? (
                              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MapPin size={11} className="shrink-0" />
                                <span className="truncate max-w-[130px]">{[p.delegation, p.governorate].filter(Boolean).join(", ")}</span>
                              </span>
                            ) : <span className="text-muted-foreground/40 text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="space-y-0.5">
                              {p.phone && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone size={10} />{p.phone}</div>}
                              {p.email && <div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail size={10} /><span className="truncate max-w-[150px]">{p.email}</span></div>}
                              {!p.phone && !p.email && <span className="text-muted-foreground/40 text-xs">—</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden xl:table-cell">
                            {p.openingHours
                              ? <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock size={10} />{p.openingHours}</span>
                              : <span className="text-muted-foreground/40 text-xs">—</span>}
                          </td>
                          {/* actions */}
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* Photo upload */}
                              <label
                                className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-pink-500 border border-border transition cursor-pointer"
                                title="Changer la photo"
                              >
                                {photoUploading === p.id
                                  ? <RefreshCw size={12} className="animate-spin" />
                                  : <Camera size={12} />}
                                <input
                                  type="file"
                                  accept=".jpg,.jpeg,.png,.webp,.avif"
                                  className="sr-only"
                                  disabled={photoUploading === p.id}
                                  onChange={(e) => { const f = e.target.files?.[0]; if (f) handleInlinePhoto(p, f); e.target.value = ""; }}
                                />
                              </label>
                              <button
                                onClick={() => openEdit(p)}
                                className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-foreground border border-border transition"
                                title="Modifier"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                                className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-red-500 border border-border transition"
                                title="Supprimer"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* table footer */}
              <div className="px-5 py-2.5 flex items-center justify-between border-t border-border/50 bg-muted/10">
                <p className="text-xs text-muted-foreground/60">
                  {total > 0 ? `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, total)} sur ${total}` : "0"} prestataire{total !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  {bySpec.slice(0, 3).map(({ s, n }) => (
                    <span key={s} className={`text-[10px] font-bold ${sc(s).tw} opacity-60`}>{s.split("(")[0].trim()} ({n})</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── CARDS ─────────────────────────────────────────────────────────── */}
          {!loading && providers.length > 0 && view === "cards" && (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {paginated.map((p) => {
                const c = sc(p.specialization);
                return (
                  <article
                    key={p.id}
                    className="group relative rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl bg-card border border-border"
                  >
                    {/* top accent */}
                    <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${c.accent}, transparent)` }} />

                    <div className="p-4 flex items-start gap-3 flex-1">
                      <ProviderAvatar p={p} size="md" />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground text-sm leading-snug truncate mb-1.5">{p.name}</p>
                        <SpecBadge spec={p.specialization} />
                        <div className="mt-3 space-y-1">
                          {(p.governorate || p.delegation) && (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <MapPin size={10} className="shrink-0" />
                              <span className="truncate">{[p.delegation, p.governorate].filter(Boolean).join(", ")}</span>
                            </div>
                          )}
                          {p.phone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <Phone size={10} className="shrink-0" />
                              <span>{p.phone}</span>
                            </div>
                          )}
                          {p.openingHours && (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <Clock size={10} className="shrink-0" />
                              <span className="truncate">{p.openingHours}</span>
                            </div>
                          )}
                        </div>
                        {p.description && (
                          <p className="mt-2.5 text-[11px] text-muted-foreground/70 line-clamp-2 leading-relaxed pt-2 border-t border-border/50">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* card footer */}
                    <div className="px-4 pb-3 flex items-center gap-2 border-t border-border/50">
                      {/* Photo upload */}
                      <label
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-muted-foreground/60 hover:text-pink-500 transition border border-border cursor-pointer"
                        title="Changer la photo"
                      >
                        {photoUploading === p.id
                          ? <RefreshCw size={11} className="animate-spin" />
                          : <Camera size={11} />}
                        <input
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,.avif"
                          className="sr-only"
                          disabled={photoUploading === p.id}
                          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleInlinePhoto(p, f); e.target.value = ""; }}
                        />
                      </label>
                      <button
                        onClick={() => openEdit(p)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold text-muted-foreground hover:text-foreground transition border border-border hover:bg-muted/30"
                      >
                        <Pencil size={11} /> Modifier
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: p.id, name: p.name })}
                        className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-muted-foreground/60 hover:text-red-500 transition border border-border"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          {/* ── PAGINATION ────────────────────────────────────────────────────── */}
          {!loading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-5 mt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, total)} sur {total} prestataire{total !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-40"
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce<(number | "…")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) acc.push("…");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "…" ? (
                      <span key={`dots-${i}`} className="px-2 text-muted-foreground text-xs">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                          safePage === p
                            ? "bg-pink-500 text-white"
                            : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition disabled:opacity-40"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}        </main>
      </div>

      {/* Modals */}
      {modal && (
        <ProviderFormModal
          title={modal === "create" ? "Nouveau prestataire" : "Modifier le prestataire"}
          form={form} saving={saving} error={formError}
          photoUploading={modalPhotoUploading}
          onChange={setForm} onSave={handleSave}
          onPhotoFile={handleModalPhoto}
          onClose={() => { setModal(null); setFormError(null); }}
        />
      )}
      {deleteTarget && (
        <DeleteDialog
          name={deleteTarget.name} deleting={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
