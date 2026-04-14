import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { useSocket } from "@/hooks/use-socket";
import { useWebRTC } from "@/hooks/use-webrtc";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Send,
  User,
  Stethoscope,
  Pill,
  Plus,
  Trash2,
  CheckCircle,
  ClipboardList,
  AlertTriangle,
  MessageCircle,
  X,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  receiverId: string;
  receiverName: string;
  receiverRole: string;
  content: string;
  read: boolean;
  createdAt: string;
}

interface Medication {
  name: string;
  dosage: string;
}

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
  const {
    localVideoRef,
    remoteVideoRef,
    cameraOn,
    micOn,
    connected: rtcConnected,
    mediaError,
    toggleCamera,
    toggleMic,
    endCall,
  } = useWebRTC({ socket, partnerId: patientId, initiator: true });

  // Chat
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const selectedPartnerRef = useRef<string>("");

  // Clinical notes
  const [symptoms, setSymptoms] = useState("");
  const [observations, setObservations] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState<Medication[]>([
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
    if (!patientId) return;
    const token = localStorage.getItem("megacare_token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    fetch(`/api/messages/thread/${patientId}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setChatMessages(data);
      })
      .catch(() => {});
  }, [patientId]);

  // Socket.IO — receive messages
  useEffect(() => {
    if (!socket || !patientId) return;

    const handleReceive = (msg: Message) => {
      const partner = selectedPartnerRef.current;
      if (partner && (msg.senderId === partner || msg.receiverId === partner)) {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        if (msg.senderId === partner) {
          setChatOpen((open) => {
            if (!open) setUnreadCount((c) => c + 1);
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

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim() || !patientId) return;
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

  const removeMedication = (index: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string,
  ) => {
    setMedications((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)),
    );
  };

  const completeConsultation = async () => {
    if (!patientId) return;
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
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  const endConsultation = () => {
    endCall();
    sessionStorage.removeItem("live_consultation");
    navigate("/doctor-dashboard/consultations");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={user.firstName || "Amira Mansouri"}
          livePatientName={patientName}
        />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-card border-b border-border p-4 sticky top-0 z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
                <h1 className="text-xl font-bold text-foreground">
                  Consultation en direct
                </h1>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground font-medium">
                {patientName}
              </span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-mono">
                {formatTime(elapsedTime)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={endConsultation}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
              >
                <PhoneOff size={16} />
                Quitter
              </button>
              <button
                onClick={() => {
                  setChatOpen((o) => !o);
                  setUnreadCount(0);
                }}
                className="relative flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition text-sm font-medium"
              >
                <MessageCircle size={16} />
                Chat
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 flex gap-4 h-[calc(100vh-65px)] relative">
            {/* LEFT: Video Feed (reduced width) */}
            <div className="w-80 xl:w-96 flex-shrink-0 flex flex-col gap-3">
              {/* Video Area */}
              <div
                className="bg-gray-900 rounded-xl relative flex items-center justify-center overflow-hidden"
                style={{ aspectRatio: "3/4" }}
              >
                {/* Remote video (patient) */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {!rtcConnected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10">
                    <div className="text-center px-3">
                      {mediaError ? (
                        <>
                          <AlertTriangle
                            size={36}
                            className="text-amber-500 mx-auto mb-2"
                          />
                          <p className="text-amber-400 text-xs">{mediaError}</p>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 border-4 border-gray-600 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-gray-400 text-xs">
                            En attente de {patientName}...
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Self-view mini (local camera) */}
                <div className="absolute bottom-2 right-2 w-24 h-20 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden z-20">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!cameraOn && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <VideoOff size={14} className="text-gray-500" />
                    </div>
                  )}
                  <p className="absolute bottom-0.5 left-0.5 text-[9px] text-white/70 bg-black/50 px-1 rounded">
                    Vous
                  </p>
                </div>

                {/* Controls bar */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 z-20">
                  <button
                    onClick={toggleCamera}
                    className={`p-2 rounded-full transition ${
                      cameraOn
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {cameraOn ? <Video size={16} /> : <VideoOff size={16} />}
                  </button>
                  <button
                    onClick={toggleMic}
                    className={`p-2 rounded-full transition ${
                      micOn
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Patient info below video */}
              <div className="bg-card border border-border rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <User size={14} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {patientName}
                    </p>
                    <p className="text-xs text-green-500">
                      {rtcConnected ? "Connecté" : "En attente..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Clinical Notes (expanded) */}
            <div className="flex-1 overflow-auto">
              <div className="bg-card border border-border rounded-xl p-5 space-y-5">
                <div className="flex items-center gap-2 mb-1">
                  <ClipboardList size={18} className="text-primary" />
                  <h2 className="font-bold text-lg text-foreground">
                    Données cliniques
                  </h2>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full ml-2">
                    Privé — non visible par le patient
                  </span>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {/* Symptoms */}
                  <div>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                      <Stethoscope size={14} className="text-blue-500" />
                      Symptômes rapportés
                    </label>
                    <textarea
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="Décrire les symptômes rapportés par le patient..."
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      rows={3}
                    />
                  </div>

                  {/* Observations */}
                  <div>
                    <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                      <ClipboardList size={14} className="text-emerald-500" />
                      Observations cliniques
                    </label>
                    <textarea
                      value={observations}
                      onChange={(e) => setObservations(e.target.value)}
                      placeholder="Vos observations durant la consultation..."
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-1.5 block">
                    Diagnostic
                  </label>
                  <input
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="Diagnostic posé..."
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  />
                </div>

                {/* Medications */}
                <div>
                  <label className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-1.5">
                    <Pill size={14} className="text-purple-500" />
                    Médicaments prescrits
                  </label>
                  <div className="space-y-2">
                    {medications.map((med, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          value={med.name}
                          onChange={(e) =>
                            updateMedication(index, "name", e.target.value)
                          }
                          placeholder="Nom du médicament"
                          className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                        />
                        <input
                          value={med.dosage}
                          onChange={(e) =>
                            updateMedication(index, "dosage", e.target.value)
                          }
                          placeholder="Posologie"
                          className="w-40 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                        />
                        {medications.length > 1 && (
                          <button
                            onClick={() => removeMedication(index)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addMedication}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium mt-1"
                    >
                      <Plus size={14} />
                      Ajouter un médicament
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                  {/* Follow-up */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Suivi recommandé
                    </label>
                    <input
                      value={followUp}
                      onChange={(e) => setFollowUp(e.target.value)}
                      placeholder="Ex: Contrôle dans 3 mois, bilan sanguin..."
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                  </div>

                  {/* Private Notes */}
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-1.5 block">
                      Notes privées
                    </label>
                    <textarea
                      value={privateNotes}
                      onChange={(e) => setPrivateNotes(e.target.value)}
                      placeholder="Notes personnelles (non partagées)..."
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground resize-none focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Complete Button */}
                <div className="pt-2">
                  {saved ? (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <CheckCircle size={18} />
                      <span className="text-sm font-medium">
                        Consultation enregistrée dans le dossier médical du
                        patient.
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={completeConsultation}
                      disabled={saving || !diagnosis.trim()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle size={16} />
                      {saving
                        ? "Enregistrement..."
                        : "Terminer la consultation"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Floating Chat Popup */}
            {chatOpen && (
              <div className="absolute bottom-4 right-4 w-96 h-[28rem] bg-card border border-border rounded-xl shadow-2xl flex flex-col z-30 animate-in slide-in-from-bottom-2 duration-200">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <User size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {patientName}
                      </p>
                      <p className="text-[10px] text-green-500">
                        En consultation
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChatOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-muted transition text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {chatMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                      <Send size={24} className="mb-2 opacity-40" />
                      <p>Aucun message</p>
                      <p className="text-xs">
                        Commencez à discuter avec le patient
                      </p>
                    </div>
                  )}
                  {chatMessages.map((msg) => {
                    const isMine = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                            isMine
                              ? "bg-primary text-primary-foreground rounded-br-sm"
                              : "bg-muted text-foreground rounded-bl-sm"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p
                            className={`text-[10px] mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString(
                              "fr-FR",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <div className="px-3 py-3 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendChatMessage();
                        }
                      }}
                      placeholder="Écrire un message..."
                      className="flex-1 border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                    <button
                      onClick={sendChatMessage}
                      disabled={!newMessage.trim()}
                      className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
