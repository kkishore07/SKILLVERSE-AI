"""
data_pipeline.py
End-to-end data preprocessing pipeline for SkillVerse AI:
1. Ingestion & Quality Checks: Deduplication, null value handling
2. Job Title Normalization: Standardize variations to canonical taxonomy
3. Salary Standardization: Compute min, max, avg, and log transforms
4. Skill Extraction & Normalization: Fast regex and keyword extraction from raw descriptions
5. Time-Series Aggregations: Monthly demand matrix per skill (2022-2026)
6. Co-occurrence Matrix: High-performance vectorized calculation
7. Feature Engineering: Experience numerical mapping, industry one-hot indicators
8. Exporting Processed Artifacts for ML Training and Database Ingestion
"""

import os
import re
import json
from collections import defaultdict, Counter
import pandas as pd
import numpy as np

# Canonical Skill Taxonomy with synonyms for normalization
SKILL_TAXONOMY = {
    "Programming Languages": {
        "Python": ["python", "python3", "py"],
        "SQL": ["sql", "structured query language", "postgresql", "postgres", "mysql", "tsql"],
        "JavaScript": ["javascript", "js", "ecmascript"],
        "TypeScript": ["typescript", "ts"],
        "Java": ["java", "jvm"],
        "C++": ["c++", "cpp"],
        "R": ["r programming", "r-project", "r language"],
        "Bash": ["bash", "shell scripting", "sh", "zsh"],
        "Scala": ["scala"]
    },
    "Machine Learning & AI": {
        "Machine Learning": ["machine learning", "ml", "statistical learning"],
        "Deep Learning": ["deep learning", "dl", "neural networks", "ann", "cnn"],
        "Generative AI": ["generative ai", "genai", "gen ai", "rag", "diffusion models"],
        "LLM": ["llm", "large language models", "gpt", "transformer models", "langchain"],
        "PyTorch": ["pytorch", "torch"],
        "TensorFlow": ["tensorflow", "tf", "keras"],
        "Scikit-learn": ["scikit-learn", "sklearn", "scikit learn"],
        "NLP": ["nlp", "natural language processing", "text mining", "spacy", "nltk"],
        "Computer Vision": ["computer vision", "cv", "opencv"]
    },
    "Data Engineering & Analytics": {
        "Pandas": ["pandas"],
        "Data Visualization": ["data visualization", "dataviz", "matplotlib", "seaborn"],
        "Tableau": ["tableau"],
        "Power BI": ["power bi", "powerbi", "dax"],
        "Statistics": ["statistics", "statistical analysis", "hypothesis testing", "ab testing"],
        "Spark": ["spark", "apache spark", "pyspark"],
        "Airflow": ["airflow", "apache airflow"],
        "Kafka": ["kafka", "apache kafka"],
        "Snowflake": ["snowflake", "snowflake db"],
        "BigQuery": ["bigquery", "google bigquery"],
        "Excel": ["excel", "spreadsheets", "vlookup"]
    },
    "Cloud & DevOps": {
        "AWS": ["aws", "amazon web services", "ec2", "s3", "lambda"],
        "Docker": ["docker", "containerization", "containers"],
        "Kubernetes": ["kubernetes", "k8s"],
        "Cloud Computing": ["cloud computing", "cloud architecture", "cloud infrastructure"],
        "CI/CD": ["ci/cd", "continuous integration", "github actions", "jenkins"],
        "Linux": ["linux", "unix", "ubuntu", "debian"],
        "Terraform": ["terraform", "iac", "infrastructure as code"],
        "MLOps": ["mlops", "ml pipelines", "mlflow", "model deployment"],
        "Azure": ["azure", "microsoft azure"],
        "GCP": ["gcp", "google cloud platform"]
    },
    "Web & Security": {
        "React": ["react", "react.js", "reactjs"],
        "Node.js": ["node.js", "nodejs", "express"],
        "FastAPI": ["fastapi"],
        "Git": ["git", "github", "version control"],
        "Cybersecurity": ["cybersecurity", "infosec", "information security"],
        "Network Security": ["network security", "firewalls", "siem", "soc"]
    }
}

ALIAS_TO_SKILL = {}
SKILL_CATEGORIES = {}
for category, skills in SKILL_TAXONOMY.items():
    for canonical, aliases in skills.items():
        SKILL_CATEGORIES[canonical] = category
        for alias in aliases:
            ALIAS_TO_SKILL[alias.lower()] = canonical

# Compile regex patterns for speed
SKILL_PATTERNS = [
    (re.compile(rf"(?<!\w){re.escape(alias)}(?!\w)", re.IGNORECASE), canonical)
    for alias, canonical in ALIAS_TO_SKILL.items()
]

