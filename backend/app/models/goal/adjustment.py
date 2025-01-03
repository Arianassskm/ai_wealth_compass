from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from app.models.base import Base

class GoalAdjustment(Base):
    """目标调整历史表"""
    __tablename__ = "goal_adjustment_history"

    goal_id = Column(Integer, ForeignKey("financial_goals.id"), nullable=False, index=True)
    adjustment_type = Column(String(50), nullable=False, index=True)  # target/deadline/both
    old_target = Column(Numeric(15, 2))
    new_target = Column(Numeric(15, 2))
    old_deadline = Column(DateTime)
    new_deadline = Column(DateTime)
    reason = Column(Text)
    
    # 关联关系
    goal = relationship("FinancialGoal", back_populates="adjustments") 