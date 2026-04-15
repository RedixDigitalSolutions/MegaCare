import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Mic, MicOff, Video, VideoOff, MessageCircle, Paperclip, Settings, Phone, Clock, } from "lucide-react";
export default function VideoConsultationPage() {
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [activePanel, setActivePanel] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [messages, setMessages] = useState([
        {
            id: 1,
            author: "doctor",
            text: "Bonjour Fatima, comment allez-vous?",
            time: "14:00",
        },
        {
            id: 2,
            author: "patient",
            text: "Bonjour Dr. Mansouri, ça va bien merci.",
            time: "14:01",
        },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [prescriptionMed, setPrescriptionMed] = useState("");
    const [prescriptionDosage, setPrescriptionDosage] = useState("");
    const [prescriptionDuration, setPrescriptionDuration] = useState("");
    const [prescriptionList, setPrescriptionList] = useState([]);
    const [prescriptionStatus, setPrescriptionStatus] = useState("idle");
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };
    const handleSendMessage = () => {
        if (inputMessage.trim()) {
            setMessages([
                ...messages,
                {
                    id: messages.length + 1,
                    author: "patient",
                    text: inputMessage,
                    time: new Date().toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                },
            ]);
            setInputMessage("");
        }
    };
    const handleAddPrescriptionItem = () => {
        if (!prescriptionMed.trim())
            return;
        setPrescriptionList((prev) => [
            ...prev,
            {
                med: prescriptionMed,
                dosage: prescriptionDosage,
                duration: prescriptionDuration,
            },
        ]);
        setPrescriptionMed("");
        setPrescriptionDosage("");
        setPrescriptionDuration("");
    };
    const handleSendPrescription = async () => {
        if (prescriptionList.length === 0)
            return;
        setPrescriptionStatus("sending");
        try {
            const token = localStorage.getItem("megacare_token");
            const res = await fetch("/api/prescriptions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ medicines: prescriptionList }),
            });
            if (!res.ok)
                throw new Error("Failed");
            setPrescriptionStatus("sent");
            setPrescriptionList([]);
        }
        catch {
            setPrescriptionStatus("error");
        }
    };
    return (_jsxs("div", { className: "h-screen bg-sidebar text-sidebar-foreground overflow-hidden flex flex-col", children: [_jsxs("div", { className: "bg-sidebar-primary/10 backdrop-blur-sm border-b border-sidebar-border px-6 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-lg", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), _jsx("div", { children: _jsx("p", { className: "font-semibold text-sidebar-foreground text-sm", children: "Dr. Amira Mansouri \u2014 Cardiologue" }) })] }), _jsxs("div", { className: "flex items-center gap-6 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2 text-green-400", children: [_jsx(Clock, { size: 16 }), _jsx("span", { className: "font-mono font-bold", children: formatTime(elapsedTime) })] }), _jsx("div", { className: "flex items-center gap-2 text-sidebar-foreground/70", children: "\uD83D\uDCE1 Chiffr\u00E9 E2E" })] })] }), _jsxs("div", { className: "flex-1 flex", children: [_jsxs("div", { className: "flex-1 bg-sidebar/50 relative flex items-center justify-center overflow-hidden", children: [_jsxs("div", { className: "text-center space-y-4", children: [_jsx("div", { className: "w-40 h-40 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-6xl mx-auto animate-pulse", children: "\uD83D\uDC68\u200D\u2695\uFE0F" }), _jsx("p", { className: "text-sidebar-foreground/80 font-medium", children: "Dr. Amira Mansouri" })] }), _jsx("div", { className: "absolute bottom-6 right-6 w-40 h-28 bg-sidebar-primary rounded-lg border-2 border-primary flex items-center justify-center text-4xl", children: "\uD83D\uDC64" })] }), _jsx("div", { className: `bg-sidebar border-l border-sidebar-border transition-all duration-300 flex flex-col ${activePanel ? "w-80" : "w-0"}`, children: activePanel && (_jsxs(_Fragment, { children: [_jsx("div", { className: "flex border-b border-sidebar-border", children: ["chat", "files", "prescription"].map((tab) => (_jsx("button", { onClick: () => setActivePanel(tab === activePanel ? null : tab), className: `flex-1 py-3 text-sm font-medium transition border-b-2 ${activePanel === tab
                                            ? "border-primary text-primary"
                                            : "border-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground"}`, children: tab === "chat"
                                            ? "💬 Chat"
                                            : tab === "files"
                                                ? "📁 Fichiers"
                                                : "📋 Ordonnance" }, tab))) }), _jsxs("div", { className: "flex-1 overflow-auto p-4", children: [activePanel === "chat" && (_jsx("div", { className: "space-y-4", children: messages.map((msg) => (_jsx("div", { className: `flex ${msg.author === "patient" ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-xs px-4 py-2 rounded-lg ${msg.author === "patient"
                                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                                        : "bg-sidebar-primary text-sidebar-foreground rounded-bl-none"}`, children: [_jsx("p", { className: "text-sm", children: msg.text }), _jsx("p", { className: `text-xs ${msg.author === "patient"
                                                                ? "text-primary-foreground/70"
                                                                : "text-sidebar-foreground/70"}`, children: msg.time })] }) }, msg.id))) })), activePanel === "files" && (_jsxs("div", { className: "space-y-3 text-center py-6", children: [_jsx(Paperclip, { size: 32, className: "text-sidebar-foreground/40 mx-auto" }), _jsx("p", { className: "text-sm text-sidebar-foreground/70", children: "Aucun fichier partag\u00E9" }), _jsx("button", { className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition", children: "Ajouter un fichier" })] })), activePanel === "prescription" && (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "bg-sidebar-primary/10 rounded-lg p-4 space-y-3", children: [_jsx("h4", { className: "font-semibold text-sidebar-foreground", children: "Cr\u00E9er une ordonnance" }), prescriptionList.length > 0 && (_jsx("ul", { className: "space-y-1", children: prescriptionList.map((item, i) => (_jsxs("li", { className: "text-xs text-sidebar-foreground/80 bg-sidebar-border rounded px-2 py-1", children: [item.med, item.dosage ? ` — ${item.dosage}` : "", item.duration ? ` (${item.duration})` : ""] }, i))) })), _jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "text", placeholder: "M\u00E9dicament...", value: prescriptionMed, onChange: (e) => setPrescriptionMed(e.target.value), className: "w-full px-3 py-2 bg-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded text-sm" }), _jsx("input", { type: "text", placeholder: "Dosage...", value: prescriptionDosage, onChange: (e) => setPrescriptionDosage(e.target.value), className: "w-full px-3 py-2 bg-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded text-sm" }), _jsx("input", { type: "text", placeholder: "Dur\u00E9e...", value: prescriptionDuration, onChange: (e) => setPrescriptionDuration(e.target.value), className: "w-full px-3 py-2 bg-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded text-sm" })] }), _jsx("button", { onClick: handleAddPrescriptionItem, disabled: !prescriptionMed.trim(), className: "w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition font-medium disabled:opacity-50", children: "Ajouter un m\u00E9dicament" }), prescriptionStatus === "sent" && (_jsx("p", { className: "text-xs text-green-400 text-center", children: "Ordonnance envoy\u00E9e \u2713" })), prescriptionStatus === "error" && (_jsx("p", { className: "text-xs text-red-400 text-center", children: "Erreur lors de l'envoi" })), _jsx("button", { onClick: handleSendPrescription, disabled: prescriptionList.length === 0 ||
                                                            prescriptionStatus === "sending", className: "w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition font-medium disabled:opacity-50", children: prescriptionStatus === "sending"
                                                            ? "Envoi..."
                                                            : "Envoyer l'ordonnance" })] }) }))] }), activePanel === "chat" && (_jsx("div", { className: "border-t border-sidebar-border p-3 space-y-2", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", value: inputMessage, onChange: (e) => setInputMessage(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSendMessage(), placeholder: "Votre message...", className: "flex-1 px-3 py-2 bg-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded text-sm" }), _jsx("button", { onClick: handleSendMessage, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-sm font-medium", children: "Envoyer" })] }) }))] })) })] }), _jsxs("div", { className: "bg-sidebar-primary/10 border-t border-sidebar-border px-6 py-4 flex items-center justify-center gap-4", children: [_jsx("button", { onClick: () => setIsMuted(!isMuted), className: `w-14 h-14 rounded-full transition flex items-center justify-center ${isMuted
                            ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                            : "bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30"}`, children: isMuted ? _jsx(MicOff, { size: 24 }) : _jsx(Mic, { size: 24 }) }), _jsx("button", { onClick: () => setIsVideoOff(!isVideoOff), className: `w-14 h-14 rounded-full transition flex items-center justify-center ${isVideoOff
                            ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
                            : "bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30"}`, children: isVideoOff ? _jsx(VideoOff, { size: 24 }) : _jsx(Video, { size: 24 }) }), _jsx("button", { onClick: () => setActivePanel(activePanel === "chat" ? null : "chat"), className: `w-14 h-14 rounded-full transition flex items-center justify-center ${activePanel === "chat"
                            ? "bg-primary text-primary-foreground"
                            : "bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30"}`, children: _jsx(MessageCircle, { size: 24 }) }), _jsx("button", { onClick: () => setActivePanel(activePanel === "files" ? null : "files"), className: `w-14 h-14 rounded-full transition flex items-center justify-center ${activePanel === "files"
                            ? "bg-primary text-primary-foreground"
                            : "bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30"}`, children: _jsx(Paperclip, { size: 24 }) }), _jsx("button", { className: "w-14 h-14 rounded-full bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30 transition flex items-center justify-center", children: _jsx(Settings, { size: 24 }) }), _jsx("button", { className: "w-16 h-14 rounded-full bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center font-bold text-lg ml-4", children: _jsx(Phone, { size: 24 }) })] })] }));
}
