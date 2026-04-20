import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";
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
  Loader2,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Truck,
  Store,
  CheckCircle,
  Phone,
  Clock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ParamedicalProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  stockQty: number;
  prescription: boolean;
  imageUrl: string;
  shortDesc: string;
  deliveryDays: string;
}

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

// ─── Cart Item type ────────────────────────────────────────────────────────────
interface CartItem {
  product: ParamedicalProduct;
  quantity: number;
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
          Ajouté au panier ✓
        </p>
        <p className="text-sm font-semibold text-foreground line-clamp-1">
          {product.name}
        </p>
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

// ─── Provider option type ──────────────────────────────────────────────────────
interface ProviderOption {
  id: string;
  name: string;
  address: string;
  phone: string;
  openingHours: string;
  governorate: string;
  delegation: string;
}

// ─── Checkout Modal ─────────────────────────────────────────────────────────────
function CheckoutModal({
  cart,
  onClose,
  onUpdateQty,
  onRemove,
  onOrder,
  userGovernorate,
  userDelegation,
}: {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onOrder: (data: { deliveryMethod: string; deliveryAddress: string; deliveryGovernorate: string; deliveryDelegation: string; deliveryPhone: string; pickupProviderId?: string }) => Promise<boolean>;
  userGovernorate?: string;
  userDelegation?: string;
}) {
  const [step, setStep] = useState<"cart" | "provider" | "checkout" | "success">("cart");
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [governorate, setGovernorate] = useState(userGovernorate || "");
  const [delegation, setDelegation] = useState(userDelegation || "");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Provider picker state
  const [availableProviders, setAvailableProviders] = useState<ProviderOption[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<ProviderOption | null>(null);
  const [loadingProviders, setLoadingProviders] = useState(false);

  const total = cart.reduce((s, item) => s + item.product.price * item.quantity, 0);
  const DELIVERY_FEE = 8;
  const grandTotal = total + (deliveryMethod === "delivery" ? DELIVERY_FEE : 0);

  // Fetch providers when entering provider step
  useEffect(() => {
    if (step !== "provider") return;
    setLoadingProviders(true);
    const params = new URLSearchParams();
    if (governorate) params.set("governorate", governorate);
    if (delegation) params.set("delegation", delegation);
    fetch(`/api/public/paramedical-providers?${params}`)
      .then((r) => r.json())
      .then((data) => setAvailableProviders(Array.isArray(data) ? data : []))
      .catch(() => setAvailableProviders([]))
      .finally(() => setLoadingProviders(false));
  }, [step, governorate, delegation]);

  const validatePhone = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) return "Le numéro de téléphone est requis.";
    if (digits.length !== 8) return "Le numéro doit contenir exactement 8 chiffres.";
    return "";
  };

  const handleSubmit = async () => {
    const err = validatePhone(phone);
    if (err) { setPhoneError(err); return; }
    setPhoneError("");
    setSubmitting(true);
    const ok = await onOrder({
      deliveryMethod,
      deliveryAddress: address,
      deliveryGovernorate: governorate,
      deliveryDelegation: delegation,
      deliveryPhone: phone,
      pickupProviderId: deliveryMethod === "pickup" && selectedProvider ? selectedProvider.id : undefined,
    });
    setSubmitting(false);
    if (ok) setStep("success");
  };

  const handleProceedFromCart = () => {
    if (deliveryMethod === "pickup") {
      setStep("provider");
    } else {
      setStep("checkout");
    }
  };

