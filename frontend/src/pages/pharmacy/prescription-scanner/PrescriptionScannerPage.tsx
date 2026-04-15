import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PharmacySelector } from "@/components/PharmacySelector";
import { PrescriptionUploader } from "@/components/PrescriptionUploader";
import { MedicineResults } from "@/components/MedicineResults";
import { Pharmacy, getPharmaciesNearby } from "@/lib/pharmacy-data";
import { extractPrescriptionInfo, ExtractedMedicine } from "@/lib/ocr-utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Upload, Pill } from "lucide-react";

type Step = "pharmacy" | "prescription" | "results";

export default function PrescriptionScannerPage() {
  const [step, setStep] = useState<Step>("pharmacy");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(
    null,
  );
  const [isLoadingPharmacies, setIsLoadingPharmacies] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedMedicines, setExtractedMedicines] = useState<
    ExtractedMedicine[]
  >([]);
  const [ocrText, setOcrText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [cart, setCart] = useState<ExtractedMedicine[]>([]);
  const [addedToCart, setAddedToCart] = useState<Set<string>>(new Set());

  // Get user location and nearby pharmacies
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          const nearbyPharmacies = getPharmaciesNearby(latitude, longitude, 10);
          setPharmacies(nearbyPharmacies);
          setIsLoadingPharmacies(false);
        },
        (error) => {
          console.error("Erreur géolocalisation:", error);
          // Fallback to default pharmacies
          setPharmacies(getPharmaciesNearby(33.9716, 9.5375, 10));
          setIsLoadingPharmacies(false);
        },
      );
    }
  }, []);

  const enrichMedicinesFromDB = async (medicines: ExtractedMedicine[]): Promise<ExtractedMedicine[]> => {
    return Promise.all(
      medicines.map(async (med) => {
        try {
          const res = await fetch(`/api/pharmacy/products?search=${encodeURIComponent(med.name)}`);
          if (res.ok) {
            const json = await res.json();
            const results: any[] = Array.isArray(json) ? json : (json.data ?? []);
            if (results.length > 0) {
              const p = results[0];
              return {
                ...med,
                foundMedicine: {
                  id: String(p._id ?? p.id),
                  name: p.name,
                  dosage: p.form || "",
                  category: p.category || "",
                  price: p.price,
                  inStock: (p.stock ?? 0) > 0,
                  quantity: p.stock ?? 0,
                  description: p.description || "",
                },
              };
            }
          }
        } catch { /* ignore */ }
        return med;
      }),
    );
  };

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIsProcessing(true);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;

        // Use Tesseract.js for OCR
        try {
          const { createWorker } = await import("tesseract.js");
          const worker = await createWorker("fra+eng");
          const result = await worker.recognize(imageData);
          const extractedText = result.data.text;

          setOcrText(extractedText);

          // Extract medicine names from OCR text
          const prescriptionInfo = extractPrescriptionInfo(extractedText);
          const enriched = await enrichMedicinesFromDB(prescriptionInfo.medicines);
          setExtractedMedicines(enriched);

          await worker.terminate();
          setStep("results");
        } catch (ocrError) {
          console.error("Erreur OCR:", ocrError);
          setError(
            "Impossible de lire l'ordonnance. Veuillez réessayer avec une image plus claire.",
          );
        }
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Erreur traitement fichier:", err);
      setError("Erreur lors du traitement de l'image");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePharmacySelect = (pharmacy: Pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setStep("prescription");
  };

  const handleAddToCart = (medicine: ExtractedMedicine) => {
    const key = medicine.name + (medicine.dosage ?? "");
    if (addedToCart.has(key)) return;
    setCart((prev) => [...prev, medicine]);
    setAddedToCart((prev) => new Set(prev).add(key));
  };

  const resetScanner = () => {
    setStep("pharmacy");
    setSelectedFile(null);
    setExtractedMedicines([]);
    setOcrText("");
    setError(null);
    setCart([]);
    setAddedToCart(new Set());
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pharmacie en ligne
            </h1>
            <p className="text-muted-foreground">
              Trouvez les médicaments de votre ordonnance à la pharmacie la plus
              proche
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg transition ${step === "pharmacy"
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-secondary/30 border-2 border-border"
                    }`}
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === "pharmacy"
                      ? "bg-primary text-white"
                      : "bg-secondary text-foreground"
                      }`}
                  >
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Sélectionner la pharmacie
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Choisissez parmi les pharmacies proches
                    </p>
                  </div>
                  {selectedPharmacy && step !== "pharmacy" && (
                    <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">
                      ✓ Complété
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {step !== "pharmacy" && (
              <>
                <div className="h-8 flex justify-center">
                  <div className="w-0.5 bg-border"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div
                      className={`flex items-center gap-3 p-4 rounded-lg transition ${step === "prescription"
                        ? "bg-primary/10 border-2 border-primary"
                        : "bg-secondary/30 border-2 border-border"
                        }`}
                    >
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === "prescription"
                          ? "bg-primary text-white"
                          : "bg-secondary text-foreground"
                          }`}
                      >
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Scanner l'ordonnance
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Uploadez ou prenez une photo
                        </p>
                      </div>
                      {selectedFile && step !== "prescription" && (
                        <Badge className="ml-auto bg-green-100 text-green-800 hover:bg-green-100">
                          ✓ Complété
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {step === "results" && (
              <>
                <div className="h-8 flex justify-center">
                  <div className="w-0.5 bg-border"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/10 border-2 border-primary">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold bg-primary text-white">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          Résultats
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Médicaments trouvés
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <Card className="mb-6 p-4 border-l-4 border-l-red-500 bg-red-50">
              <p className="text-red-800 font-medium">{error}</p>
            </Card>
          )}

          {/* Step Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {step === "pharmacy" && (
                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">
                      Pharmacies à proximité
                    </h2>
                  </div>
                  <PharmacySelector
                    pharmacies={pharmacies}
                    selectedPharmacy={selectedPharmacy ?? undefined}
                    onSelectPharmacy={handlePharmacySelect}
                    isLoading={isLoadingPharmacies}
                  />
                </Card>
              )}

              {step === "prescription" && selectedPharmacy && (
                <div className="space-y-6">
                  <Card className="p-6 bg-primary/5 border-primary/20">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">
                        Pharmacie sélectionnée:
                      </span>{" "}
                      {selectedPharmacy.name}
                    </p>
                  </Card>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">
                        Uploader l'ordonnance
                      </h2>
                    </div>
                    <PrescriptionUploader
                      onFileSelected={handleFileSelected}
                      isProcessing={isProcessing}
                    />
                  </div>

                  <Button
                    onClick={() => setStep("pharmacy")}
                    variant="outline"
                    className="w-full"
                  >
                    Retour au choix de pharmacie
                  </Button>
                </div>
              )}

              {step === "results" && (
                <div className="space-y-6">
                  <Card className="p-6 bg-primary/5 border-primary/20">
                    <div className="space-y-2">
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">Pharmacie:</span>{" "}
                        {selectedPharmacy?.name}
                      </p>
                      <p className="text-sm text-foreground">
                        <span className="font-semibold">
                          Médicaments détectés:
                        </span>{" "}
                        {extractedMedicines.length}
                      </p>
                      {cart.length > 0 && (
                        <p className="text-sm text-primary font-semibold">
                          Panier: {cart.length} médicament
                          {cart.length > 1 ? "s" : ""} ajouté
                          {cart.length > 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                  </Card>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Pill className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold text-foreground">
                        Médicaments
                      </h2>
                    </div>
                    <MedicineResults
                      medicines={extractedMedicines}
                      pharmacyName={selectedPharmacy?.name}
                      onAddToCart={handleAddToCart}
                    />
                  </div>

                  <Button
                    onClick={resetScanner}
                    variant="outline"
                    className="w-full"
                  >
                    Scanner une autre ordonnance
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-4">
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Guide d'utilisation
                </h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Sélectionnez votre pharmacie proche</li>
                  <li>Uploadez ou photographiez votre ordonnance</li>
                  <li>L'IA lira automatiquement les médicaments</li>
                  <li>Vérifiez la disponibilité et les prix</li>
                  <li>Ajoutez les médicaments à votre panier</li>
                </ol>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-3">État</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Pharmacie:</span>
                    <Badge variant={selectedPharmacy ? "default" : "secondary"}>
                      {selectedPharmacy ? "Sélectionnée" : "Nécessaire"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Ordonnance:</span>
                    <Badge variant={selectedFile ? "default" : "secondary"}>
                      {selectedFile ? "Chargée" : "Nécessaire"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Médicaments:</span>
                    <Badge
                      variant={
                        extractedMedicines.length > 0 ? "default" : "secondary"
                      }
                    >
                      {extractedMedicines.length} trouvé(s)
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
