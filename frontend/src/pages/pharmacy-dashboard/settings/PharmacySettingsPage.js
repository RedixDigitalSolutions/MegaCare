import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { PharmacyDashboardSidebar } from "@/components/PharmacyDashboardSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Save, MapPin, Clock, Phone, Building2, FileText, Shield, ExternalLink } from "lucide-react";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";
const MAPS_URL_REGEX = /^https?:\/\/(maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|www\.google\.[a-z.]+\/maps)/i;
export default function PharmacySettingsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "pharmacy")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== "pharmacy")
            return;
        const token = localStorage.getItem("megacare_token");
        fetch("/api/pharmacy/settings", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((data) => {
            setSettings({
                ...data,
                governorate: data.governorate || "",
                delegation: data.delegation || "",
                mapsUrl: data.mapsUrl || "",
            });
            setLoading(false);
        })
            .catch(() => setLoading(false));
    }, [isAuthenticated, user]);
    if (isLoading || !isAuthenticated || !user || user.role !== "pharmacy")
        return null;
    const pharmacyName = settings?.companyName || user.firstName || "Pharmacie";
    const handleChange = (field, value) => {
        if (!settings)
            return;
        setSettings({ ...settings, [field]: value });
    };
    const handleCoordChange = (field, value) => {
        if (!settings)
            return;
        const num = parseFloat(value);
        setSettings({
            ...settings,
            coordinates: {
                lat: field === "lat" ? (isNaN(num) ? 0 : num) : (settings.coordinates?.lat ?? 0),
                lng: field === "lng" ? (isNaN(num) ? 0 : num) : (settings.coordinates?.lng ?? 0),
            },
        });
    };
    const handleSave = async () => {
        if (!settings)
            return;
        setSaving(true);
        setMessage(null);
        const token = localStorage.getItem("megacare_token");
        try {
            const res = await fetch("/api/pharmacy/settings", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName: settings.firstName,
                    lastName: settings.lastName,
                    phone: settings.phone,
                    companyName: settings.companyName,
                    address: settings.address,
                    coordinates: settings.coordinates,
                    wilaya: settings.wilaya,
                    city: settings.city,
                    governorate: settings.governorate,
                    delegation: settings.delegation,
                    mapsUrl: settings.mapsUrl,
                    openingHours: settings.openingHours,
                    isOnDuty: settings.isOnDuty,
                    description: settings.description,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
                setMessage({ type: "success", text: "Paramètres enregistrés avec succès" });
            }
            else {
                const err = await res.json().catch(() => ({}));
                setMessage({ type: "error", text: err.message || "Erreur lors de la sauvegarde" });
            }
        }
        catch {
            setMessage({ type: "error", text: "Erreur réseau" });
        }
        setSaving(false);
    };
    const inputClass = "w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm";
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(PharmacyDashboardSidebar, { pharmacyName: pharmacyName }), _jsx("main", { className: "flex-1 overflow-auto md:ml-64", children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Param\u00E8tres" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Configurez les informations de votre pharmacie" })] }), loading ? (_jsx("div", { className: "space-y-4", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-20 bg-card border border-border rounded-xl animate-pulse" }, i))) })) : settings ? (_jsxs("div", { className: "space-y-6", children: [message && (_jsx("div", { className: `p-4 rounded-lg border text-sm font-medium ${message.type === "success"
                                        ? "bg-green-50 border-green-200 text-green-700"
                                        : "bg-red-50 border-red-200 text-red-700"}`, children: message.text })), _jsxs("div", { className: "bg-card border border-border rounded-xl p-6 space-y-4", children: [_jsxs("h2", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [_jsx(Building2, { size: 20, className: "text-primary" }), "Informations g\u00E9n\u00E9rales"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Nom de la pharmacie" }), _jsx("input", { type: "text", value: settings.companyName, onChange: (e) => handleChange("companyName", e.target.value), className: inputClass, placeholder: "Ex: Pharmacie Centrale Tunis" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "N\u00B0 d'enregistrement" }), _jsx("input", { type: "text", value: settings.pharmacyId, className: `${inputClass} opacity-60 cursor-not-allowed`, disabled: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Pr\u00E9nom du pharmacien" }), _jsx("input", { type: "text", value: settings.firstName, onChange: (e) => handleChange("firstName", e.target.value), className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Nom du pharmacien" }), _jsx("input", { type: "text", value: settings.lastName, onChange: (e) => handleChange("lastName", e.target.value), className: inputClass })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Email" }), _jsx("input", { type: "email", value: settings.email, className: `${inputClass} opacity-60 cursor-not-allowed`, disabled: true })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-foreground mb-1", children: [_jsx(Phone, { size: 14, className: "inline mr-1" }), "T\u00E9l\u00E9phone"] }), _jsx("input", { type: "tel", value: settings.phone, onChange: (e) => handleChange("phone", e.target.value), className: inputClass, placeholder: "+216 71 000 000" })] })] }), _jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-foreground mb-1", children: [_jsx(FileText, { size: 14, className: "inline mr-1" }), "Description"] }), _jsx("textarea", { value: settings.description, onChange: (e) => handleChange("description", e.target.value), className: `${inputClass} min-h-[80px] resize-y`, placeholder: "D\u00E9crivez votre pharmacie, services propos\u00E9s...", rows: 3 })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-6 space-y-4", children: [_jsxs("h2", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [_jsx(MapPin, { size: 20, className: "text-primary" }), "Adresse & Localisation"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Adresse compl\u00E8te" }), _jsx("input", { type: "text", value: settings.address, onChange: (e) => handleChange("address", e.target.value), className: inputClass, placeholder: "12 Avenue Habib Bourguiba, Tunis 1000" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Gouvernorat" }), _jsxs("select", { value: settings.governorate, onChange: (e) => {
                                                                handleChange("governorate", e.target.value);
                                                                handleChange("delegation", "");
                                                            }, className: inputClass, children: [_jsx("option", { value: "", children: "S\u00E9lectionner un gouvernorat" }), GOVERNORATES.map((g) => (_jsx("option", { value: g, children: g }, g)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "D\u00E9l\u00E9gation" }), _jsxs("select", { value: settings.delegation, onChange: (e) => handleChange("delegation", e.target.value), className: inputClass, disabled: !settings.governorate, children: [_jsx("option", { value: "", children: "S\u00E9lectionner une d\u00E9l\u00E9gation" }), (DELEGATIONS[settings.governorate] ?? []).map((d) => (_jsx("option", { value: d, children: d }, d)))] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Latitude" }), _jsx("input", { type: "number", step: "any", value: settings.coordinates?.lat ?? "", onChange: (e) => handleCoordChange("lat", e.target.value), className: inputClass, placeholder: "36.8065" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Longitude" }), _jsx("input", { type: "number", step: "any", value: settings.coordinates?.lng ?? "", onChange: (e) => handleCoordChange("lng", e.target.value), className: inputClass, placeholder: "10.1815" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsxs("label", { className: "block text-sm font-medium text-foreground mb-1", children: [_jsx(ExternalLink, { size: 14, className: "inline mr-1" }), "Lien Google Maps"] }), _jsx("input", { type: "url", value: settings.mapsUrl, onChange: (e) => handleChange("mapsUrl", e.target.value), className: `${inputClass} ${settings.mapsUrl && !MAPS_URL_REGEX.test(settings.mapsUrl) ? "border-red-400 focus:ring-red-400" : ""}`, placeholder: "https://maps.google.com/..." }), settings.mapsUrl && !MAPS_URL_REGEX.test(settings.mapsUrl) && (_jsx("p", { className: "text-xs text-red-500 mt-1", children: "URL invalide. Utilisez un lien Google Maps (maps.google.com, goo.gl/maps, maps.app.goo.gl)" })), settings.mapsUrl && MAPS_URL_REGEX.test(settings.mapsUrl) && (_jsxs("a", { href: settings.mapsUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1", children: [_jsx(MapPin, { size: 11 }), "Aper\u00E7u \u2014 Ouvrir dans Google Maps"] }))] })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-xl p-6 space-y-4", children: [_jsxs("h2", { className: "text-lg font-semibold text-foreground flex items-center gap-2", children: [_jsx(Clock, { size: 20, className: "text-primary" }), "Horaires & Garde"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-foreground mb-1", children: "Horaires d'ouverture" }), _jsx("input", { type: "text", value: settings.openingHours, onChange: (e) => handleChange("openingHours", e.target.value), className: inputClass, placeholder: "08:00 - 22:00" })] }), _jsxs("div", { className: "flex items-center gap-3 pt-6", children: [_jsxs("label", { className: "relative inline-flex items-center cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: settings.isOnDuty, onChange: (e) => handleChange("isOnDuty", e.target.checked), className: "sr-only peer" }), _jsx("div", { className: "w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" })] }), _jsxs("div", { children: [_jsxs("span", { className: "text-sm font-medium text-foreground flex items-center gap-1", children: [_jsx(Shield, { size: 14, className: "text-primary" }), "Pharmacie de garde"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Activez si votre pharmacie est actuellement de garde" })] })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { onClick: handleSave, disabled: saving, className: "flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-60 transition text-sm", children: [_jsx(Save, { size: 16 }), saving ? "Enregistrement..." : "Enregistrer les modifications"] }) })] })) : (_jsx("div", { className: "text-center py-12 text-muted-foreground", children: "Impossible de charger les param\u00E8tres" }))] }) })] }));
}
