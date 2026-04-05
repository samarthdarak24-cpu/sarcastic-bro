/**
 * VoiceAssistantWidget - Main AgriVoice AI Interface
 * Full-featured voice control widget with multilingual support
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Languages, Settings, History, Sparkles } from 'lucide-react';
import { VoiceOrb } from './VoiceOrb';
import { voiceAssistantService, VoiceIntent, SupportedLanguage } from '@/services/voiceAssistantService';
import { audioRecorderService } from '@/services/audioRecorderService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface VoiceAssistantWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'FARMER' | 'BUYER';
}

export const VoiceAssistantWidget: React.FC<VoiceAssistantWidgetProps> = ({
  isOpen,
  onClose,
  userRole
}) => {
  const { user } = useAuth();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('hi');
  const [conversationHistory, setConversationHistory] = useState<VoiceIntent[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');

  const sessionInitialized = useRef(false);

  useEffect(() => {
    if (isOpen && !sessionInitialized.current && user) {
      initializeSession();
      sessionInitialized.current = true;
    }

    // Add keyboard listener for ESC key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (!isOpen) {
        voiceAssistantService.endSession();
        sessionInitialized.current = false;
      }
    };
  }, [isOpen, user]);

  const initializeSession = async () => {
    try {
      if (!voiceAssistantService.isSupported()) {
        const browserMessage = 'Voice features are not fully supported in this browser. For the best experience, please use Chrome, Edge, or Safari. You can still type your commands!';
        setResponse(browserMessage);
        setShowTextInput(true);
        toast.error('Voice not supported. Use text input instead.', { duration: 5000 });
        return;
      }

      await voiceAssistantService.startSession(
        user?.id || 'guest',
        userRole,
        language
      );

      // Welcome message
      const welcomeMessage = getWelcomeMessage(language, userRole);
      setResponse(welcomeMessage);
      
      // Try to speak, but don't fail if it doesn't work
      try {
        await voiceAssistantService.speak(welcomeMessage, language);
      } catch (speakError) {
        console.log('Text-to-speech not available, continuing without it');
      }
    } catch (error) {
      console.error('Failed to initialize voice session:', error);
      setResponse('Voice assistant ready! Click the orb to speak or type below.');
      setShowTextInput(true);
    }
  };

  const handleVoiceActivation = async () => {
    if (isListening) {
      // Stop listening and process with Whisper + GPT
      try {
        setIsListening(false);
        setIsProcessing(true);
        setResponse('Processing with AI...');
        
        // Stop recording and get audio blob
        const audioBlob = await audioRecorderService.stopRecording();
        
        // Process complete workflow: Whisper + GPT + Execution + TTS
        const result = await voiceAssistantService.processCompleteVoiceCommand(
          audioBlob,
          language,
          userRole,
          true // include audio response
        );
        
        // Display transcript
        setTranscript(result.transcript);
        
        // Display response
        setResponse(result.response);
        
        // Play audio response if available
        if (result.audioResponse) {
          setIsSpeaking(true);
          await playAudioResponse(result.audioResponse);
          setIsSpeaking(false);
        }
        
        // Show success
        toast.success('Command executed successfully!');
        
      } catch (error: any) {
        console.error('Voice processing error:', error);
        setResponse('Failed to process voice. You can type instead.');
        toast.error('Voice processing failed');
        setShowTextInput(true);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (isSpeaking) {
      // Stop speaking
      voiceAssistantService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    // Start listening - record audio
    try {
      setIsListening(true);
      setTranscript('');
      setResponse('Listening... Speak now!');

      // Start recording
      await audioRecorderService.startRecording();
      
    } catch (error: any) {
      console.error('Voice recording error:', error);
      setIsListening(false);
      
      let errorMessage = 'Microphone access failed';
      let errorDetails = 'Please allow microphone access and try again.';
      
      toast.error(errorMessage + ': ' + errorDetails, { duration: 5000 });
      setResponse(errorMessage + '. ' + errorDetails);
      setShowTextInput(true);
    }
  };

  const playAudioResponse = async (audioBase64: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error('Audio playback failed'));
        audio.play();
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleTextSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!textInput.trim()) return;
    
    const text = textInput.trim();
    setTextInput('');
    setShowTextInput(false);
    setTranscript(text);
    
    await processVoiceCommand(text);
  };

  const processVoiceCommand = async (text: string) => {
    setIsProcessing(true);

    try {
      // Classify intent
      const intent = await voiceAssistantService.processCommand(text);
      
      // Update conversation history
      setConversationHistory(prev => [...prev, intent]);

      // Check if confirmation required
      if (intent.requires_confirmation) {
        const confirmed = await voiceAssistantService.getConfirmation(
          intent.response,
          intent.language
        );

        if (!confirmed) {
          const cancelMessage = getCancelMessage(intent.language);
          setResponse(cancelMessage);
          await voiceAssistantService.speak(cancelMessage, intent.language);
          setIsProcessing(false);
          return;
        }
      }

      // Execute action
      if (intent.action_required) {
        const result = await voiceAssistantService.executeAction(intent);
        
        if (result.success) {
          setResponse(intent.response);
          setIsSpeaking(true);
          await voiceAssistantService.speak(intent.response, intent.language);
          setIsSpeaking(false);

          // Show follow-up suggestion
          if (intent.followup_suggestion) {
            setTimeout(() => {
              setResponse(intent.followup_suggestion!);
            }, 2000);
          }
        } else {
          const errorMessage = result.message || getErrorMessage(intent.language);
          setResponse(errorMessage);
          setIsSpeaking(true);
          await voiceAssistantService.speak(errorMessage, intent.language);
          setIsSpeaking(false);
        }
      } else {
        // Just respond without action
        setResponse(intent.response);
        setIsSpeaking(true);
        await voiceAssistantService.speak(intent.response, intent.language);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Command processing error:', error);
      const errorMessage = getErrorMessage(language);
      setResponse(errorMessage);
      toast.error('Failed to process command');
    } finally {
      setIsProcessing(false);
    }
  };

  const changeLanguage = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    const session = voiceAssistantService.getSession();
    if (session) {
      session.language = newLang;
    }
    toast.success(`Language changed to ${getLanguageName(newLang)}`);
  };

  if (!isOpen) return null;

  const handleClose = () => {
    // Stop any ongoing voice operations
    voiceAssistantService.stopListening();
    voiceAssistantService.stopSpeaking();
    
    // Reset states
    setIsListening(false);
    setIsSpeaking(false);
    setIsProcessing(false);
    
    // Call parent close handler
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      onClick={handleClose}
      style={{ cursor: 'pointer' }}
    >
      {/* Dark backdrop overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Widget container */}
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10" 
        style={{ maxHeight: '85vh', cursor: 'default' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right Corner */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-50 h-10 w-10 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          title="Close (ESC)"
        >
          <X size={20} strokeWidth={3} />
        </button>

        {/* Compact Header */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-blue-600 p-4 text-white shrink-0">
          <div className="flex items-center justify-between pr-12">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-black">AgriVoice AI</h2>
                <p className="text-xs text-white/80 font-medium">
                  {userRole === 'FARMER' ? 'Farmer' : 'Buyer'} Assistant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                title="Settings"
              >
                <Settings size={16} />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                title="History"
              >
                <History size={16} />
              </button>
            </div>
          </div>

          {/* Language Selector */}
          {showSettings && (
            <div className="mt-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Languages size={14} />
                <span className="font-bold text-xs">Select Language</span>
              </div>
              <div className="flex gap-2">
                {(['en', 'hi', 'mr'] as SupportedLanguage[]).map(lang => (
                  <button
                    key={lang}
                    onClick={() => changeLanguage(lang)}
                    className={`
                      px-3 py-1 rounded-lg font-bold text-xs transition-all
                      ${language === lang 
                        ? 'bg-white text-emerald-600' 
                        : 'bg-white/20 hover:bg-white/30'
                      }
                    `}
                  >
                    {getLanguageName(lang)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content - Centered Voice Orb */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col">
          {/* Voice Orb - Centered and Prominent */}
          <div className="flex justify-center items-center flex-1 min-h-[250px]">
            <VoiceOrb
              isListening={isListening}
              isSpeaking={isSpeaking}
              isProcessing={isProcessing}
              onClick={handleVoiceActivation}
              audioLevel={audioLevel}
            />
          </div>

          {/* Transcript Display */}
          {transcript && (
            <div className="mb-3 p-3 bg-slate-100 rounded-xl animate-in slide-in-from-bottom">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                You said:
              </div>
              <div className="text-sm font-medium text-slate-900">
                {transcript}
              </div>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className="mb-3 p-3 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200 animate-in slide-in-from-bottom">
              <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                AgriVoice:
              </div>
              <div className="text-sm font-medium text-slate-900">
                {response}
              </div>
            </div>
          )}

          {/* Text Input Fallback */}
          {showTextInput && (
            <div className="mb-3 animate-in slide-in-from-bottom">
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={language === 'hi' ? 'यहाँ टाइप करें...' : language === 'mr' ? 'येथे टाइप करा...' : 'Type your command...'}
                  className="flex-1 px-3 py-2 border-2 border-emerald-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
                >
                  {language === 'hi' ? 'भेजें' : language === 'mr' ? 'पाठवा' : 'Send'}
                </button>
              </form>
              <button
                onClick={() => setShowTextInput(false)}
                className="mt-2 text-xs text-slate-500 hover:text-slate-700"
              >
                {language === 'hi' ? 'वॉइस पर वापस जाएं' : language === 'mr' ? 'व्हॉइसवर परत या' : 'Back to voice'}
              </button>
            </div>
          )}

          {/* Conversation History */}
          {showHistory && conversationHistory.length > 0 && (
            <div className="mb-3 max-h-32 overflow-y-auto">
              <div className="text-xs font-bold text-slate-700 mb-2">Recent</div>
              <div className="space-y-1">
                {conversationHistory.slice(-3).reverse().map((intent, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 rounded-lg text-xs">
                    <div className="font-bold text-slate-900 text-xs">{intent.intent}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-auto">
            <QuickActionButton
              label={userRole === 'FARMER' ? 'Market Price' : 'Search'}
              onClick={() => {
                const text = userRole === 'FARMER' 
                  ? 'मंडी भाव बताओ' 
                  : 'products search करो';
                setTranscript(text);
                processVoiceCommand(text);
              }}
            />
            <QuickActionButton
              label={userRole === 'FARMER' ? 'List Product' : 'Track Order'}
              onClick={() => {
                const text = userRole === 'FARMER' 
                  ? 'product list करना है' 
                  : 'order track करो';
                setTranscript(text);
                processVoiceCommand(text);
              }}
            />
          </div>

          {/* Type Instead Button */}
          {!showTextInput && !isListening && !isSpeaking && !isProcessing && (
            <button
              onClick={() => setShowTextInput(true)}
              className="mt-2 w-full p-2 text-xs text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              💬 {language === 'hi' ? 'टाइप करें' : language === 'mr' ? 'टाइप करा' : 'Type instead'}
            </button>
          )}
        </div>

        {/* Footer Tips - Minimal */}
        {!isListening && !isSpeaking && !isProcessing && (
          <div className="px-4 pb-3 shrink-0">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-center">
              <div className="text-xs text-amber-800">
                💡 {language === 'hi' ? 'माइक पर टैप करें और बोलें' : language === 'mr' ? 'माइकवर टॅप करा आणि बोला' : 'Tap mic and speak'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="p-2 bg-white border-2 border-slate-200 rounded-lg font-bold text-xs text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all"
  >
    {label}
  </button>
);

// Helper functions
function getWelcomeMessage(lang: SupportedLanguage, role: 'FARMER' | 'BUYER'): string {
  const messages = {
    en: {
      FARMER: "Hello! I'm AgriVoice, your farming assistant. How can I help you today?",
      BUYER: "Hello! I'm AgriVoice, your procurement assistant. What would you like to do?"
    },
    hi: {
      FARMER: "नमस्ते! मैं AgriVoice हूं, आपका खेती सहायक। आज मैं आपकी कैसे मदद कर सकता हूं?",
      BUYER: "नमस्ते! मैं AgriVoice हूं, आपका खरीद सहायक। आप क्या करना चाहेंगे?"
    },
    mr: {
      FARMER: "नमस्कार! मी AgriVoice आहे, तुमचा शेती सहाय्यक. आज मी तुम्हाला कशी मदत करू शकतो?",
      BUYER: "नमस्कार! मी AgriVoice आहे, तुमचा खरेदी सहाय्यक. तुम्हाला काय करायचे आहे?"
    }
  };

  return messages[lang][role];
}

function getCancelMessage(lang: SupportedLanguage): string {
  const messages = {
    en: "Okay, cancelled. What else can I help you with?",
    hi: "ठीक है, रद्द कर दिया। और क्या मदद चाहिए?",
    mr: "ठीक आहे, रद्द केले. आणखी काय मदत करू?"
  };

  return messages[lang];
}

function getErrorMessage(lang: SupportedLanguage): string {
  const messages = {
    en: "Sorry, something went wrong. Please try again.",
    hi: "क्षमा करें, कुछ गड़बड़ हो गई। कृपया फिर से कोशिश करें।",
    mr: "माफ करा, काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा."
  };

  return messages[lang];
}

function getLanguageName(lang: SupportedLanguage): string {
  const names = {
    en: 'English',
    hi: 'हिंदी',
    mr: 'मराठी'
  };

  return names[lang];
}

function getProTip(lang: SupportedLanguage, role: 'FARMER' | 'BUYER'): string {
  const tips = {
    en: {
      FARMER: "Say 'check market price' to get live mandi rates for your crops",
      BUYER: "Say 'search tomatoes' to find the best deals near you"
    },
    hi: {
      FARMER: "'मंडी भाव बताओ' बोलें अपनी फसल की लाइव कीमत जानने के लिए",
      BUYER: "'टमाटर ढूंढो' बोलें अपने पास की बेस्ट डील्स देखने के लिए"
    },
    mr: {
      FARMER: "'मंडी भाव सांगा' म्हणा तुमच्या पिकाची लाइव्ह किंमत जाणून घेण्यासाठी",
      BUYER: "'टोमॅटो शोधा' म्हणा तुमच्या जवळच्या सर्वोत्तम डील्स पाहण्यासाठी"
    }
  };

  return tips[lang][role];
}

export default VoiceAssistantWidget;
