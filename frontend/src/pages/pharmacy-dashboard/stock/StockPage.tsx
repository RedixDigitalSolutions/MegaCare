import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Plus,
  AlertTriangle,
  Pill,
  Upload,
  Link as LinkIcon,
  Check,
  X,
  Pencil,
  Search,
  Trash2,
  Package,
  Filter,
  ChevronDown,
  Save,
  ShieldAlert,
  BookOpen,
  PlusCircle,
  Loader2,
} from "lucide-react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import { useToast } from "@/hooks/use-toast";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface ProductItem {
  id: string;
  medicineId?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  requiresPrescription: boolean;
  form: string;
  brand: string;
  dci: string;
  description: string;
  imageUrl: string;
  usage: string;
  contraindications: string;
  sideEffects: string;
}

interface MedicineResult {
  id: string;
  name: string;
  dci: string;
  category: string;
  form: string;
  brand: string;
  requiresPrescription: boolean;
  description: string;
  imageUrl: string;
  usage: string;
  contraindications: string;
  sideEffects: string;
}

const CATEGORIES = [
  "Analgésique", "Anti-inflammatoire", "Antibiotique", "Antihistaminique",
  "Antihypertenseur", "Antidiabétique", "Allergie", "Cardiologie",
  "Dermatologie", "Diabétologie", "Gastro-entérologie", "Ophtalmologie",
  "Vitamines", "Vitamines & Suppléments", "Hygiène & Soins", "Matériel médical", "Autre",
];

const FORMS = [
  "Comprimé", "Comprimés", "Comprimés effervescents", "Comprimés pelliculés",
  "Comprimés gastro-résistants", "Gélule", "Gélules", "Gélules gastro-résistantes",
  "Gélule unique", "Capsules molles", "Sirop", "Solution buvable",
  "Crème", "Pommade", "Gel", "Suppositoire", "Injectable",
  "Collyre", "Spray nasal", "Patch", "Sachet", "Autre",
];

const emptyProduct = (): Omit<ProductItem, "id"> => ({
  name: "", category: "", price: 0, stock: 0, requiresPrescription: false,
  form: "", brand: "", dci: "", description: "", imageUrl: "",
  usage: "", contraindications: "", sideEffects: "",
});

const getToken = () => localStorage.getItem("megacare_token") || "";

