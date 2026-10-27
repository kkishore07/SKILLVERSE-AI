import os
import sys
from fastapi.testclient import TestClient

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.main import app

def run_tests():
    client = TestClient(app)
    print("========================================")
    print("Testing SkillVerse AI Backend REST API")
    print("========================================")

    # 1. Health check
    res = client.get("/")
    assert res.status_code == 200, f"Root failed: {res.text}"
    print("[PASS] GET / -> 200 OK")

    # 2. Login demo user
    res = client.post("/api/auth/login", json={"email": "alex@skillverse.ai", "password": "skillverse123"})
    assert res.status_code == 200, f"Login failed: {res.text}"
    token = res.json()["access_token"]
    print(f"[PASS] POST /api/auth/login -> 200 OK (Token received)")

    # 3. Get profile
    res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200, f"Me failed: {res.text}"
    print(f"[PASS] GET /api/auth/me -> 200 OK ({res.json()['name']})")

    # 4. Skills
    res = client.get("/api/skills/top?limit=5")
    assert res.status_code == 200, f"Top skills failed: {res.text}"
    top_skills = res.json()
    assert len(top_skills) == 5
    print(f"[PASS] GET /api/skills/top -> 200 OK (Top: {[s['name'] for s in top_skills]})")

    # 5. Analytics overview
    res = client.get("/api/analytics/overview")
    assert res.status_code == 200, f"Analytics overview failed: {res.text}"
    overview = res.json()
    print(f"[PASS] GET /api/analytics/overview -> 200 OK (Total jobs: {overview['total_jobs']})")

    # 6. Forecasting for Python
    res = client.get("/api/forecast/Python")
    assert res.status_code == 200, f"Forecast failed: {res.text}"
    fc = res.json()
    assert len(fc["forecast"]) == 12
    print(f"[PASS] GET /api/forecast/Python -> 200 OK (Trend: {fc['trend_direction']}, MAE: {fc['evaluation']['model_mae']})")

    # 7. Skill Gap Analysis
    res = client.post("/api/recommendations/gap-analysis", json={
        "target_role": "Data Scientist",
        "current_skills": ["Python", "SQL", "Excel"]
    })
    assert res.status_code == 200, f"Skill gap failed: {res.text}"
    gap = res.json()
    print(f"[PASS] POST /api/recommendations/gap-analysis -> 200 OK (Match: {gap['skill_match_percentage']}%, Missing: {len(gap['missing_skills'])})")

    # 8. Salary Estimate
    res = client.post("/api/recommendations/salary-estimate", json={
        "job_title": "Data Scientist",
        "experience_level": "Senior",
        "location": "San Francisco, CA",
        "industry": "Tech / Software",
        "skills": ["Python", "SQL", "Machine Learning", "PyTorch", "AWS"]
    })
    assert res.status_code == 200, f"Salary estimate failed: {res.text}"
    sal = res.json()
    print(f"[PASS] POST /api/recommendations/salary-estimate -> 200 OK (Predicted: ${sal['predicted_salary']}, Range: ${sal['salary_range_min']} - ${sal['salary_range_max']}, R2: {sal['confidence_r2']})")

    # 9. Jobs query
    res = client.get("/api/jobs?limit=5")
    assert res.status_code == 200, f"Jobs failed: {res.text}"
    assert len(res.json()["jobs"]) == 5
    print(f"[PASS] GET /api/jobs -> 200 OK (Returned 5 jobs)")

    # 10. Learning Resources & YouTube Links
    res = client.get("/api/learning/resources/Python")
    assert res.status_code == 200, f"Resources failed: {res.text}"
    py_res = res.json()
    assert len(py_res["courses"]) >= 2
    assert len(py_res["youtube_videos"]) >= 2
    print(f"[PASS] GET /api/learning/resources/Python -> 200 OK ({len(py_res['courses'])} courses, {len(py_res['youtube_videos'])} YouTube tutorials)")

    # 11. Career Phased Roadmap & Mindmap Generation
    res = client.post("/api/learning/roadmap", json={
        "target_role": "Machine Learning Engineer",
        "current_skills": ["Python", "SQL"],
        "user_progress": {"Docker": "In Progress"}
    })
    assert res.status_code == 200, f"Roadmap failed: {res.text}"
    rm = res.json()
    assert len(rm["phases"]) == 4
    assert len(rm["mindmap_nodes"]) > 10
    print(f"[PASS] POST /api/learning/roadmap -> 200 OK ({len(rm['phases'])} phases, {len(rm['mindmap_nodes'])} mindmap nodes, readiness: {rm['readiness_score']}%)")

    # 12. Technical Interview Questions & Flashcards
    res = client.get("/api/learning/interview-prep/Machine%20Learning%20Engineer")
    assert res.status_code == 200, f"Interview prep failed: {res.text}"
    ip = res.json()
    assert ip["total_questions"] >= 3
    print(f"[PASS] GET /api/learning/interview-prep/Machine Learning Engineer -> 200 OK ({ip['total_questions']} interview questions)")

    # 13. ATS Resume Keyword Optimizer
    res = client.post("/api/learning/ats-optimizer", json={
        "target_role": "Data Scientist",
        "user_skills": ["Python", "SQL", "Pandas"],
        "resume_summary": "Extensive experience in Python data mining, SQL database queries, and statistical modeling."
    })
    assert res.status_code == 200, f"ATS optimizer failed: {res.text}"
    ats = res.json()
    print(f"[PASS] POST /api/learning/ats-optimizer -> 200 OK (ATS Score: {ats['ats_score']}%, Tier: {ats['system_readiness_tier']})")

    # 14. User Profile & Learning Progress Update
    res = client.put(
        "/api/users/progress",
        headers={"Authorization": f"Bearer {token}"},
        json={"skill_name": "Docker", "status": "In Progress"}
    )
    assert res.status_code == 200, f"Progress update failed: {res.text}"
    print(f"[PASS] PUT /api/users/progress -> 200 OK (Saved progress for Docker)")

    print("========================================")
    print("ALL 14 BACKEND API TESTS PASSED SUCCESSFULLY!")
    print("========================================")

if __name__ == "__main__":
    run_tests()

