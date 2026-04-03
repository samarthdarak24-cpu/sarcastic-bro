# ========================================================================
#  Demand Forecasting Service — Time-series demand prediction
# ========================================================================

import random
import math
import hashlib
from datetime import datetime, timedelta
from typing import List
from app.schemas import ForecastInput, ForecastDataPoint, DemandForecastResponse


# Seasonal multipliers by month (Indian agricultural calendar)
SEASONAL_FACTORS = {
    1: 0.8, 2: 0.75, 3: 0.9, 4: 1.1, 5: 1.2, 6: 1.0,
    7: 0.85, 8: 0.7, 9: 0.9, 10: 1.3, 11: 1.4, 12: 1.1,
}

# Base demand by category
CATEGORY_BASE_DEMAND = {
    "Spices": 120, "Grains": 250, "Fruits": 180, "Vegetables": 200,
    "Cotton": 90, "Textiles": 70, "Handicrafts": 50, "Tea": 100,
    "Coffee": 80, "Rice": 300, "Wheat": 280, "Dairy": 150,
    "Oilseeds": 100, "Turmeric": 60, "Chilli": 75, "Coconut": 55,
    "Rubber": 40, "Jute": 35, "Mango": 130,
}


def forecast_demand(input_data: ForecastInput) -> DemandForecastResponse:
    """
    Generate realistic time-series demand forecast with confidence intervals.
    Uses seasonal decomposition + trend + noise simulation.
    """
    seed = int(hashlib.md5(input_data.product_name.encode()).hexdigest()[:8], 16)
    random.seed(seed)

    base = CATEGORY_BASE_DEMAND.get(input_data.category, 100)
    trend_slope = random.uniform(-0.5, 1.5)  # units per day
    today = datetime.now()

    forecast_points: List[ForecastDataPoint] = []
    peak_demand = 0
    peak_date = today.strftime("%Y-%m-%d")

    for day_offset in range(input_data.time_range_days):
        date = today + timedelta(days=day_offset)
        month = date.month

        # Seasonal component
        seasonal = SEASONAL_FACTORS.get(month, 1.0)

        # Trend component
        trend = trend_slope * day_offset

        # Cyclic (weekly pattern — weekends have lower demand)
        weekday = date.weekday()
        cyclic = 1.0 if weekday < 5 else 0.75

        # Noise
        noise = random.gauss(0, base * 0.08)

        # Final predicted demand
        predicted = max(0, (base * seasonal * cyclic) + trend + noise)
        predicted = round(predicted, 1)

        # Confidence interval (widens with time)
        uncertainty = 0.05 + (day_offset / input_data.time_range_days) * 0.15
        lower = round(max(0, predicted * (1 - uncertainty)), 1)
        upper = round(predicted * (1 + uncertainty), 1)

        if predicted > peak_demand:
            peak_demand = predicted
            peak_date = date.strftime("%Y-%m-%d")

        forecast_points.append(ForecastDataPoint(
            date=date.strftime("%Y-%m-%d"),
            predicted_demand=predicted,
            confidence_lower=lower,
            confidence_upper=upper,
        ))

    # Determine trend
    first_week_avg = sum(p.predicted_demand for p in forecast_points[:7]) / min(7, len(forecast_points))
    last_week_avg = sum(p.predicted_demand for p in forecast_points[-7:]) / min(7, len(forecast_points))

    if last_week_avg > first_week_avg * 1.1:
        trend = "rising"
    elif last_week_avg < first_week_avg * 0.9:
        trend = "falling"
    else:
        trend = "stable"

    return DemandForecastResponse(
        product_name=input_data.product_name,
        time_range_days=input_data.time_range_days,
        forecast=forecast_points,
        trend=trend,
        peak_date=peak_date,
    )
