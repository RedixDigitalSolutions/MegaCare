export interface Pharmacy {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  phone: string;
  hours: string;
  distance?: number;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  category: string;
  price: number;
  inStock: boolean;
  quantity: number;
  description: string;
}

export const mockPharmacies: Pharmacy[] = [
  {
    id: 'pharmacy-1',
    name: 'Pharmacie Centrale',
    latitude: 33.9716,
    longitude: 9.5375,
    address: '123 Avenue de la Liberté, Tunis',
    phone: '+216 71 123 456',
    hours: '08:00 - 22:00',
  },
  {
    id: 'pharmacy-2',
    name: 'Pharmacie du Centre',
    latitude: 33.9726,
    longitude: 9.5385,
    address: '456 Rue Bourguiba, Tunis',
    phone: '+216 71 234 567',
    hours: '08:30 - 21:00',
  },
  {
    id: 'pharmacy-3',
    name: 'Pharmacie Moderne',
    latitude: 33.9736,
    longitude: 9.5395,
    address: '789 Boulevard, Tunis',
    phone: '+216 71 345 678',
    hours: '09:00 - 20:00',
  },
  {
    id: 'pharmacy-4',
    name: 'Pharmacie de Nuit',
    latitude: 33.9706,
    longitude: 9.5365,
    address: '321 Avenue Hassan, Tunis',
    phone: '+216 71 456 789',
    hours: '24h/24',
  },
  {
    id: 'pharmacy-5',
    name: 'Pharmacie Plus',
    latitude: 33.9746,
    longitude: 9.5405,
    address: '654 Rue Sainte, Tunis',
    phone: '+216 71 567 890',
    hours: '08:00 - 22:00',
  },
];

export const mockMedicines: Medicine[] = [
  {
    id: 'med-1',
    name: 'Amoxicilline',
    dosage: '500mg',
    category: 'Antibiotique',
    price: 15.99,
    inStock: true,
    quantity: 25,
    description: 'Antibiotique pour infections bactériennes',
  },
  {
    id: 'med-2',
    name: 'Paracétamol',
    dosage: '500mg',
    category: 'Antalgique',
    price: 5.99,
    inStock: true,
    quantity: 100,
    description: 'Analgésique et antipyrétique',
  },
  {
    id: 'med-3',
    name: 'Ibuprofène',
    dosage: '400mg',
    category: 'Anti-inflammatoire',
    price: 8.99,
    inStock: true,
    quantity: 50,
    description: 'Anti-inflammatoire non stéroïdien',
  },
  {
    id: 'med-4',
    name: 'Metformine',
    dosage: '850mg',
    category: 'Antidiabétique',
    price: 12.99,
    inStock: true,
    quantity: 30,
    description: 'Pour le traitement du diabète type 2',
  },
  {
    id: 'med-5',
    name: 'Lisinopril',
    dosage: '10mg',
    category: 'Antihypertenseur',
    price: 18.99,
    inStock: true,
    quantity: 20,
    description: 'Inhibiteur ACE pour la tension',
  },
  {
    id: 'med-6',
    name: 'Oméprazole',
    dosage: '20mg',
    category: 'Antiulcéreux',
    price: 14.99,
    inStock: true,
    quantity: 40,
    description: 'Inhibiteur de la pompe à protons',
  },
  {
    id: 'med-7',
    name: 'Cetirizine',
    dosage: '10mg',
    category: 'Antihistaminique',
    price: 7.99,
    inStock: true,
    quantity: 60,
    description: 'Antihistaminique pour allergies',
  },
  {
    id: 'med-8',
    name: 'Loratadine',
    dosage: '10mg',
    category: 'Antihistaminique',
    price: 9.99,
    inStock: true,
    quantity: 45,
    description: 'Antihistaminique non sédatif',
  },
  {
    id: 'med-9',
    name: 'Augmentin',
    dosage: '875mg',
    category: 'Antibiotique',
    price: 22.99,
    inStock: true,
    quantity: 15,
    description: 'Amoxicilline + acide clavulanique',
  },
  {
    id: 'med-10',
    name: 'Azithromycine',
    dosage: '500mg',
    category: 'Antibiotique',
    price: 19.99,
    inStock: true,
    quantity: 20,
    description: 'Macrolide antibiotique',
  },
];

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getPharmaciesNearby(latitude: number, longitude: number, radiusKm: number = 5): Pharmacy[] {
  return mockPharmacies
    .map((pharmacy) => ({
      ...pharmacy,
      distance: calculateDistance(latitude, longitude, pharmacy.latitude, pharmacy.longitude),
    }))
    .filter((pharmacy) => pharmacy.distance! <= radiusKm)
    .sort((a, b) => a.distance! - b.distance!);
}
