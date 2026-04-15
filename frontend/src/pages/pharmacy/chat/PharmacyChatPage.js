import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Send, CircleCheckBig } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const PHARMACY_USER_ID = "00000000-0000-0000-0000-000000000009";
export default function ChatPage() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);
    const token = localStorage.getItem("megacare_token");
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }
        fetch(`/api/messages/thread/${PHARMACY_USER_ID}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.ok ? r.json() : [])
            .then((data) => {
            setMessages(data.map((m) => ({
                id: m._id,
                sender: m.senderId === user?.id ? "patient" : "pharmacist",
                name: m.senderId !== user?.id ? "Pharmacien" : undefined,
                text: m.content,
                time: new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                read: true,
            })));
        })
            .catch(() => { })
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSendMessage = async () => {
        if (!inputValue.trim() || !token)
            return;
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
        }
        catch { /* ignore */ }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { className: "min-h-screen bg-background pt-24", children: _jsxs("div", { className: "max-w-4xl mx-auto h-screen flex flex-col", children: [_jsx("div", { className: "bg-card border-b border-border p-6 space-y-2", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold", children: "PA" }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Pharmacie El Amal" }), _jsxs("p", { className: "text-sm text-green-600 flex items-center gap-1", children: [_jsx("span", { className: "w-2 h-2 bg-green-600 rounded-full" }), "En ligne maintenant"] })] })] }) }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-4", children: [!token ? (_jsx("div", { className: "flex items-center justify-center h-full text-muted-foreground", children: "Connectez-vous pour chatter avec la pharmacie" })) : loading ? (_jsx("div", { className: "flex items-center justify-center h-full text-muted-foreground", children: "Chargement des messages..." })) : messages.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full text-muted-foreground", children: "Aucun message. Posez votre premi\u00E8re question!" })) : (messages.map((msg) => (_jsx("div", { className: `flex ${msg.sender === "patient" ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-sm p-4 rounded-lg space-y-1 ${msg.sender === "patient"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-foreground"}`, children: [msg.sender === "pharmacist" && (_jsx("p", { className: "text-xs font-semibold opacity-75", children: msg.name })), _jsx("p", { className: "text-sm leading-relaxed", children: msg.text }), _jsxs("div", { className: `text-xs flex items-center gap-1 ${msg.sender === "patient" ? "justify-end" : ""}`, children: [msg.time, msg.sender === "patient" && msg.read && (_jsx(CircleCheckBig, { size: 12 }))] })] }) }, msg.id)))), _jsx("div", { ref: bottomRef })] }), _jsx("div", { className: "bg-card border-t border-border p-6", children: _jsxs("div", { className: "flex gap-3", children: [_jsx("input", { type: "text", value: inputValue, onChange: (e) => setInputValue(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSendMessage(), placeholder: "Posez votre question...", className: "flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" }), _jsx("button", { onClick: handleSendMessage, className: "bg-primary text-primary-foreground p-3 rounded-lg hover:bg-primary/90 transition", children: _jsx(Send, { size: 20 }) })] }) })] }) }), _jsx(Footer, {})] }));
}
