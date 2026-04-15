import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PharmacySelector } from "@/components/PharmacySelector";
import { PrescriptionUploader } from "@/components/PrescriptionUploader";
import { MedicineResults } from "@/components/MedicineResults";
import { getPharmaciesNearby } from "@/lib/pharmacy-data";
import { extractPrescriptionInfo } from "@/lib/ocr-utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Upload, Pill } from "lucide-react";
export default function PrescriptionScannerPage() {
    const [step, setStep] = useState("pharmacy");
    const [pharmacies, setPharmacies] = useState([]);
    const [selectedPharmacy, setSelectedPharmacy] = useState(null);
    const [isLoadingPharmacies, setIsLoadingPharmacies] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedMedicines, setExtractedMedicines] = useState([]);
    const [ocrText, setOcrText] = useState("");
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [cart, setCart] = useState([]);
    const [addedToCart, setAddedToCart] = useState(new Set());
    // Get user location and nearby pharmacies
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lng: longitude });
                const nearbyPharmacies = getPharmaciesNearby(latitude, longitude, 10);
                setPharmacies(nearbyPharmacies);
                setIsLoadingPharmacies(false);
            }, (error) => {
                console.error("Erreur géolocalisation:", error);
                // Fallback to default pharmacies
                setPharmacies(getPharmaciesNearby(33.9716, 9.5375, 10));
                setIsLoadingPharmacies(false);
            });
        }
    }, []);
    const enrichMedicinesFromDB = async (medicines) => {
        return Promise.all(medicines.map(async (med) => {
            try {
                const res = await fetch(`/api/pharmacy/products?search=${encodeURIComponent(med.name)}`);
                if (res.ok) {
                    const results = await res.json();
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
            }
            catch { /* ignore */ }
            return med;
        }));
    };
    const handleFileSelected = async (file) => {
        setSelectedFile(file);
        setError(null);
        setIsProcessing(true);
        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const imageData = event.target?.result;
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
                }
                catch (ocrError) {
                    console.error("Erreur OCR:", ocrError);
                    setError("Impossible de lire l'ordonnance. Veuillez réessayer avec une image plus claire.");
                }
            };
            reader.readAsDataURL(file);
        }
        catch (err) {
            console.error("Erreur traitement fichier:", err);
            setError("Erreur lors du traitement de l'image");
        }
        finally {
            setIsProcessing(false);
        }
    };
    const handlePharmacySelect = (pharmacy) => {
        setSelectedPharmacy(pharmacy);
        setStep("prescription");
    };
    const handleAddToCart = (medicine) => {
        const key = medicine.name + (medicine.dosage ?? "");
        if (addedToCart.has(key))
            return;
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
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(DashboardSidebar, {}), _jsx("main", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "container mx-auto px-4 py-6", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground mb-2", children: "Pharmacie en ligne" }), _jsx("p", { className: "text-muted-foreground", children: "Trouvez les m\u00E9dicaments de votre ordonnance \u00E0 la pharmacie la plus proche" })] }), _jsxs("div", { className: "mb-8", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("div", { className: "flex-1", children: _jsxs("div", { className: `flex items-center gap-3 p-4 rounded-lg transition ${step === "pharmacy"
                                                ? "bg-primary/10 border-2 border-primary"
                                                : "bg-secondary/30 border-2 border-border"}`, children: [_jsx("div", { className: `flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === "pharmacy"
                                                        ? "bg-primary text-white"
                                                        : "bg-secondary text-foreground"}`, children: "1" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-foreground", children: "S\u00E9lectionner la pharmacie" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Choisissez parmi les pharmacies proches" })] }), selectedPharmacy && step !== "pharmacy" && (_jsx(Badge, { className: "ml-auto bg-green-100 text-green-800 hover:bg-green-100", children: "\u2713 Compl\u00E9t\u00E9" }))] }) }) }), step !== "pharmacy" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-8 flex justify-center", children: _jsx("div", { className: "w-0.5 bg-border" }) }), _jsx("div", { className: "flex items-center justify-between", children: _jsx("div", { className: "flex-1", children: _jsxs("div", { className: `flex items-center gap-3 p-4 rounded-lg transition ${step === "prescription"
                                                        ? "bg-primary/10 border-2 border-primary"
                                                        : "bg-secondary/30 border-2 border-border"}`, children: [_jsx("div", { className: `flex items-center justify-center w-10 h-10 rounded-full font-bold ${step === "prescription"
                                                                ? "bg-primary text-white"
                                                                : "bg-secondary text-foreground"}`, children: "2" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-foreground", children: "Scanner l'ordonnance" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Uploadez ou prenez une photo" })] }), selectedFile && step !== "prescription" && (_jsx(Badge, { className: "ml-auto bg-green-100 text-green-800 hover:bg-green-100", children: "\u2713 Compl\u00E9t\u00E9" }))] }) }) })] })), step === "results" && (_jsxs(_Fragment, { children: [_jsx("div", { className: "h-8 flex justify-center", children: _jsx("div", { className: "w-0.5 bg-border" }) }), _jsx("div", { className: "flex items-center justify-between", children: _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex items-center gap-3 p-4 rounded-lg bg-primary/10 border-2 border-primary", children: [_jsx("div", { className: "flex items-center justify-center w-10 h-10 rounded-full font-bold bg-primary text-white", children: "3" }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-foreground", children: "R\u00E9sultats" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "M\u00E9dicaments trouv\u00E9s" })] })] }) }) })] }))] }), error && (_jsx(Card, { className: "mb-6 p-4 border-l-4 border-l-red-500 bg-red-50", children: _jsx("p", { className: "text-red-800 font-medium", children: error }) })), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2", children: [step === "pharmacy" && (_jsxs(Card, { className: "p-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(MapPin, { className: "w-5 h-5 text-primary" }), _jsx("h2", { className: "text-xl font-semibold text-foreground", children: "Pharmacies \u00E0 proximit\u00E9" })] }), _jsx(PharmacySelector, { pharmacies: pharmacies, selectedPharmacy: selectedPharmacy ?? undefined, onSelectPharmacy: handlePharmacySelect, isLoading: isLoadingPharmacies })] })), step === "prescription" && selectedPharmacy && (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { className: "p-6 bg-primary/5 border-primary/20", children: _jsxs("p", { className: "text-sm text-foreground", children: [_jsx("span", { className: "font-semibold", children: "Pharmacie s\u00E9lectionn\u00E9e:" }), " ", selectedPharmacy.name] }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Upload, { className: "w-5 h-5 text-primary" }), _jsx("h2", { className: "text-xl font-semibold text-foreground", children: "Uploader l'ordonnance" })] }), _jsx(PrescriptionUploader, { onFileSelected: handleFileSelected, isProcessing: isProcessing })] }), _jsx(Button, { onClick: () => setStep("pharmacy"), variant: "outline", className: "w-full", children: "Retour au choix de pharmacie" })] })), step === "results" && (_jsxs("div", { className: "space-y-6", children: [_jsx(Card, { className: "p-6 bg-primary/5 border-primary/20", children: _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-sm text-foreground", children: [_jsx("span", { className: "font-semibold", children: "Pharmacie:" }), " ", selectedPharmacy?.name] }), _jsxs("p", { className: "text-sm text-foreground", children: [_jsx("span", { className: "font-semibold", children: "M\u00E9dicaments d\u00E9tect\u00E9s:" }), " ", extractedMedicines.length] }), cart.length > 0 && (_jsxs("p", { className: "text-sm text-primary font-semibold", children: ["Panier: ", cart.length, " m\u00E9dicament", cart.length > 1 ? "s" : "", " ajout\u00E9", cart.length > 1 ? "s" : ""] }))] }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx(Pill, { className: "w-5 h-5 text-primary" }), _jsx("h2", { className: "text-xl font-semibold text-foreground", children: "M\u00E9dicaments" })] }), _jsx(MedicineResults, { medicines: extractedMedicines, pharmacyName: selectedPharmacy?.name, onAddToCart: handleAddToCart })] }), _jsx(Button, { onClick: resetScanner, variant: "outline", className: "w-full", children: "Scanner une autre ordonnance" })] }))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs(Card, { className: "p-4 bg-blue-50 border-blue-200", children: [_jsx("h3", { className: "font-semibold text-blue-900 mb-2", children: "Guide d'utilisation" }), _jsxs("ol", { className: "text-sm text-blue-800 space-y-2 list-decimal list-inside", children: [_jsx("li", { children: "S\u00E9lectionnez votre pharmacie proche" }), _jsx("li", { children: "Uploadez ou photographiez votre ordonnance" }), _jsx("li", { children: "L'IA lira automatiquement les m\u00E9dicaments" }), _jsx("li", { children: "V\u00E9rifiez la disponibilit\u00E9 et les prix" }), _jsx("li", { children: "Ajoutez les m\u00E9dicaments \u00E0 votre panier" })] })] }), _jsxs(Card, { className: "p-4", children: [_jsx("h3", { className: "font-semibold text-foreground mb-3", children: "\u00C9tat" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Pharmacie:" }), _jsx(Badge, { variant: selectedPharmacy ? "default" : "secondary", children: selectedPharmacy ? "Sélectionnée" : "Nécessaire" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Ordonnance:" }), _jsx(Badge, { variant: selectedFile ? "default" : "secondary", children: selectedFile ? "Chargée" : "Nécessaire" })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "M\u00E9dicaments:" }), _jsxs(Badge, { variant: extractedMedicines.length > 0 ? "default" : "secondary", children: [extractedMedicines.length, " trouv\u00E9(s)"] })] })] })] })] })] })] }) })] }));
}
