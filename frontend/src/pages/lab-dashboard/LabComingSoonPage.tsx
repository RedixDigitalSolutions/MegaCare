import { useLocation } from "react-router-dom";
import { LabDashboardSidebar } from "@/components/LabDashboardSidebar";
import { Clock, Sparkles } from "lucide-react";

const LABEL_MAP: Record<string, string> = {
  "/lab-dashboard/imaging": "Imagerie",
  "/lab-dashboard/patients": "Patients",
  "/lab-dashboard/appointments": "Rendez-vous",
  "/lab-dashboard/billing": "Facturation",
  "/lab-dashboard/messaging": "Messagerie",
  "/lab-dashboard/analytics": "Statistiques",
  "/lab-dashboard/settings": "Paramètres",
};

export default function LabComingSoonPage() {
  const { pathname } = useLocation();
  const featureName = LABEL_MAP[pathname] ?? "cette fonctionnalité";

  return (
    <div className="min-h-screen bg-background flex">
      <LabDashboardSidebar />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md space-y-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Clock size={36} className="text-primary" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Sparkles size={12} />
              Bientôt disponible
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">{featureName}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Cette fonctionnalité est en cours de développement et sera disponible très prochainement.
              Revenez bientôt !
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
