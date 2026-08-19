from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_async_session
from app.users.models import User
from app.users.dependencies import get_current_user
from app.canvas.schemas import CanvasSchema, CanvasReadSchema
from app.canvas.services import (
    create_canvas, 
    get_canvases_by_idea, 
    get_latest_canvas_by_idea, 
    update_canvas, 
    delete_canvas
)


router = APIRouter()



@router.post("/{idea_id}", response_model=CanvasReadSchema, status_code=status.HTTP_201_CREATED)
async def create_new_canvas(
    idea_id: str,
    canvas_input: CanvasSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):

    return await create_canvas(db=db, idea_id=idea_id, canvas_input=canvas_input, user_id=current_user.id)



@router.get("/{idea_id}/history", response_model=list[CanvasReadSchema], status_code=status.HTTP_200_OK)
async def read_canvas_history(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):

    return await get_canvases_by_idea(db=db, idea_id=idea_id, user_id=current_user.id)



@router.get("/{idea_id}/latest", response_model=CanvasReadSchema, status_code=status.HTTP_200_OK)
async def read_latest_canvas(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):

    return await get_latest_canvas_by_idea(db=db, idea_id=idea_id, user_id=current_user.id)



@router.patch("/{canvas_id}", response_model=CanvasReadSchema, status_code=status.HTTP_200_OK)
async def update_existing_canvas(
    canvas_id: str,
    update_schema: CanvasSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):

    return await update_canvas(db=db, canvas_id=canvas_id, update_schema=update_schema, user_id=current_user.id)



@router.delete("/{canvas_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_canvas(
    canvas_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):

    await delete_canvas(db=db, canvas_id=canvas_id, user_id=current_user.id)
