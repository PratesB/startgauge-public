from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException, status
from app.ideas.services import get_idea_by_id
from app.canvas.services import create_canvas, get_canvas_by_id
from app.canvas.models import Canvas, Feedback
from app.canvas.schemas import CanvasSchema
from app.ai.agents.research_agent import run_research_agent
from app.ai.agents.business_agent import run_business_agent
from app.ai.agents.feedback_agent import run_feedback_agent


async def generate_ai_canvas(
    db: AsyncSession, 
    idea_id: str, 
    user_id: str
) -> Canvas:

    idea = await get_idea_by_id(db, idea_id, user_id)

    if not idea:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Idea not found"
        )
        
    research_report = await run_research_agent(
        idea_title=idea.title,
        idea_description=idea.description,
        country=idea.country
    )
    
    user_background = idea.team_background if idea.team_background else "Background not informed by user"
    
    canvas_schema = await run_business_agent(
        idea_title=idea.title,
        idea_description=idea.description,
        user_background=user_background,
        country=idea.country,
        research_context=research_report
    )
    
    new_canvas = await create_canvas(
        db=db, 
        idea_id=idea_id, 
        canvas_input=canvas_schema, 
        user_id=user_id
    )
    
    return new_canvas


async def generate_ai_feedback(
    db: AsyncSession, 
    canvas_id: str, 
    user_id: str
) -> Feedback:

    
    canvas = await get_canvas_by_id(db, canvas_id, user_id)
    
    existing_feedback = await db.execute(select(Feedback).where(Feedback.canvas_id == canvas_id))
    if existing_feedback.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Feedback already generated for this canvas version."
        )
    

    idea = await get_idea_by_id(db, canvas.idea_id, user_id)
    user_background = idea.team_background if idea.team_background else "Background not informed by user"
    

    canvas_schema = CanvasSchema.model_validate(canvas)
    canvas_json = canvas_schema.model_dump_json()
    

    feedback_schema = await run_feedback_agent(
        idea_description=idea.description,
        user_background=user_background,
        canvas_json=canvas_json
    )
    
 
    new_feedback = Feedback(
        canvas_id=canvas_id,
        founder_strengths=feedback_schema.founder_strengths,
        execution_gaps=feedback_schema.execution_gaps,
        recommended_actions=feedback_schema.recommended_actions
    )
    
    db.add(new_feedback)
    await db.commit()
    await db.refresh(new_feedback)
    
    return new_feedback
