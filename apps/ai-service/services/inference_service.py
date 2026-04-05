import logging
from PIL import Image
from typing import Dict, List, Any, Optional

logger = logging.getLogger(__name__)

class InferenceService:
    """
    Mock Inference Service for hackathon demo without heavy dependencies.
    """
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(InferenceService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        logger.info("🚀 Initializing MOCK Inference Engine")
        self._initialized = True

    async def predict_quality(self, image: Image.Image) -> Dict[str, Any]:
        """
        Mock quality prediction.
        """
        # Always return 'A' grade for the demo
        results = {
            "grade": "A",
            "confidence": 0.985,
            "disease": "None (Healthy)",
            "bboxes": [
                {"x": 120, "y": 150, "w": 40, "h": 40, "label": "Surface Perfect", "confidence": 0.99},
                {"x": 300, "y": 280, "w": 35, "h": 35, "label": "Color Uniformity", "confidence": 0.97}
            ],
            "analysis_notes": "Premium quality detected. Surface texture and color are within elite parameters."
        }
        return results

# Shared singleton instance
inference_engine = InferenceService()
