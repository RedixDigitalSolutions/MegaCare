import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { X, Star, MapPin, Zap, ShoppingCart, Pill, Package, CheckCircle, } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
export function MedicineModal({ medicine, isOpen, onClose, onAddToCart, }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [addedFeedback, setAddedFeedback] = useState(false);
    if (!isOpen || !medicine)
        return null;
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
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 z-20 p-1.5 rounded-full bg-background border border-border hover:bg-secondary transition", "aria-label": "Fermer", children: _jsx(X, { size: 16 }) }), _jsxs("div", { className: `relative h-56 flex items-center justify-center overflow-hidden ${medicine.prescription
                            ? "bg-gradient-to-br from-orange-50 to-red-100"
                            : "bg-gradient-to-br from-blue-50 to-indigo-100"}`, children: [medicine.imageUrl ? (_jsx("img", { src: medicine.imageUrl, alt: medicine.name, className: "h-full w-full object-contain p-6" })) : (_jsx("div", { className: "w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg", children: _jsx(Pill, { size: 48, className: medicine.prescription ? "text-orange-500" : "text-primary" }) })), _jsx("div", { className: "absolute top-4 left-4", children: _jsx("span", { className: `text-xs font-semibold px-3 py-1.5 rounded-full ${medicine.prescription
                                        ? "bg-orange-500 text-white"
                                        : "bg-green-500 text-white"}`, children: medicine.prescription
                                        ? "📋 Ordonnance requise"
                                        : "✓ Sans ordonnance" }) })] }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-foreground leading-tight", children: medicine.name }), _jsx("p", { className: "text-muted-foreground text-sm mt-1", children: medicine.form })] }), _jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("span", { className: "bg-primary/10 text-primary text-sm px-3 py-1 rounded-full font-medium", children: medicine.brand }), _jsxs("span", { className: "bg-secondary text-secondary-foreground text-sm px-3 py-1 rounded-full", children: ["DCI: ", medicine.dci] })] }), _jsx("p", { className: "text-sm text-foreground/80 leading-relaxed border-l-4 border-primary/30 pl-3 italic", children: medicine.description }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "bg-secondary/50 rounded-xl p-3 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Package, { size: 13, className: "text-primary" }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Stock" })] }), _jsx("span", { className: `text-sm font-bold ${medicine.available > 10
                                                    ? "text-green-600"
                                                    : medicine.available > 3
                                                        ? "text-yellow-600"
                                                        : "text-red-600"}`, children: medicine.available > 0
                                                    ? `${medicine.available} unités dispo.`
                                                    : "Rupture de stock" })] }), _jsxs("div", { className: "bg-secondary/50 rounded-xl p-3 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Zap, { size: 13, className: "text-green-500" }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Livraison" })] }), _jsxs("span", { className: "text-sm font-bold text-foreground", children: ["En ", medicine.delivery] })] }), _jsxs("div", { className: "bg-secondary/50 rounded-xl p-3 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { size: 13, className: "text-primary" }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Pharmacie" })] }), _jsx("span", { className: "text-sm font-bold text-foreground leading-tight", children: medicine.pharmacy }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["\u00E0 ", medicine.distance, " km"] })] }), _jsxs("div", { className: "bg-secondary/50 rounded-xl p-3 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Star, { size: 13, className: "text-yellow-400" }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "\u00C9valuation" })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-sm font-bold text-foreground", children: medicine.rating }), _jsx("div", { className: "flex gap-0.5 ml-0.5", children: [...Array(5)].map((_, i) => (_jsx(Star, { size: 10, className: i < Math.floor(medicine.rating)
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "fill-gray-200 text-gray-200" }, i))) })] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [medicine.reviews, " avis"] })] })] }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-border gap-4", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-3xl font-bold text-primary", children: [medicine.price, " DT"] }), _jsx("span", { className: "text-xs text-muted-foreground ml-1.5", children: "TTC" })] }), _jsx("button", { onClick: handleAddToCart, disabled: medicine.available === 0, className: `flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all flex-shrink-0 ${addedFeedback
                                            ? "bg-green-500 text-white"
                                            : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"} disabled:opacity-50 disabled:cursor-not-allowed`, children: addedFeedback ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { size: 18 }), "Ajout\u00E9 !"] })) : (_jsxs(_Fragment, { children: [_jsx(ShoppingCart, { size: 18 }), !isAuthenticated
                                                    ? "Se connecter pour commander"
                                                    : medicine.available === 0
                                                        ? "Indisponible"
                                                        : "Ajouter au panier"] })) })] })] })] })] }));
}
