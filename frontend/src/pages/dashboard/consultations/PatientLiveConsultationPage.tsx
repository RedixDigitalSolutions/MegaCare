import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
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
  AlertTriangle,
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

export default function PatientLiveConsultationPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();

  const [doctorName, setDoctorName] = useState("");
  const [doctorId, setDoctorId] = useState("");

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
  } = useWebRTC({ socket, partnerId: doctorId, initiator: false });

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const selectedPartnerRef = useRef<string>("");

  const [elapsedTime, setElapsedTime] = useState(0);

  // Load consultation info from sessionStorage
  useEffect(() => {
    const data = sessionStorage.getItem("patient_live_consultation");
    if (data) {
      const parsed = JSON.parse(data);
      setDoctorName(parsed.doctorName || "Médecin");
      setDoctorId(parsed.doctorId || "");
      selectedPartnerRef.current = parsed.doctorId || "";
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
    if (!doctorId) return;
    const token = localStorage.getItem("megacare_token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    fetch(`/api/messages/thread/${doctorId}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setChatMessages(data);
      })
      .catch(() => {});
  }, [doctorId]);

  // Socket.IO — receive messages
  useEffect(() => {
    if (!socket || !doctorId) return;

    const handleReceive = (msg: Message) => {
      const partner = selectedPartnerRef.current;
      if (partner && (msg.senderId === partner || msg.receiverId === partner)) {
        setChatMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };

    socket.on("message:receive", handleReceive);
    return () => {
      socket.off("message:receive", handleReceive);
    };
  }, [socket, doctorId]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "patient")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading || !isAuthenticated || !user || user.role !== "patient")
    return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const sendChatMessage = async () => {
    if (!newMessage.trim() || !doctorId) return;
    const token = localStorage.getItem("megacare_token");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch("/api/messages", {
      method: "POST",
      headers,
      body: JSON.stringify({
        receiverId: doctorId,
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

  const endConsultation = () => {
    endCall();
    sessionStorage.removeItem("patient_live_consultation");
    navigate("/dashboard/appointments");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DashboardSidebar
          userName={user.firstName}
          liveDoctorName={doctorName}
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
                Dr. {doctorName}
              </span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-mono">
                {formatTime(elapsedTime)}
              </span>
            </div>
            <button
              onClick={endConsultation}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              <PhoneOff size={16} />
              Quitter
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-65px)]">
            {/* LEFT: Video */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Video Area */}
              <div className="bg-gray-900 rounded-xl relative flex-1 min-h-[400px] flex items-center justify-center overflow-hidden">
                {/* Remote video (doctor) */}
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {!rtcConnected && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center z-10">
                    <div className="text-center">
                      {mediaError ? (
                        <>
                          <AlertTriangle
                            size={48}
                            className="text-amber-500 mx-auto mb-3"
                          />
                          <p className="text-amber-400 text-sm">{mediaError}</p>
                        </>
                      ) : (
                        <>
                          <div className="w-10 h-10 border-4 border-gray-600 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                          <p className="text-gray-400 text-sm">
                            En attente de connexion avec Dr. {doctorName}...
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Self-view mini (local camera) */}
                <div className="absolute bottom-3 right-3 w-36 h-28 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden z-20">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {!cameraOn && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <VideoOff size={18} className="text-gray-500" />
                    </div>
                  )}
                  <p className="absolute bottom-1 left-1 text-[10px] text-white/70 bg-black/50 px-1 rounded">
                    Vous
                  </p>
                </div>

                {/* Controls bar */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
                  <button
                    onClick={toggleCamera}
                    className={`p-2.5 rounded-full transition ${
                      cameraOn
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                  </button>
                  <button
                    onClick={toggleMic}
                    className={`p-2.5 rounded-full transition ${
                      micOn
                        ? "bg-gray-700 text-white hover:bg-gray-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {micOn ? <Mic size={18} /> : <MicOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT: Chat Panel */}
            <div className="flex flex-col bg-card border border-border rounded-xl overflow-hidden">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <User size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Dr. {doctorName}
                  </p>
                  <p className="text-xs text-green-500">En consultation</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                {chatMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                    <Send size={24} className="mb-2 opacity-40" />
                    <p>Aucun message</p>
                    <p className="text-xs">Discutez avec votre médecin</p>
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
                          {new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
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
          </div>
        </main>
      </div>
    </div>
  );
}