  if (step === "success") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-card rounded-2xl p-8 max-w-md w-full mx-4 text-center space-y-4" onClick={(e) => e.stopPropagation()}>
          <CheckCircle size={48} className="mx-auto text-emerald-500" />
          <h2 className="text-xl font-bold text-foreground">Commande confirmée !</h2>
          <p className="text-muted-foreground">
            {deliveryMethod === "pickup"
              ? `Votre commande sera prête pour le retrait chez ${selectedProvider?.name || "le fournisseur"}. Vous recevrez une notification.`
              : "Votre commande sera livrée à l'adresse indiquée."}
          </p>
          <button onClick={onClose} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition">
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-card rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {step === "cart" ? `Panier (${cart.length})` : step === "provider" ? "Choisir un fournisseur" : "Finaliser la commande"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        {step === "cart" ? (
          <div className="p-4 space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Votre panier est vide</p>
            ) : (
              <>
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                    <img src={item.product.imageUrl} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                      <p className="text-sm font-bold text-primary mt-0.5">{(item.product.price * item.quantity).toFixed(2)} TND</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition">
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-secondary transition">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => onRemove(item.product.id)} className="text-muted-foreground hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-bold text-foreground">Total articles</span>
                  <span className="text-xl font-bold text-primary">{total.toFixed(2)} TND</span>
                </div>
                {deliveryMethod === "delivery" && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
                    <Truck size={18} className="text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Frais de livraison à domicile</p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">Sera ajouté au total de votre commande</p>
                    </div>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-300">+8,00 DT</span>
                  </div>
                )}

                {/* Delivery Method */}
                <div>
                  <h3 className="text-sm font-bold text-foreground mb-3">Mode de récupération</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    >
                      <Store size={24} className={deliveryMethod === "pickup" ? "text-primary" : "text-muted-foreground"} />
                      <span className="text-sm font-semibold">Retrait sur place</span>
                      <span className="text-xs text-muted-foreground">Gratuit</span>
                    </button>
                    <button
                      onClick={() => setDeliveryMethod("delivery")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${deliveryMethod === "delivery" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    >
                      <Truck size={24} className={deliveryMethod === "delivery" ? "text-primary" : "text-muted-foreground"} />
                      <span className="text-sm font-semibold">Livraison</span>
                      <span className="text-xs text-muted-foreground">+8 DT</span>
                    </button>
                  </div>
                </div>

                <button onClick={handleProceedFromCart} className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition">
                  {deliveryMethod === "pickup" ? "Choisir un fournisseur" : "Passer la commande"}
                </button>
              </>
            )}
          </div>
        ) : step === "provider" ? (
          /* ── Provider Picker Step ── */
          <div className="p-4 space-y-4">
            {loadingProviders ? (
              <div className="flex justify-center py-12">
                <Loader2 size={32} className="animate-spin text-primary" />
              </div>
            ) : availableProviders.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <MapPin size={32} className="mx-auto text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Aucun fournisseur trouvé dans cette zone</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[50vh] overflow-y-auto">
                {availableProviders.map((prov) => (
                  <button
                    key={prov.id}
                    onClick={() => setSelectedProvider(prov)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition ${selectedProvider?.id === prov.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{prov.name}</p>
                        {prov.address && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <MapPin size={12} /> {prov.address}
                          </p>
                        )}
                        {prov.phone && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Phone size={12} /> {prov.phone}
                          </p>
                        )}
                        {prov.openingHours && (
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Clock size={12} /> {prov.openingHours}
                          </p>
                        )}
                      </div>
                      {selectedProvider?.id === prov.id && (
                        <CheckCircle size={20} className="text-primary flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setStep("cart")} className="flex-1 py-2.5 border border-border rounded-xl font-medium text-sm hover:bg-secondary/50 transition">
                Retour
              </button>
              <button
                onClick={() => setStep("checkout")}
                disabled={!selectedProvider}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuer
              </button>
            </div>
          </div>
        ) : (
          /* ── Checkout Details Step ── */
          <div className="p-4 space-y-4">
            {/* Selected provider for pickup */}
            {deliveryMethod === "pickup" && selectedProvider && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-primary">Retrait chez</p>
                    <p className="font-semibold text-foreground">{selectedProvider.name}</p>
                    {selectedProvider.address && <p className="text-xs text-muted-foreground">{selectedProvider.address}</p>}
                  </div>
                  <button onClick={() => setStep("provider")} className="text-xs text-primary hover:underline font-medium">
                    Changer
                  </button>
                </div>
              </div>
            )}

            {/* Delivery address fields */}
            {deliveryMethod === "delivery" && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-foreground">Gouvernorat</label>
                  <select value={governorate} onChange={(e) => { setGovernorate(e.target.value); setDelegation(""); }} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="">Sélectionner...</option>
                    {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                {governorate && DELEGATIONS[governorate] && (
                  <div>
                    <label className="text-xs font-medium text-foreground">Délégation</label>
                    <select value={delegation} onChange={(e) => setDelegation(e.target.value)} className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="">Sélectionner...</option>
                      {DELEGATIONS[governorate].map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-foreground">Adresse complète</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rue, numéro, immeuble..." className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            )}

            {/* Phone */}
            <div>
              <label className="text-xs font-medium text-foreground">Téléphone <span className="text-muted-foreground font-normal">(8 chiffres)</span></label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(validatePhone(e.target.value)); }}
                onBlur={(e) => setPhoneError(validatePhone(e.target.value))}
                maxLength={8}
                placeholder="XX XXX XXX"
                className={`w-full mt-1 px-3 py-2 bg-background border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary ${phoneError ? "border-red-500 focus:ring-red-500" : "border-border"}`}
              />
              {phoneError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><span>⚠</span> {phoneError}</p>}
            </div>

            {/* Summary */}
            <div className="bg-secondary/30 rounded-xl p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{cart.length} article{cart.length > 1 ? "s" : ""}</span>
                <span className="font-semibold text-foreground">{total.toFixed(2)} TND</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{deliveryMethod === "pickup" ? "Retrait sur place" : "Livraison"}</span>
                <span className="text-sm font-semibold text-foreground">{deliveryMethod === "pickup" ? "Gratuit" : "+8,00 DT"}</span>
              </div>
              {deliveryMethod === "delivery" && (
                <div className="flex justify-between text-sm border-t border-border pt-1 mt-1">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-bold text-primary">{grandTotal.toFixed(2)} TND</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(deliveryMethod === "pickup" ? "provider" : "cart")} className="flex-1 py-2.5 border border-border rounded-xl font-medium text-sm hover:bg-secondary/50 transition">
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || (deliveryMethod === "delivery" && !address) || !!phoneError}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Envoi…" : `Confirmer — ${grandTotal.toFixed(2)} TND`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParamedicalPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<ParamedicalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/public/paramedical-products")
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () =>
      categoryMeta.map((cat) => ({
        ...cat,
        count:
          cat.name === "Tous"
            ? products.length
            : products.filter((p) => p.category === cat.name).length,
      })),
    [products],
  );

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
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("megacare_para_cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [toastProduct, setToastProduct] = useState<ParamedicalProduct | null>(null);

  const cartCount = cart.reduce((s, item) => s + item.quantity, 0);

  // Persist cart to localStorage & broadcast count to Header
  useEffect(() => {
    localStorage.setItem("megacare_para_cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("megacare:cart", {
      detail: { paramedical: cartCount },
    }));
  }, [cart, cartCount]);

  // Open cart from Header navigation (query param)
  useEffect(() => {
    if (searchParams.get("openCart")) {
      setShowCheckout(true);
      searchParams.delete("openCart");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  // Listen for "open cart" requests from Header
  useEffect(() => {
    const handler = (e: Event) => {
      const type = (e as CustomEvent).detail;
      if (type === "paramedical") setShowCheckout(true);
    };
    window.addEventListener("megacare:open-cart", handler);
    return () => window.removeEventListener("megacare:open-cart", handler);
  }, []);

  const handleAddToCart = (product: ParamedicalProduct) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setToastProduct(product);
    setTimeout(() => setToastProduct(null), 3500);
  };

  const handleUpdateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) => prev.map((item) => item.product.id === productId ? { ...item, quantity: qty } : item));
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleOrder = async (data: { deliveryMethod: string; deliveryAddress: string; deliveryGovernorate: string; deliveryDelegation: string; deliveryPhone: string; pickupProviderId?: string }): Promise<boolean> => {
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/public/paramedical-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item.product.id, name: item.product.name, quantity: item.quantity })),
          ...data,
        }),
      });
      if (res.ok) {
        setCart([]);
        localStorage.removeItem("megacare_para_cart");
        return true;
      }
    } catch {
      /* ignore */
    }
    return false;
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

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-bold text-foreground mb-3">Catégories</h4>
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm transition-colors mb-1 ${selectedCategory === cat.name
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary/50 text-foreground/80"
              }`}
          >
            <span>
              {cat.icon} {cat.name}
            </span>
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === cat.name
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
              className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${minRating === r
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
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${inStockOnly ? "bg-primary" : "bg-secondary"
              }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-5" : "translate-x-0.5"
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

              {loading ? (
                <div className="flex justify-center items-center py-24">
                  <Loader2 size={40} className="animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
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
              icon: <Store size={22} className="text-primary mx-auto mb-2" />,
              title: "Retrait sur place",
              desc: "Récupérez votre commande en point de vente",
            },
            {
              icon: <Truck size={22} className="text-primary mx-auto mb-2" />,
              title: "Livraison à domicile",
              desc: "Faites-vous livrer vos produits paramédicaux",
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

      {/* Checkout modal */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onOrder={handleOrder}
          userGovernorate={user?.governorate}
          userDelegation={user?.delegation}
        />
      )}

      <Footer />
    </div>
  );
}
