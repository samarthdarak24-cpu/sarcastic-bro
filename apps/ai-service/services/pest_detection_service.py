"""
Pest Detection Service - Crop pest and disease analysis using image analysis.
ODOP CONNECT - Agri-Tech Platform
"""

import random
import time
from typing import List
from models import (
    PestDetectionResponse,
    DetectedPest,
    PestSeverity,
    UrgencyLevel,
)


class PestDetectionService:
    """Service for detecting pests and diseases in crops."""

    # Mock pest/disease database by crop type
    CROP_PEST_DATABASE = {
        "Tomato": {
            "common_pests": [
                {
                    "name": "Early Blight",
                    "description": "Fungal disease causing leaf spots and defoliation",
                    "treatment": "Apply mancozeb or chlorothalonil fungicide",
                    "organic": "Sulfur-based fungicide or neem oil spray",
                    "prevention": [
                        "Ensure proper plant spacing for air circulation",
                        "Remove infected leaves immediately",
                        "Avoid overhead irrigation",
                        "Mulch to prevent soil splash",
                    ],
                },
                {
                    "name": "Late Blight",
                    "description": "Rapid fungal disease affecting leaves and fruits",
                    "treatment": "Apply metalaxyl or mancozeb fungicide immediately",
                    "organic": "Copper fungicide or Bacillus subtilis",
                    "prevention": [
                        "Improve air circulation",
                        "Avoid water stress",
                        "Remove infected plant parts",
                        "Use resistant varieties",
                    ],
                },
                {
                    "name": "Whitefly",
                    "description": "Insect pest causing yellowing and sticky residue",
                    "treatment": "Use pyrethroids or neem-based insecticide",
                    "organic": "Insecticidal soap or neem oil",
                    "prevention": [
                        "Use yellow sticky traps",
                        "Maintain weed-free field",
                        "Reflective mulch to confuse insects",
                        "Regular monitoring",
                    ],
                },
                {
                    "name": "Fruit Borer",
                    "description": "Larva that tunnels inside fruits causing damage",
                    "treatment": "Apply spinosad or dichlorvos insecticide",
                    "organic": "Bacillus thuringiensis (Bt) spray",
                    "prevention": [
                        "Collect and destroy infected fruits",
                        "Use pheromone traps",
                        "Regular field inspection",
                        "Crop rotation",
                    ],
                },
            ],
            "healthiness_baseline": 75,
        },
        "Wheat": {
            "common_pests": [
                {
                    "name": "Rust (Brown)",
                    "description": "Fungal disease causing brown pustules on leaves",
                    "treatment": "Apply propiconazole or azoxystrobin fungicide",
                    "organic": "Sulfur dust or neem oil",
                    "prevention": [
                        "Use resistant varieties",
                        "Ensure good plant spacing",
                        "Remove infected plants",
                        "Monitor weather for humidity",
                    ],
                },
                {
                    "name": "Powdery Mildew",
                    "description": "White powdery coating on leaves reducing photosynthesis",
                    "treatment": "Apply sulfur or myclobutanil fungicide",
                    "organic": "Sulfur powder or baking soda spray",
                    "prevention": [
                        "Maintain good air circulation",
                        "Avoid over-watering",
                        "Remove infected leaves",
                        "Crop rotation",
                    ],
                },
                {
                    "name": "Armyworm",
                    "description": "Caterpillar that eats leaves and grain",
                    "treatment": "Use lambda-cyhalothrin or spinosad insecticide",
                    "organic": "Bacillus thuringiensis (Bt)",
                    "prevention": [
                        "Early detection through monitoring",
                        "Remove hosts and weeds",
                        "Plow field after harvest",
                        "Use resistant varieties",
                    ],
                },
            ],
            "healthiness_baseline": 80,
        },
        "Mango": {
            "common_pests": [
                {
                    "name": "Anthracnose",
                    "description": "Fungal disease causing black spots on leaves and fruits",
                    "treatment": "Apply copper fungicide or difenconazole",
                    "organic": "Bordeaux mixture or sulfur spray",
                    "prevention": [
                        "Remove infected fruits immediately",
                        "Improve air circulation via pruning",
                        "Avoid overhead irrigation",
                        "Sanitize pruning tools",
                    ],
                },
                {
                    "name": "Powdery Mildew",
                    "description": "White coating on panicles and young fruits",
                    "treatment": "Apply sulfur or wettable sulfur fungicide",
                    "organic": "Sulfur dust or neem oil",
                    "prevention": [
                        "Ensure proper spacing",
                        "Avoid excessive nitrogen",
                        "Monitor weather",
                        "Prune infected parts",
                    ],
                },
                {
                    "name": "Stem Borer",
                    "description": "Insect larvae bore into stem causing wilting",
                    "treatment": "Inject lindane or inject phosphine into borings",
                    "organic": "Manual extraction and sealing borings",
                    "prevention": [
                        "Keep trees healthy",
                        "Remove dead wood",
                        "Wound care with fungicide",
                        "Monitor for exit holes",
                    ],
                },
            ],
            "healthiness_baseline": 78,
        },
        "Rice": {
            "common_pests": [
                {
                    "name": "Brown Spot",
                    "description": "Fungal disease causing brown lesions on leaves",
                    "treatment": "Apply tricyclazole or propiconazole fungicide",
                    "organic": "Neem oil or trichoderma spray",
                    "prevention": [
                        "Use resistant varieties",
                        "Maintain proper drainage",
                        "Avoid excessive nitrogen",
                        "Crop rotation",
                    ],
                },
                {
                    "name": "Blast",
                    "description": "Serious fungal disease affecting leaves and panicles",
                    "treatment": "Apply azoxystrobin or blast-specific fungicide",
                    "organic": "Bacillus subtilis or trichoderma",
                    "prevention": [
                        "Use resistant varieties",
                        "Avoid nitrogen stress",
                        "Maintain water level",
                        "Field sanitation",
                    ],
                },
                {
                    "name": "Leaf Folder",
                    "description": "Caterpillar that folds leaves for shelter",
                    "treatment": "Apply spinosad or pyrethroid insecticide",
                    "organic": "Bacillus thuringiensis (Bt) spray",
                    "prevention": [
                        "Monitor regularly",
                        "Remove affected leaves",
                        "Avoid excess nitrogen",
                        "Conservation of natural enemies",
                    ],
                },
            ],
            "healthiness_baseline": 82,
        },
    }

    # Default pest database for unknown crops
    DEFAULT_CROP_PESTS = {
        "common_pests": [
            {
                "name": "Leaf Spot Disease",
                "description": "Fungal disease causing spots on leaves",
                "treatment": "Apply broad-spectrum fungicide",
                "organic": "Neem oil or sulfur spray",
                "prevention": [
                    "Improve air circulation",
                    "Remove infected leaves",
                    "Avoid overhead watering",
                    "Crop rotation",
                ],
            },
            {
                "name": "Caterpillar",
                "description": "Larvae feeding on leaves and fruits",
                "treatment": "Use insecticide or neem-based treatment",
                "organic": "Bacillus thuringiensis (Bt) spray",
                "prevention": [
                    "Regular monitoring",
                    "Handpick larvae",
                    "Use sticky traps",
                    "Encourage natural predators",
                ],
            },
        ],
        "healthiness_baseline": 75,
    }

    @staticmethod
    def _get_crop_pests(crop_type: str) -> dict:
        """
        Get pest database for crop type.
        
        Args:
            crop_type: Type of crop
            
        Returns:
            Dictionary with common pests for the crop
        """
        return PestDetectionService.CROP_PEST_DATABASE.get(
            crop_type, PestDetectionService.DEFAULT_CROP_PESTS
        )

    @staticmethod
    def _simulate_pest_detection(crop_type: str, disease_suspects: List[str] = None) -> List[dict]:
        """
        Simulate image analysis for pest detection.
        
        Args:
            crop_type: Type of crop
            disease_suspects: List of suspected diseases
            
        Returns:
            List of detected pests with confidence scores
        """
        crop_pests = PestDetectionService._get_crop_pests(crop_type)
        common_pests = crop_pests.get("common_pests", [])

        detected_pests = []

        # 55% chance of detecting pests
        if random.random() < 0.55:
            # Randomly select 1-2 pests to detect
            num_pests = random.randint(1, min(2, len(common_pests)))
            selected_pests = random.sample(common_pests, num_pests)

            for pest in selected_pests:
                # If this pest is suspected, increase confidence
                confidence_base = (
                    random.randint(75, 98)
                    if disease_suspects and pest["name"] in disease_suspects
                    else random.randint(60, 85)
                )

                detected_pests.append(
                    {
                        "name": pest["name"],
                        "confidence": confidence_base,
                        "affected_area": random.uniform(5, 40),
                        "severity": random.choices(
                            [PestSeverity.LOW, PestSeverity.MEDIUM, PestSeverity.HIGH],
                            weights=[35, 45, 20],
                            k=1,
                        )[0],
                        "description": pest["description"],
                        "treatment": pest["treatment"],
                        "organic_treatment": pest.get("organic"),
                        "prevention_tips": pest["prevention"],
                    }
                )

        return detected_pests

    @staticmethod
    def _calculate_crop_health(detected_pests: List[dict], baseline_health: int) -> int:
        """
        Calculate overall crop health based on detected pests.
        
        Args:
            detected_pests: List of detected pests
            baseline_health: Baseline health score
            
        Returns:
            Overall crop health score 0-100
        """
        if not detected_pests:
            # No pests detected - high health
            return min(100, baseline_health + random.randint(-5, 10))

        # Calculate health reduction based on detected pests
        health = baseline_health

        for pest in detected_pests:
            # Severity penalty
            severity_penalties = {
                PestSeverity.LOW: -5,
                PestSeverity.MEDIUM: -15,
                PestSeverity.HIGH: -25,
                PestSeverity.CRITICAL: -40,
            }
            health += severity_penalties.get(pest["severity"], -10)

            # Affected area penalty
            health -= int(pest["affected_area"] / 10)

        return max(10, min(100, health))

    @staticmethod
    def _determine_urgency(detected_pests: List[dict]) -> UrgencyLevel:
        """
        Determine urgency level based on detected pests.
        
        Args:
            detected_pests: List of detected pests
            
        Returns:
            Urgency level
        """
        if not detected_pests:
            return UrgencyLevel.NONE

        # Check for critical or high severity pests
        for pest in detected_pests:
            if pest["severity"] == PestSeverity.CRITICAL:
                return UrgencyLevel.HIGH
            if pest["severity"] == PestSeverity.HIGH:
                return UrgencyLevel.MEDIUM

        # Multiple pests detected
        if len(detected_pests) > 2:
            return UrgencyLevel.MEDIUM

        return UrgencyLevel.LOW

    @staticmethod
    async def detect_pests(
        image_url: str,
        crop_type: str,
        disease_suspects: List[str] = None,
    ) -> PestDetectionResponse:
        """
        Detect pests and diseases in crop image.
        
        Args:
            image_url: Base64 encoded image or URL
            crop_type: Type of crop
            disease_suspects: List of suspected diseases
            
        Returns:
            PestDetectionResponse with detected pests
        """
        start_time = time.time()

        # Simulate pest detection
        detected_pests_data = PestDetectionService._simulate_pest_detection(
            crop_type, disease_suspects
        )

        # Build DetectedPest models
        detected_pests = []
        for pest_data in detected_pests_data:
            detected_pests.append(
                DetectedPest(
                    name=pest_data["name"],
                    severity=pest_data["severity"],
                    affected_area_percent=round(pest_data["affected_area"], 1),
                    confidence=pest_data["confidence"],
                    description=pest_data["description"],
                    treatment=pest_data["treatment"],
                    organic_treatment=pest_data["organic_treatment"],
                    prevention_tips=pest_data["prevention_tips"],
                )
            )

        # Get crop health baseline
        crop_info = PestDetectionService._get_crop_pests(crop_type)
        baseline_health = crop_info.get("healthiness_baseline", 75)

        # Calculate crop health
        crop_health = PestDetectionService._calculate_crop_health(detected_pests_data, baseline_health)

        # Determine urgency
        urgency = PestDetectionService._determine_urgency(detected_pests_data)

        # Generate recommendations
        recommendations = []

        if detected_pests:
            recommendations.append("Immediate action required - pests/diseases detected")
            
            # Add severity-based recommendations
            high_severity = [p for p in detected_pests if p.severity in [PestSeverity.HIGH, PestSeverity.CRITICAL]]
            if high_severity:
                recommendations.append(f"High-risk pests found: {', '.join([p.name for p in high_severity])}")
                recommendations.append("Consult agricultural expert for treatment plan")

            if urgency in [UrgencyLevel.MEDIUM, UrgencyLevel.HIGH]:
                recommendations.append("Start treatment within 24 hours")
        else:
            recommendations.append("No pests detected - crop appears healthy")
            recommendations.append("Continue regular monitoring")

        # Add general recommendations
        recommendations.append("Maintain hygiene and pest monitoring practices")
        recommendations.append("Consider preventive spray schedule")

        # Simulate processing time
        processing_time_ms = int((time.time() - start_time) * 1000 + random.randint(200, 500))

        return PestDetectionResponse(
            pest_detected=len(detected_pests) > 0,
            pests=detected_pests,
            overall_crop_health=crop_health,
            recommendations=recommendations[:5],
            urgency_level=urgency,
        )
