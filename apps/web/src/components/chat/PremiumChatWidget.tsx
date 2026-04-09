'use client';

import { useEffect, useState, useRef } from 'react';
import { Send, Mic, Paperclip, X, Leaf, Volume2, Loader } from 'lucide-react';
import { SpeechToTextService, TextToSpeechService } from '@/services/speechService';
import '@/styles/premium-chat.css';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  attachments?: File[];
}

const SUGGESTIONS = [
  '🌾 Check crop health',
  '🌤️ Weather forecast',
  '🌱 Fertilizer advice',
  '💧 Irrigation tips',
];

export function PremiumChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m AgriVoice, your smart farming assistant. You can now speak to me, send images, and I\'ll speak back! How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [language, setLanguage] = useState(() => {
    if (typeof document !== 'undefined') {
      const docLang = document.documentElement.lang || 'en';
      return docLang === 'hi' ? 'hi-IN' : docLang === 'mr' ? 'mr-IN' : 'en-IN';
    }
    return 'en-IN';
  });
  const [interimText, setInterimText] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  useEffect(() => {
    const handleLangChange = () => {
      const docLang = document.documentElement.lang || 'en';
      const updatedLang = docLang === 'hi' ? 'hi-IN' : docLang === 'mr' ? 'mr-IN' : 'en-IN';
      setLanguage(updatedLang);
    };
    
    window.addEventListener('languageChanged', handleLangChange);
    // Also use mutation observer on html element if languageChanged event isn't reliable
    const observer = new MutationObserver(handleLangChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    
    return () => {
      window.removeEventListener('languageChanged', handleLangChange);
      observer.disconnect();
    };
  }, []);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechToTextRef = useRef<SpeechToTextService | null>(null);
  const textToSpeechRef = useRef<TextToSpeechService | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize speech services
  useEffect(() => {
    if (SpeechToTextService.isSupported()) {
      speechToTextRef.current = new SpeechToTextService({
        language: language,
        continuous: false,
        interimResults: true,
      });
    }

    if (TextToSpeechService.isSupported()) {
      textToSpeechRef.current = new TextToSpeechService();
    }
  }, [language]);

  useEffect(() => {
    // Get webhook URL from environment
    const url = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
    setWebhookUrl(url);
    if (!url) {
      console.warn('N8N Chat: Webhook URL not configured in .env.local');
    }
  }, []);

  // Start voice recording
  const startRecording = async () => {
    if (!speechToTextRef.current) {
      alert("Speech Recognition not supported in your browser");
      return;
    }

    try {
      setIsRecording(true);
      setRecordingTime(0);
      setInterimText('');

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      speechToTextRef.current.startListening(
        (transcript, isFinal, interim) => {
          if (isFinal) {
            setInput((prev) => prev + transcript);
            setInterimText('');
          } else {
            setInterimText(interim);
          }
        },
        (error) => {
          console.error('Speech error:', error);
          stopRecording();
        },
        undefined,
        () => {
          stopRecording();
        }
      );
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (speechToTextRef.current) {
      speechToTextRef.current.stopListening();
    }
    setIsRecording(false);
    setInterimText('');
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Speak message - toggle on/off per message
  const speakMessage = (messageId: string, content: string) => {
    if (!TextToSpeechService.isSupported()) {
      console.warn('Text-to-Speech not supported');
      return;
    }

    if (speakingMessageId === messageId) {
      // Stop if already speaking this message
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Stop any previous speech
    window.speechSynthesis.cancel();
    setSpeakingMessageId(messageId);

    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = language;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };

    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText && attachments.length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setAttachments([]);
    setIsLoading(true);

    try {
      // Send to N8N webhook
      if (!webhookUrl) {
        throw new Error('Webhook URL not configured. Set NEXT_PUBLIC_N8N_WEBHOOK_URL in .env.local');
      }

      console.log('Sending message to:', webhookUrl);
      console.log('Payload:', { chatInput: messageText, filesCount: attachments.length });

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatInput: messageText,
          filesCount: attachments.length,
          timestamp: new Date().toISOString(),
          language: document.documentElement.lang || 'en', // Since it doesn't use i18n initially, get from document
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('Response data:', data);
      
      // Extract bot response from N8N response
      const botResponse = data.output || data.message || data.response || 
        `I received your message: "${messageText}". Please check your N8N workflow configuration.`;

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to N8N:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the backend is running at ${webhookUrl}`,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);

      // Auto-speak error message if enabled
      if (TextToSpeechService.isSupported()) {
        setTimeout(() => {
          const errorContent = `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Make sure the backend is running at ${webhookUrl}`;
          if (textToSpeechRef.current) {
            textToSpeechRef.current.speak(errorContent, {
              language: language,
              rate: 1,
              pitch: 1,
              volume: 1,
              onEnd: () => {
                setSpeakingMessageId(null);
              },
              onError: (err) => {
                console.error('Speech error:', err);
                setSpeakingMessageId(null);
              },
            });
            setSpeakingMessageId((Date.now() + 1).toString());
          }
        }, 500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chat-float-button"
        aria-label="Open chat"
        title="Chat with AgriVoice AI"
      >
        {isOpen ? <X size={24} /> : <Leaf size={24} />}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="chat-backdrop" onClick={() => setIsOpen(false)} />

          {/* Chat Container */}
          <div className="chat-container">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-content">
                <div className="chat-avatar">🌱</div>
                <div>
                  <h2 className="chat-title">AgriVoice AI</h2>
                  <p className="chat-subtitle">Smart farming assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="chat-close-btn"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="chat-messages">
              {messages.length === 1 && (
                <div className="chat-empty-state">
                  <div className="empty-icon">🌾</div>
                  <p className="empty-text">Start your farming journey</p>
                  <p className="empty-subtext">Ask me anything about crops, weather, or farming tips</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-bubble">
                    <p className="message-text">{message.content}</p>
                    
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {message.attachments.map((file, idx) => (
                          <div key={idx} style={{ fontSize: '12px', padding: '4px 8px', background: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                            {file.type.startsWith('image/') ? '🖼️' : '📄'} {file.name}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Speaker Icon for Bot Messages */}
                    {message.type === 'bot' && TextToSpeechService.isSupported() && (
                      <button
                        onClick={() => speakMessage(message.id, message.content)}
                        className="message-speaker-btn"
                        aria-label="Speak message"
                        title={speakingMessageId === message.id ? 'Stop speaking' : 'Speak message'}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: speakingMessageId === message.id ? 1 : 0.6,
                          color: speakingMessageId === message.id ? '#4caf50' : '#666',
                          transition: 'all 0.2s ease',
                          transform: speakingMessageId === message.id ? 'scale(1.1)' : 'scale(1)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = '1';
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          if (speakingMessageId !== message.id) {
                            e.currentTarget.style.opacity = '0.6';
                            e.currentTarget.style.transform = 'scale(1)';
                          }
                        }}
                      >
                        <Volume2 size={16} />
                      </button>
                    )}

                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="chat-message bot-message">
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions (show when no messages) */}
            {messages.length === 1 && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="suggestion-chip"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div style={{ padding: '8px 16px', borderTop: '1px solid #e5e5e5', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {attachments.map((file, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px', background: '#f0f0f0', borderRadius: '6px', fontSize: '12px' }}>
                    <span>{file.type.startsWith('image/') ? '🖼️' : '📄'}</span>
                    <span>{file.name}</span>
                    <button onClick={() => removeAttachment(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div style={{ padding: '8px 16px', background: '#ffe0e0', borderTop: '1px solid #ffcccc', fontSize: '12px', color: '#d32f2f', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', background: '#d32f2f', borderRadius: '50%', animation: 'pulse 1s infinite' }}></span>
                Recording... {formatRecordingTime(recordingTime)}
              </div>
            )}

            {/* Interim Text Display */}
            {interimText && (
              <div style={{ padding: '8px 16px', background: '#e3f2fd', borderTop: '1px solid #bbdefb', fontSize: '12px', color: '#1976d2' }}>
                <strong>Listening:</strong> {interimText}
              </div>
            )}

            {/* Input Area */}
            <div className="chat-input-area">
              <div className="chat-input-wrapper">
                {/* Mic Button */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isLoading}
                  className="input-icon-btn"
                  title={isRecording ? 'Stop recording' : 'Start recording'}
                  style={{
                    color: isRecording ? '#d32f2f' : '#666',
                    background: isRecording ? '#ffe0e0' : 'transparent',
                    animation: isRecording ? 'pulse 1s infinite' : 'none',
                  }}
                >
                  <Mic size={18} />
                </button>

                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask anything about crops, weather, fertilizers…"
                  className="chat-input"
                  disabled={isRecording}
                />

                {/* File Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading || isRecording}
                  className="input-icon-btn"
                  title="Attach file or image"
                >
                  <Paperclip size={18} />
                </button>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={(!input.trim() && attachments.length === 0) || isLoading}
                  className="send-button"
                  title="Send message"
                >
                  {isLoading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
