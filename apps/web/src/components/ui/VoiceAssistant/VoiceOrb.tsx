/**
 * VoiceOrb - Animated microphone orb for voice activation
 * Pulsing, breathing animation with visual feedback
 */

import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceOrbProps {
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  onClick: () => void;
  audioLevel?: number;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isListening,
  isSpeaking,
  isProcessing,
  onClick,
  audioLevel = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 0.05;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 60;

      if (isListening) {
        // Animated sound waves
        for (let i = 0; i < 3; i++) {
          const radius = baseRadius + (i * 20) + (Math.sin(time + i) * 10) + (audioLevel * 30);
          const opacity = 0.3 - (i * 0.1);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
      } else if (isSpeaking) {
        // Speaking animation
        for (let i = 0; i < 4; i++) {
          const radius = baseRadius + (i * 15) + (Math.sin(time * 2 + i) * 8);
          const opacity = 0.4 - (i * 0.1);
          
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (isProcessing) {
        // Processing spinner
        const radius = baseRadius + 20;
        const segments = 8;
        
        for (let i = 0; i < segments; i++) {
          const angle = (i / segments) * Math.PI * 2 + time;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          const opacity = 0.2 + (i / segments) * 0.6;
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(168, 85, 247, ${opacity})`;
          ctx.fill();
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isListening, isSpeaking, isProcessing, audioLevel]);

  const getOrbState = () => {
    if (isListening) return 'listening';
    if (isSpeaking) return 'speaking';
    if (isProcessing) return 'processing';
    return 'idle';
  };

  const orbState = getOrbState();

  const stateColors = {
    idle: 'bg-gradient-to-br from-slate-600 to-slate-800',
    listening: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    speaking: 'bg-gradient-to-br from-blue-500 to-blue-600',
    processing: 'bg-gradient-to-br from-purple-500 to-purple-600'
  };

  const stateGlows = {
    idle: 'shadow-lg shadow-slate-500/20',
    listening: 'shadow-2xl shadow-emerald-500/50',
    speaking: 'shadow-2xl shadow-blue-500/50',
    processing: 'shadow-2xl shadow-purple-500/50'
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Canvas for animations */}
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        className="absolute inset-0 pointer-events-none"
        style={{ width: '200px', height: '200px' }}
      />

      {/* Main Orb Button */}
      <button
        onClick={onClick}
        disabled={isProcessing}
        className={`
          relative z-10 h-32 w-32 rounded-full
          ${stateColors[orbState]}
          ${stateGlows[orbState]}
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isListening ? 'animate-pulse-slow' : ''}
          ${isSpeaking ? 'animate-bounce-subtle' : ''}
        `}
      >
        {isListening && <Mic size={48} className="text-white animate-pulse" />}
        {isSpeaking && <Volume2 size={48} className="text-white animate-pulse" />}
        {isProcessing && (
          <div className="h-12 w-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        )}
        {!isListening && !isSpeaking && !isProcessing && (
          <Mic size={48} className="text-white" />
        )}
      </button>

      {/* Status Label */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className={`
          px-4 py-2 rounded-full text-sm font-bold
          ${orbState === 'listening' ? 'bg-emerald-100 text-emerald-700' : ''}
          ${orbState === 'speaking' ? 'bg-blue-100 text-blue-700' : ''}
          ${orbState === 'processing' ? 'bg-purple-100 text-purple-700' : ''}
          ${orbState === 'idle' ? 'bg-slate-100 text-slate-700' : ''}
        `}>
          {orbState === 'listening' && '🎤 Listening...'}
          {orbState === 'speaking' && '🔊 Speaking...'}
          {orbState === 'processing' && '⚡ Processing...'}
          {orbState === 'idle' && 'Tap to speak'}
        </div>
      </div>
    </div>
  );
};

export default VoiceOrb;
