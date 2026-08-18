from fastapi import APIRouter
from app.users.router import router as users_router
from app.dashboard.router import router as dashboard_router




api_router = APIRouter()


api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
