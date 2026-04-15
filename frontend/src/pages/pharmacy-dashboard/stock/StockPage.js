import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Plus, AlertTriangle, Pill, Upload, Link as LinkIcon, Check, X, ImagePlus, Pencil, } from "lucide-react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
function ImageEditor({ item, onSave, }) {
    const [mode, setMode] = useState("idle");
    const [urlInput, setUrlInput] = useState("");
    const fileInputRef = useRef(null);
    const handleUrlSubmit = () => {
        const trimmed = urlInput.trim();
        if (trimmed) {
            onSave(item.id, trimmed);
            setUrlInput("");
            setMode("idle");
        }
    };
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onloadend = () => {
            onSave(item.id, reader.result);
            setMode("idle");
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };
    return (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx("div", { className: "relative w-14 h-14 rounded-lg overflow-hidden border border-border bg-secondary/50 flex items-center justify-center shrink-0", children: item.imageUrl ? (_jsx("img", { src: item.imageUrl, alt: item.name, className: "w-full h-full object-contain p-1" })) : (_jsx(Pill, { size: 22, className: "text-muted-foreground/50" })) }), mode === "idle" && (_jsxs("div", { className: "flex gap-1 flex-wrap", children: [_jsxs("button", { onClick: () => setMode("url"), className: "flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition border border-border", children: [_jsx(LinkIcon, { size: 10 }), "URL"] }), _jsxs("button", { onClick: () => fileInputRef.current?.click(), className: "flex items-center gap-1 px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition border border-border", children: [_jsx(Upload, { size: 10 }), "Importer"] }), _jsx("input", { ref: fileInputRef, type: "file", accept: "image/*", className: "hidden", onChange: handleFileUpload })] })), mode === "url" && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { type: "url", placeholder: "https://...", value: urlInput, onChange: (e) => setUrlInput(e.target.value), onKeyDown: (e) => {
                            if (e.key === "Enter")
                                handleUrlSubmit();
                            if (e.key === "Escape") {
                                setMode("idle");
                                setUrlInput("");
                            }
                        }, className: "w-40 px-2 py-1 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary", autoFocus: true }), _jsx("button", { onClick: handleUrlSubmit, className: "p-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition", children: _jsx(Check, { size: 12 }) }), _jsx("button", { onClick: () => {
                            setMode("idle");
                            setUrlInput("");
                        }, className: "p-1 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition", children: _jsx(X, { size: 12 }) })] }))] }));
}
export default function PharmacyStockPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [stock, setStock] = useState([]);
    const [loadingStock, setLoadingStock] = useState(true);
    // Inline editing state
    const [editingId, setEditingId] = useState(null);
    const [editQty, setEditQty] = useState("");
    // Add product modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        supplier: "",
        price: "",
        minStock: "",
        quantity: "",
    });
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== "pharmacy")
            return;
        fetch("/api/pharmacy/products")
            .then((r) => r.json())
            .then((data) => {
            const mapped = (Array.isArray(data) ? data : []).map((p, idx) => ({
                id: idx + 1,
                name: p.name,
                quantity: p.stock,
                minStock: 20,
                supplier: p.brand || "",
                price: `${p.price} DT`,
                warning: p.stock < 20,
                imageUrl: p.imageUrl,
            }));
            setStock(mapped);
            setLoadingStock(false);
        })
            .catch(() => setLoadingStock(false));
    }, [isAuthenticated, user]);
    if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
        return null;
    if (loadingStock)
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: _jsx("p", { className: "text-muted-foreground", children: "Chargement du stock\u2026" }) }));
    const handleUpdateImage = (id, imageUrl) => {
        setStock((prev) => prev.map((item) => (item.id === id ? { ...item, imageUrl } : item)));
    };
    const startEdit = (item) => {
        setEditingId(item.id);
        setEditQty(String(item.quantity));
    };
    const saveEdit = (id) => {
        const qty = parseInt(editQty, 10);
        if (!isNaN(qty) && qty >= 0) {
            setStock((prev) => prev.map((item) => item.id === id
                ? { ...item, quantity: qty, warning: qty < item.minStock }
                : item));
        }
        setEditingId(null);
    };
    const handleAddProduct = () => {
        const qty = parseInt(newProduct.quantity, 10) || 0;
        const min = parseInt(newProduct.minStock, 10) || 0;
        const newItem = {
            id: stock.length > 0 ? Math.max(...stock.map((s) => s.id)) + 1 : 1,
            name: newProduct.name.trim(),
            quantity: qty,
            minStock: min,
            supplier: newProduct.supplier.trim(),
            price: newProduct.price.trim() ? `${newProduct.price.trim()} DT` : "—",
            warning: qty < min,
        };
        setStock((prev) => [...prev, newItem]);
        setNewProduct({
            name: "",
            supplier: "",
            price: "",
            minStock: "",
            quantity: "",
        });
        setShowAddModal(false);
    };
    const lowStock = stock.filter((item) => item.quantity < item.minStock);
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(PharmacyDashboardSidebar, { pharmacyName: user.firstName || "Pharmacie Central" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsx("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Gestion du Stock" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Suivi et gestion des m\u00E9dicaments en stock" })] }), _jsxs("button", { onClick: () => setShowAddModal(true), className: "px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center gap-2", children: [_jsx(Plus, { size: 16 }), "Nouveau produit"] })] }) }), _jsxs("div", { className: "p-6 space-y-5", children: [lowStock.length > 0 && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-xl p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx(AlertTriangle, { size: 16, className: "text-red-600" }), _jsxs("p", { className: "font-semibold text-red-700 text-sm", children: [lowStock.length, " produit", lowStock.length > 1 ? "s" : "", " en stock faible"] })] }), _jsx("div", { className: "flex flex-wrap gap-2", children: lowStock.map((item) => (_jsxs("span", { className: "flex items-center gap-1 text-xs bg-white border border-red-200 text-red-700 px-3 py-1.5 rounded-lg", children: [_jsx(AlertTriangle, { size: 11 }), _jsx("strong", { children: item.name }), ": ", item.quantity, "/", item.minStock, " unit\u00E9s"] }, item.id))) })] })), _jsxs("div", { className: "flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4", children: [_jsx(ImagePlus, { size: 16, className: "text-primary mt-0.5 shrink-0" }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [_jsxs("span", { className: "font-semibold text-foreground", children: ["Images produit:", " "] }), "Ajoutez une image via un ", _jsx("strong", { children: "lien URL" }), " ou en", " ", _jsx("strong", { children: "important un fichier" }), ". Les images apparaissent dans la pharmacie en ligne."] })] }), _jsx("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border bg-muted", children: [_jsx("th", { className: "px-5 py-4 text-left text-sm font-semibold text-foreground", children: "Image" }), _jsx("th", { className: "px-5 py-4 text-left text-sm font-semibold text-foreground", children: "M\u00E9dicament" }), _jsx("th", { className: "px-5 py-4 text-left text-sm font-semibold text-foreground", children: "Stock" }), _jsx("th", { className: "px-5 py-4 text-left text-sm font-semibold text-foreground", children: "Min Stock" }), _jsx("th", { className: "px-5 py-4 text-left text-sm font-semibold text-foreground", children: "Fournisseur" }), _jsx("th", { className: "px-5 py-4 text-left text-sm font-semibold text-foreground", children: "Prix" }), _jsx("th", { className: "px-5 py-4 text-left text-sm font-semibold text-foreground", children: "Statut" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: stock.map((item) => (_jsxs("tr", { className: "hover:bg-muted/30 transition align-top", children: [_jsx("td", { className: "px-5 py-4", children: _jsx(ImageEditor, { item: item, onSave: handleUpdateImage }) }), _jsx("td", { className: "px-5 py-4 font-medium text-foreground", children: item.name }), _jsx("td", { className: "px-5 py-4", children: editingId === item.id ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { type: "number", min: 0, value: editQty, onChange: (e) => setEditQty(e.target.value), onKeyDown: (e) => {
                                                                                    if (e.key === "Enter")
                                                                                        saveEdit(item.id);
                                                                                    if (e.key === "Escape")
                                                                                        setEditingId(null);
                                                                                }, className: "w-20 px-2 py-1 text-sm bg-background border border-primary rounded-md focus:outline-none focus:ring-1 focus:ring-primary", autoFocus: true }), _jsx("button", { onClick: () => saveEdit(item.id), className: "p-1 bg-primary text-primary-foreground rounded hover:bg-primary/90", children: _jsx(Check, { size: 12 }) }), _jsx("button", { onClick: () => setEditingId(null), className: "p-1 bg-muted text-foreground rounded hover:bg-muted/70", children: _jsx(X, { size: 12 }) })] })) : (_jsxs("button", { onClick: () => startEdit(item), className: "flex items-center gap-1 group text-muted-foreground hover:text-foreground transition", children: [_jsxs("span", { className: "text-sm", children: [item.quantity, " unit\u00E9s"] }), _jsx(Pencil, { size: 11, className: "opacity-0 group-hover:opacity-100 transition" })] })) }), _jsxs("td", { className: "px-5 py-4 text-sm text-muted-foreground", children: [item.minStock, " unit\u00E9s"] }), _jsx("td", { className: "px-5 py-4 text-sm text-muted-foreground", children: item.supplier }), _jsx("td", { className: "px-5 py-4 text-sm text-muted-foreground", children: item.price }), _jsx("td", { className: "px-5 py-4", children: item.quantity < item.minStock ? (_jsxs("span", { className: "flex items-center gap-1 text-red-700 bg-red-100 px-3 py-1 rounded-lg text-xs font-medium", children: [_jsx(AlertTriangle, { size: 12 }), "Stock faible"] })) : (_jsx("span", { className: "text-green-700 bg-green-100 px-3 py-1 rounded-lg text-xs font-medium", children: "Normal" })) })] }, item.id))) })] }) }) })] })] })] }), showAddModal && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: _jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-xl w-full max-w-md mx-4 p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-5", children: [_jsx("h2", { className: "text-lg font-semibold text-foreground", children: "Nouveau produit" }), _jsx("button", { onClick: () => setShowAddModal(false), className: "p-1.5 hover:bg-muted rounded-lg transition", children: _jsx(X, { size: 18 }) })] }), _jsx("div", { className: "space-y-4", children: [
                                {
                                    label: "Nom du médicament *",
                                    key: "name",
                                    placeholder: "ex: Paracétamol 500mg",
                                },
                                {
                                    label: "Fournisseur",
                                    key: "supplier",
                                    placeholder: "ex: SANOFI",
                                },
                                {
                                    label: "Prix unitaire (DT)",
                                    key: "price",
                                    placeholder: "ex: 5.5",
                                    type: "number",
                                },
                                {
                                    label: "Stock minimum",
                                    key: "minStock",
                                    placeholder: "ex: 80",
                                    type: "number",
                                },
                                {
                                    label: "Quantité initiale",
                                    key: "quantity",
                                    placeholder: "ex: 200",
                                    type: "number",
                                },
                            ].map((field) => (_jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground mb-1 block", children: field.label }), _jsx("input", { type: field.type || "text", placeholder: field.placeholder, value: newProduct[field.key], onChange: (e) => setNewProduct((prev) => ({
                                            ...prev,
                                            [field.key]: e.target.value,
                                        })), className: "w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50" })] }, field.key))) }), _jsxs("div", { className: "flex gap-3 mt-6", children: [_jsx("button", { onClick: () => setShowAddModal(false), className: "flex-1 py-2 border border-border hover:bg-muted rounded-lg text-sm font-medium transition", children: "Annuler" }), _jsx("button", { onClick: handleAddProduct, disabled: !newProduct.name.trim(), className: "flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Ajouter" })] })] }) }))] }));
}
