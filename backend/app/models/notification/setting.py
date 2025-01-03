from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class NotificationSetting(Base):
    """通知设置表"""
    __tablename__ = "notification_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    notification_type = Column(String(50), nullable=False, index=True)
    channels = Column(JSON, nullable=False)  # JSONB 改为 JSON
    frequency = Column(String(20), nullable=False)  # instant/daily/weekly
    quiet_hours = Column(JSON)  # JSONB 改为 JSON
    is_enabled = Column(Boolean, default=True)
    
    # 关联关系
    user = relationship("User", back_populates="notification_settings") 