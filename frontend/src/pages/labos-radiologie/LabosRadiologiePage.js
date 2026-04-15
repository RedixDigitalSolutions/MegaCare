import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Search, MapPin, Star, X, Clock, CheckCircle, Calendar, ChevronLeft, ChevronRight, Activity, SlidersHorizontal, FlaskConical, Eye, Upload, FileText, Shield, Loader2, } from "lucide-react";
// ─── Mock Data ─────────────────────────────────────────────────────────────────
const tunisianGovernorates = [
    "Tunis",
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Nabeul",
    "Zaghouan",
    "Bizerte",
    "Béja",
    "Jendouba",
    "Le Kef",
    "Siliana",
    "Monastir",
    "Mahdia",
    "Sfax",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Sousse",
    "Gabès",
    "Médenine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kébili",
];
const examTypeOptions = [
    "Biologie",
    "Hématologie",
    "Microbiologie",
    "Sérologie",
    "Endocrinologie",
    "Imagerie",
    "IRM",
    "Scanner",
    "Échographie",
    "Radiographie",
    "Médecine nucléaire",
];
const labTypes = ["Laboratoire", "Radiologie", "Mixte"];
const typeColors = {
    Laboratoire: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Radiologie: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    Mixte: "bg-teal-500/10 text-teal-700 dark:text-teal-400",
};
const typeIcons = {
    Laboratoire: _jsx(FlaskConical, { size: 12, className: "inline mr-1" }),
    Radiologie: _jsx(Eye, { size: 12, className: "inline mr-1" }),
    Mixte: _jsx(Activity, { size: 12, className: "inline mr-1" }),
};
// ─── Ordre Ordonnance Modal ────────────────────────────────────────────────────
function OrdonnanceModal({ lab, onClose, }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [drag, setDrag] = useState(false);
    const handleSend = () => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        setStep(3);
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center", children: _jsx(FileText, { className: "text-violet-500", size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm leading-tight", children: "Envoyer une ordonnance" }), _jsx("p", { className: "text-xs text-muted-foreground", children: lab.name })] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-xl hover:bg-secondary/50 transition-colors", children: _jsx(X, { size: 18, className: "text-muted-foreground" }) })] }), _jsx("div", { className: "flex items-center gap-2 px-5 pt-4", children: [1, 2, 3].map((s) => (_jsxs("div", { className: "flex items-center gap-2 flex-1", children: [_jsx("div", { className: `w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${step >= s
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-secondary text-muted-foreground"}`, children: s }), s < 3 && (_jsx("div", { className: `h-0.5 flex-1 rounded transition-colors ${step > s ? "bg-primary" : "bg-border"}` }))] }, s))) }), _jsxs("div", { className: "flex justify-between px-4 mt-1 mb-2", children: [_jsx("span", { className: "text-[10px] text-muted-foreground", children: "Centre" }), _jsx("span", { className: "text-[10px] text-muted-foreground", children: "Upload" }), _jsx("span", { className: "text-[10px] text-muted-foreground", children: "Confirmation" })] }), _jsxs("div", { className: "p-5", children: [step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 rounded-xl bg-secondary/40 border border-border flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0", children: _jsx(FlaskConical, { className: "text-primary", size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: lab.name }), _jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1", children: [_jsx(MapPin, { size: 10 }), " ", lab.city, ", ", lab.governorate] })] }), _jsx(CheckCircle, { size: 18, className: "text-emerald-500 ml-auto" })] }), _jsx("button", { onClick: () => setStep(2), className: "w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition", children: "Confirmer ce centre \u2192" })] })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "T\u00E9l\u00E9versez une photo ou un scan de votre ordonnance m\u00E9dicale." }), _jsxs("div", { onDragOver: (e) => {
                                        e.preventDefault();
                                        setDrag(true);
                                    }, onDragLeave: () => setDrag(false), onDrop: (e) => {
                                        e.preventDefault();
                                        setDrag(false);
                                        const f = e.dataTransfer.files[0];
                                        if (f)
                                            setFile(f);
                                    }, className: `border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${drag
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"}`, onClick: () => document.getElementById("ord-input")?.click(), children: [_jsx(Upload, { size: 28, className: "mx-auto mb-3 text-muted-foreground" }), file ? (_jsx("p", { className: "text-sm font-medium text-foreground", children: file.name })) : (_jsxs(_Fragment, { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: "Glisser-d\u00E9poser ou cliquer pour importer" }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "JPG, PNG, PDF \u2014 max 10 Mo" })] })), _jsx("input", { id: "ord-input", type: "file", accept: "image/*,.pdf", className: "hidden", onChange: (e) => {
                                                const f = e.target.files?.[0];
                                                if (f)
                                                    setFile(f);
                                            } })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setStep(1), className: "flex-1 py-3 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition", children: "Retour" }), _jsx("button", { onClick: handleSend, disabled: !file, className: "flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed", children: "Envoyer" })] })] })), step === 3 && (_jsxs("div", { className: "text-center py-4", children: [_jsx("div", { className: "w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "text-emerald-500", size: 30 }) }), _jsx("h3", { className: "text-lg font-bold text-foreground mb-2", children: "Ordonnance envoy\u00E9e !" }), _jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: [lab.name, " a re\u00E7u votre ordonnance."] }), _jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: ["R\u00E9sultats disponibles sous ", _jsx("strong", { children: lab.resultDelay }), ". Vous serez notifi\u00E9."] }), _jsx("button", { onClick: onClose, className: "px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition", children: "Fermer" })] }))] })] }) }));
}
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
        "07:30",
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
    ];
    const seed = parseInt(id, 10) || 1;
    return Array.from({ length: 7 }, (_, d) => {
        const date = new Date();
        date.setDate(date.getDate() + d);
        const slots = allSlots.filter((_, i) => (i + d + seed) % 3 !== 0);
        return { date, slots };
    });
}
function BookingModal({ lab, onClose, }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedExam, setSelectedExam] = useState(lab.exams[0]);
    const [weekOffset, setWeekOffset] = useState(0);
    const [booked, setBooked] = useState(false);
    const allDays = generateSlots(lab.id);
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
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm", onClick: onClose, children: _jsxs("div", { className: "relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden", onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center", children: _jsx(FlaskConical, { className: "text-primary", size: 20 }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm leading-tight", children: lab.name }), _jsx("p", { className: "text-xs text-muted-foreground", children: lab.city })] })] }), _jsx("button", { onClick: onClose, className: "p-2 rounded-xl hover:bg-secondary/50 transition-colors", children: _jsx(X, { size: 18, className: "text-muted-foreground" }) })] }), booked ? (_jsxs("div", { className: "p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(CheckCircle, { className: "text-emerald-500", size: 30 }) }), _jsx("h3", { className: "text-lg font-bold text-foreground mb-2", children: "Rendez-vous confirm\u00E9 !" }), _jsxs("p", { className: "text-sm text-muted-foreground mb-1", children: [DAY_LABELS[currentDay.date.getDay()], " ", currentDay.date.getDate(), " ", MONTH_LABELS[currentDay.date.getMonth()], " \u00E0 ", selectedSlot] }), _jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: [selectedExam, " \u00B7 ", lab.name] }), _jsx("button", { onClick: onClose, className: "px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition", children: "Fermer" })] })) : (_jsxs("div", { className: "p-5 space-y-5", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground block mb-2", children: "Examen" }), _jsx("select", { value: selectedExam, onChange: (e) => setSelectedExam(e.target.value), className: "w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30", children: lab.exams.map((e) => (_jsx("option", { value: e, children: e }, e))) })] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Choisir une date" }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => {
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
                                            : "bg-secondary/60 text-foreground/80 hover:bg-secondary"}`, children: slot }, slot))) }))] }), _jsxs("button", { onClick: handleBook, disabled: !selectedSlot, className: "w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2", children: [_jsx(Calendar, { size: 16 }), "Confirmer le rendez-vous"] })] }))] }) }));
}
// ─── Lab Card ─────────────────────────────────────────────────────────────────
function LabCard({ lab, onBook, onOrdonnance, }) {
    return (_jsxs("div", { className: "bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 group flex flex-col", children: [_jsxs("div", { className: "relative h-44 overflow-hidden", children: [_jsx("img", { src: lab.imageUrl, alt: lab.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" }), _jsxs("div", { className: "absolute top-3 left-3 flex gap-2", children: [_jsxs("span", { className: `px-2.5 py-1 rounded-lg text-xs font-semibold ${typeColors[lab.type]}`, children: [typeIcons[lab.type], lab.type] }), lab.cnam && (_jsxs("span", { className: "px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent/90 text-accent-foreground flex items-center gap-1", children: [_jsx(Shield, { size: 10 }), " CNAM"] }))] }), _jsxs("div", { className: "absolute bottom-3 left-3 flex items-center gap-1.5", children: [_jsx(Star, { size: 13, className: "text-amber-400 fill-amber-400" }), _jsx("span", { className: "text-white font-bold text-sm", children: lab.rating.toFixed(1) }), _jsxs("span", { className: "text-white/70 text-xs", children: ["(", lab.reviews, " avis)"] })] })] }), _jsxs("div", { className: "p-4 flex flex-col flex-1 gap-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-foreground text-base leading-tight", children: lab.name }), _jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mt-1", children: [_jsx(MapPin, { size: 11 }), " ", lab.city, ", ", lab.governorate] })] }), _jsxs("div", { className: "flex flex-wrap gap-1.5", children: [lab.exams.slice(0, 4).map((ex) => (_jsx("span", { className: "px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/70 text-foreground/80", children: ex }, ex))), lab.exams.length > 4 && (_jsxs("span", { className: "px-2 py-0.5 rounded-full text-[11px] font-medium bg-secondary/70 text-muted-foreground", children: ["+", lab.exams.length - 4] }))] }), _jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Clock, { size: 12 }), " R\u00E9sultats : ", lab.resultDelay] }), _jsxs("span", { className: "font-semibold text-foreground", children: ["\u00C0 partir de", " ", _jsxs("span", { className: "text-primary", children: [lab.priceFrom, " TND"] })] })] }), _jsxs("div", { className: "mt-auto flex gap-2 pt-2", children: [_jsx(Link, { to: `/labos-radiologie/${lab.id}`, className: "flex-1 py-2.5 text-center text-xs font-semibold border border-border rounded-xl hover:bg-secondary/50 transition text-foreground", children: "Voir d\u00E9tails" }), _jsxs("button", { onClick: () => onOrdonnance(lab), className: "flex-1 py-2.5 text-xs font-semibold border border-primary/40 rounded-xl hover:bg-primary/5 transition text-primary flex items-center justify-center gap-1", children: [_jsx(Upload, { size: 13 }), " Ordonnance"] }), _jsx("button", { onClick: () => onBook(lab), className: "flex-1 py-2.5 text-xs font-semibold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition", children: "RDV" })] })] })] }));
}
// ─── Filter Panel ─────────────────────────────────────────────────────────────
function FilterPanel({ selectedTypes, toggleType, selectedGov, setSelectedGov, selectedExamTypes, toggleExamType, cnamOnly, setCnamOnly, onReset, }) {
    return (_jsxs("aside", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "Type de centre" }), labTypes.map((t) => (_jsxs("label", { className: "flex items-center gap-2 mb-2 cursor-pointer group", children: [_jsx("input", { type: "checkbox", checked: selectedTypes.includes(t), onChange: () => toggleType(t), className: "rounded border-border accent-primary" }), _jsx("span", { className: "text-sm text-foreground/80 group-hover:text-foreground transition", children: t })] }, t)))] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "Gouvernorat" }), _jsxs("select", { value: selectedGov, onChange: (e) => setSelectedGov(e.target.value), className: "w-full px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "", children: "Tous les gouvernorats" }), tunisianGovernorates.map((g) => (_jsx("option", { value: g, children: g }, g)))] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "Type d'examen" }), _jsx("div", { className: "space-y-2 max-h-48 overflow-y-auto pr-1", children: examTypeOptions.map((ex) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer group", children: [_jsx("input", { type: "checkbox", checked: selectedExamTypes.includes(ex), onChange: () => toggleExamType(ex), className: "rounded border-border accent-primary" }), _jsx("span", { className: "text-sm text-foreground/80 group-hover:text-foreground transition", children: ex })] }, ex))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-bold text-foreground mb-3", children: "Conventionn\u00E9" }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("div", { onClick: () => setCnamOnly(!cnamOnly), className: `relative w-10 h-5 rounded-full transition-colors cursor-pointer ${cnamOnly ? "bg-primary" : "bg-secondary"}`, children: _jsx("div", { className: `absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${cnamOnly ? "translate-x-5" : "translate-x-0.5"}` }) }), _jsx("span", { className: "text-sm text-foreground/80", children: "CNAM uniquement" })] })] }), _jsx("button", { onClick: onReset, className: "w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition", children: "R\u00E9initialiser les filtres" })] }));
}
// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LabosRadiologiePage() {
    const [labs, setLabs] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch("/api/public/labs")
            .then((r) => r.json())
            .then((data) => setLabs(Array.isArray(data) ? data : []))
            .catch(() => setLabs([]))
            .finally(() => setLoading(false));
    }, []);
    const [query, setQuery] = useState("");
    const [selectedGov, setSelectedGov] = useState("");
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedExamTypes, setSelectedExamTypes] = useState([]);
    const [cnamOnly, setCnamOnly] = useState(false);
    const [sort, setSort] = useState("rating");
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [bookingLab, setBookingLab] = useState(null);
    const [ordonnanceLab, setOrdonnanceLab] = useState(null);
    const [activeTypeFilter, setActiveTypeFilter] = useState(null);
    const toggleType = (t) => setSelectedTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
    const toggleExamType = (e) => setSelectedExamTypes((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);
    const resetFilters = () => {
        setQuery("");
        setSelectedGov("");
        setSelectedTypes([]);
        setSelectedExamTypes([]);
        setCnamOnly(false);
        setSort("rating");
        setActiveTypeFilter(null);
    };
    const filtered = useMemo(() => {
        let result = [...labs];
        if (query) {
            const q = query.toLowerCase();
            result = result.filter((l) => l.name.toLowerCase().includes(q) ||
                l.city.toLowerCase().includes(q) ||
                l.exams.some((e) => e.toLowerCase().includes(q)));
        }
        if (selectedGov)
            result = result.filter((l) => l.governorate === selectedGov);
        if (selectedTypes.length > 0)
            result = result.filter((l) => selectedTypes.includes(l.type));
        if (activeTypeFilter)
            result = result.filter((l) => l.type === activeTypeFilter);
        if (selectedExamTypes.length > 0)
            result = result.filter((l) => selectedExamTypes.some((et) => l.allExamTypes.includes(et)));
        if (cnamOnly)
            result = result.filter((l) => l.cnam);
        if (sort === "rating")
            result.sort((a, b) => b.rating - a.rating);
        else if (sort === "price")
            result.sort((a, b) => a.priceFrom - b.priceFrom);
        else
            result.sort((a, b) => a.name.localeCompare(b.name));
        return result;
    }, [
        labs,
        query,
        selectedGov,
        selectedTypes,
        selectedExamTypes,
        cnamOnly,
        sort,
        activeTypeFilter,
    ]);
    const filterProps = {
        selectedTypes,
        toggleType,
        selectedGov,
        setSelectedGov,
        selectedExamTypes,
        toggleExamType,
        cnamOnly,
        setCnamOnly,
        onReset: resetFilters,
    };
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1 pt-24", children: [_jsx("section", { className: "bg-gradient-to-r from-primary to-primary/80 text-white py-12", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8", children: [_jsxs("div", { className: "text-center space-y-4", children: [_jsx("h1", { className: "text-4xl font-bold", children: "Labos & Radiologie" }), _jsx("p", { className: "text-lg opacity-90 max-w-2xl mx-auto", children: "Trouvez un laboratoire d'analyses ou un centre de radiologie partenaire. Prenez rendez-vous ou envoyez votre ordonnance en ligne." })] }), _jsxs("div", { className: "relative max-w-2xl mx-auto", children: [_jsx(Search, { className: "absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400", size: 20 }), _jsx("input", { type: "text", placeholder: "Examen, centre, ville...", value: query, onChange: (e) => setQuery(e.target.value), className: "w-full pl-12 pr-4 py-3 rounded-lg bg-white text-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary" })] }), _jsx("div", { className: "flex gap-4 justify-center flex-wrap", children: [
                                        { label: "Tous", value: null },
                                        { label: "🔬 Laboratoire", value: "Laboratoire" },
                                        { label: "🩻 Radiologie", value: "Radiologie" },
                                        { label: "⚗️ Mixte", value: "Mixte" },
                                    ].map(({ label, value }) => (_jsx("button", { onClick: () => setActiveTypeFilter(value), className: "bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition", children: label }, label))) })] }) }), _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6 lg:hidden", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: [_jsx("span", { className: "font-semibold text-foreground", children: filtered.length }), " ", "centre", filtered.length !== 1 ? "s" : "", " trouv\u00E9", filtered.length !== 1 ? "s" : ""] }), _jsxs("button", { onClick: () => setShowMobileFilters(!showMobileFilters), className: "flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition", children: [_jsx(SlidersHorizontal, { size: 16 }), "Filtres"] })] }), showMobileFilters && (_jsx("div", { className: "lg:hidden mb-6 p-6 bg-card border border-border rounded-xl", children: _jsx(FilterPanel, { ...filterProps }) })), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("aside", { className: "lg:col-span-1 space-y-6", children: _jsx("div", { className: "bg-card rounded-xl border border-border p-6 space-y-6 sticky top-24", children: _jsx(FilterPanel, { ...filterProps }) }) }), _jsxs("div", { className: "lg:col-span-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("p", { className: "text-sm text-muted-foreground", children: [_jsx("span", { className: "font-semibold text-foreground", children: filtered.length }), " ", "centre", filtered.length !== 1 ? "s" : "", " trouv\u00E9", filtered.length !== 1 ? "s" : ""] }), _jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "px-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "rating", children: "Meilleure note" }), _jsx("option", { value: "price", children: "Prix croissant" }), _jsx("option", { value: "name", children: "Nom A\u2013Z" })] })] }), loading ? (_jsx("div", { className: "flex justify-center items-center py-24", children: _jsx(Loader2, { size: 40, className: "animate-spin text-primary" }) })) : filtered.length === 0 ? (_jsxs("div", { className: "bg-card rounded-xl border border-border p-12 text-center space-y-4", children: [_jsx(FlaskConical, { size: 48, className: "mx-auto text-muted-foreground/40" }), _jsx("p", { className: "text-lg font-medium text-foreground", children: "Aucun centre trouv\u00E9" }), _jsx("p", { className: "text-muted-foreground", children: "Essayez de modifier vos filtres" }), _jsx("button", { onClick: resetFilters, className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition", children: "R\u00E9initialiser" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5", children: filtered.map((lab) => (_jsx(LabCard, { lab: lab, onBook: setBookingLab, onOrdonnance: setOrdonnanceLab }, lab.id))) }))] })] })] })] }), bookingLab && (_jsx(BookingModal, { lab: bookingLab, onClose: () => setBookingLab(null) })), ordonnanceLab && (_jsx(OrdonnanceModal, { lab: ordonnanceLab, onClose: () => setOrdonnanceLab(null) })), _jsx(Footer, {})] }));
}
