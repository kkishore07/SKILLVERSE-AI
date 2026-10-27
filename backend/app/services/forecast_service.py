import os
import json
from typing import Dict, Any, Optional, List

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
MODELS_DIR = os.path.join(BASE_DIR, "models")

class ForecastService:
    _cache = None

    @classmethod
    def _load_forecast_data(cls) -> Dict[str, Any]:
        if cls._cache is None:
            forecast_path = os.path.join(MODELS_DIR, "forecasting_models.json")
            if os.path.exists(forecast_path):
                with open(forecast_path, "r") as f:
                    cls._cache = json.load(f)
            else:
                cls._cache = {"models_summary": {}, "per_skill": {}}
        return cls._cache

    @classmethod
    def get_skill_forecast(cls, skill_name: str) -> Optional[Dict[str, Any]]:
        data = cls._load_forecast_data()
        per_skill = data.get("per_skill", {})
        
        # Case-insensitive lookup
        for s_key, s_val in per_skill.items():
            if s_key.lower() == skill_name.lower():
                return s_val
        return None

    @classmethod
    def get_all_skills_with_forecast(cls) -> List[str]:
        data = cls._load_forecast_data()
        return list(data.get("per_skill", {}).keys())

    @classmethod
    def get_trending_forecasts(cls) -> List[Dict[str, Any]]:
        data = cls._load_forecast_data()
        per_skill = list(data.get("per_skill", {}).values())
        # Sort by projected_growth_pct descending
        return sorted(per_skill, key=lambda x: x.get("projected_growth_pct", 0), reverse=True)

    @classmethod
    def get_evaluation_report(cls) -> Dict[str, Any]:
        report_path = os.path.join(MODELS_DIR, "model_evaluation_report.json")
        if os.path.exists(report_path):
            with open(report_path, "r") as f:
                return json.load(f)
        return {}
