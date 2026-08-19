from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional


class UserCreateSchema(BaseModel):
    name: str
    email: EmailStr
    password: str



class UserReadSchema(BaseModel):
    id: str
    name: str
    email: EmailStr
    professional_background: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)



class UserUpdateSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    professional_background: Optional[str] = None


class UserPasswordUpdateSchema(BaseModel):
    old_password: str
    new_password: str




class UserLoginSchema(BaseModel):
    email: EmailStr
    password: str



class TokenSchema(BaseModel):
    access_token: str
    token_type: str
