'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowRight, Lock, User, ShoppingCart } from 'lucide-react';

export default function WelcomePage() {
  const testAccounts = [
    {
      role: 'Patient',
      icon: '👤',
      description: 'Accédez à vos consultations et votre dossier médical',
      features: ['Prendre rendez-vous', 'Suivi médical', 'Pharmacie en ligne'],
      testData: 'Email: patient@test.com\nMDP: demo123',
    },
    {
      role: 'Médecin',
      icon: '👨‍⚕️',
      description: 'Gérez vos rendez-vous et vos patients',
      features: ['Consultations vidéo', 'Gestion des patients', 'Ordonnances'],
      testData: 'License: MD-001-2024\nEmail: doctor@test.com\nMDP: demo123',
    },
    {
      role: 'Pharmacien',
      icon: '💊',
      description: 'Gérez votre stock et vos commandes',
      features: ['Gestion du stock', 'Traitement des commandes', 'Analytiques'],
      testData: 'Agrément: PH-001-2024\nEmail: pharmacy@test.com\nMDP: demo123',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold text-foreground">
              Système d'Authentification MegaCare
            </h1>
            <p className="text-xl text-muted-foreground">
              Connectez-vous avec votre rôle et accédez à votre dashboard dédié
            </p>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto py-16 px-4 space-y-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Comment ça fonctionne
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                1️⃣
              </div>
              <h3 className="text-xl font-bold text-foreground">Choisir votre rôle</h3>
              <p className="text-muted-foreground">
                Sélectionnez si vous êtes patient, médecin ou pharmacien
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                2️⃣
              </div>
              <h3 className="text-xl font-bold text-foreground">Remplir le formulaire</h3>
              <p className="text-muted-foreground">
                Entrez vos informations et ID professionnel si applicable
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-2xl">
                3️⃣
              </div>
              <h3 className="text-xl font-bold text-foreground">Accès au dashboard</h3>
              <p className="text-muted-foreground">
                Redirection automatique vers votre espace personnel
              </p>
            </div>
          </div>
        </section>

        {/* Auth Options */}
        <section className="max-w-6xl mx-auto py-16 px-4 space-y-8">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Choisir votre profil
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Login */}
            <div className="bg-card rounded-xl border-2 border-border hover:border-primary transition p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">Connexion</h3>
                <Lock className="text-primary" size={24} />
              </div>
              <p className="text-muted-foreground">
                Vous avez déjà un compte? Connectez-vous ici
              </p>
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium gap-2"
              >
                Aller à la connexion
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Register */}
            <div className="bg-card rounded-xl border-2 border-border hover:border-primary transition p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">Inscription</h3>
                <User className="text-primary" size={24} />
              </div>
              <p className="text-muted-foreground">
                Nouveau sur MegaCare? Créez votre compte gratuitement
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium gap-2"
              >
                Créer un compte
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Dashboard Preview */}
            <div className="bg-card rounded-xl border-2 border-border hover:border-primary transition p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">Voir les dashboards</h3>
                <ShoppingCart className="text-primary" size={24} />
              </div>
              <p className="text-muted-foreground">
                Parcourez une vue d'ensemble de chaque dashboard
              </p>
              <Link
                href="/dashboards-overview"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium gap-2"
              >
                Explorer les dashboards
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Test Accounts */}
        <section className="bg-secondary/30 py-16 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center text-foreground">
              Comptes de test disponibles
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {testAccounts.map((account) => (
                <div key={account.role} className="bg-card rounded-xl border border-border p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{account.icon}</span>
                    <h3 className="text-xl font-bold text-foreground">{account.role}</h3>
                  </div>

                  <p className="text-muted-foreground">{account.description}</p>

                  <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
                    <p className="font-semibold text-foreground text-sm">Caractéristiques:</p>
                    <ul className="space-y-1">
                      {account.features.map((feature) => (
                        <li key={feature} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-primary">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-primary/10 rounded-lg p-3">
                    <p className="text-xs font-mono text-primary whitespace-pre-line">
                      {account.testData}
                    </p>
                  </div>

                  <Link
                    href="/login"
                    className="block text-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition font-medium text-sm"
                  >
                    Se connecter
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto py-16 px-4 space-y-8">
          <h2 className="text-3xl font-bold text-center text-foreground">
            Fonctionnalités du système
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-primary">✓</span> Authentification multi-rôles
              </h4>
              <p className="text-sm text-muted-foreground">
                Support complet pour Patients, Médecins et Pharmaciens
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-primary">✓</span> ID professionnels validés
              </h4>
              <p className="text-sm text-muted-foreground">
                Numéros de licence et d'agrément requis
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-primary">✓</span> Redirection automatique
              </h4>
              <p className="text-sm text-muted-foreground">
                Accès immédiat au dashboard approprié
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-primary">✓</span> Persistance des données
              </h4>
              <p className="text-sm text-muted-foreground">
                Les utilisateurs restent connectés après rechargement
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-primary">✓</span> Protection des routes
              </h4>
              <p className="text-sm text-muted-foreground">
                Accès sécurisé aux dashboards par rôle
              </p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="text-primary">✓</span> Déconnexion facile
              </h4>
              <p className="text-sm text-muted-foreground">
                Bouton de déconnexion dans chaque dashboard
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
