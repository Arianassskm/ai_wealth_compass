from sqlalchemy import Column, Integer, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel

class SpendingAdvisor(BaseModel):
    __tablename__ = "spending_advisors"
    
    decision_id = Column(Integer, ForeignKey("spending_decisions.id"))
    
    # 建议生成
    analysis_results = Column(JSON)     # 分析结果
    recommendations = Column(JSON)      # 具体建议
    alternatives = Column(JSON)         # 替代方案
    timing_advice = Column(JSON)        # 时机建议
    
    # 个性化参数
    user_preferences = Column(JSON)     # 用户偏好
    historical_patterns = Column(JSON)  # 历史模式
    context_factors = Column(JSON)      # 情境因素
    
    # 关系
    decision = relationship("SpendingDecision", back_populates="advisor")

    def generate_recommendations(self):
        """生成消费建议"""
        recommendations = {
            'primary_advice': self._generate_primary_advice(),
            'alternative_options': self._generate_alternatives(),
            'timing_suggestions': self._generate_timing_advice(),
            'financial_impact': self._analyze_financial_impact(),
            'behavioral_insights': self._generate_behavioral_insights()
        }
        
        self.recommendations = recommendations
        return recommendations