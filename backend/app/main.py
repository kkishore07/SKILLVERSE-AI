import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database.database import engine, Base, init_db
from backend.app.api import auth, skills, jobs, analytics, forecast, recommendations, users, learning

# Initialize database tables and schema migrations
init_db()

app = FastAPI(
    title="SkillVerse AI API",
    description="Workforce Skill Demand Forecasting and Analytics Platform",
    version="1.0.0"
)

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev and testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(skills.router)
app.include_router(jobs.router)
app.include_router(analytics.router)
app.include_router(forecast.router)
app.include_router(recommendations.router)
app.include_router(users.router)
app.include_router(learning.router)


@app.get("/")
def root():
    return {
        "platform": "SkillVerse AI",
        "description": "Workforce Skill Demand Forecasting Platform",
        "version": "1.0.0",
        "status": "Operational",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
