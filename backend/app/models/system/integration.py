from sqlalchemy import Column, String, Boolean, JSONB, Text
from app.models.base import Base

class IntegrationConfig(Base):
    """集成配置表"""
    __tablename__ = "integration_configs"

    integration_type = Column(String(50), nullable=False, index=True)
    provider = Column(String(50), nullable=False, index=True)
    config_name = Column(String(100), nullable=False)
    credentials = Column(JSONB)     # 加密存储的凭证
    settings = Column(JSONB)        # 配置参数
    is_active = Column(Boolean, default=True)
    status = Column(String(20), nullable=False, default='configured')
    error_message = Column(Text)
    version = Column(String(20))    # 集成版本 