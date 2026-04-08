'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Video, Clock, Info, Bot, Scale, Download, Phone, 
  MoreVertical, Send, Smile, Paperclip, Mic, CheckDouble, Check,
  ChevronLeft, Shield, MessageCircle, Tag, Filter, Download as DownloadIcon,
  Globe, BarChart3, Heart, Zap, User, TrendingUp, CheckCircle2,
  Calendar, CreditCard, LayoutDashboard, FileText, Megaphone, MapPin, 
  Languages, Sparkles, Activity
} from 'lucide-react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import styles from './UnifiedAgriHub.module.css';

// ─── TYPES ─────────────────────────────────────────────────────────────

interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  status: 'SENT' | 'DELIVERED' | 'SEEN';
  createdAt: string;
  fileUrl?: string;
  fileName?: string;
}

interface ChatRoom {
  id: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  productName: string;
  orderAmount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  isOnline?: boolean;
  avatarUrl?: string;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────

export function UnifiedAgriHub({ role }: { role: 'FARMER' | 'BUYER' }) {
  const [activeFeature, setActiveFeature] = useState('chat');
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // AI & Advanced States
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiNegotiationAdvice, setAiNegotiationAdvice] = useState<string | null>(null);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState<'summary' | 'negotiation' | null>(null);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  // ─── FEATURES DEFINITION ───────────────────────────────────────────────

  const features = [
    { id: 'chat', name: 'Real-Time PowerChat', icon: MessageCircle, color: '#3b82f6', desc: 'Secure trade messaging' },
    { id: 'video', name: 'Field Inspection', icon: Video, color: '#10b981', desc: 'HD Video verification' },
    { id: 'voice', name: 'Voice Commerce', icon: Mic, color: '#f59e0b', desc: 'Speak to trade' },
    { id: 'ai', name: 'AI Trade Genius', icon: Bot, color: '#8b5cf6', desc: 'Summary & Advice' },
    { id: 'contracts', name: 'Deal Tracker', icon: FileText, color: '#ec4899', desc: 'Smart contract status' },
    { id: 'translate', name: 'Translate Pro', icon: Languages, color: '#06b6d4', desc: 'Break language barriers' },
    { id: 'analytics', name: 'Price Trends', icon: TrendingUp, color: '#f43f5e', desc: 'Market sentiment' },
    { id: 'matching', name: 'Smart Matchmaker', icon: Sparkles, color: '#10b981', desc: 'Find better deals' },
    { id: 'trust', name: 'Trust Center', icon: Shield, color: '#6366f1', desc: 'Verification & KYC' },
    { id: 'broadcast', name: 'Bulk Connect', icon: Megaphone, color: '#ef4444', desc: 'Reach everyone' },
  ];

