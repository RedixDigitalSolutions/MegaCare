import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { Search, Phone, FileText, User, ChevronRight, X, Calendar, Activity, Heart, AlertCircle, CheckCircle, Loader2, } from "lucide-react";
// Enrichment data keyed by patient email — provides medical context for the drawer
const PATIENT_EXTRA = {
    "patient@megacare.tn": {
        status: "Actif",
        condition: "Hypertension artérielle",
        consultations: 12,
        lastVisit: "2026-04-03",
        nextVisit: "2026-05-03",
        recentNotes: "TA stable sous traitement. Renouvellement Amlodipine 5mg.",
    },
    "patient2@megacare.tn": {
        status: "Urgent",
        condition: "Insuffisance cardiaque",
        consultations: 24,
        lastVisit: "2026-04-02",
        nextVisit: "2026-04-16",
        recentNotes: "Œdèmes aux membres inférieurs. Ajustement Furosémide.",
    },
    "patient3@megacare.tn": {
        status: "Actif",
        condition: "Palpitations bénignes",
        consultations: 4,
        lastVisit: "2026-03-28",
        nextVisit: "2026-04-05",
        recentNotes: "Holter prescrit. Éviter excitants.",
    },
    "patient4@megacare.tn": {
        status: "Inactif",
        condition: "Cholestérolémie",
        consultations: 7,
        lastVisit: "2026-02-15",
        nextVisit: null,
        recentNotes: "Perdu de vue depuis 6 semaines. Rappel recommandé.",
    },
    "patient5@megacare.tn": {
        status: "Actif",
        condition: "Arythmie sinusale",
        consultations: 9,
        lastVisit: "2026-04-01",
        nextVisit: "2026-04-15",
        recentNotes: "ECG de contrôle normal. Surveillance continue.",
    },
};
const STATUS_CFG = {
    Actif: {
        label: "Actif",
        badgeCls: "bg-green-100 text-green-700",
        dot: "bg-green-400",
        icon: _jsx(CheckCircle, { size: 14, className: "text-green-600" }),
    },
    Inactif: {
        label: "Inactif",
        badgeCls: "bg-gray-100 text-gray-600",
        dot: "bg-gray-400",
        icon: _jsx(Activity, { size: 14, className: "text-gray-500" }),
    },
    Urgent: {
        label: "Urgent",
        badgeCls: "bg-red-100 text-red-700",
        dot: "bg-red-500",
        icon: _jsx(AlertCircle, { size: 14, className: "text-red-600" }),
    },
};
function getInitials(p) {
    return `${p.firstName[0]}${p.lastName[0]}`.toUpperCase();
}
function getAgeFromEmail(email) {
    const ages = {
        "patient@megacare.tn": 34,
        "patient2@megacare.tn": 52,
        "patient3@megacare.tn": 28,
        "patient4@megacare.tn": 61,
        "patient5@megacare.tn": 41,
    };
    return ages[email] || 30;
}
export default function DoctorPatientsPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [selectedPatient, setSelectedPatient] = useState(null);
    const token = localStorage.getItem("megacare_token");
    const fetchPatients = useCallback(async () => {
        try {
            const res = await fetch("/api/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok)
                return;
            const allUsers = await res.json();
            const patientUsers = allUsers.filter((u) => u.role === "patient");
            // Also fetch dossiers to get allergy/bloodType data
            const enriched = await Promise.all(patientUsers.map(async (u) => {
                const extra = PATIENT_EXTRA[u.email] || {
                    status: "Actif",
                    condition: "—",
                    consultations: 0,
                    lastVisit: "—",
                    nextVisit: null,
                    recentNotes: "",
                };
                let bloodType = "—";
                let allergies = [];
                try {
                    const dRes = await fetch(`/api/dossier/${u.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (dRes.ok) {
                        const dossier = await dRes.json();
                        bloodType = dossier.personal?.bloodType || "—";
                        allergies = (dossier.allergies || []).map((a) => a.name);
                    }
                }
                catch {
                    // ignore
                }
                return {
                    id: u.id,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    age: extra.status
                        ? PATIENT_EXTRA[u.email]
                            ? getAgeFromEmail(u.email)
                            : 30
                        : 30,
                    phone: u.phone || "—",
                    email: u.email,
                    lastVisit: extra.lastVisit,
                    nextVisit: extra.nextVisit,
                    status: extra.status,
                    condition: extra.condition,
                    consultations: extra.consultations,
                    bloodType,
                    allergies,
                    recentNotes: extra.recentNotes,
                };
            }));
            setPatients(enriched);
        }
        catch {
            // leave empty
        }
        finally {
            setLoadingPatients(false);
        }
    }, [token]);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (isAuthenticated && user?.role === "doctor") {
            fetchPatients();
        }
    }, [isAuthenticated, user, fetchPatients]);
    if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
        return null;
    const filtered = patients.filter((p) => {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        const matchQuery = !query ||
            fullName.includes(query.toLowerCase()) ||
            p.condition.toLowerCase().includes(query.toLowerCase()) ||
            p.phone.includes(query);
        const matchStatus = statusFilter === "Tous" || p.status === statusFilter;
        return matchQuery && matchStatus;
    });
    const countOf = (s) => s === "Tous"
        ? patients.length
        : patients.filter((p) => p.status === s).length;
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, { doctorName: user.firstName || "Amira Mansouri" }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Mes Patients" }), _jsxs("p", { className: "text-muted-foreground mt-1", children: [patients.length, " patients enregistr\u00E9s"] })] }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-4", children: ["Tous", "Actif", "Urgent", "Inactif"].map((s) => (_jsxs("div", { onClick: () => setStatusFilter(s), className: `bg-card border rounded-xl p-4 text-center cursor-pointer transition hover:shadow-md ${statusFilter === s
                                                ? "border-primary ring-2 ring-primary/20"
                                                : "border-border"}`, children: [_jsx("p", { className: `text-2xl font-bold ${s === "Urgent"
                                                        ? "text-red-600"
                                                        : s === "Inactif"
                                                            ? "text-gray-500"
                                                            : s === "Actif"
                                                                ? "text-green-600"
                                                                : "text-foreground"}`, children: countOf(s) }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: s === "Tous" ? "Total" : s })] }, s))) }), _jsx("div", { className: "flex flex-col sm:flex-row gap-3", children: _jsxs("div", { className: "flex-1 flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5", children: [_jsx(Search, { size: 17, className: "text-muted-foreground shrink-0" }), _jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Rechercher par nom, condition, t\u00E9l\u00E9phone\u2026", className: "flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm" }), query && (_jsx("button", { onClick: () => setQuery(""), className: "p-0.5 hover:bg-muted rounded", children: _jsx(X, { size: 14, className: "text-muted-foreground" }) }))] }) }), loadingPatients ? (_jsx("div", { className: "flex items-center justify-center py-16", children: _jsx(Loader2, { className: "w-7 h-7 animate-spin text-primary" }) })) : filtered.length === 0 ? (_jsx("div", { className: "text-center py-16 text-muted-foreground", children: "Aucun patient ne correspond \u00E0 votre recherche." })) : (_jsx("div", { className: "space-y-3", children: filtered.map((patient) => {
                                            const cfg = STATUS_CFG[patient.status];
                                            return (_jsxs("div", { className: "bg-card border border-border rounded-xl p-5 hover:shadow-md transition flex items-start gap-4", children: [_jsxs("div", { className: "relative shrink-0", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-sm", children: getInitials(patient) }), _jsx("span", { className: `absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${cfg.dot}` })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-1", children: [_jsxs("h3", { className: "font-semibold text-foreground", children: [patient.firstName, " ", patient.lastName] }), _jsxs("span", { className: "text-xs text-muted-foreground", children: [patient.age, " ans \u00B7 ", patient.bloodType] }), _jsxs("span", { className: `flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.badgeCls}`, children: [cfg.icon, cfg.label] })] }), _jsxs("p", { className: "text-sm text-muted-foreground mb-2 flex items-center gap-1", children: [_jsx(Heart, { size: 12, className: "text-primary/60" }), patient.condition] }), _jsxs("div", { className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { size: 11 }), "Derni\u00E8re visite: ", patient.lastVisit] }), patient.nextVisit && (_jsxs("span", { className: "flex items-center gap-1 text-primary", children: [_jsx(Calendar, { size: 11 }), "Prochaine: ", patient.nextVisit] })), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Phone, { size: 11 }), patient.phone] }), _jsxs("span", { children: [patient.consultations, " consultations"] })] }), patient.allergies.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: patient.allergies.map((a) => (_jsxs("span", { className: "text-xs bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full", children: ["\u26A0 ", a] }, a))) }))] }), _jsxs("div", { className: "flex flex-col gap-2 shrink-0 items-end", children: [_jsxs("button", { onClick: () => setSelectedPatient(patient), className: "flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(FileText, { size: 14 }), "Dossier"] }), _jsxs("a", { href: `tel:${patient.phone}`, className: "flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition text-sm", children: [_jsx(Phone, { size: 14 }), "Appeler"] })] })] }, patient.id));
                                        }) }))] })] })] }), selectedPatient && (_jsxs("div", { className: "fixed inset-0 z-50 flex justify-end", children: [_jsx("div", { className: "absolute inset-0 bg-black/50 backdrop-blur-sm", onClick: () => setSelectedPatient(null) }), _jsxs("aside", { className: "relative w-full max-w-md bg-card flex flex-col h-full overflow-y-auto shadow-2xl", children: [_jsxs("div", { className: "flex items-start justify-between p-6 border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center font-bold text-primary text-lg", children: getInitials(selectedPatient) }), _jsxs("div", { children: [_jsxs("h2", { className: "text-xl font-bold text-foreground", children: [selectedPatient.firstName, " ", selectedPatient.lastName] }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [selectedPatient.age, " ans \u00B7 ", selectedPatient.bloodType] })] })] }), _jsx("button", { onClick: () => setSelectedPatient(null), className: "p-2 hover:bg-muted rounded-lg transition mt-1", children: _jsx(X, { size: 18 }) })] }), _jsxs("div", { className: "flex-1 p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("span", { className: `flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${STATUS_CFG[selectedPatient.status].badgeCls}`, children: [STATUS_CFG[selectedPatient.status].icon, selectedPatient.status] }), _jsxs("span", { className: "text-sm text-muted-foreground flex items-center gap-1", children: [_jsx(Heart, { size: 14, className: "text-primary/60" }), selectedPatient.condition] })] }), _jsxs("section", { className: "space-y-2", children: [_jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Contact" }), _jsxs("div", { className: "bg-muted/30 rounded-xl p-4 space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 text-sm text-foreground", children: [_jsx(Phone, { size: 14, className: "text-muted-foreground" }), selectedPatient.phone] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-foreground", children: [_jsx(User, { size: 14, className: "text-muted-foreground" }), selectedPatient.email] })] })] }), _jsxs("section", { className: "space-y-2", children: [_jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Visites" }), _jsxs("div", { className: "bg-muted/30 rounded-xl p-4 space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Derni\u00E8re visite" }), _jsx("span", { className: "font-medium text-foreground", children: selectedPatient.lastVisit })] }), selectedPatient.nextVisit && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Prochaine visite" }), _jsx("span", { className: "font-medium text-primary", children: selectedPatient.nextVisit })] })), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Total" }), _jsxs("span", { className: "font-medium text-foreground", children: [selectedPatient.consultations, " consultation", selectedPatient.consultations > 1 ? "s" : ""] })] })] })] }), _jsxs("section", { className: "space-y-2", children: [_jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Allergies" }), selectedPatient.allergies.length === 0 ? (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucune allergie connue" })) : (_jsx("div", { className: "flex flex-wrap gap-2", children: selectedPatient.allergies.map((a) => (_jsxs("span", { className: "text-sm bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-full font-medium", children: ["\u26A0 ", a] }, a))) }))] }), _jsxs("section", { className: "space-y-2", children: [_jsx("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Derni\u00E8res notes" }), _jsx("p", { className: "text-sm text-foreground bg-muted/40 rounded-xl p-4 leading-relaxed", children: selectedPatient.recentNotes })] })] }), _jsxs("div", { className: "p-4 border-t border-border flex gap-3", children: [_jsxs("a", { href: `tel:${selectedPatient.phone}`, className: "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition text-sm font-medium", children: [_jsx(Phone, { size: 15 }), "Appeler"] }), _jsxs("button", { onClick: () => navigate(`/doctor-dashboard/patient-dossier/${selectedPatient.id}`), className: "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-medium", children: [_jsx(ChevronRight, { size: 15 }), "Voir dossier complet"] })] })] })] }))] }));
}
