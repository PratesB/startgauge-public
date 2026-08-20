from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.users.models import User
from app.users.dependencies import get_current_user
from app.canvas.schemas import CanvasReadSchema, FeedbackReadSchema
from app.ai.services import generate_ai_canvas, generate_ai_feedback



router = APIRouter()


@router.post("/generate-canvas/{idea_id}", response_model=CanvasReadSchema, status_code=status.HTTP_201_CREATED)
async def generate_canvas(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):

    return await generate_ai_canvas(db=db, idea_id=idea_id, user_id=current_user.id)


@router.post("/generate-feedback/{canvas_id}", response_model=FeedbackReadSchema, status_code=status.HTTP_201_CREATED)
async def generate_feedback(
    canvas_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):

    return await generate_ai_feedback(db=db, canvas_id=canvas_id, user_id=current_user.id)
