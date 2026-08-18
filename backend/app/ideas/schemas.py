from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class IdeaBaseSchema(BaseModel):
    title: str
    description: str
    country: str = "Finland"
    team_background: Optional[str] = None


class IdeaCreateSchema(IdeaBaseSchema):
    use_my_saved_background: bool = False


class IdeaReadSchema(IdeaBaseSchema):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IdeaUpdateSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    team_background: Optional[str] = None
