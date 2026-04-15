import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MedicalServiceDashboardSidebar } from "@/components/MedicalServiceDashboardSidebar";
import { Send, Search } from "lucide-react";
const tok = () => localStorage.getItem("megacare_token") ?? "";
const COLORS = ["bg-blue-500", "bg-purple-500", "bg-green-500", "bg-amber-500", "bg-pink-500", "bg-indigo-500"];
function initials(name) { return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }
function roleLabel(role) {
    const map = { doctor: "Médecin", pharmacist: "Pharmacien", admin: "Administrateur", medical_service: "Service médical", paramedical: "Paramédical", lab: "Laboratoire" };
    return map[role] || role;
}
const conversations = [];
const allMessages = {};
export default function MessagingPage() {
    const [selected, setSelected] = useState(null);
    const [input, setInput] = useState("");
    const [convos, setConvos] = useState(conversations);
    const [messages, setMessages] = useState([]);
    const [searchConv, setSearchConv] = useState("");
    useEffect(() => {
        fetch("/api/messages/conversations", { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then((d) => {
            if (!Array.isArray(d))
                return;
            const list = d.map((c, i) => ({
                id: c.partnerId,
                name: c.partnerName,
                role: roleLabel(c.partnerRole),
                lastMessage: c.lastMessage?.content || "",
                time: c.lastMessage ? new Date(c.lastMessage.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "",
                unread: c.unread || 0,
                initials: initials(c.partnerName),
                color: COLORS[i % COLORS.length],
            }));
            setConvos(list);
            if (list.length) {
                setSelected(list[0].id);
            }
        })
            .catch(() => { });
    }, []);
    useEffect(() => {
        if (!selected)
            return;
        fetch(`/api/messages/thread/${selected}`, { headers: { Authorization: `Bearer ${tok()}` } })
            .then(r => r.json())
            .then((d) => {
            if (!Array.isArray(d))
                return;
            const myId = JSON.parse(atob((tok().split(".")[1] || "e30=").replace(/-/g, "+").replace(/_/g, "/")))?.id || "";
            setMessages(d.map(m => ({
                id: m.id || m._id,
                sender: m.senderName,
                text: m.content,
                time: new Date(m.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                mine: m.senderId === myId,
            })));
        })
            .catch(() => { });
    }, [selected]);
    const conv = convos.find((c) => c.id === selected) ?? null;
    const msgs = messages;
    const filteredConvs = convos.filter((c) => c.name.toLowerCase().includes(searchConv.toLowerCase()));
    async function sendMessage() {
        if (!input.trim() || !selected)
            return;
        const r = await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok()}` },
            body: JSON.stringify({ receiverId: selected, content: input.trim() }),
        }).catch(() => null);
        if (r && r.ok) {
            const data = await r.json();
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
            setMessages(prev => [...prev, { id: data.id || String(Date.now()), sender: "Moi", text: input.trim(), time, mine: true }]);
        }
        setInput("");
    }
    return (_jsxs("div", { className: "flex min-h-screen bg-background", children: [_jsx(MedicalServiceDashboardSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("header", { className: "bg-card border-b border-border px-6 py-4 shrink-0", children: [_jsx("h1", { className: "text-xl font-bold text-foreground", children: "Messagerie" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Communication interne avec l'\u00E9quipe m\u00E9dicale" })] }), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsxs("div", { className: "w-72 shrink-0 border-r border-border flex flex-col bg-card", children: [_jsx("div", { className: "p-3 border-b border-border", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }), _jsx("input", { value: searchConv, onChange: (e) => setSearchConv(e.target.value), placeholder: "Rechercher\u2026", className: "w-full pl-8 pr-3 py-2 border border-border rounded-lg text-xs bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" })] }) }), _jsx("div", { className: "flex-1 overflow-y-auto", children: filteredConvs.map((c) => (_jsxs("button", { onClick: () => setSelected(c.id), className: `w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition text-left border-b border-border last:border-0 ${selected === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`, children: [_jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${c.color}`, children: c.initials }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", children: c.name }), _jsx("span", { className: "text-xs text-muted-foreground shrink-0 ml-2", children: c.time })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: c.role }), _jsx("p", { className: "text-xs text-muted-foreground truncate", children: c.lastMessage })] }), c.unread > 0 && (_jsx("span", { className: "shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center", children: c.unread }))] }, c.id))) })] }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden bg-background", children: [_jsxs("div", { className: "px-5 py-3 border-b border-border bg-card flex items-center gap-3", children: [_jsx("div", { className: `w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ${conv?.color ?? "bg-muted"}`, children: conv?.initials ?? "" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-foreground text-sm", children: conv?.name ?? "" }), _jsx("p", { className: "text-xs text-muted-foreground", children: conv?.role ?? "" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-5 space-y-4", children: msgs.map((m) => (_jsx("div", { className: `flex ${m.mine ? "justify-end" : "justify-start"}`, children: _jsxs("div", { className: `max-w-[70%] rounded-2xl px-4 py-2.5 ${m.mine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"}`, children: [!m.mine && _jsx("p", { className: "text-xs font-medium mb-1 opacity-60", children: m.sender }), _jsx("p", { className: "text-sm", children: m.text }), _jsx("p", { className: `text-[10px] mt-1 ${m.mine ? "text-primary-foreground/60 text-right" : "text-muted-foreground"}`, children: m.time })] }) }, m.id))) }), _jsx("div", { className: "px-5 py-4 border-t border-border bg-card", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("input", { value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => { if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        sendMessage();
                                                    } }, placeholder: "\u00C9crire un message\u2026", className: "flex-1 border border-border rounded-xl px-4 py-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" }), _jsx("button", { onClick: sendMessage, disabled: !input.trim(), className: "w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-40", children: _jsx(Send, { size: 16 }) })] }) })] })] })] })] }));
}
