'use client';

import React from 'react';
import { Search, Plus } from 'lucide-react';
import { ChatRoom } from '@/services/agriChatService';
import { formatDistanceToNow } from 'date-fns';

interface ChatListProps {
  rooms: ChatRoom[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading: boolean;
}

export function ChatList({
  rooms,
  selectedChatId,
  onSelectChat,
  searchQuery,
  onSearchChange,
  isLoading,
}: ChatListProps) {
  return (
    <div className="chat-list-sidebar">
      {/* Header */}
      <div className="chat-list-header">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">AgriChat</h2>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Plus size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="chat-list-search">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Chat Rooms */}
      <div className="chat-list-items">
        {isLoading ? (
          <div className="p-4 text-center text-slate-500">Loading chats...</div>
        ) : rooms.length === 0 ? (
          <div className="p-4 text-center text-slate-500">No conversations yet</div>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              onClick={() => onSelectChat(room.id)}
              className={`chat-list-item ${selectedChatId === room.id ? 'active' : ''}`}
            >
              {/* Avatar */}
              <div className="chat-list-avatar">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold">
                  {room.farmerName.charAt(0)}
                </div>
                {room.isOnline && <div className="online-indicator" />}
              </div>

              {/* Content */}
              <div className="chat-list-content">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">
                    {room.farmerName}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {room.lastMessageTime && formatDistanceToNow(new Date(room.lastMessageTime), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-slate-600 truncate">
                  {room.lastMessage || 'No messages yet'}
                </p>
              </div>

              {/* Unread Badge */}
              {room.unreadCount > 0 && (
                <div className="unread-badge">
                  {room.unreadCount}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
