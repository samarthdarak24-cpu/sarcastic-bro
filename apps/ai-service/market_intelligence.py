"""
Market Intelligence Module
Provides pricing recommendations, demand forecasting, and export readiness
"""

from typing import Dict, List
from datetime import datetime
import random

class MarketIntelligence:
    """
    Market intelligence and pricing recommendations
    """
    
    # Base prices per kg (in INR)
    BASE_PRICES = {
        "Tomato": 30,
        "Wheat": 25,
        "Rice": 45,
        "Cotton": 85,
        "Soybeans": 60,
        "Grapes": 70,
        "Banana": 35,
        "Potato": 20,
        "Mango": 80,
        "Cabbage": 25,
        "Cucumber": 30,
        "Cauliflower": 35,
        "Mixed Produce": 40
    }
    
    # Grade multipliers
    GRADE_MULTIPLIERS = {
        "A+": 1.5,
        "A": 1.2,
        "B+": 1.0,
        "B": 0.85,
        "C": 0.7,
        "D": 0.5
    }
    
    @staticmethod
    def get_price_recommendation(
        crop_type: str,
        grade: str,
        quality_percentage: float,
        quantity: int = 100
    ) -> Dict:
        """
        Get price recommendation based on quality
        
        Args:
            crop_type: Type of crop
            grade: Quality grade (A+, A, B+, B, C, D)
            quality_percentage: Percentage of good items
            quantity: Quantity in kg
            
        Returns:
            Price recommendation dictionary
        """
        base_price = MarketIntelligence.BASE_PRICES.get(crop_type, 40)
        multiplier = MarketIntelligence.GRADE_MULTIPLIERS.get(grade, 1.0)
        
        # Calculate recommended price
        recommended_price = base_price * multiplier
        
        # Add market demand factor (simulated)
        demand_factor = random.uniform(0.95, 1.15)
        market_price = recommended_price * demand_factor
        
        # Calculate price range
        price_min = market_price * 0.9
        price_max = market_price * 1.1
        
        # Calculate total value
        total_value = market_price * quantity
        
        # Determine market recommendation
        if grade in ["A+", "A"] and quality_percentage >= 85:
            market = "Premium Export Market"
            confidence = "High"
        elif grade in ["B+", "B"] and quality_percentage >= 65:
            market = "Standard Export / Premium Local"
            confidence = "Medium"
        elif grade == "C":
            market = "Local Market Only"
            confidence = "Low"
        else:
            market = "Processing / Industrial Use"
            confidence = "Very Low"
        
        return {
            "crop_type": crop_type,
            "grade": grade,
            "base_price": round(base_price, 2),
            "recommended_price": round(market_price, 2),
            "price_range": {
                "min": round(price_min, 2),
                "max": round(price_max, 2)
            },
            "quantity_kg": quantity,
            "total_value": round(total_value, 2),
            "currency": "INR",
            "market_recommendation": market,
            "confidence": confidence,
            "demand_factor": round(demand_factor, 2),
            "timestamp": datetime.now().isoformat()
        }
    
    @staticmethod
    def get_export_readiness(
        grade: str,
        quality_percentage: float,
        defect_rate: float
    ) -> Dict:
        """
        Determine export readiness and compliance
        
        Args:
            grade: Quality grade
            quality_percentage: Percentage of good items
            defect_rate: Percentage of defective items
            
        Returns:
            Export readiness assessment
        """
        # Export criteria
        export_ready = False
        export_market = "Not Suitable"
        compliance_status = []
        
        if grade == "A+" and quality_percentage >= 95 and defect_rate <= 5:
            export_ready = True
            export_market = "Premium International (EU, USA, Japan)"
            compliance_status = ["ISO 22000", "GlobalGAP", "FSSAI", "Export License"]
            confidence = "Very High"
            price_premium = 1.5
            
        elif grade == "A" and quality_percentage >= 85 and defect_rate <= 10:
            export_ready = True
            export_market = "Standard International (Middle East, Asia)"
            compliance_status = ["ISO 22000", "FSSAI", "Export License"]
            confidence = "High"
            price_premium = 1.2
            
        elif grade == "B+" and quality_percentage >= 75 and defect_rate <= 15:
            export_ready = True
            export_market = "Regional Export (SAARC, Neighboring Countries)"
            compliance_status = ["FSSAI", "Basic Quality Standards"]
            confidence = "Medium"
            price_premium = 1.0
            
        else:
            export_ready = False
            export_market = "Domestic Market Only"
            compliance_status = ["FSSAI (if applicable)"]
            confidence = "Low"
            price_premium = 0.85
        
        # Required certifications
        required_certs = []
        if export_ready:
            required_certs = [
                "Phytosanitary Certificate",
                "Certificate of Origin",
                "Quality Certificate",
                "Fumigation Certificate (if required)"
            ]
        
        return {
            "export_ready": export_ready,
            "export_market": export_market,
            "confidence": confidence,
            "price_premium": price_premium,
            "compliance_status": compliance_status,
            "required_certifications": required_certs,
            "quality_score": quality_percentage,
            "defect_rate": defect_rate,
            "grade": grade,
            "recommendation": MarketIntelligence._get_export_recommendation(
                export_ready, grade, quality_percentage
            )
        }
    
    @staticmethod
    def _get_export_recommendation(
        export_ready: bool,
        grade: str,
        quality_percentage: float
    ) -> str:
        """Generate export recommendation text"""
        if export_ready and grade == "A+":
            return (
                f"Excellent! Your produce meets premium export standards. "
                f"With {quality_percentage:.1f}% quality, you can target high-value "
                f"international markets. Consider contacting export agencies for "
                f"premium pricing opportunities."
            )
        elif export_ready and grade == "A":
            return (
                f"Good quality for export! Your produce meets international standards. "
                f"With {quality_percentage:.1f}% quality, you can access standard "
                f"export markets. Ensure proper packaging and documentation."
            )
        elif export_ready:
            return (
                f"Suitable for regional export. Your produce meets basic export criteria. "
                f"Consider improving quality to access higher-value markets."
            )
        else:
            return (
                f"Currently not suitable for export. Focus on domestic markets or "
                f"consider processing options. Work on improving quality metrics "
                f"to meet export standards."
            )
    
    @staticmethod
    def get_demand_forecast(crop_type: str, season: str = "current") -> Dict:
        """
        Get demand forecast for crop type
        
        Args:
            crop_type: Type of crop
            season: Current season
            
        Returns:
            Demand forecast
        """
        # Simulated demand data
        demand_levels = ["Very High", "High", "Medium", "Low"]
        demand = random.choice(demand_levels)
        
        # Price trend
        trend = random.choice(["Increasing", "Stable", "Decreasing"])
        
        return {
            "crop_type": crop_type,
            "current_demand": demand,
            "price_trend": trend,
            "season": season,
            "forecast_period": "Next 30 days",
            "recommendation": MarketIntelligence._get_demand_recommendation(demand, trend)
        }
    
    @staticmethod
    def _get_demand_recommendation(demand: str, trend: str) -> str:
        """Generate demand-based recommendation"""
        if demand in ["Very High", "High"] and trend == "Increasing":
            return "Excellent time to sell! High demand and rising prices."
        elif demand in ["Very High", "High"]:
            return "Good time to sell. Strong market demand."
        elif demand == "Medium" and trend == "Increasing":
            return "Consider holding for better prices if storage permits."
        elif demand == "Medium":
            return "Moderate demand. Sell at current market rates."
        else:
            return "Low demand. Consider processing or alternative markets."


# Global instance
market_intelligence = MarketIntelligence()
