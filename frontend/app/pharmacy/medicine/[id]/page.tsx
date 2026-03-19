"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
  Check,
} from "lucide-react";

export default function MedicineDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [quantity, setQuantity] = useState(1);

  interface MedicinePharmacy {
    name: string;
    distance: number;
    price: number;
    delivery: string;
  }

  interface Medicine {
    id: number;
    name: string;
    brand: string;
    form: string;
    dci: string;
    price: number;
    rating: number;
    reviews: number;
    available: number;
    prescription: boolean;
    pharmacy: string;
    distance: number;
    delivery: string;
    description: string;
    usage: string;
    contraindications: string;
    sideEffects: string;
    pharmacies: MedicinePharmacy[];
  }

  const medicines: { [key: string]: Medicine } = {
    "1": {
      id: 1,
      name: "Paracétamol 500mg",
      brand: "EVOLUPHARM",
      form: "Comprimés - Boîte 16",
      dci: "Paracétamol",
      price: 2.0,
      rating: 4.8,
      reviews: 156,
      available: 8,
      prescription: false,
      pharmacy: "Pharmacie El Amal",
      distance: 1.2,
      delivery: "2h",
      description:
        "Antalgique et antipyrétique efficace pour soulager les douleurs légères à modérées.",
      usage:
        "Adultes: 1 à 2 comprimés toutes les 4 à 6 heures sans dépasser 4 comprimés par jour.",
      contraindications:
        "Hypersensibilité au paracétamol. Insuffisance hépatique ou rénale sévère.",
      sideEffects:
        "Généralement bien toléré. Rarement: réactions allergiques, hépatotoxicité.",
      pharmacies: [
        {
          name: "Pharmacie El Amal",
          distance: 1.2,
          price: 2.0,
          delivery: "2h",
        },
        {
          name: "Pharmacie Centrale",
          distance: 2.8,
          price: 2.2,
          delivery: "3h",
        },
        {
          name: "Pharmacie Moderne",
          distance: 0.8,
          price: 2.5,
          delivery: "1h",
        },
      ],
    },
    "2": {
      id: 2,
      name: "Amoxicilline 500mg",
      brand: "SANDOZ",
      form: "Gélules",
      dci: "Amoxicilline",
      price: 9.2,
      rating: 4.6,
      reviews: 89,
      available: 5,
      prescription: true,
      pharmacy: "Pharmacie Centrale",
      distance: 2.8,
      delivery: "3h",
      description:
        "Antibiotique de la famille des pénicillines. Efficace contre les infections bactériennes.",
      usage:
        "Adultes: 500mg toutes les 8 heures. Durée: 7 à 14 jours selon la prescription.",
      contraindications: "Allergie aux pénicillines. Mononucléose infectieuse.",
      sideEffects: "Diarrhée, nausées. Rarement: réactions allergiques graves.",
      pharmacies: [
        {
          name: "Pharmacie Centrale",
          distance: 2.8,
          price: 9.2,
          delivery: "3h",
        },
        {
          name: "Pharmacie El Amal",
          distance: 1.2,
          price: 9.5,
          delivery: "2h",
        },
      ],
    },
  };

  const medicine = medicines[params.id];

  if (!medicine) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Médicament non trouvé</p>
            <Link href="/pharmacy" className="text-primary hover:underline">
              Retour à la pharmacie
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link
            href="/pharmacy"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft size={18} />
            Retour à la pharmacie
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Image & Basic Info */}
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                {/* Product image placeholder */}
                <div className="text-6xl opacity-30">💊</div>
              </div>

              {/* Quick Action */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Quantité
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 bg-secondary rounded hover:bg-secondary/80"
                    >
                      -
                    </button>
                    <span className="flex-1 text-center">{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(medicine.available, quantity + 1))
                      }
                      className="px-3 py-2 bg-secondary rounded hover:bg-secondary/80"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                  <ShoppingCart size={20} />
                  Ajouter au panier ({medicine.price * quantity} DT)
                </button>

                {medicine.prescription && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
                    <div className="flex gap-2">
                      <AlertCircle
                        size={18}
                        className="text-orange-600 flex-shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="font-semibold text-orange-900">
                          Ordonnance requise
                        </p>
                        <p className="text-sm text-orange-800">
                          Vous devez fournir une ordonnance valide pour ce
                          médicament.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability Badge */}
              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${medicine.available > 0 ? "bg-green-500" : "bg-red-500"}`}
                  />
                  <span className="text-sm font-semibold">
                    {medicine.available > 0
                      ? `${medicine.available} en stock`
                      : "Rupture de stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    {medicine.name}
                  </h1>
                  <p className="text-muted-foreground">{medicine.form}</p>
                  <p className="text-muted-foreground text-sm">
                    Marque: {medicine.brand}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Principe actif: {medicine.dci}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={
                            i < Math.floor(medicine.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-semibold">{medicine.rating}</span>
                  </div>
                  <p className="text-muted-foreground">
                    ({medicine.reviews} avis)
                  </p>
                </div>
              </div>

              {/* Price & Pharmacies */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">À partir de</p>
                  <p className="text-3xl font-bold text-primary">
                    {medicine.price} DT
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">
                    Disponible dans ces pharmacies:
                  </h3>
                  {medicine.pharmacies.map(
                    (pharm: MedicinePharmacy, idx: number) => (
                      <div
                        key={idx}
                        className="border border-border rounded p-3 space-y-2"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-foreground">
                              {pharm.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {pharm.distance}km • Livraison {pharm.delivery}
                            </p>
                          </div>
                          <span className="font-bold text-primary">
                            {pharm.price} DT
                          </span>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Description
                  </h2>
                  <p className="text-foreground leading-relaxed">
                    {medicine.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Utilisation
                  </h2>
                  <p className="text-foreground leading-relaxed">
                    {medicine.usage}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Contre-indications
                  </h2>
                  <p className="text-foreground leading-relaxed">
                    {medicine.contraindications}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Effets secondaires
                  </h2>
                  <p className="text-foreground leading-relaxed">
                    {medicine.sideEffects}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
