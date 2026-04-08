"""
AI Quality Shield Scanner
Technologies: YOLOv8 + EfficientNet + Transfer Learning + OpenCV
Based on proven GitHub implementations:
- Ultralytics YOLOv8: https://github.com/ultralytics/ultralytics
- PyTorch EfficientNet: https://github.com/pytorch/vision
- OpenCV: https://github.com/opencv/opencv-python
"""

import cv2
import numpy as np
import torch
import torch.nn as nn
from torchvision import models, transforms
from ultralytics import YOLO
from typing import Dict, List, Tuple, Optional
import logging
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

logger = logging.getLogger(__name__)


class EfficientNetQualityClassifier(nn.Module):
    """EfficientNet-based quality classifier with transfer learning"""
    
    def __init__(self, num_classes: int = 5, pretrained: bool = True):
        super().__init__()
        # Load pretrained EfficientNet-B3
        self.backbone = models.efficientnet_b3(pretrained=pretrained)
        
        # Freeze early layers for transfer learning
        for param in list(self.backbone.parameters())[:-20]:
            param.requires_grad = False
        
        # Replace classifier head
        num_features = self.backbone.classifier[1].in_features
        self.backbone.classifier = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(512, num_classes)
        )
    
    def forward(self, x):
        return self.backbone(x)


