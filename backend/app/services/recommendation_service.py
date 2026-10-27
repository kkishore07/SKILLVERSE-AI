import os
import json
import joblib
import pandas as pd
from typing import Dict, Any, List, Tuple
from backend.app.services.forecast_service import ForecastService

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "processed")
MODELS_DIR = os.path.join(BASE_DIR, "models")

class RecommendationService:
    _role_mapping = None
    _skill_catalog = None
    _salary_model = None

    @classmethod
    def _load_data(cls):
        if cls._role_mapping is None:
            with open(os.path.join(DATA_DIR, "role_skill_mapping.json"), "r") as f:
                cls._role_mapping = json.load(f)
        if cls._skill_catalog is None:
            with open(os.path.join(DATA_DIR, "skill_catalog.json"), "r") as f:
                cls._skill_catalog = json.load(f)
        if cls._salary_model is None:
            model_file = os.path.join(MODELS_DIR, "salary_predictor.pkl")
            if os.path.exists(model_file):
                cls._salary_model = joblib.load(model_file)

    @classmethod
    def get_available_roles(cls) -> List[str]:
        cls._load_data()
        return list(cls._role_mapping.keys())

    @classmethod
    def analyze_skill_gap(cls, target_role: str, user_skills: List[str]) -> Dict[str, Any]:
        cls._load_data()
        
        # Match target role (case-insensitive)
        matched_role = None
        for role_name in cls._role_mapping:
            if role_name.lower() == target_role.lower():
                matched_role = role_name
                break
        
        if not matched_role:
            matched_role = list(cls._role_mapping.keys())[0]

        role_info = cls._role_mapping[matched_role]
        expected_skills_data = role_info["expected_skills"]
        expected_skill_names = [item["skill"] for item in expected_skills_data]

        # Normalize user skills (strip, case-insensitive mapping)
        user_skills_clean = [s.strip() for s in user_skills if s.strip()]
        user_skills_lower = {s.lower(): s for s in user_skills_clean}

        matched = []
        missing = []

        for exp_item in expected_skills_data:
            s_name = exp_item["skill"]
            if s_name.lower() in user_skills_lower:
                matched.append(s_name)
            else:
                missing.append(exp_item)

        total_expected = max(len(expected_skill_names), 1)
        match_percentage = round((len(matched) / total_expected) * 100, 1)

        # Generate prioritized learning recommendations with actual demand data
        recommendations = []
        for miss in missing:
            s_name = miss["skill"]
            catalog_entry = cls._skill_catalog.get(s_name, {})
            forecast_entry = ForecastService.get_skill_forecast(s_name)

            curr_demand = catalog_entry.get("demand_tier", "Medium")
            future_trend = forecast_entry.get("trend_direction", "Stable") if forecast_entry else "Stable"
            avg_salary = catalog_entry.get("average_salary", role_info["average_salary"])
            category = catalog_entry.get("category", "General")

            # Determine Priority based on demand + trend + role importance
            freq_pct = miss.get("frequency_pct", 50.0)
            if (curr_demand == "High" or future_trend == "Increasing") and freq_pct >= 40:
                priority = "High"
            elif curr_demand == "Medium" or freq_pct >= 25:
                priority = "Medium"
            else:
                priority = "Standard"

            reasoning = (
                f"Essential for {matched_role} ({freq_pct}% of postings). "
                f"Currently in {curr_demand} demand with an {future_trend.lower()} trajectory. "
                f"Boosts market competitiveness in {category}."
            )

            recommendations.append({
                "skill": s_name,
                "category": category,
                "current_demand": curr_demand,
                "future_trend": future_trend,
                "average_salary": avg_salary,
                "priority": priority,
                "reasoning": reasoning
            })

        # Sort recommendations: High priority first, then average salary
        priority_weights = {"High": 3, "Medium": 2, "Standard": 1}
        recommendations.sort(key=lambda x: (priority_weights.get(x["priority"], 0), x["average_salary"]), reverse=True)

        return {
            "target_role": matched_role,
            "current_skills": user_skills_clean,
            "matched_skills": matched,
            "missing_skills": [m["skill"] for m in missing],
            "skill_match_percentage": match_percentage,
            "target_role_avg_salary": role_info["average_salary"],
            "learning_recommendations": recommendations
        }

    @classmethod
    def predict_salary(cls, job_title: str, experience_level: str, location: str, industry: str, skills: List[str]) -> Dict[str, Any]:
        cls._load_data()
        
        # Load metrics to report R2
        with open(os.path.join(MODELS_DIR, "salary_metrics.json"), "r") as f:
            metrics = json.load(f)

        top_10 = metrics.get("top_skills_tracked", [])
        skills_set = set([s.lower() for s in skills])

        row_data = {
            "job_title_normalized": job_title,
            "experience_level": experience_level,
            "location": location,
            "industry": industry,
            "skill_count": len(skills)
        }

        for s in top_10:
            row_data[f"has_{s.lower().replace(' ', '_')}"] = 1 if s.lower() in skills_set else 0

        input_df = pd.DataFrame([row_data])

        if cls._salary_model:
            predicted = float(cls._salary_model.predict(input_df)[0])
        else:
            predicted = 125000.0

        # Create confidence salary bounds (using model's RMSE)
        rmse = metrics.get("rmse", 8500.0)
        salary_min = max(40000, int(predicted - 1.25 * rmse))
        salary_max = int(predicted + 1.25 * rmse)

        return {
            "predicted_salary": int(predicted),
            "salary_range_min": salary_min,
            "salary_range_max": salary_max,
            "predicted_salary_lpa": round(predicted / 10000.0, 2),
            "salary_range_min_lpa": round(salary_min / 10000.0, 2),
            "salary_range_max_lpa": round(salary_max / 10000.0, 2),
            "confidence_r2": metrics.get("r2_score", 0.97),
            "factors": {
                "role": job_title,
                "experience": experience_level,
                "location": location,
                "industry": industry,
                "skills_evaluated": len(skills)
            }
        }
