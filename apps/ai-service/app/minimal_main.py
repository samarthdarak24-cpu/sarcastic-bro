"""
Minimal AI Service - Stream Chat Only
Clean implementation for Hitesh-style Stream Chat
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Only import essential routers
from app.routers.hitesh_stream_chat_router import router as hitesh_stream_chat_router

allowed_origins = [
    origin.strip()
    for origin in os.getenv("AI_CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app = FastAPI(
    title="ODOP Connect Stream AI Service",
    description="Hitesh-style Stream Chat with Agricultural AI Agents",
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
)

# Include only the Hitesh Stream Chat router
app.include_router(hitesh_stream_chat_router)

@app.get("/health")
def health_check():
    return {
        "status": "OK",
        "service": "ODOP Connect Stream AI Service",
        "version": "1.0.0",
        "features": ["Hitesh-style Stream Chat", "Agricultural AI Agents"]
    }

@app.get("/")
def root():
    return {
        "message": "ODOP Connect Stream AI Service is running",
        "endpoints": {
            "health": "/health",
            "docs": "/docs",
            "stream_chat": "/hitesh-stream-chat/"
        }
    }