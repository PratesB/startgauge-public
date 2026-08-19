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



class CanvasReadSchema(CanvasSchema):
    id: str
    idea_id: str
    user_id: str
    version: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