class QualityShieldScanner:
    """Complete AI Quality Shield Scanner System"""
    
    def __init__(self, model_dir: str = "models"):
        self.model_dir = Path(model_dir)
        self.model_dir.mkdir(exist_ok=True)
        
        # Initialize YOLOv8 for object detection
        self.yolo_model = self._load_yolo_model()
        
        # Initialize EfficientNet for quality classification
        self.quality_classifier = self._load_quality_classifier()
        
        # Image preprocessing pipeline
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((300, 300)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        
        # Quality grades
        self.quality_grades = {
            0: "Premium",
            1: "Grade A",
            2: "Grade B",
            3: "Grade C",
            4: "Rejected"
        }
        
        # Defect types
        self.defect_types = [
            "spots", "bruises", "discoloration", 
            "deformation", "pest_damage", "rot"
        ]
    
    def _load_yolo_model(self) -> YOLO:
        """Load YOLOv8 model for crop detection"""
        try:
            model_path = self.model_dir / "yolov8n.pt"
            if not model_path.exists():
                logger.info("Downloading YOLOv8 model...")
                model = YOLO("yolov8n.pt")
                model.save(str(model_path))
            else:
                model = YOLO(str(model_path))
            
            logger.info("YOLOv8 model loaded successfully")
            return model
        except Exception as e:
            logger.error(f"Error loading YOLOv8: {e}")
            return YOLO("yolov8n.pt")
    
    def _load_quality_classifier(self) -> EfficientNetQualityClassifier:
        """Load EfficientNet quality classifier"""
        try:
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            model = EfficientNetQualityClassifier(num_classes=5, pretrained=True)
            
            # Load fine-tuned weights if available
            weights_path = self.model_dir / "quality_classifier.pth"
            if weights_path.exists():
                model.load_state_dict(torch.load(weights_path, map_location=device))
                logger.info("Loaded fine-tuned quality classifier")
            else:
                logger.info("Using pretrained EfficientNet (not fine-tuned)")
            
            model.to(device)
            model.eval()
            return model
        except Exception as e:
            logger.error(f"Error loading quality classifier: {e}")
            raise
    
    def preprocess_image(self, image: np.ndarray) -> np.ndarray:
        """Advanced image preprocessing with OpenCV"""
        # Convert to RGB if needed
        if len(image.shape) == 2:
            image = cv2.cvtColor(image, cv2.COLOR_GRAY2RGB)
        elif image.shape[2] == 4:
            image = cv2.cvtColor(image, cv2.COLOR_BGRA2RGB)
        
        # Denoise
        denoised = cv2.fastNlMeansDenoisingColored(image, None, 10, 10, 7, 21)
        
        # Enhance contrast using CLAHE
        lab = cv2.cvtColor(denoised, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8, 8))
        l = clahe.apply(l)
        enhanced = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2RGB)
        
        # Sharpen
        kernel = np.array([[-1, -1, -1],
                          [-1,  9, -1],
                          [-1, -1, -1]])
        sharpened = cv2.filter2D(enhanced, -1, kernel)
        
        return sharpened
    
    def detect_crops(self, image: np.ndarray) -> List[Dict]:
        """Detect crops using YOLOv8"""
        results = self.yolo_model(image, conf=0.25)
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                conf = float(box.conf[0])
                cls = int(box.cls[0])
                
                detections.append({
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "confidence": conf,
                    "class": cls
                })
        
        return detections
    
    def extract_features(self, image: np.ndarray) -> Dict:
        """Extract visual features using OpenCV"""
        # Color analysis
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        color_hist = cv2.calcHist([hsv], [0, 1], None, [50, 60], [0, 180, 0, 256])
        color_uniformity = float(np.std(color_hist))
        
        # Texture analysis using Gabor filters
        gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        texture_features = []
        for theta in range(4):
            kernel = cv2.getGaborKernel((21, 21), 5, theta * np.pi / 4, 10, 0.5, 0)
            filtered = cv2.filter2D(gray, cv2.CV_32F, kernel)
            texture_features.append(float(np.mean(filtered)))
        
        # Shape analysis
        edges = cv2.Canny(gray, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        shape_regularity = 0.0
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            area = cv2.contourArea(largest_contour)
            perimeter = cv2.arcLength(largest_contour, True)
            if perimeter > 0:
                shape_regularity = float(4 * np.pi * area / (perimeter ** 2))
        
        # Defect detection
        defects = self._detect_defects(image, gray)
        
        return {
            "color_uniformity": float(color_uniformity),
            "texture_score": float(np.mean(texture_features)),
            "shape_regularity": float(shape_regularity),
            "defects": {k: int(v) for k, v in defects.items()}
        }
    
    def _detect_defects(self, image: np.ndarray, gray: np.ndarray) -> Dict:
        """Detect various defects"""
        defects = {defect: 0 for defect in self.defect_types}
        
        # Spot detection (dark spots)
        _, thresh = cv2.threshold(gray, 100, 255, cv2.THRESH_BINARY_INV)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        defects["spots"] = int(len([c for c in contours if cv2.contourArea(c) > 50]))
        
        # Discoloration detection
        hsv = cv2.cvtColor(image, cv2.COLOR_RGB2HSV)
        color_std = float(np.std(hsv[:, :, 1]))
        defects["discoloration"] = 1 if color_std > 50 else 0
        
        # Edge irregularity (deformation)
        edges = cv2.Canny(gray, 50, 150)
        edge_density = float(np.sum(edges > 0) / edges.size)
        defects["deformation"] = 1 if edge_density > 0.15 else 0
        
        return defects
    
    def classify_quality(self, image: np.ndarray) -> Tuple[int, float, np.ndarray]:
        """Classify quality using EfficientNet"""
        device = next(self.quality_classifier.parameters()).device
        
        # Preprocess
        img_tensor = self.transform(image).unsqueeze(0).to(device)
        
        # Inference
        with torch.no_grad():
            outputs = self.quality_classifier(img_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            confidence, predicted = torch.max(probabilities, 1)
        
        return (
            int(predicted.item()),
            float(confidence.item()),
            probabilities.cpu().numpy()[0].astype(float)
        )
    
    def calculate_quality_score(
        self,
        features: Dict,
        class_probs: np.ndarray
    ) -> float:
        """Calculate comprehensive quality score (0-100)"""
        # Base score from classification
        base_score = (
            class_probs[0] * 100 +  # Premium
            class_probs[1] * 85 +   # Grade A
            class_probs[2] * 70 +   # Grade B
            class_probs[3] * 50 +   # Grade C
            class_probs[4] * 20     # Rejected
        )
        
        # Feature-based adjustments
        color_penalty = min(features["color_uniformity"] / 100, 10)
        shape_bonus = features["shape_regularity"] * 5
        defect_penalty = sum(features["defects"].values()) * 3
        
        final_score = base_score + shape_bonus - color_penalty - defect_penalty
        return max(0, min(100, final_score))
    
    def scan(
        self,
        image_path: str,
        return_visualization: bool = False
    ) -> Dict:
        """Complete quality scan pipeline"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image: {image_path}")
            
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            original_image = image.copy()
            
            # Preprocess
            processed_image = self.preprocess_image(image)
            
            # Detect crops
            detections = self.detect_crops(processed_image)
            
            results = []
            visualization = original_image.copy() if return_visualization else None
            
            # Process each detection
            for idx, detection in enumerate(detections):
                x1, y1, x2, y2 = detection["bbox"]
                crop_region = processed_image[y1:y2, x1:x2]
                
                if crop_region.size == 0:
                    continue
                
                # Extract features
                features = self.extract_features(crop_region)
                
                # Classify quality
                quality_class, confidence, class_probs = self.classify_quality(crop_region)
                
                # Calculate score
                quality_score = self.calculate_quality_score(features, class_probs)
                
                result = {
                    "detection_id": idx,
                    "bbox": detection["bbox"],
                    "detection_confidence": detection["confidence"],
                    "quality_grade": self.quality_grades[quality_class],
                    "quality_class": quality_class,
                    "classification_confidence": confidence,
                    "quality_score": round(quality_score, 2),
                    "features": features,
                    "class_probabilities": {
                        self.quality_grades[i]: round(float(p), 3)
                        for i, p in enumerate(class_probs)
                    }
                }
                
                results.append(result)
                
                # Draw visualization
                if return_visualization:
                    color = self._get_grade_color(quality_class)
                    cv2.rectangle(visualization, (x1, y1), (x2, y2), color, 2)
                    
                    label = f"{self.quality_grades[quality_class]} ({quality_score:.1f})"
                    cv2.putText(
                        visualization, label, (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2
                    )
            
            # Overall assessment
            if results:
                avg_score = np.mean([r["quality_score"] for r in results])
                overall_grade = self._score_to_grade(avg_score)
            else:
                avg_score = 0
                overall_grade = "No crops detected"
            
            response = {
                "success": True,
                "overall_quality_score": round(avg_score, 2),
                "overall_grade": overall_grade,
                "total_detections": len(results),
                "detections": results,
                "technology_stack": {
                    "detection": "YOLOv8",
                    "classification": "EfficientNet-B3",
                    "preprocessing": "OpenCV",
                    "transfer_learning": "Enabled"
                }
            }
            
            if return_visualization:
                response["visualization"] = visualization
            
            return response
            
        except Exception as e:
            logger.error(f"Error in quality scan: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _get_grade_color(self, quality_class: int) -> Tuple[int, int, int]:
        """Get color for quality grade"""
        colors = {
            0: (0, 255, 0),      # Premium - Green
            1: (144, 238, 144),  # Grade A - Light Green
            2: (255, 255, 0),    # Grade B - Yellow
            3: (255, 165, 0),    # Grade C - Orange
            4: (255, 0, 0)       # Rejected - Red
        }
        return colors.get(quality_class, (128, 128, 128))
    
    def _score_to_grade(self, score: float) -> str:
        """Convert score to grade"""
        if score >= 90:
            return "Premium"
        elif score >= 75:
            return "Grade A"
        elif score >= 60:
            return "Grade B"
        elif score >= 40:
            return "Grade C"
        else:
            return "Rejected"
    
    def batch_scan(
        self,
        image_paths: List[str],
        save_visualizations: bool = False,
        output_dir: str = "output"
    ) -> List[Dict]:
        """Batch process multiple images"""
        results = []
        
        if save_visualizations:
            output_path = Path(output_dir)
            output_path.mkdir(exist_ok=True)
        
        for image_path in image_paths:
            result = self.scan(image_path, return_visualization=save_visualizations)
            results.append(result)
            
            if save_visualizations and result.get("visualization") is not None:
                vis_path = output_path / f"scan_{Path(image_path).stem}.jpg"
                cv2.imwrite(
                    str(vis_path),
                    cv2.cvtColor(result["visualization"], cv2.COLOR_RGB2BGR)
                )
        
        return results


# Singleton instance
_scanner_instance: Optional[QualityShieldScanner] = None


def get_scanner() -> QualityShieldScanner:
    """Get or create scanner instance"""
    global _scanner_instance
    if _scanner_instance is None:
        _scanner_instance = QualityShieldScanner()
    return _scanner_instance
