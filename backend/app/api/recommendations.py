from fastapi import APIRouter
from backend.app.services.recommendation_service import RecommendationService
from backend.app.schemas.schemas import SkillGapRequest, SkillGapResponse, SalaryEstimateRequest, SalaryEstimateResponse

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.get("/roles")
def get_roles_for_recommendation():
    return {"roles": RecommendationService.get_available_roles()}

@router.post("/gap-analysis", response_model=SkillGapResponse)
def analyze_skill_gap(req: SkillGapRequest):
    return RecommendationService.analyze_skill_gap(req.target_role, req.current_skills)

@router.post("/salary-estimate", response_model=SalaryEstimateResponse)
def estimate_salary(req: SalaryEstimateRequest):
    return RecommendationService.predict_salary(
        job_title=req.job_title,
        experience_level=req.experience_level,
        location=req.location,
        industry=req.industry,
        skills=req.skills
    )
