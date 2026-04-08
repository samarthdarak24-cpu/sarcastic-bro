import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/types/chat';

export interface UserChatPreferences {
  proactiveNotificationsEnabled: boolean;
  preferredLanguage: 'en' | 'hi' | 'mr';
  soundEnabled: boolean;
  historyRetentionDays: number;
}

interface ChatWidgetStore {
  isExpanded: boolean;
  messages: ChatMessage[];
  unreadCount: number;
  preferences: UserChatPreferences;
  setExpanded: (expanded: boolean) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
  clearHistory: () => void;
  setPreferences: (preferences: Partial<UserChatPreferences>) => void;
  incrementUnread: () => void;
  resetUnread: () => void;
  cleanOldMessages: () => void;
}

export const useChatWidgetStore = create<ChatWidgetStore>()(
  persist(
    (set, get) => ({
      isExpanded: false,
      messages: [],
      unreadCount: 0,
      preferences: {
        proactiveNotificationsEnabled: true,
        preferredLanguage: 'en',
        soundEnabled: false,
        historyRetentionDays: 90,
      },
      
      setExpanded: (expanded) => {
        set({ isExpanded: expanded });
        if (expanded) {
          set({ unreadCount: 0 });
        }
      },
      
      addMessage: (message) => {
        set((state) => ({
          messages: [...state.messages, message],
        }));
        
        // Increment unread count if message is from assistant and widget is not expanded
        if (message.role === 'assistant' && !get().isExpanded) {
          get().incrementUnread();
        }
        
        // Clean old messages after adding new one
        get().cleanOldMessages();
      },
      
      setMessages: (messages) => set({ messages }),
      
      clearHistory: () => set({ messages: [], unreadCount: 0 }),
      
      setPreferences: (preferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...preferences },
        })),
      
      incrementUnread: () =>
        set((state) => ({ unreadCount: state.unreadCount + 1 })),
      
      resetUnread: () => set({ unreadCount: 0 }),
      
      cleanOldMessages: () => {
        const state = get();
        const retentionMs = state.preferences.historyRetentionDays * 24 * 60 * 60 * 1000;
        const cutoffDate = new Date(Date.now() - retentionMs);
        
        const filteredMessages = state.messages.filter(
          (msg) => new Date(msg.timestamp) > cutoffDate
        );
        
        if (filteredMessages.length !== state.messages.length) {
          set({ messages: filteredMessages });
        }
      },
    }),
    {
      name: 'chat-widget-storage',
      partialize: (state) => ({
        messages: state.messages,
        preferences: state.preferences,
      }),
    }
  )
);
