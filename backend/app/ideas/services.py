from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Sequence
from fastapi import HTTPException, status
from app.ideas.models import Idea
from app.ideas.schemas import IdeaCreateSchema, IdeaUpdateSchema
from app.users.models import User




async def create_idea(
    db: AsyncSession, 
    idea_input: IdeaCreateSchema, 
    user: User
) -> Idea:

    background_parts = []
    
    if idea_input.use_my_saved_background and user.professional_background:
        background_parts.append(user.professional_background)
        
    if idea_input.team_background:
        background_parts.append(idea_input.team_background)
        
    final_background = "\n\n".join(background_parts) if background_parts else None

    new_idea = Idea(
        title=idea_input.title,
        description=idea_input.description,
        country=idea_input.country,
        team_background=final_background,
        user_id=user.id
    )
    
    db.add(new_idea)
    await db.commit()
    await db.refresh(new_idea)
    return new_idea



async def list_user_ideas(db: AsyncSession, user_id: str) -> Sequence[Idea]:
    all_ideas = await db.execute(select(Idea).where(Idea.user_id == user_id))
    return all_ideas.scalars().all()



async def get_idea_by_id(
    db: AsyncSession, 
    idea_id: str, 
    user_id: str
) -> Idea:

    result = await db.execute(select(Idea).where(Idea.id == idea_id, Idea.user_id == user_id))
    idea = result.scalars().first()

    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Idea not found or user doesn't have permission to access it."
        )
    return idea



async def update_idea(
    db: AsyncSession, 
    idea_id: str, 
    update_schema: IdeaUpdateSchema, 
    user_id: str
) -> Idea:

    idea = await get_idea_by_id(db, idea_id, user_id)
    
    update_dict = update_schema.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        setattr(idea, key, value)
        
    db.add(idea)
    await db.commit()
    await db.refresh(idea)
    return idea



async def delete_idea(
    db: AsyncSession, 
    idea_id: str, 
    user_id: str
):
    idea = await get_idea_by_id(db, idea_id, user_id)
    await db.delete(idea)
    await db.commit()
