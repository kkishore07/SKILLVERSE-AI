import os
import json
import pandas as pd
from typing import Optional, List
from fastapi import APIRouter, Query, HTTPException
from backend.app.schemas.schemas import JobPaginationResponse, JobItem

router = APIRouter(prefix="/api/jobs", tags=["Jobs"])

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data", "processed", "processed_jobs.csv")

_jobs_df = None

def get_jobs_df() -> pd.DataFrame:
    global _jobs_df
    if _jobs_df is None and os.path.exists(DATA_PATH):
        _jobs_df = pd.read_csv(DATA_PATH)
        # Parse skills JSON
        _jobs_df["skills_parsed"] = _jobs_df["extracted_skills"].apply(
            lambda x: eval(x) if isinstance(x, str) and x.startswith("[") else []
        )
    return _jobs_df

@router.get("", response_model=JobPaginationResponse)
def get_jobs(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    role: Optional[str] = None,
    industry: Optional[str] = None,
    location: Optional[str] = None,
    skill: Optional[str] = None,
    search: Optional[str] = None
):
    df = get_jobs_df()
    if df is None:
        return {"total": 0, "page": page, "limit": limit, "jobs": []}

    filtered = df
    if role:
        filtered = filtered[filtered["job_title_normalized"].str.lower() == role.lower()]
    if industry:
        filtered = filtered[filtered["industry"].str.lower() == industry.lower()]
    if location:
        filtered = filtered[filtered["location"].str.lower() == location.lower()]
    if skill:
        s_low = skill.lower()
        filtered = filtered[filtered["skills_parsed"].apply(lambda sl: any(s.lower() == s_low for s in sl))]
    if search:
        q = search.lower()
        filtered = filtered[
            filtered["job_title_normalized"].str.lower().str.contains(q) |
            filtered["company"].str.lower().str.contains(q) |
            filtered["description"].str.lower().str.contains(q)
        ]

    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit
    page_data = filtered.iloc[start:end]

    jobs_list = []
    for _, row in page_data.iterrows():
        jobs_list.append({
            "id": int(row["id"]),
            "job_title": str(row["job_title_normalized"]),
            "company": str(row["company"]),
            "location": str(row["location"]),
            "industry": str(row["industry"]),
            "experience_level": str(row["experience_level"]) if pd.notna(row["experience_level"]) else None,
            "salary_min": int(row["salary_min"]) if pd.notna(row["salary_min"]) else None,
            "salary_max": int(row["salary_max"]) if pd.notna(row["salary_max"]) else None,
            "salary_avg": int(row["salary_avg"]) if pd.notna(row["salary_avg"]) else None,
            "description": str(row["description"]) if pd.notna(row["description"]) else "",
            "skills": row["skills_parsed"],
            "posted_date": str(row["posted_date"])
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "jobs": jobs_list
    }

@router.get("/roles")
def get_roles():
    df = get_jobs_df()
    if df is not None:
        roles = sorted(df["job_title_normalized"].unique().tolist())
        return {"roles": roles}
    return {"roles": []}

@router.get("/{job_id}", response_model=JobItem)
def get_job_by_id(job_id: int):
    df = get_jobs_df()
    if df is not None:
        match = df[df["id"] == job_id]
        if not match.empty:
            row = match.iloc[0]
            return {
                "id": int(row["id"]),
                "job_title": str(row["job_title_normalized"]),
                "company": str(row["company"]),
                "location": str(row["location"]),
                "industry": str(row["industry"]),
                "experience_level": str(row["experience_level"]),
                "salary_min": int(row["salary_min"]),
                "salary_max": int(row["salary_max"]),
                "salary_avg": int(row["salary_avg"]),
                "description": str(row["description"]),
                "skills": row["skills_parsed"],
                "posted_date": str(row["posted_date"])
            }
    raise HTTPException(status_code=404, detail="Job posting not found.")
