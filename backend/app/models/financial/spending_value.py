from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey
from sqlalchemy.orm import relationship
from ..base.base_model import BaseModel

class SpendingValue(BaseModel):
    __tablename__ = "spending_values"
    
    decision_id = Column(Integer, ForeignKey("spending_decisions.id"))
    
    # 价值评估指标
    necessity_score = Column(Float)      # 必要性评分
    satisfaction_score = Column(Float)   # 满足度评分
    longevity_score = Column(Float)      # 持久性评分
    value_score = Column(Float)          # 性价比评分
    
    # 详细分析
    value_analysis = Column(JSON)        # 价值分析详情
    usage_projection = Column(JSON)      # 使用预期
    benefit_duration = Column(JSON)      # 收益持续时间
    
    # 个性化因素
    personal_factors = Column(JSON)      # 个人因素影响
    lifestyle_alignment = Column(JSON)   # 生活方式匹配度
    
    # 关系
    decision = relationship("SpendingDecision", back_populates="value_assessment")

    def calculate_value_metrics(self):
        """计算价值指标"""
        metrics = {
            'daily_value': self.decision.amount / 30,  # 日均价值
            'value_duration': {
                'short_term': self.calculate_short_term_value(),
                'long_term': self.calculate_long_term_value()
            },
            'quality_of_life_impact': self.calculate_qol_impact(),
            'financial_efficiency': self.calculate_efficiency()
        }
        
        self.value_analysis = metrics
        return metrics