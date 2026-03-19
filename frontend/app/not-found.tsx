import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-20 pt-24">
        <div className="max-w-md text-center space-y-6">
          {/* Illustration */}
          <div className="text-8xl mb-6">🔍</div>

          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              Oups! Page non trouvée
            </h1>
            <p className="text-lg text-muted-foreground">
              Cette page est en consultation... Elle semblerait avoir disparu du système.
            </p>
          </div>

          {/* Funny Message */}
          <p className="text-sm text-muted-foreground italic bg-secondary/30 rounded-lg p-4">
            "Le Dr. Malade diagnostique: 404 - Page perdue en circulation"
          </p>

          {/* Primary Action */}
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition"
          >
            Retour à l'accueil
          </Link>

          {/* Quick Links */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <Link
              href="/doctors"
              className="py-2 text-primary hover:underline text-sm font-medium"
            >
              👨‍⚕️ Médecins
            </Link>
            <Link
              href="/pharmacy"
              className="py-2 text-primary hover:underline text-sm font-medium"
            >
              💊 Pharmacie
            </Link>
            <Link
              href="/dashboard"
              className="py-2 text-primary hover:underline text-sm font-medium"
            >
              📋 Mon compte
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
