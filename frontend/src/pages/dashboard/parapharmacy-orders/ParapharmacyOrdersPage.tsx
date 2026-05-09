import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
    Package,
    Clock,
    CheckCircle2,
    Truck,
    XCircle,
    AlertCircle,
    Loader2,
    ShoppingBag,
    MapPin,
    RefreshCw,
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
    deliveryAddress?: string;
    deliveryGovernorate?: string;
    deliveryDelegation?: string;
    deliveryPhone?: string;
    status: "pending" | "confirmed" | "in_delivery" | "delivered" | "cancelled";
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; classes: string; icon: React.ElementType; step: number }> = {
    pending: { label: "Commande passée", classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800", icon: Clock, step: 1 },
    confirmed: { label: "Confirmée", classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800", icon: CheckCircle2, step: 2 },
    in_delivery: { label: "En livraison", classes: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800", icon: Truck, step: 3 },
    delivered: { label: "Livrée", classes: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800", icon: Package, step: 4 },
    cancelled: { label: "Annulée", classes: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800", icon: XCircle, step: 0 },
};

const STEPS = [
    { key: "pending", label: "Passée" },
    { key: "confirmed", label: "Confirmée" },
    { key: "in_delivery", label: "En livraison" },
    { key: "delivered", label: "Livrée" },
];

function StatusBadge({ status }: { status: string }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status, classes: "bg-secondary/50 text-foreground border-border", icon: AlertCircle };
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.classes}`}>
            <Icon size={12} />
            {cfg.label}
        </span>
    );
}

function ProgressBar({ status }: { status: string }) {
    if (status === "cancelled") return null;
    const currentStep = STATUS_CONFIG[status]?.step ?? 0;
    return (
        <div className="flex items-center gap-1 mt-3">
            {STEPS.map((step, i) => {
                const stepNum = i + 1;
                const done = currentStep >= stepNum;
                const active = currentStep === stepNum;
                return (
                    <div key={step.key} className="flex-1 flex flex-col items-center gap-1">
                        <div
                            className={`w-full h-1.5 rounded-full transition-colors ${done ? "bg-primary" : "bg-secondary"
                                }`}
                        />
                        <span className={`text-[10px] hidden sm:block ${active ? "text-primary font-semibold" : done ? "text-muted-foreground" : "text-muted-foreground/50"}`}>
                            {step.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default function ParapharmacyOrdersPage() {
    const [orders, setOrders] = useState<ParapharmacyOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const tok = () => localStorage.getItem("megacare_token") ?? "";

    const fetchOrders = async (quiet = false) => {
        if (!quiet) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await fetch("/api/public/my-paramedical-orders", {
                headers: { Authorization: `Bearer ${tok()}` },
            });
            if (res.ok) {
                const data = await res.json();
                // Only show active (non-delivered, non-cancelled) orders
                const active = Array.isArray(data)
                    ? data.filter((o: ParapharmacyOrder) => !["delivered", "cancelled"].includes(o.status))
                    : [];
                setOrders(active);
            }
        } catch { /* ignore */ }
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchOrders();
        // Poll every 30 seconds for status updates
        const interval = setInterval(() => fetchOrders(true), 30_000);
        return () => clearInterval(interval);
    }, []);

    const fmtDate = (d: string) =>
        new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

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
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Suivi des commandes</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Vos commandes parapharmacie en cours
                            </p>
                        </div>
                        <button
                            onClick={() => fetchOrders(true)}
                            disabled={refreshing}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition disabled:opacity-50"
                        >
                            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                            Actualiser
                        </button>
                    </div>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 space-y-4 bg-card border border-border rounded-2xl">
                            <ShoppingBag size={48} className="mx-auto text-muted-foreground/30" />
                            <p className="text-lg font-semibold text-foreground">Aucune commande en cours</p>
                            <p className="text-sm text-muted-foreground">
                                Vos commandes actives apparaîtront ici avec leur statut en temps réel.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
                                const Icon = cfg.icon;

                                return (
                                    <div key={order.id} className="bg-card border border-border rounded-2xl p-5 space-y-4">
                                        {/* Header */}
                                        <div className="flex items-start justify-between flex-wrap gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <StatusBadge status={order.status} />
                                                    <span className="text-xs text-muted-foreground font-mono">
                                                        #{order.id.slice(-6).toUpperCase()}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-semibold text-foreground">{order.providerName}</p>
                                                <p className="text-xs text-muted-foreground">{fmtDate(order.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-primary">{order.total.toFixed(2)} TND</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.items.reduce((s, i) => s + i.quantity, 0)} article
                                                    {order.items.reduce((s, i) => s + i.quantity, 0) > 1 ? "s" : ""}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Progress bar */}
                                        <ProgressBar status={order.status} />

                                        {/* Status hint */}
                                        {order.status === "pending" && (
                                            <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 rounded-lg px-3 py-2">
                                                Votre commande est en attente de confirmation. Le prestataire vous contactera par téléphone.
                                            </p>
                                        )}
                                        {order.status === "confirmed" && (
                                            <p className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-950/30 rounded-lg px-3 py-2">
                                                Commande confirmée — préparation en cours.
                                            </p>
                                        )}
                                        {order.status === "in_delivery" && (
                                            <p className="text-xs text-violet-600 bg-violet-50 dark:bg-violet-950/30 rounded-lg px-3 py-2">
                                                Votre commande est en cours de livraison.
                                            </p>
                                        )}

                                        {/* Delivery info */}
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <MapPin size={13} />
                                            {order.deliveryMethod === "delivery"
                                                ? `Livraison — ${[order.deliveryAddress, order.deliveryGovernorate, order.deliveryDelegation].filter(Boolean).join(", ")}`
                                                : "Retrait sur place"}
                                        </div>

                                        {/* Items */}
                                        <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="flex items-center justify-between px-3 py-2 text-sm bg-secondary/20">
                                                    <span className="text-foreground">
                                                        {item.name}
                                                        {item.quantity > 1 && (
                                                            <span className="text-muted-foreground ml-1">×{item.quantity}</span>
                                                        )}
                                                    </span>
                                                    <span className="font-medium text-foreground tabular-nums">
                                                        {(item.price * item.quantity).toFixed(2)} TND
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
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
