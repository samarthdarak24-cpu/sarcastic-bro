"""
Pydantic schemas for Whisper voice-to-text transcription
"""
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator


class Segment(BaseModel):
    """Individual segment of transcribed audio with timing"""
    id: int
    start: float = Field(ge=0.0, description="Start time in seconds")
    end: float = Field(ge=0.0, description="End time in seconds")
    text: str
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence score")
    no_speech_prob: float = Field(ge=0.0, le=1.0, description="Probability of no speech")
    
    @field_validator('end')
    @classmethod
    def validate_end_after_start(cls, v, info):
        if 'start' in info.data and v < info.data['start']:
            raise ValueError('end time must be after start time')
        return v


class TranscriptionResult(BaseModel):
    """Complete transcription result for audio file"""
    text: str = Field(min_length=0, description="Transcribed text")
    language: str = Field(pattern=r'^[a-z]{2}$', description="ISO language code")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    duration: float = Field(gt=0.0, description="Audio duration in seconds")
    segments: Optional[List[Segment]] = None
    processing_time: float = Field(gt=0.0, description="Processing time in seconds")


class ChunkResult(BaseModel):
    """Result for streaming audio chunk transcription"""
    text: str = Field(description="Transcribed text (can be empty for silence)")
    is_final: bool = Field(description="Whether this is the final chunk")
    language: str = Field(pattern=r'^[a-z]{2}$', description="ISO language code")
    confidence: Optional[float] = Field(None, ge=0.0, le=1.0)
    session_id: str = Field(description="Session UUID")
    chunk_index: int = Field(ge=0, description="Sequential chunk number")


class AudioMetadata(BaseModel):
    """Metadata about audio file"""
    format: str = Field(pattern=r'^(wav|mp3|webm|ogg)$')
    sample_rate: int = Field(gt=0, description="Sample rate in Hz")
    channels: int = Field(ge=1, le=2, description="Number of audio channels")
    duration: float = Field(gt=0.0, description="Duration in seconds")
    size_bytes: int = Field(gt=0, description="File size in bytes")


class LanguageResponse(BaseModel):
    """Language detection response"""
    language: str = Field(pattern=r'^[a-z]{2}$', description="Detected ISO language code")
    confidence: float = Field(ge=0.0, le=1.0, description="Detection confidence")
    probabilities: Optional[dict] = Field(None, description="Probabilities for all languages")


class HealthResponse(BaseModel):
    """Whisper service health check response"""
    status: str = Field(description="Service status: healthy, degraded, unhealthy")
    model_loaded: bool = Field(description="Whether Whisper model is loaded")
    model_name: str = Field(description="Name of loaded model")
    device: str = Field(description="Device: cpu or cuda")
    memory_usage_mb: Optional[float] = Field(None, description="Memory usage in MB")
    uptime_seconds: Optional[float] = Field(None, description="Service uptime")


class TranscriptionRequest(BaseModel):
    """Request for audio transcription"""
    language: Optional[str] = Field("hi", pattern=r'^(en|hi|mr|auto)$')
    task: str = Field("transcribe", pattern=r'^(transcribe|translate)$')


class ChunkRequest(BaseModel):
    """Request for chunk transcription"""
    language: Optional[str] = Field("hi", pattern=r'^(en|hi|mr|auto)$')
    context: Optional[str] = Field(None, max_length=500)
    session_id: Optional[str] = None
    chunk_index: int = Field(ge=0)
