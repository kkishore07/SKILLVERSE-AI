import os
import json
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from backend.app.schemas.schemas import SkillItem

router = APIRouter(prefix="/api/skills", tags=["Skills"])

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data", "processed")

def _load_catalog():
    path = os.path.join(DATA_DIR, "skill_catalog.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            return json.load(f)
    return {}

@router.get("", response_model=List[SkillItem])
def get_all_skills(
    category: Optional[str] = None,
    demand_tier: Optional[str] = None,
    search: Optional[str] = None
):
    catalog = _load_catalog()
    results = list(catalog.values())

    if category:
        results = [s for s in results if s.get("category", "").lower() == category.lower()]
    if demand_tier:
        results = [s for s in results if s.get("demand_tier", "").lower() == demand_tier.lower()]
    if search:
        s_query = search.lower()
        results = [s for s in results if s_query in s.get("name", "").lower()]

    # Sort descending by total postings
    results.sort(key=lambda x: x.get("total_postings", 0), reverse=True)
    return results

@router.get("/top", response_model=List[SkillItem])
def get_top_skills(limit: int = Query(10, ge=1, le=50)):
    catalog = _load_catalog()
    items = list(catalog.values())
    items.sort(key=lambda x: x.get("total_postings", 0), reverse=True)
    return items[:limit]

@router.get("/categories")
def get_categories():
    catalog = _load_catalog()
    cats = sorted(list(set(s.get("category") for s in catalog.values() if s.get("category"))))
    return {"categories": cats}

@router.get("/{skill_name}", response_model=SkillItem)
def get_skill_by_name(skill_name: str):
    catalog = _load_catalog()
    for name, data in catalog.items():
        if name.lower() == skill_name.lower():
            return data
    raise HTTPException(status_code=404, detail=f"Skill '{skill_name}' not found.")
