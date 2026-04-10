'use client';

import { useEffect, useState } from 'react';
import fpoService, { FPOChat } from '@/services/fpo';
import { MessageCircle, Send } from 'lucide-react';

export default function ChatPage() {
  const [chats, setChats] = useState<FPOChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
    }
  }, [selectedChat]);

  const loadChats = async () => {
    try {
      const data = await fpoService.getChats();
      setChats(data);
      if (data.length > 0 && !selectedChat) {
        setSelectedChat(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const data = await fpoService.getChatMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      setSending(true);
      await fpoService.sendMessage(selectedChat, newMessage);
      setNewMessage('');
      loadMessages(selectedChat);
      loadChats();
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Chats Yet</h3>
          <p className="text-gray-600">Buyers will initiate chats when interested in your listings.</p>
        </div>
      </div>
    );
  }

  const currentChat = chats.find(c => c.id === selectedChat);

  return (
    <div className="h-screen flex">
      {/* Chat List */}
      <div className="w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Buyer Chats</h2>
        </div>
        <div className="divide-y">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat === chat.id ? 'bg-green-50' : ''
              }`}
            >
              <div className="font-medium text-gray-900">{chat.buyer.name}</div>
              <div className="text-sm text-gray-600 truncate">{chat.lastMessage || 'No messages yet'}</div>
              {chat.lastMessageAt && (
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(chat.lastMessageAt).toLocaleString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {currentChat && (
          <>
            <div className="p-4 bg-white border-b">
              <h3 className="font-semibold text-lg">{currentChat.buyer.name}</h3>
              <p className="text-sm text-gray-600">{currentChat.buyer.email}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender.role === 'FPO' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-2 rounded-lg ${
                      msg.sender.role === 'FPO'
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{msg.sender.name}</p>
                    <p>{msg.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
