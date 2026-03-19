"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Pill,
  ChevronDown,
  Camera,
  MapPin,
  CircleCheckBig,
  Zap,
} from "lucide-react";

export default function PharmacyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState<"price" | "rating" | "delivery">(
    "price",
  );
  const [cartCount, setCartCount] = useState(0);

  const categories = [
    { name: "Tous", count: 245, icon: "💊" },
    { name: "Médicaments avec ordonnance", count: 87, icon: "📋" },
    { name: "Médicaments sans ordonnance", count: 120, icon: "✓" },
    { name: "Vitamines & Suppléments", count: 54, icon: "🌿" },
    { name: "Dermatologie", count: 38, icon: "🧴" },
    { name: "Grippe & Rhume", count: 32, icon: "🤧" },
  ];

  const medicines = [
    {
      id: 1,
      name: "Paracétamol 500mg",
      form: "Comprimés - Boîte 16",
      brand: "EVOLUPHARM",
      dci: "Paracétamol",
      price: 2.0,
      rating: 4.8,
      reviews: 156,
      available: 8,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Antalgique et antipyrétique",
    },
    {
      id: 2,
      name: "Amoxicilline 500mg",
      form: "Gélules",
      brand: "SANDOZ",
      dci: "Amoxicilline",
      price: 9.2,
      rating: 4.6,
      reviews: 89,
      available: 5,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description: "Antibiotique - Nécessite ordonnance",
    },
    {
      id: 3,
      name: "Vitamine C 1000mg",
      form: "Comprimés effervescents",
      brand: "WASSEN",
      dci: "Acide ascorbique",
      price: 5.5,
      rating: 4.9,
      reviews: 234,
      available: 20,
      prescription: false,
      pharmacy: "Pharmacie Moderne",
      distance: 0.8,
      delivery: "1h",
      description: "Renforce l'immunité",
    },
    {
      id: 4,
      name: "Ibuproféne 400mg",
      form: "Comprimés - Boîte 30",
      brand: "NUROFEN",
      dci: "Ibuproféne",
      price: 6.0,
      rating: 4.7,
      reviews: 178,
      available: 15,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description: "Anti-inflammatoire et analgésique",
    },
  ];

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.dci.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" ||
      (selectedCategory === "Médicaments avec ordonnance" &&
        med.prescription) ||
      (selectedCategory === "Médicaments sans ordonnance" && !med.prescription);
    const matchesPrice =
      med.price >= priceRange[0] && med.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Pharmacie en Ligne</h1>
              <p className="text-lg opacity-90">
                Trouvez vos médicaments et faites-vous livrer rapidement
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher par nom, principe actif, symptôme..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Quick Links */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/pharmacy/prescriptions"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                Mes ordonnances
              </Link>
              <Link
                href="/pharmacy/orders"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                Mes commandes
              </Link>
              <Link
                href="/pharmacy/chat"
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition"
              >
                Chat pharmacien
              </Link>
            </div>
          </div>
        </div>

        {/* Scanner Promotion Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-200 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Camera className="w-6 h-6 text-amber-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-amber-900">
                      Scannez votre ordonnance
                    </h2>
                  </div>
                  <p className="text-amber-800">
                    Utilisez notre scanner intelligent pour extraire
                    automatiquement les médicaments de votre ordonnance médicale
                  </p>
                </div>

                {/* Process Steps */}
                <div className="space-y-3">
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900">
                        Trouvez une pharmacie
                      </p>
                      <p className="text-sm text-amber-700">
                        Localisez les pharmacies proches de vous en quelques
                        secondes
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900">
                        Scannez l'ordonnance
                      </p>
                      <p className="text-sm text-amber-700">
                        Prenez une photo ou uploadez l'image de votre ordonnance
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900">
                        Extrayez les médicaments
                      </p>
                      <p className="text-sm text-amber-700">
                        L'IA extrait automatiquement les noms des médicaments
                        prescrits
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                      4
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900">
                        Commandez et recevez
                      </p>
                      <p className="text-sm text-amber-700">
                        Livraison rapide à votre pharmacie sélectionnée
                      </p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/pharmacy/prescription-scanner"
                  className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  <Camera size={20} />
                  Commencer le scanner
                </Link>
              </div>

              {/* Right Content - Visual */}
              <div className="hidden lg:block">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl p-8 text-center space-y-6">
                  <div className="text-6xl">📸</div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <p className="text-sm text-amber-900 font-semibold">
                        Scanner intelligent
                      </p>
                      <p className="text-xs text-amber-700">
                        Reconnaissance optique (OCR)
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white rounded-lg p-3 text-center">
                        <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                        <p className="text-xs text-amber-900 font-semibold">
                          Instant
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center">
                        <CircleCheckBig className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                        <p className="text-xs text-amber-900 font-semibold">
                          Précis
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-amber-800">
                    ✨ Technologie de pointe pour une extraction 100% fiable des
                    médicaments de votre ordonnance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Categories & Filters */}
            <div className="space-y-6">
              {/* Categories */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Pill size={18} /> Catégories
                </h3>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`block w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === cat.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary text-foreground"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {cat.icon} {cat.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({cat.count})
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Price Filter */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground">Prix</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground">
                    Jusqu'à {priceRange[1]}€
                  </div>
                </div>
              </div>

              {/* Sort Options */}
              <div className="bg-card rounded-lg border border-border p-4 space-y-3">
                <h3 className="font-bold text-foreground">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "price" | "rating" | "delivery")
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="price">Prix (croissant)</option>
                  <option value="rating">Note (décroissant)</option>
                  <option value="delivery">Livraison la plus rapide</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {filteredMedicines.length === 0 ? (
                <div className="text-center py-12">
                  <Pill
                    size={48}
                    className="mx-auto mb-4 text-muted-foreground opacity-50"
                  />
                  <p className="text-muted-foreground">
                    Aucun médicament trouvé
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredMedicines.map((med) => (
                    <Link
                      key={med.id}
                      href={`/pharmacy/medicine/${med.id}`}
                      className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center group-hover:from-blue-100 group-hover:to-blue-200 transition relative">
                        <Pill size={64} className="text-primary opacity-50" />
                        {med.prescription && (
                          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                            Ordonnance requise
                          </div>
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition">
                            {med.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {med.form}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {med.brand}
                          </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < Math.floor(med.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({med.reviews})
                          </span>
                        </div>

                        {/* Info */}
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {med.pharmacy}
                            </span>
                            <span className="text-muted-foreground">
                              {med.distance}km
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Livraison: {med.delivery}
                            </span>
                            <span className="text-muted-foreground">
                              {med.available} en stock
                            </span>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-lg font-bold text-primary">
                            {med.price}€
                          </span>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setCartCount((prev) => prev + 1);
                            }}
                            className="bg-primary text-primary-foreground p-2 rounded-lg hover:bg-primary/90 transition"
                          >
                            <ShoppingCart size={18} />
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
