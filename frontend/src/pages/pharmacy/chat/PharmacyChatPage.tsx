
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Send, MessageCircle, Clock, CircleCheckBig } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PHARMACY_USER_ID = "00000000-0000-0000-0000-000000000009";

interface ChatMessage {
  id: string;
  sender: "patient" | "pharmacist";
  name?: string;
  text: string;
  time: string;
  read: boolean;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("megacare_token");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch(`/api/messages/thread/${PHARMACY_USER_ID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.ok ? r.json() : [])
      .then((data: any[]) => {
        setMessages(
          data.map((m) => ({
            id: m._id,
            sender: m.senderId === user?.id ? "patient" : "pharmacist",
            name: m.senderId !== user?.id ? "Pharmacien" : undefined,
            text: m.content,
            time: new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            read: true,
          })),
        );
      })
      .catch(() => { })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !token) return;
    const content = inputValue.trim();
    setInputValue("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipientId: PHARMACY_USER_ID, content }),
      });
      if (res.ok) {
        const m = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: m._id,
            sender: "patient",
            text: m.content,
            time: new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            read: true,
          },
        ]);
      }
    } catch { /* ignore */ }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24">
        <div className="max-w-4xl mx-auto h-screen flex flex-col">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                PA
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Pharmacie El Amal
                </h1>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full" />
                  En ligne maintenant
                </p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {!token ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Connectez-vous pour chatter avec la pharmacie
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Chargement des messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Aucun message. Posez votre première question!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-sm p-4 rounded-lg space-y-1 ${msg.sender === "patient"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                      }`}
                  >
                    {msg.sender === "pharmacist" && (
                      <p className="text-xs font-semibold opacity-75">
                        {msg.name}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <div
                      className={`text-xs flex items-center gap-1 ${msg.sender === "patient" ? "justify-end" : ""}`}
                    >
                      {msg.time}
                      {msg.sender === "patient" && msg.read && (
                        <CircleCheckBig size={12} />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="bg-card border-t border-border p-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSendMessage}
                className="bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
