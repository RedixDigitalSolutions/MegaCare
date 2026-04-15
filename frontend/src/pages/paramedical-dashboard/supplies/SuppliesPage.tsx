import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  AlertTriangle,
  Package,
  ShoppingCart,
  TrendingDown,
  Check,
  Search,
  X,
  ChevronDown,
} from "lucide-react";

type StockLevel = "ok" | "low" | "critical";

interface Supply {
  id: string;
  name: string;
  category: string;
  current: number;
  max: number;
  unit: string;
  level: StockLevel;
  ordered: boolean;
}

const levelConfig: Record<StockLevel, { bar: string; badge: string; badgeText: string; threshold: string }> = {
  ok: { bar: "bg-green-500", badge: "bg-green-100 text-green-700", badgeText: "Stock OK", threshold: "" },
  low: { bar: "bg-amber-400", badge: "bg-amber-100 text-amber-700", badgeText: "Stock faible", threshold: "" },
  critical: { bar: "bg-red-500", badge: "bg-red-100 text-red-700", badgeText: "Critique", threshold: "" },
};

const tok = () => localStorage.getItem("megacare_token") ?? "";

const INITIAL: Supply[] = [];

type FilterLevel = "all" | StockLevel;

interface RequestModal {
  supply: Supply;
  qty: number;
  note: string;
}

export default function SuppliesPage() {
  const [supplies, setSupplies] = useState<Supply[]>(INITIAL);
  const [filter, setFilter] = useState<FilterLevel>("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<RequestModal | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/paramedical/supplies", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => setSupplies(Array.isArray(d) ? d : []))
      .catch(() => { });
  }, []);

  const filtered = supplies.filter((s) => {
    const matchFilter = filter === "all" || s.level === filter;
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const lowCount = supplies.filter((s) => s.level === "low").length;
  const critCount = supplies.filter((s) => s.level === "critical").length;
  const orderedCount = supplies.filter((s) => s.ordered).length;

  const openRequest = (s: Supply) => setModal({ supply: s, qty: 1, note: "" });

  const confirmRequest = async () => {
    if (!modal) return;
    const r = await fetch(`/api/paramedical/supplies/${modal.supply.id}/order`, {
      method: "POST",
      headers: { Authorization: `Bearer ${tok()}` },
    }).catch(() => null);
    if (r && r.ok) {
      const data = await r.json();
      setSupplies((prev) => prev.map((s) => (s.id === modal.supply.id ? data : s)));
    }
    setModal(null);
    setToast(`Demande de livraison envoyée pour : ${modal.supply.name}`);
    setTimeout(() => setToast(""), 3500);
  };

  const pct = (s: Supply) => Math.round((s.current / s.max) * 100);

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Matériel médical</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {supplies.length} articles · {orderedCount} commande{orderedCount !== 1 ? "s" : ""} en cours
            </p>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Toast */}
          {toast && (
            <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm">
              <Check size={15} />
              {toast}
            </div>
          )}

          {/* Low-stock banner */}
          {(critCount > 0 || lowCount > 0) && (
            <div className={`rounded-xl border p-4 flex items-start gap-3 ${critCount > 0 ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
              }`}>
              <AlertTriangle size={18} className={critCount > 0 ? "text-red-600 shrink-0 mt-0.5" : "text-amber-600 shrink-0 mt-0.5"} />
              <div>
                <p className={`font-semibold text-sm ${critCount > 0 ? "text-red-800" : "text-amber-800"}`}>
                  {critCount > 0
                    ? `${critCount} article${critCount > 1 ? "s" : ""} en stock critique`
                    : `${lowCount} article${lowCount > 1 ? "s" : ""} en stock faible`}
                </p>
                <p className={`text-xs mt-0.5 ${critCount > 0 ? "text-red-600" : "text-amber-600"}`}>
                  Commandez rapidement pour éviter une rupture de stock.
                </p>
              </div>
            </div>
          )}

          {/* KPI row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total articles", value: supplies.length, color: "text-foreground" },
              { label: "Stocks critiques", value: critCount, color: "text-red-600" },
              { label: "Stocks faibles", value: lowCount, color: "text-amber-600" },
              { label: "Commandes en cours", value: orderedCount, color: "text-primary" },
            ].map((k) => (
              <div key={k.label} className="bg-card border border-border rounded-xl px-4 py-3 text-center">
                <p className={`text-2xl font-bold ${k.color}`}>{k.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-36">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            {(["all", "ok", "low", "critical"] as FilterLevel[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${filter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card border-border text-muted-foreground hover:border-primary/40"
                  }`}
              >
                {f === "all" ? "Tout" : f === "ok" ? "Stock OK" : f === "low" ? "Faible" : "Critique"}
              </button>
            ))}
          </div>

          {/* Supply list */}
          <div className="space-y-2.5">
            {filtered.length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                <Package size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">Aucun article correspondant</p>
              </div>
            )}
            {filtered.map((s) => {
              const cfg = levelConfig[s.level];
              const p = pct(s);
              return (
                <div key={s.id} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground">{s.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.badge}`}>
                          {cfg.badgeText}
                        </span>
                        {s.ordered && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-100 text-blue-700">
                            Commandé
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.category}</p>

                      {/* Stock bar */}
                      <div className="mt-2.5 space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{s.current} {s.unit}</span>
                          <span>{p}% du stock max ({s.max} {s.unit})</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${cfg.bar}`}
                            style={{ width: `${Math.max(p, 2)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    {!s.ordered && s.level !== "ok" && (
                      <button
                        onClick={() => openRequest(s)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition shrink-0"
                      >
                        <ShoppingCart size={13} />
                        Commander
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Request modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">Demande de livraison</h2>
                <p className="text-sm text-muted-foreground">{modal.supply.name}</p>
              </div>
              <button onClick={() => setModal(null)} className="p-1 text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Quantité souhaitée ({modal.supply.unit})</label>
                <input
                  type="number"
                  min={1}
                  value={modal.qty}
                  onChange={(e) => setModal({ ...modal, qty: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Note (optionnel)</label>
                <textarea
                  rows={2}
                  placeholder="Précision ou urgence..."
                  value={modal.note}
                  onChange={(e) => setModal({ ...modal, note: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setModal(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground transition">
                Annuler
              </button>
              <button
                onClick={confirmRequest}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-1.5"
              >
                <ShoppingCart size={14} />
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
