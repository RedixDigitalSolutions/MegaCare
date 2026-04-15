import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
export default function MedicalHistoryPage() {
    const { user, logout, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "patient")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    useEffect(() => {
        if (!isAuthenticated || !user)
            return;
        const token = localStorage.getItem("megacare_token");
        if (!token)
            return;
        fetch("/api/dossier", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => setDossier(data))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [isAuthenticated, user]);
    if (isLoading || !isAuthenticated || !user || user.role !== "patient")
        return null;
    const consultations = dossier?.consultations || [];
    const allergies = dossier?.allergies || [];
    const medications = dossier?.activeMedications || [];
    const chronic = dossier?.medicalHistory?.chronicIllnesses || [];
    return (_jsxs("div", { className: "min-h-screen bg-background", children: [_jsx("header", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: _jsxs("div", { className: "max-w-7xl mx-auto flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Historique M\u00E9dical" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Votre parcours de sant\u00E9" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Link, { to: "/dashboard", className: "px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium", children: "Retour" }), _jsxs("button", { onClick: logout, className: "px-6 py-2 border border-border hover:bg-muted rounded-lg transition font-medium flex items-center gap-2", children: [_jsx(LogOut, { size: 18 }), "D\u00E9connexion"] })] })] }) }), _jsx("main", { className: "max-w-7xl mx-auto p-6", children: loading ? (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) })) : !dossier ? (_jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [_jsx("p", { className: "text-lg font-medium", children: "Aucun dossier m\u00E9dical" }), _jsx("p", { className: "text-sm mt-1", children: "Votre dossier sera cr\u00E9\u00E9 lors de votre premi\u00E8re consultation" })] })) : (_jsxs("div", { className: "space-y-8", children: [(chronic.length > 0 ||
                            allergies.length > 0 ||
                            medications.length > 0) && (_jsxs("div", { className: "grid md:grid-cols-3 gap-4", children: [chronic.length > 0 && (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [_jsx("h3", { className: "font-semibold text-foreground mb-2", children: "Maladies chroniques" }), _jsx("ul", { className: "space-y-1", children: chronic.map((c, i) => (_jsxs("li", { className: "text-sm text-muted-foreground", children: ["\u2022 ", c] }, i))) })] })), allergies.length > 0 && (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [_jsx("h3", { className: "font-semibold text-foreground mb-2", children: "Allergies" }), _jsx("ul", { className: "space-y-1", children: allergies.map((a, i) => (_jsxs("li", { className: "text-sm text-muted-foreground", children: ["\u2022 ", a.name, " (", a.severity, ")"] }, i))) })] })), medications.length > 0 && (_jsxs("div", { className: "bg-card rounded-xl border border-border p-5", children: [_jsx("h3", { className: "font-semibold text-foreground mb-2", children: "M\u00E9dicaments actifs" }), _jsx("ul", { className: "space-y-1", children: medications.map((m, i) => (_jsxs("li", { className: "text-sm text-muted-foreground", children: ["\u2022 ", m.name, " ", m.dosage, " \u2014 ", m.frequency] }, i))) })] }))] })), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-foreground mb-4", children: "Consultations" }), consultations.length === 0 ? (_jsx("p", { className: "text-muted-foreground text-sm", children: "Aucune consultation enregistr\u00E9e" })) : (_jsx("div", { className: "space-y-4", children: consultations
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((record, idx) => (_jsxs("div", { className: "bg-card rounded-xl border border-border p-6 hover:shadow-lg transition", children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-lg text-foreground", children: record.diagnosis ||
                                                                record.symptoms ||
                                                                "Consultation" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [record.doctorName, " \u2014", " ", new Date(record.date).toLocaleDateString("fr-FR", {
                                                                    day: "numeric",
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })] })] }) }), record.observations && (_jsxs("p", { className: "text-muted-foreground mb-2", children: [_jsx("span", { className: "font-medium text-foreground", children: "Observations:" }), " ", record.observations] })), record.notes && (_jsxs("p", { className: "text-muted-foreground", children: [_jsx("span", { className: "font-medium text-foreground", children: "Notes:" }), " ", record.notes] })), record.followUp && (_jsxs("p", { className: "text-sm text-primary mt-2", children: ["Suivi: ", record.followUp] }))] }, idx))) }))] })] })) })] }));
}
