from sqlalchemy import Column, Integer, String, JSONB, ForeignKey
from sqlalchemy.orm import relationship
from app.models.base import Base

class ExpertModel(Base):
    """专家模型表"""
    __tablename__ = "expert_models"

    model_type = Column(String(50), nullable=False, index=True)
    parameters = Column(JSONB)
    version = Column(String(20), nullable=False, index=True)
    status = Column(String(20), nullable=False, index=True)
    
    # 关联关系
    analyses = relationship("ExpertAnalysis", back_populates="model")

class ExpertAnalysis(Base):
    """专家分析表"""
    __tablename__ = "expert_analysis"

    ai_analysis_id = Column(Integer, ForeignKey("ai_analysis_history.id"), nullable=False, index=True)
    model_id = Column(Integer, ForeignKey("expert_models.id"), nullable=False, index=True)
    analysis_result = Column(JSONB)
    confidence_score = Column(Numeric(5, 2), index=True)
    
    # 关联关系
    ai_analysis = relationship("AIAnalysisHistory", back_populates="expert_analyses")
    model = relationship("ExpertModel", back_populates="analyses") 