// ========================================================================
// Chat Store - Zustand State Management
// ========================================================================

import { create } from 'zustand';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  orderId?: string;
  createdAt: Date;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  unreadCount: number;
}

interface ChatState {
  messages: Message[];
  contacts: Contact[];
  activeContact: Contact | null;
  loading: boolean;
  
  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setContacts: (contacts: Contact[]) => void;
  setActiveContact: (contact: Contact | null) => void;
  setLoading: (loading: boolean) => void;
  markMessagesAsRead: (contactId: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  contacts: [],
  activeContact: null,
  loading: false,

  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setContacts: (contacts) => set({ contacts }),
  
  setActiveContact: (contact) => set({ activeContact: contact }),
  
  setLoading: (loading) => set({ loading }),
  
  markMessagesAsRead: (contactId) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.senderId === contactId ? { ...m, read: true } : m
      ),
      contacts: state.contacts.map((c) =>
        c.id === contactId ? { ...c, unreadCount: 0 } : c
      ),
    }));
  },
}));
