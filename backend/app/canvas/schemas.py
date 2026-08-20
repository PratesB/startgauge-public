from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class CanvasSchema(BaseModel):
    customer_segments: Optional[str] = None
    value_propositions: Optional[str] = None
    channels: Optional[str] = None
    customer_relationships: Optional[str] = None
    revenue_streams: Optional[str] = None
    key_resources: Optional[str] = None
    key_activities: Optional[str] = None
    key_partnerships: Optional[str] = None
    cost_structure: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)



class FeedbackSchema(BaseModel):
    founder_strengths: str
    execution_gaps: str
    recommended_actions: str


class FeedbackReadSchema(FeedbackSchema):
    id: str
    canvas_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CanvasReadSchema(CanvasSchema):
    id: str
    idea_id: str
    user_id: str
    version: int
    created_at: datetime
    updated_at: datetime
    feedback: Optional[FeedbackReadSchema] = None

    model_config = ConfigDict(from_attributes=True)