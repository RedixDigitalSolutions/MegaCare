'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/medical-service-dashboard" className="text-primary hover:text-primary/80">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Statistiques & Rapports</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Patients</p>
            <p className="text-3xl font-bold text-foreground">142</p>
            <p className="text-xs text-green-600 mt-2">+12 ce mois</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Consultations</p>
            <p className="text-3xl font-bold text-foreground">287</p>
            <p className="text-xs text-green-600 mt-2">+25 ce mois</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Taux Satisfaction</p>
            <p className="text-3xl font-bold text-foreground">4.7/5</p>
            <p className="text-xs text-green-600 mt-2">Excellent</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Revenus Mensuels</p>
            <p className="text-3xl font-bold text-foreground">156,800 DT</p>
            <p className="text-xs text-green-600 mt-2">+20% année</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Performance de l'Équipe</h3>
            <div className="space-y-4">
              {[
                { name: 'Dr. Ahmed Saidi', patients: 28, satisfaction: 4.9 },
                { name: 'Infirmière Nadia', patients: 35, satisfaction: 4.8 },
                { name: 'Dr. Fatima Ben', patients: 24, satisfaction: 4.7 },
                { name: 'Aide-soignant Karim', patients: 18, satisfaction: 4.6 },
              ].map((member) => (
                <div key={member.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.patients} patients • {member.satisfaction}/5</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${(member.satisfaction / 5) * 100}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Pathologies Fréquentes</h3>
            <div className="space-y-4">
              {[
                { name: 'Hypertension', count: 42, percentage: 29 },
                { name: 'Diabète', count: 35, percentage: 25 },
                { name: 'Maladie Cardiaque', count: 28, percentage: 20 },
                { name: 'BPCO', count: 21, percentage: 15 },
                { name: 'Autres', count: 16, percentage: 11 },
              ].map((condition) => (
                <div key={condition.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{condition.name}</p>
                    <p className="text-xs text-muted-foreground">{condition.count} patients</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${condition.percentage}%` }}></div>
                    </div>
                    <p className="text-sm font-semibold text-foreground">{condition.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Activité Mensuelle</h3>
          <div className="space-y-3">
            {[
              { month: 'Janvier', consultations: 240, revenue: 120000 },
              { month: 'Février', consultations: 260, revenue: 130000 },
              { month: 'Mars', consultations: 287, revenue: 156800 },
            ].map((month) => (
              <div key={month.month} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div>
                  <p className="text-sm font-semibold text-foreground">{month.month}</p>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{month.consultations}</p>
                    <p className="text-xs text-muted-foreground">Consultations</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{month.revenue.toLocaleString()} DT</p>
                    <p className="text-xs text-muted-foreground">Revenus</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
