from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from app.users.models import User
from app.users.dependencies import get_current_user
from app.ai.tasks import generate_canvas_task, generate_feedback_task
from app.ai.schemas import TaskResponseSchema, TaskStatusSchema
from celery.result import AsyncResult
from app.core.celery import celery_app


router = APIRouter()



@router.post("/generate-canvas/{idea_id}", response_model=TaskResponseSchema, status_code=status.HTTP_202_ACCEPTED)
async def generate_canvas(
    idea_id: str,
    current_user: User = Depends(get_current_user)
):
    task = generate_canvas_task.delay(idea_id, current_user.id)
    return TaskResponseSchema(task_id=task.id, status="processing")




@router.post("/generate-feedback/{canvas_id}", response_model=TaskResponseSchema, status_code=status.HTTP_202_ACCEPTED)
async def generate_feedback(
    canvas_id: str,
    current_user: User = Depends(get_current_user)
):
    task = generate_feedback_task.delay(canvas_id, current_user.id)
    return TaskResponseSchema(task_id=task.id, status="processing")




@router.get("/status/{task_id}", response_model=TaskStatusSchema)
async def get_task_status(
    task_id: str,
    current_user: User = Depends(get_current_user)
):
    task_result = AsyncResult(task_id, app=celery_app)
    
    response = {
        "task_id": task_id,
        "status": task_result.status,
    }
    
    if task_result.status == 'SUCCESS':
        response['result'] = task_result.result
    elif task_result.status == 'FAILURE':
        response['error'] = str(task_result.result)
        
    return TaskStatusSchema(**response)
