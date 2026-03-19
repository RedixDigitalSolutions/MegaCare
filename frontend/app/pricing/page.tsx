import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

export default function PricingPage() {
  const doctorPricing = [
    {
      title: 'Médecin Généraliste',
      price: 25,
      color: 'from-blue-500',
      features: [
        'Consultation générale',
        'Ordonnance numérique',
        'Suivi 7 jours',
        'Accès dossier médical',
      ],
    },
    {
      title: 'Spécialiste',
      price: 35,
      color: 'from-purple-500',
      highlighted: true,
      features: [
        'Consultation spécialisée',
        'Analyse approfondie',
        'Ordonnance numérique',
        'Suivi 14 jours',
        'Accès complet au dossier',
      ],
    },
    {
      title: 'Super-spécialiste',
      price: 55,
      color: 'from-pink-500',
      features: [
        'Consultation d\'expert',
        'Avis professionnel',
        'Ordonnance numérique',
        'Suivi 30 jours',
        'Rapport détaillé',
      ],
    },
  ];

  const pharmacyPricing = [
    { name: 'Livraison standard', price: 5 },
    { name: 'Livraison express 2h', price: 8 },
    { name: 'Retrait en pharmacie', price: 0 },
  ];

  const faqs = [
    {
      question: 'Existe-t-il des abonnements mensuels?',
      answer: 'Non, nous n\'offrons que la tarification à la consultation. Payez uniquement pour les consultations que vous utilisez.',
    },
    {
      question: 'Y a-t-il des frais cachés?',
      answer: 'Non, les tarifs affichés sont totaux. Vous voyez le prix exact avant de confirmer votre consultation.',
    },
    {
      question: 'Les étudiants ont-ils des réductions?',
      answer: 'Oui, contactez notre support pour les tarifs étudiants avec une preuve d\'inscription.',
    },
    {
      question: 'Puis-je obtenir un remboursement?',
      answer: 'Remboursement garanti si vous n\'êtes pas satisfait dans les 48 heures.',
    },
    {
      question: 'Les ordonnances ont-elles un coût supplémentaire?',
      answer: 'Non, les ordonnances numériques sont incluses dans le prix de la consultation.',
    },
    {
      question: 'Comment fonctionnent les tarifs de livraison?',
      answer: 'Les tarifs de livraison varient selon la zone et le type de livraison choisie.',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Tarifs accessibles
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Des consultations accessibles à tous les Tunisiens. Aucun abonnement requis.
            </p>
          </div>
        </section>

        {/* Consultation Pricing */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
                Consultations médicales
              </h2>
              <p className="text-muted-foreground text-center">
                Tarifs pour une consultation vidéo de 30 minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {doctorPricing.map((plan, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border-2 ${
                    plan.highlighted
                      ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 scale-105 shadow-xl'
                      : 'border-border'
                  } p-8 space-y-6 relative`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 right-8 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Populaire
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.title}
                    </h3>
                    <p className="text-muted-foreground">
                      À partir de
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">DT</span>
                    </div>
                  </div>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      plan.highlighted
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'border-2 border-primary text-primary hover:bg-primary/5'
                    }`}
                  >
                    Prendre rendez-vous
                  </button>

                  <div className="space-y-3 border-t border-border pt-6">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pharmacy Pricing */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-2 text-center">
                Livraison pharmacie
              </h2>
              <p className="text-muted-foreground text-center">
                Frais de livraison selon votre zone
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {pharmacyPricing.map((option, idx) => (
                <div key={idx} className="bg-card rounded-xl border border-border p-6 text-center space-y-4">
                  <p className="text-lg font-semibold text-foreground">{option.name}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-primary">
                      {option.price}
                    </span>
                    <span className="text-muted-foreground">DT</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {idx === 0
                      ? '24-48 heures'
                      : idx === 1
                      ? 'Livré aujourd\'hui'
                      : 'Prêt en 1h'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features & Payment */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">
                  Ce qui est inclus
                </h3>
                <div className="space-y-3">
                  {[
                    'Consultation vidéo avec médecin certifié',
                    'Ordonnance numérique',
                    'Accès au dossier médical',
                    'Support client 24/7',
                    'Paiement sécurisé',
                    'Garantie de remboursement 48h',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-foreground">
                  Moyens de paiement
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { icon: '💳', name: 'Flouci' },
                    { icon: '💰', name: 'Konnect' },
                    { icon: '🏦', name: 'Virement' },
                    { icon: '📦', name: 'Livraison' },
                  ].map((method, idx) => (
                    <div
                      key={idx}
                      className="bg-card rounded-lg border border-border p-4 text-center space-y-2"
                    >
                      <div className="text-2xl">{method.icon}</div>
                      <p className="font-medium text-foreground text-sm">{method.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Badge */}
        <section className="py-12 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <p className="flex items-center justify-center gap-3 text-lg font-semibold text-foreground flex-wrap">
              <span>💳</span>
              Paiement sécurisé Flouci & Konnect
              <span>🔄</span>
              Remboursement garanti
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Questions sur les tarifs
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details key={idx} className="group bg-card rounded-lg border border-border p-6 cursor-pointer">
                  <summary className="flex items-center justify-between font-semibold text-foreground hover:text-primary transition">
                    {faq.question}
                    <span className="transition group-open:rotate-180">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </span>
                  </summary>
                  <p className="text-muted-foreground mt-4 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Commencez aujourd'hui
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Accédez aux meilleurs médecins tunisiens sans engagement
            </p>
            <a
              href="/register"
              className="inline-block px-8 py-4 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition"
            >
              Créer mon compte gratuit
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
