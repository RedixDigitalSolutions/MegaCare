import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import { Video, Phone, PhoneOff, Mic, MicOff, VideoOff, MessageSquare, Image as ImageIcon, Send, Clock, X, Star, Search, } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const DOCTORS = [];
const statusConfig = {
    available: { label: "Disponible", dot: "bg-green-500" },
    busy: { label: "En appel", dot: "bg-amber-400" },
    offline: { label: "Hors ligne", dot: "bg-slate-400" },
};
export default function ParamedicalTeleconsultationPage() {
    const [doctors, setDoctors] = useState(DOCTORS);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [callType, setCallType] = useState(null);
    const [callActive, setCallActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [muted, setMuted] = useState(false);
    const [camOff, setCamOff] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMsg, setChatMsg] = useState("");
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);
    const timerRef = useRef(null);
    useEffect(() => {
        fetch("/api/doctors", { headers: { Authorization: `Bearer ${tok()}` } })
            .then((r) => r.json())
            .then((d) => {
            const list = Array.isArray(d)
                ? d.map((doc) => ({
                    id: doc.id,
                    name: doc.name,
                    specialty: doc.specialty || "",
                    status: "available",
                    rating: Number(doc.rating || 4.5),
                    initials: String(doc.name || "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
                }))
                : [];
            setDoctors(list);
        })
            .catch(() => { });
    }, []);
    const filtered = doctors.filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase()));
    /* timer */
    useEffect(() => {
        if (callActive) {
            timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        }
        else {
            if (timerRef.current)
                clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current)
            clearInterval(timerRef.current); };
    }, [callActive]);
    /* auto-scroll chat */
    useEffect(() => {
        chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }, [messages]);
    const formatTime = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, "0");
        const sec = (s % 60).toString().padStart(2, "0");
        return `${m}:${sec}`;
    };
    const startCall = (type) => {
        setCallType(type);
        setCallActive(true);
        setSeconds(0);
        setMessages([
            { from: "doctor", text: `Bonjour, je suis ${selected.name}. Comment puis-je vous aider ?`, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) },
        ]);
    };
    const endCall = () => {
        setCallActive(false);
        setCallType(null);
        setChatOpen(false);
        setMessages([]);
        setMuted(false);
        setCamOff(false);
        setSeconds(0);
    };
    const sendMsg = () => {
        if (!chatMsg.trim())
            return;
        const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        setMessages((prev) => [...prev, { from: "me", text: chatMsg.trim(), time: now }]);
        setChatMsg("");
        // Simulate reply
        setTimeout(() => {
            setMessages((prev) => [...prev, { from: "doctor", text: "Bien noté, je vous conseille de surveiller ce point.", time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]);
        }, 1500);
    };
    /* ── ACTIVE CALL SCREEN ── */
    if (callActive && selected) {
        return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Appel en cours" }), _jsxs("p", { className: "text-sm text-muted-foreground", children: [selected.name, " \u00B7 ", selected.specialty] })] }), _jsxs("div", { className: "flex items-center gap-2 text-sm font-mono bg-red-50 border border-red-200 text-red-700 px-4 py-1.5 rounded-full", children: [_jsx("span", { className: "w-2 h-2 rounded-full bg-red-500 animate-pulse" }), formatTime(seconds)] })] }), _jsxs("main", { className: "flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden", children: [_jsx("div", { className: "flex-1 bg-slate-900 flex flex-col items-center justify-center relative min-h-64", children: callType === "video" && !camOff ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center", children: _jsxs("div", { className: "text-center space-y-3", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto", children: _jsx("span", { className: "text-3xl font-bold text-white", children: selected.initials }) }), _jsx("p", { className: "text-white font-medium", children: selected.name }), _jsxs("div", { className: "flex items-center gap-2 justify-center text-slate-400 text-sm", children: [_jsx(Video, { size: 14 }), _jsx("span", { children: "Vid\u00E9o en cours" })] })] }) }), _jsx("div", { className: "absolute bottom-4 right-4 w-24 h-16 rounded-lg bg-slate-600 border-2 border-white/20 flex items-center justify-center", children: _jsx("span", { className: "text-xs text-white/60", children: "Vous" }) })] })) : (_jsxs("div", { className: "text-center space-y-4", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto", children: _jsx("span", { className: "text-4xl font-bold text-white", children: selected.initials }) }), _jsx("p", { className: "text-white font-semibold text-lg", children: selected.name }), _jsxs("p", { className: "text-slate-400 text-sm flex items-center gap-2 justify-center", children: [_jsx(Clock, { size: 14 }), formatTime(seconds)] }), callType === "audio" && _jsx("p", { className: "text-slate-400 text-xs", children: "Appel audio" }), callType === "video" && camOff && _jsx("p", { className: "text-slate-400 text-xs", children: "Cam\u00E9ra d\u00E9sactiv\u00E9e" })] })) }), chatOpen && (_jsxs("div", { className: "w-full lg:w-80 bg-card border-l border-border flex flex-col shrink-0", children: [_jsxs("div", { className: "px-4 py-3 border-b border-border flex items-center justify-between", children: [_jsx("h3", { className: "font-semibold text-sm text-foreground", children: "Chat" }), _jsx("button", { onClick: () => setChatOpen(false), className: "p-1 text-muted-foreground hover:text-foreground transition", children: _jsx(X, { size: 16 }) })] }), _jsx("div", { ref: chatRef, className: "flex-1 overflow-y-auto p-4 space-y-3", children: messages.map((m, i) => (_jsx("div", { className: `flex ${m.from === "me" ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.from === "me"
                                                        ? "bg-primary text-primary-foreground"
                                                        : "bg-muted text-foreground"}`, children: [_jsx("p", { children: m.text }), _jsx("p", { className: `text-xs mt-1 ${m.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`, children: m.time })] }) }, i))) }), _jsxs("div", { className: "px-3 py-3 border-t border-border flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Message...", value: chatMsg, onChange: (e) => setChatMsg(e.target.value), onKeyDown: (e) => e.key === "Enter" && sendMsg(), className: "flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" }), _jsx("button", { onClick: sendMsg, className: "p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition", children: _jsx(Send, { size: 15 }) })] })] }))] }), _jsxs("div", { className: "bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-center gap-4 shrink-0", children: [_jsx("button", { onClick: () => setMuted((v) => !v), className: `p-3 rounded-full transition ${muted ? "bg-red-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`, title: muted ? "Unmute" : "Mute", children: muted ? _jsx(MicOff, { size: 20 }) : _jsx(Mic, { size: 20 }) }), callType === "video" && (_jsx("button", { onClick: () => setCamOff((v) => !v), className: `p-3 rounded-full transition ${camOff ? "bg-red-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`, title: camOff ? "Caméra on" : "Caméra off", children: camOff ? _jsx(VideoOff, { size: 20 }) : _jsx(Video, { size: 20 }) })), _jsx("button", { onClick: () => setChatOpen((v) => !v), className: `p-3 rounded-full transition ${chatOpen ? "bg-primary text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`, title: "Chat", children: _jsx(MessageSquare, { size: 20 }) }), _jsxs("label", { className: "p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 cursor-pointer transition", title: "Partager une image", children: [_jsx(ImageIcon, { size: 20 }), _jsx("input", { type: "file", accept: "image/*", className: "hidden" })] }), _jsx("button", { onClick: endCall, className: "p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6", title: "Raccrocher", children: _jsx(PhoneOff, { size: 20 }) })] })] })] }));
    }
    /* ── DOCTOR LIST ── */
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(ParamedicalDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsx("div", { className: "px-6 py-5 border-b border-border bg-card/50 shrink-0", children: _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "T\u00E9l\u00E9consultation" }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Appelez un m\u00E9decin disponible" })] }) }), _jsx("main", { className: "flex-1 overflow-y-auto p-6", children: _jsxs("div", { className: "max-w-3xl mx-auto space-y-5", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 16 }), _jsx("input", { type: "text", placeholder: "Rechercher par nom ou sp\u00E9cialit\u00E9...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40" })] }), _jsx("div", { className: "space-y-3", children: filtered.map((doc) => {
                                        const cfg = statusConfig[doc.status];
                                        const isSelected = selected?.id === doc.id;
                                        const canCall = doc.status === "available";
                                        return (_jsxs("div", { onClick: () => canCall && setSelected(doc), className: `bg-card rounded-xl border p-4 transition ${isSelected ? "border-primary bg-primary/5" :
                                                canCall ? "border-border hover:border-primary/40 cursor-pointer" :
                                                    "border-border opacity-60 cursor-not-allowed"}`, children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0", children: _jsx("span", { className: "text-sm font-bold text-primary", children: doc.initials }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("p", { className: "font-semibold text-sm text-foreground", children: doc.name }), _jsxs("span", { className: "flex items-center gap-1 text-xs text-amber-500", children: [_jsx(Star, { size: 10, fill: "currentColor" }), doc.rating] })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: doc.specialty })] }), _jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground shrink-0", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${cfg.dot}` }), cfg.label] })] }), isSelected && (_jsxs("div", { className: "flex gap-3 mt-4 pt-4 border-t border-border", children: [_jsxs("button", { onClick: () => startCall("video"), className: "flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition", children: [_jsx(Video, { size: 15 }), "Appel vid\u00E9o"] }), _jsxs("button", { onClick: () => startCall("audio"), className: "flex-1 flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition", children: [_jsx(Phone, { size: 15 }), "Appel audio"] })] }))] }, doc.id));
                                    }) })] }) })] })] }));
}
