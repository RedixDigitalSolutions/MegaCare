import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { Activity, AlertTriangle, CheckCircle2, Heart, Thermometer, Droplets, Wind, UserCircle2, Save, ChevronRight, } from "lucide-react";
const THRESHOLDS = {
    sbp: { low: 90, high: 140, critHigh: 180, critLow: 80 },
    dbp: { low: 60, high: 90, critHigh: 110, critLow: 50 },
    hr: { low: 50, high: 100, critHigh: 130, critLow: 40 },
    temp: { low: 36.0, high: 37.5, critHigh: 39.5, critLow: 35.0 },
    spo2: { low: 95, critLow: 90 },
    glucose: { low: 70, high: 140, critHigh: 250, critLow: 55 },
};
const getStatus = (key, val) => {
    const t = THRESHOLDS[key];
    if ((t.critLow !== undefined && val < t.critLow) || (t.critHigh !== undefined && val > t.critHigh))
        return "critical";
    if ((t.low !== undefined && val < t.low) || (t.high !== undefined && val > t.high))
        return "warning";
    return "normal";
};
const statusStyle = {
    normal: { text: "text-green-600", bg: "bg-green-50", border: "border-green-200", label: "Normal" },
    warning: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Anormal" },
    critical: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "Critique" },
};
const tok = () => localStorage.getItem("megacare_token") ?? "";
const PATIENTS = [];
const EMPTY_FORM = { sbp: "", dbp: "", hr: "", temp: "", spo2: "", glucose: "" };
/* ── Field definitions ── */
const FIELDS = [
    { key: "sbp", label: "Pression systolique", unit: "mmHg", icon: Activity, placeholder: "ex: 120", step: "1" },
    { key: "dbp", label: "Pression diastolique", unit: "mmHg", icon: Activity, placeholder: "ex: 80", step: "1" },
    { key: "hr", label: "Fréquence cardiaque", unit: "bpm", icon: Heart, placeholder: "ex: 72", step: "1" },
    { key: "temp", label: "Température", unit: "°C", icon: Thermometer, placeholder: "ex: 36.8", step: "0.1" },
    { key: "spo2", label: "SpO₂", unit: "%", icon: Wind, placeholder: "ex: 98", step: "1" },
    { key: "glucose", label: "Glycémie", unit: "mg/dL", icon: Droplets, placeholder: "ex: 95", step: "1" },
];
export default function ParamedicalVitalsPage() {
    const [patients, setPatients] = useState(PATIENTS);
    const [selectedId, setSelectedId] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);
    const [saved, setSaved] = useState(false);
    useEffect(() => {
        fetch("/api/paramedical/patients", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => {
            const list = Array.isArray(d)
                ? d.map((p) => ({
                    id: p.id,
                    name: p.name,
                    age: p.age,
                    condition: p.condition,
                    lastEntry: p.nextAppointment || "",
                }))
                : [];
            setPatients(list);
            if (list.length)
                setSelectedId(list[0].id);
        })
            .catch(() => { });
    }, []);
    useEffect(() => {
        if (!selectedId)
            return;
        fetch(`/api/paramedical/vitals/${selectedId}`, { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => {
            const latest = Array.isArray(d) && d.length ? d[0] : null;
            if (!latest) {
                setForm(EMPTY_FORM);
                return;
            }
            setForm({
                sbp: latest.sbp != null ? String(latest.sbp) : "",
                dbp: latest.dbp != null ? String(latest.dbp) : "",
                hr: latest.hr != null ? String(latest.hr) : "",
                temp: latest.temp != null ? String(latest.temp) : "",
                spo2: latest.spo2 != null ? String(latest.spo2) : "",
                glucose: latest.glucose != null ? String(latest.glucose) : "",
            });
        })
            .catch(() => { });
    }, [selectedId]);
    const patient = patients.find((p) => p.id === selectedId) || null;
    if (!patient) {
        return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsx("div", { className: "flex-1 flex items-center justify-center text-muted-foreground text-sm", children: "Chargement..." })] }));
    }
    const getVal = (key) => {
        const val = parseFloat(form[key]);
        return isNaN(val) ? null : val;
    };
    const alerts = FIELDS.filter((f) => {
        const v = getVal(f.key);
        return v !== null && getStatus(f.key, v) !== "normal";
    });
    const hasCritical = alerts.some((f) => {
        const v = getVal(f.key);
        return v !== null && getStatus(f.key, v) === "critical";
    });
    const handleSave = async () => {
        await fetch("/api/paramedical/vitals", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify({
                patientId: selectedId,
                patientName: patient.name,
                sbp: form.sbp || undefined,
                dbp: form.dbp || undefined,
                hr: form.hr || undefined,
                temp: form.temp || undefined,
                spo2: form.spo2 || undefined,
                glucose: form.glucose || undefined,
            }),
        }).catch(() => { });
        setSaved(true);
        setTimeout(() => {
            setForm(EMPTY_FORM);
            setSaved(false);
        }, 2000);
    };
    const anyFilled = FIELDS.some((f) => form[f.key] !== "");
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Constantes vitales" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Saisie et suivi des param\u00E8tres physiologiques" })] }) }), _jsx("main", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto", children: [_jsxs("div", { className: "lg:w-64 shrink-0 space-y-2", children: [_jsx("h2", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3", children: "Patients" }), patients.map((p) => (_jsxs("button", { onClick: () => { setSelectedId(p.id); setForm(EMPTY_FORM); setSaved(false); }, className: `w-full text-left p-3 rounded-xl border transition ${selectedId === p.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border bg-card hover:border-primary/40"}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(UserCircle2, { size: 16, className: selectedId === p.id ? "text-primary" : "text-muted-foreground" }), _jsx("p", { className: "text-sm font-medium text-foreground truncate", children: p.name }), selectedId === p.id && _jsx(ChevronRight, { size: 12, className: "text-primary ml-auto shrink-0" })] }), _jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 pl-6", children: [p.age, " ans \u00B7 ", p.condition] }), _jsxs("p", { className: "text-xs text-muted-foreground pl-6", children: ["Dernier : ", p.lastEntry] })] }, p.id)))] }), _jsxs("div", { className: "flex-1 min-w-0 space-y-4", children: [hasCritical && (_jsxs("div", { className: "flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-xl px-5 py-3", children: [_jsx(AlertTriangle, { size: 16, className: "text-red-500 shrink-0" }), _jsx("p", { className: "text-sm font-semibold", children: "Valeur critique d\u00E9tect\u00E9e \u2014 v\u00E9rifiez imm\u00E9diatement." })] })), saved && (_jsxs("div", { className: "flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-3", children: [_jsx(CheckCircle2, { size: 16, className: "text-green-500 shrink-0" }), _jsxs("p", { className: "text-sm font-medium", children: ["Constantes enregistr\u00E9es pour ", patient.name, "."] })] })), _jsxs("div", { className: "bg-card rounded-xl border border-border px-5 py-4 flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center", children: _jsx(UserCircle2, { size: 22, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground", children: patient.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [patient.age, " ans \u00B7 ", patient.condition] })] })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: FIELDS.map((f) => {
                                                const Icon = f.icon;
                                                const val = getVal(f.key);
                                                const status = val !== null ? getStatus(f.key, val) : null;
                                                const style = status ? statusStyle[status] : null;
                                                return (_jsxs("div", { className: `bg-card rounded-xl border p-4 transition ${style ? `${style.border} ${style.bg}` : "border-border"}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("label", { className: "text-xs font-medium text-muted-foreground flex items-center gap-1.5", children: [_jsx(Icon, { size: 13 }), f.label] }), status && (_jsxs("span", { className: `text-xs font-semibold flex items-center gap-1 ${style.text}`, children: [status === "critical" && _jsx(AlertTriangle, { size: 11 }), status === "normal" && _jsx(CheckCircle2, { size: 11 }), style.label] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "number", step: f.step, placeholder: f.placeholder, value: form[f.key], onChange: (e) => setForm({ ...form, [f.key]: e.target.value }), className: "flex-1 min-w-0 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" }), _jsx("span", { className: "text-xs text-muted-foreground shrink-0 w-12", children: f.unit })] }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1.5", children: ["Normal : ", f.key === "sbp" ? "90–140" :
                                                                    f.key === "dbp" ? "60–90" :
                                                                        f.key === "hr" ? "50–100" :
                                                                            f.key === "temp" ? "36–37.5" :
                                                                                f.key === "spo2" ? "≥95" :
                                                                                    "70–140", " ", f.unit] })] }, f.key));
                                            }) }), alerts.length > 0 && (_jsxs("div", { className: "bg-card rounded-xl border border-amber-200 overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-amber-200 bg-amber-50", children: _jsxs("h3", { className: "text-sm font-semibold text-amber-800 flex items-center gap-2", children: [_jsx(AlertTriangle, { size: 14 }), "Alertes d\u00E9tect\u00E9es (", alerts.length, ")"] }) }), _jsx("div", { className: "divide-y divide-border", children: alerts.map((f) => {
                                                        const v = getVal(f.key);
                                                        const s = getStatus(f.key, v);
                                                        return (_jsxs("div", { className: "flex items-center gap-3 px-5 py-2.5", children: [_jsx("span", { className: `w-2 h-2 rounded-full shrink-0 ${s === "critical" ? "bg-red-500" : "bg-amber-400"}` }), _jsxs("p", { className: "text-sm text-foreground flex-1", children: [_jsx("span", { className: "font-medium", children: f.label }), " : ", v, " ", f.unit] }), _jsx("span", { className: `text-xs font-semibold ${statusStyle[s].text}`, children: statusStyle[s].label })] }, f.key));
                                                    }) })] })), _jsxs("button", { onClick: handleSave, disabled: !anyFilled, className: "w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed", children: [_jsx(Save, { size: 15 }), "Enregistrer les constantes"] })] })] }) })] })] }));
}
