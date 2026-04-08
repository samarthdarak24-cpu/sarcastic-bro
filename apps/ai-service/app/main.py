import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.routers.core_router import router as core_router
from app.routers.advanced_router import router as advanced_router
from app.routers.chat_router import router as chat_router
from app.routers.insights_router import router as insights_router
from app.routers.product_hub import router as product_hub_router
from app.routers.whisper_router import router as whisper_router, initialize_whisper_service, cleanup_whisper_service
from app.routers.master_ai_router import router as master_ai_router
from app.routers.advanced_chat_router import router as advanced_chat_router
from app.routers.simple_chat_router import router as simple_chat_router
from app.routers.quality_shield_router import router as quality_shield_router
from app.routers.ollama_chat_router import router as ollama_chat_router
from app.routers.super_chat_router import router as super_chat_router
from app.routers.llm_chat_router import router as llm_chat_router
from app.routers.langchain_chat_router import router as langchain_chat_router
from app.routers.simple_langchain_router import router as simple_langchain_router
from app.routers.stream_chat_router import router as stream_chat_router
from app.routers.mock_stream_chat_router import router as mock_stream_chat_router
from app.routers.hitesh_stream_chat_router import router as hitesh_stream_chat_router

allowed_origins = [
    origin.strip()
    for origin in os.getenv("AI_CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup: Initialize Whisper service
    whisper_model = os.getenv("WHISPER_MODEL", "base")
    whisper_device = os.getenv("WHISPER_DEVICE", "cpu")
    try:
        initialize_whisper_service(model_name=whisper_model, device=whisper_device)
    except Exception as e:
        print(f"Warning: Whisper service initialization failed: {e}")
    
    yield
    
    # Shutdown: Cleanup Whisper service
    cleanup_whisper_service()


app = FastAPI(
    title="ODOP Connect AI Service",
    description=(
        "AI-powered quality grading, recommendation engine, demand forecasting, "
        "pest detection, yield prediction, dynamic pricing, crop rotation advisor, "
        "and voice-to-text transcription."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(core_router)
app.include_router(advanced_router)
app.include_router(chat_router)
app.include_router(insights_router)
app.include_router(product_hub_router)
app.include_router(whisper_router)
app.include_router(master_ai_router)
app.include_router(advanced_chat_router)
app.include_router(simple_chat_router)
app.include_router(quality_shield_router)
app.include_router(ollama_chat_router)
app.include_router(super_chat_router)
app.include_router(llm_chat_router)
app.include_router(langchain_chat_router)
app.include_router(simple_langchain_router)
app.include_router(stream_chat_router)
app.include_router(mock_stream_chat_router)
app.include_router(hitesh_stream_chat_router)


@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "ODOP Connect AI Service",
        "version": "2.0.0",
        "endpoints": {
            "core": [
                "POST /ai/quality-grade",
                "POST /ai/recommend-buyers",
                "POST /ai/recommend-farmers",
                "POST /ai/demand-forecast",
            ],
            "advanced": [
                "POST /ai/advanced/xai-heatmap",
                "POST /ai/advanced/yield-prediction",
                "POST /ai/advanced/pest-detection",
                "POST /ai/advanced/dynamic-pricing",
                "POST /ai/advanced/crop-rotation",
            ],
            "whisper": [
                "POST /whisper/transcribe",
                "POST /whisper/transcribe-chunk",
                "POST /whisper/detect-language",
                "GET /whisper/health",
            ],
        },
    }


@app.get("/")
def root():
    return {"message": "ODOP Connect AI Service is running. Visit /docs for API documentation."}
