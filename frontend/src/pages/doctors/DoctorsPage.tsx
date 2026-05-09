
import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { DoctorCard } from "@/components/DoctorCard";
import { DoctorModal, type Doctor } from "@/components/DoctorModal";
import {
  Search,
  Loader2,
  MapPin,
  Activity,
  ChevronLeft,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { specialtiesMap } from "@/lib/specialties";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";

export default function DoctorsPage() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
  const [selectedGovernorate, setSelectedGovernorate] = useState("");
  const [selectedDelegation, setSelectedDelegation] = useState("");
  const [heroSpecialty, setHeroSpecialty] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Scroll to top on mount
  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }); }, []);

  useEffect(() => {
    setLoading(true);
    fetch("/api/doctors")
      .then((r) => r.json())
      .then((data: Doctor[]) => {
        const list = Array.isArray(data) ? data : [];
        setDoctors(list);
        const urlSpecialty = searchParams.get("specialty");
        if (urlSpecialty) {
          const match = list.find(
            (d) => d.specialty.toLowerCase() === urlSpecialty.toLowerCase()
          )?.specialty ?? urlSpecialty;
          setSelectedSpecialties(new Set([match]));
          setHeroSpecialty(match);
        }
      })
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  // Filter and sort doctors
  const filteredDoctors = useMemo(() => {
    const results = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty =
        selectedSpecialties.size === 0 ||
        selectedSpecialties.has(doctor.specialty);
      const matchesGovernorate =
        !selectedGovernorate || doctor.governorate === selectedGovernorate;
      const matchesDelegation =
        !selectedDelegation || (doctor as any).delegation === selectedDelegation;
      return matchesSearch && matchesSpecialty && matchesGovernorate && matchesDelegation;
    });
    results.sort((a, b) => b.rating - a.rating);
    return results;
  }, [doctors, searchQuery, selectedSpecialties, selectedGovernorate, selectedDelegation]);

  // Derive available specialties from loaded doctors
  const specialties = useMemo(
    () => [...new Set(doctors.map((d) => d.specialty).filter(Boolean))].sort(),
    [doctors],
  );

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Specialties */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
          Spécialités
        </p>
        <div className="space-y-2 pr-1">
          {specialties.map((specialty) => {
            const specialtyInfo = specialtiesMap[specialty];
            const Icon = specialtyInfo?.icon;
            return (
              <label
                key={specialty}
                className="flex items-center gap-2.5 cursor-pointer hover:bg-secondary/50 p-2 rounded-lg transition group"
              >
                <input
                  type="checkbox"
                  checked={selectedSpecialties.has(specialty)}
                  onChange={(e) => {
                    const next = new Set(selectedSpecialties);
                    if (e.target.checked) next.add(specialty);
                    else next.delete(specialty);
                    setSelectedSpecialties(next);
                    if (!e.target.checked && heroSpecialty === specialty) setHeroSpecialty("");
                  }}
                  className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                />
                {Icon && <Icon className="w-4 h-4 text-primary flex-shrink-0" />}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{specialty}</span>
                  {specialtyInfo?.description && (
                    <span className="text-xs text-muted-foreground leading-tight">{specialtyInfo.description}</span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          setSearchQuery("");
          setSelectedSpecialties(new Set());
          setSelectedGovernorate("");
          setSelectedDelegation("");
          setHeroSpecialty("");
        }}
        className="w-full px-3 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg text-sm font-medium transition"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gray-950 py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-gray-900 to-teal-950" />
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(ellipse at 15% 60%, #10b981 0%, transparent 45%), radial-gradient(ellipse at 85% 15%, #0d9488 0%, transparent 40%)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
            {/* Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-white/70 text-xs font-medium mb-1 backdrop-blur-sm">
                <Activity size={13} /> Médecins & Spécialistes
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Trouvez votre médecin
              </h1>
              <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Consultez des médecins spécialistes qualifiés — prenez rendez-vous en vidéo ou en cabinet.
              </p>
            </div>

            {/* Search bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" size={17} />
              <input
                type="text"
                placeholder="Nom du médecin, spécialité…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 backdrop-blur-sm text-sm transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Location + specialty selects */}
            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <MapPin size={14} className="text-white/50 shrink-0" />
                <select
                  value={selectedGovernorate}
                  onChange={(e) => { setSelectedGovernorate(e.target.value); setSelectedDelegation(""); }}
                  className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" className="text-foreground bg-gray-900">Toutes les régions</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g} className="text-foreground bg-gray-900">{g}</option>
                  ))}
                </select>
              </div>
              {selectedGovernorate && DELEGATIONS[selectedGovernorate] && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                  <MapPin size={13} className="text-white/50 shrink-0" />
                  <select
                    value={selectedDelegation}
                    onChange={(e) => setSelectedDelegation(e.target.value)}
                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="" className="text-foreground bg-gray-900">Toutes les délégations</option>
                    {DELEGATIONS[selectedGovernorate].map((d) => (
                      <option key={d} value={d} className="text-foreground bg-gray-900">{d}</option>
                    ))}
                  </select>
                </div>
              )}
              {specialties.length > 0 && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                  <Activity size={13} className="text-white/50 shrink-0" />
                  <select
                    value={heroSpecialty}
                    onChange={(e) => { setHeroSpecialty(e.target.value); setSelectedSpecialties(e.target.value ? new Set([e.target.value]) : new Set()); }}
                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="" className="text-foreground bg-gray-900">Toutes les spécialités</option>
                    {specialties.map((s) => (
                      <option key={s} value={s} className="text-foreground bg-gray-900">{s}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-xl border border-border p-6 space-y-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                {/* Search */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Rechercher
                  </p>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Médecin ou spécialité..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>

                <FilterPanel />

                {/* Results count */}
                <div className="pt-2 border-t border-border text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{filteredDoctors.length}</span>{" "}
                  médecin{filteredDoctors.length !== 1 ? "s" : ""} trouvé{filteredDoctors.length !== 1 ? "s" : ""}
                </div>
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                <p className="text-sm text-muted-foreground">
                  <span className="font-bold text-foreground">{filteredDoctors.length}</span>{" "}
                  médecin{filteredDoctors.length !== 1 ? "s" : ""} trouvé{filteredDoctors.length !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition-colors"
                  >
                    <SlidersHorizontal size={15} />
                    Filtres
                  </button>

                </div>
              </div>

              {/* Mobile filters panel */}
              {showFilters && (
                <div className="lg:hidden bg-card border border-border rounded-xl p-6 mb-5">
                  <FilterPanel />
                </div>
              )}

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
                  <p className="text-lg font-medium text-foreground">Aucun médecin trouvé</p>
                  <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
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
