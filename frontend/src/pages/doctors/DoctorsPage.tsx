
import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { DoctorModal, type Doctor } from "@/components/DoctorModal";
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
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "price" | "distance">("rating");
  const [priceFilter, setPriceFilter] = useState(100);
  const [showVideoOnly, setShowVideoOnly] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((data: Doctor[]) => setDoctors(Array.isArray(data) ? data : []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    let results = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialties.size === 0 ||
        selectedSpecialties.has(doctor.specialty);
      const matchesGovernorate =
        !selectedGovernorate || doctor.governorate === selectedGovernorate;
      const matchesPrice = doctor.price <= priceFilter;
      const matchesVideo = !showVideoOnly || doctor.videoConsultation;

      return (
        matchesSearch &&
        matchesSpecialty &&
        matchesGovernorate &&
        matchesPrice &&
        matchesVideo
      );
    });

    results.sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "distance") return a.distance - b.distance;
      return 0;
    });

    return results;
  }, [doctors, searchQuery, selectedSpecialties, selectedGovernorate, sortBy, priceFilter, showVideoOnly]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Header Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Trouvez votre médecin
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Consultez des médecins spécialistes qualifiés et disponibles
              immédiatement
            </p>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6 sticky top-20">
                {/* Search */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Rechercher
                  </label>
                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Médecin ou spécialité..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-3">
                    Spécialités
                  </label>
                  <div className="space-y-2">
                    {specialties.map((specialty) => {
                      const specialtyInfo = specialtiesMap[specialty];
                      const Icon = specialtyInfo?.icon;
                      return (
                        <label
                          key={specialty}
                          className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-2 rounded transition group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSpecialties.has(specialty)}
                            onChange={(e) => {
                              const newSpecialties = new Set(
                                selectedSpecialties,
                              );
                              if (e.target.checked) {
                                newSpecialties.add(specialty);
                              } else {
                                newSpecialties.delete(specialty);
                              }
                              setSelectedSpecialties(newSpecialties);
                            }}
                            className="w-4 h-4 bg-input border border-border rounded cursor-pointer accent-primary"
                          />
                          {Icon && (
                            <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              {specialty}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {specialtyInfo?.description}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Governorate Filter */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Gouvernorat
                  </label>
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => setSelectedGovernorate(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Tous les gouvernorats</option>
                    {tunisianGovernorates.map((governorate) => (
                      <option key={governorate} value={governorate}>
                        {governorate}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Prix max:{" "}
                    <span className="text-primary">{priceFilter} DT</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="150"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(Number(e.target.value))}
                    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 DT</span>
                    <span>150 DT</span>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">
                    Trier par
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as "rating" | "price" | "distance",
                      )
                    }
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="rating">Meilleures notes</option>
                    <option value="price">Prix croissant</option>
                    <option value="distance">Plus proche</option>
                  </select>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showVideoOnly}
                      onChange={(e) => setShowVideoOnly(e.target.checked)}
                      className="w-4 h-4 bg-input border border-border rounded cursor-pointer accent-primary"
                    />
                    <span className="text-sm text-foreground">
                      Vidéoconsultation uniquement
                    </span>
                  </label>
                </div>

                {/* Reset Filters Button */}
                {(searchQuery ||
                  selectedSpecialties.size > 0 ||
                  selectedGovernorate ||
                  priceFilter < 100 ||
                  showVideoOnly) && (
                    <div className="pt-4 border-t border-border">
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedSpecialties(new Set());
                          setSelectedGovernorate("");
                          setPriceFilter(100);
                          setShowVideoOnly(false);
                        }}
                        className="w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  )}

                {/* Results Count */}
                <div className="pt-2 border-t border-border text-sm text-muted-foreground">
                  {filteredDoctors.length} médecin
                  {filteredDoctors.length !== 1 ? "s" : ""} trouvé
                  {filteredDoctors.length !== 1 ? "s" : ""}
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredDoctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      {...doctor}
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setIsModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-12 text-center space-y-4">
                  <p className="text-lg font-medium text-foreground">
                    Aucun médecin trouvé
                  </p>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <DoctorModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDoctor(null);
        }}
      />
    </div>
  );
}
