from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_async_session
from app.users.models import User
from app.users.dependencies import get_current_user
from app.ideas.schemas import IdeaCreateSchema, IdeaReadSchema, IdeaUpdateSchema
from app.ideas.services import (
    create_idea, 
    list_user_ideas, 
    get_idea_by_id, 
    update_idea, 
    delete_idea
)


router = APIRouter()


@router.post("/", response_model=IdeaReadSchema, status_code=status.HTTP_201_CREATED)
async def create_new_idea(
    idea_input: IdeaCreateSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    return await create_idea(db=db, idea_input=idea_input, user=current_user)



@router.get("/", response_model=List[IdeaReadSchema], status_code=status.HTTP_200_OK)
async def read_user_ideas(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):

    return await list_user_ideas(db=db, user_id=current_user.id)




@router.get("/{idea_id}", response_model=IdeaReadSchema, status_code=status.HTTP_200_OK)
async def read_idea_by_id(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    return await get_idea_by_id(db=db, idea_id=idea_id, user_id=current_user.id)




@router.patch("/{idea_id}", response_model=IdeaReadSchema, status_code=status.HTTP_200_OK)
async def update_existing_idea(
    idea_id: str,
    update_schema: IdeaUpdateSchema,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    return await update_idea(db=db, idea_id=idea_id, update_schema=update_schema, user=current_user)




@router.delete("/{idea_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_idea(
    idea_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    await delete_idea(db=db, idea_id=idea_id, user_id=current_user.id)
