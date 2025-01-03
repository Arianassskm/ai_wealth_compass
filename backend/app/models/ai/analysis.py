from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, DateTime, JSONB
from sqlalchemy.orm import relationship
from app.models.base import Base

class AIAnalysisHistory(Base):
    """AI分析历史表"""
    __tablename__ = "ai_analysis_history"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    analysis_type = Column(String(50), nullable=False, index=True)
    analysis_result = Column(JSONB)
    confidence_score = Column(Numeric(5, 2), index=True)
    created_at = Column(DateTime, nullable=False, index=True)
    
    # 关联关系
    user = relationship("User", back_populates="ai_analyses")
    expert_analyses = relationship("ExpertAnalysis", back_populates="ai_analysis") 