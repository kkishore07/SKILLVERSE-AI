import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Support PostgreSQL via env var, with fallback to SQLite for immediate local execution
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./skillverse.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def init_db():
    Base.metadata.create_all(bind=engine)
    # Ensure newly added columns exist in users table if already created
    try:
        with engine.connect() as conn:
            from sqlalchemy import text
            if DATABASE_URL.startswith("sqlite"):
                existing = [row[1] for row in conn.execute(text("PRAGMA table_info(users)")).fetchall()]
                new_cols = [
                    ("experience_level", "VARCHAR(50) DEFAULT 'Mid-level'"),
                    ("weekly_hours", "INTEGER DEFAULT 10"),
                    ("target_timeline_weeks", "INTEGER DEFAULT 12"),
                    ("target_company_tier", "VARCHAR(100) DEFAULT 'Top Tech / Product Unicorns'"),
                    ("learning_progress", "TEXT DEFAULT '{}'"),
                    ("study_streak_days", "INTEGER DEFAULT 5")
                ]
                for col_name, col_type in new_cols:
                    if col_name not in existing:
                        conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))
                conn.commit()
    except Exception as e:
        print(f"Database schema sync warning: {e}")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

