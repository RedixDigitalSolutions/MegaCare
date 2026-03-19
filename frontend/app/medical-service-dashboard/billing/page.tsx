'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus } from 'lucide-react';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');

  const invoices = [
    {
      id: 'INV-001',
      patient: 'Fatima Béchir',
      amount: 2500,
      date: '2026-03-01',
      status: 'paid',
      dueDate: '2026-03-15',
    },
    {
      id: 'INV-002',
      patient: 'Mohamed Ali',
      amount: 3200,
      date: '2026-03-05',
      status: 'pending',
      dueDate: '2026-03-20',
    },
    {
      id: 'INV-003',
      patient: 'Aïcha Karray',
      amount: 1800,
      date: '2026-02-28',
      status: 'overdue',
      dueDate: '2026-03-15',
    },
  ];

  const payments = [
    {
      id: 'PAY-001',
      patient: 'Fatima Béchir',
      amount: 2500,
      date: '2026-03-09',
      method: 'Virement bancaire',
    },
    {
      id: 'PAY-002',
      patient: 'Lamine Triki',
      amount: 1500,
      date: '2026-03-07',
      method: 'Carte bancaire',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/medical-service-dashboard" className="text-primary hover:text-primary/80">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold text-foreground">Facturation</h1>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            <Plus size={20} />
            Nouvelle Facture
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('invoices')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'invoices' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            Factures
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`pb-4 px-2 font-semibold transition ${
              activeTab === 'payments' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground'
            }`}
          >
            Paiements
          </button>
        </div>

        {/* Invoices */}
        {activeTab === 'invoices' && (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-card rounded-xl border border-border p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{invoice.patient}</h3>
                      <p className="text-sm text-muted-foreground">{invoice.id} • {invoice.date}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {invoice.status === 'paid' ? 'Payée' : invoice.status === 'pending' ? 'En attente' : 'Retard'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{invoice.amount.toLocaleString()} DT</p>
                  <p className="text-sm text-muted-foreground">Échéance: {invoice.dueDate}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payments */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-card rounded-xl border border-border p-6 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">{payment.patient}</h3>
                      <p className="text-sm text-muted-foreground">{payment.id} • {payment.date} • {payment.method}</p>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-bold text-green-600">+ {payment.amount.toLocaleString()} DT</p>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Revenus du Mois</p>
            <p className="text-3xl font-bold text-foreground">48,500 DT</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">En Attente</p>
            <p className="text-3xl font-bold text-yellow-600">3,200 DT</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Retards</p>
            <p className="text-3xl font-bold text-red-600">1,800 DT</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Facturé</p>
            <p className="text-3xl font-bold text-foreground">53,500 DT</p>
          </div>
        </div>
      </main>
    </div>
  );
}