  // ─── LOGIC ────────────────────────────────────────────────────────────

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
      fetchRooms(user.id);
      setupSocket(user.id);
    }
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const setupSocket = (userId: string) => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001', {
      auth: { userId }
    });
    socketRef.current = socket;

    socket.on('message_received', (msg: Message) => {
      if (selectedRoom?.id === msg.chatRoomId) {
        setMessages(prev => [...prev, msg]);
        if (msg.senderId !== userId) {
          socket.emit('message_seen', { messageId: msg.id, chatRoomId: msg.chatRoomId, userId });
          fetchSmartReplies(msg.content);
        }
      } else {
        setRooms(prev => prev.map(r => r.id === msg.chatRoomId ? { ...r, unreadCount: r.unreadCount + 1, lastMessage: msg.content } : r));
      }
    });

    socket.on('typing', ({ userId: typingId, isTyping: status }) => {
      if (typingId !== userId) setOtherUserTyping(status);
    });
  };

  const fetchRooms = async (userId: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/agri-chat/rooms`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setRooms(res.data);
    } catch (e) {}
  };

  const fetchMessages = async (roomId: string) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/agri-chat/rooms/${roomId}/messages`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMessages(res.data);
      socketRef.current?.emit('join_room', { chatRoomId: roomId, userId: currentUser.id });
      socketRef.current?.emit('mark_all_seen', { chatRoomId: roomId, userId: currentUser.id });
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const fetchSmartReplies = async (text: string) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/agri-chat/ai/smart-replies`, {
        params: { lastMessage: text },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSmartReplies(res.data.suggestions);
    } catch (e) {}
  };

  const handleSend = () => {
    if (!inputValue.trim() || !selectedRoom) return;
    socketRef.current?.emit('send_message', {
      chatRoomId: selectedRoom.id,
      senderId: currentUser.id,
      content: inputValue,
      type: 'text'
    });
    setInputValue('');
  };

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // ─── SUB-FEATURE VIEWS ───────────────────────────────────────────────

  const renderFeatureContent = () => {
    switch(activeFeature) {
      case 'chat':
        return (
          <div className={styles.chatModule}>
            <div className={styles.chatInsidebar}>
              <div className={styles.inHeader}>
                <h2>Recent Deals</h2>
                <div className={styles.inSearch}>
                  <Search size={16} />
                  <input type="text" placeholder="Search names..." />
                </div>
              </div>
              <div className={styles.inRoomList}>
                {rooms.map(room => (
                  <div 
                    key={room.id} 
                    className={`${styles.inRoomItem} ${selectedRoom?.id === room.id ? styles.inRoomSelected : ''}`}
                    onClick={() => { setSelectedRoom(room); fetchMessages(room.id); }}
                  >
                    <div className={styles.inAvatar}>{(room.buyerName || room.farmerName)[0]}</div>
                    <div className={styles.inInfo}>
                      <div className={styles.inName}>{room.buyerName || room.farmerName}</div>
                      <div className={styles.inProd}>{room.productName}</div>
                      <div className={styles.inLastMsg}>{room.lastMessage || 'Click to chat...'}</div>
                    </div>
                    {room.unreadCount > 0 && <div className={styles.inUnread}>{room.unreadCount}</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.chatMain}>
              {selectedRoom ? (
                <>
                  <div className={styles.chatHeader}>
                    <div className={styles.hLeft}>
                      <div className={styles.hAvatar}>{(selectedRoom.buyerName || selectedRoom.farmerName)[0]}</div>
                      <div>
                        <h3>{selectedRoom.buyerName || selectedRoom.farmerName}</h3>
                        <span className={styles.hStatus}>{otherUserTyping ? 'Typing...' : 'Online'}</span>
                      </div>
                    </div>
                    <div className={styles.hActions}>
                      <Video size={20} className={styles.hIcon} onClick={() => setActiveFeature('video')} />
                      <Scale size={20} className={styles.hIcon} onClick={() => setShowAiModal('negotiation')} />
                      <Bot size={20} className={styles.hIcon} onClick={() => setShowAiModal('summary')} />
                    </div>
                  </div>
                  <div className={styles.messagesWrap}>
                    {messages.map(m => (
                      <div key={m.id} className={`${styles.mWrapper} ${m.senderId === currentUser.id ? styles.mMe : styles.mThem}`}>
                        <div className={styles.mContent}>{m.content}</div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className={styles.chatInput}>
                    {smartReplies.length > 0 && (
                      <div className={styles.smartRow}>
                        {smartReplies.map((r, i) => <button key={i} onClick={() => setInputValue(r)}>{r}</button>)}
                      </div>
                    )}
                    <div className={styles.inputControls}>
                      <Paperclip size={20} className={styles.iIcon} />
                      <Mic size={20} className={styles.iIcon} onClick={() => setActiveFeature('voice')} />
                      <input 
                        type="text" 
                        placeholder="Type something amazing..." 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      />
                      <button className={styles.sendBtn} onClick={handleSend}><Send size={18} /></button>
                    </div>
                  </div>
                </>
              ) : (
                <div className={styles.emptyWrap}>
                   <MessageCircle size={80} opacity={0.2} />
                   <p>Select a trade conversation to power up</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className={styles.featureBlank}>
             <h1>Trade Analytics Hub</h1>
             <div className={styles.gridStats}>
                <div className={styles.cardStat}><Activity /> <span>Demand: High (+12%)</span></div>
                <div className={styles.cardStat}><TrendingUp /> <span>Sentiment: Positive</span></div>
             </div>
          </div>
        );
      default:
        return (
          <div className={styles.featureBlank}>
            <div className={styles.comingSoon}>
               <Sparkles size={60} color="#3b82f6" />
               <h2>{features.find(f => f.id === activeFeature)?.name}</h2>
               <p>This premium system is currently optimizing for your {role.toLowerCase()} profile.</p>
               <button onClick={() => setActiveFeature('chat')}>Return to PowerChat</button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.hubContainer}>
      {/* Sidebar Navigation (10 Subfeatures) */}
      <div className={styles.hubSidebar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}><Zap fill="white" /></div>
          <span>AgriHub</span>
        </div>
        <nav className={styles.navLinks}>
          {features.map(f => (
            <button 
              key={f.id} 
              className={`${styles.navItem} ${activeFeature === f.id ? styles.navActive : ''}`}
              onClick={() => setActiveFeature(f.id)}
            >
              <f.icon size={20} />
              <div className={styles.navText}>
                <span className={styles.nTitle}>{f.name}</span>
                <span className={styles.nDesc}>{f.desc}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Feature Content */}
      <div className={styles.hubMain}>
        {renderFeatureContent()}
      </div>

      {/* AI Modals */}
      <AnimatePresence>
        {showAiModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={styles.modalBack}
            onClick={() => setShowAiModal(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className={styles.modalBox}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.modalHead}>
                <div className={styles.headIcon}><Bot /></div>
                <h3>{showAiModal === 'summary' ? 'AI Conversation Summary' : 'AI Negotiation Logic'}</h3>
              </div>
              <div className={styles.modalBody}>
                 {isAiLoading ? 'Gemini AI is processing your trade context...' : (showAiModal === 'summary' ? 'This conversation focuses on bulk harvest quality and logistics. The buyer is satisfied with the current pricing but requires confirmation on delivery timelines.' : 'Market sentiment suggests you have the upper hand. Consider offering a 2% bulk discount to close the deal today.')}
              </div>
              <button className={styles.closeBtn} onClick={() => setShowAiModal(null)}>Apply Insights</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
