'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextToSpeechOptions {
  language?: 'en' | 'hi' | 'mr';
  autoSpeak?: boolean;
  rate?: number;
  pitch?: number;
  volume?: number;
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const {
    language = 'en',
    autoSpeak = false,
    rate = 1.0,
    pitch = 1.0,
    volume = 1.0,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setIsSupported(supported);

    if (supported) {
      // Load voices
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Get best voice for language
  const getVoiceForLanguage = useCallback((lang: string): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;

    // Language code mapping
    const langMap: Record<string, string[]> = {
      en: ['en-US', 'en-GB', 'en-IN', 'en'],
      hi: ['hi-IN', 'hi'],
      mr: ['mr-IN', 'mr'],
    };

    const langCodes = langMap[lang] || ['en-US'];

    // Try to find exact match
    for (const code of langCodes) {
      const voice = voices.find(v => v.lang.startsWith(code));
      if (voice) return voice;
    }

    // Fallback to default
    return voices[0];
  }, [voices]);

  // Speak function
  const speak = useCallback((text: string) => {
    if (!isSupported || !text.trim()) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Set voice
    const voice = getVoiceForLanguage(language);
    if (voice) {
      utterance.voice = voice;
    }

    // Set properties
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    // Speak
    window.speechSynthesis.speak(utterance);
  }, [isSupported, language, rate, pitch, volume, getVoiceForLanguage]);

  // Stop function
  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
  }, [isSupported]);

  // Pause function
  const pause = useCallback(() => {
    if (!isSupported || !isSpeaking) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported, isSpeaking]);

  // Resume function
  const resume = useCallback(() => {
    if (!isSupported || !isPaused) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported, isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isSupported]);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isSupported,
    voices,
  };
}
