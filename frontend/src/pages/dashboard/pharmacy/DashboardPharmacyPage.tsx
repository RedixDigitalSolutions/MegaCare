import { useState, useEffect, useCallback } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  X,
  Plus,
  Minus,
  Loader2,
  Package,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category?: string;
  description?: string;
  image?: string;
  requiresPrescription?: boolean;
  pharmacyId?: string;
}

interface CartItem extends Product {
  quantity: number;
}

export default function DashboardPharmacyPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("megacare_token");

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/pharmacy/products?${params}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)
        .filter((i) => i.quantity > 0),
    );
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    setOrdering(true);
    try {
      const pharmacyId = cart[0].pharmacyId;
      const res = await fetch("/api/pharmacy/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pharmacyId,
          items: cart.map((i) => ({ productId: i.id, name: i.name, quantity: i.quantity })),
          deliveryMethod: "pickup",
        }),
      });
      if (res.ok) {
        const order = await res.json();
        setOrderSuccess(order.orderCode || order.id);
        setCart([]);
        setCartOpen(false);
      }
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Pharmacie en ligne</h1>
                <p className="text-sm text-muted-foreground mt-1">Commandez vos médicaments en toute sécurité</p>
              </div>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
              >
                <ShoppingCart size={16} />
                Panier
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 max-w-5xl mx-auto space-y-6">
            {/* Order success banner */}
            {orderSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-green-800">Commande confirmée !</p>
                  <p className="text-xs text-green-600 mt-0.5">Code de commande : <span className="font-mono font-bold">{orderSuccess}</span></p>
                </div>
                <button
                  onClick={() => navigate("/dashboard/orders")}
                  className="flex items-center gap-1 text-xs font-medium text-green-700 hover:underline"
                >
                  Voir mes commandes <ChevronRight size={14} />
                </button>
                <button onClick={() => setOrderSuccess(null)} className="text-green-500 hover:text-green-700">
                  <X size={16} />
                </button>
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un médicament ou produit..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Products */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Aucun produit trouvé</p>
                {search && <p className="text-sm mt-1">Essayez un autre terme de recherche</p>}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => {
                  const inCart = cart.find((i) => i.id === product.id);
                  const outOfStock = product.stock === 0;
                  return (
                    <div key={product.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition">
                      <div className="w-full aspect-square bg-secondary/20 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <Package className="w-10 h-10 text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground text-sm leading-tight">{product.name}</p>
                        {product.category && (
                          <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                        )}
                        {product.requiresPrescription && (
                          <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">Sur ordonnance</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary text-sm">{product.price.toFixed(2)} DT</span>
                        {outOfStock ? (
                          <span className="text-xs text-muted-foreground">Rupture</span>
                        ) : inCart ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQty(product.id, -1)} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{inCart.quantity}</span>
                            <button onClick={() => updateQty(product.id, 1)} className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90">
                              <Plus size={12} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToCart(product)}
                            className="flex items-center gap-1 px-2.5 py-1 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition"
                          >
                            <Plus size={12} /> Ajouter
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Cart Drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-card border-l border-border flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <ShoppingCart size={18} /> Mon panier
              </h2>
              <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary/50 text-muted-foreground">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-8 text-sm">Votre panier est vide</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.price.toFixed(2)} DT × {item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80">
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80">
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Total</span>
                  <span>{cartTotal.toFixed(2)} DT</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={ordering}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {ordering ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  Confirmer la commande
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
