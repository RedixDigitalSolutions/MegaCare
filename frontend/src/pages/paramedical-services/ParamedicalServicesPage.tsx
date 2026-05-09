import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Loader2,
  SlidersHorizontal,
  X,
  HeartPulse,
  PhoneCall,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ParamedicalProvider {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  governorate: string;
  delegation: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  description: string;
}

// ─── Specialization options ────────────────────────────────────────────────────
const SPECIALIZATIONS = [
  "Tous",
  "Infirmier(ère)",
  "Kinésithérapeute",
  "Orthophoniste",
  "Ergothérapeute",
  "Aide-soignant(e)",
  "Sage-femme",
  "Psychomotricien(ne)",
  "Diététicien(ne)",
  "Autre",
];

// ─── Provider Modal ────────────────────────────────────────────────────────────
function ProviderModal({ provider, onClose }: { provider: ParamedicalProvider; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition"
        >
          <X size={15} />
        </button>

        {/* Avatar header */}
        <div className="relative h-40 bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:20px_20px]" />
          {provider.avatar ? (
            <img
              src={provider.avatar}
              alt={provider.name}
              className="w-28 h-28 rounded-full object-cover border-4 border-background shadow-xl"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center border-4 border-background shadow-xl">
              <User size={44} className="text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-foreground">{provider.name}</h2>
            {provider.specialization && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                <HeartPulse size={13} />
                {provider.specialization}
              </span>
            )}
          </div>

          <div className="space-y-3 pt-2">
            {(provider.governorate || provider.delegation) && (
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <span>{[provider.delegation, provider.governorate].filter(Boolean).join(", ")}</span>
              </div>
            )}
            {provider.address && (
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin size={16} className="shrink-0 mt-0.5 opacity-60" />
                <span>{provider.address}</span>
              </div>
            )}
            {provider.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-primary shrink-0" />
                <a href={`tel:${provider.phone}`} className="font-semibold text-foreground hover:text-primary transition">
                  {provider.phone}
                </a>
              </div>
            )}
            {provider.email && (
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-primary shrink-0" />
                <a href={`mailto:${provider.email}`} className="text-foreground/80 hover:text-primary transition break-all">
                  {provider.email}
                </a>
              </div>
            )}
            {provider.openingHours && (
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Clock size={16} className="text-primary shrink-0 mt-0.5" />
                <span>{provider.openingHours}</span>
              </div>
            )}
            {provider.description && (
              <p className="text-sm text-muted-foreground border-t border-border pt-3 mt-3">
                {provider.description}
              </p>
            )}
          </div>

          {/* CTA */}
          {provider.phone && (
            <a
              href={`tel:${provider.phone}`}
              className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition"
            >
              <PhoneCall size={16} />
              Appeler maintenant
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Provider Card ─────────────────────────────────────────────────────────────
function ProviderCard({ provider, onClick }: { provider: ParamedicalProvider; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Avatar banner */}
      <div className="relative h-36 bg-gradient-to-br from-pink-500/20 to-rose-600/20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:20px_20px]" />
        {provider.avatar ? (
          <img
            src={provider.avatar}
            alt={provider.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-xl"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center border-4 border-background shadow-xl">
            <User size={36} className="text-white" />
          </div>
        )}
        {provider.specialization && (
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold rounded-full border border-border whitespace-nowrap">
            {provider.specialization}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-foreground text-base leading-snug text-center">
          {provider.name}
        </h3>
        {provider.specialization && (
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
              {provider.specialization}
            </span>
          </div>
        )}

        <div className="space-y-2">
          {(provider.governorate || provider.delegation) && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
              <span>
                {[provider.delegation, provider.governorate]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
          {provider.address && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <MapPin size={12} className="shrink-0 mt-0.5 opacity-60" />
              <span className="line-clamp-2">{provider.address}</span>
            </div>
          )}
          {provider.phone && (
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Phone size={14} className="shrink-0" />
              {provider.phone}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function ParamedicalServicesPage() {
  const [providers, setProviders] = useState<ParamedicalProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<ParamedicalProvider | null>(null);

  const [query, setQuery] = useState("");
  const [specialization, setSpecialization] = useState("Tous");
  const [governorate, setGovernorate] = useState("");
  const [delegation, setDelegation] = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (governorate) params.set("governorate", governorate);
    if (delegation) params.set("delegation", delegation);
    if (specialization !== "Tous") params.set("specialization", specialization);
    if (query) params.set("search", query);

    fetch(`/api/public/paramedical-services?${params}`)
      .then((r) => r.json())
      .then((data) => setProviders(Array.isArray(data) ? data : []))
      .catch(() => setProviders([]))
      .finally(() => setLoading(false));
  }, [governorate, delegation, specialization, query]);

  const resetFilters = () => {
    setQuery("");
    setSpecialization("Tous");
    setGovernorate("");
    setDelegation("");
  };

  const activeFilterCount = (specialization !== "Tous" ? 1 : 0);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground text-base flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-primary" />
          Filtres
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-primary text-primary-foreground rounded-full">{activeFilterCount}</span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="text-xs text-primary hover:underline font-medium">Tout effacer</button>
        )}
      </div>

      {/* Spécialité */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Spécialité</h4>
        <div className="space-y-1">
          {SPECIALIZATIONS.map((s) => (
            <button
              key={s}
              onClick={() => setSpecialization(s)}
              className={`flex items-center w-full px-3 py-2 rounded-xl text-sm transition-colors ${
                specialization === s
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "hover:bg-secondary/50 text-foreground/80 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={resetFilters}
        className="w-full px-3 py-2.5 border border-border hover:bg-secondary/80 text-foreground rounded-xl text-sm font-medium transition flex items-center justify-center gap-2"
      >
        <X size={13} />
        Réinitialiser
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Provider modal */}
      {selectedProvider && (
        <ProviderModal provider={selectedProvider} onClose={() => setSelectedProvider(null)} />
      )}

      <main className="flex-1 pt-24">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-950 py-16 md:py-20">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-950 via-gray-900 to-rose-950" />
          <div
            className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(ellipse at 15% 60%, #db2777 0%, transparent 45%), radial-gradient(ellipse at 85% 15%, #e11d48 0%, transparent 40%)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full text-white/70 text-xs font-medium mb-1 backdrop-blur-sm">
                <HeartPulse size={13} /> Soins & Services paramédicaux
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Paramédicaux & Soins
              </h1>
              <p className="text-white/55 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                Infirmiers, kinésithérapeutes, orthophonistes et autres professionnels de soins disponibles près de chez vous.
              </p>
            </div>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" size={17} />
              <input
                type="text"
                placeholder="Rechercher un nom, une spécialité…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-white/35 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-white/15 backdrop-blur-sm text-sm transition-all"
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <MapPin size={14} className="text-white/50 shrink-0" />
                <select
                  value={governorate}
                  onChange={(e) => { setGovernorate(e.target.value); setDelegation(""); }}
                  className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                >
                  <option value="" className="text-foreground bg-gray-900">Toutes les régions</option>
                  {GOVERNORATES.map((g) => (
                    <option key={g} value={g} className="text-foreground bg-gray-900">{g}</option>
                  ))}
                </select>
              </div>
              {governorate && DELEGATIONS[governorate] && (
                <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                  <MapPin size={13} className="text-white/50 shrink-0" />
                  <select
                    value={delegation}
                    onChange={(e) => setDelegation(e.target.value)}
                    className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                  >
                    <option value="" className="text-foreground bg-gray-900">Toutes les délégations</option>
                    {DELEGATIONS[governorate].map((d) => (
                      <option key={d} value={d} className="text-foreground bg-gray-900">{d}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3.5 py-2 backdrop-blur-sm">
                <HeartPulse size={13} className="text-white/50 shrink-0" />
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="bg-transparent text-white border-none outline-none text-sm font-medium cursor-pointer"
                >
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s} className="text-foreground bg-gray-900">{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Mobile toolbar */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{providers.length}</span> prestataire{providers.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-secondary/50 transition"
            >
              <SlidersHorizontal size={15} />
              Filtres
            </button>
          </div>

          {showMobileFilters && (
            <div className="lg:hidden mb-6 p-5 bg-card border border-border rounded-xl">
              <FilterSidebar />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-5 space-y-6 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <FilterSidebar />
              </div>
            </aside>

            {/* Results */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-muted-foreground hidden lg:block">
                  <span className="font-semibold text-foreground">{providers.length}</span> prestataire{providers.length !== 1 ? "s" : ""}
                </p>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-24">
                  <Loader2 size={40} className="animate-spin text-primary" />
                </div>
              ) : providers.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center space-y-4">
                  <HeartPulse size={48} className="mx-auto text-muted-foreground/40" />
                  <p className="text-lg font-medium text-foreground">
                    Aucun prestataire trouvé
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {providers.map((p) => (
                    <ProviderCard key={p.id} provider={p} onClick={() => setSelectedProvider(p)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
