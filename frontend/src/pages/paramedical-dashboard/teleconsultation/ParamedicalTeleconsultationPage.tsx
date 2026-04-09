import { useState, useEffect, useRef } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  Video,
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  Image as ImageIcon,
  Send,
  Clock,
  X,
  Star,
  UserCircle2,
  Search,
} from "lucide-react";

type DoctorStatus = "available" | "busy" | "offline";
type CallType = "video" | "audio";

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  status: DoctorStatus;
  rating: number;
  initials: string;
}

const DOCTORS: Doctor[] = [
  { id: 1, name: "Dr. Amira Mansouri",    specialty: "Cardiologie",        status: "available", rating: 4.8, initials: "AM" },
  { id: 2, name: "Dr. Karim Ben Ali",     specialty: "Médecine générale",  status: "available", rating: 4.6, initials: "KB" },
  { id: 3, name: "Dr. Sonia Troudi",      specialty: "Dermatologie",       status: "available", rating: 4.9, initials: "ST" },
  { id: 4, name: "Dr. Mehdi Hamouda",     specialty: "Rhumatologie",       status: "busy",      rating: 4.7, initials: "MH" },
  { id: 5, name: "Dr. Fatima Zahra Kssir",specialty: "Neurologie",         status: "busy",      rating: 4.5, initials: "FZ" },
  { id: 6, name: "Dr. Yassine Cherif",    specialty: "Diabétologie",       status: "offline",   rating: 4.4, initials: "YC" },
];

const statusConfig: Record<DoctorStatus, { label: string; dot: string }> = {
  available: { label: "Disponible", dot: "bg-green-500" },
  busy:      { label: "En appel",   dot: "bg-amber-400" },
  offline:   { label: "Hors ligne", dot: "bg-slate-400" },
};

interface ChatMsg {
  from: "me" | "doctor";
  text: string;
  time: string;
}

export default function ParamedicalTeleconsultationPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Doctor | null>(null);
  const [callType, setCallType] = useState<CallType | null>(null);
  const [callActive, setCallActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const filtered = DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  /* timer */
  useEffect(() => {
    if (callActive) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [callActive]);

  /* auto-scroll chat */
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const startCall = (type: CallType) => {
    setCallType(type);
    setCallActive(true);
    setSeconds(0);
    setMessages([
      { from: "doctor", text: `Bonjour, je suis ${selected!.name}. Comment puis-je vous aider ?`, time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) },
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
    if (!chatMsg.trim()) return;
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
    return (
      <div className="flex min-h-screen bg-background">
        <ParamedicalDashboardSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">Appel en cours</h1>
              <p className="text-sm text-muted-foreground">{selected.name} · {selected.specialty}</p>
            </div>
            <div className="flex items-center gap-2 text-sm font-mono bg-red-50 border border-red-200 text-red-700 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {formatTime(seconds)}
            </div>
          </div>

          <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
            {/* Video area */}
            <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center relative min-h-64">
              {callType === "video" && !camOff ? (
                <>
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                        <span className="text-3xl font-bold text-white">{selected.initials}</span>
                      </div>
                      <p className="text-white font-medium">{selected.name}</p>
                      <div className="flex items-center gap-2 justify-center text-slate-400 text-sm">
                        <Video size={14} />
                        <span>Vidéo en cours</span>
                      </div>
                    </div>
                  </div>
                  {/* Self preview */}
                  <div className="absolute bottom-4 right-4 w-24 h-16 rounded-lg bg-slate-600 border-2 border-white/20 flex items-center justify-center">
                    <span className="text-xs text-white/60">Vous</span>
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                    <span className="text-4xl font-bold text-white">{selected.initials}</span>
                  </div>
                  <p className="text-white font-semibold text-lg">{selected.name}</p>
                  <p className="text-slate-400 text-sm flex items-center gap-2 justify-center">
                    <Clock size={14} />
                    {formatTime(seconds)}
                  </p>
                  {callType === "audio" && <p className="text-slate-400 text-xs">Appel audio</p>}
                  {callType === "video" && camOff && <p className="text-slate-400 text-xs">Caméra désactivée</p>}
                </div>
              )}
            </div>

            {/* Chat panel */}
            {chatOpen && (
              <div className="w-full lg:w-80 bg-card border-l border-border flex flex-col shrink-0">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-foreground">Chat</h3>
                  <button onClick={() => setChatOpen(false)} className="p-1 text-muted-foreground hover:text-foreground transition">
                    <X size={16} />
                  </button>
                </div>
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                        m.from === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}>
                        <p>{m.text}</p>
                        <p className={`text-xs mt-1 ${m.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{m.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-3 border-t border-border flex gap-2">
                  <input
                    type="text"
                    placeholder="Message..."
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                    className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button onClick={sendMsg} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition">
                    <Send size={15} />
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Call controls */}
          <div className="bg-slate-900 border-t border-slate-700 px-6 py-4 flex items-center justify-center gap-4 shrink-0">
            <button
              onClick={() => setMuted((v) => !v)}
              className={`p-3 rounded-full transition ${muted ? "bg-red-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            {callType === "video" && (
              <button
                onClick={() => setCamOff((v) => !v)}
                className={`p-3 rounded-full transition ${camOff ? "bg-red-500 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}
                title={camOff ? "Caméra on" : "Caméra off"}
              >
                {camOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>
            )}
            <button
              onClick={() => setChatOpen((v) => !v)}
              className={`p-3 rounded-full transition ${chatOpen ? "bg-primary text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}
              title="Chat"
            >
              <MessageSquare size={20} />
            </button>
            <label className="p-3 rounded-full bg-slate-700 text-white hover:bg-slate-600 cursor-pointer transition" title="Partager une image">
              <ImageIcon size={20} />
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <button
              onClick={endCall}
              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition px-6"
              title="Raccrocher"
            >
              <PhoneOff size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── DOCTOR LIST ── */
  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground">Téléconsultation</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Appelez un médecin disponible</p>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <input
                type="text"
                placeholder="Rechercher par nom ou spécialité..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            {/* Doctor list */}
            <div className="space-y-3">
              {filtered.map((doc) => {
                const cfg = statusConfig[doc.status];
                const isSelected = selected?.id === doc.id;
                const canCall = doc.status === "available";
                return (
                  <div
                    key={doc.id}
                    onClick={() => canCall && setSelected(doc)}
                    className={`bg-card rounded-xl border p-4 transition ${
                      isSelected ? "border-primary bg-primary/5" :
                      canCall ? "border-border hover:border-primary/40 cursor-pointer" :
                      "border-border opacity-60 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">{doc.initials}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-foreground">{doc.name}</p>
                          <span className="flex items-center gap-1 text-xs text-amber-500">
                            <Star size={10} fill="currentColor" />{doc.rating}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
                        <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </div>
                    </div>

                    {/* Call options (visible when selected) */}
                    {isSelected && (
                      <div className="flex gap-3 mt-4 pt-4 border-t border-border">
                        <button
                          onClick={() => startCall("video")}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                        >
                          <Video size={15} />
                          Appel vidéo
                        </button>
                        <button
                          onClick={() => startCall("audio")}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition"
                        >
                          <Phone size={15} />
                          Appel audio
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
