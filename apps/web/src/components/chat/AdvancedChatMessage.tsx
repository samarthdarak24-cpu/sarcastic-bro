'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { TextToSpeechService } from '@/services/speechService';
import styles from './AdvancedChatMessage.module.css';

interface AdvancedChatMessageProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  attachments?: File[];
  voiceEnabled?: boolean;
  language?: string;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

export const AdvancedChatMessage: React.FC<AdvancedChatMessageProps> = ({
  id,
  role,
  content,
  timestamp,
  attachments,
  voiceEnabled = true,
  language = 'en-IN',
  onSpeakStart,
  onSpeakEnd,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [textToSpeechService] = useState(() => new TextToSpeechService());

  // Auto-speak AI messages if voice enabled
  useEffect(() => {
    if (role === 'assistant' && voiceEnabled && TextToSpeechService.isSupported()) {
      // Small delay to ensure message is rendered
      const timer = setTimeout(() => {
        speakMessage();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [role, voiceEnabled, content]);

  const speakMessage = () => {
    if (!TextToSpeechService.isSupported()) {
      console.warn('Text-to-Speech not supported');
      return;
    }

    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    setIsSpeaking(true);
    setIsPaused(false);
    onSpeakStart?.();

    textToSpeechService.speak(content, {
      language: language,
      rate: 1,
      pitch: 1,
      volume: 1,
      onStart: () => {
        setIsSpeaking(true);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsPaused(false);
        onSpeakEnd?.();
      },
      onError: (error) => {
        console.error('Speech error:', error);
        setIsSpeaking(false);
        setIsPaused(false);
      },
    });
  };

  const pauseSpeaking = () => {
    if (isSpeaking && !isPaused) {
      textToSpeechService.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeaking = () => {
    if (isPaused) {
      textToSpeechService.resume();
      setIsPaused(false);
    }
  };

  const stopSpeaking = () => {
    textToSpeechService.stop();
    setIsSpeaking(false);
    setIsPaused(false);
    onSpeakEnd?.();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={`${styles.message} ${styles[role]} ${isSpeaking ? styles.speaking : ''}`}>
      <div className={styles.messageContent}>
        <p>{content}</p>

        {/* Attachments */}
        {attachments && attachments.length > 0 && (
          <div className={styles.attachmentsList}>
            {attachments.map((file, idx) => (
              <div key={idx} className={styles.attachmentPreview}>
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className={styles.attachmentImage}
                  />
                ) : (
                  <div className={styles.attachmentFile}>
                    <span>📄</span>
                    <span className={styles.fileName}>{file.name}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Voice Controls for AI Messages */}
      {role === 'assistant' && TextToSpeechService.isSupported() && (
        <div className={styles.voiceControls}>
          {!isSpeaking ? (
            <button
              onClick={speakMessage}
              className={styles.voiceButton}
              title="Play message"
              aria-label="Play message"
            >
              <Volume2 size={16} />
            </button>
          ) : (
            <>
              {!isPaused ? (
                <button
                  onClick={pauseSpeaking}
                  className={styles.voiceButton}
                  title="Pause"
                  aria-label="Pause"
                >
                  <Pause size={16} />
                </button>
              ) : (
                <button
                  onClick={resumeSpeaking}
                  className={styles.voiceButton}
                  title="Resume"
                  aria-label="Resume"
                >
                  <Play size={16} />
                </button>
              )}
              <button
                onClick={stopSpeaking}
                className={styles.voiceButton}
                title="Stop"
                aria-label="Stop"
              >
                <VolumeX size={16} />
              </button>
            </>
          )}
        </div>
      )}

      <span className={styles.timestamp}>{formatTime(timestamp)}</span>
    </div>
  );
};
