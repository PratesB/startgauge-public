from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.users.schemas import UserCreateSchema, UserReadSchema, UserLoginSchema
from app.users.services import create_user
from app.core.database import get_async_session


router = APIRouter()


@router.post("/register", response_model=UserReadSchema)
async def register_user(user: UserCreateSchema, session: AsyncSession = Depends(get_async_session)):
    new_user = await create_user(session, user)
    return new_user



@router.post("/login")
async def login(user: UserLoginSchema):
    return {"message": f"Logged as {user.email}"}
