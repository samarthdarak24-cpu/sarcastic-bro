"""
Quality Shield Scanner API Router
FastAPI endpoints for AI quality scanning
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import List, Optional
import cv2
import numpy as np
from pathlib import Path
import tempfile
import logging
import base64

from ml_models.quality_shield_scanner import get_scanner

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/quality-shield", tags=["Quality Shield"])


class ScanResponse(BaseModel):
    success: bool
    overall_quality_score: float
    overall_grade: str
    total_detections: int
    detections: List[dict]
    technology_stack: dict
    error: Optional[str] = None


class BatchScanRequest(BaseModel):
    image_urls: List[str]
    save_visualizations: bool = False


@router.post("/scan", response_model=ScanResponse)
async def scan_quality(
    file: UploadFile = File(...),
    return_visualization: bool = False
):
    """
    Scan crop quality using AI Quality Shield
    
    Technologies:
    - YOLOv8: Object detection
    - EfficientNet-B3: Quality classification
    - Transfer Learning: Fine-tuned models
    - OpenCV: Advanced image processing
    """
    temp_path = None
    
    try:
        # Validate file
        if not file.content_type.startswith("image/"):
            raise HTTPException(400, "File must be an image")
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Get scanner instance
        scanner = get_scanner()
        
        # Perform scan
        result = scanner.scan(temp_path, return_visualization=return_visualization)
        
        # Encode visualization if requested
        if return_visualization and result.get("visualization") is not None:
            vis_image = result["visualization"]
            _, buffer = cv2.imencode('.jpg', cv2.cvtColor(vis_image, cv2.COLOR_RGB2BGR))
            result["visualization_base64"] = base64.b64encode(buffer).decode('utf-8')
            del result["visualization"]
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error in quality scan: {e}")
        raise HTTPException(500, f"Scan failed: {str(e)}")
    
    finally:
        # Cleanup
        if temp_path and Path(temp_path).exists():
            Path(temp_path).unlink()


@router.post("/scan-batch")
async def scan_batch(
    files: List[UploadFile] = File(...),
    save_visualizations: bool = False
):
    """Batch scan multiple images"""
    temp_paths = []
    
    try:
        # Save all files
        for file in files:
            if not file.content_type.startswith("image/"):
                continue
            
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                content = await file.read()
                temp_file.write(content)
                temp_paths.append(temp_file.name)
        
        if not temp_paths:
            raise HTTPException(400, "No valid images provided")
        
        # Get scanner
        scanner = get_scanner()
        
        # Batch scan
        results = scanner.batch_scan(
            temp_paths,
            save_visualizations=save_visualizations
        )
        
        return JSONResponse(content={
            "success": True,
            "total_scanned": len(results),
            "results": results
        })
        
    except Exception as e:
        logger.error(f"Error in batch scan: {e}")
        raise HTTPException(500, f"Batch scan failed: {str(e)}")
    
    finally:
        # Cleanup
        for path in temp_paths:
            if Path(path).exists():
                Path(path).unlink()


@router.post("/analyze-defects")
async def analyze_defects(file: UploadFile = File(...)):
    """Detailed defect analysis"""
    temp_path = None
    
    try:
        # Save file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Load and process
        image = cv2.imread(temp_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        scanner = get_scanner()
        processed = scanner.preprocess_image(image)
        features = scanner.extract_features(processed)
        
        return JSONResponse(content={
            "success": True,
            "defect_analysis": features["defects"],
            "color_uniformity": features["color_uniformity"],
            "texture_score": features["texture_score"],
            "shape_regularity": features["shape_regularity"]
        })
        
    except Exception as e:
        logger.error(f"Error in defect analysis: {e}")
        raise HTTPException(500, f"Analysis failed: {str(e)}")
    
    finally:
        if temp_path and Path(temp_path).exists():
            Path(temp_path).unlink()


@router.get("/health")
async def health_check():
    """Check if scanner is ready"""
    try:
        scanner = get_scanner()
        return {
            "status": "healthy",
            "yolo_loaded": scanner.yolo_model is not None,
            "classifier_loaded": scanner.quality_classifier is not None,
            "device": str(next(scanner.quality_classifier.parameters()).device)
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


@router.get("/grades")
async def get_quality_grades():
    """Get available quality grades"""
    scanner = get_scanner()
    return {
        "grades": scanner.quality_grades,
        "defect_types": scanner.defect_types
    }
