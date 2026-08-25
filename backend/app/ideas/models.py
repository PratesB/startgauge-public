import uuid
from sqlalchemy import Column, String, Text, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base, UTCDateTime

class Idea(Base):
    __tablename__ = "ideas"
    __table_args__ = (UniqueConstraint('user_id', 'title', name='unique_user_idea_title'),)

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    title = Column(String(200), index=True, nullable=False)
    description = Column(Text, nullable=False)
    country = Column(String(100), default="Finland", nullable=False)
    team_background = Column(Text, nullable=False)
    
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    created_at = Column(UTCDateTime, server_default=func.now(), nullable=False)
    updated_at = Column(UTCDateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("User", back_populates="ideas")
    canvases = relationship("Canvas", back_populates="idea", cascade="all, delete-orphan")
