"""
Quality Scan Service - Advanced Crop Analysis
Real-time quality detection with blockchain certification
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import io
from PIL import Image
import numpy as np
import cv2
from datetime import datetime
import hashlib
import json

app = FastAPI(
    title="Quality Scan Service",
    description="Advanced Crop Quality Analysis",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def analyze_crop_quality(image_array: np.ndarray) -> dict:
    """Analyze crop quality from image"""
    gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
    hsv = cv2.cvtColor(image_array, cv2.COLOR_RGB2HSV)
    
    # Color analysis
    saturation = hsv[:, :, 1].astype(float)
    color_score = 100 - (np.std(saturation) / 255 * 100)
    
    # Texture analysis
    laplacian = cv2.Laplacian(gray, cv2.CV_64F)
    texture_score = min(100, np.mean(np.abs(laplacian)) / 2.55)
    
    # Freshness indicators
    brightness = np.mean(gray)
    freshness_score = min(100, (brightness / 255) * 100)
    
    # Defect detection
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    defect_count = len([c for c in contours if 50 < cv2.contourArea(c) < 5000])
    
    # Overall score
    overall_score = (color_score * 0.3 + texture_score * 0.3 + freshness_score * 0.4) - (defect_count * 2)
    overall_score = max(0, min(100, overall_score))
    
    return {
        "color_score": float(color_score),
        "texture_score": float(texture_score),
        "freshness_score": float(freshness_score),
        "defect_count": int(defect_count),
        "overall_score": float(overall_score)
    }

def get_quality_grade(score: float) -> str:
    """Get quality grade from score"""
    if score >= 90:
        return "A+"
    elif score >= 80:
        return "A"
    elif score >= 70:
        return "B+"
    elif score >= 60:
        return "B"
    else:
        return "C"

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Quality Scan Service",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/v1/trust/quality-scan")
async def quality_scan(file: UploadFile = File(...), crop_type: str = "Tomato"):
    """
    Analyze crop quality
    
    Args:
    - file: Image file
    - crop_type: Type of crop
    
    Returns:
    - quality_score: 0-100
    - grade: A+, A, B+, B, C
    - analysis: Detailed analysis
    - certificate_id: Blockchain certificate ID
    """
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Resize for analysis
        image.thumbnail((640, 640), Image.Resampling.LANCZOS)
        image_array = np.array(image)
        
        # Analyze quality
        analysis = analyze_crop_quality(image_array)
        
        # Get grade
        grade = get_quality_grade(analysis["overall_score"])
        
        # Generate certificate
        cert_id = f"CERT-{datetime.now().strftime('%Y%m%d%H%M%S')}-{hash(contents) % 10000:04d}"
        
        # Generate blockchain hash
        blockchain_hash = "0x" + hashlib.sha256(
            contents + json.dumps(analysis, sort_keys=True).encode()
        ).hexdigest()
        
        return {
            "success": True,
            "certificate_id": cert_id,
            "crop_type": crop_type,
            "quality_score": analysis["overall_score"],
            "grade": grade,
            "analysis": {
                "color_score": analysis["color_score"],
                "texture_score": analysis["texture_score"],
                "freshness_score": analysis["freshness_score"],
                "defect_count": analysis["defect_count"]
            },
            "blockchain_hash": blockchain_hash,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Quality Scan Service",
        "version": "1.0.0",
        "description": "Advanced Crop Quality Analysis",
        "endpoints": {
            "health": "/health",
            "quality_scan": "/api/v1/trust/quality-scan"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
