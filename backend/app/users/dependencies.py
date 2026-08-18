import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from redis.asyncio import Redis
from app.core.config import settings
from app.core.database import get_async_session, get_redis
from app.users.models import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/users/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    session: AsyncSession = Depends(get_async_session),
    redis: Redis = Depends(get_redis)
) -> User:

    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        jti: str = payload.get("jti")
        
        if user_id is None or jti is None:
            raise credentials_exception
            
        is_blacklisted = await redis.get(f"blacklist:{jti}")
        if is_blacklisted:
            raise credentials_exception
            

    except jwt.PyJWTError:
        raise credentials_exception
        

    token_owner = select(User).where(User.id == user_id)
    result = await session.execute(token_owner)
    user = result.scalars().first()
    
    if user is None:
        raise credentials_exception
        
    return user
