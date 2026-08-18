from fastapi import APIRouter
from app.users.schemas import UserCreateSchema, UserReadSchema, UserLoginSchema
from datetime import datetime
import uuid

router = APIRouter()

@router.post("/register", response_model=UserReadSchema)
async def register_user(user: UserCreateSchema):

    new_user = {
        "id": str(uuid.uuid4()),
        "name": user.name,
        "email": user.email,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }

    return new_user

@router.post("/login")
async def login(user: UserLoginSchema):
    return {"message": f"Logged as {user.email}"}
