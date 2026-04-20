import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  Search,
  UserCircle2,
  ChevronRight,
  ShoppingBag,
  MapPin,
  Phone,
  ArrowLeft,
  Package,
  Calendar,
  Truck,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  delegation: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  deliveryMethod: string;
  deliveryAddress: string;
  deliveryGovernorate: string;
  deliveryDelegation: string;
  deliveryPhone: string;
  status: string;
  createdAt: string;
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

const statusLabels: Record<string, string> = {
  pending: "En attente",
  confirmed: "Confirmée",
  ready: "Prête",
  delivered: "Livrée",
  cancelled: "Annulée",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  ready: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function ParamedicalClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    setLoadingClients(true);
    fetch("/api/paramedical/clients", {
      headers: { Authorization: `Bearer ${tok()}` },
    })
      .then((r) => r.json())
      .then((d) => setClients(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingClients(false));
  }, []);

  const openClient = (client: Client) => {
    setSelectedClient(client);
    setLoadingOrders(true);
    fetch(`/api/paramedical/clients/${client.id}/orders`, {
      headers: { Authorization: `Bearer ${tok()}` },
    })
      .then((r) => r.json())
      .then((d) => setOrders(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  };

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.governorate.toLowerCase().includes(search.toLowerCase()) ||
      c.delegation.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  // ── Client list view ──────────────────────────────────────
  const ClientListView = () => (
    <>
      <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
        <h1 className="text-xl font-bold text-foreground">Clients</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {clients.length} client{clients.length !== 1 ? "s" : ""} ayant passé
          des commandes
        </p>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <input
            type="text"
            placeholder="Rechercher par nom, gouvernorat, délégation, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {loadingClients ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground text-sm">
            {clients.length === 0
              ? "Aucun client pour le moment. Les clients apparaîtront ici dès qu'ils passeront des commandes."
              : "Aucun client trouvé."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((client) => (
              <div
                key={client.id}
                onClick={() => openClient(client)}
                className="bg-card rounded-xl border border-border p-5 space-y-3 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer"
              >
                {/* Client identity */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0">
                    <UserCircle2 size={22} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {client.name}
                    </p>
                    {client.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Phone size={11} />
                        {client.phone}
                      </div>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-muted-foreground mt-1"
                  />
                </div>

                {/* Location */}
                {(client.governorate || client.delegation) && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={12} />
                    {[client.delegation, client.governorate]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 pt-1 border-t border-border">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShoppingBag size={12} />
                    <span className="font-medium text-foreground">
                      {client.totalOrders}
                    </span>{" "}
                    commande{client.totalOrders !== 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">
                      {client.totalSpent.toFixed(2)}
                    </span>{" "}
                    DT
                  </div>
                </div>

                {/* Last order */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={11} />
                  Dernière commande :{" "}
                  {new Date(client.lastOrderDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );

  // ── Client detail / order history view ────────────────────
  const ClientDetailView = () => (
    <>
      <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
        <button
          onClick={() => {
            setSelectedClient(null);
            setOrders([]);
          }}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition mb-3"
        >
          <ArrowLeft size={15} />
          Retour aux clients
        </button>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
            <UserCircle2 size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {selectedClient!.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
              {selectedClient!.phone && (
                <span className="flex items-center gap-1">
                  <Phone size={12} />
                  {selectedClient!.phone}
                </span>
              )}
              {(selectedClient!.governorate || selectedClient!.delegation) && (
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {[selectedClient!.delegation, selectedClient!.governorate]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-6 mt-4">
          <div className="bg-muted/40 rounded-lg px-4 py-2 text-center">
            <p className="text-lg font-bold text-foreground">
              {selectedClient!.totalOrders}
            </p>
            <p className="text-xs text-muted-foreground">Commandes</p>
          </div>
          <div className="bg-muted/40 rounded-lg px-4 py-2 text-center">
            <p className="text-lg font-bold text-foreground">
              {selectedClient!.totalSpent.toFixed(2)} DT
            </p>
            <p className="text-xs text-muted-foreground">Total dépensé</p>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">
          Historique des commandes
        </h2>

        {loadingOrders ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-10 text-center text-muted-foreground text-sm">
            Aucune commande trouvée.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-xl border border-border p-5 space-y-3"
            >
              {/* Order header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}
                  >
                    {statusLabels[order.status] || order.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    #{order.id.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {" à "}
                  {new Date(order.createdAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1.5">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Package size={13} className="text-muted-foreground" />
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ×{item.quantity}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {(item.price * item.quantity).toFixed(2)} DT
                    </span>
                  </div>
                ))}
              </div>

              {/* Delivery + total */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Truck size={13} />
                  {order.deliveryMethod === "delivery"
                    ? `Livraison — ${[order.deliveryAddress, order.deliveryDelegation, order.deliveryGovernorate].filter(Boolean).join(", ")}`
                    : "Retrait sur place"}
                </div>
                <p className="text-sm font-bold text-foreground">
                  {order.total.toFixed(2)} DT
                </p>
              </div>
            </div>
          ))
        )}
      </main>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {selectedClient ? <ClientDetailView /> : <ClientListView />}
      </div>
    </div>
  );
}
