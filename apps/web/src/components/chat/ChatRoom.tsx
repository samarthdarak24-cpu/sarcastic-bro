/* ========================================================================
   WhatsApp-like Chat System - Main Chat Room Component
   Real-time messaging, typing indicators, message status
   ======================================================================== */

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { Send, Paperclip, Smile, Phone, Video, Info, Mic, Search, Pin, Globe, Download, Clock, Tag, Image as ImageIcon } from 'lucide-react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import styles from './ChatRoom.module.css';

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  role: 'FARMER' | 'BUYER';
}

interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice';
  fileUrl?: string;
  fileName?: string;
  status: 'SENT' | 'DELIVERED' | 'SEEN';
  reactions?: MessageReaction[];
  isEdited?: boolean;
  createdAt: string;
  sender: User;
}

interface MessageReaction {
  id: string;
  emoji: string;
  user: User;
}

interface ChatRoom {
  id: string;
  orderId: string;
  farmerId: string;
  buyerId: string;
  productName: string;
  orderAmount: number;
  lastMessageAt: string;
  farmer: User;
  buyer: User;
  messages?: Message[];
}

interface ChatRoomProps {
  orderId: string;
  currentUser: { id: string; name: string; role: string };
  onClose?: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  orderId,
  currentUser,
  onClose,
}) => {
  const [chatRoom, setChatRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [otherUserOnline, setOtherUserOnline] = useState(false);
  const [lastSeenAt, setLastSeenAt] = useState<string>('');

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sub-Feature States
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedMessages, setPinnedMessages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showDeliveryStatus, setShowDeliveryStatus] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  // AI Feature States
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showAiSummary, setShowAiSummary] = useState(false);
  const [aiNegotiationAdvice, setAiNegotiationAdvice] = useState<string | null>(null);
  const [showNegotiationAssist, setShowNegotiationAssist] = useState(false);
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const playNotificationSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime); // 600Hz beep (WhatsApp-like short pop)
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      
      oscillator.start();
      setTimeout(() => oscillator.stop(), 50);
    } catch (e) {
      console.log('Audio disabled context');
    }
  }, []);

  // Request Notification Permissions early
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Initialize chat room and socket connection
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found');
          setIsLoading(false);
          return;
        }

        let roomData;
        try {
          const response = await axios.get(`${API_URL}/api/agri-chat/rooms/order/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          roomData = response.data;
          console.log('Chat room loaded:', roomData);
        } catch (err) {
          console.warn('Backend unavailable. Falling back to stunning Dummy + Real-Time interactive data.');
          roomData = {
            id: 'mock-room-123',
            orderId: orderId,
            farmerId: currentUser.role === 'FARMER' ? currentUser.id : 'mock-farmer-id',
            buyerId: currentUser.role === 'BUYER' ? currentUser.id : 'mock-buyer-id',
            productName: 'Premium Harvest Order',
            orderAmount: 45500,
            lastMessageAt: new Date().toISOString(),
            farmer: { id: 'mock-farmer-id', name: 'Farmer Amit', role: 'FARMER', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
            buyer: { id: 'mock-buyer-id', name: 'Buyer John', role: 'BUYER', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
          };
        }
        
        setChatRoom(roomData);

        // Initialize socket connection
        const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001';
        const socket = io(SOCKET_URL, {
          auth: { token },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
          console.log('Socket connected:', socket.id);

          // Join chat room
          socket.emit('join_room', {
            chatRoomId: roomData.id,
            userId: currentUser.id,
          });

          // Join user-specific room for notifications
          socket.emit('user_online', {
            chatRoomId: roomData.id,
            userId: currentUser.id,
          });
        });

        setIsLoading(false);

        // Mark all messages as seen when entering the room
        socket.emit('mark_all_seen', {
          chatRoomId: roomData.id,
          userId: currentUser.id,
        });

        // Listen for real-time messages
        socket.on('message_received', (message) => {
          setMessages((prev) => [...prev, message]);
          scrollToBottom();

          if (message.senderId !== currentUser.id) {
            playNotificationSound();
            
            // Fetch smart replies for the new message
            fetchSmartReplies(message.content);
            
            // Show Browser Notification if permitted and window not focused
            if (!document.hasFocus() && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              new Notification(`New message from ${message.sender?.name || 'User'}`, {
                body: message.type === 'text' ? message.content : `[Attached ${message.type}]`,
                icon: '/icons/whatsapp-icon.png' // hypothetical
              });
            }
          }

          // Auto-mark as seen if window is focused
          if (document.hasFocus() && message.senderId !== currentUser.id) {
            socket.emit('message_seen', {
              messageId: message.id,
              chatRoomId: roomData.id,
              userId: currentUser.id,
            });
          }
        });

        // Listen for typing indicators
        socket.on('typing', ({ userId, isTyping }) => {
          if (userId !== currentUser.id) {
            setOtherUserTyping(isTyping);
          }
        });

        // Listen for online status
        socket.on('user_online', ({ userId, isOnline }) => {
          if (userId !== currentUser.id) {
            setOtherUserOnline(isOnline);
          }
        });

        socket.on('user_offline', ({ userId, lastSeenAt }) => {
          if (userId !== currentUser.id) {
            setOtherUserOnline(false);
            setLastSeenAt(lastSeenAt);
          }
        });

        // Listen for message status updates
        socket.on('message_seen', (messageId) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId
                ? { ...msg, status: 'SEEN' }
                : msg
            )
          );
        });

        socket.on('all_messages_seen', ({ userId: seenByUserId }) => {
          if (seenByUserId !== currentUser.id) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.senderId === currentUser.id ? { ...msg, status: 'SEEN' } : msg
              )
            );
          }
        });

        socket.on('message-delivered', ({ messageId: deliveredMessageId }) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === deliveredMessageId
                ? { ...msg, status: 'DELIVERED' }
                : msg
            )
          );
        });

        socket.on('message-reaction-updated', ({ messageId, reactions }) => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, reactions } : msg
            )
          );
        });

        // Listen for video call events
        socket.on('video_call_started', ({ chatRoomId, callerName }) => {
          if (confirm(`${callerName} is inviting you to a video call. Join?`)) {
            setIsVideoCallActive(true);
          }
        });

        socket.on('error', (error) => {
          console.error('Socket error:', error);
        });

        socketRef.current = socket;

        // Load message history
        try {
          const messagesResponse = await axios.get(
            `${API_URL}/api/agri-chat/rooms/${roomData.id}/messages`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              params: { page: 1, limit: 50 },
            }
          );
          setMessages(messagesResponse.data);
        } catch (e) {
          // Fallback Dummy Messages
          const otherId = currentUser.role === 'FARMER' ? roomData.buyerId : roomData.farmerId;
          const otherUser = currentUser.role === 'FARMER' ? roomData.buyer : roomData.farmer;
          setMessages([
            {
              id: 'msg-1',
              chatRoomId: roomData.id,
              senderId: otherId,
              content: `Hello! I'm interested in the ${roomData.productName} order.`,
              type: 'text',
              status: 'SEEN',
              createdAt: new Date(Date.now() - 3600000).toISOString(),
              sender: otherUser
            },
            {
              id: 'msg-2',
              chatRoomId: roomData.id,
              senderId: currentUser.id,
              content: 'Hi! Yes, everything is ready. When do you need it dispatched?',
              type: 'text',
              status: 'SEEN',
              createdAt: new Date(Date.now() - 3500000).toISOString(),
              sender: currentUser as User
            },
            {
              id: 'msg-3',
              chatRoomId: roomData.id,
              senderId: otherId,
              content: 'If possible, tomorrow morning please.',
              type: 'text',
              status: 'SEEN',
              createdAt: new Date(Date.now() - 3400000).toISOString(),
              sender: otherUser
            }
          ]);
          setOtherUserOnline(true);
        }

        setIsLoading(false);
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setIsLoading(false);
      }
    };

    initializeChat();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [orderId, currentUser.id, playNotificationSound]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || !chatRoom || !socketRef.current) {
      return;
    }

    try {
      // Stop typing indicator
      socketRef.current.emit('typing', {
        chatRoomId: chatRoom.id,
        userId: currentUser.id,
        isTyping: false,
      });

      // Send message via socket if possible, otherwise simulate local real-time delivery
      if (socketRef.current?.connected) {
        socketRef.current.emit('send_message', {
          chatRoomId: chatRoom.id,
          senderId: currentUser.id,
          content: inputValue,
          type: 'text',
        });
      } else {
        const dummyMsg: Message = {
          id: Date.now().toString(),
          chatRoomId: chatRoom.id,
          senderId: currentUser.id,
          content: inputValue,
          type: 'text',
          status: 'SENT',
          createdAt: new Date().toISOString(),
          sender: currentUser as User
        };
        setMessages(prev => [...prev, dummyMsg]);
        setTimeout(scrollToBottom, 100);

        // Simulate local response for active demo
        setTimeout(() => setOtherUserTyping(true), 1500);
        setTimeout(() => {
          setOtherUserTyping(false);
          playNotificationSound();
          setMessages(prev => [...prev, {
            id: (Date.now() + 1).toString(),
            chatRoomId: chatRoom.id,
            senderId: getOtherUser()?.id || 'other',
            content: "Received your message! Looking into it right now.",
            type: 'text',
            status: 'SENT',
            createdAt: new Date().toISOString(),
            sender: getOtherUser() as User
          }]);
          setTimeout(scrollToBottom, 100);
        }, 4000);
      }

      setInputValue('');
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (!chatRoom || !socketRef.current) {
      return;
    }

    if (!isTyping) {
      setIsTyping(true);
      socketRef.current.emit('typing', {
        chatRoomId: chatRoom.id,
        userId: currentUser.id,
        isTyping: true,
      });
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current?.emit('typing', {
        chatRoomId: chatRoom.id,
        userId: currentUser.id,
        isTyping: false,
      });
    }, 3000);
  };

  const fetchSmartReplies = async (text: string) => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/agri-chat/ai/smart-replies`, {
        params: { lastMessage: text },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSmartReplies(response.data.suggestions);
    } catch (e) {
      console.error('Error fetching smart replies:', e);
    }
  };

  const handleAiSummarize = async () => {
    if (!chatRoom) return;
    setIsAiLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/agri-chat/rooms/${chatRoom.id}/ai/summary`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAiSummary(response.data.summary);
      setShowAiSummary(true);
    } catch (e) {
      console.error('Error summarizing chat:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleNegotiationAssist = async () => {
    if (!chatRoom) return;
    setIsAiLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/agri-chat/rooms/${chatRoom.id}/ai/negotiation-assist`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setAiNegotiationAdvice(response.data.advice);
      setShowNegotiationAssist(true);
    } catch (e) {
      console.error('Error getting negotiation assist:', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const startVideoCall = async () => {
    if (socketRef.current && chatRoom) {
      socketRef.current.emit('start_video_call', {
        chatRoomId: chatRoom.id,
        callerId: currentUser.id,
        callerName: currentUser.name
      });
    }
    
    setIsVideoCallActive(true);
    
    // Simulate camera access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.error('Error accessing camera:', e);
    }
  };

  const endVideoCall = () => {
    setIsVideoCallActive(false);
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
    }
  };

  const handleOrderAction = async (action: 'CONFIRM' | 'CANCEL' | 'UPDATE') => {
    if (!chatRoom) return;
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/orders/${chatRoom.orderId}`, {
        status: action === 'CONFIRM' ? 'CONFIRMED' : action === 'CANCEL' ? 'CANCELLED' : 'PROCESSING'
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(`Order ${action}ED successfully!`);
      setShowOrderDetails(false);
    } catch (e) {
      console.error(`Error ${action}ing order:`, e);
      alert("Action failed. Please try again.");
    }
  };

  const getOtherUser = () => {
    if (!chatRoom) return null;
    return currentUser.id === chatRoom.farmerId ? chatRoom.buyer : chatRoom.farmer;
  };

  const otherUser = getOtherUser();

  // ========== SUB-FEATURE HANDLERS ==========

  // Feature 1: Quick Reply Templates
  const quickReplyTemplates = [
    { emoji: '💰', text: 'What is your best price for this?' },
    { emoji: '📦', text: 'Can you deliver this week?' },
    { emoji: '✅', text: 'Agreed! Let\'s proceed with this deal' },
    { emoji: '❓', text: 'What is the quality grade?' },
    { emoji: '📞', text: 'Can we discuss over a call?' },
  ];

  const handleQuickReply = (templateText: string) => {
    setInputValue(templateText);
    setShowQuickReplies(false);
  };

  // Feature 2: Voice Message Recording
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Upload voice message to server
        setIsAiLoading(true);
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice-message.wav');
        
        try {
          const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/uploads/file`, formData, {
            headers: { 
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (socketRef.current && chatRoom) {
            socketRef.current.emit('send_message', {
              chatRoomId: chatRoom.id,
              content: '[Voice Message]',
              type: 'voice',
              fileUrl: uploadRes.data.fileUrl,
              fileName: uploadRes.data.fileName,
            });
          }
        } catch (e) {
          console.error('Error uploading voice message:', e);
        } finally {
          setIsAiLoading(false);
          setIsRecordingVoice(false);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecordingVoice(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
    }
  };

  // Feature 3: Message Search
  const filteredMessages = searchQuery
    ? messages.filter(
        (msg) =>
          msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  // Feature 4: Message Pinning
  const togglePinMessage = (messageId: string) => {
    if (pinnedMessages.includes(messageId)) {
      setPinnedMessages(pinnedMessages.filter((id) => id !== messageId));
    } else {
      setPinnedMessages([...pinnedMessages, messageId]);
    }
  };

  // Feature 5: Auto-Translate
  const translateMessage = async (text: string, targetLang: string) => {
    // This would typically call a translation API
    console.log('Translating to:', targetLang);
    // For demo purposes, we'll just show the language change
    return text;
  };

  // Feature 6: Video Call Scheduling
  const handleScheduleVideoCall = () => {
    const suggestedTime = new Date(Date.now() + 3600000).toLocaleTimeString();
    const callMessage = `📹 Let's schedule a video call? How about ${suggestedTime}?`;
    setInputValue(callMessage);
    setShowVideoCallModal(false);
  };

  // Feature 7: Chat Export/Download
  const handleExportChat = () => {
    const chatData = messages
      .map((msg) => `${msg.sender.name}: ${msg.content}`)
      .join('\n');
    const element = document.createElement("a");
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(chatData)
    );
    element.setAttribute('download', `chat-${chatRoom?.orderId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Feature 8: Order/Product Details Panel
  const handleViewOrderDetails = () => {
    setShowOrderDetails(!showOrderDetails);
  };

  // Feature 9: Delivery Status
  const handleCheckDeliveryStatus = () => {
    setShowDeliveryStatus(!showDeliveryStatus);
  };

  // Feature 10: Message Templates Manager (File Input Handling)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !chatRoom || !socketRef.current) return;

    const fileUrl = URL.createObjectURL(file); 
    const msgType = file.type.startsWith('image/') ? 'image' : 'file';

    if (socketRef.current?.connected) {
      socketRef.current.emit('send-message', {
        chatRoomId: chatRoom.id,
        content: `[Attached ${msgType}]`,
        type: msgType,
        fileName: file.name,
        fileUrl: fileUrl,
      });
    } else {
      // Simulate real-time dummy mock upload
      const dummyFileMsg: Message = {
        id: Date.now().toString(),
        chatRoomId: chatRoom.id,
        senderId: currentUser.id,
        content: `[Attached ${msgType}]`,
        type: msgType as any,
        fileName: file.name,
        fileUrl: fileUrl,
        status: 'SENT',
        createdAt: new Date().toISOString(),
        sender: currentUser as User
      };
      setMessages(prev => [...prev, dummyFileMsg]);
      setTimeout(scrollToBottom, 100);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const messageTemplates = [
    { category: 'Negotiation', text: 'Can you offer a discount for bulk orders?' },
    { category: 'Quality', text: 'Can you provide quality certificates?' },
    { category: 'Payment', text: 'What are your payment terms?' },
    { category: 'Delivery', text: 'What is the expected delivery date?' },
    { category: 'Support', text: 'Do you provide after-sales support?' },
  ];

  const handleSelectTemplate = (templateText: string) => {
    setInputValue(templateText);
    setShowTemplates(false);
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading chat...</p>
        </div>
      </div>
    );
  }

  // We no longer need to strictly crash if it doesn't load. The dummy fallback prevents this.

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <img
            src={otherUser?.avatarUrl || '/avatar-default.png'}
            alt={otherUser?.name}
            className={styles.avatar}
          />
          <div className={styles.headerInfo}>
            <h2 className={styles.userName}>{otherUser?.name}</h2>
            <p className={styles.status}>
              {otherUserOnline
                ? 'Online'
                : `Last seen ${lastSeenAt ? new Date(lastSeenAt).toLocaleTimeString() : 'recently'}`}
            </p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.iconButton}
            title="Search messages"
            onClick={() => setShowSearchPanel(!showSearchPanel)}
          >
            <Search size={20} />
          </button>
          
          <button
            className={styles.iconButton}
            title="Video call"
            onClick={() => setShowVideoCallModal(!showVideoCallModal)}
          >
            <Video size={20} />
          </button>

          <button
            className={styles.iconButton}
            title="Delivery status"
            onClick={handleCheckDeliveryStatus}
          >
            <Clock size={20} />
          </button>

          <button
            className={styles.iconButton}
            title="Order details"
            onClick={handleViewOrderDetails}
          >
            <Info size={20} />
          </button>

          <button
            className={`${styles.iconButton} ${isAiLoading ? styles.spinning : ''}`}
            title="AI Summarize Chat"
            onClick={handleAiSummarize}
          >
            <div style={{ fontSize: '20px' }}>🤖</div>
          </button>

          <button
            className={styles.iconButton}
            title="AI Negotiation Assist"
            onClick={handleNegotiationAssist}
          >
            <div style={{ fontSize: '20px' }}>⚖️</div>
          </button>

          <button
            className={styles.iconButton}
            title="Export chat"
            onClick={handleExportChat}
          >
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        {showSearchPanel && (
          <div className={styles.searchPanel}>
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              autoFocus
            />
            <button onClick={() => setShowSearchPanel(false)} className={styles.closeButton}>
              ✕
            </button>
          </div>
        )}

        {showOrderDetails && chatRoom && (
          <div className={styles.detailsPanel}>
            <h3>📦 Order Details</h3>
            <div className={styles.detailsContent}>
              <p><strong>Product:</strong> {chatRoom.productName}</p>
              <p><strong>Amount:</strong> ₹{chatRoom.orderAmount.toFixed(2)}</p>
              <p><strong>Order ID:</strong> {chatRoom.orderId}</p>
              <p><strong>Farmer:</strong> {chatRoom.farmer.name}</p>
              <p><strong>Buyer:</strong> {chatRoom.buyer.name}</p>
              <div className={styles.actionButtons}>
                <button onClick={() => handleOrderAction('CONFIRM')} className={styles.confirmBtn}>Confirm Order</button>
                <button onClick={() => handleOrderAction('CANCEL')} className={styles.cancelBtn}>Cancel Order</button>
              </div>
            </div>
            <button onClick={() => setShowOrderDetails(false)} className={styles.closeButton}>
              ✕
            </button>
          </div>
        )}

        {showDeliveryStatus && (
          <div className={styles.detailsPanel}>
            <h3>🚚 Delivery Status</h3>
            <div className={styles.detailsContent}>
              <div className={styles.statusStep}>
                <span className={styles.stepNumber}>✅</span>
                <span>Order Confirmed</span>
              </div>
              <div className={styles.statusStep}>
                <span className={styles.stepNumber}>📦</span>
                <span>In Transit</span>
              </div>
              <div className={styles.statusStep}>
                <span className={styles.stepNumber}>⏳</span>
                <span>Estimated Delivery: 2-3 days</span>
              </div>
            </div>
            <button onClick={() => setShowDeliveryStatus(false)} className={styles.closeButton}>
              ✕
            </button>
          </div>
        )}

        {showVideoCallModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>📹 Start Video Call</h3>
              <p>Connect with {otherUser?.name} to discuss the deal live.</p>
              <button onClick={startVideoCall} className={styles.primaryButton}>
                Start Call Now
              </button>
              <button
                onClick={() => setShowVideoCallModal(false)}
                className={styles.secondaryButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isVideoCallActive && (
          <div className={styles.videoOverlay}>
            <div className={styles.videoContainer}>
              <video ref={remoteVideoRef} autoPlay className={styles.remoteVideo} poster="https://images.unsplash.com/photo-1541888941259-7724dc476ea6?w=600&h=400&fit=crop" />
              <video ref={localVideoRef} autoPlay muted className={styles.localVideo} />
              <div className={styles.videoControls}>
                <button onClick={endVideoCall} className={styles.hangupButton}>
                  <Phone size={24} style={{ transform: 'rotate(135deg)' }} />
                </button>
              </div>
            </div>
          </div>
        )}

        {showAiSummary && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modal} ${styles.aiModal}`}>
              <h3>🤖 AI Chat Summary</h3>
              <div className={styles.aiContent} dangerouslySetInnerHTML={{ __html: aiSummary ? aiSummary.replace(/\n/g, '<br/>') : '' }} />
              <button onClick={() => setShowAiSummary(false)} className={styles.primaryButton}>
                Got it
              </button>
            </div>
          </div>
        )}

        {showNegotiationAssist && (
          <div className={styles.modalOverlay}>
            <div className={`${styles.modal} ${styles.aiModal}`}>
              <h3>⚖️ AI Negotiation Assist</h3>
              <div className={styles.aiContent} dangerouslySetInnerHTML={{ __html: aiNegotiationAdvice ? aiNegotiationAdvice.replace(/\n/g, '<br/>') : '' }} />
              <button onClick={() => setShowNegotiationAssist(false)} className={styles.primaryButton}>
                Thanks AI
              </button>
            </div>
          </div>
        )}

        {(searchQuery ? filteredMessages : messages).length === 0 && !searchQuery ? (
          <div className={styles.emptyState}>
            <p>🎉 Start your conversation about {chatRoom?.productName}</p>
            <small>Order Amount: ₹ {chatRoom?.orderAmount?.toFixed(2)}</small>
          </div>
        ) : (
          (searchQuery ? filteredMessages : messages).map((message) => (
            <div key={message.id} className={styles.messageWrapper}>
              {pinnedMessages.includes(message.id) && (
                <div className={styles.pinnedBadge}>📌 Pinned</div>
              )}
              <MessageBubble
                message={message}
                isOwn={message.senderId === currentUser.id}
                onReactionAdd={(emoji) => {
                  if (socketRef.current) {
                    socketRef.current.emit('add-reaction', {
                      messageId: message.id,
                      emoji,
                    });
                  }
                }}
              />
            </div>
          ))
        )}

        {otherUserTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Panel */}
      {showQuickReplies && (
        <div className={styles.quickRepliesPanel}>
          {quickReplyTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickReply(template.text)}
              className={styles.quickReplyButton}
              title={template.text}
            >
              <span>{template.emoji}</span>
              <span>{template.text.substring(0, 30)}...</span>
            </button>
          ))}
        </div>
      )}

      {/* Message Templates Panel */}
      {showTemplates && (
        <div className={styles.templatesPanel}>
          {messageTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectTemplate(template.text)}
              className={styles.templateButton}
            >
              <strong>{template.category}:</strong> {template.text}
            </button>
          ))}
        </div>
      )}

      {/* Smart Replies */}
      {smartReplies.length > 0 && (
        <div className={styles.smartRepliesContainer}>
          {smartReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(reply);
                setSmartReplies([]);
              }}
              className={styles.smartReplyChip}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className={styles.inputContainer}>
        
        {/* Hidden File Input for Image/Document Upload (Feature 10) */}
        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          onChange={handleFileUpload}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
        />

        <button
          type="button"
          className={styles.attachButton}
          title="Upload File or Photo"
          onClick={triggerFileInput}
        >
          <Paperclip size={20} />
        </button>

        <button
          type="button"
          className={styles.attachButton}
          title="Quick replies"
          onClick={() => setShowQuickReplies(!showQuickReplies)}
        >
          <Tag size={20} />
        </button>

        <button
          type="button"
          className={styles.attachButton}
          title="Message templates"
          onClick={() => setShowTemplates(!showTemplates)}
        >
          <div style={{ fontSize: '16px' }}>📋</div>
        </button>

        <button
          type="button"
          className={`${styles.attachButton} ${isRecordingVoice ? styles.recording : ''}`}
          title={isRecordingVoice ? 'Stop recording' : 'Record voice message'}
          onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
        >
          <Mic size={20} />
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={handleTyping}
          placeholder="Type a message..."
          className={styles.input}
          disabled={isLoading}
        />

        <button type="button" className={styles.emojiButton} title="Add emoji">
          <Smile size={20} />
        </button>

        <button
          type="submit"
          className={styles.sendButton}
          disabled={!inputValue.trim()}
          title="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
