'use client';

import io, { Socket } from 'socket.io-client';

export interface ChatMessage {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'seen';
  createdAt: Date;
  fileUrl?: string;
  fileName?: string;
}

export interface ChatRoom {
  id: string;
  orderId: string;
  farmerId: string;
  farmerName: string;
  buyerId: string;
  buyerName: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface TypingStatus {
  userId: string;
  isTyping: boolean;
}

class AgriChatService {
  private socket: Socket | null = null;
  private userId: string = '';
  private listeners: Map<string, Function[]> = new Map();

  connect(userId: string, token: string) {
    this.userId = userId;
    
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    this.socket = io(socketUrl, {
      auth: {
        token,
        userId,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    this.setupListeners();
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Chat connected');
      this.emit('connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Chat disconnected');
      this.emit('disconnected');
    });

    this.socket.on('message_received', (message: ChatMessage) => {
      this.emit('message_received', message);
    });

    this.socket.on('typing', (data: TypingStatus) => {
      this.emit('typing', data);
    });

    this.socket.on('user_online', (userId: string) => {
      this.emit('user_online', userId);
    });

    this.socket.on('user_offline', (userId: string) => {
      this.emit('user_offline', userId);
    });

    this.socket.on('message_seen', (messageId: string) => {
      this.emit('message_seen', messageId);
    });
  }

  joinRoom(chatRoomId: string) {
    if (!this.socket) return;
    this.socket.emit('join_room', { chatRoomId, userId: this.userId });
  }

  leaveRoom(chatRoomId: string) {
    if (!this.socket) return;
    this.socket.emit('leave_room', { chatRoomId });
  }

  sendMessage(chatRoomId: string, content: string, type: 'text' | 'image' | 'file' = 'text', fileUrl?: string, fileName?: string) {
    if (!this.socket) return;
    
    this.socket.emit('send_message', {
      chatRoomId,
      senderId: this.userId,
      content,
      type,
      fileUrl,
      fileName,
    });
  }

  setTyping(chatRoomId: string, isTyping: boolean) {
    if (!this.socket) return;
    this.socket.emit('typing', {
      chatRoomId,
      userId: this.userId,
      isTyping,
    });
  }

  markMessageAsSeen(messageId: string, chatRoomId: string) {
    if (!this.socket) return;
    this.socket.emit('message_seen', {
      messageId,
      chatRoomId,
      userId: this.userId,
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const agriChatService = new AgriChatService();
