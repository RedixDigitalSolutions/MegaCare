import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
    Package,
    Loader2,
    ShoppingBag,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    XCircle,
} from "lucide-react";

interface OrderItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

interface ParapharmacyOrder {
    id: string;
    providerName: string;
    items: OrderItem[];
    total: number;
    deliveryMethod: "pickup" | "delivery";
    status: "delivered" | "cancelled";
    createdAt: string;
}

export default function ParapharmacyHistoryPage() {
    const [orders, setOrders] = useState<ParapharmacyOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const tok = () => localStorage.getItem("megacare_token") ?? "";

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/public/my-paramedical-orders", {
                    headers: { Authorization: `Bearer ${tok()}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    const past = Array.isArray(data)
                        ? data.filter((o: ParapharmacyOrder) => ["delivered", "cancelled"].includes(o.status))
                        : [];
                    setOrders(past);
                }
            } catch { /* ignore */ }
            setLoading(false);
        })();
    }, []);

    const fmtDate = (d: string) =>
        new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

    const totalSpent = orders
        .filter((o) => o.status === "delivered")
        .reduce((s, o) => s + o.total, 0);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-background">
                <DashboardSidebar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-primary" />
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background">
            <DashboardSidebar />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Historique des achats</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Toutes vos commandes parapharmacie finalisées
                            </p>
                        </div>
                        {orders.filter((o) => o.status === "delivered").length > 0 && (
                            <div className="bg-primary/10 rounded-xl px-4 py-2.5 text-right">
                                <p className="text-xs text-muted-foreground">Total dépensé</p>
                                <p className="text-lg font-bold text-primary">{totalSpent.toFixed(2)} TND</p>
                            </div>
                        )}
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 space-y-4 bg-card border border-border rounded-2xl">
                            <ShoppingBag size={48} className="mx-auto text-muted-foreground/30" />
                            <p className="text-lg font-semibold text-foreground">Aucun achat pour le moment</p>
                            <p className="text-sm text-muted-foreground">
                                L'historique de vos commandes livrées ou annulées apparaîtra ici.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-card border border-border rounded-2xl overflow-hidden">
                            {/* Table header */}
                            <div className="hidden md:grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 bg-secondary/30 text-xs font-semibold text-muted-foreground uppercase tracking-wide border-b border-border">
                                <span>Produits</span>
                                <span>Parapharmacie</span>
                                <span>Date</span>
                                <span className="text-right">Total</span>
                                <span>Statut</span>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-border">
                                {orders.map((order) => {
                                    const isExpanded = expandedId === order.id;
                                    const isDelivered = order.status === "delivered";

                                    return (
                                        <div key={order.id}>
                                            <button
                                                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                                className="w-full text-left px-5 py-4 hover:bg-secondary/20 transition"
                                            >
                                                <div className="grid md:grid-cols-[1fr_1fr_auto_auto_auto] gap-3 md:gap-4 items-center">
                                                    {/* Products summary */}
                                                    <div className="flex items-center gap-2 min-w-0">
                                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                                            <Package size={14} className="text-primary" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-foreground truncate">
                                                                {order.items[0]?.name}
                                                                {order.items.length > 1 && (
                                                                    <span className="text-muted-foreground font-normal"> +{order.items.length - 1}</span>
                                                                )}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {order.items.reduce((s, i) => s + i.quantity, 0)} article
                                                                {order.items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Provider */}
                                                    <p className="text-sm text-foreground truncate hidden md:block">{order.providerName}</p>

                                                    {/* Date */}
                                                    <p className="text-xs text-muted-foreground hidden md:block whitespace-nowrap">{fmtDate(order.createdAt)}</p>

                                                    {/* Total */}
                                                    <p className="text-sm font-bold text-foreground tabular-nums text-right hidden md:block">
                                                        {order.total.toFixed(2)} TND
                                                    </p>

                                                    {/* Status + chevron */}
                                                    <div className="flex items-center gap-2 justify-between md:justify-end">
                                                        <span
                                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${isDelivered
                                                                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                                                                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
                                                                }`}
                                                        >
                                                            {isDelivered ? <CheckCircle2 size={11} /> : <XCircle size={11} />}
                                                            {isDelivered ? "Livrée" : "Annulée"}
                                                        </span>
                                                        {isExpanded ? <ChevronUp size={14} className="text-muted-foreground" /> : <ChevronDown size={14} className="text-muted-foreground" />}
                                                    </div>
                                                </div>

                                                {/* Mobile: provider + date + total */}
                                                <div className="md:hidden flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                                    <span>{order.providerName}</span>
                                                    <span>{fmtDate(order.createdAt)}</span>
                                                    <span className="font-semibold text-foreground">{order.total.toFixed(2)} TND</span>
                                                </div>
                                            </button>

                                            {/* Expanded detail */}
                                            {isExpanded && (
                                                <div className="px-5 pb-4 bg-secondary/10 border-t border-border space-y-2">
                                                    <p className="text-xs font-semibold text-muted-foreground mt-3 mb-1">Détail des articles</p>
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-border last:border-0">
                                                            <span className="text-foreground">
                                                                {item.name}
                                                                {item.quantity > 1 && (
                                                                    <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                                                                )}
                                                            </span>
                                                            <span className="tabular-nums text-foreground font-medium">
                                                                {(item.price * item.quantity).toFixed(2)} TND
                                                            </span>
                                                        </div>
                                                    ))}
                                                    <div className="flex justify-between pt-1 text-sm font-semibold">
                                                        <span>Total</span>
                                                        <span className="text-primary">{order.total.toFixed(2)} TND</span>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Méthode : {order.deliveryMethod === "delivery" ? "Livraison à domicile" : "Retrait sur place"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
