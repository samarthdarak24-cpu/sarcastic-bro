'use client';

import React, { useEffect, useState } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatRoom } from '@/components/chat/ChatRoom';
import { authService } from '@/services/auth';
import { MessageCircle, Loader2 } from 'lucide-react';

export default function FarmerAgroChatPage() {
  const [user, setUser] = useState<any>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const currentUser = authService.getUser();
      if (!currentUser) {
        setError('Please log in to access messages');
        setIsLoading(false);
        return;
      }
      setUser(currentUser);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Failed to load user information');
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
          <div className="text-center">
            <p className="text-slate-900 font-semibold text-lg">Loading AgriChat</p>
            <p className="text-slate-500 text-sm mt-1">Connecting to chat server...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">AgriChat</h1>
          <p className="text-slate-600 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Split view: ChatList on left, ChatRoom on right
  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-120px)]">
          {/* Chat List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-slate-200">
            <ChatList 
              currentUserId={user.id} 
              onSelectChat={(chat) => {
                setSelectedChatId(chat.id);
                setSelectedOrderId(chat.orderId);
              }}
              selectedChatId={selectedChatId || undefined}
            />
          </div>

          {/* Chat Room */}
          <div className="lg:col-span-2">
            {selectedOrderId ? (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-full">
                <ChatRoom
                  orderId={selectedOrderId}
                  currentUser={{
                    id: user.id,
                    name: user.name || user.email,
                    role: user.role || 'FARMER',
                  }}
                  onClose={() => {
                    setSelectedChatId(null);
                    setSelectedOrderId(null);
                  }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">No conversation selected</h2>
                  <p className="text-slate-600">Select a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
