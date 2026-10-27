"""
generate_dataset.py
Generates a realistic multi-year job market dataset (2022-2026) with 12,000+ postings
across 54 consecutive months, capturing authentic skill trajectories:
- Rising trends: Generative AI, LLMs, MLOps, PyTorch, Kubernetes, Rust
- Stable high-demand: Python, SQL, AWS, Docker, React, TypeScript
- Legacy / mature: Java, C++, Bash, Linux, Excel
"""

import os
import random
import json
import pandas as pd
import numpy as np
from datetime import datetime

# Set deterministic seed for academic reproducibility
random.seed(42)
np.random.seed(42)

ROLES = {
    "Data Scientist": {
        "core_skills": ["Python", "SQL", "Machine Learning", "Statistics", "Pandas", "Scikit-learn"],
        "bonus_skills": ["PyTorch", "Deep Learning", "Data Visualization", "AWS", "BigQuery", "Docker", "Generative AI", "NLP", "Tableau"],
        "salary_range": (95000, 175000),
        "industry_bias": ["Tech / Software", "Finance / FinTech", "Healthcare & BioTech", "E-Commerce"]
    },
    "Machine Learning Engineer": {
        "core_skills": ["Python", "Machine Learning", "PyTorch", "Docker", "MLOps", "Scikit-learn"],
        "bonus_skills": ["Kubernetes", "AWS", "Deep Learning", "Generative AI", "LLM", "TensorFlow", "FastAPI", "C++", "SQL"],
        "salary_range": (120000, 210000),
        "industry_bias": ["Tech / Software", "Aerospace", "Finance / FinTech"]
    },
    "Data Analyst": {
        "core_skills": ["SQL", "Excel", "Tableau", "Python", "Data Visualization"],
        "bonus_skills": ["Power BI", "Statistics", "Pandas", "R", "BigQuery", "Snowflake", "Business Intelligence"],
        "salary_range": (65000, 115000),
        "industry_bias": ["Finance / FinTech", "Consulting", "E-Commerce", "Healthcare & BioTech"]
    },
    "Cloud Architect": {
        "core_skills": ["Cloud Computing", "AWS", "Terraform", "Kubernetes", "Docker"],
        "bonus_skills": ["Azure", "GCP", "Linux", "Cybersecurity", "Python", "CI/CD", "System Architecture", "Microservices"],
        "salary_range": (135000, 225000),
        "industry_bias": ["Tech / Software", "Finance / FinTech", "Telecommunications"]
    },
    "DevOps Engineer": {
        "core_skills": ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS", "Terraform"],
        "bonus_skills": ["Python", "Bash", "Prometheus", "Git", "Azure", "Cloud Computing", "Cybersecurity"],
        "salary_range": (105000, 175000),
        "industry_bias": ["Tech / Software", "E-Commerce", "Finance / FinTech"]
    },
    "Full Stack Developer": {
        "core_skills": ["JavaScript", "React", "Node.js", "SQL", "Git", "HTML/CSS"],
        "bonus_skills": ["TypeScript", "Python", "Docker", "FastAPI", "MongoDB", "PostgreSQL", "Next.js", "Tailwind CSS"],
        "salary_range": (90000, 160000),
        "industry_bias": ["Tech / Software", "E-Commerce", "Media & Entertainment"]
    },
    "Cybersecurity Analyst": {
        "core_skills": ["Cybersecurity", "Network Security", "Linux", "Python", "SIEM"],
        "bonus_skills": ["Cloud Security", "Cryptography", "Docker", "Bash", "Firewalls", "Threat Analysis"],
        "salary_range": (85000, 155000),
        "industry_bias": ["Finance / FinTech", "Healthcare & BioTech", "Telecommunications", "Consulting"]
    },
    "AI Research Scientist": {
        "core_skills": ["Deep Learning", "PyTorch", "Python", "Mathematics", "Machine Learning"],
        "bonus_skills": ["Generative AI", "LLM", "NLP", "Computer Vision", "TensorFlow", "C++", "Reinforcement Learning"],
        "salary_range": (145000, 250000),
        "industry_bias": ["Tech / Software", "Healthcare & BioTech", "Aerospace"]
    },
    "Data Engineer": {
        "core_skills": ["Python", "SQL", "Spark", "AWS", "Docker", "Data Pipelines"],
        "bonus_skills": ["Airflow", "Kafka", "Snowflake", "BigQuery", "Kubernetes", "PostgreSQL", "Scala"],
        "salary_range": (110000, 185000),
        "industry_bias": ["Tech / Software", "Finance / FinTech", "E-Commerce"]
    },
    "Business Intelligence Developer": {
        "core_skills": ["Power BI", "SQL", "Tableau", "Data Modeling", "Excel"],
        "bonus_skills": ["Data Warehousing", "Python", "Snowflake", "DAX", "ETL", "Statistics"],
        "salary_range": (75000, 130000),
        "industry_bias": ["Finance / FinTech", "Consulting", "Retail", "Healthcare & BioTech"]
    }
}

