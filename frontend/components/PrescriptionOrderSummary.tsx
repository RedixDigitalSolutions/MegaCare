'use client';

import Link from 'next/link';
import { Package, MapPin, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity?: number;
  price: number;
  pharmacy?: string;
}

interface PrescriptionOrderSummaryProps {
  pharmacyName: string;
  pharmacyAddress: string;
  distance: number;
  estimatedDelivery: string;
  items: OrderItem[];
  totalPrice: number;
}

export function PrescriptionOrderSummary({
  pharmacyName,
  pharmacyAddress,
  distance,
  estimatedDelivery,
  items,
  totalPrice,
}: PrescriptionOrderSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Pharmacy Info */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-green-900">{pharmacyName}</h3>
            <p className="text-sm text-green-700 flex items-center gap-2 mt-1">
              <MapPin size={16} />
              {pharmacyAddress}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-700">{distance} km</p>
            <p className="font-semibold text-green-900">Distance</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 flex items-center gap-3">
          <Clock className="w-5 h-5 text-green-600" />
          <div>
            <p className="text-sm text-green-700">Livraison estimée</p>
            <p className="font-semibold text-green-900">{estimatedDelivery}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h4 className="font-bold text-foreground flex items-center gap-2">
          <Package size={20} />
          Médicaments commandés ({items.length})
        </h4>

        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.name}</p>
                {item.quantity && (
                  <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">{item.price.toFixed(2)} DT</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total & Actions */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <p className="text-lg font-bold text-foreground">Total</p>
          <p className="text-2xl font-bold text-primary">{totalPrice.toFixed(2)} DT</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-700">
            <p className="font-semibold">Ordonnance validée</p>
            <p>Votre ordonnance a été scannée avec succès. Vous pouvez procéder à la commande en toute confiance.</p>
          </div>
        </div>

        <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2">
          Confirmer la commande
          <ArrowRight size={18} />
        </button>

        <Link
          href="/pharmacy"
          className="block text-center text-primary hover:underline font-medium text-sm py-2"
        >
          Continuer les achats
        </Link>
      </div>
    </div>
  );
}
