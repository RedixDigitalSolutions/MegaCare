import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { useSocket } from "@/hooks/use-socket";
import { useWebRTC } from "@/hooks/use-webrtc";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Send, User, Stethoscope, Pill, Plus, Trash2, CheckCircle, ClipboardList, AlertTriangle, MessageCircle, X, } from "lucide-react";
export default function LiveConsultationPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const socket = useSocket();
    // Consultation info from sessionStorage
    const [patientName, setPatientName] = useState("");
    const [patientId, setPatientId] = useState("");
    const [appointmentId, setAppointmentId] = useState("");
    const [consultationType, setConsultationType] = useState("Vidéo");
    // WebRTC
    const { localVideoRef, remoteVideoRef, cameraOn, micOn, connected: rtcConnected, mediaError, toggleCamera, toggleMic, endCall, } = useWebRTC({ socket, partnerId: patientId, initiator: true });
    // Chat
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const chatEndRef = useRef(null);
    const selectedPartnerRef = useRef("");
    // Clinical notes
    const [symptoms, setSymptoms] = useState("");
    const [observations, setObservations] = useState("");
    const [diagnosis, setDiagnosis] = useState("");
    const [medications, setMedications] = useState([
        { name: "", dosage: "" },
    ]);
    const [followUp, setFollowUp] = useState("");
    const [privateNotes, setPrivateNotes] = useState("");
    // State
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [chatOpen, setChatOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    // Load consultation info from sessionStorage
    useEffect(() => {
        const data = sessionStorage.getItem("live_consultation");
        if (data) {
            const parsed = JSON.parse(data);
            setPatientName(parsed.patientName || "Patient");
            setPatientId(parsed.patientId || "");
            setAppointmentId(parsed.appointmentId || "");
            setConsultationType(parsed.type || "Vidéo");
            selectedPartnerRef.current = parsed.patientId || "";
        }
    }, []);
    // Timer
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);
    // Load chat thread
    useEffect(() => {
        if (!patientId)
            return;
        const token = localStorage.getItem("megacare_token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        fetch(`/api/messages/thread/${patientId}`, { headers })
            .then((res) => res.json())
            .then((j) => {
            const data = Array.isArray(j) ? j : (j.data ?? []);
            setChatMessages(data);
        })
            .catch(() => { });
    }, [patientId]);
    // Socket.IO — receive messages
    useEffect(() => {
        if (!socket || !patientId)
            return;
        const handleReceive = (msg) => {
            const partner = selectedPartnerRef.current;
            if (partner && (msg.senderId === partner || msg.receiverId === partner)) {
                setChatMessages((prev) => {
                    if (prev.some((m) => m.id === msg.id))
                        return prev;
                    return [...prev, msg];
                });
                if (msg.senderId === partner) {
                    setChatOpen((open) => {
                        if (!open)
                            setUnreadCount((c) => c + 1);
                        return open;
                    });
                }
            }
        };
        socket.on("message:receive", handleReceive);
        return () => {
            socket.off("message:receive", handleReceive);
        };
    }, [socket, patientId]);
    // Auto-scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);
    useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
            navigate("/login");
        }
    }, [isLoading, isAuthenticated, user, navigate]);
    if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
        return null;
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };
    const sendChatMessage = async () => {
        if (!newMessage.trim() || !patientId)
            return;
        const token = localStorage.getItem("megacare_token");
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        };
        const res = await fetch("/api/messages", {
            method: "POST",
            headers,
            body: JSON.stringify({
                receiverId: patientId,
                content: newMessage.trim(),
            }),
        });
        if (res.ok) {
            const msg = await res.json();
            setNewMessage("");
            setChatMessages((prev) => [...prev, msg]);
            if (socket) {
                socket.emit("message:sent", msg);
            }
        }
    };
    const addMedication = () => {
        setMedications((prev) => [...prev, { name: "", dosage: "" }]);
    };
    const removeMedication = (index) => {
        setMedications((prev) => prev.filter((_, i) => i !== index));
    };
    const updateMedication = (index, field, value) => {
        setMedications((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
    };
    const completeConsultation = async () => {
        if (!patientId)
            return;
        setSaving(true);
        try {
            const token = localStorage.getItem("megacare_token");
            const res = await fetch(`/api/dossier/${patientId}/consultation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    symptoms,
                    observations,
                    diagnosis,
                    medications: medications.filter((m) => m.name.trim()),
                    followUp,
                    notes: privateNotes,
                }),
            });
            if (res.ok) {
                // Mark appointment as completed so neither side can rejoin
                if (appointmentId) {
                    await fetch(`/api/appointments/${appointmentId}/status`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ status: "completed" }),
                    });
                }
                endCall();
                setSaved(true);
                sessionStorage.removeItem("live_consultation");
                setTimeout(() => {
                    navigate("/doctor-dashboard/consultations");
                }, 2000);
            }
        }
        catch {
            // silently fail
        }
        finally {
            setSaving(false);
        }
    };
    const endConsultation = () => {
        endCall();
        sessionStorage.removeItem("live_consultation");
        navigate("/doctor-dashboard/consultations");
    };
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, { doctorName: user.firstName || "Amira Mansouri", livePatientName: patientName }), _jsxs("main", { className: "flex-1 overflow-auto", children: [_jsxs("div", { className: "bg-card border-b border-border p-4 sticky top-0 z-10 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "relative flex h-3 w-3", children: [_jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" }), _jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-red-500" })] }), _jsx("h1", { className: "text-xl font-bold text-foreground", children: "Consultation en direct" })] }), _jsx("span", { className: "text-muted-foreground", children: "\u00B7" }), _jsx("span", { className: "text-muted-foreground font-medium", children: patientName }), _jsx("span", { className: "text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-mono", children: formatTime(elapsedTime) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: endConsultation, className: "flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium", children: [_jsx(PhoneOff, { size: 16 }), "Quitter"] }), _jsxs("button", { onClick: () => {
                                                setChatOpen((o) => !o);
                                                setUnreadCount(0);
                                            }, className: "relative flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition text-sm font-medium", children: [_jsx(MessageCircle, { size: 16 }), "Chat", unreadCount > 0 && (_jsx("span", { className: "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1", children: unreadCount }))] })] })] }), _jsxs("div", { className: "p-4 flex gap-4 h-[calc(100vh-65px)] relative", children: [_jsxs("div", { className: "w-80 xl:w-96 flex-shrink-0 flex flex-col gap-3", children: [_jsxs("div", { className: "bg-gray-900 rounded-xl relative flex items-center justify-center overflow-hidden", style: { aspectRatio: "3/4" }, children: [_jsx("video", { ref: remoteVideoRef, autoPlay: true, playsInline: true, className: "absolute inset-0 w-full h-full object-cover" }), !rtcConnected && (_jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10", children: _jsx("div", { className: "text-center px-3", children: mediaError ? (_jsxs(_Fragment, { children: [_jsx(AlertTriangle, { size: 36, className: "text-amber-500 mx-auto mb-2" }), _jsx("p", { className: "text-amber-400 text-xs", children: mediaError })] })) : (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-8 h-8 border-4 border-gray-600 border-t-primary rounded-full animate-spin mx-auto mb-2" }), _jsxs("p", { className: "text-gray-400 text-xs", children: ["En attente de ", patientName, "..."] })] })) }) })), _jsxs("div", { className: "absolute bottom-2 right-2 w-24 h-20 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden z-20", children: [_jsx("video", { ref: localVideoRef, autoPlay: true, playsInline: true, muted: true, className: "w-full h-full object-cover" }), !cameraOn && (_jsx("div", { className: "absolute inset-0 bg-gray-800 flex items-center justify-center", children: _jsx(VideoOff, { size: 14, className: "text-gray-500" }) })), _jsx("p", { className: "absolute bottom-0.5 left-0.5 text-[9px] text-white/70 bg-black/50 px-1 rounded", children: "Vous" })] }), _jsxs("div", { className: "absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 z-20", children: [_jsx("button", { onClick: toggleCamera, className: `p-2 rounded-full transition ${cameraOn
                                                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                                                : "bg-red-500 text-white hover:bg-red-600"}`, children: cameraOn ? _jsx(Video, { size: 16 }) : _jsx(VideoOff, { size: 16 }) }), _jsx("button", { onClick: toggleMic, className: `p-2 rounded-full transition ${micOn
                                                                ? "bg-gray-700 text-white hover:bg-gray-600"
                                                                : "bg-red-500 text-white hover:bg-red-600"}`, children: micOn ? _jsx(Mic, { size: 16 }) : _jsx(MicOff, { size: 16 }) })] })] }), _jsx("div", { className: "bg-card border border-border rounded-xl px-4 py-3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center", children: _jsx(User, { size: 14, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: patientName }), _jsx("p", { className: "text-xs text-green-500", children: rtcConnected ? "Connecté" : "En attente..." })] })] }) })] }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "bg-card border border-border rounded-xl p-5 space-y-5", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(ClipboardList, { size: 18, className: "text-primary" }), _jsx("h2", { className: "font-bold text-lg text-foreground", children: "Donn\u00E9es cliniques" }), _jsx("span", { className: "text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-2", children: "Priv\u00E9 \u2014 non visible par le patient" })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsxs("label", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5", children: [_jsx(Stethoscope, { size: 14, className: "text-blue-500" }), "Sympt\u00F4mes rapport\u00E9s"] }), _jsx("textarea", { value: symptoms, onChange: (e) => setSymptoms(e.target.value), placeholder: "D\u00E9crire les sympt\u00F4mes rapport\u00E9s par le patient...", className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none", rows: 3 })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5", children: [_jsx(ClipboardList, { size: 14, className: "text-emerald-500" }), "Observations cliniques"] }), _jsx("textarea", { value: observations, onChange: (e) => setObservations(e.target.value), placeholder: "Vos observations durant la consultation...", className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none", rows: 3 })] })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground mb-1.5 block", children: "Diagnostic" }), _jsx("input", { value: diagnosis, onChange: (e) => setDiagnosis(e.target.value), placeholder: "Diagnostic pos\u00E9...", className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" })] }), _jsxs("div", { children: [_jsxs("label", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5", children: [_jsx(Pill, { size: 14, className: "text-purple-500" }), "M\u00E9dicaments prescrits"] }), _jsxs("div", { className: "space-y-2", children: [medications.map((med, index) => (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { value: med.name, onChange: (e) => updateMedication(index, "name", e.target.value), placeholder: "Nom du m\u00E9dicament", className: "flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" }), _jsx("input", { value: med.dosage, onChange: (e) => updateMedication(index, "dosage", e.target.value), placeholder: "Posologie", className: "w-40 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" }), medications.length > 1 && (_jsx("button", { onClick: () => removeMedication(index), className: "p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition", children: _jsx(Trash2, { size: 14 }) }))] }, index))), _jsxs("button", { onClick: addMedication, className: "flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium mt-1", children: [_jsx(Plus, { size: 14 }), "Ajouter un m\u00E9dicament"] })] })] }), _jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-5", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground mb-1.5 block", children: "Suivi recommand\u00E9" }), _jsx("input", { value: followUp, onChange: (e) => setFollowUp(e.target.value), placeholder: "Ex: Contr\u00F4le dans 3 mois, bilan sanguin...", className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-semibold text-foreground mb-1.5 block", children: "Notes priv\u00E9es" }), _jsx("textarea", { value: privateNotes, onChange: (e) => setPrivateNotes(e.target.value), placeholder: "Notes personnelles (non partag\u00E9es)...", className: "w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none", rows: 2 })] })] }), _jsx("div", { className: "pt-2", children: saved ? (_jsxs("div", { className: "flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3", children: [_jsx(CheckCircle, { size: 18 }), _jsx("span", { className: "text-sm font-medium", children: "Consultation enregistr\u00E9e dans le dossier m\u00E9dical du patient." })] })) : (_jsxs("button", { onClick: completeConsultation, disabled: saving || !diagnosis.trim(), className: "w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed", children: [_jsx(CheckCircle, { size: 16 }), saving
                                                            ? "Enregistrement..."
                                                            : "Terminer la consultation"] })) })] }) }), chatOpen && (_jsxs("div", { className: "absolute bottom-4 right-4 w-96 h-[28rem] bg-card border border-border rounded-xl shadow-2xl flex flex-col z-30 animate-in slide-in-from-bottom-2 duration-200", children: [_jsxs("div", { className: "px-4 py-3 border-b border-border flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center", children: _jsx(User, { size: 14, className: "text-primary" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: patientName }), _jsx("p", { className: "text-[10px] text-green-500", children: "En consultation" })] })] }), _jsx("button", { onClick: () => setChatOpen(false), className: "p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground", children: _jsx(X, { size: 16 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-3", children: [chatMessages.length === 0 && (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground text-sm", children: [_jsx(Send, { size: 24, className: "mb-2 opacity-40" }), _jsx("p", { children: "Aucun message" }), _jsx("p", { className: "text-xs", children: "Commencez \u00E0 discuter avec le patient" })] })), chatMessages.map((msg) => {
                                                    const isMine = msg.senderId === user?.id;
                                                    return (_jsx("div", { className: `flex ${isMine ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-[80%] rounded-xl px-3 py-2 text-sm ${isMine
                                                                ? "bg-primary text-primary-foreground rounded-br-sm"
                                                                : "bg-muted text-foreground rounded-bl-sm"}`, children: [_jsx("p", { children: msg.content }), _jsx("p", { className: `text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`, children: new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit",
                                                                    }) })] }) }, msg.id));
                                                }), _jsx("div", { ref: chatEndRef })] }), _jsx("div", { className: "px-3 py-3 border-t border-border", children: _jsxs("div", { className: "flex gap-2", children: [_jsx("input", { value: newMessage, onChange: (e) => setNewMessage(e.target.value), onKeyDown: (e) => {
                                                            if (e.key === "Enter" && !e.shiftKey) {
                                                                e.preventDefault();
                                                                sendChatMessage();
                                                            }
                                                        }, placeholder: "\u00C9crire un message...", className: "flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none" }), _jsx("button", { onClick: sendChatMessage, disabled: !newMessage.trim(), className: "p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50", children: _jsx(Send, { size: 16 }) })] }) })] }))] })] })] }) }));
}
