from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class GoalProgress(Base):
    """目标进度表"""
    __tablename__ = "goal_progress"

    goal_id = Column(Integer, ForeignKey("financial_goals.id"), nullable=False, index=True)
    current_amount = Column(Numeric(15, 2), nullable=False)
    completion_rate = Column(Numeric(5, 2), nullable=False)
    period = Column(String(7), nullable=False, index=True)  # YYYY-MM
    metrics = Column(JSONB)  # 其他进度指标
    
    # 关联关系
    goal = relationship("FinancialGoal", back_populates="progress_records") 