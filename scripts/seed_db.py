"""
seed_db.py
Seeds the SQLite/PostgreSQL database with:
- Demo users (test@skillverse.ai / password123)
- Skills catalog
- Aggregated monthly demand records
- Forecast projections
"""

import os
import sys
import json
import pandas as pd

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.database.database import SessionLocal, engine, Base
from backend.app.database.models import User, Skill, SkillDemand, Forecast
from backend.app.services.auth_service import get_password_hash

def seed():
    print("[Seed] Creating tables if not existing...", flush=True)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # 1. Seed Demo User
        demo_email = "alex@skillverse.ai"
        user = db.query(User).filter(User.email == demo_email).first()
        if not user:
            print("[Seed] Adding demo user: alex@skillverse.ai", flush=True)
            demo_user = User(
                name="Alex Morgan",
                email=demo_email,
                password_hash=get_password_hash("skillverse123"),
                target_role="Data Scientist",
                current_skills="Python, SQL, Pandas, Git"
            )
            db.add(demo_user)

        # 2. Seed Skills Catalog
        catalog_path = os.path.join("data", "processed", "skill_catalog.json")
        if os.path.exists(catalog_path):
            with open(catalog_path, "r") as f:
                catalog = json.load(f)

            for s_name, s_info in catalog.items():
                existing_skill = db.query(Skill).filter(Skill.skill_name == s_name).first()
                if not existing_skill:
                    db.add(Skill(
                        skill_name=s_name,
                        category=s_info.get("category", "General"),
                        demand_tier=s_info.get("demand_tier", "Medium"),
                        average_salary=s_info.get("average_salary", 110000),
                        percentage_of_jobs=s_info.get("percentage_of_jobs", 0.0),
                        recent_growth_pct=s_info.get("recent_growth_pct", 0.0)
                    ))
            print(f"[Seed] Processed {len(catalog)} skills into DB.", flush=True)

        # 3. Seed Forecasts
        forecast_path = os.path.join("models", "forecasting_models.json")
        if os.path.exists(forecast_path):
            with open(forecast_path, "r") as f:
                forecast_data = json.load(f)

            count = 0
            for s_name, s_data in forecast_data.get("per_skill", {}).items():
                for pt in s_data.get("forecast", []):
                    existing = db.query(Forecast).filter(
                        Forecast.skill_name == s_name,
                        Forecast.period == pt["period"]
                    ).first()
                    if not existing:
                        db.add(Forecast(
                            skill_name=s_name,
                            period=pt["period"],
                            predicted_demand=pt["forecast"],
                            lower_bound=pt["lower_bound"],
                            upper_bound=pt["upper_bound"]
                        ))
                        count += 1
            print(f"[Seed] Added {count} forecast projections into DB.", flush=True)

        db.commit()
        print("[Seed] Database seeding completed successfully!", flush=True)

    except Exception as e:
        db.rollback()
        print(f"[Seed Error] {e}", flush=True)
    finally:
        db.close()

if __name__ == "__main__":
    seed()
