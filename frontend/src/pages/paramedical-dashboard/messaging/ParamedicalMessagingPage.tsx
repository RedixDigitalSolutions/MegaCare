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
  id: string;
  from: "me" | "other";
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  type: "doctor" | "admin";
  specialty?: string;
  initials: string;
  unread: number;
  messages: Message[];
}

const t = () => new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
const tok = () => localStorage.getItem("megacare_token") ?? "";

const INITIAL_CONVOS: Conversation[] = [];

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const myIdFromToken = () => {
  try {
    const payload = tok().split(".")[1] || "";
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json).id || "";
  } catch {
    return "";
  }
};

export default function ParamedicalMessagingPage() {
  const [convos, setConvos] = useState<Conversation[]>(INITIAL_CONVOS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = convos.find((c) => c.id === selectedId) || null;

  useEffect(() => {
    fetch("/api/messages/conversations", { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => {
        const list: Conversation[] = Array.isArray(d)
          ? d.map((c) => ({
            id: c.partnerId,
            name: c.partnerName,
            type: (c.partnerRole === "admin" ? "admin" : "doctor") as "admin" | "doctor",
            specialty: c.partnerRole,
            initials: initials(c.partnerName),
            unread: c.unread || 0,
            messages: c.lastMessage
              ? [{ id: c.lastMessage.id || c.lastMessage._id, from: (c.lastMessage.senderId === myIdFromToken() ? "me" : "other") as "me" | "other", text: c.lastMessage.content, time: new Date(c.lastMessage.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) }]
              : [],
          }))
          : [];
        setConvos(list);
        if (list.length) setSelectedId(list[0].id);
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/api/messages/thread/${selectedId}`, { headers: { Authorization: `Bearer ${tok()}` } })
      .then((r) => r.json())
      .then((d) => {
        const myId = myIdFromToken();
        const msgs: Message[] = Array.isArray(d)
          ? d.map((m) => ({
            id: m.id || m._id,
            from: (m.senderId === myId ? "me" : "other") as "me" | "other",
            text: m.content,
            time: new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          }))
          : [];
        setConvos((prev) => prev.map((c) => (c.id === selectedId ? { ...c, unread: 0, messages: msgs } : c)));
      })
      .catch(() => { });
  }, [selectedId]);

  const filteredConvos = convos.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  /* auto-scroll to latest message */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length, selectedId]);

  const selectConvo = (id: string) => {
    setSelectedId(id);
    setConvos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const sendMessage = async () => {
    if (!input.trim() || !selectedId) return;
    const payload = input.trim();
    const r = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
      body: JSON.stringify({ receiverId: selectedId, content: payload }),
    }).catch(() => null);
    if (r && r.ok) {
      const data = await r.json();
      const msg: Message = {
        id: data.id || String(Date.now()),
        from: "me",
        text: payload,
        time: t(),
      };
      setConvos((prev) => prev.map((c) => (c.id === selectedId ? { ...c, messages: [...c.messages, msg] } : c)));
    }
    setInput("");
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
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border/60 transition ${isActive ? "bg-primary/10" : "hover:bg-muted/50"
                      }`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${c.type === "admin" ? "bg-slate-200 text-slate-700" : "bg-primary/20 text-primary"
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
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${selected?.type === "admin" ? "bg-slate-200 text-slate-700" : "bg-primary/20 text-primary"
                }`}>
                {selected?.initials ?? ""}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selected?.name ?? ""}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {selected?.type === "doctor" ? (
                    <><Stethoscope size={10} />{selected?.specialty}</>
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
              {(selected?.messages ?? []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-xs lg:max-w-md rounded-xl px-4 py-2.5 text-sm ${msg.from === "me"
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
                disabled={!input.trim() || !selectedId}
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
