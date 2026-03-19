"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Video, Download, MessageSquare } from "lucide-react";
import { useEffect } from "react";

export default function ConsultationsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const consultations = [
    {
      id: 1,
      doctor: "Dr. Amira Mansouri",
      specialty: "Cardiologie",
      date: "1 Mars 2025",
      duration: "15 minutes",
      diagnosis: "Consultation générale - Suivi cardiaque",
      notes: "Patient en bonne santé, continuer suivi",
      hasRecording: true,
    },
    {
      id: 2,
      doctor: "Dr. Hedi Ben Ali",
      specialty: "Généraliste",
      date: "22 Février 2025",
      duration: "20 minutes",
      diagnosis: "Consultation générale",
      notes: "Ordonnance fournie",
      hasRecording: true,
    },
    {
      id: 3,
      doctor: "Dr. Leïla Khaled",
      specialty: "Psychologie",
      date: "15 Février 2025",
      duration: "45 minutes",
      diagnosis: "Consultation psychologique",
      notes: "Session productive",
      hasRecording: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar userName={user.firstName} />

        <main className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Mes consultations
              </h1>
              <p className="text-muted-foreground mt-2">
                Historique de vos consultations médicales
              </p>
            </div>

            <div className="space-y-4">
              {consultations.map((cons) => (
                <div
                  key={cons.id}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {cons.doctor}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {cons.specialty}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                        {cons.date}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Diagnostic
                        </p>
                        <p className="text-foreground">{cons.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Durée
                        </p>
                        <p className="text-foreground">{cons.duration}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Notes du médecin
                      </p>
                      <p className="text-foreground">{cons.notes}</p>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {cons.hasRecording && (
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center gap-2">
                          <Video size={18} />
                          Voir l'enregistrement
                        </button>
                      )}
                      <button className="px-4 py-2 border border-border hover:bg-muted rounded-lg transition flex items-center gap-2">
                        <Download size={18} />
                        Télécharger rapport
                      </button>
                      <button className="px-4 py-2 border border-border hover:bg-muted rounded-lg transition flex items-center gap-2">
                        <MessageSquare size={18} />
                        Contacter le médecin
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
