"""
Minimal FastAPI app for AI Quality Shield Scanner only
No dependencies on OpenAI or other services
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.quality_shield_router import router as quality_shield_router

allowed_origins = [
    origin.strip()
    for origin in os.getenv("AI_CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app = FastAPI(
    title="AI Quality Shield Scanner",
    description=(
        "AI-powered crop quality detection using YOLOv8, EfficientNet, "
        "Transfer Learning, and OpenCV"
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quality_shield_router)


@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "AI Quality Shield Scanner",
        "version": "1.0.0",
        "technology": {
            "detection": "YOLOv8",
            "classification": "EfficientNet-B3",
            "preprocessing": "OpenCV",
            "transfer_learning": "Enabled"
        },
        "endpoints": {
            "scan": "POST /quality-shield/scan",
            "batch": "POST /quality-shield/scan-batch",
            "defects": "POST /quality-shield/analyze-defects",
            "health": "GET /quality-shield/health",
            "grades": "GET /quality-shield/grades"
        },
    }


@app.get("/")
def root():
    return {
        "message": "AI Quality Shield Scanner is running",
        "docs": "/docs",
        "technology": "YOLOv8 + EfficientNet + Transfer Learning + OpenCV"
    }
