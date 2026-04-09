import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Download,
  Phone,
  Clock,
  CheckCircle,
  Package,
  ArrowLeft,
} from "lucide-react";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = {
    id: id,
    date: "2024-01-18",
    status: "pret",
    items: [
      { name: "Ibuproféne 400mg", quantity: 1, price: 6.0 },
      { name: "Paracétamol 500mg", quantity: 2, price: 2.0 },
    ],
    subtotal: 10.0,
    total: 10.0,
    pharmacy: "Pharmacie El Amal",
    pharmacyPhone: "+216 74 12 34 56",
  };

  const timeline = [
    { status: "Commande confirmée", date: "2024-01-18 10:30", completed: true },
    {
      status: "Validée par le pharmacien",
      date: "2024-01-18 11:00",
      completed: true,
    },
    { status: "En préparation", date: "2024-01-18 14:00", completed: true },
    { status: "Prête pour retrait", date: "Aujourd'hui", completed: false },
  ];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <Link
            to="/pharmacy/orders"
            className="flex items-center gap-2 text-primary hover:underline mb-8"
          >
            <ArrowLeft size={18} />
            Retour aux commandes
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {order.id}
                    </h1>
                    <p className="text-muted-foreground">
                      Commandée le{" "}
                      {new Date(order.date).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-primary">
                      {order.total.toFixed(2)}€
                    </p>
                    <p className="text-muted-foreground text-sm">Total</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-bold text-foreground">
                  Suivi de la commande
                </h2>
                <div className="space-y-4">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? "bg-green-500 text-white" : "bg-gray-300"}`}
                        >
                          {step.completed ? (
                            <CheckCircle size={20} />
                          ) : (
                            <Clock size={20} />
                          )}
                        </div>
                        {idx < timeline.length - 1 && (
                          <div
                            className={`w-1 h-12 ${step.completed ? "bg-green-500" : "bg-gray-300"}`}
                          />
                        )}
                      </div>
                      <div className="pb-4">
                        <h3
                          className={`font-semibold ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.status}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-bold text-foreground">
                  Articles de la commande
                </h2>
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-semibold text-foreground">
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Quantité: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-primary">
                        {(item.price * item.quantity).toFixed(2)} DT
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      {order.total.toFixed(2)} DT
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Pickup Info */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-foreground">
                  Retrait en pharmacie
                </h3>
                <p className="text-sm text-muted-foreground">
                  Présentez-vous à la pharmacie munie de votre ordonnance
                  lorsque votre commande est prête.
                </p>
              </div>

              {/* Pharmacy Info */}
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="font-bold text-foreground">Pharmacie</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-semibold text-foreground">
                      {order.pharmacy}
                    </p>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg hover:bg-blue-100 transition">
                    <Phone size={18} />
                    Appeler
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition">
                  <Download size={18} />
                  Facture
                </button>
                <Link
                  to="/pharmacy/chat"
                  className="block w-full text-center bg-secondary text-foreground py-2 rounded-lg hover:bg-secondary/80 transition"
                >
                  Chat pharmacien
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
