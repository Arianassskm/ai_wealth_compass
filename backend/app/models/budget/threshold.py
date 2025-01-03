from sqlalchemy import Column, Integer, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class BudgetThreshold(Base):
    """预算阈值表"""
    __tablename__ = "budget_thresholds"

    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False, index=True)
    warning_threshold = Column(Numeric(5, 2), nullable=False)  # 警告阈值（百分比）
    critical_threshold = Column(Numeric(5, 2), nullable=False)  # 严重阈值（百分比）
    notification_enabled = Column(Boolean, default=True)
    
    # 关联关系
    budget = relationship("Budget", back_populates="thresholds") 