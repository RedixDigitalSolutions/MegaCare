import { useState, useRef, useEffect } from "react";
import { ParamedicalDashboardSidebar } from "@/components/ParamedicalDashboardSidebar";
import {
  Send,
  Search,
  UserCircle2,
  Stethoscope,
  Shield,
  Circle,
} from "lucide-react";

interface Message {
  id: number;
  from: "me" | "other";
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  name: string;
  type: "doctor" | "admin";
  specialty?: string;
  initials: string;
  unread: number;
  messages: Message[];
}

const t = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

const INITIAL_CONVOS: Conversation[] = [
  {
    id: 1,
    name: "Dr. Amira Mansouri",
    type: "doctor",
    specialty: "Cardiologie",
    initials: "AM",
    unread: 3,
    messages: [
      { id: 1, from: "other", text: "Bonjour, veuillez m'envoyer le dernier bilan de votre patient.", time: "09:15" },
      { id: 2, from: "me",    text: "Bien reçu, je prépare ça.", time: "09:17" },
      { id: 3, from: "other", text: "Merci. Signes vitaux stables ?", time: "09:20" },
    ],
  },
  {
    id: 2,
    name: "Dr. Karim Ben Ali",
    type: "doctor",
    specialty: "Médecine générale",
    initials: "KB",
    unread: 1,
    messages: [
      { id: 1, from: "other", text: "Pouvez-vous confirmer la prise de médicaments du matin ?", time: "10:00" },
    ],
  },
  {
    id: 3,
    name: "Administration",
    type: "admin",
    initials: "AD",
    unread: 0,
    messages: [
      { id: 1, from: "other", text: "Rappel : réunion d'équipe vendredi à 14h.", time: "08:30" },
      { id: 2, from: "me",    text: "Noté, merci.", time: "08:45" },
    ],
  },
  {
    id: 4,
    name: "Dr. Sonia Troudi",
    type: "doctor",
    specialty: "Dermatologie",
    initials: "ST",
    unread: 0,
    messages: [
      { id: 1, from: "other", text: "Le patient du lit 7 a une réaction cutanée, photos reçues.", time: "11:00" },
    ],
  },
];

export default function ParamedicalMessagingPage() {
  const [convos, setConvos] = useState<Conversation[]>(INITIAL_CONVOS);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = convos.find((c) => c.id === selectedId)!;

  const filteredConvos = convos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length, selectedId]);

  const selectConvo = (id: number) => {
    setSelectedId(id);
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = t();
    const msg: Message = {
      id: Date.now(),
      from: "me",
      text: input.trim(),
      time: now,
    };
    setConvos((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, messages: [...c.messages, msg] } : c
      )
    );
    setInput("");
    // Simulated reply after 1.2s
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        from: "other",
        text: "Message bien reçu, je vous réponds rapidement.",
        time: t(),
      };
      setConvos((prev) =>
        prev.map((c) =>
          c.id === selectedId ? { ...c, messages: [...c.messages, reply] } : c
        )
      );
    }, 1200);
  };

  const totalUnread = convos.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <ParamedicalDashboardSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-card/50 shrink-0 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Messagerie</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalUnread > 0 ? `${totalUnread} message${totalUnread > 1 ? "s" : ""} non lu${totalUnread > 1 ? "s" : ""}` : "Aucun message non lu"}
            </p>
          </div>
        </div>

        <main className="flex-1 flex overflow-hidden">
          {/* ── LEFT: Conversation list ── */}
          <aside className="w-72 shrink-0 border-r border-border bg-card flex flex-col">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConvos.length === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-8">Aucun résultat</p>
              )}
              {filteredConvos.map((c) => {
                const last = c.messages[c.messages.length - 1];
                const isActive = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => selectConvo(c.id)}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border/60 transition ${
                      isActive ? "bg-primary/10" : "hover:bg-muted/50"
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      c.type === "admin" ? "bg-slate-200 text-slate-700" : "bg-primary/20 text-primary"
                    }`}>
                      {c.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-sm font-medium text-foreground truncate">{c.name}</span>
                        {c.unread > 0 && (
                          <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        {c.type === "doctor" ? (
                          <Stethoscope size={10} className="text-muted-foreground shrink-0" />
                        ) : (
                          <Shield size={10} className="text-muted-foreground shrink-0" />
                        )}
                        <span className="text-xs text-muted-foreground truncate">
                          {last ? last.text : "—"}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ── RIGHT: Chat thread ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Thread header */}
            <div className="px-5 py-3 border-b border-border bg-card/60 shrink-0 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                selected.type === "admin" ? "bg-slate-200 text-slate-700" : "bg-primary/20 text-primary"
              }`}>
                {selected.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {selected.type === "doctor" ? (
                    <><Stethoscope size={10} />{selected.specialty}</>
                  ) : (
                    <><Shield size={10} />Administration</>
                  )}
                </p>
              </div>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600">
                <Circle size={7} fill="currentColor" />
                En ligne
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-muted/20">
              {selected.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md rounded-xl px-4 py-2.5 text-sm ${
                    msg.from === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}>
                    <p className="leading-snug">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.from === "me" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-border bg-card/60 flex items-center gap-3 shrink-0">
              <input
                type="text"
                placeholder="Écrire un message… (Entrée pour envoyer)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
