import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Activity, Heart, Thermometer, Droplets, AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
function bpStatus(sbp, dbp) {
    if (sbp >= 160 || dbp >= 100)
        return "Critique";
    if (sbp >= 130 || dbp >= 80)
        return "Attention";
    return "Normal";
}
function hrStatus(hr) {
    if (hr > 110)
        return "Critique";
    if (hr > 100 || hr < 60)
        return "Attention";
    return "Normal";
}
function tempStatus(t) {
    if (t >= 39)
        return "Critique";
    if (t >= 37.3)
        return "Attention";
    return "Normal";
}
function spo2Status(s) {
    if (s < 90)
        return "Critique";
    if (s < 95)
        return "Attention";
    return "Normal";
}
function glucStatus(g) {
    if (g > 12 || g < 3.9)
        return "Critique";
    if (g > 7.8)
        return "Attention";
    return "Normal";
}
function toPatientVitals(name, records) {
    const latest = records[0] ?? { sbp: 0, dbp: 0, hr: 0, temp: 0, spo2: 0, glucose: 0, date: "" };
    return {
        name,
        vitals: [
            { label: "Tension Artérielle", value: `${latest.sbp}/${latest.dbp}`, unit: "mmHg", status: bpStatus(latest.sbp, latest.dbp), reference: "< 130/80", icon: Activity },
            { label: "Pouls", value: String(latest.hr), unit: "bpm", status: hrStatus(latest.hr), reference: "60–100", icon: Heart },
            { label: "Température", value: String(latest.temp), unit: "°C", status: tempStatus(latest.temp), reference: "36.1–37.2", icon: Thermometer },
            { label: "SpO₂", value: String(latest.spo2), unit: "%", status: spo2Status(latest.spo2), reference: "> 95", icon: Droplets },
            { label: "Glycémie", value: String(latest.glucose), unit: "mmol/L", status: glucStatus(latest.glucose), reference: "3.9–7.8", icon: Activity },
        ],
        history: records.map(v => ({ date: v.date, bp: `${v.sbp}/${v.dbp}`, pulse: v.hr, temp: v.temp, spo2: v.spo2, glucose: v.glucose })),
    };
}
const statusConfig = {
    Normal: { label: "Normal", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
    Attention: { label: "Attention", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", icon: AlertTriangle },
    Critique: { label: "Critique", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: AlertCircle },
};
export default function VitalsPage() {
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [patientList, setPatientList] = useState([]);
    const [patient, setPatient] = useState(null);
    useEffect(() => {
        fetch("/api/medical-service/patients", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then(d => {
            const list = Array.isArray(d) ? d : [];
            setPatientList(list);
            if (list.length)
                setSelectedPatientId(list[0].id);
        })
            .catch(() => { });
    }, []);
    useEffect(() => {
        if (!selectedPatientId)
            return;
        const pt = patientList.find(p => p.id === selectedPatientId);
        fetch(`/api/medical-service/vitals/${selectedPatientId}`, { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then(d => setPatient(toPatientVitals(pt?.name ?? "", Array.isArray(d) ? d : [])))
            .catch(() => { });
    }, [selectedPatientId, patientList]);
    if (!patient)
        return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsx("div", { className: "flex-1 flex items-center justify-center text-muted-foreground text-sm", children: "Chargement..." })] }));
    const hasCritical = patient.vitals.some((v) => v.status === "Critique");
    const hasAttention = patient.vitals.some((v) => v.status === "Attention");
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Constantes Vitales" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Surveillance des param\u00E8tres vitaux des patients" })] }), _jsx("select", { value: selectedPatientId, onChange: (e) => setSelectedPatientId(e.target.value), className: "border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary", children: patientList.map((p) => (_jsx("option", { value: p.id, children: p.name }, p.id))) })] }), _jsxs("main", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [hasCritical && (_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700", children: [_jsx(AlertCircle, { size: 18 }), _jsxs("span", { className: "text-sm font-medium", children: ["Alerte critique \u2014 Certaines constantes de ", patient.name, " n\u00E9cessitent une attention imm\u00E9diate."] })] })), !hasCritical && hasAttention && (_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700", children: [_jsx(AlertTriangle, { size: 18 }), _jsxs("span", { className: "text-sm font-medium", children: ["Constantes sous surveillance pour ", patient.name, "."] })] })), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4", children: patient.vitals.map((v) => {
                                    const cfg = statusConfig[v.status];
                                    const Icon = v.icon;
                                    const StatusIcon = cfg.icon;
                                    return (_jsxs("div", { className: `bg-card rounded-xl border-2 ${cfg.border} p-5 space-y-3`, children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("div", { className: `w-9 h-9 rounded-lg flex items-center justify-center ${cfg.bg}`, children: _jsx(Icon, { size: 18, className: cfg.color }) }), _jsxs("span", { className: `flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`, children: [_jsx(StatusIcon, { size: 11 }), cfg.label] })] }), _jsxs("div", { children: [_jsxs("p", { className: "text-2xl font-bold text-foreground", children: [v.value, " ", _jsx("span", { className: "text-sm font-normal text-muted-foreground", children: v.unit })] }), _jsx("p", { className: "text-xs text-muted-foreground mt-1", children: v.label }), _jsxs("p", { className: "text-xs text-muted-foreground/60", children: ["Ref : ", v.reference] })] })] }, v.label));
                                }) }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "px-5 py-3 border-b border-border", children: _jsx("h2", { className: "font-semibold text-foreground text-sm", children: "Historique des mesures" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border", children: [_jsx("th", { className: "px-5 py-3 text-left text-muted-foreground font-medium", children: "Date" }), _jsx("th", { className: "px-5 py-3 text-left text-muted-foreground font-medium", children: "TA (mmHg)" }), _jsx("th", { className: "px-5 py-3 text-left text-muted-foreground font-medium", children: "Pouls (bpm)" }), _jsx("th", { className: "px-5 py-3 text-left text-muted-foreground font-medium", children: "Temp. (\u00B0C)" }), _jsx("th", { className: "px-5 py-3 text-left text-muted-foreground font-medium", children: "SpO\u2082 (%)" }), _jsx("th", { className: "px-5 py-3 text-left text-muted-foreground font-medium", children: "Glc (mmol/L)" })] }) }), _jsx("tbody", { children: patient.history.map((h) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/30 transition", children: [_jsx("td", { className: "px-5 py-3 text-foreground", children: h.date }), _jsx("td", { className: "px-5 py-3 text-foreground", children: h.bp }), _jsx("td", { className: "px-5 py-3 text-foreground", children: h.pulse }), _jsx("td", { className: "px-5 py-3 text-foreground", children: h.temp }), _jsx("td", { className: "px-5 py-3 text-foreground", children: h.spo2 }), _jsx("td", { className: "px-5 py-3 text-foreground", children: h.glucose })] }, h.date))) })] }) })] })] })] })] }));
}
