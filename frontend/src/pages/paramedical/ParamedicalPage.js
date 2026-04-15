import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Star, ShoppingCart, SlidersHorizontal, X, Package, Shield, Activity, Loader2, } from "lucide-react";
// ─── Category meta (counts computed dynamically in component) ───────────────────
const categoryMeta = [
    { name: "Tous", icon: "🏥" },
    { name: "Orthopédie", icon: "🦴" },
    { name: "Maintien à domicile", icon: "🏠" },
    { name: "Soins & pansements", icon: "🩹" },
    { name: "Diabétologie", icon: "💉" },
    { name: "Bien-être & rééducation", icon: "🏃" },
    { name: "Matériel bébé", icon: "👶" },
];
// ─── Hero category banners ─────────────────────────────────────────────────────
const heroBanners = [
    { icon: "🦽", label: "Mobilité" },
    { icon: "💓", label: "Cardiologie" },
    { icon: "🩺", label: "Monitoring" },
    { icon: "🩹", label: "Pansements" },
    { icon: "🍼", label: "Bébé" },
    { icon: "🏃", label: "Rééducation" },
];
// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAddToCart, }) {
    const hasPromo = !!product.originalPrice;
    const promoPercent = hasPromo
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) *
            100)
        : 0;
    return (_jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col group", children: [_jsxs(Link, { to: `/paramedical/product/${product.id}`, className: "relative block h-48 overflow-hidden bg-secondary/20", children: [_jsx("img", { src: product.imageUrl, alt: product.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" }), hasPromo && (_jsxs("span", { className: "absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg", children: ["-", promoPercent, "%"] })), product.prescription && (_jsx("span", { className: "absolute top-3 right-3 px-2 py-1 border border-amber-400 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-lg bg-card/80 backdrop-blur-sm", children: "Sur ordonnance" })), !product.inStock && (_jsx("div", { className: "absolute inset-0 bg-black/40 flex items-center justify-center", children: _jsx("span", { className: "px-3 py-1.5 bg-black/70 text-white text-xs font-semibold rounded-xl", children: "Rupture de stock" }) }))] }), _jsxs("div", { className: "p-4 flex flex-col flex-1 gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: product.brand }), _jsx(Link, { to: `/paramedical/product/${product.id}`, children: _jsx("h3", { className: "font-bold text-foreground text-sm leading-snug mt-0.5 hover:text-primary transition-colors line-clamp-2", children: product.name }) }), _jsx("p", { className: "text-xs text-muted-foreground mt-1.5 line-clamp-2", children: product.shortDesc })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [[1, 2, 3, 4, 5].map((s) => (_jsx(Star, { size: 12, className: s <= Math.round(product.rating)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-muted-foreground/30" }, s))), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["(", product.reviews, ")"] })] }), _jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-xl font-extrabold text-foreground", children: product.price.toFixed(2) }), _jsx("span", { className: "text-sm text-foreground/60", children: "TND" }), hasPromo && (_jsx("span", { className: "text-sm text-muted-foreground line-through", children: product.originalPrice.toFixed(2) }))] }), _jsx("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: _jsxs("span", { className: `flex items-center gap-1 font-medium ${product.inStock ? "text-emerald-600 dark:text-emerald-500" : "text-red-500"}`, children: [_jsx("span", { className: `w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-400"}` }), product.inStock ? "En stock" : "Indisponible"] }) }), _jsxs("button", { onClick: () => onAddToCart(product), disabled: !product.inStock, className: "mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed", children: [_jsx(ShoppingCart, { size: 15 }), "Ajouter au panier"] })] })] }));
}
// ─── Add to Cart Toast ─────────────────────────────────────────────────────────
function CartToast({ product, onClose, }) {
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-card border border-border shadow-2xl rounded-2xl p-4 max-w-xs animate-in slide-in-from-bottom-4", children: [_jsx("img", { src: product.imageUrl, alt: "", className: "w-12 h-12 rounded-xl object-cover flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-0.5", children: "R\u00E9serv\u00E9 \u2713" }), _jsx("p", { className: "text-sm font-semibold text-foreground line-clamp-1", children: product.name }), _jsx(Link, { to: "/pharmacy", className: "text-xs text-primary hover:underline mt-1 block", onClick: onClose, children: "Voir la pharmacie \u2192" })] }), _jsx("button", { onClick: onClose, className: "text-muted-foreground hover:text-foreground", children: _jsx(X, { size: 16 }) })] }));
}
// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParamedicalPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch("/api/public/paramedical-products")
            .then((r) => r.json())
            .then((data) => setProducts(Array.isArray(data) ? data : []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);
    const categories = useMemo(() => categoryMeta.map((cat) => ({
        ...cat,
        count: cat.name === "Tous"
            ? products.length
            : products.filter((p) => p.category === cat.name).length,
    })), [products]);
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tous");
    const [priceMax, setPriceMax] = useState(700);
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [prescriptionFilter, setPrescriptionFilter] = useState("all");
    const [sort, setSort] = useState("rating");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [toastProduct, setToastProduct] = useState(null);
    const handleAddToCart = (product) => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setCartCount((c) => c + 1);
        setToastProduct(product);
        setTimeout(() => setToastProduct(null), 3500);
    };
    const filtered = useMemo(() => {
        let result = [...products];
        if (query) {
            const q = query.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(q) ||
                p.brand.toLowerCase().includes(q) ||
                p.shortDesc.toLowerCase().includes(q));
        }
        if (selectedCategory !== "Tous")
            result = result.filter((p) => p.category === selectedCategory);
        result = result.filter((p) => p.price <= priceMax);
        if (minRating > 0)
            result = result.filter((p) => p.rating >= minRating);
        if (inStockOnly)
            result = result.filter((p) => p.inStock);
        if (prescriptionFilter === "no-rx")
            result = result.filter((p) => !p.prescription);
        if (prescriptionFilter === "rx")
            result = result.filter((p) => p.prescription);
        if (sort === "price-asc")
            result.sort((a, b) => a.price - b.price);
        else if (sort === "price-desc")
            result.sort((a, b) => b.price - a.price);
        else if (sort === "rating")
            result.sort((a, b) => b.rating - a.rating);
        else
            result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }, [
        products,
        query,
        selectedCategory,
        priceMax,
        minRating,
        inStockOnly,
        prescriptionFilter,
        sort,
    ]);
    const resetFilters = () => {
        setQuery("");
        setSelectedCategory("Tous");
        setPriceMax(700);
        setMinRating(0);
        setInStockOnly(false);
        setPrescriptionFilter("all");
        setSort("rating");
    };
    const FilterSidebar = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "Cat\u00E9gories" }), categories.map((cat) => (_jsxs("button", { onClick: () => setSelectedCategory(cat.name), className: `flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${selectedCategory === cat.name
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary/50 text-foreground/80"}`, children: [_jsxs("span", { children: [cat.icon, " ", cat.name] }), _jsx("span", { className: `text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === cat.name
                                    ? "bg-primary/20"
                                    : "bg-secondary text-muted-foreground"}`, children: cat.count })] }, cat.name)))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h4", { className: "text-sm font-bold text-foreground", children: "Prix max" }), _jsxs("span", { className: "text-sm font-bold text-primary", children: [priceMax, " TND"] })] }), _jsx("input", { type: "range", min: 10, max: 700, step: 10, value: priceMax, onChange: (e) => setPriceMax(Number(e.target.value)), className: "w-full accent-primary" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [_jsx("span", { children: "10 TND" }), _jsx("span", { children: "700 TND" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "Note minimum" }), _jsx("div", { className: "flex gap-2 flex-wrap", children: [0, 3, 4, 4.5].map((r) => (_jsx("button", { onClick: () => setMinRating(r), className: `px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${minRating === r
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-foreground/80 hover:bg-secondary/70"}`, children: r === 0 ? "Tous" : `${r}+ ★` }, r))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "Disponibilit\u00E9" }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("div", { onClick: () => setInStockOnly(!inStockOnly), className: `relative w-10 h-5 rounded-full transition-colors cursor-pointer ${inStockOnly ? "bg-primary" : "bg-secondary"}`, children: _jsx("div", { className: `absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-5" : "translate-x-0.5"}` }) }), _jsx("span", { className: "text-sm text-foreground/80", children: "En stock uniquement" })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "Ordonnance" }), [
                        { value: "all", label: "Tous les produits" },
                        { value: "no-rx", label: "Sans ordonnance" },
                        { value: "rx", label: "Sur ordonnance" },
                    ].map(({ value, label }) => (_jsxs("label", { className: "flex items-center gap-2 mb-2 cursor-pointer group", children: [_jsx("input", { type: "radio", name: "prescription", checked: prescriptionFilter === value, onChange: () => setPrescriptionFilter(value), className: "accent-primary" }), _jsx("span", { className: "text-sm text-foreground/80 group-hover:text-foreground transition", children: label })] }, value)))] }), _jsx("button", { onClick: resetFilters, className: "w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition", children: "R\u00E9initialiser les filtres" })] }));
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1 pt-24", children: [_jsx("section", { className: "bg-gradient-to-r from-primary to-primary/80 text-white py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8", children: [_jsxs("div", { className: "text-center space-y-4", children: [_jsx("h1", { className: "text-4xl font-bold", children: "Param\u00E9dicaux & Soins" }), _jsx("p", { className: "text-lg opacity-90 max-w-2xl mx-auto", children: "Mat\u00E9riel m\u00E9dical, orthop\u00E9die, soins \u00E0 domicile et bien-\u00EAtre. Disponible dans vos pharmacies partenaires." })] }), _jsxs("div", { className: "relative max-w-2xl mx-auto", children: [_jsx(Search, { className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400", size: 20 }), _jsx("input", { type: "text", placeholder: "Rechercher un produit, une marque...", value: query, onChange: (e) => setQuery(e.target.value), className: "w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" })] })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 lg:hidden", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: [_jsx("span", { className: "font-semibold text-foreground", children: filtered.length }), " ", "produit", filtered.length !== 1 ? "s" : ""] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs(Link, { to: "/pharmacy", className: "relative flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition", children: [_jsx(ShoppingCart, { size: 15 }), cartCount > 0 && (_jsx("span", { className: "absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center", children: cartCount })), "R\u00E9servations"] }), _jsxs("button", { onClick: () => setShowMobileFilters(!showMobileFilters), className: "flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition", children: [_jsx(SlidersHorizontal, { size: 15 }), "Filtres"] })] })] }), showMobileFilters && (_jsx("div", { className: "lg:hidden mb-6 p-6 bg-card border border-border rounded-xl", children: _jsx(FilterSidebar, {}) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("aside", { className: "lg:col-span-1 space-y-6", children: _jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-6 sticky top-24", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "font-bold text-foreground", children: "Filtres" }), _jsxs(Link, { to: "/pharmacy", className: "relative flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition", children: [_jsx(ShoppingCart, { size: 13 }), "R\u00E9servations", cartCount > 0 && (_jsx("span", { className: "absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1", children: cartCount }))] })] }), _jsx(FilterSidebar, {})] }) }), _jsxs("div", { className: "lg:col-span-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("p", { className: "text-sm text-muted-foreground hidden lg:block", children: [_jsx("span", { className: "font-semibold text-foreground", children: filtered.length }), " ", "produit", filtered.length !== 1 ? "s" : ""] }), _jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "rating", children: "Mieux not\u00E9s" }), _jsx("option", { value: "price-asc", children: "Prix croissant" }), _jsx("option", { value: "price-desc", children: "Prix d\u00E9croissant" }), _jsx("option", { value: "name", children: "Nom A\u2013Z" })] })] }), loading ? (_jsx("div", { className: "flex justify-center items-center py-24", children: _jsx(Loader2, { size: 40, className: "animate-spin text-primary" }) })) : filtered.length === 0 ? (_jsxs("div", { className: "bg-card rounded-xl border border-border p-12 text-center space-y-4", children: [_jsx(Package, { size: 48, className: "mx-auto text-muted-foreground/40" }), _jsx("p", { className: "text-lg font-medium text-foreground", children: "Aucun produit trouv\u00E9" }), _jsx("p", { className: "text-muted-foreground", children: "Essayez de modifier vos filtres" }), _jsx("button", { onClick: resetFilters, className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition", children: "R\u00E9initialiser" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5", children: filtered.map((p) => (_jsx(ProductCard, { product: p, onAddToCart: handleAddToCart }, p.id))) }))] })] })] })] }), _jsx("div", { className: "border-t border-border bg-card", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center", children: [
                        {
                            icon: _jsx(Shield, { size: 22, className: "text-primary mx-auto mb-2" }),
                            title: "Retrait dans votre pharmacie",
                            desc: "Disponible chez nos pharmacies partenaires",
                        },
                        {
                            icon: (_jsx(Activity, { size: 22, className: "text-primary mx-auto mb-2" })),
                            title: "Service client médical",
                            desc: "Conseils 7j/7 de 8h à 20h",
                        },
                    ].map(({ icon, title, desc }) => (_jsxs("div", { children: [icon, _jsx("p", { className: "font-bold text-foreground text-sm", children: title }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: desc })] }, title))) }) }), toastProduct && (_jsx(CartToast, { product: toastProduct, onClose: () => setToastProduct(null) })), _jsx(Footer, {})] }));
}
