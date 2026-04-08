/**
 * Whisper Service - Frontend API client for voice-to-text transcription
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';

export interface TranscriptionResult {
  text: string;
  language: string;
  confidence?: number;
  duration: number;
  segments?: Array<{
    id: number;
    start: number;
    end: number;
    text: string;
    confidence: number;
    no_speech_prob: number;
  }>;
  processing_time: number;
}

export interface ChunkResult {
  text: string;
  is_final: boolean;
  language: string;
  confidence?: number;
  session_id: string;
  chunk_index: number;
}

export interface LanguageDetectionResult {
  language: string;
  confidence: number;
  probabilities?: Record<string, number>;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  model_name: string;
  device: string;
  memory_usage_mb?: number;
  uptime_seconds?: number;
}

class WhisperService {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  /**
   * Transcribe complete audio file
   */
  async transcribeAudio(
    audioBlob: Blob,
    language: string = 'hi',
    task: string = 'transcribe'
  ): Promise<TranscriptionResult> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');
    formData.append('language', language);
    formData.append('task', task);

    const response = await fetch(`${API_BASE_URL}/whisper/transcribe`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Transcription failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Transcribe audio chunk for streaming
   */
  async transcribeChunk(
    audioChunk: Blob,
    language: string = 'hi',
    context?: string,
    sessionId?: string,
    chunkIndex: number = 0
  ): Promise<ChunkResult> {
    const formData = new FormData();
    formData.append('audio_chunk', audioChunk, `chunk_${chunkIndex}.wav`);
    formData.append('language', language);
    formData.append('chunk_index', chunkIndex.toString());

    if (context) {
      formData.append('context', context);
    }

    if (sessionId) {
      formData.append('session_id', sessionId);
    }

    const response = await fetch(`${API_BASE_URL}/whisper/transcribe-chunk`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Chunk transcription failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Detect language from audio
   */
  async detectLanguage(audioBlob: Blob): Promise<LanguageDetectionResult> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');

    const response = await fetch(`${API_BASE_URL}/whisper/detect-language`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Language detection failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Check Whisper service health
   */
  async checkHealth(): Promise<HealthStatus> {
    const response = await fetch(`${API_BASE_URL}/whisper/health`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    const result = await response.json();
    return result.data;
  }
}

export const whisperService = new WhisperService();
