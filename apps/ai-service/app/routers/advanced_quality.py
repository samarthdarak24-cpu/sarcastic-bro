"""
Advanced Quality Detection API with Real ML Models
Production-grade endpoints for crop quality analysis
"""

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import sys
import os
from datetime import datetime
import numpy as np

# Add ml_models to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

from ml_models.quality_classifier import get_quality_classifier

router = APIRouter(prefix="/ai/quality", tags=["Quality Analysis"])


class QualityAnalysisRequest(BaseModel):
    """Request model for quality analysis"""
    product_name: str = Field(..., description="Name of the product")
    product_type: str = Field(..., description="Type: GRAIN, FRUIT, VEGETABLE, SPICE")
    harvest_date: Optional[str] = Field(None, description="ISO format date")
    storage_temperature: Optional[float] = Field(25.0, ge=-10, le=50)
    storage_humidity: Optional[float] = Field(60.0, ge=0, le=100)
    handling_score: Optional[float] = Field(80.0, ge=0, le=100)
    is_organic: Optional[bool] = False
    pesticide_ppm: Optional[float] = Field(0.0, ge=0)
    weight_kg: Optional[float] = Field(None, ge=0)
    district: Optional[str] = None
    state: Optional[str] = None


class BatchQualityRequest(BaseModel):
    """Batch quality analysis request"""
    products: List[QualityAnalysisRequest]


class QualityResponse(BaseModel):
    """Quality analysis response"""
    grade: str
    quality_score: float
    confidence: float
    visual_analysis: Dict
    freshness: Dict
    defects: List[Dict]
    recommendations: List[str]
    certification: Dict
    pricing_impact: Dict
    timestamp: str


@router.post("/analyze", response_model=QualityResponse)
async def analyze_quality(request: QualityAnalysisRequest):
    """
    Analyze crop quality using advanced ML models
    
    Returns:
    - Quality grade (A+, A, B+, B, C)
    - Detailed quality score
    - Visual analysis metrics
    - Freshness assessment
    - Defect detection
    - Pricing recommendations
    """
    try:
        classifier = get_quality_classifier()
        
        # Prepare metadata
        metadata = {
            'harvest_date': request.harvest_date or datetime.now().isoformat(),
            'storage_temperature': request.storage_temperature,
            'storage_humidity': request.storage_humidity,
            'handling_score': request.handling_score,
            'is_organic': request.is_organic,
            'pesticide_ppm': request.pesticide_ppm,
            'product_type': request.product_type,
            'district': request.district,
            'state': request.state
        }
        
        # Run classification
        result = classifier.classify(image_path=None, metadata=metadata)
        
        # Calculate pricing impact
        pricing_impact = calculate_pricing_impact(
            result['grade'],
            result['quality_score'],
            request.is_organic,
            len(result['defects'])
        )
        
        result['pricing_impact'] = pricing_impact
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quality analysis failed: {str(e)}")


@router.post("/analyze-with-image")
async def analyze_quality_with_image(
    file: UploadFile = File(...),
    product_name: str = "Unknown",
    product_type: str = "GRAIN",
    harvest_date: Optional[str] = None,
    storage_temperature: float = 25.0,
    storage_humidity: float = 60.0,
    is_organic: bool = False
):
    """
    Analyze quality with image upload
    Uses computer vision for visual defect detection
    """
    try:
        # Save uploaded file temporarily
        import tempfile
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        classifier = get_quality_classifier()
        
        metadata = {
            'harvest_date': harvest_date or datetime.now().isoformat(),
            'storage_temperature': storage_temperature,
            'storage_humidity': storage_humidity,
            'is_organic': is_organic,
            'product_type': product_type
        }
        
        # Analyze with image
        result = classifier.classify(image_path=tmp_path, metadata=metadata)
        
        # Cleanup
        os.unlink(tmp_path)
        
        # Add pricing impact
        pricing_impact = calculate_pricing_impact(
            result['grade'],
            result['quality_score'],
            is_organic,
            len(result['defects'])
        )
        result['pricing_impact'] = pricing_impact
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")


