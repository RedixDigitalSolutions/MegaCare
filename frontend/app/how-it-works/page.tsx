import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const teleConsultationSteps = [
    {
      number: 1,
      title: 'Créer votre compte',
      description: 'Inscrivez-vous gratuitement en 2 minutes',
    },
    {
      number: 2,
      title: 'Choisir un médecin',
      description: 'Consultez nos médecins spécialistes certifiés',
    },
    {
      number: 3,
      title: 'Prendre rendez-vous',
      description: 'Sélectionnez un créneau disponible',
    },
    {
      number: 4,
      title: 'Consulter en vidéo',
      description: 'Rejoignez la salle vidéo sécurisée',
    },
    {
      number: 5,
      title: 'Recevoir l\'ordonnance',
      description: 'Accédez directement à vos prescriptions',
    },
  ];

  const pharmacySteps = [
    {
      number: 1,
      title: 'Trouver un médicament',
      description: 'Recherchez dans la base de données complète',
    },
    {
      number: 2,
      title: 'Comparer les prix',
      description: 'Trouvez les meilleures offres proche de vous',
    },
    {
      number: 3,
      title: 'Commander',
      description: 'Panier sécurisé avec plusieurs paiements',
    },
    {
      number: 4,
      title: 'Livraison rapide',
      description: 'Reçu en 2-4 heures selon votre zone',
    },
  ];

  const faqs = [
    {
      question: 'La plateforme est-elle sécurisée?',
      answer: 'Oui, MegaCare utilise le chiffrement de bout en bout (E2E) pour toutes les consultations et données médicales, conformément à la législation tunisienne.',
    },
    {
      question: 'Comment sont les consultations vidéo?',
      answer: 'Les consultations se font en direct par vidéo haute définition. Vous recevrez un lien pour rejoindre la salle virtuelle 10 minutes avant votre rendez-vous.',
    },
    {
      question: 'Puis-je avoir une facture?',
      answer: 'Oui, une facture est générée automatiquement après chaque consultation ou commande et disponible dans votre compte.',
    },
    {
      question: 'Quels sont les modes de paiement?',
      answer: 'Nous acceptons Flouci, Konnect, virement bancaire et paiement à la livraison pour les commandes pharmacie.',
    },
    {
      question: 'Puis-je annuler mon rendez-vous?',
      answer: 'Oui, vous pouvez annuler jusqu\'à 24 heures avant la consultation sans frais.',
    },
    {
      question: 'Ma prescription est-elle valide 24/24?',
      answer: 'Oui, vos prescriptions numériques sont valides 24h/24 et peuvent être utilisées chez tout pharmacien partenaire.',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              Comment ça marche
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez comment utiliser MegaCare en 4 étapes simples
            </p>
          </div>
        </section>

        {/* Teleconsultation Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Téléconsultations médicales
              </h2>
              <p className="text-muted-foreground">
                Consultez un médecin spécialiste depuis chez vous en quelques minutes
              </p>
            </div>

            <div className="space-y-4">
              {teleConsultationSteps.map((step) => (
                <div key={step.number} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 bg-card rounded-lg border border-border p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pharmacy Section */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Pharmacie en ligne
              </h2>
              <p className="text-muted-foreground">
                Trouvez et commandez vos médicaments avec livraison rapide
              </p>
            </div>

            <div className="space-y-4">
              {pharmacySteps.map((step) => (
                <div key={step.number} className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent text-accent-foreground font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1 bg-card rounded-lg border border-border p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Sécurité et confidentialité
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <div className="text-4xl">🔒</div>
                <h3 className="text-xl font-semibold text-foreground">
                  Chiffrement E2E
                </h3>
                <p className="text-muted-foreground">
                  Toutes vos données sont chiffrées de bout en bout
                </p>
              </div>
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <div className="text-4xl">📋</div>
                <h3 className="text-xl font-semibold text-foreground">
                  Données conformes
                </h3>
                <p className="text-muted-foreground">
                  Conformité avec la loi organique n°2004-63 tunisienne
                </p>
              </div>
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <div className="text-4xl">✓</div>
                <h3 className="text-xl font-semibold text-foreground">
                  Médecins certifiés
                </h3>
                <p className="text-muted-foreground">
                  Tous nos médecins sont vérifiés et certifiés
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-secondary/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Questions fréquentes
            </h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-card rounded-lg border border-border p-6 cursor-pointer"
                >
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

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-primary to-primary/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Prêt à commencer?
            </h2>
            <p className="text-lg text-primary-foreground/90">
              Créez votre compte gratuit et accédez à des consultations médicales de qualité
            </p>
            <a
              href="/register"
              className="inline-block px-8 py-4 bg-primary-foreground text-primary rounded-lg font-semibold hover:opacity-90 transition"
            >
              S'inscrire gratuitement
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
