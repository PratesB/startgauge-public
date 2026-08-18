from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.users.models import User
from app.users.schemas import UserCreateSchema, UserLoginSchema, TokenSchema, UserUpdateSchema, UserPasswordUpdateSchema
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token
)

from sqlalchemy.exc import IntegrityError
from redis.asyncio import Redis
import jwt
from app.core.config import settings
from datetime import datetime, timezone




async def create_user(
    session: AsyncSession, 
    user_schema: UserCreateSchema
) -> User:

    existing_user = select(User).where(User.email == user_schema.email)
    result = await session.execute(existing_user)
    
    if result.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The user with this email already exists in the system.",
        )
    
    hashed_password = get_password_hash(user_schema.password)
    
    new_user = User(
        name=user_schema.name,
        email=user_schema.email,
        password=hashed_password,
    )
    
    try:
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return new_user

        
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An error occurred while trying to save the user into the database.",
        )




async def update_user_profile(
    session: AsyncSession, 
    current_user: User, 
    update_schema: UserUpdateSchema
) -> User:

    if update_schema.email and update_schema.email != current_user.email:
        existing_user = select(User).where(User.email == update_schema.email)
        result = await session.execute(existing_user)
        if result.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already registered to another user.",
            )
            

    update_dict = update_schema.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(current_user, key, value)
        
    try:
        session.add(current_user)
        await session.commit()
        await session.refresh(current_user)
        return current_user

        
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error updating user profile.",
        )


async def update_user_password(
    session: AsyncSession, 
    current_user: User, 
    password_schema: UserPasswordUpdateSchema
):

    if not verify_password(password_schema.old_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password",
        )
        

    hashed_new_password = get_password_hash(password_schema.new_password)
    current_user.password = hashed_new_password
    current_user.security_stamp += 1
    
    try:
        session.add(current_user)
        await session.commit()

        
    except IntegrityError:
        await session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error updating user password.",
        )




async def authenticate_user(
    session: AsyncSession, 
    user_schema: UserLoginSchema
) -> tuple[str, str]:

    existing_user = select(User).where(User.email == user_schema.email)
    result = await session.execute(existing_user)
    user = result.scalars().first()
    

    if not user or not verify_password(user_schema.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        

    access_token = create_access_token(data={"sub": user.id, "security_stamp": user.security_stamp})
    refresh_token = create_refresh_token(data={"sub": user.id, "security_stamp": user.security_stamp})
    
    return access_token, refresh_token



async def refresh_access_token(
    redis: Redis, 
    session: AsyncSession, 
    refresh_token: str
) -> tuple[str, str]:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
    )
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        jti: str = payload.get("jti")
        security_stamp: int = payload.get("security_stamp")
        
        if user_id is None or jti is None or security_stamp is None:
            raise credentials_exception
            

        is_blacklisted = await redis.get(f"blacklist:{jti}")
        if is_blacklisted:
            raise credentials_exception
            

        exp = payload.get("exp")
        now = datetime.now(timezone.utc).timestamp()
        token_time_to_live = int(exp - now) if exp else settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        
        if token_time_to_live > 0:
            await redis.setex(f"blacklist:{jti}", token_time_to_live, "revoked")
            
    except jwt.PyJWTError:
        raise credentials_exception
        

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    
    if not user or user.security_stamp != security_stamp:
        raise credentials_exception

    new_access_token = create_access_token(data={"sub": user.id, "security_stamp": user.security_stamp})
    new_refresh_token = create_refresh_token(data={"sub": user.id, "security_stamp": user.security_stamp})
    
    return new_access_token, new_refresh_token




async def logout_user(redis: Redis, refresh_token: str):

    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        jti: str = payload.get("jti")
        
        if not jti:
            return
            
        exp = payload.get("exp")
        now = datetime.now(timezone.utc).timestamp()
        token_time_to_live = int(exp - now) if exp else settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60
        

        if token_time_to_live > 0:
            await redis.setex(f"blacklist:{jti}", token_time_to_live, "revoked")
            
    except jwt.PyJWTError:
        pass
