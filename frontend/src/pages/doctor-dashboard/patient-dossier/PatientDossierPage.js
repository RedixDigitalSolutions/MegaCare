import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { ArrowLeft, ChevronDown, FileText, Loader2, User } from "lucide-react";
export default function PatientDossierPage() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(["personal", "allergies"]);
    const token = localStorage.getItem("megacare_token");
    const fetchDossier = useCallback(async () => {
        try {
            const res = await fetch(`/api/dossier/${patientId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setError(data.message || "Dossier introuvable");
                return;
            }
            setDossier(await res.json());
        }
        catch {
            setError("Erreur de connexion");
        }
        finally {
            setLoading(false);
        }
    }, [patientId, token]);
    useEffect(() => {
        fetchDossier();
    }, [fetchDossier]);
    const toggle = (id) => setExpanded((p) => p.includes(id) ? p.filter((s) => s !== id) : [...p, id]);
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, {}), _jsx("main", { className: "flex-1 flex items-center justify-center p-12", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) })] }) }));
    }
    if (error || !dossier) {
        return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, {}), _jsxs("main", { className: "flex-1 flex flex-col items-center justify-center p-12 gap-4", children: [_jsx("p", { className: "text-muted-foreground", children: error || "Aucun dossier trouvé pour ce patient" }), _jsx("button", { onClick: () => navigate(-1), className: "px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg", children: "Retour" })] })] }) }));
    }
    const d = dossier;
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, {}), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsx("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => navigate(-1), className: "p-2 rounded-lg hover:bg-secondary/30 transition", children: _jsx(ArrowLeft, { size: 20 }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center", children: _jsx(User, { size: 20, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: d.patientName }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [d.patientEmail, d.patientPhone && ` · ${d.patientPhone}`, d.updatedAt &&
                                                                ` · Mis à jour le ${new Date(d.updatedAt).toLocaleDateString("fr-FR")}`] })] })] })] }) }), _jsxs("div", { className: "p-6 max-w-4xl mx-auto space-y-4", children: [_jsx(Section, { id: "personal", title: "Donn\u00E9es personnelles & biom\u00E9triques", icon: "\u2764\uFE0F", expanded: expanded, onToggle: toggle, children: _jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [_jsx(Field, { label: "\u00C2ge", value: d.personal?.age ? `${d.personal.age} ans` : "—" }), _jsx(Field, { label: "Genre", value: d.personal?.gender || "—" }), _jsx(Field, { label: "Groupe sanguin", value: d.personal?.bloodType || "—" }), _jsx(Field, { label: "Taille", value: d.personal?.height ? `${d.personal.height} cm` : "—" }), _jsx(Field, { label: "Poids", value: d.personal?.weight ? `${d.personal.weight} kg` : "—" })] }) }), _jsx(Section, { id: "medicalHistory", title: "Ant\u00E9c\u00E9dents m\u00E9dicaux", icon: "\uD83D\uDD2C", expanded: expanded, onToggle: toggle, children: _jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Maladies chroniques" }), d.medicalHistory?.chronicIllnesses?.length ? (d.medicalHistory.chronicIllnesses.map((c, i) => (_jsx("span", { className: "inline-block mr-2 mb-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium", children: c }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucune" }))] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Chirurgies pass\u00E9es" }), d.medicalHistory?.pastSurgeries?.length ? (d.medicalHistory.pastSurgeries.map((s, i) => (_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("p", { className: "font-medium text-foreground text-sm", children: s.name }), _jsx("span", { className: "text-xs text-muted-foreground", children: s.date }), s.notes && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["\u2014 ", s.notes] }))] }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucune" }))] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Ant\u00E9c\u00E9dents familiaux" }), d.medicalHistory?.familyHistory?.length ? (d.medicalHistory.familyHistory.map((f, i) => (_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-medium text-foreground text-sm", children: f.condition }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["(", f.relation, ")"] })] }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucun" }))] })] }) }), _jsx(Section, { id: "allergies", title: "Allergies", icon: "\u26A0\uFE0F", expanded: expanded, onToggle: toggle, children: d.allergies?.length ? (d.allergies.map((a, i) => (_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-foreground text-sm", children: a.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [a.type === "drug"
                                                                ? "Médicament"
                                                                : a.type === "food"
                                                                    ? "Alimentaire"
                                                                    : "Environnementale", " ", "\u2014 ", a.reaction] })] }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${a.severity === "Sévère" ? "bg-red-50 text-red-700" : a.severity === "Modérée" ? "bg-orange-50 text-orange-700" : "bg-yellow-50 text-yellow-700"}`, children: a.severity })] }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucune allergie" })) }), _jsx(Section, { id: "medications", title: "M\u00E9dicaments actifs", icon: "\uD83D\uDC8A", expanded: expanded, onToggle: toggle, children: d.activeMedications?.length ? (d.activeMedications.map((m, i) => (_jsx("div", { className: "flex items-center justify-between mb-2", children: _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-foreground text-sm", children: [m.name, " \u2014 ", m.dosage] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [m.frequency, " \u00B7 depuis ", m.since] })] }) }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucun m\u00E9dicament" })) }), _jsx(Section, { id: "documents", title: "Documents m\u00E9dicaux", icon: "\uD83D\uDCC4", expanded: expanded, onToggle: toggle, children: d.documents?.length ? (d.documents.map((doc, i) => (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-secondary/10 rounded-lg mb-2", children: [_jsx(FileText, { className: "w-5 h-5 text-primary flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-foreground text-sm", children: doc.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [doc.type === "lab"
                                                                ? "Analyse"
                                                                : doc.type === "imaging"
                                                                    ? "Imagerie"
                                                                    : doc.type === "prescription"
                                                                        ? "Ordonnance"
                                                                        : "Autre", " ", "\u00B7 ", doc.date] }), doc.description && (_jsx("p", { className: "text-xs text-muted-foreground mt-1", children: doc.description }))] })] }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucun document" })) })] })] })] }) }));
}
/* ── Helper Components ── */
function Field({ label, value }) {
    return (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: label }), _jsx("p", { className: "font-medium text-foreground text-sm", children: value })] }));
}
function Section({ id, title, icon, expanded, onToggle, children, }) {
    const isOpen = expanded.includes(id);
    return (_jsxs("div", { className: "bg-card rounded-lg border border-border overflow-hidden", children: [_jsxs("button", { onClick: () => onToggle(id), className: "w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: icon }), _jsx("h3", { className: "font-semibold text-foreground", children: title })] }), _jsx(ChevronDown, { size: 20, className: `text-muted-foreground transition ${isOpen ? "rotate-180" : ""}` })] }), isOpen && (_jsx("div", { className: "px-6 py-4 border-t border-border bg-secondary/5 space-y-3", children: children }))] }));
}
