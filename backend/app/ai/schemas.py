from pydantic import BaseModel



class TaskResponseSchema(BaseModel):
    task_id: str
    status: str



class TaskStatusSchema(BaseModel):
    task_id: str
    status: str
    result: dict | None = None
    error: str | None = None
