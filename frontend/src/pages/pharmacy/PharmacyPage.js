import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, Star, ShoppingCart, Pill, MapPin, Clock, Phone, CheckCircle, X, Plus, Minus, Trash2, Store, Stethoscope, AlertTriangle } from "lucide-react";
import { MedicineModal, type Medicine } from "@/components/MedicineModal";
import { useAuth } from "@/contexts/AuthContext";
import { QRCodeSVG } from "qrcode.react";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  brand: string;
  pharmacy: string;
  pharmacyId: string;
  prescription: boolean;
}

interface OrderConfirmation {
  orderCode: string;
  total: number;
  deliveryMethod: string;
  pharmacyName: string;
  pharmacyMapsUrl?: string;
  items: CartItem[];
}

export default function PharmacyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState<"price" | "rating">("price");
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedDelegation, setSelectedDelegation] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [medicines, setMedicines] = useState<(Medicine & { pharmacyId?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  // Dual cart state — Pharmacy (prescription) vs Parapharmacy (OTC)
  const [pharmaCart, setPharmaCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("megacare_pharma_cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [pharmaCartOpen, setPharmaCartOpen] = useState(false);

  // Broadcast cart counts to Header via custom events + persist to localStorage
  useEffect(() => {
    localStorage.setItem("megacare_pharma_cart", JSON.stringify(pharmaCart));
    localStorage.removeItem("megacare_parapharma_cart");
    window.dispatchEvent(new CustomEvent("megacare:cart", {
      detail: { pharma: pharmaCart.length, para: 0 },
    }));
  }, [pharmaCart]);

  // Listen for "open cart" requests from Header
  useEffect(() => {
    const handler = (e: Event) => {
      const type = (e as CustomEvent).detail;
      if (type === "pharma" || type === "para") setPharmaCartOpen(true);
    };
    window.addEventListener("megacare:open-cart", handler);
    return () => window.removeEventListener("megacare:open-cart", handler);
  }, []);

  // Open cart from Header navigation (query param)
  useEffect(() => {
    const openCart = searchParams.get("openCart");
    if (openCart === "pharma" || openCart === "para") { setPharmaCartOpen(true); searchParams.delete("openCart"); setSearchParams(searchParams, { replace: true }); }
  }, [searchParams]);
  const [checkoutOpen, setCheckoutOpen] = useState<"pharma" | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Order confirmation
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  // Auto-select patient's governorate
  useEffect(() => {
    if (user?.governorate && !selectedGovernorate) {
      setSelectedGovernorate(user.governorate);
    }
  }, [user]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGovernorate) params.set("governorate", selectedGovernorate);
      if (selectedDelegation) params.set("delegation", selectedDelegation);
      const res = await fetch(`/api/public/pharmacy-products?${params}`);
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json.data ?? []);
        setMedicines(
          data.map((p: any) => ({
            id: String(p._id ?? p.id),
            name: p.name,
            form: p.form || "",
            brand: p.brand || "",
            dci: p.dci || "",
            price: p.price,
            rating: p.rating ?? 0,
            reviews: p.reviews ?? 0,
            available: p.stock ?? 0,
            prescription: p.requiresPrescription ?? false,
            pharmacy: p.pharmacy || "",
            pharmacyId: p.pharmacyId || "",
            pharmacyAddress: p.pharmacyAddress || "",
            pharmacyPhone: p.pharmacyPhone || "",
            pharmacyOpeningHours: p.pharmacyOpeningHours || "",
            pharmacyIsOnDuty: p.pharmacyIsOnDuty || false,
            description: p.description || "",
            imageUrl: p.imageUrl || "",
            category: p.category || "",
          })),
        );
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  }, [selectedGovernorate, selectedDelegation]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Clear carts when governorate/delegation changes
  const prevGovRef = useRef(selectedGovernorate);
  const prevDelRef = useRef(selectedDelegation);
  useEffect(() => {
    if ((prevGovRef.current !== selectedGovernorate && prevGovRef.current !== "") ||
        (prevDelRef.current !== selectedDelegation && prevDelRef.current !== "")) {
      setPharmaCart([]);
    }
    prevGovRef.current = selectedGovernorate;
    prevDelRef.current = selectedDelegation;
  }, [selectedGovernorate, selectedDelegation]);

  const handleOpenModal = (med: Medicine) => {
    setSelectedMedicine(med);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMedicine(null);
  };

  const addToCart = (med: Medicine & { pharmacyId?: string }) => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    const isPrescription = med.prescription ?? false;

    setPharmaCart((prev) => {
      const existing = prev.find((c) => c.id === med.id);
      if (existing) {
        return prev.map((c) => c.id === med.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, {
        id: String(med.id),
        name: med.name,
        price: med.price,
        quantity: 1,
        brand: med.brand,
        pharmacy: med.pharmacy || "",
        pharmacyId: (med as any).pharmacyId || "",
        prescription: isPrescription,
      }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setPharmaCart((prev) =>
      prev.map((c) => c.id === id ? { ...c, quantity: Math.max(1, c.quantity + delta) } : c)
    );
  };

  const removeFromCart = (id: string) => {
    setPharmaCart((prev) => prev.filter((c) => c.id !== id));
  };

  const pharmaTotal = pharmaCart.reduce((s, c) => s + c.price * c.quantity, 0);

  // Pharmacy picker state for checkout
  interface PharmacyOption { id: string; name: string; address: string; phone: string; openingHours: string; isOnDuty: boolean; governorate: string; delegation: string; mapsUrl?: string; }
  const [availablePharmacies, setAvailablePharmacies] = useState<PharmacyOption[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyOption | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"pharmacy" | "details">("pharmacy");
  const [loadingPharmacies, setLoadingPharmacies] = useState(false);

  // Fetch pharmacies when checkout opens
  useEffect(() => {
    if (!checkoutOpen) return;
    // Always pick a pharmacy first — even for delivery (pharmacy processes the order)
    setCheckoutStep("pharmacy");
    setSelectedPharmacy(null);
    setLoadingPharmacies(true);
    const params = new URLSearchParams();
    if (selectedGovernorate) params.set("governorate", selectedGovernorate);
    if (selectedDelegation) params.set("delegation", selectedDelegation);
    fetch(`/api/pharmacies?${params}`)
      .then((r) => r.json())
      .then((list) => setAvailablePharmacies(Array.isArray(list) ? list : []))
      .catch(() => setAvailablePharmacies([]))
      .finally(() => setLoadingPharmacies(false));
  }, [checkoutOpen]);

  const handleCheckout = async () => {
    const cart = pharmaCart;
    const setTargetCart = setPharmaCart;
    const effectiveMethod = "pickup";

    if (cart.length === 0) return;
    if (!selectedPharmacy) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/pharmacy/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          items: cart.map((c) => ({ productId: c.id, name: c.name, quantity: c.quantity })),
          pharmacyId: selectedPharmacy?.id || undefined,
          deliveryMethod: "pickup",
          deliveryGovernorate: selectedGovernorate,
          deliveryDelegation: selectedDelegation,
        }),
      });
      if (res.ok) {
        const order = await res.json();
        setConfirmation({
          orderCode: order.orderCode,
          total: order.total,
          deliveryMethod: order.deliveryMethod,
          pharmacyName: selectedPharmacy?.name || "",
          pharmacyMapsUrl: selectedPharmacy?.mapsUrl || "",
          items: [...cart],
        });
        setTargetCart([]);
        setCheckoutOpen(null);
        setSelectedPharmacy(null);
      }
    } catch {
      /* ignore */
    }
    setSubmitting(false);
  };

  const categories = [
    { name: "Tous", count: medicines.length, icon: "💊" },
    { name: "Avec ordonnance", count: medicines.filter((m) => m.prescription).length, icon: "📋" },
    { name: "Sans ordonnance", count: medicines.filter((m) => !m.prescription).length, icon: "✓" },
    { name: "Vitamines & Suppléments", count: medicines.filter((m) => m.category?.includes("Vitamine") || m.category?.includes("Supplé")).length, icon: "🌿" },
    { name: "Dermatologie", count: medicines.filter((m) => m.category?.includes("Derm")).length, icon: "🧴" },
    { name: "Grippe & Rhume", count: medicines.filter((m) => m.category?.includes("Grippe") || m.category?.includes("Rhume")).length, icon: "🤧" },
  ];

  const sortedMedicines = [...medicines].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return 0;
  });

  const filteredMedicines = sortedMedicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dci.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" ||
      (selectedCategory === "Avec ordonnance" && med.prescription) ||
      (selectedCategory === "Sans ordonnance" && !med.prescription) ||
      (selectedCategory === "Vitamines & Suppléments" && (med.category?.includes("Vitamine") || med.category?.includes("Supplé"))) ||
      (selectedCategory === "Dermatologie" && med.category?.includes("Derm")) ||
      (selectedCategory === "Grippe & Rhume" && (med.category?.includes("Grippe") || med.category?.includes("Rhume")));
    const matchesPrice =
      med.price >= priceRange[0] && med.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">

        {/* ── Order Confirmation Modal ── */}
        {confirmation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmation(null)} />
            <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-8 max-w-md w-full mx-4 text-center space-y-5">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Commande confirmée !</h2>

              {confirmation.deliveryMethod === "pickup" ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    Présentez ce code ou le QR code à <span className="font-semibold text-foreground">{confirmation.pharmacyName}</span> pour retirer votre commande.
                  </p>
                  {/* QR Code */}
                  <div className="bg-white rounded-xl p-4 inline-block mx-auto">
                    <QRCodeSVG value={confirmation.orderCode} size={160} level="M" />
                  </div>
                  {/* Text code */}
                  <div className="bg-muted/50 rounded-lg px-4 py-3">
                    <p className="text-xs text-muted-foreground mb-1">Code de commande</p>
                    <p className="text-2xl font-mono font-bold text-primary tracking-widest">
                      {confirmation.orderCode}
                    </p>
                  </div>
                  {/* Maps link */}
                  {confirmation.pharmacyMapsUrl && (
                    <a
                      href={confirmation.pharmacyMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                    >
                      <MapPin size={15} />
                      Voir {confirmation.pharmacyName} sur Google Maps
                    </a>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Votre commande sera livrée à l'adresse indiquée. Code de suivi : <span className="font-mono font-bold text-primary">{confirmation.orderCode}</span>
                </p>
              )}

              <div className="text-sm text-muted-foreground">
                Total : <span className="font-bold text-foreground">{confirmation.total.toFixed(2)} DT</span>
                <span className="mx-2">·</span>
                {confirmation.items.length} article{confirmation.items.length !== 1 ? "s" : ""}
              </div>

              <button
                onClick={() => setConfirmation(null)}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition text-sm"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* ── Checkout Modal ── */}
        {checkoutOpen && (() => {
          const cart = pharmaCart;
          const total = pharmaTotal;
          const effectiveMethod = "pickup";
          const grandTotal = total;
          return (
          <div className="fixed inset-0 z-[55] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={() => setCheckoutOpen(null)} />
            <div className="relative bg-card rounded-2xl border border-border shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Stethoscope size={20} className="text-orange-600" />
                  Commande Pharmacie
                </h2>
                <button onClick={() => setCheckoutOpen(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>

              {/* Pharmacy pickup-only notice */}
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                  <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">Retrait en pharmacie uniquement</p>
                    <p className="text-xs text-amber-700 mt-0.5">La livraison de médicaments sur ordonnance n'est pas autorisée. Présentez-vous à la pharmacie avec votre ordonnance.</p>
                  </div>
                </div>

              {/* Items summary */}
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.name} <span className="text-muted-foreground">×{item.quantity}</span></span>
                    <span className="font-medium text-foreground">{(item.price * item.quantity).toFixed(2)} DT</span>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-bold text-foreground">
                  <span>Total</span>
                  <span>{grandTotal.toFixed(2)} DT</span>
                </div>
              </div>

              {/* Pharmacy selection */}
              {checkoutStep === "pharmacy" && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    Choisissez votre pharmacie {selectedGovernorate && <span className="text-muted-foreground font-normal">({selectedGovernorate}{selectedDelegation ? ` — ${selectedDelegation}` : ""})</span>}
                  </p>
                  {loadingPharmacies ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : availablePharmacies.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">Aucune pharmacie trouvée dans cette zone.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {availablePharmacies.map((ph) => (
                        <button
                          key={ph.id}
                          onClick={() => setSelectedPharmacy(ph)}
                          className={`w-full text-left p-3 rounded-xl border-2 transition ${
                            selectedPharmacy?.id === ph.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{ph.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{ph.address}</p>
                              {ph.phone && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Phone size={10} />{ph.phone}</p>}
                              {ph.openingHours && <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Clock size={10} />{ph.openingHours}</p>}
                            </div>
                            {ph.isOnDuty && (
                              <span className="shrink-0 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">De garde</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => { if (selectedPharmacy) setCheckoutStep("details"); }}
                    disabled={!selectedPharmacy}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition text-sm disabled:opacity-50"
                  >
                    Continuer
                  </button>
                </div>
              )}

              {/* Confirm button — visible on details step */}
              {checkoutStep === "details" && (
                <>
                  {selectedPharmacy && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <Store size={18} className="text-green-600 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">{selectedPharmacy.name}</p>
                        <p className="text-xs text-green-700">{selectedPharmacy.address}</p>
                      </div>
                      <button onClick={() => setCheckoutStep("pharmacy")} className="ml-auto text-xs text-primary hover:underline shrink-0">Changer</button>
                    </div>
                  )}
                  <button
                    onClick={handleCheckout}
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition text-sm disabled:opacity-50"
                  >
                    {submitting ? "Traitement..." : `Confirmer — ${grandTotal.toFixed(2)} DT`}
                  </button>
                </>
              )}
            </div>
          </div>
          );
        })()}

        {/* ── Pharmacy Cart Sidebar ── */}
        {pharmaCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-black/40" onClick={() => setPharmaCartOpen(false)} />
            <aside className="relative w-full max-w-sm bg-card border-l border-border flex flex-col shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-orange-50/50 dark:bg-orange-950/10">
                <h2 className="font-bold text-foreground flex items-center gap-2">
                  <Stethoscope size={18} className="text-orange-600" />
                  Pharmacie ({pharmaCart.reduce((s, c) => s + c.quantity, 0)})
                </h2>
                <button onClick={() => setPharmaCartOpen(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
              </div>
              <div className="px-5 py-2 border-b border-border bg-amber-50/80 dark:bg-amber-950/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                  <p className="text-[11px] text-amber-700">Retrait en pharmacie uniquement — livraison non autorisée pour les médicaments</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-2">
                {pharmaCart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-10">Votre panier pharmacie est vide.</p>
                ) : pharmaCart.map((item) => (
                  <div key={item.id} className="bg-orange-50/50 dark:bg-orange-950/10 rounded-lg p-3 space-y-2 border border-orange-200/40">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <Pill size={14} className="text-orange-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.brand} · {item.price.toFixed(2)} DT</p>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500 transition"><Trash2 size={15} /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateCartQty(item.id, -1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition"><Minus size={13} /></button>
                        <span className="text-sm font-bold w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.id, 1)} className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition"><Plus size={13} /></button>
                      </div>
                      <span className="text-sm font-bold text-foreground">{(item.price * item.quantity).toFixed(2)} DT</span>
                    </div>
                  </div>
                ))}
              </div>
              {pharmaCart.length > 0 && (
                <div className="p-5 border-t border-border space-y-3">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>Total</span>
                    <span>{pharmaTotal.toFixed(2)} DT</span>
                  </div>
                  <button onClick={() => { setPharmaCartOpen(false); setCheckoutOpen("pharma"); }}
                    className="w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition text-sm flex items-center justify-center gap-2"
                  >
                    <Store size={16} />
                    Retrait en pharmacie
                  </button>
                </div>
              )}
            </aside>
          </div>
        )}

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Pharmacie</h1>
              <p className="text-lg opacity-90">
                Commandez vos médicaments en ligne — retrait en pharmacie
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom, principe actif, symptôme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Governorate & Delegation Selectors */}
            <div className="flex gap-4 justify-center items-center flex-wrap">
              <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                <MapPin size={16} />
                <select
                  value={selectedGovernorate}
                  onChange={(e) => { setSelectedGovernorate(e.target.value); setSelectedDelegation(""); }}
                  className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" className="text-foreground">Toutes les régions</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g} className="text-foreground">{g}</option>
                  ))}
                </select>
              </div>
              {selectedGovernorate && DELEGATIONS[selectedGovernorate] && (
                <div className="flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
                  <MapPin size={14} />
                  <select
                    value={selectedDelegation}
                    onChange={(e) => setSelectedDelegation(e.target.value)}
                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="" className="text-foreground">Toutes les délégations</option>
                    {DELEGATIONS[selectedGovernorate].map((d) => (
                      <option key={d} value={d} className="text-foreground">{d}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories & Filters */}
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Pill size={18} /> Catégories
                </h3>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`block w-full text-left px-3 py-2 rounded transition ${selectedCategory === cat.name
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground"
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {cat.icon} {cat.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({cat.count})
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground">Prix</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Jusqu'à {priceRange[1]} DT
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "price" | "rating")
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="price">Prix (croissant)</option>
                  <option value="rating">Note (décroissant)</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl overflow-hidden animate-pulse h-72" />
                  ))}
                </div>
              ) : filteredMedicines.length === 0 ? (
                <div className="text-center py-12">
                  <Pill
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground opacity-50"
                  />
                  <p className="text-muted-foreground">
                    Aucun médicament trouvé
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredMedicines.map((med) => {
                    return (
                      <div
                        key={med.id}
                        onClick={() => handleOpenModal(med)}
                        className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col"
                      >
                        {/* Image Area */}
                        <div
                          className={`relative h-40 flex items-center justify-center shrink-0 ${med.prescription
                            ? "bg-gradient-to-br from-orange-50 to-red-100"
                            : "bg-gradient-to-br from-blue-50 to-indigo-100"
                            }`}
                        >
                          {med.imageUrl ? (
                            <img
                              src={med.imageUrl}
                              alt={med.name}
                              className="h-full w-full object-contain p-4"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                              <Pill
                                size={28}
                                className={
                                  med.prescription
                                    ? "text-orange-500"
                                    : "text-primary"
                                }
                              />
                            </div>
                          )}
                          {/* Status Badge */}
                          <div className="absolute top-2.5 left-2.5">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${med.prescription
                                ? "bg-orange-500 text-white"
                                : "bg-green-500 text-white"
                                }`}
                            >
                              {med.prescription ? "📋 Ordon." : "✓ Libre"}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 space-y-2.5 flex flex-col flex-1">
                          {/* Title & Brand */}
                          <div>
                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-sm leading-tight line-clamp-2">
                              {med.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {med.form}
                            </p>
                            <span className="inline-block text-xs font-medium bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded mt-1">
                              {med.brand}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-muted-foreground line-clamp-1 italic flex-1">
                            {med.description}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={11}
                                  className={
                                    i < Math.floor(med.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200"
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-foreground">
                              {med.rating}
                            </span>
                          </div>

                          {/* Pharmacy Info */}
                          {med.pharmacy && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <MapPin size={11} className="text-primary shrink-0" />
                              <span className="text-xs text-muted-foreground truncate">{med.pharmacy}</span>
                            </div>
                            {(med as any).pharmacyOpeningHours && (
                            <div className="flex items-center gap-1.5">
                              <Clock size={11} className="text-muted-foreground shrink-0" />
                              <span className="text-xs text-muted-foreground">{(med as any).pharmacyOpeningHours}</span>
                              {(med as any).pharmacyIsOnDuty && (
                                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">De garde</span>
                              )}
                            </div>
                            )}
                          </div>
                          )}

                          {/* Price & Action */}
                          <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
                            <div>
                              <span className="text-lg font-bold text-primary">
                                {med.price} DT
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">
                                TTC
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart(med);
                              }}
                              disabled={med.available <= 0}
                              className="flex items-center gap-1 bg-primary text-primary-foreground px-2.5 py-1.5 rounded-lg hover:bg-primary/90 active:scale-95 transition-all text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <ShoppingCart size={13} />
                              {pharmaCart.find((c) => c.id === med.id) ? "Ajouté ✓" : "Ajouter"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* ── Floating Cart FAB ── */}
        {pharmaCart.length > 0 && !pharmaCartOpen && (
          <button
            onClick={() => setPharmaCartOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-orange-600 text-white shadow-lg hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center"
            title="Panier Pharmacie"
          >
            <Stethoscope size={22} />
            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center shadow">
              {pharmaCart.reduce((s, c) => s + c.quantity, 0)}
            </span>
          </button>
        )}
      </main>
      <Footer />
      <MedicineModal
        medicine={selectedMedicine}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={addToCart}
      />
    </>
  );
}
