from sqlalchemy import Column, String, Boolean, DateTime, JSONB
from app.models.base import Base

class FeatureFlag(Base):
    """功能开关表"""
    __tablename__ = "feature_flags"

    feature_key = Column(String(100), nullable=False, unique=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    is_enabled = Column(Boolean, default=False)
    user_groups = Column(JSONB)  # 启用的用户组
    conditions = Column(JSONB)    # 启用条件
    valid_from = Column(DateTime)
    valid_until = Column(DateTime)
    rollout_percentage = Column(Integer, default=100)  # 灰度比例 