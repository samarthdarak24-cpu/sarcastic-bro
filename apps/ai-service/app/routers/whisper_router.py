"""
FastAPI router for Whisper voice-to-text transcription endpoints
"""
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Optional
import logging
import psutil
import time

from app.whisper_schemas import (
    TranscriptionResult,
    ChunkResult,
    LanguageResponse,
    HealthResponse
)
from app.services.whisper_service import WhisperTranscriptionService
from app.services.audio_processor import AudioProcessor

logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter(prefix="/whisper", tags=["Whisper"])

# Global service instance (initialized on startup)
whisper_service: Optional[WhisperTranscriptionService] = None
service_start_time = time.time()


def get_whisper_service() -> WhisperTranscriptionService:
    """Get Whisper service instance"""
    if whisper_service is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Whisper service not initialized"
        )
    return whisper_service


@router.post("/transcribe", response_model=TranscriptionResult)
async def transcribe_audio(
    file: UploadFile = File(..., description="Audio file to transcribe"),
    language: str = Form("hi", description="Language code: en, hi, mr, auto"),
    task: str = Form("transcribe", description="Task: transcribe or translate")
):
    """
    Transcribe complete audio file
    
    - **file**: Audio file (WAV, MP3, WebM, OGG)
    - **language**: Target language (en=English, hi=Hindi, mr=Marathi, auto=detect)
    - **task**: transcribe (default) or translate to English
    
    Returns transcription with text, language, duration, and segments
    """
    service = get_whisper_service()
    
    try:
        # Read audio file
        audio_data = await file.read()
        
        # Validate audio
        AudioProcessor.validate_audio(audio_data, max_size_mb=10, max_duration_s=60)
        
        # Transcribe
        result = service.transcribe_audio(
            audio_data=audio_data,
            language=language,
            task=task
        )
        
        return result
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        logger.error(f"Transcription error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.post("/transcribe-chunk", response_model=ChunkResult)
async def transcribe_chunk(
    audio_chunk: UploadFile = File(..., description="Audio chunk (2-3 seconds)"),
    language: str = Form("hi", description="Language code: en, hi, mr"),
    context: Optional[str] = Form(None, description="Previous transcription context"),
    session_id: Optional[str] = Form(None, description="Session UUID"),
    chunk_index: int = Form(0, description="Sequential chunk number")
):
    """
    Transcribe audio chunk with session context for streaming
    
    - **audio_chunk**: Audio chunk file (2-3 seconds)
    - **language**: Target language
    - **context**: Previous transcription for continuity
    - **session_id**: Session UUID (auto-generated if not provided)
    - **chunk_index**: Sequential chunk number starting from 0
    
    Returns partial transcription with is_final flag
    """
    service = get_whisper_service()
    
    try:
        # Read audio chunk
        audio_data = await audio_chunk.read()
        
        # Transcribe chunk
        result = service.transcribe_chunk(
            audio_chunk=audio_data,
            language=language,
            context=context,
            session_id=session_id,
            chunk_index=chunk_index
        )
        
        return result
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        logger.error(f"Chunk transcription error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.post("/detect-language", response_model=LanguageResponse)
async def detect_language(
    file: UploadFile = File(..., description="Audio file for language detection")
):
    """
    Detect language from audio file
    
    - **file**: Audio file (any supported format)
    
    Returns detected language code with confidence score
    """
    service = get_whisper_service()
    
    try:
        # Read audio file
        audio_data = await file.read()
        
        # Detect language
        result = service.detect_language(audio_data)
        
        return result
        
    except RuntimeError as e:
        logger.error(f"Language detection error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Check Whisper service health status
    
    Returns service status, model info, and resource usage
    """
    try:
        # Check if service is initialized
        if whisper_service is None:
            return HealthResponse(
                status="unhealthy",
                model_loaded=False,
                model_name="none",
                device="none",
                memory_usage_mb=None,
                uptime_seconds=None
            )
        
        # Get memory usage
        process = psutil.Process()
        memory_mb = process.memory_info().rss / (1024 * 1024)
        
        # Calculate uptime
        uptime = time.time() - service_start_time
        
        # Determine status
        model_loaded = whisper_service.is_model_loaded()
        status_str = "healthy" if model_loaded else "degraded"
        
        return HealthResponse(
            status=status_str,
            model_loaded=model_loaded,
            model_name=whisper_service.model_name,
            device=whisper_service.device,
            memory_usage_mb=round(memory_mb, 2),
            uptime_seconds=round(uptime, 2)
        )
        
    except Exception as e:
        logger.error(f"Health check error: {e}")
        return HealthResponse(
            status="unhealthy",
            model_loaded=False,
            model_name="error",
            device="error",
            memory_usage_mb=None,
            uptime_seconds=None
        )


def initialize_whisper_service(model_name: str = "base", device: str = "cpu"):
    """
    Initialize Whisper service on application startup
    
    Args:
        model_name: Whisper model size
        device: Device to run on (cpu or cuda)
    """
    global whisper_service, service_start_time
    
    try:
        logger.info("Initializing Whisper service...")
        whisper_service = WhisperTranscriptionService(model_name=model_name, device=device)
        whisper_service.load_model()
        service_start_time = time.time()
        logger.info("Whisper service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize Whisper service: {e}")
        whisper_service = None
        raise


def cleanup_whisper_service():
    """Cleanup Whisper service on application shutdown"""
    global whisper_service
    
    if whisper_service:
        logger.info("Cleaning up Whisper service...")
        whisper_service.cleanup_expired_sessions()
        whisper_service = None
        logger.info("Whisper service cleaned up")
