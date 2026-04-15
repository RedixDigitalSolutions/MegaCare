import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { CheckCircle2, ChevronDown, Upload, PenLine, X, Image as ImageIcon, Eraser, FileCheck2, Clock, User, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const PATIENTS = [];
const CARE_TYPES = [
    "Pansement",
    "Injection",
    "Perfusion",
    "Kinésithérapie",
    "Prise de sang",
    "Cathéter",
    "Traitement de plaie",
    "Soins infirmiers",
    "Rééducation",
    "Massage thérapeutique",
];
const recentSessions = [];
const emptyForm = { patient: "", careType: "", notes: "" };
export default function CareRecordPage() {
    const [patients, setPatients] = useState(PATIENTS);
    const [sessions, setSessions] = useState(recentSessions);
    const [form, setForm] = useState(emptyForm);
    const [photos, setPhotos] = useState([]);
    const [signed, setSigned] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSig, setHasSig] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const canvasRef = useRef(null);
    const lastPos = useRef(null);
    useEffect(() => {
        fetch("/api/paramedical/patients", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => setPatients(Array.isArray(d) ? d.map((p) => p.name) : []))
            .catch(() => { });
        fetch("/api/paramedical/care-sessions", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => {
            const list = Array.isArray(d)
                ? d.map((s) => ({
                    id: s.id,
                    patient: s.patient,
                    careType: s.careType,
                    notes: s.notes,
                    photos: s.photos || 0,
                    signed: !!s.signed,
                    time: `${s.date || ""} ${s.time || ""}`.trim(),
                }))
                : [];
            setSessions(list);
        })
            .catch(() => { });
    }, []);
    /* ---------- canvas drawing ---------- */
    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        if ("touches" in e) {
            return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
        return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    };
    const startDraw = (e) => {
        e.preventDefault();
        setIsDrawing(true);
        lastPos.current = getPos(e);
    };
    const draw = (e) => {
        e.preventDefault();
        if (!isDrawing || !canvasRef.current)
            return;
        const ctx = canvasRef.current.getContext("2d");
        const pos = getPos(e);
        ctx.beginPath();
        ctx.strokeStyle = "#1d4ed8";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastPos.current = pos;
        setHasSig(true);
    };
    const stopDraw = () => setIsDrawing(false);
    const clearSig = () => {
        if (!canvasRef.current)
            return;
        canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHasSig(false);
        setSigned(false);
    };
    const confirmSig = () => {
        if (hasSig)
            setSigned(true);
    };
    /* ---------- photo upload ---------- */
    const handlePhotoChange = (e) => {
        if (e.target.files) {
            setPhotos((prev) => [...prev, ...Array.from(e.target.files)].slice(0, 5));
        }
    };
    const removePhoto = (idx) => setPhotos((prev) => prev.filter((_, i) => i !== idx));
    /* ---------- submit ---------- */
    const canSubmit = form.patient && form.careType && form.notes.trim().length >= 10 && signed;
    const handleSubmit = async () => {
        if (!canSubmit)
            return;
        const r = await fetch("/api/paramedical/care-sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify({
                patient: form.patient,
                careType: form.careType,
                notes: form.notes,
                photos: photos.length,
                signed,
            }),
        }).catch(() => null);
        if (r && r.ok) {
            const data = await r.json();
            setSessions((prev) => [
                {
                    id: data.id,
                    patient: data.patient,
                    careType: data.careType,
                    notes: data.notes,
                    photos: data.photos || 0,
                    signed: !!data.signed,
                    time: `${data.date || ""} ${data.time || ""}`.trim(),
                },
                ...prev,
            ]);
        }
        setSubmitted(true);
        setTimeout(() => {
            setForm(emptyForm);
            setPhotos([]);
            clearSig();
            setSubmitted(false);
        }, 2500);
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Dossier de soins" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Documentez et validez la session de soin" })] }) }), _jsx("main", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("div", { className: "max-w-2xl mx-auto space-y-5", children: [submitted && (_jsxs("div", { className: "flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-3", children: [_jsx(CheckCircle2, { size: 18, className: "text-green-500 shrink-0" }), _jsx("p", { className: "text-sm font-medium", children: "Session de soin enregistr\u00E9e avec succ\u00E8s !" })] })), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b border-border", children: _jsxs("h2", { className: "font-semibold text-sm text-foreground flex items-center gap-2", children: [_jsx(FileCheck2, { size: 15, className: "text-primary" }), "Nouvelle session de soin"] }) }), _jsxs("div", { className: "p-6 space-y-5", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: [_jsx(User, { size: 12, className: "inline mr-1" }), "Patient"] }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: form.patient, onChange: (e) => setForm({ ...form, patient: e.target.value }), className: "w-full appearance-none px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8", children: [_jsx("option", { value: "", children: "\u2014 S\u00E9lectionner \u2014" }), patients.map((p) => _jsx("option", { children: p }, p))] }), _jsx(ChevronDown, { size: 14, className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Type de soin" }), _jsxs("div", { className: "relative", children: [_jsxs("select", { value: form.careType, onChange: (e) => setForm({ ...form, careType: e.target.value }), className: "w-full appearance-none px-3 py-2.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 pr-8", children: [_jsx("option", { value: "", children: "\u2014 S\u00E9lectionner \u2014" }), CARE_TYPES.map((t) => _jsx("option", { children: t }, t))] }), _jsx(ChevronDown, { size: 14, className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" })] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: "Notes cliniques" }), _jsx("textarea", { rows: 4, placeholder: "Observations, \u00E9volution du patient, actes r\u00E9alis\u00E9s, r\u00E9actions \u00E9ventuelles...", value: form.notes, onChange: (e) => setForm({ ...form, notes: e.target.value }), className: "w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40" }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1 text-right", children: [form.notes.length, " caract\u00E8res", form.notes.length < 10 ? " (min. 10)" : ""] })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: [_jsx(ImageIcon, { size: 12, className: "inline mr-1" }), "Photos (optionnel, max 5)"] }), _jsxs("label", { className: "flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl p-5 cursor-pointer hover:border-primary/50 transition bg-background", children: [_jsx(Upload, { size: 20, className: "text-muted-foreground" }), _jsx("span", { className: "text-xs text-muted-foreground", children: "Cliquez ou d\u00E9posez des fichiers ici" }), _jsx("input", { type: "file", accept: "image/*", multiple: true, className: "hidden", onChange: handlePhotoChange })] }), photos.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-3", children: photos.map((f, i) => (_jsxs("div", { className: "relative group w-16 h-16 rounded-lg overflow-hidden border border-border", children: [_jsx("img", { src: URL.createObjectURL(f), alt: "", className: "w-full h-full object-cover" }), _jsx("button", { onClick: () => removePhoto(i), className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition", children: _jsx(X, { size: 14, className: "text-white" }) })] }, i))) }))] }), _jsxs("div", { children: [_jsxs("label", { className: "text-xs font-medium text-muted-foreground block mb-1.5", children: [_jsx(PenLine, { size: 12, className: "inline mr-1" }), "Signature du patient"] }), signed ? (_jsxs("div", { className: "flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3", children: [_jsx(CheckCircle2, { size: 16, className: "text-green-500 shrink-0" }), _jsx("p", { className: "text-sm text-green-800 font-medium", children: "Signature valid\u00E9e" }), _jsx("button", { onClick: clearSig, className: "ml-auto text-xs text-muted-foreground hover:text-foreground transition", children: "Effacer" })] })) : (_jsxs("div", { className: "border border-border rounded-xl overflow-hidden bg-background", children: [_jsx("canvas", { ref: canvasRef, width: 540, height: 120, className: "w-full h-28 touch-none cursor-crosshair", onMouseDown: startDraw, onMouseMove: draw, onMouseUp: stopDraw, onMouseLeave: stopDraw, onTouchStart: startDraw, onTouchMove: draw, onTouchEnd: stopDraw }), _jsxs("div", { className: "flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20", children: [_jsx("span", { className: "text-xs text-muted-foreground", children: "Signez dans le cadre ci-dessus" }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: clearSig, className: "flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition", children: [_jsx(Eraser, { size: 12 }), "Effacer"] }), _jsxs("button", { onClick: confirmSig, disabled: !hasSig, className: "flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed transition", children: [_jsx(CheckCircle2, { size: 12 }), "Valider"] })] })] })] }))] }), _jsxs("button", { onClick: handleSubmit, disabled: !canSubmit, className: "w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition disabled:opacity-40 disabled:cursor-not-allowed", children: [_jsx(FileCheck2, { size: 16 }), "Valider la session de soin"] }), !canSubmit && (_jsxs("p", { className: "text-xs text-center text-muted-foreground", children: [!form.patient || !form.careType ? "Sélectionnez un patient et un type de soin. " : "", form.notes.trim().length < 10 ? "Notes trop courtes. " : "", !signed ? "Signature patient requise." : ""] }))] })] }), _jsxs("div", { className: "bg-card rounded-xl border border-border overflow-hidden", children: [_jsx("div", { className: "px-6 py-4 border-b border-border", children: _jsxs("h2", { className: "font-semibold text-sm text-foreground flex items-center gap-2", children: [_jsx(Clock, { size: 14, className: "text-muted-foreground" }), "Sessions r\u00E9centes"] }) }), _jsx("div", { className: "divide-y divide-border", children: sessions.map((s) => (_jsxs("div", { className: "flex items-center gap-4 px-6 py-3.5", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: s.patient }), _jsxs("span", { className: "text-xs text-muted-foreground", children: ["\u2014 ", s.careType] })] }), _jsx("p", { className: "text-xs text-muted-foreground truncate", children: s.notes })] }), _jsxs("div", { className: "flex items-center gap-3 shrink-0 text-xs text-muted-foreground", children: [s.photos > 0 && _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(ImageIcon, { size: 11 }), s.photos] }), s.signed
                                                                ? _jsxs("span", { className: "flex items-center gap-1 text-green-600", children: [_jsx(CheckCircle2, { size: 11 }), "Sign\u00E9"] })
                                                                : _jsx("span", { className: "text-amber-600", children: "Non sign\u00E9" }), _jsx("span", { children: s.time })] })] }, s.id))) })] })] }) })] })] }));
}
