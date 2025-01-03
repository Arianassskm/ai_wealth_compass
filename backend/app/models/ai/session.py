from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.models.base import Base

class AIChatSession(Base):
    """AI对话会话表"""
    __tablename__ = "ai_chat_sessions"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    session_type = Column(String(50), nullable=False, index=True)
    title = Column(String(255))
    status = Column(String(20), nullable=False, index=True)
    
    # 关联关系
    user = relationship("User", back_populates="chat_sessions")
    messages = relationship("AIChatHistory", back_populates="session") 