import { useState } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Send, Search } from "lucide-react";

interface Conversation {
  id: number;
  name: string;
  role: string;
  lastMessage: string;
  time: string;
  unread: number;
  initials: string;
  color: string;
}

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  mine: boolean;
}

const conversations: Conversation[] = [
  { id: 1, name: "Dr. Karim Mansouri", role: "Médecin référent", lastMessage: "Pouvez-vous surveiller la TA de Mme Ben Ali ?", time: "10:32", unread: 2, initials: "KM", color: "bg-blue-500" },
  { id: 2, name: "Équipe soins", role: "Groupe", lastMessage: "Réunion planning confirmée à 14h", time: "09:15", unread: 1, initials: "EQ", color: "bg-purple-500" },
  { id: 3, name: "Dr. Nour Belhadj", role: "Diabétologue", lastMessage: "Merci pour le compte rendu de M. Gharbi", time: "Hier", unread: 0, initials: "NB", color: "bg-green-500" },
  { id: 4, name: "Pharmacie centrale", role: "Service", lastMessage: "Commande Metformine disponible", time: "Hier", unread: 0, initials: "PH", color: "bg-amber-500" },
  { id: 5, name: "Sofia Cherif", role: "Infirmière", lastMessage: "Pansement Sonia fait, RAS", time: "Lun", unread: 0, initials: "SC", color: "bg-pink-500" },
];

const allMessages: Record<number, Message[]> = {
  1: [
    { id: 1, sender: "Dr. Karim Mansouri", text: "Bonjour, comment se porte Mme Ben Ali aujourd'hui ?", time: "10:10", mine: false },
    { id: 2, sender: "Moi", text: "Bonjour Dr. Mansouri. Constantes stables ce matin, TA à 120/80.", time: "10:14", mine: true },
    { id: 3, sender: "Dr. Karim Mansouri", text: "Bien. Pouvez-vous surveiller la TA de Mme Ben Ali cet après-midi et me remonter les valeurs ?", time: "10:32", mine: false },
  ],
  2: [
    { id: 1, sender: "Chef d'équipe", text: "Rappel : réunion planning demain à 14h en salle de réunion.", time: "09:00", mine: false },
    { id: 2, sender: "Sofia Cherif", text: "Confirmé, je serai là.", time: "09:08", mine: false },
    { id: 3, sender: "Moi", text: "Réunion planning confirmée à 14h", time: "09:15", mine: true },
  ],
  3: [
    { id: 1, sender: "Moi", text: "Dr. Belhadj, voici le compte rendu de M. Gharbi pour la semaine.", time: "17:30", mine: true },
    { id: 2, sender: "Dr. Nour Belhadj", text: "Merci pour le compte rendu de M. Gharbi, je l'examine et reviens vers vous.", time: "18:05", mine: false },
  ],
  4: [
    { id: 1, sender: "Pharmacie centrale", text: "Votre commande de Metformine 500mg (30 boîtes) est disponible pour retrait.", time: "14:20", mine: false },
    { id: 2, sender: "Moi", text: "Merci, je viens récupérer demain matin.", time: "14:35", mine: true },
  ],
  5: [
    { id: 1, sender: "Sofia Cherif", text: "Pansement de Mme Trabelsi effectué. Plaie propre, pas d'infection visible.", time: "11:00", mine: false },
    { id: 2, sender: "Moi", text: "Parfait, merci Sofia. Notez dans le dossier.", time: "11:10", mine: true },
  ],
};

export default function MessagingPage() {
  const [selected, setSelected] = useState<number>(1);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Record<number, Message[]>>(allMessages);
  const [searchConv, setSearchConv] = useState("");

  const conv = conversations.find((c) => c.id === selected)!;
  const msgs = messages[selected] ?? [];

  const filteredConvs = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchConv.toLowerCase())
  );

  function sendMessage() {
    if (!input.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setMessages((prev) => ({
      ...prev,
      [selected]: [...(prev[selected] ?? []), { id: Date.now(), sender: "Moi", text: input.trim(), time, mine: true }],
    }));
    setInput("");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <MedicalServiceDashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 shrink-0">
          <h1 className="text-xl font-bold text-foreground">Messagerie</h1>
          <p className="text-xs text-muted-foreground">Communication interne avec l'équipe médicale</p>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Conversation list */}
          <div className="w-72 shrink-0 border-r border-border flex flex-col bg-card">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchConv} onChange={(e) => setSearchConv(e.target.value)} placeholder="Rechercher…"
                  className="w-full pl-8 pr-3 py-2 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map((c) => (
                <button key={c.id} onClick={() => setSelected(c.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition text-left border-b border-border last:border-0 ${selected === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${c.color}`}>{c.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">{c.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{c.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {/* Chat header */}
            <div className="px-5 py-3 border-b border-border bg-card flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${conv.color}`}>{conv.initials}</div>
              <div>
                <p className="font-semibold text-foreground text-sm">{conv.name}</p>
                <p className="text-xs text-muted-foreground">{conv.role}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {msgs.map((m) => (
                <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${m.mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"}`}>
                    {!m.mine && <p className="text-xs font-medium mb-1 opacity-60">{m.sender}</p>}
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-1 ${m.mine ? "text-primary-foreground/60 text-right" : "text-muted-foreground"}`}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 py-4 border-t border-border bg-card">
              <div className="flex items-center gap-3">
                <input value={input} onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Écrire un message…"
                  className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                <button onClick={sendMessage} disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-40">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
