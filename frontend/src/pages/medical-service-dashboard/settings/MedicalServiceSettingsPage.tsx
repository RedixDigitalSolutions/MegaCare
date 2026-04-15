import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Building2, Bell, Shield, Save, Eye, EyeOff, AlertTriangle } from "lucide-react";

interface ServiceInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  director: string;
  capacity: string;
  type: string;
}

interface Notifs {
  newPatient: boolean;
  vitalAlert: boolean;
  appointmentReminder: boolean;
  teamMessage: boolean;
  billing: boolean;
  maintenance: boolean;
}

const tok = () => localStorage.getItem("megacare_token") ?? "";

const emptyService: ServiceInfo = { name: "", address: "", phone: "", email: "", director: "", capacity: "", type: "" };

export default function MedicalServiceSettingsPage() {
  const [service, setService] = useState<ServiceInfo>(emptyService);
  const [editingService, setEditingService] = useState(false);
  const [serviceForm, setServiceForm] = useState<ServiceInfo>(emptyService);

  const [notifs, setNotifs] = useState<Notifs>({
    newPatient: true,
    vitalAlert: true,
    appointmentReminder: true,
    teamMessage: false,
    billing: true,
    maintenance: false,
  });

  useEffect(() => {
    fetch("/api/medical-service/settings", { headers: { Authorization: `Bearer ${tok()}` } })
      .then(r => r.json())
      .then(d => {
        if (d) {
          setService({ name: d.name || "", address: d.address || "", phone: d.phone || "", email: d.email || "", director: d.director || "", capacity: String(d.capacity || ""), type: d.serviceType || "" });
          if (d.notifs) setNotifs(d.notifs);
        }
      })
      .catch(() => { });
  }, []);

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  async function saveService() {
    await fetch("/api/medical-service/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ address: serviceForm.address, director: serviceForm.director, capacity: serviceForm.capacity, serviceType: serviceForm.type, notifs }),
    }).catch(() => { });
    setService(serviceForm);
    setEditingService(false);
    flash("Informations du service enregistrées.");
  }

  async function savePassword() {
    if (!pwForm.current || !pwForm.next) return;
    if (pwForm.next !== pwForm.confirm) { flash("Les mots de passe ne correspondent pas."); return; }
    const r = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
    }).catch(() => null);
    if (r && r.ok) { setPwForm({ current: "", next: "", confirm: "" }); flash("Mot de passe mis à jour."); }
    else { flash("Erreur lors de la mise à jour du mot de passe."); }
  }

  function flash(msg: string) {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 3000);
  }

  const notifLabels: { key: keyof Notifs; label: string; desc: string }[] = [
    { key: "newPatient", label: "Nouveau patient", desc: "Notification lors de l'ajout d'un nouveau patient" },
    { key: "vitalAlert", label: "Alerte constantes vitales", desc: "Alerte quand une constante est critique" },
    { key: "appointmentReminder", label: "Rappel visite", desc: "Rappel 1h avant une visite planifiée" },
    { key: "teamMessage", label: "Messagerie équipe", desc: "Notifications de nouveaux messages de l'équipe" },
    { key: "billing", label: "Facturation", desc: "Alertes sur les paiements en retard" },
    { key: "maintenance", label: "Maintenance équipement", desc: "Rappels pour les maintenances d'équipements" },
  ];

  const serviceFields: { label: string; key: keyof ServiceInfo; type: string }[] = [
    { label: "Nom du service", key: "name", type: "text" },
    { label: "Adresse", key: "address", type: "text" },
    { label: "Téléphone", key: "phone", type: "tel" },
    { label: "Email", key: "email", type: "email" },
    { label: "Directeur / Responsable", key: "director", type: "text" },
    { label: "Capacité (patients simultanés)", key: "capacity", type: "number" },
    { label: "Type de service", key: "type", type: "text" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Paramètres</h1>
          <p className="text-xs text-muted-foreground">Configuration du service médical</p>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl">
          {/* Saved toast */}
          {savedMsg && (
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
              <Save size={15} />{savedMsg}
            </div>
          )}

          {/* Service info */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-primary" />
                <h2 className="font-semibold text-foreground">Informations du service</h2>
              </div>
              {!editingService && (
                <button onClick={() => { setServiceForm(service); setEditingService(true); }}
                  className="text-sm text-primary hover:underline font-medium">Modifier</button>
              )}
            </div>
            <div className="p-5">
              {editingService ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {serviceFields.map((f) => (
                      <div key={f.key} className={f.key === "name" || f.key === "address" ? "sm:col-span-2" : ""}>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">{f.label}</label>
                        <input type={f.type} value={serviceForm[f.key]}
                          onChange={(e) => setServiceForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                          className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setEditingService(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition">Annuler</button>
                    <button onClick={saveService} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium flex items-center gap-2">
                      <Save size={14} />Enregistrer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {serviceFields.map((f) => (
                    <div key={f.key} className={f.key === "name" || f.key === "address" ? "sm:col-span-2" : ""}>
                      <p className="text-xs text-muted-foreground">{f.label}</p>
                      <p className="text-sm font-medium text-foreground mt-0.5">{service[f.key]}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Bell size={18} className="text-primary" />
              <h2 className="font-semibold text-foreground">Notifications</h2>
            </div>
            <div className="divide-y divide-border">
              {notifLabels.map((n) => (
                <div key={n.key} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{n.label}</p>
                    <p className="text-xs text-muted-foreground">{n.desc}</p>
                  </div>
                  <button onClick={() => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))}
                    className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${notifs[n.key] ? "bg-primary" : "bg-muted"}`}>
                    <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${notifs[n.key] ? "translate-x-4 ml-0.5" : "translate-x-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Shield size={18} className="text-primary" />
              <h2 className="font-semibold text-foreground">Sécurité</h2>
            </div>
            <div className="p-5 space-y-5">
              {/* Change password */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Changer le mot de passe</p>
                {[
                  { label: "Mot de passe actuel", key: "current" as const },
                  { label: "Nouveau mot de passe", key: "next" as const },
                  { label: "Confirmer le nouveau mot de passe", key: "confirm" as const },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="text-xs text-muted-foreground block mb-1">{f.label}</label>
                    <div className="relative">
                      <input type={showPw ? "text" : "password"} value={pwForm[f.key]}
                        onChange={(e) => setPwForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full border border-border rounded-lg px-3 py-2 pr-10 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                      <button type="button" onClick={() => setShowPw((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                ))}
                <button onClick={savePassword}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium flex items-center gap-2">
                  <Save size={14} />Mettre à jour
                </button>
              </div>

              <hr className="border-border" />

              {/* 2FA */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Double authentification (2FA)</p>
                  <p className="text-xs text-muted-foreground">Renforcer la sécurité de votre compte</p>
                </div>
                <button onClick={() => setTwoFA((p) => !p)}
                  className={`relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${twoFA ? "bg-primary" : "bg-muted"}`}>
                  <span className={`inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${twoFA ? "translate-x-4 ml-0.5" : "translate-x-0.5"}`} />
                </button>
              </div>

              <hr className="border-border" />

              {/* Danger zone */}
              <div className="rounded-xl border border-red-200 bg-red-50/30 p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle size={16} />
                  <p className="text-sm font-semibold">Zone de danger</p>
                </div>
                <p className="text-xs text-red-600/70">La suppression du compte est irréversible. Toutes les données seront perdues.</p>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-100 transition font-medium">
                  Supprimer le compte
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
