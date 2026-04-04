
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { DoctorCard } from '@/components/DoctorCard';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, ArrowLeft } from 'lucide-react';
import { specialtiesMap } from '@/lib/specialties';

const tunisianGovernorates = [
  'Ariana',
  'Ben Arous',
  'Manouba',
  'Tunis',
  'Béja',
  'Jendouba',
  'Le Kef',
  'Siliana',
  'Kasserine',
  'Sidi Bouzid',
  'Sfax',
  'Gabès',
  'Médenine',
  'Tataouine',
  'Gafsa',
  'Tozeur',
  'Kébili',
  'Mahdia',
  'Monastir',
  'Sousse',
  'Nabeul',
  'Zaghouan',
  'Hammamet',
  'Bizerte',
];

const mockDoctors = [
  {
    id: '1',
    name: 'Amira Mansouri',
    specialty: 'Cardiologie',
    rating: 4.8,
    reviews: 132,
    location: 'La Marsa',
    governorate: 'Tunis',
    distance: 1.2,
    price: 55,
    availability: 'Demain 14h',
    certified: true,
    videoConsultation: true,
  },
  {
    id: '2',
    name: 'Karim Ben Ali',
    specialty: 'Cardiologie',
    rating: 4.7,
    reviews: 98,
    location: 'Sfax',
    governorate: 'Sfax',
    distance: 8.5,
    price: 50,
    availability: 'Aujourd\'hui 16h',
    certified: true,
    videoConsultation: true,
  },
  {
    id: '3',
    name: 'Fatima Zahra',
    specialty: 'Dermatologie',
    rating: 4.9,
    reviews: 156,
    location: 'Tunis Centre',
    governorate: 'Tunis',
    distance: 2.1,
    price: 45,
    availability: 'Demain 11h',
    certified: true,
    videoConsultation: true,
  },
  {
    id: '4',
    name: 'Mohamed Nasser',
    specialty: 'Pédiatrie',
    rating: 4.6,
    reviews: 87,
    location: 'Ariana',
    governorate: 'Ariana',
    distance: 5.3,
    price: 40,
    availability: 'Demain 10h',
    certified: false,
    videoConsultation: true,
  },
  {
    id: '5',
    name: 'Hana Dhawi',
    specialty: 'Gynécologie',
    rating: 4.8,
    reviews: 145,
    location: 'Menzah',
    governorate: 'Tunis',
    distance: 3.2,
    price: 50,
    availability: 'Aujourd\'hui 15h',
    certified: true,
    videoConsultation: true,
  },
  {
    id: '6',
    name: 'Riadh Gharbi',
    specialty: 'Orthopédie',
    rating: 4.7,
    reviews: 112,
    location: 'Carthage',
    governorate: 'Tunis',
    distance: 4.1,
    price: 55,
    availability: 'Demain 09h',
    certified: true,
    videoConsultation: false,
  },
  {
    id: '7',
    name: 'Leïla Khaled',
    specialty: 'Psychologie',
    rating: 4.9,
    reviews: 178,
    location: 'Tunis Centre',
    governorate: 'Tunis',
    distance: 2.5,
    price: 45,
    availability: 'Aujourd\'hui 17h',
    certified: true,
    videoConsultation: true,
  },
  {
    id: '8',
    name: 'Ahmed Saidi',
    specialty: 'Psychiatrie',
    rating: 4.7,
    reviews: 95,
    location: 'Bardo',
    governorate: 'Ben Arous',
    distance: 6.2,
    price: 60,
    availability: 'Demain 13h',
    certified: true,
    videoConsultation: true,
  },
];

const specialties = [
  'Cardiologie',
  'Dermatologie',
  'Pédiatrie',
  'Psychiatrie',
  'Psychologie',
  'Orthopédie',
  'Gynécologie',
  'ORL',
  'Ophtalmologie',
];

export default function FindDoctorPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<Set<string>>(new Set());
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');
  const [priceFilter, setPriceFilter] = useState(100);
  const [showVideoOnly, setShowVideoOnly] = useState(false);

  const filteredDoctors = useMemo(() => {
    let results = mockDoctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialties.size === 0 || selectedSpecialties.has(doctor.specialty);
      const matchesGovernorate = !selectedGovernorate || doctor.governorate === selectedGovernorate;
      const matchesPrice = doctor.price <= priceFilter;
      const matchesVideo = !showVideoOnly || doctor.videoConsultation;

      return matchesSearch && matchesSpecialty && matchesGovernorate && matchesPrice && matchesVideo;
    });

    results.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'distance') return a.distance - b.distance;
      return 0;
    });

    return results;
  }, [searchQuery, selectedSpecialties, selectedGovernorate, sortBy, priceFilter, showVideoOnly]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <DashboardSidebar userName={user.firstName} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 hover:bg-secondary rounded-lg transition">
                <ArrowLeft size={20} className="text-primary" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Trouver un médecin</h1>
                <p className="text-muted-foreground mt-1">{filteredDoctors.length} médecin(s) disponible(s)</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-w-7xl mx-auto space-y-8">
            {/* Filters */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Filtres</h3>

              {/* Search Bar */}
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Chercher un médecin ou une spécialité..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Specialty Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground">Spécialités</label>
                  <div className="bg-secondary/30 rounded-lg p-3 max-h-64 overflow-y-auto space-y-2">
                    {specialties.map((spec) => {
                      const specialtyInfo = specialtiesMap[spec];
                      const Icon = specialtyInfo?.icon;
                      return (
                        <label key={spec} className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-2 rounded transition">
                          <input
                            type="checkbox"
                            checked={selectedSpecialties.has(spec)}
                            onChange={(e) => {
                              const newSpecialties = new Set(selectedSpecialties);
                              if (e.target.checked) {
                                newSpecialties.add(spec);
                              } else {
                                newSpecialties.delete(spec);
                              }
                              setSelectedSpecialties(newSpecialties);
                            }}
                            className="w-4 h-4 bg-input border border-border rounded cursor-pointer accent-primary"
                          />
                          {Icon && <Icon className="w-5 h-5 text-primary flex-shrink-0" />}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{spec}</span>
                            <span className="text-xs text-muted-foreground">{specialtyInfo?.description}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Governorate Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Gouvernorat</label>
                  <select
                    value={selectedGovernorate}
                    onChange={(e) => setSelectedGovernorate(e.target.value)}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Tous les gouvernorats</option>
                    {tunisianGovernorates.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Prix max: {priceFilter} DT
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Sort By */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Trier par</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'rating' | 'price' | 'distance')}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="rating">Meilleure note</option>
                    <option value="price">Prix (moins cher)</option>
                    <option value="distance">Distance</option>
                  </select>
                </div>

                {/* Video Consultation Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Consultation</label>
                  <button
                    onClick={() => setShowVideoOnly(!showVideoOnly)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                      showVideoOnly
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary border border-border hover:bg-secondary/80'
                    }`}
                  >
                    {showVideoOnly ? 'Vidéo uniquement' : 'Tous les types'}
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    id={doctor.id}
                    name={doctor.name}
                    specialty={doctor.specialty}
                    rating={doctor.rating}
                    reviews={doctor.reviews}
                    location={doctor.location}
                    distance={doctor.distance}
                    price={doctor.price}
                    availability={doctor.availability}
                    certified={doctor.certified}
                    videoConsultation={doctor.videoConsultation}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border p-12 text-center space-y-4">
                <div className="text-5xl">🔍</div>
                <h3 className="text-xl font-semibold text-foreground">Aucun médecin trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
