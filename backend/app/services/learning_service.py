import os
import json
import re
from typing import Dict, Any, List, Optional
from backend.app.services.learning_resources_data import (
    LEARNING_CATALOG,
    DEFAULT_RESOURCES,
    ROLE_ROADMAP_TEMPLATES,
    ROLE_INTERVIEW_QUESTIONS
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
DATA_DIR = os.path.join(BASE_DIR, "data", "processed")

class LearningService:
    _role_mapping = None
    _skill_catalog = None

    @classmethod
    def _load_data(cls):
        if cls._role_mapping is None:
            with open(os.path.join(DATA_DIR, "role_skill_mapping.json"), "r") as f:
                cls._role_mapping = json.load(f)
        if cls._skill_catalog is None:
            with open(os.path.join(DATA_DIR, "skill_catalog.json"), "r") as f:
                cls._skill_catalog = json.load(f)

    @classmethod
    def get_skill_resources(cls, skill_name: str) -> Dict[str, Any]:
        cls._load_data()
        
        # Match skill case-insensitively
        matched_name = skill_name
        catalog_info = None
        for s_name, data in cls._skill_catalog.items():
            if s_name.lower() == skill_name.lower():
                matched_name = s_name
                catalog_info = data
                break
        
        if not catalog_info:
            catalog_info = {
                "category": "Technology & Tooling",
                "demand_tier": "Medium",
                "average_salary": 145000
            }

        # Check if we have specific catalog entry
        if matched_name in LEARNING_CATALOG:
            item = LEARNING_CATALOG[matched_name]
            return {
                "skill_name": matched_name,
                "category": catalog_info.get("category", item.get("category", "General")),
                "demand_tier": catalog_info.get("demand_tier", item.get("demand_tier", "Medium")),
                "average_salary": catalog_info.get("average_salary", item.get("average_salary", 150000)),
                "courses": item.get("courses", []),
                "youtube_videos": item.get("youtube_videos", []),
                "documentation": item.get("documentation", []),
                "project_ideas": item.get("project_ideas", [])
            }

        # Generate personalized fallback from template
        category = catalog_info.get("category", "General")
        courses = [
            {
                "title": c["title"].format(skill=matched_name),
                "platform": c["platform"],
                "instructor": c["instructor"],
                "rating": c["rating"],
                "duration": c["duration"],
                "level": c["level"],
                "is_free": c["is_free"],
                "url": c["url"].format(skill=matched_name.replace(" ", "+")),
                "description": c["description"].format(skill=matched_name)
            }
            for c in DEFAULT_RESOURCES["courses"]
        ]
        
        youtube_videos = [
            {
                "title": y["title"].format(skill=matched_name),
                "channel": y["channel"],
                "duration": y["duration"],
                "video_id": y["video_id"],
                "url": y["url"].format(skill=matched_name.replace(" ", "+")),
                "views": y["views"],
                "topics": [t.format(skill=matched_name) if "{skill}" in t else t for t in y["topics"]]
            }
            for y in DEFAULT_RESOURCES["youtube_videos"]
        ]

        documentation = [
            {
                "title": d["title"].format(skill=matched_name),
                "provider": d["provider"].format(skill=matched_name),
                "url": d["url"].format(skill=matched_name.replace(" ", "+")),
                "type": d["type"]
            }
            for d in DEFAULT_RESOURCES["documentation"]
        ]

        project_ideas = [
            {
                "title": p["title"].format(skill=matched_name),
                "difficulty": p["difficulty"],
                "description": p["description"].format(skill=matched_name),
                "deliverables": p["deliverables"],
                "tech_stack": [t.format(skill=matched_name) if "{skill}" in t else t for t in p["tech_stack"]]
            }
            for p in DEFAULT_RESOURCES["project_ideas"]
        ]

        return {
            "skill_name": matched_name,
            "category": category,
            "demand_tier": catalog_info.get("demand_tier", "Medium"),
            "average_salary": catalog_info.get("average_salary", 145000),
            "courses": courses,
            "youtube_videos": youtube_videos,
            "documentation": documentation,
            "project_ideas": project_ideas
        }

    @classmethod
    def get_all_resources(cls, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        cls._load_data()
        results = []
        for skill_name in cls._skill_catalog:
            res = cls.get_skill_resources(skill_name)
            if category and category.lower() != "all" and res["category"].lower() != category.lower():
                continue
            if search and search.lower() not in skill_name.lower() and search.lower() not in res["category"].lower():
                continue
            results.append(res)
        return results

    @classmethod
    def generate_career_roadmap(
        cls,
        target_role: str,
        user_skills: List[str],
        user_progress: Optional[Dict[str, str]] = None,
        timeline_weeks: int = 12,
        weekly_hours: int = 10
    ) -> Dict[str, Any]:
        cls._load_data()
        if user_progress is None:
            user_progress = {}

        # Match role
        matched_role = None
        for r_name in cls._role_mapping:
            if r_name.lower() == target_role.lower():
                matched_role = r_name
                break
        if not matched_role:
            matched_role = list(cls._role_mapping.keys())[0]

        role_info = cls._role_mapping[matched_role]
        expected_skills_data = role_info.get("expected_skills", [])
        
        # User skills normalized
        user_skills_clean = [s.strip().lower() for s in user_skills if s.strip()]
        
        # Determine status for each skill
        annotated_skills = []
        mastered_count = 0
        in_progress_count = 0
        pending_count = 0

        for exp in expected_skills_data:
            s_name = exp["skill"]
            s_lower = s_name.lower()
            freq_pct = exp.get("frequency_pct", 50.0)
            priority = exp.get("priority", "Standard")

            cat_info = cls._skill_catalog.get(s_name, {})
            category = cat_info.get("category", "Core Tools")
            avg_salary = cat_info.get("average_salary", role_info.get("average_salary", 150000))
            
            # Progress status resolution
            explicit_status = user_progress.get(s_name)
            if explicit_status in ["Mastered", "In Progress", "To Learn"]:
                status = explicit_status
            elif s_lower in user_skills_clean:
                status = "Mastered"
            else:
                status = "To Learn"

            if status == "Mastered":
                mastered_count += 1
            elif status == "In Progress":
                in_progress_count += 1
            else:
                pending_count += 1

            # Estimated study hours based on priority and tier
            est_hours = 25 if priority == "High" else 15

            annotated_skills.append({
                "skill": s_name,
                "category": category,
                "frequency_pct": freq_pct,
                "priority": priority,
                "average_salary": avg_salary,
                "status": status,
                "is_gap": (status != "Mastered"),
                "estimated_hours": est_hours
            })

        total_skills = max(len(annotated_skills), 1)
        readiness_score = round(((mastered_count + 0.5 * in_progress_count) / total_skills) * 100, 1)
        total_estimated_hours = sum(s["estimated_hours"] for s in annotated_skills if s["status"] != "Mastered")

        # Build 4 Phases:
        # 1: Foundations & Core Tooling (Programming, SQL, Bash)
        # 2: Core Engineering & Data Pipelines (Frameworks, Data tools)
        # 3: Advanced Domain Modeling & Architecture (Deep Learning, Cloud, Advanced APIs)
        # 4: Production, MLOps & Capstone (Docker, K8s, CI/CD, Serving)
        phase_categories = [
            ("Phase 1: Foundations & Prerequisites", ["Programming Languages", "Mathematics & Statistics", "Data Tools"], "Weeks 1-3"),
            ("Phase 2: Core Engineering & Data Pipelines", ["Data Science", "Data Engineering", "Databases", "Artificial Intelligence & ML"], "Weeks 4-7"),
            ("Phase 3: Advanced Architectures & Systems Design", ["Deep Learning", "Generative AI", "Full Stack & Web Development", "Cloud & Infra"], "Weeks 8-11"),
            ("Phase 4: Production Serving, MLOps & Portfolio Capstone", ["Cloud & DevOps", "Security", "MLOps"], "Weeks 12-14")
        ]

        phases = []
        allocated_skills = set()

        for idx, (p_title, preferred_cats, default_wks) in enumerate(phase_categories):
            phase_num = idx + 1
            phase_skills = []

            for s in annotated_skills:
                if s["skill"] in allocated_skills:
                    continue
                # Heuristic allocation
                matched_phase = False
                if phase_num == 1 and (s["skill"] in ["Python", "SQL", "Git", "Bash", "Statistics", "Pandas", "JavaScript", "Java", "C++"]):
                    matched_phase = True
                elif phase_num == 2 and (s["skill"] in ["Machine Learning", "Scikit-learn", "Data Visualization", "Tableau", "Power BI", "Spark", "Airflow", "Kafka", "Snowflake", "BigQuery", "React", "Node.js"]):
                    matched_phase = True
                elif phase_num == 3 and (s["skill"] in ["PyTorch", "TensorFlow", "Deep Learning", "Generative AI", "LLM", "NLP", "Computer Vision", "FastAPI", "AWS", "Azure", "GCP", "Cloud Computing"]):
                    matched_phase = True
                elif phase_num == 4 and (s["skill"] in ["MLOps", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform", "Cybersecurity", "Network Security"]):
                    matched_phase = True

                if matched_phase:
                    phase_skills.append(s)
                    allocated_skills.add(s["skill"])

            # If phase is empty or remaining skills, distribute evenly
            if not phase_skills and idx == 3:
                for s in annotated_skills:
                    if s["skill"] not in allocated_skills:
                        phase_skills.append(s)
                        allocated_skills.add(s["skill"])

            # Compute phase completion
            p_total = max(len(phase_skills), 1)
            p_mastered = sum(1 for ps in phase_skills if ps["status"] == "Mastered")
            p_in_prog = sum(1 for ps in phase_skills if ps["status"] == "In Progress")
            phase_completion = round(((p_mastered + 0.5 * p_in_prog) / p_total) * 100, 1)

            # Capstone project for this phase
            phase_milestone_project = {
                "title": f"Phase {phase_num} Milestone Deliverable for {matched_role}",
                "difficulty": "Intermediate" if phase_num <= 2 else "Advanced",
                "description": f"Synthesize all competencies from {p_title} into an end-to-end demonstrable portfolio project with automated tests and architecture documentation.",
                "deliverables": ["Production code repository", "Interactive visual demonstration", "Benchmarking and performance analysis"],
                "tech_stack": [ps["skill"] for ps in phase_skills[:3]] or ["Python", "SQL", "Git"]
            }

            phases.append({
                "phase_number": phase_num,
                "phase_title": p_title,
                "estimated_weeks": default_wks,
                "description": f"Master the critical competencies required for {p_title} with structured theory, lab exercises, and milestone deliverables.",
                "skills": phase_skills,
                "milestone_project": phase_milestone_project,
                "completion_percentage": phase_completion
            })

        # Build Mindmap Node Graph
        mindmap_nodes = []
        mindmap_edges = []

        # Central Root Node
        mindmap_nodes.append({
            "id": "root",
            "label": matched_role,
            "type": "root",
            "category": "Target Career Goal",
            "status": "Target",
            "priority": "High",
            "frequency_pct": 100.0,
            "average_salary": role_info.get("average_salary", 160000),
            "estimated_hours": total_estimated_hours,
            "is_gap": False,
            "prerequisites": [],
            "x": 0.5,
            "y": 0.5
        })

        # Group skills by domain category for branch nodes
        cat_groups = {}
        for s in annotated_skills:
            cat = s["category"]
            cat_groups.setdefault(cat, []).append(s)

        for cat_name, c_skills in cat_groups.items():
            cat_id = f"cat_{cat_name.lower().replace(' ', '_').replace('&', 'and')}"
            
            # Category branch node
            mindmap_nodes.append({
                "id": cat_id,
                "label": cat_name,
                "type": "category",
                "category": cat_name,
                "status": "In Progress" if any(s["status"] == "In Progress" for s in c_skills) else ("Mastered" if all(s["status"] == "Mastered" for s in c_skills) else "To Learn"),
                "priority": "High",
                "frequency_pct": round(sum(s["frequency_pct"] for s in c_skills) / len(c_skills), 1),
                "average_salary": int(sum(s["average_salary"] for s in c_skills) / len(c_skills)),
                "estimated_hours": sum(s["estimated_hours"] for s in c_skills),
                "is_gap": any(s["is_gap"] for s in c_skills),
                "prerequisites": [],
                "x": None,
                "y": None
            })

            # Edge from Root -> Category
            mindmap_edges.append({
                "source": "root",
                "target": cat_id,
                "label": "Domain Area"
            })

            # Skill leaf nodes
            for s in c_skills:
                skill_id = f"skill_{s['skill'].lower().replace(' ', '_').replace('.', '_')}"
                mindmap_nodes.append({
                    "id": skill_id,
                    "label": s["skill"],
                    "type": "skill",
                    "category": cat_name,
                    "status": s["status"],
                    "priority": s["priority"],
                    "frequency_pct": s["frequency_pct"],
                    "average_salary": s["average_salary"],
                    "estimated_hours": s["estimated_hours"],
                    "is_gap": s["is_gap"],
                    "prerequisites": [],
                    "x": None,
                    "y": None
                })

                # Edge from Category -> Skill
                mindmap_edges.append({
                    "source": cat_id,
                    "target": skill_id,
                    "label": "Core Skill"
                })

        return {
            "target_role": matched_role,
            "total_estimated_hours": total_estimated_hours,
            "target_timeline_weeks": timeline_weeks,
            "weekly_hours": weekly_hours,
            "readiness_score": readiness_score,
            "mastered_skills_count": mastered_count,
            "in_progress_count": in_progress_count,
            "pending_skills_count": pending_count,
            "phases": phases,
            "mindmap_nodes": mindmap_nodes,
            "mindmap_edges": mindmap_edges
        }

    @classmethod
    def get_interview_prep(cls, role: str) -> Dict[str, Any]:
        cls._load_data()
        
        # Check if we have tailored questions for this role
        matched_role = None
        for r_name in ROLE_INTERVIEW_QUESTIONS:
            if r_name.lower() == role.lower():
                matched_role = r_name
                break
        
        if matched_role and matched_role in ROLE_INTERVIEW_QUESTIONS:
            questions = ROLE_INTERVIEW_QUESTIONS[matched_role]
        else:
            # Fallback to Machine Learning Engineer or Data Scientist questions
            questions = ROLE_INTERVIEW_QUESTIONS["Machine Learning Engineer"]

        return {
            "role": role,
            "total_questions": len(questions),
            "questions": questions
        }

    @classmethod
    def analyze_ats_readiness(
        cls,
        target_role: str,
        user_skills: List[str],
        resume_summary: Optional[str] = None
    ) -> Dict[str, Any]:
        cls._load_data()

        # Find role
        matched_role = None
        for r_name in cls._role_mapping:
            if r_name.lower() == target_role.lower():
                matched_role = r_name
                break
        if not matched_role:
            matched_role = list(cls._role_mapping.keys())[0]

        role_info = cls._role_mapping[matched_role]
        expected_skills = role_info.get("expected_skills", [])

        # Build list of active keywords from user skills and optional text
        user_text = " ".join(user_skills)
        if resume_summary:
            user_text += " " + resume_summary
        user_text_lower = user_text.lower()

        matched_keywords = []
        missing_keywords = []

        total_weight = 0.0
        earned_weight = 0.0

        for exp in expected_skills:
            s_name = exp["skill"]
            freq = exp.get("frequency_pct", 50.0)
            weight = freq

            total_weight += weight
            # Look for exact or word-boundary match
            pattern = r'\b' + re.escape(s_name.lower()) + r'\b'
            if re.search(pattern, user_text_lower) or any(s_name.lower() == us.lower().strip() for us in user_skills):
                matched_keywords.append(s_name)
                earned_weight += weight
            else:
                missing_keywords.append({
                    "skill": s_name,
                    "frequency_pct": freq,
                    "priority": exp.get("priority", "Standard"),
                    "impact": "Critical" if freq >= 60 else ("High" if freq >= 35 else "Recommended")
                })

        ats_score = int(round((earned_weight / max(total_weight, 1.0)) * 100))

        # Generate actionable resume bullet recommendations
        bullet_recs = []
        top_missing = missing_keywords[:4]
        for m in top_missing:
            s = m["skill"]
            bullet_recs.append(
                f"Add quantifiable achievements utilizing {s}: e.g., 'Engineered end-to-end data pipeline using {s}, accelerating query throughput by 35% and reducing memory overhead.'"
            )
        if not bullet_recs:
            bullet_recs.append(
                f"Your profile strongly aligns with {matched_role} ATS screening benchmarks. Focus on highlighting quantitative business outcomes ($ revenue, % latency, data volume) in your project descriptions."
            )

        tier = "Exceptional Match (Top 5%)" if ats_score >= 85 else ("Competitive Match" if ats_score >= 65 else ("Requires ATS Keyword Optimization" if ats_score >= 40 else "High Screening Rejection Risk"))

        return {
            "target_role": matched_role,
            "ats_score": ats_score,
            "matched_keywords": matched_keywords,
            "missing_critical_keywords": missing_keywords,
            "resume_bullet_recommendations": bullet_recs,
            "system_readiness_tier": tier
        }
