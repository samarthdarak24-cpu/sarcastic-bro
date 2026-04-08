"""
Advanced Algorithms for Real-Time Problem Solving
Implements sophisticated AI techniques for agricultural intelligence
"""

import numpy as np
from typing import Dict, List, Tuple, Any
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class PredictiveAnalytics:
    """
    Advanced predictive algorithms for agricultural forecasting.
    """
    
    @staticmethod
    def forecast_price_trend(
        historical_prices: List[float],
        days_ahead: int = 30
    ) -> Dict[str, Any]:
        """
        Forecast price trends using exponential smoothing and seasonal decomposition.
        
        Args:
            historical_prices: List of historical prices
            days_ahead: Number of days to forecast
            
        Returns:
            Dictionary with forecast data and confidence intervals
        """
        if len(historical_prices) < 7:
            # Not enough data, return simple average
            avg_price = np.mean(historical_prices)
            return {
                "forecast": [avg_price] * days_ahead,
                "confidence_lower": [avg_price * 0.95] * days_ahead,
                "confidence_upper": [avg_price * 1.05] * days_ahead,
                "trend": "STABLE",
                "confidence": 0.6
            }
        
        # Apply exponential smoothing
        alpha = 0.3  # Smoothing factor
        smoothed = [historical_prices[0]]
        
        for i in range(1, len(historical_prices)):
            smoothed_value = alpha * historical_prices[i] + (1 - alpha) * smoothed[i-1]
            smoothed.append(smoothed_value)
        
        # Calculate trend
        recent_avg = np.mean(smoothed[-7:])
        older_avg = np.mean(smoothed[-14:-7]) if len(smoothed) >= 14 else smoothed[0]
        trend_direction = "UP" if recent_avg > older_avg * 1.02 else "DOWN" if recent_avg < older_avg * 0.98 else "STABLE"
        
        # Generate forecast
        last_value = smoothed[-1]
        trend_rate = (recent_avg - older_avg) / older_avg if older_avg > 0 else 0
        
        forecast = []
        confidence_lower = []
        confidence_upper = []
        
        for day in range(days_ahead):
            # Apply trend with dampening
            dampening = 0.95 ** day  # Reduce trend impact over time
            predicted = last_value * (1 + trend_rate * dampening)
            
            # Add seasonal variation (simplified)
            seasonal_factor = 1 + 0.05 * np.sin(2 * np.pi * day / 30)
            predicted *= seasonal_factor
            
            forecast.append(predicted)
            
            # Confidence intervals widen over time
            uncertainty = 0.05 + (0.01 * day)
            confidence_lower.append(predicted * (1 - uncertainty))
            confidence_upper.append(predicted * (1 + uncertainty))
        
        return {
            "forecast": forecast,
            "confidence_lower": confidence_lower,
            "confidence_upper": confidence_upper,
            "trend": trend_direction,
            "confidence": 0.85 - (0.01 * days_ahead)  # Confidence decreases with time
        }
    
    @staticmethod
    def optimize_crop_mix(
        available_land: float,
        crops: List[Dict[str, Any]],
        constraints: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Optimize crop allocation using linear programming principles.
        
        Args:
            available_land: Total land available (hectares)
            crops: List of crop options with profit, water, labor requirements
            constraints: Resource constraints (water, labor, capital)
            
        Returns:
            Optimal crop allocation and expected returns
        """
        # Simplified optimization using greedy algorithm with profit-per-resource ratio
        
        # Calculate efficiency score for each crop
        for crop in crops:
            water_efficiency = crop.get("profit", 0) / max(crop.get("water_need", 1), 1)
            labor_efficiency = crop.get("profit", 0) / max(crop.get("labor_need", 1), 1)
            crop["efficiency_score"] = (water_efficiency + labor_efficiency) / 2
        
        # Sort by efficiency
        sorted_crops = sorted(crops, key=lambda x: x["efficiency_score"], reverse=True)
        
        # Allocate land
        allocation = []
        remaining_land = available_land
        total_profit = 0
        total_water = 0
        total_labor = 0
        
        for crop in sorted_crops:
            if remaining_land <= 0:
                break
            
            # Calculate maximum allocation for this crop
            max_by_land = remaining_land
            max_by_water = constraints.get("water", float('inf')) / max(crop.get("water_need", 1), 1)
            max_by_labor = constraints.get("labor", float('inf')) / max(crop.get("labor_need", 1), 1)
            
            allocated = min(max_by_land, max_by_water, max_by_labor, crop.get("max_area", remaining_land))
            
            if allocated > 0.1:  # Minimum 0.1 hectare
                allocation.append({
                    "crop": crop["name"],
                    "area": round(allocated, 2),
                    "expected_profit": round(allocated * crop.get("profit", 0), 2),
                    "water_required": round(allocated * crop.get("water_need", 0), 2),
                    "labor_required": round(allocated * crop.get("labor_need", 0), 2)
                })
                
                remaining_land -= allocated
                total_profit += allocated * crop.get("profit", 0)
                total_water += allocated * crop.get("water_need", 0)
                total_labor += allocated * crop.get("labor_need", 0)
        
        return {
            "allocation": allocation,
            "total_profit": round(total_profit, 2),
            "total_water_used": round(total_water, 2),
            "total_labor_used": round(total_labor, 2),
            "land_utilized": round(available_land - remaining_land, 2),
            "efficiency_score": round(total_profit / available_land, 2) if available_land > 0 else 0
        }


class MarketIntelligence:
    """
    Advanced market analysis algorithms.
    """
    
    @staticmethod
    def analyze_supply_demand(
        current_supply: float,
        current_demand: float,
        historical_data: List[Dict[str, float]]
    ) -> Dict[str, Any]:
        """
        Analyze supply-demand dynamics and predict market conditions.
        """
        # Calculate supply-demand ratio
        sd_ratio = current_supply / current_demand if current_demand > 0 else 1.0
        
        # Determine market condition
        if sd_ratio > 1.2:
            condition = "OVERSUPPLY"
            price_pressure = "DOWNWARD"
            recommendation = "Consider storage or alternative markets"
        elif sd_ratio < 0.8:
            condition = "UNDERSUPPLY"
            price_pressure = "UPWARD"
            recommendation = "Optimal time to sell at premium prices"
        else:
            condition = "BALANCED"
            price_pressure = "STABLE"
            recommendation = "Market conditions are favorable"
        
        # Calculate volatility
        if len(historical_data) >= 7:
            prices = [d.get("price", 0) for d in historical_data[-7:]]
            volatility = np.std(prices) / np.mean(prices) if np.mean(prices) > 0 else 0
        else:
            volatility = 0.1
        
        return {
            "condition": condition,
            "supply_demand_ratio": round(sd_ratio, 2),
            "price_pressure": price_pressure,
            "volatility": round(volatility, 3),
            "recommendation": recommendation,
            "confidence": 0.85
        }
    
    @staticmethod
    def match_buyer_seller(
        seller_profile: Dict[str, Any],
        buyer_profiles: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Advanced matching algorithm for buyer-seller pairing.
        Uses multi-criteria scoring.
        """
        matches = []
        
        for buyer in buyer_profiles:
            score = 0
            factors = []
            
            # Price compatibility (30%)
            seller_price = seller_profile.get("asking_price", 0)
            buyer_budget = buyer.get("max_price", 0)
            if seller_price <= buyer_budget:
                price_score = 30 * (1 - (seller_price / buyer_budget) * 0.5)
                score += price_score
                factors.append(f"Price match: {int(price_score)}%")
            
            # Quality match (25%)
            seller_quality = seller_profile.get("quality_grade", "B")
            buyer_quality = buyer.get("required_quality", "B")
            quality_map = {"A": 4, "B": 3, "C": 2, "D": 1}
            if quality_map.get(seller_quality, 0) >= quality_map.get(buyer_quality, 0):
                score += 25
                factors.append("Quality requirement met")
            
            # Location proximity (20%)
            # Simplified distance calculation
            distance = abs(seller_profile.get("location_code", 0) - buyer.get("location_code", 0))
            proximity_score = max(0, 20 - distance * 2)
            score += proximity_score
            if proximity_score > 10:
                factors.append(f"Good location proximity")
            
            # Volume match (15%)
            seller_volume = seller_profile.get("available_quantity", 0)
            buyer_volume = buyer.get("required_quantity", 0)
            if seller_volume >= buyer_volume * 0.8:
                score += 15
                factors.append("Volume requirement met")
            
            # Reputation (10%)
            seller_rating = seller_profile.get("rating", 3.0)
            if seller_rating >= 4.0:
                score += 10
                factors.append("High seller rating")
            elif seller_rating >= 3.5:
                score += 5
            
            if score >= 50:  # Minimum threshold
                matches.append({
                    "buyer_id": buyer.get("id"),
                    "buyer_name": buyer.get("name"),
                    "match_score": round(score, 1),
                    "factors": factors,
                    "estimated_profit": round(seller_price * seller_volume * 0.15, 2)
                })
        
        # Sort by match score
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matches[:10]  # Return top 10 matches


class RiskAssessment:
    """
    Risk analysis algorithms for agricultural decisions.
    """
    
    @staticmethod
    def assess_crop_risk(
        crop_name: str,
        location: str,
        season: str,
        farmer_experience: int
    ) -> Dict[str, Any]:
        """
        Assess risk factors for crop cultivation.
        """
        risk_score = 0
        risk_factors = []
        
        # Weather risk (simplified)
        weather_risk = {
            "Kharif": 0.3,  # Monsoon dependent
            "Rabi": 0.1,    # Lower risk
            "Zaid": 0.2     # Summer crops
        }
        risk_score += weather_risk.get(season, 0.2) * 30
        
        # Market volatility risk
        volatile_crops = ["Onion", "Tomato", "Potato"]
        if crop_name in volatile_crops:
            risk_score += 20
            risk_factors.append("High price volatility")
        
        # Experience factor
        if farmer_experience < 2:
            risk_score += 15
            risk_factors.append("Limited farming experience")
        elif farmer_experience > 10:
            risk_score -= 10  # Reduce risk for experienced farmers
        
        # Determine risk level
        if risk_score < 20:
            risk_level = "LOW"
            recommendation = "Favorable conditions for cultivation"
        elif risk_score < 40:
            risk_level = "MEDIUM"
            recommendation = "Proceed with standard risk management"
        else:
            risk_level = "HIGH"
            recommendation = "Consider crop insurance and diversification"
        
        return {
            "risk_level": risk_level,
            "risk_score": round(risk_score, 1),
            "risk_factors": risk_factors,
            "recommendation": recommendation,
            "mitigation_strategies": [
                "Diversify crop portfolio",
                "Use weather-based insurance",
                "Implement drip irrigation",
                "Follow integrated pest management"
            ]
        }


# Singleton instances
predictive_analytics = PredictiveAnalytics()
market_intelligence = MarketIntelligence()
risk_assessment = RiskAssessment()
