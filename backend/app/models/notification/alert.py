from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class AlertRule(Base):
    """预警规则表"""
    __tablename__ = "alert_rules"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    rule_type = Column(String(50), nullable=False, index=True)
    conditions = Column(JSON, nullable=False)  # JSONB 改为 JSON
    actions = Column(JSON, nullable=False)     # JSONB 改为 JSON
    priority = Column(Integer, nullable=False, index=True)
    is_active = Column(Boolean, default=True)
    cooldown_period = Column(Integer)  # 冷却时间（分钟）
    
    # 关联关系
    user = relationship("User", back_populates="alert_rules") 