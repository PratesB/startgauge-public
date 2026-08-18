from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.users.schemas import UserCreateSchema, UserReadSchema, UserLoginSchema, TokenSchema
from app.users.services import create_user, authenticate_user
from app.users.services import create_user, authenticate_user
from app.core.database import get_async_session
from app.core.config import settings


router = APIRouter()

@router.post("/register", response_model=UserReadSchema, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreateSchema, session: AsyncSession = Depends(get_async_session)):
    new_user = await create_user(session, user)
    return new_user



@router.post("/login", response_model=TokenSchema, status_code=status.HTTP_200_OK)
async def login(
    user: UserLoginSchema, 
    response: Response, 
    session: AsyncSession = Depends(get_async_session)
):

    access_token, refresh_token = await authenticate_user(session, user)
    

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,       
        secure=True,         
        samesite="lax",       
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 
    )
    
    return TokenSchema(access_token=access_token, token_type="bearer")
