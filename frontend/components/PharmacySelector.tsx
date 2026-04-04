
import { Pharmacy } from '@/lib/pharmacy-data';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface PharmacySelectorProps {
  pharmacies: Pharmacy[];
  selectedPharmacy?: Pharmacy;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  isLoading?: boolean;
}

export function PharmacySelector({
  pharmacies,
  selectedPharmacy,
  onSelectPharmacy,
  isLoading = false,
}: PharmacySelectorProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (pharmacies.length === 0) {
    return (
      <div className="p-6 text-center bg-secondary/30 rounded-lg">
        <p className="text-muted-foreground">Aucune pharmacie trouvée à proximité</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3">
        {pharmacies.map((pharmacy) => (
          <Card
            key={pharmacy.id}
            className={`p-4 cursor-pointer transition border-2 ${
              selectedPharmacy?.id === pharmacy.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => onSelectPharmacy(pharmacy)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-2">{pharmacy.name}</h3>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span className="break-words">{pharmacy.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{pharmacy.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{pharmacy.hours}</span>
                  </div>
                </div>
              </div>
              
              {pharmacy.distance && (
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-primary">
                    {pharmacy.distance.toFixed(1)} km
                  </div>
                </div>
              )}
            </div>

            {selectedPharmacy?.id === pharmacy.id && (
              <div className="mt-3 pt-3 border-t border-border">
                <Button size="sm" variant="default" className="w-full">
                  Sélectionnée
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
