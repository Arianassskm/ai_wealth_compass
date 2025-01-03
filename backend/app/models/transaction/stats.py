from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class TransactionStats(Base):
    """交易统计表"""
    __tablename__ = "transaction_stats"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    period = Column(String(7), nullable=False, index=True)  # YYYY-MM
    stats_data = Column(JSONB, nullable=False)  # 统计数据
    category_breakdown = Column(JSONB)  # 分类统计
    payment_breakdown = Column(JSONB)  # 支付方式统计
    
    # 关联关系
    user = relationship("User", back_populates="transaction_stats") 