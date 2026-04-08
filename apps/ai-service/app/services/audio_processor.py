"""
Audio processing utilities for Whisper transcription
Handles format conversion, resampling, normalization, and chunking
"""
import io
import numpy as np
from scipy.io import wavfile
from scipy import signal
import logging
from typing import List, Tuple

logger = logging.getLogger(__name__)


class AudioProcessor:
    """Static methods for audio preprocessing"""
    
    @staticmethod
    def convert_to_array(audio_data: bytes, source_format: str = "wav") -> Tuple[np.ndarray, int]:
        """
        Convert audio bytes to numpy array
        
        Args:
            audio_data: Raw audio bytes
            source_format: Source audio format (wav, mp3, webm, ogg)
            
        Returns:
            Tuple of (audio_array, sample_rate)
        """
        try:
            if source_format.lower() in ["wav", "wave"]:
                # Read WAV directly
                sample_rate, audio_array = wavfile.read(io.BytesIO(audio_data))
                
                # Convert to float32 and normalize to [-1, 1]
                if audio_array.dtype == np.int16:
                    audio_array = audio_array.astype(np.float32) / 32768.0
                elif audio_array.dtype == np.int32:
                    audio_array = audio_array.astype(np.float32) / 2147483648.0
                elif audio_array.dtype == np.uint8:
                    audio_array = (audio_array.astype(np.float32) - 128) / 128.0
                    
                # Convert stereo to mono if needed
                if len(audio_array.shape) > 1:
                    audio_array = audio_array.mean(axis=1)
                    
                return audio_array, sample_rate
            else:
                # For other formats, would need ffmpeg
                # For now, raise error
                raise ValueError(f"Format {source_format} requires ffmpeg conversion")
                
        except Exception as e:
            logger.error(f"Error converting audio to array: {e}")
            raise ValueError(f"Failed to convert audio: {str(e)}")
    
    @staticmethod
    def resample_audio(audio_array: np.ndarray, source_sr: int, target_sr: int = 16000) -> np.ndarray:
        """
        Resample audio to target sample rate (Whisper requires 16kHz)
        
        Args:
            audio_array: Input audio array
            source_sr: Source sample rate
            target_sr: Target sample rate (default 16000 for Whisper)
            
        Returns:
            Resampled audio array
        """
        if source_sr == target_sr:
            return audio_array
            
        try:
            # Calculate resampling ratio
            num_samples = int(len(audio_array) * target_sr / source_sr)
            
            # Use scipy's resample for high-quality resampling
            resampled = signal.resample(audio_array, num_samples)
            
            logger.info(f"Resampled audio from {source_sr}Hz to {target_sr}Hz")
            return resampled.astype(np.float32)
            
        except Exception as e:
            logger.error(f"Error resampling audio: {e}")
            raise ValueError(f"Failed to resample audio: {str(e)}")
    
    @staticmethod
    def normalize_audio(audio: np.ndarray, target_level: float = 0.9) -> np.ndarray:
        """
        Normalize audio levels to target peak amplitude
        
        Args:
            audio: Input audio array
            target_level: Target peak level (0.0 to 1.0)
            
        Returns:
            Normalized audio array
        """
        try:
            # Find peak amplitude
            peak = np.abs(audio).max()
            
            if peak == 0:
                logger.warning("Audio is silent (peak = 0)")
                return audio
            
            # Normalize to target level
            normalized = audio * (target_level / peak)
            
            # Clip to prevent overflow
            normalized = np.clip(normalized, -1.0, 1.0)
            
            return normalized.astype(np.float32)
            
        except Exception as e:
            logger.error(f"Error normalizing audio: {e}")
            return audio
    
    @staticmethod
    def split_audio_chunks(
        audio: np.ndarray,
        chunk_duration: float = 3.0,
        sample_rate: int = 16000,
        overlap: float = 0.0
    ) -> List[np.ndarray]:
        """
        Split audio into chunks for streaming transcription
        
        Args:
            audio: Input audio array
            chunk_duration: Duration of each chunk in seconds
            sample_rate: Audio sample rate
            overlap: Overlap between chunks in seconds
            
        Returns:
            List of audio chunks
        """
        try:
            chunk_samples = int(chunk_duration * sample_rate)
            overlap_samples = int(overlap * sample_rate)
            step_samples = chunk_samples - overlap_samples
            
            chunks = []
            start = 0
            
            while start < len(audio):
                end = min(start + chunk_samples, len(audio))
                chunk = audio[start:end]
                
                # Pad last chunk if too short
                if len(chunk) < chunk_samples:
                    chunk = np.pad(chunk, (0, chunk_samples - len(chunk)), mode='constant')
                
                chunks.append(chunk)
                start += step_samples
                
                # Break if we've reached the end
                if end >= len(audio):
                    break
            
            logger.info(f"Split audio into {len(chunks)} chunks of {chunk_duration}s")
            return chunks
            
        except Exception as e:
            logger.error(f"Error splitting audio: {e}")
            raise ValueError(f"Failed to split audio: {str(e)}")
    
    @staticmethod
    def validate_audio(audio_data: bytes, max_size_mb: int = 10, max_duration_s: int = 60) -> None:
        """
        Validate audio file size and duration
        
        Args:
            audio_data: Raw audio bytes
            max_size_mb: Maximum file size in MB
            max_duration_s: Maximum duration in seconds
            
        Raises:
            ValueError: If validation fails
        """
        # Check file size
        size_mb = len(audio_data) / (1024 * 1024)
        if size_mb > max_size_mb:
            raise ValueError(f"Audio file too large: {size_mb:.2f}MB (max {max_size_mb}MB)")
        
        # Try to read and check duration
        try:
            audio_array, sample_rate = AudioProcessor.convert_to_array(audio_data)
            duration = len(audio_array) / sample_rate
            
            if duration > max_duration_s:
                raise ValueError(f"Audio too long: {duration:.2f}s (max {max_duration_s}s)")
                
            logger.info(f"Audio validated: {size_mb:.2f}MB, {duration:.2f}s")
            
        except Exception as e:
            logger.error(f"Audio validation failed: {e}")
            raise
    
    @staticmethod
    def detect_silence(audio: np.ndarray, threshold: float = 0.01) -> bool:
        """
        Detect if audio is mostly silence
        
        Args:
            audio: Input audio array
            threshold: RMS threshold for silence detection
            
        Returns:
            True if audio is silent
        """
        rms = np.sqrt(np.mean(audio ** 2))
        return rms < threshold