/* ------------------------------------------------------------------ */
/*  Image Editor                                                       */
/* ------------------------------------------------------------------ */
function ImageEditor({ imageUrl, name, onChange }: { imageUrl: string; name: string; onChange: (url: string) => void }) {
  const [mode, setMode] = useState<"idle" | "url">("idle");
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => { const t = urlInput.trim(); if (t) { onChange(t); setUrlInput(""); setMode("idle"); } };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { onChange(reader.result as string); setMode("idle"); };
    reader.readAsDataURL(file); e.target.value = "";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-secondary/30 flex items-center justify-center">
        {imageUrl ? <img src={imageUrl} alt={name} className="w-full h-full object-contain p-1" /> : <Pill size={28} className="text-muted-foreground/40" />}
      </div>
      {mode === "idle" && (
        <div className="flex gap-1">
          <button type="button" onClick={() => setMode("url")} className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md border border-border transition"><LinkIcon size={10} /> URL</button>
          <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md border border-border transition"><Upload size={10} /> Fichier</button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      )}
      {mode === "url" && (
        <div className="flex items-center gap-1">
          <input type="url" placeholder="https://..." value={urlInput} onChange={(e) => setUrlInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleUrlSubmit(); if (e.key === "Escape") { setMode("idle"); setUrlInput(""); } }} className="w-36 px-2 py-1 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary" autoFocus />
          <button type="button" onClick={handleUrlSubmit} className="p-1 bg-primary text-primary-foreground rounded-md"><Check size={12} /></button>
          <button type="button" onClick={() => { setMode("idle"); setUrlInput(""); }} className="p-1 bg-secondary rounded-md"><X size={12} /></button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Highlight matched text                                             */
/* ------------------------------------------------------------------ */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  const words = query.trim().split(/\s+/).filter(Boolean);
  const pattern = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${pattern})`, "gi");
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary rounded-sm px-0.5 font-semibold">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Category color helper                                              */
/* ------------------------------------------------------------------ */
const CATEGORY_COLORS: Record<string, string> = {
  "Analgésique": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Anti-inflammatoire": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Antibiotique": "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  "Antihistaminique": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Antihypertenseur": "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  "Antidiabétique": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "Dermatologie": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  "Gastro-entérologie": "bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-300",
  "Ophtalmologie": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  "Vitamines & Suppléments": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Vitamines": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  "Cardiologie": "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
};
const getCatColor = (cat: string) => CATEGORY_COLORS[cat] || "bg-secondary text-foreground";

/* ------------------------------------------------------------------ */
/*  Add-to-Stock Modal (real-time autocomplete + keyboard nav)         */
/* ------------------------------------------------------------------ */
function AddToStockModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState<"search" | "manual" | "price-stock">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MedicineResult[]>([]);
  const [popular, setPopular] = useState<MedicineResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<MedicineResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Manual form (for new global entries)
  const [manualForm, setManualForm] = useState<Omit<MedicineResult, "id">>({
    name: "", dci: "", category: "", form: "", brand: "",
    requiresPrescription: false, description: "", imageUrl: "",
    usage: "", contraindications: "", sideEffects: "",
  });
  const [manualTab, setManualTab] = useState<"general" | "medical">("general");

  // Price/stock form
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  // Load popular medicines on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/medicines/popular");
        const data = await res.json();
        setPopular(Array.isArray(data) ? data.map((m: any) => ({ id: m._id || m.id, ...m })) : []);
      } catch { /* ignore */ }
    })();
  }, []);

  // Real-time autocomplete search (150ms debounce, min 1 char)
  useEffect(() => {
    if (step !== "search") return;
    clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 1) { setResults([]); setActiveIndex(-1); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const cat = categoryFilter ? `&category=${encodeURIComponent(categoryFilter)}` : "";
        const res = await fetch(`/api/medicines/search?q=${encodeURIComponent(q)}${cat}`);
        const data = await res.json();
        const mapped = Array.isArray(data) ? data.map((m: any) => ({ id: m._id || m.id, ...m })) : [];
        setResults(mapped);
        setActiveIndex(-1);
      } catch { setResults([]); }
      setSearching(false);
    }, 150);
    return () => clearTimeout(debounceRef.current);
  }, [query, step, categoryFilter]);

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const el = listRef.current.children[activeIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Display list: search results if typing, otherwise popular
  const displayList = query.trim().length >= 1 ? results : popular;
  const showingPopular = query.trim().length < 1;

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, displayList.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0 && displayList[activeIndex]) {
      e.preventDefault();
      handleSelectMedicine(displayList[activeIndex]);
    } else if (e.key === "Escape") {
      if (query) { setQuery(""); setResults([]); setActiveIndex(-1); }
      else onClose();
    }
  };

  const handleSelectMedicine = (med: MedicineResult) => {
    setSelected(med);
    setStep("price-stock");
  };

  const handleManualSubmit = async () => {
    if (!manualForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(manualForm),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Erreur");
      const created = await res.json();
      setSelected({ id: created._id || created.id, ...manualForm });
      setStep("price-stock");
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleAddToInventory = async () => {
    if (!selected) return;
    const p = parseFloat(price);
    const s = parseInt(stock);
    if (isNaN(p) || p < 0) { toast({ title: "Prix invalide", variant: "destructive" }); return; }
    if (isNaN(s) || s < 0) { toast({ title: "Quantité invalide", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/pharmacy/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({
          medicineId: selected.id,
          name: selected.name,
          dci: selected.dci,
          category: selected.category,
          form: selected.form,
          brand: selected.brand,
          requiresPrescription: selected.requiresPrescription,
          description: selected.description,
          imageUrl: selected.imageUrl,
          usage: selected.usage,
          contraindications: selected.contraindications,
          sideEffects: selected.sideEffects,
          price: p,
          stock: s,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Erreur serveur");
      }
      toast({ title: "Produit ajouté au stock", description: `${selected.name} — ${s} unités à ${p.toFixed(2)} DT` });
      onAdded();
      onClose();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const setManual = (key: string, val: any) => setManualForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            {step !== "search" && (
              <button onClick={() => { setStep(step === "price-stock" && !selected ? "manual" : "search"); setSelected(null); }} className="p-1 hover:bg-muted rounded-lg transition text-muted-foreground"><ChevronDown size={16} className="rotate-90" /></button>
            )}
            <h2 className="text-lg font-semibold text-foreground">
              {step === "search" && "Ajouter au stock"}
              {step === "manual" && "Nouveau médicament"}
              {step === "price-stock" && "Prix & Quantité"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition"><X size={18} /></button>
        </div>

        {/* Search step */}
        {step === "search" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search bar + category filter */}
            <div className="p-4 border-b border-border space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  autoFocus
                  placeholder="Tapez pour chercher (nom, DCI, marque, catégorie)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                {searching && <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" />}
                {!searching && query && (
                  <button onClick={() => { setQuery(""); setResults([]); setActiveIndex(-1); inputRef.current?.focus(); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded text-muted-foreground"><X size={14} /></button>
                )}
              </div>

              {/* Category quick-filter chips */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setCategoryFilter("")}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition ${
                    !categoryFilter ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary"
                  }`}
                >
                  Toutes
                </button>
                {["Analgésique", "Antibiotique", "Anti-inflammatoire", "Cardiologie", "Dermatologie", "Vitamines & Suppléments"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategoryFilter(categoryFilter === c ? "" : c)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-full border transition ${
                      categoryFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Status line */}
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  {query.trim()
                    ? searching
                      ? "Recherche en cours…"
                      : `${results.length} résultat${results.length !== 1 ? "s" : ""}`
                    : `${popular.length} médicaments populaires`
                  }
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 text-[10px] bg-muted border border-border rounded font-mono">↑↓</kbd> naviguer
                  <kbd className="px-1 py-0.5 text-[10px] bg-muted border border-border rounded font-mono ml-1">↵</kbd> sélectionner
                </span>
              </div>
            </div>

            {/* Results list */}
            <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-1">
              {query.trim().length >= 1 && !searching && results.length === 0 && (
                <div className="text-center py-10">
                  <Package size={36} className="mx-auto mb-3 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground mb-1">Aucun résultat pour « {query} »</p>
                  <p className="text-xs text-muted-foreground mb-5">Ce médicament n'existe pas encore dans le catalogue global.</p>
                  <button
                    onClick={() => { setManualForm((prev) => ({ ...prev, name: query.trim() })); setStep("manual"); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                  >
                    <PlusCircle size={15} /> Créer « {query.trim()} »
                  </button>
                </div>
              )}

              {showingPopular && popular.length > 0 && (
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-1">Médicaments populaires</p>
              )}

              {displayList.map((med, i) => (
                <button
                  key={med.id}
                  onClick={() => handleSelectMedicine(med)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition text-left group ${
                    activeIndex === i
                      ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
                      : "border-transparent hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg overflow-hidden border border-border bg-secondary/30 flex items-center justify-center shrink-0">
                    {med.imageUrl ? <img src={med.imageUrl} alt={med.name} className="w-full h-full object-contain p-0.5" /> : <Pill size={16} className="text-muted-foreground/40" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">
                        <HighlightText text={med.name} query={query} />
                      </span>
                      {med.requiresPrescription && <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded">ORD</span>}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {med.category && <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getCatColor(med.category)}`}>{med.category}</span>}
                      <span className="text-[11px] text-muted-foreground truncate">
                        <HighlightText text={[med.brand, med.dci, med.form].filter(Boolean).join(" · ")} query={query} />
                      </span>
                    </div>
                  </div>
                  <Plus size={15} className={`shrink-0 transition ${activeIndex === i ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"}`} />
                </button>
              ))}
            </div>

            {/* Add manually footer */}
            <div className="px-4 py-3 border-t border-border bg-muted/20">
              <button onClick={() => { setManualForm((prev) => ({ ...prev, name: query.trim() })); setStep("manual"); }} className="w-full flex items-center justify-center gap-2 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-sm font-medium transition">
                <PlusCircle size={15} />
                Ajouter manuellement un nouveau médicament
              </button>
            </div>
          </div>
        )}

        {/* Manual entry step */}
        {step === "manual" && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex border-b border-border px-6">
              {(["general", "medical"] as const).map((tab) => (
                <button key={tab} onClick={() => setManualTab(tab)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${manualTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
                  {tab === "general" ? "Informations" : "Infos médicales"}
                </button>
              ))}
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {manualTab === "general" && (
                <>
                  <div className="flex justify-center">
                    <ImageEditor imageUrl={manualForm.imageUrl} name={manualForm.name} onChange={(url) => setManual("imageUrl", url)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom du médicament *</label>
                      <input type="text" value={manualForm.name} onChange={(e) => setManual("name", e.target.value)} placeholder="ex: Paracétamol 500mg" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">DCI</label>
                      <input type="text" value={manualForm.dci} onChange={(e) => setManual("dci", e.target.value)} placeholder="ex: Paracétamol" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Catégorie</label>
                      <select value={manualForm.category} onChange={(e) => setManual("category", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="">— Sélectionner —</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Forme</label>
                      <select value={manualForm.form} onChange={(e) => setManual("form", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="">— Sélectionner —</option>
                        {FORMS.map((f) => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Marque / Laboratoire</label>
                      <input type="text" value={manualForm.brand} onChange={(e) => setManual("brand", e.target.value)} placeholder="ex: SANOFI" className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer text-sm">
                        <input type="checkbox" checked={manualForm.requiresPrescription} onChange={(e) => setManual("requiresPrescription", e.target.checked)} className="w-4 h-4 accent-primary rounded" />
                        <ShieldAlert size={14} className="text-amber-500" /> Ordonnance requise
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                      <textarea rows={2} value={manualForm.description} onChange={(e) => setManual("description", e.target.value)} placeholder="Description du médicament..." className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                    </div>
                  </div>
                </>
              )}
              {manualTab === "medical" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Usage / Posologie</label>
                    <textarea rows={3} value={manualForm.usage} onChange={(e) => setManual("usage", e.target.value)} placeholder="Indications d'utilisation..." className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Contre-indications</label>
                    <textarea rows={3} value={manualForm.contraindications} onChange={(e) => setManual("contraindications", e.target.value)} placeholder="Contre-indications connues..." className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Effets secondaires</label>
                    <textarea rows={3} value={manualForm.sideEffects} onChange={(e) => setManual("sideEffects", e.target.value)} placeholder="Effets indésirables possibles..." className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
              <button onClick={() => setStep("search")} className="flex-1 py-2.5 border border-border hover:bg-muted rounded-lg text-sm font-medium transition">Retour</button>
              <button onClick={handleManualSubmit} disabled={!manualForm.name.trim() || saving} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin" />}
                Suivant — Prix & Stock
              </button>
            </div>
          </div>
        )}

        {/* Price & Stock step */}
        {step === "price-stock" && selected && (
          <div className="p-6 space-y-6">
            {/* Selected medicine summary */}
            <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-border bg-secondary/30 flex items-center justify-center shrink-0">
                {selected.imageUrl ? <img src={selected.imageUrl} alt={selected.name} className="w-full h-full object-contain p-1" /> : <Pill size={24} className="text-muted-foreground/40" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{selected.name}</span>
                  {selected.requiresPrescription && <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 rounded">ORD</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {selected.category && <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${getCatColor(selected.category)}`}>{selected.category}</span>}
                  <span className="text-xs text-muted-foreground truncate">{[selected.brand, selected.dci, selected.form].filter(Boolean).join(" · ")}</span>
                </div>
              </div>
            </div>

            {/* Price + Stock inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Votre prix de vente (DT) *</label>
                <input type="number" min={0} step={0.01} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="ex: 5.50" className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" autoFocus />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Quantité en stock *</label>
                <input type="number" min={0} value={stock} onChange={(e) => setStock(e.target.value)} placeholder="ex: 200" className="w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Le prix et la quantité sont propres à votre pharmacie. Les informations du médicament sont partagées dans le catalogue global.
            </p>

            <div className="flex gap-3">
              <button onClick={() => { setStep("search"); setSelected(null); setPrice(""); setStock(""); }} className="flex-1 py-2.5 border border-border hover:bg-muted rounded-lg text-sm font-medium transition">Retour</button>
              <button onClick={handleAddToInventory} disabled={!price || !stock || saving} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                Ajouter au stock
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Edit Product Modal                                                 */
/* ------------------------------------------------------------------ */
function EditProductModal({ product, onSave, onClose, saving }: {
  product: ProductItem;
  onSave: (data: Partial<ProductItem>) => void;
  onClose: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState({ ...product });
  const [activeTab, setActiveTab] = useState<"general" | "details" | "medical">("general");
  const set = (key: string, val: any) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold text-foreground">Modifier: {product.name}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition"><X size={18} /></button>
        </div>
        <div className="flex border-b border-border px-6">
          {([["general", "Général"], ["details", "Prix & Stock"], ["medical", "Infos médicales"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setActiveTab(key)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{label}</button>
          ))}
        </div>
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === "general" && (
            <>
              <div className="flex justify-center"><ImageEditor imageUrl={form.imageUrl} name={form.name} onChange={(url) => set("imageUrl", url)} /></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Nom *</label>
                  <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">DCI</label>
                  <input type="text" value={form.dci} onChange={(e) => set("dci", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Catégorie</label>
                  <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">— Sélectionner —</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Forme</label>
                  <select value={form.form} onChange={(e) => set("form", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option value="">— Sélectionner —</option>
                    {FORMS.map((f) => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Marque</label>
                  <input type="text" value={form.brand} onChange={(e) => set("brand", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={form.requiresPrescription} onChange={(e) => set("requiresPrescription", e.target.checked)} className="w-4 h-4 accent-primary rounded" />
                    <ShieldAlert size={14} className="text-amber-500" /> Ordonnance requise
                  </label>
                </div>
              </div>
            </>
          )}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Prix unitaire (DT) *</label>
                <input type="number" min={0} step={0.01} value={form.price || ""} onChange={(e) => set("price", parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Quantité en stock</label>
                <input type="number" min={0} value={form.stock || ""} onChange={(e) => set("stock", parseInt(e.target.value) || 0)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
          )}
          {activeTab === "medical" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Usage / Posologie</label>
                <textarea rows={3} value={form.usage} onChange={(e) => set("usage", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Contre-indications</label>
                <textarea rows={3} value={form.contraindications} onChange={(e) => set("contraindications", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Effets secondaires</label>
                <textarea rows={3} value={form.sideEffects} onChange={(e) => set("sideEffects", e.target.value)} className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-border bg-muted/20">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border hover:bg-muted rounded-lg text-sm font-medium transition">Annuler</button>
          <button onClick={() => onSave(form)} disabled={!form.name.trim() || saving} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Delete Confirmation                                                */
/* ------------------------------------------------------------------ */
function DeleteConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onCancel}>
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-full"><Trash2 size={18} className="text-red-600" /></div>
          <h3 className="text-lg font-semibold text-foreground">Supprimer le produit</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Êtes-vous sûr de vouloir supprimer <strong>{name}</strong> de votre stock ? Cette action est irréversible.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition">Annuler</button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition">Supprimer</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function PharmacyStockPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "ok">("all");

  // Inline stock editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModal, setEditModal] = useState<ProductItem | null>(null);
  const [deleteModal, setDeleteModal] = useState<ProductItem | null>(null);
  const [saving, setSaving] = useState(false);

  const MIN_STOCK = 20;

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const uid = user?.id || "";
      const res = await fetch(`/api/pharmacy/products?limit=100&pharmacyId=${uid}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const raw = await res.json();
      const data: any[] = Array.isArray(raw) ? raw : (raw.data ?? []);
      setProducts(
        data.map((p: any) => ({
          id: p._id || p.id,
          medicineId: p.medicineId || "",
          name: p.name || "",
          category: p.category || "",
          price: p.price || 0,
          stock: p.stock || 0,
          requiresPrescription: !!p.requiresPrescription,
          form: p.form || "",
          brand: p.brand || "",
          dci: p.dci || "",
          description: p.description || "",
          imageUrl: p.imageUrl || "",
          usage: p.usage || "",
          contraindications: p.contraindications || "",
          sideEffects: p.sideEffects || "",
        })),
      );
    } catch {
      toast({ title: "Erreur", description: "Impossible de charger le stock", variant: "destructive" });
    } finally {
      setLoadingStock(false);
    }
  }, [toast, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "pharmacy") fetchProducts();
  }, [isAuthenticated, user, fetchProducts]);

  /* ---- CRUD handlers ---- */

  const handleEditSave = async (data: Partial<ProductItem>) => {
    if (!editModal) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pharmacy/products/${editModal.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || "Erreur serveur");
      toast({ title: "Produit modifié", description: data.name || editModal.name });
      setEditModal(null);
      fetchProducts();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteModal) return;
    try {
      const res = await fetch(`/api/pharmacy/products/${deleteModal.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      toast({ title: "Produit supprimé", description: deleteModal.name });
      setDeleteModal(null);
      fetchProducts();
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  const handleInlineStockSave = async (id: string) => {
    const qty = parseInt(editQty, 10);
    if (isNaN(qty) || qty < 0) { setEditingId(null); return; }
    try {
      const res = await fetch(`/api/pharmacy/products/${id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ stock: qty }),
      });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: qty } : p));
      toast({ title: "Stock mis à jour", description: `${qty} unités` });
    } catch {
      toast({ title: "Erreur", description: "Impossible de mettre à jour le stock", variant: "destructive" });
    }
    setEditingId(null);
  };

  /* ---- Filtering ---- */

  const filtered = products.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.dci.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesStock = stockFilter === "all" || (stockFilter === "low" && p.stock < MIN_STOCK) || (stockFilter === "ok" && p.stock >= MIN_STOCK);
    return matchesSearch && matchesCategory && matchesStock;
  });

  const lowStockProducts = products.filter((p) => p.stock < MIN_STOCK);
  const activeCategories = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();

  /* ---- Guards ---- */
  if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy") return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <PharmacyDashboardSidebar pharmacyName={user.firstName || "Pharmacie Central"} />

        <main className="flex-1 overflow-auto">
          {loadingStock ? (
            <div className="flex min-h-screen items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 size={28} className="text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">Chargement du stock…</p>
              </div>
            </div>
          ) : (
          <>
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Gestion du Stock</h1>
                <p className="text-muted-foreground text-sm mt-0.5">{products.length} produit{products.length > 1 ? "s" : ""} au total · {lowStockProducts.length} en stock faible</p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2 shrink-0">
                <Plus size={16} /> Ajouter au stock
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Low-stock alert */}
            {lowStockProducts.length > 0 && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-red-600" />
                  <p className="font-semibold text-red-700 dark:text-red-400 text-sm">{lowStockProducts.length} produit{lowStockProducts.length > 1 ? "s" : ""} en stock faible (&lt; {MIN_STOCK} unités)</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lowStockProducts.slice(0, 10).map((p) => (
                    <span key={p.id} className="flex items-center gap-1 text-xs bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg">
                      <AlertTriangle size={11} /> <strong>{p.name}</strong>: {p.stock} unités
                    </span>
                  ))}
                  {lowStockProducts.length > 10 && <span className="text-xs text-red-600 px-2 py-1.5">+{lowStockProducts.length - 10} autres</span>}
                </div>
              </div>
            )}

            {/* Search & Filters bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="Rechercher par nom, DCI, marque..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="relative">
                <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="pl-8 pr-8 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer">
                  <option value="">Toutes catégories</option>
                  {activeCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              <div className="flex rounded-lg border border-border overflow-hidden">
                {([["all", "Tous"], ["low", "Stock faible"], ["ok", "Normal"]] as const).map(([key, label]) => (
                  <button key={key} onClick={() => setStockFilter(key)} className={`px-3 py-2 text-xs font-medium transition ${stockFilter === key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                  <Package size={40} className="mb-3 opacity-40" />
                  <p className="font-medium">Aucun produit trouvé</p>
                  <p className="text-sm mt-1">{searchQuery || categoryFilter ? "Essayez de modifier vos filtres" : "Ajoutez votre premier produit"}</p>
                  {!searchQuery && !categoryFilter && (
                    <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center gap-2">
                      <Plus size={14} /> Ajouter au stock
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Produit</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Catégorie</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Forme</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prix</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Statut</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filtered.map((p) => (
                        <tr key={p.id} className="hover:bg-muted/30 transition group">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-border bg-secondary/30 flex items-center justify-center shrink-0">
                                {p.imageUrl ? <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain p-0.5" /> : <Pill size={18} className="text-muted-foreground/40" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground text-sm truncate">{p.name}</span>
                                  {p.requiresPrescription && <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded">ORD</span>}
                                </div>
                                {(p.brand || p.dci) && <p className="text-xs text-muted-foreground truncate">{[p.brand, p.dci].filter(Boolean).join(" · ")}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {p.category ? <span className="text-xs bg-secondary px-2 py-1 rounded-md text-foreground">{p.category}</span> : <span className="text-xs text-muted-foreground">—</span>}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{p.form || "—"}</td>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{p.price.toFixed(2)} DT</td>
                          <td className="px-4 py-3">
                            {editingId === p.id ? (
                              <div className="flex items-center gap-1">
                                <input type="number" min={0} value={editQty} onChange={(e) => setEditQty(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleInlineStockSave(p.id); if (e.key === "Escape") setEditingId(null); }} className="w-20 px-2 py-1 text-sm bg-background border border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary" autoFocus />
                                <button onClick={() => handleInlineStockSave(p.id)} className="p-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"><Check size={12} /></button>
                                <button onClick={() => setEditingId(null)} className="p-1 bg-muted rounded hover:bg-muted/70"><X size={12} /></button>
                              </div>
                            ) : (
                              <button onClick={() => { setEditingId(p.id); setEditQty(String(p.stock)); }} className="flex items-center gap-1.5 group/stock text-sm">
                                <span className={p.stock < MIN_STOCK ? "text-red-600 font-semibold" : "text-foreground"}>{p.stock}</span>
                                <span className="text-muted-foreground text-xs">unités</span>
                                <Pencil size={11} className="text-muted-foreground opacity-0 group-hover/stock:opacity-100 transition" />
                              </button>
                            )}
                            <div className="w-20 h-1.5 bg-secondary rounded-full mt-1.5 overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${p.stock < MIN_STOCK ? "bg-red-500" : p.stock < MIN_STOCK * 2 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${Math.min(100, (p.stock / (MIN_STOCK * 5)) * 100)}%` }} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {p.stock === 0 ? (
                              <span className="flex items-center gap-1 text-red-700 bg-red-100 dark:bg-red-950/50 dark:text-red-400 px-2.5 py-1 rounded-lg text-xs font-medium"><X size={12} /> Rupture</span>
                            ) : p.stock < MIN_STOCK ? (
                              <span className="flex items-center gap-1 text-amber-700 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 px-2.5 py-1 rounded-lg text-xs font-medium"><AlertTriangle size={12} /> Faible</span>
                            ) : (
                              <span className="text-green-700 bg-green-100 dark:bg-green-950/50 dark:text-green-400 px-2.5 py-1 rounded-lg text-xs font-medium">Normal</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition">
                              <button onClick={() => setEditModal(p)} title="Modifier" className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"><Pencil size={14} /></button>
                              <button onClick={() => setDeleteModal(p)} title="Supprimer" className="p-2 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition text-muted-foreground hover:text-red-600"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Summary footer */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground px-1">
              <span><strong className="text-foreground">{filtered.length}</strong> produit{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""}</span>
              <span>Valeur totale: <strong className="text-foreground">{filtered.reduce((s, p) => s + p.price * p.stock, 0).toFixed(2)} DT</strong></span>
              <span>Stock moyen: <strong className="text-foreground">{filtered.length > 0 ? Math.round(filtered.reduce((s, p) => s + p.stock, 0) / filtered.length) : 0}</strong> unités</span>
            </div>
          </div>
          </>
          )}
        </main>
      </div>

      {/* Add to Stock Modal (autocomplete) */}
      {showAddModal && <AddToStockModal onClose={() => setShowAddModal(false)} onAdded={fetchProducts} />}

      {/* Edit Product Modal */}
      {editModal && <EditProductModal product={editModal} onSave={handleEditSave} onClose={() => setEditModal(null)} saving={saving} />}

      {/* Delete Confirmation */}
      {deleteModal && <DeleteConfirmModal name={deleteModal.name} onConfirm={handleDeleteProduct} onCancel={() => setDeleteModal(null)} />}
    </div>
  );
}
