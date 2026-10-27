from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Dict
from backend.app.services.learning_service import LearningService
from backend.app.schemas.schemas import (
    SkillResourcesResponse,
    CareerRoadmapResponse,
    InterviewPrepResponse,
    ATSKeywordAnalysisRequest,
    ATSKeywordAnalysisResponse
)
from pydantic import BaseModel

class RoadmapRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    user_progress: Optional[Dict[str, str]] = None
    timeline_weeks: Optional[int] = 12
    weekly_hours: Optional[int] = 10

router = APIRouter(prefix="/api/learning", tags=["Learning & Career Roadmap"])

@router.get("/resources/{skill_name}", response_model=SkillResourcesResponse)
def get_resources_by_skill(skill_name: str):
    return LearningService.get_skill_resources(skill_name)

@router.get("/resources")
def get_all_resources(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search query")
):
    return LearningService.get_all_resources(category=category, search=search)

@router.post("/roadmap", response_model=CareerRoadmapResponse)
def generate_roadmap(req: RoadmapRequest):
    return LearningService.generate_career_roadmap(
        target_role=req.target_role,
        user_skills=req.current_skills,
        user_progress=req.user_progress,
        timeline_weeks=req.timeline_weeks or 12,
        weekly_hours=req.weekly_hours or 10
    )

@router.get("/interview-prep/{role}", response_model=InterviewPrepResponse)
def get_interview_prep(role: str):
    return LearningService.get_interview_prep(role)

@router.post("/ats-optimizer", response_model=ATSKeywordAnalysisResponse)
def analyze_ats_keywords(req: ATSKeywordAnalysisRequest):
    return LearningService.analyze_ats_readiness(
        target_role=req.target_role,
        user_skills=req.user_skills,
        resume_summary=req.resume_summary
    )
