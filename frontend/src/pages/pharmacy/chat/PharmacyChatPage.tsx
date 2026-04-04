
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Send, MessageCircle, Clock, CircleCheckBig } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "pharmacist",
      name: "Pharmacien El Amal",
      text: "Bonjour! Comment puis-je vous aider?",
      time: "14:30",
      read: true,
    },
    {
      id: 2,
      sender: "patient",
      text: "Bonjour, je voulais demander si l'Amoxicilline peut être prise avec du lait?",
      time: "14:32",
      read: true,
    },
    {
      id: 3,
      sender: "pharmacist",
      name: "Pharmacien El Amal",
      text: "Bonne question! L'Amoxicilline peut être prise avec ou sans nourriture, mais évitez les produits laitiers 2 heures avant et après la prise pour une meilleure absorption.",
      time: "14:35",
      read: true,
    },
    {
      id: 4,
      sender: "patient",
      text: "Merci beaucoup pour le conseil!",
      time: "14:36",
      read: true,
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "patient",
          text: inputValue,
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: true,
        },
      ]);
      setInputValue("");
    }
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-sm p-4 rounded-lg space-y-1 ${
                    msg.sender === "patient"
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
            ))}
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
