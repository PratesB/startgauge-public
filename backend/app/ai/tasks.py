import asyncio
from app.core.celery import celery_app
from asgiref.sync import async_to_sync
from app.ai.services import generate_ai_canvas, generate_ai_feedback
from app.core.database import async_session_maker



@celery_app.task(bind=True, name="generate_canvas_task")
def generate_canvas_task(self, idea_id: str, user_id: str):

    # Since our services are async and use SQLAlchemy AsyncSession,
    # we need to run them inside an event loop.
    async def run_async_generation():
        async with async_session_maker() as db:
            return await generate_ai_canvas(
                db=db,
                idea_id=idea_id,
                user_id=user_id
            )
            
    try:
        # Run the async function synchronously
        canvas = async_to_sync(run_async_generation)()
        return {"status": "completed", "canvas_id": canvas.id}
    except Exception as e:
        print(f"Error in generate_canvas_task: {e}")
        # If it's an HTTPException, extract the clean detail message
        if hasattr(e, "detail"):
            raise Exception(e.detail)
        raise e

@celery_app.task(bind=True, name="generate_feedback_task")
def generate_feedback_task(self, canvas_id: str, user_id: str):

    async def run_async_generation():
        async with async_session_maker() as db:
            return await generate_ai_feedback(
                db=db,
                canvas_id=canvas_id,
                user_id=user_id
            )
            
    try:
        feedback = async_to_sync(run_async_generation)()
        return {"status": "completed", "feedback_id": feedback.id}
    except Exception as e:
        print(f"Error in generate_feedback_task: {e}")
        if hasattr(e, "detail"):
            raise Exception(e.detail)
        raise e
