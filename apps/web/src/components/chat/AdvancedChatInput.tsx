'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Paperclip, Send, X, Loader, Volume2, VolumeX } from 'lucide-react';
import { SpeechToTextService, TextToSpeechService } from '@/services/speechService';
import styles from './AdvancedChatInput.module.css';

interface AdvancedChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  onVoiceStart?: () => void;
  onVoiceEnd?: () => void;
}

export const AdvancedChatInput: React.FC<AdvancedChatInputProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
  onVoiceStart,
  onVoiceEnd,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [language, setLanguage] = useState('en-IN');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [interimText, setInterimText] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const speechToTextRef = useRef<SpeechToTextService | null>(null);
  const textToSpeechRef = useRef<TextToSpeechService | null>(null);

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
      onVoiceStart?.();

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      speechToTextRef.current.startListening(
        (transcript, isFinal, interim) => {
          if (isFinal) {
            setMessage((prev) => prev + transcript);
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
    onVoiceEnd?.();
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

  // Send message
  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments.length > 0 ? attachments : undefined);
      setMessage('');
      setAttachments([]);
      setInterimText('');
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.chatInputContainer}>
      {/* Language & Voice Settings */}
      <div className={styles.settingsBar}>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={styles.languageSelect}
          disabled={isRecording || disabled}
        >
          {SpeechToTextService.getAvailableLanguages().map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <label className={styles.voiceToggle}>
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(e) => setVoiceEnabled(e.target.checked)}
            disabled={disabled}
          />
          <span>AI Voice Output</span>
        </label>
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className={styles.attachmentsPreview}>
          {attachments.map((file, index) => (
            <div key={index} className={styles.attachmentItem}>
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className={styles.attachmentImage}
                />
              ) : (
                <div className={styles.attachmentFile}>
                  <span className={styles.fileIcon}>📄</span>
                </div>
              )}
              <div className={styles.attachmentInfo}>
                <span className={styles.attachmentName}>{file.name}</span>
                <span className={styles.attachmentSize}>
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <button
                onClick={() => removeAttachment(index)}
                className={styles.removeAttachment}
                aria-label="Remove attachment"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className={styles.recordingIndicator}>
          <div className={styles.recordingDot}></div>
          <span>Recording... {formatTime(recordingTime)}</span>
        </div>
      )}

      {/* Interim Text Display */}
      {interimText && (
        <div className={styles.interimText}>
          <span className={styles.interimLabel}>Listening:</span>
          <span className={styles.interimContent}>{interimText}</span>
        </div>
      )}

      {/* Input Area */}
      <div className={styles.inputWrapper}>
        {/* Mic Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={disabled || isLoading}
          className={`${styles.iconButton} ${isRecording ? styles.recording : ''}`}
          title={isRecording ? 'Stop recording' : 'Start recording'}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <Mic size={20} />
        </button>

        {/* Text Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type or speak your message..."
          disabled={disabled || isLoading || isRecording}
          className={styles.textInput}
          rows={1}
        />

        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading || isRecording}
          className={styles.iconButton}
          title="Attach file or image"
          aria-label="Attach file or image"
        >
          <Paperclip size={20} />
        </button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className={styles.hiddenInput}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
        />

        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          disabled={disabled || isLoading || (!message.trim() && attachments.length === 0)}
          className={styles.sendButton}
          title="Send message"
          aria-label="Send message"
        >
          {isLoading ? <Loader size={20} className={styles.spinner} /> : <Send size={20} />}
        </button>
      </div>
    </div>
  );
};
