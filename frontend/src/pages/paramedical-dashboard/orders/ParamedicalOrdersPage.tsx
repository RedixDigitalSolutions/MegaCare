import { useEffect, useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  MapPin,
  Phone,
  User,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  patientName: string;
  patientPhone: string;
  patientGovernorate: string;
  patientDelegation: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress: string;
  deliveryGovernorate: string;
  deliveryDelegation: string;
  deliveryPhone: string;
  status: "pending" | "confirmed" | "ready" | "delivered" | "cancelled";
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  pending: { label: "En attente", color: "text-amber-600", icon: Clock, bg: "bg-amber-50 dark:bg-amber-950/30" },
  confirmed: { label: "Confirmée", color: "text-blue-600", icon: CheckCircle, bg: "bg-blue-50 dark:bg-blue-950/30" },
  ready: { label: "Prête", color: "text-emerald-600", icon: Package, bg: "bg-emerald-50 dark:bg-emerald-950/30" },
  delivered: { label: "Livrée", color: "text-green-600", icon: Truck, bg: "bg-green-50 dark:bg-green-950/30" },
  cancelled: { label: "Annulée", color: "text-red-500", icon: XCircle, bg: "bg-red-50 dark:bg-red-950/30" },
};

const STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["ready", "cancelled"],
  ready: ["delivered"],
  delivered: [],
  cancelled: [],
};

export default function ParamedicalOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/paramedical/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch(`/api/paramedical/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: status as Order["status"] } : o))
        );
      }
    } catch {
      /* ignore */
    }
    setUpdatingId(null);
  };

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const counts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    confirmed: orders.filter((o) => o.status === "confirmed").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Commandes</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gérez les commandes de produits paramédicaux de vos patients
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(["pending", "confirmed", "ready", "delivered", "cancelled"] as const).map((s) => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              return (
                <button
                  key={s}
                  onClick={() => setFilter(filter === s ? "all" : s)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                    filter === s
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${cfg.bg}`}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-foreground">{counts[s]}</p>
                    <p className="text-[10px] text-muted-foreground">{cfg.label}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Orders list */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Package size={48} className="mx-auto text-muted-foreground/40" />
              <p className="text-lg font-medium text-foreground">Aucune commande</p>
              <p className="text-sm text-muted-foreground">
                {filter === "all"
                  ? "Vous n'avez pas encore reçu de commandes"
                  : `Aucune commande avec le statut "${STATUS_CONFIG[filter]?.label}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((order) => {
                const cfg = STATUS_CONFIG[order.status];
                const StatusIcon = cfg.icon;
                const transitions = STATUS_TRANSITIONS[order.status] || [];
                const date = new Date(order.createdAt);

                return (
                  <div
                    key={order.id}
                    className="bg-card border border-border rounded-xl p-5 space-y-4"
                  >
                    {/* Order header */}
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                            <StatusIcon size={12} />
                            {cfg.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            #{order.id.slice(-6).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {date.toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          à{" "}
                          {date.toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {order.total.toFixed(2)} TND
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.items.length} article{order.items.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    {/* Patient info */}
                    <div className="flex items-center gap-4 flex-wrap text-sm">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <User size={14} className="text-muted-foreground" />
                        {order.patientName}
                      </span>
                      {(order.deliveryPhone || order.patientPhone) && (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone size={14} />
                          {order.deliveryPhone || order.patientPhone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin size={14} />
                        {order.deliveryMethod === "delivery"
                          ? `Livraison — ${order.deliveryAddress || ""} ${order.deliveryGovernorate || ""}`
                          : `Retrait sur place — ${order.patientGovernorate || ""}`}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <span className="text-foreground">
                            {item.name}{" "}
                            {item.quantity > 1 && (
                              <span className="text-muted-foreground">×{item.quantity}</span>
                            )}
                          </span>
                          <span className="font-medium text-foreground">
                            {(item.price * item.quantity).toFixed(2)} TND
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    {transitions.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        {transitions.map((next) => {
                          const nextCfg = STATUS_CONFIG[next];
                          const NextIcon = nextCfg.icon;
                          const isCancel = next === "cancelled";
                          return (
                            <button
                              key={next}
                              onClick={() => updateStatus(order.id, next)}
                              disabled={updatingId === order.id}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition disabled:opacity-50 ${
                                isCancel
                                  ? "border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                              }`}
                            >
                              {updatingId === order.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <NextIcon size={12} />
                              )}
                              {nextCfg.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
