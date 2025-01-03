from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base

class InvestmentRecord(Base):
    """投资记录表"""
    __tablename__ = "investment_records"

    id = Column(Integer, primary_key=True, index=True)
    investment_id = Column(Integer, ForeignKey("investments.id"), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True)  # buy/sell
    amount = Column(Numeric(precision=15, scale=2), nullable=False)
    price = Column(Numeric(precision=15, scale=2), nullable=False)
    metadata = Column(JSON, nullable=True)  # 将 JSONB 改为 JSON
    description = Column(String(500))
    
    # 关联关系
    investment = relationship("Investment", back_populates="records") 