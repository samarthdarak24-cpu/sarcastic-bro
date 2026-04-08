import { useState, useCallback, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
}

interface UseChatOptions {
  userRole?: 'farmer' | 'buyer' | 'general';
  apiUrl?: string;
}

export const useChat = (options: UseChatOptions = {}) => {
  const {
    userRole = 'general',
    apiUrl = 'http://localhost:3001/api/chat',
  } = options;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm AgriVoice, your smart farming assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef(`session-${Date.now()}`);

  const sendMessage = useCallback(
    async (message: string, attachments?: File[]) => {
      if (!message.trim() && !attachments?.length) return;

      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
        attachments,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            userRole: userRole,
            sessionId: sessionIdRef.current,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Add assistant response
        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);

        // Add error message
        const errorMsg: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [apiUrl, userRole]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hello! I'm AgriVoice, your smart farming assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setError(null);
  }, []);

  const deleteMessage = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  const updateMessage = useCallback((messageId: string, content: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content } : msg
      )
    );
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    deleteMessage,
    updateMessage,
    sessionId: sessionIdRef.current,
  };
};
