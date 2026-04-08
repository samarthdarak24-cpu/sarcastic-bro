'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, Phone, MoreVertical, Volume2, Download, Trash2, Edit2, Reply, Smile, Loader } from 'lucide-react';
import { ChatRoom, ChatMessage } from '@/services/agriChatService';
import { agriChatService } from '@/services/agriChatService';
import { format } from 'date-fns';

interface ChatWindowProps {
  room: ChatRoom;
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  currentUserId: string;
}

export function ChatWindow({
  room,
  messages,
  onSendMessage,
  currentUserId,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    agriChatService.on('typing', (data) => {
      if (data.userId !== currentUserId) {
        setOtherUserTyping(data.isTyping);
      }
    });

    return () => {
      agriChatService.off('typing', () => {});
    };
  }, [currentUserId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
      agriChatService.setTyping(room.id, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      agriChatService.setTyping(room.id, false);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    onSendMessage(inputValue);
    setInputValue('');
    setReplyingTo(null);
    setIsTyping(false);
    agriChatService.setTyping(room.id, false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      const file = files[0];
      // TODO: Upload file and send as message
      console.log('File selected:', file.name);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    // TODO: Implement delete message
    console.log('Delete message:', messageId);
  };

  const handleEditMessage = (message: ChatMessage) => {
    setInputValue(message.content);
    setSelectedMessage(message.id);
    // TODO: Implement edit message
  };

  const handleReplyMessage = (message: ChatMessage) => {
    setReplyingTo(message);
    inputRef.current?.focus();
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    // TODO: Implement add reaction
    console.log('Add reaction:', messageId, emoji);
  };

  const loadMoreMessages = async () => {
    setIsLoadingMore(true);
    // TODO: Implement pagination
    setTimeout(() => setIsLoadingMore(false), 1000);
  };

  const otherUserName = room.farmerName;

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-window-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-bold">
            {otherUserName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{otherUserName}</h3>
            <p className="text-xs text-slate-500">
              {room.isOnline ? (
                <span className="text-emerald-600 font-medium">Online</span>
              ) : (
                <span>Last seen {room.lastSeen ? format(new Date(room.lastSeen), 'HH:mm') : 'recently'}</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Phone size={20} className="text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <MoreVertical size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages-container">
        {/* Load More Button */}
        {messages.length > 0 && (
          <button
            onClick={loadMoreMessages}
            disabled={isLoadingMore}
            className="load-more-btn"
          >
            {isLoadingMore ? <Loader size={16} className="animate-spin" /> : 'Load earlier messages'}
          </button>
        )}

        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-500">
            <div className="text-center">
              <p className="text-sm">No messages yet</p>
              <p className="text-xs">Start a conversation with {otherUserName}</p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message-group ${message.senderId === currentUserId ? 'sent' : 'received'}`}
              onMouseEnter={() => setSelectedMessage(message.id)}
              onMouseLeave={() => setSelectedMessage(null)}
            >
              {/* Reply Quote */}
              {message.metadata && (
                <div className="reply-quote">
                  <div className="reply-line"></div>
                  <div className="reply-content">
                    <p className="reply-user">Replying to message</p>
                    <p className="reply-text">Previous message</p>
                  </div>
                </div>
              )}

              <div className="message-bubble">
                {message.type === 'text' && (
                  <p className="message-text">{message.content}</p>
                )}
                {message.type === 'image' && (
                  <img src={message.fileUrl} alt="Shared image" className="message-image" />
                )}
                {message.type === 'file' && (
                  <a href={message.fileUrl} className="message-file">
                    📎 {message.fileName}
                  </a>
                )}

                {/* Message Footer */}
                <div className="message-footer">
                  <span className="message-time">
                    {format(new Date(message.createdAt), 'HH:mm')}
                  </span>
                  {message.senderId === currentUserId && (
                    <span className="message-status">
                      {message.status === 'seen' && '✔✔'}
                      {message.status === 'delivered' && '✔✔'}
                      {message.status === 'sent' && '✔'}
                    </span>
                  )}
                </div>

                {/* Message Reactions */}
                {message.metadata && (
                  <div className="message-reactions">
                    <button className="reaction-btn">❤️</button>
                    <button className="reaction-btn">😂</button>
                    <button className="reaction-btn">🔥</button>
                  </div>
                )}
              </div>

              {/* Message Actions (Show on hover) */}
              {selectedMessage === message.id && (
                <div className={`message-actions ${message.senderId === currentUserId ? 'sent' : 'received'}`}>
                  <button
                    onClick={() => handleReplyMessage(message)}
                    className="action-btn"
                    title="Reply"
                  >
                    <Reply size={16} />
                  </button>
                  {message.type === 'file' && (
                    <a href={message.fileUrl} download className="action-btn" title="Download">
                      <Download size={16} />
                    </a>
                  )}
                  {message.senderId === currentUserId && (
                    <>
                      <button
                        onClick={() => handleEditMessage(message)}
                        className="action-btn"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message.id)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="message-group received">
            <div className="message-bubble typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="chat-input-area">
        {/* Reply Quote */}
        {replyingTo && (
          <div className="reply-preview">
            <div className="reply-info">
              <span className="reply-label">Replying to {replyingTo.senderId === currentUserId ? 'yourself' : otherUserName}</span>
              <p className="reply-preview-text">{replyingTo.content}</p>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="reply-close"
            >
              ✕
            </button>
          </div>
        )}

        <div className="chat-input-wrapper">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="input-icon-btn"
            title="Attach file"
          >
            <Paperclip size={20} className="text-slate-600" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx"
          />

          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="chat-input"
          />

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="input-icon-btn"
            title="Add emoji"
          >
            <Smile size={20} className="text-slate-600" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="send-button"
          >
            <Send size={20} />
          </button>
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="emoji-picker">
            {['😀', '😂', '❤️', '👍', '🔥', '😍', '🎉', '✨'].map(emoji => (
              <button
                key={emoji}
                onClick={() => {
                  setInputValue(inputValue + emoji);
                  setShowEmojiPicker(false);
                }}
                className="emoji-btn"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
