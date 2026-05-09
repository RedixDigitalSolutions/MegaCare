
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  X,
  MapPin,
  ShoppingCart,
  Pill,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export interface Medicine {
  id: string | number;
  name: string;
  form: string;
  brand: string;
  dci: string;
  price: number;
  rating: number;
  reviews: number;
  available: number;
  prescription: boolean;
  pharmacy: string;
  distance?: number;
  delivery?: string;
  description: string;
  imageUrl?: string;
  category?: string;
}

interface MedicineModalProps {
  medicine: Medicine | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (medicine: Medicine) => void;
}

export function MedicineModal({
  medicine,
  isOpen,
  onClose,
  onAddToCart,
}: MedicineModalProps) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addedFeedback, setAddedFeedback] = useState(false);

  if (!isOpen || !medicine) return null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    onAddToCart(medicine);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-1.5 rounded-full bg-background border border-border hover:bg-secondary transition"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        {/* Hero Image */}
        <div
          className={`relative h-56 flex items-center justify-center overflow-hidden ${medicine.prescription
              ? "bg-gradient-to-br from-orange-50 to-red-100"
              : "bg-gradient-to-br from-blue-50 to-indigo-100"
            }`}
        >
          {medicine.imageUrl ? (
            <img
              src={medicine.imageUrl}
              alt={medicine.name}
              className="h-full w-full object-contain p-6"
            />
          ) : (
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Pill
                size={48}
                className={
                  medicine.prescription ? "text-orange-500" : "text-primary"
                }
              />
            </div>
          )}

          {/* Prescription Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={`text-xs font-semibold px-3 py-1.5 rounded-full ${medicine.prescription
                  ? "bg-orange-500 text-white"
                  : "bg-green-500 text-white"
                }`}
            >
              {medicine.prescription
                ? "📋 Ordonnance requise"
                : "✓ Sans ordonnance"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Name & Form */}
          <div>
            <h2 className="text-2xl font-bold text-foreground leading-tight">
              {medicine.name}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {medicine.form}
            </p>
          </div>

          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            <span className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium">
              {medicine.brand}
            </span>
            <span className="bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full">
              DCI: {medicine.dci}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/80 leading-relaxed border-l-4 border-primary/30 pl-3 italic">
            {medicine.description}
          </p>

          {/* Pharmacy info */}
          {medicine.pharmacy && (
            <div className="flex items-center gap-2 bg-secondary/50 rounded-xl px-4 py-3">
              <MapPin size={14} className="text-primary shrink-0" />
              <span className="text-sm font-semibold text-foreground">{medicine.pharmacy}</span>
              {medicine.distance != null && (
                <span className="ml-auto text-xs text-muted-foreground">{medicine.distance} km</span>
              )}
            </div>
          )}

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-border gap-4">
            <div>
              <span className="text-3xl font-bold text-primary">
                {medicine.price} DT
              </span>
              <span className="text-xs text-muted-foreground ml-1.5">TTC</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={medicine.available === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${addedFeedback
                  ? "bg-green-500 text-white"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {addedFeedback ? (
                <>
                  <CheckCircle size={18} />
                  Ajouté !
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  {!isAuthenticated
                    ? "Se connecter pour commander"
                    : medicine.available === 0
                      ? "Indisponible"
                      : "Ajouter au panier"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
