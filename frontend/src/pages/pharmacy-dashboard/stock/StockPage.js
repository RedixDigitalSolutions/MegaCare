import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { Plus, AlertTriangle, Pill, Upload, Link as LinkIcon, Check, X, Pencil, Search, Trash2, Package, Filter, ChevronDown, Save, ShieldAlert, PlusCircle, Loader2, } from "lucide-react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import { useToast } from "@/hooks/use-toast";
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
const emptyProduct = () => ({
    name: "", category: "", price: 0, stock: 0, requiresPrescription: false,
    form: "", brand: "", dci: "", description: "", imageUrl: "",
    usage: "", contraindications: "", sideEffects: "",
});
const getToken = () => localStorage.getItem("megacare_token") || "";
/* ------------------------------------------------------------------ */
/*  Image Editor                                                       */
/* ------------------------------------------------------------------ */
function ImageEditor({ imageUrl, name, onChange }) {
    const [mode, setMode] = useState("idle");
    const [urlInput, setUrlInput] = useState("");
    const fileRef = useRef(null);
    const handleUrlSubmit = () => { const t = urlInput.trim(); if (t) {
        onChange(t);
        setUrlInput("");
        setMode("idle");
    } };
    const handleFile = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onloadend = () => { onChange(reader.result); setMode("idle"); };
        reader.readAsDataURL(file);
        e.target.value = "";
    };
    return (_jsxs("div", { className: "flex flex-col items-center gap-2", children: [_jsx("div", { className: "relative w-20 h-20 rounded-xl overflow-hidden border border-border bg-secondary/30 flex items-center justify-center", children: imageUrl ? _jsx("img", { src: imageUrl, alt: name, className: "w-full h-full object-contain p-1" }) : _jsx(Pill, { size: 28, className: "text-muted-foreground/40" }) }), mode === "idle" && (_jsxs("div", { className: "flex gap-1", children: [_jsxs("button", { type: "button", onClick: () => setMode("url"), className: "flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md border border-border transition", children: [_jsx(LinkIcon, { size: 10 }), " URL"] }), _jsxs("button", { type: "button", onClick: () => fileRef.current?.click(), className: "flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-md border border-border transition", children: [_jsx(Upload, { size: 10 }), " Fichier"] }), _jsx("input", { ref: fileRef, type: "file", accept: "image/*", className: "hidden", onChange: handleFile })] })), mode === "url" && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { type: "url", placeholder: "https://...", value: urlInput, onChange: (e) => setUrlInput(e.target.value), onKeyDown: (e) => { if (e.key === "Enter")
                            handleUrlSubmit(); if (e.key === "Escape") {
                            setMode("idle");
                            setUrlInput("");
                        } }, className: "w-36 px-2 py-1 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary", autoFocus: true }), _jsx("button", { type: "button", onClick: handleUrlSubmit, className: "p-1 bg-primary text-primary-foreground rounded-md", children: _jsx(Check, { size: 12 }) }), _jsx("button", { type: "button", onClick: () => { setMode("idle"); setUrlInput(""); }, className: "p-1 bg-secondary rounded-md", children: _jsx(X, { size: 12 }) })] }))] }));
}
/* ------------------------------------------------------------------ */
/*  Highlight matched text                                             */
/* ------------------------------------------------------------------ */
function HighlightText({ text, query }) {
    if (!query.trim() || !text)
        return _jsx(_Fragment, { children: text });
    const words = query.trim().split(/\s+/).filter(Boolean);
    const pattern = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    const regex = new RegExp(`(${pattern})`, "gi");
    const parts = text.split(regex);
    return (_jsx(_Fragment, { children: parts.map((part, i) => regex.test(part) ? (_jsx("mark", { className: "bg-primary/20 text-primary rounded-sm px-0.5 font-semibold", children: part }, i)) : (_jsx("span", { children: part }, i))) }));
}
/* ------------------------------------------------------------------ */
/*  Category color helper                                              */
/* ------------------------------------------------------------------ */
const CATEGORY_COLORS = {
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
const getCatColor = (cat) => CATEGORY_COLORS[cat] || "bg-secondary text-foreground";
/* ------------------------------------------------------------------ */
/*  Add-to-Stock Modal (real-time autocomplete + keyboard nav)         */
/* ------------------------------------------------------------------ */
function AddToStockModal({ onClose, onAdded }) {
    const { toast } = useToast();
    const [step, setStep] = useState("search");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [popular, setPopular] = useState([]);
    const [searching, setSearching] = useState(false);
    const [selected, setSelected] = useState(null);
    const [saving, setSaving] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [categoryFilter, setCategoryFilter] = useState("");
    const debounceRef = useRef(undefined);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    // Manual form (for new global entries)
    const [manualForm, setManualForm] = useState({
        name: "", dci: "", category: "", form: "", brand: "",
        requiresPrescription: false, description: "", imageUrl: "",
        usage: "", contraindications: "", sideEffects: "",
    });
    const [manualTab, setManualTab] = useState("general");
    // Price/stock form
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    // Load popular medicines on mount
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/medicines/popular");
                const data = await res.json();
                setPopular(Array.isArray(data) ? data.map((m) => ({ id: m._id || m.id, ...m })) : []);
            }
            catch { /* ignore */ }
        })();
    }, []);
    // Real-time autocomplete search (150ms debounce, min 1 char)
    useEffect(() => {
        if (step !== "search")
            return;
        clearTimeout(debounceRef.current);
        const q = query.trim();
        if (q.length < 1) {
            setResults([]);
            setActiveIndex(-1);
            return;
        }
        setSearching(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const cat = categoryFilter ? `&category=${encodeURIComponent(categoryFilter)}` : "";
                const res = await fetch(`/api/medicines/search?q=${encodeURIComponent(q)}${cat}`);
                const data = await res.json();
                const mapped = Array.isArray(data) ? data.map((m) => ({ id: m._id || m.id, ...m })) : [];
                setResults(mapped);
                setActiveIndex(-1);
            }
            catch {
                setResults([]);
            }
            setSearching(false);
        }, 150);
        return () => clearTimeout(debounceRef.current);
    }, [query, step, categoryFilter]);
    // Scroll active item into view
    useEffect(() => {
        if (activeIndex < 0 || !listRef.current)
            return;
        const el = listRef.current.children[activeIndex];
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);
    // Display list: search results if typing, otherwise popular
    const displayList = query.trim().length >= 1 ? results : popular;
    const showingPopular = query.trim().length < 1;
    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, displayList.length - 1));
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, -1));
        }
        else if (e.key === "Enter" && activeIndex >= 0 && displayList[activeIndex]) {
            e.preventDefault();
            handleSelectMedicine(displayList[activeIndex]);
        }
        else if (e.key === "Escape") {
            if (query) {
                setQuery("");
                setResults([]);
                setActiveIndex(-1);
            }
            else
                onClose();
        }
    };
    const handleSelectMedicine = (med) => {
        setSelected(med);
        setStep("price-stock");
    };
    const handleManualSubmit = async () => {
        if (!manualForm.name.trim())
            return;
        setSaving(true);
        try {
            const res = await fetch("/api/medicines", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(manualForm),
            });
            if (!res.ok)
                throw new Error((await res.json().catch(() => ({}))).message || "Erreur");
            const created = await res.json();
            setSelected({ id: created._id || created.id, ...manualForm });
            setStep("price-stock");
        }
        catch (err) {
            toast({ title: "Erreur", description: err.message, variant: "destructive" });
        }
        finally {
            setSaving(false);
        }
    };
    const handleAddToInventory = async () => {
        if (!selected)
            return;
        const p = parseFloat(price);
        const s = parseInt(stock);
        if (isNaN(p) || p < 0) {
            toast({ title: "Prix invalide", variant: "destructive" });
            return;
        }
        if (isNaN(s) || s < 0) {
            toast({ title: "Quantité invalide", variant: "destructive" });
            return;
        }
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
        }
        catch (err) {
            toast({ title: "Erreur", description: err.message, variant: "destructive" });
        }
        finally {
            setSaving(false);
        }
    };
    const setManual = (key, val) => setManualForm((prev) => ({ ...prev, [key]: val }));
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", onClick: onClose, children: _jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30", children: [_jsxs("div", { className: "flex items-center gap-3", children: [step !== "search" && (_jsx("button", { onClick: () => { setStep(step === "price-stock" && !selected ? "manual" : "search"); setSelected(null); }, className: "p-1 hover:bg-muted rounded-lg transition text-muted-foreground", children: _jsx(ChevronDown, { size: 16, className: "rotate-90" }) })), _jsxs("h2", { className: "text-lg font-semibold text-foreground", children: [step === "search" && "Ajouter au stock", step === "manual" && "Nouveau médicament", step === "price-stock" && "Prix & Quantité"] })] }), _jsx("button", { onClick: onClose, className: "p-1.5 hover:bg-muted rounded-lg transition", children: _jsx(X, { size: 18 }) })] }), step === "search" && (_jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-border space-y-3", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { ref: inputRef, type: "text", autoFocus: true, placeholder: "Tapez pour chercher (nom, DCI, marque, cat\u00E9gorie)...", value: query, onChange: (e) => setQuery(e.target.value), onKeyDown: handleKeyDown, className: "w-full pl-10 pr-10 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" }), searching && _jsx(Loader2, { size: 16, className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground animate-spin" }), !searching && query && (_jsx("button", { onClick: () => { setQuery(""); setResults([]); setActiveIndex(-1); inputRef.current?.focus(); }, className: "absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded text-muted-foreground", children: _jsx(X, { size: 14 }) }))] }), _jsxs("div", { className: "flex flex-wrap gap-1.5", children: [_jsx("button", { onClick: () => setCategoryFilter(""), className: `px-2.5 py-1 text-[11px] font-medium rounded-full border transition ${!categoryFilter ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary"}`, children: "Toutes" }), ["Analgésique", "Antibiotique", "Anti-inflammatoire", "Cardiologie", "Dermatologie", "Vitamines & Suppléments"].map((c) => (_jsx("button", { onClick: () => setCategoryFilter(categoryFilter === c ? "" : c), className: `px-2.5 py-1 text-[11px] font-medium rounded-full border transition ${categoryFilter === c ? "bg-primary text-primary-foreground border-primary" : "bg-secondary/50 text-muted-foreground border-border hover:bg-secondary"}`, children: c }, c)))] }), _jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground", children: [_jsx("span", { children: query.trim()
                                                ? searching
                                                    ? "Recherche en cours…"
                                                    : `${results.length} résultat${results.length !== 1 ? "s" : ""}`
                                                : `${popular.length} médicaments populaires` }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx("kbd", { className: "px-1 py-0.5 text-[10px] bg-muted border border-border rounded font-mono", children: "\u2191\u2193" }), " naviguer", _jsx("kbd", { className: "px-1 py-0.5 text-[10px] bg-muted border border-border rounded font-mono ml-1", children: "\u21B5" }), " s\u00E9lectionner"] })] })] }), _jsxs("div", { ref: listRef, className: "flex-1 overflow-y-auto p-3 space-y-1", children: [query.trim().length >= 1 && !searching && results.length === 0 && (_jsxs("div", { className: "text-center py-10", children: [_jsx(Package, { size: 36, className: "mx-auto mb-3 text-muted-foreground/40" }), _jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: ["Aucun r\u00E9sultat pour \u00AB ", query, " \u00BB"] }), _jsx("p", { className: "text-xs text-muted-foreground mb-5", children: "Ce m\u00E9dicament n'existe pas encore dans le catalogue global." }), _jsxs("button", { onClick: () => { setManualForm((prev) => ({ ...prev, name: query.trim() })); setStep("manual"); }, className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition", children: [_jsx(PlusCircle, { size: 15 }), " Cr\u00E9er \u00AB ", query.trim(), " \u00BB"] })] })), showingPopular && popular.length > 0 && (_jsx("p", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-1", children: "M\u00E9dicaments populaires" })), displayList.map((med, i) => (_jsxs("button", { onClick: () => handleSelectMedicine(med), onMouseEnter: () => setActiveIndex(i), className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition text-left group ${activeIndex === i
                                        ? "border-primary/60 bg-primary/5 ring-1 ring-primary/30"
                                        : "border-transparent hover:border-border hover:bg-muted/30"}`, children: [_jsx("div", { className: "w-9 h-9 rounded-lg overflow-hidden border border-border bg-secondary/30 flex items-center justify-center shrink-0", children: med.imageUrl ? _jsx("img", { src: med.imageUrl, alt: med.name, className: "w-full h-full object-contain p-0.5" }) : _jsx(Pill, { size: 16, className: "text-muted-foreground/40" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-sm text-foreground", children: _jsx(HighlightText, { text: med.name, query: query }) }), med.requiresPrescription && _jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded", children: "ORD" })] }), _jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [med.category && _jsx("span", { className: `px-1.5 py-0.5 text-[10px] font-medium rounded ${getCatColor(med.category)}`, children: med.category }), _jsx("span", { className: "text-[11px] text-muted-foreground truncate", children: _jsx(HighlightText, { text: [med.brand, med.dci, med.form].filter(Boolean).join(" · "), query: query }) })] })] }), _jsx(Plus, { size: 15, className: `shrink-0 transition ${activeIndex === i ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"}` })] }, med.id)))] }), _jsx("div", { className: "px-4 py-3 border-t border-border bg-muted/20", children: _jsxs("button", { onClick: () => { setManualForm((prev) => ({ ...prev, name: query.trim() })); setStep("manual"); }, className: "w-full flex items-center justify-center gap-2 py-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-sm font-medium transition", children: [_jsx(PlusCircle, { size: 15 }), "Ajouter manuellement un nouveau m\u00E9dicament"] }) })] })), step === "manual" && (_jsxs("div", { className: "flex flex-col flex-1 overflow-hidden", children: [_jsx("div", { className: "flex border-b border-border px-6", children: ["general", "medical"].map((tab) => (_jsx("button", { onClick: () => setManualTab(tab), className: `px-4 py-2.5 text-sm font-medium border-b-2 transition ${manualTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: tab === "general" ? "Informations" : "Infos médicales" }, tab))) }), _jsxs("div", { className: "p-6 overflow-y-auto flex-1 space-y-5", children: [manualTab === "general" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center", children: _jsx(ImageEditor, { imageUrl: manualForm.imageUrl, name: manualForm.name, onChange: (url) => setManual("imageUrl", url) }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Nom du m\u00E9dicament *" }), _jsx("input", { type: "text", value: manualForm.name, onChange: (e) => setManual("name", e.target.value), placeholder: "ex: Parac\u00E9tamol 500mg", className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "DCI" }), _jsx("input", { type: "text", value: manualForm.dci, onChange: (e) => setManual("dci", e.target.value), placeholder: "ex: Parac\u00E9tamol", className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Cat\u00E9gorie" }), _jsxs("select", { value: manualForm.category, onChange: (e) => setManual("category", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50", children: [_jsx("option", { value: "", children: "\u2014 S\u00E9lectionner \u2014" }), CATEGORIES.map((c) => _jsx("option", { value: c, children: c }, c))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Forme" }), _jsxs("select", { value: manualForm.form, onChange: (e) => setManual("form", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50", children: [_jsx("option", { value: "", children: "\u2014 S\u00E9lectionner \u2014" }), FORMS.map((f) => _jsx("option", { value: f, children: f }, f))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Marque / Laboratoire" }), _jsx("input", { type: "text", value: manualForm.brand, onChange: (e) => setManual("brand", e.target.value), placeholder: "ex: SANOFI", className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsx("div", { className: "flex items-end", children: _jsxs("label", { className: "flex items-center gap-2 cursor-pointer text-sm", children: [_jsx("input", { type: "checkbox", checked: manualForm.requiresPrescription, onChange: (e) => setManual("requiresPrescription", e.target.checked), className: "w-4 h-4 accent-primary rounded" }), _jsx(ShieldAlert, { size: 14, className: "text-amber-500" }), " Ordonnance requise"] }) }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Description" }), _jsx("textarea", { rows: 2, value: manualForm.description, onChange: (e) => setManual("description", e.target.value), placeholder: "Description du m\u00E9dicament...", className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })] })] })] })), manualTab === "medical" && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Usage / Posologie" }), _jsx("textarea", { rows: 3, value: manualForm.usage, onChange: (e) => setManual("usage", e.target.value), placeholder: "Indications d'utilisation...", className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Contre-indications" }), _jsx("textarea", { rows: 3, value: manualForm.contraindications, onChange: (e) => setManual("contraindications", e.target.value), placeholder: "Contre-indications connues...", className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Effets secondaires" }), _jsx("textarea", { rows: 3, value: manualForm.sideEffects, onChange: (e) => setManual("sideEffects", e.target.value), placeholder: "Effets ind\u00E9sirables possibles...", className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })] })] }))] }), _jsxs("div", { className: "flex gap-3 px-6 py-4 border-t border-border bg-muted/20", children: [_jsx("button", { onClick: () => setStep("search"), className: "flex-1 py-2.5 border border-border hover:bg-muted rounded-lg text-sm font-medium transition", children: "Retour" }), _jsxs("button", { onClick: handleManualSubmit, disabled: !manualForm.name.trim() || saving, className: "flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2", children: [saving && _jsx(Loader2, { size: 14, className: "animate-spin" }), "Suivant \u2014 Prix & Stock"] })] })] })), step === "price-stock" && selected && (_jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-xl", children: [_jsx("div", { className: "w-14 h-14 rounded-xl overflow-hidden border border-border bg-secondary/30 flex items-center justify-center shrink-0", children: selected.imageUrl ? _jsx("img", { src: selected.imageUrl, alt: selected.name, className: "w-full h-full object-contain p-1" }) : _jsx(Pill, { size: 24, className: "text-muted-foreground/40" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-foreground", children: selected.name }), selected.requiresPrescription && _jsx("span", { className: "px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 rounded", children: "ORD" })] }), _jsxs("div", { className: "flex items-center gap-1.5 mt-0.5", children: [selected.category && _jsx("span", { className: `px-1.5 py-0.5 text-[10px] font-medium rounded ${getCatColor(selected.category)}`, children: selected.category }), _jsx("span", { className: "text-xs text-muted-foreground truncate", children: [selected.brand, selected.dci, selected.form].filter(Boolean).join(" · ") })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Votre prix de vente (DT) *" }), _jsx("input", { type: "number", min: 0, step: 0.01, value: price, onChange: (e) => setPrice(e.target.value), placeholder: "ex: 5.50", className: "w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50", autoFocus: true })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Quantit\u00E9 en stock *" }), _jsx("input", { type: "number", min: 0, value: stock, onChange: (e) => setStock(e.target.value), placeholder: "ex: 200", className: "w-full px-3 py-2.5 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Le prix et la quantit\u00E9 sont propres \u00E0 votre pharmacie. Les informations du m\u00E9dicament sont partag\u00E9es dans le catalogue global." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => { setStep("search"); setSelected(null); setPrice(""); setStock(""); }, className: "flex-1 py-2.5 border border-border hover:bg-muted rounded-lg text-sm font-medium transition", children: "Retour" }), _jsxs("button", { onClick: handleAddToInventory, disabled: !price || !stock || saving, className: "flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2", children: [saving ? _jsx(Loader2, { size: 14, className: "animate-spin" }) : _jsx(Plus, { size: 14 }), "Ajouter au stock"] })] })] }))] }) }));
}
/* ------------------------------------------------------------------ */
/*  Edit Product Modal                                                 */
/* ------------------------------------------------------------------ */
function EditProductModal({ product, onSave, onClose, saving }) {
    const [form, setForm] = useState({ ...product });
    const [activeTab, setActiveTab] = useState("general");
    const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", onClick: onClose, children: _jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30", children: [_jsxs("h2", { className: "text-lg font-semibold text-foreground", children: ["Modifier: ", product.name] }), _jsx("button", { onClick: onClose, className: "p-1.5 hover:bg-muted rounded-lg transition", children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "flex border-b border-border px-6", children: [["general", "Général"], ["details", "Prix & Stock"], ["medical", "Infos médicales"]].map(([key, label]) => (_jsx("button", { onClick: () => setActiveTab(key), className: `px-4 py-2.5 text-sm font-medium border-b-2 transition ${activeTab === key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: label }, key))) }), _jsxs("div", { className: "p-6 overflow-y-auto flex-1 space-y-5", children: [activeTab === "general" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex justify-center", children: _jsx(ImageEditor, { imageUrl: form.imageUrl, name: form.name, onChange: (url) => set("imageUrl", url) }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Nom *" }), _jsx("input", { type: "text", value: form.name, onChange: (e) => set("name", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "DCI" }), _jsx("input", { type: "text", value: form.dci, onChange: (e) => set("dci", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Cat\u00E9gorie" }), _jsxs("select", { value: form.category, onChange: (e) => set("category", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50", children: [_jsx("option", { value: "", children: "\u2014 S\u00E9lectionner \u2014" }), CATEGORIES.map((c) => _jsx("option", { value: c, children: c }, c))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Forme" }), _jsxs("select", { value: form.form, onChange: (e) => set("form", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50", children: [_jsx("option", { value: "", children: "\u2014 S\u00E9lectionner \u2014" }), FORMS.map((f) => _jsx("option", { value: f, children: f }, f))] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Marque" }), _jsx("input", { type: "text", value: form.brand, onChange: (e) => set("brand", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsx("div", { className: "flex items-end", children: _jsxs("label", { className: "flex items-center gap-2 cursor-pointer text-sm", children: [_jsx("input", { type: "checkbox", checked: form.requiresPrescription, onChange: (e) => set("requiresPrescription", e.target.checked), className: "w-4 h-4 accent-primary rounded" }), _jsx(ShieldAlert, { size: 14, className: "text-amber-500" }), " Ordonnance requise"] }) })] })] })), activeTab === "details" && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Prix unitaire (DT) *" }), _jsx("input", { type: "number", min: 0, step: 0.01, value: form.price || "", onChange: (e) => set("price", parseFloat(e.target.value) || 0), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Quantit\u00E9 en stock" }), _jsx("input", { type: "number", min: 0, value: form.stock || "", onChange: (e) => set("stock", parseInt(e.target.value) || 0), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Description" }), _jsx("textarea", { rows: 3, value: form.description, onChange: (e) => set("description", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })] })] })), activeTab === "medical" && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Usage / Posologie" }), _jsx("textarea", { rows: 3, value: form.usage, onChange: (e) => set("usage", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Contre-indications" }), _jsx("textarea", { rows: 3, value: form.contraindications, onChange: (e) => set("contraindications", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: "Effets secondaires" }), _jsx("textarea", { rows: 3, value: form.sideEffects, onChange: (e) => set("sideEffects", e.target.value), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" })] })] }))] }), _jsxs("div", { className: "flex gap-3 px-6 py-4 border-t border-border bg-muted/20", children: [_jsx("button", { onClick: onClose, className: "flex-1 py-2.5 border border-border hover:bg-muted rounded-lg text-sm font-medium transition", children: "Annuler" }), _jsxs("button", { onClick: () => onSave(form), disabled: !form.name.trim() || saving, className: "flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2", children: [saving ? _jsx(Loader2, { size: 14, className: "animate-spin" }) : _jsx(Save, { size: 14 }), "Enregistrer"] })] })] }) }));
}
/* ------------------------------------------------------------------ */
/*  Delete Confirmation                                                */
/* ------------------------------------------------------------------ */
function DeleteConfirmModal({ name, onConfirm, onCancel }) {
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", onClick: onCancel, children: _jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-xl w-full max-w-sm p-6", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-2 bg-red-100 rounded-full", children: _jsx(Trash2, { size: 18, className: "text-red-600" }) }), _jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Supprimer le produit" })] }), _jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: ["\u00CAtes-vous s\u00FBr de vouloir supprimer ", _jsx("strong", { children: name }), " de votre stock ? Cette action est irr\u00E9versible."] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: onCancel, className: "flex-1 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition", children: "Annuler" }), _jsx("button", { onClick: onConfirm, className: "flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition", children: "Supprimer" })] })] }) }));
}
/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */
export default function PharmacyStockPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [products, setProducts] = useState([]);
    const [loadingStock, setLoadingStock] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [stockFilter, setStockFilter] = useState("all");
    // Inline stock editing
    const [editingId, setEditingId] = useState(null);
    const [editQty, setEditQty] = useState("");
    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [editModal, setEditModal] = useState(null);
    const [deleteModal, setDeleteModal] = useState(null);
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
            const data = Array.isArray(raw) ? raw : (raw.data ?? []);
            setProducts(data.map((p) => ({
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
            })));
        }
        catch {
            toast({ title: "Erreur", description: "Impossible de charger le stock", variant: "destructive" });
        }
        finally {
            setLoadingStock(false);
        }
    }, [toast, user]);
    useEffect(() => {
        if (isAuthenticated && user?.role === "pharmacy")
            fetchProducts();
    }, [isAuthenticated, user, fetchProducts]);
    /* ---- CRUD handlers ---- */
    const handleEditSave = async (data) => {
        if (!editModal)
            return;
        setSaving(true);
        try {
            const res = await fetch(`/api/pharmacy/products/${editModal.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify(data),
            });
            if (!res.ok)
                throw new Error((await res.json().catch(() => ({}))).message || "Erreur serveur");
            toast({ title: "Produit modifié", description: data.name || editModal.name });
            setEditModal(null);
            fetchProducts();
        }
        catch (err) {
            toast({ title: "Erreur", description: err.message, variant: "destructive" });
        }
        finally {
            setSaving(false);
        }
    };
    const handleDeleteProduct = async () => {
        if (!deleteModal)
            return;
        try {
            const res = await fetch(`/api/pharmacy/products/${deleteModal.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (!res.ok)
                throw new Error();
            toast({ title: "Produit supprimé", description: deleteModal.name });
            setDeleteModal(null);
            fetchProducts();
        }
        catch {
            toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
        }
    };
    const handleInlineStockSave = async (id) => {
        const qty = parseInt(editQty, 10);
        if (isNaN(qty) || qty < 0) {
            setEditingId(null);
            return;
        }
        try {
            const res = await fetch(`/api/pharmacy/products/${id}/stock`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({ stock: qty }),
            });
            if (!res.ok)
                throw new Error();
            setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: qty } : p));
            toast({ title: "Stock mis à jour", description: `${qty} unités` });
        }
        catch {
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
    if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
        return null;
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(PharmacyDashboardSidebar, { pharmacyName: user.firstName || "Pharmacie Central" }), _jsx("main", { className: "flex-1 overflow-auto", children: loadingStock ? (_jsx("div", { className: "flex min-h-screen items-center justify-center", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx(Loader2, { size: 28, className: "text-primary animate-spin" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Chargement du stock\u2026" })] }) })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Gestion du Stock" }), _jsxs("p", { className: "text-muted-foreground text-sm mt-0.5", children: [products.length, " produit", products.length > 1 ? "s" : "", " au total \u00B7 ", lowStockProducts.length, " en stock faible"] })] }), _jsxs("button", { onClick: () => setShowAddModal(true), className: "px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2 shrink-0", children: [_jsx(Plus, { size: 16 }), " Ajouter au stock"] })] }) }), _jsxs("div", { className: "p-6 space-y-5", children: [lowStockProducts.length > 0 && (_jsxs("div", { className: "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(AlertTriangle, { size: 16, className: "text-red-600" }), _jsxs("p", { className: "font-semibold text-red-700 dark:text-red-400 text-sm", children: [lowStockProducts.length, " produit", lowStockProducts.length > 1 ? "s" : "", " en stock faible (< ", MIN_STOCK, " unit\u00E9s)"] })] }), _jsxs("div", { className: "flex flex-wrap gap-2", children: [lowStockProducts.slice(0, 10).map((p) => (_jsxs("span", { className: "flex items-center gap-1 text-xs bg-white dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-3 py-1.5 rounded-lg", children: [_jsx(AlertTriangle, { size: 11 }), " ", _jsx("strong", { children: p.name }), ": ", p.stock, " unit\u00E9s"] }, p.id))), lowStockProducts.length > 10 && _jsxs("span", { className: "text-xs text-red-600 px-2 py-1.5", children: ["+", lowStockProducts.length - 10, " autres"] })] })] })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "relative flex-1", children: [_jsx(Search, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Rechercher par nom, DCI, marque...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-3 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }), _jsxs("div", { className: "relative", children: [_jsx(Filter, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" }), _jsxs("select", { value: categoryFilter, onChange: (e) => setCategoryFilter(e.target.value), className: "pl-8 pr-8 py-2.5 text-sm bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer", children: [_jsx("option", { value: "", children: "Toutes cat\u00E9gories" }), activeCategories.map((c) => _jsx("option", { value: c, children: c }, c))] }), _jsx(ChevronDown, { size: 14, className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" })] }), _jsx("div", { className: "flex rounded-lg border border-border overflow-hidden", children: [["all", "Tous"], ["low", "Stock faible"], ["ok", "Normal"]].map(([key, label]) => (_jsx("button", { onClick: () => setStockFilter(key), className: `px-3 py-2 text-xs font-medium transition ${stockFilter === key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`, children: label }, key))) })] }), _jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: filtered.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-muted-foreground", children: [_jsx(Package, { size: 40, className: "mb-3 opacity-40" }), _jsx("p", { className: "font-medium", children: "Aucun produit trouv\u00E9" }), _jsx("p", { className: "text-sm mt-1", children: searchQuery || categoryFilter ? "Essayez de modifier vos filtres" : "Ajoutez votre premier produit" }), !searchQuery && !categoryFilter && (_jsxs("button", { onClick: () => setShowAddModal(true), className: "mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center gap-2", children: [_jsx(Plus, { size: 14 }), " Ajouter au stock"] }))] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border bg-muted/50", children: [_jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Produit" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Cat\u00E9gorie" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Forme" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Prix" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Stock" }), _jsx("th", { className: "px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Statut" }), _jsx("th", { className: "px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: filtered.map((p) => (_jsxs("tr", { className: "hover:bg-muted/30 transition group", children: [_jsx("td", { className: "px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg overflow-hidden border border-border bg-secondary/30 flex items-center justify-center shrink-0", children: p.imageUrl ? _jsx("img", { src: p.imageUrl, alt: p.name, className: "w-full h-full object-contain p-0.5" }) : _jsx(Pill, { size: 18, className: "text-muted-foreground/40" }) }), _jsxs("div", { className: "min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-foreground text-sm truncate", children: p.name }), p.requiresPrescription && _jsx("span", { className: "shrink-0 px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 rounded", children: "ORD" })] }), (p.brand || p.dci) && _jsx("p", { className: "text-xs text-muted-foreground truncate", children: [p.brand, p.dci].filter(Boolean).join(" · ") })] })] }) }), _jsx("td", { className: "px-4 py-3", children: p.category ? _jsx("span", { className: "text-xs bg-secondary px-2 py-1 rounded-md text-foreground", children: p.category }) : _jsx("span", { className: "text-xs text-muted-foreground", children: "\u2014" }) }), _jsx("td", { className: "px-4 py-3 text-sm text-muted-foreground", children: p.form || "—" }), _jsxs("td", { className: "px-4 py-3 text-sm font-medium text-foreground", children: [p.price.toFixed(2), " DT"] }), _jsxs("td", { className: "px-4 py-3", children: [editingId === p.id ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { type: "number", min: 0, value: editQty, onChange: (e) => setEditQty(e.target.value), onKeyDown: (e) => { if (e.key === "Enter")
                                                                                            handleInlineStockSave(p.id); if (e.key === "Escape")
                                                                                            setEditingId(null); }, className: "w-20 px-2 py-1 text-sm bg-background border border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary", autoFocus: true }), _jsx("button", { onClick: () => handleInlineStockSave(p.id), className: "p-1 bg-primary text-primary-foreground rounded hover:bg-primary/90", children: _jsx(Check, { size: 12 }) }), _jsx("button", { onClick: () => setEditingId(null), className: "p-1 bg-muted rounded hover:bg-muted/70", children: _jsx(X, { size: 12 }) })] })) : (_jsxs("button", { onClick: () => { setEditingId(p.id); setEditQty(String(p.stock)); }, className: "flex items-center gap-1.5 group/stock text-sm", children: [_jsx("span", { className: p.stock < MIN_STOCK ? "text-red-600 font-semibold" : "text-foreground", children: p.stock }), _jsx("span", { className: "text-muted-foreground text-xs", children: "unit\u00E9s" }), _jsx(Pencil, { size: 11, className: "text-muted-foreground opacity-0 group-hover/stock:opacity-100 transition" })] })), _jsx("div", { className: "w-20 h-1.5 bg-secondary rounded-full mt-1.5 overflow-hidden", children: _jsx("div", { className: `h-full rounded-full transition-all ${p.stock < MIN_STOCK ? "bg-red-500" : p.stock < MIN_STOCK * 2 ? "bg-amber-500" : "bg-green-500"}`, style: { width: `${Math.min(100, (p.stock / (MIN_STOCK * 5)) * 100)}%` } }) })] }), _jsx("td", { className: "px-4 py-3", children: p.stock === 0 ? (_jsxs("span", { className: "flex items-center gap-1 text-red-700 bg-red-100 dark:bg-red-950/50 dark:text-red-400 px-2.5 py-1 rounded-lg text-xs font-medium", children: [_jsx(X, { size: 12 }), " Rupture"] })) : p.stock < MIN_STOCK ? (_jsxs("span", { className: "flex items-center gap-1 text-amber-700 bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 px-2.5 py-1 rounded-lg text-xs font-medium", children: [_jsx(AlertTriangle, { size: 12 }), " Faible"] })) : (_jsx("span", { className: "text-green-700 bg-green-100 dark:bg-green-950/50 dark:text-green-400 px-2.5 py-1 rounded-lg text-xs font-medium", children: "Normal" })) }), _jsx("td", { className: "px-4 py-3 text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition", children: [_jsx("button", { onClick: () => setEditModal(p), title: "Modifier", className: "p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground", children: _jsx(Pencil, { size: 14 }) }), _jsx("button", { onClick: () => setDeleteModal(p), title: "Supprimer", className: "p-2 hover:bg-red-100 dark:hover:bg-red-950/50 rounded-lg transition text-muted-foreground hover:text-red-600", children: _jsx(Trash2, { size: 14 }) })] }) })] }, p.id))) })] }) })) }), _jsxs("div", { className: "flex flex-wrap items-center gap-6 text-xs text-muted-foreground px-1", children: [_jsxs("span", { children: [_jsx("strong", { className: "text-foreground", children: filtered.length }), " produit", filtered.length > 1 ? "s" : "", " affich\u00E9", filtered.length > 1 ? "s" : ""] }), _jsxs("span", { children: ["Valeur totale: ", _jsxs("strong", { className: "text-foreground", children: [filtered.reduce((s, p) => s + p.price * p.stock, 0).toFixed(2), " DT"] })] }), _jsxs("span", { children: ["Stock moyen: ", _jsx("strong", { className: "text-foreground", children: filtered.length > 0 ? Math.round(filtered.reduce((s, p) => s + p.stock, 0) / filtered.length) : 0 }), " unit\u00E9s"] })] })] })] })) })] }), showAddModal && _jsx(AddToStockModal, { onClose: () => setShowAddModal(false), onAdded: fetchProducts }), editModal && _jsx(EditProductModal, { product: editModal, onSave: handleEditSave, onClose: () => setEditModal(null), saving: saving }), deleteModal && _jsx(DeleteConfirmModal, { name: deleteModal.name, onConfirm: handleDeleteProduct, onCancel: () => setDeleteModal(null) })] }));
}
