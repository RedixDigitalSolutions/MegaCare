import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, ArrowLeft, AlertCircle, } from "lucide-react";
export default function MedicineDetailPage() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [medicine, setMedicine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    useEffect(() => {
        if (!id)
            return;
        setLoading(true);
        fetch(`/api/pharmacy/products/${id}`)
            .then((res) => {
            if (res.status === 404) {
                setNotFound(true);
                return null;
            }
            return res.json();
        })
            .then((data) => {
            if (!data)
                return;
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
        return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { className: "min-h-screen flex items-center justify-center pt-24", children: _jsx("div", { className: "text-muted-foreground", children: "Chargement..." }) }), _jsx(Footer, {})] }));
    }
    if (notFound || !medicine) {
        return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { className: "min-h-screen flex items-center justify-center pt-24", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-muted-foreground mb-4", children: "M\u00C3\u00A9dicament non trouv\u00C3\u00A9" }), _jsx(Link, { to: "/pharmacy", className: "text-primary hover:underline", children: "Retour \u00C3\u00A0 la pharmacie" })] }) }), _jsx(Footer, {})] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { className: "min-h-screen bg-background pt-24", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [_jsxs(Link, { to: "/pharmacy", className: "flex items-center gap-2 text-primary hover:underline mb-8", children: [_jsx(ArrowLeft, { size: 18 }), "Retour \u00C3\u00A0 la pharmacie"] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "aspect-square bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center", children: _jsx("div", { className: "text-6xl opacity-30", children: "\u00F0\u0178\u2019\u0160" }) }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Quantit\u00C3\u00A9" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => setQuantity(Math.max(1, quantity - 1)), className: "px-3 py-2 bg-secondary rounded hover:bg-secondary/80", children: "-" }), _jsx("span", { className: "flex-1 text-center", children: quantity }), _jsx("button", { onClick: () => setQuantity(Math.min(medicine.available, quantity + 1)), className: "px-3 py-2 bg-secondary rounded hover:bg-secondary/80", children: "+" })] })] }), _jsxs("button", { className: "w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2", children: [_jsx(ShoppingCart, { size: 20 }), "Ajouter au panier (", (medicine.price * quantity).toFixed(2), " DT)"] }), medicine.prescription && (_jsx("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-4", children: _jsxs("div", { className: "flex gap-2", children: [_jsx(AlertCircle, { size: 18, className: "text-orange-600 flex-shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-orange-900", children: "Ordonnance requise" }), _jsx("p", { className: "text-sm text-orange-800", children: "Vous devez fournir une ordonnance valide pour ce m\u00C3\u00A9dicament." })] })] }) }))] }), _jsx("div", { className: "bg-card border border-border rounded-lg p-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `w-3 h-3 rounded-full ${medicine.available > 0 ? "bg-green-500" : "bg-red-500"}` }), _jsx("span", { className: "text-sm font-semibold", children: medicine.available > 0
                                                            ? `${medicine.available} en stock`
                                                            : "Rupture de stock" })] }) })] }), _jsxs("div", { className: "lg:col-span-2 space-y-8", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: medicine.name }), _jsx("p", { className: "text-muted-foreground", children: medicine.form }), _jsxs("p", { className: "text-muted-foreground text-sm", children: ["Marque: ", medicine.brand] }), _jsxs("p", { className: "text-muted-foreground text-sm", children: ["Principe actif: ", medicine.dci] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "flex gap-1", children: [...Array(5)].map((_, i) => (_jsx(Star, { size: 18, className: i < Math.floor(medicine.rating)
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300" }, i))) }), _jsx("span", { className: "font-semibold", children: medicine.rating })] }), _jsxs("p", { className: "text-muted-foreground", children: ["(", medicine.reviews, " avis)"] })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-muted-foreground text-sm", children: "\u00C3\u20AC partir de" }), _jsxs("p", { className: "text-3xl font-bold text-primary", children: [medicine.price, " DT"] })] }), _jsx("div", { className: "border border-border rounded p-3 space-y-2", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: medicine.pharmacy }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [medicine.distance, "km \u00E2\u20AC\u00A2 Livraison ", medicine.delivery] })] }), _jsxs("span", { className: "font-bold text-primary", children: [medicine.price, " DT"] })] }) })] }), _jsxs("div", { className: "space-y-4", children: [medicine.description && (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-foreground mb-2", children: "Description" }), _jsx("p", { className: "text-foreground leading-relaxed", children: medicine.description })] })), medicine.usage && (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-foreground mb-2", children: "Utilisation" }), _jsx("p", { className: "text-foreground leading-relaxed", children: medicine.usage })] })), medicine.contraindications && (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-foreground mb-2", children: "Contre-indications" }), _jsx("p", { className: "text-foreground leading-relaxed", children: medicine.contraindications })] })), medicine.sideEffects && (_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-foreground mb-2", children: "Effets secondaires" }), _jsx("p", { className: "text-foreground leading-relaxed", children: medicine.sideEffects })] }))] })] })] })] }) }), _jsx(Footer, {})] }));
}
