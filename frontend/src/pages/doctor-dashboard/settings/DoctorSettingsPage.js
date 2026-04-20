import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import {
  Save,
  Link2,
  X,
  User,
  CheckCircle,
  Shield,
  Loader2,
  AlertCircle,
  Phone,
  Eye,
  EyeOff,
  Mail,
  Stethoscope,
  BadgeCheck,
  Camera,
  KeyRound
} from "lucide-react";
function DoctorSettingsPage() {
  const { user, isLoading, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [imageMode, setImageMode] = useState("idle");
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseId, setLicenseId] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwChanging, setPwChanging] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setEmail(user.email ?? "");
      setPhone(user.phone ?? "");
      setSpecialty(user.specialization ?? "");
      setLicenseId(user.doctorId ?? "");
      if (user.avatar) setProfileImageUrl(user.avatar);
      const token = localStorage.getItem("megacare_token");
      if (token && !user.avatar) {
        fetch("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` }
        }).then((r) => r.ok ? r.json() : null).then((data) => {
          if (data?.user?.avatar) {
            setProfileImageUrl(data.user.avatar);
          }
        }).catch(() => {
        });
      }
    }
  }, [user]);
  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setProfileImageUrl(urlInput.trim());
      setImageMode("idle");
      setUrlInput("");
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setProfileImageUrl(ev.target.result);
    };
    reader.readAsDataURL(file);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          specialization: specialty,
          avatar: profileImageUrl || void 0
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveError(data.message || "Erreur lors de la sauvegarde");
        return;
      }
      updateUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3e3);
    } catch {
      setSaveError("Impossible de contacter le serveur");
    } finally {
      setSaving(false);
    }
  };
  const handlePasswordChange = async () => {
    setPwError("");
    if (!currentPassword || !newPassword) {
      setPwError("Tous les champs sont requis");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("Le nouveau mot de passe doit contenir au moins 8 caract\xE8res");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("Les mots de passe ne correspondent pas");
      return;
    }
    setPwChanging(true);
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setPwError(data.message || "Erreur lors du changement");
        return;
      }
      setPwSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPwSuccess(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch {
      setPwError("Impossible de contacter le serveur");
    } finally {
      setPwChanging(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row", children: [
      /* @__PURE__ */ jsx(
        DoctorDashboardSidebar,
        {
          doctorName: user.firstName || "Amira Mansouri"
        }
      ),
      /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-auto", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-card border-b border-border px-6 lg:px-10 py-6 sticky top-0 z-10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Param\xE8tres" }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-1", children: "G\xE9rez votre profil, notifications et s\xE9curit\xE9" })
        ] }) }),
        saved && /* @__PURE__ */ jsxs("div", { className: "fixed top-6 right-6 z-50 flex items-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2", children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
          "Modifications enregistr\xE9es avec succ\xE8s"
        ] }),
        saveError && /* @__PURE__ */ jsxs("div", { className: "fixed top-6 right-6 z-50 flex items-center gap-2 bg-red-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-in slide-in-from-top-2", children: [
          /* @__PURE__ */ jsx(AlertCircle, { size: 16 }),
          saveError,
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSaveError(""),
              className: "ml-2 hover:text-red-200",
              children: /* @__PURE__ */ jsx(X, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "px-6 lg:px-10 py-8", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSave, className: "max-w-5xl space-y-8", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-primary/5 via-primary/3 to-transparent rounded-2xl border border-border p-6 lg:p-8", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
              /* @__PURE__ */ jsx("div", { className: "w-24 h-24 rounded-2xl border-2 border-primary/20 overflow-hidden bg-muted flex items-center justify-center shrink-0 shadow-sm", children: profileImageUrl ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: profileImageUrl,
                  alt: "Photo profil",
                  className: "w-full h-full object-cover"
                }
              ) : /* @__PURE__ */ jsxs("span", { className: "text-3xl font-bold text-primary/60", children: [
                firstName?.[0],
                lastName?.[0]
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setImageMode(imageMode === "url" ? "idle" : "url"),
                    className: "p-1.5 bg-white/90 rounded-lg hover:bg-white transition",
                    title: "Ajouter par URL",
                    children: /* @__PURE__ */ jsx(Link2, { size: 14, className: "text-gray-700" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => fileInputRef.current?.click(),
                    className: "p-1.5 bg-white/90 rounded-lg hover:bg-white transition",
                    title: "T\xE9l\xE9charger",
                    children: /* @__PURE__ */ jsx(Camera, { size: 14, className: "text-gray-700" })
                  }
                ),
                profileImageUrl && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setProfileImageUrl(""),
                    className: "p-1.5 bg-red-100 rounded-lg hover:bg-red-200 transition",
                    title: "Supprimer",
                    children: /* @__PURE__ */ jsx(X, { size: 14, className: "text-red-600" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxs("h2", { className: "text-xl font-bold text-foreground", children: [
                "Dr. ",
                firstName,
                " ",
                lastName
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground mt-0.5", children: [
                specialty || "Sp\xE9cialit\xE9 non d\xE9finie",
                " \xB7",
                " ",
                licenseId || "\u2014"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: email }),
              imageMode === "url" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2 mt-3 max-w-md", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "url",
                    value: urlInput,
                    onChange: (e) => setUrlInput(e.target.value),
                    onKeyDown: (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleUrlSubmit();
                      }
                      if (e.key === "Escape") setImageMode("idle");
                    },
                    placeholder: "https://exemple.com/photo.jpg",
                    className: "flex-1 px-3 py-1.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30",
                    autoFocus: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: handleUrlSubmit,
                    className: "px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium",
                    children: "OK"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setImageMode("idle"),
                    className: "px-2 py-1.5 text-muted-foreground hover:text-foreground",
                    children: /* @__PURE__ */ jsx(X, { size: 14 })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                onChange: handleFileChange,
                className: "hidden"
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 pb-3 border-b border-border", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsx(User, { size: 18, className: "text-primary" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-foreground", children: "Informations personnelles" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Nom, email et coordonn\xE9es" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground", children: "Pr\xE9nom" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: firstName,
                      onChange: (e) => setFirstName(e.target.value),
                      placeholder: "Pr\xE9nom",
                      className: "w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground", children: "Nom" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: lastName,
                      onChange: (e) => setLastName(e.target.value),
                      placeholder: "Nom de famille",
                      className: "w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm font-medium text-foreground", children: [
                  /* @__PURE__ */ jsx(Mail, { size: 14, className: "text-muted-foreground" }),
                  " Email"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    placeholder: "email@exemple.com",
                    className: "w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm font-medium text-foreground", children: [
                  /* @__PURE__ */ jsx(Phone, { size: 14, className: "text-muted-foreground" }),
                  " ",
                  "T\xE9l\xE9phone"
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "tel",
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    placeholder: "06 12 34 56 78",
                    className: "w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 space-y-5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 pb-3 border-b border-border", children: [
                /* @__PURE__ */ jsx("div", { className: "p-2 bg-primary/10 rounded-lg", children: /* @__PURE__ */ jsx(Stethoscope, { size: 18, className: "text-primary" }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-foreground", children: "Informations professionnelles" }),
                  /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sp\xE9cialit\xE9 et identifiants" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground", children: "Sp\xE9cialit\xE9" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: specialty,
                    onChange: (e) => setSpecialty(e.target.value),
                    placeholder: "ex. Cardiologie",
                    className: "w-full px-4 py-2.5 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm transition"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-1.5 text-sm font-medium text-foreground", children: [
                  /* @__PURE__ */ jsx(BadgeCheck, { size: 14, className: "text-muted-foreground" }),
                  "Num\xE9ro de licence",
                  /* @__PURE__ */ jsx("span", { className: "ml-1 text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded", children: "lecture seule" })
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    value: licenseId,
                    readOnly: true,
                    className: "w-full px-4 py-2.5 border border-border rounded-xl bg-muted text-muted-foreground text-sm cursor-not-allowed"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-2xl border border-border p-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5 pb-3 border-b border-border", children: [
              /* @__PURE__ */ jsx("div", { className: "p-2 bg-red-500/10 rounded-lg", children: /* @__PURE__ */ jsx(Shield, { size: 18, className: "text-red-600" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h2", { className: "text-base font-bold text-foreground", children: "S\xE9curit\xE9" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Prot\xE9gez votre compte" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3 px-2 rounded-xl hover:bg-muted/50 transition", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground block", children: "Mot de passe" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Derni\xE8re modification inconnue" })
                ] }),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setShowPasswordModal(true);
                      setPwError("");
                      setPwSuccess(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    },
                    className: "flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-xl hover:bg-muted-foreground/10 transition text-sm font-medium",
                    children: [
                      /* @__PURE__ */ jsx(KeyRound, { size: 14 }),
                      "Modifier"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-3 px-2 rounded-xl", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground block", children: "Authentification \xE0 deux facteurs" }),
                  /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground", children: "Non configur\xE9e" })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-lg font-medium", children: "Bient\xF4t" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-2 pb-6", children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: saving,
              className: "flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md",
              children: [
                saving ? /* @__PURE__ */ jsx(Loader2, { size: 17, className: "animate-spin" }) : /* @__PURE__ */ jsx(Save, { size: 17 }),
                saving ? "Enregistrement\u2026" : "Enregistrer les modifications"
              ]
            }
          ) })
        ] }) })
      ] })
    ] }),
    showPasswordModal && /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50",
        onClick: () => setShowPasswordModal(false),
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 space-y-5 animate-in fade-in zoom-in-95",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-foreground flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(Shield, { size: 18, className: "text-primary" }),
                  "Changer le mot de passe"
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setShowPasswordModal(false),
                    className: "text-muted-foreground hover:text-foreground",
                    children: /* @__PURE__ */ jsx(X, { size: 18 })
                  }
                )
              ] }),
              pwSuccess ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 py-6", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 48, className: "text-green-500" }),
                /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-green-600", children: "Mot de passe modifi\xE9 avec succ\xE8s" })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                pwError && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2", children: [
                  /* @__PURE__ */ jsx(AlertCircle, { size: 14 }),
                  pwError
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground", children: "Mot de passe actuel" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: showCurrentPw ? "text" : "password",
                          value: currentPassword,
                          onChange: (e) => setCurrentPassword(e.target.value),
                          className: "w-full px-4 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm",
                          autoFocus: true
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setShowCurrentPw(!showCurrentPw),
                          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                          children: showCurrentPw ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground", children: "Nouveau mot de passe" }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: showNewPw ? "text" : "password",
                          value: newPassword,
                          onChange: (e) => setNewPassword(e.target.value),
                          className: "w-full px-4 py-2.5 pr-10 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setShowNewPw(!showNewPw),
                          className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
                          children: showNewPw ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Minimum 8 caract\xE8res" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground", children: "Confirmer le nouveau mot de passe" }),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "password",
                        value: confirmPassword,
                        onChange: (e) => setConfirmPassword(e.target.value),
                        className: "w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-2", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setShowPasswordModal(false),
                      className: "flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition text-sm font-medium",
                      children: "Annuler"
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: handlePasswordChange,
                      disabled: pwChanging,
                      className: "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium disabled:opacity-60",
                      children: [
                        pwChanging && /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }),
                        pwChanging ? "Changement\u2026" : "Confirmer"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          }
        )
      }
    )
  ] });
}
export {
  DoctorSettingsPage as default
};
