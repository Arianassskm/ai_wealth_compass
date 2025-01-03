from sqlalchemy import Column, String, Boolean, DateTime, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class APIKey(Base):
    """API密钥表"""
    __tablename__ = "api_keys"

    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    key_name = Column(String(100), nullable=False)
    key_prefix = Column(String(8), nullable=False, index=True)
    key_hash = Column(String(255), nullable=False)  # 密钥哈希
    permissions = Column(JSONB)    # 权限配置
    is_active = Column(Boolean, default=True)
    expires_at = Column(DateTime)
    last_used_at = Column(DateTime)
    
    # 关联关系
    user = relationship("User", back_populates="api_keys") 