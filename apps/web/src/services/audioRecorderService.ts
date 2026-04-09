/**
 * Audio Recorder Service
 * Records audio from microphone and sends to Google Speech API via backend
 */

export class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * Start recording audio
   */
  async startRecording(): Promise<void> {
    try {
      console.log('🎤 [RECORDER] Requesting microphone access...');
      
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        } 
      });

      console.log('✅ [RECORDER] Microphone access granted');

      // Create media recorder
      const options = { mimeType: 'audio/webm;codecs=opus' };
      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.audioChunks = [];

      console.log('🎙️ [RECORDER] MediaRecorder created');

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          console.log(`📊 [RECORDER] Audio chunk received: ${event.data.size} bytes`);
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (event: any) => {
        console.error('❌ [RECORDER] MediaRecorder error:', event.error);
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
      console.log('✅ [RECORDER] Recording started');
    } catch (error: any) {
      console.error('❌ [RECORDER] Failed to start recording:', error);
      
      // Provide detailed error information
      if (error.name === 'NotAllowedError') {
        throw new Error('Microphone permission denied. Please allow microphone access in your browser.');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No microphone found. Please connect a microphone.');
      } else if (error.name === 'NotReadableError') {
        throw new Error('Microphone is already in use by another application.');
      } else if (error.name === 'OverconstrainedError') {
        throw new Error('Microphone does not meet the required constraints.');
      } else if (error.name === 'SecurityError') {
        throw new Error('Microphone access blocked by security policy. HTTPS required.');
      } else {
        throw error;
      }
    }
  }

  /**
   * Stop recording and return audio blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        console.error('❌ [RECORDER] No recording in progress');
        reject(new Error('No recording in progress'));
        return;
      }

      if (this.mediaRecorder.state === 'inactive') {
        console.warn('⚠️ [RECORDER] MediaRecorder already inactive');
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
        this.cleanup();
        resolve(audioBlob);
        return;
      }

      this.mediaRecorder.onstop = () => {
        console.log(`✅ [RECORDER] Recording stopped. Chunks: ${this.audioChunks.length}`);
        
        if (this.audioChunks.length === 0) {
          console.error('❌ [RECORDER] No audio data recorded');
          this.cleanup();
          reject(new Error('No audio data recorded. Please try speaking again.'));
          return;
        }
        
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
        console.log(`📦 [RECORDER] Audio blob created: ${audioBlob.size} bytes`);
        
        if (audioBlob.size === 0) {
          console.error('❌ [RECORDER] Audio blob is empty');
          this.cleanup();
          reject(new Error('Audio recording is empty. Please try speaking louder.'));
          return;
        }
        
        this.cleanup();
        resolve(audioBlob);
      };

      console.log('🛑 [RECORDER] Stopping MediaRecorder...');
      this.mediaRecorder.stop();
    });
  }

  /**
   * Cancel recording
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.cleanup();
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  /**
   * Convert blob to base64
   */
  async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Check if recording is supported
   */
  isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }
}

export const audioRecorderService = new AudioRecorderService();

