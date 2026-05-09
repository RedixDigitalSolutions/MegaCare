import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";
import {
  Search,
  ShoppingCart,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  X,
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
  ChevronRight,
  Info,
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

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: ParamedicalProduct;
  onClose: () => void;
  onAddToCart: (p: ParamedicalProduct) => void;
}) {
  const [visible, setVisible] = useState(false);
  const hasPromo = !!product.originalPrice;
  const promoPercent = hasPromo
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all duration-300 ${visible ? "bg-black/65 backdrop-blur-md" : "bg-black/0 backdrop-blur-none"}`}
      onClick={onClose}
    >
      <div
        className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.45)] transition-all duration-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero image */}
        <div className="relative h-52 bg-secondary overflow-hidden">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary/40 flex items-center justify-center">
              <Package size={56} className="text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          {hasPromo && (
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">-{promoPercent}%</span>
            </div>
          )}
          {product.prescription && (
            <span className="absolute top-4 right-14 px-2.5 py-1 border border-amber-400 text-amber-300 text-xs font-medium rounded-full bg-black/40 backdrop-blur-sm">
              Ordonnance
            </span>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/50 transition-all"
          >
            <X size={16} />
          </button>
          {/* Name overlay at bottom of image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-xs font-semibold text-white/70 uppercase tracking-wide mb-0.5">{product.brand}</p>
            <h2 className="text-lg font-bold text-white leading-snug drop-shadow-md">{product.name}</h2>
          </div>
        </div>

        {/* Body */}
        <div className="bg-card p-5 space-y-4">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-foreground">{product.price.toFixed(2)}</span>
            <span className="text-base text-muted-foreground">TND</span>
            {hasPromo && <span className="text-sm text-muted-foreground line-through ml-1">{product.originalPrice!.toFixed(2)} TND</span>}
          </div>

          {product.shortDesc && (
            <p className="text-sm text-muted-foreground leading-relaxed">{product.shortDesc}</p>
          )}

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{product.description}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { onAddToCart(product); onClose(); }}
              disabled={!product.inStock}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingCart size={15} />
              Ajouter au panier
            </button>
            <button
              onClick={onClose}
              className="px-5 py-3.5 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:bg-secondary hover:text-foreground transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onAddToCart,
  onOpenModal,
}: {
  product: ParamedicalProduct;
  onAddToCart: (p: ParamedicalProduct) => void;
  onOpenModal: (p: ParamedicalProduct) => void;
}) {
  const hasPromo = !!product.originalPrice;
  const promoPercent = hasPromo
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
      onClick={() => onOpenModal(product)}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-secondary/20">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={48} className="text-muted-foreground/25" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          {hasPromo && (
            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[11px] font-bold rounded-full">-{promoPercent}%</span>
          )}
          {product.prescription && (
            <span className="px-2 py-0.5 border border-amber-400/70 text-amber-300 text-[11px] font-medium rounded-full bg-black/30 backdrop-blur-sm">Ordonnance</span>
          )}
        </div>

        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-3 py-1.5 bg-black/70 text-white text-xs font-semibold rounded-xl">Rupture de stock</span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3">
          <p className="text-[10px] font-semibold text-white/60 uppercase tracking-wide">{product.brand}</p>
          <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 drop-shadow">{product.name}</h3>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Desc */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.shortDesc}</p>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mt-auto">
          <span className="text-xl font-extrabold text-foreground">{product.price.toFixed(2)}</span>
          <span className="text-sm text-muted-foreground">TND</span>
          {hasPromo && (
            <span className="text-xs text-muted-foreground line-through ml-1">{product.originalPrice!.toFixed(2)}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          disabled={!product.inStock}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={14} />
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
  onViewCart,
}: {
  product: ParamedicalProduct;
  onClose: () => void;
  onViewCart: () => void;
}) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 duration-300">
      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
        <CheckCircle size={14} className="text-white" />
      </div>
      <span className="text-sm font-medium max-w-[200px] truncate">{product.name}</span>
      <span className="text-sm text-white/50">ajouté au panier</span>
      <button
        onClick={() => { onViewCart(); onClose(); }}
        className="ml-1 flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold transition-colors"
      >
        <ShoppingBag size={12} /> Voir
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

// ─── Cart Drawer (right-side slide-in, matches Pharmacy cart) ───────────────────
function CartDrawer({
  cart,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: (deliveryMethod: "pickup" | "delivery") => void;
}) {
  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");
  const total = cart.reduce((s, item) => s + item.product.price * item.quantity, 0);
  const DELIVERY_FEE = 8;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative w-full max-w-sm bg-card border-l border-border flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-rose-50/50 dark:bg-rose-950/10">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <ShoppingBag size={18} className="text-rose-600" />
            Parapharmacie ({cart.reduce((s, i) => s + i.quantity, 0)})
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          {cart.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">Votre panier parapharmacie est vide.</p>
          ) : cart.map((item) => (
            <div key={item.product.id} className="bg-rose-50/30 dark:bg-rose-950/10 rounded-lg p-3 space-y-2 border border-rose-200/40">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt="" className="w-10 h-10 rounded-md object-cover shrink-0" />
                  ) : (
                    <Package size={14} className="text-rose-500 mt-0.5 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">{item.product.brand} · {item.product.price.toFixed(2)} DT</p>
                  </div>
                </div>
                <button onClick={() => onRemove(item.product.id)} className="text-muted-foreground hover:text-red-500 transition"><Trash2 size={15} /></button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition"><Minus size={13} /></button>
                  <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                  <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition"><Plus size={13} /></button>
                </div>
                <span className="text-sm font-bold text-foreground">{(item.product.price * item.quantity).toFixed(2)} DT</span>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-5 border-t border-border space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setDeliveryMethod("pickup")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-xs font-semibold ${deliveryMethod === "pickup" ? "border-rose-500 bg-rose-50/60 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400" : "border-border hover:border-rose-300 text-muted-foreground"}`}
              >
                <Store size={18} />
                Retrait sur place
              </button>
              <button
                onClick={() => setDeliveryMethod("delivery")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition text-xs font-semibold ${deliveryMethod === "delivery" ? "border-rose-500 bg-rose-50/60 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400" : "border-border hover:border-rose-300 text-muted-foreground"}`}
              >
                <Truck size={18} />
                Livraison (+8 DT)
              </button>
            </div>
            <div className="flex justify-between font-bold text-foreground text-sm">
              <span>Total{deliveryMethod === "delivery" ? " + livraison" : ""}</span>
              <span>{(total + (deliveryMethod === "delivery" ? DELIVERY_FEE : 0)).toFixed(2)} DT</span>
            </div>
            <button
              onClick={() => onCheckout(deliveryMethod)}
              className="w-full py-3 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition text-sm flex items-center justify-center gap-2"
            >
              {deliveryMethod === "pickup" ? (
                <><Store size={16} /> Choisir un fournisseur</>
              ) : (
                <><Truck size={16} /> Passer la commande</>
              )}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

// ─── Checkout Modal ─────────────────────────────────────────────────────────────
function CheckoutModal({
  cart,
  onClose,
  onUpdateQty,
  onRemove,
  onOrder,
  initialDeliveryMethod,
  userGovernorate,
  userDelegation,
}: {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, qty: number) => void;
  onRemove: (productId: string) => void;
  onOrder: (data: { deliveryMethod: string; deliveryAddress: string; deliveryGovernorate: string; deliveryDelegation: string; deliveryPhone: string; pickupProviderId?: string }) => Promise<boolean>;
  initialDeliveryMethod: "pickup" | "delivery";
  userGovernorate?: string;
  userDelegation?: string;
}) {
  const [step, setStep] = useState<"provider" | "checkout" | "success">(
    initialDeliveryMethod === "pickup" ? "provider" : "checkout"
  );
  const [deliveryMethod] = useState<"pickup" | "delivery">(initialDeliveryMethod);
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
            {step === "provider" ? "Choisir un fournisseur" : "Finaliser la commande"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        {step === "provider" ? (
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
              <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-xl font-medium text-sm hover:bg-secondary/50 transition">
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
              <button onClick={() => deliveryMethod === "pickup" ? setStep("provider") : onClose()} className="flex-1 py-2.5 border border-border rounded-xl font-medium text-sm hover:bg-secondary/50 transition">
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
    fetch("/api/public/parapharmacy-products")
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
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedDelegation, setSelectedDelegation] = useState("");
  const [prescriptionFilter, setPrescriptionFilter] = useState<
    "all" | "no-rx" | "rx"
  >("all");
  const [sort, setSort] = useState<
    "price-asc" | "price-desc" | "name"
  >("price-asc");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ParamedicalProduct | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      if (!localStorage.getItem("megacare_token")) return [];
      const saved = localStorage.getItem("megacare_para_cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [checkoutDelivery, setCheckoutDelivery] = useState<"pickup" | "delivery">("pickup");
  const [showCheckout, setShowCheckout] = useState(false);
  const [toastProduct, setToastProduct] = useState<ParamedicalProduct | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = cart.reduce((s, item) => s + item.quantity, 0);

  // Load para cart from DB on mount (per-user persistence)
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("megacare_token");
    if (!token) return;
    fetch("/api/cart", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.paraItems?.length) {
          setCart(data.paraItems);
          localStorage.setItem("megacare_para_cart", JSON.stringify(data.paraItems));
        }
      })
      .catch(() => { });
  }, [isAuthenticated]);

  // Persist cart to localStorage & broadcast count to Header + save to DB (debounced)
  useEffect(() => {
    localStorage.setItem("megacare_para_cart", JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent("megacare:cart", {
      detail: { paramedical: cartCount },
    }));
    if (!isAuthenticated) return;
    if (cartSaveTimer.current) clearTimeout(cartSaveTimer.current);
    cartSaveTimer.current = setTimeout(() => {
      const token = localStorage.getItem("megacare_token");
      if (!token) return;
      fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ paraItems: cart }),
      }).catch(() => { });
    }, 1000);
  }, [cart, cartCount, isAuthenticated]);

  // Open cart from Header navigation (query param)
  useEffect(() => {
    if (searchParams.get("openCart")) {
      setCartDrawerOpen(true);
      searchParams.delete("openCart");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams]);

  // Listen for "open cart" requests from Header
  useEffect(() => {
    const handler = (e: Event) => {
      const type = (e as CustomEvent).detail;
      if (type === "paramedical") setCartDrawerOpen(true);
    };
    window.addEventListener("megacare:open-cart", handler);
    return () => window.removeEventListener("megacare:open-cart", handler);
  }, []);

  const handleOpenCheckout = (deliveryMethod: "pickup" | "delivery") => {
    setCheckoutDelivery(deliveryMethod);
    setCartDrawerOpen(false);
    setShowCheckout(true);
  };

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
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastProduct(product);
    toastTimerRef.current = setTimeout(() => setToastProduct(null), 2500);
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
    if (prescriptionFilter === "no-rx")
      result = result.filter((p) => !p.prescription);
    if (prescriptionFilter === "rx")
      result = result.filter((p) => p.prescription);

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [
    products,
    query,
    selectedCategory,
    prescriptionFilter,
    sort,
  ]);

  const resetFilters = () => {
    setQuery("");
    setSelectedCategory("Tous");
    setPrescriptionFilter("all");
    setSort("price-asc");
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
        <section className="relative overflow-hidden bg-gray-950 py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-950 via-gray-900 to-purple-950" />
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(ellipse at 20% 60%, #e11d48 0%, transparent 45%), radial-gradient(ellipse at 80% 15%, #9333ea 0%, transparent 40%)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-white/70 text-xs font-medium mb-1 backdrop-blur-sm">
                <ShoppingBag size={13} /> Bien-être & Soins
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Parapharmacie
              </h1>
              <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Matériel médical, orthopédie, soins à domicile et bien-être — disponible chez vos fournisseurs partenaires.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" size={17} />
              <input
                type="text"
                placeholder="Rechercher un produit, une marque…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 backdrop-blur-sm text-sm transition-all"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <MapPin size={14} className="text-white/50 shrink-0" />
                <select
                  value={selectedGovernorate}
                  onChange={(e) => { setSelectedGovernorate(e.target.value); setSelectedDelegation(""); }}
                  className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" className="text-foreground bg-gray-900">Toutes les régions</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g} className="text-foreground bg-gray-900">{g}</option>
                  ))}
                </select>
              </div>
              {selectedGovernorate && DELEGATIONS[selectedGovernorate] && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                  <MapPin size={13} className="text-white/50 shrink-0" />
                  <select
                    value={selectedDelegation}
                    onChange={(e) => setSelectedDelegation(e.target.value)}
                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="" className="text-foreground bg-gray-900">Toutes les délégations</option>
                    {DELEGATIONS[selectedGovernorate].map((d) => (
                      <option key={d} value={d} className="text-foreground bg-gray-900">{d}</option>
                    ))}
                  </select>
                </div>
              )}
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
                      onOpenModal={setSelectedProduct}
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

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart toast */}
      {toastProduct && (
        <CartToast
          product={toastProduct}
          onClose={() => setToastProduct(null)}
          onViewCart={() => { setToastProduct(null); setCartDrawerOpen(true); }}
        />
      )}

      {/* Cart drawer (slide-in from right) */}
      {cartDrawerOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setCartDrawerOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onCheckout={handleOpenCheckout}
        />
      )}

      {/* Checkout modal (provider/details steps) */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemoveFromCart}
          onOrder={handleOrder}
          initialDeliveryMethod={checkoutDelivery}
          userGovernorate={selectedGovernorate || user?.governorate}
          userDelegation={selectedDelegation || user?.delegation}
        />
      )}

      <Footer />
    </div>
  );
}
