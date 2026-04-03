# ========================================================================
#  Quality Grading Service — Mock ML inference for product quality
# ========================================================================

import random
import numpy as np
from typing import List
from app.schemas import QualityGrade, QualityGradingResponse


def _generate_heatmap(width: int = 8, height: int = 8) -> List[List[float]]:
    """Generate a mock attention heatmap matrix (0.0 - 1.0 values)."""
    # Simulate a gaussian-like hotspot in the center
    cx, cy = width // 2, height // 2
    matrix = []
    for y in range(height):
        row = []
        for x in range(width):
            dist = ((x - cx) ** 2 + (y - cy) ** 2) ** 0.5
            max_dist = ((width / 2) ** 2 + (height / 2) ** 2) ** 0.5
            val = max(0.0, 1.0 - (dist / max_dist)) + random.uniform(-0.1, 0.15)
            row.append(round(min(1.0, max(0.0, val)), 3))
        matrix.append(row)
    return matrix


def grade_product_quality(image_bytes: bytes, filename: str) -> QualityGradingResponse:
    """
    Mock quality grading using simulated image analysis.
    In production, this would call a trained CNN model (ResNet/EfficientNet).
    """
    # Simulate model inference
    random.seed(hash(filename) % 2**32)
    confidence = round(random.uniform(0.72, 0.98), 3)

    # Grade based on simulated confidence thresholds
    if confidence >= 0.90:
        grade = QualityGrade.A
        notes = (
            f"Product '{filename}' shows excellent visual characteristics. "
            "Surface texture is uniform with no visible defects. "
            "Color saturation within premium range. Recommended for Grade A listing."
        )
    elif confidence >= 0.80:
        grade = QualityGrade.B
        notes = (
            f"Product '{filename}' shows good quality with minor surface variations. "
            "Color consistency is acceptable. Minor texture irregularities detected. "
            "Suitable for standard commercial use."
        )
    else:
        grade = QualityGrade.C
        notes = (
            f"Product '{filename}' shows noticeable quality variations. "
            "Surface defects or color inconsistencies detected. "
            "Recommended for bulk/industrial grade processing."
        )

    heatmap = _generate_heatmap(8, 8)

    return QualityGradingResponse(
        grade=grade,
        confidence=confidence,
        heatmap_data=heatmap,
        analysis_notes=notes,
    )
