import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  User,
  Save,
  Check,
  Eye,
  EyeOff,
  Lock,
  MapPin,
  ExternalLink
} from "lucide-react";
import { GOVERNORATES, DELEGATIONS } from "@/lib/governorates";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const MAPS_URL_REGEX = /^https?:\/\/(maps\.google\.|goo\.gl\/maps|maps\.app\.goo\.gl|www\.google\.[a-z.]+\/maps)/i;
function ParamedicalSettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    specialization: user?.specialization ?? ""
  });
  const [location, setLocation] = useState({
    companyName: user?.companyName ?? "",
    address: user?.address ?? "",
    governorate: user?.governorate ?? "",
    delegation: user?.delegation ?? "",
    mapsUrl: user?.mapsUrl ?? ""
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: ""
  });
  const [showPwd, setShowPwd] = useState(false);
  const [toast, setToast] = useState("");
  const [pwdError, setPwdError] = useState("");
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };
  const handleProfileSave = async (e) => {
    e.preventDefault();
    const r = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify(profile)
    }).catch(() => null);
    if (r && r.ok) showToast("Profil mis a jour avec succes");
    else showToast("Erreur lors de la mise a jour du profil");
  };
  const handleLocationSave = async (e) => {
    e.preventDefault();
    if (location.mapsUrl && !MAPS_URL_REGEX.test(location.mapsUrl)) {
      showToast("URL Google Maps invalide");
      return;
    }
    const r = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify(location)
    }).catch(() => null);
    if (r && r.ok) showToast("Localisation mise \xE0 jour");
    else showToast("Erreur lors de la mise \xE0 jour");
  };
  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwdError("");
    if (!passwords.current) {
      setPwdError("Mot de passe actuel requis.");
      return;
    }
    if (passwords.next.length < 8) {
      setPwdError("Le nouveau mot de passe doit contenir au moins 8 caract\xE8res.");
      return;
    }
    if (passwords.next !== passwords.confirm) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    const r = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.next })
    }).catch(() => null);
    if (r && r.ok) {
      setPasswords({ current: "", next: "", confirm: "" });
      showToast("Mot de passe mis a jour");
    } else {
      setPwdError("Impossible de mettre a jour le mot de passe.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsx(ParamedicalDashboardSidebar, {}),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl font-bold text-foreground", children: "Param\xE8tres" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "G\xE9rez votre profil et pr\xE9f\xE9rences" })
      ] }),
      toast && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx(Check, { size: 15 }),
        toast
      ] }),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full", children: [
        /* @__PURE__ */ jsxs("section", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border", children: [
            /* @__PURE__ */ jsx(User, { size: 16, className: "text-primary" }),
            /* @__PURE__ */ jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Profil" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleProfileSave, className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0", children: [
                (profile.firstName[0] ?? "?").toUpperCase(),
                (profile.lastName[0] ?? "").toUpperCase()
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "font-semibold text-foreground text-sm", children: [
                  profile.firstName,
                  " ",
                  profile.lastName
                ] }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: user?.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Pr\xE9nom" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: profile.firstName,
                    onChange: (e) => setProfile({ ...profile, firstName: e.target.value }),
                    className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Nom" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: profile.lastName,
                    onChange: (e) => setProfile({ ...profile, lastName: e.target.value }),
                    className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "T\xE9l\xE9phone" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "tel",
                    value: profile.phone,
                    onChange: (e) => setProfile({ ...profile, phone: e.target.value }),
                    className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background",
                    placeholder: "+216 XX XXX XXX"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Sp\xE9cialisation" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: profile.specialization,
                    onChange: (e) => setProfile({ ...profile, specialization: e.target.value }),
                    className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "\u2014 Choisir \u2014" }),
                      [
                        "Infirmier(e)",
                        "Kin\xE9sith\xE9rapeute",
                        "Aide-soignant(e)",
                        "Sage-femme",
                        "Ergoth\xE9rapeute",
                        "Orthophoniste",
                        "Psychomotricien(ne)",
                        "Di\xE9t\xE9ticien(ne)",
                        "Autre param\xE9dical"
                      ].map((s) => /* @__PURE__ */ jsx("option", { value: s, children: s }, s))
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition", children: [
              /* @__PURE__ */ jsx(Save, { size: 14 }),
              "Enregistrer le profil"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-primary" }),
            /* @__PURE__ */ jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Localisation & Parapharmacie" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleLocationSave, className: "p-5 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Nom de la boutique / enseigne" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: location.companyName,
                  onChange: (e) => setLocation({ ...location, companyName: e.target.value }),
                  className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background",
                  placeholder: "Parapharmacie El Amal"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Adresse compl\xE8te" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: location.address,
                  onChange: (e) => setLocation({ ...location, address: e.target.value }),
                  className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background",
                  placeholder: "12 Rue de la R\xE9publique"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Gouvernorat" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: location.governorate,
                    onChange: (e) => setLocation({ ...location, governorate: e.target.value, delegation: "" }),
                    className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "S\xE9lectionner" }),
                      GOVERNORATES.map((g) => /* @__PURE__ */ jsx("option", { value: g, children: g }, g))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "D\xE9l\xE9gation" }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    value: location.delegation,
                    onChange: (e) => setLocation({ ...location, delegation: e.target.value }),
                    disabled: !location.governorate,
                    className: "w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background disabled:opacity-50",
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "", children: "S\xE9lectionner" }),
                      (DELEGATIONS[location.governorate] ?? []).map((d) => /* @__PURE__ */ jsx("option", { value: d, children: d }, d))
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5 flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(ExternalLink, { size: 11 }),
                "Lien Google Maps"
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "url",
                  value: location.mapsUrl,
                  onChange: (e) => setLocation({ ...location, mapsUrl: e.target.value }),
                  className: `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 bg-background ${location.mapsUrl && !MAPS_URL_REGEX.test(location.mapsUrl) ? "border-red-400 focus:ring-red-400" : "border-border focus:ring-primary/40"}`,
                  placeholder: "https://maps.google.com/..."
                }
              ),
              location.mapsUrl && !MAPS_URL_REGEX.test(location.mapsUrl) && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-500 mt-1", children: "URL invalide. Utilisez un lien Google Maps" }),
              location.mapsUrl && MAPS_URL_REGEX.test(location.mapsUrl) && /* @__PURE__ */ jsxs("a", { href: location.mapsUrl, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1", children: [
                /* @__PURE__ */ jsx(MapPin, { size: 11 }),
                " Aper\xE7u \u2014 Ouvrir dans Google Maps"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition", children: [
              /* @__PURE__ */ jsx(Save, { size: 14 }),
              "Enregistrer la localisation"
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-4 border-b border-border", children: [
            /* @__PURE__ */ jsx(Lock, { size: 16, className: "text-primary" }),
            /* @__PURE__ */ jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Mot de passe" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handlePasswordSave, className: "p-5 space-y-4", children: [
            ["current", "next", "confirm"].map((field, i) => /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: field === "current" ? "Mot de passe actuel" : field === "next" ? "Nouveau mot de passe" : "Confirmer le nouveau" }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: showPwd ? "text" : "password",
                    value: passwords[field],
                    onChange: (e) => setPasswords({ ...passwords, [field]: e.target.value }),
                    className: "w-full pl-3 pr-10 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background",
                    placeholder: field === "current" ? "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" : field === "next" ? "Minimum 8 caract\xE8res" : "R\xE9p\xE9ter le mot de passe"
                  }
                ),
                i === 0 && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPwd((v) => !v),
                    className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition",
                    children: showPwd ? /* @__PURE__ */ jsx(EyeOff, { size: 15 }) : /* @__PURE__ */ jsx(Eye, { size: 15 })
                  }
                )
              ] })
            ] }, field)),
            pwdError && /* @__PURE__ */ jsx("p", { className: "text-xs text-red-600", children: pwdError }),
            /* @__PURE__ */ jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxs("button", { type: "submit", className: "flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition", children: [
              /* @__PURE__ */ jsx(Save, { size: 14 }),
              "Mettre \xE0 jour"
            ] }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  ParamedicalSettingsPage as default
};
