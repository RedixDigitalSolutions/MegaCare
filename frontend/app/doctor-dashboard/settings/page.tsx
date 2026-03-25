"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { LogOut, Save, Link2, Upload, X, User } from "lucide-react";

export default function DoctorSettingsPage() {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [imageMode, setImageMode] = useState<"idle" | "url">("idle");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setProfileImageUrl(urlInput.trim());
      setImageMode("idle");
      setUrlInput("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setProfileImageUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
        />

        <main className="flex-1">
          <div className="bg-card border-b border-border p-6 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Paramètres
                </h1>
                <p className="text-muted-foreground mt-1">
                  Gérez votre profil et préférences
                </p>
              </div>
              <button
                onClick={logout}
                className="px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2"
              >
                <LogOut size={18} />
                Déconnexion
              </button>
            </div>
          </div>

          <div className="p-6 max-w-2xl">
            <div className="bg-card rounded-xl border border-border p-8 space-y-8">
              {/* Profile Section */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Profil
                </h2>
                <div className="space-y-4">
                  {/* Photo de profil */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Photo de profil
                    </label>
                    <div className="flex items-start gap-4">
                      {/* Preview */}
                      <div className="w-20 h-20 rounded-xl border-2 border-border overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                        {profileImageUrl ? (
                          <img
                            src={profileImageUrl}
                            alt="Photo profil"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={32} className="text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        {/* Buttons */}
                        <div className="flex gap-2 flex-wrap">
                          <button
                            onClick={() =>
                              setImageMode(imageMode === "url" ? "idle" : "url")
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-secondary transition font-medium"
                          >
                            <Link2 size={14} /> Lien URL
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-sm hover:bg-secondary transition font-medium"
                          >
                            <Upload size={14} /> Télécharger
                          </button>
                          {profileImageUrl && (
                            <button
                              onClick={() => setProfileImageUrl("")}
                              className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition font-medium"
                            >
                              <X size={14} /> Supprimer
                            </button>
                          )}
                        </div>

                        {/* URL input */}
                        {imageMode === "url" && (
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleUrlSubmit();
                                if (e.key === "Escape") setImageMode("idle");
                              }}
                              placeholder="https://exemple.com/photo.jpg"
                              className="flex-1 px-3 py-1.5 border border-border rounded-lg bg-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              autoFocus
                            />
                            <button
                              onClick={handleUrlSubmit}
                              className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium"
                            >
                              OK
                            </button>
                          </div>
                        )}

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG ou WebP. Cette photo sera affichée sur votre
                          profil public.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border" />
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={user.firstName}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={user.lastName}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Spécialité
                    </label>
                    <input
                      type="text"
                      value={user.specialization}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Numéro de licence
                    </label>
                    <input
                      type="text"
                      value={user.doctorId}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications Section */}
              <div className="border-t border-border pt-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Notifications
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-foreground">
                      Notifications pour nouveaux RDV
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-foreground">Rappels d'agenda</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-foreground">
                      Avis de nouveaux avis patients
                    </span>
                  </label>
                </div>
              </div>

              {/* Security Section */}
              <div className="border-t border-border pt-8">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Sécurité
                </h2>
                <button className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition font-medium">
                  Changer le mot de passe
                </button>
              </div>

              {/* Save Button */}
              <button className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-medium flex items-center justify-center gap-2">
                <Save size={20} />
                Enregistrer les modifications
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
