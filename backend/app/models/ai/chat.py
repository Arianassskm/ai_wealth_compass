from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class AIChatHistory(Base):
    """AI对话历史表"""
    __tablename__ = "ai_chat_history"

    session_id = Column(Integer, ForeignKey("ai_chat_sessions.id"), nullable=False, index=True)
    role = Column(String(20), nullable=False)  # user 或 assistant
    content = Column(Text, nullable=False)
    metadata = Column(JSONB)  # 额外的消息元数据
    
    # 关联关系
    session = relationship("AIChatSession", back_populates="messages") 