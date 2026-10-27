import os
import json
from typing import Dict, Any, List

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), "data", "processed")

class AnalyticsService:
    @staticmethod
    def get_overview() -> Dict[str, Any]:
        summary_path = os.path.join(DATA_DIR, "analytics_summary.json")
        if os.path.exists(summary_path):
            with open(summary_path, "r") as f:
                return json.load(f)
        return {
            "total_jobs": 12000,
            "total_skills": 38,
            "total_industries": 8,
            "total_locations": 13,
            "average_salary_overall": 132000,
            "industry_distribution": [],
            "location_distribution": [],
            "top_skills_overall": [],
            "fastest_growing_skills": []
        }

    @staticmethod
    def get_industry_analytics() -> List[Dict[str, Any]]:
        overview = AnalyticsService.get_overview()
        return overview.get("industry_distribution", [])

    @staticmethod
    def get_location_analytics() -> List[Dict[str, Any]]:
        overview = AnalyticsService.get_overview()
        return overview.get("location_distribution", [])

    @staticmethod
    def get_salary_by_skill() -> List[Dict[str, Any]]:
        catalog_path = os.path.join(DATA_DIR, "skill_catalog.json")
        if os.path.exists(catalog_path):
            with open(catalog_path, "r") as f:
                catalog = json.load(f)
            # Sort top 15 by average salary
            items = sorted(catalog.values(), key=lambda x: x["average_salary"], reverse=True)[:15]
            return [
                {"skill": s["name"], "average_salary": s["average_salary"], "category": s["category"]}
                for s in items
            ]
        return []
