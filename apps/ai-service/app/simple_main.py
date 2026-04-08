"""
Simple AI Service Main - Lightweight version
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file
load_dotenv()

# Import routers
from app.routers.simple_chat_router import router as simple_chat_router

allowed_origins = [
    origin.strip()
    for origin in os.getenv("AI_CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    if origin.strip()
]

app = FastAPI(
    title="Simple AI Chat Service",
    description="Lightweight AI chat service for any conversation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(simple_chat_router)

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "Simple AI Chat Service",
        "version": "1.0.0",
        "endpoints": {
            "simple_chat": [
                "POST /api/v1/simple-chat/session/create",
                "POST /api/v1/simple-chat/chat",
                "GET /api/v1/simple-chat/session/{session_id}/summary",
                "DELETE /api/v1/simple-chat/session/{session_id}",
                "GET /api/v1/simple-chat/sessions",
                "GET /api/v1/simple-chat/health",
                "GET /api/v1/simple-chat/test"
            ]
        },
    }

@app.get("/")
def root():
    return {
        "message": "Simple AI Chat Service is running!",
        "docs": "/docs",
        "health": "/health"
    }