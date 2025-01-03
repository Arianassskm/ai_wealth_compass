from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class GoalRecommendation(Base):
    """目标建议表"""
    __tablename__ = "goal_recommendations"

    goal_id = Column(Integer, ForeignKey("financial_goals.id"), nullable=False, index=True)
    recommendation_type = Column(String(50), nullable=False, index=True)
    content = Column(Text, nullable=False)
    priority = Column(Integer, nullable=False, index=True)
    action_items = Column(JSONB)  # 具体行动建议
    status = Column(String(20), nullable=False, default='pending')  # pending/accepted/rejected
    
    # 关联关系
    goal = relationship("FinancialGoal", back_populates="recommendations") 