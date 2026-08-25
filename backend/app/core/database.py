import datetime
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy import TypeDecorator, DateTime
from app.core.config import settings
from fastapi import HTTPException, status
from redis.asyncio import Redis
from redis.exceptions import ConnectionError


# Store Timezone Aware Timestamps as Timezone Naive UTC - TypeDecorator SQL-Alchemy
# Helps frontend show correct local time to the user.
class UTCDateTime(TypeDecorator):
    impl = DateTime
    cache_ok = True

    def process_result_value(self, value, dialect):
        if value is not None:
            if value.tzinfo is None:
                return value.replace(tzinfo=datetime.timezone.utc)
        return value



# SQLAlchemy Setup
Base = declarative_base()
engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True)
async_session_maker = async_sessionmaker(bind=engine, expire_on_commit=False)


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        yield session




# Redis Setup
redis_client = Redis.from_url(settings.REDIS_URL, decode_responses=True)

async def get_redis() -> AsyncGenerator[Redis, None]:
    try:
        await redis_client.ping()
        yield redis_client
    except ConnectionError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to connect to Redis."
        )


