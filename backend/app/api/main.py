from fastapi import APIRouter
from app.users.router import router as users_router
from app.dashboard.router import router as dashboard_router
from app.ideas.router import router as ideas_router
from app.canvas.router import router as canvas_router
from app.ai.router import router as ai_router




api_router = APIRouter()


api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(ideas_router, prefix="/ideas", tags=["ideas"])
api_router.include_router(canvas_router, prefix="/canvas", tags=["canvas"])
api_router.include_router(ai_router, prefix="/ai", tags=["ai"])
