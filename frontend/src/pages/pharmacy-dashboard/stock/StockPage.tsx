import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  Plus,
  AlertTriangle,
  Pill,
  Upload,
  Link as LinkIcon,
  Check,
  X,
  ImagePlus,
  Pencil,
} from "lucide-react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  minStock: number;
  supplier: string;
  price: string;
  warning?: boolean;
  imageUrl?: string;
}

function ImageEditor({
  item,
  onSave,
}: {
  item: StockItem;
  onSave: (id: number, url: string) => void;
}) {
  const [mode, setMode] = useState<"idle" | "url" | "preview">("idle");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      onSave(item.id, trimmed);
      setUrlInput("");
      setMode("idle");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      onSave(item.id, reader.result as string);
      setMode("idle");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-border bg-secondary/50 flex items-center justify-center shrink-0">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <Pill size={22} className="text-muted-foreground/50" />
        )}
      </div>

      {/* Buttons */}
      {mode === "idle" && (
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setMode("url")}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition border border-border"
          >
            <LinkIcon size={10} />
            URL
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition border border-border"
          >
            <Upload size={10} />
            Importer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {/* URL input */}
      {mode === "url" && (
        <div className="flex items-center gap-1">
          <input
            type="url"
            placeholder="https://..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleUrlSubmit();
              if (e.key === "Escape") {
                setMode("idle");
                setUrlInput("");
              }
            }}
            className="w-40 px-2 py-1 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
          <button
            onClick={handleUrlSubmit}
            className="p-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            <Check size={12} />
          </button>
          <button
            onClick={() => {
              setMode("idle");
              setUrlInput("");
            }}
            className="p-1 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function PharmacyStockPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loadingStock, setLoadingStock] = useState(true);

  // Inline editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState<string>("");

  // Add product modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    supplier: "",
    price: "",
    minStock: "",
    quantity: "",
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== "pharmacy") return;
    fetch("/api/pharmacy/products")
      .then((r) => r.json())
      .then((raw: any) => {
        const data: {
          _id: string;
          name: string;
          stock: number;
          brand: string;
          price: number;
          imageUrl?: string;
        }[] = Array.isArray(raw) ? raw : (raw.data ?? []);
        const mapped: StockItem[] = data.map(
          (p, idx) => ({
            id: idx + 1,
            name: p.name,
            quantity: p.stock,
            minStock: 20,
            supplier: p.brand || "",
            price: `${p.price} DT`,
            warning: p.stock < 20,
            imageUrl: p.imageUrl,
          }),
        );
        setStock(mapped);
        setLoadingStock(false);
      },
      )
      .catch(() => setLoadingStock(false));
  }, [isAuthenticated, user]);

  if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
    return null;

  if (loadingStock)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement du stock…</p>
      </div>
    );

  const handleUpdateImage = (id: number, imageUrl: string) => {
    setStock((prev) =>
      prev.map((item) => (item.id === id ? { ...item, imageUrl } : item)),
    );
  };

  const startEdit = (item: StockItem) => {
    setEditingId(item.id);
    setEditQty(String(item.quantity));
  };

  const saveEdit = (id: number) => {
    const qty = parseInt(editQty, 10);
    if (!isNaN(qty) && qty >= 0) {
      setStock((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: qty, warning: qty < item.minStock }
            : item,
        ),
      );
    }
    setEditingId(null);
  };

  const handleAddProduct = () => {
    const qty = parseInt(newProduct.quantity, 10) || 0;
    const min = parseInt(newProduct.minStock, 10) || 0;
    const newItem: StockItem = {
      id: stock.length > 0 ? Math.max(...stock.map((s) => s.id)) + 1 : 1,
      name: newProduct.name.trim(),
      quantity: qty,
      minStock: min,
      supplier: newProduct.supplier.trim(),
      price: newProduct.price.trim() ? `${newProduct.price.trim()} DT` : "—",
      warning: qty < min,
    };
    setStock((prev) => [...prev, newItem]);
    setNewProduct({
      name: "",
      supplier: "",
      price: "",
      minStock: "",
      quantity: "",
    });
    setShowAddModal(false);
  };

  const lowStock = stock.filter((item) => item.quantity < item.minStock);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <PharmacyDashboardSidebar
          pharmacyName={user.firstName || "Pharmacie Central"}
        />

        <main className="flex-1 overflow-auto">
          {/* Sticky Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Gestion du Stock
                </h1>
                <p className="text-muted-foreground mt-1">
                  Suivi et gestion des médicaments en stock
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2"
              >
                <Plus size={16} />
                Nouveau produit
              </button>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Low-stock alert panel */}
            {lowStock.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} className="text-red-600" />
                  <p className="font-semibold text-red-700 text-sm">
                    {lowStock.length} produit{lowStock.length > 1 ? "s" : ""} en
                    stock faible
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {lowStock.map((item) => (
                    <span
                      key={item.id}
                      className="flex items-center gap-1 text-xs bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-lg"
                    >
                      <AlertTriangle size={11} />
                      <strong>{item.name}</strong>: {item.quantity}/
                      {item.minStock} unités
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Image tip */}
            <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
              <ImagePlus size={16} className="text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Images produit:{" "}
                </span>
                Ajoutez une image via un <strong>lien URL</strong> ou en{" "}
                <strong>important un fichier</strong>. Les images apparaissent
                dans la pharmacie en ligne.
              </p>
            </div>

            {/* Stock table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted">
                      <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">
                        Image
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">
                        Médicament
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">
                        Stock
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">
                        Min Stock
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">
                        Fournisseur
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">
                        Prix
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-semibold text-foreground">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {stock.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-muted/30 transition align-top"
                      >
                        <td className="px-5 py-4">
                          <ImageEditor item={item} onSave={handleUpdateImage} />
                        </td>
                        <td className="px-5 py-4 font-medium text-foreground">
                          {item.name}
                        </td>
                        <td className="px-5 py-4">
                          {editingId === item.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                min={0}
                                value={editQty}
                                onChange={(e) => setEditQty(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit(item.id);
                                  if (e.key === "Escape") setEditingId(null);
                                }}
                                className="w-20 px-2 py-1 text-sm bg-background border border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                                autoFocus
                              />
                              <button
                                onClick={() => saveEdit(item.id)}
                                className="p-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                              >
                                <Check size={12} />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-1 bg-muted text-foreground rounded hover:bg-muted/70"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEdit(item)}
                              className="flex items-center gap-1 group text-muted-foreground hover:text-foreground transition"
                            >
                              <span className="text-sm">
                                {item.quantity} unités
                              </span>
                              <Pencil
                                size={11}
                                className="opacity-0 group-hover:opacity-100 transition"
                              />
                            </button>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {item.minStock} unités
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {item.supplier}
                        </td>
                        <td className="px-5 py-4 text-sm text-muted-foreground">
                          {item.price}
                        </td>
                        <td className="px-5 py-4">
                          {item.quantity < item.minStock ? (
                            <span className="flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-lg text-xs font-medium">
                              <AlertTriangle size={12} />
                              Stock faible
                            </span>
                          ) : (
                            <span className="text-green-700 bg-green-100 px-3 py-1 rounded-lg text-xs font-medium">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">
                Nouveau produit
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 hover:bg-muted rounded-lg transition"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  label: "Nom du médicament *",
                  key: "name",
                  placeholder: "ex: Paracétamol 500mg",
                },
                {
                  label: "Fournisseur",
                  key: "supplier",
                  placeholder: "ex: SANOFI",
                },
                {
                  label: "Prix unitaire (DT)",
                  key: "price",
                  placeholder: "ex: 5.5",
                  type: "number",
                },
                {
                  label: "Stock minimum",
                  key: "minStock",
                  placeholder: "ex: 80",
                  type: "number",
                },
                {
                  label: "Quantité initiale",
                  key: "quantity",
                  placeholder: "ex: 200",
                  type: "number",
                },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={newProduct[field.key as keyof typeof newProduct]}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        [field.key]: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newProduct.name.trim()}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
