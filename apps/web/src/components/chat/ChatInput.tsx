'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Paperclip, Send, X, Loader } from 'lucide-react';
import styles from './ChatInput.module.css';

interface ChatInputProps {
  onSendMessage: (message: string, attachments?: File[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false,
  isLoading = false,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.wav`, {
          type: 'audio/wav',
        });
        setAttachments((prev) => [...prev, audioFile]);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert("Unable to access microphone. Please check permissions.");
    }
  };

  // Stop voice recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  // Handle file attachment
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.currentTarget.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
    // Reset input
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
      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className={styles.attachmentsPreview}>
          {attachments.map((file, index) => (
            <div key={index} className={styles.attachmentItem}>
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
          placeholder="Ask anything about crops, weather, fertilizers..."
          disabled={disabled || isLoading || isRecording}
          className={styles.textInput}
          rows={1}
        />

        {/* Attachment Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isLoading || isRecording}
          className={styles.iconButton}
          title="Attach file"
          aria-label="Attach file"
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
