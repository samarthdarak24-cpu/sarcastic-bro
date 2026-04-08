"""
Whisper transcription service for voice-to-text conversion
Manages model loading, transcription, and language detection
"""
import whisper
import torch
import numpy as np
import time
import logging
from typing import Optional, Dict
from uuid import uuid4

from app.whisper_schemas import (
    TranscriptionResult,
    ChunkResult,
    Segment,
    LanguageResponse
)
from app.services.audio_processor import AudioProcessor

logger = logging.getLogger(__name__)


class SessionContext:
    """Context for streaming transcription session"""
    def __init__(self, language: str):
        self.language = language
        self.accumulated_text = ""
        self.chunk_count = 0
        self.created_at = time.time()


class WhisperTranscriptionService:
    """Core service for Whisper-based transcription"""
    
    def __init__(self, model_name: str = "base", device: str = "cpu"):
        """
        Initialize Whisper transcription service
        
        Args:
            model_name: Whisper model size (tiny, base, small, medium, large)
            device: Device to run on (cpu or cuda)
        """
        self.model_name = model_name
        self.device = device
        self.model = None
        self.audio_processor = AudioProcessor()
        self.sessions: Dict[str, SessionContext] = {}
        self.session_timeout = 300  # 5 minutes
        
        logger.info(f"Initializing Whisper service with model={model_name}, device={device}")
    
    def load_model(self) -> None:
        """Load Whisper model into memory"""
        try:
            logger.info(f"Loading Whisper model: {self.model_name}")
            self.model = whisper.load_model(self.model_name, device=self.device)
            logger.info(f"Whisper model loaded successfully on {self.device}")
        except Exception as e:
            logger.error(f"Failed to load Whisper model: {e}")
            raise RuntimeError(f"Model loading failed: {str(e)}")
    
    def is_model_loaded(self) -> bool:
        """Check if model is loaded"""
        return self.model is not None
    
    def transcribe_audio(
        self,
        audio_data: bytes,
        language: str = "hi",
        task: str = "transcribe"
    ) -> TranscriptionResult:
        """
        Transcribe complete audio file
        
        Args:
            audio_data: Raw audio bytes
            language: Target language (en, hi, mr, auto)
            task: Task type (transcribe or translate)
            
        Returns:
            TranscriptionResult with text and metadata
        """
        if not self.is_model_loaded():
            raise RuntimeError("Whisper model not loaded")
        
        try:
            start_time = time.time()
            
            # Step 1: Convert to numpy array
            logger.info("Converting audio to array")
            audio_array, sample_rate = self.audio_processor.convert_to_array(audio_data)
            
            # Step 2: Resample to 16kHz if needed
            if sample_rate != 16000:
                logger.info(f"Resampling from {sample_rate}Hz to 16000Hz")
                audio_array = self.audio_processor.resample_audio(audio_array, sample_rate, 16000)
            
            # Step 3: Normalize audio
            audio_array = self.audio_processor.normalize_audio(audio_array)
            
            # Step 4: Transcribe using Whisper
            logger.info(f"Transcribing audio (language={language})")
            
            transcribe_options = {
                "task": task,
                "fp16": False,  # Use FP32 for CPU compatibility
                "verbose": False
            }
            
            # Add language if not auto-detect
            if language != "auto":
                transcribe_options["language"] = language
            
            result = self.model.transcribe(audio_array, **transcribe_options)
            
            processing_time = time.time() - start_time
            
            # Step 5: Extract results
            segments = []
            if "segments" in result:
                for seg in result["segments"]:
                    segments.append(Segment(
                        id=seg["id"],
                        start=seg["start"],
                        end=seg["end"],
                        text=seg["text"],
                        confidence=seg.get("confidence", 0.0),
                        no_speech_prob=seg.get("no_speech_prob", 0.0)
                    ))
            
            transcription = TranscriptionResult(
                text=result["text"].strip(),
                language=result.get("language", language),
                duration=len(audio_array) / 16000,
                segments=segments if segments else None,
                processing_time=processing_time
            )
            
            logger.info(f"Transcription complete in {processing_time:.2f}s: {transcription.text[:100]}")
            return transcription
            
        except Exception as e:
            logger.error(f"Transcription failed: {e}")
            raise RuntimeError(f"Transcription error: {str(e)}")
    
    def transcribe_chunk(
        self,
        audio_chunk: bytes,
        language: str = "hi",
        context: Optional[str] = None,
        session_id: Optional[str] = None,
        chunk_index: int = 0
    ) -> ChunkResult:
        """
        Transcribe audio chunk with session context
        
        Args:
            audio_chunk: Audio chunk bytes (2-3 seconds)
            language: Target language
            context: Previous transcription context
            session_id: Session UUID
            chunk_index: Sequential chunk number
            
        Returns:
            ChunkResult with partial transcription
        """
        if not self.is_model_loaded():
            raise RuntimeError("Whisper model not loaded")
        
        try:
            # Step 1: Get or create session
            if not session_id:
                session_id = str(uuid4())
            
            if session_id not in self.sessions:
                self.sessions[session_id] = SessionContext(language)
                logger.info(f"Created new session: {session_id}")
            
            session = self.sessions[session_id]
            
            # Step 2: Validate chunk index
            if chunk_index != session.chunk_count:
                raise ValueError(f"Expected chunk {session.chunk_count}, got {chunk_index}")
            
            # Step 3: Process audio chunk
            audio_array, sample_rate = self.audio_processor.convert_to_array(audio_chunk)
            
            if sample_rate != 16000:
                audio_array = self.audio_processor.resample_audio(audio_array, sample_rate, 16000)
            
            audio_array = self.audio_processor.normalize_audio(audio_array)
            
            # Step 4: Prepare context prompt
            prompt = None
            if context or session.accumulated_text:
                # Use last 200 characters as context
                prompt = (context or session.accumulated_text)[-200:]
            
            # Step 5: Transcribe chunk
            transcribe_options = {
                "language": language,
                "task": "transcribe",
                "fp16": False,
                "verbose": False
            }
            
            if prompt:
                transcribe_options["initial_prompt"] = prompt
            
            result = self.model.transcribe(audio_array, **transcribe_options)
            chunk_text = result["text"].strip()
            
            # Step 6: Update session
            session.accumulated_text += " " + chunk_text
            session.chunk_count += 1
            
            # Step 7: Detect if final chunk
            is_final = self.audio_processor.detect_silence(audio_array) or chunk_index > 20
            
            # Step 8: Calculate confidence
            confidence = self._calculate_confidence(result)
            
            chunk_result = ChunkResult(
                text=chunk_text,
                is_final=is_final,
                language=language,
                confidence=confidence,
                session_id=session_id,
                chunk_index=chunk_index
            )
            
            # Step 9: Cleanup if final
            if is_final:
                logger.info(f"Session {session_id} complete: {session.accumulated_text}")
                del self.sessions[session_id]
            
            return chunk_result
            
        except Exception as e:
            logger.error(f"Chunk transcription failed: {e}")
            raise RuntimeError(f"Chunk transcription error: {str(e)}")
    
    def detect_language(self, audio_data: bytes) -> LanguageResponse:
        """
        Detect language from audio
        
        Args:
            audio_data: Raw audio bytes
            
        Returns:
            LanguageResponse with detected language
        """
        if not self.is_model_loaded():
            raise RuntimeError("Whisper model not loaded")
        
        try:
            # Process audio
            audio_array, sample_rate = self.audio_processor.convert_to_array(audio_data)
            
            if sample_rate != 16000:
                audio_array = self.audio_processor.resample_audio(audio_array, sample_rate, 16000)
            
            # Use first 30 seconds for detection
            max_samples = 30 * 16000
            if len(audio_array) > max_samples:
                audio_array = audio_array[:max_samples]
            
            # Detect language
            audio_tensor = torch.from_numpy(audio_array).float()
            audio_tensor = whisper.pad_or_trim(audio_tensor)
            
            mel = whisper.log_mel_spectrogram(audio_tensor).to(self.model.device)
            _, probs = self.model.detect_language(mel)
            
            detected_lang = max(probs, key=probs.get)
            
            # Map to supported languages
            if detected_lang in ['hi', 'mr', 'en']:
                final_lang = detected_lang
            elif detected_lang in ['ur', 'pa', 'bn']:
                final_lang = 'hi'  # Default to Hindi for Indic languages
            else:
                final_lang = 'en'  # Default to English
            
            logger.info(f"Detected language: {final_lang} (confidence: {probs[detected_lang]:.2f})")
            
            return LanguageResponse(
                language=final_lang,
                confidence=probs[detected_lang],
                probabilities=dict(probs)
            )
            
        except Exception as e:
            logger.error(f"Language detection failed: {e}")
            raise RuntimeError(f"Language detection error: {str(e)}")
    
    def cleanup_expired_sessions(self) -> None:
        """Remove expired sessions (older than timeout)"""
        current_time = time.time()
        expired = [
            sid for sid, session in self.sessions.items()
            if current_time - session.created_at > self.session_timeout
        ]
        
        for sid in expired:
            logger.info(f"Cleaning up expired session: {sid}")
            del self.sessions[sid]
    
    def _calculate_confidence(self, result: dict) -> float:
        """Calculate average confidence from segments"""
        if "segments" not in result or not result["segments"]:
            return 0.0
        
        confidences = [seg.get("confidence", 0.0) for seg in result["segments"]]
        return sum(confidences) / len(confidences) if confidences else 0.0
