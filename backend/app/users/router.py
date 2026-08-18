from fastapi import APIRouter, Depends, status, Response, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.users.schemas import UserCreateSchema, UserReadSchema, UserLoginSchema, TokenSchema, UserUpdateSchema, UserPasswordUpdateSchema
from app.users.services import create_user, authenticate_user, refresh_access_token, logout_user, update_user_profile, update_user_password
from app.users.dependencies import get_current_user
from app.users.models import User
from redis.asyncio import Redis
from app.core.database import get_async_session, get_redis
from app.core.config import settings


router = APIRouter()




@router.post("/register", response_model=UserReadSchema, status_code=status.HTTP_201_CREATED)
async def register_user(
    user: UserCreateSchema, 
    session: AsyncSession = Depends(get_async_session)
):
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



@router.post("/refresh", response_model=TokenSchema, status_code=status.HTTP_200_OK)
async def refresh_token(
    request: Request,
    response: Response,
    redis: Redis = Depends(get_redis),
    session: AsyncSession = Depends(get_async_session)
):

    current_refresh_token = request.cookies.get("refresh_token")
    if not current_refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token not provided")
        
    access_token, new_refresh_token = await refresh_access_token(redis, session, current_refresh_token)
    

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,       
        secure=True,         
        samesite="lax",       
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 
    )
    
    return TokenSchema(access_token=access_token, token_type="bearer")




@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    request: Request,
    response: Response,
    redis: Redis = Depends(get_redis)
):

    current_refresh_token = request.cookies.get("refresh_token")
    

    if current_refresh_token:
        await logout_user(redis, current_refresh_token)
        

    response.delete_cookie(
        key="refresh_token",
        httponly=True,       
        secure=True,         
        samesite="lax",
    )




@router.get("/me", response_model=UserReadSchema, status_code=status.HTTP_200_OK)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user



@router.patch("/me", response_model=UserReadSchema, status_code=status.HTTP_200_OK)
async def update_user(
    user_update: UserUpdateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):

    updated_user = await update_user_profile(session, current_user, user_update)
    return updated_user


@router.patch("/password", status_code=status.HTTP_204_NO_CONTENT)
async def update_password(
    password_data: UserPasswordUpdateSchema,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_async_session)
):

    await update_user_password(session, current_user, password_data)
