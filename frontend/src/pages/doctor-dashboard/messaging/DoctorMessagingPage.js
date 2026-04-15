import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DoctorDashboardSidebar } from "@/components/DoctorDashboardSidebar";
import { useSocket } from "@/hooks/use-socket";
import { MessageSquare, Send, Search, Users, Stethoscope, UserRound, Plus, ArrowLeft, } from "lucide-react";
export default function DoctorMessagingPage() {
    const { user, isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const socket = useSocket();
    const [activeTab, setActiveTab] = useState("patients");
    const [conversations, setConversations] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(() => sessionStorage.getItem("doctor_messaging_partner"));
    const [thread, setThread] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [showNewChat, setShowNewChat] = useState(false);
    const [sending, setSending] = useState(false);
    const [typingUsers, setTypingUsers] = useState(new Set());
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const selectedPartnerRef = useRef(null);
    const fetchConversationsRef = useRef(() => { });
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
        if (!token)
            return;
        try {
            const res = await fetch("/api/messages/conversations", { headers });
            if (res.ok)
                setConversations(await res.json());
        }
        catch { }
    }, [token]);
    fetchConversationsRef.current = fetchConversations;
    const fetchContacts = useCallback(async () => {
        if (!token)
            return;
        try {
            const res = await fetch("/api/messages/contacts", { headers });
            if (res.ok)
                setContacts(await res.json());
        }
        catch { }
    }, [token]);
    const fetchThread = useCallback(async (partnerId) => {
        if (!token)
            return;
        try {
            const res = await fetch(`/api/messages/thread/${partnerId}`, {
                headers,
            });
            if (res.ok) {
                setThread(await res.json());
                fetchConversations();
            }
        }
        catch { }
    }, [token, fetchConversations]);
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
            console.log("[DoctorMessages] socket effect skipped — socket:", !!socket, "user:", !!user);
            return;
        }
        console.log("[DoctorMessages] attaching socket listeners, socket id:", socket.id);
        const handleReceive = (msg) => {
            const currentPartner = selectedPartnerRef.current;
            if (currentPartner &&
                (msg.senderId === currentPartner || msg.receiverId === currentPartner)) {
                setThread((prev) => {
                    if (prev.some((m) => m.id === msg.id))
                        return prev;
                    return [...prev, msg];
                });
            }
            fetchConversationsRef.current();
        };
        const handleTypingStart = (fromUserId) => {
            setTypingUsers((prev) => new Set(prev).add(fromUserId));
        };
        const handleTypingStop = (fromUserId) => {
            setTypingUsers((prev) => {
                const next = new Set(prev);
                next.delete(fromUserId);
                return next;
            });
        };
        const handleOnlineList = (ids) => {
            setOnlineUsers(new Set(ids));
        };
        const handleUserOnline = (uid) => {
            setOnlineUsers((prev) => new Set(prev).add(uid));
        };
        const handleUserOffline = (uid) => {
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
        }
        else {
            sessionStorage.removeItem("doctor_messaging_partner");
        }
    }, [selectedPartner]);
    if (isLoading || !isAuthenticated || !user || user.role !== "doctor")
        return null;
    // ── Typing indicator handling ──
    const handleInputChange = (value) => {
        setNewMessage(value);
        if (!socket || !selectedPartner) {
            console.log("[DoctorMessages] typing skipped — socket:", !!socket, "partner:", selectedPartner);
            return;
        }
        console.log("[DoctorMessages] emitting typing:start to", selectedPartner);
        socket.emit("typing:start", selectedPartner);
        if (typingTimeoutRef.current)
            clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("typing:stop", selectedPartner);
        }, 1500);
    };
    const sendMessage = async () => {
        if (!selectedPartner || !newMessage.trim() || sending)
            return;
        setSending(true);
        // Stop typing indicator
        if (socket)
            socket.emit("typing:stop", selectedPartner);
        if (typingTimeoutRef.current)
            clearTimeout(typingTimeoutRef.current);
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
                    console.log("[DoctorMessages] emitting message:sent to", msg.receiverId);
                    socket.emit("message:sent", msg);
                }
                fetchConversations();
            }
        }
        catch {
        }
        finally {
            setSending(false);
        }
    };
    const startChat = (contactId) => {
        setSelectedPartner(contactId);
        setShowNewChat(false);
        setSearchQuery("");
    };
    // Filter conversations by tab
    const filteredConversations = conversations.filter((c) => activeTab === "patients"
        ? c.partnerRole === "patient"
        : c.partnerRole === "doctor");
    // Filter contacts for new chat
    const filteredContacts = contacts
        .filter((c) => activeTab === "patients" ? c.role === "patient" : c.role === "doctor")
        .filter((c) => !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const selectedConv = conversations.find((c) => c.partnerId === selectedPartner);
    const selectedContact = contacts.find((c) => c.id === selectedPartner);
    const partnerName = selectedConv?.partnerName || selectedContact?.name || "Sélectionner";
    const partnerRole = selectedConv?.partnerRole || selectedContact?.role || "";
    const isPartnerOnline = selectedPartner
        ? onlineUsers.has(selectedPartner)
        : false;
    const isPartnerTyping = selectedPartner
        ? typingUsers.has(selectedPartner)
        : false;
    const formatTime = (iso) => {
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
        if (diffDays === 1)
            return "Hier";
        return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    };
    const roleLabel = (role) => {
        const labels = {
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
    const initials = (name) => name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return (_jsx("div", { className: "min-h-screen bg-background", children: _jsxs("div", { className: "flex flex-col md:flex-row", children: [_jsx(DoctorDashboardSidebar, { doctorName: user.firstName && user.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : "Médecin" }), _jsxs("main", { className: "flex-1 flex flex-col overflow-hidden h-screen", children: [_jsx("div", { className: "bg-card border-b border-border p-6 shrink-0", children: _jsx("div", { className: "flex items-center justify-between", children: _jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-foreground flex items-center gap-3", children: [_jsx(MessageSquare, { className: "text-primary", size: 28 }), "Messages"] }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Communiquez avec vos patients et confr\u00E8res" })] }) }) }), _jsx("div", { className: "bg-card border-b border-border px-6 shrink-0", children: _jsxs("div", { className: "flex gap-0", children: [_jsxs("button", { onClick: () => {
                                            setActiveTab("patients");
                                            setSelectedPartner(null);
                                            setShowNewChat(false);
                                        }, className: `flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${activeTab === "patients"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [_jsx(UserRound, { size: 16 }), "Patients", conversations.filter((c) => c.partnerRole === "patient" && c.unread > 0).length > 0 && (_jsx("span", { className: "ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full", children: conversations
                                                    .filter((c) => c.partnerRole === "patient")
                                                    .reduce((s, c) => s + c.unread, 0) }))] }), _jsxs("button", { onClick: () => {
                                            setActiveTab("doctors");
                                            setSelectedPartner(null);
                                            setShowNewChat(false);
                                        }, className: `flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition ${activeTab === "doctors"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-muted-foreground hover:text-foreground"}`, children: [_jsx(Stethoscope, { size: 16 }), "Confr\u00E8res", conversations.filter((c) => c.partnerRole === "doctor" && c.unread > 0).length > 0 && (_jsx("span", { className: "ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full", children: conversations
                                                    .filter((c) => c.partnerRole === "doctor")
                                                    .reduce((s, c) => s + c.unread, 0) }))] })] }) }), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsxs("div", { className: `w-80 border-r border-border bg-card flex flex-col shrink-0 ${selectedPartner ? "hidden md:flex" : "flex"}`, children: [_jsx("div", { className: "p-3 border-b border-border space-y-2", children: _jsxs("div", { className: "flex gap-2", children: [_jsxs("div", { className: "flex-1 relative", children: [_jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Rechercher...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), className: "w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" })] }), _jsx("button", { onClick: () => setShowNewChat(!showNewChat), className: "p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition", title: "Nouvelle conversation", children: _jsx(Plus, { size: 16 }) })] }) }), showNewChat && (_jsxs("div", { className: "border-b border-border max-h-48 overflow-y-auto", children: [_jsx("p", { className: "px-3 pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase", children: "Nouveau message" }), filteredContacts.length === 0 ? (_jsx("p", { className: "px-3 py-4 text-sm text-muted-foreground text-center", children: "Aucun contact trouv\u00E9" })) : (filteredContacts.map((c) => (_jsxs("button", { onClick: () => startChat(c.id), className: "w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted transition text-left", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary", children: initials(c.name) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", children: c.name }), _jsxs("p", { className: "text-xs text-muted-foreground", children: [roleLabel(c.role), c.specialization && ` • ${c.specialization}`] })] })] }, c.id))))] })), _jsx("div", { className: "flex-1 overflow-y-auto", children: filteredConversations.length === 0 && !showNewChat ? (_jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center px-6", children: [_jsx(Users, { size: 36, className: "text-muted-foreground/30 mb-3" }), _jsx("p", { className: "text-sm text-muted-foreground", children: activeTab === "patients"
                                                            ? "Aucune conversation avec des patients"
                                                            : "Aucune conversation avec des confrères" }), _jsx("button", { onClick: () => setShowNewChat(true), className: "mt-3 text-sm text-primary hover:underline", children: "D\u00E9marrer une conversation" })] })) : (filteredConversations
                                                .filter((c) => !searchQuery ||
                                                c.partnerName
                                                    .toLowerCase()
                                                    .includes(searchQuery.toLowerCase()))
                                                .map((conv) => (_jsxs("button", { onClick: () => {
                                                    setSelectedPartner(conv.partnerId);
                                                    setShowNewChat(false);
                                                }, className: `w-full flex items-center gap-3 px-4 py-3 border-b border-border hover:bg-muted/50 transition text-left ${selectedPartner === conv.partnerId ? "bg-muted" : ""}`, children: [_jsxs("div", { className: "relative shrink-0", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary", children: initials(conv.partnerName) }), onlineUsers.has(conv.partnerId) && (_jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-card" })), conv.unread > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center", children: conv.unread }))] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-semibold text-foreground truncate", children: conv.partnerName }), _jsx("span", { className: "text-[10px] text-muted-foreground shrink-0 ml-2", children: formatTime(conv.lastMessage.createdAt) })] }), _jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: typingUsers.has(conv.partnerId) ? (_jsx("span", { className: "text-primary italic", children: "en train d'\u00E9crire..." })) : (_jsxs(_Fragment, { children: [conv.lastMessage.senderId === user.id
                                                                            ? "Vous: "
                                                                            : "", conv.lastMessage.content] })) })] })] }, conv.partnerId)))) })] }), _jsx("div", { className: `flex-1 flex flex-col ${!selectedPartner ? "hidden md:flex" : "flex"}`, children: !selectedPartner ? (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center px-8", children: [_jsx(MessageSquare, { size: 48, className: "text-muted-foreground/20 mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-foreground mb-1", children: "S\u00E9lectionnez une conversation" }), _jsxs("p", { className: "text-sm text-muted-foreground max-w-sm", children: ["Choisissez un", " ", activeTab === "patients" ? "patient" : "confrère", " dans la liste ou d\u00E9marrez une nouvelle conversation."] })] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0", children: [_jsx("button", { onClick: () => setSelectedPartner(null), className: "md:hidden p-1.5 hover:bg-muted rounded-lg transition", children: _jsx(ArrowLeft, { size: 18 }) }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary", children: initials(partnerName) }), isPartnerOnline && (_jsx("span", { className: "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-card" }))] }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sm text-foreground", children: partnerName }), _jsx("p", { className: "text-xs text-muted-foreground", children: isPartnerTyping ? (_jsx("span", { className: "text-primary animate-pulse", children: "en train d'\u00E9crire..." })) : isPartnerOnline ? (_jsx("span", { className: "text-emerald-500", children: "En ligne" })) : (roleLabel(partnerRole)) })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-3", children: [thread.length === 0 && (_jsx("p", { className: "text-center text-sm text-muted-foreground py-8", children: "Aucun message. Commencez la conversation !" })), thread.map((msg) => {
                                                        const isMine = msg.senderId === user.id;
                                                        return (_jsx("div", { className: `flex ${isMine ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-[75%] rounded-2xl px-4 py-2.5 ${isMine
                                                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                                                    : "bg-muted text-foreground rounded-bl-md"}`, children: [_jsx("p", { className: "text-sm whitespace-pre-wrap", children: msg.content }), _jsx("p", { className: `text-[10px] mt-1 ${isMine
                                                                            ? "text-primary-foreground/60"
                                                                            : "text-muted-foreground"}`, children: formatTime(msg.createdAt) })] }) }, msg.id));
                                                    }), isPartnerTyping && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-muted rounded-2xl rounded-bl-md px-4 py-3", children: _jsxs("div", { className: "flex gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:0ms]" }), _jsx("span", { className: "w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:150ms]" }), _jsx("span", { className: "w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:300ms]" })] }) }) })), _jsx("div", { ref: messagesEndRef })] }), _jsx("div", { className: "border-t border-border bg-card px-4 py-3 shrink-0", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", placeholder: "\u00C9crire un message...", value: newMessage, onChange: (e) => handleInputChange(e.target.value), onKeyDown: (e) => {
                                                                if (e.key === "Enter" && !e.shiftKey) {
                                                                    e.preventDefault();
                                                                    sendMessage();
                                                                }
                                                            }, className: "flex-1 px-4 py-2.5 border border-border rounded-xl bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm" }), _jsx("button", { onClick: sendMessage, disabled: !newMessage.trim() || sending, className: "p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(Send, { size: 16 }) })] }) })] })) })] })] })] }) }));
}
