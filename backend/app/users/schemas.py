from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime


class UserCreateSchema(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserReadSchema(BaseModel):
    id: str
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str




