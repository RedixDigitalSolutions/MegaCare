import { useState, useEffect, useCallback } from "react";
import React from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ShoppingBag,
  Truck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Order {
  id: string;
  orderCode?: string;
  items: { productId: string; name: string; price: number; quantity: number }[];
  total: number;
  deliveryFee?: number;
  deliveryMethod?: "pickup" | "delivery";
  deliveryAddress?: string;
  deliveryGovernorate?: string;
  status: string;
  createdAt: string;
}

function statusBadge(status: string) {
  const map: Record<string, { label: string; classes: string; icon: React.ReactElement }> = {
    pending:    { label: "En attente", classes: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: <Clock size={13} /> },
    confirmed:  { label: "Confirmée", classes: "bg-blue-50 text-blue-700 border-blue-200", icon: <CheckCircle2 size={13} /> },
    ready:      { label: "Prête", classes: "bg-green-50 text-green-700 border-green-200", icon: <Package size={13} /> },
    shipped:    { label: "En livraison", classes: "bg-purple-50 text-purple-700 border-purple-200", icon: <Truck size={13} /> },
    completed:  { label: "Livrée", classes: "bg-green-50 text-green-700 border-green-200", icon: <CheckCircle2 size={13} /> },
    cancelled:  { label: "Annulée", classes: "bg-red-50 text-red-700 border-red-200", icon: <XCircle size={13} /> },
  };
  const s = map[status] ?? { label: status, classes: "bg-secondary/50 text-foreground border-border", icon: <AlertCircle size={13} /> };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${s.classes}`}>
      {s.icon} {s.label}
    </span>
  );
}

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const token = localStorage.getItem("megacare_token");

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/pharmacy/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.data ?? []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const active = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const past = orders.filter((o) => ["completed", "cancelled"].includes(o.status));

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col md:flex-row">
          <DashboardSidebar />
          <main className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mes Commandes</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {active.length} en cours · {past.length} terminées
                </p>
              </div>
              <Link
                to="/dashboard/pharmacy"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium"
              >
                <ShoppingBag size={16} />
                Commander
              </Link>
            </div>
          </div>

          <div className="p-6 max-w-3xl mx-auto space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Package className="w-14 h-14 mx-auto mb-4 opacity-30" />
                <p className="font-semibold text-foreground">Aucune commande</p>
                <p className="text-sm mt-1">Vos commandes en pharmacie apparaîtront ici</p>
                <Link
                  to="/dashboard/pharmacy"
                  className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                >
                  <ShoppingBag size={16} />
                  Explorer la pharmacie
                </Link>
              </div>
            ) : (
              <>
                {/* Active orders */}
                {active.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">En cours</h2>
                    {active.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        expanded={expandedId === order.id}
                        onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        fmtDate={fmtDate}
                      />
                    ))}
                  </section>
                )}

                {/* Past orders */}
                {past.length > 0 && (
                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Historique</h2>
                    {past.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        expanded={expandedId === order.id}
                        onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
                        fmtDate={fmtDate}
                      />
                    ))}
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  expanded,
  onToggle,
  fmtDate,
}: {
  order: Order;
  expanded: boolean;
  onToggle: () => void;
  fmtDate: (d: string) => string;
}) {
  const isDelivery = order.deliveryMethod === "delivery";
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-secondary/20 transition text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            {isDelivery ? <Truck size={18} className="text-primary" /> : <Package size={18} className="text-primary" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {order.orderCode && (
                <span className="font-mono text-xs font-bold text-foreground">{order.orderCode}</span>
              )}
              {statusBadge(order.status)}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {fmtDate(order.createdAt)} · {order.items.length} article(s) · {order.total.toFixed(2)} DT
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp size={16} className="text-muted-foreground flex-shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-4 border-t border-border space-y-4 bg-secondary/5">
          {/* Delivery tracker */}
          {!["cancelled"].includes(order.status) && (
            <DeliveryTracker status={order.status} />
          )}

          {/* Items */}
          <div className="space-y-1.5">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {item.name}
                  {item.quantity > 1 && <span className="text-muted-foreground ml-1">× {item.quantity}</span>}
                </span>
                <span className="font-medium text-foreground">
                  {(item.price * item.quantity).toFixed(2)} DT
                </span>
              </div>
            ))}
            {order.deliveryFee ? (
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
                <span>Frais de livraison</span>
                <span>{order.deliveryFee.toFixed(2)} DT</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between font-semibold text-foreground pt-1 border-t border-border">
              <span>Total</span>
              <span>{order.total.toFixed(2)} DT</span>
            </div>
          </div>

          {/* Delivery info */}
          {isDelivery && order.deliveryAddress && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Truck size={13} className="mt-0.5 flex-shrink-0 text-primary" />
              <span>
                Livraison à {order.deliveryAddress}
                {order.deliveryGovernorate ? `, ${order.deliveryGovernorate}` : ""}
              </span>
            </div>
          )}
          {!isDelivery && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <Package size={13} className="mt-0.5 flex-shrink-0 text-primary" />
              <span>Retrait en pharmacie</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DeliveryTracker({ status }: { status: string }) {
  const steps = ["pending", "confirmed", "ready", "shipped", "completed"];
  const idx = steps.indexOf(status);
  if (idx < 0) return null;

  const labels = ["Reçue", "Confirmée", "Prête", "En livraison", "Livrée"];

  return (
    <div className="flex items-center gap-0.5 pt-3 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-0.5 flex-shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 ${i <= idx ? "bg-primary" : "bg-border"}`} />
            <span className={`text-xs whitespace-nowrap ${i <= idx ? "text-primary font-medium" : "text-muted-foreground"}`}>
              {labels[i]}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 flex-shrink-0 mb-4 ${i < idx ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
