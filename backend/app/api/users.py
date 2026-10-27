import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.database.models import User
from backend.app.schemas.schemas import (
    UserProfileResponse,
    UserProfileUpdateRequest,
    UserLearningProgressUpdate
)
from backend.app.services.auth_service import require_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.get("/profile", response_model=UserProfileResponse)
def get_user_profile(current_user: User = Depends(require_current_user)):
    return current_user

@router.put("/profile", response_model=UserProfileResponse)
def update_user_profile(
    req: UserProfileUpdateRequest,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    if req.name is not None:
        current_user.name = req.name
    if req.target_role is not None:
        current_user.target_role = req.target_role
    if req.current_skills is not None:
        current_user.current_skills = req.current_skills
    if req.experience_level is not None:
        current_user.experience_level = req.experience_level
    if req.weekly_hours is not None:
        current_user.weekly_hours = req.weekly_hours
    if req.target_timeline_weeks is not None:
        current_user.target_timeline_weeks = req.target_timeline_weeks
    if req.target_company_tier is not None:
        current_user.target_company_tier = req.target_company_tier
    if req.learning_progress is not None:
        current_user.learning_progress = req.learning_progress
    if req.study_streak_days is not None:
        current_user.study_streak_days = req.study_streak_days

    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/progress", response_model=UserProfileResponse)
def update_learning_progress(
    req: UserLearningProgressUpdate,
    current_user: User = Depends(require_current_user),
    db: Session = Depends(get_db)
):
    try:
        progress_data = json.loads(current_user.learning_progress or "{}")
    except Exception:
        progress_data = {}

    progress_data[req.skill_name] = req.status
    current_user.learning_progress = json.dumps(progress_data)

    # If marked as Mastered, also append to current_skills if not already present
    if req.status == "Mastered":
        existing_skills = [s.strip() for s in (current_user.current_skills or "").split(",") if s.strip()]
        if not any(s.lower() == req.skill_name.lower() for s in existing_skills):
            existing_skills.append(req.skill_name)
            current_user.current_skills = ", ".join(existing_skills)

    db.commit()
    db.refresh(current_user)
    return current_user
