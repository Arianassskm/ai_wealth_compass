from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class NotificationHistory(Base):
    """通知历史表"""
    __tablename__ = "notification_history"

    id = Column(Integer, primary_key=True, index=True)
    notification_id = Column(Integer, ForeignKey("notifications.id"), nullable=False, index=True)
    action = Column(String(50), nullable=False, index=True)  # sent/delivered/read/clicked
    channel = Column(String(20), nullable=False)  # 发送渠道
    status = Column(String(20), nullable=False)  # success/failed
    error_details = Column(JSON)  # JSONB 改为 JSON
    
    # 关联关系
    notification = relationship("Notification", back_populates="history") 