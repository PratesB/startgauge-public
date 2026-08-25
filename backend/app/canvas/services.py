from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status
from app.canvas.models import Canvas
from app.canvas.schemas import CanvasSchema
from app.ideas.services import get_idea_by_id



async def create_canvas(
    db: AsyncSession, 
    idea_id: str, 
    canvas_input: CanvasSchema, 
    user_id: str
) -> Canvas:

    await get_idea_by_id(db, idea_id, user_id)
    

    result = await db.execute(
        select(Canvas)
        .where(Canvas.idea_id == idea_id)
        .order_by(Canvas.version.desc())
        .limit(1)
    )

    latest_canvas = result.scalars().first()
    next_version = (latest_canvas.version + 1) if latest_canvas else 1


    new_canvas = Canvas(
        idea_id=idea_id,
        user_id=user_id,
        version=next_version,
        **canvas_input.model_dump(exclude_unset=True)
    )
    
    db.add(new_canvas)
    await db.commit()
    await db.refresh(new_canvas)
    return new_canvas



async def get_canvases_by_idea(
    db: AsyncSession, 
    idea_id: str, 
    user_id: str
) -> list[Canvas]:

    await get_idea_by_id(db, idea_id, user_id)
    
    result = await db.execute(
        select(Canvas)
        .options(selectinload(Canvas.feedback))
        .where(Canvas.idea_id == idea_id)
        .order_by(Canvas.version.desc())
    )

    return result.scalars().all()



async def get_latest_canvas_by_idea(
    db: AsyncSession, 
    idea_id: str, 
    user_id: str
) -> Canvas:

    await get_idea_by_id(db, idea_id, user_id)
    
    result = await db.execute(
        select(Canvas)
        .options(selectinload(Canvas.feedback))
        .where(Canvas.idea_id == idea_id)
        .order_by(Canvas.version.desc())
        .limit(1)
    )

    latest_canvas = result.scalars().first()
    
    if not latest_canvas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="No canvas versions found for this idea."
        )
    return latest_canvas



async def get_canvas_by_id(
    db: AsyncSession, 
    canvas_id: str, 
    user_id: str
) -> Canvas:

    result = await db.execute(
        select(Canvas)
        .options(selectinload(Canvas.feedback))
        .where(Canvas.id == canvas_id, Canvas.user_id == user_id)
    )
    canvas = result.scalars().first()

    if not canvas:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Canvas not found or user doesn't have permission to access it."
        )
    return canvas



async def update_canvas(
    db: AsyncSession, 
    canvas_id: str, 
    update_schema: CanvasSchema, 
    user_id: str
) -> Canvas:

    canvas = await get_canvas_by_id(db, canvas_id, user_id)
    
    update_dict = update_schema.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        setattr(canvas, key, value)
        
    db.add(canvas)
    await db.commit()
    await db.refresh(canvas)
    return canvas



async def delete_canvas(
    db: AsyncSession, 
    canvas_id: str, 
    user_id: str
):

    canvas = await get_canvas_by_id(db, canvas_id, user_id)
    await db.delete(canvas)
    await db.commit()
