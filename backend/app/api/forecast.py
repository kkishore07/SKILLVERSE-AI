from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from backend.app.services.forecast_service import ForecastService
from backend.app.schemas.schemas import SkillForecastResponse

router = APIRouter(prefix="/api/forecast", tags=["Forecasting"])

@router.get("/skills", response_model=List[str])
def get_forecastable_skills():
    return ForecastService.get_all_skills_with_forecast()

@router.get("/trending/all")
def get_all_trending_forecasts():
    return ForecastService.get_trending_forecasts()

@router.get("/metrics/report")
def get_model_evaluation_report():
    return ForecastService.get_evaluation_report()

@router.get("/{skill_name}", response_model=SkillForecastResponse)
def get_forecast_for_skill(skill_name: str):
    res = ForecastService.get_skill_forecast(skill_name)
    if not res:
        raise HTTPException(status_code=404, detail=f"No forecast model found for '{skill_name}'.")
    return res
