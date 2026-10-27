from fastapi import APIRouter
from backend.app.services.analytics_service import AnalyticsService
from backend.app.schemas.schemas import AnalyticsOverviewResponse

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/overview", response_model=AnalyticsOverviewResponse)
def get_analytics_overview():
    return AnalyticsService.get_overview()

@router.get("/industry")
def get_industry_analytics():
    return AnalyticsService.get_industry_analytics()

@router.get("/location")
def get_location_analytics():
    return AnalyticsService.get_location_analytics()

@router.get("/salary")
def get_salary_by_skill():
    return AnalyticsService.get_salary_by_skill()
