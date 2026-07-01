// Messages.jsx - Realtime-like direct chat messaging page for BorrowIT connected to Spring Boot backend

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Card, Avatar, Button } from '../components/UI';
import * as Icons from 'lucide-react';

export default function Messages() {
  const { currentUser } = useApp();
  const [searchParams] = useSearchParams();
  const chatQuery = searchParams.get('chat');

  // Chat States
  const [contacts, setContacts] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fetch initial contact list
  useEffect(() => {
    const loadContacts = async () => {
      try {
        setLoading(true);
        const contactList = await api.fetchChatContacts();
        
        let localContacts = [...contactList];

        // If a contact is specified in the URL query, check if they exist in contacts list
        if (chatQuery) {
          const contactExists = localContacts.some(c => c.contactId.toString() === chatQuery.toString());
          if (!contactExists) {
            try {
              const chatUser = await api.getUser(chatQuery);
              const tempContact = {
                contactId: chatUser.id,
                name: chatUser.fullName,
                avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${chatUser.id}`,
                lastMessage: 'Tap to start conversation',
                time: '',
                unread: false
              };
              localContacts = [tempContact, ...localContacts];
            } catch (err) {
              console.error("Could not fetch query contact details:", err);
            }
          }
          setActiveContactId(Number(chatQuery));
        } else if (localContacts.length > 0) {
          setActiveContactId(localContacts[0].contactId);
        }

        setContacts(localContacts);

      } catch (err) {
        console.error("Error loading chat contacts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      loadContacts();
    }
  }, [currentUser, chatQuery]);

  // Fetch messages when active contact changes
  useEffect(() => {
    const loadChatHistory = async () => {
      if (activeContactId && currentUser) {
        try {
          const history = await api.fetchMessages(activeContactId);
          setMessages(history);
        } catch (err) {
          console.error("Error loading messages:", err);
        }
      }
    };

    loadChatHistory();
    
    // Poll chat history every 3 seconds to retrieve live responses
    const interval = setInterval(loadChatHistory, 3000);
    return () => clearInterval(interval);
  }, [activeContactId, currentUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContactId || !currentUser) return;

    const typedText = inputText;
    setInputText('');

    try {
      // Send message to Spring backend
      const newMsg = await api.sendMessage(activeContactId, typedText);

      // Append locally for immediate display
      setMessages(prev => [...prev, newMsg]);

      // Re-fetch contacts to update sidebar preview
      const updatedContacts = await api.fetchChatContacts();
      setContacts(updatedContacts);

    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const activeContact = contacts.find(c => c.contactId === activeContactId);

  return (
    <div className="h-[75vh] flex rounded-2xl overflow-hidden glass border border-[#2A2A2D]">
      
      {/* --- Chat contacts Sidebar (4 cols on desktop) --- */}
      <div className="w-full md:w-80 border-r border-[#2A2A2D] flex flex-col h-full bg-[#1A1A1C] border-[#2A2A2D]/60 shadow-sm">
        <div className="p-4 border-b border-[#2A2A2D] flex items-center justify-between">
          <h2 className="text-sm font-black text-white">Inbox Messages</h2>
          <Icons.MessageSquarePlus className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer" />
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-200/10 scrollbar-none">
          {contacts.length > 0 ? (
            contacts.map((contact) => {
              const active = contact.contactId === activeContactId;
              return (
                <div
                  key={contact.contactId}
                  onClick={() => setActiveContactId(contact.contactId)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                    active ? 'bg-brand-primary/10 border-l-2 border-brand-primary' : 'hover:bg-slate-800/20'
                  }`}
                >
                  <Avatar src={contact.avatar} alt={contact.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-extrabold text-white truncate">{contact.name}</h4>
                      <span className="text-[9px] text-slate-500 font-semibold">{contact.time}</span>
                    </div>
                    <p className={`text-[11px] truncate mt-1 leading-normal font-sans ${contact.unread ? 'text-brand-primary font-bold' : 'text-slate-500'}`}>
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center p-8 text-xs text-slate-500 font-bold">
              No active conversations.
            </div>
          )}
        </div>
      </div>

      {/* --- Chat Conversation View (8 cols) --- */}
      <div className="flex-1 flex flex-col h-full bg-[#080C15]/40 relative">
        {activeContact ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-[#2A2A2D] bg-[#1A1A1C] border-[#2A2A2D]/80 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar src={activeContact.avatar} alt={activeContact.name} size="sm" />
                <div>
                  <h3 className="text-xs font-extrabold text-white">{activeContact.name}</h3>
                  <span className="text-[9px] text-brand-primary font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                    Online
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3.5 text-slate-500">
                <Icons.PhoneCall className="w-4 h-4 hover:text-white cursor-pointer" />
                <Icons.Video className="w-4.5 h-4.5 hover:text-white cursor-pointer" />
                <Icons.MoreVertical className="w-4 h-4 hover:text-white cursor-pointer" />
              </div>
            </div>

            {/* Message Bubble History */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg) => {
                const isMe = msg.senderId === currentUser?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed font-sans ${
                      isMe 
                        ? 'bg-brand-primary text-black rounded-tr-none font-bold' 
                        : 'bg-[#131314] text-white border border-[#2A2A2D] rounded-tl-none'
                    }`}>
                      <p>{msg.text}</p>
                      <span className={`text-[8px] flex items-center justify-end gap-1 mt-1.5 text-right font-semibold ${
                        isMe ? 'text-black/60' : 'text-slate-500'
                      }`}>
                        {msg.time}
                        {isMe && (
                          <span className={`text-[10px] font-bold ${msg.status === 'read' ? 'text-blue-900' : 'text-black/40'}`}>
                            {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input message form footer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#2A2A2D] bg-[#1A1A1C] flex gap-3">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-1 bg-[#131314] border border-[#2A2A2D] focus:border-brand-primary rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none font-sans"
              />
              <Button type="submit" variant="primary" size="sm" className="px-4 py-2.5 font-extrabold flex items-center gap-1.5">
                <Icons.Send className="w-3.5 h-3.5" />
                Send
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-bold p-8">
            <Icons.MessageSquare className="w-10 h-10 text-slate-650 mb-3" />
            <p className="text-xs">Select a contact to view chat log history.</p>
          </div>
        )}
      </div>

    </div>
  );
}
