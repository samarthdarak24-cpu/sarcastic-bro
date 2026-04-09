/**
 * JARVIS AI Assistant Widget
 * Advanced voice assistant with continuous listening and wake word detection
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, Mic, MicOff, Volume2, VolumeX, Zap } from 'lucide-react';
import { JarvisOrb } from './JarvisOrb';
import { jarvisAssistant, SupportedLanguage } from '@/services/jarvisAssistantService';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

interface JarvisWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'FARMER' | 'BUYER';
}

export const JarvisWidget: React.FC<JarvisWidgetProps> = ({
  isOpen,
  onClose,
  userRole
}) => {
  const { user } = useAuth();
  const [state, setState] = useState(jarvisAssistant.getState());
  const [showSettings, setShowSettings] = useState(false);
  const [continuousListening, setContinuousListening] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const stateUpdateInterval = useRef<NodeJS.Timeout>();

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Internet connection restored!');
      if (isOpen && !state.isActive) {
        initializeJarvis();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('Internet connection lost. Voice recognition requires internet.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOpen, state.isActive]);

  useEffect(() => {
    if (isOpen && user) {
      initializeJarvis();
    }

    return () => {
      if (stateUpdateInterval.current) {
        clearInterval(stateUpdateInterval.current);
      }
    };
  }, [isOpen, user]);

  // Update state periodically
  useEffect(() => {
    if (isOpen) {
      stateUpdateInterval.current = setInterval(() => {
        setState(jarvisAssistant.getState());
      }, 100);
    }

    return () => {
      if (stateUpdateInterval.current) {
        clearInterval(stateUpdateInterval.current);
      }
    };
  }, [isOpen]);

  const initializeJarvis = async () => {
    try {
      console.log('🚀 Initializing JARVIS...');
      
      // Check internet connection first
      if (!navigator.onLine) {
        toast.error('No internet connection. Speech recognition requires internet.', {
          duration: 5000
        });
        setResponse('Internet connection required for voice recognition. Please check your connection and try again.');
        return;
      }

      await jarvisAssistant.start(
        user?.id || 'guest',
        userRole,
        language
      );

      toast.success('JARVIS is now active! Say "Jarvis" to give commands.', {
        duration: 5000,
        icon: '🤖'
      });

      setState(jarvisAssistant.getState());
    } catch (error: any) {
      console.error('Failed to initialize JARVIS:', error);
      
      let errorMessage = 'Failed to start JARVIS.';
      if (error.message?.includes('permission')) {
        errorMessage = 'Microphone permission denied. Please allow access and try again.';
      } else if (error.message?.includes('microphone')) {
        errorMessage = 'No microphone found. Please connect a microphone.';
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      toast.error(errorMessage);
      setResponse(errorMessage + ' You can close this window and try again.');
    }
  };

  const handleClose = () => {
    jarvisAssistant.stop();
    onClose();
  };

  const toggleContinuousListening = () => {
    const newValue = !continuousListening;
    setContinuousListening(newValue);
    jarvisAssistant.updateConfig({ continuousListening: newValue });
    
    if (newValue) {
      toast.success('Continuous listening enabled');
    } else {
      toast("Continuous listening disabled. Use manual mode.");
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    toast(voiceEnabled ? 'Voice output muted' : 'Voice output enabled');
  };

  const handleManualCommand = async () => {
    // Trigger voice listening directly instead of prompt
    if (!state.isActive) {
      toast.error('JARVIS is not active. Please wait for initialization.');
      return;
    }

    // Simulate wake word detection to start listening
    toast.info('Listening... Speak your command now!', { duration: 3000 });
    
    // The continuous listening will pick up the command automatically
    // No need for manual prompt - just speak!
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      
      {/* Widget */}
      <div 
        className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x" />
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-red-500/80 hover:bg-red-600 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <Zap className="text-yellow-400" size={24} />
                J.A.R.V.I.S.
              </h2>
              <p className="text-sm text-blue-300 mt-1 flex items-center gap-2">
                Just A Rather Very Intelligent System
                {!isOnline && (
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-300 rounded text-xs">
                    ⚠️ Offline
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoice}
                className={`p-2 rounded-full transition-colors ${
                  voiceEnabled 
                    ? 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30' 
                    : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                }`}
                title={voiceEnabled ? 'Mute voice' : 'Unmute voice'}
              >
                {voiceEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <button
                onClick={toggleContinuousListening}
                className={`p-2 rounded-full transition-colors ${
                  continuousListening 
                    ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                    : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                }`}
                title={continuousListening ? 'Disable continuous listening' : 'Enable continuous listening'}
              >
                {continuousListening ? <Mic size={20} /> : <MicOff size={20} />}
              </button>

              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Settings panel */}
          {showSettings && (
            <div className="mt-4 p-4 bg-black/30 rounded-xl backdrop-blur-sm">
              <h3 className="text-white font-bold mb-3">Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-300 block mb-1">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-300 block mb-1">Wake Words</label>
                  <div className="flex flex-wrap gap-2">
                    {['Jarvis', 'AgriVoice', 'Hey Jarvis'].map(word => (
                      <span key={word} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="relative p-8 flex flex-col items-center">
          {/* JARVIS Orb */}
          <JarvisOrb
            mode={state.mode}
            emotion={state.emotion}
            onClick={handleManualCommand}
          />

          {/* Status text */}
          <div className="mt-6 text-center">
            {!isOnline && (
              <div className="space-y-2 mb-4">
                <div className="text-red-300 text-lg font-bold">
                  ⚠️ No Internet Connection
                </div>
                <div className="text-red-200 text-sm">
                  Voice recognition requires internet. Please check your connection.
                </div>
              </div>
            )}

            {isOnline && continuousListening && state.mode === 'idle' && !state.wakeWordDetected && (
              <div className="space-y-2">
                <div className="text-blue-300 text-xl font-bold animate-pulse">
                  🎤 I'm listening...
                </div>
                <div className="text-blue-200 text-sm">
                  Say <span className="font-bold text-white">"Jarvis"</span> to activate
                </div>
              </div>
            )}

            {state.wakeWordDetected && (
              <div className="space-y-2">
                <div className="text-green-300 text-xl font-bold animate-bounce">
                  ✅ Yes? I'm listening!
                </div>
                <div className="text-green-200 text-sm">
                  Speak your command now...
                </div>
              </div>
            )}

            {state.mode === 'processing' && (
              <div className="text-yellow-300 text-xl font-bold">
                ⚙️ Processing your request...
              </div>
            )}

            {state.mode === 'speaking' && (
              <div className="text-purple-300 text-xl font-bold">
                🔊 JARVIS is responding...
              </div>
            )}

            {!continuousListening && (
              <div className="space-y-2">
                <div className="text-gray-300 text-lg">
                  ⚠️ Continuous listening is disabled
                </div>
                <div className="text-gray-400 text-sm">
                  Enable it in settings to use voice commands
                </div>
              </div>
            )}
          </div>

          {/* Transcript */}
          {state.context.lastCommand && (
            <div className="mt-6 w-full max-w-lg p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">You said:</div>
              <div className="text-white font-medium">{state.context.lastCommand}</div>
            </div>
          )}

          {/* Response */}
          {state.context.lastResponse && (
            <div className="mt-3 w-full max-w-lg p-4 bg-blue-500/10 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="text-xs text-blue-300 uppercase tracking-wider mb-1">JARVIS:</div>
              <div className="text-white font-medium">{state.context.lastResponse}</div>
            </div>
          )}

          {/* Command history */}
          {state.context.commandHistory.length > 0 && (
            <div className="mt-6 w-full max-w-lg">
              <div className="text-sm text-gray-400 mb-2">Recent Commands:</div>
              <div className="space-y-1">
                {state.context.commandHistory.slice(-3).reverse().map((cmd, idx) => (
                  <div key={idx} className="px-3 py-2 bg-white/5 rounded-lg text-sm text-gray-300">
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative p-4 border-t border-white/10">
          <div className="text-center space-y-2">
            <div className="text-sm text-gray-300">
              💡 Just say <span className="text-blue-300 font-bold">"Jarvis"</span> and then your command
            </div>
            <div className="text-xs text-gray-400">
              Example: "Jarvis, check market prices" or "Jarvis, list my product"
            </div>
            {continuousListening && (
              <div className="text-xs text-green-400 flex items-center justify-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Continuous listening active - I'm always ready!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JarvisWidget;
