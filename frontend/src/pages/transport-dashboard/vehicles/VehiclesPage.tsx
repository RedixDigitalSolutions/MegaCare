
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Search, AlertCircle, CheckCircle } from 'lucide-react';

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState([
    { id: 1, plate: 'TN-1234-AB', name: 'Ambulance #1', status: 'Actif', mileage: '45,200 km', lastMaintenance: '2024-02-15' },
    { id: 2, plate: 'TN-5678-CD', name: 'Ambulance #2', status: 'Actif', mileage: '32,100 km', lastMaintenance: '2024-02-20' },
    { id: 3, plate: 'TN-9012-EF', name: 'Ambulance #3', status: 'Maintenance', mileage: '28,900 km', lastMaintenance: '2024-01-10' },
    { id: 4, plate: 'TN-3456-GH', name: 'Ambulance #4', status: 'Actif', mileage: '51,300 km', lastMaintenance: '2024-03-01' },
  ]);

  const filteredVehicles = vehicles.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.plate.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/transport-dashboard" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Gestion de la Flotte</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium">
            <Plus size={20} />
            Ajouter Véhicule
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Rechercher un véhicule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{vehicle.name}</h3>
                  <p className="text-sm text-muted-foreground">{vehicle.plate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
                  vehicle.status === 'Actif' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  {vehicle.status === 'Actif' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {vehicle.status}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kilométrage</span>
                  <span className="font-medium text-foreground">{vehicle.mileage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dernière maintenance</span>
                  <span className="font-medium text-foreground">{vehicle.lastMaintenance}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-border">
                <button className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition text-sm font-medium">
                  Détails
                </button>
                <button className="flex-1 px-3 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition text-sm font-medium">
                  Maintenance
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Aucun véhicule trouvé</p>
          </div>
        )}
      </main>
    </div>
  );
}
