"""
Ollama Service Integration
Provides local LLM capabilities with streaming support, health checks, and model management.
"""

import asyncio
import json
import logging
from typing import AsyncGenerator, Dict, List, Optional, Any
import aiohttp
from pydantic import BaseModel
import time

logger = logging.getLogger(__name__)

class OllamaConfig(BaseModel):
    """Configuration for Ollama service"""
    base_url: str = "http://localhost:11434"
    model: str = "qwen2.5:latest"
    temperature: float = 0.7
    max_tokens: int = 2000
    stream: bool = True
    timeout: int = 30

class OllamaMessage(BaseModel):
    """Message format for Ollama API"""
    role: str  # 'system', 'user', 'assistant'
    content: str

class OllamaResponse(BaseModel):
    """Response from Ollama API"""
    model: str
    created_at: str
    message: OllamaMessage
    done: bool
    total_duration: Optional[int] = None
    load_duration: Optional[int] = None
    prompt_eval_count: Optional[int] = None
    prompt_eval_duration: Optional[int] = None
    eval_count: Optional[int] = None
    eval_duration: Optional[int] = None

class StreamChunk(BaseModel):
    """Streaming response chunk"""
    type: str  # 'content', 'metadata', 'done', 'error'
    content: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: float = None

    def __init__(self, **data):
        if 'timestamp' not in data:
            data['timestamp'] = time.time()
        super().__init__(**data)

