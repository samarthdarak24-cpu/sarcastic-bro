'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import VoiceService from '@/services/voiceService';
import styles from './ChatWindow.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
}

interface ChatWindowProps {
  userRole?: 'farmer' | 'buyer' | 'general';
  onClose?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  userRole = 'general',
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm AgriVoice, your smart farming assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceServiceRef = useRef<VoiceService | null>(null);

  // Initialize voice service
  useEffect(() => {
    if (VoiceService.isSupported()) {
      voiceServiceRef.current = new VoiceService({
        language: 'en-US',
        continuous: false,
        interimResults: true,
      });
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to backend
  const handleSendMessage = async (message: string, attachments?: File[]) => {
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

    try {
      // Send to backend
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          userRole: userRole,
          sessionId: sessionId,
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
    } catch (error) {
      console.error('Error sending message:', error);

      // Add error message
      const errorMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.avatar}>🌾</div>
          <div className={styles.headerInfo}>
            <h2>AgriVoice AI</h2>
            <p>Smart farming assistant</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div key={msg.id} className={`${styles.message} ${styles[msg.role]}`}>
            <div className={styles.messageContent}>
              <p>{msg.content}</p>
              {msg.attachments && msg.attachments.length > 0 && (
                <div className={styles.attachmentsList}>
                  {msg.attachments.map((file, idx) => (
                    <div key={idx} className={styles.attachmentBadge}>
                      📎 {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className={styles.timestamp}>{formatTime(msg.timestamp)}</span>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageContent}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        isLoading={isLoading}
      />
    </div>
  );
};
