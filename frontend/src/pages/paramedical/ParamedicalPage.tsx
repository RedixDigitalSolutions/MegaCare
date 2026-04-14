import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search,
  Star,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
  X,
  ChevronDown,
  Package,
  Shield,
  Activity,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ParamedicalProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number; // for promo display
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQty: number;
  prescription: boolean; // "Sur ordonnance"
  imageUrl: string;
  shortDesc: string;
  deliveryDays: string;
}

// ─── Mock Products ─────────────────────────────────────────────────────────────
const products: ParamedicalProduct[] = [
  {
    id: 1,
    name: "Fauteuil roulant manuel pliant",
    brand: "VERMEIREN",
    category: "Orthopédie",
    price: 580,
    originalPrice: 720,
    rating: 4.8,
    reviews: 143,
    inStock: true,
    stockQty: 5,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400&fit=crop&q=80",
    shortDesc: "Fauteuil léger aluminium, poids 12 kg, dossier rabattable",
    deliveryDays: "3–5 jours",
  },
  {
    id: 2,
    name: "Tensiomètre électronique bras",
    brand: "OMRON",
    category: "Maintien à domicile",
    price: 89,
    originalPrice: 110,
    rating: 4.9,
    reviews: 512,
    inStock: true,
    stockQty: 30,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    shortDesc: "Mesure tensiométrique automatique, mémoire 60 mesures",
    deliveryDays: "24h",
  },
  {
    id: 3,
    name: "Glucomètre AccuChek Active",
    brand: "ROCHE",
    category: "Diabétologie",
    price: 45,
    rating: 4.7,
    reviews: 328,
    inStock: true,
    stockQty: 20,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    shortDesc: "Lecteur de glycémie rapide, résultat en 5 secondes",
    deliveryDays: "24h",
  },
  {
    id: 4,
    name: "Déambulateur 4 roues avec siège",
    brand: "DRIVE MEDICAL",
    category: "Maintien à domicile",
    price: 210,
    rating: 4.6,
    reviews: 97,
    inStock: true,
    stockQty: 8,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&fit=crop&q=80",
    shortDesc:
      "Rollator léger aluminium, panier de rangement, hauteur réglable",
    deliveryDays: "3–5 jours",
  },
  {
    id: 5,
    name: "Collier cervical souple",
    brand: "THUASNE",
    category: "Orthopédie",
    price: 24,
    rating: 4.5,
    reviews: 215,
    inStock: true,
    stockQty: 50,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    shortDesc: "Maintien cervical confort, mousse polyuréthane, taille M",
    deliveryDays: "24h",
  },
  {
    id: 6,
    name: "Genouillère ligamentaire sport",
    brand: "GIBAUD",
    category: "Orthopédie",
    price: 38,
    originalPrice: 48,
    rating: 4.7,
    reviews: 176,
    inStock: true,
    stockQty: 25,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    shortDesc: "Genouillère renforcée, baleines bilatérales, taille S–XL",
    deliveryDays: "48h",
  },
  {
    id: 7,
    name: "Oxymètre de pouls digital",
    brand: "BEURER",
    category: "Maintien à domicile",
    price: 35,
    rating: 4.8,
    reviews: 389,
    inStock: true,
    stockQty: 40,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    shortDesc: "Mesure SpO2 et fréquence cardiaque, écran LED, piles incluses",
    deliveryDays: "24h",
  },
  {
    id: 8,
    name: "Pansements stériles complets 20 pcs",
    brand: "HARTMANN",
    category: "Soins & pansements",
    price: 12,
    rating: 4.6,
    reviews: 254,
    inStock: true,
    stockQty: 100,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    shortDesc: "Pansements hypoallergéniques toutes tailles, emballage stérile",
    deliveryDays: "24h",
  },
  {
    id: 9,
    name: "Compresses stériles non tissées 100 pcs",
    brand: "HARTMANN",
    category: "Soins & pansements",
    price: 8.5,
    rating: 4.7,
    reviews: 198,
    inStock: true,
    stockQty: 80,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    shortDesc: "Compresses 10×10 cm, non pelucheuses, lot de 100",
    deliveryDays: "24h",
  },
  {
    id: 10,
    name: "Thermomètre digital auriculaire",
    brand: "BRAUN",
    category: "Maintien à domicile",
    price: 52,
    originalPrice: 65,
    rating: 4.9,
    reviews: 643,
    inStock: true,
    stockQty: 18,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&fit=crop&q=80",
    shortDesc: "Mesure auriculaire en 1 seconde, 9 positions mémoire",
    deliveryDays: "24h",
  },
  {
    id: 11,
    name: "Coussin anti-escarres rond",
    brand: "THUASNE",
    category: "Maintien à domicile",
    price: 42,
    rating: 4.5,
    reviews: 88,
    inStock: true,
    stockQty: 12,
    prescription: true,
    imageUrl:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    shortDesc: "Mousse viscoélastique mémoire de forme, diamètre 40 cm",
    deliveryDays: "48h",
  },
  {
    id: 12,
    name: "Semelles orthopédiques sport",
    brand: "BAUERFEIND",
    category: "Orthopédie",
    price: 65,
    rating: 4.6,
    reviews: 134,
    inStock: true,
    stockQty: 30,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    shortDesc: "Semelles gel sport, soutien voûte plantaire, taille 36–46",
    deliveryDays: "48h",
  },
  {
    id: 13,
    name: "Bande de contention élastique",
    brand: "SIGVARIS",
    category: "Soins & pansements",
    price: 15,
    rating: 4.4,
    reviews: 162,
    inStock: true,
    stockQty: 60,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    shortDesc: "Bande Velpeau extensible 10 cm × 4 m, lot de 2",
    deliveryDays: "24h",
  },
  {
    id: 14,
    name: "Bandelettes glycémie AccuChek ×50",
    brand: "ROCHE",
    category: "Diabétologie",
    price: 32,
    rating: 4.8,
    reviews: 294,
    inStock: true,
    stockQty: 45,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    shortDesc: "Bandelettes réactives compatibles AccuChek Active, boîte 50",
    deliveryDays: "24h",
  },
  {
    id: 15,
    name: "Autopiqueur lancettes ×100",
    brand: "BD",
    category: "Diabétologie",
    price: 18,
    rating: 4.6,
    reviews: 211,
    inStock: true,
    stockQty: 70,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    shortDesc: "Lancettes universelles 28G, indolores, lot de 100",
    deliveryDays: "24h",
  },
  {
    id: 16,
    name: "Tire-lait électrique double pompe",
    brand: "MEDELA",
    category: "Matériel bébé",
    price: 320,
    originalPrice: 395,
    rating: 4.9,
    reviews: 328,
    inStock: true,
    stockQty: 6,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?w=400&fit=crop&q=80",
    shortDesc: "Double pompe silencieuse, technologie 2-phase, mains libres",
    deliveryDays: "3–5 jours",
  },
  {
    id: 17,
    name: "Ballon de rééducation 65 cm",
    brand: "GYMNIC",
    category: "Bien-être & rééducation",
    price: 28,
    rating: 4.7,
    reviews: 187,
    inStock: true,
    stockQty: 22,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    shortDesc: "Ballon d'exercice anti-éclatement, 65 cm, pompe incluse",
    deliveryDays: "48h",
  },
  {
    id: 18,
    name: "Bande élastique rééducation ×1.5 m",
    brand: "THERA-BAND",
    category: "Bien-être & rééducation",
    price: 12,
    rating: 4.5,
    reviews: 246,
    inStock: true,
    stockQty: 55,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    shortDesc: "Bande latex résistance légère à forte, plusieurs niveaux",
    deliveryDays: "24h",
  },
  {
    id: 19,
    name: "Béquilles réglables aluminium (paire)",
    brand: "INVACARE",
    category: "Orthopédie",
    price: 75,
    rating: 4.4,
    reviews: 112,
    inStock: false,
    stockQty: 0,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&fit=crop&q=80",
    shortDesc: "Béquilles axillaires léger aluminium, hauteur 1.10–1.50 m",
    deliveryDays: "7–10 jours",
  },
  {
    id: 20,
    name: "Nébuliseur à compresseur silencieux",
    brand: "OMRON",
    category: "Maintien à domicile",
    price: 98,
    originalPrice: 125,
    rating: 4.8,
    reviews: 174,
    inStock: true,
    stockQty: 10,
    prescription: false,
    imageUrl:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    shortDesc:
      "Aérosol à compresseur < 45 dB, embout buccal + masques adulte & enfant",
    deliveryDays: "48h",
  },
];

