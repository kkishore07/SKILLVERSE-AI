from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    target_role = Column(String(120), default="Data Scientist")
    current_skills = Column(Text, default="Python, SQL")
    experience_level = Column(String(50), default="Mid-level")
    weekly_hours = Column(Integer, default=10)
    target_timeline_weeks = Column(Integer, default=12)
    target_company_tier = Column(String(100), default="Top Tech / Product Unicorns")
    learning_progress = Column(Text, default="{}")
    study_streak_days = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)

    recommendations = relationship("Recommendation", back_populates="user", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), index=True)
    demand_tier = Column(String(50), default="Medium")
    average_salary = Column(Integer, default=110000)
    percentage_of_jobs = Column(Float, default=0.0)
    recent_growth_pct = Column(Float, default=0.0)

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(150), index=True, nullable=False)
    company = Column(String(150), index=True, nullable=False)
    location = Column(String(100), index=True, nullable=False)
    industry = Column(String(100), index=True, nullable=False)
    experience_level = Column(String(50), index=True)
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    salary_avg = Column(Integer, index=True)
    description = Column(Text)
    skills_json = Column(Text)
    posted_date = Column(String(20), index=True)

class SkillDemand(Base):
    __tablename__ = "skill_demand"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), index=True, nullable=False)
    period = Column(String(20), index=True, nullable=False)  # YYYY-MM
    demand_count = Column(Integer, nullable=False)

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, index=True)
    skill_name = Column(String(100), index=True, nullable=False)
    period = Column(String(20), index=True, nullable=False)  # YYYY-MM
    predicted_demand = Column(Float, nullable=False)
    lower_bound = Column(Float)
    upper_bound = Column(Float)

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    target_role = Column(String(120), nullable=False)
    match_score = Column(Float, nullable=False)
    missing_skills = Column(Text)  # JSON serialized
    learning_priorities = Column(Text)  # JSON serialized
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recommendations")
