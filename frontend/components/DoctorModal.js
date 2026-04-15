import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from 'react-router-dom';
import { X, Star, MapPin, Video, Phone, Calendar, Clock, CheckCircle, User, Award, Stethoscope, ChevronLeft, ChevronRight, } from "lucide-react";
// Generate a week of availability slots per doctor
function generateSlots(doctorId) {
    const days = [];
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
    const seed = parseInt(doctorId, 10) || 1;
    for (let d = 0; d < 7; d++) {
        const date = new Date();
        date.setDate(date.getDate() + d);
        // deterministic pseudo-random slots per day/doctor
        const available = allSlots.filter((_, i) => (i + d + seed) % 3 !== 0);
        days.push({ date, slots: available });
    }
    return days;
}
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
export function DoctorModal({ doctor, isOpen, onClose }) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState("profile");
    const [selectedDayIdx, setSelectedDayIdx] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [booked, setBooked] = useState(false);
    const [weekOffset, setWeekOffset] = useState(0);
    if (!isOpen || !doctor)
        return null;
    const allWeekDays = generateSlots(doctor.id);
    // shift by weekOffset * 7 conceptually — just re-use same 7 for simplicity, offset the displayed dates
    const weekDays = allWeekDays.map((d) => {
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
        if (!selectedSlot)
            return;
        setBooked(true);
        setTimeout(() => {
            setBooked(false);
            setSelectedSlot(null);
            onClose();
        }, 1800);
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "relative bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[94vh] overflow-y-auto", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 z-20 p-1.5 rounded-full bg-background border border-border hover:bg-secondary transition", "aria-label": "Fermer", children: _jsx(X, { size: 16 }) }), _jsxs("div", { className: `relative h-48 flex items-center justify-center overflow-hidden ${doctor.specialty === "Cardiologie"
                            ? "bg-gradient-to-br from-red-50 to-rose-100"
                            : doctor.specialty === "Dermatologie"
                                ? "bg-gradient-to-br from-peach-50 to-orange-100"
                                : doctor.specialty === "Psychiatrie" ||
                                    doctor.specialty === "Psychologie"
                                    ? "bg-gradient-to-br from-purple-50 to-violet-100"
                                    : doctor.specialty === "Pédiatrie"
                                        ? "bg-gradient-to-br from-yellow-50 to-amber-100"
                                        : "bg-gradient-to-br from-blue-50 to-indigo-100"}`, children: [doctor.imageUrl ? (_jsx("img", { src: doctor.imageUrl, alt: doctor.name, className: "h-full w-full object-cover" })) : (_jsx("div", { className: "w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg text-5xl", children: "\uD83D\uDC68\u200D\u2695\uFE0F" })), doctor.certified && (_jsxs("div", { className: "absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1", children: [_jsx(Award, { size: 12 }), " Certifi\u00E9"] })), doctor.videoConsultation && (_jsxs("div", { className: "absolute top-4 right-12 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1", children: [_jsx(Video, { size: 12 }), " Vid\u00E9o"] }))] }), _jsxs("div", { className: "px-6 pt-5 pb-3 border-b border-border", children: [_jsxs("div", { className: "flex items-start justify-between gap-3 flex-wrap", children: [_jsxs("div", { children: [_jsxs("h2", { className: "text-2xl font-bold text-foreground", children: ["Dr. ", doctor.name] }), _jsxs("p", { className: "text-primary font-medium text-sm mt-0.5 flex items-center gap-1", children: [_jsx(Stethoscope, { size: 14 }), " ", doctor.specialty] }), doctor.experience && (_jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [doctor.experience, " ans d'exp\u00E9rience"] }))] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center gap-1 justify-end", children: [[...Array(5)].map((_, i) => (_jsx(Star, { size: 13, className: i < Math.floor(doctor.rating)
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "fill-gray-200 text-gray-200" }, i))), _jsx("span", { className: "text-sm font-bold text-foreground ml-1", children: doctor.rating })] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [doctor.reviews, " avis"] }), _jsxs("p", { className: "text-xl font-bold text-primary mt-1", children: [doctor.price, " DT"] })] })] }), _jsxs("div", { className: "flex gap-1 mt-4", children: [_jsx("button", { onClick: () => setTab("profile"), className: `px-4 py-2 rounded-lg text-sm font-medium transition ${tab === "profile"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"}`, children: "Profil" }), _jsx("button", { onClick: () => setTab("rdv"), className: `px-4 py-2 rounded-lg text-sm font-medium transition ${tab === "rdv"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"}`, children: "Prendre RDV" })] })] }), _jsxs("div", { className: "p-6 space-y-5", children: [tab === "profile" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "bg-secondary/50 rounded-xl p-3 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { size: 13, className: "text-primary" }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Localisation" })] }), _jsx("p", { className: "text-sm font-bold text-foreground", children: doctor.location }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [doctor.governorate, " \u2022 \u00E0 ", doctor.distance, " km"] })] }), _jsxs("div", { className: "bg-secondary/50 rounded-xl p-3 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Clock, { size: 13, className: "text-green-500" }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Disponibilit\u00E9" })] }), _jsx("p", { className: "text-sm font-bold text-foreground", children: doctor.availability }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Prochain cr\u00E9neau" })] }), doctor.education && (_jsxs("div", { className: "bg-secondary/50 rounded-xl p-3 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(User, { size: 13, className: "text-primary" }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Formation" })] }), _jsx("p", { className: "text-sm font-bold text-foreground", children: doctor.education })] })), doctor.languages && doctor.languages.length > 0 && (_jsxs("div", { className: "bg-secondary/50 rounded-xl p-3 space-y-1", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Phone, { size: 13, className: "text-primary" }), _jsx("span", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Langues" })] }), _jsx("p", { className: "text-sm font-bold text-foreground", children: doctor.languages.join(", ") })] }))] }), doctor.bio && (_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-foreground mb-1", children: "\u00C0 propos" }), _jsx("p", { className: "text-sm text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-3 italic", children: doctor.bio })] })), _jsxs("div", { children: [_jsxs("h4", { className: "text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5", children: [_jsx(MapPin, { size: 14, className: "text-primary" }), " Localisation sur la carte"] }), _jsx("div", { className: "rounded-xl overflow-hidden border border-border h-48", children: _jsx("iframe", { title: `Carte ${doctor.name}`, width: "100%", height: "100%", loading: "lazy", allowFullScreen: true, referrerPolicy: "no-referrer-when-downgrade", src: `https://www.openstreetmap.org/export/embed.html?bbox=9.5%2C33.5%2C11.0%2C37.5&layer=mapnik&marker=${doctor.lat ?? 36.8065}%2C${doctor.lng ?? 10.1815}`, style: { border: 0 } }) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1 flex items-center gap-1", children: [_jsx(MapPin, { size: 11 }), " ", doctor.address ??
                                                        doctor.location + ", " + doctor.governorate + ", Tunisie"] })] }), _jsxs("button", { onClick: () => setTab("rdv"), className: "w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2", children: [_jsx(Calendar, { size: 18 }), "Prendre rendez-vous"] })] })), tab === "rdv" && (_jsx(_Fragment, { children: booked ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-12 gap-4 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center", children: _jsx(CheckCircle, { size: 36, className: "text-green-600" }) }), _jsx("h3", { className: "text-xl font-bold text-foreground", children: "Rendez-vous confirm\u00E9 !" }), _jsxs("p", { className: "text-muted-foreground text-sm", children: ["Votre RDV avec ", _jsxs("strong", { children: ["Dr. ", doctor.name] }), " le", " ", _jsx("strong", { children: currentDay.date.toLocaleDateString("fr-FR", {
                                                        weekday: "long",
                                                        day: "numeric",
                                                        month: "long",
                                                    }) }), " ", "\u00E0 ", _jsx("strong", { children: selectedSlot }), " a \u00E9t\u00E9 enregistr\u00E9 dans votre tableau de bord."] })] })) : (_jsxs(_Fragment, { children: [_jsx("h3", { className: "text-base font-bold text-foreground", children: "Choisissez une date" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => {
                                                        setWeekOffset((w) => Math.max(0, w - 1));
                                                        setSelectedDayIdx(0);
                                                        setSelectedSlot(null);
                                                    }, disabled: weekOffset === 0, className: "p-1.5 rounded-lg border border-border hover:bg-secondary disabled:opacity-30 transition", children: _jsx(ChevronLeft, { size: 16 }) }), _jsx("div", { className: "flex-1 grid grid-cols-7 gap-1", children: weekDays.map((d, idx) => (_jsxs("button", { onClick: () => {
                                                            setSelectedDayIdx(idx);
                                                            setSelectedSlot(null);
                                                        }, className: `flex flex-col items-center py-2 px-1 rounded-lg transition text-xs ${selectedDayIdx === idx
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-secondary hover:bg-secondary/80 text-foreground"}`, children: [_jsx("span", { className: "font-medium", children: DAY_LABELS[d.date.getDay()] }), _jsx("span", { className: "font-bold text-sm", children: d.date.getDate() }), _jsx("span", { className: "opacity-70", children: MONTH_LABELS[d.date.getMonth()] })] }, idx))) }), _jsx("button", { onClick: () => {
                                                        setWeekOffset((w) => w + 1);
                                                        setSelectedDayIdx(0);
                                                        setSelectedSlot(null);
                                                    }, className: "p-1.5 rounded-lg border border-border hover:bg-secondary transition", children: _jsx(ChevronRight, { size: 16 }) })] }), _jsxs("div", { children: [_jsxs("h4", { className: "text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5", children: [_jsx(Clock, { size: 14, className: "text-primary" }), "Cr\u00E9neaux disponibles \u2014", " ", currentDay.date.toLocaleDateString("fr-FR", {
                                                            weekday: "long",
                                                            day: "numeric",
                                                            month: "long",
                                                        })] }), currentDay.slots.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground italic py-4 text-center", children: "Aucun cr\u00E9neau disponible ce jour." })) : (_jsx("div", { className: "grid grid-cols-4 gap-2", children: currentDay.slots.map((slot) => (_jsx("button", { onClick: () => setSelectedSlot(slot), className: `py-2 rounded-lg text-sm font-medium border transition ${selectedSlot === slot
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-secondary border-border text-foreground hover:border-primary hover:bg-primary/5"}`, children: slot }, slot))) }))] }), selectedSlot && (_jsxs("div", { className: "bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3", children: [_jsxs("p", { className: "text-sm text-foreground", children: [_jsxs("strong", { children: ["Dr. ", doctor.name] }), " \u2014", " ", currentDay.date.toLocaleDateString("fr-FR", {
                                                            weekday: "long",
                                                            day: "numeric",
                                                            month: "long",
                                                        }), " ", "\u00E0 ", _jsx("strong", { children: selectedSlot })] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Tarif :", " ", _jsxs("strong", { className: "text-primary", children: [doctor.price, " DT"] })] }), _jsxs("button", { onClick: handleBook, className: "w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2", children: [_jsx(Calendar, { size: 18 }), isAuthenticated
                                                            ? "Confirmer le rendez-vous"
                                                            : "Se connecter pour confirmer"] }), !isAuthenticated && (_jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Vous serez redirig\u00E9 vers la page de connexion." }))] }))] })) }))] })] })] }));
}