// ─── Categories ───────────────────────────────────────────────────────────────
const categories = [
  { name: "Tous", icon: "🏥", count: products.length },
  {
    name: "Orthopédie",
    icon: "🦴",
    count: products.filter((p) => p.category === "Orthopédie").length,
  },
  {
    name: "Maintien à domicile",
    icon: "🏠",
    count: products.filter((p) => p.category === "Maintien à domicile").length,
  },
  {
    name: "Soins & pansements",
    icon: "🩹",
    count: products.filter((p) => p.category === "Soins & pansements").length,
  },
  {
    name: "Diabétologie",
    icon: "💉",
    count: products.filter((p) => p.category === "Diabétologie").length,
  },
  {
    name: "Bien-être & rééducation",
    icon: "🏃",
    count: products.filter((p) => p.category === "Bien-être & rééducation")
      .length,
  },
  {
    name: "Matériel bébé",
    icon: "👶",
    count: products.filter((p) => p.category === "Matériel bébé").length,
  },
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
function ProductCard({
  product,
  onAddToCart,
}: {
  product: ParamedicalProduct;
  onAddToCart: (p: ParamedicalProduct) => void;
}) {
  const hasPromo = !!product.originalPrice;
  const promoPercent = hasPromo
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col group">
      {/* Image */}
      <Link
        to={`/paramedical/product/${product.id}`}
        className="relative block h-48 overflow-hidden bg-secondary/20"
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasPromo && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-lg">
            -{promoPercent}%
          </span>
        )}
        {product.prescription && (
          <span className="absolute top-3 right-3 px-2 py-1 border border-amber-400 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-lg bg-card/80 backdrop-blur-sm">
            Sur ordonnance
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-3 py-1.5 bg-black/70 text-white text-xs font-semibold rounded-xl">
              Rupture de stock
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Meta */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.brand}
          </p>
          <Link to={`/paramedical/product/${product.id}`}>
            <h3 className="font-bold text-foreground text-sm leading-snug mt-0.5 hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
            {product.shortDesc}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={12}
              className={
                s <= Math.round(product.rating)
                  ? "text-amber-400 fill-amber-400"
                  : "text-muted-foreground/30"
              }
            />
          ))}
          <span className="text-xs text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-extrabold text-foreground">
            {product.price.toFixed(2)}
          </span>
          <span className="text-sm text-foreground/60">TND</span>
          {hasPromo && (
            <span className="text-sm text-muted-foreground line-through">
              {product.originalPrice!.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock & delivery */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span
            className={`flex items-center gap-1 font-medium ${product.inStock ? "text-emerald-600 dark:text-emerald-500" : "text-red-500"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-emerald-500" : "bg-red-400"}`}
            />
            {product.inStock ? "En stock" : "Indisponible"}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className="mt-auto flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={15} />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

// ─── Add to Cart Toast ─────────────────────────────────────────────────────────
function CartToast({
  product,
  onClose,
}: {
  product: ParamedicalProduct;
  onClose: () => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 bg-card border border-border shadow-2xl rounded-2xl p-4 max-w-xs animate-in slide-in-from-bottom-4">
      <img
        src={product.imageUrl}
        alt=""
        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
          Réservé ✓
        </p>
        <p className="text-sm font-semibold text-foreground line-clamp-1">
          {product.name}
        </p>
        <Link
          to="/pharmacy"
          className="text-xs text-primary hover:underline mt-1 block"
          onClick={onClose}
        >
          Voir la pharmacie →
        </Link>
      </div>
      <button
        onClick={onClose}
        className="text-muted-foreground hover:text-foreground"
      >
        <X size={16} />
      </button>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParamedicalPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceMax, setPriceMax] = useState(700);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [prescriptionFilter, setPrescriptionFilter] = useState<
    "all" | "no-rx" | "rx"
  >("all");
  const [sort, setSort] = useState<
    "price-asc" | "price-desc" | "rating" | "name"
  >("rating");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [toastProduct, setToastProduct] = useState<ParamedicalProduct | null>(
    null,
  );

  const handleAddToCart = (product: ParamedicalProduct) => {
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
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q),
      );
    }
    if (selectedCategory !== "Tous")
      result = result.filter((p) => p.category === selectedCategory);
    result = result.filter((p) => p.price <= priceMax);
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);
    if (inStockOnly) result = result.filter((p) => p.inStock);
    if (prescriptionFilter === "no-rx")
      result = result.filter((p) => !p.prescription);
    if (prescriptionFilter === "rx")
      result = result.filter((p) => p.prescription);

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
    else result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [
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

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">Catégories</h4>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${
              selectedCategory === cat.name
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary/50 text-foreground/80"
            }`}
          >
            <span>
              {cat.icon} {cat.name}
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                selectedCategory === cat.name
                  ? "bg-primary/20"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Price */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold text-foreground">Prix max</h4>
          <span className="text-sm font-bold text-primary">{priceMax} TND</span>
        </div>
        <input
          type="range"
          min={10}
          max={700}
          step={10}
          value={priceMax}
          onChange={(e) => setPriceMax(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>10 TND</span>
          <span>700 TND</span>
        </div>
      </div>

      {/* Note minimum */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">Note minimum</h4>
        <div className="flex gap-2 flex-wrap">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(r)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                minRating === r
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground/80 hover:bg-secondary/70"
              }`}
            >
              {r === 0 ? "Tous" : `${r}+ ★`}
            </button>
          ))}
        </div>
      </div>

      {/* Disponibilité */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">
          Disponibilité
        </h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
              inStockOnly ? "bg-primary" : "bg-secondary"
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                inStockOnly ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </div>
          <span className="text-sm text-foreground/80">
            En stock uniquement
          </span>
        </label>
      </div>

      {/* Ordonnance */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">Ordonnance</h4>
        {[
          { value: "all", label: "Tous les produits" },
          { value: "no-rx", label: "Sans ordonnance" },
          { value: "rx", label: "Sur ordonnance" },
        ].map(({ value, label }) => (
          <label
            key={value}
            className="flex items-center gap-2 mb-2 cursor-pointer group"
          >
            <input
              type="radio"
              name="prescription"
              checked={prescriptionFilter === value}
              onChange={() =>
                setPrescriptionFilter(value as typeof prescriptionFilter)
              }
              className="accent-primary"
            />
            <span className="text-sm text-foreground/80 group-hover:text-foreground transition">
              {label}
            </span>
          </label>
        ))}
      </div>

      <button
        onClick={resetFilters}
        className="w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Paramédicaux & Soins</h1>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Matériel médical, orthopédie, soins à domicile et bien-être.
                Disponible dans vos pharmacies partenaires.
              </p>
            </div>
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un produit, une marque..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile filter toggle & cart */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              produit{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/pharmacy"
                className="relative flex items-center gap-1.5 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition"
              >
                <ShoppingCart size={15} />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                Réservations
              </Link>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition"
              >
                <SlidersHorizontal size={15} />
                Filtres
              </button>
            </div>
          </div>

          {showMobileFilters && (
            <div className="lg:hidden mb-6 p-6 bg-card border border-border rounded-xl">
              <FilterSidebar />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Filtres</h3>
                  <Link
                    to="/pharmacy"
                    className="relative flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition"
                  >
                    <ShoppingCart size={13} />
                    Réservations
                    {cartCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
                <FilterSidebar />
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground hidden lg:block">
                  <span className="font-semibold text-foreground">
                    {filtered.length}
                  </span>{" "}
                  produit{filtered.length !== 1 ? "s" : ""}
                </p>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="rating">Mieux notés</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name">Nom A–Z</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center space-y-4">
                  <Package
                    size={48}
                    className="mx-auto text-muted-foreground/40"
                  />
                  <p className="text-lg font-medium text-foreground">
                    Aucun produit trouvé
                  </p>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos filtres
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
                  >
                    Réinitialiser
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ── Trust bar ── */}
      <div className="border-t border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            {
              icon: <Shield size={22} className="text-primary mx-auto mb-2" />,
              title: "Retrait dans votre pharmacie",
              desc: "Disponible chez nos pharmacies partenaires",
            },
            {
              icon: (
                <Activity size={22} className="text-primary mx-auto mb-2" />
              ),
              title: "Service client médical",
              desc: "Conseils 7j/7 de 8h à 20h",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title}>
              {icon}
              <p className="font-bold text-foreground text-sm">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cart toast */}
      {toastProduct && (
        <CartToast
          product={toastProduct}
          onClose={() => setToastProduct(null)}
        />
      )}

      <Footer />
    </div>
  );
}
