import { jsx, jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import {
  Lock,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useEffect, useState } from "react";
function SettingsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, navigate]);
  if (isLoading || !isAuthenticated || !user) {
    return null;
  }
  const handleChangePassword = async () => {
    setPwMsg(null);
    if (newPassword.length < 6) {
      setPwMsg({
        type: "error",
        text: "Le nouveau mot de passe doit contenir au moins 6 caract\xE8res"
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwMsg({
        type: "error",
        text: "Les mots de passe ne correspondent pas"
      });
      return;
    }
    setPwSaving(true);
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
      if (!res.ok) throw new Error(data.message || "Erreur lors du changement");
      setPwMsg({ type: "success", text: "Mot de passe modifi\xE9 avec succ\xE8s" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    } catch (err) {
      setPwMsg({ type: "error", text: err.message });
    } finally {
      setPwSaving(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row", children: [
    /* @__PURE__ */ jsx(DashboardSidebar, { userName: user.firstName }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6 max-w-2xl", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Param\xE8tres" }),
        /* @__PURE__ */ jsx("p", { className: "text-muted-foreground mt-2", children: "G\xE9rez vos pr\xE9f\xE9rences et informations personnelles" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Lock, { size: 24, className: "text-primary" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: "S\xE9curit\xE9" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setShowPasswordForm(!showPasswordForm);
                setPwMsg(null);
              },
              className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground",
              children: "Changer le mot de passe"
            }
          ),
          showPasswordForm && /* @__PURE__ */ jsxs("div", { className: "space-y-4 p-4 bg-muted/50 rounded-lg border border-border", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Mot de passe actuel" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showCurrentPw ? "text" : "password",
                  value: currentPassword,
                  onChange: (e) => setCurrentPassword(e.target.value),
                  className: "w-full px-4 py-2 pr-10 border border-border rounded-lg bg-input text-foreground"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowCurrentPw(!showCurrentPw),
                  className: "absolute right-3 top-9 text-muted-foreground",
                  children: showCurrentPw ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Nouveau mot de passe" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showNewPw ? "text" : "password",
                  value: newPassword,
                  onChange: (e) => setNewPassword(e.target.value),
                  className: "w-full px-4 py-2 pr-10 border border-border rounded-lg bg-input text-foreground"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowNewPw(!showNewPw),
                  className: "absolute right-3 top-9 text-muted-foreground",
                  children: showNewPw ? /* @__PURE__ */ jsx(EyeOff, { size: 16 }) : /* @__PURE__ */ jsx(Eye, { size: 16 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-foreground mb-2", children: "Confirmer le nouveau mot de passe" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "password",
                  value: confirmPassword,
                  onChange: (e) => setConfirmPassword(e.target.value),
                  className: "w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground"
                }
              )
            ] }),
            pwMsg && /* @__PURE__ */ jsxs(
              "div",
              {
                className: `flex items-center gap-2 p-3 rounded-lg text-sm ${pwMsg.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`,
                children: [
                  pwMsg.type === "success" ? /* @__PURE__ */ jsx(CheckCircle2, { size: 16 }) : /* @__PURE__ */ jsx(AlertCircle, { size: 16 }),
                  pwMsg.text
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: handleChangePassword,
                disabled: pwSaving || !currentPassword || !newPassword || !confirmPassword,
                className: "w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50",
                children: [
                  pwSaving ? /* @__PURE__ */ jsx(Loader2, { size: 18, className: "animate-spin" }) : /* @__PURE__ */ jsx(Lock, { size: 18 }),
                  pwSaving ? "Modification..." : "Modifier le mot de passe"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx("button", { className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "Authentification \xE0 deux facteurs" }),
          /* @__PURE__ */ jsx("button", { className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "G\xE9rer les sessions actives" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border border-border rounded-lg p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
          /* @__PURE__ */ jsx(Shield, { size: 24, className: "text-primary" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-foreground", children: "Confidentialit\xE9" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx("button", { className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "T\xE9l\xE9charger mes donn\xE9es" }),
          /* @__PURE__ */ jsx("button", { className: "w-full px-4 py-2 border border-border hover:bg-muted rounded-lg transition text-left font-medium text-foreground", children: "Consulter la politique de confidentialit\xE9" })
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  SettingsPage as default
};
