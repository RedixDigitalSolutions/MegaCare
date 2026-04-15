import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ShoppingCart, AlertCircle, CircleCheckBig } from "lucide-react";
import { useState } from "react";
export function MedicineResults({ medicines, pharmacyName, onAddToCart, }) {
    const [cartItems, setCartItems] = useState(new Set());
    const handleAddToCart = (medicine) => {
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
        return (_jsxs(Card, { className: "p-8 text-center bg-secondary/30 border-dashed", children: [_jsx(AlertCircle, { className: "w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" }), _jsx("p", { className: "text-muted-foreground", children: "Aucun m\u00E9dicament d\u00E9tect\u00E9 dans l'ordonnance" }), _jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Veuillez uploader une ordonnance lisible" })] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [pharmacyName && (_jsx("div", { className: "bg-primary/10 border border-primary/20 rounded-lg p-4", children: _jsxs("p", { className: "text-sm text-foreground", children: ["Disponibilit\u00E9 \u00E0", " ", _jsx("span", { className: "font-semibold", children: pharmacyName })] }) })), _jsx("div", { className: "grid gap-3", children: medicines.map((medicine, index) => (_jsxs(Card, { className: "p-4 hover:shadow-md transition", children: [_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("h3", { className: "font-semibold text-foreground", children: medicine.name }), medicine.foundMedicine?.inStock ? (_jsxs(Badge, { className: "bg-green-100 text-green-800 hover:bg-green-100", children: [_jsx(CircleCheckBig, { className: "w-3 h-3 mr-1" }), "En stock"] })) : (_jsx(Badge, { variant: "outline", className: "text-red-600 border-red-200", children: "Rupture de stock" }))] }), _jsxs("div", { className: "space-y-1 text-sm text-muted-foreground", children: [medicine.dosage && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-foreground", children: "Dosage:" }), " ", medicine.dosage] })), medicine.foundMedicine?.category && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-foreground", children: "Cat\u00E9gorie:" }), " ", medicine.foundMedicine.category] })), medicine.foundMedicine?.description && (_jsx("p", { className: "text-xs mt-2", children: medicine.foundMedicine.description }))] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2 flex-shrink-0", children: [medicine.foundMedicine?.price && (_jsxs("div", { className: "text-lg font-bold text-primary", children: [medicine.foundMedicine.price.toFixed(2), " TND"] })), _jsx(Button, { onClick: () => handleAddToCart(medicine), size: "sm", disabled: !medicine.foundMedicine?.inStock ||
                                                cartItems.has(medicine.name), className: "w-fit", children: cartItems.has(medicine.name) ? (_jsxs(_Fragment, { children: [_jsx(CircleCheckBig, { className: "w-4 h-4 mr-1" }), "Ajout\u00E9"] })) : (_jsxs(_Fragment, { children: [_jsx(ShoppingCart, { className: "w-4 h-4 mr-1" }), "Panier"] })) })] })] }), medicine.foundMedicine?.quantity &&
                            medicine.foundMedicine.quantity < 10 && (_jsxs("div", { className: "mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded", children: ["Seulement ", medicine.foundMedicine.quantity, " exemplaire(s) en stock"] }))] }, `${medicine.name}-${index}`))) })] }));
}
