'use client';

/**
 * Example: How to use the Chat components
 * This file shows different ways to integrate the chat system
 */

import React, { useState } from 'react';
import { ChatWindow } from './ChatWindow';
import { ChatInput } from './ChatInput';
import { useChat } from '@/hooks/useChat';

/**
 * Example 1: Simple Chat Window
 * Just drop it in and it works!
 */
export const SimpleChatExample = () => {
  return (
    <div style={{ width: '400px', height: '600px' }}>
      <ChatWindow userRole="farmer" />
    </div>
  );
};

/**
 * Example 2: Custom Chat with Hook
 * More control over the chat behavior
 */
export const CustomChatExample = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useChat({
    userRole: 'buyer',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              marginBottom: '12px',
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: '8px',
                background: msg.role === 'user' ? '#4caf50' : '#333',
                color: '#fff',
                maxWidth: '80%',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />

      <button
        onClick={clearMessages}
        style={{
          padding: '8px 16px',
          margin: '8px',
          background: '#f44336',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Clear Chat
      </button>
    </div>
  );
};

/**
 * Example 3: Chat with Modal
 * Show/hide chat in a modal
 */
export const ModalChatExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          padding: '12px 24px',
          background: '#4caf50',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        💬 Open Chat
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '400px',
            height: '600px',
            zIndex: 1000,
          }}
        >
          <ChatWindow
            userRole="general"
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Example 4: Multi-role Chat
 * Switch between farmer and buyer roles
 */
export const MultiRoleChatExample = () => {
  const [role, setRole] = useState<'farmer' | 'buyer' | 'general'>('farmer');

  return (
    <div>
      <div style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {(['farmer', 'buyer', 'general'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            style={{
              padding: '8px 16px',
              background: role === r ? '#4caf50' : '#ddd',
              color: role === r ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {r}
          </button>
        ))}
      </div>

      <div style={{ width: '400px', height: '600px' }}>
        <ChatWindow key={role} userRole={role} />
      </div>
    </div>
  );
};

/**
 * Example 5: Embedded Chat
 * Chat embedded in a page
 */
export const EmbeddedChatExample = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
      <div>
        <h2>Your Content Here</h2>
        <p>This is your main page content...</p>
      </div>

      <div style={{ height: '600px' }}>
        <ChatWindow userRole="farmer" />
      </div>
    </div>
  );
};

/**
 * Example 6: Chat with Custom Styling
 * Customize the chat appearance
 */
export const StyledChatExample = () => {
  return (
    <div
      style={{
        width: '400px',
        height: '600px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '2px solid #4caf50',
      }}
    >
      <ChatWindow userRole="buyer" />
    </div>
  );
};

/**
 * Example 7: Full Page Chat
 * Chat takes up entire page
 */
export const FullPageChatExample = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ChatWindow userRole="general" />
    </div>
  );
};

/**
 * Example 8: Chat with Sidebar
 * Chat with additional controls
 */
export const ChatWithSidebarExample = () => {
  const [userRole, setUserRole] = useState<'farmer' | 'buyer' | 'general'>('farmer');
  const [language, setLanguage] = useState('en-US');

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '200px',
          background: '#f5f5f5',
          padding: '20px',
          borderRight: '1px solid #ddd',
        }}
      >
        <h3>Settings</h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <strong>Role:</strong>
          </label>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as any)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
            <option value="general">General</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            <strong>Language:</strong>
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="mr-IN">Marathi</option>
            <option value="ta-IN">Tamil</option>
          </select>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1 }}>
        <ChatWindow key={`${userRole}-${language}`} userRole={userRole} />
      </div>
    </div>
  );
};

/**
 * Example 9: Chat with Analytics
 * Track chat interactions
 */
export const ChatWithAnalyticsExample = () => {
  const [stats, setStats] = useState({
    messageCount: 0,
    attachmentCount: 0,
  });

  const handleSendMessage = (message: string, attachments?: File[]) => {
    setStats((prev) => ({
      messageCount: prev.messageCount + 1,
      attachmentCount: prev.attachmentCount + (attachments?.length || 0),
    }));
  };

  return (
    <div>
      <div
        style={{
          padding: '16px',
          background: '#f5f5f5',
          marginBottom: '16px',
          borderRadius: '8px',
        }}
      >
        <h3>Chat Analytics</h3>
        <p>Messages sent: {stats.messageCount}</p>
        <p>Files attached: {stats.attachmentCount}</p>
      </div>

      <div style={{ width: '400px', height: '600px' }}>
        <ChatWindow userRole="farmer" />
      </div>
    </div>
  );
};

/**
 * Example 10: Chat Launcher Button
 * Floating chat button
 */
export const ChatLauncherExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#4caf50',
          color: '#fff',
          border: 'none',
          fontSize: '28px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
          zIndex: 999,
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(1.1)' : 'scale(1)',
        }}
        title="Open Chat"
      >
        💬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '20px',
            width: '400px',
            height: '600px',
            zIndex: 1000,
            animation: 'slideUp 0.3s ease',
          }}
        >
          <ChatWindow
            userRole="general"
            onClose={() => setIsOpen(false)}
          />
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