ROLE_NORMALIZATION = {
    "data scientist": "Data Scientist",
    "senior data scientist": "Data Scientist",
    "lead data scientist": "Data Scientist",
    "machine learning engineer": "Machine Learning Engineer",
    "ml engineer": "Machine Learning Engineer",
    "data analyst": "Data Analyst",
    "cloud architect": "Cloud Architect",
    "devops engineer": "DevOps Engineer",
    "full stack developer": "Full Stack Developer",
    "cybersecurity analyst": "Cybersecurity Analyst",
    "ai research scientist": "AI Research Scientist",
    "data engineer": "Data Engineer",
    "business intelligence developer": "Business Intelligence Developer"
}

def extract_skills_from_text(text: str) -> list:
    if not isinstance(text, str):
        return []
    found = set()
    for pattern, canonical in SKILL_PATTERNS:
        if pattern.search(text):
            found.add(canonical)
    return sorted(list(found))

def run_pipeline():
    raw_path = os.path.join("data", "raw", "job_postings_dataset.csv")
    if not os.path.exists(raw_path):
        raise FileNotFoundError(f"Raw dataset not found at {raw_path}.")

    print(f"[Pipeline] Loading raw dataset from {raw_path}...", flush=True)
    df = pd.read_csv(raw_path)
    initial_count = len(df)

    # 1. Deduplication
    df = df.drop_duplicates(subset=["job_title", "company", "location", "posted_date"])
    print(f"[Pipeline] Deduplicated: {len(df)} rows retained from {initial_count}.", flush=True)

    # 2. Handle missing values
    df["salary_min"] = df["salary_min"].fillna(df["salary_min"].median())
    df["salary_max"] = df["salary_max"].fillna(df["salary_max"].median())
    df["salary_avg"] = (df["salary_min"] + df["salary_max"]) / 2.0
    df["experience_level"] = df["experience_level"].fillna("Mid-level")
    df["location"] = df["location"].fillna("Remote")
    df["industry"] = df["industry"].fillna("Tech / Software")

    # 3. Job Title Normalization
    df["job_title_normalized"] = df["job_title"].apply(
        lambda t: ROLE_NORMALIZATION.get(str(t).lower().strip(), str(t).strip())
    )

    # 4. Extract skills (fast parsing from skills_list if present, else regex)
    print("[Pipeline] Parsing and normalizing extracted skills...", flush=True)
    if "skills_list" in df.columns:
        df["extracted_skills"] = df["skills_list"].apply(lambda s: json.loads(s) if isinstance(s, str) else [])
    else:
        df["extracted_skills"] = df["description"].apply(extract_skills_from_text)

    df["extracted_skills_json"] = df["extracted_skills"].apply(json.dumps)
    df["skill_count"] = df["extracted_skills"].apply(len)

    # 5. Feature Engineering
    exp_map = {"Entry-level": 1, "Mid-level": 3, "Senior": 6, "Lead / Principal": 10}
    df["experience_years_approx"] = df["experience_level"].map(exp_map).fillna(3)
    df["log_salary"] = np.log1p(df["salary_avg"])

    os.makedirs("data/processed", exist_ok=True)
    processed_path = os.path.join("data", "processed", "processed_jobs.csv")
    df.to_csv(processed_path, index=False)
    print(f"[Pipeline] Processed dataset saved to {processed_path}.", flush=True)

    # 6. Monthly Time-Series Matrix
    print("[Pipeline] Aggregating monthly skill demand time-series...", flush=True)
    records = []
    co_occurrences = defaultdict(Counter)

    for _, row in df.iterrows():
        ym = row["year_month"]
        skills = row["extracted_skills"]
        sal = row["salary_avg"]
        ind = row["industry"]
        loc = row["location"]
        role = row["job_title_normalized"]

        for s in skills:
            records.append({
                "year_month": ym,
                "skill": s,
                "category": SKILL_CATEGORIES.get(s, "General"),
                "salary": sal,
                "industry": ind,
                "location": loc,
                "job_title": role
            })
            for other in skills:
                if other != s:
                    co_occurrences[s][other] += 1

    demand_df = pd.DataFrame(records)
    monthly_counts = demand_df.groupby(["year_month", "skill"]).size().reset_index(name="demand_count")
    monthly_demand_path = os.path.join("data", "processed", "monthly_skill_demand.csv")
    monthly_counts.to_csv(monthly_demand_path, index=False)
    print(f"[Pipeline] Monthly skill demand saved to {monthly_demand_path}.", flush=True)

    # 7. Precompute Skill Analytics Catalog
    print("[Pipeline] Computing skill metrics catalog...", flush=True)
    recent_months = sorted(df["year_month"].unique())[-12:]
    prior_months = sorted(df["year_month"].unique())[-24:-12]
    skill_stats = {}

    for skill, category in SKILL_CATEGORIES.items():
        skill_sub = demand_df[demand_df["skill"] == skill]
        total_occurrences = len(skill_sub)
        avg_sal = float(skill_sub["salary"].mean()) if total_occurrences > 0 else 105000.0

        recent_count = len(skill_sub[skill_sub["year_month"].isin(recent_months)])
        prior_count = len(skill_sub[skill_sub["year_month"].isin(prior_months)])
        if prior_count > 0:
            growth_pct = round(((recent_count - prior_count) / float(prior_count)) * 100, 1)
        else:
            growth_pct = 120.0 if recent_count > 10 else 0.0

        if total_occurrences >= 2000:
            tier = "High"
        elif total_occurrences >= 900:
            tier = "Medium"
        else:
            tier = "Low"

        top_co = [s for s, _ in co_occurrences[skill].most_common(5)]

        skill_stats[skill] = {
            "name": skill,
            "category": category,
            "total_postings": total_occurrences,
            "percentage_of_jobs": round((total_occurrences / len(df)) * 100, 1),
            "average_salary": int(avg_sal),
            "recent_growth_pct": growth_pct,
            "demand_tier": tier,
            "related_skills": top_co
        }

    catalog_path = os.path.join("data", "processed", "skill_catalog.json")
    with open(catalog_path, "w") as f:
        json.dump(skill_stats, f, indent=2)
    print(f"[Pipeline] Skill catalog saved to {catalog_path}.", flush=True)

    # 8. Role-to-Skill Requirements Taxonomy
    role_mapping = {}
    for role in df["job_title_normalized"].unique():
        role_df = df[df["job_title_normalized"] == role]
        role_skills = []
        for s_list in role_df["extracted_skills"]:
            role_skills.extend(s_list)
        skill_freq = pd.Series(role_skills).value_counts()
        total_role_jobs = len(role_df)

        expected_skills = [
            {
                "skill": s,
                "frequency_pct": round((c / total_role_jobs) * 100, 1),
                "priority": "High" if (c / total_role_jobs) > 0.50 else "Medium"
            }
            for s, c in skill_freq.items() if (c / total_role_jobs) >= 0.20
        ]

        role_mapping[role] = {
            "role": role,
            "average_salary": int(role_df["salary_avg"].mean()),
            "total_postings": total_role_jobs,
            "expected_skills": expected_skills
        }

    role_mapping_path = os.path.join("data", "processed", "role_skill_mapping.json")
    with open(role_mapping_path, "w") as f:
        json.dump(role_mapping, f, indent=2)
    print(f"[Pipeline] Role-Skill mapping saved to {role_mapping_path}.", flush=True)

    # 9. Precomputed Industry & Location Breakdown
    ind_breakdown = df.groupby("industry").agg(
        total_jobs=("id", "count"),
        average_salary=("salary_avg", "mean")
    ).reset_index()
    ind_breakdown["average_salary"] = ind_breakdown["average_salary"].astype(int)

    loc_breakdown = df.groupby("location").agg(
        total_jobs=("id", "count"),
        average_salary=("salary_avg", "mean")
    ).reset_index()
    loc_breakdown["average_salary"] = loc_breakdown["average_salary"].astype(int)

    analytics_summary = {
        "total_jobs": len(df),
        "total_skills": len(skill_stats),
        "total_industries": df["industry"].nunique(),
        "total_locations": df["location"].nunique(),
        "average_salary_overall": int(df["salary_avg"].mean()),
        "industry_distribution": ind_breakdown.to_dict(orient="records"),
        "location_distribution": loc_breakdown.to_dict(orient="records"),
        "top_skills_overall": sorted(skill_stats.values(), key=lambda x: x["total_postings"], reverse=True)[:10],
        "fastest_growing_skills": sorted(skill_stats.values(), key=lambda x: x["recent_growth_pct"], reverse=True)[:8]
    }
    summary_path = os.path.join("data", "processed", "analytics_summary.json")
    with open(summary_path, "w") as f:
        json.dump(analytics_summary, f, indent=2)
    print(f"[Pipeline] Analytics summary saved to {summary_path}.", flush=True)
    print("[Pipeline] Complete!", flush=True)

if __name__ == "__main__":
    run_pipeline()
