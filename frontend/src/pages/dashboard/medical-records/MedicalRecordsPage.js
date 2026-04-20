import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { ChevronDown, FileText, Lock, AlertCircle, Loader2, Save, X, Pencil, Trash2, ShieldCheck, ShieldOff, Clock, } from "lucide-react";
export default function MedicalRecordsPage() {
    const [dossier, setDossier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedSections, setExpandedSections] = useState([
        "personal",
    ]);
    const [editingSection, setEditingSection] = useState(null);
    const [editData, setEditData] = useState(null);
    const [permissions, setPermissions] = useState([]);
    const [permLoading, setPermLoading] = useState(false);
    const token = localStorage.getItem("megacare_token");
    const fetchDossier = useCallback(async () => {
        try {
            const res = await fetch("/api/dossier", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setDossier(data);
        }
        catch {
            // leave null
        }
        finally {
            setLoading(false);
        }
    }, [token]);
    useEffect(() => {
        fetchDossier();
    }, [fetchDossier]);
    const fetchPermissions = useCallback(async () => {
        try {
            const res = await fetch("/api/dossier/permissions/list", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (Array.isArray(data))
                setPermissions(data);
        }
        catch { }
    }, [token]);
    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);
    const revokePermission = async (doctorId) => {
        setPermLoading(true);
        try {
            const res = await fetch(`/api/dossier/permissions/${doctorId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data))
                    setPermissions(data);
            }
        }
        finally {
            setPermLoading(false);
        }
    };
    const toggleSection = (section) => {
        setExpandedSections((prev) => prev.includes(section)
            ? prev.filter((s) => s !== section)
            : [...prev, section]);
    };
    const startEdit = (sectionId) => {
        if (!dossier)
            return;
        const map = {
            personal: { ...dossier.personal },
            medicalHistory: JSON.parse(JSON.stringify(dossier.medicalHistory)),
            allergies: JSON.parse(JSON.stringify(dossier.allergies)),
            medications: JSON.parse(JSON.stringify(dossier.activeMedications)),
            documents: JSON.parse(JSON.stringify(dossier.documents)),
        };
        setEditData(map[sectionId]);
        setEditingSection(sectionId);
    };
    const cancelEdit = () => {
        setEditingSection(null);
        setEditData(null);
    };
    const saveSection = async (sectionId) => {
        if (!editData)
            return;
        setSaving(true);
        const bodyMap = {
            personal: { personal: editData },
            medicalHistory: { medicalHistory: editData },
            allergies: { allergies: editData },
            medications: { activeMedications: editData },
            documents: { documents: editData },
        };
        try {
            const res = await fetch("/api/dossier", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(bodyMap[sectionId]),
            });
            if (res.ok) {
                const updated = await res.json();
                setDossier(updated);
                setEditingSection(null);
                setEditData(null);
            }
        }
        finally {
            setSaving(false);
        }
    };
    const completionPercent = (() => {
        if (!dossier)
            return 0;
        let filled = 0;
        let total = 5;
        if (dossier.personal?.bloodType)
            filled++;
        if (dossier.medicalHistory?.chronicIllnesses?.length > 0)
            filled++;
        if (dossier.allergies?.length > 0)
            filled++;
        if (dossier.activeMedications?.length > 0)
            filled++;
        if (dossier.documents?.length > 0)
            filled++;
        return Math.round((filled / total) * 100);
    })();
    if (loading) {
        return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, {}), _jsx("main", { className: "flex-1 flex items-center justify-center p-12", children: _jsx(Loader2, { className: "w-8 h-8 animate-spin text-primary" }) })] }) }));
    }
    const d = dossier || {};
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DashboardSidebar, {}), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsx("div", { className: "bg-card border-b border-border p-6 sticky top-0 z-10", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-foreground", children: "Mon Dossier M\u00E9dical" }), _jsxs("p", { className: "text-sm text-muted-foreground mt-1 flex items-center gap-2", children: [_jsx(Lock, { size: 16, className: "text-primary" }), "S\u00E9curis\u00E9 & Chiffr\u00E9"] })] }), _jsx("span", { className: "text-xs text-muted-foreground", children: dossier?.updatedAt
                                            ? `Mis à jour le ${new Date(dossier.updatedAt).toLocaleDateString("fr-FR")}`
                                            : "Aucune mise à jour" })] }) }), _jsxs("div", { className: "p-6 max-w-4xl mx-auto space-y-6", children: [_jsxs("div", { className: "bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-start gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-primary flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "Compl\u00E9tez votre dossier pour une meilleure prise en charge" }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: ["Taux de compl\u00E9tion: ", completionPercent, "%"] }), _jsx("div", { className: "w-full h-2 bg-primary/20 rounded-full mt-2 overflow-hidden", children: _jsx("div", { className: "h-full bg-primary rounded-full transition-all", style: { width: `${completionPercent}%` } }) })] })] }), _jsx(SectionAccordion, { id: "personal", title: "Donn\u00E9es personnelles & biom\u00E9triques", icon: "\u2764\uFE0F", expanded: expandedSections, onToggle: toggleSection, editing: editingSection === "personal", onEdit: () => startEdit("personal"), onCancel: cancelEdit, onSave: () => saveSection("personal"), saving: saving, children: editingSection === "personal" && editData ? (_jsx("div", { className: "grid grid-cols-2 gap-4", children: [
                                            { key: "age", label: "Âge", type: "number" },
                                            { key: "gender", label: "Genre", type: "text" },
                                            { key: "bloodType", label: "Groupe sanguin", type: "text" },
                                            { key: "height", label: "Taille (cm)", type: "number" },
                                            { key: "weight", label: "Poids (kg)", type: "number" },
                                        ].map((f) => (_jsxs("div", { children: [_jsx("label", { className: "text-xs text-muted-foreground", children: f.label }), _jsx("input", { type: f.type, className: "w-full mt-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm", value: editData[f.key] ?? "", onChange: (e) => setEditData({
                                                        ...editData,
                                                        [f.key]: f.type === "number"
                                                            ? Number(e.target.value)
                                                            : e.target.value,
                                                    }) })] }, f.key))) })) : (_jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-4", children: [_jsx(Field, { label: "\u00C2ge", value: d.personal?.age ? `${d.personal.age} ans` : "—" }), _jsx(Field, { label: "Genre", value: d.personal?.gender || "—" }), _jsx(Field, { label: "Groupe sanguin", value: d.personal?.bloodType || "—" }), _jsx(Field, { label: "Taille", value: d.personal?.height ? `${d.personal.height} cm` : "—" }), _jsx(Field, { label: "Poids", value: d.personal?.weight ? `${d.personal.weight} kg` : "—" })] })) }), _jsx(SectionAccordion, { id: "medicalHistory", title: "Ant\u00E9c\u00E9dents m\u00E9dicaux", icon: "\uD83D\uDD2C", expanded: expandedSections, onToggle: toggleSection, editing: editingSection === "medicalHistory", onEdit: () => startEdit("medicalHistory"), onCancel: cancelEdit, onSave: () => saveSection("medicalHistory"), saving: saving, children: editingSection === "medicalHistory" && editData ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-foreground mb-2", children: "Maladies chroniques" }), editData.chronicIllnesses?.map((c, i) => (_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("input", { className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm", value: c, onChange: (e) => {
                                                                    const arr = [...editData.chronicIllnesses];
                                                                    arr[i] = e.target.value;
                                                                    setEditData({ ...editData, chronicIllnesses: arr });
                                                                } }), _jsx("button", { onClick: () => {
                                                                    const arr = editData.chronicIllnesses.filter((_, j) => j !== i);
                                                                    setEditData({ ...editData, chronicIllnesses: arr });
                                                                }, className: "text-destructive", children: _jsx(Trash2, { size: 16 }) })] }, i))), _jsx("button", { onClick: () => setEditData({
                                                            ...editData,
                                                            chronicIllnesses: [
                                                                ...(editData.chronicIllnesses || []),
                                                                "",
                                                            ],
                                                        }), className: "text-primary text-sm font-medium", children: "+ Ajouter" })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-foreground mb-2", children: "Chirurgies pass\u00E9es" }), editData.pastSurgeries?.map((s, i) => (_jsxs("div", { className: "grid grid-cols-3 gap-2 mb-2", children: [_jsx("input", { placeholder: "Nom", className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: s.name, onChange: (e) => {
                                                                    const arr = [...editData.pastSurgeries];
                                                                    arr[i] = { ...arr[i], name: e.target.value };
                                                                    setEditData({ ...editData, pastSurgeries: arr });
                                                                } }), _jsx("input", { type: "date", className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: s.date, onChange: (e) => {
                                                                    const arr = [...editData.pastSurgeries];
                                                                    arr[i] = { ...arr[i], date: e.target.value };
                                                                    setEditData({ ...editData, pastSurgeries: arr });
                                                                } }), _jsxs("div", { className: "flex gap-1", children: [_jsx("input", { placeholder: "Notes", className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm", value: s.notes, onChange: (e) => {
                                                                            const arr = [...editData.pastSurgeries];
                                                                            arr[i] = { ...arr[i], notes: e.target.value };
                                                                            setEditData({ ...editData, pastSurgeries: arr });
                                                                        } }), _jsx("button", { onClick: () => setEditData({
                                                                            ...editData,
                                                                            pastSurgeries: editData.pastSurgeries.filter((_, j) => j !== i),
                                                                        }), className: "text-destructive", children: _jsx(Trash2, { size: 16 }) })] })] }, i))), _jsx("button", { onClick: () => setEditData({
                                                            ...editData,
                                                            pastSurgeries: [
                                                                ...(editData.pastSurgeries || []),
                                                                { name: "", date: "", notes: "" },
                                                            ],
                                                        }), className: "text-primary text-sm font-medium", children: "+ Ajouter" })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-sm font-semibold text-foreground mb-2", children: "Ant\u00E9c\u00E9dents familiaux" }), editData.familyHistory?.map((f, i) => (_jsxs("div", { className: "flex gap-2 mb-2", children: [_jsx("input", { placeholder: "Condition", className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm", value: f.condition, onChange: (e) => {
                                                                    const arr = [...editData.familyHistory];
                                                                    arr[i] = { ...arr[i], condition: e.target.value };
                                                                    setEditData({ ...editData, familyHistory: arr });
                                                                } }), _jsx("input", { placeholder: "Relation", className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm", value: f.relation, onChange: (e) => {
                                                                    const arr = [...editData.familyHistory];
                                                                    arr[i] = { ...arr[i], relation: e.target.value };
                                                                    setEditData({ ...editData, familyHistory: arr });
                                                                } }), _jsx("button", { onClick: () => setEditData({
                                                                    ...editData,
                                                                    familyHistory: editData.familyHistory.filter((_, j) => j !== i),
                                                                }), className: "text-destructive", children: _jsx(Trash2, { size: 16 }) })] }, i))), _jsx("button", { onClick: () => setEditData({
                                                            ...editData,
                                                            familyHistory: [
                                                                ...(editData.familyHistory || []),
                                                                { condition: "", relation: "" },
                                                            ],
                                                        }), className: "text-primary text-sm font-medium", children: "+ Ajouter" })] })] })) : (_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Maladies chroniques" }), d.medicalHistory?.chronicIllnesses?.length ? (d.medicalHistory.chronicIllnesses.map((c, i) => (_jsx("span", { className: "inline-block mr-2 mb-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-medium", children: c }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucune" }))] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Chirurgies pass\u00E9es" }), d.medicalHistory?.pastSurgeries?.length ? (d.medicalHistory.pastSurgeries.map((s, i) => (_jsxs("div", { className: "flex items-center gap-3 mb-1", children: [_jsx("p", { className: "font-medium text-foreground text-sm", children: s.name }), _jsx("span", { className: "text-xs text-muted-foreground", children: s.date }), s.notes && (_jsxs("span", { className: "text-xs text-muted-foreground", children: ["\u2014 ", s.notes] }))] }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucune" }))] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: "Ant\u00E9c\u00E9dents familiaux" }), d.medicalHistory?.familyHistory?.length ? (d.medicalHistory.familyHistory.map((f, i) => (_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-medium text-foreground text-sm", children: f.condition }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["(", f.relation, ")"] })] }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucun" }))] })] })) }), _jsx(SectionAccordion, { id: "allergies", title: "Allergies", icon: "\u26A0\uFE0F", expanded: expandedSections, onToggle: toggleSection, editing: editingSection === "allergies", onEdit: () => startEdit("allergies"), onCancel: cancelEdit, onSave: () => saveSection("allergies"), saving: saving, children: editingSection === "allergies" && editData ? (_jsxs("div", { className: "space-y-3", children: [editData.map((a, i) => (_jsxs("div", { className: "grid grid-cols-4 gap-2", children: [_jsxs("select", { className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: a.type, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], type: e.target.value };
                                                            setEditData(arr);
                                                        }, children: [_jsx("option", { value: "drug", children: "M\u00E9dicament" }), _jsx("option", { value: "food", children: "Alimentaire" }), _jsx("option", { value: "environmental", children: "Environnementale" })] }), _jsx("input", { placeholder: "Nom", className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: a.name, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], name: e.target.value };
                                                            setEditData(arr);
                                                        } }), _jsxs("select", { className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: a.severity, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], severity: e.target.value };
                                                            setEditData(arr);
                                                        }, children: [_jsx("option", { value: "L\u00E9g\u00E8re", children: "L\u00E9g\u00E8re" }), _jsx("option", { value: "Mod\u00E9r\u00E9e", children: "Mod\u00E9r\u00E9e" }), _jsx("option", { value: "S\u00E9v\u00E8re", children: "S\u00E9v\u00E8re" })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx("input", { placeholder: "R\u00E9action", className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm", value: a.reaction, onChange: (e) => {
                                                                    const arr = [...editData];
                                                                    arr[i] = { ...arr[i], reaction: e.target.value };
                                                                    setEditData(arr);
                                                                } }), _jsx("button", { onClick: () => setEditData(editData.filter((_, j) => j !== i)), className: "text-destructive", children: _jsx(Trash2, { size: 16 }) })] })] }, i))), _jsx("button", { onClick: () => setEditData([
                                                    ...editData,
                                                    {
                                                        type: "drug",
                                                        name: "",
                                                        severity: "Légère",
                                                        reaction: "",
                                                    },
                                                ]), className: "text-primary text-sm font-medium", children: "+ Ajouter une allergie" })] })) : (_jsx("div", { className: "space-y-2", children: d.allergies?.length ? (d.allergies.map((a, i) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-foreground text-sm", children: a.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [a.type === "drug"
                                                                    ? "Médicament"
                                                                    : a.type === "food"
                                                                        ? "Alimentaire"
                                                                        : "Environnementale", " ", "\u2014 ", a.reaction] })] }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${a.severity === "Sévère" ? "bg-red-50 text-red-700" : a.severity === "Modérée" ? "bg-orange-50 text-orange-700" : "bg-yellow-50 text-yellow-700"}`, children: a.severity })] }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucune allergie enregistr\u00E9e" })) })) }), _jsx(SectionAccordion, { id: "medications", title: "M\u00E9dicaments actifs", icon: "\uD83D\uDC8A", expanded: expandedSections, onToggle: toggleSection, editing: editingSection === "medications", onEdit: () => startEdit("medications"), onCancel: cancelEdit, onSave: () => saveSection("medications"), saving: saving, children: editingSection === "medications" && editData ? (_jsxs("div", { className: "space-y-3", children: [editData.map((m, i) => (_jsxs("div", { className: "grid grid-cols-4 gap-2", children: [_jsx("input", { placeholder: "Nom", className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: m.name, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], name: e.target.value };
                                                            setEditData(arr);
                                                        } }), _jsx("input", { placeholder: "Dosage", className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: m.dosage, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], dosage: e.target.value };
                                                            setEditData(arr);
                                                        } }), _jsx("input", { placeholder: "Fr\u00E9quence", className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: m.frequency, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], frequency: e.target.value };
                                                            setEditData(arr);
                                                        } }), _jsxs("div", { className: "flex gap-1", children: [_jsx("input", { type: "date", className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm", value: m.since, onChange: (e) => {
                                                                    const arr = [...editData];
                                                                    arr[i] = { ...arr[i], since: e.target.value };
                                                                    setEditData(arr);
                                                                } }), _jsx("button", { onClick: () => setEditData(editData.filter((_, j) => j !== i)), className: "text-destructive", children: _jsx(Trash2, { size: 16 }) })] })] }, i))), _jsx("button", { onClick: () => setEditData([
                                                    ...editData,
                                                    { name: "", dosage: "", frequency: "", since: "" },
                                                ]), className: "text-primary text-sm font-medium", children: "+ Ajouter un m\u00E9dicament" })] })) : (_jsx("div", { className: "space-y-2", children: d.activeMedications?.length ? (d.activeMedications.map((m, i) => (_jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-foreground text-sm", children: [m.name, " \u2014 ", m.dosage] }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [m.frequency, " \u00B7 depuis ", m.since] })] }) }, i)))) : (_jsx("p", { className: "text-sm text-muted-foreground italic", children: "Aucun m\u00E9dicament actif" })) })) }), _jsx(SectionAccordion, { id: "documents", title: "Documents m\u00E9dicaux", icon: "\uD83D\uDCC4", expanded: expandedSections, onToggle: toggleSection, editing: editingSection === "documents", onEdit: () => startEdit("documents"), onCancel: cancelEdit, onSave: () => saveSection("documents"), saving: saving, children: editingSection === "documents" && editData ? (_jsxs("div", { className: "space-y-3", children: [editData.map((doc, i) => (_jsxs("div", { className: "grid grid-cols-4 gap-2", children: [_jsxs("select", { className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: doc.type, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], type: e.target.value };
                                                            setEditData(arr);
                                                        }, children: [_jsx("option", { value: "lab", children: "Analyse" }), _jsx("option", { value: "imaging", children: "Imagerie" }), _jsx("option", { value: "prescription", children: "Ordonnance" }), _jsx("option", { value: "other", children: "Autre" })] }), _jsx("input", { placeholder: "Nom", className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: doc.name, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], name: e.target.value };
                                                            setEditData(arr);
                                                        } }), _jsx("input", { type: "date", className: "px-3 py-2 border border-border rounded-lg bg-background text-sm", value: doc.date, onChange: (e) => {
                                                            const arr = [...editData];
                                                            arr[i] = { ...arr[i], date: e.target.value };
                                                            setEditData(arr);
                                                        } }), _jsxs("div", { className: "flex gap-1", children: [_jsx("input", { placeholder: "Description", className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm", value: doc.description, onChange: (e) => {
                                                                    const arr = [...editData];
                                                                    arr[i] = { ...arr[i], description: e.target.value };
                                                                    setEditData(arr);
                                                                } }), _jsx("button", { onClick: () => setEditData(editData.filter((_, j) => j !== i)), className: "text-destructive", children: _jsx(Trash2, { size: 16 }) })] })] }, i))), _jsx("button", { onClick: () => setEditData([
                                                    ...editData,
                                                    {
                                                        id: `doc-${Date.now()}`,
                                                        type: "lab",
                                                        name: "",
                                                        date: "",
                                                        description: "",
                                                    },
                                                ]), className: "text-primary text-sm font-medium", children: "+ Ajouter un document" })] })) : (_jsx("div", { className: "space-y-3", children: d.documents?.length ? (d.documents.map((doc, i) => (_jsxs("div", { className: "flex items-start gap-3 p-3 bg-secondary/10 rounded-lg", children: [_jsx(FileText, { className: "w-5 h-5 text-primary flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-foreground text-sm", children: doc.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [doc.type === "lab"
                                                                    ? "Analyse"
                                                                    : doc.type === "imaging"
                                                                        ? "Imagerie"
                                                                        : doc.type === "prescription"
                                                                            ? "Ordonnance"
                                                                            : "Autre", " ", "\u00B7 ", doc.date] }), doc.description && (_jsx("p", { className: "text-xs text-muted-foreground mt-1", children: doc.description }))] })] }, i)))) : (_jsxs("div", { className: "border-2 border-dashed border-primary/30 rounded-lg p-8 text-center space-y-2", children: [_jsx(FileText, { className: "w-8 h-8 text-primary mx-auto" }), _jsx("p", { className: "font-semibold text-foreground text-sm", children: "Aucun document" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Cliquez sur Modifier pour ajouter des documents" })] })) })) }), _jsxs("div", { className: "bg-card rounded-lg border border-border overflow-hidden", children: [_jsxs("div", { className: "px-6 py-4 flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: "\uD83D\uDD10" }), _jsx("h3", { className: "font-semibold text-foreground", children: "Acc\u00E8s au dossier" }), _jsxs("span", { className: "text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto", children: [permissions.filter((p) => p.status === "active").length, " actif(s)"] })] }), _jsxs("div", { className: "px-6 py-4 border-t border-border bg-secondary/5 space-y-3", children: [_jsx("p", { className: "text-xs text-muted-foreground", children: "Les m\u00E9decins ci-dessous ont acc\u00E8s \u00E0 votre dossier m\u00E9dical. L'acc\u00E8s est accord\u00E9 automatiquement lors de la prise de rendez-vous et expire 3 jours apr\u00E8s la consultation." }), permissions.length === 0 ? (_jsxs("div", { className: "border-2 border-dashed border-primary/30 rounded-lg p-8 text-center space-y-2", children: [_jsx(ShieldCheck, { className: "w-8 h-8 text-primary mx-auto" }), _jsx("p", { className: "font-semibold text-foreground text-sm", children: "Aucun acc\u00E8s accord\u00E9" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Aucun m\u00E9decin n'a actuellement acc\u00E8s \u00E0 votre dossier" })] })) : (_jsx("div", { className: "space-y-2", children: permissions.map((p, i) => {
                                                        const isActive = p.status === "active";
                                                        const isExpired = p.status === "expired";
                                                        const hasExpiry = p.expiresAt && isActive;
                                                        return (_jsxs("div", { className: `flex items-center justify-between p-3 rounded-lg border ${isActive
                                                                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                                                                : isExpired
                                                                    ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900"
                                                                    : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [isActive ? (_jsx(ShieldCheck, { size: 18, className: "text-green-600" })) : isExpired ? (_jsx(Clock, { size: 18, className: "text-orange-500" })) : (_jsx(ShieldOff, { size: 18, className: "text-red-500" })), _jsxs("div", { children: [_jsxs("p", { className: "font-medium text-sm text-foreground", children: ["Dr. ", p.doctorName || "Médecin"] }), _jsx("p", { className: "text-xs text-muted-foreground", children: isActive
                                                                                        ? hasExpiry
                                                                                            ? `Expire le ${new Date(p.expiresAt).toLocaleDateString("fr-FR")}`
                                                                                            : `Accordé le ${new Date(p.grantedAt).toLocaleDateString("fr-FR")}`
                                                                                        : isExpired
                                                                                            ? "Accès expiré"
                                                                                            : "Accès révoqué" })] })] }), isActive && (_jsx("button", { onClick: () => revokePermission(p.doctorId), disabled: permLoading, className: "px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-100 transition disabled:opacity-50", children: "R\u00E9voquer" }))] }, i));
                                                    }) }))] })] })] })] })] }) }));
}
/* ── Helper Components ── */
function Field({ label, value }) {
    return (_jsxs("div", { children: [_jsx("p", { className: "text-xs text-muted-foreground", children: label }), _jsx("p", { className: "font-medium text-foreground text-sm", children: value })] }));
}
function SectionAccordion({ id, title, icon, expanded, onToggle, editing, onEdit, onCancel, onSave, saving, children, }) {
    const isOpen = expanded.includes(id);
    return (_jsxs("div", { className: "bg-card rounded-lg border border-border overflow-hidden", children: [_jsxs("button", { onClick: () => onToggle(id), className: "w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/30 transition", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: "text-2xl", children: icon }), _jsx("h3", { className: "font-semibold text-foreground", children: title })] }), _jsx(ChevronDown, { size: 20, className: `text-muted-foreground transition ${isOpen ? "rotate-180" : ""}` })] }), isOpen && (_jsxs("div", { className: "px-6 py-4 border-t border-border bg-secondary/5 space-y-3", children: [children, _jsx("div", { className: "flex justify-end gap-2 pt-2", children: editing ? (_jsxs(_Fragment, { children: [_jsxs("button", { onClick: onCancel, className: "px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary/30 transition", children: [_jsx(X, { size: 14, className: "inline mr-1" }), "Annuler"] }), _jsxs("button", { onClick: onSave, disabled: saving, className: "px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50", children: [saving ? (_jsx(Loader2, { size: 14, className: "inline mr-1 animate-spin" })) : (_jsx(Save, { size: 14, className: "inline mr-1" })), "Enregistrer"] })] })) : (_jsxs("button", { onClick: (e) => {
                                e.stopPropagation();
                                onEdit();
                            }, className: "px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary/5 transition", children: [_jsx(Pencil, { size: 14, className: "inline mr-1" }), "Modifier"] })) })] }))] }));
}
