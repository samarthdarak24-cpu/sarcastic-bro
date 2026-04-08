'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseBrowserSpeechRecognitionOptions {
  language?: 'en' | 'hi' | 'mr';
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

interface UseBrowserSpeechRecognitionReturn {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export function useBrowserSpeechRecognition(
  options: UseBrowserSpeechRecognitionOptions = {}
): UseBrowserSpeechRecognitionReturn {
  const {
    language = 'en',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Language code mapping
  const getLanguageCode = (lang: string): string => {
    const langMap: Record<string, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      mr: 'mr-IN',
    };
    return langMap[lang] || 'en-US';
  };

  // Check browser support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      // Initialize recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.lang = getLanguageCode(language);
      recognition.maxAlternatives = 1;

      // Handle results
      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript.trim());

        if (onResult) {
          onResult(currentTranscript.trim(), !!finalTranscript);
        }

        // Auto-stop if not continuous and we have a final result
        if (!continuous && finalTranscript) {
          recognition.stop();
        }
      };

      // Handle errors
      recognition.onerror = (event: any) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        setIsListening(false);
        
        if (onError) {
          onError(errorMessage);
        }
      };

      // Handle end
      recognition.onend = () => {
        setIsListening(false);
      };

      // Handle start
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language, continuous, interimResults, onResult, onError]);

  // Start listening
  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Speech recognition not supported in this browser');
      return;
    }

    try {
      setError(null);
      setTranscript('');
      recognitionRef.current.lang = getLanguageCode(language);
      recognitionRef.current.start();
    } catch (err: any) {
      setError(`Failed to start: ${err.message}`);
      if (onError) {
        onError(err.message);
      }
    }
  }, [isSupported, language, onError]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}
