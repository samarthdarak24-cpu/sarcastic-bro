'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage, QuickAction } from '@/types/chat';
import { chatWidgetService } from '@/services/chatWidgetService';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useChatWidgetStore } from '@/store/chatWidgetStore';
import { useProactiveNotifications } from '@/hooks/useProactiveNotifications';
import FloatingButton from './FloatingButton';
import ChatPanel from './ChatPanel';
import ProactiveNotification from './ProactiveNotification';

interface ChatWidgetProps {
  initialExpanded?: boolean;
  enableProactiveNotifications?: boolean;
  position?: 'bottom-right' | 'bottom-left';
  zIndex?: number;
}

export default function ChatWidget({
  initialExpanded = false,
  enableProactiveNotifications = true,
  position = 'bottom-right',
}: ChatWidgetProps) {
  const router = useRouter();
  // Zustand store
  const {
    isExpanded: storeExpanded,
    messages: storeMessages,
    unreadCount,
    preferences,
    setExpanded,
    addMessage,
    clearHistory,
    setPreferences,
  } = useChatWidgetStore();

  const [isLoading, setIsLoading] = useState(false);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [showSlowConnectionWarning, setShowSlowConnectionWarning] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorState, setErrorState] = useState<{type: string; message: string} | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>(preferences.preferredLanguage);
  const [voiceEnabled, setVoiceEnabled] = useState(preferences.soundEnabled);
  
  const slowConnectionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Proactive notifications
  const { notification, dismissNotification } = useProactiveNotifications({
    enabled: enableProactiveNotifications,
  });
  
  // Text-to-Speech hook
  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech({
    language,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  });

  // Sync language preference
  useEffect(() => {
    if (language !== preferences.preferredLanguage) {
      setPreferences({ preferredLanguage: language });
    }
  }, [language, preferences.preferredLanguage, setPreferences]);

  // Sync voice preference
  useEffect(() => {
    if (voiceEnabled !== preferences.soundEnabled) {
      setPreferences({ soundEnabled: voiceEnabled });
    }
  }, [voiceEnabled, preferences.soundEnabled, setPreferences]);

  useEffect(() => {
    const checkAuth = (): void => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const toggleExpanded = (): void => {
    setExpanded(!storeExpanded);
    // Stop speaking when closing chat
    if (storeExpanded && isSpeaking) {
      stop();
    }
  };
  
  const toggleVoice = (): void => {
    setVoiceEnabled(!voiceEnabled);
    // Stop speaking if disabling voice
    if (voiceEnabled && isSpeaking) {
      stop();
    }
  };

  const handleClearHistory = (): void => {
    clearHistory();
    if (isSpeaking) {
      stop();
    }
  };

  const handleAcceptNotification = (): void => {
    setExpanded(true);
    if (notification?.context) {
      handleSendMessage(notification.context);
    }
  };

  const handleActionClick = (action: QuickAction): void => {
    if (action.action === 'navigate' && action.payload) {
      router.push(action.payload);
      return;
    }
    
    // Default: send the query as a message
    handleSendMessage(action.query);
  };

  const handleSendMessage = async (text: string): Promise<void> => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsLoading(true);
    setShowSlowConnectionWarning(false);
    setStreamingMessage('');
    setErrorState(null);

    slowConnectionTimerRef.current = setTimeout(() => {
      setShowSlowConnectionWarning(true);
    }, 5000);

    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) as Record<string, unknown> : null;

      const userContext = {
        userId: user?.id as string | undefined,
        name: user?.name as string | undefined,
        userType: user?.role as 'FARMER' | 'BUYER' | undefined,
        location: (user?.district || user?.state) as string | undefined,
        currentPage: typeof window !== 'undefined' ? window.location.pathname : undefined,
        language,
      };

      let fullResponse = '';
      let metadata: { intent?: string; confidence?: number; suggestions?: string[] } = {};
      let hasError = false;

      try {
        for await (const chunk of chatWidgetService.sendMessageStream({
          message: text,
          conversationHistory: storeMessages,
          userContext,
        })) {
          if (chunk.type === 'metadata') {
            metadata = {
              intent: chunk.intent,
              confidence: chunk.confidence,
              suggestions: chunk.suggestions,
            };
          } else if (chunk.type === 'content') {
            fullResponse += chunk.content;
            setStreamingMessage(fullResponse);
          } else if (chunk.type === 'error') {
            hasError = true;
            console.warn('Stream error:', chunk.error, chunk.message);
            break;
          } else if (chunk.type === 'done') {
            break;
          }
        }
      } catch (streamError) {
        console.error('Stream exception:', streamError);
        hasError = true;
      }

      // Use fallback if no response or error occurred
      if (!fullResponse || hasError) {
        const fallback = await chatWidgetService.getIntelligentFallback(text, userContext);
        fullResponse = fallback.response;
        metadata = {
          intent: fallback.intent,
          confidence: fallback.confidence,
          suggestions: fallback.suggestions,
          actions: fallback.actions,
        } as any;
        setErrorState(null); // Clear error since fallback works
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
        metadata: {
          intent: metadata.intent,
          confidence: metadata.confidence,
          suggestions: metadata.suggestions,
        },
      };

      addMessage(assistantMessage);
      
      // Speak the response if voice is enabled
      if (voiceEnabled && ttsSupported && fullResponse) {
        speak(fullResponse);
      }
      
      if (metadata.actions && metadata.actions.length > 0) {
        setQuickActions(metadata.actions);
      } else if (metadata.suggestions && metadata.suggestions.length > 0) {
        setQuickActions(metadata.suggestions.map((s: string, i: number) => ({
          id: `action-${i}`,
          label: s,
          query: s,
        })));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Always use fallback on error
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) as Record<string, unknown> : null;
      const userContext = {
        userId: user?.id as string | undefined,
        name: user?.name as string | undefined,
        userType: user?.role as 'FARMER' | 'BUYER' | undefined,
        location: (user?.district || user?.state) as string | undefined,
        language,
      };
      
      const fallback = await chatWidgetService.getIntelligentFallback(text, userContext);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallback.response,
        timestamp: new Date(),
        metadata: {
          intent: fallback.intent,
          confidence: fallback.confidence,
          suggestions: fallback.suggestions,
        },
      };
      
      addMessage(errorMessage);
      
      // Speak the fallback response if voice is enabled
      if (voiceEnabled && ttsSupported && fallback.response) {
        speak(fallback.response);
      }
      
      if (fallback.actions && fallback.actions.length > 0) {
        setQuickActions(fallback.actions);
      } else if (fallback.suggestions && fallback.suggestions.length > 0) {
        setQuickActions(fallback.suggestions.map((s: string, i: number) => ({
          id: `action-${i}`,
          label: s,
          query: s,
        })));
      }
    } finally {
      if (slowConnectionTimerRef.current) {
        clearTimeout(slowConnectionTimerRef.current);
      }
      setIsLoading(false);
      setShowSlowConnectionWarning(false);
      setStreamingMessage('');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {notification && (
        <ProactiveNotification
          message={notification.message}
          onDismiss={dismissNotification}
          onAccept={handleAcceptNotification}
        />
      )}
      
      <FloatingButton
        onClick={toggleExpanded}
        unreadCount={unreadCount}
        isExpanded={storeExpanded}
        position={position}
      />
      
      {storeExpanded && (
        <ChatPanel
          messages={storeMessages}
          isLoading={isLoading}
          quickActions={quickActions}
          onSendMessage={handleSendMessage}
          onActionClick={handleActionClick}
          onClose={toggleExpanded}
          userRole="FARMER"
          showSlowConnectionWarning={showSlowConnectionWarning}
          streamingMessage={streamingMessage}
          errorState={errorState}
          language={language}
          onLanguageChange={setLanguage}
          voiceEnabled={voiceEnabled}
          onToggleVoice={toggleVoice}
          isSpeaking={isSpeaking}
          ttsSupported={ttsSupported}
          onClearHistory={handleClearHistory}
        />
      )}
    </>
  );
}
