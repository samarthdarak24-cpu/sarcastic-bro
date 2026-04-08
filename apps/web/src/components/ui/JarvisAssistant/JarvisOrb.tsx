/**
 * JARVIS 3D Animated Orb
 * Advanced visual feedback with emotions and states
 */

import React, { useEffect, useRef } from 'react';
import { AssistantMode, EmotionState } from '@/services/jarvisAssistantService';

interface JarvisOrbProps {
  mode: AssistantMode;
  emotion: EmotionState;
  audioLevel?: number;
  onClick?: () => void;
}

export const JarvisOrb: React.FC<JarvisOrbProps> = ({
  mode,
  emotion,
  audioLevel = 0,
  onClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = 60;

    let rotation = 0;
    let pulsePhase = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update animation parameters
      rotation += 0.01;
      pulsePhase += 0.05;

      // Get colors based on mode and emotion
      const colors = getColors(mode, emotion);

      // Draw outer glow
      drawGlow(ctx, centerX, centerY, baseRadius, colors, pulsePhase);

      // Draw main orb
      drawOrb(ctx, centerX, centerY, baseRadius, colors, rotation, mode);

      // Draw particles for active states
      if (mode !== 'idle') {
        drawParticles(ctx, centerX, centerY, baseRadius, colors, rotation);
      }

      // Draw waveform for speaking
      if (mode === 'speaking') {
        drawWaveform(ctx, centerX, centerY, baseRadius, colors, pulsePhase, audioLevel);
      }

      // Draw thinking animation
      if (mode === 'thinking' || mode === 'processing') {
        drawThinkingRings(ctx, centerX, centerY, baseRadius, colors, rotation);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mode, emotion, audioLevel]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={onClick}
      />
      
      {/* Mode indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-12">
        <div className="px-4 py-2 bg-black/80 backdrop-blur-sm rounded-full">
          <span className="text-white text-sm font-bold uppercase tracking-wider">
            {getModeText(mode)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper functions for drawing

function getColors(mode: AssistantMode, emotion: EmotionState) {
  const colorMap = {
    idle: { primary: '#3b82f6', secondary: '#60a5fa', glow: '#93c5fd' },
    listening: { primary: '#10b981', secondary: '#34d399', glow: '#6ee7b7' },
    processing: { primary: '#f59e0b', secondary: '#fbbf24', glow: '#fcd34d' },
    speaking: { primary: '#8b5cf6', secondary: '#a78bfa', glow: '#c4b5fd' },
    thinking: { primary: '#ec4899', secondary: '#f472b6', glow: '#f9a8d4' }
  };

  return colorMap[mode] || colorMap.idle;
}

function drawGlow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colors: any,
  phase: number
) {
  const pulseSize = Math.sin(phase) * 10 + 20;
  const gradient = ctx.createRadialGradient(x, y, radius, x, y, radius + pulseSize);
  
  gradient.addColorStop(0, colors.primary + '00');
  gradient.addColorStop(0.5, colors.glow + '40');
  gradient.addColorStop(1, colors.glow + '00');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius + pulseSize, 0, Math.PI * 2);
  ctx.fill();
}

function drawOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colors: any,
  rotation: number,
  mode: AssistantMode
) {
  // Main orb with gradient
  const gradient = ctx.createRadialGradient(
    x - radius * 0.3,
    y - radius * 0.3,
    radius * 0.1,
    x,
    y,
    radius
  );
  
  gradient.addColorStop(0, colors.secondary);
  gradient.addColorStop(0.7, colors.primary);
  gradient.addColorStop(1, colors.primary + 'cc');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner ring
  ctx.strokeStyle = colors.glow + '80';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.7, 0, Math.PI * 2);
  ctx.stroke();

  // Rotating segments
  if (mode !== 'idle') {
    ctx.strokeStyle = colors.glow;
    ctx.lineWidth = 3;
    
    for (let i = 0; i < 6; i++) {
      const angle = rotation + (i * Math.PI / 3);
      const startAngle = angle - 0.2;
      const endAngle = angle + 0.2;
      
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.85, startAngle, endAngle);
      ctx.stroke();
    }
  }
}

function drawParticles(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colors: any,
  rotation: number
) {
  ctx.fillStyle = colors.glow;
  
  for (let i = 0; i < 12; i++) {
    const angle = rotation * 2 + (i * Math.PI / 6);
    const distance = radius + 20 + Math.sin(rotation * 3 + i) * 10;
    const px = x + Math.cos(angle) * distance;
    const py = y + Math.sin(angle) * distance;
    const size = 2 + Math.sin(rotation * 4 + i) * 1;
    
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWaveform(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colors: any,
  phase: number,
  audioLevel: number
) {
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';

  const bars = 32;
  const angleStep = (Math.PI * 2) / bars;

  for (let i = 0; i < bars; i++) {
    const angle = i * angleStep;
    const barHeight = (Math.sin(phase + i * 0.5) * 0.5 + 0.5) * 20 * (1 + audioLevel);
    
    const x1 = x + Math.cos(angle) * (radius + 5);
    const y1 = y + Math.sin(angle) * (radius + 5);
    const x2 = x + Math.cos(angle) * (radius + 5 + barHeight);
    const y2 = y + Math.sin(angle) * (radius + 5 + barHeight);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

function drawThinkingRings(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  colors: any,
  rotation: number
) {
  for (let i = 0; i < 3; i++) {
    const ringRadius = radius + 15 + i * 15;
    const opacity = 1 - i * 0.3;
    const offset = rotation * (i + 1);

    ctx.strokeStyle = colors.primary + Math.floor(opacity * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.lineDashOffset = -offset * 20;

    ctx.beginPath();
    ctx.arc(x, y, ringRadius, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function getModeText(mode: AssistantMode): string {
  const modeTexts = {
    idle: 'Ready',
    listening: 'Listening...',
    processing: 'Processing...',
    speaking: 'Speaking...',
    thinking: 'Thinking...'
  };

  return modeTexts[mode] || 'Ready';
}

export default JarvisOrb;
