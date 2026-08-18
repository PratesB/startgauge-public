from fastapi import APIRouter, Depends
from app.users.models import User
from app.users.dependencies import get_current_user



router = APIRouter()



@router.get("/")
async def dashboard(current_user: User = Depends(get_current_user)):
    return {
        "message": f"Welcome to the dashboard, {current_user.name}!",
        "user_email": current_user.email
    }
