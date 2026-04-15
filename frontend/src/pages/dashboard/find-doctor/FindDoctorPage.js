import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DoctorCard } from "@/components/DoctorCard";
import { Link } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { specialtiesMap } from "@/lib/specialties";
const tunisianGovernorates = [
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Tunis",
    "Béja",
    "Jendouba",
    "Le Kef",
    "Siliana",
    "Kasserine",
    "Sidi Bouzid",
    "Sfax",
    "Gabès",
    "Médenine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kébili",
    "Mahdia",
    "Monastir",
    "Sousse",
    "Nabeul",
    "Zaghouan",
    "Hammamet",
    "Bizerte",
];
const specialties = [
    "Cardiologie",
    "Dermatologie",
    "Pédiatrie",
    "Psychiatrie",
    "Psychologie",
    "Orthopédie",
    "Gynécologie",
    "ORL",
    "Ophtalmologie",
    "Médecine générale",
];
export default function FindDoctorPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialties, setSelectedSpecialties] = useState(new Set());
    const [selectedGovernorate, setSelectedGovernorate] = useState("");
    const [sortBy, setSortBy] = useState("rating");
    const [priceFilter, setPriceFilter] = useState(100);
    const [showVideoOnly, setShowVideoOnly] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [doctorsLoading, setDoctorsLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        fetch("/api/doctors", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => (r.ok ? r.json() : []))
            .then((data) => setDoctors(data))
            .catch(() => { })
            .finally(() => setDoctorsLoading(false));
    }, []);
    const filteredDoctors = useMemo(() => {
        let results = doctors.filter((doctor) => {
            const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesSpecialty = selectedSpecialties.size === 0 ||
                selectedSpecialties.has(doctor.specialty);
            const matchesGovernorate = !selectedGovernorate || doctor.governorate === selectedGovernorate;
            const matchesPrice = doctor.price <= priceFilter;
            const matchesVideo = !showVideoOnly || doctor.videoConsultation;
            return (matchesSearch &&
                matchesSpecialty &&
                matchesGovernorate &&
                matchesPrice &&
                matchesVideo);
        });
        results.sort((a, b) => {
            if (sortBy === "rating")
                return b.rating - a.rating;
            if (sortBy === "price")
                return a.price - b.price;
            if (sortBy === "distance")
                return a.distance - b.distance;
            return 0;
        });
        return results;
    }, [
        doctors,
        searchQuery,
        selectedSpecialties,
        selectedGovernorate,
        sortBy,
        priceFilter,
        showVideoOnly,
    ]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsxs("div", { className: "space-y-4 text-center", children: [_jsx("div", { className: "w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" }), _jsx("p", { className: "text-muted-foreground", children: "Chargement..." })] }) }));
    }
    if (!isAuthenticated || !user) {
        navigate("/login");
        return null;
    }
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, { userName: user.firstName }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsx("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Link, { to: "/dashboard", className: "p-2 hover:bg-secondary rounded-lg transition", children: _jsx(ArrowLeft, { size: 20, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Trouver un m\u00E9decin" }), _jsxs("p", { className: "text-muted-foreground mt-1", children: [filteredDoctors.length, " m\u00E9decin(s) disponible(s)"] })] })] }) }), _jsxs("div", { className: "p-6 max-w-7xl mx-auto space-y-8", children: [_jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-6", children: [_jsx("h3", { className: "text-lg font-semibold text-foreground", children: "Filtres" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 20, className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Chercher un m\u00E9decin ou une sp\u00E9cialit\u00E9...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-12 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Sp\u00E9cialit\u00E9s" }), _jsx("div", { className: "bg-secondary/30 rounded-lg p-3 max-h-64 overflow-y-auto space-y-2", children: specialties.map((spec) => {
                                                                const specialtyInfo = specialtiesMap[spec];
                                                                const Icon = specialtyInfo?.icon;
                                                                return (_jsxs("label", { className: "flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-2 rounded transition", children: [_jsx("input", { type: "checkbox", checked: selectedSpecialties.has(spec), onChange: (e) => {
                                                                                const newSpecialties = new Set(selectedSpecialties);
                                                                                if (e.target.checked) {
                                                                                    newSpecialties.add(spec);
                                                                                }
                                                                                else {
                                                                                    newSpecialties.delete(spec);
                                                                                }
                                                                                setSelectedSpecialties(newSpecialties);
                                                                            }, className: "w-4 h-4 bg-input border border-border rounded cursor-pointer accent-primary" }), Icon && (_jsx(Icon, { className: "w-5 h-5 text-primary flex-shrink-0" })), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-medium text-foreground", children: spec }), _jsx("span", { className: "text-xs text-muted-foreground", children: specialtyInfo?.description })] })] }, spec));
                                                            }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Gouvernorat" }), _jsxs("select", { value: selectedGovernorate, onChange: (e) => setSelectedGovernorate(e.target.value), className: "w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "", children: "Tous les gouvernorats" }), tunisianGovernorates.map((gov) => (_jsx("option", { value: gov, children: gov }, gov)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("label", { className: "text-sm font-semibold text-foreground", children: ["Prix max: ", priceFilter, " DT"] }), _jsx("input", { type: "range", min: "30", max: "100", value: priceFilter, onChange: (e) => setPriceFilter(Number(e.target.value)), className: "w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer" })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Trier par" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "rating", children: "Meilleure note" }), _jsx("option", { value: "price", children: "Prix (moins cher)" }), _jsx("option", { value: "distance", children: "Distance" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold text-foreground", children: "Consultation" }), _jsx("button", { onClick: () => setShowVideoOnly(!showVideoOnly), className: `w-full px-4 py-2 rounded-lg font-medium transition ${showVideoOnly
                                                                ? "bg-primary text-primary-foreground"
                                                                : "bg-secondary border border-border hover:bg-secondary/80"}`, children: showVideoOnly ? "Vidéo uniquement" : "Tous les types" })] })] })] }), filteredDoctors.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredDoctors.map((doctor) => (_jsx(DoctorCard, { id: doctor.id, name: doctor.name, specialty: doctor.specialty, rating: doctor.rating, reviews: doctor.reviews, location: doctor.location, distance: doctor.distance, price: doctor.price, availability: doctor.availability, certified: doctor.certified, videoConsultation: doctor.videoConsultation }, doctor.id))) })) : (_jsxs("div", { className: "bg-card rounded-xl border border-border p-12 text-center space-y-4", children: [_jsx("div", { className: "text-5xl", children: "\uD83D\uDD0D" }), _jsx("h3", { className: "text-xl font-semibold text-foreground", children: "Aucun m\u00E9decin trouv\u00E9" }), _jsx("p", { className: "text-muted-foreground", children: "Essayez de modifier vos crit\u00E8res de recherche" })] }))] })] })] }) }));
}
