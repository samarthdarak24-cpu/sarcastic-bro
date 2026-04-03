"""
Forecast Service - Demand prediction and market trend analysis.
ODOP CONNECT - Agri-Tech Platform
"""

import random
import time
from datetime import datetime, timedelta
from typing import List
from models import (
    DemandForecastResponse,
    DemandForecastRequest,
    ForecastDataPoint,
    HealthTrend,
    QualityGrade,
)


class ForecastService:
    """Service for demand forecasting and market trend analysis."""

    # Mock historical data patterns by product type
    PRODUCT_SEASONAL_PATTERNS = {
        "Tomato": {
            "base_demand": 12000,
            "seasonal_factors": [1.2, 1.25, 1.3, 1.35, 1.4, 1.35, 1.15, 1.05, 1.0, 0.95, 0.9, 1.1],
            "trend": "UP",
            "growth": 8.5,
        },
        "Onion": {
            "base_demand": 15000,
            "seasonal_factors": [1.1, 1.05, 0.95, 0.85, 0.8, 0.85, 0.95, 1.05, 1.15, 1.2, 1.25, 1.15],
            "trend": "STABLE",
            "growth": 2.5,
        },
        "Mango": {
            "base_demand": 8000,
            "seasonal_factors": [0.3, 0.4, 0.8, 1.4, 1.5, 1.4, 0.9, 0.5, 0.3, 0.3, 0.2, 0.2],
            "trend": "UP",
            "growth": 5.0,
        },
        "Wheat": {
            "base_demand": 25000,
            "seasonal_factors": [1.0, 0.95, 0.9, 0.85, 0.8, 0.85, 0.95, 1.1, 1.3, 1.35, 1.25, 1.1],
            "trend": "STABLE",
            "growth": 1.5,
        },
        "Rice": {
            "base_demand": 30000,
            "seasonal_factors": [0.8, 0.75, 0.7, 0.75, 0.8, 0.95, 1.2, 1.4, 1.5, 1.3, 1.0, 0.9],
            "trend": "UP",
            "growth": 3.5,
        },
        "Arhar": {
            "base_demand": 6000,
            "seasonal_factors": [1.1, 1.15, 1.2, 1.15, 1.0, 0.9, 0.85, 0.8, 0.85, 0.95, 1.05, 1.1],
            "trend": "DOWN",
            "growth": -1.5,
        },
        "Bell Pepper": {
            "base_demand": 5000,
            "seasonal_factors": [1.3, 1.35, 1.4, 1.3, 1.1, 0.9, 0.8, 0.85, 0.95, 1.1, 1.25, 1.3],
            "trend": "UP",
            "growth": 7.2,
        },
    }

    # Default seasonal pattern for unknown products
    DEFAULT_PATTERN = {
        "base_demand": 10000,
        "seasonal_factors": [1.0, 1.05, 1.1, 1.15, 1.2, 1.15, 1.1, 1.0, 0.95, 0.9, 0.9, 0.95],
        "trend": "STABLE",
        "growth": 2.0,
    }

    @staticmethod
    def _get_product_pattern(product_name: str) -> dict:
        """
        Get seasonal pattern for product.
        
        Args:
            product_name: Name of the product
            
        Returns:
            Pattern dictionary with seasonal factors and trends
        """
        return ForecastService.PRODUCT_SEASONAL_PATTERNS.get(
            product_name, ForecastService.DEFAULT_PATTERN
        )

    @staticmethod
    def _calculate_peak_season(seasonal_factors: List[float]) -> str:
        """
        Determine peak season from seasonal factors.
        
        Args:
            seasonal_factors: List of monthly seasonal adjustment factors
            
        Returns:
            String describing peak season months
        """
        months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ]
        
        max_factor = max(seasonal_factors)
        peak_indices = [i for i, f in enumerate(seasonal_factors) if f == max_factor]
        
        if len(peak_indices) == 1:
            return f"Peak in {months[peak_indices[0]]}"
        elif len(peak_indices) > 0:
            peak_months = [months[i] for i in peak_indices[:3]]
            return f"Peak season: {' - '.join(peak_months)}"
        else:
            return "Year-round consistent demand"

    @staticmethod
    def _get_best_selling_grade() -> QualityGrade:
        """
        Get best selling quality grade (weighted towards A).
        
        Returns:
            Best selling quality grade
        """
        return random.choices(
            [QualityGrade.A, QualityGrade.B, QualityGrade.C, QualityGrade.D],
            weights=[50, 35, 10, 5],
            k=1,
        )[0]

    @staticmethod
    async def forecast_demand(
        request: DemandForecastRequest,
    ) -> DemandForecastResponse:
        """
        Generate demand forecast for a product.
        
        Args:
            request: DemandForecastRequest
            
        Returns:
            DemandForecastResponse with forecast data
        """
        start_time = time.time()

        # Get product pattern
        pattern = ForecastService._get_product_pattern(request.product_name)

        base_demand = pattern["base_demand"]
        seasonal_factors = pattern["seasonal_factors"]
        trend_direction = HealthTrend(pattern["trend"])
        growth_rate = pattern["growth"]

        # Get current date for forecast
        today = datetime.now()
        current_month = today.month
        current_year = today.year

        forecast_data = []

        # Generate forecast for requested months
        for month_offset in range(1, request.months_ahead + 1):
            # Calculate actual month and year
            forecast_month = ((current_month + month_offset - 1) % 12) + 1
            forecast_year = current_year + ((current_month + month_offset - 1) // 12)

            # Get seasonal factor
            seasonal_factor = seasonal_factors[forecast_month - 1]

            # Calculate predicted demand with growth trend
            growth_multiplier = 1 + (growth_rate / 100) * (month_offset / 12)
            base_forecast = base_demand * growth_multiplier * seasonal_factor

            # Add random variation (±10%)
            variation = random.uniform(-0.1, 0.1)
            predicted_demand = max(100, base_forecast * (1 + variation))

            # Calculate confidence interval (±15%)
            lower_bound = predicted_demand * 0.85
            upper_bound = predicted_demand * 1.15

            # Determine trend for this month
            if month_offset == 1:
                month_trend = trend_direction
            else:
                # Create local trend variation
                prev_demand = forecast_data[-1]["predicted_demand"]
                if predicted_demand > prev_demand * 1.05:
                    month_trend = HealthTrend.UP
                elif predicted_demand < prev_demand * 0.95:
                    month_trend = HealthTrend.DOWN
                else:
                    month_trend = HealthTrend.STABLE

            # Suggested quantity (slightly above predicted demand)
            suggested_quantity = int(predicted_demand * random.uniform(1.05, 1.15))

            # Suggested price (varies by season)
            base_price = random.uniform(30, 80)
            seasonal_price_factor = 1 + ((seasonal_factor - 1) * 0.3)
            suggested_price = base_price * seasonal_price_factor

            forecast_point = ForecastDataPoint(
                month=forecast_month,
                year=forecast_year,
                predicted_demand=int(predicted_demand),
                confidence_interval={
                    "lower": int(lower_bound),
                    "upper": int(upper_bound),
                },
                trend=month_trend,
                seasonal_factor=round(seasonal_factor, 2),
                suggested_quantity=suggested_quantity,
                suggested_price=round(suggested_price, 2),
            )

            forecast_data.append(forecast_point)

        # Calculate historical average
        historical_avg = int(base_demand)

        # Get peak season description
        peak_season = ForecastService._calculate_peak_season(seasonal_factors)

        # Get best selling grade
        best_grade = ForecastService._get_best_selling_grade()

        # Build response
        response = DemandForecastResponse(
            product_name=request.product_name,
            district=request.district or "National Average",
            forecast_data=forecast_data,
            historical_average=historical_avg,
            growth_rate_percent=round(growth_rate, 2),
            peak_season=peak_season,
            best_selling_grade=best_grade,
        )

        return response