COMPANIES = [
    "Google", "Microsoft", "Amazon AWS", "Meta", "Apple", "Netflix", "OpenAI",
    "Stripe", "Snowflake", "Databricks", "Salesforce", "Cisco", "Uber", "Spotify",
    "JPMorgan Chase", "Goldman Sachs", "Pfizer", "Moderna", "Lockheed Martin",
    "Adobe", "Oracle", "Palantir Technologies", "Cloudflare", "Shopify", "Airbnb"
]

LOCATIONS = [
    "San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX",
    "Boston, MA", "Chicago, IL", "Remote", "London, UK", "Toronto, Canada",
    "Bangalore, India", "Denver, CO", "Atlanta, GA", "San Diego, CA"
]

EXPERIENCE_LEVELS = ["Entry-level", "Mid-level", "Senior", "Lead / Principal"]

def get_skill_trend_factor(skill: str, month_idx: int) -> float:
    t = month_idx / 53.0
    if skill in ["Generative AI", "LLM"]:
        if month_idx < 14:
            return 0.05
        return 0.05 + 0.95 * ((month_idx - 14) / 39.0) ** 1.8
    elif skill in ["MLOps", "PyTorch", "Kubernetes"]:
        return 0.25 + 0.75 * (t ** 1.2)
    elif skill in ["Python", "SQL", "AWS", "Docker", "TypeScript", "FastAPI"]:
        return 0.65 + 0.35 * t
    elif skill in ["Excel", "Java", "C++", "Bash"]:
        return 0.85 - 0.15 * t
    else:
        return 0.40 + 0.40 * t

def generate_dataset(num_records: int = 12000):
    start_date = datetime(2022, 1, 1)
    rows = []

    months = []
    current = start_date
    for m in range(54):
        months.append((current.year, current.month))
        next_month = current.month % 12 + 1
        next_year = current.year + (1 if current.month == 12 else 0)
        current = datetime(next_year, next_month, 1)

    print(f"Generating {num_records} job postings across 54 months (2022-2026)...")

    for i in range(1, num_records + 1):
        role_name = random.choice(list(ROLES.keys()))
        role_data = ROLES[role_name]

        month_idx = int(np.random.beta(a=1.4, b=1.1) * 53)
        month_idx = max(0, min(53, month_idx))
        year, month = months[month_idx]
        day = random.randint(1, 28)
        posted_date = f"{year}-{month:02d}-{day:02d}"

        exp = random.choice(EXPERIENCE_LEVELS)
        exp_multiplier = {
            "Entry-level": 0.78,
            "Mid-level": 1.0,
            "Senior": 1.28,
            "Lead / Principal": 1.55
        }[exp]

        base_min, base_max = role_data["salary_range"]
        noise = random.uniform(-0.08, 0.08)
        salary_min = int(base_min * exp_multiplier * (1 + noise))
        salary_max = int(base_max * exp_multiplier * (1 + noise))
        salary_avg = int((salary_min + salary_max) / 2)

        company = random.choice(COMPANIES)
        location = random.choice(LOCATIONS)
        industry = random.choice(role_data["industry_bias"])

        selected_skills = list(role_data["core_skills"])
        for b_skill in role_data["bonus_skills"]:
            trend_prob = get_skill_trend_factor(b_skill, month_idx)
            if random.random() < (0.35 + 0.45 * trend_prob):
                selected_skills.append(b_skill)

        selected_skills = list(dict.fromkeys(selected_skills))

        skills_str = ", ".join(selected_skills)
        description = (
            f"We are hiring a passionate {exp} {role_name} to join our engineering team at {company} in {location}. "
            f"The candidate will drive impactful data-driven solutions in our {industry} division. "
            f"Core responsibilities include architecting scalable platforms and collaborating with cross-functional teams. "
            f"Required technical skills and toolsets: {skills_str}. "
            f"Experience with agile workflows, version control, and production systems is strongly desired."
        )

        rows.append({
            "id": i,
            "job_title": role_name,
            "company": company,
            "location": location,
            "industry": industry,
            "experience_level": exp,
            "salary_min": salary_min,
            "salary_max": salary_max,
            "salary_avg": salary_avg,
            "skills": skills_str,
            "skills_list": json.dumps(selected_skills),
            "description": description,
            "posted_date": posted_date,
            "year": year,
            "month": month,
            "year_month": f"{year}-{month:02d}"
        })

    df = pd.DataFrame(rows)
    os.makedirs("data/raw", exist_ok=True)
    raw_path = os.path.join("data", "raw", "job_postings_dataset.csv")
    df.to_csv(raw_path, index=False)
    print(f"Dataset saved to {raw_path} ({len(df)} records).")
    return df

if __name__ == "__main__":
    generate_dataset(12000)
