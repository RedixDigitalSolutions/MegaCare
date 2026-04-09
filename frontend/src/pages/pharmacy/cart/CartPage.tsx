import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

export default function CartPage() {
  const [cartItems] = useState([
    {
      id: 1,
      name: "Paracétamol 500mg",
      brand: "EVOLUPHARM",
      price: 2.0,
      quantity: 2,
      pharmacy: "Pharmacie El Amal",
      prescription: false,
    },
    {
      id: 3,
      name: "Vitamine C 1000mg",
      brand: "WASSEN",
      price: 5.5,
      quantity: 1,
      pharmacy: "Pharmacie Moderne",
      prescription: false,
    },
  ]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const total = subtotal;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Mon Panier
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length === 0 ? (
                <div className="bg-card border border-border rounded-lg p-12 text-center space-y-4">
                  <ShoppingCart
                    size={48}
                    className="mx-auto text-muted-foreground opacity-50"
                  />
                  <p className="text-muted-foreground">Votre panier est vide</p>
                  <Link to="/pharmacy" className="text-primary hover:underline">
                    Continuer vos achats
                  </Link>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-lg p-4 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-bold text-foreground">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {item.brand}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.pharmacy}
                        </p>
                      </div>
                      <button className="p-2 hover:bg-secondary rounded transition">
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-secondary rounded">
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button className="p-1 hover:bg-secondary rounded">
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="font-bold text-primary">
                        {(item.price * item.quantity).toFixed(2)}€
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Summary */}
            {cartItems.length > 0 && (
              <div className="space-y-4">
                <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">
                    Résumé de la commande
                  </h2>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total</span>
                      <span className="text-foreground">
                        {subtotal.toFixed(2)} DT
                      </span>
                    </div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary text-lg">
                        {total.toFixed(2)} DT
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/pharmacy/checkout"
                    className="block w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition text-center"
                  >
                    Passer la commande
                  </Link>

                  <button className="w-full border border-border text-foreground py-2 rounded-lg hover:bg-secondary transition">
                    Continuer les achats
                  </button>
                </div>

                {/* Pickup Info */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold text-foreground text-sm">
                    Retrait en pharmacie
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Prêt en 1-2 heures · Gratuit
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
