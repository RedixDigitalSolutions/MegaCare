"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  LogOut,
  Plus,
  AlertTriangle,
  Pill,
  Upload,
  Link as LinkIcon,
  Pencil,
  Check,
  X,
  ImagePlus,
} from "lucide-react";

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
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [stock, setStock] = useState<StockItem[]>([
    {
      id: 1,
      name: "Paracétamol 500mg",
      quantity: 320,
      minStock: 100,
      supplier: "EVOLUPHARM",
      price: "2 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 2,
      name: "Amoxicilline 500mg",
      quantity: 45,
      minStock: 100,
      supplier: "SANDOZ",
      price: "9.2 DT",
      warning: true,
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 3,
      name: "Vitamine C 1000mg",
      quantity: 280,
      minStock: 80,
      supplier: "WASSEN",
      price: "5.5 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 4,
      name: "Ibuprofène 400mg",
      quantity: 190,
      minStock: 100,
      supplier: "NUROFEN",
      price: "6 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    {
      id: 5,
      name: "Aspirine 500mg",
      quantity: 215,
      minStock: 80,
      supplier: "BAYER",
      price: "3.5 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 6,
      name: "Oméprazole 20mg",
      quantity: 30,
      minStock: 60,
      supplier: "BIOGARAN",
      price: "7.8 DT",
      warning: true,
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
    {
      id: 7,
      name: "Doliprane 1000mg",
      quantity: 404,
      minStock: 150,
      supplier: "SANOFI",
      price: "3.2 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 8,
      name: "Vitamine D3 1000 UI",
      quantity: 310,
      minStock: 80,
      supplier: "ZYMA D",
      price: "6.9 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    },
    {
      id: 9,
      name: "Magnésium B6",
      quantity: 175,
      minStock: 60,
      supplier: "MAGNE B6",
      price: "8.1 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
    {
      id: 10,
      name: "Cétirizine 10mg",
      quantity: 22,
      minStock: 60,
      supplier: "ZYRTEC",
      price: "5.7 DT",
      warning: true,
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 11,
      name: "Zinc 15mg",
      quantity: 260,
      minStock: 80,
      supplier: "PHYSIOLOGICA",
      price: "4.3 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 12,
      name: "Oméga-3 1000mg",
      quantity: 140,
      minStock: 60,
      supplier: "ISOMEGA",
      price: "15.9 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&fit=crop&q=80",
    },
    {
      id: 13,
      name: "Sirop Toux Sèche",
      quantity: 88,
      minStock: 50,
      supplier: "TOPLEXIL",
      price: "7.8 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&fit=crop&q=80",
    },
    {
      id: 14,
      name: "Sirop Toux Grasse",
      quantity: 110,
      minStock: 50,
      supplier: "MUCOMYST",
      price: "6.5 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&fit=crop&q=80",
    },
    {
      id: 15,
      name: "Sérum Physiologique",
      quantity: 18,
      minStock: 80,
      supplier: "GIFRER",
      price: "3.6 DT",
      warning: true,
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
    {
      id: 16,
      name: "Probiotiques Équilibre",
      quantity: 95,
      minStock: 50,
      supplier: "LACTIBIANE",
      price: "18.9 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&fit=crop&q=80",
    },
    {
      id: 17,
      name: "Diclofénac 50mg",
      quantity: 130,
      minStock: 60,
      supplier: "VOLTARENE",
      price: "8.9 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1550572017-ea058ca87258?w=400&fit=crop&q=80",
    },
    {
      id: 18,
      name: "Fluconazole 150mg",
      quantity: 70,
      minStock: 40,
      supplier: "TRIFLUCAN",
      price: "8.3 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&fit=crop&q=80",
    },
    {
      id: 19,
      name: "Fer 50mg",
      quantity: 55,
      minStock: 60,
      supplier: "TARDYFERON",
      price: "5.1 DT",
      warning: true,
      imageUrl:
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&fit=crop&q=80",
    },
    {
      id: 20,
      name: "Charbon Actif 260mg",
      quantity: 200,
      minStock: 60,
      supplier: "CARBOLEVURE",
      price: "5 DT",
      imageUrl:
        "https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&fit=crop&q=80",
    },
  ]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
    return null;

  const handleUpdateImage = (id: number, imageUrl: string) => {
    setStock((prev) =>
      prev.map((item) => (item.id === id ? { ...item, imageUrl } : item)),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2">
              <Plus size={18} />
              Ajouter un produit
            </button>
            <button
              onClick={logout}
              className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Image management notice */}
        <div className="mb-5 flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
          <ImagePlus size={18} className="text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Gestion des images produit
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ajoutez une image à chaque médicament via un{" "}
              <strong>lien URL</strong> ou en{" "}
              <strong>important un fichier</strong> depuis votre ordinateur. Les
              images seront affichées dans la pharmacie en ligne.
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Médicament
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Min Stock
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Fournisseur
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Prix
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
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
                    {/* Image column */}
                    <td className="px-6 py-4">
                      <ImageEditor item={item} onSave={handleUpdateImage} />
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.quantity} unités
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.minStock} unités
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.price}
                    </td>
                    <td className="px-6 py-4">
                      {item.warning ? (
                        <span className="flex items-center gap-1 text-yellow-700 bg-yellow-100 px-3 py-1 rounded-lg text-xs font-medium">
                          <AlertTriangle size={14} />
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
    </div>
  );
}
