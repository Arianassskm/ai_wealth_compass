from sqlalchemy import Column, Integer, String, Boolean, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class PaymentMethod(Base):
    """支付方式表"""
    __tablename__ = "payment_methods"

    name = Column(String(50), nullable=False)
    type = Column(String(20), nullable=False, index=True)  # cash/card/digital
    provider = Column(String(50), index=True)  # 支付提供商
    is_active = Column(Boolean, default=True)
    details = Column(JSONB)  # 支付方式详细信息
    
    # 关联关系
    transactions = relationship("Transaction", back_populates="payment_method") 