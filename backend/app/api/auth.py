from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.database.models import User
from backend.app.schemas.schemas import UserRegisterRequest, UserLoginRequest, TokenResponse, UserProfileResponse
from backend.app.services.auth_service import get_password_hash, verify_password, create_access_token, require_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.lower()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    hashed_pw = get_password_hash(req.password)
    new_user = User(
        name=req.name,
        email=req.email.lower(),
        password_hash=hashed_pw,
        target_role=req.target_role or "Data Scientist",
        current_skills=req.current_skills or "Python, SQL"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email, "id": new_user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "target_role": new_user.target_role,
            "current_skills": new_user.current_skills
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    token = create_access_token({"sub": user.email, "id": user.id})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "target_role": user.target_role,
            "current_skills": user.current_skills
        }
    }

@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(user: User = Depends(require_current_user)):
    return user
