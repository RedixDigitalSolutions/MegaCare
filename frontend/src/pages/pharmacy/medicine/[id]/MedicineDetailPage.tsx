import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

interface Medicine {
  id: string;
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
}

export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/pharmacy/products/${id}`)
      .then((res) => {
        if (res.status === 404) { setNotFound(true); return null; }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setMedicine({
          id: String(data._id ?? data.id),
          name: data.name,
          brand: data.brand || "",
          form: data.form || "",
          dci: data.dci || "",
          price: data.price,
          rating: data.rating ?? 4.5,
          reviews: data.reviews ?? 0,
          available: data.stock ?? 0,
          prescription: data.requiresPrescription ?? false,
          pharmacy: data.pharmacy || "Pharmacie Centrale",
          distance: data.distance ?? 1.5,
          delivery: data.delivery || "2h",
          description: data.description || "",
          usage: data.usage || "",
          contraindications: data.contraindications || "",
          sideEffects: data.sideEffects || "",
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-muted-foreground">Chargement...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (notFound || !medicine) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center pt-24">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">MÃ©dicament non trouvÃ©</p>
            <Link to="/pharmacy" className="text-primary hover:underline">
              Retour Ã  la pharmacie
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
            to="/pharmacy"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft size={18} />
            Retour Ã  la pharmacie
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Image & Basic Info */}
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-6xl opacity-30">ðŸ’Š</div>
              </div>

              {/* Quick Action */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    QuantitÃ©
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
                  Ajouter au panier ({(medicine.price * quantity).toFixed(2)} DT)
                </button>

                {medicine.prescription && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
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
                          mÃ©dicament.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability Badge */}
              <div className="bg-card border border-border rounded-lg p-4">
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

              {/* Price & Pharmacy */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">Ã€ partir de</p>
                  <p className="text-3xl font-bold text-primary">
                    {medicine.price} DT
                  </p>
                </div>

                <div className="border border-border rounded p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">
                        {medicine.pharmacy}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {medicine.distance}km â€¢ Livraison {medicine.delivery}
                      </p>
                    </div>
                    <span className="font-bold text-primary">
                      {medicine.price} DT
                    </span>
                  </div>
                </div>
              </div>

              {/* Description & Medical Info */}
              <div className="space-y-4">
                {medicine.description && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Description
                    </h2>
                    <p className="text-foreground leading-relaxed">
                      {medicine.description}
                    </p>
                  </div>
                )}

                {medicine.usage && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Utilisation
                    </h2>
                    <p className="text-foreground leading-relaxed">
                      {medicine.usage}
                    </p>
                  </div>
                )}

                {medicine.contraindications && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Contre-indications
                    </h2>
                    <p className="text-foreground leading-relaxed">
                      {medicine.contraindications}
                    </p>
                  </div>
                )}

                {medicine.sideEffects && (
                  <div>
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      Effets secondaires
                    </h2>
                    <p className="text-foreground leading-relaxed">
                      {medicine.sideEffects}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

