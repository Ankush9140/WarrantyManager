from fastapi import APIRouter, HTTPException, Depends, Form
from models.user_model import User
from repository.user_repo import UserRepo
from service.auth_service import AuthService
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
user_repo = UserRepo()
auth_service = AuthService()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/signup")
async def signup(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    if user_repo.find_by_email(email):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth_service.hash_password(password)
    user_repo.create_user({"username": username, "email": email, "hashed_password": hashed_password})
    return {"msg": "User created successfully"}

@router.post("/login")
async def login(email: str = Form(...), password: str = Form(...)):
    user = user_repo.find_by_email(email)
    if not user or not auth_service.verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = auth_service.create_access_token({"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = auth_service.decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload["sub"]
