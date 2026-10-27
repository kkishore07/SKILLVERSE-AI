from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

# Auth Schemas
class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    target_role: Optional[str] = "Data Scientist"
    current_skills: Optional[str] = "Python, SQL"

class UserLoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    target_role: str
    current_skills: str
    experience_level: Optional[str] = "Mid-level"
    weekly_hours: Optional[int] = 10
    target_timeline_weeks: Optional[int] = 12
    target_company_tier: Optional[str] = "Top Tech / Product Unicorns"
    learning_progress: Optional[str] = "{}"
    study_streak_days: Optional[int] = 5
    created_at: datetime

class UserProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    target_role: Optional[str] = None
    current_skills: Optional[str] = None
    experience_level: Optional[str] = None
    weekly_hours: Optional[int] = None
    target_timeline_weeks: Optional[int] = None
    target_company_tier: Optional[str] = None
    learning_progress: Optional[str] = None
    study_streak_days: Optional[int] = None

class UserLearningProgressUpdate(BaseModel):
    skill_name: str
    status: str  # "To Learn", "In Progress", "Mastered"
    notes: Optional[str] = None


# Skill Schemas
class SkillItem(BaseModel):
    name: str
    category: str
    total_postings: int
    percentage_of_jobs: float
    average_salary: int
    recent_growth_pct: float
    demand_tier: str
    related_skills: List[str]

# Job Schemas
class JobItem(BaseModel):
    id: int
    job_title: str
    company: str
    location: str
    industry: str
    experience_level: Optional[str]
    salary_min: Optional[int]
    salary_max: Optional[int]
    salary_avg: Optional[int]
    description: Optional[str]
    skills: List[str]
    posted_date: str

class JobPaginationResponse(BaseModel):
    total: int
    page: int
    limit: int
    jobs: List[JobItem]

# Analytics Schemas
class AnalyticsOverviewResponse(BaseModel):
    total_jobs: int
    total_skills: int
    total_industries: int
    total_locations: int
    average_salary_overall: int
    industry_distribution: List[Dict[str, Any]]
    location_distribution: List[Dict[str, Any]]
    top_skills_overall: List[Dict[str, Any]]
    fastest_growing_skills: List[Dict[str, Any]]

# Forecast Schemas
class ForecastDataPoint(BaseModel):
    period: str
    forecast: float
    lower_bound: float
    upper_bound: float

class HistoricalDataPoint(BaseModel):
    period: str
    demand: int

class SkillForecastResponse(BaseModel):
    skill: str
    trend_direction: str
    projected_growth_pct: float
    evaluation: Dict[str, Any]
    historical: List[HistoricalDataPoint]
    forecast: List[ForecastDataPoint]

# Recommendation & Skill Gap Schemas
class SkillGapRequest(BaseModel):
    target_role: str
    current_skills: List[str]

class RecommendedSkillItem(BaseModel):
    skill: str
    category: str
    current_demand: str
    future_trend: str
    average_salary: int
    priority: str
    reasoning: str

class SkillGapResponse(BaseModel):
    target_role: str
    current_skills: List[str]
    matched_skills: List[str]
    missing_skills: List[str]
    skill_match_percentage: float
    target_role_avg_salary: int
    learning_recommendations: List[RecommendedSkillItem]

class SalaryEstimateRequest(BaseModel):
    job_title: str
    experience_level: str
    location: str
    industry: str
    skills: List[str]

class SalaryEstimateResponse(BaseModel):
    predicted_salary: int
    salary_range_min: int
    salary_range_max: int
    confidence_r2: float
    factors: Dict[str, Any]
    predicted_salary_lpa: Optional[float] = None
    salary_range_min_lpa: Optional[float] = None
    salary_range_max_lpa: Optional[float] = None

# Learning Resources & Roadmap Schemas
class CourseItem(BaseModel):
    title: str
    platform: str
    instructor: str
    rating: float
    duration: str
    level: str
    is_free: bool
    url: str
    description: str

class YouTubeVideoItem(BaseModel):
    title: str
    channel: str
    duration: str
    video_id: str
    url: str
    views: str
    topics: List[str]

class DocResourceItem(BaseModel):
    title: str
    provider: str
    url: str
    type: str

class ProjectIdeaItem(BaseModel):
    title: str
    difficulty: str
    description: str
    deliverables: List[str]
    tech_stack: List[str]

class SkillResourcesResponse(BaseModel):
    skill_name: str
    category: str
    demand_tier: str
    average_salary: int
    courses: List[CourseItem]
    youtube_videos: List[YouTubeVideoItem]
    documentation: List[DocResourceItem]
    project_ideas: List[ProjectIdeaItem]

class MindmapNodeItem(BaseModel):
    id: str
    label: str
    type: str  # "root", "category", "skill"
    category: Optional[str] = None
    status: Optional[str] = "To Learn"  # "Mastered", "In Progress", "To Learn"
    priority: Optional[str] = "Standard"
    frequency_pct: Optional[float] = 0.0
    average_salary: Optional[int] = 0
    estimated_hours: Optional[int] = 20
    is_gap: Optional[bool] = False
    prerequisites: Optional[List[str]] = []
    x: Optional[float] = None
    y: Optional[float] = None

class MindmapEdgeItem(BaseModel):
    source: str
    target: str
    label: Optional[str] = None

class RoadmapMilestoneItem(BaseModel):
    phase_number: int
    phase_title: str
    estimated_weeks: str
    description: str
    skills: List[Dict[str, Any]]
    milestone_project: ProjectIdeaItem
    completion_percentage: float

class CareerRoadmapResponse(BaseModel):
    target_role: str
    total_estimated_hours: int
    target_timeline_weeks: int
    weekly_hours: int
    readiness_score: float
    mastered_skills_count: int
    in_progress_count: int
    pending_skills_count: int
    phases: List[RoadmapMilestoneItem]
    mindmap_nodes: List[MindmapNodeItem]
    mindmap_edges: List[MindmapEdgeItem]

class InterviewQuestionItem(BaseModel):
    id: int
    skill: str
    category: str
    question: str
    answer: str
    code_example: Optional[str] = None
    interview_tips: str
    difficulty: str

class InterviewPrepResponse(BaseModel):
    role: str
    total_questions: int
    questions: List[InterviewQuestionItem]

class ATSKeywordAnalysisRequest(BaseModel):
    target_role: str
    user_skills: List[str]
    resume_summary: Optional[str] = None

class ATSKeywordAnalysisResponse(BaseModel):
    target_role: str
    ats_score: int
    matched_keywords: List[str]
    missing_critical_keywords: List[Dict[str, Any]]
    resume_bullet_recommendations: List[str]
    system_readiness_tier: str

