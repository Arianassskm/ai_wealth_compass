from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Date
from sqlalchemy.orm import relationship
from app.models.base import Base

class FinancialGoal(Base):
    """财务目标表"""
    __tablename__ = "financial_goals"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    goal_type = Column(String(50), nullable=False, index=True)  # saving/investment/debt
    target_amount = Column(Numeric(15, 2), nullable=False)
    current_amount = Column(Numeric(15, 2), nullable=False, default=0)
    start_date = Column(Date, nullable=False)
    deadline = Column(Date, nullable=False, index=True)
    status = Column(String(20), nullable=False, index=True)  # active/completed/abandoned
    description = Column(String(255))
    
    # 关联关系
    user = relationship("User", back_populates="financial_goals")
    progress_records = relationship("GoalProgress", back_populates="goal")
    adjustments = relationship("GoalAdjustment", back_populates="goal")
    recommendations = relationship("GoalRecommendation", back_populates="goal") 