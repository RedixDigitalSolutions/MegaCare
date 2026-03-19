'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { ChevronDown, FileText, Plus, Lock, AlertCircle } from 'lucide-react';

export default function MedicalRecordsPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>(['general']);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const sections = [
    {
      id: 'general',
      title: 'Informations générales',
      icon: '❤️',
      fields: [
        { label: 'Groupe sanguin', value: 'O+' },
        { label: 'Taille', value: '165 cm' },
        { label: 'Poids', value: '62 kg' },
      ],
    },
    {
      id: 'allergies',
      title: 'Allergies',
      icon: '⚠️',
      fields: [
        { label: 'Allergie', value: 'Pénicilline', color: 'red' },
        { label: 'Allergie', value: 'Arachides', color: 'red' },
      ],
    },
    {
      id: 'chronic',
      title: 'Maladies chroniques',
      icon: '🏥',
      fields: [
        { label: 'Condition', value: 'Hypertension artérielle' },
        { label: 'Condition', value: 'Diabète type 2' },
      ],
    },
    {
      id: 'treatments',
      title: 'Traitements en cours',
      icon: '💊',
      fields: [
        { label: 'Traitement', value: 'Métoprolol 50mg - 2x par jour' },
        { label: 'Traitement', value: 'Metformine 500mg - 3x par jour' },
      ],
    },
    {
      id: 'history',
      title: 'Antécédents médicaux',
      icon: '🔬',
      fields: [
        { label: 'Antécédent', value: 'Appendicectomie (2015)' },
        { label: 'Antécédent', value: 'Fracture du bras (2010)' },
      ],
    },
    {
      id: 'vaccination',
      title: 'Carnet de vaccination',
      icon: '💉',
      fields: [
        { label: 'Vaccin', value: 'COVID-19 (3 doses)' },
        { label: 'Vaccin', value: 'Grippe (2023-2024)' },
      ],
    },
  ];

  const sharedAccess = [
    {
      doctor: 'Dr. Amira Mansouri',
      specialty: 'Cardiologue',
      accessUntil: '21/03/2025',
    },
    {
      doctor: 'Dr. Mohamed Ben Salem',
      specialty: 'Généraliste',
      accessUntil: 'Permanent',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mon Dossier Médical</h1>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  Sécurisé & Chiffré
                </p>
              </div>
              <span className="text-xs text-muted-foreground">
                Mis à jour le {new Date().toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Completion Alert */}
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Complétez votre dossier pour une meilleure prise en charge
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Taux de complétion: 65%
                </p>
                <div className="w-full h-2 bg-primary/20 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Medical Records Sections */}
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="bg-card rounded-lg border border-border overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <h3 className="font-semibold text-foreground">{section.title}</h3>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`text-muted-foreground transition ${
                        expandedSections.includes(section.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedSections.includes(section.id) && (
                    <div className="px-6 py-4 border-t border-border bg-secondary/5 space-y-3">
                      {section.fields.map((field, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground">{field.label}</p>
                            <p className="font-medium text-foreground">{field.value}</p>
                          </div>
                          {field.color === 'red' && (
                            <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                              ✕ Allergie
                            </span>
                          )}
                        </div>
                      ))}
                      <button className="text-primary text-sm font-medium hover:underline mt-2">
                        + Ajouter un élément
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Shared Access */}
            <div className="bg-gradient-to-br from-green-50 to-green-5 border border-green-200 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-foreground text-lg">
                Médecins ayant accès à votre dossier
              </h3>

              <div className="space-y-3">
                {sharedAccess.map((access, idx) => (
                  <div key={idx} className="flex items-start justify-between bg-white rounded-lg p-4 border border-green-100">
                    <div>
                      <p className="font-semibold text-foreground">Dr. {access.doctor}</p>
                      <p className="text-xs text-muted-foreground">{access.specialty}</p>
                      <p className="text-xs text-green-700 mt-1">
                        Accès jusqu'au {access.accessUntil}
                      </p>
                    </div>
                    <button className="text-sm text-destructive hover:underline font-medium">
                      Révoquer
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium text-sm">
                + Partager avec un médecin
              </button>
            </div>

            {/* Upload Documents */}
            <div className="bg-card rounded-lg border-2 border-dashed border-primary/30 p-8 text-center space-y-3">
              <FileText className="w-8 h-8 text-primary mx-auto" />
              <div>
                <p className="font-semibold text-foreground">Ajoutez vos documents</p>
                <p className="text-sm text-muted-foreground">
                  Ordonnances, résultats d'analyses, etc.
                </p>
              </div>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium text-sm mx-auto">
                Télécharger un document
              </button>
            </div>
          </div>

          {/* Floating Action Button */}
          <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition flex items-center justify-center">
            <Plus size={24} />
          </button>
        </main>
      </div>
    </div>
  );
}
