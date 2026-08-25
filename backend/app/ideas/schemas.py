from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Annotated
from datetime import datetime


class IdeaBaseSchema(BaseModel):
    title: Annotated[str, Field(max_length=200)]
    description: Annotated[str, Field(max_length=3000)]
    country: str = "Finland"
    team_background: Annotated[Optional[str], Field(max_length=1500)] = None


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
    use_my_saved_background: Optional[bool] = None
