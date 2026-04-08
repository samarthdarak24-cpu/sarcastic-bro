import { useEffect, useState, useCallback, useRef } from 'react';
import { realtimeScanService } from '@/services/realtimeScanService';

interface DetectionResult {
  timestamp: number;
  grade: string;
  score: number;
  confidence: number;
  defects: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    count: number;
    location: string;
  }>;
  metrics: {
    colorUniformity: number;
    textureScore: number;
    shapeRegularity: number;
    sizeConsistency: number;
    moistureLevel: number;
  };
  fps: number;
  processingTime: number;
}

interface SessionStats {
  sessionId: string;
  status: 'active' | 'completed' | 'paused';
  totalFrames: number;
  averageScore: number;
  detectionCount: number;
  uptime: number;
  lastDetection: DetectionResult | null;
}

export function useRealtimeScan(userId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentDetection, setCurrentDetection] = useState<DetectionResult | null>(null);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Connect to server
  useEffect(() => {
    const connect = async () => {
      try {
        await realtimeScanService.connect();
        setIsConnected(true);
        setError(null);
      } catch (err: any) {
        console.warn('[useRealtimeScan] Connection failed, using fallback:', err.message);
        setError(null); // Don't show error, use fallback
        setIsConnected(false);
      }
    };

    connect();

    return () => {
      realtimeScanService.disconnect();
    };
  }, []);

  // Listen for detection events
  useEffect(() => {
    if (!isConnected) return;

    realtimeScanService.onDetection((data) => {
      setCurrentDetection(data.detection);
      setDetections(prev => [...prev, data.detection].slice(-100));
    });

    realtimeScanService.onPaused(() => {
      setIsPaused(true);
    });

    realtimeScanService.onResumed(() => {
      setIsPaused(false);
    });

    realtimeScanService.onEnded((data) => {
      setIsScanning(false);
      setSessionId(null);
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
    });

    return () => {
      realtimeScanService.off('scan:detection');
      realtimeScanService.off('scan:paused');
      realtimeScanService.off('scan:resumed');
      realtimeScanService.off('scan:ended');
    };
  }, [isConnected]);

  // Initialize scan session
  const startScan = useCallback(async () => {
    try {
      if (!isConnected) {
        throw new Error('Not connected to server');
      }

      const newSessionId = await realtimeScanService.initializeSession(userId);
      setSessionId(newSessionId);
      setIsScanning(true);
      setDetections([]);
      setCurrentDetection(null);
      setError(null);

      // Poll stats every 500ms
      statsIntervalRef.current = setInterval(async () => {
        try {
          const newStats = await realtimeScanService.getStats();
          setStats(newStats);
        } catch (err: any) {
          console.error('Failed to fetch stats:', err);
        }
      }, 500);
    } catch (err: any) {
      setError(err.message);
      setIsScanning(false);
    }
  }, [isConnected, userId]);

  // Process frame
  const processFrame = useCallback(async (imageBuffer: string) => {
    try {
      if (!isScanning || !sessionId) {
        throw new Error('Scan not active');
      }

      await realtimeScanService.processFrame(imageBuffer);
    } catch (err: any) {
      setError(err.message);
    }
  }, [isScanning, sessionId]);

  // Pause scan
  const pauseScan = useCallback(async () => {
    try {
      await realtimeScanService.pauseScan();
      setIsPaused(true);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // Resume scan
  const resumeScan = useCallback(async () => {
    try {
      await realtimeScanService.resumeScan();
      setIsPaused(false);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  // End scan
  const endScan = useCallback(async () => {
    try {
      const result = await realtimeScanService.endSession();
      setIsScanning(false);
      setSessionId(null);
      if (statsIntervalRef.current) {
        clearInterval(statsIntervalRef.current);
      }
      return result;
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  return {
    isConnected,
    isScanning,
    isPaused,
    sessionId,
    currentDetection,
    detections,
    stats,
    error,
    startScan,
    processFrame,
    pauseScan,
    resumeScan,
    endScan
  };
}
