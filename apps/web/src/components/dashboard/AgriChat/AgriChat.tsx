'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Paperclip, Phone, MoreVertical, Search, Plus } from 'lucide-react';
import { agriChatService, ChatRoom, ChatMessage } from '@/services/agriChatService';
import { authService } from '@/services/auth';
import { ChatList } from './ChatList';
import { ChatWindow } from './ChatWindow';
import '@/styles/agri-chat.css';

export function AgriChat() {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const user = authService.getUser();

  useEffect(() => {
    // Initialize chat service
    if (user?.id && user?.token) {
      agriChatService.connect(user.id, user.token);
      loadChatRooms();
    }

    return () => {
      agriChatService.disconnect();
    };
  }, [user]);

  useEffect(() => {
    // Listen for new messages
    agriChatService.on('message_received', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
      
      // Update chat room last message
      setChatRooms(prev => prev.map(room => 
        room.id === message.chatRoomId 
          ? { ...room, lastMessage: message.content, lastMessageTime: message.createdAt }
          : room
      ));
    });

    return () => {
      agriChatService.off('message_received', () => {});
    };
  }, []);

  const loadChatRooms = async () => {
    try {
      setIsLoading(true);
      // Fetch chat rooms from API
      const response = await fetch('/api/chat/rooms', {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatRooms(data);
        
        // Auto-select first chat
        if (data.length > 0) {
          selectChat(data[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectChat = async (chatRoomId: string) => {
    setSelectedChatId(chatRoomId);
    agriChatService.joinRoom(chatRoomId);
    
    try {
      // Load chat history
      const response = await fetch(`/api/chat/rooms/${chatRoomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${user?.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChatId || !content.trim()) return;
    
    agriChatService.sendMessage(selectedChatId, content, 'text');
  };

  const filteredRooms = chatRooms.filter(room => {
    const otherUserName = user?.role === 'FARMER' ? room.buyerName : room.farmerName;
    return otherUserName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectedRoom = chatRooms.find(r => r.id === selectedChatId);

  return (
    <div className="agri-chat-container">
      {/* Chat List Sidebar */}
      <ChatList
        rooms={filteredRooms}
        selectedChatId={selectedChatId}
        onSelectChat={selectChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoading={isLoading}
      />

      {/* Chat Window */}
      {selectedRoom ? (
        <ChatWindow
          room={selectedRoom}
          messages={messages}
          onSendMessage={handleSendMessage}
          currentUserId={user?.id || ''}
        />
      ) : (
        <div className="chat-empty-state">
          <MessageCircle size={48} />
          <h3>No chat selected</h3>
          <p>Select a conversation to start messaging</p>
        </div>
      )}
    </div>
  );
}
