import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.core_router import router as core_router
from app.routers.advanced_router import router as advanced_router

allowed_origins = [
    origin.strip()
    for origin in os.getenv("AI_CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]

app = FastAPI(
    title="ODOP Connect AI Service",
    description=(
        "AI-powered quality grading, recommendation engine, demand forecasting, "
        "pest detection, yield prediction, dynamic pricing, and crop rotation advisor."
    ),
    version="2.0.0",
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

app.include_router(core_router)
app.include_router(advanced_router)


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
        },
    }


@app.get("/")
def root():
    return {"message": "ODOP Connect AI Service is running. Visit /docs for API documentation."}
