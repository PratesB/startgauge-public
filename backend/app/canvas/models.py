import uuid
from sqlalchemy import Column, String, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base, UTCDateTime



class Canvas(Base):
    __tablename__ = "canvases"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    
    idea_id = Column(String(36), ForeignKey("ideas.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    version = Column(Integer, default=1, nullable=False)
    

    customer_segments = Column(Text, nullable=True)
    value_propositions = Column(Text, nullable=True)
    channels = Column(Text, nullable=True)
    customer_relationships = Column(Text, nullable=True)
    revenue_streams = Column(Text, nullable=True)
    key_resources = Column(Text, nullable=True)
    key_activities = Column(Text, nullable=True)
    key_partnerships = Column(Text, nullable=True)
    cost_structure = Column(Text, nullable=True)
    
    created_at = Column(UTCDateTime, server_default=func.now(), nullable=False)
    updated_at = Column(UTCDateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


    idea = relationship("Idea", back_populates="canvases")
    user = relationship("User", back_populates="canvases")
    feedback = relationship("Feedback", back_populates="canvas", uselist=False, cascade="all, delete-orphan")



class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    canvas_id = Column(String(36), ForeignKey("canvases.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    founder_strengths = Column(Text, nullable=False)
    execution_gaps = Column(Text, nullable=False)
    recommended_actions = Column(Text, nullable=False)
    
    created_at = Column(UTCDateTime, server_default=func.now(), nullable=False)
    updated_at = Column(UTCDateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    canvas = relationship("Canvas", back_populates="feedback")
