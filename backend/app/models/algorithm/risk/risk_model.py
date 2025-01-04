from sqlalchemy import Column, Integer, Float, String, JSON, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ...base.base_model import BaseModel
import enum

class RiskLevel(str, enum.Enum):
    CONSERVATIVE = "conservative"
    MODERATE_CONSERVATIVE = "moderate_conservative"
    MODERATE = "moderate"
    MODERATE_AGGRESSIVE = "moderate_aggressive"
    AGGRESSIVE = "aggressive"

class RiskAssessment(BaseModel):
    __tablename__ = "risk_assessments"
    
    user_profile_id = Column(Integer, ForeignKey("user_profiles.id"))
    
    # 风险评分
    overall_risk_score = Column(Float)
    risk_level = Column(SQLEnum(RiskLevel))
    
    # 各维度风险
    income_risk = Column(Float)
    expense_risk = Column(Float)
    investment_risk = Column(Float)
    life_event_risk = Column(Float)
    market_risk = Column(Float)
    
    # 风险容忍度
    risk_tolerance = Column(Float)
    risk_capacity = Column(Float)
    risk_preference = Column(JSON)
    
    # 评估元数据
    assessment_factors = Column(JSON)
    confidence_level = Column(Float)
    
    # 关系
    profile = relationship("UserProfile", back_populates="risk_assessments")
    risk_factors = relationship("RiskFactor", back_populates="assessment")

    def calculate_risk_score(self):
        """计算综合风险分数"""
        weights = {
            'income_risk': 0.25,
            'expense_risk': 0.20,
            'investment_risk': 0.25,
            'life_event_risk': 0.15,
            'market_risk': 0.15
        }
        
        risks = [
            self.income_risk * weights['income_risk'],
            self.expense_risk * weights['expense_risk'],
            self.investment_risk * weights['investment_risk'],
            self.life_event_risk * weights['life_event_risk'],
            self.market_risk * weights['market_risk']
        ]
        
        if all(risk is not None for risk in risks):
            self.overall_risk_score = sum(risks)
            self._update_risk_level()
            
    def _update_risk_level(self):
        """更新风险等级"""
        if self.overall_risk_score is None:
            return
            
        if self.overall_risk_score < 0.2:
            self.risk_level = RiskLevel.CONSERVATIVE
        elif self.overall_risk_score < 0.4:
            self.risk_level = RiskLevel.MODERATE_CONSERVATIVE
        elif self.overall_risk_score < 0.6:
            self.risk_level = RiskLevel.MODERATE
        elif self.overall_risk_score < 0.8:
            self.risk_level = RiskLevel.MODERATE_AGGRESSIVE
        else:
            self.risk_level = RiskLevel.AGGRESSIVE