import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import {
  Truck,
  Clock,
  CheckCircle,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type OrderStatus = "Livré" | "En transit" | "En attente";
type TabFilter = "Toutes" | OrderStatus;

interface SupplierOrder {
  id: string;
  supplier: string;
  date: string;
  expectedDate: string | null;
  items: { name: string; qty: number; unit: string }[];
  total: number;
  status: OrderStatus;
  ref: string;
}

const ORDERS: SupplierOrder[] = [
  {
    id: "1",
    ref: "ORD-F-001",
    supplier: "EVOLUPHARM Tunisie",
    date: "2026-04-01",
    expectedDate: null,
    items: [
      { name: "Paracétamol 500mg", qty: 200, unit: "boîtes" },
      { name: "Aspirine 500mg", qty: 100, unit: "boîtes" },
      { name: "Vitamine C 1000mg", qty: 150, unit: "boîtes" },
    ],
    total: 1240,
    status: "Livré",
  },
  {
    id: "2",
    ref: "ORD-F-002",
    supplier: "SANDOZ Maghreb",
    date: "2026-04-02",
    expectedDate: "2026-04-07",
    items: [
      { name: "Amoxicilline 500mg", qty: 80, unit: "boîtes" },
      { name: "Amoxicilline 1g", qty: 60, unit: "boîtes" },
    ],
    total: 736,
    status: "En transit",
  },
  {
    id: "3",
    ref: "ORD-F-003",
    supplier: "WASSEN International",
    date: "2026-03-28",
    expectedDate: null,
    items: [
      { name: "Vitamine D3 1000UI", qty: 120, unit: "boîtes" },
      { name: "Oméga-3 1000mg", qty: 80, unit: "boîtes" },
      { name: "Magnésium B6", qty: 100, unit: "boîtes" },
    ],
    total: 2310,
    status: "Livré",
  },
  {
    id: "4",
    ref: "ORD-F-004",
    supplier: "BIOGARAN Afrique du Nord",
    date: "2026-03-25",
    expectedDate: null,
    items: [{ name: "Oméprazole 20mg", qty: 150, unit: "boîtes" }],
    total: 450,
    status: "Livré",
  },
  {
    id: "5",
    ref: "ORD-F-005",
    supplier: "SANOFI Maroc",
    date: "2026-04-03",
    expectedDate: "2026-04-10",
    items: [
      { name: "Doliprane 1000mg", qty: 300, unit: "boîtes" },
      { name: "Sérum Physiologique", qty: 200, unit: "unités" },
    ],
    total: 1820,
    status: "En attente",
  },
  {
    id: "6",
    ref: "ORD-F-006",
    supplier: "ZYRTEC MENA",
    date: "2026-04-04",
    expectedDate: "2026-04-12",
    items: [{ name: "Cétirizine 10mg", qty: 120, unit: "boîtes" }],
    total: 684,
    status: "En attente",
  },
  {
    id: "7",
    ref: "ORD-F-007",
    supplier: "MYLAN Tunisie",
    date: "2026-03-20",
    expectedDate: null,
    items: [
      { name: "Diclofénac 50mg", qty: 100, unit: "boîtes" },
      { name: "Fluconazole 150mg", qty: 60, unit: "boîtes" },
    ],
    total: 1398,
    status: "Livré",
  },
];

const STATUS_CFG: Record<
  OrderStatus,
  {
    badge: string;
    border: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  Livré: {
    badge: "bg-green-100 text-green-700",
    border: "border-l-green-500",
    icon: <CheckCircle size={16} className="text-green-600" />,
    label: "Livré",
  },
  "En transit": {
    badge: "bg-blue-100 text-blue-700",
    border: "border-l-blue-500",
    icon: <Truck size={16} className="text-blue-600" />,
    label: "En transit",
  },
  "En attente": {
    badge: "bg-amber-100 text-amber-700",
    border: "border-l-amber-400",
    icon: <Clock size={16} className="text-amber-600" />,
    label: "En attente",
  },
};

export default function PharmacyOrdersPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabFilter>("Toutes");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
    return null;

  const filtered =
    tab === "Toutes" ? ORDERS : ORDERS.filter((o) => o.status === tab);

  const countOf = (s: TabFilter) =>
    s === "Toutes"
      ? ORDERS.length
      : ORDERS.filter((o) => o.status === s).length;

  const totalValue = ORDERS.reduce((s, o) => s + o.total, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <PharmacyDashboardSidebar
          pharmacyName={user.firstName || "Pharmacie Central"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <h1 className="text-3xl font-bold text-foreground">
              Commandes Fournisseurs
            </h1>
            <p className="text-muted-foreground mt-1">
              {ORDERS.length} commandes · {totalValue.toLocaleString()} DT total
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {(
                ["Toutes", "Livré", "En transit", "En attente"] as TabFilter[]
              ).map((s) => (
                <div
                  key={s}
                  onClick={() => setTab(s)}
                  className={`bg-card border rounded-xl p-4 text-center cursor-pointer transition hover:shadow-md ${
                    tab === s
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  <p
                    className={`text-2xl font-bold ${
                      s === "Livré"
                        ? "text-green-600"
                        : s === "En transit"
                          ? "text-blue-600"
                          : s === "En attente"
                            ? "text-amber-600"
                            : "text-foreground"
                    }`}
                  >
                    {countOf(s)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {s === "Toutes" ? "Total" : s}
                  </p>
                </div>
              ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {(
                ["Toutes", "Livré", "En transit", "En attente"] as TabFilter[]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => setTab(s)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                    tab === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  }`}
                >
                  {s} ({countOf(s)})
                </button>
              ))}
            </div>

            {/* Order Cards */}
            <div className="space-y-3">
              {filtered.map((order) => {
                const cfg = STATUS_CFG[order.status];
                const isOpen = expanded === order.id;
                return (
                  <div
                    key={order.id}
                    className={`bg-card border border-border border-l-4 ${cfg.border} rounded-xl overflow-hidden hover:shadow-md transition`}
                  >
                    {/* Card Header */}
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="mt-0.5">{cfg.icon}</div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-0.5">
                            <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                              {order.ref}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground">
                            {order.supplier}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Commandé le {order.date}
                            {order.expectedDate &&
                              ` · Livraison prévue le ${order.expectedDate}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-lg font-bold text-foreground">
                          {order.total} DT
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {order.items.length} réf.
                        </span>
                        <button
                          onClick={() => setExpanded(isOpen ? null : order.id)}
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          {isOpen ? (
                            <ChevronUp size={13} />
                          ) : (
                            <ChevronDown size={13} />
                          )}
                          {isOpen ? "Masquer" : "Détails"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded items */}
                    {isOpen && (
                      <div className="border-t border-border bg-muted/20 px-5 py-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                          Articles commandés
                        </p>
                        <div className="space-y-1.5">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="flex items-center gap-2 text-foreground">
                                <Package
                                  size={13}
                                  className="text-muted-foreground"
                                />
                                {item.name}
                              </span>
                              <span className="text-muted-foreground">
                                {item.qty} {item.unit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-center py-16 text-muted-foreground">
                  Aucune commande pour ce statut.
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
