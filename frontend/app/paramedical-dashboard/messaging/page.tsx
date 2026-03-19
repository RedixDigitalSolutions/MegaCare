"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ChevronLeft, Send } from "lucide-react";
import { useState } from "react";

const mockConversations = [
  {
    id: 1,
    name: "Dr. Amira Mansouri",
    type: "doctor",
    lastMessage: "Continuer le traitement",
    unread: 2,
    messages: [
      { from: "doctor", text: "Comment va la patiente?", time: "10:30" },
      {
        from: "user",
        text: "Tension stable, patient en bonne forme",
        time: "10:35",
      },
      { from: "doctor", text: "Continuer le traitement", time: "10:40" },
    ],
  },
  {
    id: 2,
    name: "Administration",
    type: "admin",
    lastMessage: "Votre planning a été modifié",
    unread: 0,
    messages: [],
  },
];

export default function MessagingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(
    mockConversations[0],
  );
  const [newMessage, setNewMessage] = useState("");

  if (isLoading || !isAuthenticated || !user) {
    return null;
  }

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      alert("Message envoyé");
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/paramedical-dashboard"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <ChevronLeft size={20} />
            Retour
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Messagerie Médicale
          </h1>
          <div className="w-12"></div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96 lg:h-auto">
          {/* Conversations List */}
          <div className="lg:col-span-1 border border-border rounded-lg overflow-hidden bg-card">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Conversations</h2>
            </div>
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {mockConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full text-left p-4 transition ${
                    selectedConversation.id === conv.id
                      ? "bg-primary/10 border-l-4 border-l-primary"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground text-sm">
                      {conv.name}
                    </h3>
                    {conv.unread > 0 && (
                      <span className="inline-flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {conv.lastMessage}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 border border-border rounded-lg overflow-hidden bg-card flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">
                {selectedConversation.name}
              </h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p
                      className={`text-xs mt-1 ${msg.from === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Écrivez votre message..."
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-2"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