@router.post("/batch-analyze")
async def batch_analyze_quality(request: BatchQualityRequest):
    """
    Batch quality analysis for multiple products
    Optimized for bulk processing
    """
    try:
        classifier = get_quality_classifier()
        results = []
        
        for product in request.products:
            metadata = {
                'harvest_date': product.harvest_date or datetime.now().isoformat(),
                'storage_temperature': product.storage_temperature,
                'storage_humidity': product.storage_humidity,
                'handling_score': product.handling_score,
                'is_organic': product.is_organic,
                'pesticide_ppm': product.pesticide_ppm,
                'product_type': product.product_type
            }
            
            result = classifier.classify(image_path=None, metadata=metadata)
            result['product_name'] = product.product_name
            
            # Add pricing impact
            pricing_impact = calculate_pricing_impact(
                result['grade'],
                result['quality_score'],
                product.is_organic,
                len(result['defects'])
            )
            result['pricing_impact'] = pricing_impact
            
            results.append(result)
        
        return {
            'total_analyzed': len(results),
            'results': results,
            'summary': generate_batch_summary(results)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch analysis failed: {str(e)}")


@router.get("/grade-standards")
async def get_grade_standards():
    """
    Get quality grade standards and criteria
    """
    return {
        'grades': {
            'A+': {
                'score_range': '95-100',
                'description': 'Premium quality, export grade',
                'price_premium': '20-30%',
                'criteria': [
                    'No visible defects',
                    'Uniform color and size',
                    'Optimal freshness',
                    'Zero pesticide residue'
                ]
            },
            'A': {
                'score_range': '85-94',
                'description': 'Excellent quality, premium markets',
                'price_premium': '10-20%',
                'criteria': [
                    'Minimal defects (<2%)',
                    'Good uniformity',
                    'Fresh (< 5 days)',
                    'Low pesticide levels'
                ]
            },
            'B+': {
                'score_range': '75-84',
                'description': 'Good quality, standard markets',
                'price_premium': '0-10%',
                'criteria': [
                    'Minor defects (<5%)',
                    'Acceptable uniformity',
                    'Reasonably fresh',
                    'Safe pesticide levels'
                ]
            },
            'B': {
                'score_range': '65-74',
                'description': 'Fair quality, local markets',
                'price_premium': '-10-0%',
                'criteria': [
                    'Moderate defects (<10%)',
                    'Variable quality',
                    'Aging signs',
                    'Within safety limits'
                ]
            },
            'C': {
                'score_range': '0-64',
                'description': 'Below standard, processing only',
                'price_premium': '-20--10%',
                'criteria': [
                    'Significant defects',
                    'Poor uniformity',
                    'Old or damaged',
                    'Limited marketability'
                ]
            }
        },
        'defect_types': [
            'discoloration',
            'spots',
            'cracks',
            'mold',
            'insect_damage',
            'size_variation',
            'shape_irregularity',
            'aging',
            'pesticide_residue'
        ],
        'freshness_thresholds': {
            'excellent': '0-3 days',
            'good': '4-7 days',
            'fair': '8-14 days',
            'poor': '15+ days'
        }
    }


@router.post("/compare-quality")
async def compare_quality(products: List[QualityAnalysisRequest]):
    """
    Compare quality across multiple products
    Useful for competitive analysis
    """
    try:
        classifier = get_quality_classifier()
        comparisons = []
        
        for product in products:
            metadata = {
                'harvest_date': product.harvest_date or datetime.now().isoformat(),
                'storage_temperature': product.storage_temperature,
                'storage_humidity': product.storage_humidity,
                'is_organic': product.is_organic,
                'product_type': product.product_type
            }
            
            result = classifier.classify(image_path=None, metadata=metadata)
            
            comparisons.append({
                'product_name': product.product_name,
                'grade': result['grade'],
                'quality_score': result['quality_score'],
                'defect_count': len(result['defects']),
                'freshness_score': result['freshness']['score']
            })
        
        # Rank products
        ranked = sorted(comparisons, key=lambda x: x['quality_score'], reverse=True)
        
        return {
            'comparison': ranked,
            'best_quality': ranked[0] if ranked else None,
            'average_score': np.mean([c['quality_score'] for c in comparisons]),
            'quality_distribution': {
                'A+': sum(1 for c in comparisons if c['grade'] == 'A+'),
                'A': sum(1 for c in comparisons if c['grade'] == 'A'),
                'B+': sum(1 for c in comparisons if c['grade'] == 'B+'),
                'B': sum(1 for c in comparisons if c['grade'] == 'B'),
                'C': sum(1 for c in comparisons if c['grade'] == 'C')
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")


def calculate_pricing_impact(grade: str, score: float, is_organic: bool, defect_count: int) -> Dict:
    """
    Calculate pricing recommendations based on quality
    """
    # Base premium/discount by grade
    grade_multipliers = {
        'A+': 1.25,
        'A': 1.15,
        'B+': 1.05,
        'B': 0.95,
        'C': 0.80
    }
    
    base_multiplier = grade_multipliers.get(grade, 1.0)
    
    # Organic premium
    organic_premium = 0.15 if is_organic else 0.0
    
    # Defect penalty
    defect_penalty = min(0.10, defect_count * 0.02)
    
    # Final multiplier
    final_multiplier = base_multiplier + organic_premium - defect_penalty
    
    return {
        'price_multiplier': round(final_multiplier, 3),
        'percentage_change': round((final_multiplier - 1.0) * 100, 2),
        'grade_impact': round((base_multiplier - 1.0) * 100, 2),
        'organic_premium': round(organic_premium * 100, 2),
        'defect_penalty': round(defect_penalty * 100, 2),
        'recommendation': get_pricing_recommendation(final_multiplier, grade)
    }


def get_pricing_recommendation(multiplier: float, grade: str) -> str:
    """Generate pricing recommendation"""
    if multiplier >= 1.20:
        return f"Premium pricing recommended. Grade {grade} commands top market rates."
    elif multiplier >= 1.10:
        return f"Above-market pricing justified. Quality grade {grade} supports premium."
    elif multiplier >= 1.00:
        return f"Market-rate pricing appropriate for grade {grade}."
    elif multiplier >= 0.90:
        return f"Slight discount recommended. Consider quality improvements."
    else:
        return f"Significant discount needed. Focus on quality enhancement or processing markets."


def generate_batch_summary(results: List[Dict]) -> Dict:
    """Generate summary statistics for batch analysis"""
    if not results:
        return {}
    
    scores = [r['quality_score'] for r in results]
    grades = [r['grade'] for r in results]
    
    return {
        'average_quality_score': round(np.mean(scores), 2),
        'median_quality_score': round(np.median(scores), 2),
        'std_deviation': round(np.std(scores), 2),
        'grade_distribution': {
            grade: grades.count(grade) for grade in set(grades)
        },
        'total_defects': sum(len(r['defects']) for r in results),
        'organic_count': sum(1 for r in results if r['certification']['organic']),
        'recommendations': {
            'premium_quality_count': sum(1 for r in results if r['quality_score'] >= 85),
            'needs_improvement_count': sum(1 for r in results if r['quality_score'] < 70)
        }
    }
