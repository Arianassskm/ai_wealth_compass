from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import Base

class BudgetExecution(Base):
    """预算执行表"""
    __tablename__ = "budget_execution"

    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False, index=True)
    spent_amount = Column(Numeric(15, 2), nullable=False)
    remaining_amount = Column(Numeric(15, 2), nullable=False)
    status = Column(String(20), nullable=False, index=True)  # on_track/warning/over
    last_updated = Column(DateTime, nullable=False, index=True)
    
    # 关联关系
    budget = relationship("Budget", back_populates="executions") 