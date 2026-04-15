import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapPin, Phone, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
export function PharmacySelector({ pharmacies, selectedPharmacy, onSelectPharmacy, isLoading = false, }) {
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-8", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" }) }));
    }
    if (pharmacies.length === 0) {
        return (_jsx("div", { className: "p-6 text-center bg-secondary/30 rounded-lg", children: _jsx("p", { className: "text-muted-foreground", children: "Aucune pharmacie trouv\u00E9e \u00E0 proximit\u00E9" }) }));
    }
    return (_jsx("div", { className: "space-y-3", children: _jsx("div", { className: "grid gap-3", children: pharmacies.map((pharmacy) => (_jsxs(Card, { className: `p-4 cursor-pointer transition border-2 ${selectedPharmacy?.id === pharmacy.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'}`, onClick: () => onSelectPharmacy(pharmacy), children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-semibold text-foreground mb-2", children: pharmacy.name }), _jsxs("div", { className: "space-y-1 text-sm text-muted-foreground", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(MapPin, { className: "w-4 h-4 flex-shrink-0 mt-0.5" }), _jsx("span", { className: "break-words", children: pharmacy.address })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "w-4 h-4 flex-shrink-0" }), _jsx("span", { children: pharmacy.phone })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-4 h-4 flex-shrink-0" }), _jsx("span", { children: pharmacy.hours })] })] })] }), pharmacy.distance && (_jsx("div", { className: "text-right flex-shrink-0", children: _jsxs("div", { className: "text-lg font-bold text-primary", children: [pharmacy.distance.toFixed(1), " km"] }) }))] }), selectedPharmacy?.id === pharmacy.id && (_jsx("div", { className: "mt-3 pt-3 border-t border-border", children: _jsx(Button, { size: "sm", variant: "default", className: "w-full", children: "S\u00E9lectionn\u00E9e" }) }))] }, pharmacy.id))) }) }));
}
