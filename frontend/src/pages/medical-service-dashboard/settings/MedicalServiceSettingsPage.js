import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Building2, Bell, Shield, Save, Eye, EyeOff, AlertTriangle } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const emptyService = { name: "", address: "", phone: "", email: "", director: "", capacity: "", type: "" };
export default function MedicalServiceSettingsPage() {
    const [service, setService] = useState(emptyService);
    const [editingService, setEditingService] = useState(false);
    const [serviceForm, setServiceForm] = useState(emptyService);
    const [notifs, setNotifs] = useState({
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
                if (d.notifs)
                    setNotifs(d.notifs);
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
        if (!pwForm.current || !pwForm.next)
            return;
        if (pwForm.next !== pwForm.confirm) {
            flash("Les mots de passe ne correspondent pas.");
            return;
        }
        const r = await fetch("/api/auth/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
        }).catch(() => null);
        if (r && r.ok) {
            setPwForm({ current: "", next: "", confirm: "" });
            flash("Mot de passe mis à jour.");
        }
        else {
            flash("Erreur lors de la mise à jour du mot de passe.");
        }
    }
    function flash(msg) {
        setSavedMsg(msg);
        setTimeout(() => setSavedMsg(""), 3000);
    }
    const notifLabels = [
        { key: "newPatient", label: "Nouveau patient", desc: "Notification lors de l'ajout d'un nouveau patient" },
        { key: "vitalAlert", label: "Alerte constantes vitales", desc: "Alerte quand une constante est critique" },
        { key: "appointmentReminder", label: "Rappel visite", desc: "Rappel 1h avant une visite planifiée" },
        { key: "teamMessage", label: "Messagerie équipe", desc: "Notifications de nouveaux messages de l'équipe" },
        { key: "billing", label: "Facturation", desc: "Alertes sur les paiements en retard" },
        { key: "maintenance", label: "Maintenance équipement", desc: "Rappels pour les maintenances d'équipements" },
    ];
    const serviceFields = [
        { label: "Nom du service", key: "name", type: "text" },
        { label: "Adresse", key: "address", type: "text" },
        { label: "Téléphone", key: "phone", type: "tel" },
        { label: "Email", key: "email", type: "email" },
        { label: "Directeur / Responsable", key: "director", type: "text" },
        { label: "Capacité (patients simultanés)", key: "capacity", type: "number" },
        { label: "Type de service", key: "type", type: "text" },
    ];
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Param\u00E8tres" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Configuration du service m\u00E9dical" })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6 max-w-3xl", children: [savedMsg && (_jsxs("div", { className: "flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium", children: [_jsx(Save, { size: 15 }), savedMsg] })), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Building2, { size: 18, className: "text-primary" }), _jsx("h2", { className: "font-semibold text-foreground", children: "Informations du service" })] }), !editingService && (_jsx("button", { onClick: () => { setServiceForm(service); setEditingService(true); }, className: "text-sm text-primary hover:underline font-medium", children: "Modifier" }))] }), _jsx("div", { className: "p-5", children: editingService ? (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: serviceFields.map((f) => (_jsxs("div", { className: f.key === "name" || f.key === "address" ? "sm:col-span-2" : "", children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1", children: f.label }), _jsx("input", { type: f.type, value: serviceForm[f.key], onChange: (e) => setServiceForm((prev) => ({ ...prev, [f.key]: e.target.value })), className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" })] }, f.key))) }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setEditingService(false), className: "px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted transition", children: "Annuler" }), _jsxs("button", { onClick: saveService, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium flex items-center gap-2", children: [_jsx(Save, { size: 14 }), "Enregistrer"] })] })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: serviceFields.map((f) => (_jsxs("div", { className: f.key === "name" || f.key === "address" ? "sm:col-span-2" : "", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: f.label }), _jsx("p", { className: "text-sm font-medium text-foreground mt-0.5", children: service[f.key] })] }, f.key))) })) })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border", children: [_jsx(Bell, { size: 18, className: "text-primary" }), _jsx("h2", { className: "font-semibold text-foreground", children: "Notifications" })] }), _jsx("div", { className: "divide-y divide-border", children: notifLabels.map((n) => (_jsxs("div", { className: "flex items-center justify-between px-5 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: n.label }), _jsx("p", { className: "text-xs text-muted-foreground", children: n.desc })] }), _jsx("button", { onClick: () => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] })), className: `relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${notifs[n.key] ? "bg-primary" : "bg-muted"}`, children: _jsx("span", { className: `inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${notifs[n.key] ? "translate-x-4 ml-0.5" : "translate-x-0.5"}` }) })] }, n.key))) })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-2 px-5 py-4 border-b border-border", children: [_jsx(Shield, { size: 18, className: "text-primary" }), _jsx("h2", { className: "font-semibold text-foreground", children: "S\u00E9curit\u00E9" })] }), _jsxs("div", { className: "p-5 space-y-5", children: [_jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: "Changer le mot de passe" }), [
                                                        { label: "Mot de passe actuel", key: "current" },
                                                        { label: "Nouveau mot de passe", key: "next" },
                                                        { label: "Confirmer le nouveau mot de passe", key: "confirm" },
                                                    ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "text-xs text-muted-foreground block mb-1", children: f.label }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPw ? "text" : "password", value: pwForm[f.key], onChange: (e) => setPwForm((prev) => ({ ...prev, [f.key]: e.target.value })), className: "w-full border border-border rounded-lg px-3 py-2 pr-10 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" }), _jsx("button", { type: "button", onClick: () => setShowPw((p) => !p), className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition", children: showPw ? _jsx(EyeOff, { size: 15 }) : _jsx(Eye, { size: 15 }) })] })] }, f.key))), _jsxs("button", { onClick: savePassword, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition font-medium flex items-center gap-2", children: [_jsx(Save, { size: 14 }), "Mettre \u00E0 jour"] })] }), _jsx("hr", { className: "border-border" }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: "Double authentification (2FA)" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Renforcer la s\u00E9curit\u00E9 de votre compte" })] }), _jsx("button", { onClick: () => setTwoFA((p) => !p), className: `relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 ${twoFA ? "bg-primary" : "bg-muted"}`, children: _jsx("span", { className: `inline-block w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${twoFA ? "translate-x-4 ml-0.5" : "translate-x-0.5"}` }) })] }), _jsx("hr", { className: "border-border" }), _jsxs("div", { className: "rounded-xl border border-red-200 bg-red-50/30 p-4 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-red-600", children: [_jsx(AlertTriangle, { size: 16 }), _jsx("p", { className: "text-sm font-semibold", children: "Zone de danger" })] }), _jsx("p", { className: "text-xs text-red-600/70", children: "La suppression du compte est irr\u00E9versible. Toutes les donn\u00E9es seront perdues." }), _jsx("button", { className: "px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-100 transition font-medium", children: "Supprimer le compte" })] })] })] })] })] })] }));
}
