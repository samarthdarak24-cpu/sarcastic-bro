'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AdvancedChatInput } from './AdvancedChatInput';
import { AdvancedChatMessage } from './AdvancedChatMessage';
import styles from './AdvancedChatWindow.module.css';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
}

interface AdvancedChatWindowProps {
  userRole?: 'farmer' | 'buyer' | 'general';
  onClose?: () => void;
  voiceOutputEnabled?: boolean;
}

export const AdvancedChatWindow: React.FC<AdvancedChatWindowProps> = ({
  userRole = 'general',
  onClose,
  voiceOutputEnabled = true,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm AgriVoice, your smart farming assistant. You can now speak to me, send images, and I'll speak back! How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`session-${Date.now()}`);
  const [language, setLanguage] = useState('en-IN');
  const [voiceEnabled, setVoiceEnabled] = useState(voiceOutputEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('message', message);
      formData.append('userRole', userRole);
      formData.append('sessionId', sessionId);

      if (attachments && attachments.length > 0) {
        attachments.forEach((file, index) => {
          formData.append(`file_${index}`, file);
        });
      }

      // Send to backend
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        body: formData,
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

  return (
    <div className={styles.chatWindow}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.avatar}>🌾</div>
          <div className={styles.headerInfo}>
            <h2>AgriVoice AI</h2>
            <p>Smart farming assistant with voice</p>
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
          <AdvancedChatMessage
            key={msg.id}
            id={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            attachments={msg.attachments}
            voiceEnabled={voiceEnabled && msg.role === 'assistant'}
            language={language}
            onSpeakStart={() => setIsSpeaking(true)}
            onSpeakEnd={() => setIsSpeaking(false)}
          />
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
      <AdvancedChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        isLoading={isLoading}
      />
    </div>
  );
};
