from sqlalchemy import Column, String, JSONB, Text
from app.models.base import Base

class SystemSetting(Base):
    """系统设置表"""
    __tablename__ = "system_settings"

    setting_key = Column(String(100), nullable=False, unique=True, index=True)
    setting_value = Column(JSONB, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    description = Column(Text)
    is_encrypted = Column(Boolean, default=False)  # 是否加密存储
    last_modified_by = Column(String(100))  # 最后修改人 