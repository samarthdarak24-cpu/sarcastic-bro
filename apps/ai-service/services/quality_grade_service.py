"""
Quality Grade Service - Product quality analysis using mock ML model.
ODOP CONNECT - Agri-Tech Platform
"""

import random
import time
from typing import Tuple
from models import QualityGradeResponse, QualityGrade, ColorQuality, ProductType


class QualityGradeService:
    """Service for analyzing product quality and assigning grades."""

    # Mock data for product characteristics
    PRODUCT_CHARACTERISTICS = {
        ProductType.VEGETABLE: {
            "color_quality_weights": {"EXCELLENT": 2, "GOOD": 3, "FAIR": 4, "POOR": 1},
            "avg_defects": 1.5,
            "avg_damage": 3.5,
        },
        ProductType.FRUIT: {
            "color_quality_weights": {"EXCELLENT": 3, "GOOD": 2, "FAIR": 3, "POOR": 2},
            "avg_defects": 0.8,
            "avg_damage": 2.5,
        },
        ProductType.GRAIN: {
            "color_quality_weights": {"EXCELLENT": 1, "GOOD": 2, "FAIR": 3, "POOR": 4},
            "avg_defects": 2,
            "avg_damage": 1.5,
        },
        ProductType.PULSES: {
            "color_quality_weights": {"EXCELLENT": 2, "GOOD": 3, "FAIR": 3, "POOR": 2},
            "avg_defects": 1.2,
            "avg_damage": 2.0,
        },
    }

    QUALITY_GRADE_THRESHOLDS = {
        QualityGrade.A: (85, 100),
        QualityGrade.B: (70, 84),
        QualityGrade.C: (55, 69),
        QualityGrade.D: (0, 54),
    }

    @staticmethod
    def _simulate_image_analysis(product_type: ProductType) -> dict:
        """
        Simulate image analysis to extract quality metrics.
        
        Args:
            product_type: Type of product being analyzed
            
        Returns:
            Dictionary with simulated quality metrics
        """
        characteristics = QualityGradeService.PRODUCT_CHARACTERISTICS[product_type]

        # Simulate color quality detection
        color_weights = characteristics["color_quality_weights"]
        color_choice = random.choices(
            list(color_weights.keys()),
            weights=list(color_weights.values()),
            k=1,
        )[0]

        # Simulate defect detection (0-3 defects typically)
        defects = max(0, int(random.gauss(characteristics["avg_defects"], 0.8)))

        # Simulate damage percentage (0-10% typically)
        damaged_percent = max(0, min(100, random.gauss(characteristics["avg_damage"], 2)))

        # Size uniformity (related to product type)
        if product_type == ProductType.GRAIN:
            size_uniformity = random.randint(75, 98)
        elif product_type == ProductType.PULSES:
            size_uniformity = random.randint(80, 96)
        else:
            size_uniformity = random.randint(70, 95)

        # Freshness score (inverse correlation with damage and defects)
        freshness_base = 100 - (defects * 8) - (damaged_percent * 0.5)
        freshness_score = max(20, min(100, int(freshness_base + random.gauss(0, 5))))

        return {
            "color_quality": color_choice,
            "defects": defects,
            "damaged_percent": round(damaged_percent, 2),
            "size_uniformity": size_uniformity,
            "freshness_score": freshness_score,
        }

    @staticmethod
    def _calculate_quality_score(
        color_quality: ColorQuality,
        size_uniformity: int,
        freshness_score: int,
        defects: int,
        damaged_percent: float,
    ) -> int:
        """
        Calculate overall quality score based on multiple factors.
        
        Args:
            color_quality: Color quality level
            size_uniformity: Size uniformity percentage
            freshness_score: Freshness score 0-100
            defects: Number of defects
            damaged_percent: Percentage of damaged area
            
        Returns:
            Overall quality score 0-100
        """
        # Color quality contribution (0-25 points)
        color_scores = {"EXCELLENT": 25, "GOOD": 20, "FAIR": 12, "POOR": 5}
        color_score = color_scores.get(color_quality, 15)

        # Size uniformity contribution (0-25 points)
        size_score = int(size_uniformity * 0.25)

        # Freshness contribution (0-25 points)
        freshness_contribution = int(freshness_score * 0.25)

        # Defect reduction (0-25 points)
        defect_score = max(0, 25 - (defects * 4))

        # Damage penalty
        damage_penalty = damaged_percent * 0.2

        total_score = (
            color_score + size_score + freshness_contribution + defect_score - damage_penalty
        )
        return max(0, min(100, int(total_score)))

    @staticmethod
    def _assign_grade(score: int) -> QualityGrade:
        """
        Assign quality grade based on score.
        
        Args:
            score: Quality score 0-100
            
        Returns:
            Quality grade A, B, C, or D
        """
        for grade, (min_score, max_score) in QualityGradeService.QUALITY_GRADE_THRESHOLDS.items(
            ):
            if min_score <= score <= max_score:
                return grade
        return QualityGrade.D

    @staticmethod
    def _generate_recommendations(
        grade: QualityGrade,
        damaged_percent: float,
        freshness_score: int,
        defects: int,
        color_quality: ColorQuality,
    ) -> list:
        """
        Generate actionable recommendations based on quality analysis.
        
        Args:
            grade: Quality grade
            damaged_percent: Percentage of damage
            freshness_score: Freshness score
            defects: Number of defects
            color_quality: Color quality level
            
        Returns:
            List of recommendations
        """
        recommendations = []

        if grade in [QualityGrade.C, QualityGrade.D]:
            recommendations.append("Consider lower market channel for this batch")
            recommendations.append("Review harvesting and handling procedures")

        if damaged_percent > 5:
            recommendations.append("Improve packaging to reduce damage during transport")
            recommendations.append("Reduce stacking height to minimize pressure damage")

        if freshness_score < 70:
            recommendations.append("Expedite market sale within 24-48 hours")
            recommendations.append("Store in temperature-controlled environment")

        if defects > 2:
            recommendations.append("Increase quality control before dispatch")
            recommendations.append("Review post-harvest defect grading process")

        if color_quality == ColorQuality.POOR:
            recommendations.append("Investigate storage conditions or ripening process")

        recommendations.append("Store in cool environment (10-15°C if applicable)")
        recommendations.append("Rotate stock - FIFO (First In First Out)")

        return recommendations[:5]  # Return top 5 recommendations

    @staticmethod
    async def analyze_quality(
        image_url: str, product_type: ProductType, product_name: str
    ) -> QualityGradeResponse:
        """
        Analyze product quality from image and return grade with metrics.
        
        Args:
            image_url: Base64 or URL of product image
            product_type: Type of product
            product_name: Name of product
            
        Returns:
            QualityGradeResponse with complete analysis
        """
        start_time = time.time()

        # Simulate image analysis
        metrics = QualityGradeService._simulate_image_analysis(product_type)

        # Calculate quality score
        quality_score = QualityGradeService._calculate_quality_score(
            color_quality=metrics["color_quality"],
            size_uniformity=metrics["size_uniformity"],
            freshness_score=metrics["freshness_score"],
            defects=metrics["defects"],
            damaged_percent=metrics["damaged_percent"],
        )

        # Assign grade
        grade = QualityGradeService._assign_grade(quality_score)

        # Generate recommendations
        recommendations = QualityGradeService._generate_recommendations(
            grade=grade,
            damaged_percent=metrics["damaged_percent"],
            freshness_score=metrics["freshness_score"],
            defects=metrics["defects"],
            color_quality=metrics["color_quality"],
        )

        # Calculate confidence (ML model confidence)
        confidence = random.randint(85, 98)

        # Process time simulation
        processing_time_ms = int((time.time() - start_time) * 1000 + random.randint(100, 300))

        return QualityGradeResponse(
            grade=grade,
            score=quality_score,
            defects=metrics["defects"],
            color_quality=metrics["color_quality"],
            size_uniformity=metrics["size_uniformity"],
            freshness_score=metrics["freshness_score"],
            damaged_percent=metrics["damaged_percent"],
            recommendations=recommendations,
            confidence=confidence,
            processing_time_ms=processing_time_ms,
        )
