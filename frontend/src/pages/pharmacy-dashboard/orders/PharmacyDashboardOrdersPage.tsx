import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import {
  Search,
  Package,
  UserCircle2,
  Phone,
  MapPin,
  Truck,
  Store,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  QrCode,
} from "lucide-react";

type OrderStatus = "pending" | "confirmed" | "ready" | "completed" | "cancelled";
type TabFilter = "all" | OrderStatus;

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface PatientOrder {
  id: string;
  orderCode: string;
  userId: string;
  patientName: string;
  patientPhone: string;
  patientGovernorate: string;
  patientDelegation: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: string;
  deliveryAddress: string;
  deliveryGovernorate: string;
  deliveryDelegation: string;
  deliveryPhone: string;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_CFG: Record<OrderStatus, { badge: string; label: string; icon: React.ReactNode }> = {
  pending: { badge: "bg-amber-100 text-amber-700", label: "En attente", icon: <Clock size={15} className="text-amber-600" /> },
  confirmed: { badge: "bg-blue-100 text-blue-700", label: "Confirmée", icon: <CheckCircle size={15} className="text-blue-600" /> },
  ready: { badge: "bg-purple-100 text-purple-700", label: "Prête", icon: <Package size={15} className="text-purple-600" /> },
  completed: { badge: "bg-green-100 text-green-700", label: "Complétée", icon: <CheckCircle size={15} className="text-green-600" /> },
  cancelled: { badge: "bg-red-100 text-red-700", label: "Annulée", icon: <XCircle size={15} className="text-red-600" /> },
};

const TAB_LABELS: Record<TabFilter, string> = {
  all: "Toutes",
  pending: "En attente",
  confirmed: "Confirmées",
  ready: "Prêtes",
  completed: "Complétées",
  cancelled: "Annulées",
};

const tok = () => localStorage.getItem("megacare_token") ?? "";

export default function PharmacyOrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<PatientOrder[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [tab, setTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PatientOrder[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const fetchOrders = () => {
    fetch("/api/pharmacy/patient-orders", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((data) => { setOrders(Array.isArray(data) ? data : []); setLoadingData(false); })
      .catch(() => setLoadingData(false));
  };

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "pharmacy") return;
    fetchOrders();
  }, [isAuthenticated, user]);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) { setSearchResults(null); return; }
    const res = await fetch(`/api/pharmacy/patient-orders/search?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${tok()}` },
    });
    if (res.ok) {
      const data = await res.json();
      setSearchResults(Array.isArray(data) ? data : []);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) setSearchResults(null);
  }, [searchQuery]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/pharmacy/patient-orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
        if (searchResults) {
          setSearchResults((prev) => prev!.map((o) => o.id === orderId ? { ...o, status } : o));
        }
      }
    } catch { /* ignore */ }
    setUpdating(null);
  };

  if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy") return null;

  const displayOrders = searchResults !== null ? searchResults : orders;
  const filtered = tab === "all" ? displayOrders : displayOrders.filter((o) => o.status === tab);
  const countOf = (s: TabFilter) => s === "all" ? displayOrders.length : displayOrders.filter((o) => o.status === s).length;

  const renderOrder = (order: PatientOrder) => {
    const cfg = STATUS_CFG[order.status];
    const isOpen = expanded === order.id;
    return (
      <div key={order.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition">
        {/* Header */}
        <div className="p-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5">{cfg.icon}</div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded font-bold tracking-wider flex items-center gap-1">
                  <QrCode size={11} />
                  {order.orderCode}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>{cfg.label}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  {order.deliveryMethod === "delivery" ? <><Truck size={12} /> Livraison</> : <><Store size={12} /> Retrait</>}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <UserCircle2 size={14} className="text-muted-foreground" />
                <span className="font-medium text-foreground">{order.patientName}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                {order.patientPhone && <span className="flex items-center gap-1"><Phone size={11} />{order.patientPhone}</span>}
                <span className="flex items-center gap-1">
                  <Calendar size={11} />
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  {" "}
                  {new Date(order.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-lg font-bold text-foreground">{order.total.toFixed(2)} DT</span>
            <span className="text-xs text-muted-foreground">{order.items.length} article{order.items.length !== 1 ? "s" : ""}</span>
            <button onClick={() => setExpanded(isOpen ? null : order.id)} className="flex items-center gap-1 text-xs text-primary hover:underline">
              {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {isOpen ? "Masquer" : "Détails"}
            </button>
          </div>
        </div>

        {/* Expanded detail */}
        {isOpen && (
          <div className="border-t border-border bg-muted/20 px-5 py-4 space-y-4">
            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Articles commandés</p>
              <div className="space-y-1.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-foreground">
                      <Package size={13} className="text-muted-foreground" />
                      {item.name}
                      <span className="text-xs text-muted-foreground">×{item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground">{(item.price * item.quantity).toFixed(2)} DT</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery info */}
            {order.deliveryMethod === "delivery" && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Adresse de livraison</p>
                <p className="text-sm text-foreground">{order.deliveryAddress}</p>
                <p className="text-xs text-muted-foreground">
                  {[order.deliveryDelegation, order.deliveryGovernorate].filter(Boolean).join(", ")}
                  {order.deliveryPhone && ` · ${order.deliveryPhone}`}
                </p>
              </div>
            )}

            {/* Status actions */}
            <div className="flex gap-2 flex-wrap pt-1">
              {order.status === "pending" && (
                <>
                  <button onClick={() => updateStatus(order.id, "confirmed")} disabled={updating === order.id}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition disabled:opacity-50">
                    Confirmer
                  </button>
                  <button onClick={() => updateStatus(order.id, "cancelled")} disabled={updating === order.id}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition disabled:opacity-50">
                    Annuler
                  </button>
                </>
              )}
              {order.status === "confirmed" && (
                <>
                  <button onClick={() => updateStatus(order.id, "ready")} disabled={updating === order.id}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition disabled:opacity-50">
                    Prête
                  </button>
                  <button onClick={() => updateStatus(order.id, "cancelled")} disabled={updating === order.id}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition disabled:opacity-50">
                    Annuler
                  </button>
                </>
              )}
              {order.status === "ready" && (
                <button onClick={() => updateStatus(order.id, "completed")} disabled={updating === order.id}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition disabled:opacity-50">
                  Marquer comme complétée
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <PharmacyDashboardSidebar pharmacyName={user.firstName || "Pharmacie"} />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-foreground">Commandes clients</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {loadingData ? "Chargement…" : `${orders.length} commande${orders.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Search bar */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par code commande, nom du patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button onClick={handleSearch}
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center gap-2"
              >
                <QrCode size={16} />
                Rechercher
              </button>
            </div>

            {searchResults !== null && (
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {searchResults.length} résultat{searchResults.length !== 1 ? "s" : ""} pour "{searchQuery}"
                </p>
                <button onClick={() => { setSearchQuery(""); setSearchResults(null); }}
                  className="text-xs text-primary hover:underline">
                  Effacer la recherche
                </button>
              </div>
            )}

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
              {(["all", "pending", "confirmed", "ready", "completed", "cancelled"] as TabFilter[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setTab(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${tab === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {TAB_LABELS[s]} ({countOf(s)})
                </button>
              ))}
            </div>

            {/* Orders list */}
            {loadingData ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground text-sm">
                    Aucune commande pour ce filtre.
                  </div>
                ) : (
                  filtered.map(renderOrder)
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
