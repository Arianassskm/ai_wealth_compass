from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class AssetEstimation(Base):
    """资产估值表"""
    __tablename__ = "asset_estimations"

    investment_id = Column(Integer, ForeignKey("investments.id"), nullable=False, index=True)
    estimation_date = Column(DateTime, nullable=False, index=True)
    estimated_value = Column(Numeric(15, 2), nullable=False)
    estimation_method = Column(String(50), nullable=False)
    confidence_level = Column(Numeric(5, 2))
    parameters = Column(JSONB)
    
    # 关联关系
    investment = relationship("Investment", back_populates="estimations") 