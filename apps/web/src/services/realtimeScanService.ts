import { io, Socket } from 'socket.io-client';

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

class RealtimeScanService {
  private socket: Socket | null = null;
  private sessionId: string | null = null;
  private isConnected = false;

  /**
   * Connect to real-time scan server
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        
        this.socket = io(apiUrl, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ['websocket', 'polling'],
          secure: apiUrl.startsWith('https'),
          rejectUnauthorized: false,
          path: '/socket.io/',
          withCredentials: true,
        });

        this.socket.on('connect', () => {
          console.log('[RealtimeScan] Connected to server');
          this.isConnected = true;
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('[RealtimeScan] Connection error:', error);
          // Don't reject, allow fallback to work
          this.isConnected = false;
        });

        this.socket.on('disconnect', () => {
          console.log('[RealtimeScan] Disconnected from server');
          this.isConnected = false;
        });

        // Set a timeout for connection attempt
        setTimeout(() => {
          if (!this.isConnected) {
            console.warn('[RealtimeScan] Connection timeout, using fallback');
            resolve(); // Resolve anyway to allow fallback
          }
        }, 5000);
      } catch (error) {
        console.error('[RealtimeScan] Connection setup error:', error);
        // Don't reject, allow fallback
        resolve();
      }
    });
  }

  /**
   * Initialize a new scan session
   */
  async initializeSession(userId: string): Promise<string> {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('scan:init', { userId }, (response: any) => {
        if (response.success) {
          this.sessionId = response.sessionId;
          resolve(response.sessionId);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  /**
   * Process a frame from the video stream
   */
  async processFrame(imageBuffer: string): Promise<DetectionResult> {
    if (!this.socket || !this.sessionId) {
      throw new Error('Session not initialized');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('scan:frame', {
        sessionId: this.sessionId,
        imageBuffer
      }, (response: any) => {
        if (response.success) {
          resolve(response.detection);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  /**
   * Get current session statistics
   */
  async getStats(): Promise<SessionStats> {
    if (!this.socket || !this.sessionId) {
      throw new Error('Session not initialized');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('scan:stats', {
        sessionId: this.sessionId
      }, (response: any) => {
        if (response.success) {
          resolve(response.stats);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  /**
   * Pause the current scan
   */
  async pauseScan(): Promise<void> {
    if (!this.socket || !this.sessionId) {
      throw new Error('Session not initialized');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('scan:pause', {
        sessionId: this.sessionId
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  /**
   * Resume the current scan
   */
  async resumeScan(): Promise<void> {
    if (!this.socket || !this.sessionId) {
      throw new Error('Session not initialized');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('scan:resume', {
        sessionId: this.sessionId
      }, (response: any) => {
        if (response.success) {
          resolve();
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  /**
   * End the current scan session
   */
  async endSession(): Promise<any> {
    if (!this.socket || !this.sessionId) {
      throw new Error('Session not initialized');
    }

    return new Promise((resolve, reject) => {
      this.socket!.emit('scan:end', {
        sessionId: this.sessionId
      }, (response: any) => {
        if (response.success) {
          this.sessionId = null;
          resolve(response.result);
        } else {
          reject(new Error(response.error));
        }
      });
    });
  }

  /**
   * Listen for detection events
   */
  onDetection(callback: (data: any) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.on('scan:detection', callback);
  }

  /**
   * Listen for scan paused event
   */
  onPaused(callback: (data: any) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.on('scan:paused', callback);
  }

  /**
   * Listen for scan resumed event
   */
  onResumed(callback: (data: any) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.on('scan:resumed', callback);
  }

  /**
   * Listen for scan ended event
   */
  onEnded(callback: (data: any) => void): void {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }

    this.socket.on('scan:ended', callback);
  }

  /**
   * Remove event listener
   */
  off(event: string): void {
    if (this.socket) {
      this.socket.off(event);
    }
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.sessionId = null;
    }
  }

  /**
   * Check if connected
   */
  getIsConnected(): boolean {
    return this.isConnected;
  }

  /**
   * Get current session ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }
}

export const realtimeScanService = new RealtimeScanService();
