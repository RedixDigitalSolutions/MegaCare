'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';

export default function MessagingPage() {
  const [selectedChat, setSelectedChat] = useState<number>(1);
  const [messageText, setMessageText] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Dr. Ahmed Saidi',
      role: 'Médecin',
      lastMessage: 'Patient en bonne condition',
      time: '10 minutes',
      unread: 2,
      messages: [
        { id: 1, sender: 'Dr. Ahmed', text: 'Comment se sent le patient Fatima?', time: '09:30' },
        { id: 2, sender: 'You', text: 'Bonne amélioration', time: '09:45' },
      ],
    },
    {
      id: 2,
      name: 'Infirmière Nadia',
      role: 'Infirmier',
      lastMessage: 'Visite complétée',
      time: '1 heure',
      unread: 0,
      messages: [
        { id: 1, sender: 'Nadia', text: 'Visite de Mohamed Ali prévue 14h', time: '08:00' },
      ],
    },
    {
      id: 3,
      name: 'Équipe HAD Tunis',
      role: 'Groupe',
      lastMessage: 'Tournées de demain programmées',
      time: 'Hier',
      unread: 1,
      messages: [
        { id: 1, sender: 'Group', text: 'Reunion demain 9h', time: 'Hier' },
      ],
    },
  ];

  const currentChat = chats.find((c) => c.id === selectedChat);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link href="/medical-service-dashboard" className="text-primary hover:text-primary/80">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Messagerie</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Conversations</h2>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 p-2">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    selectedChat === chat.id
                      ? 'bg-primary/10 border-l-2 border-primary'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{chat.name}</p>
                      <p className="text-xs text-muted-foreground">{chat.role}</p>
                      <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <span className="ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded-full font-semibold">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{chat.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          {currentChat && (
            <div className="lg:col-span-2 bg-card rounded-xl border border-border flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold text-foreground">{currentChat.name}</h3>
                <p className="text-sm text-muted-foreground">{currentChat.role}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {currentChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.sender === 'You'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'You' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1 px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
