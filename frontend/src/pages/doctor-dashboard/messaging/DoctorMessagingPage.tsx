import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { useSocket } from "@/hooks/use-socket";
import {
  MessageSquare,
  Send,
  Search,
  Users,
  Stethoscope,
  UserRound,
  Plus,
  ArrowLeft,
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

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerRole: string;
  lastMessage: Message;
  unread: number;
  messages: Message[];
}

interface Contact {
  id: string;
  name: string;
  role: string;
  specialization?: string;
}

type Tab = "patients" | "doctors";

export default function DoctorMessagingPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();

  const [activeTab, setActiveTab] = useState<Tab>("patients");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(() =>
    sessionStorage.getItem("doctor_messaging_partner"),
  );
  const [thread, setThread] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const selectedPartnerRef = useRef<string | null>(null);
  const fetchConversationsRef = useRef<() => void>(() => {});

  const token = localStorage.getItem("megacare_token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // Keep ref in sync for socket callbacks
  useEffect(() => {
    selectedPartnerRef.current = selectedPartner;
  }, [selectedPartner]);

  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/messages/conversations", { headers });
      if (res.ok) setConversations(await res.json());
    } catch {}
  }, [token]);

  fetchConversationsRef.current = fetchConversations;

  const fetchContacts = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/messages/contacts", { headers });
      if (res.ok) setContacts(await res.json());
    } catch {}
  }, [token]);

  const fetchThread = useCallback(
    async (partnerId: string) => {
      if (!token) return;
      try {
        const res = await fetch(`/api/messages/thread/${partnerId}`, {
          headers,
        });
        if (res.ok) {
          setThread(await res.json());
          fetchConversations();
        }
      } catch {}
    },
    [token, fetchConversations],
  );

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "doctor")) {
      navigate("/login");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "doctor") {
      fetchConversations();
      fetchContacts();
    }
  }, [isAuthenticated, user, fetchConversations, fetchContacts]);

  useEffect(() => {
    if (selectedPartner) {
      fetchThread(selectedPartner);
    }
  }, [selectedPartner, fetchThread]);

  // Socket.IO real-time events
  useEffect(() => {
    if (!socket || !user) {
      console.log(
        "[DoctorMessages] socket effect skipped — socket:",
        !!socket,
        "user:",
        !!user,
      );
      return;
    }
    console.log(
      "[DoctorMessages] attaching socket listeners, socket id:",
      socket.id,
    );

    const handleReceive = (msg: Message) => {
      const currentPartner = selectedPartnerRef.current;
      if (
        currentPartner &&
        (msg.senderId === currentPartner || msg.receiverId === currentPartner)
      ) {
        setThread((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
      fetchConversationsRef.current();
    };

    const handleTypingStart = (fromUserId: string) => {
      setTypingUsers((prev) => new Set(prev).add(fromUserId));
    };

    const handleTypingStop = (fromUserId: string) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(fromUserId);
        return next;
      });
    };

    const handleOnlineList = (ids: string[]) => {
      setOnlineUsers(new Set(ids));
    };

    const handleUserOnline = (uid: string) => {
      setOnlineUsers((prev) => new Set(prev).add(uid));
    };

    const handleUserOffline = (uid: string) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(uid);
        return next;
      });
    };

    socket.on("message:receive", handleReceive);
    socket.on("typing:start", handleTypingStart);
    socket.on("typing:stop", handleTypingStop);
    socket.on("users:online", handleOnlineList);
    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    return () => {
      socket.off("message:receive", handleReceive);
      socket.off("typing:start", handleTypingStart);
      socket.off("typing:stop", handleTypingStop);
      socket.off("users:online", handleOnlineList);
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
    };
  }, [socket, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  // Persist selectedPartner across refresh
  useEffect(() => {
    if (selectedPartner) {
      sessionStorage.setItem("doctor_messaging_partner", selectedPartner);
    } else {
      sessionStorage.removeItem("doctor_messaging_partner");
    }
  }, [selectedPartner]);

  if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
    return null;

  // ── Typing indicator handling ──
  const handleInputChange = (value: string) => {
    setNewMessage(value);
    if (!socket || !selectedPartner) {
      console.log(
        "[DoctorMessages] typing skipped — socket:",
        !!socket,
        "partner:",
        selectedPartner,
      );
      return;
    }

    console.log("[DoctorMessages] emitting typing:start to", selectedPartner);
    socket.emit("typing:start", selectedPartner);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing:stop", selectedPartner);
    }, 1500);
  };

  const sendMessage = async () => {
    if (!selectedPartner || !newMessage.trim() || sending) return;
    setSending(true);

    // Stop typing indicator
    if (socket) socket.emit("typing:stop", selectedPartner);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers,
        body: JSON.stringify({
          receiverId: selectedPartner,
          content: newMessage.trim(),
        }),
      });
      if (res.ok) {
        const msg = await res.json();
        setNewMessage("");
        setThread((prev) => [...prev, msg]);
        if (socket) {
          console.log(
            "[DoctorMessages] emitting message:sent to",
            msg.receiverId,
          );
          socket.emit("message:sent", msg);
        }
        fetchConversations();
      }
    } catch {
    } finally {
      setSending(false);
    }
  };

  const startChat = (contactId: string) => {
    setSelectedPartner(contactId);
    setShowNewChat(false);
    setSearchQuery("");
  };

  // Filter conversations by tab
  const filteredConversations = conversations.filter((c) =>
    activeTab === "patients"
      ? c.partnerRole === "patient"
      : c.partnerRole === "doctor",
  );

  // Filter contacts for new chat
  const filteredContacts = contacts
    .filter((c) =>
      activeTab === "patients" ? c.role === "patient" : c.role === "doctor",
    )
    .filter(
      (c) =>
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  const selectedConv = conversations.find(
    (c) => c.partnerId === selectedPartner,
  );
  const selectedContact = contacts.find((c) => c.id === selectedPartner);
  const partnerName =
    selectedConv?.partnerName || selectedContact?.name || "Sélectionner";
  const partnerRole = selectedConv?.partnerRole || selectedContact?.role || "";
  const isPartnerOnline = selectedPartner
    ? onlineUsers.has(selectedPartner)
    : false;
  const isPartnerTyping = selectedPartner
    ? typingUsers.has(selectedPartner)
    : false;

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) {
      return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (diffDays === 1) return "Hier";
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  const roleLabel = (role: string) => {
    const labels: Record<string, string> = {
      patient: "Patient",
      doctor: "Médecin",
      pharmacy: "Pharmacien",
      lab_radiology: "Labo",
      paramedical: "Paramédical",
      medical_service: "Service Médical",
      admin: "Admin",
    };
    return labels[role] || role;
  };

  const initials = (name: string) =>
    name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col md:flex-row">
        <DoctorDashboardSidebar
          doctorName={
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : "Médecin"
          }
        />

        <main className="flex-1 flex flex-col overflow-hidden h-screen">
          {/* Header */}
          <div className="bg-card border-b border-border p-6 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <MessageSquare className="text-primary" size={28} />
                  Messages
                </h1>
                <p className="text-muted-foreground mt-1">
                  Communiquez avec vos patients et confrères
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-card border-b border-border px-6 shrink-0">
            <div className="flex gap-0">
              <button
                onClick={() => {
                  setActiveTab("patients");
                  setSelectedPartner(null);
                  setShowNewChat(false);
                }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === "patients"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserRound size={16} />
                Patients
                {conversations.filter(
                  (c) => c.partnerRole === "patient" && c.unread > 0,
                ).length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {conversations
                      .filter((c) => c.partnerRole === "patient")
                      .reduce((s, c) => s + c.unread, 0)}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("doctors");
                  setSelectedPartner(null);
                  setShowNewChat(false);
                }}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === "doctors"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Stethoscope size={16} />
                Confrères
                {conversations.filter(
                  (c) => c.partnerRole === "doctor" && c.unread > 0,
                ).length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                    {conversations
                      .filter((c) => c.partnerRole === "doctor")
                      .reduce((s, c) => s + c.unread, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar — conversation list */}
            <div
              className={`w-80 border-r border-border bg-card flex flex-col shrink-0 ${
                selectedPartner ? "hidden md:flex" : "flex"
              }`}
            >
              {/* Search + New */}
              <div className="p-3 border-b border-border space-y-2">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button
                    onClick={() => setShowNewChat(!showNewChat)}
                    className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                    title="Nouvelle conversation"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* New chat — contact picker */}
              {showNewChat && (
                <div className="border-b border-border max-h-48 overflow-y-auto">
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase">
                    Nouveau message
                  </p>
                  {filteredContacts.length === 0 ? (
                    <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                      Aucun contact trouvé
                    </p>
                  ) : (
                    filteredContacts.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => startChat(c.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {initials(c.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {c.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {roleLabel(c.role)}
                            {c.specialization && ` • ${c.specialization}`}
                          </p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Conversation list */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 && !showNewChat ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6">
                    <Users
                      size={36}
                      className="text-muted-foreground/30 mb-3"
                    />
                    <p className="text-sm text-muted-foreground">
                      {activeTab === "patients"
                        ? "Aucune conversation avec des patients"
                        : "Aucune conversation avec des confrères"}
                    </p>
                    <button
                      onClick={() => setShowNewChat(true)}
                      className="mt-3 text-sm text-primary hover:underline"
                    >
                      Démarrer une conversation
                    </button>
                  </div>
                ) : (
                  filteredConversations
                    .filter(
                      (c) =>
                        !searchQuery ||
                        c.partnerName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                    )
                    .map((conv) => (
                      <button
                        key={conv.partnerId}
                        onClick={() => {
                          setSelectedPartner(conv.partnerId);
                          setShowNewChat(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/50 transition text-left ${
                          selectedPartner === conv.partnerId ? "bg-muted" : ""
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
                            {initials(conv.partnerName)}
                          </div>
                          {onlineUsers.has(conv.partnerId) && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-card" />
                          )}
                          {conv.unread > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-foreground truncate">
                              {conv.partnerName}
                            </p>
                            <span className="text-[10px] text-muted-foreground shrink-0 ml-2">
                              {formatTime(conv.lastMessage.createdAt)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {typingUsers.has(conv.partnerId) ? (
                              <span className="text-primary italic">
                                en train d'écrire...
                              </span>
                            ) : (
                              <>
                                {conv.lastMessage.senderId === user.id
                                  ? "Vous: "
                                  : ""}
                                {conv.lastMessage.content}
                              </>
                            )}
                          </p>
                        </div>
                      </button>
                    ))
                )}
              </div>
            </div>

            {/* Chat thread */}
            <div
              className={`flex-1 flex flex-col ${
                !selectedPartner ? "hidden md:flex" : "flex"
              }`}
            >
              {!selectedPartner ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                  <MessageSquare
                    size={48}
                    className="text-muted-foreground/20 mb-4"
                  />
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    Sélectionnez une conversation
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Choisissez un{" "}
                    {activeTab === "patients" ? "patient" : "confrère"} dans la
                    liste ou démarrez une nouvelle conversation.
                  </p>
                </div>
              ) : (
                <>
                  {/* Thread header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
                    <button
                      onClick={() => setSelectedPartner(null)}
                      className="md:hidden p-1.5 hover:bg-muted rounded-lg transition"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
                        {initials(partnerName)}
                      </div>
                      {isPartnerOnline && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">
                        {partnerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isPartnerTyping ? (
                          <span className="text-primary animate-pulse">
                            en train d'écrire...
                          </span>
                        ) : isPartnerOnline ? (
                          <span className="text-emerald-500">En ligne</span>
                        ) : (
                          roleLabel(partnerRole)
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                    {thread.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">
                        Aucun message. Commencez la conversation !
                      </p>
                    )}
                    {thread.map((msg) => {
                      const isMine = msg.senderId === user.id;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isMine ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                              isMine
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted text-foreground rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            <p
                              className={`text-[10px] mt-1 ${
                                isMine
                                  ? "text-primary-foreground/60"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {/* Typing indicator in thread */}
                    {isPartnerTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t border-border bg-card px-4 py-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Écrire un message..."
                        value={newMessage}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        className="flex-1 px-4 py-2.5 border border-border rounded-xl bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
