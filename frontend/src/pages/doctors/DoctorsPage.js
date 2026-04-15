import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { DoctorModal } from "@/components/DoctorModal";
import { Search, Loader2 } from "lucide-react";
import { specialtiesMap } from "@/lib/specialties";
// Governorates of Tunisia
const tunisianGovernorates = [
    "Ariana", "Ben Arous", "Manouba", "Tunis", "Béja", "Jendouba",
    "Le Kef", "Siliana", "Kasserine", "Sidi Bouzid", "Sfax", "Gabès",
    "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili", "Mahdia",
    "Monastir", "Sousse", "Nabeul", "Zaghouan", "Hammamet", "Bizerte",
];
const specialties = [
    "Cardiologie", "Dermatologie", "Pédiatrie", "Psychiatrie",
    "Psychologie", "Orthopédie", "Gynécologie", "ORL", "Ophtalmologie",
];
export default function DoctorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSpecialties, setSelectedSpecialties] = useState(new Set());
    const [selectedGovernorate, setSelectedGovernorate] = useState("");
    const [sortBy, setSortBy] = useState("rating");
    const [priceFilter, setPriceFilter] = useState(100);
    const [showVideoOnly, setShowVideoOnly] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        fetch("/api/doctors")
            .then((r) => r.json())
            .then((data) => setDoctors(Array.isArray(data) ? data : []))
            .catch(() => setDoctors([]))
            .finally(() => setLoading(false));
    }, []);
    // Filter and sort doctors
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
    }, [doctors, searchQuery, selectedSpecialties, selectedGovernorate, sortBy, priceFilter, showVideoOnly]);
    return (_jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [_jsx(Header, {}), _jsxs("main", { className: "flex-1 pt-24", children: [_jsx("section", { className: "bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border py-8", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h1", { className: "text-3xl sm:text-4xl font-bold text-foreground mb-2", children: "Trouvez votre m\u00E9decin" }), _jsx("p", { className: "text-muted-foreground max-w-2xl", children: "Consultez des m\u00E9decins sp\u00E9cialistes qualifi\u00E9s et disponibles imm\u00E9diatement" })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("aside", { className: "lg:col-span-1 space-y-6", children: _jsxs("div", { className: "bg-card rounded-xl border border-border p-6 space-y-6 sticky top-20", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground block mb-2", children: "Rechercher" }), _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 18, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "M\u00E9decin ou sp\u00E9cialit\u00E9...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground block mb-3", children: "Sp\u00E9cialit\u00E9s" }), _jsx("div", { className: "space-y-2", children: specialties.map((specialty) => {
                                                            const specialtyInfo = specialtiesMap[specialty];
                                                            const Icon = specialtyInfo?.icon;
                                                            return (_jsxs("label", { className: "flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-2 rounded transition group", children: [_jsx("input", { type: "checkbox", checked: selectedSpecialties.has(specialty), onChange: (e) => {
                                                                            const newSpecialties = new Set(selectedSpecialties);
                                                                            if (e.target.checked) {
                                                                                newSpecialties.add(specialty);
                                                                            }
                                                                            else {
                                                                                newSpecialties.delete(specialty);
                                                                            }
                                                                            setSelectedSpecialties(newSpecialties);
                                                                        }, className: "w-4 h-4 bg-input border border-border rounded cursor-pointer accent-primary" }), Icon && (_jsx(Icon, { className: "w-5 h-5 text-primary flex-shrink-0" })), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "text-sm font-medium text-foreground", children: specialty }), _jsx("span", { className: "text-xs text-muted-foreground", children: specialtyInfo?.description })] })] }, specialty));
                                                        }) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground block mb-2", children: "Gouvernorat" }), _jsxs("select", { value: selectedGovernorate, onChange: (e) => setSelectedGovernorate(e.target.value), className: "w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "", children: "Tous les gouvernorats" }), tunisianGovernorates.map((governorate) => (_jsx("option", { value: governorate, children: governorate }, governorate)))] })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-semibold text-foreground block mb-2", children: ["Prix max:", " ", _jsxs("span", { className: "text-primary", children: [priceFilter, " DT"] })] }), _jsx("input", { type: "range", min: "0", max: "150", value: priceFilter, onChange: (e) => setPriceFilter(Number(e.target.value)), className: "w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary" }), _jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mt-1", children: [_jsx("span", { children: "0 DT" }), _jsx("span", { children: "150 DT" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground block mb-2", children: "Trier par" }), _jsxs("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), className: "w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: [_jsx("option", { value: "rating", children: "Meilleures notes" }), _jsx("option", { value: "price", children: "Prix croissant" }), _jsx("option", { value: "distance", children: "Plus proche" })] })] }), _jsx("div", { className: "space-y-3", children: _jsxs("label", { className: "flex items-center gap-3 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: showVideoOnly, onChange: (e) => setShowVideoOnly(e.target.checked), className: "w-4 h-4 bg-input border border-border rounded cursor-pointer accent-primary" }), _jsx("span", { className: "text-sm text-foreground", children: "Vid\u00E9oconsultation uniquement" })] }) }), (searchQuery ||
                                                selectedSpecialties.size > 0 ||
                                                selectedGovernorate ||
                                                priceFilter < 100 ||
                                                showVideoOnly) && (_jsx("div", { className: "pt-4 border-t border-border", children: _jsx("button", { onClick: () => {
                                                        setSearchQuery("");
                                                        setSelectedSpecialties(new Set());
                                                        setSelectedGovernorate("");
                                                        setPriceFilter(100);
                                                        setShowVideoOnly(false);
                                                    }, className: "w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition", children: "R\u00E9initialiser les filtres" }) })), _jsxs("div", { className: "pt-2 border-t border-border text-sm text-muted-foreground", children: [filteredDoctors.length, " m\u00E9decin", filteredDoctors.length !== 1 ? "s" : "", " trouv\u00E9", filteredDoctors.length !== 1 ? "s" : ""] })] }) }), _jsx("div", { className: "lg:col-span-3", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-24", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) })) : filteredDoctors.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5", children: filteredDoctors.map((doctor) => (_jsx(DoctorCard, { ...doctor, onClick: () => {
                                                setSelectedDoctor(doctor);
                                                setIsModalOpen(true);
                                            } }, doctor.id))) })) : (_jsxs("div", { className: "bg-card rounded-xl border border-border p-12 text-center space-y-4", children: [_jsx("p", { className: "text-lg font-medium text-foreground", children: "Aucun m\u00E9decin trouv\u00E9" }), _jsx("p", { className: "text-muted-foreground", children: "Essayez de modifier vos crit\u00E8res de recherche" })] })) })] }) })] }), _jsx(Footer, {}), _jsx(DoctorModal, { doctor: selectedDoctor, isOpen: isModalOpen, onClose: () => {
                    setIsModalOpen(false);
                    setSelectedDoctor(null);
                } })] }));
}
