from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.models.base import Base

class Budget(Base):
    """预算表"""
    __tablename__ = "budgets"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    category_id = Column(Integer, ForeignKey("budget_categories.id"), nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    period = Column(String(7), nullable=False, index=True)  # YYYY-MM
    description = Column(String(255))
    
    # 关联关系
    user = relationship("User", back_populates="budgets")
    category = relationship("BudgetCategory", back_populates="budgets")
    executions = relationship("BudgetExecution", back_populates="budget")
    thresholds = relationship("BudgetThreshold", back_populates="budget") 