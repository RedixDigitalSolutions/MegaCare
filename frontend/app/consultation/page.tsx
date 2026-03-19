"use client";

import { useState, useEffect } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageCircle,
  Paperclip,
  Settings,
  Phone,
  Clock,
} from "lucide-react";

export default function VideoConsultationPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activePanel, setActivePanel] = useState<
    "chat" | "files" | "prescription" | null
  >(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "doctor",
      text: "Bonjour Fatima, comment allez-vous?",
      time: "14:00",
    },
    {
      id: 2,
      author: "patient",
      text: "Bonjour Dr. Mansouri, ça va bien merci.",
      time: "14:01",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [prescriptionMed, setPrescriptionMed] = useState("");
  const [prescriptionDosage, setPrescriptionDosage] = useState("");
  const [prescriptionDuration, setPrescriptionDuration] = useState("");
  const [prescriptionList, setPrescriptionList] = useState<
    { med: string; dosage: string; duration: string }[]
  >([]);
  const [prescriptionStatus, setPrescriptionStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          author: "patient",
          text: inputMessage,
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      setInputMessage("");
    }
  };

  const handleAddPrescriptionItem = () => {
    if (!prescriptionMed.trim()) return;
    setPrescriptionList((prev) => [
      ...prev,
      {
        med: prescriptionMed,
        dosage: prescriptionDosage,
        duration: prescriptionDuration,
      },
    ]);
    setPrescriptionMed("");
    setPrescriptionDosage("");
    setPrescriptionDuration("");
  };

  const handleSendPrescription = async () => {
    if (prescriptionList.length === 0) return;
    setPrescriptionStatus("sending");
    try {
      const token = localStorage.getItem("megacare_token");
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ medicines: prescriptionList }),
      });
      if (!res.ok) throw new Error("Failed");
      setPrescriptionStatus("sent");
      setPrescriptionList([]);
    } catch {
      setPrescriptionStatus("error");
    }
  };

  return (
    <div className="h-screen bg-sidebar text-sidebar-foreground overflow-hidden flex flex-col">
      {/* Top Info Bar */}
      <div className="bg-sidebar-primary/10 backdrop-blur-sm border-b border-sidebar-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-lg">
            👨‍⚕️
          </div>
          <div>
            <p className="font-semibold text-sidebar-foreground text-sm">
              Dr. Amira Mansouri — Cardiologue
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-green-400">
            <Clock size={16} />
            <span className="font-mono font-bold">
              {formatTime(elapsedTime)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sidebar-foreground/70">
            📡 Chiffré E2E
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex">
        {/* Main Video */}
        <div className="flex-1 bg-sidebar/50 relative flex items-center justify-center overflow-hidden">
          <div className="text-center space-y-4">
            <div className="w-40 h-40 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-6xl mx-auto animate-pulse">
              👨‍⚕️
            </div>
            <p className="text-sidebar-foreground/80 font-medium">
              Dr. Amira Mansouri
            </p>
          </div>

          {/* Picture in Picture (Patient Video) */}
          <div className="absolute bottom-6 right-6 w-40 h-28 bg-sidebar-primary rounded-lg border-2 border-primary flex items-center justify-center text-4xl">
            👤
          </div>
        </div>

        {/* Right Panel */}
        <div
          className={`bg-sidebar border-l border-sidebar-border transition-all duration-300 flex flex-col ${
            activePanel ? "w-80" : "w-0"
          }`}
        >
          {activePanel && (
            <>
              {/* Panel Tabs */}
              <div className="flex border-b border-sidebar-border">
                {(["chat", "files", "prescription"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() =>
                      setActivePanel(tab === activePanel ? null : tab)
                    }
                    className={`flex-1 py-3 text-sm font-medium transition border-b-2 ${
                      activePanel === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-sidebar-foreground/70 hover:text-sidebar-foreground"
                    }`}
                  >
                    {tab === "chat"
                      ? "💬 Chat"
                      : tab === "files"
                        ? "📁 Fichiers"
                        : "📋 Ordonnance"}
                  </button>
                ))}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-auto p-4">
                {activePanel === "chat" && (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.author === "patient" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.author === "patient"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-sidebar-primary text-sidebar-foreground rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs ${
                              msg.author === "patient"
                                ? "text-primary-foreground/70"
                                : "text-sidebar-foreground/70"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activePanel === "files" && (
                  <div className="space-y-3 text-center py-6">
                    <Paperclip
                      size={32}
                      className="text-sidebar-foreground/40 mx-auto"
                    />
                    <p className="text-sm text-sidebar-foreground/70">
                      Aucun fichier partagé
                    </p>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition">
                      Ajouter un fichier
                    </button>
                  </div>
                )}

                {activePanel === "prescription" && (
                  <div className="space-y-4">
                    <div className="bg-sidebar-primary/10 rounded-lg p-4 space-y-3">
                      <h4 className="font-semibold text-sidebar-foreground">
                        Créer une ordonnance
                      </h4>
                      {prescriptionList.length > 0 && (
                        <ul className="space-y-1">
                          {prescriptionList.map((item, i) => (
                            <li
                              key={i}
                              className="text-xs text-sidebar-foreground/80 bg-sidebar-border rounded px-2 py-1"
                            >
                              {item.med}
                              {item.dosage ? ` — ${item.dosage}` : ""}
                              {item.duration ? ` (${item.duration})` : ""}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Médicament..."
                          value={prescriptionMed}
                          onChange={(e) => setPrescriptionMed(e.target.value)}
                          className="w-full px-3 py-2 bg-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Dosage..."
                          value={prescriptionDosage}
                          onChange={(e) =>
                            setPrescriptionDosage(e.target.value)
                          }
                          className="w-full px-3 py-2 bg-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded text-sm"
                        />
                        <input
                          type="text"
                          placeholder="Durée..."
                          value={prescriptionDuration}
                          onChange={(e) =>
                            setPrescriptionDuration(e.target.value)
                          }
                          className="w-full px-3 py-2 bg-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded text-sm"
                        />
                      </div>
                      <button
                        onClick={handleAddPrescriptionItem}
                        disabled={!prescriptionMed.trim()}
                        className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 transition font-medium disabled:opacity-50"
                      >
                        Ajouter un médicament
                      </button>
                      {prescriptionStatus === "sent" && (
                        <p className="text-xs text-green-400 text-center">
                          Ordonnance envoyée ✓
                        </p>
                      )}
                      {prescriptionStatus === "error" && (
                        <p className="text-xs text-red-400 text-center">
                          Erreur lors de l'envoi
                        </p>
                      )}
                      <button
                        onClick={handleSendPrescription}
                        disabled={
                          prescriptionList.length === 0 ||
                          prescriptionStatus === "sending"
                        }
                        className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition font-medium disabled:opacity-50"
                      >
                        {prescriptionStatus === "sending"
                          ? "Envoi..."
                          : "Envoyer l'ordonnance"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              {activePanel === "chat" && (
                <div className="border-t border-sidebar-border p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Votre message..."
                      className="flex-1 px-3 py-2 bg-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/50 rounded text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-sm font-medium"
                    >
                      Envoyer
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Control Bar */}
      <div className="bg-sidebar-primary/10 border-t border-sidebar-border px-6 py-4 flex items-center justify-center gap-4">
        {/* Audio Controls */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className={`w-14 h-14 rounded-full transition flex items-center justify-center ${
            isMuted
              ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
              : "bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30"
          }`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {/* Video Controls */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={`w-14 h-14 rounded-full transition flex items-center justify-center ${
            isVideoOff
              ? "bg-red-600/20 text-red-400 hover:bg-red-600/30"
              : "bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30"
          }`}
        >
          {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
        </button>

        {/* Chat Button */}
        <button
          onClick={() => setActivePanel(activePanel === "chat" ? null : "chat")}
          className={`w-14 h-14 rounded-full transition flex items-center justify-center ${
            activePanel === "chat"
              ? "bg-primary text-primary-foreground"
              : "bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30"
          }`}
        >
          <MessageCircle size={24} />
        </button>

        {/* Files Button */}
        <button
          onClick={() =>
            setActivePanel(activePanel === "files" ? null : "files")
          }
          className={`w-14 h-14 rounded-full transition flex items-center justify-center ${
            activePanel === "files"
              ? "bg-primary text-primary-foreground"
              : "bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30"
          }`}
        >
          <Paperclip size={24} />
        </button>

        {/* Settings Button */}
        <button className="w-14 h-14 rounded-full bg-sidebar-primary/20 text-sidebar-foreground hover:bg-sidebar-primary/30 transition flex items-center justify-center">
          <Settings size={24} />
        </button>

        {/* End Call Button */}
        <button className="w-16 h-14 rounded-full bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center font-bold text-lg ml-4">
          <Phone size={24} />
        </button>
      </div>
    </div>
  );
}
