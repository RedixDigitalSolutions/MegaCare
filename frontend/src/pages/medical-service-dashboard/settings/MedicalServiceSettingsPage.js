import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Building2, Shield, Save, Eye, EyeOff, AlertTriangle } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const emptyService = { name: "", address: "", phone: "", email: "", director: "", capacity: "", type: "" };
function MedicalServiceSettingsPage() {
  const [service, setService] = useState(emptyService);
  const [editingService, setEditingService] = useState(false);
  const [serviceForm, setServiceForm] = useState(emptyService);
  useEffect(() => {
    fetch("/api/medical-service/settings", { headers: { Authorization: `Bearer ${tok()}` } }).then((r) => r.json()).then((d) => {
      if (d) {
        setService({ name: d.name || "", address: d.address || "", phone: d.phone || "", email: d.email || "", director: d.director || "", capacity: String(d.capacity || ""), type: d.serviceType || "" });
      }
    }).catch(() => {
    });
  }, []);
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  async function saveService() {
    await fetch("/api/medical-service/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ address: serviceForm.address, director: serviceForm.director, capacity: serviceForm.capacity, serviceType: serviceForm.type })
    }).catch(() => {
    });
    setService(serviceForm);
    setEditingService(false);
    flash("Informations du service enregistr\xE9es.");
  }
  async function savePassword() {
    if (!pwForm.current || !pwForm.next) return;
    if (pwForm.next !== pwForm.confirm) {
      flash("Les mots de passe ne correspondent pas.");
      return;
    }
    const r = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next })
    }).catch(() => null);
    if (r && r.ok) {
      setPwForm({ current: "", next: "", confirm: "" });
      flash("Mot de passe mis \xE0 jour.");
    } else {
      flash("Erreur lors de la mise \xE0 jour du mot de passe.");
    }
  }
  function flash(msg) {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(""), 3e3);
  }
  const serviceFields = [
    { label: "Nom du service", key: "name", type: "text" },
    { label: "Adresse", key: "address", type: "text" },
    { label: "T\xE9l\xE9phone", key: "phone", type: "tel" },
    { label: "Email", key: "email", type: "email" },
    { label: "Directeur / Responsable", key: "director", type: "text" },
    { label: "Capacit\xE9 (patients simultan\xE9s)", key: "capacity", type: "number" },
    { label: "Type de service", key: "type", type: "text" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(MedicalServiceDashboardSidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-foreground", children: "Param\xE8tres" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Configuration du service m\xE9dical" })
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl", children: [
        savedMsg && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium", children: [
          /* @__PURE__ */ jsx(Save, { size: 15 }),
          savedMsg
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Building2, { size: 18, className: "text-primary" }),
              /* @__PURE__ */ jsx("h2", { className: "font-semibold text-foreground", children: "Informations du service" })
            ] }),
            !editingService && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => {
                  setServiceForm(service);
                  setEditingService(true);
                },
                className: "text-sm text-primary hover:underline font-medium",
                children: "Modifier"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-5", children: editingService ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: serviceFields.map((f) => /* @__PURE__ */ jsxs("div", { className: f.key === "name" || f.key === "address" ? "sm:col-span-2" : "", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1", children: f.label }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: f.type,
                  value: serviceForm[f.key],
                  onChange: (e) => setServiceForm((prev) => ({ ...prev, [f.key]: e.target.value })),
                  className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                }
              )
            ] }, f.key)) }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
              /* @__PURE__ */ jsx("button", { onClick: () => setEditingService(false), className: "px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition", children: "Annuler" }),
              /* @__PURE__ */ jsxs("button", { onClick: saveService, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Save, { size: 14 }),
                "Enregistrer"
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: serviceFields.map((f) => /* @__PURE__ */ jsxs("div", { className: f.key === "name" || f.key === "address" ? "sm:col-span-2" : "", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: f.label }),
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground mt-0.5", children: service[f.key] })
          ] }, f.key)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border", children: [
            /* @__PURE__ */ jsx(Shield, { size: 18, className: "text-primary" }),
            /* @__PURE__ */ jsx("h2", { className: "font-semibold text-foreground", children: "S\xE9curit\xE9" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Changer le mot de passe" }),
              [
                { label: "Mot de passe actuel", key: "current" },
                { label: "Nouveau mot de passe", key: "next" },
                { label: "Confirmer le nouveau mot de passe", key: "confirm" }
              ].map((f) => /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs text-muted-foreground block mb-1", children: f.label }),
                /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: showPw ? "text" : "password",
                      value: pwForm[f.key],
                      onChange: (e) => setPwForm((prev) => ({ ...prev, [f.key]: e.target.value })),
                      className: "w-full border border-border rounded-lg px-3 py-2 pr-10 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPw((p) => !p),
                      className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition",
                      children: showPw ? /* @__PURE__ */ jsx(EyeOff, { size: 15 }) : /* @__PURE__ */ jsx(Eye, { size: 15 })
                    }
                  )
                ] })
              ] }, f.key)),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: savePassword,
                  className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsx(Save, { size: 14 }),
                    "Mettre \xE0 jour"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsx("hr", { className: "border-border" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-foreground", children: "Double authentification (2FA)" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Renforcer la s\xE9curit\xE9 de votre compte" })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setTwoFA((p) => !p),
                  className: `relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${twoFA ? "bg-primary" : "bg-muted"}`,
                  children: /* @__PURE__ */ jsx("span", { className: `inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${twoFA ? "translate-x-4 ml-0.5" : "translate-x-0.5"}` })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("hr", { className: "border-border" }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-red-200 bg-red-50/30 p-4 space-y-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-red-600", children: [
                /* @__PURE__ */ jsx(AlertTriangle, { size: 16 }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-semibold", children: "Zone de danger" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600/70", children: "La suppression du compte est irr\xE9versible. Toutes les donn\xE9es seront perdues." }),
              /* @__PURE__ */ jsx("button", { className: "px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-100 transition font-medium", children: "Supprimer le compte" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  MedicalServiceSettingsPage as default
};
