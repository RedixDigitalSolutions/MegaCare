import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { tunisianGovernorates, allServices, establishmentTypes } from "@/lib/config";
import { Search, MapPin, Star, ChevronDown, X, Clock, CheckCircle, Calendar, ChevronLeft, ChevronRight, Building2, Shield, SlidersHorizontal, Loader2, } from "lucide-react";
// ─── (data loaded from API in component) ────────────────────────────────────
const typeColors = {
    Clinique: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Hôpital: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    HAD: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    "Centre médical": "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};
// ─── Booking Modal ─────────────────────────────────────────────────────────────
const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTH_LABELS = [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Jun",
    "Jul",
    "Aoû",
    "Sep",
    "Oct",
    "Nov",
    "Déc",
];
function generateSlots(id) {
    const allSlots = [
        "08:00",
        "08:30",
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
    ];
    const seed = parseInt(id, 10) || 1;
    return Array.from({ length: 7 }, (_, d) => {
        const date = new Date();
        date.setDate(date.getDate() + d);
        const slots = allSlots.filter((_, i) => (i + d + seed) % 3 !== 0);
        return { date, slots };
    });
}
function BookingModal({ estab, onClose, }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedService, setSelectedService] = useState(estab.services[0]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [booked, setBooked] = useState(false);
    const allDays = generateSlots(estab.id);
    const weekDays = allDays.map((d) => {
        const shifted = new Date(d.date);
        shifted.setDate(shifted.getDate() + weekOffset * 7);
        return { ...d, date: shifted };
    });
    const currentDay = weekDays[selectedDayIdx];
    const handleBook = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setBooked(true);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center", children: _jsx(Building2, { className: "text-primary", size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm leading-tight", children: estab.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: estab.city })] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-xl hover:bg-secondary/50 transition-colors", children: _jsx(X, { size: 18, className: "text-muted-foreground" }) })] }), booked ? (_jsxs("div", { className: "p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "text-emerald-500", size: 30 }) }), _jsx("h3", { className: "text-lg font-bold text-foreground mb-2", children: "Rendez-vous confirm\u00E9!" }), _jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: [DAY_LABELS[currentDay.date.getDay()], " ", currentDay.date.getDate(), " ", MONTH_LABELS[currentDay.date.getMonth()], " \u00E0 ", selectedSlot] }), _jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [selectedService, " \u00B7 ", estab.name] }), _jsx("button", { onClick: onClose, className: "px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition", children: "Fermer" })] })) : (_jsxs("div", { className: "p-5 space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground block mb-2", children: "Service" }), _jsx("select", { value: selectedService, onChange: (e) => setSelectedService(e.target.value), className: "w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30", children: estab.services.map((s) => (_jsx("option", { value: s, children: s }, s))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Choisir une date" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => {
                                                        setWeekOffset(Math.max(0, weekOffset - 1));
                                                        setSelectedSlot(null);
                                                    }, className: "p-1.5 rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-40", disabled: weekOffset === 0, children: _jsx(ChevronLeft, { size: 16, className: "text-muted-foreground" }) }), _jsx("button", { onClick: () => {
                                                        setWeekOffset(weekOffset + 1);
                                                        setSelectedSlot(null);
                                                    }, className: "p-1.5 rounded-lg hover:bg-secondary/50 transition-colors", children: _jsx(ChevronRight, { size: 16, className: "text-muted-foreground" }) })] })] }), _jsx("div", { className: "grid grid-cols-7 gap-1", children: weekDays.map((d, i) => (_jsxs("button", { onClick: () => {
                                            setSelectedDayIdx(i);
                                            setSelectedSlot(null);
                                        }, className: `flex flex-col items-center py-2 rounded-xl text-xs font-medium transition-all ${i === selectedDayIdx
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-secondary/70 text-foreground/70"} ${d.slots.length === 0 ? "opacity-40 cursor-not-allowed" : ""}`, disabled: d.slots.length === 0, children: [_jsx("span", { className: "text-[10px] opacity-70", children: DAY_LABELS[d.date.getDay()] }), _jsx("span", { className: "text-sm font-bold", children: d.date.getDate() }), _jsx("span", { className: "text-[9px] opacity-60", children: MONTH_LABELS[d.date.getMonth()] })] }, i))) })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-semibold text-foreground block mb-3", children: ["Cr\u00E9neaux disponibles", _jsxs("span", { className: "font-normal text-muted-foreground ml-2", children: ["(", currentDay.slots.length, " disponibles)"] })] }), currentDay.slots.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "Aucun cr\u00E9neau ce jour" })) : (_jsx("div", { className: "grid grid-cols-4 gap-2", children: currentDay.slots.map((slot) => (_jsx("button", { onClick: () => setSelectedSlot(slot), className: `py-2 rounded-xl text-xs font-semibold transition-all text-center ${selectedSlot === slot
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "bg-secondary/60 text-foreground/80 hover:bg-secondary"}`, children: slot }, slot))) }))] }), _jsxs("button", { onClick: handleBook, disabled: !selectedSlot, className: "w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: [_jsx(Calendar, { size: 16 }), !isAuthenticated
                                    ? "Se connecter pour réserver"
                                    : selectedSlot
                                        ? `Confirmer à ${selectedSlot}`
                                        : "Sélectionnez un créneau"] })] }))] }) }));
}
// ─── Establishment Card ────────────────────────────────────────────────────────
function EstabCard({ estab, onBook, }) {
    return (_jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group flex flex-col", children: [_jsxs("div", { className: "relative h-44 overflow-hidden", children: [_jsx("img", { src: estab.imageUrl, alt: estab.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" }), _jsxs("div", { className: "absolute top-3 left-3 flex gap-2", children: [_jsx("span", { className: `px-2.5 py-1 text-xs font-semibold rounded-full backdrop-blur-sm ${typeColors[estab.type]}`, children: estab.type }), estab.emergencies && (_jsx("span", { className: "px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/90 text-white backdrop-blur-sm", children: "Urgences 24h" }))] }), estab.accredited && (_jsx("div", { className: "absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center", title: "\u00C9tablissement accr\u00E9dit\u00E9", children: _jsx(Shield, { className: "text-emerald-600", size: 14 }) }))] }), _jsxs("div", { className: "p-5 flex flex-col flex-1", children: [_jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [_jsx("h3", { className: "font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors", children: estab.name }), _jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [_jsx(Star, { className: "text-amber-400 fill-amber-400", size: 14 }), _jsx("span", { className: "text-sm font-bold text-foreground", children: estab.rating })] })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground text-xs mb-3", children: [_jsx(MapPin, { size: 13 }), _jsxs("span", { children: [estab.city, ", ", estab.governorate] })] }), _jsxs("div", { className: "flex flex-wrap gap-1.5 mb-4", children: [estab.services.slice(0, 3).map((s) => (_jsx("span", { className: "px-2.5 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full", children: s }, s))), estab.services.length > 3 && (_jsxs("span", { className: "px-2.5 py-0.5 bg-secondary text-muted-foreground text-xs rounded-full", children: ["+", estab.services.length - 3] }))] }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-muted-foreground mb-4 mt-auto", children: [_jsx(Clock, { size: 12 }), _jsxs("span", { children: ["Consultation d\u00E8s ", estab.price, " TND"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: `/services-medicaux/${estab.id}`, className: "flex-1 py-2.5 border border-border text-foreground rounded-xl text-xs font-semibold text-center hover:bg-secondary/50 transition-colors", children: "Voir d\u00E9tails" }), _jsx("button", { onClick: onBook, className: "flex-1 py-2.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:bg-primary/90 transition-colors", children: "Prendre RDV" })] })] })] }));
}
// ─── Partners Strip ────────────────────────────────────────────────────────────
const partners = [
    { name: "Clinique Hannibal", abbr: "CH" },
    { name: "Polyclinique Taoufik", abbr: "PT" },
    { name: "Clinique El Menzah", abbr: "CM" },
    { name: "CHU Farhat Hached", abbr: "FH" },
    { name: "Centre Médical Lac", abbr: "CL" },
    { name: "Clinique Bizerte", abbr: "CB" },
];
// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ServicesMediauxPage() {
    const [establishments, setEstablishments] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch("/api/public/establishments")
            .then((r) => r.json())
            .then((data) => setEstablishments(Array.isArray(data) ? data : []))
            .catch(() => setEstablishments([]))
            .finally(() => setLoading(false));
    }, []);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTypes, setSelectedTypes] = useState(new Set());
    const [selectedGov, setSelectedGov] = useState("");
    const [selectedServices, setSelectedServices] = useState(new Set());
    const [maxPrice, setMaxPrice] = useState(100);
    const [minRating, setMinRating] = useState(0);
    const [emergenciesOnly, setEmergenciesOnly] = useState(false);
    const [sortBy, setSortBy] = useState("rating");
    const [showFilters, setShowFilters] = useState(false);
    const [bookingEstab, setBookingEstab] = useState(null);
    const toggleSet = (set, value) => {
        const next = new Set(set);
        if (next.has(value))
            next.delete(value);
        else
            next.add(value);
        return next;
    };
    const filtered = useMemo(() => {
        let results = establishments.filter((e) => {
            const q = searchQuery.toLowerCase();
            const matchQ = !q ||
                e.name.toLowerCase().includes(q) ||
                e.city.toLowerCase().includes(q) ||
                e.services.some((s) => s.toLowerCase().includes(q));
            const matchType = selectedTypes.size === 0 || selectedTypes.has(e.type);
            const matchGov = !selectedGov || e.governorate === selectedGov;
            const matchService = selectedServices.size === 0 ||
                [...selectedServices].some((s) => e.services.includes(s));
            const matchPrice = e.price <= maxPrice;
            const matchRating = e.rating >= minRating;
            const matchEmergency = !emergenciesOnly || e.emergencies;
            return (matchQ &&
                matchType &&
                matchGov &&
                matchService &&
                matchPrice &&
                matchRating &&
                matchEmergency);
        });
        results.sort((a, b) => {
            if (sortBy === "rating")
                return b.rating - a.rating;
            if (sortBy === "price")
                return a.price - b.price;
            return a.name.localeCompare(b.name);
        });
        return results;
    }, [
        establishments,
        searchQuery,
        selectedTypes,
        selectedGov,
        selectedServices,
        maxPrice,
        minRating,
        emergenciesOnly,
        sortBy,
    ]);
    const FilterPanel = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3", children: "Type d'\u00E9tablissement" }), _jsx("div", { className: "space-y-2", children: establishmentTypes.map((t) => (_jsxs("label", { className: "flex items-center gap-2.5 cursor-pointer group", children: [_jsx("input", { type: "checkbox", checked: selectedTypes.has(t), onChange: () => setSelectedTypes(toggleSet(selectedTypes, t)), className: "w-4 h-4 rounded border-border text-primary" }), _jsx("span", { className: "text-sm text-foreground/80 group-hover:text-foreground transition-colors", children: t })] }, t))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3", children: "Gouvernorat" }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: selectedGov, onChange: (e) => setSelectedGov(e.target.value), className: "w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "", children: "Tous les gouvernorats" }), tunisianGovernorates.map((g) => (_jsx("option", { value: g, children: g }, g)))] }), _jsx(ChevronDown, { size: 14, className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3", children: "Services" }), _jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto pr-1", children: allServices.map((s) => (_jsxs("label", { className: "flex items-center gap-2.5 cursor-pointer group", children: [_jsx("input", { type: "checkbox", checked: selectedServices.has(s), onChange: () => setSelectedServices(toggleSet(selectedServices, s)), className: "w-4 h-4 rounded border-border text-primary" }), _jsx("span", { className: "text-sm text-foreground/80 group-hover:text-foreground transition-colors", children: s })] }, s))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3", children: "Tarif max" }), _jsx("input", { type: "range", min: 20, max: 150, step: 5, value: maxPrice, onChange: (e) => setMaxPrice(+e.target.value), className: "w-full accent-primary" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [_jsx("span", { children: "20 TND" }), _jsxs("span", { className: "font-semibold text-foreground", children: [maxPrice, " TND"] })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3", children: "Note minimale" }), _jsx("div", { className: "flex gap-2", children: [0, 3, 4, 4.5].map((r) => (_jsx("button", { onClick: () => setMinRating(r), className: `flex-1 py-1.5 text-xs rounded-xl font-semibold transition-all ${minRating === r
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary/60 text-foreground/70 hover:bg-secondary"}`, children: r === 0 ? "Tous" : `${r}+` }, r))) })] }), _jsxs("label", { className: "flex items-center gap-2.5 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: emergenciesOnly, onChange: (e) => setEmergenciesOnly(e.target.checked), className: "w-4 h-4 rounded border-border text-primary" }), _jsx("span", { className: "text-sm text-foreground/80", children: "Urgences disponibles" })] }), _jsx("button", { onClick: () => {
                    setSelectedTypes(new Set());
                    setSelectedGov("");
                    setSelectedServices(new Set());
                    setMaxPrice(100);
                    setMinRating(0);
                    setEmergenciesOnly(false);
                }, className: "w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition", children: "R\u00E9initialiser les filtres" })] }));
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1 pt-24", children: [_jsx("section", { className: "bg-gradient-to-r from-primary to-primary/80 text-white py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8", children: [_jsxs("div", { className: "text-center space-y-4", children: [_jsx("h1", { className: "text-4xl font-bold", children: "Services M\u00E9dicaux" }), _jsx("p", { className: "text-lg opacity-90 max-w-2xl mx-auto", children: "Cliniques, h\u00F4pitaux, HAD et centres m\u00E9dicaux \u2014 comparez et prenez rendez-vous en ligne." })] }), _jsxs("div", { className: "relative max-w-2xl mx-auto", children: [_jsx(Search, { className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400", size: 20 }), _jsx("input", { type: "text", placeholder: "Nom d'\u00E9tablissement, sp\u00E9cialit\u00E9 ou ville...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" })] }), _jsx("div", { className: "flex gap-4 justify-center flex-wrap", children: establishmentTypes.map((t) => (_jsx("button", { onClick: () => setSelectedTypes(toggleSet(selectedTypes, t)), className: "bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition", children: t }, t))) })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("aside", { className: "lg:col-span-1 space-y-6", children: _jsx("div", { className: "bg-card rounded-xl border border-border p-6 space-y-6 sticky top-24", children: _jsx(FilterPanel, {}) }) }), _jsxs("div", { className: "lg:col-span-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-5 gap-3 flex-wrap", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: [_jsx("span", { className: "font-bold text-foreground", children: filtered.length }), " ", "\u00E9tablissement", filtered.length !== 1 ? "s" : "", " trouv\u00E9", filtered.length !== 1 ? "s" : ""] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("button", { onClick: () => setShowFilters(!showFilters), className: "lg:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors", children: [_jsx(SlidersHorizontal, { size: 15 }), "Filtres"] }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "pl-3 pr-8 py-2 bg-input border border-border rounded-lg text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "rating", children: "Meilleure note" }), _jsx("option", { value: "price", children: "Prix croissant" }), _jsx("option", { value: "name", children: "Nom A\u2013Z" })] }), _jsx(ChevronDown, { size: 13, className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" })] })] })] }), showFilters && (_jsx("div", { className: "lg:hidden bg-card border border-border rounded-xl p-6 mb-5", children: _jsx(FilterPanel, {}) })), loading ? (_jsx("div", { className: "flex justify-center items-center py-24", children: _jsx(Loader2, { size: 40, className: "animate-spin text-primary" }) })) : filtered.length === 0 ? (_jsxs("div", { className: "bg-card rounded-xl border border-border p-12 text-center space-y-4", children: [_jsx(Building2, { size: 40, className: "text-muted-foreground/30 mx-auto" }), _jsx("p", { className: "text-lg font-medium text-foreground", children: "Aucun r\u00E9sultat" }), _jsx("p", { className: "text-muted-foreground", children: "Essayez d'assouplir vos filtres ou d'\u00E9largir votre zone de recherche." })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5", children: filtered.map((e) => (_jsx(EstabCard, { estab: e, onBook: () => setBookingEstab(e) }, e.id))) }))] })] }) }), _jsx("section", { className: "py-16 bg-secondary/30 border-t border-border", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("p", { className: "text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-8", children: "Nos \u00E9tablissements partenaires" }), _jsx("div", { className: "flex flex-wrap gap-4 justify-center items-center", children: partners.map((p) => (_jsxs("div", { className: "flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all", children: [_jsx("div", { className: "w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary text-sm", children: p.abbr }), _jsx("span", { className: "text-sm font-medium text-foreground", children: p.name })] }, p.name))) })] }) })] }), _jsx(Footer, {}), bookingEstab && (_jsx(BookingModal, { estab: bookingEstab, onClose: () => setBookingEstab(null) }))] }));
}
