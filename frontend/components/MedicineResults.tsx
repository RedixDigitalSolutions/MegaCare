import { ExtractedMedicine } from "@/lib/ocr-utils";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, AlertCircle, CircleCheckBig } from "lucide-react";
import { useState } from "react";

interface MedicineResultsProps {
  medicines: ExtractedMedicine[];
  pharmacyName?: string;
  onAddToCart?: (medicine: ExtractedMedicine) => void;
}

export function MedicineResults({
  medicines,
  pharmacyName,
  onAddToCart,
}: MedicineResultsProps) {
  const [cartItems, setCartItems] = useState<Set<string>>(new Set());

  const handleAddToCart = (medicine: ExtractedMedicine) => {
    onAddToCart?.(medicine);
    setCartItems((prev) => new Set([...prev, medicine.name]));

    setTimeout(() => {
      setCartItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(medicine.name);
        return newSet;
      });
    }, 2000);
  };

  if (medicines.length === 0) {
    return (
      <Card className="p-8 text-center bg-secondary/30 border-dashed">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">
          Aucun médicament détecté dans l'ordonnance
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Veuillez uploader une ordonnance lisible
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {pharmacyName && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground">
            Disponibilité à{" "}
            <span className="font-semibold">{pharmacyName}</span>
          </p>
        </div>
      )}

      <div className="grid gap-3">
        {medicines.map((medicine, index) => (
          <Card
            key={`${medicine.name}-${index}`}
            className="p-4 hover:shadow-md transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">
                    {medicine.name}
                  </h3>
                  {medicine.foundMedicine?.inStock ? (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CircleCheckBig className="w-3 h-3 mr-1" />
                      En stock
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-200"
                    >
                      Rupture de stock
                    </Badge>
                  )}
                </div>

                <div className="space-y-1 text-sm text-muted-foreground">
                  {medicine.dosage && (
                    <p>
                      <span className="font-medium text-foreground">
                        Dosage:
                      </span>{" "}
                      {medicine.dosage}
                    </p>
                  )}
                  {medicine.foundMedicine?.category && (
                    <p>
                      <span className="font-medium text-foreground">
                        Catégorie:
                      </span>{" "}
                      {medicine.foundMedicine.category}
                    </p>
                  )}
                  {medicine.foundMedicine?.description && (
                    <p className="text-xs mt-2">
                      {medicine.foundMedicine.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                {medicine.foundMedicine?.price && (
                  <div className="text-lg font-bold text-primary">
                    {medicine.foundMedicine.price.toFixed(2)} TND
                  </div>
                )}
                <Button
                  onClick={() => handleAddToCart(medicine)}
                  size="sm"
                  disabled={
                    !medicine.foundMedicine?.inStock ||
                    cartItems.has(medicine.name)
                  }
                  className="w-fit"
                >
                  {cartItems.has(medicine.name) ? (
                    <>
                      <CircleCheckBig className="w-4 h-4 mr-1" />
                      Ajouté
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Panier
                    </>
                  )}
                </Button>
              </div>
            </div>

            {medicine.foundMedicine?.quantity &&
              medicine.foundMedicine.quantity < 10 && (
                <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  Seulement {medicine.foundMedicine.quantity} exemplaire(s) en
                  stock
                </div>
              )}
          </Card>
        ))}
      </div>
    </div>
  );
}
