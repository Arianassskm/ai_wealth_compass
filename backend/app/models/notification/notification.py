from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class Notification(Base):
    """通知表"""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    priority = Column(String(20), nullable=False, index=True)  # low/medium/high
    status = Column(String(20), nullable=False, index=True)  # unread/read/archived
    extra_data = Column(JSON)  # 将 metadata 改为 extra_data
    
    # 关联关系
    user = relationship("User", back_populates="notifications")
    history = relationship("NotificationHistory", back_populates="notification") 