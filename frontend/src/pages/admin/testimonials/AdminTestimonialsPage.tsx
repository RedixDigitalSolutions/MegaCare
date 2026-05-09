import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { AdminDashboardSidebar } from "@/components/AdminDashboardSidebar";
import { useAdminTheme } from "@/hooks/useAdminTheme";
import {
  Quote,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  Star,
  Eye,
  EyeOff,
  X,
  Check,
  MapPin,
  User,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Testimonial {
  id: string;
  _id?: string;
  name: string;
  role: string;
  text: string;
  rating: number;
  location: string;
  avatar: string;
  imageUrl: string;
  visible: boolean;
  order: number;
  createdAt?: string;
}

type FormState = Omit<Testimonial, "id" | "_id" | "createdAt">;

const EMPTY_FORM: FormState = {
  name: "",
  role: "",
  text: "",
  rating: 5,
  location: "",
  avatar: "",
  imageUrl: "",
  visible: true,
  order: 0,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Star Rating Input ─────────────────────────────────────────────────────────

function StarInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="p-0.5 focus:outline-none"
        >
          <Star
            size={22}
            className={
              n <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-border"
            }
          />
        </button>
      ))}
    </div>
  );
}

// ── Testimonial Modal ─────────────────────────────────────────────────────────

function TestimonialModal({
  initial,
  onSave,
  onClose,
  saving,
}: {
  initial: FormState;
  onSave: (data: FormState) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<FormState>(initial);

  const set = (field: keyof FormState, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.role.trim() || !form.text.trim()) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl border border-border w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Quote size={18} className="text-primary" />
            {initial.name ? "Modifier le témoignage" : "Nouveau témoignage"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Nom *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="ex: Fatima Ben Ali"
                maxLength={100}
                required
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Rôle *
              </label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="ex: Patiente, Cardiologue..."
                maxLength={100}
                required
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Témoignage *
            </label>
            <textarea
              value={form.text}
              onChange={(e) => set("text", e.target.value)}
              placeholder="Le texte du témoignage..."
              maxLength={1000}
              required
              rows={4}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {form.text.length}/1000
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Localisation
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="ex: Tunis"
                maxLength={100}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Initiales avatar
              </label>
              <input
                type="text"
                value={form.avatar}
                onChange={(e) => set("avatar", e.target.value)}
                placeholder="ex: F (auto si vide)"
                maxLength={3}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
              Photo (URL)
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => set("imageUrl", e.target.value)}
              placeholder="https://exemple.com/photo.jpg"
              maxLength={500}
              className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {form.imageUrl && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={form.imageUrl}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-border"
                  onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
                />
                <span className="text-xs text-muted-foreground">Prévisualisation</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Note
              </label>
              <StarInput
                value={form.rating}
                onChange={(v) => set("rating", v)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
                Ordre d'affichage
              </label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => set("order", Number(e.target.value))}
                min={0}
                className="w-full px-3 py-2 border border-border rounded-xl bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("visible", !form.visible)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                form.visible ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                  form.visible ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm text-foreground">
              {form.visible ? "Visible sur le site" : "Masqué"}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-secondary transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || !form.name.trim() || !form.role.trim() || !form.text.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saving ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminTestimonialsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useAdminTheme();

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Testimonial | null>(null);

  useEffect(() => {
    if (user?.role !== "admin") navigate("/login");
  }, [user, navigate]);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/admin/testimonials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setTestimonials(data);
    } catch {
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const handleSave = async (form: FormState) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("megacare_token");
      const isEdit = !!editTarget;
      const url = isEdit
        ? `/api/admin/testimonials/${editTarget!.id}`
        : "/api/admin/testimonials";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      await fetchTestimonials();
      setModalOpen(false);
      setEditTarget(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    setDeletingId(id);
    try {
      const token = localStorage.getItem("megacare_token");
      await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (t: Testimonial) => {
    setTogglingId(t.id);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ visible: !t.visible }),
      });
      if (!res.ok) throw new Error();
      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === t.id ? { ...item, visible: !t.visible } : item
        )
      );
    } finally {
      setTogglingId(null);
    }
  };

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditTarget(t);
    setModalOpen(true);
  };

  const visible = testimonials.filter((t) => t.visible).length;
  const hidden = testimonials.filter((t) => !t.visible).length;

  return (
    <div className={`flex h-screen bg-background overflow-hidden${isDark ? " dark" : ""}`}>
      <AdminDashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Quote size={20} className="text-primary" />
                </div>
                Témoignages
              </h1>
              <p className="text-muted-foreground mt-1 text-sm">
                {testimonials.length} témoignage{testimonials.length !== 1 ? "s" : ""} —{" "}
                <span className="text-emerald-600 font-medium">{visible} visible{visible !== 1 ? "s" : ""}</span>
                {hidden > 0 && (
                  <>, <span className="text-muted-foreground">{hidden} masqué{hidden !== 1 ? "s" : ""}</span></>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchTestimonials}
                className="p-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                title="Actualiser"
              >
                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin text-primary"
                      : "text-muted-foreground"
                  }
                />
              </button>
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} />
                Nouveau témoignage
              </button>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <RefreshCw size={28} className="animate-spin text-primary" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-border rounded-2xl">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Quote size={28} className="text-primary" />
              </div>
              <p className="text-foreground font-semibold mb-1">
                Aucun témoignage
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Ajoutez des témoignages pour les afficher sur la page d'accueil.
              </p>
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} />
                Ajouter le premier témoignage
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className={`group flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-sm ${
                    t.visible
                      ? "bg-card border-border"
                      : "bg-secondary/30 border-border/50 opacity-70"
                  }`}
                >
                  {/* Avatar */}
                  <div className="shrink-0 w-12 h-12 rounded-xl overflow-hidden border border-border">
                    {t.imageUrl ? (
                      <img
                        src={t.imageUrl}
                        alt={t.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-full h-full bg-gradient-to-br from-primary to-accent items-center justify-center text-primary-foreground font-bold text-sm shadow"
                      style={{ display: t.imageUrl ? "none" : "flex" }}
                    >
                      {t.avatar || getInitials(t.name)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <p className="font-semibold text-foreground text-sm">
                        {t.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        — {t.role}
                      </span>
                      {t.location && (
                        <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                          <MapPin size={10} />
                          {t.location}
                        </span>
                      )}
                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            size={11}
                            className={
                              n <= t.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-border"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      "{t.text}"
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-muted-foreground/60">
                        Ordre: {t.order}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          t.visible
                            ? "text-emerald-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {t.visible ? (
                          <Eye size={11} />
                        ) : (
                          <EyeOff size={11} />
                        )}
                        {t.visible ? "Visible" : "Masqué"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleVisibility(t)}
                      disabled={togglingId === t.id}
                      title={t.visible ? "Masquer" : "Afficher"}
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {togglingId === t.id ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : t.visible ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                    <button
                      onClick={() => openEdit(t)}
                      title="Modifier"
                      className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      disabled={deletingId === t.id}
                      title="Supprimer"
                      className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500 disabled:opacity-50"
                    >
                      {deletingId === t.id ? (
                        <RefreshCw size={15} className="animate-spin" />
                      ) : (
                        <Trash2 size={15} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <TestimonialModal
          initial={
            editTarget
              ? {
                  name: editTarget.name,
                  role: editTarget.role,
                  text: editTarget.text,
                  rating: editTarget.rating,
                  location: editTarget.location,
                  avatar: editTarget.avatar,
                  imageUrl: editTarget.imageUrl ?? "",
                  visible: editTarget.visible,
                  order: editTarget.order,
                }
              : EMPTY_FORM
          }
          onSave={handleSave}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(null);
          }}
          saving={saving}
        />
      )}
    </div>
  );
}