class OllamaService:
    """Service for interacting with local Ollama LLM"""
    
    def __init__(self, config: Optional[OllamaConfig] = None):
        self.config = config or OllamaConfig()
        self.session: Optional[aiohttp.ClientSession] = None
        self._available_models: List[str] = []
        self._last_health_check: float = 0
        self._health_check_interval: float = 60  # 1 minute
        
    async def __aenter__(self):
        """Async context manager entry"""
        await self.initialize()
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.cleanup()
        
    async def initialize(self):
        """Initialize the Ollama service"""
        try:
            self.session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=self.config.timeout)
            )
            
            # Check if Ollama is available
            is_healthy = await self.health_check()
            if not is_healthy:
                logger.warning("Ollama service is not available at startup")
            else:
                # Load available models
                await self._load_available_models()
                logger.info(f"Ollama service initialized with models: {self._available_models}")
                
        except Exception as e:
            logger.error(f"Failed to initialize Ollama service: {e}")
            
    async def cleanup(self):
        """Cleanup resources"""
        if self.session:
            await self.session.close()
            
    async def health_check(self) -> bool:
        """Check if Ollama service is healthy"""
        try:
            current_time = time.time()
            
            # Use cached result if recent
            if current_time - self._last_health_check < self._health_check_interval:
                return len(self._available_models) > 0
                
            if not self.session:
                return False
                
            async with self.session.get(f"{self.config.base_url}/api/tags") as response:
                if response.status == 200:
                    self._last_health_check = current_time
                    return True
                return False
                
        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            return False
            
    async def _load_available_models(self):
        """Load list of available models from Ollama"""
        try:
            if not self.session:
                return
                
            async with self.session.get(f"{self.config.base_url}/api/tags") as response:
                if response.status == 200:
                    data = await response.json()
                    self._available_models = [model["name"] for model in data.get("models", [])]
                    logger.info(f"Available Ollama models: {self._available_models}")
                else:
                    logger.warning(f"Failed to load models: HTTP {response.status}")
                    
        except Exception as e:
            logger.error(f"Failed to load available models: {e}")
            
    async def get_available_models(self) -> List[str]:
        """Get list of available models"""
        if not self._available_models:
            await self._load_available_models()
        return self._available_models
        
    async def pull_model(self, model_name: str) -> bool:
        """Pull a model from Ollama registry"""
        try:
            if not self.session:
                return False
                
            payload = {"name": model_name}
            
            async with self.session.post(
                f"{self.config.base_url}/api/pull",
                json=payload
            ) as response:
                if response.status == 200:
                    # Refresh available models
                    await self._load_available_models()
                    return True
                return False
                
        except Exception as e:
            logger.error(f"Failed to pull model {model_name}: {e}")
            return False
            
    async def chat_stream(
        self,
        messages: List[OllamaMessage],
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> AsyncGenerator[StreamChunk, None]:
        """Stream chat responses from Ollama"""
        
        # Use provided parameters or defaults
        model = model or self.config.model
        temperature = temperature or self.config.temperature
        max_tokens = max_tokens or self.config.max_tokens
        
        # Check if service is available
        if not await self.health_check():
            yield StreamChunk(
                type="error",
                error="OLLAMA_UNAVAILABLE",
                metadata={"message": "Ollama service is not available"}
            )
            return
            
        # Check if model is available
        available_models = await self.get_available_models()
        if model not in available_models:
            yield StreamChunk(
                type="error", 
                error="MODEL_NOT_FOUND",
                metadata={"message": f"Model {model} not found. Available: {available_models}"}
            )
            return
            
        try:
            if not self.session:
                raise Exception("Session not initialized")
                
            # Prepare request payload
            payload = {
                "model": model,
                "messages": [msg.dict() for msg in messages],
                "stream": True,
                "options": {
                    "temperature": temperature,
                    "num_predict": max_tokens
                }
            }
            
            # Send metadata chunk
            yield StreamChunk(
                type="metadata",
                metadata={
                    "model": model,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "message_count": len(messages)
                }
            )
            
            # Stream response from Ollama
            async with self.session.post(
                f"{self.config.base_url}/api/chat",
                json=payload
            ) as response:
                
                if response.status != 200:
                    error_text = await response.text()
                    yield StreamChunk(
                        type="error",
                        error="OLLAMA_REQUEST_FAILED",
                        metadata={"status": response.status, "error": error_text}
                    )
                    return
                    
                # Process streaming response
                async for line in response.content:
                    if line:
                        try:
                            chunk_data = json.loads(line.decode('utf-8'))
                            
                            if chunk_data.get("done", False):
                                # Final chunk with metadata
                                yield StreamChunk(
                                    type="done",
                                    metadata={
                                        "total_duration": chunk_data.get("total_duration"),
                                        "load_duration": chunk_data.get("load_duration"),
                                        "prompt_eval_count": chunk_data.get("prompt_eval_count"),
                                        "prompt_eval_duration": chunk_data.get("prompt_eval_duration"),
                                        "eval_count": chunk_data.get("eval_count"),
                                        "eval_duration": chunk_data.get("eval_duration")
                                    }
                                )
                                break
                            else:
                                # Content chunk
                                message = chunk_data.get("message", {})
                                content = message.get("content", "")
                                
                                if content:
                                    yield StreamChunk(
                                        type="content",
                                        content=content
                                    )
                                    
                        except json.JSONDecodeError as e:
                            logger.warning(f"Failed to parse Ollama response chunk: {e}")
                            continue
                            
        except asyncio.TimeoutError:
            yield StreamChunk(
                type="error",
                error="TIMEOUT",
                metadata={"message": "Request timed out"}
            )
        except Exception as e:
            logger.error(f"Ollama chat stream error: {e}")
            yield StreamChunk(
                type="error",
                error="INTERNAL_ERROR",
                metadata={"message": str(e)}
            )
            
    async def chat_complete(
        self,
        messages: List[OllamaMessage],
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> Dict[str, Any]:
        """Get complete chat response (non-streaming)"""
        
        full_response = ""
        metadata = {}
        error = None
        
        async for chunk in self.chat_stream(messages, model, temperature, max_tokens):
            if chunk.type == "content":
                full_response += chunk.content or ""
            elif chunk.type == "done":
                metadata = chunk.metadata or {}
            elif chunk.type == "error":
                error = chunk.error
                metadata = chunk.metadata or {}
                break
                
        return {
            "success": error is None,
            "response": full_response,
            "error": error,
            "metadata": metadata
        }

# Global instance
_ollama_service: Optional[OllamaService] = None

async def get_ollama_service() -> OllamaService:
    """Get or create global Ollama service instance"""
    global _ollama_service
    
    if _ollama_service is None:
        _ollama_service = OllamaService()
        await _ollama_service.initialize()
        
    return _ollama_service

async def cleanup_ollama_service():
    """Cleanup global Ollama service"""
    global _ollama_service
    
    if _ollama_service:
        await _ollama_service.cleanup()
        _ollama_service = None