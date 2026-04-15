import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock, CheckCircle, Award, Users, Calendar, Video, Phone, ChevronLeft, ChevronRight, } from "lucide-react";
export default function DoctorProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();
    const [activeTab, setActiveTab] = useState("about");
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showLoginWarning, setShowLoginWarning] = useState(false);
    const [consultationType, setConsultationType] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [isDoctorLoading, setIsDoctorLoading] = useState(true);
    const [doctorNotFound, setDoctorNotFound] = useState(false);
    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await fetch(`/api/doctors/${id}`);
                if (res.status === 404) {
                    setDoctorNotFound(true);
                    return;
                }
                if (!res.ok)
                    throw new Error("Failed to fetch doctor");
                const data = await res.json();
                setDoctor(data);
            }
            catch {
                setDoctorNotFound(true);
            }
            finally {
                setIsDoctorLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);
    // Calendar functions
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };
    const getDayName = (day) => {
        const days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
        ];
        return days[day];
    };
    const getAvailableSlotsForDate = (date) => {
        if (!doctor)
            return [];
        const dayName = getDayName(date.getDay());
        const slots = doctor.schedule[dayName];
        return slots || [];
    };
    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
        setSelectedDate(null);
    };
    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
        setSelectedDate(null);
    };
    const handleDateClick = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(date);
        setSelectedSlot(null);
    };
    const handleSlotSelection = (slot) => {
        setSelectedSlot(slot);
    };
    const handleBooking = () => {
        if (!isAuthenticated || !user) {
            setShowLoginWarning(true);
            return;
        }
        if (selectedDate && selectedSlot) {
            setShowConfirmation(true);
        }
    };
    const handleConsultationType = (type) => {
        setConsultationType(type);
        setActiveTab("schedule");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const reviews = [
        {
            author: "Fatima B.",
            rating: 5,
            date: "Il y a 2 semaines",
            text: "Excellente docteure. Très à l'écoute et professionnelle. Je la recommande vivement!",
        },
        {
            author: "Mohamed K.",
            rating: 4,
            date: "Il y a 1 mois",
            text: "Consultation très informative. Un peu d'attente mais en vaut la peine.",
        },
        {
            author: "Aisha H.",
            rating: 5,
            date: "Il y a 6 semaines",
            text: "Service impeccable et résultats excellents. Merci Dr. Mansouri!",
        },
    ];
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), isDoctorLoading && (_jsx("main", { className: "flex-1 pt-24 flex items-center justify-center", children: _jsxs("div", { className: "space-y-4 text-center", children: [_jsx("div", { className: "w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" }), _jsx("p", { className: "text-muted-foreground", children: "Chargement du profil m\u00E9decin..." })] }) })), !isDoctorLoading && (doctorNotFound || !doctor) && (_jsx("main", { className: "flex-1 pt-24 flex items-center justify-center", children: _jsxs("div", { className: "text-center space-y-4", children: [_jsx("p", { className: "text-2xl font-bold text-foreground", children: "M\u00E9decin non trouv\u00E9" }), _jsx("p", { className: "text-muted-foreground", children: "Ce profil n'existe pas ou a \u00E9t\u00E9 supprim\u00E9." }), _jsx(Link, { to: "/doctors", className: "inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90", children: "Retour \u00E0 la liste des m\u00E9decins" })] }) })), !isDoctorLoading && doctor && (_jsxs("main", { className: "flex-1 pt-24", children: [_jsx("div", { className: "border-b border-border bg-card", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-sm", children: [_jsx(Link, { to: "/doctors", className: "text-primary hover:underline", children: "M\u00E9decins" }), _jsx("span", { className: "text-muted-foreground mx-2", children: "/" }), _jsx("span", { className: "text-foreground", children: doctor.name })] }) }), _jsx("section", { className: "bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-8", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("div", { className: "w-40 h-40 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20", children: _jsx("div", { className: "text-8xl", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }) }) }), _jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("h1", { className: "text-3xl sm:text-4xl font-bold text-foreground", children: ["Dr. ", doctor.name] }), doctor.certified && (_jsxs("div", { className: "bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1", children: [_jsx(CheckCircle, { size: 16 }), "Certifi\u00E9"] }))] }), _jsx("p", { className: "text-xl text-primary font-medium", children: doctor.specialty })] }), _jsxs("div", { className: "flex flex-wrap gap-6 py-4 border-y border-border", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Star, { className: "w-5 h-5 fill-accent text-accent" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: doctor.rating }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["(", doctor.reviews, " avis)"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Award, { className: "w-5 h-5 text-primary" }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-foreground", children: [doctor.experience, " ans"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "d'exp\u00E9rience" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5 text-primary" }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-foreground", children: [doctor.patients, "+"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "patients" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(MapPin, { className: "w-5 h-5 text-primary" }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-foreground", children: [doctor.distance, "km"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: doctor.location })] })] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-4", children: [_jsxs("button", { onClick: () => handleConsultationType("video"), className: `flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition font-semibold ${consultationType === "video"
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-primary text-primary-foreground hover:bg-primary/90"}`, children: [_jsx(Video, { size: 20 }), "Consultation vid\u00E9o"] }), _jsxs("button", { onClick: () => handleConsultationType("phone"), className: `flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition font-semibold ${consultationType === "phone"
                                                            ? "bg-accent text-accent-foreground"
                                                            : "border-2 border-primary text-primary hover:bg-primary/5"}`, children: [_jsx(Phone, { size: 20 }), "Appel t\u00E9l\u00E9phonique"] })] })] })] }) }) }), _jsxs("section", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("div", { className: "border-b border-border flex gap-8 sticky top-16 bg-background z-10", children: ["about", "schedule", "reviews"].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab), className: `py-4 font-medium capitalize transition border-b-2 ${activeTab === tab
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground"}`, children: tab === "about"
                                        ? "À propos"
                                        : tab === "schedule"
                                            ? "Disponibilités"
                                            : "Avis" }, tab))) }), _jsxs("div", { className: "py-8", children: [activeTab === "about" && (_jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "md:col-span-2 space-y-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-foreground mb-4", children: "\u00C0 propos" }), _jsx("p", { className: "text-foreground leading-relaxed", children: doctor.bio })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-foreground mb-4", children: "Formation" }), _jsx("div", { className: "space-y-4", children: doctor.education.map((edu, idx) => (_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0", children: _jsx(Award, { className: "w-6 h-6 text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: edu.degree }), _jsx("p", { className: "text-muted-foreground", children: edu.university }), _jsx("p", { className: "text-sm text-muted-foreground", children: edu.year })] })] }, idx))) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-3", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Tarif consultation" }), _jsxs("p", { className: "text-3xl font-bold text-primary", children: [doctor.price, " DT"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Dur\u00E9e: 30 minutes" })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-3", children: [_jsx("h4", { className: "font-semibold text-foreground", children: "Langues" }), _jsx("div", { className: "space-y-2", children: doctor.languages.map((lang) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-primary" }), _jsx("span", { className: "text-foreground", children: lang })] }, lang))) })] })] })] })), activeTab === "schedule" && (_jsxs("div", { className: "grid md:grid-cols-3 gap-8", children: [_jsx("div", { className: "md:col-span-1", children: _jsxs("div", { className: "bg-card rounded-xl border border-border p-6 sticky top-32", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("button", { onClick: handlePrevMonth, className: "p-2 hover:bg-secondary rounded-lg transition", children: _jsx(ChevronLeft, { size: 20, className: "text-primary" }) }), _jsx("h3", { className: "font-bold text-foreground", children: currentMonth.toLocaleDateString("fr-FR", {
                                                                        month: "long",
                                                                        year: "numeric",
                                                                    }) }), _jsx("button", { onClick: handleNextMonth, className: "p-2 hover:bg-secondary rounded-lg transition", children: _jsx(ChevronRight, { size: 20, className: "text-primary" }) })] }), _jsx("div", { className: "grid grid-cols-7 gap-2 mb-2", children: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day, index) => (_jsx("div", { className: "text-center text-xs font-semibold text-muted-foreground py-2", children: day }, `day-${index}`))) }), _jsxs("div", { className: "grid grid-cols-7 gap-2", children: [Array.from({
                                                                    length: getFirstDayOfMonth(currentMonth),
                                                                }).map((_, i) => (_jsx("div", { className: "aspect-square" }, `empty-${i}`))), Array.from({
                                                                    length: getDaysInMonth(currentMonth),
                                                                }).map((_, i) => {
                                                                    const day = i + 1;
                                                                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                                                    const isSelected = selectedDate &&
                                                                        selectedDate.getDate() === day &&
                                                                        selectedDate.getMonth() ===
                                                                            currentMonth.getMonth() &&
                                                                        selectedDate.getFullYear() ===
                                                                            currentMonth.getFullYear();
                                                                    const hasSlots = getAvailableSlotsForDate(date).length > 0;
                                                                    const isPast = date < new Date() &&
                                                                        date.getDate() !== new Date().getDate();
                                                                    return (_jsx("button", { onClick: () => !isPast && handleDateClick(day), disabled: isPast, className: `aspect-square rounded-lg font-medium text-sm transition flex items-center justify-center ${isSelected
                                                                            ? "bg-primary text-primary-foreground border-2 border-primary"
                                                                            : hasSlots && !isPast
                                                                                ? "bg-secondary hover:bg-primary/20 border border-primary text-foreground"
                                                                                : isPast
                                                                                    ? "text-muted-foreground opacity-40 cursor-not-allowed"
                                                                                    : "bg-muted text-muted-foreground"}`, children: day }, day));
                                                                })] })] }) }), _jsx("div", { className: "md:col-span-2", children: selectedDate ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-primary/10 border border-primary/20 rounded-xl p-6 space-y-2", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Date s\u00E9lectionn\u00E9e" }), _jsx("h3", { className: "text-2xl font-bold text-primary", children: selectedDate.toLocaleDateString("fr-FR", {
                                                                        weekday: "long",
                                                                        day: "numeric",
                                                                        month: "long",
                                                                        year: "numeric",
                                                                    }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("h4", { className: "font-semibold text-foreground flex items-center gap-2", children: [_jsx(Clock, { size: 20, className: "text-primary" }), "Cr\u00E9neaux disponibles"] }), _jsx("div", { className: "grid grid-cols-3 sm:grid-cols-4 gap-3", children: getAvailableSlotsForDate(selectedDate).length >
                                                                        0 ? (getAvailableSlotsForDate(selectedDate).map((slot) => (_jsx("button", { onClick: () => handleSlotSelection(slot), className: `p-3 rounded-lg font-medium text-sm transition border-2 ${selectedSlot === slot
                                                                            ? "bg-primary text-primary-foreground border-primary"
                                                                            : "bg-card border-border hover:border-primary text-foreground"}`, children: slot }, slot)))) : (_jsx("div", { className: "col-span-full text-center py-8 text-muted-foreground", children: "Aucun cr\u00E9neau disponible ce jour" })) })] }), selectedSlot && (_jsx("button", { onClick: handleBooking, className: "w-full py-4 bg-accent text-accent-foreground font-semibold rounded-lg hover:opacity-90 transition", children: "Confirmer la r\u00E9servation" }))] })) : (_jsxs("div", { className: "bg-card rounded-xl border border-border p-12 text-center space-y-4", children: [_jsx(Calendar, { size: 48, className: "text-muted-foreground mx-auto opacity-50" }), _jsx("p", { className: "text-muted-foreground", children: "S\u00E9lectionnez une date pour voir les cr\u00E9neaux disponibles" })] })) })] })), showLoginWarning && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-card rounded-xl border border-border p-8 space-y-6 max-w-md w-full", children: [_jsxs("div", { className: "space-y-2 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDD10" }), _jsx("h3", { className: "text-2xl font-bold text-foreground", children: "Authentification requise" }), _jsx("p", { className: "text-muted-foreground", children: "Vous devez \u00EAtre connect\u00E9 pour r\u00E9server une consultation" })] }), _jsx("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2", children: _jsx("p", { className: "text-sm text-orange-900", children: "Pour confirmer votre rendez-vous et assurer la s\u00E9curit\u00E9 de votre compte, veuillez vous connecter ou cr\u00E9er un compte." }) }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: () => {
                                                                setShowLoginWarning(false);
                                                                navigate("/login");
                                                            }, className: "w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition", children: "Se connecter" }), _jsx("button", { onClick: () => {
                                                                setShowLoginWarning(false);
                                                                navigate("/register");
                                                            }, className: "w-full py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition", children: "Cr\u00E9er un compte" }), _jsx("button", { onClick: () => setShowLoginWarning(false), className: "w-full py-2 text-muted-foreground hover:text-foreground transition text-sm", children: "Continuer plus tard" })] })] }) })), showConfirmation && selectedDate && selectedSlot && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-card rounded-xl border border-border p-8 space-y-6 max-w-md w-full", children: [_jsxs("div", { className: "space-y-2 text-center", children: [_jsx("div", { className: "text-4xl mb-2", children: "\u2713" }), _jsx("h3", { className: "text-2xl font-bold text-foreground", children: "Rendez-vous confirm\u00E9!" }), _jsx("p", { className: "text-muted-foreground", children: "Votre consultation est r\u00E9serv\u00E9e" })] }), _jsxs("div", { className: "bg-primary/10 rounded-lg p-4 space-y-4", children: [_jsxs("div", { className: "flex items-center gap-3 pb-4 border-b border-primary/20", children: [_jsx("div", { className: "text-3xl", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-foreground", children: ["Dr. ", doctor.name] }), _jsx("p", { className: "text-sm text-muted-foreground", children: doctor.specialty })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Calendar, { size: 20, className: "text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Date" }), _jsx("p", { className: "font-semibold text-foreground", children: selectedDate.toLocaleDateString("fr-FR", {
                                                                                        weekday: "long",
                                                                                        day: "numeric",
                                                                                        month: "long",
                                                                                    }) })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Clock, { size: 20, className: "text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Heure" }), _jsx("p", { className: "font-semibold text-foreground", children: selectedSlot })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [consultationType === "video" ? (_jsx(Video, { size: 20, className: "text-primary" })) : (_jsx(Phone, { size: 20, className: "text-primary" })), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Type" }), _jsx("p", { className: "font-semibold text-foreground", children: consultationType === "video"
                                                                                        ? "Consultation vidéo"
                                                                                        : "Appel téléphonique" })] })] })] })] }), _jsxs("div", { className: "bg-accent/10 rounded-lg p-3 text-center", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Tarif" }), _jsxs("p", { className: "text-xl font-bold text-accent", children: [doctor.price, " DT"] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { onClick: () => setShowConfirmation(false), className: "w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition", children: "Fermer" }), _jsx("p", { className: "text-xs text-center text-muted-foreground", children: "Un email de confirmation a \u00E9t\u00E9 envoy\u00E9 \u00E0 votre adresse. Lien de consultation vid\u00E9o envoy\u00E9 15 minutes avant l'heure pr\u00E9vue." })] })] }) })), activeTab === "reviews" && (_jsx("div", { className: "space-y-4", children: reviews.map((review, idx) => (_jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: review.author }), _jsx("p", { className: "text-sm text-muted-foreground", children: review.date })] }), _jsx("div", { className: "flex gap-1", children: [...Array(5)].map((_, i) => (_jsx(Star, { size: 18, className: i < review.rating
                                                                    ? "fill-accent text-accent"
                                                                    : "text-border" }, i))) })] }), _jsx("p", { className: "text-foreground leading-relaxed", children: review.text })] }, idx))) }))] })] })] })), _jsx(Footer, {})] }));
}
