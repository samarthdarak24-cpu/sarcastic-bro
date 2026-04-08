'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RealtimeCropScanner } from '@/components/dashboard/farmer/RealtimeCropScanner';
import { useRealtimeScan } from '@/hooks/useRealtimeScan';
import toast from 'react-hot-toast';

export default function RealtimeScannerPage() {
  const [userId, setUserId] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const {
    isConnected,
    isScanning,
    isPaused,
    currentDetection,
    detections,
    stats,
    error,
    startScan,
    processFrame,
    pauseScan,
    resumeScan,
    endScan
  } = useRealtimeScan(userId);

  // Get user ID from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // Show connection status
  useEffect(() => {
    if (isConnected) {
      toast.success('Connected to real-time scan server');
    }
  }, [isConnected]);

  // Show errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Process video frames
  useEffect(() => {
    if (!isScanning || !videoRef.current || !canvasRef.current || isPaused) {
      return;
    }

    const processFrame = async () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx || !videoRef.current) {
        animationFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      try {
        // Draw video frame to canvas
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Convert canvas to base64
        const imageBuffer = canvasRef.current.toDataURL('image/jpeg', 0.8).split(',')[1];

        // Send to server for processing
        await processFrame(imageBuffer);
      } catch (err) {
        console.error('Frame processing error:', err);
      }

      animationFrameRef.current = requestAnimationFrame(processFrame);
    };

    animationFrameRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScanning, isPaused, processFrame]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <RealtimeCropScanner />

      {/* Hidden video and canvas for frame capture */}
      <video
        ref={videoRef}
        className="hidden"
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="hidden"
        width={1920}
        height={1080}
      />
    </div>
  );
}
