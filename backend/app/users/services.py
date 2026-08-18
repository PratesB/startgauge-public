from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.users.models import User
from app.users.schemas import UserCreateSchema
from app.core.security import get_password_hash


from sqlalchemy.exc import IntegrityError

async def create_user(session: AsyncSession, user_schema: UserCreateSchema) -> User:
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
