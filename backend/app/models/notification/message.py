from sqlalchemy import Column, String, JSON, ForeignKey, Enum as SQLEnum, Boolean
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel
import enum

class MessageType(str, enum.Enum):
    SYSTEM = "system"
    ACHIEVEMENT = "achievement"
    REPORT = "report"
    GENERAL = "general"

class Message(BaseModel):
    __tablename__ = "messages"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(SQLEnum(MessageType))
    title = Column(String(200))
    content = Column(String(1000))
    metadata = Column(JSON)
    is_read = Column(Boolean, default=False)
    
    # 关系
    user = relationship("User", back_populates="messages")