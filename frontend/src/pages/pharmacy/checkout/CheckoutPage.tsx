
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from 'react-router-dom';
import { ChevronRight, Check } from "lucide-react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    zipCode: "",
    phone: "",
    email: "",
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Passer votre commande
          </h1>

          {/* Steps Indicator */}
          <div className="flex gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                >
                  {step > s ? <Check size={20} /> : s}
                </div>
                <p className="text-xs text-center mt-2 text-muted-foreground">
                  {s === 1 ? "Adresse" : s === 2 ? "Paiement" : "Confirmation"}
                </p>
              </div>
            ))}
          </div>

          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="bg-card border border-border rounded-lg p-8 space-y-6 mb-8">
              <h2 className="text-xl font-bold text-foreground">
                Adresse de livraison
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-foreground">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Rue de la Paix"
                    className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">
                      Ville
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Casablanca"
                      className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground">
                      Code postal
                    </label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="20000"
                      className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+212 6 12 34 56 78"
                    className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="exemple@email.com"
                    className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                Continuer vers le paiement <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-card border border-border rounded-lg p-8 space-y-6 mb-8">
              <h2 className="text-xl font-bold text-foreground">
                Mode de paiement
              </h2>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    defaultChecked
                    className="w-4 h-4"
                    onChange={handleChange}
                  />
                  <span className="font-semibold text-foreground">
                    Carte bancaire
                  </span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary">
                  <input
                    type="radio"
                    name="payment"
                    value="cash"
                    className="w-4 h-4"
                    onChange={handleChange}
                  />
                  <span className="font-semibold text-foreground">
                    Paiement à la livraison
                  </span>
                </label>
                <label className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary">
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    className="w-4 h-4"
                    onChange={handleChange}
                  />
                  <span className="font-semibold text-foreground">
                    Portefeuille mobile
                  </span>
                </label>
              </div>

              {formData.paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground">
                      Numéro de carte
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        MM/AA
                      </label>
                      <input
                        type="text"
                        placeholder="12/25"
                        className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-foreground">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full mt-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-border text-foreground py-3 rounded-lg font-semibold hover:bg-secondary transition"
                >
                  Retour
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  Confirmer <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <div className="bg-card border border-border rounded-lg p-8 space-y-6 mb-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check size={32} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Commande confirmée!
                </h2>
                <p className="text-muted-foreground mt-2">
                  Vous recevrez vos médicaments dans 2-4 heures
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  to="/pharmacy/orders"
                  className="block w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Voir mes commandes
                </Link>
                <Link
                  to="/pharmacy"
                  className="block w-full border border-border text-foreground py-3 rounded-lg hover:bg-secondary transition"
                >
                  Continuer les achats
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

